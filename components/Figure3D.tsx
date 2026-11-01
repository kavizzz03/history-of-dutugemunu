"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import type { AvatarCfg, Character, Group } from "@/lib/characters";

/* ───────── small helpers ───────── */
export const shade = (hex: string, k: number) => {
  const c = new THREE.Color(hex);
  c.multiplyScalar(k);
  return `#${c.getHexString()}`;
};
export const STEEL = "#b7bec9";
export const GOLD = "#e3b04b";

export function Mat({ c, m = 0, r = 0.75, e, ei = 0 }: { c: string; m?: number; r?: number; e?: string; ei?: number }) {
  return <meshStandardMaterial color={c} metalness={m} roughness={r} emissive={e ?? "#000000"} emissiveIntensity={ei} />;
}

export const GROUP_COLOR: Record<Group, string> = {
  royal: "#e3b04b",
  giant: "#c0773a",
  foe: "#3fa6b5",
  companion: "#9aa3b2",
};

/* ───────── an arm: shoulder → upper arm → bent forearm → hand (+ whatever is held) ───────── */
function Arm({
  s, bw, skin, sleeve, pad, bend, bangle, children,
}: {
  s: 1 | -1; bw: number; skin: string; sleeve: string; pad?: string; bend: number; bangle?: string; children?: ReactNode;
}) {
  return (
    <group position={[s * (0.25 * bw + 0.1), 1.43, 0]} rotation={[0, 0, -s * 0.14]}>
      <mesh>
        <sphereGeometry args={[0.1, 14, 10]} />
        <Mat c={sleeve} />
      </mesh>
      {pad && (
        <mesh position={[s * 0.025, 0.025, 0]} scale={[1.15, 0.85, 1.1]}>
          <sphereGeometry args={[0.145, 14, 10]} />
          <Mat c={pad} m={0.65} r={0.3} />
        </mesh>
      )}
      <mesh position={[0, -0.15, 0]}>
        <capsuleGeometry args={[0.062, 0.2, 4, 10]} />
        <Mat c={sleeve} />
      </mesh>
      <group position={[0, -0.3, 0]} rotation={[-bend, 0, 0]}>
        <mesh position={[0, -0.14, 0]}>
          <capsuleGeometry args={[0.05, 0.18, 4, 10]} />
          <Mat c={skin} />
        </mesh>
        {bangle && (
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.055, 0.012, 6, 14]} />
            <Mat c={bangle} m={0.8} r={0.25} />
          </mesh>
        )}
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.057, 12, 10]} />
          <Mat c={skin} />
        </mesh>
        {/* held items live in a frame whose y-axis points straight up in the world */}
        <group position={[0, -0.3, 0]} rotation={[bend, 0, 0]}>
          {children}
        </group>
      </group>
    </group>
  );
}

/* ───────── weapons ───────── */
export function Spear({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 2.1, 8]} />
        <Mat c="#6b4a2a" r={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.04, 0.22, 8]} />
        <Mat c={STEEL} m={0.8} r={0.25} />
      </mesh>
      <mesh position={[0, 1.36, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 10]} />
        <Mat c={accent} m={0.7} r={0.3} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <Mat c="#a51f2d" />
      </mesh>
    </group>
  );
}
export function Sword({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.0, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.16, 8]} />
        <Mat c="#3a2a1c" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.2, 0.03, 0.04]} />
        <Mat c={accent} m={0.8} r={0.25} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.055, 0.8, 0.012]} />
        <Mat c={STEEL} m={0.9} r={0.2} />
      </mesh>
      <mesh position={[0, 0.93, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.039, 0.039, 0.012]} />
        <Mat c={STEEL} m={0.9} r={0.2} />
      </mesh>
      <mesh position={[0, -0.09, 0]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <Mat c={accent} m={0.8} r={0.25} />
      </mesh>
    </group>
  );
}
export function Mace({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 1.0, 8]} />
        <Mat c="#5b3b24" />
      </mesh>
      <mesh position={[0, 0.88, 0]}>
        <sphereGeometry args={[0.12, 14, 10]} />
        <Mat c="#6b7280" m={0.8} r={0.35} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.12, 0.88, Math.sin(a) * 0.12]} rotation={[Math.sin(a) * Math.PI / 2, 0, -Math.cos(a) * Math.PI / 2]}>
            <coneGeometry args={[0.03, 0.08, 6]} />
            <Mat c={accent} m={0.7} r={0.3} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.98, 0]}>
        <coneGeometry args={[0.03, 0.1, 6]} />
        <Mat c={accent} m={0.7} r={0.3} />
      </mesh>
    </group>
  );
}
export function Club({ accent }: { accent: string }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.03, 1.1, 10]} />
        <Mat c="#6b4a2a" r={0.9} />
      </mesh>
      {[0.78, 0.92].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.098 - (1.05 - y) * 0.0, 0.012, 6, 14]} />
          <Mat c={accent} m={0.7} r={0.35} />
        </mesh>
      ))}
    </group>
  );
}
export function Shield({ accent, outfit }: { accent: string; outfit: string }) {
  return (
    <group position={[0, 0.2, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <cylinderGeometry args={[0.31, 0.31, 0.05, 28]} />
        <Mat c={shade(outfit, 0.9)} r={0.5} />
      </mesh>
      <mesh position={[0, 0.026, 0]}>
        <torusGeometry args={[0.3, 0.025, 8, 28]} />
        <Mat c={accent} m={0.8} r={0.25} />
      </mesh>
      <mesh position={[0, 0.045, 0]}>
        <sphereGeometry args={[0.085, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Mat c={accent} m={0.85} r={0.2} />
      </mesh>
    </group>
  );
}
export function Bow() {
  return (
    <group rotation={[0, -Math.PI / 2, 0]} position={[0, 0.25, 0.04]}>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.55, 0.018, 8, 28, Math.PI]} />
        <Mat c="#6b4a2a" r={0.7} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.006, 1.1, 0.006]} />
        <Mat c="#e8e0c9" />
      </mesh>
    </group>
  );
}

/* ───────── headgear ───────── */
export function Headgear({ cfg, hair, outfit, accent }: { cfg: AvatarCfg; hair: string; outfit: string; accent: string }) {
  const h = cfg.head;
  if (h === "crown") {
    return (
      <group position={[0, 1.93, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.15, 0.1, 20]} />
          <Mat c={GOLD} m={0.9} r={0.2} />
        </mesh>
        {Array.from({ length: 7 }).map((_, i) => {
          const a = (i / 7) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.15, 0.1, Math.sin(a) * 0.15]}>
              <coneGeometry args={[0.032, 0.12, 6]} />
              <Mat c={GOLD} m={0.9} r={0.2} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.0, 0.16]}>
          <sphereGeometry args={[0.028, 10, 8]} />
          <Mat c="#d6283a" m={0.3} r={0.2} e="#ff3a4a" ei={0.5} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.1, 0.0, 0.12]}>
            <sphereGeometry args={[0.02, 8, 6]} />
            <Mat c="#2a6ad6" m={0.3} r={0.2} e="#3a7aff" ei={0.4} />
          </mesh>
        ))}
      </group>
    );
  }
  if (h === "helmet") {
    return (
      <group position={[0, 1.78, 0]}>
        <mesh scale={[1, 1.02, 1.04]}>
          <sphereGeometry args={[0.195, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <Mat c={STEEL} m={0.85} r={0.28} />
        </mesh>
        <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.03, 1]}>
          <torusGeometry args={[0.185, 0.018, 8, 26]} />
          <Mat c={accent} m={0.85} r={0.25} />
        </mesh>
        <mesh position={[0, 0.01, 0.19]}>
          <boxGeometry args={[0.03, 0.15, 0.025]} />
          <Mat c={STEEL} m={0.85} r={0.28} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <coneGeometry args={[0.035, 0.12, 8]} />
          <Mat c={outfit} r={0.6} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.18, -0.06, 0.02]} scale={[0.4, 1, 0.9]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <Mat c={STEEL} m={0.85} r={0.28} />
          </mesh>
        ))}
      </group>
    );
  }
  if (h === "turban" || h === "royalturban") {
    const royal = h === "royalturban";
    const s = royal ? 1.12 : 1;
    return (
      <group position={[0, 1.88, 0]} scale={s}>
        {[0, 0.05, 0.1].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, i * 0.5, 0.05 * (i - 1)]} scale={[1.02 - i * 0.07, 0.5, 1 - i * 0.07]}>
            <torusGeometry args={[0.15, 0.05, 10, 24]} />
            <Mat c={i === 1 ? accent : outfit} r={0.85} />
          </mesh>
        ))}
        <mesh position={[0, 0.1, 0]} scale={[1, 0.6, 1]}>
          <sphereGeometry args={[0.13, 14, 10]} />
          <Mat c={outfit} r={0.85} />
        </mesh>
        <mesh position={[0, 0.02, 0.17]}>
          <sphereGeometry args={[0.032, 10, 8]} />
          <Mat c="#d6283a" m={0.3} r={0.2} e="#ff3a4a" ei={0.5} />
        </mesh>
        {royal && (
          <mesh position={[0.06, 0.2, 0.08]} rotation={[0.2, 0, -0.5]}>
            <coneGeometry args={[0.03, 0.26, 6]} />
            <Mat c="#f6f2e4" r={0.8} />
          </mesh>
        )}
      </group>
    );
  }
  if (h === "headdress") {
    return (
      <group position={[0, 1.8, 0]}>
        <mesh position={[0, 0.07, 0]} rotation={[Math.PI / 2 - 0.25, 0, 0]}>
          <torusGeometry args={[0.165, 0.014, 8, 26, Math.PI * 1.15]} />
          <Mat c={GOLD} m={0.9} r={0.2} />
        </mesh>
        <mesh position={[0, 0.12, 0.15]}>
          <octahedronGeometry args={[0.035, 0]} />
          <Mat c="#d6283a" m={0.3} r={0.2} e="#ff3a4a" ei={0.5} />
        </mesh>
        {[-0.06, 0.06].map((x) => (
          <mesh key={x} position={[x, 0.1, 0.155]}>
            <sphereGeometry args={[0.014, 8, 6]} />
            <Mat c="#f6edd2" m={0.3} r={0.3} />
          </mesh>
        ))}
        <mesh position={[0.1, 0.17, -0.02]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <Mat c="#f2c14e" m={0.2} r={0.5} />
        </mesh>
      </group>
    );
  }
  if (h === "topknot") {
    return (
      <group position={[0, 1.78, 0]}>
        <mesh position={[0, 0.17, -0.01]}>
          <sphereGeometry args={[0.065, 12, 10]} />
          <Mat c={hair} r={0.9} />
        </mesh>
        <mesh position={[0, 0.115, -0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.04, 0.012, 6, 14]} />
          <Mat c={accent} m={0.8} r={0.3} />
        </mesh>
        <mesh position={[0, 0.17, 0]} scale={[1, 1, 1]}>
          <sphereGeometry args={[0.001, 4, 4]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      </group>
    );
  }
  return null; // bald
}


/* ───────── face, hair, beard and headgear only — for skinned bodies that already have a skull.
   Authored at the toy figure's head scale (centre y = 1.76); <AnimatedPerson> rescales it. ───────── */
export function HeadParts({ cfg }: { cfg: AvatarCfg }) {
  const female = !!cfg.female;
  const old = cfg.age === "old";
  const hair = old ? "#cfcfd2" : cfg.hair;
  const skin = cfg.skin;
  return (
    <group>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.16, 1.76, -0.005]} scale={[0.5, 1, 0.8]}>
          <sphereGeometry args={[0.04, 10, 8]} />
          <Mat c={shade(skin, 0.95)} />
        </mesh>
      ))}
      {female &&
        [-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.165, 1.7, 0]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <Mat c={GOLD} m={0.9} r={0.2} />
          </mesh>
        ))}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.065, 1.79, 0.148]} scale={[1, 0.9, 0.4]}>
            <sphereGeometry args={[0.027, 12, 10]} />
            <meshStandardMaterial color="#f8f4ea" roughness={0.4} />
          </mesh>
          <mesh position={[s * 0.065, 1.79, 0.157]}>
            <sphereGeometry args={[0.015, 10, 8]} />
            <meshStandardMaterial color="#1b1209" roughness={0.3} />
          </mesh>
          <mesh position={[s * 0.065, 1.835, 0.15]} rotation={[0, 0, s * (old ? -0.12 : 0.12)]}>
            <boxGeometry args={[0.075, female ? 0.01 : 0.02, 0.016]} />
            <Mat c={old ? "#bdbdbd" : hair} r={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.74, 0.165]} scale={[1, 1.15, 1]}>
        <sphereGeometry args={[0.028, 10, 8]} />
        <Mat c={shade(skin, 0.92)} />
      </mesh>
      <mesh position={[0, 1.685, 0.158]}>
        <boxGeometry args={[0.07, female ? 0.016 : 0.01, 0.012]} />
        <Mat c={female ? "#c24a6b" : "#6b2a22"} r={0.5} />
      </mesh>
      {cfg.scar && (
        <mesh position={[0.075, 1.77, 0.15]} rotation={[0, 0, -0.35]}>
          <boxGeometry args={[0.008, 0.11, 0.01]} />
          <Mat c="#8b3a2a" />
        </mesh>
      )}
      {(cfg.beard === "mustache" || cfg.beard === "short" || cfg.beard === "full") &&
        [-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.04, 1.707, 0.162]} rotation={[0, 0, s * -0.25]}>
            <boxGeometry args={[0.07, 0.02, 0.022]} />
            <Mat c={hair} r={0.9} />
          </mesh>
        ))}
      {(cfg.beard === "short" || cfg.beard === "full") && (
        <mesh position={[0, 1.7, 0.02]} scale={[cfg.beard === "full" ? 1.02 : 0.95, cfg.beard === "full" ? 1.25 : 0.8, cfg.beard === "full" ? 0.98 : 0.93]}>
          <sphereGeometry args={[0.172, 20, 14, 0, Math.PI * 2, Math.PI / 2 + 0.12, Math.PI / 2 - 0.12]} />
          <Mat c={hair} r={0.95} />
        </mesh>
      )}
      {cfg.head !== "bald" && cfg.head !== "helmet" && (
        <mesh position={[0, 1.775, -0.012]} rotation={[-0.3, 0, 0]} scale={[1, 1.04, 1.02]}>
          <sphereGeometry args={[0.178, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
          <Mat c={hair} r={0.95} />
        </mesh>
      )}
      {female && (
        <group>
          <mesh position={[0, 1.55, -0.1]} scale={[1, 1, 0.8]}>
            <capsuleGeometry args={[0.125, 0.4, 6, 12]} />
            <Mat c={hair} r={0.9} />
          </mesh>
          <mesh position={[0, 1.76, -0.06]} scale={[1.05, 1.15, 1]}>
            <sphereGeometry args={[0.18, 16, 12]} />
            <Mat c={hair} r={0.9} />
          </mesh>
        </group>
      )}
      <Headgear cfg={cfg} hair={hair} outfit={cfg.outfit} accent={cfg.accent} />
    </group>
  );
}

/* ───────── a human figure, feet at y = 0, facing +z ───────── */
export function Person({ cfg }: { cfg: AvatarCfg }) {
  const female = !!cfg.female;
  const monk = !!cfg.monkSoon;
  const b = cfg.build ?? 1;
  const bw = female ? 0.86 : b;
  const old = cfg.age === "old";
  const hair = old ? "#cfcfd2" : cfg.hair;
  const skin = cfg.skin;
  const outfit = cfg.outfit;
  const accent = cfg.accent;
  const armored = cfg.head === "helmet" || cfg.head === "topknot" || (cfg.head === "bald" && !monk && !female);
  const bareChest = cfg.head === "bald" && !monk && !female;
  const bareArms = female || monk || cfg.head === "bald" || cfg.head === "topknot";
  const sleeve = bareArms ? skin : outfit;
  const legCol = shade(outfit, 0.55);
  const royalCape = cfg.head === "crown" || cfg.head === "royalturban";
  const w = cfg.weapon ?? "none";
  const rightBend = w === "spear" || w === "sword" || w === "mace" || w === "club" ? 0.95 : female ? 0.5 : 0.18;
  const leftBend = w === "shield" ? 1.0 : w === "bow" ? 1.25 : female ? 0.5 : 0.18;

  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const cape = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (torso.current) torso.current.scale.set(1, 1 + Math.sin(t * 1.8) * 0.009, 1);
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.55) * 0.08;
      head.current.rotation.x = Math.sin(t * 0.9) * 0.02;
    }
    if (cape.current) cape.current.rotation.x = 0.08 + Math.sin(t * 1.3) * 0.03;
  });

  return (
    <group>
      {/* boots */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.1, 0.06, 0.04]}>
          <boxGeometry args={[0.14, 0.12, 0.3]} />
          <Mat c="#3a2a1c" r={0.85} />
        </mesh>
      ))}
      {/* legs */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.1, 0.46, 0]}>
          <cylinderGeometry args={[0.062, 0.075, 0.74, 10]} />
          <Mat c={female ? outfit : bareArms || w === "none" ? skin : legCol} />
        </mesh>
      ))}
      {/* lower garment */}
      {female ? (
        <group>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.2, 0.38, 0.92, 22]} />
            <Mat c={outfit} r={0.8} />
          </mesh>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.38, 0.02, 8, 28]} />
            <Mat c={accent} m={0.7} r={0.3} />
          </mesh>
        </group>
      ) : (
        <group>
          <mesh position={[0, 0.74, 0]}>
            <cylinderGeometry args={[0.2 * Math.min(bw, 1.2), 0.3 * Math.min(bw, 1.2), 0.5, 22]} />
            <Mat c={outfit} r={0.8} />
          </mesh>
          <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3 * Math.min(bw, 1.2), 0.016, 8, 28]} />
            <Mat c={accent} m={0.7} r={0.3} />
          </mesh>
        </group>
      )}
      {/* cape for kings */}
      {royalCape && (
        <mesh ref={cape} position={[0, 1.0, -0.2]} rotation={[0.08, 0, 0]}>
          <planeGeometry args={[0.7 * bw, 1.05]} />
          <meshStandardMaterial color={shade(outfit, 0.75)} side={THREE.DoubleSide} roughness={0.85} />
        </mesh>
      )}

      <group ref={torso}>
        {/* chest */}
        <mesh position={[0, 1.18, 0]} scale={[1.18 * bw, 1, 0.76]}>
          <capsuleGeometry args={[0.2, 0.4, 6, 14]} />
          <Mat c={bareChest ? skin : outfit} r={0.75} />
        </mesh>
        {/* breastplate */}
        {armored && !bareChest && (
          <mesh position={[0, 1.26, 0.08]} scale={[1.1 * bw, 0.95, 0.5]}>
            <capsuleGeometry args={[0.2, 0.22, 6, 14]} />
            <Mat c={accent} m={0.7} r={0.3} />
          </mesh>
        )}
        {/* sash / monk's robe drape */}
        <mesh position={[0, 1.24, 0.01]} rotation={[0, 0, monk ? 0.85 : -0.85]} scale={[1, 1, 1]}>
          <boxGeometry args={[monk ? 0.2 : 0.075, 0.56 * Math.min(bw, 1.2), 0.335]} />
          <Mat c={monk ? cfg.outfit : accent} m={monk ? 0 : 0.35} r={0.7} />
        </mesh>
        {/* belt */}
        <mesh position={[0, 0.98, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.05 * Math.min(bw, 1.2), 0.78, 1]}>
          <torusGeometry args={[0.235, 0.04, 8, 28]} />
          <Mat c={accent} m={0.7} r={0.3} />
        </mesh>
        <mesh position={[0, 0.98, 0.19 * Math.min(0.78 + bw * 0.2, 1.1)]}>
          <sphereGeometry args={[0.04, 10, 8]} />
          <Mat c={GOLD} m={0.9} r={0.2} />
        </mesh>
      </group>

      {/* arms (right = −x; weapon hand) */}
      <Arm s={-1} bw={bw} skin={skin} sleeve={sleeve} pad={armored && !bareChest ? accent : undefined} bend={rightBend} bangle={female ? GOLD : undefined}>
        {w === "spear" && <Spear accent={accent} />}
        {w === "sword" && <Sword accent={accent} />}
        {w === "mace" && <Mace accent={accent} />}
        {w === "club" && <Club accent={accent} />}
      </Arm>
      <Arm s={1} bw={bw} skin={skin} sleeve={sleeve} pad={armored && !bareChest ? accent : undefined} bend={leftBend} bangle={female ? GOLD : undefined}>
        {w === "shield" && <Shield accent={accent} outfit={outfit} />}
        {w === "bow" && <Bow />}
      </Arm>

      {/* neck + head */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.14, 12]} />
        <Mat c={shade(skin, 0.9)} />
      </mesh>
      <group ref={head}>
        <mesh position={[0, 1.76, 0]} scale={[0.93, 1.06, 0.99]}>
          <sphereGeometry args={[0.17, 24, 18]} />
          <Mat c={skin} r={0.7} />
        </mesh>
        {/* ears */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.16, 1.76, -0.005]} scale={[0.5, 1, 0.8]}>
            <sphereGeometry args={[0.04, 10, 8]} />
            <Mat c={shade(skin, 0.95)} />
          </mesh>
        ))}
        {female &&
          [-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.165, 1.7, 0]}>
              <sphereGeometry args={[0.018, 8, 6]} />
              <Mat c={GOLD} m={0.9} r={0.2} />
            </mesh>
          ))}
        {/* eyes + brows */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <mesh position={[s * 0.065, 1.79, 0.148]} scale={[1, 0.9, 0.4]}>
              <sphereGeometry args={[0.027, 12, 10]} />
              <meshStandardMaterial color="#f8f4ea" roughness={0.4} />
            </mesh>
            <mesh position={[s * 0.065, 1.79, 0.157]}>
              <sphereGeometry args={[0.015, 10, 8]} />
              <meshStandardMaterial color="#1b1209" roughness={0.3} />
            </mesh>
            <mesh position={[s * 0.065, 1.835, 0.15]} rotation={[0, 0, s * (cfg.age === "old" ? -0.12 : 0.12)]}>
              <boxGeometry args={[0.075, female ? 0.01 : 0.02, 0.016]} />
              <Mat c={old ? "#bdbdbd" : hair} r={0.9} />
            </mesh>
          </group>
        ))}
        {/* nose + mouth */}
        <mesh position={[0, 1.74, 0.165]} scale={[1, 1.15, 1]}>
          <sphereGeometry args={[0.028, 10, 8]} />
          <Mat c={shade(skin, 0.92)} />
        </mesh>
        <mesh position={[0, 1.685, 0.158]}>
          <boxGeometry args={[0.07, female ? 0.016 : 0.01, 0.012]} />
          <Mat c={female ? "#c24a6b" : "#6b2a22"} r={0.5} />
        </mesh>
        {cfg.scar && (
          <mesh position={[0.075, 1.77, 0.15]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.008, 0.11, 0.01]} />
            <Mat c="#8b3a2a" />
          </mesh>
        )}
        {/* facial hair */}
        {(cfg.beard === "mustache" || cfg.beard === "short" || cfg.beard === "full") && (
          <group>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.04, 1.707, 0.162]} rotation={[0, 0, s * -0.25]}>
                <boxGeometry args={[0.07, 0.02, 0.022]} />
                <Mat c={hair} r={0.9} />
              </mesh>
            ))}
          </group>
        )}
        {(cfg.beard === "short" || cfg.beard === "full") && (
          <mesh position={[0, 1.7, 0.02]} scale={[cfg.beard === "full" ? 1.02 : 0.95, cfg.beard === "full" ? 1.25 : 0.8, cfg.beard === "full" ? 0.98 : 0.93]}>
            <sphereGeometry args={[0.172, 20, 14, 0, Math.PI * 2, Math.PI / 2 + 0.12, Math.PI / 2 - 0.12]} />
            <Mat c={hair} r={0.95} />
          </mesh>
        )}
        {/* hair */}
        {cfg.head !== "bald" && cfg.head !== "helmet" && (
          <mesh position={[0, 1.775, -0.012]} rotation={[-0.3, 0, 0]} scale={[1, 1.04, 1.02]}>
            <sphereGeometry args={[0.178, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
            <Mat c={hair} r={0.95} />
          </mesh>
        )}
        {female && (
          <group>
            <mesh position={[0, 1.55, -0.1]} scale={[1, 1, 0.8]}>
              <capsuleGeometry args={[0.125, 0.4, 6, 12]} />
              <Mat c={hair} r={0.9} />
            </mesh>
            <mesh position={[0, 1.76, -0.06]} scale={[1.05, 1.15, 1]}>
              <sphereGeometry args={[0.18, 16, 12]} />
              <Mat c={hair} r={0.9} />
            </mesh>
          </group>
        )}
        <Headgear cfg={cfg} hair={hair} outfit={outfit} accent={accent} />
      </group>
    </group>
  );
}

/* ───────── Kandula, the war elephant, facing +z ───────── */
export function ElephantFigure() {
  const skin = "#7b8190";
  const dark = "#5c6270";
  const ivory = "#f6edd2";
  const trunk = useRef<THREE.Group>(null);
  const earL = useRef<THREE.Mesh>(null);
  const earR = useRef<THREE.Mesh>(null);
  const body = useRef<THREE.Group>(null);

  const trunkSpheres = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 1.4, 1.38),
      new THREE.Vector3(0, 1.0, 1.72),
      new THREE.Vector3(0, 0.55, 1.88),
      new THREE.Vector3(0, 0.22, 1.8),
      new THREE.Vector3(0, 0.2, 1.62),
    ]);
    return Array.from({ length: 14 }, (_, i) => {
      const u = i / 13;
      const p = curve.getPoint(u);
      return { p, r: 0.19 - u * 0.1 };
    });
  }, []);
  const tuskGeo = useMemo(() => {
    const mk = (s: number) => {
      const c = new THREE.CatmullRomCurve3([
        new THREE.Vector3(s * 0.22, 1.32, 1.36),
        new THREE.Vector3(s * 0.3, 1.04, 1.72),
        new THREE.Vector3(s * 0.34, 1.0, 2.1),
        new THREE.Vector3(s * 0.27, 1.22, 2.42),
      ]);
      return new THREE.TubeGeometry(c, 20, 0.055, 8, false);
    };
    return [mk(-1), mk(1)];
  }, []);
  const tailGeo = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.45, -1.0), new THREE.Vector3(0, 1.1, -1.18), new THREE.Vector3(0, 0.7, -1.2)]);
    return new THREE.TubeGeometry(c, 10, 0.03, 6, false);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (trunk.current) {
      trunk.current.rotation.x = Math.sin(t * 1.2) * 0.07;
      trunk.current.rotation.z = Math.sin(t * 0.7) * 0.05;
    }
    if (earL.current) earL.current.rotation.y = -0.45 - Math.sin(t * 2.4) * 0.12;
    if (earR.current) earR.current.rotation.y = 0.45 + Math.sin(t * 2.4) * 0.12;
    if (body.current) body.current.position.y = Math.sin(t * 1.5) * 0.012;
  });

  return (
    <group ref={body}>
      {/* legs */}
      {[
        [-0.4, 0.68],
        [0.4, 0.68],
        [-0.4, -0.68],
        [0.4, -0.68],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.2, 0.22, 1.0, 14]} />
            <Mat c={i % 2 ? skin : dark} r={0.85} />
          </mesh>
          <mesh position={[0, 0.04, 0.02]}>
            <cylinderGeometry args={[0.235, 0.25, 0.1, 14]} />
            <Mat c="#2a2a30" r={0.9} />
          </mesh>
          {[-0.12, 0, 0.12].map((nx) => (
            <mesh key={nx} position={[nx, 0.06, 0.24]} scale={[1, 0.7, 0.6]}>
              <sphereGeometry args={[0.05, 8, 6]} />
              <Mat c={ivory} r={0.6} />
            </mesh>
          ))}
        </group>
      ))}
      {/* body */}
      <mesh position={[0, 1.38, 0]} scale={[0.66, 0.64, 1.08]}>
        <sphereGeometry args={[1, 28, 20]} />
        <Mat c={skin} r={0.88} />
      </mesh>
      {/* caparison */}
      <mesh position={[0, 1.38, 0]} scale={[0.69, 0.67, 1.1]}>
        <sphereGeometry args={[1, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#a51f2d" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.38, 0]} scale={[0.695, 0.675, 1.105]}>
        <sphereGeometry args={[1, 28, 4, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.045]} />
        <Mat c={GOLD} m={0.7} r={0.3} />
      </mesh>
      <mesh position={[0, 2.03, 0.05]}>
        <cylinderGeometry args={[0.3, 0.32, 0.06, 20]} />
        <Mat c={GOLD} m={0.8} r={0.25} />
      </mesh>
      <mesh position={[0, 1.99, -0.9]} scale={[1, 1, 0.5]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <Mat c="#a51f2d" />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.58, 1.02]} scale={[0.94, 1.02, 1]}>
        <sphereGeometry args={[0.52, 24, 18]} />
        <Mat c={skin} r={0.88} />
      </mesh>
      <mesh position={[0, 1.95, 1.3]} rotation={[0.55, 0, 0]}>
        <planeGeometry args={[0.36, 0.34]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.93, 1.38]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <Mat c="#a51f2d" e="#ff3a4a" ei={0.4} />
      </mesh>
      {/* eyes */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.3, 1.66, 1.33]}>
          <sphereGeometry args={[0.04, 10, 8]} />
          <meshStandardMaterial color="#14110e" roughness={0.3} />
        </mesh>
      ))}
      {/* ears */}
      <mesh ref={earL} position={[-0.5, 1.62, 0.8]} rotation={[0, -0.45, 0]} scale={[0.07, 0.55, 0.5]}>
        <sphereGeometry args={[1, 18, 14]} />
        <Mat c="#8d8696" r={0.9} />
      </mesh>
      <mesh ref={earR} position={[0.5, 1.62, 0.8]} rotation={[0, 0.45, 0]} scale={[0.07, 0.55, 0.5]}>
        <sphereGeometry args={[1, 18, 14]} />
        <Mat c="#8d8696" r={0.9} />
      </mesh>
      {/* trunk */}
      <group ref={trunk} position={[0, 1.4, 1.38]}>
        <group position={[0, -1.4, -1.38]}>
          {trunkSpheres.map((s, i) => (
            <mesh key={i} position={s.p}>
              <sphereGeometry args={[s.r, 12, 10]} />
              <Mat c={skin} r={0.88} />
            </mesh>
          ))}
        </group>
      </group>
      {/* tusks */}
      {tuskGeo.map((g, i) => (
        <mesh key={i} geometry={g}>
          <Mat c={ivory} r={0.45} />
        </mesh>
      ))}
      {/* tail */}
      <mesh geometry={tailGeo}>
        <Mat c={dark} />
      </mesh>
    </group>
  );
}

/* picks the right figure for a character */
export function Figure({ character }: { character: Character }) {
  return character.id === "kandula" ? <ElephantFigure /> : <Person cfg={character.avatar} />;
}

/** the figure's footprint scale so the elephant fits the same stage as people */
export const figureScale = (c: Character) => (c.id === "kandula" ? 0.55 : 1);

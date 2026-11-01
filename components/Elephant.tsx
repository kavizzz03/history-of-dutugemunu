"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* Kandula, the war tusker — an articulated, animated elephant.
   • breathing flanks, slow head nod, blinking eyes
   • trunk is a 10-joint chain that sways like a wave
   • ears flap, tail swishes, caparison drapes sway
   • legs march in diagonal pairs (a calm "walking in place" on the plinth)
   • skin has a procedural wrinkle bump-map */

const SKIN = "#7d8392";
const SKIN_D = "#636a78";
const IVORY = "#f3e8c8";
const GOLD = "#e3b04b";
const RED0 = "#a51f2d";

function skinTexture() {
  if (typeof document === "undefined") return null;
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, 256, 256);
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 520; i++) {
    const x = rnd() * 256, y = rnd() * 256, l = 10 + rnd() * 46, a = (rnd() - 0.5) * 0.9;
    g.strokeStyle = rnd() > 0.5 ? "rgba(30,30,30,0.5)" : "rgba(235,235,235,0.28)";
    g.lineWidth = 0.8 + rnd() * 1.6;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + Math.cos(a) * l * 0.5, y + 4 + Math.sin(a) * 6, x + Math.cos(a) * l, y + Math.sin(a) * l * 0.4);
    g.stroke();
  }
  for (let i = 0; i < 700; i++) {
    g.fillStyle = `rgba(${rnd() > 0.5 ? "20,20,20" : "240,240,240"},0.09)`;
    g.beginPath();
    g.arc(rnd() * 256, rnd() * 256, 1 + rnd() * 3.5, 0, 6.3);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
  return t;
}

const TRUNK = Array.from({ length: 10 }, (_, i) => ({ r: 0.215 - i * 0.017, len: 0.19 }));

export function Kandula({ cloth = RED0, pace }: { cloth?: string; pace?: React.MutableRefObject<number> }) {
  const RED = cloth;
  const clk = useRef(0);
  const bump = useMemo(() => skinTexture(), []);
  const skin = useMemo(
    () => new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.93, bumpMap: bump ?? undefined, bumpScale: 2.4 }),
    [bump]
  );
  const skinD = useMemo(
    () => new THREE.MeshStandardMaterial({ color: SKIN_D, roughness: 0.95, bumpMap: bump ?? undefined, bumpScale: 2 }),
    [bump]
  );

  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const earL = useRef<THREE.Group>(null);
  const earR = useRef<THREE.Group>(null);
  const lids = useRef<THREE.Mesh[]>([]);
  const trunk = useRef<THREE.Group[]>([]);
  const tail = useRef<THREE.Group[]>([]);
  const drape = useRef<THREE.Group[]>([]);
  const hips = useRef<THREE.Group[]>([]);
  const shins = useRef<THREE.Group[]>([]);

  const legs = useMemo(
    () => [
      { x: -0.4, z: 0.62, pair: 0 }, // front left
      { x: 0.4, z: 0.62, pair: 1 }, // front right
      { x: -0.4, z: -0.62, pair: 1 }, // back left
      { x: 0.4, z: -0.62, pair: 0 }, // back right
    ],
    []
  );

  const tusks = useMemo(() => {
    const mk = (s: number) => {
      const c = new THREE.CatmullRomCurve3([
        new THREE.Vector3(s * 0.22, -0.2, 0.4),
        new THREE.Vector3(s * 0.31, -0.5, 0.72),
        new THREE.Vector3(s * 0.35, -0.56, 1.1),
        new THREE.Vector3(s * 0.27, -0.34, 1.46),
      ]);
      const g = new THREE.TubeGeometry(c, 28, 0.06, 10, false);
      return g;
    };
    return [mk(-1), mk(1)];
  }, []);

  useFrame((_, dt) => {
    // own clock so the gait can speed up while the army marches
    clk.current += Math.min(dt, 0.05) * (pace ? 0.4 + pace.current * 2.4 : 1);
    const t = clk.current;
    const breath = Math.sin(t * 1.4);
    if (root.current) {
      root.current.position.y = Math.abs(Math.sin(t * 0.9)) * 0.018 + breath * 0.006;
      root.current.rotation.z = Math.sin(t * 0.9) * 0.012;
    }
    if (torso.current) torso.current.scale.set(0.68 + breath * 0.012, 0.66 + breath * 0.016, 1.12);
    if (head.current) {
      head.current.rotation.x = Math.sin(t * 0.8) * 0.045 + 0.02;
      head.current.rotation.y = Math.sin(t * 0.45) * 0.07;
    }
    if (earL.current) earL.current.rotation.y = -0.55 - (Math.sin(t * 2.3) * 0.5 + 0.5) * 0.28;
    if (earR.current) earR.current.rotation.y = 0.55 + (Math.sin(t * 2.3 + 0.7) * 0.5 + 0.5) * 0.28;
    // blink every ~4s
    const b = (t % 4.2) > 4.05 ? 1 : 0;
    lids.current.forEach((m) => m && (m.scale.y = 0.15 + b * 0.85));
    trunk.current.forEach((g, i) => {
      if (!g) return;
      const k = i / (TRUNK.length - 1);
      const base = i === 0 ? -0.62 : 0.115;
      g.rotation.x = base + Math.sin(t * 1.15 - i * 0.55) * (0.025 + k * 0.07);
      g.rotation.z = Math.sin(t * 0.7 - i * 0.4) * (0.015 + k * 0.06);
    });
    tail.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.x = 0.18 + Math.sin(t * 1.7 - i * 0.6) * 0.14;
      g.rotation.z = Math.sin(t * 1.3 - i * 0.7) * 0.28;
    });
    drape.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.z = (i ? -1 : 1) * (0.06 + Math.sin(t * 1.4 + i) * 0.035);
    });
    // legs: diagonal pairs lift in turn
    const u = Math.sin(t * 1.0);
    legs.forEach((l, i) => {
      const lift = Math.max(0, l.pair === 0 ? u : -u);
      const e = lift * lift * (3 - 2 * lift); // smoothstep
      const h = hips.current[i];
      const s = shins.current[i];
      if (h) h.rotation.x = -e * 0.5 + (l.pair === 0 ? 0.04 : -0.04) * u;
      if (s) s.rotation.x = e * 0.95;
    });
  });

  return (
    <group ref={root}>
      {/* ── torso: barrel, shoulders and haunches ── */}
      <mesh ref={torso} position={[0, 1.38, 0]} scale={[0.68, 0.66, 1.12]} material={skin}>
        <sphereGeometry args={[1, 40, 28]} />
      </mesh>
      <mesh position={[0, 1.5, 0.55]} scale={[0.64, 0.6, 0.55]} material={skin}>
        <sphereGeometry args={[1, 28, 20]} />
      </mesh>
      <mesh position={[0, 1.46, -0.66]} scale={[0.62, 0.64, 0.62]} material={skin}>
        <sphereGeometry args={[1, 28, 20]} />
      </mesh>
      <mesh position={[0, 1.2, -0.05]} scale={[0.6, 0.45, 0.95]} material={skinD}>
        <sphereGeometry args={[1, 24, 16]} />
      </mesh>

      {/* ── caparison (ceremonial cloth) ── */}
      <mesh position={[0, 1.4, 0]} scale={[0.71, 0.69, 1.14]}>
        <sphereGeometry args={[1, 40, 16, 0, Math.PI * 2, 0, Math.PI * 0.46]} />
        <meshStandardMaterial color={RED} roughness={0.78} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.4, 0]} scale={[0.715, 0.695, 1.145]}>
        <sphereGeometry args={[1, 40, 4, 0, Math.PI * 2, Math.PI * 0.46, Math.PI * 0.035]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.28} />
      </mesh>
      {[-1, 1].map((s, i) => (
        <group key={s} position={[s * 0.62, 1.2, 0]} ref={(g) => { if (g) drape.current[i] = g; }}>
          <mesh position={[s * 0.06, -0.3, 0]} rotation={[0, 0, s * 0.08]}>
            <boxGeometry args={[0.03, 0.62, 1.08]} />
            <meshStandardMaterial color={RED} roughness={0.8} />
          </mesh>
          <mesh position={[s * 0.07, -0.62, 0]}>
            <boxGeometry args={[0.04, 0.05, 1.12]} />
            <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.3} />
          </mesh>
          {[-0.45, -0.22, 0, 0.22, 0.45].map((z) => (
            <mesh key={z} position={[s * 0.07, -0.69, z]}>
              <sphereGeometry args={[0.03, 8, 6]} />
              <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, 2.03, 0.05]}>
        <cylinderGeometry args={[0.3, 0.33, 0.06, 28]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.12, 0.05]}>
        <coneGeometry args={[0.1, 0.18, 16]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} />
      </mesh>

      {/* ── head (nods, turns) ── */}
      <group ref={head} position={[0, 1.55, 1.0]}>
        <mesh scale={[0.5, 0.56, 0.55]} material={skin}>
          <sphereGeometry args={[1, 32, 24]} />
        </mesh>
        {/* twin forehead domes */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.15, 0.3, 0.12]} scale={[0.27, 0.27, 0.3]} material={skin}>
            <sphereGeometry args={[1, 20, 16]} />
          </mesh>
        ))}
        <mesh position={[0, -0.12, 0.38]} scale={[0.3, 0.3, 0.26]} material={skin}>
          <sphereGeometry args={[1, 20, 16]} />
        </mesh>
        {/* gold frontlet */}
        <mesh position={[0, 0.34, 0.4]} rotation={[0.7, 0, 0]}>
          <boxGeometry args={[0.34, 0.3, 0.025]} />
          <meshStandardMaterial color={GOLD} metalness={0.45} roughness={0.35} emissive="#7a5410" emissiveIntensity={0.55} />
        </mesh>
        <mesh position={[0, 0.3, 0.5]}>
          <sphereGeometry args={[0.045, 12, 10]} />
          <meshStandardMaterial color={RED} emissive="#ff3a4a" emissiveIntensity={0.45} />
        </mesh>
        {/* eyes with lids */}
        {[-1, 1].map((s, i) => (
          <group key={s} position={[s * 0.34, 0.1, 0.34]}>
            <mesh>
              <sphereGeometry args={[0.04, 12, 10]} />
              <meshStandardMaterial color="#16110d" roughness={0.2} />
            </mesh>
            <mesh position={[s * 0.004, 0.012, 0.012]} scale={[1, 0.15, 1]} ref={(m) => { if (m) lids.current[i] = m; }} material={skin}>
              <sphereGeometry args={[0.052, 12, 10]} />
            </mesh>
          </group>
        ))}
        {/* ears: hinged at the temple so they flap outward */}
        <group ref={earL} position={[-0.38, 0.22, -0.02]}>
          <mesh position={[-0.02, -0.26, -0.22]} scale={[0.035, 0.52, 0.44]} material={skinD}>
            <sphereGeometry args={[1, 24, 18]} />
          </mesh>
        </group>
        <group ref={earR} position={[0.38, 0.22, -0.02]}>
          <mesh position={[0.02, -0.26, -0.22]} scale={[0.035, 0.52, 0.44]} material={skinD}>
            <sphereGeometry args={[1, 24, 18]} />
          </mesh>
        </group>
        {/* tusks */}
        {tusks.map((g, i) => (
          <mesh key={i} geometry={g}>
            <meshStandardMaterial color={IVORY} roughness={0.4} />
          </mesh>
        ))}
        {/* trunk: a chain of joints; each child bends from its parent */}
        <group position={[0, -0.02, 0.5]}>
          <TrunkChain refs={trunk} i={0} skin={skin} />
        </group>
      </group>

      {/* ── legs: thigh + shin, foot with toenails ── */}
      {legs.map((l, i) => (
        <group key={i} position={[l.x, 1.12, l.z]} ref={(g) => { if (g) hips.current[i] = g; }}>
          <mesh position={[0, -0.28, 0]} material={i % 2 ? skin : skinD}>
            <cylinderGeometry args={[0.22, 0.2, 0.62, 18]} />
          </mesh>
          <group position={[0, -0.57, 0]} ref={(g) => { if (g) shins.current[i] = g; }}>
            <mesh position={[0, -0.24, 0]} material={i % 2 ? skin : skinD}>
              <cylinderGeometry args={[0.2, 0.215, 0.5, 18]} />
            </mesh>
            <mesh position={[0, -0.5, 0.02]} material={skinD}>
              <cylinderGeometry args={[0.24, 0.26, 0.1, 18]} />
            </mesh>
            {[-0.12, 0, 0.12].map((nx) => (
              <mesh key={nx} position={[nx, -0.5, 0.25]} scale={[1, 0.7, 0.6]}>
                <sphereGeometry args={[0.052, 10, 8]} />
                <meshStandardMaterial color={IVORY} roughness={0.55} />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* ── tail ── */}
      <group position={[0, 1.5, -1.08]}>
        <TailChain refs={tail} i={0} mat={skinD} />
      </group>
    </group>
  );
}

function TrunkChain({ refs, i, skin }: { refs: React.MutableRefObject<THREE.Group[]>; i: number; skin: THREE.Material }) {
  const s = TRUNK[i];
  return (
    <group ref={(g) => { if (g) refs.current[i] = g; }} rotation={[i === 0 ? -0.62 : 0.115, 0, 0]}>
      <mesh position={[0, -s.len / 2, 0]} material={skin}>
        <cylinderGeometry args={[s.r, s.r + 0.017, s.len + 0.01, 14]} />
      </mesh>
      {i === TRUNK.length - 1 ? (
        <mesh position={[0, -s.len, 0]} scale={[1, 0.8, 1]} material={skin}>
          <sphereGeometry args={[s.r * 0.95, 12, 10]} />
        </mesh>
      ) : (
        <group position={[0, -s.len, 0]}>
          <mesh material={skin}>
            <sphereGeometry args={[s.r - 0.004, 12, 10]} />
          </mesh>
          <TrunkChain refs={refs} i={i + 1} skin={skin} />
        </group>
      )}
    </group>
  );
}

function TailChain({ refs, i, mat }: { refs: React.MutableRefObject<THREE.Group[]>; i: number; mat: THREE.Material }) {
  const len = 0.26;
  return (
    <group ref={(g) => { if (g) refs.current[i] = g; }} rotation={[0.18, 0, 0]}>
      <mesh position={[0, -len / 2, 0]} material={mat}>
        <cylinderGeometry args={[0.035 - i * 0.008, 0.04 - i * 0.008, len, 8]} />
      </mesh>
      {i < 3 ? (
        <group position={[0, -len, 0]}>
          <TailChain refs={refs} i={i + 1} mat={mat} />
        </group>
      ) : (
        <mesh position={[0, -len - 0.04, 0]} scale={[1, 1.6, 1]}>
          <sphereGeometry args={[0.05, 10, 8]} />
          <meshStandardMaterial color="#2a2a30" roughness={0.95} />
        </mesh>
      )}
    </group>
  );
}

"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useLang } from "@/lib/i18n";
import { STAGE_UI } from "@/lib/stage";
import type { Character } from "@/lib/characters";
import { Figure, GROUP_COLOR, figureScale } from "./Figure";

type Ctl = { rot: number; vel: number; drag: boolean; spin: number; selIdx: number; moved: number; front: number };

const TAU = Math.PI * 2;
const wrap = (a: number) => ((a + Math.PI) % TAU + TAU) % TAU - Math.PI;

function Scene({
  list, ctl, selIdx, onSelect, onFront,
}: {
  list: Character[]; ctl: React.MutableRefObject<Ctl>; selIdx: number; onSelect: (i: number) => void; onFront: (i: number) => void;
}) {
  const n = list.length;
  const R = n <= 1 ? 0 : Math.max(2.6, (n * 1.9) / TAU);
  const ring = useRef<THREE.Group>(null);
  const figs = useRef<(THREE.Group | null)[]>([]);
  const look = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const goalLook = useMemo(() => new THREE.Vector3(), []);
  const { camera } = useThree();

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const c = ctl.current;
    c.selIdx = selIdx;
    if (selIdx >= 0 && n > 0) {
      const goal = -(selIdx / n) * TAU;
      c.rot += wrap(goal - c.rot) * (1 - Math.exp(-dt * 4.5));
      c.vel = 0;
    } else {
      if (!c.drag) {
        c.rot += c.vel * dt + dt * 0.11;
        c.vel *= Math.exp(-dt * 2.5);
      }
    }
    if (ring.current) ring.current.rotation.y = c.rot;

    // the figure at the front
    if (n > 0) {
      const f = ((Math.round((-c.rot / TAU) * n) % n) + n) % n;
      if (f !== c.front) {
        c.front = f;
        onFront(f);
      }
    }

    figs.current.forEach((g, i) => {
      if (!g) return;
      const a = (i / n) * TAU;
      const isSel = i === selIdx;
      const base = n <= 1 ? 0 : a;
      g.rotation.y = base + (isSel ? c.spin : 0);
      const s = (isSel ? 1.12 : 1) * 1;
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, s, 1 - Math.exp(-dt * 6)));
    });

    // camera: wide view of the ring, or in close on the chosen hero
    const frontZ = R;
    if (selIdx >= 0) {
      const k = list[selIdx].id === "kandula" ? 0.95 : 1;
      goalPos.set(0, 1.5 + 0.3 * k, frontZ + 4.7 * k);
      goalLook.set(0, 0.62 + 0.25 * k, frontZ);
    } else {
      goalPos.set(0, 3.2 + R * 0.16, frontZ + 6.4 + R * 0.45);
      goalLook.set(0, 0.7, R * 0.1);
    }
    const k = 1 - Math.exp(-dt * 3);
    camera.position.lerp(goalPos, k);
    look.lerp(goalLook, k);
    camera.lookAt(look);
  });

  return (
    <>
      <color attach="background" args={["#0b0705"]} />
      <fog attach="fog" args={["#0b0705", 18, 44]} />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={["#ffe9c9", "#241508", 0.75]} />
      <directionalLight position={[4, 8, 7]} intensity={2.1} color="#fff0d2" />
      <directionalLight position={[-6, 4, -5]} intensity={0.9} color="#8fb4ff" />
      <pointLight position={[0, 4, 0]} intensity={14} distance={16} color="#ffcf86" />

      {/* floor */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[R + 2.1, R + 2.2, 0.12, 64]} />
        <meshStandardMaterial color="#17100a" roughness={0.7} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R + 1.9, R + 2.1, 64]} />
        <meshStandardMaterial color={GROUP_COLOR.royal} metalness={0.9} roughness={0.25} emissive={GROUP_COLOR.royal} emissiveIntensity={0.4} />
      </mesh>
      {R > 0 && (
        <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[R - 0.02, R + 0.02, 96]} />
          <meshBasicMaterial color="#e3b04b" transparent opacity={0.35} />
        </mesh>
      )}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[Math.max(0.6, R - 0.3), 64]} />
        <meshStandardMaterial color="#241509" roughness={0.9} />
      </mesh>
      <Sparkles count={60} scale={[R * 2 + 6, 5, R * 2 + 6]} size={3} speed={0.3} color="#ffd98a" opacity={0.7} position={[0, 2, 0]} />

      <group ref={ring}>
        {list.map((c, i) => {
          const a = (i / n) * TAU;
          const x = n <= 1 ? 0 : Math.sin(a) * R;
          const z = n <= 1 ? 0 : Math.cos(a) * R;
          const gc = GROUP_COLOR[c.group];
          const sel = i === selIdx;
          const fs = figureScale(c);
          return (
            <group key={c.id} position={[x, 0, z]}>
              {/* plinth */}
              <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.62, 0.68, 0.1, 32]} />
                <meshStandardMaterial color="#1c130b" roughness={0.6} metalness={0.3} />
              </mesh>
              <mesh position={[0, 0.102, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.62, 0.016, 8, 40]} />
                <meshStandardMaterial color={gc} metalness={0.9} roughness={0.25} emissive={gc} emissiveIntensity={sel ? 1.2 : 0.3} />
              </mesh>
              <group
                ref={(g) => {
                  figs.current[i] = g;
                }}
                position={[0, 0.1, 0]}
                onClick={(e) => {
                  e.stopPropagation();
                  if (e.delta > 6 || ctl.current.moved > 6) return;
                  onSelect(i);
                }}
                onPointerOver={() => (document.body.style.cursor = "pointer")}
                onPointerOut={() => (document.body.style.cursor = "")}
              >
                <group scale={fs}>
                  <Figure character={c} selected={sel} phase={i * 0.137} />
                </group>
                {/* invisible hit capsule so thin limbs are easy to click */}
                <mesh position={[0, 0.95, 0]} visible={false}>
                  <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
                  <meshBasicMaterial />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </>
  );
}

export default function HeroStage({ list, onOpen }: { list: Character[]; onOpen: (id: string) => void }) {
  const { t } = useLang();
  const [selId, setSelId] = useState<string | null>(null);
  const [front, setFront] = useState(0);
  const ctl = useRef<Ctl>({ rot: 0, vel: 0, drag: false, spin: 0, selIdx: -1, moved: 0, front: -1 });
  const wrapRef = useRef<HTMLDivElement>(null);

  // forget the selection if the filter removed that hero
  const selIdx = selId ? list.findIndex((c) => c.id === selId) : -1;
  useEffect(() => {
    if (selId && selIdx < 0) setSelId(null);
  }, [selId, selIdx]);
  useEffect(() => {
    ctl.current.front = -1;
    ctl.current.rot = 0;
    ctl.current.vel = 0;
  }, [list]);

  const select = useCallback(
    (i: number) => {
      ctl.current.spin = 0;
      setSelId(list[i]?.id ?? null);
    },
    [list]
  );
  const step = (d: number) => {
    const base = selIdx >= 0 ? selIdx : front;
    select((base + d + list.length) % list.length);
  };

  // drag: spins the whole ring, or — once someone is chosen — turns that figure around
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".hstage-ui")) return;
    const c = ctl.current;
    c.drag = true;
    c.moved = 0;
    let lastX = e.clientX;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - lastX;
      lastX = ev.clientX;
      c.moved += Math.abs(dx);
      if (c.selIdx >= 0) c.spin += dx * 0.012;
      else {
        c.rot += dx * 0.007;
        c.vel = dx * 0.007 * 50;
      }
    };
    const up = () => {
      c.drag = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      setTimeout(() => (c.moved = 0), 0);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const shown = list[selIdx >= 0 ? selIdx : Math.min(front, list.length - 1)];

  return (
    <div className="hstage" ref={wrapRef} onPointerDown={onDown}>
      <Canvas camera={{ position: [0, 3, 12], fov: 40 }} dpr={[1, 1.6]} gl={{ antialias: true }}>
        <Scene list={list} ctl={ctl} selIdx={selIdx} onSelect={select} onFront={setFront} />
      </Canvas>

      <div className="hstage-badge">{t(STAGE_UI.badge)}</div>
      <div className="hstage-hint">{t(selIdx >= 0 ? STAGE_UI.hintOne : STAGE_UI.hintAll)}</div>

      {shown && (
        <div className="hstage-ui">
          <button className="hs-arrow" onClick={() => step(-1)} aria-label={t(STAGE_UI.prev)}>
            ‹
          </button>
          <div className="hs-info" key={shown.id}>
            <span className="hs-tag">{selIdx >= 0 ? t(shown.title) : t(STAGE_UI.facing)}</span>
            <h3>{t(shown.name)}</h3>
            <p>{t(shown.short)}</p>
            <div className="hs-actions">
              {selIdx < 0 ? (
                <button className="btn small primary" onClick={() => select(Math.min(front, list.length - 1))}>
                  {t(STAGE_UI.look)}
                </button>
              ) : (
                <button className="btn small ghost" onClick={() => setSelId(null)}>
                  {t(STAGE_UI.all)}
                </button>
              )}
              <button className="btn small ghost" onClick={() => onOpen(shown.id)}>
                {t(STAGE_UI.story)}
              </button>
            </div>
          </div>
          <button className="hs-arrow" onClick={() => step(1)} aria-label={t(STAGE_UI.next)}>
            ›
          </button>
        </div>
      )}
    </div>
  );
}

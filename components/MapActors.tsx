"use client";

import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { STAGES, project } from "@/lib/journey";
import { heightAt } from "@/lib/terrain";
import { Kandula } from "./Elephant";

export const SEA_Y = 0.14;
type Ref<T> = React.MutableRefObject<T>;
/** which subject the camera should follow this frame: 0 none, 1 the golden ship, 2 the marching army */
export type Follow = Ref<{ mode: 0 | 1 | 2 }>;

const SKINS = ["#c68642", "#b87333", "#a8672f", "#d39a5f", "#9c5b2a"];
const TUNIC = ["#9c2a2a", "#c9a24a", "#e8e0c9", "#7a3b1d"];
const SHIELD = ["#a51f2d", "#6b3d1a", "#c9a24a"];

/* ═════════ Troops: articulated foot soldiers (legs swing, spears carried, shields on the arm) ═════════ */
export type Slot = { x: number; z: number; ph: number };

export function Troops({
  slots, pace, fight = false, tunic = TUNIC, shield = SHIELD, hot = 1,
}: { slots: Slot[]; pace: Ref<number>; fight?: boolean; tunic?: string[]; shield?: string[]; hot?: number }) {
  const n = slots.length;
  const torso = useRef<THREE.InstancedMesh>(null);
  const head = useRef<THREE.InstancedMesh>(null);
  const helm = useRef<THREE.InstancedMesh>(null);
  const legA = useRef<THREE.InstancedMesh>(null);
  const legB = useRef<THREE.InstancedMesh>(null);
  const spear = useRef<THREE.InstancedMesh>(null);
  const tip = useRef<THREE.InstancedMesh>(null);
  const buck = useRef<THREE.InstancedMesh>(null);
  const d = useMemo(() => new THREE.Object3D(), []);
  const clk = useRef(0);
  const hotRef = useRef(hot);
  hotRef.current = hot;

  useLayoutEffect(() => {
    const c = new THREE.Color();
    slots.forEach((_, i) => {
      torso.current?.setColorAt(i, c.set(tunic[i % tunic.length]));
      head.current?.setColorAt(i, c.set(SKINS[i % SKINS.length]));
      legA.current?.setColorAt(i, c.set(SKINS[i % SKINS.length]).multiplyScalar(0.85));
      legB.current?.setColorAt(i, c.set(SKINS[i % SKINS.length]).multiplyScalar(0.85));
      buck.current?.setColorAt(i, c.set(shield[(i * 7) % shield.length]));
    });
    [torso, head, legA, legB, buck].forEach((r) => r.current?.instanceColor && (r.current.instanceColor.needsUpdate = true));
  }, [slots, tunic, shield]);

  useFrame((_, dt) => {
    const hotK = hotRef.current;
    clk.current += Math.min(dt, 0.05) * (fight ? 3.4 * hotK : 3.0 + pace.current * 5.5);
    const t = clk.current;
    const amp = fight ? 0.45 * hotK : 0.1 + pace.current * 0.9;
    slots.forEach((s, i) => {
      const ph = t + s.ph;
      const step = Math.sin(ph);
      const bob = Math.abs(Math.cos(ph)) * 0.014 * (fight ? 0.6 : amp);
      const lunge = fight ? Math.max(0, Math.sin(t * 0.55 + s.ph * 1.7)) * 0.11 * hotK : 0;
      const x = s.x, z = s.z + lunge;
      const lean = fight ? 0.18 + lunge * 1.5 : 0.04 * amp;

      // legs swing from the hip
      const swing = step * 0.62 * amp;
      [legA, legB].forEach((r, k) => {
        const a = k ? -swing : swing;
        d.rotation.set(a, 0, 0);
        d.position.set(x + (k ? 0.022 : -0.022), 0.15 - Math.cos(a) * 0.075, z - Math.sin(a) * 0.075);
        d.scale.set(1, 1, 1);
        d.updateMatrix();
        r.current?.setMatrixAt(i, d.matrix);
      });
      // torso
      d.rotation.set(lean, 0, 0);
      d.position.set(x, 0.235 + bob, z + lean * 0.05);
      d.updateMatrix();
      torso.current?.setMatrixAt(i, d.matrix);
      // head + helmet
      d.rotation.set(0, 0, 0);
      d.position.set(x, 0.345 + bob, z + lean * 0.12);
      d.updateMatrix();
      head.current?.setMatrixAt(i, d.matrix);
      d.position.set(x, 0.356 + bob, z + lean * 0.12);
      d.updateMatrix();
      helm.current?.setMatrixAt(i, d.matrix);
      // spear: upright on the march, levelled forward and thrusting in battle
      const th = fight ? 1.2 + Math.sin(t * 1.6 + s.ph) * 0.3 * hotK : 0.12 + step * 0.03;
      const hx = x + 0.075, hy = 0.24 + bob, hz = z + 0.03 + lunge * 0.4;
      const dir = new THREE.Vector3(0, Math.cos(th), Math.sin(th));
      d.rotation.set(th, 0, 0);
      d.position.set(hx + dir.x * 0.15, hy + dir.y * 0.15, hz + dir.z * 0.15);
      d.updateMatrix();
      spear.current?.setMatrixAt(i, d.matrix);
      d.position.set(hx + dir.x * 0.43, hy + dir.y * 0.43, hz + dir.z * 0.43);
      d.updateMatrix();
      tip.current?.setMatrixAt(i, d.matrix);
      // shield on the left arm
      d.rotation.set(0.15 * Math.sin(ph * 0.5), 0.2, Math.PI / 2);
      d.position.set(x - 0.075, 0.235 + bob, z + 0.02);
      d.updateMatrix();
      buck.current?.setMatrixAt(i, d.matrix);
    });
    [torso, head, helm, legA, legB, spear, tip, buck].forEach((r) => r.current && (r.current.instanceMatrix.needsUpdate = true));
  });

  return (
    <group>
      <instancedMesh ref={torso} args={[undefined, undefined, n]} frustumCulled={false}>
        <capsuleGeometry args={[0.04, 0.09, 4, 8]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={head} args={[undefined, undefined, n]} frustumCulled={false}>
        <sphereGeometry args={[0.034, 10, 8]} />
        <meshStandardMaterial roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={helm} args={[undefined, undefined, n]} frustumCulled={false}>
        <sphereGeometry args={[0.04, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#b9b2a0" metalness={0.7} roughness={0.35} />
      </instancedMesh>
      <instancedMesh ref={legA} args={[undefined, undefined, n]} frustumCulled={false}>
        <cylinderGeometry args={[0.017, 0.013, 0.15, 6]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={legB} args={[undefined, undefined, n]} frustumCulled={false}>
        <cylinderGeometry args={[0.017, 0.013, 0.15, 6]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={spear} args={[undefined, undefined, n]} frustumCulled={false}>
        <cylinderGeometry args={[0.0055, 0.0055, 0.58, 5]} />
        <meshStandardMaterial color="#6b4a2a" />
      </instancedMesh>
      <instancedMesh ref={tip} args={[undefined, undefined, n]} frustumCulled={false}>
        <coneGeometry args={[0.012, 0.06, 6]} />
        <meshStandardMaterial color="#e3e6ea" metalness={0.9} roughness={0.2} />
      </instancedMesh>
      <instancedMesh ref={buck} args={[undefined, undefined, n]} frustumCulled={false}>
        <cylinderGeometry args={[0.052, 0.052, 0.012, 10]} />
        <meshStandardMaterial roughness={0.6} metalness={0.2} />
      </instancedMesh>
    </group>
  );
}

/* ═════════ a king on his tusker: sits on the gold howdah (coordinates in the elephant's own units) ═════════ */
export function KingRider({ robe = "#a51f2d", crown = "#ffd34d" }: { robe?: string; crown?: string }) {
  return (
    <group position={[0, 2.06, 0.05]}>
      <mesh position={[0, 0.26, 0]}>
        <capsuleGeometry args={[0.13, 0.26, 6, 14]} />
        <meshStandardMaterial color={robe} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.26, 0.06]} rotation={[0, 0, 0.6]}>
        <boxGeometry args={[0.05, 0.4, 0.26]} />
        <meshStandardMaterial color="#ffd34d" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <sphereGeometry args={[0.1, 14, 12]} />
        <meshStandardMaterial color="#c68642" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.74, 0]}>
        <coneGeometry args={[0.1, 0.15, 8]} />
        <meshStandardMaterial color={crown} metalness={0.7} roughness={0.25} emissive={crown} emissiveIntensity={0.35} />
      </mesh>
      {/* the raised javelin */}
      <mesh position={[0.2, 0.66, 0.08]} rotation={[0.5, 0, -0.12]}>
        <cylinderGeometry args={[0.012, 0.012, 1.1, 6]} />
        <meshStandardMaterial color="#5b3b24" />
      </mesh>
      <mesh position={[0.26, 1.1, 0.34]} rotation={[0.5, 0, -0.12]}>
        <coneGeometry args={[0.03, 0.14, 6]} />
        <meshStandardMaterial color="#e8ecf0" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ═════════ the marching army: Kandula with the king, banners, and a column of soldiers ═════════ */
export function Army({
  curve, fracs, stageIdx, progress, follow, focus,
}: { curve: THREE.CatmullRomCurve3; fracs: number[]; stageIdx: number; progress: Ref<number>; follow: Follow; focus: Ref<THREE.Vector3> }) {
  const group = useRef<THREE.Group>(null);
  const flags = useRef<THREE.Group>(null);
  const pace = useRef(0);
  const vel = useRef(0);
  const slots = useMemo<Slot[]>(
    () => Array.from({ length: 36 }, (_, i) => {
      const r = Math.floor(i / 4), c = i % 4;
      return { x: (c - 1.5) * 0.17 + (r % 2 ? 0.03 : -0.02), z: -0.72 - r * 0.2, ph: r * 0.55 + (c % 2) * 1.9 };
    }),
    []
  );
  const target = STAGES[stageIdx]?.army ? fracs[STAGES[stageIdx].marchNode] : fracs[0];
  const tgt = useRef(target);
  tgt.current = target;
  const tmpP = useMemo(() => new THREE.Vector3(), []);
  const tmpT = useMemo(() => new THREE.Vector3(), []);
  const visible = STAGES[stageIdx]?.army ?? false;

  useFrame((s, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    // eased, spring-like travel: accelerates, cruises, glides to a halt
    const diff = tgt.current - progress.current;
    const dist = Math.abs(diff);
    const desired = Math.sign(diff) * Math.min(0.055, dist * 0.8);
    vel.current += (desired - vel.current) * Math.min(1, dt * 1.8);
    if (dist < 0.0006 && Math.abs(vel.current) < 0.0015) {
      vel.current = 0;
      progress.current = tgt.current;
    } else progress.current += vel.current * dt;
    const sp = Math.abs(vel.current) / 0.055;
    pace.current += (Math.min(1, sp * 1.4) - pace.current) * Math.min(1, dt * 3);

    const p = Math.min(0.999, Math.max(0.001, progress.current));
    curve.getPointAt(p, tmpP);
    curve.getTangentAt(p, tmpT);
    const g = group.current;
    if (!g) return;
    g.position.copy(tmpP);
    const yaw = Math.atan2(tmpT.x, tmpT.z);
    g.rotation.y += Math.atan2(Math.sin(yaw - g.rotation.y), Math.cos(yaw - g.rotation.y)) * Math.min(1, dt * 4);
    if (visible && pace.current > 0.12) {
      follow.current.mode = 2;
      focus.current.lerp(tmpP, Math.min(1, dt * 4));
    }
    if (flags.current) flags.current.children.forEach((c, i) => (c.rotation.y = Math.sin(s.clock.elapsedTime * 3 + i) * 0.3));
  });

  return (
    <group ref={group} visible={visible} scale={stageIdx === 7 ? 0.5 : 1.25}>
      {/* Kandula and the king */}
      <group scale={0.24}>
        <Kandula pace={pace} />
        <KingRider />
      </group>
      <Troops slots={slots} pace={pace} />
      {/* banners */}
      <group ref={flags}>
        {[-0.34, 0.34].map((x, i) => (
          <group key={i} position={[x, 0.3, -0.5 - i * 0.7]}>
            <mesh position={[0, 0.15, 0]}>
              <cylinderGeometry args={[0.007, 0.007, 0.75, 5]} />
              <meshStandardMaterial color="#5b3b24" />
            </mesh>
            <mesh position={[0.1, 0.38, 0]}>
              <planeGeometry args={[0.2, 0.14]} />
              <meshStandardMaterial color="#a51f2d" side={THREE.DoubleSide} emissive="#a51f2d" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0.1, 0.38, 0.002]}>
              <circleGeometry args={[0.035, 12]} />
              <meshBasicMaterial color="#ffd34d" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
      <Sparkles count={26} scale={[1.1, 0.35, 2.6]} position={[0, 0.12, -1.1]} size={2.2} speed={0.45} color="#e2c48a" opacity={0.45} />
    </group>
  );
}

/* ═════════ the golden ship of Princess Viharamahadevi ═════════ */
const BOAT_LL: [number, number][] = [[79.84, 6.97], [79.62, 6.5], [79.66, 6.1], [80.0, 5.72], [80.6, 5.62], [81.1, 5.78], [81.4, 6.08], [81.38, 6.2]];
const GOLD = "#f0b429";

function Queen() {
  return (
    <group position={[0, 0.045, -0.02]}>
      {/* halo of light */}
      <mesh position={[0, 0.2, -0.015]}>
        <ringGeometry args={[0.075, 0.088, 32]} />
        <meshBasicMaterial color="#ffe9a8" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>
      {/* gown */}
      <mesh position={[0, 0.07, 0]}>
        <coneGeometry args={[0.068, 0.15, 14]} />
        <meshStandardMaterial color="#c2417a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.0, 0]}>
        <torusGeometry args={[0.066, 0.006, 6, 20]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} />
      </mesh>
      {/* bodice + shoulder cloth */}
      <mesh position={[0, 0.17, 0]}>
        <capsuleGeometry args={[0.034, 0.05, 4, 10]} />
        <meshStandardMaterial color="#e0709f" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.17, 0.005]} rotation={[0, 0, 0.7]}>
        <boxGeometry args={[0.018, 0.1, 0.09]} />
        <meshStandardMaterial color="#fff1c9" roughness={0.6} />
      </mesh>
      {/* arms folded in a graceful gesture */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.045, 0.16, 0.025]} rotation={[0.9, 0, s * 0.45]}>
          <capsuleGeometry args={[0.011, 0.06, 3, 6]} />
          <meshStandardMaterial color="#d79b6a" />
        </mesh>
      ))}
      {/* head, hair, tiara */}
      <mesh position={[0, 0.245, 0]}>
        <sphereGeometry args={[0.032, 14, 12]} />
        <meshStandardMaterial color="#d79b6a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.25, -0.008]} scale={[1, 1.05, 0.95]}>
        <sphereGeometry args={[0.034, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
        <meshStandardMaterial color="#14100c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.2, -0.032]} scale={[1, 1.6, 0.6]}>
        <sphereGeometry args={[0.03, 10, 8]} />
        <meshStandardMaterial color="#14100c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.275, 0.012]}>
        <coneGeometry args={[0.015, 0.034, 5]} />
        <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.2} emissive={GOLD} emissiveIntensity={0.5} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.022, 0.244, 0.027]}>
          <sphereGeometry args={[0.0045, 6, 6]} />
          <meshBasicMaterial color="#1b1209" />
        </mesh>
      ))}
    </group>
  );
}

function Swan({ side }: { side: 1 | -1 }) {
  // a rising, curling neck with a head — prow (front) or tail (rear)
  const geo = useMemo(() => {
    const pts = [[0, 0, 0], [0, 0.07, 0.07 * side], [0, 0.19, 0.1 * side], [0, 0.3, 0.075 * side], [0, 0.36, 0.015 * side]].map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.019, 8, false);
  }, [side]);
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.25} emissive="#a86a00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.375, 0.0]}>
        <sphereGeometry args={[0.03, 12, 10]} />
        <meshStandardMaterial color={GOLD} metalness={0.75} roughness={0.25} emissive="#a86a00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.37, -0.04 * side]} rotation={[(Math.PI / 2) * -side, 0, 0]}>
        <coneGeometry args={[0.012, 0.05, 6]} />
        <meshStandardMaterial color="#c2417a" />
      </mesh>
      <mesh position={[0, 0.415, 0.0]}>
        <coneGeometry args={[0.012, 0.04, 6]} />
        <meshStandardMaterial color="#c2417a" emissive="#c2417a" emissiveIntensity={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.021, 0.38, -0.012 * side]}>
          <sphereGeometry args={[0.005, 6, 6]} />
          <meshBasicMaterial color="#14100c" />
        </mesh>
      ))}
    </group>
  );
}

export function Boat({ active, follow, focus }: { active: number; follow: Follow; focus: Ref<THREE.Vector3> }) {
  const g = useRef<THREE.Group>(null);
  const oars = useRef<THREE.Group[]>([]);
  const sail = useRef<THREE.Group>(null);
  const u = useRef(0);
  const curve = useMemo(() => {
    const pts = BOAT_LL.map(([lo, la]) => {
      const [x, z] = project(lo, la);
      return new THREE.Vector3(x, SEA_Y + 0.02, z);
    });
    return new THREE.CatmullRomCurve3(pts, false, "centripetal");
  }, []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const tg = useMemo(() => new THREE.Vector3(), []);
  const prev = useRef(active);
  const visible = active <= 1;

  useFrame((s, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const t = s.clock.elapsedTime;
    if (active === 0 && prev.current !== 0) u.current = 0; // restart the voyage when stage 1 is chosen
    prev.current = active;
    if (active < 0) u.current = (t * 0.035) % 1; // overview: drifting loop
    else if (active === 0) u.current = Math.min(1, u.current + dt * 0.075);
    else u.current = 1;
    // ease the visible position so the ship glides in and out
    const e = active === 0 ? u.current * u.current * (3 - 2 * u.current) : u.current;
    curve.getPointAt(Math.min(0.999, e), p);
    curve.getTangentAt(Math.min(0.999, e), tg);
    const b = g.current;
    if (!b) return;
    b.position.set(p.x, p.y + Math.sin(t * 1.9) * 0.012, p.z);
    const yaw = Math.atan2(tg.x, tg.z);
    b.rotation.y += Math.atan2(Math.sin(yaw - b.rotation.y), Math.cos(yaw - b.rotation.y)) * Math.min(1, dt * 3);
    b.rotation.z = Math.sin(t * 1.5) * 0.05;
    b.rotation.x = Math.sin(t * 1.1 + 1) * 0.025;
    oars.current.forEach((o, i) => {
      if (!o) return;
      const side = i % 2 ? 1 : -1;
      const k = Math.floor(i / 2);
      const ph = t * 2.2 + k * 0.5;
      o.rotation.y = side * (0.1 + 0.5 * Math.max(0, Math.sin(ph)) ) * 0.8 + side * 0.0;
      o.rotation.z = side * (-0.7 + Math.sin(ph + 1.2) * 0.18);
    });
    if (sail.current) sail.current.rotation.y = Math.sin(t * 1.2) * 0.08;
    if (visible && active === 0) {
      follow.current.mode = 1;
      focus.current.lerp(p, Math.min(1, dt * 5));
    }
  });

  return (
    <group ref={g} visible={visible} scale={2.1}>
      {/* hull: layered gold and crimson bands */}
      <mesh scale={[0.16, 0.1, 0.42]} position={[0, 0.045, 0]}>
        <sphereGeometry args={[1, 24, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.28} side={THREE.DoubleSide} emissive="#a86a00" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0.047, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.162, 0.425, 1]}>
        <torusGeometry args={[1, 0.045, 8, 40]} />
        <meshStandardMaterial color="#a51f2d" roughness={0.5} metalness={0.2} emissive="#5a0d14" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.062, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.158, 0.418, 1]}>
        <torusGeometry args={[1, 0.016, 8, 40]} />
        <meshStandardMaterial color="#ffe08a" metalness={0.9} roughness={0.15} emissive="#c58a12" emissiveIntensity={0.6} />
      </mesh>
      {/* deck */}
      <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.15, 0.4, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshStandardMaterial color="#6b3d1a" roughness={0.8} />
      </mesh>
      {/* gold swan prow and tail */}
      <group position={[0, 0.05, 0.4]}>
        <Swan side={1} />
      </group>
      <group position={[0, 0.05, -0.4]} rotation={[0, Math.PI, 0]}>
        <Swan side={1} />
      </group>
      {/* royal pavilion */}
      <group position={[0, 0.045, -0.02]}>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
          <mesh key={i} position={[sx * 0.1, 0.23, sz * 0.12]}>
            <cylinderGeometry args={[0.007, 0.007, 0.46, 6]} />
            <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.25} />
          </mesh>
        ))}
        <mesh position={[0, 0.54, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 1, 1.18]}>
          <coneGeometry args={[0.2, 0.15, 4]} />
          <meshStandardMaterial color="#a51f2d" roughness={0.6} emissive="#4a0a10" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.465, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]} scale={[1, 1.18, 1]}>
          <ringGeometry args={[0.185, 0.2, 4]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} side={THREE.DoubleSide} emissive="#c58a12" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.64, 0]}>
          <sphereGeometry args={[0.022, 10, 8]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} emissive="#ffcf66" emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0, 0.67, 0]}>
          <coneGeometry args={[0.008, 0.05, 6]} />
          <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.15} />
        </mesh>
        {/* hanging tassels */}
        {[-0.14, -0.07, 0, 0.07, 0.14].map((x) => (
          <mesh key={x} position={[x, 0.45, 0.15]}>
            <sphereGeometry args={[0.009, 6, 6]} />
            <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.6} />
          </mesh>
        ))}
        <Queen />
      </group>
      {/* mast and sail with a gold sun */}
      <group position={[0, 0.05, 0.24]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.007, 0.01, 0.4, 6]} />
          <meshStandardMaterial color="#5b3b24" />
        </mesh>
        <group ref={sail} position={[0, 0.25, 0.012]}>
          <mesh>
            <planeGeometry args={[0.22, 0.18]} />
            <meshStandardMaterial color="#fff1d4" side={THREE.DoubleSide} roughness={0.9} emissive="#b89a52" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.002]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color={GOLD} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
      {/* oars — pulled together in rhythm */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const side = i % 2 ? 1 : -1;
        const k = Math.floor(i / 2);
        return (
          <group key={i} position={[side * 0.15, 0.07, -0.18 + k * 0.12]} ref={(o) => { if (o) oars.current[i] = o; }}>
            <mesh position={[side * 0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.005, 0.005, 0.24, 5]} />
              <meshStandardMaterial color="#8a5a2b" />
            </mesh>
            <mesh position={[side * 0.22, 0, 0]}>
              <boxGeometry args={[0.07, 0.006, 0.03]} />
              <meshStandardMaterial color="#8a5a2b" />
            </mesh>
          </group>
        );
      })}
      {/* lanterns */}
      {[0.38, -0.38].map((z) => (
        <mesh key={z} position={[0, 0.2, z]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#fff0b0" />
        </mesh>
      ))}
      <pointLight position={[0, 0.3, 0]} color="#ffcf66" intensity={2.2} distance={3} />
      {/* wake */}
      <mesh position={[0, -0.01, -0.95]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.42, 1.2]} />
        <meshBasicMaterial color="#e6f6ff" transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <Sparkles count={20} scale={[0.6, 0.15, 1.5]} position={[0, 0.02, -0.7]} size={2} speed={0.8} color="#ffffff" opacity={0.6} />
    </group>
  );
}

/* ═════════ brothers' battle at Kulanganiya: Gamani's host against Prince Tissa's ═════════ */
export function BrothersBattle({ active }: { active: boolean }) {
  const [x, z] = project(80.98, 6.55);
  const y = heightAt(x, z);
  const pace = useRef(0);
  const flash = useRef<THREE.PointLight>(null);
  const sparkMesh = useRef<THREE.Mesh>(null);
  const slotsA = useMemo<Slot[]>(() => Array.from({ length: 21 }, (_, i) => ({ x: ((i % 7) - 3) * 0.12, z: -Math.floor(i / 7) * 0.16, ph: i * 0.9 })), []);
  const slotsB = useMemo<Slot[]>(() => Array.from({ length: 21 }, (_, i) => ({ x: ((i % 7) - 3) * 0.12, z: -Math.floor(i / 7) * 0.16, ph: i * 1.3 + 1 })), []);
  const hot = active ? 1.35 : 0.8;
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const k = Math.max(0, Math.sin(t * 3.4)) ** 3;
    if (flash.current) flash.current.intensity = (active ? 7 : 3) * k;
    if (sparkMesh.current) {
      const q = 0.05 + k * 0.1;
      sparkMesh.current.scale.setScalar(q / 0.05);
    }
  });
  const banner = (color: string, trim: string, side: number) => (
    <group position={[side * 0.4, 0.3, -0.5]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.85, 5]} />
        <meshStandardMaterial color="#5b3b24" />
      </mesh>
      <mesh position={[0.1, 0.5, 0]}>
        <planeGeometry args={[0.22, 0.15]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.1, 0.5, 0.002]}>
        <circleGeometry args={[0.038, 12]} />
        <meshBasicMaterial color={trim} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
  return (
    <group position={[x, y, z]} scale={1.25}>
      {/* scorched ground */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0]}>
        <circleGeometry args={[0.95, 36]} />
        <meshBasicMaterial color="#2a140a" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.014, 0]}>
        <ringGeometry args={[0.9, 0.97, 40]} />
        <meshBasicMaterial color="#ff6b57" transparent opacity={active ? 0.65 : 0.3} depthWrite={false} />
      </mesh>
      {/* Gamani's host (crimson) from the west */}
      <group position={[-0.62, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Troops slots={slotsA} pace={pace} fight hot={hot} tunic={["#9c2a2a", "#c9a24a", "#7a1f1f"]} shield={["#a51f2d", "#c9a24a"]} />
        {banner("#a51f2d", "#ffd34d", 1)}
      </group>
      {/* Prince Tissa's host (teal) from the east */}
      <group position={[0.62, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <Troops slots={slotsB} pace={pace} fight hot={hot} tunic={["#1f6f78", "#d9dde4", "#2c5f7a"]} shield={["#1f6f78", "#d9dde4"]} />
        {banner("#1f6f78", "#d9dde4", -1)}
      </group>
      {/* clash */}
      <mesh ref={sparkMesh} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshBasicMaterial color="#fff3c4" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <pointLight ref={flash} position={[0, 0.5, 0]} color="#ffb347" distance={3} intensity={3} />
      <Sparkles count={30} scale={[0.5, 0.5, 0.6]} position={[0, 0.3, 0]} size={4} speed={2.4} color="#ffd98a" opacity={0.9} />
      <Sparkles count={24} scale={[1.8, 0.4, 1.0]} position={[0, 0.15, 0]} size={3} speed={0.7} color="#cdb48a" opacity={0.4} />
    </group>
  );
}

/* ═════════ the Duel of Kings at Anuradhapura's southern gate — click to watch the animation ═════════ */
export function DuelMarker({ onOpen }: { onOpen: () => void }) {
  const [cx, cz] = project(80.4037, 8.3114);
  const cy = heightAt(cx, cz);
  const a = useRef<THREE.Group>(null);
  const b = useRef<THREE.Group>(null);
  const spark = useRef<THREE.Mesh>(null);
  const pace = useRef(1);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const c = 0.5 + 0.5 * Math.sin(t * 0.9); // charge and withdraw
    const gap = 0.06 + (1 - c) * 0.22;
    if (a.current) a.current.position.x = -gap - 0.07;
    if (b.current) b.current.position.x = gap + 0.07;
    if (spark.current) {
      const hit = Math.max(0, (c - 0.82) / 0.18);
      spark.current.scale.setScalar(0.4 + hit * 2.4);
      (spark.current.material as THREE.MeshBasicMaterial).opacity = hit * 0.9;
    }
  });
  return (
    <group
      position={[cx, cy, cz + 0.98]}
      onClick={(e) => { e.stopPropagation(); onOpen(); }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <group ref={a} rotation={[0, Math.PI / 2, 0]} scale={0.1}>
        <Kandula pace={pace} />
        <KingRider />
      </group>
      <group ref={b} rotation={[0, -Math.PI / 2, 0]} scale={0.1}>
        <Kandula pace={pace} cloth="#1f6f78" />
        <KingRider robe="#1f6f78" crown="#d9dde4" />
      </group>
      <mesh ref={spark} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.05, 10, 8]} />
        <meshBasicMaterial color="#fff3c4" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* a red ring on the ground marks it as clickable */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 0]}>
        <ringGeometry args={[0.36, 0.4, 40]} />
        <meshBasicMaterial color="#ff6b57" transparent opacity={0.7} depthWrite={false} />
      </mesh>
      <Sparkles count={14} scale={[0.6, 0.35, 0.3]} position={[0, 0.2, 0]} size={3} speed={1.2} color="#ffb347" opacity={0.8} />
    </group>
  );
}

/* ═════════ a compass rose on the sea ═════════ */
export function Compass() {
  const tex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const g = c.getContext("2d")!;
    g.translate(128, 128);
    g.strokeStyle = "rgba(243,229,176,0.9)";
    g.lineWidth = 3;
    g.beginPath(); g.arc(0, 0, 92, 0, 6.3); g.stroke();
    g.lineWidth = 1.5;
    g.beginPath(); g.arc(0, 0, 80, 0, 6.3); g.stroke();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const L = i % 4 === 0 ? 118 : i % 2 === 0 ? 100 : 86;
      g.fillStyle = i % 4 === 0 ? "rgba(255,217,138,0.95)" : "rgba(243,229,176,0.6)";
      g.save();
      g.rotate(a);
      g.beginPath(); g.moveTo(0, -L); g.lineTo(7, -10); g.lineTo(-7, -10); g.closePath(); g.fill();
      g.restore();
    }
    g.fillStyle = "#ffd98a";
    g.font = "bold 30px serif";
    g.textAlign = "center";
    g.fillText("N", 0, -122);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  const [x, z] = project(82.55, 6.0);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[x, SEA_Y + 0.02, z]}>
      <planeGeometry args={[3.4, 3.4]} />
      <meshBasicMaterial map={tex ?? undefined} transparent opacity={0.55} depthWrite={false} />
    </mesh>
  );
}

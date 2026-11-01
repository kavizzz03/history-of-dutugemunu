"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { STAGE_UI } from "@/lib/stage";
import type { Character } from "@/lib/characters";
import { Figure, GROUP_COLOR } from "./Figure";

/** One character on a round plinth that you can drag to turn through a full 360°. */
export default function ModelViewer({ character }: { character: Character }) {
  const { t } = useLang();
  const [auto, setAuto] = useState(true);
  const isElephant = character.id === "kandula";
  const [c1, c2] = character.avatar.bg;
  const gc = GROUP_COLOR[character.group];
  return (
    <div className="viewer3d" style={{ background: `radial-gradient(ellipse at 50% 35%, ${c1}, ${c2})` }}>
      <Canvas camera={{ position: [0, isElephant ? 1.7 : 1.5, isElephant ? 7.4 : 4.6], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
        <ambientLight intensity={0.65} />
        <hemisphereLight args={["#ffe9c9", "#2a1a10", 0.7]} />
        <directionalLight position={[3, 5, 4]} intensity={2.1} color="#fff0d2" />
        <directionalLight position={[-4, 3, -3]} intensity={1.1} color="#9ec5ff" />
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[isElephant ? 1.7 : 0.85, isElephant ? 1.8 : 0.92, 0.1, 40]} />
            <meshStandardMaterial color="#1a120b" roughness={0.6} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.105, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[isElephant ? 1.7 : 0.85, 0.018, 8, 64]} />
            <meshStandardMaterial color={gc} metalness={0.9} roughness={0.25} emissive={gc} emissiveIntensity={0.35} />
          </mesh>
          <group position={[0, 0.1, 0]}>
            <Figure character={character} selected />
          </group>
        </group>
        <OrbitControls
          target={[0, isElephant ? 1.2 : 1.05, 0]}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          minDistance={isElephant ? 4 : 2.4}
          maxDistance={isElephant ? 10 : 7}
          minPolarAngle={0.5}
          maxPolarAngle={1.75}
          autoRotate={auto}
          autoRotateSpeed={2.2}
        />
      </Canvas>
      <div className="viewer-badge">{t(STAGE_UI.badge)}</div>
      <div className="viewer-hint">{t(STAGE_UI.hintOne)}</div>
      <button className={`viewer-auto ${auto ? "on" : ""}`} onClick={() => setAuto((a) => !a)}>
        ⟳ {t(auto ? STAGE_UI.autoOn : STAGE_UI.autoOff)}
      </button>
    </div>
  );
}

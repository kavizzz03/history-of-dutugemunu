"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import type { Character } from "@/lib/characters";
import { Person } from "./Figure3D";
import { Kandula } from "./Elephant";
import AnimatedPerson from "./AnimatedPerson";

export { GROUP_COLOR, figureScale } from "./Figure3D";

/* ───────── drop-in realistic models ─────────
   Put a rigged, animated glTF at  public/models/characters/<character-id>.glb
   (e.g. dutugemunu.glb, elara.glb, kandula.glb) and it replaces the built-in body for that character.
   The model is auto-sized (humans to ~1.8 m, Kandula to ~2.2 m), stood on the plinth, and its
   idle / first animation is played. */
/* list the ids you added in  public/models/characters/manifest.json  →  ["dutugemunu","elara"]  */
let manifest: Promise<string[]> | null = null;
function loadManifest() {
  manifest ??= fetch("/models/characters/manifest.json")
    .then((r) => (r.ok ? r.json() : []))
    .then((j) => (Array.isArray(j) ? (j as string[]) : []))
    .catch(() => []);
  return manifest;
}
function useHasModel(id: string) {
  const [v, setV] = useState<boolean>(false);
  useEffect(() => {
    let alive = true;
    loadManifest().then((ids) => alive && setV(ids.includes(id)));
    return () => {
      alive = false;
    };
  }, [id]);
  return v;
}

function CustomModel({ url, height }: { url: string; height: number }) {
  const { scene, animations } = useGLTF(url);
  const model = useMemo(() => SkeletonUtils.clone(scene) as THREE.Group, [scene]);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const [fit, setFit] = useState<{ s: number; x: number; z: number }>({ s: 1, x: 0, z: 0 });
  useEffect(() => {
    model.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const c = box.getCenter(new THREE.Vector3());
    const s = size.y > 0 ? height / size.y : 1;
    setFit({ s, x: -c.x * s, z: -c.z * s });
    model.traverse((o) => ((o as THREE.Mesh).isMesh ? ((o as THREE.Mesh).frustumCulled = false) : undefined));
    if (animations.length) {
      const mx = new THREE.AnimationMixer(model);
      const clip = animations.find((a) => /idle|stand/i.test(a.name)) ?? animations[0];
      mx.clipAction(clip).play();
      mixer.current = mx;
      return () => {
        mx.stopAllAction();
        mx.uncacheRoot(model);
      };
    }
  }, [model, animations, height]);
  useFrame((_, dt) => mixer.current?.update(Math.min(dt, 0.05)));
  // lift so the lowest point rests on the plinth
  const box = useMemo(() => new THREE.Box3().setFromObject(model), [model]);
  return (
    <group position={[fit.x, -box.min.y * fit.s, fit.z]} scale={fit.s}>
      <primitive object={model} />
    </group>
  );
}

function Human({ character, gesture, phase }: { character: Character; gesture: boolean; phase: number }) {
  const url = `/models/characters/${character.id}.glb`;
  const has = useHasModel(character.id);
  if (has) {
    return (
      <Suspense fallback={null}>
        <CustomModel url={url} height={1.8} />
      </Suspense>
    );
  }
  return <AnimatedPerson cfg={character.avatar} gesture={gesture} phase={phase} />;
}

export function Figure({ character, selected = false, phase = 0 }: { character: Character; selected?: boolean; phase?: number }) {
  if (character.id === "kandula") return <Kandula />;
  return (
    <Suspense fallback={<Person cfg={character.avatar} />}>
      <Human character={character} gesture={selected} phase={phase} />
    </Suspense>
  );
}

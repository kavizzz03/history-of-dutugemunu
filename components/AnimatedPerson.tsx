"use client";

import { useGLTF } from "@react-three/drei";
import { createPortal, useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import type { AvatarCfg } from "@/lib/characters";
import { Bow, Club, GOLD, HeadParts, Mace, Mat, Shield, Spear, Sword, shade } from "./Figure3D";

/** A skeleton-animated human body (Mixamo "X Bot", from the three.js examples).
 *  Every character gets their own skin tone, build, clothing, hair, beard, headgear and weapon,
 *  all parented to the skeleton so they move with the body. */
export const XBOT = "/models/xbot.glb";

type MountKey = "hips" | "chest" | "head" | "rHand" | "lHand" | "rArm" | "lArm";
const BONES: Record<MountKey, [string, boolean]> = {
  hips: ["Hips", false],
  chest: ["Spine2", false],
  head: ["Head", false],
  rHand: ["RightHand", true],
  lHand: ["LeftHand", true],
  rArm: ["RightArm", true],
  lArm: ["LeftArm", true],
};
type Mounts = Partial<Record<MountKey, THREE.Group>>;

/* the upper arm hangs from the shoulder towards the elbow (measured from the rig's idle pose) */
function Sleeve({ side, color, pad }: { side: 1 | -1; color: string; pad?: string }) {
  const { q, mid, len } = useMemo(() => {
    const dir = new THREE.Vector3(side * 0.056, -0.272, 0.006).normalize();
    const len = 0.2;
    return { q: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir), mid: dir.clone().multiplyScalar(len / 2), len };
  }, [side]);
  return (
    <group>
      <mesh position={mid} quaternion={q}>
        <cylinderGeometry args={[0.064, 0.058, len, 16]} />
        <Mat c={color} r={0.85} />
      </mesh>
      {pad && (
        <mesh position={[side * 0.02, 0.035, 0]} scale={[1.2, 0.8, 1.1]}>
          <sphereGeometry args={[0.078, 16, 12]} />
          <Mat c={pad} m={0.7} r={0.3} />
        </mesh>
      )}
    </group>
  );
}

type Props = { cfg: AvatarCfg; gesture?: boolean; phase?: number };

export default function AnimatedPerson({ cfg, gesture = false, phase = 0 }: Props) {
  const { scene, animations } = useGLTF(XBOT);
  const model = useMemo(() => SkeletonUtils.clone(scene) as THREE.Group, [scene]);
  const [mounts, setMounts] = useState<Mounts>({});
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const acts = useRef<Record<string, THREE.AnimationAction>>({});
  const cape = useRef<THREE.Mesh>(null);

  const female = !!cfg.female;
  const monk = !!cfg.monkSoon;
  const old = cfg.age === "old";
  const build = cfg.build ?? 1;
  const armored = cfg.head === "helmet" || cfg.head === "topknot" || (cfg.head === "bald" && !monk && !female);
  const bareChest = cfg.head === "bald" && !monk && !female;
  const bareArms = female || monk || cfg.head === "bald" || cfg.head === "topknot";
  const royalCape = cfg.head === "crown" || cfg.head === "royalturban";
  const w = cfg.weapon ?? "none";
  const wid = female ? 0.92 : build > 1 ? 1 + (build - 1) * 0.5 : 1 - (1 - build) * 0.6;
  const hgt = female ? 0.94 : old ? 0.98 : build >= 1.3 ? 1.06 : build >= 1.15 ? 1.03 : 1;
  const { outfit, accent, skin } = cfg;

  /* skin tone */
  useLayoutEffect(() => {
    const made: THREE.Material[] = [];
    model.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.frustumCulled = false;
      const src = m.material as THREE.MeshStandardMaterial;
      const mat = src.clone();
      mat.color.set(/joint/i.test(src.name) ? shade(skin, 0.78) : skin);
      mat.roughness = 0.55;
      mat.metalness = 0;
      m.material = mat;
      made.push(mat);
    });
    return () => made.forEach((x) => x.dispose());
  }, [model, skin]);

  /* animation + bone mounts (costume pieces live in the bones' idle-pose frame, so they ride with the skeleton) */
  useLayoutEffect(() => {
    const mx = new THREE.AnimationMixer(model);
    const a: Record<string, THREE.AnimationAction> = {};
    animations.forEach((c) => {
      if (c.name === "idle" || c.name === "agree" || c.name === "headShake") a[c.name] = mx.clipAction(c);
    });
    a.idle.play();
    mx.update(0);
    model.updateWorldMatrix(true, true);
    const inv = new THREE.Matrix4().copy(model.matrixWorld).invert();
    const made: Mounts = {};
    (Object.keys(BONES) as MountKey[]).forEach((k) => {
      const [bn, atBone] = BONES[k];
      const bone = model.getObjectByName("mixamorig" + bn);
      if (!bone) return;
      const rel = new THREE.Matrix4().multiplyMatrices(inv, bone.matrixWorld);
      const F = new THREE.Matrix4();
      if (atBone) F.setPosition(new THREE.Vector3().setFromMatrixPosition(rel));
      const g = new THREE.Group();
      g.name = `mount-${k}`;
      g.matrixAutoUpdate = false;
      g.matrix.copy(rel).invert().multiply(F);
      bone.add(g);
      made[k] = g;
    });
    a.idle.time = (phase % 1) * a.idle.getClip().duration;
    const back = (e: { action: THREE.AnimationAction }) => {
      if (e.action === a.agree || e.action === a.headShake) a.idle.reset().fadeIn(0.5).play();
    };
    mx.addEventListener("finished", back as never);
    mixer.current = mx;
    acts.current = a;
    setMounts(made);
    return () => {
      mx.removeEventListener("finished", back as never);
      Object.values(made).forEach((g) => g.removeFromParent());
      mx.stopAllAction();
      mx.uncacheRoot(model);
      setMounts({});
    };
  }, [model, animations, phase]);

  /* now and then the chosen hero nods: a small, lifelike gesture */
  useEffect(() => {
    if (!gesture) return;
    const go = () => {
      const a = acts.current;
      if (!a.agree || !a.idle) return;
      a.agree.reset();
      a.agree.setLoop(THREE.LoopOnce, 1);
      a.agree.clampWhenFinished = false;
      a.idle.fadeOut(0.35);
      a.agree.fadeIn(0.35).play();
    };
    const first = setTimeout(go, 500);
    const every = setInterval(go, 9000);
    return () => {
      clearTimeout(first);
      clearInterval(every);
    };
  }, [gesture, mounts]);

  useFrame(({ clock }, dt) => {
    mixer.current?.update(Math.min(dt, 0.05));
    if (cape.current) cape.current.rotation.x = 0.05 + Math.sin(clock.elapsedTime * 1.3) * 0.035;
  });

  const tunic = female ? 0.95 : 1.1;
  const HS = 0.74;
  const headY = 1.64 - HS * 1.76; // map the toy head's centre onto the skull

  return (
    <group scale={[wid, hgt, wid]}>
      <primitive object={model} />

      {/* ───── hips: dhoti or long skirt, belt ───── */}
      {mounts.hips &&
        createPortal(
          <group>
            {female ? (
              <group>
                <mesh position={[0, 0.58, 0]}>
                  <cylinderGeometry args={[0.185, 0.34, 1.0, 32, 1, true]} />
                  <meshStandardMaterial color={outfit} side={THREE.DoubleSide} roughness={0.85} />
                </mesh>
                <mesh position={[0, 0.085, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.34, 0.014, 8, 40]} />
                  <Mat c={accent} m={0.7} r={0.3} />
                </mesh>
              </group>
            ) : (
              <group>
                <mesh position={[0, 0.8, 0]}>
                  <cylinderGeometry args={[0.19, 0.275, 0.56, 32, 1, true]} />
                  <meshStandardMaterial color={outfit} side={THREE.DoubleSide} roughness={0.85} />
                </mesh>
                <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.274, 0.013, 8, 40]} />
                  <Mat c={accent} m={0.7} r={0.3} />
                </mesh>
              </group>
            )}
            <mesh position={[0, 1.07, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.86, 1]}>
              <torusGeometry args={[0.18, 0.03, 10, 36]} />
              <Mat c={accent} m={0.7} r={0.3} />
            </mesh>
            <mesh position={[0, 1.07, 0.155]}>
              <sphereGeometry args={[0.032, 12, 10]} />
              <Mat c={GOLD} m={0.9} r={0.2} />
            </mesh>
          </group>,
          mounts.hips
        )}

      {/* ───── chest: tunic, armour, sash, cape ───── */}
      {mounts.chest &&
        createPortal(
          <group>
            {!bareChest && (
              <mesh position={[0, 1.31, 0.03]} scale={[tunic * 1.22, 1.02, 1.22]}>
                <capsuleGeometry args={[0.155, 0.2, 8, 24]} />
                <Mat c={outfit} r={0.8} />
              </mesh>
            )}
            {armored && !bareChest && (
              <mesh position={[0, 1.29, 0.02]} scale={[1.12, 1, 0.84]}>
                <capsuleGeometry args={[0.15, 0.14, 8, 24]} />
                <Mat c={accent} m={0.7} r={0.3} />
              </mesh>
            )}
            <mesh position={[0, 1.27, 0.0]} rotation={[0, 0, monk ? 0.8 : -0.78]}>
              <boxGeometry args={[monk ? 0.17 : 0.06, 0.52, 0.42]} />
              <Mat c={monk ? outfit : accent} m={monk ? 0 : 0.35} r={0.7} />
            </mesh>
            {royalCape && (
              <mesh ref={cape} position={[0, 1.0, -0.14]} rotation={[0.05, 0, 0]}>
                <planeGeometry args={[0.44, 0.95]} />
                <meshStandardMaterial color={shade(outfit, 0.75)} side={THREE.DoubleSide} roughness={0.85} />
              </mesh>
            )}
          </group>,
          mounts.chest
        )}

      {/* ───── sleeves and shoulder plates ───── */}
      {mounts.rArm &&
        createPortal(
          <group>
            {!bareArms && <Sleeve side={-1} color={outfit} pad={armored && !bareChest ? accent : undefined} />}
            {bareArms && armored && !bareChest && <Sleeve side={-1} color={skin} pad={accent} />}
          </group>,
          mounts.rArm
        )}
      {mounts.lArm &&
        createPortal(
          <group>
            {!bareArms && <Sleeve side={1} color={outfit} pad={armored && !bareChest ? accent : undefined} />}
            {bareArms && armored && !bareChest && <Sleeve side={1} color={skin} pad={accent} />}
          </group>,
          mounts.lArm
        )}

      {/* ───── head: face, hair, beard, crown / helmet / turban ───── */}
      {mounts.head &&
        createPortal(
          <group position={[0, headY, 0.045]} scale={HS}>
            {/* skull in the hero's own skin tone, so the face sits on a real head shape */}
            <mesh position={[0, 1.76, 0]} scale={[0.94, 1.12, 0.9]}>
              <sphereGeometry args={[0.17, 28, 20]} />
              <Mat c={skin} r={0.55} />
            </mesh>
            <HeadParts cfg={cfg} />
          </group>,
          mounts.head
        )}

      {/* ───── what they carry ───── */}
      {mounts.rHand &&
        createPortal(
          <group position={[0, -0.06, 0.02]} rotation={[-0.06, 0, 0]}>
            {w === "spear" && <Spear accent={accent} />}
            {w === "sword" && <Sword accent={accent} />}
            {w === "mace" && <Mace accent={accent} />}
            {w === "club" && <Club accent={accent} />}
          </group>,
          mounts.rHand
        )}
      {mounts.lHand &&
        createPortal(
          <group position={[0.1, -0.02, 0.1]}>
            {w === "shield" && <Shield accent={accent} outfit={outfit} />}
            {w === "bow" && <Bow />}
          </group>,
          mounts.lHand
        )}
    </group>
  );
}

useGLTF.preload(XBOT);

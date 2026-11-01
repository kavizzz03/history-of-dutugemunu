"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { STAGES, MARCH_STAGE_IDS, project } from "@/lib/journey";
import { MAHAWELI, PLACES, RIVER_LABEL } from "@/lib/places";
import { OUTLINE_XZ, colorAt, elevation, heightAt, insidePoly, lonLat, LAND_TOP } from "@/lib/terrain";
type Lang = "en" | "si";

const BG = "#07131c";
const PLACE_SYM: Record<string, string> = { gate: "⚔", tomb: "✦", stupa: "◉", tank: "≈" };
const SEA_Y = 0.14;

/* ───────── sea ───────── */
function Sea() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((s) => {
    if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, SEA_Y, 0]}>
      <planeGeometry args={[90, 90, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={`
          varying vec2 vUv; uniform float uTime;
          void main(){
            vec2 p = vUv*90.0;
            float w = sin(p.x*1.1+uTime*.7)+sin(p.y*1.5-uTime*.55)+sin((p.x+p.y)*.8+uTime*.45)+sin(length(p-45.0)*1.8-uTime*.9);
            w = w/4.0;
            vec3 deep = vec3(0.027,0.075,0.11);
            vec3 shallow = vec3(0.10,0.42,0.55);
            float d = length(vUv-.5)*2.0;
            float shore = smoothstep(0.0,0.5,d);
            vec3 c = mix(shallow,deep,smoothstep(0.08,0.62,d));
            c += 0.05*smoothstep(0.35,1.0,w) * (1.0-shore*0.8);
            c = mix(c, vec3(0.027,0.075,0.11), smoothstep(0.55,0.95,d));
            gl_FragColor = vec4(c,1.0);
            #include <colorspace_fragment>
          }`}
      />
    </mesh>
  );
}

/* ───────── land ───────── */
function Land() {
  const [land, shore] = useMemo(() => {
    const shape = new THREE.Shape(OUTLINE_XZ.map(([x, z]) => new THREE.Vector2(x, -z)));
    const a = new THREE.ExtrudeGeometry(shape, { depth: LAND_TOP - 0.01, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.03, bevelSegments: 2, curveSegments: 1 });
    a.rotateX(-Math.PI / 2);
    const b = new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false, curveSegments: 1 });
    b.rotateX(-Math.PI / 2);
    return [a, b];
  }, []);
  return (
    <group>
      <mesh geometry={land}>
        <meshStandardMaterial color="#4f8f46" roughness={0.95} />
      </mesh>
    </group>
  );
}

const _c = new THREE.Color();
const SAND: [number, number, number] = [0.86, 0.77, 0.56];

function Terrain() {
  const geo = useMemo(() => {
    const x0 = -7.6, x1 = 7.6, z0 = -12.4, z1 = 12.4, step = 0.07;
    const nx = Math.round((x1 - x0) / step), nz = Math.round((z1 - z0) / step);
    const W = nx + 1;
    const pos = new Float32Array(W * (nz + 1) * 3);
    const col = new Float32Array(W * (nz + 1) * 3);
    const ins = new Uint8Array(W * (nz + 1));
    for (let j = 0; j <= nz; j++) {
      for (let i = 0; i <= nx; i++) {
        const x = x0 + i * step, z = z0 + j * step;
        const k = j * W + i;
        const { lon, lat } = lonLat(x, z);
        const inside = insidePoly(x, z);
        ins[k] = inside ? 1 : 0;
        const e = elevation(lon, lat);
        // vertices just outside the coast dip under the water: a soft, natural beach
        pos[k * 3] = x;
        pos[k * 3 + 1] = inside ? LAND_TOP + e : SEA_Y - 0.07;
        pos[k * 3 + 2] = z;
        const c = inside ? colorAt(lon, lat, e) : SAND;
        _c.setRGB(c[0], c[1], c[2], THREE.SRGBColorSpace);
        col[k * 3] = _c.r; col[k * 3 + 1] = _c.g; col[k * 3 + 2] = _c.b;
      }
    }
    const idx: number[] = [];
    for (let j = 0; j < nz; j++) {
      for (let i = 0; i < nx; i++) {
        const a = j * W + i, b = a + 1, c = a + W, d = c + 1;
        if (ins[a] || ins[b] || ins[c] || ins[d]) idx.push(a, c, b, b, c, d);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} position={[0, 0.003, 0]}>
      <meshStandardMaterial vertexColors roughness={0.95} />
    </mesh>
  );
}

/* ───────── Mahaweli river ───────── */
function River() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  useFrame((st) => {
    if (mat.current) mat.current.uniforms.uTime.value = st.clock.elapsedTime;
  });
  const geo = useMemo(() => {
    const pts = MAHAWELI.map(([lo, la]) => {
      const [x, z] = project(lo, la);
      return new THREE.Vector3(x, 0, z);
    });
    const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    const N = 300;
    const pos: number[] = [], uv: number[] = [], idx: number[] = [];
    let rows = 0, dist = 0;
    let prev: THREE.Vector3 | null = null;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const c = curve.getPointAt(u);
      if (!insidePoly(c.x, c.z)) break; // stop at the coast
      const t = curve.getTangentAt(u);
      const nx = -t.z, nz = t.x;
      const w = 0.045 + 0.05 * u; // widens downstream
      const lx = c.x + nx * w, lz = c.z + nz * w, rx = c.x - nx * w, rz = c.z - nz * w;
      if (prev) dist += prev.distanceTo(c);
      prev = c;
      pos.push(lx, heightAt(lx, lz) + 0.035, lz, rx, heightAt(rx, rz) + 0.035, rz);
      uv.push(dist, 0, dist, 1);
      rows++;
    }
    for (let i = 0; i < rows - 1; i++) {
      const a = i * 2, b = a + 1, c2 = a + 2, d = a + 3;
      idx.push(a, c2, b, b, c2, d);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    return g;
  }, []);
  return (
    <mesh geometry={geo} renderOrder={2}>
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`}
        fragmentShader={`
          varying vec2 vUv; uniform float uTime;
          void main(){
            float edge = smoothstep(0.0,0.3,vUv.y)*smoothstep(1.0,0.7,vUv.y);
            float flow = sin(vUv.x*9.0 - uTime*2.4)*0.5+0.5;
            vec3 c = mix(vec3(0.10,0.50,0.85), vec3(0.62,0.88,1.0), flow*0.4);
            gl_FragColor = vec4(c, 0.35+0.6*edge);
            #include <colorspace_fragment>
          }`}
      />
    </mesh>
  );
}

/* ───────── route & army ───────── */
function useRoute() {
  return useMemo(() => {
    const nodes = MARCH_STAGE_IDS.map((id) => {
      const s = STAGES.find((st) => st.id === id)!;
      const [x, z] = project(s.lon, s.lat);
      return new THREE.Vector3(x, 0, z);
    });
    const flat = new THREE.CatmullRomCurve3(nodes, false, "centripetal");
    const N = 260;
    const dense: THREE.Vector3[] = [];
    for (let i = 0; i <= N; i++) {
      const p = flat.getPointAt(i / N);
      dense.push(new THREE.Vector3(p.x, heightAt(p.x, p.z) + 0.1, p.z));
    }
    const curve = new THREE.CatmullRomCurve3(dense, false, "centripetal");
    const fracs = nodes.map((n) => {
      let best = 0, bd = 1e9;
      dense.forEach((p, i) => {
        const d = (p.x - n.x) ** 2 + (p.z - n.z) ** 2;
        if (d < bd) { bd = d; best = i; }
      });
      return best / N;
    });
    return { curve, fracs };
  }, []);
}

const TUBE_SEG = 300, TUBE_RAD = 8;

function RouteTubes({ curve, progress }: { curve: THREE.CatmullRomCurve3; progress: React.MutableRefObject<number> }) {
  const full = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEG, 0.028, 6, false), [curve]);
  const done = useMemo(() => new THREE.TubeGeometry(curve, TUBE_SEG, 0.055, TUBE_RAD, false), [curve]);
  const doneRef = useRef<THREE.Mesh>(null);
  useFrame(() => {
    const m = doneRef.current;
    if (!m) return;
    const count = Math.floor(progress.current * TUBE_SEG) * TUBE_RAD * 6;
    m.geometry.setDrawRange(0, count);
  });
  return (
    <group>
      <mesh geometry={full}>
        <meshBasicMaterial color="#c9923a" transparent opacity={0.4} />
      </mesh>
      <mesh ref={doneRef} geometry={done}>
        <meshBasicMaterial color="#ffd34d" />
      </mesh>
    </group>
  );
}

const SOLDIERS = 32;

function Kandula() {
  const ivory = "#f6edd2";
  return (
    <group>
      {/* body */}
      <mesh position={[0, 0.3, 0]} scale={[0.2, 0.18, 0.32]}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#6c6c78" roughness={0.9} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.38, 0.3]}>
        <sphereGeometry args={[0.13, 14, 10]} />
        <meshStandardMaterial color="#6c6c78" roughness={0.9} />
      </mesh>
      {/* trunk */}
      <mesh position={[0, 0.2, 0.45]} rotation={[0.35, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.055, 0.3, 8]} />
        <meshStandardMaterial color="#6c6c78" roughness={0.9} />
      </mesh>
      {/* ears */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.15, 0.4, 0.22]} scale={[0.03, 0.12, 0.1]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#82828e" />
        </mesh>
      ))}
      {/* tusks */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.07, 0.28, 0.42]} rotation={[Math.PI / 2 - 0.5, 0, s * 0.18]}>
          <coneGeometry args={[0.022, 0.2, 8]} />
          <meshStandardMaterial color={ivory} />
        </mesh>
      ))}
      {/* legs */}
      {[[-0.1, 0.18], [0.1, 0.18], [-0.1, -0.16], [0.1, -0.16]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.09, z]}>
          <cylinderGeometry args={[0.04, 0.045, 0.2, 8]} />
          <meshStandardMaterial color="#5f5f6b" />
        </mesh>
      ))}
      {/* caparison + forehead plate */}
      <mesh position={[0, 0.46, -0.02]} scale={[0.24, 0.025, 0.3]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#a51f2d" />
      </mesh>
      <mesh position={[0, 0.5, 0.34]} rotation={[0.6, 0, 0]}>
        <planeGeometry args={[0.12, 0.1]} />
        <meshStandardMaterial color="#f0b429" side={THREE.DoubleSide} emissive="#f0b429" emissiveIntensity={0.4} />
      </mesh>
      {/* the king */}
      <mesh position={[0, 0.58, -0.02]}>
        <coneGeometry args={[0.07, 0.16, 8]} />
        <meshStandardMaterial color="#8f1d1d" />
      </mesh>
      <mesh position={[0, 0.7, -0.02]}>
        <sphereGeometry args={[0.04, 10, 8]} />
        <meshStandardMaterial color="#c68642" />
      </mesh>
      <mesh position={[0, 0.76, -0.02]}>
        <coneGeometry args={[0.04, 0.05, 6]} />
        <meshStandardMaterial color="#ffd34d" emissive="#ffd34d" emissiveIntensity={0.5} />
      </mesh>
      {/* relic spear */}
      <mesh position={[0.08, 0.78, 0.0]}>
        <cylinderGeometry args={[0.007, 0.007, 0.5, 6]} />
        <meshStandardMaterial color="#5b3b24" />
      </mesh>
      <mesh position={[0.08, 1.06, 0.0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#fff3b0" />
      </mesh>
    </group>
  );
}

function Army({ curve, fracs, stageIdx, progress }: { curve: THREE.CatmullRomCurve3; fracs: number[]; stageIdx: number; progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const bodies = useRef<THREE.InstancedMesh>(null);
  const heads = useRef<THREE.InstancedMesh>(null);
  const spears = useRef<THREE.InstancedMesh>(null);
  const flags = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const form = useMemo(
    () =>
      Array.from({ length: SOLDIERS }, (_, i) => {
        const row = Math.floor(i / 4), colI = i % 4;
        return { x: (colI - 1.5) * 0.15 + (row % 2 ? 0.04 : -0.02), z: -0.62 - row * 0.17, ph: i * 0.9 };
      }),
    []
  );
  useLayoutEffect(() => {
    const cols = ["#9c2a2a", "#c9a24a", "#e8e0c9", "#7a3b1d"];
    if (bodies.current) form.forEach((_, i) => bodies.current!.setColorAt(i, new THREE.Color(cols[i % 4])));
    if (bodies.current?.instanceColor) bodies.current.instanceColor.needsUpdate = true;
  }, [form]);

  const target = STAGES[stageIdx]?.army ? fracs[STAGES[stageIdx].marchNode] : fracs[0];
  const tgt = useRef(target);
  tgt.current = target;
  const moving = useRef(false);
  const tmpP = useMemo(() => new THREE.Vector3(), []);
  const tmpT = useMemo(() => new THREE.Vector3(), []);

  useFrame((s, dt) => {
    const diff = tgt.current - progress.current;
    moving.current = Math.abs(diff) > 0.003;
    const maxStep = dt * 0.09;
    progress.current += Math.sign(diff) * Math.min(Math.abs(diff), Math.max(maxStep, Math.abs(diff) * dt * 1.1));
    const p = Math.min(0.999, Math.max(0.001, progress.current));
    curve.getPointAt(p, tmpP);
    curve.getTangentAt(p, tmpT);
    const g = group.current;
    if (!g) return;
    g.position.copy(tmpP);
    const yaw = Math.atan2(tmpT.x, tmpT.z);
    g.rotation.y += (Math.atan2(Math.sin(yaw - g.rotation.y), Math.cos(yaw - g.rotation.y))) * Math.min(1, dt * 6);
    const t = s.clock.elapsedTime;
    const amp = moving.current ? 1 : 0.15;
    g.position.y += Math.abs(Math.sin(t * 5)) * 0.025 * amp;
    form.forEach((f, i) => {
      const bob = Math.abs(Math.sin(t * 8 + f.ph)) * 0.035 * amp;
      dummy.rotation.set(0, 0, 0);
      dummy.position.set(f.x, 0.085 + bob, f.z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      bodies.current?.setMatrixAt(i, dummy.matrix);
      dummy.position.set(f.x, 0.2 + bob, f.z);
      dummy.updateMatrix();
      heads.current?.setMatrixAt(i, dummy.matrix);
      dummy.position.set(f.x + 0.06, 0.2 + bob, f.z);
      dummy.rotation.set(0.08, 0, -0.06);
      dummy.updateMatrix();
      spears.current?.setMatrixAt(i, dummy.matrix);
    });
    [bodies, heads, spears].forEach((r) => r.current && (r.current.instanceMatrix.needsUpdate = true));
    if (flags.current) flags.current.children.forEach((c, i) => (c.rotation.y = Math.sin(t * 3 + i) * 0.25));
  });

  const visible = STAGES[stageIdx]?.army ?? false;
  return (
    <group ref={group} visible={visible} scale={stageIdx === 7 ? 0.5 : 1.25}>
      <Kandula />
      <instancedMesh ref={bodies} args={[undefined, undefined, SOLDIERS]}>
        <coneGeometry args={[0.058, 0.17, 7]} />
        <meshStandardMaterial roughness={0.8} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, SOLDIERS]}>
        <sphereGeometry args={[0.036, 8, 6]} />
        <meshStandardMaterial color="#c68642" />
      </instancedMesh>
      <instancedMesh ref={spears} args={[undefined, undefined, SOLDIERS]}>
        <cylinderGeometry args={[0.006, 0.006, 0.36, 5]} />
        <meshStandardMaterial color="#6b4a2a" />
      </instancedMesh>
      <group ref={flags}>
        {[-0.3, 0.3].map((x, i) => (
          <group key={i} position={[x, 0.45, -0.5 - i * 0.5]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.9, 5]} />
              <meshStandardMaterial color="#5b3b24" />
            </mesh>
            <mesh position={[0.1, 0.3, 0]}>
              <planeGeometry args={[0.2, 0.14]} />
              <meshStandardMaterial color="#a51f2d" side={THREE.DoubleSide} emissive="#a51f2d" emissiveIntensity={0.25} />
            </mesh>
            <mesh position={[0.1, 0.3, 0.002]}>
              <circleGeometry args={[0.035, 12]} />
              <meshBasicMaterial color="#ffd34d" side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* golden boat of Viharamahadevi, drifting on the sea */
function Boat({ visible }: { visible: boolean }) {
  const g = useRef<THREE.Group>(null);
  const curve = useMemo(() => {
    const ll: [number, number][] = [[79.84, 6.97], [79.62, 6.5], [79.66, 6.1], [80.0, 5.72], [80.6, 5.62], [81.1, 5.78], [81.4, 6.08], [81.38, 6.2]];
    const pts = ll.map(([lo, la]) => {
      const [x, z] = project(lo, la);
      return new THREE.Vector3(x, SEA_Y + 0.02, z);
    });
    return new THREE.CatmullRomCurve3(pts, false, "centripetal");
  }, []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const tg = useMemo(() => new THREE.Vector3(), []);
  useFrame((s) => {
    if (!g.current) return;
    const u = (s.clock.elapsedTime * 0.04) % 1;
    curve.getPointAt(u, p);
    curve.getTangentAt(u, tg);
    g.current.position.set(p.x, p.y + Math.sin(s.clock.elapsedTime * 2) * 0.02, p.z);
    g.current.rotation.y = Math.atan2(tg.x, tg.z);
    g.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.6) * 0.08;
  });
  return (
    <group ref={g} visible={visible} scale={1.4}>
      <mesh scale={[0.1, 0.07, 0.24]} rotation={[0, 0, 0]} position={[0, 0.03, 0]}>
        <sphereGeometry args={[1, 14, 10, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#f0b429" metalness={0.6} roughness={0.3} side={THREE.DoubleSide} emissive="#a86a00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <coneGeometry args={[0.035, 0.1, 8]} />
        <meshStandardMaterial color="#c2417a" />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color="#c68642" />
      </mesh>
      <pointLight position={[0, 0.25, 0]} color="#ffcf66" intensity={1.2} distance={2} />
    </group>
  );
}

/* sacred city */
function Anuradhapura() {
  const [x, z] = project(80.4037, 8.3114);
  const y = heightAt(x, z);
  const dome = (r: number, px: number, pz: number, k: string) => (
    <group key={k} position={[px, 0, pz]}>
      <mesh>
        <sphereGeometry args={[r, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fbf6e8" roughness={0.6} />
      </mesh>
      <mesh position={[0, r + 0.02, 0]}>
        <boxGeometry args={[r * 0.28, r * 0.2, r * 0.28]} />
        <meshStandardMaterial color="#fbf6e8" />
      </mesh>
      <mesh position={[0, r + 0.12 + r * 0.25, 0]}>
        <coneGeometry args={[r * 0.12, r * 0.9, 8]} />
        <meshStandardMaterial color="#ffd34d" emissive="#c58a12" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
  return (
    <group position={[x, y, z]}>
      {dome(0.2, 0, 0, "ruwan")}
      {dome(0.13, -0.38, 0.2, "miris")}
      {dome(0.09, 0.34, 0.22, "lohapasada")}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.62, 0.67, 40]} />
        <meshBasicMaterial color="#f3e5b0" transparent opacity={0.7} />
      </mesh>
      {/* Elara's tomb: a low mound with a slab */}
      <group position={[0.56, 0, -0.34]}>
        <mesh>
          <sphereGeometry args={[0.065, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#9a9ca6" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.03, 0.08, 0.012]} />
          <meshStandardMaterial color="#d6d3c8" />
        </mesh>
      </group>
      {/* Tissa Wewa */}
      <mesh rotation-x={-Math.PI / 2} position={[-0.62, 0.008, 0.55]} scale={[1, 0.62, 1]}>
        <circleGeometry args={[0.24, 28]} />
        <meshStandardMaterial color="#3aa7d9" roughness={0.25} metalness={0.2} />
      </mesh>
      {/* southern gate: two towers, a lintel and the open passage */}
      <group position={[0, 0, 0.645]}>
        {[-0.075, 0.075].map((x) => (
          <mesh key={x} position={[x, 0.07, 0]}>
            <boxGeometry args={[0.06, 0.14, 0.07]} />
            <meshStandardMaterial color="#c9bfa6" roughness={0.9} />
          </mesh>
        ))}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.07]} />
          <meshStandardMaterial color="#b8ad92" />
        </mesh>
      </group>
    </group>
  );
}

/* ───────── markers ───────── */
const KIND_COLOR: Record<string, string> = {
  origin: "#4cc9f0", base: "#ffd34d", exile: "#b794f4", battle: "#ff6b57", siege: "#ff3d2e", capital: "#ffd34d",
};

function Marker({ i, active, lang, onSelect }: { i: number; active: boolean; lang: Lang; onSelect: (i: number) => void }) {
  const s = STAGES[i];
  const [x, z] = project(s.lon, s.lat);
  const y = s.kind === "origin" ? SEA_Y + 0.15 : heightAt(x, z);
  const ring = useRef<THREE.Mesh>(null);
  const color = KIND_COLOR[s.kind];
  useFrame((st) => {
    if (!ring.current) return;
    const t = (st.clock.elapsedTime * 0.8) % 1;
    const k = active ? 1 + t * 1.6 : 1;
    ring.current.scale.set(k, k, k);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = active ? 0.75 * (1 - t) : 0.35;
  });
  return (
    <group
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(i);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.6, 6]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.64, 0]}>
        <octahedronGeometry args={[active ? 0.12 : 0.085, 0]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ring} rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.18, 0.24, 28]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ───────── pin labels: plain DOM overlay (avoids drei <Html>'s extra React roots) ───────── */
function LabelProjector({
  labels,
  extra,
  showCity,
}: {
  labels: React.MutableRefObject<(HTMLDivElement | null)[]>;
  extra: React.MutableRefObject<(HTMLDivElement | null)[]>;
  showCity: React.MutableRefObject<boolean>;
}) {
  const v = useMemo(() => new THREE.Vector3(), []);
  const anchors = useMemo(
    () =>
      STAGES.map((s) => {
        const [x, z] = project(s.lon, s.lat);
        const y = s.kind === "origin" ? SEA_Y + 0.15 : heightAt(x, z);
        return new THREE.Vector3(x, y + 0.95, z);
      }),
    []
  );
  const extras = useMemo(() => {
    const [rx, rz] = project(RIVER_LABEL.at[0], RIVER_LABEL.at[1]);
    const out = [new THREE.Vector3(rx, heightAt(rx, rz) + 0.35, rz)];
    const [cx, cz] = project(80.4037, 8.3114);
    const cy = heightAt(cx, cz);
    PLACES.forEach((p) => out.push(new THREE.Vector3(cx + p.off[0], cy + (p.id === "ruwanwelisaya" ? 0.62 : 0.3), cz + p.off[1])));
    return out;
  }, []);
  const place = (el: HTMLDivElement | null, a: THREE.Vector3, camera: THREE.Camera, w: number, h: number, hide = false) => {
    if (!el) return;
    v.copy(a).project(camera);
    const on = !hide && v.z > -1 && v.z < 1;
    el.style.visibility = on ? "visible" : "hidden";
    if (!on) return;
    el.style.transform = `translate3d(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px, 0) translate(-50%, -50%)`;
    el.style.zIndex = String(Math.round((1 - v.z) * 1000));
  };
  useFrame(({ camera, size }) => {
    anchors.forEach((a, i) => place(labels.current[i], a, camera, size.width, size.height, i === 7 && showCity.current));
    extras.forEach((a, i) => place(extra.current[i], a, camera, size.width, size.height, i > 0 && !showCity.current));
  });
  return null;
}

/* ───────── camera ───────── */
function CameraRig({ active, aspect }: { active: number; aspect: number }) {
  const t = useRef(1);
  const controls = useThree((s) => s.controls) as unknown as { target: THREE.Vector3; update: () => void } | null;
  const camera = useThree((s) => s.camera);
  const goal = useMemo(() => {
    if (active < 0) {
      const k = aspect < 1.1 ? 1.35 : 1;
      return { target: new THREE.Vector3(0, 0, 0.3), pos: new THREE.Vector3(0, 25 * k, 12 * k) };
    }
    const s = STAGES[active];
    const [x, z] = project(s.lon, s.lat);
    const y = heightAt(x, z);
    const city = active === 7 || active === 8;
    const k = aspect < 1.1 ? 1.5 : 1;
    // lean in on the sacred city from a steeper angle so the army column doesn't hide it
    if (city) return { target: new THREE.Vector3(x, y, z + 0.1), pos: new THREE.Vector3(x, y + 2.8 * k, z + 1.5 * k) };
    return { target: new THREE.Vector3(x, y, z), pos: new THREE.Vector3(x, y + 5.2 * k, z + 6.4 * k) };
  }, [active, aspect]);
  useEffect(() => {
    t.current = 1;
  }, [goal]);
  useFrame((_, dt) => {
    if (!controls) return;
    if (t.current > 0) {
      const k = 1 - Math.exp(-dt * 3.2);
      controls.target.lerp(goal.target, k);
      camera.position.lerp(goal.pos, k);
      t.current -= dt / 2.4;
    }
    controls.update();
  });
  return null;
}

function Scene({ active, lang, onSelect, labels, extra, showCity }: { active: number; lang: Lang; onSelect: (i: number) => void; labels: React.MutableRefObject<(HTMLDivElement | null)[]>; extra: React.MutableRefObject<(HTMLDivElement | null)[]>; showCity: React.MutableRefObject<boolean> }) {
  const { curve, fracs } = useRoute();
  const progress = useRef(0);
  const size = useThree((s) => s.size);
  const activeKey = active >= 0 ? `${STAGES[active].lat},${STAGES[active].lon}` : "";
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 38, 80]} />
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#bfe3ff", "#3a2a18", 0.55]} />
      <directionalLight position={[9, 16, 7]} intensity={1.9} color="#ffe9c2" />
      <Stars radius={90} depth={20} count={900} factor={3} fade speed={0.5} />
      <Sea />
      <Land />
      <Terrain />
      <River />
      <RouteTubes curve={curve} progress={progress} />
      <Anuradhapura />
      <Boat visible={active <= 1} />
      <Army curve={curve} fracs={fracs} stageIdx={active < 0 ? 1 : active} progress={progress} />
      {STAGES.map((s, i) => {
        if (i === 8) return null; // same place as stage 7
        const isActive = activeKey === `${s.lat},${s.lon}`;
        return <Marker key={s.id} i={i} active={isActive} lang={lang} onSelect={onSelect} />;
      })}
      <OrbitControls makeDefault enableDamping dampingFactor={0.08} minDistance={3} maxDistance={42} maxPolarAngle={1.32} enablePan={false} />
      <CameraRig active={active} aspect={size.width / size.height} />
      <LabelProjector labels={labels} extra={extra} showCity={showCity} />
    </>
  );
}

export default function Map3D({ active, lang, onSelect, running = true }: { active: number; lang: Lang; onSelect: (i: number) => void; running?: boolean }) {
  const [ready, setReady] = useState(false);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const extra = useRef<(HTMLDivElement | null)[]>([]);
  const showCity = useRef(false);
  showCity.current = active === 7 || active === 8;
  const activeKey = active >= 0 ? `${STAGES[active].lat},${STAGES[active].lon}` : "";
  return (
    <div className="map-canvas-wrap" data-ready={ready}>
      <Canvas
        camera={{ position: [0, 25, 12], fov: 42, near: 0.1, far: 200 }}
        dpr={[1, 1.75]}
        frameloop={running ? "always" : "never"}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        onCreated={() => setReady(true)}
      >
        <Scene active={active} lang={lang} onSelect={onSelect} labels={labels} extra={extra} showCity={showCity} />
      </Canvas>
      <div className="map-labels" aria-hidden>
        {STAGES.map((s, i) =>
          i === 8 ? null : (
            <div key={s.id} className="map-label-anchor" ref={(el) => { labels.current[i] = el; }}>
              <div className={`map-label ${activeKey === `${s.lat},${s.lon}` ? "active" : ""}`} data-kind={s.kind}>
                <span className="map-label-num">{i + 1}</span>
                <span>{s.place[lang]}</span>
              </div>
            </div>
          )
        )}
        <div className="map-label-anchor" ref={(el) => { extra.current[0] = el; }}>
          <div className="map-label river">
            <span className="map-label-num">≈</span>
            <span>{RIVER_LABEL.name[lang]}</span>
          </div>
        </div>
        {PLACES.map((p, j) => (
          <div key={p.id} className="map-label-anchor" ref={(el) => { extra.current[j + 1] = el; }}>
            <div className={`map-label place k-${p.kind}`}>
              <span className="map-label-num">{PLACE_SYM[p.kind]}</span>
              <span>{p.name[lang]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

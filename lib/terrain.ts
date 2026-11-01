import raw from "./lk-outline.json";
import { CENTER, UNIT, project } from "./journey";

type P = [number, number];

/** Chaikin corner-cutting: turns the 76-point coast into a soft, natural outline */
function chaikin(pts: P[], iter = 2): P[] {
  let cur = pts.slice();
  if (cur.length > 1 && cur[0][0] === cur[cur.length - 1][0] && cur[0][1] === cur[cur.length - 1][1]) cur.pop();
  for (let k = 0; k < iter; k++) {
    const next: P[] = [];
    for (let i = 0; i < cur.length; i++) {
      const a = cur[i], b = cur[(i + 1) % cur.length];
      next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      next.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    cur = next;
  }
  return cur;
}

export const OUTLINE_LONLAT = chaikin(raw as P[], 2);
export const OUTLINE_XZ: P[] = OUTLINE_LONLAT.map(([lo, la]) => project(lo, la));

export function insidePoly(x: number, z: number, poly: P[] = OUTLINE_XZ) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/* cheap smooth value-noise */
const hash = (i: number, j: number) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
function vnoise(x: number, y: number) {
  const i = Math.floor(x), j = Math.floor(y);
  const fx = x - i, fy = y - j;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number) {
  return vnoise(x, y) * 0.55 + vnoise(x * 2.1, y * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3) * 0.15;
}

/* central highlands: Pidurutalagala, Adam's Peak, Horton Plains, Knuckles … */
const PEAKS: [number, number, number, number][] = [
  [80.77, 7.0, 0.33, 1.0],
  [80.5, 6.85, 0.2, 0.95],
  [80.85, 6.78, 0.28, 0.85],
  [80.78, 7.42, 0.22, 0.55],
  [80.62, 7.2, 0.3, 0.45],
  [81.05, 6.95, 0.25, 0.4],
  [80.35, 6.6, 0.35, 0.2],
];

export function elevation(lon: number, lat: number) {
  let e = 0;
  for (const [pl, pa, s, a] of PEAKS) {
    const dx = lon - pl, dy = lat - pa;
    e += a * Math.exp(-(dx * dx + dy * dy) / (2 * s * s));
  }
  const n = fbm(lon * 7.5, lat * 7.5) - 0.5;
  return Math.max(0, e * 0.8 + n * (0.04 + e * 0.16) + 0.012);
}

export const LAND_TOP = 0.31;

export function lonLat(x: number, z: number) {
  return { lon: x / (UNIT * 0.99) + CENTER.lon, lat: CENTER.lat - z / UNIT };
}

export function heightAt(x: number, z: number) {
  const { lon, lat } = lonLat(x, z);
  return LAND_TOP + elevation(lon, lat);
}

/* vertex colour by elevation + dry-zone tint */
const C = (h: string) => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i] - v) * t);
const LOW = C("#4f8f46"), DRY = C("#a3a456"), FOREST = C("#2f6a3a"), HILL = C("#7d6c4f"), PEAK = C("#b4ab95");
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function colorAt(lon: number, lat: number, e: number) {
  const dry = Math.max(smooth(7.7, 8.7, lat), smooth(81.2, 81.7, lon) * 0.7) * 0.75;
  let c = mix(LOW, DRY, dry * (1 - smooth(0.15, 0.5, e)));
  c = mix(c, FOREST, smooth(0.08, 0.32, e));
  c = mix(c, HILL, smooth(0.38, 0.65, e));
  c = mix(c, PEAK, smooth(0.7, 0.95, e));
  const n = (fbm(lon * 22, lat * 22) - 0.5) * 0.12;
  return c.map((v) => Math.min(1, Math.max(0, v + n)));
}

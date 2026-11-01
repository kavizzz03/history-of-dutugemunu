"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { BEATS, DUEL_UI, DURATION } from "@/lib/duel";
import Reveal from "./Reveal";

/* ───────── tiny animation helpers ───────── */
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
const eIO = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
const eI = (u: number) => u * u * u;
const eO = (u: number) => 1 - Math.pow(1 - u, 3);
const bump = (u: number) => Math.sin(Math.PI * u);

const W = 960, H = 440, GY = 372; // scene size, ground line
const SK = 0.82, SE = 0.9; // elephant scales: Kandula, Maha Pabbata

/* ───────── the timeline: where everything is at time t ───────── */
const kandulaX = (t: number) => {
  if (t < 3.6) return lerp(100, 240, eIO(seg(t, 0, 3.6)));
  if (t < 6.4) return 240 - 22 * bump(seg(t, 4.3, 5.7));
  if (t < 8.3) return lerp(240, 402, eI(seg(t, 6.4, 8.3)));
  return lerp(402, 392, eO(seg(t, 8.3, 9.4)));
};
const elaraX = (t: number) => {
  if (t < 3.6) return lerp(870, 720, eIO(seg(t, 0, 3.6)));
  if (t < 8.3) return 720;
  if (t < 11.6) return lerp(720, 765, eO(seg(t, 8.3, 9.4)));
  return lerp(765, 1320, eI(seg(t, 11.6, 14.6)));
};
const speed = (f: (t: number) => number, t: number) => Math.abs(f(t + 0.04) - f(t - 0.04)) / 0.08;

/* Elara's javelin: a high arc that skims over the ducking king and sticks in the ground behind Kandula */
const T_ELARA_THROW = 4.3, T_ELARA_LAND = 5.25;
const ELARA_JAV = { p0: [690, 160], p1: [250, -40], p2: [62, 368] };
const bez = (u: number, a: number[], b: number[], c: number[]) => {
  const m = 1 - u;
  const x = m * m * a[0] + 2 * m * u * b[0] + u * u * c[0];
  const y = m * m * a[1] + 2 * m * u * b[1] + u * u * c[1];
  const dx = 2 * m * (b[0] - a[0]) + 2 * u * (c[0] - b[0]);
  const dy = 2 * m * (b[1] - a[1]) + 2 * u * (c[1] - b[1]);
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
};

/* the king's javelin: a flat, fast throw into Elara's chest */
const T_DUTU_THROW = 10.2, T_DUTU_HIT = 10.6;

/* Elara's fall */
const T_FALL = 11.2;
const FALL_SEAT = { x: 765 - 4 * SE, y: GY - 182 * SE };
const FALL_LAND_T = Math.sqrt((2 * (GY - 8 - FALL_SEAT.y)) / 1100);
const LAND_X = FALL_SEAT.x + 60 * FALL_LAND_T;

/* ───────── drawing pieces ───────── */
function Javelin({ len = 126, tail = 30 }: { len?: number; tail?: number }) {
  return (
    <g>
      <line x1={-tail} y1={0} x2={len - 30} y2={0} stroke="#6b4a2a" strokeWidth={3.6} strokeLinecap="round" />
      <path d={`M${len - 30} -4.5 L${len - 8} 0 L${len - 30} 4.5 Z`} fill="#d9e0ea" stroke="#6b7280" strokeWidth={0.8} />
      <path d={`M${len - 46} -3.5 L${len - 34} 0 L${len - 46} 3.5 Z`} fill="#a51f2d" />
      <path d={`M${-tail} 0 l-8 -6 l4 6 l-4 6 Z`} fill="#e9d9b0" />
    </g>
  );
}

type Pal = { skin: string; shade: string; ear: string; cap: string; cap2: string; tusk: string; id: string };
const KANDULA: Pal = { skin: "#7b8190", shade: "#5c6270", ear: "#9a8f9c", cap: "#a51f2d", cap2: "#f0b429", tusk: "#f6edd2", id: "k" };
const PABBATA: Pal = { skin: "#565b66", shade: "#3d414b", ear: "#7a6f78", cap: "#1f6f78", cap2: "#d9dde4", tusk: "#e8dfc4", id: "e" };

function Leg({ x, ang, fill, h = 84 }: { x: number; ang: number; fill: string; h?: number }) {
  return (
    <g transform={`translate(${x} -80) rotate(${ang})`}>
      <rect x={-15} y={0} width={30} height={h} rx={13} fill={fill} />
      <ellipse cx={0} cy={h} rx={18} ry={8} fill="#2a2a30" opacity={0.55} />
      <path d={`M-13 ${h - 5} q13 8 26 0`} stroke="#d9cdb3" strokeWidth={3} fill="none" opacity={0.7} />
    </g>
  );
}

function Elephant({
  pal, x, s, flip, phase, amp, dip, trunk, tilt, bob, flap,
}: {
  pal: Pal; x: number; s: number; flip: boolean; phase: number; amp: number; dip: number; trunk: number; tilt: number; bob: number; flap: number;
}) {
  const a = (o: number) => Math.sin(phase + o) * (3 + 16 * amp);
  const trunkAng = -150 * trunk + Math.sin(phase * 0.5) * 3;
  return (
    <g transform={`translate(${x} ${GY + bob}) rotate(${tilt}) scale(${flip ? -s : s} ${s})`}>
      <defs>
        <linearGradient id={`sk-${pal.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={pal.skin} />
          <stop offset="1" stopColor={pal.shade} />
        </linearGradient>
      </defs>
      <ellipse cx={20} cy={4} rx={150} ry={12} fill="#000" opacity={0.28} />
      {/* far legs */}
      <Leg x={-40} ang={a(Math.PI)} fill={pal.shade} />
      <Leg x={74} ang={a(0)} fill={pal.shade} />
      {/* tail */}
      <path d={`M-104 -146 C-124 -126 -128 -96 -120 ${-64 + Math.sin(phase) * 4}`} stroke={pal.shade} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={`M-120 ${-64 + Math.sin(phase) * 4} l-6 14 M-120 ${-64 + Math.sin(phase) * 4} l2 16 M-120 ${-64 + Math.sin(phase) * 4} l8 12`} stroke="#2a2a30" strokeWidth={3} strokeLinecap="round" />
      {/* body */}
      <ellipse cx={0} cy={-125} rx={110} ry={61} fill={`url(#sk-${pal.id})`} />
      <path d="M-70 -96 C-20 -78 40 -80 84 -100" stroke={pal.shade} strokeWidth={5} fill="none" opacity={0.35} />
      {/* caparison */}
      <path d="M-86 -178 Q0 -198 82 -174 L96 -98 Q0 -84 -100 -96 Z" fill={pal.cap} stroke={pal.cap2} strokeWidth={4} />
      <path d="M-100 -96 Q0 -84 96 -98" stroke={pal.cap2} strokeWidth={7} fill="none" strokeDasharray="5 4" />
      <path d="M-60 -170 Q0 -184 60 -168 L66 -128 Q0 -118 -66 -128 Z" fill="none" stroke={pal.cap2} strokeWidth={2} opacity={0.8} />
      <circle cx={0} cy={-148} r={9} fill={pal.cap2} />
      <circle cx={0} cy={-148} r={4} fill={pal.cap} />
      {/* seat pad */}
      <ellipse cx={4} cy={-182} rx={34} ry={7} fill={pal.cap2} stroke="#8a6a1a" strokeWidth={1.5} />
      {/* near legs */}
      <Leg x={-70} ang={a(0.6)} fill={`url(#sk-${pal.id})`} />
      <Leg x={44} ang={a(Math.PI + 0.6)} fill={`url(#sk-${pal.id})`} />
      {/* head, ear, trunk and tusks swing together from the neck */}
      <g transform={`rotate(${dip} 76 -140)`}>
        <g transform={`rotate(${trunkAng} 138 -128)`}>
          <path d="M138 -128 C168 -112 176 -70 166 -36 C162 -22 172 -14 184 -22" stroke={`url(#sk-${pal.id})`} strokeWidth={30} fill="none" strokeLinecap="round" />
          <path d="M138 -128 C168 -112 176 -70 166 -36" stroke={pal.shade} strokeWidth={2} fill="none" opacity={0.4} strokeDasharray="3 7" />
        </g>
        <ellipse cx={116} cy={-148} rx={52} ry={54} fill={`url(#sk-${pal.id})`} />
        {/* ivory tusk */}
        <path d="M132 -118 C170 -112 206 -124 232 -156 C208 -112 172 -98 134 -102 Z" fill={pal.tusk} stroke="#bfb08a" strokeWidth={1} />
        {/* forehead plate */}
        <path d="M108 -196 Q142 -188 150 -150 Q128 -140 104 -152 Z" fill={pal.cap2} stroke="#8a6a1a" strokeWidth={1.5} />
        <circle cx={128} cy={-170} r={6} fill={pal.cap} />
        <circle cx={137} cy={-160} r={3.4} fill="#2a2a30" />
        <circle cx={138.2} cy={-161.2} r={1.1} fill="#fff" />
        {/* ear */}
        <g transform={`rotate(${flap} 96 -170)`}>
          <ellipse cx={84} cy={-140} rx={36} ry={52} fill={pal.skin} stroke={pal.shade} strokeWidth={2} />
          <ellipse cx={84} cy={-138} rx={24} ry={38} fill={pal.ear} opacity={0.75} />
        </g>
      </g>
    </g>
  );
}

type RiderProps = {
  x: number; y: number; rot: number; sc: number; flip: boolean;
  arm: number; hasJav: boolean; impaled?: boolean; king: "dutu" | "elara";
};
function Rider({ x, y, rot, sc, flip, arm, hasJav, impaled, king }: RiderProps) {
  const dutu = king === "dutu";
  const garment = dutu ? "#8f1d1d" : "#1f5a63";
  const sash = dutu ? "#f0b429" : "#d9dde4";
  const skin = dutu ? "#b0703f" : "#9a6a45";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -sc : sc} ${sc})`}>
      <path d="M-16 -2 C-6 8 26 6 36 -4 L31 -13 C16 -8 4 -10 -16 -14 Z" fill={dutu ? "#e9d9b0" : "#cfd6df"} stroke="#6b5a3a" strokeWidth={1} />
      <path d="M0 -50 L22 -34" stroke={skin} strokeWidth={7} strokeLinecap="round" />
      <path d="M-15 -4 L-13 -58 Q1 -67 16 -58 L18 -4 Z" fill={garment} />
      <path d="M-15 -26 L18 -42" stroke={sash} strokeWidth={8} />
      <circle cx={2} cy={-30} r={3} fill={sash} />
      <circle cx={3} cy={-76} r={12.5} fill={skin} />
      <circle cx={9} cy={-78} r={1.7} fill="#1b1209" />
      <path d={dutu ? "M5 -72 q5 3 11 -1" : "M5 -72 q5 2 10 -1"} stroke="#1b1209" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      {!dutu && <path d="M-1 -70 Q5 -50 17 -70 Q9 -64 -1 -70 Z" fill="#e6e6ea" />}
      {dutu ? (
        <g>
          <path d="M-9 -86 L-7 -101 L-1 -92 L4 -105 L9 -92 L15 -101 L16 -86 Z" fill="#f0b429" stroke="#a8761a" strokeWidth={1} />
          <circle cx={4} cy={-95} r={2.2} fill="#ff4d5a" />
        </g>
      ) : (
        <g>
          <ellipse cx={3} cy={-88} rx={16} ry={9} fill="#e8f1f2" stroke="#9fb4b8" strokeWidth={1} />
          <path d="M10 -94 q10 -14 22 -5" stroke="#1f6f78" strokeWidth={3} fill="none" strokeLinecap="round" />
          <circle cx={4} cy={-90} r={2.4} fill="#1f6f78" />
        </g>
      )}
      <g transform={`rotate(${arm} 4 -52)`}>
        <path d="M4 -52 L34 -52" stroke={skin} strokeWidth={8} strokeLinecap="round" />
        <circle cx={36} cy={-52} r={5} fill={skin} />
        {hasJav && <Javelin />}
      </g>
      {impaled && (
        <g transform="translate(6 -40) rotate(-14)">
          <line x1={0} y1={0} x2={64} y2={0} stroke="#6b4a2a" strokeWidth={3.6} strokeLinecap="round" />
          <path d="M64 0 l-9 -5 l4 5 l-4 5 Z" fill="#e9d9b0" />
          <path d="M72 0 l-10 -6 l4 6 l-4 6 Z" fill="#a51f2d" />
        </g>
      )}
    </g>
  );
}

function Soldier({ x, y, s, body, bob, spear, banner }: { x: number; y: number; s: number; body: string; bob: number; spear: number; banner?: boolean }) {
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <path d="M-7 0 L7 0 L5 -24 L-5 -24 Z" fill={body} />
      <circle cx={0} cy={-30} r={5.5} fill="#a8683a" />
      <path d="M-6 -33 Q0 -41 6 -33 Z" fill="#2b2118" />
      <line x1={9} y1={0} x2={9 + spear * 6} y2={-46} stroke="#6b4a2a" strokeWidth={2} />
      <path d={`M${9 + spear * 6} -46 l-2 -7 l4 0 Z`} fill="#cfd6df" />
      {banner && null}
    </g>
  );
}

function Banner({ x, y, h, color, trim, wave, lower, dir }: { x: number; y: number; h: number; color: string; trim: string; wave: number; lower: number; dir: 1 | -1 }) {
  const w1 = Math.sin(wave) * 3, w2 = Math.sin(wave + 1.4) * 3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${dir * 58 * lower})`}>
      <line x1={0} y1={0} x2={0} y2={-h} stroke="#5b3b24" strokeWidth={3} strokeLinecap="round" />
      <path d={`M0 ${-h} C10 ${-h - 4 + w1} 22 ${-h + 4 + w2} 36 ${-h} L36 ${-h + 22} C22 ${-h + 26 + w2} 10 ${-h + 18 + w1} 0 ${-h + 22} Z`} fill={color} stroke={trim} strokeWidth={1.4} />
      <circle cx={17} cy={-h + 11} r={4.5} fill={trim} />
    </g>
  );
}

function Flames({ x, y, t, k }: { x: number; y: number; t: number; k: number }) {
  const f = (i: number) => 1 + Math.sin(t * 11 + i * 2.1) * 0.12;
  return (
    <g transform={`translate(${x} ${y})`} opacity={k}>
      <ellipse cx={0} cy={4} rx={62} ry={9} fill="#2b1b10" />
      {[
        { dx: -30, h: 52, c: "#ff7a1a" },
        { dx: 0, h: 78, c: "#ff9f1c" },
        { dx: 30, h: 56, c: "#ff7a1a" },
        { dx: -12, h: 40, c: "#ffd34d" },
        { dx: 14, h: 44, c: "#ffd34d" },
      ].map((fl, i) => (
        <path key={i} d={`M${fl.dx - 16} 0 C${fl.dx - 14} ${-fl.h * 0.5 * f(i)} ${fl.dx + 2} ${-fl.h * 0.7} ${fl.dx} ${-fl.h * f(i)} C${fl.dx + 6} ${-fl.h * 0.6} ${fl.dx + 18} ${-fl.h * 0.35} ${fl.dx + 16} 0 Z`} fill={fl.c} opacity={0.92} />
      ))}
    </g>
  );
}

function Tomb({ x, y, k }: { x: number; y: number; k: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${eO(k)})`} opacity={clamp(k * 2)}>
      <ellipse cx={0} cy={2} rx={58} ry={9} fill="#000" opacity={0.3} />
      <rect x={-46} y={-14} width={92} height={14} rx={3} fill="#a7a49a" stroke="#6f6c62" />
      <rect x={-36} y={-26} width={72} height={12} rx={3} fill="#bdb9ad" stroke="#6f6c62" />
      <path d="M-26 -26 C-26 -58 -10 -70 0 -70 C10 -70 26 -58 26 -26 Z" fill="#e9e5d7" stroke="#8a8676" />
      <rect x={-3} y={-88} width={6} height={20} fill="#e9e5d7" stroke="#8a8676" />
      <path d="M0 -112 L4 -88 L-4 -88 Z" fill="#d6b75a" />
      <rect x={-8} y={-50} width={16} height={20} rx={7} fill="#4b463c" opacity={0.55} />
    </g>
  );
}

/* the fixed backdrop: dawn sky, hills, Ruwanwelisaya, the rampart and the southern gate */
const Backdrop = memo(function Backdrop() {
  return (
    <g>
      <defs>
        <linearGradient id="d-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24183a" />
          <stop offset="0.45" stopColor="#8d3f3a" />
          <stop offset="0.78" stopColor="#e58a3a" />
          <stop offset="1" stopColor="#f7c85a" />
        </linearGradient>
        <linearGradient id="d-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4a2a" />
          <stop offset="1" stopColor="#2b1a0e" />
        </linearGradient>
        <radialGradient id="d-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3c4" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#d-sky)" />
      <circle cx={430} cy={286} r={190} fill="url(#d-sun)" />
      <circle cx={430} cy={296} r={40} fill="#fff3c4" opacity={0.9} />
      {/* far hills */}
      <path d="M0 300 C70 256 130 270 200 286 C270 300 330 262 400 280 L400 350 L0 350 Z" fill="#4a2c3c" opacity={0.75} />
      <path d="M0 322 C90 296 160 316 240 318 C300 320 340 304 420 318 L420 350 L0 350 Z" fill="#3a2230" />
      {/* Ruwanwelisaya, still being raised */}
      <g>
        <path d="M520 336 C520 236 580 196 626 196 C672 196 732 236 732 336 Z" fill="#f1e3c6" opacity={0.92} />
        <path d="M520 336 C520 236 580 196 626 196 L626 336 Z" fill="#c9a97f" opacity={0.28} />
        <rect x={610} y={178} width={32} height={20} fill="#f1e3c6" />
        <path d="M626 120 L634 178 H618 Z" fill="#e5b44a" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={506 - i * 6} y={330 - i * 8} width={240 + i * 12} height={8} fill="#d8c6a2" opacity={0.85} />
        ))}
        {/* scaffolding hints */}
        {[560, 600, 660, 700].map((px) => (
          <line key={px} x1={px} y1={336} x2={px + 6} y2={246} stroke="#5b3b24" strokeWidth={2} opacity={0.5} />
        ))}
      </g>
      {/* city rampart */}
      <rect x={430} y={286} width={530} height={58} fill="#6c5a4a" />
      <rect x={430} y={286} width={530} height={8} fill="#8a7761" />
      {Array.from({ length: 28 }).map((_, i) => (
        <rect key={i} x={434 + i * 19} y={274} width={11} height={14} fill="#7b6753" />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={440 + i * 44} y1={296} x2={440 + i * 44} y2={344} stroke="#5a4838" strokeWidth={1.5} opacity={0.6} />
      ))}
      {/* southern gate */}
      <g>
        <rect x={738} y={222} width={44} height={122} fill="#7d6a55" />
        <rect x={838} y={222} width={44} height={122} fill="#7d6a55" />
        <rect x={738} y={222} width={144} height={22} fill="#8f7a62" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={i} x={742 + i * 18} y={211} width={11} height={13} fill="#8f7a62" />
        ))}
        <path d="M782 344 V274 Q810 238 838 274 V344 Z" fill="#150d08" />
        <path d="M782 274 Q810 238 838 274" stroke="#b9a07c" strokeWidth={4} fill="none" />
        <path d="M760 222 V196 M860 222 V196" stroke="#5b3b24" strokeWidth={3} />
        <path d="M760 196 l22 6 l-22 8 Z" fill="#1f6f78" />
        <path d="M860 196 l22 6 l-22 8 Z" fill="#1f6f78" />
      </g>
      {/* ground */}
      <rect x={0} y={340} width={W} height={H - 340} fill="url(#d-ground)" />
      <path d="M0 346 C200 340 400 352 600 344 C760 338 880 350 960 344" stroke="#8a6a44" strokeWidth={2} fill="none" opacity={0.6} />
      {Array.from({ length: 40 }).map((_, i) => {
        const gx = (i * 137) % W, gy = 392 + ((i * 53) % 44);
        return <ellipse key={i} cx={gx} cy={gy} rx={5 + (i % 4) * 3} ry={1.6} fill="#1d1109" opacity={0.35} />;
      })}
      {Array.from({ length: 22 }).map((_, i) => (
        <path key={i} d={`M${(i * 211) % W} ${420 + ((i * 29) % 18)} l3 -9 l3 9`} stroke="#7a8a3e" strokeWidth={1.6} fill="none" opacity={0.55} />
      ))}
    </g>
  );
});

function Puffs({ x, dir, k, t }: { x: number; dir: 1 | -1; k: number; t: number }) {
  if (k < 0.05) return null;
  return (
    <g>
      {Array.from({ length: 6 }).map((_, i) => {
        const ph = (t * 1.6 + i / 6) % 1;
        return <circle key={i} cx={x - dir * (40 + ph * 90)} cy={GY - 6 - ph * 26} r={8 + ph * 22} fill="#cdb48a" opacity={0.34 * (1 - ph) * k} />;
      })}
    </g>
  );
}

/* ───────── the section ───────── */
export default function Duel() {
  const { t: tr, lang } = useLang();
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const last = useRef(0);

  /* background music: the theme song plays while the duel plays on screen.
     Browsers only allow sound after a tap/click, so if it is blocked we show a "tap" hint and retry on the first gesture. */
  const audio = useRef<HTMLAudioElement>(null);
  const [music, setMusic] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [unlock, setUnlock] = useState(0);
  useEffect(() => {
    const on = () => setUnlock((n) => n + 1);
    window.addEventListener("pointerdown", on, { once: true });
    window.addEventListener("keydown", on, { once: true });
    return () => {
      window.removeEventListener("pointerdown", on);
      window.removeEventListener("keydown", on);
    };
  }, []);
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const want = music && playing && inView;
    let fade = 0;
    const ramp = (to: number, done?: () => void) => {
      clearInterval(fade);
      fade = window.setInterval(() => {
        const d = to - a.volume;
        if (Math.abs(d) < 0.03) {
          a.volume = to;
          clearInterval(fade);
          done?.();
        } else a.volume = Math.max(0, Math.min(1, a.volume + Math.sign(d) * 0.03));
      }, 40);
    };
    if (want) {
      a.volume = Math.min(a.volume, 0.01);
      a.play().then(() => { setBlocked(false); ramp(0.55); }).catch(() => setBlocked(true));
    } else if (!a.paused) {
      ramp(0, () => a.pause());
    }
    return () => clearInterval(fade);
  }, [music, playing, inView, unlock]);
  useEffect(() => () => audio.current?.pause(), []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !inView) return;
    let raf = 0;
    last.current = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000);
      last.current = now;
      setTime((p) => {
        const n = p + dt;
        return n > DURATION + 1.2 ? 0 : n;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, inView]);

  const t = Math.min(time, DURATION);
  const beatIdx = Math.max(0, BEATS.findIndex((b) => t >= b.from && t < b.to) === -1 ? BEATS.length - 1 : BEATS.findIndex((b) => t >= b.from && t < b.to));
  const beat = BEATS[beatIdx];

  /* ── compute the scene at time t ── */
  const S = useMemo(() => {
    const kx = kandulaX(t), ex = elaraX(t);
    const ksp = speed(kandulaX, t), esp = speed(elaraX, t);
    const kAmp = clamp(ksp / 70), eAmp = clamp(esp / 70);

    /* Kandula */
    const kDodge = bump(seg(t, 4.3, 5.7));
    const kDip = 24 * seg(t, 6.0, 7.4) * (1 - seg(t, 9.4, 11.2)) - 10 * seg(t, 11.8, 12.6) * (1 - seg(t, 14.2, 15));
    const kTrunk = clamp(seg(t, 11.9, 12.6) * (1 - seg(t, 14.0, 14.8)) + 0.35 * seg(t, 6.2, 6.8) * (1 - seg(t, 9.4, 10)));
    const kTilt = -7 * kDodge;
    const kPhase = kx * 0.075;
    const kBob = -Math.abs(Math.sin(kPhase)) * 5 * kAmp;

    /* Maha Pabbata */
    const hit = seg(t, 8.3, 9.7);
    const eDip = -16 * bump(hit);
    const eTilt = 9 * bump(hit);
    const ePhase = ex * 0.075;
    const eBob = -Math.abs(Math.sin(ePhase)) * 5 * eAmp;
    const eTrunk = 0.4 * seg(t, 11.6, 12.4) * (1 - seg(t, 14, 14.4));

    /* Dutugemunu's rider */
    const dLean = -26 * kDodge + 9 * seg(t, 6.4, 8.0) * (1 - seg(t, 8.3, 9.3)) + 6 * bump(seg(t, 10.0, 10.5));
    const dDrop = 22 * kDodge;
    let dArm = -12;
    if (t > 9.5 && t < 10.1) dArm = lerp(-12, -142, eIO(seg(t, 9.5, 10.1)));
    else if (t >= 10.1 && t < 10.5) dArm = lerp(-142, 40, eO(seg(t, 10.1, 10.5)));
    else if (t >= 10.5 && t < 12.0) dArm = lerp(40, 10, seg(t, 10.5, 12.0));
    else if (t >= 12.0) dArm = lerp(10, -96, eO(seg(t, 12.0, 12.8))) + Math.sin(t * 7) * 3 * seg(t, 12.8, 13);
    const dHas = t < T_DUTU_THROW;
    const kSeatBob = kBob;
    const dutu = { x: kx + 4 * SK, y: GY - 182 * SK + kBob + dDrop * 0.4, rot: dLean + kTilt, arm: dArm, has: dHas };

    /* Elara's rider */
    let eArm = -12;
    if (t > 3.6 && t < 4.2) eArm = lerp(-12, -150, eIO(seg(t, 3.6, 4.2)));
    else if (t >= 4.2 && t < 4.7) eArm = lerp(-150, 52, eO(seg(t, 4.2, 4.7)));
    else if (t >= 4.7 && t < 10.55) eArm = lerp(52, 18, seg(t, 4.7, 6.0));
    else if (t >= 10.55) eArm = lerp(18, 70, seg(t, 10.55, 11.4));
    const eHas = t < T_ELARA_THROW;
    const attach = { x: ex - 4 * SE, y: GY - 182 * SE + eBob };
    let elara: { x: number; y: number; rot: number };
    if (t < T_FALL) {
      elara = { x: attach.x, y: attach.y, rot: 18 * eO(seg(t, T_DUTU_HIT, 11.2)) + eTilt * 0.4 };
    } else {
      const f = t - T_FALL;
      const u = Math.min(f, FALL_LAND_T);
      elara = {
        x: FALL_SEAT.x + 60 * u,
        y: FALL_SEAT.y + 0.5 * 1100 * u * u,
        rot: lerp(18, 96, eO(Math.min(1, f / FALL_LAND_T))),
      };
    }
    const elaraFade = 1 - seg(t, 15.3, 16.1);

    /* javelins in flight */
    let jE: { x: number; y: number; a: number } | null = null;
    if (t >= T_ELARA_THROW) {
      const u = clamp((t - T_ELARA_THROW) / (T_ELARA_LAND - T_ELARA_THROW));
      jE = bez(eO(u) * 0.35 + u * 0.65, ELARA_JAV.p0, ELARA_JAV.p1, ELARA_JAV.p2);
    }
    let jD: { x: number; y: number; a: number } | null = null;
    if (t >= T_DUTU_THROW && t < T_DUTU_HIT) {
      const u = (t - T_DUTU_THROW) / (T_DUTU_HIT - T_DUTU_THROW);
      const kx0 = kandulaX(T_DUTU_THROW), ex1 = elaraX(T_DUTU_HIT);
      const p0 = [kx0 + 38 * SK + 22, GY - 182 * SK - 40 * SK - 10];
      const p1 = [ex1 - 6, GY - 182 * SE - 38 * SE];
      jD = { x: lerp(p0[0], p1[0], u), y: lerp(p0[1], p1[1], u) - 14 * bump(u), a: Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * (180 / Math.PI) + 4 };
    }

    /* effects */
    const impact = seg(t, 8.3, 9.2);
    const shake = (t > 8.3 && t < 8.75 ? 6 * (1 - seg(t, 8.3, 8.75)) : 0) + (t > T_DUTU_HIT && t < T_DUTU_HIT + 0.3 ? 3 * (1 - seg(t, T_DUTU_HIT, T_DUTU_HIT + 0.3)) : 0);
    const sx = Math.sin(t * 90) * shake, sy = Math.cos(t * 77) * shake * 0.6;
    const flameK = seg(t, 14.7, 15.4) * (1 - seg(t, 16.4, 17.2));
    const tombK = seg(t, 16.3, 17.7);
    const lower = eO(seg(t, 15.0, 16.6));

    return { kx, ex, kAmp, eAmp, kDip, kTrunk, kTilt, kPhase, kBob, eDip, eTilt, ePhase, eBob, eTrunk, dutu, eArm, eHas, elara, elaraFade, jE, jD, impact, sx, sy, flameK, tombK, lower, kSeatBob };
  }, [t]);

  const flap = Math.sin(t * 5) * 6;
  const wave = t * 5;
  const cheer = seg(t, 12, 13);
  const army = useMemo(() => Array.from({ length: 16 }).map((_, i) => ({ x: 24 + (i % 8) * 24 + (i >= 8 ? 12 : 0), y: i >= 8 ? 358 : 372, ph: i * 0.8 })), []);
  const wall = useMemo(() => Array.from({ length: 11 }).map((_, i) => ({ x: 470 + i * 44 + (i % 2) * 8, ph: i * 1.1 })), []);

  const pct = (x: number) => `${(x / W) * 100}%`;
  const fell = t >= T_FALL + FALL_LAND_T;
  const seekTo = (v: number) => setTime(clamp(v, 0, DURATION));

  return (
    <section id="duel" className="section duelsec">
      <audio ref={audio} src="/audio/gemunu-theme.mp3" loop preload="none" />
      <Reveal className="section-head">
        <p className="kicker">{tr(DUEL_UI.kicker)}</p>
        <h2>{tr(DUEL_UI.title)}</h2>
        <p className="lede">{tr(DUEL_UI.sub)}</p>
      </Reveal>

      <div className="duel-stage" ref={wrap}>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={tr(DUEL_UI.title)} className="duel-svg">
          <g transform={`translate(${S.sx} ${S.sy})`}>
            <Backdrop />

            {/* Dutugemunu's army (left) */}
            {army.map((a, i) => (
              <Soldier key={i} x={a.x} y={a.y} s={0.9} body={i % 2 ? "#9c2a2a" : "#c9a24a"} bob={-Math.abs(Math.sin(wave * 0.9 + a.ph)) * (2 + cheer * 4)} spear={Math.sin(wave * 0.5 + a.ph) * (0.4 + cheer)} />
            ))}
            <Banner x={40} y={350} h={96} color="#a51f2d" trim="#f0b429" wave={wave} lower={S.lower} dir={1} />
            <Banner x={118} y={350} h={110} color="#a51f2d" trim="#f0b429" wave={wave + 1} lower={S.lower} dir={1} />
            <Banner x={192} y={350} h={90} color="#a51f2d" trim="#f0b429" wave={wave + 2} lower={S.lower} dir={1} />

            {/* Elara's troops on the rampart */}
            {wall.map((w, i) => (
              <Soldier key={i} x={w.x} y={288} s={0.62} body="#1f6f78" bob={Math.sin(wave * 0.6 + w.ph) * 0.8} spear={-0.2} />
            ))}
            <Banner x={470} y={288} h={64} color="#1f6f78" trim="#d9dde4" wave={wave + 3} lower={S.lower} dir={-1} />
            <Banner x={690} y={288} h={70} color="#1f6f78" trim="#d9dde4" wave={wave + 4} lower={S.lower} dir={-1} />

            {/* dust */}
            <Puffs x={S.kx - 60} dir={1} k={S.kAmp} t={t} />
            <Puffs x={S.ex + 60} dir={-1} k={S.eAmp} t={t} />

            {/* Maha Pabbata and Elara */}
            <Elephant pal={PABBATA} x={S.ex} s={SE} flip phase={S.ePhase} amp={S.eAmp} dip={S.eDip} trunk={S.eTrunk} tilt={S.eTilt} bob={S.eBob} flap={-flap} />
            <g opacity={S.elaraFade}>
              <Rider x={S.elara.x} y={S.elara.y} rot={S.elara.rot} sc={SE} flip arm={S.eArm} hasJav={S.eHas} impaled={t >= T_DUTU_HIT} king="elara" />
            </g>

            {/* pyre and tomb at the place Elara fell */}
            {S.flameK > 0.01 && <Flames x={LAND_X + 10} y={GY - 2} t={t} k={S.flameK} />}
            {S.tombK > 0.01 && <Tomb x={LAND_X + 10} y={GY + 4} k={S.tombK} />}

            {/* Kandula and Dutugemunu in front */}
            <Elephant pal={KANDULA} x={S.kx} s={SK} flip={false} phase={S.kPhase} amp={S.kAmp} dip={S.kDip} trunk={S.kTrunk} tilt={S.kTilt} bob={S.kBob} flap={flap} />
            <Rider x={S.dutu.x} y={S.dutu.y} rot={S.dutu.rot} sc={SK} flip={false} arm={S.dutu.arm} hasJav={S.dutu.has} king="dutu" />

            {/* javelins in the air or planted */}
            {S.jE && (
              <g transform={`translate(${S.jE.x} ${S.jE.y}) rotate(${S.jE.a})`}>
                <Javelin tail={50} len={140} />
              </g>
            )}
            {S.jD && (
              <g transform={`translate(${S.jD.x} ${S.jD.y}) rotate(${S.jD.a})`}>
                <Javelin tail={50} len={140} />
              </g>
            )}

            {/* clash flash */}
            {S.impact > 0 && S.impact < 1 && (
              <g transform={`translate(${S.kx + 170 * SK + 40} ${GY - 150})`} opacity={1 - S.impact}>
                <circle r={14 + S.impact * 70} fill="none" stroke="#fff3c4" strokeWidth={5 * (1 - S.impact)} />
                {Array.from({ length: 10 }).map((_, i) => {
                  const ang = (i / 10) * Math.PI * 2;
                  return <line key={i} x1={Math.cos(ang) * (10 + S.impact * 30)} y1={Math.sin(ang) * (10 + S.impact * 30)} x2={Math.cos(ang) * (26 + S.impact * 60)} y2={Math.sin(ang) * (26 + S.impact * 60)} stroke="#ffd34d" strokeWidth={3} strokeLinecap="round" />;
                })}
              </g>
            )}
          </g>
        </svg>

        {/* labels */}
        <div className="duel-label gate" style={{ left: "98%", top: "93%" }}>{tr(DUEL_UI.gate)}</div>
        <div className="duel-label dutu" style={{ left: pct(S.kx + 10), top: `${((GY - 300 * SK + S.kBob) / H) * 100}%` }}>{tr(DUEL_UI.dutu)}</div>
        {t < 12.5 && <div className="duel-label elara" style={{ left: pct(S.ex - 10), top: `${((GY - 300 * SE) / H) * 100}%` }}>{tr(DUEL_UI.elara)}</div>}
        {S.tombK > 0.6 && <div className="duel-label tomb" style={{ left: pct(LAND_X + 10), top: "60%" }}>{tr(DUEL_UI.tomb)}</div>}

        <div className="duel-vignette" aria-hidden />
      </div>

      <div className="duel-panel">
        <div className="duel-caption" key={beatIdx} aria-live="polite">
          <span className="pill">
            {beatIdx + 1} / {BEATS.length}
          </span>
          <h3>{tr(beat.title)}</h3>
          <p>{tr(beat.text)}</p>
        </div>

        <div className="duel-controls">
          <button className="btn small primary" onClick={() => { if (!playing && time >= DURATION) setTime(0); setPlaying((p) => !p); }}>
            {playing ? `❚❚ ${tr(DUEL_UI.pause)}` : `▶ ${tr(DUEL_UI.play)}`}
          </button>
          <button className="btn small ghost" onClick={() => { setTime(0); setPlaying(true); }}>
            ↻ {tr(DUEL_UI.replay)}
          </button>
          <button
            className={`btn small ghost music ${music && !blocked ? "on" : ""}`}
            onClick={() => { setMusic((m) => (blocked ? true : !m)); setBlocked(false); setUnlock((n) => n + 1); }}
            aria-pressed={music && !blocked}
          >
            {blocked ? `♪ ${tr(DUEL_UI.musicTap)}` : music ? `♪ ${tr(DUEL_UI.musicOn)}` : `✕ ${tr(DUEL_UI.musicOff)}`}
          </button>
          <input
            className="duel-range"
            type="range"
            min={0}
            max={DURATION}
            step={0.01}
            value={t}
            onChange={(e) => { setPlaying(false); seekTo(parseFloat(e.target.value)); }}
            aria-label={tr(DUEL_UI.scrub)}
          />
        </div>

        <ol className="duel-beats">
          {BEATS.map((b, i) => (
            <li key={i}>
              <button className={`beat ${i === beatIdx ? "on" : ""} ${i < beatIdx ? "done" : ""}`} onClick={() => { setPlaying(false); seekTo(b.from + 0.02); }}>
                <span className="beat-n">{i + 1}</span>
                <span>{tr(b.title)}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="approx">{tr(DUEL_UI.note)}</p>
      </div>
    </section>
  );
}

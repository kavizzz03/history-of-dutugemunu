"use client";

import { useId } from "react";
import type { AvatarCfg, Character } from "@/lib/characters";

/* ───────── colour helpers ───────── */
function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/* ───────── headgear ───────── */
function HairCap({ c, y = 0 }: { c: string; y?: number }) {
  return <path d={`M75 ${106 + y} C73 ${62 + y} 98 ${54 + y} 120 ${54 + y} C142 ${54 + y} 167 ${62 + y} 165 ${106 + y} C152 ${86 + y} 88 ${86 + y} 75 ${106 + y} Z`} fill={c} />;
}

function Headgear({ cfg, id }: { cfg: AvatarCfg; id: string }) {
  const { head, hair, outfit, accent } = cfg;
  const metal = `url(#metal-${id})`;
  const gold = `url(#gold-${id})`;
  switch (head) {
    case "crown":
      return (
        <g>
          <HairCap c={hair} />
          <path d="M78 90 L162 90 L168 62 L148 76 L140 46 L127 72 L120 38 L113 72 L100 46 L92 76 L72 62 Z" fill={gold} stroke={shade(accent, -0.4)} strokeWidth="1.5" />
          <rect x="78" y="86" width="84" height="9" rx="3" fill={gold} stroke={shade(accent, -0.4)} strokeWidth="1" />
          <circle cx="120" cy="52" r="5" fill="#d7263d" stroke="#fff6" />
          <circle cx="100" cy="60" r="3.5" fill="#2e86de" />
          <circle cx="140" cy="60" r="3.5" fill="#2e86de" />
          <circle cx="120" cy="90.5" r="3.2" fill="#e84855" />
          <circle cx="102" cy="90.5" r="2.4" fill="#fff" opacity=".85" />
          <circle cx="138" cy="90.5" r="2.4" fill="#fff" opacity=".85" />
        </g>
      );
    case "royalturban":
      return (
        <g>
          <path d="M68 100 C62 50 98 30 122 30 C150 30 178 50 172 100 C150 82 92 82 68 100 Z" fill={outfit} stroke={shade(outfit, -0.4)} strokeWidth="1.5" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${72 + i * 3} ${96 - i * 10} C100 ${60 - i * 10} 150 ${60 - i * 10} ${168 - i * 3} ${96 - i * 10}`} stroke={shade(outfit, 0.25)} strokeWidth="2.4" fill="none" opacity=".75" />
          ))}
          <path d="M72 100 C 100 84 142 84 168 100" stroke={accent} strokeWidth="5" fill="none" />
          <circle cx="120" cy="86" r="8" fill={gold} stroke={shade(accent, -0.4)} />
          <circle cx="120" cy="86" r="4" fill="#d7263d" />
          <path d="M120 80 C 118 56 130 40 152 28 C 146 46 138 62 126 80 Z" fill="#f4f1e8" opacity=".92" />
        </g>
      );
    case "turban":
      return (
        <g>
          <path d="M70 100 C66 52 100 38 122 38 C148 38 174 54 170 100 C148 86 92 86 70 100 Z" fill={outfit} stroke={shade(outfit, -0.4)} strokeWidth="1.5" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${74 + i * 2} ${98 - i * 12} C102 ${68 - i * 12} 146 ${68 - i * 12} ${166 - i * 2} ${98 - i * 12}`} stroke={shade(outfit, 0.3)} strokeWidth="2.6" fill="none" opacity=".7" />
          ))}
          <path d="M76 100 C100 90 142 90 164 100" stroke={accent} strokeWidth="3.5" fill="none" />
          <path d="M160 88 C 176 96 178 118 170 140 C 168 118 164 104 154 94 Z" fill={outfit} stroke={shade(outfit, -0.4)} />
        </g>
      );
    case "helmet":
      return (
        <g>
          <path d="M120 22 C128 22 134 28 132 40 C 128 34 124 32 120 32 C 116 32 112 34 108 40 C 106 28 112 22 120 22Z" fill={outfit} />
          <path d="M72 112 C 68 60 96 38 120 38 C 144 38 172 60 168 112 L 158 102 C 150 80 90 80 82 102 Z" fill={metal} stroke="#4b5563" strokeWidth="1.5" />
          <path d="M76 98 C 100 86 140 86 164 98 L 164 108 C 140 96 100 96 76 108 Z" fill={gold} stroke={shade(accent, -0.4)} strokeWidth="1" />
          <rect x="116.5" y="96" width="7" height="30" rx="3" fill={metal} stroke="#4b5563" />
          <path d="M120 40 L120 70" stroke="#fff8" strokeWidth="2" />
          <path d="M72 108 L70 150 C 76 144 80 136 82 124 Z" fill={metal} stroke="#4b5563" />
          <path d="M168 108 L170 150 C 164 144 160 136 158 124 Z" fill={metal} stroke="#4b5563" />
          <circle cx="120" cy="66" r="4" fill="#d7263d" />
        </g>
      );
    case "topknot":
      return (
        <g>
          <circle cx="120" cy="46" r="15" fill={hair} />
          <circle cx="120" cy="46" r="15" fill="none" stroke={shade(hair, 0.3)} strokeWidth="1.5" strokeDasharray="3 4" />
          <HairCap c={hair} />
          <path d="M76 98 C 100 86 140 86 164 98 L164 105 C 140 94 100 94 76 105 Z" fill={outfit === "#44693f" ? "#e8d28c" : accent} stroke={shade(accent, -0.4)} strokeWidth="1" />
        </g>
      );
    case "headdress":
      return (
        <g>
          <HairCap c={hair} />
          <path d="M80 98 C 98 66 142 66 160 98" stroke={gold} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M120 54 L128 68 L120 76 L112 68 Z" fill="#e84855" stroke={shade(accent, -0.3)} />
          {[88, 102, 138, 152].map((x, i) => (
            <circle key={x} cx={x} cy={i % 3 === 0 ? 86 : 74} r="3.4" fill={i % 2 ? "#2e86de" : "#fff"} stroke={shade(accent, -0.3)} />
          ))}
          <path d="M120 80 L120 92" stroke={gold} strokeWidth="2.5" />
          <circle cx="120" cy="96" r="3.6" fill="#e84855" />
        </g>
      );
    default:
      return null;
  }
}

/* ───────── weapon ───────── */
function WeaponBack({ w, cfg, id }: { w: AvatarCfg["weapon"]; cfg: AvatarCfg; id: string }) {
  const metal = `url(#metal-${id})`;
  switch (w) {
    case "spear":
      return (
        <g transform="rotate(14 190 200)">
          <rect x="187" y="14" width="5" height="270" rx="2" fill="#6b4a2a" />
          <path d="M189.5 -8 L200 22 L189.5 30 L179 22 Z" fill={metal} stroke="#4b5563" />
          <circle cx="189.5" cy="34" r="4" fill={cfg.accent} />
        </g>
      );
    case "bow":
      return (
        <g>
          <path d="M196 20 C 244 80 244 190 196 262" stroke="#6b4a2a" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M196 20 L196 262" stroke="#f1e9d2" strokeWidth="1.5" />
          <path d="M60 238 L150 238" stroke="#6b4a2a" strokeWidth="0" />
        </g>
      );
    case "sword":
      return (
        <g transform="rotate(-24 50 190)">
          <rect x="47" y="30" width="7" height="140" rx="2" fill={metal} stroke="#4b5563" />
          <rect x="36" y="168" width="30" height="7" rx="3" fill={cfg.accent} />
          <rect x="46" y="174" width="9" height="24" rx="3" fill="#5b3b24" />
          <circle cx="50.5" cy="202" r="5" fill={cfg.accent} />
        </g>
      );
    case "mace":
      return (
        <g transform="rotate(18 188 200)">
          <rect x="185" y="52" width="7" height="230" rx="3" fill="#5b3b24" />
          <circle cx="188.5" cy="42" r="22" fill={metal} stroke="#4b5563" strokeWidth="1.5" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M188.5 12 L193 24 L184 24 Z" transform={`rotate(${a} 188.5 42)`} fill={metal} stroke="#4b5563" />
          ))}
        </g>
      );
    case "club":
      return (
        <g transform="rotate(-18 52 190)">
          <path d="M44 40 C 36 20 66 20 60 44 L 56 270 L 48 270 Z" fill="#6b4a2a" stroke="#3d2917" strokeWidth="1.5" />
          <path d="M42 40 C 42 24 62 24 58 40" stroke={cfg.accent} strokeWidth="3" fill="none" />
        </g>
      );
    default:
      return null;
  }
}

function ShieldFront({ cfg, id }: { cfg: AvatarCfg; id: string }) {
  return (
    <g>
      <circle cx="42" cy="236" r="40" fill={`url(#metal-${id})`} stroke="#374151" strokeWidth="3" />
      <circle cx="42" cy="236" r="30" fill="none" stroke={cfg.accent} strokeWidth="3" />
      <circle cx="42" cy="236" r="9" fill={cfg.accent} stroke="#374151" />
      <path d="M42 206 L42 266 M12 236 L72 236" stroke="#374151" strokeWidth="1.5" opacity=".6" />
    </g>
  );
}

/* ───────── person ───────── */
function Person({ cfg, name }: { cfg: AvatarCfg; name: string }) {
  const id = useId().replace(/:/g, "");
  const b = cfg.build ?? 1;
  const skin = cfg.skin;
  const skinD = shade(skin, -0.22);
  const female = !!cfg.female;
  const metal = `url(#metal-${id})`;
  const armored = cfg.head === "helmet" || cfg.head === "topknot" || (cfg.head === "bald" && !cfg.monkSoon && !female);
  const monk = cfg.monkSoon;
  const beard = cfg.beard ?? "none";
  const wl = 120 - 92 * b,
    wr = 120 + 92 * b;

  return (
    <svg viewBox="0 0 240 280" role="img" aria-label={name} className="avatar-svg">
      <defs>
        <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={cfg.bg[0]} />
          <stop offset="1" stopColor={cfg.bg[1]} />
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="50%" cy="38%" r="55%">
          <stop offset="0" stopColor={cfg.accent} stopOpacity=".42" />
          <stop offset="1" stopColor={cfg.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(cfg.accent, 0.45)} />
          <stop offset=".5" stopColor={cfg.accent} />
          <stop offset="1" stopColor={shade(cfg.accent, -0.35)} />
        </linearGradient>
        <linearGradient id={`metal-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e5e7eb" />
          <stop offset=".5" stopColor="#9ca3af" />
          <stop offset="1" stopColor="#4b5563" />
        </linearGradient>
        <linearGradient id={`skin-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={shade(skin, 0.14)} />
          <stop offset="1" stopColor={skinD} />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <rect x="0" y="0" width="240" height="280" rx="26" />
        </clipPath>
      </defs>

      <g clipPath={`url(#clip-${id})`}>
        <rect width="240" height="280" fill={`url(#bg-${id})`} />
        <rect width="240" height="280" fill={`url(#glow-${id})`} />
        {/* mandala rings */}
        <g stroke={cfg.accent} fill="none" opacity=".22">
          <circle cx="120" cy="120" r="108" strokeWidth="1.5" />
          <circle cx="120" cy="120" r="92" strokeWidth="1" strokeDasharray="2 6" />
        </g>

        <WeaponBack w={cfg.weapon} cfg={cfg} id={id} />

        {/* long hair behind (female) */}
        {female && (
          <path d="M70 100 C 56 150 60 230 78 270 L 162 270 C 182 230 184 150 170 100 Z" fill={cfg.hair} />
        )}

        {/* body */}
        <path
          d={`M${wl} 290 C${wl - 4} 236 ${120 - 72 * b} 208 86 198 L120 214 L154 198 C${120 + 72 * b} 208 ${wr + 4} 236 ${wr} 290 Z`}
          fill={monk ? "#e08a1e" : cfg.outfit}
          stroke={shade(cfg.outfit, -0.45)}
          strokeWidth="2"
        />
        {/* neck + chest skin */}
        <rect x="102" y="158" width="36" height="46" rx="12" fill={skinD} />
        <path d="M86 198 L120 246 L154 198 L120 214 Z" fill={`url(#skin-${id})`} />
        {monk ? (
          <>
            <path d="M120 214 L84 280 M120 214 L156 280" stroke="#a85f0a" strokeWidth="3" />
            <path d="M100 230 C 130 240 150 262 160 282" stroke="#f3b04c" strokeWidth="5" fill="none" opacity=".5" />
          </>
        ) : (
          <>
            {/* collar / trim */}
            <path d="M86 198 L120 246 L154 198" fill="none" stroke={`url(#gold-${id})`} strokeWidth="5" strokeLinejoin="round" />
            <path d={`M${wl + 6} 276 C ${wl + 10} 240 ${120 - 70 * b} 212 86 198`} fill="none" stroke={cfg.accent} strokeWidth="2" opacity=".6" />
            <path d={`M${wr - 6} 276 C ${wr - 10} 240 ${120 + 70 * b} 212 154 198`} fill="none" stroke={cfg.accent} strokeWidth="2" opacity=".6" />
          </>
        )}
        {/* armour / jewellery */}
        {armored && (
          <>
            <ellipse cx={120 - 66 * b} cy="224" rx="28" ry="15" fill={metal} stroke="#374151" strokeWidth="2" transform={`rotate(-18 ${120 - 66 * b} 224)`} />
            <ellipse cx={120 + 66 * b} cy="224" rx="28" ry="15" fill={metal} stroke="#374151" strokeWidth="2" transform={`rotate(18 ${120 + 66 * b} 224)`} />
            <path d="M104 244 L136 244 L130 280 L110 280 Z" fill={metal} stroke="#374151" opacity=".9" />
          </>
        )}
        {!monk && !armored && !female && (
          <>
            <circle cx="120" cy="256" r="9" fill={`url(#gold-${id})`} stroke={shade(cfg.accent, -0.4)} />
            <circle cx="120" cy="256" r="3.5" fill="#e84855" />
            <path d="M92 208 C 100 238 140 238 148 208" stroke={cfg.accent} strokeWidth="3" fill="none" opacity=".9" />
          </>
        )}
        {female && (
          <>
            <path d="M92 206 C 100 244 140 244 148 206" stroke={`url(#gold-${id})`} strokeWidth="4" fill="none" />
            <path d="M104 226 C 112 250 128 250 136 226" stroke={`url(#gold-${id})`} strokeWidth="3" fill="none" />
            <circle cx="120" cy="248" r="6" fill="#e84855" stroke={shade(cfg.accent, -0.4)} />
          </>
        )}

        {/* ears */}
        <ellipse cx="75" cy="122" rx="7" ry="13" fill={skinD} />
        <ellipse cx="165" cy="122" rx="7" ry="13" fill={skinD} />
        {female && (
          <>
            <circle cx="75" cy="138" r="4" fill={cfg.accent} />
            <circle cx="165" cy="138" r="4" fill={cfg.accent} />
          </>
        )}

        {/* face */}
        <path
          d="M120 60 C152 60 167 86 165 114 C164 142 148 172 120 177 C92 172 76 142 75 114 C73 86 88 60 120 60 Z"
          fill={`url(#skin-${id})`}
          stroke={shade(skin, -0.4)}
          strokeWidth="1.5"
        />

        {/* beard under the features */}
        {beard === "full" && (
          <path d="M76 118 C 74 156 90 190 120 196 C 150 190 166 156 164 118 C 158 142 146 154 120 154 C 94 154 82 142 76 118 Z" fill={cfg.hair} />
        )}
        {beard === "short" && (
          <path d="M77 124 C 78 158 94 178 120 180 C 146 178 162 158 163 124 C 156 148 144 158 120 158 C 96 158 84 148 77 124 Z" fill={cfg.hair} opacity=".6" />
        )}

        {/* eyes (blink) */}
        <g className="blink">
          <ellipse cx="100" cy="116" rx="9" ry="5.5" fill="#fff" />
          <ellipse cx="140" cy="116" rx="9" ry="5.5" fill="#fff" />
          <circle cx="101" cy="116" r="3.8" fill="#2a1a10" />
          <circle cx="139" cy="116" r="3.8" fill="#2a1a10" />
          <circle cx="102.2" cy="114.8" r="1.2" fill="#fff" />
          <circle cx="140.2" cy="114.8" r="1.2" fill="#fff" />
          {female && (
            <>
              <path d="M90 115 C 96 108 106 108 110 114" stroke="#1a0f08" strokeWidth="1.8" fill="none" />
              <path d="M130 114 C 134 108 144 108 150 115" stroke="#1a0f08" strokeWidth="1.8" fill="none" />
            </>
          )}
        </g>
        {/* brows */}
        <path d="M88 104 C 96 98 106 98 112 103" stroke={cfg.age === "old" ? "#bbb" : cfg.hair} strokeWidth={female ? 2.2 : 4} fill="none" strokeLinecap="round" />
        <path d="M128 103 C 134 98 144 98 152 104" stroke={cfg.age === "old" ? "#bbb" : cfg.hair} strokeWidth={female ? 2.2 : 4} fill="none" strokeLinecap="round" />
        {/* nose */}
        <path d="M120 118 C 116 130 112 136 116 140 C 119 142 121 142 124 140 C 128 136 124 130 120 118" stroke={shade(skin, -0.45)} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* wrinkles */}
        {cfg.age === "old" && (
          <g stroke={shade(skin, -0.35)} strokeWidth="1.2" fill="none" opacity=".8">
            <path d="M84 98 C 100 92 108 92 114 96" />
            <path d="M126 96 C 132 92 140 92 156 98" />
            <path d="M90 128 C 94 136 96 140 98 144" />
            <path d="M150 128 C 146 136 144 140 142 144" />
          </g>
        )}
        {cfg.scar && <path d="M146 104 L 156 134" stroke="#8b3a2a" strokeWidth="2.4" strokeLinecap="round" />}

        {/* mustache + mouth */}
        {(beard === "mustache" || beard === "full" || beard === "short") && (
          <path d="M120 146 C 112 140 100 142 92 152 C 102 152 112 150 120 150 C 128 150 138 152 148 152 C 140 142 128 140 120 146 Z" fill={cfg.hair} />
        )}
        {female ? (
          <path d="M108 154 C 114 150 126 150 132 154 C 126 162 114 162 108 154 Z" fill="#b8304a" />
        ) : (
          <path d="M108 160 C 114 164 126 164 132 160" stroke="#3b1c14" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        )}
        {female && <circle cx="120" cy="100" r="2.4" fill="#d7263d" />}

        <Headgear cfg={cfg} id={id} />

        {cfg.weapon === "shield" && <ShieldFront cfg={cfg} id={id} />}
      </g>
    </svg>
  );
}

/* ───────── Kandula ───────── */
function Elephant({ name }: { name: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 240 280" role="img" aria-label={name} className="avatar-svg">
      <defs>
        <linearGradient id={`ebg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a3c66" />
          <stop offset="1" stopColor="#14111f" />
        </linearGradient>
        <radialGradient id={`eglow-${id}`} cx="50%" cy="40%" r="55%">
          <stop offset="0" stopColor="#f0b429" stopOpacity=".4" />
          <stop offset="1" stopColor="#f0b429" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`hide-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a1a1ab" />
          <stop offset="1" stopColor="#5d5d68" />
        </linearGradient>
        <linearGradient id={`ivory-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff7e0" />
          <stop offset="1" stopColor="#d9c79a" />
        </linearGradient>
        <linearGradient id={`egold-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffe08a" />
          <stop offset="1" stopColor="#b8801f" />
        </linearGradient>
        <clipPath id={`eclip-${id}`}>
          <rect width="240" height="280" rx="26" />
        </clipPath>
      </defs>
      <g clipPath={`url(#eclip-${id})`}>
        <rect width="240" height="280" fill={`url(#ebg-${id})`} />
        <rect width="240" height="280" fill={`url(#eglow-${id})`} />
        <g stroke="#f0b429" fill="none" opacity=".22">
          <circle cx="120" cy="120" r="108" strokeWidth="1.5" />
          <circle cx="120" cy="120" r="92" strokeWidth="1" strokeDasharray="2 6" />
        </g>

        {/* ears */}
        <path className="ear-l" d="M78 70 C 30 40 -4 90 14 150 C 24 190 54 196 80 170 C 70 140 70 100 78 70 Z" fill={`url(#hide-${id})`} stroke="#3d3d46" strokeWidth="2" />
        <path d="M70 84 C 40 66 20 100 30 144 C 36 168 52 172 68 156" fill="#c58f9a" opacity=".35" />
        <path className="ear-r" d="M162 70 C 210 40 244 90 226 150 C 216 190 186 196 160 170 C 170 140 170 100 162 70 Z" fill={`url(#hide-${id})`} stroke="#3d3d46" strokeWidth="2" />
        <path d="M170 84 C 200 66 220 100 210 144 C 204 168 188 172 172 156" fill="#c58f9a" opacity=".35" />

        {/* tusks (back pair) */}
        <path d="M92 168 C 62 190 54 232 76 262 C 70 236 78 206 100 186 Z" fill={`url(#ivory-${id})`} stroke="#a89466" />
        <path d="M148 168 C 178 190 186 232 164 262 C 170 236 162 206 140 186 Z" fill={`url(#ivory-${id})`} stroke="#a89466" />
        {/* small legendary tusks */}
        <path d="M100 170 C 88 188 86 206 92 222 C 94 204 102 190 108 180 Z" fill={`url(#ivory-${id})`} stroke="#a89466" opacity=".9" />
        <path d="M140 170 C 152 188 154 206 148 222 C 146 204 138 190 132 180 Z" fill={`url(#ivory-${id})`} stroke="#a89466" opacity=".9" />

        {/* head */}
        <path d="M120 44 C 160 44 176 80 172 120 C 168 150 152 176 140 196 L 136 262 C 136 274 104 274 104 262 L 100 196 C 88 176 72 150 68 120 C 64 80 80 44 120 44 Z" fill={`url(#hide-${id})`} stroke="#3d3d46" strokeWidth="2" />
        {/* trunk ridges */}
        {[110, 132, 154, 176, 198, 220, 242].map((y) => (
          <path key={y} d={`M${106 - (y > 200 ? 0 : 0)} ${y} C 116 ${y + 5} 124 ${y + 5} ${134} ${y}`} stroke="#3d3d46" strokeWidth="1.4" fill="none" opacity=".45" />
        ))}
        <path d="M112 262 C 112 270 128 270 128 262" stroke="#3d3d46" strokeWidth="2" fill="none" />
        {/* forehead ornament */}
        <path d="M82 66 C 96 52 144 52 158 66 L 148 118 C 134 128 106 128 92 118 Z" fill="#a51f2d" stroke="#f0b429" strokeWidth="2.5" />
        <path d="M92 74 C 108 66 132 66 148 74" stroke="#f0b429" strokeWidth="2" fill="none" />
        <path d="M120 78 L 132 100 L 120 120 L 108 100 Z" fill={`url(#egold-${id})`} stroke="#8a5a10" />
        <circle cx="120" cy="99" r="5" fill="#e84855" stroke="#fff6" />
        {[88, 100, 140, 152].map((x) => (
          <circle key={x} cx={x} cy={x < 120 ? 110 : 110} r="3" fill="#f0b429" />
        ))}
        {/* eyes */}
        <g className="blink">
          <ellipse cx="90" cy="140" rx="6" ry="4.4" fill="#fff" />
          <ellipse cx="150" cy="140" rx="6" ry="4.4" fill="#fff" />
          <circle cx="91" cy="140" r="3.2" fill="#2a1a10" />
          <circle cx="149" cy="140" r="3.2" fill="#2a1a10" />
        </g>
        <path d="M80 134 C 84 130 92 130 98 134" stroke="#3d3d46" strokeWidth="2" fill="none" />
        <path d="M142 134 C 148 130 156 130 160 134" stroke="#3d3d46" strokeWidth="2" fill="none" />
        {/* main tusks */}
        <path d="M96 190 C 64 196 40 220 38 252 C 52 230 74 216 104 212 Z" fill={`url(#ivory-${id})`} stroke="#a89466" strokeWidth="1.5" />
        <path d="M144 190 C 176 196 200 220 202 252 C 188 230 166 216 136 212 Z" fill={`url(#ivory-${id})`} stroke="#a89466" strokeWidth="1.5" />
        <path d="M98 196 C 78 202 62 214 52 230" stroke="#b8801f" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".8" />
        <path d="M142 196 C 162 202 178 214 188 230" stroke="#b8801f" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".8" />
      </g>
    </svg>
  );
}

export default function Avatar({ character, className = "" }: { character: Pick<Character, "id" | "avatar"> & { name?: { en: string } }; className?: string }) {
  const label = character.name?.en ?? character.id;
  return (
    <div className={`avatar ${className}`}>
      {character.id === "kandula" ? <Elephant name={label} /> : <Person cfg={character.avatar} name={label} />}
    </div>
  );
}

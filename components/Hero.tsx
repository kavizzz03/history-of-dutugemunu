"use client";

import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";
import { getCharacter } from "@/lib/characters";
import Avatar from "./Avatar";

export default function Hero() {
  const { t, lang } = useLang();
  return (
    <section id="top" className="hero">
      <div className="hero-sky" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <span
            key={i}
            className="ember"
            style={{
              left: `${(i * 37) % 100}%`,
              animationDelay: `${(i * 0.7) % 9}s`,
              animationDuration: `${9 + ((i * 13) % 9)}s`,
              width: 2 + (i % 3),
              height: 2 + (i % 3),
            }}
          />
        ))}
        <div className="sun" />
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">{t(UI.hero.eyebrow)}</p>
          <h1 className={`hero-title ${lang}`}>{t(UI.hero.title)}</h1>
          <p className={`hero-alt ${lang === "en" ? "si" : "en"}`} aria-hidden>
            {t(UI.hero.altTitle)}
          </p>
          <p className="hero-sub">{t(UI.hero.subtitle)}</p>
          <p className="hero-body">{t(UI.hero.body)}</p>
          <div className="hero-cta">
            <a className="btn primary" href="#story">
              {t(UI.hero.cta1)}
            </a>
            <a className="btn ghost" href="#map">
              {t(UI.hero.cta2)}
            </a>
          </div>
          <dl className="hero-stats">
            {UI.hero.stats.map((s) => (
              <div key={s.n}>
                <dt>{s.n}</dt>
                <dd>{t(s.l)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero-art" aria-hidden>
          <div className="arch">
            <div className="arch-glow" />
            <div className="hero-trio">
              <div className="trio side left">
                <Avatar character={getCharacter("kandula")} />
              </div>
              <div className="trio center">
                <Avatar character={getCharacter("dutugemunu")} />
              </div>
              <div className="trio side right">
                <Avatar character={getCharacter("viharamahadevi")} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <svg className="hero-stupa" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          <linearGradient id="hs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2a1a12" />
            <stop offset="1" stopColor="#0c0907" />
          </linearGradient>
        </defs>
        <path d="M0 220 V190 C120 170 200 185 300 170 C380 158 420 150 470 150 L480 120 L500 118 C500 70 560 38 600 38 C640 38 700 70 700 118 L720 120 L730 150 C780 150 820 158 900 170 C1000 185 1080 170 1200 190 V220 Z" fill="url(#hs)" />
        <path d="M600 4 L606 38 H594 Z" fill="#3a2518" />
        <path d="M0 220 V200 C160 182 260 200 380 186 C440 178 480 176 520 182 C560 176 640 176 680 182 C720 176 760 178 820 186 C940 200 1040 182 1200 200 V220 Z" fill="#0c0907" />
      </svg>

      <a href="#story" className="scroll-cue" aria-label="scroll">
        <span>{t(UI.hero.scroll)}</span>
        <i />
      </a>
    </section>
  );
}

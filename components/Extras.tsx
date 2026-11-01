"use client";

import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";
import Reveal from "./Reveal";

/** a slow-moving band of key names, right under the hero */
export function Ribbon() {
  const { t } = useLang();
  const items = [...UI.ribbon, ...UI.ribbon];
  return (
    <div className="ribbon" aria-hidden>
      <div className="ribbon-track">
        {items.map((w, i) => (
          <span key={i}>
            {t(w)}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>
  );
}

/** an ornamental divider between sections */
export function Ornament() {
  return (
    <div className="ornament" aria-hidden>
      <span />
      <svg viewBox="0 0 120 28" width="120" height="28">
        <path d="M60 2 C64 10 72 12 80 14 C72 16 64 18 60 26 C56 18 48 16 40 14 C48 12 56 10 60 2 Z" fill="#e3b04b" />
        <circle cx="26" cy="14" r="3" fill="#e3b04b" />
        <circle cx="94" cy="14" r="3" fill="#e3b04b" />
        <circle cx="12" cy="14" r="1.8" fill="#e3b04b" opacity=".6" />
        <circle cx="108" cy="14" r="1.8" fill="#e3b04b" opacity=".6" />
      </svg>
      <span />
    </div>
  );
}

/** the closing call-to-action before the footer */
export function Legacy() {
  const { t } = useLang();
  return (
    <section id="legacy" className="legacy">
      <div className="legacy-rays" aria-hidden />
      <Reveal className="legacy-inner">
        <p className="kicker">{t(UI.legacy.kicker)}</p>
        <h2>{t(UI.legacy.title)}</h2>
        <p className="lede">{t(UI.legacy.body)}</p>
        <div className="hero-cta center">
          <a className="btn primary" href="#heroes">
            {t(UI.legacy.a)}
          </a>
          <a className="btn ghost" href="#duel">
            {t(UI.legacy.b)}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

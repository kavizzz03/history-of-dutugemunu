"use client";

import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";
import { MONUMENTS, type Monument } from "@/lib/story";
import Reveal from "./Reveal";

function MonumentArt({ id }: { id: Monument["id"] }) {
  const sky = (
    <>
      <defs>
        <linearGradient id={`msky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b1d3a" />
          <stop offset=".6" stopColor="#a8532f" />
          <stop offset="1" stopColor="#f0b429" />
        </linearGradient>
        <linearGradient id={`mdome-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d8cfba" />
          <stop offset=".5" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#bfb49a" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" fill={`url(#msky-${id})`} />
      <circle cx="250" cy="60" r="26" fill="#fff3c4" opacity=".9" />
      <path d="M0 190 C60 176 120 184 180 178 C240 172 280 182 320 176 V220 H0 Z" fill="#1c130e" />
    </>
  );
  if (id === "lohapasada") {
    return (
      <svg viewBox="0 0 320 220" role="img" aria-label="Lohapasada">
        {sky}
        <g>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={70 + i * 12} y={150 - i * 24} width={180 - i * 24} height="20" fill="#7a3b1d" stroke="#3b1c0c" />
              <path d={`M${64 + i * 12} ${150 - i * 24} L${160} ${134 - i * 24} L${256 - i * 12} ${150 - i * 24} Z`} fill="#c97b2c" stroke="#7a4a12" />
              {Array.from({ length: 7 - i }).map((_, j) => (
                <rect key={j} x={80 + i * 12 + j * ((160 - i * 24) / (6 - i || 1))} y={152 - i * 24} width="4" height="16" fill="#e9d9b0" />
              ))}
            </g>
          ))}
          <path d="M160 34 L164 14 L156 14 Z" fill="#ffd34d" />
        </g>
      </svg>
    );
  }
  if (id === "mirisavetiya") {
    return (
      <svg viewBox="0 0 320 220" role="img" aria-label="Mirisavetiya">
        {sky}
        <rect x="70" y="176" width="180" height="10" rx="2" fill="#6b4a2a" />
        <path d="M82 176 C82 112 120 84 160 84 C200 84 238 112 238 176 Z" fill={`url(#mdome-${id})`} stroke="#8a7a56" />
        <rect x="146" y="68" width="28" height="16" fill="#fffaf0" stroke="#8a7a56" />
        <path d="M160 18 L168 68 H152 Z" fill="#ffd34d" stroke="#a8761a" />
        <rect x="278" y="110" width="3" height="66" fill="#6b4a2a" />
        <path d="M279.5 84 L286 110 L273 110 Z" fill="#e5e7eb" stroke="#4b5563" />
        <circle cx="279.5" cy="116" r="3" fill="#fff3b0" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 320 220" role="img" aria-label="Ruwanwelisaya">
      {sky}
      <rect x="40" y="180" width="240" height="8" rx="2" fill="#6b4a2a" />
      <rect x="54" y="170" width="212" height="10" fill="#e9dcc0" stroke="#8a7a56" />
      <rect x="66" y="160" width="188" height="10" fill="#f1e6cb" stroke="#8a7a56" />
      <path d="M70 160 C70 78 118 50 160 50 C202 50 250 78 250 160 Z" fill={`url(#mdome-${id})`} stroke="#8a7a56" />
      <rect x="140" y="34" width="40" height="18" fill="#fffaf0" stroke="#8a7a56" />
      <path d="M160 -4 L172 34 H148 Z" fill="#ffd34d" stroke="#a8761a" />
      {[96, 128, 160, 192, 224].map((x) => (
        <path key={x} d={`M${x} 120 C ${x} 150 ${x} 160 ${x} 160`} stroke="#c9bc9a" strokeWidth="1" opacity=".6" />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${60 + i * 6} ${196} h ${200 - i * 12}`} stroke="#3b2a18" strokeWidth="0" />
      ))}
    </svg>
  );
}

export default function Works() {
  const { t } = useLang();
  return (
    <section id="works" className="section works">
      <Reveal className="section-head">
        <p className="kicker">{t(UI.works.kicker)}</p>
        <h2>{t(UI.works.title)}</h2>
        <p className="lede">{t(UI.works.sub)}</p>
      </Reveal>

      <div className="works-grid">
        {MONUMENTS.map((m, i) => (
          <Reveal key={m.id} delay={i * 110}>
            <article className="work">
              <div className="work-art">
                <MonumentArt id={m.id} />
                <span className="work-year">{t(m.year)}</span>
              </div>
              <div className="work-body">
                <p className="card-tag">{t(m.tagline)}</p>
                <h3>{t(m.name)}</h3>
                <p>{t(m.text)}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="honour">
        <div className="honour-ring" aria-hidden>
          <svg viewBox="0 0 80 80" width="64" height="64">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#e3b04b" strokeWidth="2" />
            <path d="M40 14 L46 36 L40 66 L34 36 Z" fill="#e3b04b" />
            <circle cx="40" cy="40" r="5" fill="#0c0907" />
          </svg>
        </div>
        <div>
          <h3>{t(UI.works.honourTitle)}</h3>
          <p>{t(UI.works.honour)}</p>
        </div>
      </Reveal>
    </section>
  );
}

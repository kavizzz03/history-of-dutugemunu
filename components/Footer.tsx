"use client";

import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";

const LINKS = [
  { href: "#story", k: "story" },
  { href: "#heroes", k: "heroes" },
  { href: "#map", k: "map" },
  { href: "#duel", k: "duel" },
  { href: "#works", k: "works" },
] as const;

export default function Footer() {
  const { t, lang, setLang } = useLang();
  return (
    <footer className="footer" id="footer">
      <div className="footer-glow" aria-hidden />
      <svg className="footer-skyline" viewBox="0 0 1200 90" preserveAspectRatio="none" aria-hidden>
        <path d="M0 90 V70 C100 62 180 70 260 60 L270 48 L286 46 C286 20 316 8 330 8 C344 8 374 20 374 46 L390 48 L400 60 C480 66 540 62 600 58 C660 62 720 66 800 60 L810 48 L826 46 C826 22 852 12 866 12 C880 12 906 22 906 46 L922 48 L932 60 C1020 70 1100 62 1200 72 V90 Z" fill="rgba(227,176,75,0.07)" />
        <path d="M330 8 L333 -2 H327 Z M866 12 L869 2 H863 Z" fill="rgba(227,176,75,0.25)" />
      </svg>
      <div className="footer-embers" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} style={{ left: `${(i * 53) % 100}%`, animationDelay: `${(i * 0.9) % 8}s`, animationDuration: `${7 + ((i * 5) % 6)}s` }} />
        ))}
      </div>
      <div className="footer-grid">
        <div className="f-col f-brand">
          <a href="#top" className="f-logo">
            <span className="brand-mark" aria-hidden>
              <svg viewBox="0 0 32 32" width="26" height="26">
                <path d="M16 3 L17.2 9 H14.8 Z" fill="#ffd98a" />
                <path d="M5 24 C5 14 10 10 16 10 C22 10 27 14 27 24 Z" fill="#f4ead6" />
                <rect x="3" y="24" width="26" height="3" rx="1" fill="#e3b04b" />
              </svg>
            </span>
            <span>
              <b>{UI.brand.en}</b>
              <i>{UI.brand.si}</i>
            </span>
          </a>
          <p>{t(UI.footer.blurb)}</p>
          <div className="f-lang" role="group" aria-label="Language / භාෂාව">
            <span>{t(UI.footer.lang)}</span>
            <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>
              English
            </button>
            <button className={lang === "si" ? "on" : ""} onClick={() => setLang("si")} aria-pressed={lang === "si"}>
              සිංහල
            </button>
          </div>
        </div>

        <nav className="f-col" aria-label="Footer">
          <h4>{t(UI.footer.explore)}</h4>
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{t(UI.nav[l.k])}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="f-col">
          <h4>{t(UI.footer.about)}</h4>
          <ul className="f-facts">
            {UI.footer.facts.map((f, i) => (
              <li key={i}>{t(f)}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="f-note">{t(UI.footer.line)}</p>

      <div className="f-bottom">
        <div className="f-credit">
          <span>{t(UI.footer.credit)}</span>
          <strong>{t(UI.footer.author)}</strong>
        </div>
        <div className="f-meta">
          <span>
            © {new Date().getFullYear()} {UI.footer.author.en}. {t(UI.footer.rights)}
          </span>
        </div>
        <a href="#top" className="f-top" aria-label={t(UI.footer.top)}>
          <span>{t(UI.footer.top)}</span>
          <i aria-hidden>↑</i>
        </a>
      </div>
    </footer>
  );
}

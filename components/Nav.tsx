"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";

const IDS = ["story", "heroes", "map", "duel", "works"] as const;

export default function Nav() {
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0);
      // the section whose top has passed the upper third of the screen
      let cur = "";
      for (const id of IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id;
      }
      setActive(cur);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="progress" style={{ width: `${pct}%` }} aria-hidden />
      <a href="#top" className="brand">
        <span className="brand-mark" aria-hidden>
          <svg viewBox="0 0 32 32" width="26" height="26">
            <path d="M16 3 L17.2 9 H14.8 Z" fill="#ffd98a" />
            <path d="M5 24 C5 14 10 10 16 10 C22 10 27 14 27 24 Z" fill="#f4ead6" />
            <rect x="3" y="24" width="26" height="3" rx="1" fill="#e3b04b" />
          </svg>
        </span>
        <span className="brand-text">{t(UI.brand)}</span>
      </a>
      <nav className="nav-links" aria-label="Sections">
        {IDS.map((id, i) => (
          <a key={id} href={`#${id}`} className={active === id ? "on" : ""}>
            <em>{String(i + 1).padStart(2, "0")}</em>
            {t(UI.nav[id])}
          </a>
        ))}
      </nav>
      <div className="lang-switch" role="group" aria-label="Language / භාෂාව">
        <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>
          EN
        </button>
        <button className={lang === "si" ? "on" : ""} onClick={() => setLang("si")} aria-pressed={lang === "si"}>
          සිං
        </button>
      </div>
    </header>
  );
}

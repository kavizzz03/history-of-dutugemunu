"use client";

import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";
import { PHASES } from "@/lib/story";
import Reveal from "./Reveal";

const ROMAN = ["I", "II", "III", "IV", "V"];

export default function Story() {
  const { t } = useLang();
  return (
    <section id="story" className="section story">
      <Reveal className="section-head">
        <p className="kicker">{t(UI.story.kicker)}</p>
        <h2>{t(UI.story.title)}</h2>
        <p className="lede">{t(UI.story.sub)}</p>
      </Reveal>

      <ol className="timeline">
        {PHASES.map((p, i) => (
          <Reveal as="li" key={p.id} className={`tl-item ${i % 2 ? "right" : "left"}`} delay={60}>
            <span className="tl-medal" aria-hidden>
              {ROMAN[i]}
            </span>
            <article className="tl-card">
              <header>
                <span className="tl-years">{t(p.years)}</span>
                <h3>{t(p.title)}</h3>
              </header>
              <p className="tl-summary">{t(p.summary)}</p>
              <ul>
                {p.points.map((pt, j) => (
                  <li key={j}>{t(pt)}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}

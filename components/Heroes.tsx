"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";
import { CHARACTERS, GROUPS, STAT_LABELS, type Group } from "@/lib/characters";
import { STAGE_UI } from "@/lib/stage";
import Avatar from "./Avatar";
import Reveal from "./Reveal";

const HeroStage = dynamic(() => import("./HeroStage"), { ssr: false });
const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false,
  loading: () => <div className="viewer3d viewer-loading" />,
});

export default function Heroes() {
  const { t } = useLang();
  const [filter, setFilter] = useState<Group | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [view, setView] = useState<"3d" | "2d">("3d");
  const [near, setNear] = useState(false); // build the 3D hall only when the section is close
  const stageBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageBox.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "500px 0px" }); // also tears the hall down when far away, freeing the GPU for the map
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const list = useMemo(() => CHARACTERS.filter((c) => filter === "all" || c.group === filter), [filter]);
  const idx = openId ? list.findIndex((c) => c.id === openId) : -1;
  const current = idx >= 0 ? list[idx] : null;

  const step = useCallback(
    (d: number) => {
      if (idx < 0) return;
      setOpenId(list[(idx + d + list.length) % list.length].id);
    },
    [idx, list]
  );

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [current, step]);

  return (
    <section id="heroes" className="section heroes">
      <Reveal className="section-head">
        <p className="kicker">{t(UI.heroes.kicker)}</p>
        <h2>{t(UI.heroes.title)}</h2>
        <p className="lede">{t(UI.heroes.sub)}</p>
      </Reveal>

      <div className="chips" role="tablist">
        {GROUPS.map((g) => (
          <button key={g.id} role="tab" aria-selected={filter === g.id} className={`chip ${filter === g.id ? "on" : ""}`} onClick={() => setFilter(g.id)}>
            {t(g.label)}
          </button>
        ))}
      </div>

      <div className="hstage-wrap" ref={stageBox}>
        {near ? (
          <HeroStage list={list} onOpen={setOpenId} />
        ) : (
          <div className="hstage hstage-loading">{t(STAGE_UI.loading)}</div>
        )}
      </div>

      <div className="cards">
        {list.map((c, i) => (
          <Reveal key={c.id} delay={(i % 4) * 70}>
            <button className={`card g-${c.group}`} onClick={() => setOpenId(c.id)} aria-label={`${c.name.en} — ${t(UI.heroes.read)}`}>
              <Avatar character={c} />
              <div className="card-body">
                <span className="card-tag">{t(c.title)}</span>
                <h3>{t(c.name)}</h3>
                <p>{t(c.short)}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {current && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={current.name.en} onClick={() => setOpenId(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setOpenId(null)} aria-label={t(UI.heroes.close)}>
              ×
            </button>
            <div className="modal-art">
              <div className="view-tabs" role="tablist">
                <button role="tab" aria-selected={view === "3d"} className={view === "3d" ? "on" : ""} onClick={() => setView("3d")}>
                  {t(STAGE_UI.view3d)}
                </button>
                <button role="tab" aria-selected={view === "2d"} className={view === "2d" ? "on" : ""} onClick={() => setView("2d")}>
                  {t(STAGE_UI.view2d)}
                </button>
              </div>
              {view === "3d" ? <ModelViewer key={current.id} character={current} /> : <Avatar character={current} />}
            </div>
            <div className="modal-text">
              <span className="card-tag">{t(current.title)}</span>
              <h3>{t(current.name)}</h3>
              <p className="modal-alt">{current.name[otherLang(t, current.name)]}</p>
              <p>{t(current.long)}</p>
              <div className="meter">
                <h4>{t(UI.heroes.meter)}</h4>
                {(Object.keys(current.stats) as (keyof typeof current.stats)[]).map((k) => (
                  <div key={k} className="meter-row">
                    <span>{t(STAT_LABELS[k])}</span>
                    <div className="bar">
                      <i style={{ width: `${current.stats[k]}%` }} />
                    </div>
                    <b>{current.stats[k]}</b>
                  </div>
                ))}
                <small>{t(UI.heroes.meterNote)}</small>
              </div>
              <div className="modal-nav">
                <button className="btn ghost" onClick={() => step(-1)}>
                  ← {t(UI.heroes.prev)}
                </button>
                <button className="btn primary" onClick={() => step(1)}>
                  {t(UI.heroes.next)} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/** the language that is NOT currently displayed (so both languages are always visible) */
function otherLang(t: (v: { en: string; si: string }) => string, name: { en: string; si: string }): "en" | "si" {
  return t(name) === name.en ? "si" : "en";
}

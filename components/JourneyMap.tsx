"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";
import { STAGES } from "@/lib/journey";
import { PLACES, PLACES_UI, RIVER_LABEL } from "@/lib/places";
import Reveal from "./Reveal";

const Map3D = dynamic(() => import("./Map3D"), {
  ssr: false,
  loading: () => <MapLoading />,
});

function MapLoading() {
  const { t } = useLang();
  return (
    <div className="map-loading">
      <div className="spinner" />
      <span>{t(UI.map.loading)}</span>
    </div>
  );
}

const KINDS = ["origin", "base", "exile", "battle", "siege", "capital"] as const;

export default function JourneyMap() {
  const { t, lang } = useLang();
  const [active, setActive] = useState(-1); // -1 = whole island
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(false); // mount the 3D scene once the section is close
  const [inView, setInView] = useState(false); // run the render loop only while on screen
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        setInView(e.isIntersecting);
      },
      { rootMargin: "150px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = useCallback((i: number) => {
    setActive(Math.max(-1, Math.min(STAGES.length - 1, i)));
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setActive((a) => {
        if (a >= STAGES.length - 1) {
          setPlaying(false);
          return a;
        }
        return a + 1;
      });
    }, 7000);
    return () => clearInterval(id);
  }, [playing]);

  const stage = active >= 0 ? STAGES[active] : null;

  return (
    <section id="map" className="section mapsec">
      <Reveal className="section-head">
        <p className="kicker">{t(UI.map.kicker)}</p>
        <h2>{t(UI.map.title)}</h2>
        <p className="lede">{t(UI.map.sub)}</p>
      </Reveal>

      <div className="map-grid">
        <div className="map-stage" ref={stageRef}>
          {near ? <Map3D active={active} lang={lang === "si" ? "si" : "en"} running={inView} onSelect={(i) => { setPlaying(false); go(i); }} /> : <MapLoading />}
          <div className="map-hint">{t(UI.map.hint)}</div>
          <div className="map-toolbar">
            <button className={`btn small ${active === -1 ? "primary" : "ghost"}`} onClick={() => { setPlaying(false); go(-1); }}>
              {t(UI.map.overview)}
            </button>
            <button className="btn small ghost" onClick={() => { setPlaying(false); go(active - 1); }} disabled={active < 0}>
              ← {t(UI.map.prev)}
            </button>
            <button
              className="btn small primary"
              onClick={() => {
                if (!playing && active >= STAGES.length - 1) setActive(-1);
                if (!playing && active < 0) setActive(0);
                setPlaying((p) => !p);
              }}
            >
              {playing ? `❚❚ ${t(UI.map.pause)}` : `▶ ${t(UI.map.play)}`}
            </button>
            <button className="btn small ghost" onClick={() => { setPlaying(false); go(active + 1); }} disabled={active >= STAGES.length - 1}>
              {t(UI.map.next)} →
            </button>
          </div>
        </div>

        <aside className="map-panel">
          <div className="story-card" key={active}>
            {stage ? (
              <>
                <div className="story-meta">
                  <span className="pill">
                    {t(UI.map.stage)} {active + 1} {t(UI.map.of)} {STAGES.length}
                  </span>
                  <span className="pill alt">{t(stage.year)}</span>
                </div>
                <h3>{t(stage.title)}</h3>
                <p className="place">📍 {t(stage.place)}</p>
                <p>{t(stage.text)}</p>
                {stage.id === "anuradhapura" && (
                  <a href="#duel" className="btn small primary duel-link">
                    ⚔ {t(PLACES_UI.watch)}
                  </a>
                )}
              </>
            ) : (
              <>
                <div className="story-meta">
                  <span className="pill">{t(UI.map.overview)}</span>
                </div>
                <h3>{t(UI.map.title)}</h3>
                <p>{t(UI.map.sub)}</p>
              </>
            )}
          </div>

          <ol className="steps">
            {STAGES.map((s, i) => (
              <li key={s.id}>
                <button className={`step ${i === active ? "on" : ""} ${i < active ? "done" : ""}`} onClick={() => { setPlaying(false); go(i); }}>
                  <span className={`dot k-${s.kind}`}>{i + 1}</span>
                  <span className="step-text">
                    <b>{t(s.title)}</b>
                    <em>{t(s.place)}</em>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <ul className="legend">
            {KINDS.map((k) => (
              <li key={k}>
                <i className={`k-${k}`} />
                {t(UI.map.legend[k])}
              </li>
            ))}
          </ul>
          <div className="places-card">
            <h4>{t(PLACES_UI.title)}</h4>
            <ul>
              <li>
                <button onClick={() => { setPlaying(false); go(4); }}>
                  <i className="pdot river" />
                  <span>
                    <b>{t(RIVER_LABEL.name)}</b>
                    <em>{t(RIVER_LABEL.text)}</em>
                  </span>
                </button>
              </li>
              {PLACES.map((p) => (
                <li key={p.id}>
                  <button onClick={() => { setPlaying(false); go(7); }}>
                    <i className={`pdot ${p.kind}`} />
                    <span>
                      <b>{t(p.name)}</b>
                      <em>{t(p.text)}</em>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="places-hint">{t(PLACES_UI.zoomHint)}</p>
          </div>
          <p className="approx">{t(UI.map.approx)}</p>
        </aside>
      </div>
    </section>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";
import { UI } from "@/lib/ui";
import { STAGES } from "@/lib/journey";
import { PLACES, PLACES_UI, RIVER_LABEL } from "@/lib/places";
import { useMusic } from "@/lib/useMusic";
import Reveal from "./Reveal";

// one automatic retry if the 3D chunk fails to download (flaky network)
const loadMap = () => import("./Map3D");
const Map3D = dynamic(() => loadMap().catch(() => new Promise<typeof import("./Map3D")>((r) => setTimeout(() => r(loadMap()), 1200))), {
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
  const [epoch, setEpoch] = useState(0); // bump to rebuild the 3D scene from scratch
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false); // show a manual "load the map" button if it takes too long
  const rebuild = useCallback(() => {
    setReady(false);
    setSlow(false);
    setEpoch((n) => n + 1);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        // build the scene when the section is near, and let it go when it is far away (keeps only one heavy GL scene alive)
        setNear(e.isIntersecting);
        setInView(e.isIntersecting);
        if (!e.isIntersecting) setReady(false);
      },
      { rootMargin: "500px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || ready) return;
    const id = setTimeout(() => setSlow(true), 12000);
    return () => clearTimeout(id);
  }, [near, ready, epoch]);

  const go = useCallback((i: number) => {
    setActive(Math.max(-1, Math.min(STAGES.length - 1, i)));
  }, []);

  // each stage lingers as long as its scene needs: the ship's voyage and the marches take longer
  useEffect(() => {
    if (!playing) return;
    if (active >= STAGES.length - 1) {
      setPlaying(false);
      return;
    }
    const dwell = [13000, 8500, 7000, 10000, 9500, 9000, 9500, 10500, 8000][active + 1] ?? 8000;
    const id = setTimeout(() => setActive((a) => Math.min(STAGES.length - 1, a + 1)), active < 0 ? 3500 : dwell);
    return () => clearTimeout(id);
  }, [playing, active]);

  // the song plays while the journey plays
  const music = useMusic("/audio/aloko-udapadi.mp3", playing && inView, 0.5);

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
          {near ? <Map3D key={epoch} active={active} lang={lang === "si" ? "si" : "en"} running={inView} onReady={() => { setReady(true); setSlow(false); }} onLost={rebuild} onSelect={(i) => { setPlaying(false); go(i); }} /> : <MapLoading />}
          {near && !ready && slow && (
            <button className="map-reload btn primary" onClick={rebuild}>
              ↻ {t(UI.map.reload)}
            </button>
          )}
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
            <button className={`btn small ghost music ${music.on && !music.blocked ? "on" : ""}`} onClick={music.toggle} aria-pressed={music.on && !music.blocked}>
              {music.blocked ? `♪ ${t(UI.map.musicTap)}` : music.on ? `♪ ${t(UI.map.musicOn)}` : `✕ ${t(UI.map.musicOff)}`}
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
                {stage.id === "kulanganiya" && <p className="brothers-note">⚔ {t(PLACES_UI.brothers)}</p>}
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

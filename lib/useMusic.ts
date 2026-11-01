"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Background music that plays only while `want` is true.
 *  Browsers allow sound only after a tap/click, so when play() is refused we report `blocked`
 *  and retry on the very next gesture. Volume fades in and out. */
export function useMusic(src: string, want: boolean, volume = 0.5) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [on, setOn] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [unlock, setUnlock] = useState(0);

  useEffect(() => {
    const a = new Audio(src);
    a.loop = true;
    a.preload = "none";
    a.volume = 0;
    audio.current = a;
    return () => {
      a.pause();
      audio.current = null;
    };
  }, [src]);

  useEffect(() => {
    const retry = () => setUnlock((n) => n + 1);
    window.addEventListener("pointerdown", retry, { once: true });
    window.addEventListener("keydown", retry, { once: true });
    return () => {
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
    };
  }, []);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    let fade = 0;
    const ramp = (to: number, done?: () => void) => {
      clearInterval(fade);
      fade = window.setInterval(() => {
        const d = to - a.volume;
        if (Math.abs(d) < 0.03) {
          a.volume = to;
          clearInterval(fade);
          done?.();
        } else a.volume = Math.max(0, Math.min(1, a.volume + Math.sign(d) * 0.03));
      }, 40);
    };
    if (on && want) {
      a.play()
        .then(() => {
          setBlocked(false);
          ramp(volume);
        })
        .catch(() => setBlocked(true));
    } else if (!a.paused) {
      ramp(0, () => a.pause());
    }
    return () => clearInterval(fade);
  }, [on, want, unlock, volume]);

  const toggle = useCallback(() => {
    setOn((m) => (blocked ? true : !m));
    setBlocked(false);
    setUnlock((n) => n + 1);
  }, [blocked]);

  return { on, blocked, toggle };
}

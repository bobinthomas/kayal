"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/** Run `onFrame` on scroll + Lenis RAF — keeps parallax in sync with smooth scroll. */
export function useScrollFrame(onFrame: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    let ticking = false;
    const schedule = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onFrame();
        ticking = false;
      });
    };

    const onLenisReady = (e: Event) => {
      const lenis = (e as CustomEvent<{ lenis: Lenis }>).detail?.lenis;
      if (!lenis) return;
      lenis.on("scroll", schedule);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("kayal:lenis-ready", onLenisReady);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("kayal:lenis-ready", onLenisReady);
    };
  }, [onFrame, enabled]);
}

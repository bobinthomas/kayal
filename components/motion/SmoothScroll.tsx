"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";

/** Buttery smooth scroll — the Mr. Pops / premium-site feel. */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Expose for scroll-linked components (horizontal gallery, parallax).
    window.__kayalLenis = lenis;
    window.dispatchEvent(new CustomEvent("kayal:lenis-ready", { detail: { lenis } }));

    return () => {
      cancelAnimationFrame(frame);
      delete window.__kayalLenis;
      lenis.destroy();
    };
  }, []);

  return null;
}

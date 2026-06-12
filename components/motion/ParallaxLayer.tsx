"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { applyParallaxOffset } from "@/lib/useSectionMotion";

/** Decorative layer inside a section — drifts at its own parallax speed. */
export default function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    // Use parent section for centre reference when available.
    const section = el.closest("[data-section-scene]");

    let ticking = false;
    const update = () => {
      const target = section?.getBoundingClientRect() ?? el.getBoundingClientRect();
      const vh = window.innerHeight;
      const centerOffset = target.top + target.height / 2 - vh / 2;
      applyParallaxOffset(el, centerOffset, speed);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      data-parallax-layer
      className={`pointer-events-none absolute will-change-transform ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

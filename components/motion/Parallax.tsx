"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useScrollFrame } from "@/lib/useScrollFrame";
import { applyParallaxOffset } from "@/lib/useSectionMotion";

/**
 * Viewport-relative parallax — offset from element centre vs. screen centre.
 * Unlike global scrollY parallax, this keeps layers drifting only while on screen.
 */
export default function Parallax({
  children,
  speed = 0.35,
  className = "",
  axis = "y",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  axis?: "y" | "x";
}) {
  const ref = useRef<HTMLDivElement>(null);

  const reduced = prefersReducedMotion();

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const centerOffset = rect.top + rect.height / 2 - vh / 2;

    if (axis === "x") {
      const x = centerOffset * speed * 0.08;
      el.style.transform = `translate3d(${x}px, 0, 0)`;
    } else {
      applyParallaxOffset(el, centerOffset, speed);
    }
  }, [speed, axis]);

  useScrollFrame(update, !reduced);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}

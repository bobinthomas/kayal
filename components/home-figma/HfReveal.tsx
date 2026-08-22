"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type HfRevealVariant = "up" | "fade" | "left" | "right" | "scale";

const HIDDEN_CLASS: Record<HfRevealVariant, string> = {
  up: "opacity-0 translate-y-16",
  fade: "opacity-0",
  left: "opacity-0 -translate-x-16",
  right: "opacity-0 translate-x-16",
  scale: "opacity-0 scale-90",
};

/** Scroll reveal that re-triggers both ways: animates in on enter, reverses
 * on exit (either edge), so it replays if the user scrolls back up. Unlike
 * the site-wide `Reveal`, which is a one-shot IO reveal. Scoped to the
 * home-figma preview. */
export default function HfReveal({
  children,
  as: Tag = "div",
  variant = "up",
  delayMs = 0,
  durationMs = 900,
  className = "",
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: HfRevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px", threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const show = reduced || visible;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={`transition-[opacity,transform] ease-out ${show ? "translate-x-0 translate-y-0 scale-100 opacity-100" : HIDDEN_CLASS[variant]} ${className}`}
      style={{ transitionDuration: `${durationMs}ms`, transitionDelay: show ? `${delayMs}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

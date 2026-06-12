"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealVariant = "default" | "scale" | "blur" | "left" | "right";

const variantClass: Record<RevealVariant, string> = {
  default: "reveal",
  scale: "reveal reveal-scale",
  blur: "reveal reveal-blur",
  left: "reveal reveal-left",
  right: "reveal reveal-right",
};

/** Scroll-reveal with variant + stagger delay (CSS-only, IO-triggered). */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  variant = "default",
  delay,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "li" | "article";
  variant?: RevealVariant;
  delay?: 1 | 2 | 3 | 4 | 5;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const delayClass = delay ? `reveal-delay-${delay}` : "";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible");
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={`${variantClass[variant]} ${delayClass} ${className}`}>
      {children}
    </Tag>
  );
}

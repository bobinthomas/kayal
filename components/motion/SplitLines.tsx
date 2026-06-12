"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Editorial headline — each line reveals on scroll with stagger (Mr. Pops typography).
 */
export default function SplitLines({
  lines,
  className = "",
  as: Tag = "h1",
}: {
  lines: { text: string; className?: string }[];
  className?: string;
  as?: "h1" | "h2" | "p";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      root.querySelectorAll(".split-line-inner").forEach((el) => {
        el.classList.add("is-visible");
      });
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
      { threshold: 0.2, rootMargin: "0px 0px -5% 0px" },
    );

    root.querySelectorAll(".split-line").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="split-line block overflow-hidden">
          <span
            className={`split-line-inner block ${line.className ?? ""}`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            {line.text}
          </span>
        </span>
      ))}
    </Tag>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/** Floating backwater mist — Mr. Pops' drifting cloud layers, Kayal edition. */
export default function MistClouds({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = ref.current;
    if (!root) return;

    const layers = root.querySelectorAll<HTMLElement>("[data-mist-speed]");
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.mistSpeed ?? "0.1");
        const x = Math.sin(y * 0.002 + speed * 10) * 20;
        layer.style.transform = `translate3d(${x}px, ${y * speed}px, 0)`;
      });
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
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        data-mist-speed="0.08"
        className="mist-blob absolute -left-[10%] top-[8%] w-[55%] text-cream/10"
        viewBox="0 0 400 120"
        fill="currentColor"
      >
        <ellipse cx="200" cy="60" rx="190" ry="45" />
      </svg>
      <svg
        data-mist-speed="0.14"
        className="mist-blob absolute -right-[5%] top-[22%] w-[45%] text-turmeric/8"
        viewBox="0 0 360 100"
        fill="currentColor"
      >
        <ellipse cx="180" cy="50" rx="170" ry="38" />
      </svg>
      <svg
        data-mist-speed="0.05"
        className="mist-blob absolute left-[20%] bottom-[15%] w-[70%] text-leaf/15"
        viewBox="0 0 500 90"
        fill="currentColor"
      >
        <ellipse cx="250" cy="45" rx="240" ry="35" />
      </svg>
    </div>
  );
}

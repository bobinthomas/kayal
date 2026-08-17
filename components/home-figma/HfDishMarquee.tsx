"use client";

import { useState } from "react";
import { marqueeDishes } from "@/data/copy";

/**
 * Scrolling dish ticker between the hero and heritage sections. Pure CSS
 * animation (see .marquee-row in globals.css); pausable, static under
 * prefers-reduced-motion.
 */
export default function HfDishMarquee() {
  const [paused, setPaused] = useState(false);
  const row = [...marqueeDishes, ...marqueeDishes];

  return (
    <section
      aria-label="Dishes on the menu"
      className="marquee relative overflow-hidden border-y border-hf-border bg-hf-ink py-3.5"
      data-paused={paused}
    >
      <div className="marquee-fade">
        <div className="marquee-row" aria-hidden="true">
          {row.map((dish, i) => (
            <span
              key={i}
              className="flex shrink-0 items-center gap-4 px-5 font-hf-heading text-[2.125rem] font-medium text-white"
            >
              {dish}
              <span className="text-hf-amber" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
      <span className="sr-only">{marqueeDishes.join(", ")}</span>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Resume dish ticker" : "Pause dish ticker"}
        className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors hover:border-hf-amber/60 hover:bg-black/40 no-print"
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M3 1.5l8 4.5-8 4.5z" /> : <path d="M2 1.5h3v9H2zM7 1.5h3v9H7z" />}
        </svg>
      </button>
    </section>
  );
}

"use client";

import { useState } from "react";
import { marqueeDishes } from "@/data/copy";

/**
 * Dual-row dish ribbon — opposite scroll directions, edge fades, gold separators.
 * Pure CSS; pausable; static under prefers-reduced-motion.
 */
export default function Marquee() {
  const [paused, setPaused] = useState(false);
  const row1 = [...marqueeDishes, ...marqueeDishes];
  const row2 = [...[...marqueeDishes].reverse(), ...[...marqueeDishes].reverse()];

  return (
    <section
      aria-label="Signature dishes"
      className="marquee relative overflow-hidden border-y border-turmeric/20 bg-gradient-to-r from-chilli via-[#c41e32] to-chilli py-4 text-cream"
      data-paused={paused}
    >
      <div className="marquee-fade">
        <div className="marquee-row mb-2" aria-hidden="true">
          {row1.map((dish, i) => (
            <span
              key={`a-${i}`}
              className="flex shrink-0 items-center gap-4 px-5 font-display text-xl font-medium tracking-wide sm:text-2xl"
              style={{ fontVariationSettings: '"WONK" 0.6' }}
            >
              {dish}
              <span className="text-turmeric" aria-hidden="true">✦</span>
            </span>
          ))}
        </div>
        <div className="marquee-row marquee-row-reverse opacity-70" aria-hidden="true">
          {row2.map((dish, i) => (
            <span
              key={`b-${i}`}
              className="flex shrink-0 items-center gap-4 px-5 font-display text-base font-medium tracking-widest uppercase sm:text-lg"
            >
              {dish}
              <span className="text-turmeric/80" aria-hidden="true">·</span>
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
        className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-cream/25 bg-ink/25 text-cream backdrop-blur-sm transition-colors hover:border-turmeric/50 hover:bg-ink/40 no-print"
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M3 1.5l8 4.5-8 4.5z" /> : <path d="M2 1.5h3v9H2zM7 1.5h3v9H7z" />}
        </svg>
      </button>
    </section>
  );
}

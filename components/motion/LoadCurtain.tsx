"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "@/lib/motion";

const STORAGE_KEY = "kayal-curtain-seen";

/**
 * Branded load curtain with percentage counter — inspired by Mr. Pops' 00% intro.
 * Shows once per browser session on the home page only.
 */
export default function LoadCurtain() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const isHome = pathname === "/" || pathname === "";
    if (!isHome || prefersReducedMotion()) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    let frame = 0;
    let exitTimer: ReturnType<typeof setTimeout>;
    const startTimer = setTimeout(() => {
      setVisible(true);
      document.body.classList.add("curtain-active");

      const start = performance.now();
      const duration = 1400;

      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setPct(Math.round(eased * 100));
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setExiting(true);
          exitTimer = setTimeout(() => {
            setVisible(false);
            document.body.classList.remove("curtain-active");
            sessionStorage.setItem(STORAGE_KEY, "1");
          }, 700);
        }
      };
      frame = requestAnimationFrame(tick);
    }, 0);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(exitTimer);
      cancelAnimationFrame(frame);
      document.body.classList.remove("curtain-active");
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={`load-curtain fixed inset-0 z-[100] flex flex-col items-center justify-center bg-banana-dark text-cream ${
        exiting ? "load-curtain-exit" : ""
      }`}
      aria-hidden="true"
    >
      <p
        className="font-display text-4xl font-semibold tracking-tight sm:text-5xl"
        style={{ fontVariationSettings: '"WONK" 1.2' }}
      >
        Kayal
      </p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-turmeric">
        Foods
      </p>
      <p className="load-curtain-counter mt-10 font-display text-6xl font-light tabular-nums text-turmeric sm:text-8xl">
        {String(pct).padStart(2, "0")}
        <span className="text-2xl text-cream/40">%</span>
      </p>
      <p className="mt-4 text-xs uppercase tracking-[0.35em] text-cream/40">
        Kerala&apos;s village table
      </p>
    </div>
  );
}

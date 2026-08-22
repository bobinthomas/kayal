"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { LOGO_SVG } from "@/components/motion/kayal-foods-logo";

const STORAGE_KEY = "kayal-curtain-seen";
const WORDS = ["DINE-IN", "TAKEAWAY", "CATERING", "EVENTS"];

/**
 * Branded load curtain — the logo self-draws stroke by stroke, then lifts
 * and the words spread into a row beneath it while a bottom bar fills in
 * step. Shows once per browser session on the home page only. Respects
 * prefers-reduced-motion.
 */
export default function LoadCurtain() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isHome = pathname === "/" || pathname === "";
    if (!isHome) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const startTimer = setTimeout(() => {
      setVisible(true);
      document.body.classList.add("curtain-active");
    }, 0);

    return () => {
      clearTimeout(startTimer);
      document.body.classList.remove("curtain-active");
    };
  }, [pathname]);

  useEffect(() => {
    if (!visible) return;
    const root = rootRef.current;
    if (!root) return;

    const finish = () => {
      document.body.classList.remove("curtain-active");
      sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    };

    const splitWord = (word: Element) => {
      const text = word.textContent || "";
      word.textContent = "";
      const chars: HTMLElement[] = [];
      text.split("").forEach((ch) => {
        const mask = document.createElement("span");
        mask.className = "inline-block overflow-hidden";
        const char = document.createElement("span");
        char.className = "inline-block will-change-transform";
        char.textContent = ch === " " ? " " : ch;
        mask.appendChild(char);
        word.appendChild(mask);
        chars.push(char);
      });
      return chars;
    };

    const logo = root.querySelector(".ki-logo") as HTMLElement;
    const center = root.querySelector(".ki-center") as HTMLElement;
    const smallChars: HTMLElement[] = [];
    root.querySelectorAll(".ki-words .ki-word").forEach((w) => splitWord(w).forEach((c) => smallChars.push(c)));

    // getBBox() returns zeros on visibility:hidden ancestors — unhide for measurement.
    const cnEl = root.querySelector(".ki-center") as HTMLElement | null;
    const kwEl = root.querySelector(".ki-words") as HTMLElement | null;
    if (cnEl) cnEl.style.visibility = "visible";
    if (kwEl) kwEl.style.visibility = "visible";

    const paths = Array.from(logo.querySelectorAll("path")) as SVGPathElement[];

    type PathInfo = { p: SVGPathElement; fill: string; len: number; w: number };
    const readInfo = (p: SVGPathElement): PathInfo => {
      const fill = p.getAttribute("fill") || "#fff";
      let len = 400;
      let w = 3;
      try {
        len = p.getTotalLength();
        const box = p.getBBox();
        w = Math.min(7, Math.max(1.5, Math.sqrt(box.width * box.height) / 55));
      } catch {
        /* keep defaults */
      }
      return { p, fill, len, w };
    };

    // This file (unlike the sibling Kayal Events logo) wasn't authored with
    // draw-order groups, so paths are hand-classified by what they actually
    // depict, in the source's own document order — not sorted by position,
    // which scatters unrelated shapes together and breaks each wordmark
    // letter's color-fill + white-highlight pairing (its "glossy" look).
    // Wordmark leads as the hero reveal; everything else follows as detail.
    const GROUPS: { name: string; start: number; end: number; stagger: number; draw: number; pairGap?: number }[] = [
      { name: "wordmark", start: 24, end: 33, stagger: 0.16, draw: 0.28, pairGap: 0.08 },
      { name: "wave", start: 21, end: 23, stagger: 0.08, draw: 0.3 },
      { name: "palmFrond", start: 0, end: 8, stagger: 0.025, draw: 0.18 },
      { name: "palmTrunk", start: 9, end: 20, stagger: 0.015, draw: 0.14 },
      { name: "trademark", start: 34, end: 35, stagger: 0.04, draw: 0.16 },
      { name: "lagoonLabel", start: 36, end: 41, stagger: 0.025, draw: 0.16 },
      { name: "foodsLabel", start: 42, end: 46, stagger: 0.025, draw: 0.16 },
    ];
    const GROUP_GAP = 0.06;

    type Scheduled = { info: PathInfo; t: number; draw: number };
    const schedule: Scheduled[] = [];
    let cursor = 0;
    GROUPS.forEach((g) => {
      const members = paths.slice(g.start, g.end + 1).map(readInfo);
      if (g.name === "wordmark") {
        // members alternate [colored, white] per letter, in that order.
        for (let letter = 0; letter < members.length; letter += 2) {
          const base = cursor + (letter / 2) * g.stagger;
          schedule.push({ info: members[letter], t: base, draw: g.draw });
          schedule.push({ info: members[letter + 1], t: base + (g.pairGap ?? 0.1), draw: g.draw });
        }
        const letters = members.length / 2;
        cursor += (letters - 1) * g.stagger + (g.pairGap ?? 0.1) + g.draw + GROUP_GAP;
      } else {
        members.forEach((m, i) => schedule.push({ info: m, t: cursor + i * g.stagger, draw: g.draw }));
        cursor += (members.length - 1) * g.stagger + g.draw + GROUP_GAP;
      }
    });
    const drawSpan = cursor - GROUP_GAP;

    const forceAnim = new URLSearchParams(window.location.search).has("anim");
    const reduce = prefersReducedMotion() && !forceAnim;

    const ctx = gsap.context(() => {
      schedule.forEach((s) =>
        gsap.set(s.info.p, {
          opacity: 0,
          fillOpacity: 0,
          stroke: s.info.fill,
          strokeWidth: s.info.w,
          strokeOpacity: 1,
          strokeDasharray: s.info.len,
          strokeDashoffset: s.info.len,
          strokeLinecap: "round",
          strokeLinejoin: "round",
        }),
      );
      gsap.set(center, { y: 0, scale: 1, transformOrigin: "50% 50%" });
      gsap.set(smallChars, { yPercent: 120 });

      if (reduce) {
        schedule.forEach((s) => gsap.set(s.info.p, { opacity: 1, fillOpacity: 1, strokeOpacity: 0, strokeDashoffset: 0 }));
        gsap.set(center, { y: -56, scale: 0.72 });
        gsap.set(smallChars, { yPercent: 0 });
        setPct(100);
        gsap.to(root, { autoAlpha: 0, duration: 0.4, delay: 0.5, onComplete: finish });
        return;
      }

      const tl = gsap.timeline({
        onUpdate: () => setPct(Math.round(tl.progress() * 100)),
        onComplete: () => gsap.to(root, { autoAlpha: 0, duration: 0.45, delay: 0.25, onComplete: finish }),
      });

      // 1) logo self-draw, in curated group order (see GROUPS above)
      const LOGO_START = 0.15;
      schedule.forEach((s) => {
        const t = LOGO_START + s.t;
        tl.set(s.info.p, { opacity: 1 }, t);
        tl.to(s.info.p, { strokeDashoffset: 0, duration: s.draw, ease: "power1.inOut" }, t);
        tl.to(s.info.p, { fillOpacity: 1, strokeOpacity: 0, duration: 0.4, ease: "power1.out" }, t + s.draw * 0.6);
      });

      // 2) lift + shrink, then spread small words beneath
      const moveT = LOGO_START + drawSpan + 0.1;
      tl.to(center, { y: -56, scale: 0.72, duration: 0.5, ease: "power3.inOut" }, moveT);
      tl.to(smallChars, { yPercent: 0, duration: 0.4, ease: "power3.out", stagger: 0.015 }, moveT + 0.22);
    }, root);

    return () => ctx.revert();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-hf-footer text-white"
      aria-hidden="true"
    >
      <div className="ki-center invisible flex w-[min(72%,560px)] items-center justify-center will-change-transform">
        <div className="ki-logo w-full [&_svg]:block [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
      </div>

      <div className="ki-words invisible absolute inset-x-0 top-1/2 mt-[76px] flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6">
        {WORDS.map((w) => (
          <span
            key={"sm-" + w}
            className="ki-word whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em] text-hf-amber"
          >
            {w}
          </span>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 h-[3px] bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-hf-amber to-hf-red"
          style={{ width: `${pct}%`, transition: "width 100ms linear" }}
        />
      </div>
      <p className="fixed bottom-3 right-4 text-[11px] font-medium tabular-nums text-white/60">
        {String(pct).padStart(2, "0")}%
      </p>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { useScrollFrame } from "@/lib/useScrollFrame";
import {
  applySectionInnerMotion,
  getSectionMotion,
} from "@/lib/useSectionMotion";

type Intensity = "subtle" | "medium" | "bold";

const intensityMap: Record<Intensity, number> = {
  subtle: 0.6,
  medium: 1,
  bold: 1.35,
};

/**
 * Mr. Pops-style section wrapper — scroll-linked enter (scale + rise + fade)
 * plus continuous parallax on decorative layers while the section is in view.
 */
export default function SectionScene({
  children,
  className = "",
  id,
  "aria-labelledby": ariaLabelledby,
  as: Tag = "section",
  intensity = "medium",
  parallaxLayers,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
  as?: "section" | "div";
  intensity?: Intensity;
  /** Optional floating decor — each item is { node, speed } */
  parallaxLayers?: { node: ReactNode; speed: number; className?: string }[];
}) {
  const ref = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mult = intensityMap[intensity];

  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      const inner = innerRef.current;
      if (inner) {
        inner.style.opacity = "1";
        inner.style.transform = "none";
      }
    }
  }, [reduced]);

  const update = useCallback(() => {
    const section = ref.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    const layers = section.querySelectorAll<HTMLElement>("[data-scene-layer]");
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const motion = getSectionMotion(rect, vh);

    applySectionInnerMotion(inner, motion, mult);
    section.style.setProperty("--section-enter", String(motion.enter));
    section.style.setProperty("--section-progress", String(motion.progress));
    section.style.setProperty("--section-visibility", String(motion.visibility));

    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.sceneLayer ?? "0.4");
      const y = motion.centerOffset * speed * 0.14;
      const scale = 1 + motion.progress * 0.04 * speed;
      layer.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
      layer.style.opacity = String(Math.min(motion.visibility * 1.1, 1));
    });
  }, [mult]);

  useScrollFrame(update, !reduced);

  const inner = (
    <>
      {parallaxLayers?.map((layer, i) => (
        <div
          key={i}
          data-scene-layer={layer.speed}
          className={`pointer-events-none absolute will-change-transform ${layer.className ?? ""}`}
          aria-hidden="true"
        >
          {layer.node}
        </div>
      ))}
      <div ref={innerRef} className="section-scene-inner relative z-10">
        {children}
      </div>
    </>
  );

  const sceneClass = `section-scene relative ${className}`;

  if (Tag === "div") {
    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        id={id}
        aria-labelledby={ariaLabelledby}
        data-section-scene
        className={sceneClass}
      >
        {inner}
      </div>
    );
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id={id}
      aria-labelledby={ariaLabelledby}
      data-section-scene
      className={sceneClass}
    >
      {inner}
    </section>
  );
}

import { clamp } from "@/lib/motion";

export type SectionMotion = {
  /** 0→1 as section scrolls into view from below */
  enter: number;
  /** 0→1 overall progress through the section in the viewport */
  progress: number;
  /** Distance of section centre from viewport centre (px) — drives parallax */
  centerOffset: number;
  /** Combined visibility 0→1 while section is on screen */
  visibility: number;
};

/** Scroll-linked motion values for a section bounding rect (Mr. Pops-style). */
export function getSectionMotion(rect: DOMRect, vh: number): SectionMotion {
  const enter = clamp((vh - rect.top) / (vh * 0.85), 0, 1);
  const progress = clamp(
    1 - (rect.top + rect.height * 0.5) / (vh + rect.height * 0.5),
    0,
    1,
  );
  const centerOffset = rect.top + rect.height / 2 - vh / 2;
  const visibility = clamp(
    Math.min(enter, rect.bottom / (vh * 0.25)) * 1.2,
    0,
    1,
  );

  return { enter, progress, centerOffset, visibility };
}

export function applySectionInnerMotion(
  el: HTMLElement,
  { enter, visibility }: SectionMotion,
  intensity: number,
) {
  const y = (1 - enter) * 72 * intensity;
  const scale = 0.94 + enter * 0.06;
  const opacity = Math.min(visibility * 1.15, 1);
  const rotate = (1 - enter) * 0.4 * intensity;

  el.style.opacity = String(opacity);
  el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
}

export function applyParallaxOffset(
  el: HTMLElement,
  centerOffset: number,
  speed: number,
) {
  const y = centerOffset * speed * 0.12;
  el.style.transform = `translate3d(0, ${y}px, 0)`;
}

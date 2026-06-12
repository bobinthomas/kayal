/** Shared motion helpers — always respect user preferences. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Clamp n between min and max. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/** Map scroll progress 0–1 through a section into translate value. */
export function scrollProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
): number {
  const start = sectionTop - viewportHeight;
  const end = sectionTop + sectionHeight - viewportHeight * 2;
  if (end <= start) return 0;
  return clamp((window.scrollY - start) / (end - start), 0, 1);
}

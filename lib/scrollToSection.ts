import type Lenis from "lenis";

declare global {
  interface Window {
    __kayalLenis?: Lenis;
  }
}

function scrollOffset(): number {
  const root = document.documentElement;
  const header = parseFloat(
    getComputedStyle(root).getPropertyValue("--site-header-height"),
  );
  const nav = parseFloat(
    getComputedStyle(root).getPropertyValue("--menu-nav-height"),
  );
  return (Number.isFinite(header) ? header : 72) + (Number.isFinite(nav) ? nav : 52) + 12;
}

/** Scroll to an in-page section — Lenis-aware with header + category bar offset. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const offset = -scrollOffset();
  const lenis = window.__kayalLenis;

  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.05 });
    return;
  }

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}

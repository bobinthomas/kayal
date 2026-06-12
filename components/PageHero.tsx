import type { ReactNode } from "react";

/** Inner-page hero band — matches home luxury language. */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  tone = "leaf",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  tone?: "leaf" | "dark" | "clay";
}) {
  const bg =
    tone === "dark"
      ? "bg-banana-dark"
      : tone === "clay"
        ? "bg-gradient-to-br from-clay via-[#9a4522] to-banana-dark"
        : "bg-gradient-to-br from-leaf via-[#163d24] to-banana-dark";

  return (
    <div className={`relative overflow-hidden ${bg} py-16 text-cream sm:py-20`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(233,180,76,0.12),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 left-0 right-0 h-16 opacity-30"
      >
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="h-full w-full text-cream/20" fill="currentColor">
          <path d="M0 30c120-12 240-12 360 0s240 12 360 0 240-12 360 0 240 12 360 0v30H0z" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {eyebrow && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-turmeric/85">
            {eyebrow}
          </p>
        )}
        <div
          className="mt-3 h-px w-16 bg-gradient-to-r from-turmeric to-transparent"
          aria-hidden="true"
        />
        <h1
          className="mt-6 max-w-3xl font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight"
          style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}

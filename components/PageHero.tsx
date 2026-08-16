import type { ReactNode } from "react";

/** Inner-page hero band — the same dark treatment as the site footer
 * (bg-hf-footer + amber eyebrow), so every page opens and closes on the
 * same tone. */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-hf-footer py-16 text-white sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(226,149,36,0.12),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-3xl font-hf-heading text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {subtitle}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";

/** Luxury section heading — eyebrow, display title, optional gold rule. */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "light",
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const isLight = tone === "light";
  return (
    <header className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.35em] ${
            isLight ? "text-turmeric/90" : "text-clay"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={`mt-2 font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight ${
          isLight ? "text-cream" : "text-leaf"
        } ${align === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"}`}
        style={{ fontVariationSettings: '"SOFT" 50, "WONK" 1' }}
      >
        {title}
      </h2>
      <div
        className={`gold-rule mt-5 ${align === "center" ? "mx-auto w-32" : "w-24"} ${
          isLight ? "opacity-80" : ""
        }`}
        aria-hidden="true"
      />
      {subtitle && (
        <p
          className={`mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${
            align === "center" ? "mx-auto" : ""
          } ${isLight ? "text-cream/80" : "text-ink/70"}`}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

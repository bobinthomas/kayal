import type { ReactNode } from "react";

/** Section heading — eyebrow + display title, matches the home-figma sections. */
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
        <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={`mt-3 font-hf-heading text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-tight ${
          isLight ? "text-white" : "text-hf-ink"
        } ${align === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${
            align === "center" ? "mx-auto" : ""
          } ${isLight ? "text-white/80" : "text-hf-body"}`}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}

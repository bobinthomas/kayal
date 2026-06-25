import { douzeBenefits, douzePerks } from "@/data/home-douze";

type Props = {
  items: readonly string[];
  variant?: "light" | "dark";
};

function MarqueeRow({ items, variant = "light" }: Props) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`douze-marquee ${variant === "dark" ? "douze-marquee--dark" : ""}`}
      aria-hidden="true"
    >
      <div className="douze-marquee-track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="douze-marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DouzeBenefitsMarquee() {
  return (
    <section aria-label="Highlights">
      <MarqueeRow items={douzeBenefits} />
    </section>
  );
}

export function DouzePerksMarquee() {
  return (
    <section aria-label="Dining perks">
      <MarqueeRow items={douzePerks} variant="dark" />
    </section>
  );
}

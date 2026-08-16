import Image from "next/image";
import { Soup, UtensilsCrossed, Flame } from "lucide-react";
import HfReveal from "./HfReveal";

const values = [
  { Icon: Soup, label: "Locally Sourced" },
  { Icon: UtensilsCrossed, label: "Crafted with Passion" },
  { Icon: Flame, label: "Naadan Tradition" },
] as const;

export default function HfHeritage() {
  return (
    <section className="bg-hf-bg py-20 lg:py-24">
      <HfReveal as="div" className="mx-auto max-w-4xl px-6 text-center">
        <p className="font-hf-heading text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.35] tracking-tight">
          <span className="text-hf-ink">For over 11 years,</span>
          <Image
            src="/images/home-figma/restaurant-interior.png"
            alt=""
            width={96}
            height={64}
            className="mx-2 inline-block h-8 w-16 rounded-lg object-cover align-middle sm:h-11 sm:w-20"
          />
          <span className="text-hf-ink">
            Kayal Foods has brought Kerala&apos;s village table to Sydney
          </span>
          <Image
            src="/images/home-figma/chatti-choru-bowl.png"
            alt=""
            width={96}
            height={64}
            className="mx-2 inline-block h-8 w-16 rounded-lg object-cover align-middle sm:h-11 sm:w-20"
          />
          <span className="text-hf-green/55">
            , through naadan tradition, patience, and a love for timeless flavor.
          </span>
        </p>

        <div className="mx-auto mt-10 h-10 w-px bg-hf-border" />

        <div className="mt-8 flex flex-wrap items-start justify-center gap-10 sm:gap-16">
          {values.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-hf-badge-bg text-hf-green">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="max-w-[7rem] text-sm text-hf-body">{label}</p>
            </div>
          ))}
        </div>
      </HfReveal>
    </section>
  );
}

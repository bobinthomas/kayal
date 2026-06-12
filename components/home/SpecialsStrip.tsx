"use client";

import Link from "next/link";
import SpecialCard from "@/components/SpecialCard";
import SectionHeading from "@/components/SectionHeading";
import SectionScene from "@/components/motion/SectionScene";
import { featuredSpecials } from "@/data/specials";

export default function SpecialsStrip() {
  return (
    <SectionScene
      id="specials-block"
      aria-labelledby="specials-heading"
      intensity="medium"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      parallaxLayers={[
        {
          speed: 0.25,
          className: "right-0 top-1/4 h-40 w-40 rounded-full bg-clay/8 blur-3xl",
          node: <div className="h-full w-full rounded-full bg-clay/15" />,
        },
      ]}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="specials-heading"
          eyebrow="As per availability"
          title={
            <>
              From the village,{" "}
              <span className="italic text-clay">when we can get it</span>
            </>
          }
        />
        <Link
          href="/specials"
          className="mb-2 shrink-0 text-sm font-semibold uppercase tracking-[0.15em] text-clay underline-offset-8 transition-colors hover:text-chilli hover:underline"
        >
          All specials →
        </Link>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featuredSpecials.map((item, i) => (
          <div
            key={item.id}
            className="section-stagger-card"
            style={{ transitionDelay: `${i * 0.08}s` }}
          >
            <SpecialCard item={item} />
          </div>
        ))}
      </div>
    </SectionScene>
  );
}

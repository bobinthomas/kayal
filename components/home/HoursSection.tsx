"use client";

import HoursTable from "@/components/HoursTable";
import SectionHeading from "@/components/SectionHeading";
import SectionScene from "@/components/motion/SectionScene";
import Parallax from "@/components/motion/Parallax";
import { restaurant } from "@/data/restaurant";

export default function HoursSection() {
  return (
    <SectionScene
      id="hours-block"
      aria-labelledby="hours-heading"
      intensity="medium"
      className="overflow-hidden bg-leaf py-20 text-cream sm:py-28"
      parallaxLayers={[
        {
          speed: 0.5,
          className: "left-1/4 -top-20 h-56 w-96 rounded-full bg-turmeric/10 blur-3xl",
          node: <div className="h-full w-full rounded-full bg-turmeric/15" />,
        },
      ]}
    >
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="hours-heading"
            eyebrow="Visit us"
            title="When the pot's on"
            tone="light"
          />
          <Parallax speed={0.2}>
            <div className="mt-8 max-w-md rounded-2xl bg-cream/5 p-6 ring-1 ring-turmeric/15 backdrop-blur-sm">
              <HoursTable />
            </div>
          </Parallax>
        </div>
        <Parallax speed={0.35}>
          <div className="flex h-full flex-col justify-center rounded-2xl bg-banana-dark/70 p-8 ring-1 ring-turmeric/30 backdrop-blur-sm sm:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-turmeric/80">
              Good to know
            </p>
            <h3
              className="mt-3 font-display text-2xl font-semibold text-cream"
              style={{ fontVariationSettings: '"WONK" 0.8' }}
            >
              We host with care
            </h3>
            <ul className="mt-6 space-y-4 border-l border-turmeric/30 pl-5 text-sm leading-relaxed text-cream/85">
              <li>{restaurant.policies.bookingOnly}</li>
              <li>{restaurant.policies.lastOrders}</li>
              <li>{restaurant.policies.sitting}</li>
            </ul>
            <a
              href={`tel:${restaurant.phone.tel}`}
              className="btn-luxury mt-8 inline-flex min-h-12 w-fit items-center rounded-full bg-clay px-8 text-sm font-semibold tracking-wide text-cream"
            >
              Call {restaurant.phone.display}
            </a>
          </div>
        </Parallax>
      </div>
    </SectionScene>
  );
}

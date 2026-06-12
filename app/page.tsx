import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import RippleDivider from "@/components/RippleDivider";
import HoursTable from "@/components/HoursTable";
import FindingUs from "@/components/FindingUs";
import WhatsAppSignup from "@/components/WhatsAppSignup";
import ReviewStrip from "@/components/ReviewStrip";
import SpecialCard from "@/components/SpecialCard";
import SignatureShowcase from "@/components/SignatureShowcase";
import SectionHeading from "@/components/SectionHeading";
import { restaurant } from "@/data/restaurant";
import { featuredSpecials } from "@/data/specials";

export const metadata: Metadata = {
  title: "Kayal Foods — Authentic Kerala Restaurant in Moorebank, Sydney",
  description:
    "Kerala's village table, in Sydney. Chatti choru, kizhi porotta, toddy & game meats in Moorebank. Dine-in by booking — call (02) 9734 9634.",
  alternates: { canonical: "/" },
  openGraph: { images: [{ url: "/og/home.png", width: 1200, height: 630 }] },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <SignatureShowcase />

      {/* Story teaser — editorial split with offset frame */}
      <div className="text-banana-dark">
        <RippleDivider />
      </div>
      <section
        aria-labelledby="story-heading"
        className="relative overflow-hidden bg-banana-dark py-20 text-cream sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-turmeric/5 blur-3xl"
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <SectionHeading
              id="story-heading"
              eyebrow="Our story"
              title={
                <>
                  Kayal means{" "}
                  <span className="italic text-turmeric">backwater.</span>
                </>
              }
              subtitle="The lagoons where the kettuvallam drift, where the fish is pulled straight into the chatti, where lunch comes wrapped in banana leaf."
              tone="light"
            />
            <p className="mt-6 leading-relaxed text-cream/75">
              That&apos;s the table we set in Moorebank — rabbit, quail, buffalo,
              wild venison, cooked the way the village cooks it.
            </p>
            <Link
              href="/about"
              className="btn-ghost-luxury mt-8 inline-flex min-h-12 items-center rounded-full border border-turmeric/50 px-8 text-sm font-semibold tracking-wide text-turmeric"
            >
              Read our story
            </Link>
          </Reveal>
          <Reveal variant="right" delay={2}>
            <div className="story-frame">
              <Image
                src="/images/backwater.svg"
                alt="Kerala backwaters with a houseboat at dusk"
                width={800}
                height={500}
                className="relative z-10 w-full rounded-2xl shadow-2xl shadow-black/40"
              />
            </div>
          </Reveal>
        </div>
      </section>
      <div className="rotate-180 text-banana-dark">
        <RippleDivider />
      </div>

      {/* Specials strip */}
      <section
        aria-labelledby="specials-heading"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <Reveal variant="blur">
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
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSpecials.map((item, i) => (
            <Reveal key={item.id} variant="scale" delay={(Math.min(i + 1, 4) as 1 | 2 | 3 | 4)}>
              <SpecialCard item={item} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Hours & booking */}
      <section
        aria-labelledby="hours-heading"
        className="relative overflow-hidden bg-leaf py-20 text-cream sm:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(233,180,76,0.08),transparent_50%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <Reveal variant="left">
            <SectionHeading
              id="hours-heading"
              eyebrow="Visit us"
              title="When the pot's on"
              tone="light"
            />
            <div className="mt-8 max-w-md rounded-2xl bg-cream/5 p-6 ring-1 ring-turmeric/15 backdrop-blur-sm">
              <HoursTable />
            </div>
          </Reveal>
          <Reveal variant="right" delay={2}>
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
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="finding-heading" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal variant="blur">
          <SectionHeading
            id="finding-heading"
            eyebrow="Finding us"
            title={
              <>
                Look for the{" "}
                <span className="italic text-clay">white house</span>
              </>
            }
            subtitle="No big sign — just warm lights and the smell of curry leaves on Nuwarra Road."
          />
        </Reveal>
        <div className="mt-12">
          <FindingUs />
        </div>
      </section>

      <WhatsAppSignup />
      <ReviewStrip />
    </>
  );
}

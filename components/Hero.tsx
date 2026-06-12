"use client";

import Link from "next/link";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";
import BackwaterAmbience from "@/components/BackwaterAmbience";
import HeroCarousel from "@/components/HeroCarousel";
import Parallax from "@/components/motion/Parallax";
import SplitLines from "@/components/motion/SplitLines";
import MistClouds from "@/components/motion/MistClouds";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-banana-dark text-cream">
      {/* Background — parallax depth layers */}
      <Parallax speed={0.35} className="absolute inset-0 -top-[10%] h-[120%]">
        <div className="hero-ken-burns absolute inset-0">
          <HeroCarousel />
        </div>
      </Parallax>

      <Parallax speed={0.15} className="absolute inset-0">
        <BackwaterAmbience />
        <MistClouds />
      </Parallax>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-banana-dark/30 via-banana-dark/50 to-banana-dark"
      />

      <Parallax speed={-0.08} className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-32 sm:px-6 sm:pb-24">
        <div
          className="hero-gold-line mb-8 h-px w-16 bg-gradient-to-r from-turmeric to-transparent sm:w-24"
          aria-hidden="true"
        />

        <p className="hero-enter hero-enter-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-turmeric/90">
          Authentic naadan cooking · Moorebank
        </p>

        <SplitLines
          as="h1"
          className="hero-enter-2 mt-4 max-w-4xl font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[1.02] tracking-tight"
          lines={[
            { text: "Kerala's village table," },
            {
              text: "in Sydney.",
              className: "italic text-turmeric",
            },
          ]}
        />

        <p className="hero-enter hero-enter-3 mt-6 max-w-lg text-lg leading-relaxed text-cream/80 sm:text-xl">
          Chatti choru in earthen pots. Porotta parcels in charred banana leaf.
          Toddy, game meats and the recipes the village never wrote down.
        </p>

        <div className="hero-enter hero-enter-4 mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`tel:${restaurant.phone.tel}`}
            onClick={() => track("call_tap", { placement: "hero" })}
            className="btn-luxury inline-flex min-h-12 items-center rounded-full bg-clay px-9 text-sm font-semibold tracking-wide text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turmeric"
          >
            Book a Table
          </a>
          <Link
            href="/menu"
            onClick={() => track("menu_view", { placement: "hero" })}
            className="btn-ghost-luxury inline-flex min-h-12 items-center rounded-full border border-cream/40 px-9 text-sm font-semibold tracking-wide text-cream"
          >
            See the Menu
          </Link>
        </div>

        <p className="hero-enter hero-enter-5 mt-6 text-sm text-cream/60">
          Bookings{" "}
          <span className="mx-1 text-turmeric/50" aria-hidden="true">
            ·
          </span>{" "}
          <a
            href={`tel:${restaurant.phone.tel}`}
            onClick={() => track("call_tap", { placement: "hero_phone" })}
            className="font-semibold text-turmeric underline-offset-4 transition-colors hover:text-cream hover:underline"
          >
            {restaurant.phone.display}
          </a>
        </p>
      </Parallax>

      <div
        className="scroll-hint absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
        aria-hidden="true"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-cream/40">
          Scroll
        </span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-turmeric/60">
          <path d="M10 4v10M5 11l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}

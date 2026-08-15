"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { restaurant } from "@/data/restaurant";
import { hfHeroSlides, formatPrice } from "@/data/home-figma";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { track } from "@/lib/analytics";
import HfReveal from "./HfReveal";

const SLIDE_MS = 6000;

export default function HfHero() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const count = hfHeroSlides.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) return;
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, SLIDE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [reduced, count]);

  const goTo = (i: number) => setActive(((i % count) + count) % count);

  return (
    <HfReveal
      as="section"
      className="relative h-dvh max-h-[1000px] min-h-[480px] overflow-hidden bg-hf-ink"
      aria-roledescription="carousel"
      aria-label="Signature dishes"
    >
      {hfHeroSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={i !== active}
          inert={i !== active}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
        >
          {slide.theme === "dark" ? (
            <DarkSlide slide={slide} />
          ) : (
            <LightSlide slide={slide} />
          )}
        </div>
      ))}

      <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-6 sm:bottom-6">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => goTo(active - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Choose slide">
          {hfHeroSlides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${slide.item.name}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goTo(active + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur transition-colors hover:bg-black/40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </HfReveal>
  );
}

function Eyebrow({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 text-hf-amber" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-current" />
        ))}
      </div>
      <p className={`text-xs font-bold uppercase tracking-[0.2em] ${color}`}>
        Authentic Naadan Cooking · Moorebank
      </p>
    </div>
  );
}

function Ctas({ dark }: { dark: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Link
        href="/menu/"
        onClick={() => track("menu_view", { placement: "hf_hero" })}
        className={`inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold transition-transform hover:scale-[1.03] ${
          dark ? "bg-white text-hf-ink" : "bg-hf-ink text-white"
        }`}
      >
        Menu
      </Link>
      <a
        href={`tel:${restaurant.phone.tel}`}
        onClick={() => track("call_tap", { placement: "hf_hero" })}
        className="inline-flex h-[46px] items-center justify-center rounded-full bg-hf-green px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
      >
        Book a table
      </a>
    </div>
  );
}

const HEADLINE_CLASS =
  "font-hf-display text-[clamp(3.25rem,8.5vw,7.5rem)] font-light leading-[0.88]";

function HeroHeadline({ heroWord, dark }: { heroWord: string; dark: boolean }) {
  return (
    <p className={`${HEADLINE_CLASS} ${dark ? "text-white" : "text-hf-ink"}`}>
      <span className="block">God&apos;s Own</span>
      <span className="block font-bold text-hf-green">{heroWord}</span>
    </p>
  );
}

function DarkSlide({ slide }: { slide: (typeof hfHeroSlides)[number] }) {
  const { item, heroWord } = slide;
  const bgImage = "bgImage" in slide ? slide.bgImage : undefined;
  return (
    <div className="relative flex h-full items-center pb-16 pt-28 lg:pb-16 lg:pt-24">
      <div className="absolute inset-0">
        {bgImage && (
          <Image src={bgImage} alt="" fill priority sizes="100vw" className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1280px] px-6 sm:px-10 lg:px-16">
        <div className="flex w-full max-w-[560px] flex-col gap-5">
          <Eyebrow color="text-hf-amber" />
          <HeroHeadline heroWord={heroWord} dark />
          <p className="max-w-md text-base leading-relaxed text-white/80">
            {item.desc} {item.price !== undefined && `${formatPrice(item.price)}.`}
          </p>
          <Ctas dark />
        </div>
      </div>
    </div>
  );
}

function LightSlide({ slide }: { slide: (typeof hfHeroSlides)[number] }) {
  const { item, heroWord } = slide;
  const dishImage = "dishImage" in slide ? slide.dishImage : undefined;
  return (
    <div className="flex h-full items-center bg-white pb-16 pt-28 lg:pb-16 lg:pt-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col-reverse items-center gap-8 px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16">
        <div className="flex w-full max-w-[560px] flex-col gap-5">
          <Eyebrow color="text-hf-amber" />
          <HeroHeadline heroWord={heroWord} dark={false} />
          <p className="max-w-md text-base leading-relaxed text-hf-body">
            {item.desc} {item.price !== undefined && `${formatPrice(item.price)}.`}
          </p>
          <Ctas dark={false} />
        </div>

        {dishImage && (
          <div className="relative h-[200px] w-full max-w-[320px] shrink-0 sm:h-[260px] lg:h-[360px] lg:w-[400px]">
            <Image
              src={dishImage}
              alt={item.name}
              fill
              priority
              sizes="(min-width: 1024px) 400px, 80vw"
              className="object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

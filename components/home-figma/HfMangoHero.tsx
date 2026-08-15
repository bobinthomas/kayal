"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { hfMangoSlides, hfMangoGarnish, hfMangoBlurb, formatPrice } from "@/data/home-figma";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { track } from "@/lib/analytics";
import HfReveal from "./HfReveal";

const SLIDE_MS = 6500;

const GARNISH_CORNERS = {
  chili: "left-2 top-2 sm:left-4 sm:top-4",
  onion: "left-2 bottom-2 sm:left-4 sm:bottom-4",
  star: "right-2 top-2 sm:right-4 sm:top-4",
  coriander: "right-2 bottom-2 sm:right-4 sm:bottom-4",
} as const;

function GarnishImg({ asset }: { asset: keyof typeof hfMangoGarnish }) {
  const { src } = hfMangoGarnish[asset];
  return (
    <div
      className={`absolute hidden h-10 w-10 sm:block sm:h-14 sm:w-14 lg:h-16 lg:w-16 ${GARNISH_CORNERS[asset]}`}
      aria-hidden="true"
    >
      <Image src={src} alt="" fill sizes="64px" className="object-contain" />
    </div>
  );
}

export default function HfMangoHero() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const count = hfMangoSlides.length;
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
      className="relative isolate h-dvh max-h-[1000px] min-h-[380px] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured dishes"
    >
      {hfMangoSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 flex flex-col transition-opacity duration-700 ease-out ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          style={{ backgroundImage: `linear-gradient(180deg, ${slide.gradient.from} 0%, ${slide.gradient.to} 100%)` }}
          aria-hidden={i !== active}
          inert={i !== active}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
        >
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1280px] flex-col px-6 sm:px-10 lg:px-16">
            <div className="flex items-start justify-between gap-4 py-4 lg:py-6">
              <div className="flex max-w-xs flex-col gap-2">
                <p className="hidden text-xs leading-relaxed text-white/80 sm:block">{hfMangoBlurb}</p>
                <div className="flex items-center gap-3">
                  {slide.item.price !== undefined && (
                    <p className="font-hf-accent text-xl font-extrabold text-white lg:text-2xl">
                      {formatPrice(slide.item.price)}
                    </p>
                  )}
                  <Link
                    href="/menu/"
                    onClick={() => track("menu_view", { placement: `hf_mango_${slide.id}` })}
                    className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-wide text-hf-ink shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.03] lg:px-7 lg:py-3"
                  >
                    View on Menu
                  </Link>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  aria-label="Previous dish"
                  onClick={() => goTo(active - 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-white/15 text-white transition-colors hover:border-white/40 lg:h-11 lg:w-11"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next dish"
                  onClick={() => goTo(active + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-white text-white transition-colors hover:bg-white hover:text-hf-ink lg:h-11 lg:w-11"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1">
              <GarnishImg asset="chili" />
              <GarnishImg asset="onion" />
              <GarnishImg asset="star" />
              <GarnishImg asset="coriander" />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-85">
                <div
                  className="relative h-[45%] max-w-[85%] sm:h-[55%]"
                  style={{ aspectRatio: slide.wordmarkAspect }}
                >
                  <Image
                    src={slide.wordmarkSvg}
                    alt=""
                    fill
                    sizes="60vw"
                    className="object-contain"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div
                className="absolute bottom-0 left-1/2 w-[55%] -translate-x-1/2 sm:w-[45%] lg:w-[38%]"
                style={{ aspectRatio: slide.imageAspect }}
              >
                <Image
                  src={slide.image}
                  alt={`${slide.item.name} — ${slide.item.desc ?? ""}`}
                  fill
                  sizes="40vh"
                  className={`object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.35)] ${
                    slide.rotate ? "rotate-[8deg]" : "rounded-2xl"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </HfReveal>
  );
}

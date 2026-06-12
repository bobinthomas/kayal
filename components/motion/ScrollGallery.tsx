"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { marqueeDishes } from "@/data/copy";
import { legacyPhoto } from "@/data/legacy-site";
import { prefersReducedMotion } from "@/lib/motion";
import { useScrollFrame } from "@/lib/useScrollFrame";

const galleryItems = [
  { name: "Chatti Choru", image: legacyPhoto(0).src, price: "$25" },
  { name: "Kizhi Porotta", image: legacyPhoto(1).src, price: "$25" },
  { name: "Meen Pollichathu", image: legacyPhoto(2).src, price: "$30" },
  { name: "Kallu Toddy", image: legacyPhoto(3).src, price: "Ask" },
  { name: "Muyal Piralan", image: legacyPhoto(4).src, price: "$25" },
  { name: "Kappa Biriyani", image: legacyPhoto(0).src, price: "$19.90" },
  { name: "Duck Roast", image: legacyPhoto(1).src, price: "$23.90" },
  { name: "Beef Ularthiyathu", image: legacyPhoto(2).src, price: "$23.90" },
];

/**
 * Horizontal "flavour map" — vertical scroll drives horizontal drift (Mr. Pops Карта смаків).
 * Pinned sticky panel; track translates on scroll progress.
 */
export default function ScrollGallery() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const reduced = prefersReducedMotion();

  const update = useCallback(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const rect = pin.getBoundingClientRect();
    const pinHeight = pin.offsetHeight;
    const viewport = window.innerHeight;
    const scrolled = -rect.top;
    const maxScroll = pinHeight - viewport;
    const progress = maxScroll > 0 ? Math.min(Math.max(scrolled / maxScroll, 0), 1) : 0;

    const trackWidth = track.scrollWidth;
    const overflow = Math.max(trackWidth - window.innerWidth + 48, 0);
    track.style.transform = `translate3d(${-progress * overflow}px, 0, 0)`;
  }, []);

  useScrollFrame(update, !reduced);

  return (
    <section aria-labelledby="gallery-heading" className="scroll-gallery-pin relative bg-cream">
      <div ref={pinRef} className="relative h-[220vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-12">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-clay">
              Village pot
            </p>
            <h2
              id="gallery-heading"
              className="mt-2 font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight text-leaf"
              style={{ fontVariationSettings: '"WONK" 1' }}
            >
              Scroll the{" "}
              <span className="italic text-clay">table of flavours</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-ink/60">
              Keep scrolling — the village moves with you. Clay pots, banana leaf,
              game meats and the dishes that built the house.
            </p>
          </div>

          <div className="mt-10 overflow-hidden">
            <div
              ref={trackRef}
              className="scroll-gallery-track flex gap-5 px-4 will-change-transform sm:gap-6 sm:px-6"
            >
              {galleryItems.map((item, i) => (
                <article
                  key={item.name}
                  className="scroll-gallery-card group relative w-[72vw] shrink-0 overflow-hidden rounded-2xl bg-banana-dark sm:w-[340px]"
                  style={{ transitionDelay: `${i * 0.05}s` }}
                >
                  <div className="relative h-52 overflow-hidden sm:h-60">
                    <Image
                      src={item.image}
                      alt=""
                      width={400}
                      height={300}
                      className="signature-img h-full w-full object-cover opacity-80 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-banana-dark via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 font-display text-5xl font-bold text-cream/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold text-cream">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-turmeric">{item.price}</p>
                  </div>
                </article>
              ))}
              <Link
                href="/menu"
                className="flex w-[50vw] shrink-0 items-center justify-center rounded-2xl border border-dashed border-leaf/30 bg-leaf/5 p-8 text-center transition-colors hover:border-leaf hover:bg-leaf/10 sm:w-[280px]"
              >
                <span className="font-display text-xl font-semibold text-leaf">
                  Full menu
                  <span className="mt-2 block text-sm font-sans font-normal text-ink/50">
                    {marqueeDishes.length}+ dishes →
                  </span>
                </span>
              </Link>
            </div>
          </div>

          <p className="mx-auto mt-8 text-center text-[10px] uppercase tracking-[0.3em] text-ink/35">
            Scroll to explore
          </p>
        </div>
      </div>
    </section>
  );
}

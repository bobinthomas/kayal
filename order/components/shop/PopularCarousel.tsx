"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { money, type MenuItem } from "@/lib/api";
import { PhotoCard } from "./ui";

const AUTOPLAY_MS = 4500;

/**
 * Swipeable "Popular Dishes" carousel: one large card per slide with the next
 * one peeking in, scroll-snap for swiping, dots to jump. Advances on its own
 * until the customer touches it, and never auto-moves for reduced-motion users.
 */
export default function PopularCarousel({
  items,
  cart,
  catName,
  onAdd,
}: {
  items: MenuItem[];
  cart: Record<string, number>;
  catName: (id: string) => string;
  onAdd: (id: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    const slide = track?.children[i] as HTMLElement | undefined;
    if (!track || !slide) return;
    // Update the dots now rather than waiting for scroll events, which the
    // browser may hold back (e.g. while a smooth scroll is animating).
    setIndex(i);
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  // Keep the dots in sync with swipes.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const slides = [...track.children] as HTMLElement[];
      const left = track.scrollLeft;
      let best = 0;
      slides.forEach((s, i) => {
        if (Math.abs(s.offsetLeft - track.offsetLeft - left) < Math.abs(slides[best].offsetLeft - track.offsetLeft - left)) best = i;
      });
      setIndex(best);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Skip ticks while the tab is in the background.
    const t = setInterval(() => !document.hidden && goTo((index + 1) % items.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [paused, index, items.length, goTo]);

  const stop = () => setPaused(true);

  return (
    <div onPointerDown={stop} onWheel={stop} onFocusCapture={stop}>
      <div
        ref={trackRef}
        className="no-scrollbar -mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5"
        aria-roledescription="carousel"
        aria-label="Popular dishes"
      >
        {items.map((i, n) => {
          const qty = cart[i.id] ?? 0;
          return (
            <button
              key={i.id}
              type="button"
              onClick={() => onAdd(i.id)}
              aria-label={`Add ${i.name} to cart`}
              aria-roledescription="slide"
              aria-current={n === index ? "true" : undefined}
              className="w-[82%] shrink-0 snap-start text-left md:w-[calc((100%-1.5rem)/3)]"
            >
              <PhotoCard
                src={i.image_url}
                categoryId={i.category_id}
                title={i.name}
                className="aspect-[16/10]"
                meta={
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate">{catName(i.category_id)}</span>
                    <span className="text-sm font-semibold text-white">{money(i.price_cents)}</span>
                  </span>
                }
                badge={
                  <span
                    className={`grid h-9 min-w-9 place-items-center rounded-xl px-2 text-sm font-bold ${
                      qty ? "bg-white text-night" : "bg-brand text-white"
                    }`}
                  >
                    {qty ? `×${qty}` : "+"}
                  </span>
                }
              />
            </button>
          );
        })}
      </div>
      {items.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {items.map((i, n) => (
            <button
              key={i.id}
              type="button"
              onClick={() => {
                stop();
                goTo(n);
              }}
              aria-label={`Show ${i.name}`}
              className={`h-1.5 rounded-full transition-all ${n === index ? "w-6 bg-night" : "w-1.5 bg-night/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

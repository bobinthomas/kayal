"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { restaurant } from "@/data/restaurant";
import { useReducedMotion } from "@/lib/useReducedMotion";
import HfReveal from "./HfReveal";

const VISIT_IMAGES = [
  { src: "/images/home-figma/kayal-restaurant.jpg", alt: "Inside Kayal Foods" },
  { src: "/images/home-figma/kayal-restaurant1.jpg", alt: "Inside Kayal Foods" },
  { src: "/images/home-figma/kayal-restaurant2.jpg", alt: "Inside Kayal Foods" },
  { src: "/images/home-figma/kayal-restaurant3.jpg", alt: "Inside Kayal Foods" },
  { src: "/images/home-figma/kayal-restaurant4.jpg", alt: "Inside Kayal Foods" },
  { src: "/images/home-figma/kayal-restaurant5.jpg", alt: "Inside Kayal Foods" },
];
const SLIDE_MS = 4000;

export default function HfVisit() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const count = VISIT_IMAGES.length;

  useEffect(() => {
    if (reduced || count <= 1) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(id);
  }, [reduced, count]);

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-10 px-6 sm:px-10 lg:flex-row lg:justify-between lg:px-16">
      <HfReveal
        as="div"
        variant="left"
        className="relative h-[320px] w-full max-w-[600px] shrink-0 overflow-hidden rounded-3xl lg:h-[400px]"
      >
        {VISIT_IMAGES.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            aria-hidden={i !== active}
            sizes="(min-width: 1024px) 600px, 100vw"
            className={`object-cover transition-opacity duration-1000 ease-out ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {count > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
            {VISIT_IMAGES.map((img, i) => (
              <span
                key={img.src}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </HfReveal>

      <HfReveal as="div" variant="right" delayMs={120} className="flex w-full max-w-[520px] flex-col gap-6">
        <p className="text-xs font-bold uppercase tracking-widest text-hf-amber">About Us</p>
        <p className="font-hf-heading text-3xl font-bold leading-tight text-hf-ink sm:text-4xl">
          We invite you to visit our restaurant
        </p>
        <p className="text-[15px] leading-relaxed text-hf-body">
          {restaurant.findingUs.blurb}
        </p>
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/about/"
            className="inline-flex h-[46px] items-center justify-center rounded-full bg-hf-green px-6 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
          >
            Read More
          </Link>
          <div className="flex gap-4">
            <a
              href={restaurant.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-hf-bg text-hf-ink hover:bg-hf-badge-bg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
              </svg>
            </a>
            <a
              href={restaurant.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-hf-bg text-hf-ink hover:bg-hf-badge-bg"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.18-.46.39-.79.74-1.13.34-.35.67-.56 1.13-.74.35-.14.87-.3 1.83-.34C8.42 2.17 8.8 2.16 12 2.16Zm0 2.16c-3.15 0-3.5.01-4.73.07-.96.04-1.48.2-1.83.34-.46.18-.79.39-1.13.74-.35.34-.56.67-.74 1.13-.14.35-.3.87-.34 1.83-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.04.96.2 1.48.34 1.83.18.46.39.79.74 1.13.34.35.67.56 1.13.74.35.14.87.3 1.83.34 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c.96-.04 1.48-.2 1.83-.34.46-.18.79-.39 1.13-.74.35-.34.56-.67.74-1.13.14-.35.3-.87.34-1.83.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.04-.96-.2-1.48-.34-1.83a3.05 3.05 0 0 0-.74-1.13 3.05 3.05 0 0 0-1.13-.74c-.35-.14-.87-.3-1.83-.34-1.23-.06-1.58-.07-4.73-.07Zm0 3.68a5.99 5.99 0 1 1 0 11.98 5.99 5.99 0 0 1 0-11.98Zm0 2.16a3.83 3.83 0 1 0 0 7.66 3.83 3.83 0 0 0 0-7.66Zm6.23-2.4a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0Z" />
              </svg>
            </a>
          </div>
        </div>
      </HfReveal>
      </div>
    </section>
  );
}

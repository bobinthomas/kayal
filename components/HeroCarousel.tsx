"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { legacyCarousel } from "@/data/legacy-site";
import { prefersReducedMotion } from "@/lib/motion";

/** Crossfading hero backgrounds — carries over the old site's image carousel. */
export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion() || legacyCarousel.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % legacyCarousel.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      {legacyCarousel.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-[2200ms] ease-in-out ${
            i === index ? "opacity-55" : "opacity-0"
          }`}
        />
      ))}
    </>
  );
}

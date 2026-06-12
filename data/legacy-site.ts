/**
 * Assets and copy reference from the live WordPress site at kayal.com.au/2026/.
 */

export const legacySite = {
  url: "https://kayal.com.au/2026/",
  stack: "WordPress + Elementor (Savoy theme)",

  assets: {
    logo: "/images/legacy/Kayal-Foods-Logo.svg",
  },

  social: {
    facebook: "https://www.facebook.com/Kayal-Foods-111280287304578/",
    instagram: "https://www.instagram.com/kayalcatering/?hl=en",
  },

  heroHeadline: "Join us on a culinary tasty journey within. Bon appétit.",
} as const;

/** Carousel slides from the old home page (WP uploads 2021/02). */
export const legacyCarousel = [
  {
    src: "/images/legacy/carousel-5.jpg",
    alt: "Kayal Foods — Kerala dishes on the table",
  },
  {
    src: "/images/legacy/carousel-4.jpg",
    alt: "Kayal Foods — South Indian spread",
  },
  {
    src: "/images/legacy/carousel-6.jpg",
    alt: "Kayal Foods — authentic naadan cooking",
  },
  {
    src: "/images/legacy/carousel-2.jpg",
    alt: "Kayal Foods — restaurant dishes",
  },
  {
    src: "/images/legacy/carousel-3.jpg",
    alt: "Kayal Foods — Moorebank Kerala restaurant",
  },
] as const;

/** Pick a carousel photo by index (wraps). */
export function legacyPhoto(index: number): (typeof legacyCarousel)[number] {
  return legacyCarousel[((index % legacyCarousel.length) + legacyCarousel.length) % legacyCarousel.length]!;
}

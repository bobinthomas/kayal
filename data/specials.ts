import { menuSections, type MenuItem } from "./menu";

const allItems = menuSections.flatMap((section) => section.items);

/** Availability-based specials across the menu. */
export const specials: MenuItem[] = allItems.filter((item) =>
  item.tags?.includes("availability"),
);

/** Spicy availability items — bold treatment on /specials. */
export const gameSpecials: MenuItem[] = specials.filter((item) =>
  item.tags?.includes("spicy"),
);

export const nonGameSpecials: MenuItem[] = specials.filter(
  (item) => !item.tags?.includes("spicy"),
);

/** Top picks for the home-page specials strip. */
export const featuredSpecialIds = [
  "kizhi-porotta",
  "meen-pollichathu",
  "fish-tikka",
  "thalassery-biryani",
] as const;

export const featuredSpecials: MenuItem[] = featuredSpecialIds
  .map((id) => allItems.find((item) => item.id === id))
  .filter((s): s is MenuItem => Boolean(s));

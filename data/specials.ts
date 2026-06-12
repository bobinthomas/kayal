import { menuSections, type MenuItem } from "./menu";

/** All availability-based specials (the "Our Specials" menu section). */
export const specials: MenuItem[] =
  menuSections.find((s) => s.id === "specials")?.items ?? [];

/** Game & wild-meat specials — get bold treatment on /specials. */
export const gameSpecials: MenuItem[] = specials.filter((i) =>
  i.tags?.includes("game"),
);

export const nonGameSpecials: MenuItem[] = specials.filter(
  (i) => !i.tags?.includes("game"),
);

/** Top picks for the home-page specials strip. */
export const featuredSpecialIds = [
  "chattichoru",
  "kizhi-porotta",
  "meen-pollichathu",
  "muyal-piralan",
] as const;

export const featuredSpecials: MenuItem[] = featuredSpecialIds
  .map((id) => specials.find((s) => s.id === id))
  .filter((s): s is MenuItem => Boolean(s));

/**
 * Curated review quotes for the home-page review strip.
 * NOTE: Replace with verbatim quotes from Google Business Profile before
 * launch (owner to select; P1 automates this).
 */

export type Review = {
  quote: string;
  author: string;
  source: string;
};

export const reviews: Review[] = [
  {
    quote:
      "Feels like a warm home — the chatti choru took me straight back to my grandmother's kitchen in Kerala.",
    author: "Google review",
    source: "Google",
  },
  {
    quote:
      "The kizhi porotta is unlike anything else in Sydney. Unwrapping that banana leaf at the table is an event.",
    author: "Google review",
    source: "Google",
  },
  {
    quote:
      "Proper naadan food — rabbit, duck, buffalo done the village way. Book ahead, it's worth it.",
    author: "Google review",
    source: "Google",
  },
];

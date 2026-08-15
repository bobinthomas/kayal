/**
 * Curated review quotes for the home-page review strip.
 * Content lives in content/reviews.json — edit via /admin or the file
 * directly, never hardcode review data in this module.
 */
import reviewsJson from "@/content/reviews.json";

export type Review = {
  quote: string;
  author: string;
  source: string;
};

export const reviews: Review[] = reviewsJson.reviews;

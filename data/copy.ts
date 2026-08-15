/**
 * Verbatim brand copy assets carried over from the old site (PRD Appendix A),
 * with the light grammar polish the PRD allows.
 * Content lives in content/copy.json — edit via /admin or the file
 * directly, never hardcode this copy in this module.
 */
import copyJson from "@/content/copy.json";

export const kizhiPorottaStory: string = copyJson.kizhiPorottaStory;
export const chattiChoruStory: string = copyJson.chattiChoruStory;
export const aboutParagraph: string = copyJson.aboutParagraph;

/** Dish names for the home-page marquee ribbon. */
export const marqueeDishes: string[] = copyJson.marqueeDishes;

/** Catering categories from the old catering page. */
export const cateringCategories: { title: string; blurb: string }[] =
  copyJson.cateringCategories;

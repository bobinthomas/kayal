/**
 * Amrit Palace–style menu page copy and section nav labels.
 * Content lives in content/menu-meta.json — edit via /admin or the file
 * directly, never hardcode this data in this module.
 */
import menuMetaJson from "@/content/menu-meta.json";

export const menuPageCopy: {
  eyebrowLeft: string;
  eyebrowRight: string;
  discoveryTagline: string;
  intro: string;
} = menuMetaJson.pageCopy;

export const menuNavLabels: Record<string, string> = menuMetaJson.navLabels;

export type MenuSpotlightStep = { label: string; title: string; detail: string };
export type MenuSpotlightChoiceGroup = { label: string; options: string[] };
export type MenuSpotlight = {
  id: string;
  eyebrow: string;
  title: string;
  price?: number;
  subtitle?: string;
  description: string;
  steps?: MenuSpotlightStep[];
  choiceGroups?: MenuSpotlightChoiceGroup[];
  href?: string;
};

export const menuFeaturedSpotlights: MenuSpotlight[] = menuMetaJson.spotlights;

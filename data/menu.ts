/**
 * Menu dataset — real Kayal Foods menu (owner-supplied content).
 * "availability" items are drawn from the owner's Specials list and are
 * kept alongside their closest regular-menu category so /specials can
 * keep filtering on the `availability` tag.
 *
 * Content lives in content/menu.json — edit via /admin or the file
 * directly, never hardcode menu data in this module.
 */
import menuJson from "@/content/menu.json";

export type MenuTag = "veg" | "spicy" | "signature" | "availability";

export type MenuItem = {
  id: string;
  name: string;
  mal?: string;
  desc?: string;
  price?: number;
  tags?: MenuTag[];
};

export type MenuSection = {
  id: string;
  title: string;
  blurb: string;
  items: MenuItem[];
};

export const tagLegend: { tag: MenuTag; label: string }[] = [
  { tag: "veg", label: "Vegetarian" },
  { tag: "spicy", label: "Spicy" },
  { tag: "signature", label: "Signature" },
  { tag: "availability", label: "As per availability" },
];

export const menuSections: MenuSection[] = menuJson.sections as MenuSection[];

export const menuDisclaimer: string = menuJson.disclaimer;

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

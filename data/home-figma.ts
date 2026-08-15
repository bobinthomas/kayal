import { menuSections, formatPrice, type MenuItem } from "./menu";
import homeHeroJson from "@/content/home-hero.json";

const allItems = menuSections.flatMap((section) => section.items);
const byId = (id: string): MenuItem => {
  const item = allItems.find((i) => i.id === id);
  if (!item) throw new Error(`home-figma: missing menu item "${id}"`);
  return item;
};

/** Bento grid — signature dishes section. Real menu data, template stock photography. */
export const hfBentoDishes = [
  { item: byId("kizhi-porotta"), image: "/images/home-figma/dish-kizhi-porotta.png" },
  { item: byId("meen-pollichathu"), image: "/images/home-figma/dish-meen-pollichathu.png" },
  { item: byId("thalassery-biryani"), image: "/images/home-figma/dish-thalassery-biryani.png" },
  { item: byId("kerala-fish-curry"), image: "/images/home-figma/dish-kerala-fish-curry.png" },
  { item: byId("fish-tikka"), image: "/images/home-figma/dish-fish-tikka.png" },
] as const;

/** Mango-hero slider — matches the Figma "MangoHero" component's 4-variant
 * carousel (node 40:835). Each slide's giant Malayalam wordmark uses the
 * dish's own real name where menu.ts has one; "Naadan Oonu" (slide 4) is a
 * true generic phrase, not a specific priced item, since the source design's
 * "Chicken Biryani" wording doesn't correspond to a distinct real menu item —
 * Thalassery Biryani (the closest real biryani) fills that slide instead.
 *
 * Position percentages below are converted directly from the Figma spec's
 * fixed 1440x900 canvas coordinates (e.g. left:110px -> 110/1440 = 7.6%), so
 * the slide is laid out at `aspect-[1440/900]` and everything scales
 * together exactly as in the design. Garnish images are the same 4 assets
 * (chili, onion, star anise, coriander) Figma reuses across all variants,
 * just renudged per variant to sit around that slide's wordmark line count. */
const chattiGarnish = {
  chili: { left: 7.6, top: 21.1 },
  onion: { left: 5.2, top: 46.7 },
  star: { left: 73.6, top: 18.9 },
  coriander: { left: 69.9, top: 62.3 },
};

export const hfMangoSlides = [
  {
    id: "chatti-choru",
    wordmarkSvg: "/images/home-figma/wordmarks/chatti-choru-wordmark.svg",
    wordmarkAspect: 977 / 309,
    item: byId("chatti-choru"),
    image: "/images/home-figma/chatti-choru-bowl.png",
    imageAspect: 1472 / 990,
    gradient: { from: "#2baae2", to: "#046937" },
    // Only the Figma "Default" variant rotates its focal image (rotate_31);
    // variants 2/3/4 crop it into a plain, unrotated frame.
    rotate: true,
    wordmarkTop: 31.1,
    dishTop: 54.1,
    garnish: chattiGarnish,
  },
  {
    id: "kappa-biryani",
    wordmarkSvg: "/images/home-figma/wordmarks/kappa-biryani-wordmark.svg",
    wordmarkAspect: 1152 / 440,
    item: byId("kappa-biryani"),
    image: "/images/home-figma/mango-kappa-biryani.png",
    imageAspect: 777 / 409,
    gradient: { from: "#2b1105", to: "#542103" },
    rotate: false,
    wordmarkTop: 32.2,
    dishTop: 47.1,
    garnish: {
      chili: { left: 7.6, top: 32.2 },
      onion: { left: 5.2, top: 57.8 },
      star: { left: 73.6, top: 26.7 },
      coriander: { left: 76.8, top: 62.3 },
    },
  },
  {
    id: "thalassery-biryani",
    wordmarkSvg: "/images/home-figma/wordmarks/thalassery-biryani-wordmark.svg",
    wordmarkAspect: 1152 / 520,
    item: byId("thalassery-biryani"),
    image: "/images/home-figma/mango-thalassery-biryani.png",
    imageAspect: 782 / 463,
    gradient: { from: "#034e35", to: "#012c1e" },
    rotate: false,
    wordmarkTop: 20,
    dishTop: 48.6,
    garnish: {
      chili: { left: 16.6, top: 26.1 },
      onion: { left: 3.1, top: 54.6 },
      star: { left: 67.9, top: 26.1 },
      coriander: { left: 74.2, top: 59.1 },
    },
  },
  {
    id: "avial",
    wordmarkSvg: "/images/home-figma/wordmarks/avial-wordmark.svg",
    wordmarkAspect: 622 / 468,
    item: byId("avial"),
    image: "/images/home-figma/mango-avial.png",
    imageAspect: 720 / 403,
    gradient: { from: "#5b120b", to: "#3b0803" },
    rotate: false,
    wordmarkTop: 24.4,
    dishTop: 54.1,
    garnish: chattiGarnish,
  },
] as const;

/** Shared blurb under the MangoHero price/CTA row — replaces the template's
 * "At Banana Bliss..." placeholder (a different restaurant's name) across
 * all 4 variants, matching the design's own pattern of one blurb for every slide. */
export const hfMangoBlurb =
  "Kerala's village recipes, cooked the naadan way — fresh spices, slow flame, real flavour.";

/** The 4 garnish images Figma reuses across every MangoHero variant. */
export const hfMangoGarnish = {
  chili: { src: "/images/home-figma/garnish-chili.png", width: 7.8, height: 11.8 },
  onion: { src: "/images/home-figma/garnish-onion.png", width: 14.9, height: 24.4 },
  star: { src: "/images/home-figma/garnish-star.png", width: 10.4, height: 16.7 },
  coriander: { src: "/images/home-figma/garnish-coriander.png", width: 15.6, height: 23.3 },
} as const;

/** Hero slider — real signature dishes, matching the Figma "God's Own ___"
 * slide set (node 62:1100). "light" mirrors the Default variant (white bg,
 * plated dish on the right); "dark" mirrors variants 2/3 (full-bleed photo).
 * Admin-editable via content/home-hero.json — slide/word/dish/image are all
 * managed from /admin, resolved here against the live menu so price/desc
 * stay in sync with whatever the Menu editor has. */
export const hfHeroSlides = homeHeroJson.slides.map((slide) => ({
  id: slide.id,
  theme: slide.theme as "light" | "dark",
  heroWord: slide.heroWord,
  item: byId(slide.menuItemId),
  image: slide.image,
}));

/** "From Our Kitchen" spotlight — repurposed from the template's generic blog
 * section, since the site has no blog. Real dish/site content, no invented posts. */
export const hfSpotlights = [
  {
    id: "chatti-choru-story",
    category: "Heritage",
    image: "/images/home-figma/special-1.png",
    title: "Why Chatti Choru Is Served in Clay",
    body: "Rice and curries slow-finished in a wide earthen pot — the way it's served at village tables across Kerala.",
    href: "/menu/#biryani-rice",
  },
  {
    id: "kizhi-porotta-story",
    category: "Signature",
    image: "/images/home-figma/special-2.png",
    title: "Kizhi Porotta: The Banana-Leaf Reveal",
    body: "Porotta and curry meat steamed and charred inside a banana-leaf parcel — unwrapped fresh at your table.",
    href: "/menu/#dosa-appam",
  },
  {
    id: "weekend-specials",
    category: "Specials",
    image: "/images/home-figma/special-3.png",
    title: "Weekend & Game-Meat Specials",
    body: "Rabbit, duck and buffalo done the naadan way — availability changes, so book ahead.",
    href: "/specials/",
  },
] as const;

export const hfNavLinks = [
  { href: "/menu/", label: "Menu" },
  { href: "/specials/", label: "Specials" },
  { href: "/catering/", label: "Catering" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

export const hfFooterMenuLinks = [
  byId("chatti-choru"),
  byId("kizhi-porotta"),
  byId("thalassery-biryani"),
  byId("meen-pollichathu"),
] as const;

export { formatPrice };

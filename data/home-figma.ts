import { menuSections, formatPrice, type MenuItem } from "./menu";
import homeHeroJson from "@/content/home-hero.json";
import homeShowcaseJson from "@/content/home-showcase.json";
import type { HomeHeroSlide } from "@/lib/content/schemas";

const allItems = menuSections.flatMap((section) => section.items);
// A deleted-from-menu id (via /admin) must not take the whole site build down —
// every list below drops the slide/dish/link instead of throwing.
const byId = (id: string): MenuItem | undefined => allItems.find((i) => i.id === id);

/** Bento grid — signature dishes section. Real menu data; photo per dish is
 * admin-editable via content/home-showcase.json (see /admin). */
export const hfBentoDishes = (
  [
    { id: "kizhi-porotta", image: homeShowcaseJson.signatureDishes["kizhi-porotta"] },
    { id: "meen-pollichathu", image: homeShowcaseJson.signatureDishes["meen-pollichathu"] },
    { id: "thalassery-biryani", image: homeShowcaseJson.signatureDishes["thalassery-biryani"] },
    { id: "kerala-fish-curry", image: homeShowcaseJson.signatureDishes["kerala-fish-curry"] },
  ] as const
)
  .map(({ id, image }) => {
    const item = byId(id);
    return item ? { item, image } : undefined;
  })
  .filter((dish): dish is { item: MenuItem; image: string } => dish !== undefined);

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
 * together exactly as in the design. */
const mangoSlideDefs = [
  {
    id: "chatti-choru",
    wordmarkSvg: "/images/home-figma/wordmarks/chatti-choru-wordmark.svg",
    wordmarkAspect: 977 / 309,
    image: homeShowcaseJson.mangoSlides["chatti-choru"],
    imageAspect: 1472 / 990,
    gradient: { from: "#2baae2", to: "#046937" },
    // Only the Figma "Default" variant rotates its focal image (rotate_31);
    // variants 2/3/4 crop it into a plain, unrotated frame.
    rotate: true,
    wordmarkTop: 31.1,
    dishTop: 54.1,
  },
  {
    id: "kappa-biryani",
    wordmarkSvg: "/images/home-figma/wordmarks/kappa-biryani-wordmark.svg",
    wordmarkAspect: 1152 / 440,
    image: homeShowcaseJson.mangoSlides["kappa-biryani"],
    imageAspect: 777 / 409,
    gradient: { from: "#2b1105", to: "#542103" },
    rotate: false,
    wordmarkTop: 32.2,
    dishTop: 47.1,
  },
  {
    id: "thalassery-biryani",
    wordmarkSvg: "/images/home-figma/wordmarks/thalassery-biryani-wordmark.svg",
    wordmarkAspect: 1152 / 520,
    image: homeShowcaseJson.mangoSlides["thalassery-biryani"],
    imageAspect: 782 / 463,
    gradient: { from: "#034e35", to: "#012c1e" },
    rotate: false,
    wordmarkTop: 20,
    dishTop: 48.6,
  },
  {
    id: "avial",
    wordmarkSvg: "/images/home-figma/wordmarks/avial-wordmark.svg",
    wordmarkAspect: 622 / 468,
    image: homeShowcaseJson.mangoSlides.avial,
    imageAspect: 720 / 403,
    gradient: { from: "#5b120b", to: "#3b0803" },
    rotate: false,
    wordmarkTop: 24.4,
    dishTop: 54.1,
  },
] as const;

export const hfMangoSlides = mangoSlideDefs
  .map((slide) => {
    const item = byId(slide.id);
    return item ? { ...slide, item } : undefined;
  })
  .filter((slide): slide is (typeof mangoSlideDefs)[number] & { item: MenuItem } => slide !== undefined);

/** Shared blurb under the MangoHero price/CTA row — replaces the template's
 * "At Banana Bliss..." placeholder (a different restaurant's name) across
 * all 4 variants, matching the design's own pattern of one blurb for every slide. */
export const hfMangoBlurb =
  "Kerala's village recipes, cooked the naadan way — fresh spices, slow flame, real flavour.";

/** Hero slider — real signature dishes, matching the Figma "God's Own ___"
 * slide set (node 62:1100). "light" mirrors the Default variant (white bg,
 * plated dish on the right); "dark" mirrors variants 2/3 (full-bleed photo).
 * Admin-editable via content/home-hero.json — slide/word/image are managed
 * from /admin. "dish" slides resolve against the live menu so price/desc
 * stay in sync with whatever the Menu editor has; "custom" slides carry
 * their own description and link instead of a dish (e.g. an event promo). */
export const hfHeroSlides = (homeHeroJson.slides as HomeHeroSlide[])
  .map((slide) => {
    const base = {
      id: slide.id,
      theme: slide.theme,
      heroWord: slide.heroWord,
      image: slide.image,
    };
    if (slide.kind === "custom") {
      return {
        ...base,
        kind: "custom" as const,
        description: slide.description,
        linkUrl: slide.linkUrl,
        linkLabel: slide.linkLabel,
      };
    }
    const item = byId(slide.menuItemId);
    return item ? { ...base, kind: "dish" as const, item } : undefined;
  })
  .filter((slide) => slide !== undefined);

/** "From Our Kitchen" spotlight — repurposed from the template's generic blog
 * section, since the site has no blog. Real dish/site content, no invented posts. */
export const hfSpotlights = [
  {
    id: "chatti-choru-story",
    category: "Heritage",
    image: "/images/home-figma/special-1.png",
    title: "Why Chatti Choru Is Served in Clay",
    body: "Rice and curries slow-finished in a wide earthen pot — the way it's served at village tables across Kerala.",
    href: "/menu/#rice",
  },
  {
    id: "kizhi-porotta-story",
    category: "Signature",
    image: "/images/home-figma/special-2.png",
    title: "Kizhi Porotta: The Banana-Leaf Reveal",
    body: "Porotta and curry meat steamed and charred inside a banana-leaf parcel — unwrapped fresh at your table.",
    href: "/menu/#chicken-meat",
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

export const hfFooterMenuLinks = (
  ["chatti-choru", "kizhi-porotta", "thalassery-biryani", "meen-pollichathu"] as const
)
  .map(byId)
  .filter((item): item is MenuItem => item !== undefined);

export { formatPrice };

import { legacyPhoto } from "@/data/legacy-site";
import { formatPrice } from "@/data/menu";

export const douzeAnnouncement =
  "Dine-in by booking — call (02) 9734 9634 · Moorebank, Sydney";

export const douzeBenefits = [
  "Woodfire Kitchen",
  "Fresh Spices",
  "Village Recipes",
  "Moorebank",
  "Banana Leaf",
  "Game Meats",
  "Toddy",
  "Book Ahead",
] as const;

export const douzePerks = [
  "Tables by booking",
  "On-site parking",
  "Catering available",
  "WhatsApp offers",
] as const;

export const douzeSignatures = [
  {
    name: "Chatti Choru",
    malayalam: "ചട്ടി ചോർ",
    price: formatPrice(25),
    image: legacyPhoto(0).src,
    alt: "Chatti choru — rice and curries in an earthen pot",
    blurb: "Rice and curries in a wide earthen pot — our best seller.",
    badge: "Best seller",
  },
  {
    name: "Kizhi Porotta",
    malayalam: "കിഴി പൊറോട്ട",
    price: formatPrice(25),
    image: legacyPhoto(1).src,
    alt: "Kizhi porotta — banana leaf parcel",
    blurb: "Porotta and curry meat, steamed in banana leaf.",
    badge: "Signature",
  },
  {
    name: "Kallu · Toddy",
    price: "Ask us",
    image: legacyPhoto(2).src,
    alt: "Kallu toddy in a clay cup",
    blurb: "The village pour — only here in Sydney.",
    badge: "Only here",
  },
] as const;

export const douzePillars = [
  {
    id: "table",
    eyebrow: "Kerala's village table",
    title: "Where naadan cooking and long lunches go hand in hand.",
    body: "Chatti service, shared plates, and the slow rhythm of a backwater lunch — without leaving Moorebank.",
  },
  {
    id: "flame",
    eyebrow: "Cooked over woodfire",
    title: "Curries, fish and porotta with the depth only flame gives.",
    body: "Porotta parcels charred on the skillet, fish pollichathu in banana leaf — recipes the village never wrote down.",
  },
  {
    id: "gather",
    eyebrow: "Book ahead, eat well",
    title: "A white house on Nuwarra Road. Warm lights, curry leaves in the air.",
    body: "Dine-in by booking. We keep your table ready and the kitchen at its best.",
  },
] as const;

export const douzeCommitments = [
  "Woodfire curries and porotta cooked over flame",
  "Fresh spices, banana leaf, and earthen pots",
  "Game meats and toddy — naadan signatures",
  "Family recipes from Kerala's backwaters",
] as const;

export const douzePress = [
  "Google Reviews",
  "Sydney Food Lovers",
  "Kerala Community",
  "Moorebank Locals",
] as const;

export const douzeTestimonials = [
  {
    quote:
      "Feels like a warm home — the chatti choru took me straight back to my grandmother's kitchen in Kerala.",
    author: "Google review",
  },
  {
    quote:
      "The kizhi porotta is unlike anything else in Sydney. Unwrapping that banana leaf at the table is an event.",
    author: "Google review",
  },
  {
    quote:
      "Proper naadan food — rabbit, duck, buffalo done the village way. Book ahead, it's worth it.",
    author: "Google review",
  },
  {
    quote:
      "Best Kerala food in Sydney. The duck roast and meen pollichathu are outstanding every visit.",
    author: "Regular guest",
  },
] as const;

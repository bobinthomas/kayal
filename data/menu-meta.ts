/** Amrit Palace–style menu page copy and section nav labels. */
export const menuPageCopy = {
  eyebrowLeft: "Flavours of Kerala",
  eyebrowRight: "Naadan Discoveries",
  discoveryTagline: "Every dish tells a story of spice, care, and heritage…",
  intro:
    "A symphony of flavours, crafted with care. At Kayal Foods, every dish reflects tradition and creativity — from the spices that awaken your senses to the sweetness that lingers at the end. Pair your meal with fresh breads and lassi, and let the journey unfold.",
};

export const menuNavLabels: Record<string, string> = {
  starters: "Starters",
  "dosa-appam": "Dosa & Appam",
  vegetarian: "Vegetarian",
  "chicken-meat": "Chicken & Meat",
  seafood: "Seafood",
  "biryani-rice": "Biryani & Rice",
  breads: "Breads",
  "sides-pickles": "Sides & Pickles",
  "desserts-drinks": "Desserts & Drinks",
};

export const menuFeaturedSpotlights = [
  {
    id: "chatti-experience",
    eyebrow: "Served in earthenware",
    title: "The Chatti Experience",
    price: 25,
    description:
      "Design your perfect Kerala feast — rice, curries, and protein served in an authentic chatti, with sides, porotta, and chutney.",
    steps: [
      {
        label: "I.",
        title: "Choose your chatti",
        detail: "Chattichoru, chatti porotta, or kappachatti — each served in earthenware.",
      },
      {
        label: "II.",
        title: "Choose your protein",
        detail: "Chicken, mutton, beef, or coastal fish — naadan style.",
      },
      {
        label: "III.",
        title: "Finish with sides",
        detail: "Papadam, pickle, and a sweet finish from our dessert list.",
      },
    ],
    href: "#biryani-rice",
  },
  {
    id: "lunch-specials",
    eyebrow: "Lunch Specials",
    title: "Kayal Lunch Thali",
    price: 25,
    subtitle: "Available Monday – Friday, 12 PM – 3 PM",
    description:
      "Enjoy a complete and satisfying meal — two rich Kerala curries, a traditional side, freshly baked bread, and a sweet dessert to finish.",
    choiceGroups: [
      {
        label: "Choose Two",
        options: [
          "Palak Paneer",
          "Chicken Curry",
          "Beef Ularthiyathu",
          "Dal Tadka",
          "Malabar Prawn Curry",
          "Paneer Masala",
        ],
      },
      {
        label: "Choose One",
        options: ["Kerala Porotta", "Naan", "Appam", "Basmati Rice"],
      },
      {
        label: "Choose One",
        options: ["Gulab Jamun", "Ada Pradhaman", "Mango Lassi"],
      },
    ],
  },
] as const;

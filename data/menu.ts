/**
 * Menu dataset — 9 sections with seed dishes.
 * TODO: replace with real ~115-item dataset from owner.
 */

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

export const menuSections: MenuSection[] = [
  {
    id: "starters",
    title: "Starters",
    blurb: "Light bites and shareable plates to open the meal.",
    items: [
      {
        id: "veg-samosa",
        name: "Vegetable Samosa",
        mal: "സമോസ",
        desc: "Crispy turnovers with spiced potato, peas, ginger and fenugreek.",
        price: 9.9,
        tags: ["veg"],
      },
      {
        id: "onion-bhaji",
        name: "Onion Bhaji",
        mal: "ഉള്ളി ഭജി",
        desc: "Finely sliced onion in a fragrantly spiced batter, fried crisp.",
        price: 9.9,
        tags: ["veg"],
      },
      {
        id: "chicken-tikka",
        name: "Chicken Tikka",
        desc: "Yogurt-marinated chicken charred in the tandoor.",
        price: 17.9,
      },
      {
        id: "fish-tikka",
        name: "Fish Tikka",
        desc: "Fresh fish fillet marinated and grilled over woodfire.",
        price: 18.9,
        tags: ["signature"],
      },
    ],
  },
  {
    id: "dosa-appam",
    title: "Dosa & Appam",
    blurb: "Fermented rice batters — lacy appam and crisp dosa from the griddle.",
    items: [
      {
        id: "appam",
        name: "Appam",
        mal: "അപ്പം",
        desc: "Lacy fermented rice pancake with a soft centre.",
        price: 3.0,
        tags: ["veg", "availability"],
      },
      {
        id: "idiappam",
        name: "Idiyappam",
        mal: "ഇടിയപ്പം",
        desc: "Steamed rice noodle nests — perfect for mopping curry.",
        price: 1.5,
        tags: ["veg", "availability"],
      },
      {
        id: "masala-dosa",
        name: "Masala Dosa",
        desc: "Crisp rice crepe rolled with spiced potato masala.",
        price: 16.9,
        tags: ["veg"],
      },
      {
        id: "appam-stew",
        name: "Appam with Vegetable Stew",
        desc: "Two appam served with coconut milk vegetable stew.",
        price: 18.9,
        tags: ["veg", "signature"],
      },
    ],
  },
  {
    id: "vegetarian",
    title: "Vegetarian",
    blurb: "Wholesome vegetable curries, lentils and paneer from the Kerala coast.",
    items: [
      {
        id: "palak-paneer",
        name: "Palak Paneer",
        desc: "Creamy spinach sauce with soft paneer cubes.",
        price: 19.5,
        tags: ["veg"],
      },
      {
        id: "dal-tadka",
        name: "Dal Tadka",
        mal: "പരിപ്പ്",
        desc: "Yellow lentils tempered with garlic, cumin and curry leaves.",
        price: 17.9,
        tags: ["veg"],
      },
      {
        id: "avial",
        name: "Avial",
        desc: "Mixed vegetables in coconut and yoghurt — a festival classic.",
        price: 18.9,
        tags: ["veg", "signature"],
      },
      {
        id: "mushroom-pepper",
        name: "Mushroom Pepper Fry",
        desc: "Button mushrooms tossed with black pepper and coconut oil.",
        price: 19.9,
        tags: ["veg", "spicy"],
      },
    ],
  },
  {
    id: "chicken-meat",
    title: "Chicken & Meat",
    blurb: "Woodfire curries, roasts and ularthiyathu from the village repertoire.",
    items: [
      {
        id: "butter-chicken",
        name: "Butter Chicken",
        desc: "Tandoor chicken in a rich tomato and cream sauce.",
        price: 21.9,
      },
      {
        id: "beef-ulathiyathu",
        name: "Beef Ularthiyathu",
        mal: "ബീഫ് ഉലർത്തിയത്",
        desc: "Dry-roasted beef with coconut slivers, curry leaves and black pepper.",
        price: 24.9,
        tags: ["spicy", "signature"],
      },
      {
        id: "chicken-chettinad",
        name: "Chicken Chettinad",
        desc: "Fiery pepper masala from the Chettinad spice trail.",
        price: 21.9,
        tags: ["spicy"],
      },
      {
        id: "kizhi-porotta",
        name: "Kizhi Porotta",
        mal: "കിഴി പൊറോട്ട",
        desc: "Porotta and curry meat wrapped in banana leaf, steamed and charred on the skillet.",
        price: 25.0,
        tags: ["signature", "availability"],
      },
    ],
  },
  {
    id: "seafood",
    title: "Seafood",
    blurb: "Fish and prawns from the backwater — bold spice, coconut, and banana leaf.",
    items: [
      {
        id: "kerala-fish-curry",
        name: "Kerala Fish Curry",
        mal: "മീൻ കറി",
        desc: "Tamarind and kokum sourness with coconut milk and curry leaves.",
        price: 24.9,
        tags: ["signature"],
      },
      {
        id: "meen-pollichathu",
        name: "Meen Pollichathu",
        mal: "മീൻ പൊളിച്ചത്",
        desc: "Fish wrapped in banana leaf and slow-roasted with spices.",
        price: 30.0,
        tags: ["signature", "availability"],
      },
      {
        id: "prawn-masala",
        name: "Prawn Masala",
        desc: "Tiger prawns in tomato, onion and ginger masala.",
        price: 26.9,
        tags: ["spicy"],
      },
      {
        id: "karimeen-fry",
        name: "Pearl Spot Fry",
        mal: "കരിമീൻ",
        desc: "Kerala pearl spot pan-fried with turmeric and chilli.",
        price: 28.9,
        tags: ["availability"],
      },
    ],
  },
  {
    id: "biryani-rice",
    title: "Biryani & Rice",
    blurb: "Fragrant basmati and Kerala rice dishes, layered and slow-cooked.",
    items: [
      {
        id: "thalassery-biryani",
        name: "Thalassery Biryani",
        mal: "തലശ്ശേരി ബിരിയാണി",
        desc: "Short-grain rice layered with spiced meat, fried onion and ghee.",
        price: 22.9,
        tags: ["signature"],
      },
      {
        id: "chatti-choru",
        name: "Chatti Choru",
        mal: "ചട്ടി ചോർ",
        desc: "Rice, curries and protein served in a wide earthen pot.",
        price: 25.0,
        tags: ["signature", "availability"],
      },
      {
        id: "matta-rice",
        name: "Kerala Matta Rice",
        desc: "Nutty red parboiled rice — the everyday grain of the coast.",
        price: 6.9,
        tags: ["veg"],
      },
      {
        id: "kappa-biryani",
        name: "Kappa Biryani",
        desc: "Tapioca cooked with spicy beef masala and roasted coconut.",
        price: 19.9,
        tags: ["spicy", "availability"],
      },
    ],
  },
  {
    id: "breads",
    title: "Breads",
    blurb: "Porotta, naan and paratha — torn, dipped, and shared.",
    items: [
      {
        id: "porotta",
        name: "Kerala Porotta",
        mal: "പൊറോട്ട",
        desc: "Flaky layered flatbread from the Malabar coast.",
        price: 4.0,
        tags: ["veg", "availability"],
      },
      {
        id: "naan",
        name: "Naan",
        desc: "Soft leavened flatbread from the tandoor.",
        price: 4.5,
        tags: ["veg"],
      },
      {
        id: "garlic-naan",
        name: "Garlic Naan",
        desc: "Naan brushed with garlic butter.",
        price: 5.5,
        tags: ["veg"],
      },
      {
        id: "aloo-paratha",
        name: "Aloo Paratha",
        desc: "Whole-wheat flatbread stuffed with spiced potato.",
        price: 6.9,
        tags: ["veg"],
      },
    ],
  },
  {
    id: "sides-pickles",
    title: "Sides & Pickles",
    blurb: "Papadam, salads, chutneys and the sharp bite of pickle.",
    items: [
      {
        id: "pappadam",
        name: "Papadam",
        desc: "Crisp lentil wafers — fried or roasted.",
        price: 4.5,
        tags: ["veg"],
      },
      {
        id: "green-salad",
        name: "Green Salad",
        desc: "Fresh leaves, onion and lemon.",
        price: 8.9,
        tags: ["veg"],
      },
      {
        id: "mango-pickle",
        name: "Mango Pickle",
        mal: "അച്ചാർ",
        desc: "House mango pickle — hot, sour, indispensable.",
        price: 4.0,
        tags: ["veg", "spicy"],
      },
      {
        id: "raita",
        name: "Cucumber Raita",
        desc: "Cool yoghurt with cucumber and cumin.",
        price: 5.5,
        tags: ["veg"],
      },
    ],
  },
  {
    id: "desserts-drinks",
    title: "Desserts & Drinks",
    blurb: "Sweet finishes and refreshing pours.",
    items: [
      {
        id: "payasam",
        name: "Ada Pradhaman",
        mal: "പായസം",
        desc: "Rice ada slow-cooked in jaggery and coconut milk.",
        price: 8.9,
        tags: ["veg"],
      },
      {
        id: "gulab-jamun",
        name: "Gulab Jamun",
        desc: "Warm milk dumplings in rose-cardamom syrup.",
        price: 7.9,
        tags: ["veg"],
      },
      {
        id: "mango-lassi",
        name: "Mango Lassi",
        desc: "Thick yoghurt blended with ripe mango.",
        price: 7.5,
        tags: ["veg"],
      },
      {
        id: "filter-coffee",
        name: "South Indian Filter Coffee",
        mal: "കാപ്പി",
        desc: "Strong decoction with frothy hot milk.",
        price: 5.5,
        tags: ["veg"],
      },
    ],
  },
];

export const menuDisclaimer =
  "Prices in AUD, subject to change. Specials and game meats are served as per availability — message us on WhatsApp to check today's pot.";

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

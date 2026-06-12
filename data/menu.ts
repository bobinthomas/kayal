/**
 * Full menu — encoded verbatim from PRD Appendix A (extracted from the old
 * kayal.com.au Elementor price lists). Prices in AUD.
 * Owner to confirm prices before launch.
 */

export type MenuTag = "signature" | "availability" | "veg" | "spicy" | "new" | "game";

export type MenuItem = {
  id: string;
  name: string;
  qtyNote?: string;
  description?: string;
  price: number;
  variants?: { label: string; price: number }[];
  tags?: MenuTag[];
  image?: string;
};

export type MenuSection = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};

export const menuSections: MenuSection[] = [
  {
    id: "starters-veg",
    title: "Starters — Vegetarian",
    items: [
      {
        id: "veg-samosa",
        name: "Veg samosa",
        qtyNote: "(2 pcs)",
        price: 9.9,
        description:
          "Flaky and tender fried samosa are one of the most popular recipes in North Indian cuisine.",
        tags: ["veg"],
      },
      {
        id: "paneer-pakora",
        name: "Paneer pakora",
        qtyNote: "(2 pcs)",
        price: 12.9,
        description:
          "Paneer pakora is a popular evening snack from North Indian cuisine. It is made by batter frying Indian cottage cheese aka paneer.",
        tags: ["veg"],
      },
      {
        id: "onion-bhaji",
        name: "Onion bhaji",
        qtyNote: "(2 pcs)",
        price: 9.9,
        description:
          "Finely sliced onion smothered in a simple, fragrantly spiced batter and fried to crispy perfection.",
        tags: ["veg"],
      },
      {
        id: "veg-basket",
        name: "Veg basket",
        price: 14.9,
        description:
          "Baskets are made from grated fried potatoes. These are then filled with the quintessential chaat ingredients like boiled chana (chickpeas), potatoes, spicy and sweet chutneys, curd, chaat masala etc.",
        tags: ["veg"],
      },
      {
        id: "pappdi-chat",
        name: "Pappdi chat",
        price: 14.9,
        description:
          "It is a yummy snack assorted with crunchy base of poori which is topped with lip-smacking chutneys.",
        tags: ["veg"],
      },
      {
        id: "gobi-manchuriyan",
        name: "Gobi manchuriyan",
        price: 15.9,
        description:
          "Cauliflower manchurian is made by tossing crisp fried cauliflower in slightly sour, sweet & hot sauces.",
        tags: ["veg"],
      },
      {
        id: "paneer-chilly",
        name: "Paneer chilly",
        price: 19.9,
        description:
          "Paneer chilly is a Indo chinese starter or appetizer made by tossing fried paneer in sweet sour and spicy chilli sauce.",
        tags: ["veg", "spicy"],
      },
      {
        id: "hara-bara-kebab",
        name: "Hara bara kebab",
        price: 9.9,
        description:
          "Hara bara kebab are spiced patties made with a mix of spinach, green peas and potatoes.",
        tags: ["veg"],
      },
    ],
  },
  {
    id: "starters-nonveg",
    title: "Starters — Non-Vegetarian",
    items: [
      {
        id: "tandoori-chicken",
        name: "Tandoori chicken",
        price: 13.9,
        variants: [
          { label: "Half", price: 13.9 },
          { label: "Full", price: 21.9 },
        ],
        description:
          "Tandoori chicken is a crazy good and smoky chicken appetiser that you will love truly.",
      },
      {
        id: "chicken-tikka",
        name: "Chicken tikka",
        qtyNote: "(4 pcs)",
        price: 14.9,
        description:
          "The traditional chicken tikka consists of small pieces of marinated chicken, threaded onto skewers.",
      },
      {
        id: "malai-tikka",
        name: "Malai tikka",
        qtyNote: "(4 pcs)",
        price: 14.9,
        description:
          "Tender and juicy Murgh Malai Tikka are super tasty and are bursting with flavor.",
      },
      {
        id: "lamb-chops",
        name: "Lamb chops",
        qtyNote: "(4 pcs)",
        price: 28.9,
        description:
          "Succulent lamb or mutton chops marinated for hours and cooked on tawa or in oven to give one of the mouth watering experience.",
      },
      {
        id: "sheek-kabab",
        name: "Sheek kabab",
        qtyNote: "(4 pcs)",
        price: 22.9,
        description:
          "In this classic Indian dish, spiced ground lamb is threaded onto skewers and grilled until charred.",
      },
      {
        id: "mix-nonveg-platter",
        name: "Mix non-veg platter",
        qtyNote: "(2 pcs each)",
        price: 24.9,
        description: "A concoction of assorted items in tikkas, tandoor and grills.",
      },
      {
        id: "fish-tikka-starter",
        name: "Fish tikka",
        qtyNote: "(2 pcs)",
        price: 24.9,
        description:
          "Tender fish marinated in a classic Indian tandoori masala and crisped to perfection.",
      },
      {
        id: "tiger-prawns",
        name: "Tiger prawns",
        qtyNote: "(6 pcs)",
        price: 24.9,
        description: "Perfectly marinated and grilled Indian Tandoori shrimp skewers.",
      },
    ],
  },
  {
    id: "mains-veg",
    title: "Main Course — Vegetarian",
    items: [
      {
        id: "daal-tadka",
        name: "Daal tadka",
        price: 14.9,
        description: "National curry with lentils tempered with cumin seed, garlic and butter.",
        tags: ["veg"],
      },
      {
        id: "daal-makhani",
        name: "Daal makhani",
        price: 14.9,
        description: "Lentils soaked overnight and simmered to perfection with herbs and spices.",
        tags: ["veg"],
      },
      {
        id: "navratan-korma",
        name: "Navratan korma",
        price: 16.9,
        description: "Mixed vegetables and fruit in a rich curry sauce.",
        tags: ["veg"],
      },
      {
        id: "aloo-gobi",
        name: "Aloo gobi",
        price: 16.9,
        description: "Cauliflower and potatoes cooked in a rich curry sauce.",
        tags: ["veg"],
      },
      {
        id: "shahi-baingan",
        name: "Shahi baingan",
        price: 16.9,
        description: "Eggplant cooked in exotic sauce finished with fennel fresh coriander and cream.",
        tags: ["veg"],
      },
      {
        id: "malai-kofta",
        name: "Malai kofta",
        price: 16.9,
        description: "Potato and cottage cheese dumplings tossed in a cashew.",
        tags: ["veg"],
      },
      {
        id: "paneer-tikka-masala",
        name: "Paneer tikka masala",
        price: 18.9,
        description: "Paneer marinated and finished in semi dry sauce with coriander.",
        tags: ["veg"],
      },
      {
        id: "shaai-paneer",
        name: "Shaai paneer",
        price: 18.9,
        description:
          "Home made cheese cooked in exotic sauce finished with fennel and fresh coriander.",
        tags: ["veg"],
      },
      {
        id: "butter-paneer-masala",
        name: "Butter paneer masala",
        price: 18.9,
        description: "Cottage cheese mixed with rich tomato cashew gravy.",
        tags: ["veg"],
      },
      {
        id: "palak-paneer",
        name: "Palak paneer",
        price: 18.9,
        description: "Dices of cottage cheese cooked with spinach and spices.",
        tags: ["veg"],
      },
      {
        id: "kadai-paneer",
        name: "Kadai paneer",
        price: 18.9,
        description: "Cottage cheese cooked with wok fried spices, onion, tomato.",
        tags: ["veg"],
      },
    ],
  },
  {
    id: "ocean",
    title: "Main Course — From the Ocean",
    items: [
      {
        id: "goan-fish-curry",
        name: "Goan fish curry",
        price: 22.9,
        description: "Fish curry with coconut from the beaches of goa.",
      },
      {
        id: "madras-fish-curry",
        name: "Madras fish curry",
        price: 22.9,
        description:
          "Fish cooked with specially selected spices such as fenugreek, green chillies and tamarind.",
      },
      {
        id: "fish-mollie",
        name: "Fish Mollie",
        price: 22.9,
        description:
          "Fish Molly or Meen Moilee is a Kerala style Fish Curry where fish is cooked in a coconut milk based gravy.",
      },
      {
        id: "kerala-fish-curry",
        name: "Kerala Fish Curry",
        price: 22.9,
        description: "Kerala style Fish Curry.",
        tags: ["signature"],
      },
      {
        id: "prawn-masala",
        name: "Prawn masala",
        price: 24.9,
        description:
          "Prawn cooked in thick gravy with tomatoes, green chillies, green capsicum and fresh coriander.",
      },
      {
        id: "malabar-prawn-curry",
        name: "Malabar prawn curry",
        price: 24.9,
        description: "King prawns simmered in coconut gravy with tamarind spices.",
      },
    ],
  },
  {
    id: "meat",
    title: "Main Course — Meat & Poultry",
    items: [
      {
        id: "butter-chicken",
        name: "Butter chicken",
        price: 21.9,
        description:
          "Marinated chicken fillets cooked in tandoor, sauteed in butter tomato sauce.",
      },
      {
        id: "chicken-korma",
        name: "Chicken korma",
        price: 21.9,
        description:
          "Chicken simmered in freshly ground coconut, cashew nut paste and exotic spice.",
      },
      {
        id: "chicken-vindaloo",
        name: "Chicken vindaloo",
        price: 21.9,
        description: "A very popular spicy dish from goa.",
        tags: ["spicy"],
      },
      {
        id: "mango-chicken",
        name: "Mango chicken",
        price: 21.9,
        description: "Chicken fillets cooked in delicious mango gravy.",
      },
      {
        id: "kadai-chicken",
        name: "Kadai chicken",
        price: 21.9,
        description:
          "Thigh fillets marinated in yoghurt, wok fried with spices, tomatoes, onion and capsicum.",
      },
      {
        id: "madras-chicken",
        name: "Madras chicken",
        price: 21.9,
        description: "Chicken cooked with fried coconut with red spices.",
      },
      {
        id: "chicken-chettinadu",
        name: "Chicken chettinadu",
        price: 21.9,
        description:
          "Boneless chicken cooked in an authentic South Indian style with black pepper, onion and tomatoes.",
      },
      {
        id: "chicken-tikka-masala",
        name: "Chicken tikka masala",
        price: 21.9,
        description:
          "A traditional Indian favourite; grilled chicken sauteed with onion, capsicum, tomato, spices and fenugreek leaves.",
      },
      {
        id: "chilly-chicken",
        name: "Chilly chicken",
        price: 21.9,
        description: "Strips of marinated chicken sauteed with onions and capsicum.",
        tags: ["spicy"],
      },
      {
        id: "lamb-rogan-josh",
        name: "Lamb rogan josh",
        price: 23.9,
        description: "An all time favourite dish, with tomatoes and blend of spices.",
      },
      {
        id: "lamb-korma",
        name: "Lamb korma",
        price: 23.9,
        description:
          "Lamb simmered with freshly ground coconut, cashew nut paste and exotic spices.",
      },
      {
        id: "lamb-pepper-masala",
        name: "Lamb pepper masala",
        price: 23.9,
        description: "Diced lamb cooked in country style with fresh herbs and peppercorn.",
      },
      {
        id: "lamb-saagwala",
        name: "Lamb saagwala",
        price: 23.9,
        description: "Tender goat cooked on the bone in the chef's secret recipe.",
      },
      {
        id: "goat-curry",
        name: "Goat Curry",
        price: 23.9,
        description:
          "This Curry is with Roasted Coconut Sauce. We are using some whole spices and blended along with coconut which makes our Adu curry very flavourful.",
      },
      {
        id: "cochin-beef",
        name: "Cochin beef",
        price: 23.9,
        description:
          "A perfect home style stew cooked throughout the villages of Cochin. Tender pieces of beef cooked with special roasted masala.",
      },
      {
        id: "beef-curry",
        name: "Beef curry",
        price: 23.9,
        description:
          "Authentic Traditional beef curry with Shallots & Kerala Garam Masala.",
      },
      {
        id: "beef-nilgiri",
        name: "Beef nilgiri",
        price: 23.9,
        description: "A popular Beef curry from south india Cooked with Green masala.",
      },
      {
        id: "beef-korma",
        name: "Beef korma",
        price: 23.9,
        description:
          "Curry made by searing meat & then simmering it in a broth (with spices & coconut milk).",
      },
      {
        id: "beef-ulathiyathu",
        name: "Beef ulathiyathu",
        price: 23.9,
        description: "Chefs special with meat masala & spices.",
        tags: ["signature"],
      },
    ],
  },
  {
    id: "rice-breads",
    title: "Rice & Breads",
    items: [
      {
        id: "rice",
        name: "Rice",
        price: 4.95,
        description:
          "Steamed Rice are so versatile as a dish, they can be served with so many things.",
        tags: ["veg"],
      },
      {
        id: "saffron-rice",
        name: "Saffron Rice",
        price: 6.95,
        description: "The special aromatic biriyani with saffron.",
        tags: ["veg"],
      },
      {
        id: "matta-rice",
        name: "Matta Rice",
        price: 12.95,
        description: "The special kerala matta rice.",
        tags: ["veg"],
      },
      {
        id: "kashmir-veg-pulao",
        name: "Kashmir / Veg pulao",
        price: 12.95,
        description:
          "Long Basmathi rice cooked with only fruits and green peas, served with fried onions and coriander.",
        tags: ["veg"],
      },
      {
        id: "fried-rice",
        name: "Fried Rice — Veg / Non-veg",
        price: 18.9,
        description: "Basmati rice sauteed with soy sauce and spring vegetables.",
      },
      {
        id: "veg-biriyani",
        name: "Veg Biriyani",
        price: 18.5,
        description: "Rice dish with vegetables.",
        tags: ["veg"],
      },
      {
        id: "biriyani-chicken",
        name: "Biriyani — Chicken",
        price: 19.9,
        description:
          "A specialty of Kerala. Basmati rice simmered with your choice of meat with chef's special herbs and spices, finished with saffron and cardamon flavor.",
      },
      {
        id: "biriyani-lamb-goat",
        name: "Biriyani — Lamb / Goat",
        price: 21.9,
        description:
          "A specialty of Kerala. Basmati rice simmered with your choice of meat with chef's special herbs and spices, finished with saffron and cardamon flavor.",
      },
      {
        id: "prawn-biriyani",
        name: "Prawn Biriyani",
        price: 24.9,
        description: "Chef's special dumb biriyani.",
      },
      {
        id: "roti",
        name: "Roti",
        price: 3.5,
        description: "Wholemeal Indian bread cooked in the Tandoori oven.",
        tags: ["veg"],
      },
      {
        id: "naan",
        name: "Naan",
        price: 3.5,
        description: "Naan is a delicious Indian bread which is made using all purpose flour.",
        tags: ["veg"],
      },
      {
        id: "butter-garlic-naan",
        name: "Butter naan / Garlic naan",
        price: 3.95,
        description:
          "Naan is a delicious Indian bread which is made using all purpose flour tossed with butter and garlic.",
        tags: ["veg"],
      },
      {
        id: "aloo-paratha",
        name: "Aloo Paratha",
        price: 4.99,
        description:
          "Wholewheat is stuffed with spicy potato stuffing, rolled and cooked like a paratha, served hot with yogurt and pickles.",
        tags: ["veg"],
      },
      {
        id: "kashmiri-naan",
        name: "Kashmiri naan",
        price: 4.99,
        description: "Naan with fruits, nuts, raisins and cottage cheese.",
        tags: ["veg"],
      },
      {
        id: "cheese-naan",
        name: "Cheese naan",
        price: 4.99,
        description:
          "Naan is a delicious Indian bread which is made using all purpose flour stuffed with cheese.",
        tags: ["veg"],
      },
    ],
  },
  {
    id: "sides-desserts",
    title: "Sides & Desserts",
    items: [
      {
        id: "pappadam-pickle",
        name: "Pappadam / pickle",
        qtyNote: "(each)",
        price: 3.0,
        description:
          "Pappadam one of the traditional South Indian favorite snacks. Pickle is tangy and spicy condiment made from raw mangoes, lemons, chillies etc.",
        tags: ["veg"],
      },
      {
        id: "green-salad",
        name: "Green salad",
        price: 7.9,
        description: "Fresh vegetable salad.",
        tags: ["veg"],
      },
      {
        id: "kulfi",
        name: "Kulfi — Roasted almonds / Mango",
        price: 5.5,
        description:
          "Reduced milk flavoured with saffron, cardamom, pistachio and almonds, served chilled.",
        tags: ["veg"],
      },
      {
        id: "gulab-jamun",
        name: "Gulab jamun",
        price: 5.5,
        description: "A popular classic Indian sweet made of milk solids and sugar.",
        tags: ["veg"],
      },
    ],
  },
  {
    id: "drinks",
    title: "Drinks & Beverages",
    items: [
      {
        id: "lassi",
        name: "Lassi — Mango / Salt / Sweet",
        price: 5.99,
        description:
          "Traditional dahi (yogurt)-based drink, is a blend of yogurt, water, spices, dry fruits and sometimes fruit.",
      },
      {
        id: "lemon-lime-bitter",
        name: "Lemon Lime Bitter",
        price: 8.99,
        description:
          "Lemon, Lime and Bitters is a mixed drink made with lemonade, lime cordial, and Angostura bitters.",
      },
      { id: "watermelon-juice", name: "Watermelon Juice", price: 9.99 },
      { id: "pineapple-juice", name: "Pineapple Juice", price: 9.99 },
      { id: "orange-juice", name: "Orange Juice", price: 9.99 },
      { id: "coke", name: "Coke", price: 3.5 },
      { id: "fanta", name: "Fanta", price: 3.5 },
      { id: "sprite", name: "Sprite", price: 3.5 },
      { id: "coke-diet", name: "Coke Diet", price: 3.5 },
    ],
  },
  {
    id: "specials",
    title: "Our Specials",
    note: "As per availability — call to check today's pot.",
    items: [
      {
        id: "chemmen-roast",
        name: "Chemmen roast",
        price: 25.0,
        description: "Prawns stir fried in delicious spicy mixture.",
        tags: ["availability", "spicy"],
      },
      {
        id: "goat-village-curry",
        name: "Goat village curry",
        price: 23.9,
        description: "Chefs secret spices with potato and carrot.",
        tags: ["availability"],
      },
      {
        id: "duck-curry-roast",
        name: "Duck Curry / Roast",
        price: 23.9,
        description:
          "Spicy and delicious Kerala Style Duck Roast simmered in an aromatic spicy masala.",
        tags: ["availability", "game", "spicy"],
      },
      {
        id: "beef-roast",
        name: "Beef roast",
        price: 25.0,
        description:
          "Spicy and delicious Kerala Style Beef Roast simmered in an aromatic spicy masala.",
        tags: ["availability", "spicy"],
      },
      {
        id: "nadan-chicken-curry",
        name: "Nadan Chicken Curry",
        price: 21.9,
        description: "Special kerala masala.",
        tags: ["availability"],
      },
      {
        id: "buffalo-curry",
        name: "Buffallo Curry",
        price: 23.9,
        description: "Kerala Style Buffallo dish.",
        tags: ["availability", "game"],
      },
      {
        id: "chilli-beef",
        name: "Chilli Beef",
        price: 24.9,
        description:
          "Kerala Style Perfect crispy strips of beef in a tangy spicy sauce.",
        tags: ["availability", "spicy"],
      },
      {
        id: "porotta",
        name: "Porotta",
        price: 4.0,
        description:
          "Kerala Parotta or Malabar Parotta is a layered flatbread that goes great with curries.",
        tags: ["availability", "veg"],
      },
      {
        id: "chakka",
        name: "Chakka",
        price: 14.99,
        description: "Kerala Style Jackfruit dish.",
        tags: ["availability", "veg"],
      },
      {
        id: "kappa",
        name: "Kappa",
        price: 12.0,
        description: "Kerala Style tapioca dish.",
        tags: ["availability", "veg"],
      },
      {
        id: "appam",
        name: "Appam",
        price: 3.0,
        description: "This is a traditional Kerala breakfast item.",
        tags: ["availability", "veg"],
      },
      {
        id: "idiappam",
        name: "Idiappam",
        price: 1.5,
        description:
          "Idiyappam is an easy to make and delicious South Indian steamed rice noodle. Made simply from rice flour, it becomes perfect to mop up delicious curries.",
        tags: ["availability", "veg"],
      },
      {
        id: "masala-mash-potato",
        name: "Masala mash potato",
        price: 9.0,
        description: "Mash potato prepared in Kerala recipe.",
        tags: ["availability", "veg"],
      },
      {
        id: "pothichoru",
        name: "Pothichoru",
        price: 25.0,
        description: "Kerala meal wrapped in Toasted Banana Leaf.",
        tags: ["availability", "signature"],
      },
      {
        id: "chattichoru",
        name: "Chattichoru",
        price: 25.0,
        description:
          "'Chatti Choru' is a combination plate consisting of rice, a variety of curries, and non-veg items, all served in a wide earthen pot.",
        tags: ["availability", "signature"],
      },
      {
        id: "kappachatti",
        name: "Kappachatti",
        price: 25.0,
        description:
          "Combination of tapioca, fish curry and fish fry in an Authentic Chatti.",
        tags: ["availability", "signature"],
      },
      {
        id: "chatti-porotta",
        name: "Chatti porotta",
        price: 25.0,
        description:
          "Combination of Kerala porotta, Chicken fry or Mutton Fry, Chicken or Mutton Naadan Curry, Ulli Chutney and a Bulls Eye Egg in an Authentic Chatti.",
        tags: ["availability", "signature"],
      },
      {
        id: "kappa-biriyani",
        name: "Kappa biriyani",
        price: 19.9,
        description:
          "Spicy beef masala is cooked with tapioca and flavored with roasted coconut.",
        tags: ["availability", "spicy"],
      },
      {
        id: "kizhi-porotta",
        name: "Kizhi porotta (Chicken / Beef)",
        price: 25.0,
        description: "Traditional Kerala bundle of deliciousness.",
        tags: ["availability", "signature"],
      },
      {
        id: "thattukada-chicken-fry",
        name: "Thattukada Chicken Fry",
        price: 19.9,
        description: "Spicy chicken fry is cooked in thattukada style.",
        tags: ["availability", "spicy"],
      },
      {
        id: "kada-porichathu",
        name: "Kada Porichathu",
        price: 14.99,
        description: "Kada (quail) stir fried in delicious spicy mixture.",
        tags: ["availability", "game", "spicy"],
      },
      {
        id: "kattupoth-ularthiyathu",
        name: "Kattupoth (Buffalo) Ularthiyathu",
        price: 25.0,
        description: "Kerala Style Buffallo meat dish.",
        tags: ["availability", "game"],
      },
      {
        id: "maan-ularthiyathu",
        name: "Maan (Deer) Ularthiyathu",
        price: 25.0,
        description: "Kerala Style Maan meat dish.",
        tags: ["availability", "game"],
      },
      {
        id: "muyal-piralan",
        name: "Muyal piralan (Rabbit)",
        price: 25.0,
        description:
          "Rabbit piralan is a spicy dry curry preparation made with a blend of Indian spices.",
        tags: ["availability", "game", "spicy"],
      },
      {
        id: "panni-ularthiyathu",
        name: "Panni Ularthiyathu",
        price: 19.9,
        description: "Kerala Style Pork meat dish.",
        tags: ["availability", "game"],
      },
      {
        id: "mussels-varatty",
        name: "Mussels' varatty (Kallummakai)",
        qtyNote: "(10 pcs)",
        price: 19.9,
        description: "Stir fried mussels in authentic spices.",
        tags: ["availability"],
      },
      {
        id: "kakkayirachi",
        name: "Kakkayirachi",
        price: 19.9,
        description: "Stir fried kakkayirachi with authentic kerala spices.",
        tags: ["availability"],
      },
      {
        id: "crab-roast",
        name: "Crab roast",
        price: 25.0,
        description:
          "Spicy and delicious Kerala Style Crab Roast simmered in an aromatic spicy masala.",
        tags: ["availability", "spicy"],
      },
      {
        id: "pan-fried-fish",
        name: "Pan fried fish",
        price: 25.0,
        description: "Fish fried with kerala spices.",
        tags: ["availability"],
      },
      {
        id: "meen-pollichathu",
        name: "Meen pollichathu",
        price: 30.0,
        description:
          "A Signature dish, wrapped in banana leaf gives a unique flavour to the fish and makes it more appetizing and mouth-watering.",
        tags: ["availability", "signature"],
      },
      {
        id: "fish-tikka-special",
        name: "Fish tikka",
        price: 25.0,
        description: "Freshly marinated fish fillet cooked in tandoor.",
        tags: ["availability"],
      },
      {
        id: "meen-thala",
        name: "Meen thala",
        price: 24.9,
        description: "Purely cooked with the spice powders and coconut oil.",
        tags: ["availability"],
      },
    ],
  },
];

export const menuDisclaimer =
  "Prices are subject to change. Specials are served as per availability — call ahead to check today's pot.";

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

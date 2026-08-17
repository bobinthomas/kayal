/**
 * Zod schemas for the owner-editable content files under content/*.json.
 * Shared by the admin Pages Functions (server-side validation, always
 * authoritative) and the admin UI (client-side pre-save feedback only).
 */
import { z } from "zod";

export const MenuTagSchema = z.enum(["veg", "spicy", "signature", "availability"]);

export const MenuItemSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "lowercase-kebab-case id"),
  name: z.string().min(1),
  mal: z.string().min(1).optional(),
  desc: z.string().min(1).optional(),
  price: z.number().positive().max(500).optional(),
  tags: z.array(MenuTagSchema).optional(),
});

export const MenuSectionSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "lowercase-kebab-case id"),
  title: z.string().min(1),
  blurb: z.string().min(1),
  items: z.array(MenuItemSchema),
});

export const MenuFileSchema = z
  .object({
    sections: z.array(MenuSectionSchema).min(1),
    disclaimer: z.string().min(1),
  })
  .superRefine((data, ctx) => {
    const sectionIds = new Set<string>();
    const itemIds = new Set<string>();
    data.sections.forEach((section, sIdx) => {
      if (sectionIds.has(section.id)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate section id "${section.id}"`,
          path: ["sections", sIdx, "id"],
        });
      }
      sectionIds.add(section.id);
      section.items.forEach((item, iIdx) => {
        if (itemIds.has(item.id)) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate item id "${item.id}"`,
            path: ["sections", sIdx, "items", iIdx, "id"],
          });
        }
        itemIds.add(item.id);
      });
    });
  });

export const MenuSpotlightStepSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
});

export const MenuSpotlightChoiceGroupSchema = z.object({
  label: z.string().min(1),
  options: z.array(z.string().min(1)).min(1),
});

export const MenuSpotlightSchema = z.object({
  id: z.string().min(1),
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  price: z.number().positive().optional(),
  subtitle: z.string().min(1).optional(),
  description: z.string().min(1),
  steps: z.array(MenuSpotlightStepSchema).optional(),
  choiceGroups: z.array(MenuSpotlightChoiceGroupSchema).optional(),
  href: z.string().min(1).optional(),
});

export const MenuMetaFileSchema = z.object({
  pageCopy: z.object({
    eyebrowLeft: z.string().min(1),
    eyebrowRight: z.string().min(1),
    discoveryTagline: z.string().min(1),
    intro: z.string().min(1),
  }),
  navLabels: z.record(z.string(), z.string().min(1)),
  spotlights: z.array(MenuSpotlightSchema),
});

export const SpecialsFileSchema = z.object({
  featuredSpecialIds: z.array(z.string().min(1)).min(1).max(8),
});

const DaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

const SessionSchema = z.object({
  open: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM 24h"),
  close: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "HH:MM 24h"),
});

const HoursDaySchema = z.object({
  sessions: z.array(SessionSchema),
  highlight: z.boolean().optional(),
});

export const RestaurantFileSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  tagline: z.string().min(1),
  positioning: z.string().min(1),
  cuisine: z.array(z.string().min(1)).min(1),
  priceRange: z.string().min(1),
  address: z.object({
    street: z.string().min(1),
    suburb: z.string().min(1),
    state: z.string().min(1),
    postcode: z.string().min(1),
    country: z.string().length(2),
    full: z.string().min(1),
  }),
  geo: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  phone: z.object({
    display: z.string().min(1),
    tel: z.string().regex(/^\+?[0-9]{6,15}$/),
  }),
  altMobile: z.object({
    display: z.string().min(1),
    tel: z.string().regex(/^\+?[0-9]{6,15}$/),
  }),
  email: z.string().email(),
  whatsapp: z.object({
    number: z.string().regex(/^[0-9]{6,15}$/),
    joinMessage: z.string().min(1),
    bookingMessage: z.string().min(1),
    consentCopy: z.string().min(1),
  }),
  socials: z.object({
    facebook: z.string().url(),
    instagram: z.string().url(),
  }),
  hours: z.record(DaySchema, HoursDaySchema),
  policies: z.object({
    bookingOnly: z.string().min(1),
    lastOrders: z.string().min(1),
    sitting: z.string().min(1),
  }),
  findingUs: z.object({
    headline: z.string().min(1),
    blurb: z.string().min(1),
    parkingNote: z.string().min(1),
  }),
});

export const ReviewSchema = z.object({
  quote: z.string().min(1).max(600),
  author: z.string().min(1),
  source: z.string().min(1),
});

export const ReviewsFileSchema = z.object({
  reviews: z.array(ReviewSchema),
});

export const CopyFileSchema = z.object({
  kizhiPorottaStory: z.string().min(1),
  chattiChoruStory: z.string().min(1),
  aboutParagraph: z.string().min(1),
  marqueeDishes: z.array(z.string().min(1)).min(1),
  cateringCategories: z.array(
    z.object({
      title: z.string().min(1),
      blurb: z.string().min(1),
    }),
  ),
});

export const HomeHeroSlideSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "lowercase-kebab-case id"),
  theme: z.enum(["light", "dark"]),
  heroWord: z.string().min(1).max(30),
  menuItemId: z.string().min(1),
  image: z.string().regex(/^\/images\/.+/, "must be a /images/... path"),
});

export const HomeHeroFileSchema = z.object({
  slides: z.array(HomeHeroSlideSchema).min(1).max(6),
});

const ShowcaseImagePathSchema = z.string().regex(/^\/images\/.+/, "must be a /images/... path");

export const HomeShowcaseFileSchema = z.object({
  signatureDishes: z.object({
    "kizhi-porotta": ShowcaseImagePathSchema,
    "meen-pollichathu": ShowcaseImagePathSchema,
    "thalassery-biryani": ShowcaseImagePathSchema,
    "kerala-fish-curry": ShowcaseImagePathSchema,
    "fish-tikka": ShowcaseImagePathSchema,
  }),
  mangoSlides: z.object({
    "chatti-choru": ShowcaseImagePathSchema,
    "kappa-biryani": ShowcaseImagePathSchema,
    "thalassery-biryani": ShowcaseImagePathSchema,
    avial: ShowcaseImagePathSchema,
  }),
});

export type MenuFile = z.infer<typeof MenuFileSchema>;
export type MenuMetaFile = z.infer<typeof MenuMetaFileSchema>;
export type SpecialsFile = z.infer<typeof SpecialsFileSchema>;
export type RestaurantFile = z.infer<typeof RestaurantFileSchema>;
export type ReviewsFile = z.infer<typeof ReviewsFileSchema>;
export type CopyFile = z.infer<typeof CopyFileSchema>;
export type HomeHeroFile = z.infer<typeof HomeHeroFileSchema>;
export type HomeHeroSlide = z.infer<typeof HomeHeroSlideSchema>;
export type HomeShowcaseFile = z.infer<typeof HomeShowcaseFileSchema>;

export const CONTENT_SCHEMAS = {
  menu: MenuFileSchema,
  "menu-meta": MenuMetaFileSchema,
  specials: SpecialsFileSchema,
  restaurant: RestaurantFileSchema,
  reviews: ReviewsFileSchema,
  copy: CopyFileSchema,
  "home-hero": HomeHeroFileSchema,
  "home-showcase": HomeShowcaseFileSchema,
} as const;

export type ContentKey = keyof typeof CONTENT_SCHEMAS;

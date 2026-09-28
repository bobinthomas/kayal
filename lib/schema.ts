import { restaurant, dayOrder } from "@/data/restaurant";
import { menuSections } from "@/data/menu";
import type { BlogPost } from "@/lib/content/schemas";

const dayToSchema: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function buildOpeningHours() {
  const specs: object[] = [];
  for (const day of dayOrder) {
    for (const session of restaurant.hours[day].sessions) {
      specs.push({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayToSchema[day],
        opens: session.open,
        closes: session.close,
      });
    }
  }
  return specs;
}

export function buildRestaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${restaurant.url}/#restaurant`,
    name: restaurant.name,
    // Real interior photo, not the branded/text OG card — schema.org Restaurant
    // "image" is meant to show the place itself.
    image: `${restaurant.url}/images/home-figma/kayal-restaurant.jpg`,
    // Current brand mark (wired in 2026-08-22), not the "legacy" pre-rebuild logo.
    logo: `${restaurant.url}/apple-icon.png`,
    url: restaurant.url,
    telephone: restaurant.phone.tel,
    email: restaurant.email,
    currenciesAccepted: "AUD",
    servesCuisine: [...restaurant.cuisine],
    priceRange: restaurant.priceRange,
    acceptsReservations: "True",
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.suburb,
      addressRegion: restaurant.address.state,
      postalCode: restaurant.address.postcode,
      addressCountry: restaurant.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: restaurant.geo.latitude,
      longitude: restaurant.geo.longitude,
    },
    openingHoursSpecification: buildOpeningHours(),
    sameAs: [restaurant.socials.facebook, restaurant.socials.instagram],
    hasMenu: `${restaurant.url}/menu/`,
  };
}

/** Service entity for /catering/ — references the Restaurant by @id rather
 * than redeclaring the business, so Google doesn't read it as a second org. */
export function buildCateringServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Kerala catering and event buffets",
    provider: { "@id": `${restaurant.url}/#restaurant` },
    areaServed: { "@type": "City", name: "Sydney" },
    url: `${restaurant.url}/catering/`,
  };
}

export function buildMenuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${restaurant.url}/menu/#menu`,
    name: `${restaurant.name} Menu`,
    inLanguage: "en-AU",
    hasMenuSection: menuSections.map((section) => ({
      "@type": "MenuSection",
      name: section.title,
      description: section.blurb,
      hasMenuItem: section.items.map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        ...(item.desc ? { description: item.desc } : {}),
        ...(item.price != null
          ? {
              offers: {
                "@type": "Offer",
                price: item.price.toFixed(2),
                priceCurrency: "AUD",
              },
            }
          : {}),
      })),
    })),
  };
}

export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** One blog post. Author/publisher reference the Restaurant by @id (see
 * buildCateringServiceSchema) rather than redeclaring the business. */
export function buildBlogPostingSchema(post: BlogPost) {
  const url = `${restaurant.url}/blog/${post.slug}/`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.seoDescription ?? post.excerpt,
    image: `${restaurant.url}${post.image}`,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    articleSection: post.category,
    inLanguage: "en-AU",
    author: { "@id": `${restaurant.url}/#restaurant` },
    publisher: { "@id": `${restaurant.url}/#restaurant` },
  };
}

export function buildBlogSchema(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${restaurant.url}/blog/#blog`,
    name: `${restaurant.name} — Notes on Naadan Cooking`,
    url: `${restaurant.url}/blog/`,
    inLanguage: "en-AU",
    publisher: { "@id": `${restaurant.url}/#restaurant` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${restaurant.url}/blog/${post.slug}/`,
      datePublished: post.publishedAt,
    })),
  };
}

export function buildBreadcrumbSchema(
  crumbs: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${restaurant.url}${crumb.path}`,
    })),
  };
}

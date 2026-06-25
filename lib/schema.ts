import { restaurant, dayOrder } from "@/data/restaurant";
import { menuSections } from "@/data/menu";

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
    image: `${restaurant.url}/og/home.png`,
    url: restaurant.url,
    telephone: restaurant.phone.tel,
    email: restaurant.email,
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

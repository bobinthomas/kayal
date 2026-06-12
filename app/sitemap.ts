import type { MetadataRoute } from "next";
import { restaurant } from "@/data/restaurant";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/menu/", priority: 0.9 },
    { path: "/specials/", priority: 0.9 },
    { path: "/catering/", priority: 0.7 },
    { path: "/about/", priority: 0.6 },
    { path: "/contact/", priority: 0.8 },
    { path: "/privacy/", priority: 0.2 },
  ];
  return routes.map(({ path, priority }) => ({
    url: `${restaurant.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}

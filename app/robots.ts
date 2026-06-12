import type { MetadataRoute } from "next";
import { restaurant } from "@/data/restaurant";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${restaurant.url}/sitemap.xml`,
  };
}

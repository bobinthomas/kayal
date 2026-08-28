/**
 * About page copy and photos. Content lives in content/about.json — edit via
 * /admin or the file directly, never hardcode this copy in app/about/page.tsx.
 */
import aboutJson from "@/content/about.json";
import type { AboutFile } from "@/lib/content/schemas";

export const about: AboutFile = aboutJson;

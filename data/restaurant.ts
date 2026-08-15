/**
 * Single source of truth for NAP (name / address / phone), hours, policies
 * and socials. NEVER hard-code these in components.
 *
 * Content lives in content/restaurant.json — edit via /admin or the file
 * directly. `url` and `maps.*` are deliberately NOT stored there: `url` is
 * the canonical domain baked into JSON-LD/sitemap/OG tags and shouldn't be
 * editable without a matching DNS change, and `maps.*` is derived from
 * `address.full` so it can never drift out of sync with the address.
 */
import restaurantJson from "@/content/restaurant.json";

export type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Session = { open: string; close: string };
export type Hours = Record<
  Day,
  { sessions: Session[]; highlight?: boolean }
>;

const CANONICAL_URL = "https://kayal.com.au";

export const restaurant = {
  ...restaurantJson,
  hours: restaurantJson.hours as Hours,

  url: CANONICAL_URL,

  maps: {
    directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurantJson.address.full)}`,
    placeUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurantJson.name} ${restaurantJson.address.full}`)}`,
  },
};

export const dayLabels: Record<Day, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const dayOrder: Day[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour} ${period}` : `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatSessions(sessions: readonly Session[]): string {
  return sessions
    .map((s) => `${formatTime(s.open)} – ${formatTime(s.close)}`)
    .join(" & ");
}

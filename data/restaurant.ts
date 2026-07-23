/**
 * Single source of truth for NAP (name / address / phone), hours, policies
 * and socials. NEVER hard-code these in components.
 *
 * ⛔ OWNER TO CONFIRM (PRD §11): current hours, WhatsApp number,
 * booking-policy wording, alt-mobile usage.
 */

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

export const restaurant = {
  name: "Kayal Foods",
  legalName: "Kayal Foods",
  tagline: "A taste of God's Own Country",
  positioning: "Kerala's village table, served proudly in Sydney.",
  cuisine: ["South Indian", "Kerala", "Indian"],
  priceRange: "$$",

  address: {
    street: "128 Nuwarra Road",
    suburb: "Moorebank",
    state: "NSW",
    postcode: "2170",
    country: "AU",
    full: "128 Nuwarra Road, Moorebank NSW 2170",
  },

  geo: {
    // Approximate coordinates for 128 Nuwarra Road, Moorebank NSW 2170.
    latitude: -33.9468,
    longitude: 150.9442,
  },

  phone: {
    display: "(02) 9734 9634",
    tel: "+61297349634",
  },
  // ◻ Owner to confirm whether this stays public (PRD §11.9).
  altMobile: {
    display: "+61 400 250 111",
    tel: "+61400250111",
  },

  email: "hello@kayal.com.au",

  whatsapp: {
    // ⛔ Confirm number before launch (PRD §11.3).
    number: "61400250111",
    joinMessage: "Hi Kayal! I'd like to join the offers group.",
    bookingMessage: "Hi Kayal! I'd like to book a table.",
    consentCopy:
      "We will be adding your number to the WhatsApp Group. You will be receiving our periodic offers via this.",
  },

  socials: {
    facebook: "https://www.facebook.com/Kayal-Foods-111280287304578",
    instagram: "https://www.instagram.com/kayalcatering",
  },

  url: "https://kayal.com.au",

  maps: {
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=128+Nuwarra+Road,+Moorebank+NSW+2170",
    placeUrl:
      "https://www.google.com/maps/search/?api=1&query=Kayal+Foods+128+Nuwarra+Road+Moorebank+NSW+2170",
  },

  // ⛔ Owner must confirm — third-party listings disagree (PRD §11.1).
  hours: {
    monday: { sessions: [{ open: "12:00", close: "15:00" }, { open: "17:00", close: "22:00" }] },
    tuesday: { sessions: [{ open: "12:00", close: "15:00" }, { open: "17:00", close: "22:00" }] },
    wednesday: { sessions: [{ open: "12:00", close: "15:00" }, { open: "17:00", close: "22:00" }] },
    thursday: { sessions: [{ open: "12:00", close: "15:00" }, { open: "17:00", close: "22:00" }] },
    friday: { sessions: [{ open: "12:00", close: "15:00" }, { open: "17:00", close: "22:00" }] },
    saturday: { sessions: [{ open: "11:00", close: "15:00" }, { open: "17:00", close: "22:00" }], highlight: true },
    sunday: { sessions: [{ open: "11:00", close: "15:00" }, { open: "17:00", close: "22:00" }], highlight: true },
  } as Hours,

  policies: {
    bookingOnly: "Dine-in is by booking only — call or WhatsApp us and we'll keep your table ready.",
    lastOrders: "Kitchen takes last orders 45 minutes before closing, so every dish leaves the pot at its best.",
    sitting:
      "Tables are yours for a relaxed 90 minutes — it keeps the wait fair for the next family at the door.",
  },

  findingUs: {
    headline: "No big sign. Just a white house.",
    blurb:
      "We're the white house on Nuwarra Road — look for the warm lights and the smell of curry leaves. On-site parking out front (around 5 spots), with street parking nearby.",
    parkingNote: "On-site parking for about 5 cars, plus street parking on Nuwarra Road.",
  },
} as const;

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

/**
 * Single source of truth for Onam Sadhya 2026 dates, packages and pricing.
 * Mirrors data/restaurant.ts's convention in the main kayal repo — never
 * hard-code dates/prices in components or API handlers, import from here.
 *
 * Imported by both the client wizard (live price display) and the
 * submit-booking Pages Function (server-side price recompute), since it's
 * plain TS with no client-only APIs.
 */

export type ServiceType = "dine_in" | "takeaway";
export type PaymentMethod = "whatsapp_cash" | "card";
export type PackageSize = 2 | 4 | 10 | 20;

export const packageSizes: PackageSize[] = [2, 4, 10, 20];

export const onamEvent = {
  name: "Onam Sadhya 2026",
  timeWindow: { open: "12:00", close: "15:00" },

  // 'YYYY-MM-DD'
  dineInDates: ["2026-08-16", "2026-08-22", "2026-08-23", "2026-08-29", "2026-08-30"],
  takeawayDates: [
    "2026-08-15",
    "2026-08-16",
    "2026-08-22",
    "2026-08-23",
    "2026-08-29",
    "2026-08-30",
  ],

  // All prices in cents.
  dineInPricePerHeadCents: 4000, // flat $40/head, regardless of payment method

  takeawayPackages: {
    2: { whatsapp_cash: 6000, card: 7500 },
    4: { whatsapp_cash: 10000, card: 15000 },
    10: { whatsapp_cash: 25000, card: 30000 },
    20: { whatsapp_cash: 50000, card: 60000 },
  } as Record<PackageSize, Record<PaymentMethod, number>>,

  contact: {
    phone: { display: "(02) 9734 9634", tel: "+61297349634" },
    whatsapp: { number: "61405250111" },
  },
} as const;

export function datesForService(serviceType: ServiceType): string[] {
  return serviceType === "dine_in" ? [...onamEvent.dineInDates] : [...onamEvent.takeawayDates];
}

export function isValidDateForService(serviceType: ServiceType, eventDate: string): boolean {
  return datesForService(serviceType).includes(eventDate);
}

export function formatEventDate(eventDate: string): string {
  // Parse as a local calendar date (not UTC-shifted) purely for display.
  const [year, month, day] = eventDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function computePriceCents(input: {
  serviceType: ServiceType;
  guests?: number;
  packageSize?: PackageSize;
  paymentMethod: PaymentMethod;
}): number {
  if (input.serviceType === "dine_in") {
    const guests = input.guests ?? 0;
    return guests * onamEvent.dineInPricePerHeadCents;
  }
  const packageSize = input.packageSize;
  if (!packageSize || !(packageSize in onamEvent.takeawayPackages)) return 0;
  return onamEvent.takeawayPackages[packageSize][input.paymentMethod];
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

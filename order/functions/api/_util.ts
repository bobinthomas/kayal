/**
 * Shared helpers for the order API. Leading underscore excludes this file
 * from Cloudflare Pages Functions routing (it's a helper module, not a route).
 */
export function json(data: object, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function money(cents: number): string {
  return `AU$${(cents / 100).toFixed(2)}`;
}

export function randomToken(bytes = 16): string {
  const buf = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Order lifecycle (Sprint 0: hard-coded; Sprint 1 moves this to D1 tables).
export const STATUSES = [
  "pending",
  "confirmed",
  "payment_received",
  "payment_failed",
  "ready",
  "completed",
  "declined",
] as const;
export type OrderStatus = (typeof STATUSES)[number];

export const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["confirmed", "declined"],
  confirmed: ["payment_received", "payment_failed", "declined"],
  payment_failed: ["payment_received", "declined"],
  payment_received: ["ready"],
  ready: ["completed"],
  completed: [],
  declined: [],
};

export interface OrderRow {
  id: string;
  access_token: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  fulfilment: "delivery" | "pickup";
  address: string | null;
  zone_id: string | null;
  notes: string | null;
  items_json: string;
  subtotal_cents: number;
  fee_cents: number;
  tax_cents: number;
  total_cents: number;
  discount_cents: number;
  whatsapp_member: number;
  whatsapp_added: number;
  status: OrderStatus;
  /** Customer's order as placed, kept once the admin confirms an adjusted version. */
  original_items_json: string | null;
  original_total_cents: number | null;
  adjustment_note: string | null;
  confirmed_at: string | null;
}

export interface OrderItem {
  id: string;
  name: string;
  qty: number;
  unit_cents: number;
}

// Delivery fee for an area: flat fee, waived once the subtotal reaches the
// area's free-delivery threshold (0 = never free).
export function deliveryFee(
  zone: { fee_cents: number; free_over_cents: number },
  subtotalCents: number,
): number {
  if (zone.free_over_cents > 0 && subtotalCents >= zone.free_over_cents) return 0;
  return zone.fee_cents;
}

// Australian numbers to one form: "+61 400 000 000", "0400-000-000" -> "0400000000".
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("61") ? `0${digits.slice(2)}` : digits;
}

export interface WhatsAppSettings {
  discountEnabled: boolean;
  discountPercent: number;
}
export const WHATSAPP_DEFAULTS: WhatsAppSettings = { discountEnabled: false, discountPercent: 0 };

// Member discount on the item subtotal (not the delivery fee).
export function memberDiscount(s: WhatsAppSettings, member: boolean, subtotalCents: number): number {
  if (!member || !s.discountEnabled || s.discountPercent <= 0) return 0;
  return Math.round((subtotalCents * Math.min(s.discountPercent, 50)) / 100);
}

// Customer welcome screen (dashboard → Settings → Home screen).
export interface HomeSettings {
  badge: string;
  headline: string;
  text: string;
  buttonLabel: string;
  imageUrl: string;
}
export const HOME_DEFAULTS: HomeSettings = {
  badge: "Kayal Foods · Sydney",
  headline: "Kerala food, cooked fresh & delivered",
  text: "Order from our menu, pay by bank transfer, and we'll bring it to your door in Sydney's north-west.",
  buttonLabel: "Order Now",
  imageUrl: "/images/dishes/thalassery-biryani.webp",
};

// Quantities can be fractional after a freshness adjustment (2 -> 2.2 kg).
export const lineTotal = (i: OrderItem) => Math.round(i.unit_cents * i.qty);

/** Custom items added in the admin are Groceries; everything else is Food. */
export const isGrocery = (id: string) => id.startsWith("custom-");

/**
 * Member discount (on food), GST and total for a given food subtotal and
 * delivery fee. Shared by checkout (submit-order) and the admin's final
 * invoice (confirm-order) so both price an order the same way.
 */
export async function priceOrder(db: D1Database, subtotal: number, fee: number, whatsappMember: boolean) {
  const [wa, tax] = await Promise.all([
    getSetting(db, "whatsapp", WHATSAPP_DEFAULTS),
    getSetting(db, "tax", { rateBps: 0, inclusive: false }),
  ]);
  const discount = memberDiscount(wa, whatsappMember, subtotal);
  const taxable = subtotal - discount + fee;
  const taxCents = tax.inclusive ? 0 : Math.round((taxable * tax.rateBps) / 10000);
  return { discount, tax: taxCents, total: taxable + taxCents };
}

export async function getSetting<T>(db: D1Database, key: string, fallback: T): Promise<T> {
  const row = await db
    .prepare(`SELECT value_json FROM settings WHERE key = ?`)
    .bind(key)
    .first<{ value_json: string }>();
  if (!row) return fallback;
  try {
    return JSON.parse(row.value_json) as T;
  } catch {
    return fallback;
  }
}

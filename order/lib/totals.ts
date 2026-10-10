// Client-side order totals for the cart and checkout preview. Mirrors the
// maths in functions/api/submit-order.ts; the server recomputes and is
// authoritative.
import { deliveryFee, isGrocery, memberDiscount, type MenuData, type MenuItem, type Zone } from "@/lib/api";

export type Location = { fulfilment: "delivery" | "pickup"; zoneId: string };
export type CartLine = { item: MenuItem; qty: number };

export type Totals = {
  subtotal: number;
  foodSubtotal: number;
  grocerySubtotal: number;
  discount: number;
  fee: number;
  tax: number;
  total: number;
  zone: Zone | undefined;
  /** Cents still needed for free delivery (0 when unlocked or not applicable). */
  toFree: number;
  freeUnlocked: boolean;
};

export function computeTotals(menu: MenuData, lines: CartLine[], loc: Location, member = false): Totals {
  const subtotal = lines.reduce((s, l) => s + l.item.price_cents * l.qty, 0);
  const grocerySubtotal = lines.reduce((s, l) => s + (isGrocery(l.item.id) ? l.item.price_cents * l.qty : 0), 0);
  const discount = memberDiscount(menu.whatsapp, member, subtotal);
  const zone = loc.fulfilment === "delivery" ? menu.zones.find((z) => z.id === loc.zoneId) : undefined;
  const fee = zone ? deliveryFee(zone, subtotal) : 0;
  const taxable = subtotal - discount + fee;
  const tax = menu.tax.inclusive ? 0 : Math.round((taxable * menu.tax.rateBps) / 10000);
  const hasThreshold = !!zone && zone.free_over_cents > 0;
  return {
    subtotal,
    foodSubtotal: subtotal - grocerySubtotal,
    grocerySubtotal,
    discount,
    fee,
    tax,
    total: taxable + tax,
    zone,
    toFree: hasThreshold && fee > 0 ? zone!.free_over_cents - subtotal : 0,
    freeUnlocked: hasThreshold && fee === 0 && subtotal > 0,
  };
}

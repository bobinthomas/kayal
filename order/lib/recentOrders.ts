// Orders placed from this browser, so customers can find them again from the
// Orders tab (there are no customer accounts — each order has a private link).
export type RecentOrder = { id: string; token: string; placedAt: string; total: number };

const KEY = "kayal-order-recent";

export function readRecentOrders(): RecentOrder[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RecentOrder[]) : [];
  } catch {
    return [];
  }
}

export function saveRecentOrder(o: RecentOrder) {
  try {
    const list = [o, ...readRecentOrders().filter((x) => x.id !== o.id)].slice(0, 10);
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable — the order link is still in the invoice email */
  }
}

export const orderHref = (o: { id: string; token: string }) =>
  `/order/?id=${encodeURIComponent(o.id)}&t=${encodeURIComponent(o.token)}`;

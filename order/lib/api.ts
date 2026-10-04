export const DASHBOARD_PASSWORD_KEY = "kayal-order-dashboard-password";

export type Category = { id: string; name: string; blurb: string | null };
export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  tags: string[];
  image_url: string | null;
};
export type Zone = {
  id: string;
  name: string;
  areas: string | null;
  fee_cents: number;
  free_over_cents: number;
  eta_minutes: number | null;
};

// Mirrors deliveryFee() in functions/api/_util.ts (server is authoritative).
export function deliveryFee(zone: Zone, subtotalCents: number): number {
  if (zone.free_over_cents > 0 && subtotalCents >= zone.free_over_cents) return 0;
  return zone.fee_cents;
}

export type WhatsAppSettings = { discountEnabled: boolean; discountPercent: number };

// Mirrors memberDiscount() in functions/api/_util.ts (server is authoritative).
export function memberDiscount(s: WhatsAppSettings, member: boolean, subtotalCents: number): number {
  if (!member || !s.discountEnabled || s.discountPercent <= 0) return 0;
  return Math.round((subtotalCents * Math.min(s.discountPercent, 50)) / 100);
}

// Mirrors normalizePhone() in functions/api/_util.ts.
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("61") ? `0${digits.slice(2)}` : digits;
}

// wa.me needs the international form without "+": 0400… -> 61400…
export function whatsappLink(phone: string, text: string): string {
  const local = normalizePhone(phone);
  const intl = local.startsWith("0") ? `61${local.slice(1)}` : local;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

export type MenuData = {
  categories: Category[];
  items: MenuItem[];
  zones: Zone[];
  delivery: { pickupEnabled: boolean; deliveryEnabled: boolean };
  whatsapp: WhatsAppSettings;
  tax: { rateBps: number; inclusive: boolean };
  restaurant: { name: string; phone: string };
  home: HomeScreen;
};

export type HomeScreen = { badge: string; headline: string; text: string; buttonLabel: string; imageUrl: string };

export type OrderItem = { id: string; name: string; qty: number; unit_cents: number };
export type Proof = {
  id?: string;
  order_id?: string;
  txn_ref: string | null;
  status: "pending" | "verified" | "rejected" | "clarify";
  admin_note: string | null;
  created_at: string;
  has_file: number;
};
export type PaymentInfo = {
  instructions: string;
  bank: { accountName: string; bsb: string; accountNumber: string };
  payid?: string;
};
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "payment_received"
  | "payment_failed"
  | "ready"
  | "completed"
  | "declined";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Awaiting confirmation",
  confirmed: "Confirmed — awaiting payment",
  payment_received: "Payment verified — preparing",
  payment_failed: "Payment needs attention",
  ready: "Ready",
  completed: "Completed",
  declined: "Declined",
};

export function money(cents: number): string {
  return `AU$${(cents / 100).toFixed(2)}`;
}

type Result<T> = ({ ok: true } & T) | { ok: false; error: string };

async function parse<T>(res: Response): Promise<Result<T>> {
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok || !data.ok) return { ok: false, error: data.error || `HTTP ${res.status}` };
  return data as Result<T>;
}

export async function fetchMenu(): Promise<Result<MenuData>> {
  return parse(await fetch("/api/menu"));
}

export type OrderSubmission = {
  website?: string;
  idempotencyKey: string;
  name: string;
  phone: string;
  email?: string;
  fulfilment: "delivery" | "pickup";
  address?: string;
  zoneId?: string;
  notes?: string;
  whatsappMember: boolean;
  items: { id: string; qty: number }[];
};

export async function submitOrder(p: OrderSubmission): Promise<Result<{ id: string; token: string }>> {
  return parse(
    await fetch("/api/submit-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    }),
  );
}

export type OrderView = {
  id: string;
  created_at: string;
  customer_name: string;
  fulfilment: "delivery" | "pickup";
  address: string | null;
  items: OrderItem[];
  subtotal_cents: number;
  discount_cents: number;
  fee_cents: number;
  tax_cents: number;
  total_cents: number;
  status: OrderStatus;
};

export async function fetchOrder(
  id: string,
  token: string,
): Promise<Result<{ order: OrderView; proofs: Proof[]; payment: PaymentInfo }>> {
  return parse(
    await fetch(`/api/order-status?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`),
  );
}

export async function submitProof(
  orderId: string,
  token: string,
  file: File | null,
  txnRef: string,
): Promise<Result<object>> {
  const form = new FormData();
  form.append("orderId", orderId);
  form.append("token", token);
  if (file) form.append("file", file);
  if (txnRef) form.append("txnRef", txnRef);
  return parse(await fetch("/api/upload-receipt", { method: "POST", body: form }));
}

// ---- admin ----

function adminHeaders(): HeadersInit {
  const password =
    typeof window !== "undefined" ? sessionStorage.getItem(DASHBOARD_PASSWORD_KEY) || "" : "";
  return { "X-Dashboard-Password": password };
}

export type AdminOrder = {
  id: string;
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
  discount_cents: number;
  fee_cents: number;
  tax_cents: number;
  total_cents: number;
  status: OrderStatus;
  whatsapp_member: number;
  whatsapp_added: number;
};

export async function fetchAdminOrders(): Promise<
  { ok: true; orders: AdminOrder[]; proofs: Proof[] } | { ok: false; status: number }
> {
  const res = await fetch("/api/list-orders", { headers: adminHeaders() });
  if (!res.ok) return { ok: false, status: res.status };
  const data = (await res.json()) as { orders: AdminOrder[]; proofs: Proof[] };
  return { ok: true, orders: data.orders, proofs: data.proofs };
}

async function adminPost(path: string, body: object): Promise<Result<object>> {
  return parse(
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...adminHeaders() },
      body: JSON.stringify(body),
    }),
  );
}

export const setOrderStatus = (id: string, status: OrderStatus) =>
  adminPost("/api/update-order-status", { id, status });

export const verifyPayment = (proofId: string, action: "verify" | "reject" | "clarify", note?: string) =>
  adminPost("/api/verify-payment", { proofId, action, note });

export const markWhatsAppAdded = (id: string, added = true) =>
  adminPost("/api/whatsapp-added", { id, added });

export type AdminMenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  tags: string[];
  image_url: string | null;
  available: number;
  listed: number;
};

export async function fetchAdminMenu(): Promise<
  Result<{ categories: { id: string; name: string }[]; items: AdminMenuItem[] }>
> {
  return parse(await fetch("/api/admin-menu", { headers: adminHeaders() }));
}

export const menuAction = (body: {
  action: "list" | "unlist" | "availability" | "image" | "create" | "update" | "delete";
  id?: string;
  available?: boolean;
  name?: string;
  description?: string;
  priceCents?: number;
  categoryId?: string;
  newCategory?: string;
  tags?: string[];
  imageUrl?: string;
}) => adminPost("/api/admin-menu", body);

// ---- admin settings & delivery areas ----

export type Settings = {
  restaurant: { name: string; phone: string; email: string };
  payment: PaymentInfo;
  tax: { rateBps: number; inclusive: boolean };
  whatsapp: WhatsAppSettings;
  home: HomeScreen;
  delivery: { pickupEnabled: boolean; deliveryEnabled: boolean };
};

export async function fetchSettings(): Promise<Result<{ settings: Settings }>> {
  return parse(await fetch("/api/admin-settings", { headers: adminHeaders() }));
}

export const saveSetting = <K extends keyof Settings>(key: K, value: Settings[K]) =>
  adminPost("/api/admin-settings", { key, value });

export type AdminZone = Zone & { active: number };

export async function fetchZones(): Promise<Result<{ zones: AdminZone[] }>> {
  return parse(await fetch("/api/admin-zones", { headers: adminHeaders() }));
}

export const zoneAction = (body: {
  action: "create" | "update" | "delete";
  id?: string;
  name?: string;
  areas?: string;
  feeCents?: number;
  freeOverCents?: number;
  etaMinutes?: number | null;
  active?: boolean;
}) => adminPost("/api/admin-zones", body);

// Opens a proof file in a new tab. Fetched with the auth header (R2 files
// aren't public), then handed to the browser as a blob URL.
export async function openReceipt(proofId: string): Promise<boolean> {
  const res = await fetch(`/api/receipt?proof=${encodeURIComponent(proofId)}`, {
    headers: adminHeaders(),
  });
  if (!res.ok) return false;
  const url = URL.createObjectURL(await res.blob());
  window.open(url, "_blank");
  return true;
}

// Shrinks a photo in the browser (max 1200px, WebP) so phone photos of
// several MB upload quickly, then stores it via /api/admin-upload-image.
async function shrinkImage(file: File, maxSide = 1200): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't process photo."))), "image/webp", 0.82),
  );
}

export async function uploadMenuImage(file: File): Promise<Result<{ url: string }>> {
  if (!file.type.startsWith("image/")) return { ok: false, error: "Choose a photo (JPG, PNG or WebP)." };
  let blob: Blob;
  try {
    blob = await shrinkImage(file);
  } catch {
    return { ok: false, error: "Couldn't read that photo — try a JPG or PNG." };
  }
  const form = new FormData();
  form.append("file", blob, "photo.webp");
  return parse(await fetch("/api/admin-upload-image", { method: "POST", headers: adminHeaders(), body: form }));
}

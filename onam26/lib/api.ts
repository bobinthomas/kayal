import type { PackageSize, PaymentMethod, ServiceType } from "@/data/onam-event";

export const DASHBOARD_PASSWORD_KEY = "onam-dashboard-password";

export type BookingSubmission = {
  website?: string; // honeypot
  serviceType: ServiceType;
  eventDate: string;
  guests?: number;
  packageSize?: PackageSize;
  paymentMethod: PaymentMethod;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
};

// Shape of a row returned by /api/list-bookings — mirrors the D1 `bookings`
// table columns (snake_case), not the camelCase BookingSubmission payload.
export type Booking = {
  id: string;
  created_at: string;
  updated_at: string;
  service_type: ServiceType;
  event_date: string;
  guests: number | null;
  package_size: PackageSize | null;
  payment_method: PaymentMethod;
  price_total: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
  status: "pending" | "confirmed" | "declined";
};

export async function submitBooking(
  payload: BookingSubmission,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const res = await fetch("/api/submit-booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { ok: boolean; id?: string; error?: string };
  if (!res.ok || !data.ok) {
    return { ok: false, error: data.error || `HTTP ${res.status}` };
  }
  return { ok: true, id: data.id! };
}

function dashboardHeaders(): HeadersInit {
  const password =
    typeof window !== "undefined" ? sessionStorage.getItem(DASHBOARD_PASSWORD_KEY) || "" : "";
  return { "X-Dashboard-Password": password };
}

export async function fetchBookings(): Promise<
  { ok: true; bookings: Booking[] } | { ok: false; status: number }
> {
  const res = await fetch("/api/list-bookings", { headers: dashboardHeaders() });
  if (!res.ok) return { ok: false, status: res.status };
  const data = (await res.json()) as { ok: boolean; bookings: Booking[] };
  return { ok: true, bookings: data.bookings };
}

export async function updateBookingStatus(
  id: string,
  status: "confirmed" | "declined",
): Promise<boolean> {
  const res = await fetch("/api/update-booking-status", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...dashboardHeaders() },
    body: JSON.stringify({ id, status }),
  });
  return res.ok;
}

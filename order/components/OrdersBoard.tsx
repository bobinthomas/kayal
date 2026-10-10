"use client";

import { Fragment, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import ReviewOrder from "@/components/ReviewOrder";
import {
  confirmOrder,
  fetchAdminMenu,
  fetchAdminOrders,
  fetchSettings,
  fetchZones,
  isGrocery,
  markWhatsAppAdded,
  lineTotal,
  money,
  normalizePhone,
  qtyText,
  openReceipt,
  setOrderStatus,
  verifyPayment,
  whatsappLink,
  type AdminMenuItem,
  type AdminOrder,
  type OrderItem,
  type OrderStatus,
  type Proof,
  type Settings,
} from "@/lib/api";

/**
 * Admin orders, organised by what needs doing:
 *   New → Payment → Kitchen → Done
 * Each order is a compact row; tap to open it and get one clear next step.
 */

type Bucket = "new" | "payment" | "kitchen" | "done";

const BUCKETS: { key: Bucket; label: string; statuses: OrderStatus[] }[] = [
  { key: "new", label: "New", statuses: ["pending"] },
  { key: "payment", label: "Payment", statuses: ["confirmed", "payment_failed"] },
  { key: "kitchen", label: "Kitchen", statuses: ["payment_received", "ready"] },
  { key: "done", label: "Done", statuses: ["completed", "declined"] },
];
const bucketOf = (s: OrderStatus) => BUCKETS.find((b) => b.statuses.includes(s))!.key;

const SHORT_STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  pending: { label: "New", tone: "bg-turmeric/30 text-night" },
  confirmed: { label: "Awaiting payment", tone: "bg-surface text-night/70" },
  payment_failed: { label: "Payment issue", tone: "bg-chilli/10 text-chilli" },
  payment_received: { label: "Paid · cooking", tone: "bg-brand-soft text-brand-dark" },
  ready: { label: "Ready", tone: "bg-brand text-white" },
  completed: { label: "Completed", tone: "bg-surface text-night/50" },
  declined: { label: "Declined", tone: "bg-surface text-night/40" },
};

function when(sqlUtc: string): string {
  const d = new Date(sqlUtc.replace(" ", "T") + "Z");
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const time = d.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" });
  const today = new Date();
  const yest = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return `Today ${time}`;
  if (d.toDateString() === yest.toDateString()) return `Yesterday ${time}`;
  return `${d.toLocaleDateString("en-AU", { day: "numeric", month: "short" })}, ${time}`;
}

const shortId = (id: string) => `#${id.slice(-5)}`;

export default function OrdersBoard() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [zones, setZones] = useState<Record<string, string>>({});
  // For "Review & confirm": price preview and dishes that can be added.
  const [pricing, setPricing] = useState<Pick<Settings, "tax" | "whatsapp"> | null>(null);
  const [menu, setMenu] = useState<AdminMenuItem[]>([]);
  const [bucket, setBucket] = useState<Bucket | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async () => {
    const r = await fetchAdminOrders();
    if (r.ok) {
      setOrders(r.orders);
      setProofs(r.proofs);
      setUpdatedAt(new Date());
    }
  }, []);

  useEffect(() => {
    const t0 = setTimeout(() => {
      load();
      fetchZones().then((r) => r.ok && setZones(Object.fromEntries(r.zones.map((z) => [z.id, z.name]))));
      fetchSettings().then((r) => r.ok && setPricing({ tax: r.settings.tax, whatsapp: r.settings.whatsapp }));
      fetchAdminMenu().then((r) => r.ok && setMenu(r.items));
    }, 0);
    const t = setInterval(load, 30000);
    return () => {
      clearTimeout(t0);
      clearInterval(t);
    };
  }, [load]);

  const act = useCallback(
    async (p: Promise<{ ok: boolean; error?: string }>) => {
      const r = await p;
      setMsg(r.ok ? null : (r.error ?? "That didn't work — try again."));
      await load();
      return r.ok;
    },
    [load],
  );

  // A customer only needs adding to the WhatsApp group once.
  const inGroup = useMemo(
    () => new Set(orders.filter((o) => o.whatsapp_member || o.whatsapp_added).map((o) => normalizePhone(o.customer_phone))),
    [orders],
  );

  const counts = useMemo(() => {
    const c: Record<Bucket, number> = { new: 0, payment: 0, kitchen: 0, done: 0 };
    orders.forEach((o) => c[bucketOf(o.status)]++);
    return c;
  }, [orders]);

  const pendingProof = useCallback(
    (orderId: string) => proofs.find((p) => p.order_id === orderId && p.status === "pending"),
    [proofs],
  );

  // Open on the first tab that has something to do.
  const activeBucket: Bucket =
    bucket ?? (counts.new ? "new" : counts.payment ? "payment" : counts.kitchen ? "kitchen" : "done");

  const q = query.trim().toLowerCase();
  const shown = orders.filter((o) =>
    q
      ? o.customer_name.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        normalizePhone(o.customer_phone).includes(normalizePhone(q) || "\u0000")
      : bucketOf(o.status) === activeBucket,
  );

  // Within Payment, receipts waiting to be checked come first.
  shown.sort((a, b) => Number(!!pendingProof(b.id)) - Number(!!pendingProof(a.id)));

  return (
    <section className="pb-16">
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-2xl font-bold text-night">Orders</h1>
        <button type="button" onClick={load} className="text-xs text-muted">
          {updatedAt ? `Updated ${updatedAt.toLocaleTimeString("en-AU", { hour: "numeric", minute: "2-digit" })} · Refresh` : "Loading…"}
        </button>
      </div>

      {/* 4 simple stages */}
      <div className="mt-4 grid grid-cols-4 gap-1 rounded-2xl bg-surface p-1" role="tablist">
        {BUCKETS.map((b) => {
          const active = !q && activeBucket === b.key;
          const urgent = (b.key === "new" || b.key === "payment") && counts[b.key] > 0;
          return (
            <button
              key={b.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setBucket(b.key);
                setQuery("");
                setOpen(null);
              }}
              className={`flex h-12 flex-col items-center justify-center rounded-xl text-[13px] font-semibold transition ${
                active ? "bg-white text-night shadow-sm" : "text-night/60"
              }`}
            >
              {b.label}
              <span
                className={`mt-0.5 rounded-full px-1.5 text-[11px] leading-4 ${
                  urgent ? "bg-brand text-white" : "text-night/40"
                }`}
              >
                {counts[b.key]}
              </span>
            </button>
          );
        })}
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search name, phone or order #"
        className="mt-3 h-11 w-full rounded-full bg-surface px-5 text-sm text-night placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30"
      />

      {msg && <p className="mt-3 rounded-2xl bg-chilli/10 px-4 py-2.5 text-sm font-medium text-chilli">{msg}</p>}

      <ul className="mt-4 space-y-2">
        {shown.map((o) => (
          <OrderRow
            key={o.id}
            order={o}
            zoneName={o.zone_id ? zones[o.zone_id] : undefined}
            proofs={proofs.filter((p) => p.order_id === o.id)}
            needsWhatsApp={!inGroup.has(normalizePhone(o.customer_phone))}
            open={open === o.id}
            showStatus={!!q || activeBucket !== "new"}
            onToggle={() => setOpen(open === o.id ? null : o.id)}
            act={act}
            onError={setMsg}
            pricing={pricing}
            menu={menu}
          />
        ))}
        {shown.length === 0 && (
          <li className="rounded-3xl bg-surface px-6 py-10 text-center text-sm text-muted">
            {q ? "No orders match." : EMPTY[activeBucket]}
          </li>
        )}
      </ul>
    </section>
  );
}

const EMPTY: Record<Bucket, string> = {
  new: "No new orders. New orders appear here — the list refreshes every 30 seconds.",
  payment: "No orders waiting on payment.",
  kitchen: "Nothing in the kitchen right now.",
  done: "Completed and declined orders will show here.",
};

function OrderRow({
  order: o,
  zoneName,
  proofs,
  needsWhatsApp,
  open,
  showStatus,
  onToggle,
  act,
  onError,
  pricing,
  menu,
}: {
  order: AdminOrder;
  pricing: Pick<Settings, "tax" | "whatsapp"> | null;
  menu: AdminMenuItem[];
  zoneName?: string;
  proofs: Proof[];
  needsWhatsApp: boolean;
  open: boolean;
  /** Hidden in the New tab, where every order has the same status. */
  showStatus: boolean;
  onToggle: () => void;
  act: (p: Promise<{ ok: boolean; error?: string }>) => Promise<boolean>;
  onError: (m: string | null) => void;
}) {
  const closed = o.status === "completed" || o.status === "declined";
  const proof = proofs.find((p) => p.status === "pending");
  const items = JSON.parse(o.items_json) as OrderItem[];
  const original = o.original_items_json ? (JSON.parse(o.original_items_json) as OrderItem[]) : null;
  const originalById = new Map((original ?? []).map((i) => [i.id, i]));
  const ordered = [...items.filter((i) => !isGrocery(i.id)), ...items.filter((i) => isGrocery(i.id))];
  const hasGroceries = items.some((i) => isGrocery(i.id));
  const grocerySub = items.filter((i) => isGrocery(i.id)).reduce((t, i) => t + lineTotal(i), 0);
  const where = o.fulfilment === "pickup" ? "Pickup" : (zoneName?.replace(/\s+\d{4}$/, "") ?? "Delivery");
  const st = SHORT_STATUS[o.status];

  return (
    <li className={`overflow-hidden rounded-3xl border transition ${open ? "border-night/15 bg-white shadow-sm" : "border-transparent bg-surface"}`}>
      {/* Compact summary */}
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2">
            <span className="truncate font-semibold text-night">{o.customer_name}</span>
            <span className="shrink-0 text-xs text-muted">{shortId(o.id)}</span>
          </p>
          <p className="mt-0.5 truncate text-xs text-muted">
            {when(o.created_at)} · {items.length} item{items.length === 1 ? "" : "s"} · {where}
          </p>
          {(proof || original || (!closed && (o.notes || needsWhatsApp))) && (
            <p className="mt-1.5 flex flex-wrap gap-1.5">
              {original && <Badge tone="bg-white text-night/70">Adjusted</Badge>}
              {proof && <Badge tone="bg-turmeric/35 text-night">Receipt to check</Badge>}
              {o.notes && !closed && <Badge tone="bg-white text-night/70">Has notes</Badge>}
              {needsWhatsApp && !closed && <Badge tone="bg-white text-night/70">Add to WhatsApp</Badge>}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold text-night">{money(o.total_cents)}</p>
          {showStatus && (
            <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${st.tone}`}>{st.label}</span>
          )}
        </div>
      </button>

      {open && (
        <div className="space-y-4 border-t border-line px-4 pb-4 pt-4 text-sm">
          {o.status === "pending" ? (
            <ReviewOrder order={o} pricing={pricing} menu={menu} act={act} />
          ) : (
            <NextStep order={o} proof={proof} act={act} onError={onError} />
          )}

          {/* What they ordered (final invoice once confirmed) */}
          <div>
            {o.status !== "pending" && (
              <ul className="space-y-1">
                {ordered.map((i, idx) => {
                  const was = originalById.get(i.id);
                  const edited = original && (!was || was.qty !== i.qty || was.unit_cents !== i.unit_cents);
                  const heading = (idx === 0 || isGrocery(ordered[idx - 1].id) !== isGrocery(i.id)) && hasGroceries ? (isGrocery(i.id) ? "Groceries" : "Foods") : null;
                  return (
                    <Fragment key={i.id}>
                    {heading && <li className="pt-1 text-[11px] font-bold uppercase tracking-wide text-muted">{heading}</li>}
                    <li className="flex justify-between gap-3">
                      <span>
                        <span className="font-semibold">{qtyText(i.qty)}×</span> {i.name}
                        {edited && (
                          <span className="ml-1.5 text-[11px] text-night/60">
                            {was ? `was ${qtyText(was.qty)} × ${money(was.unit_cents)}` : "added"}
                          </span>
                        )}
                      </span>
                      <span className="text-muted">{money(lineTotal(i))}</span>
                    </li>
                    </Fragment>
                  );
                })}
                {original
                  ?.filter((w) => !items.some((i) => i.id === w.id))
                  .map((w) => (
                    <li key={w.id} className="flex justify-between gap-3 text-night/50 line-through">
                      <span>
                        {qtyText(w.qty)}× {w.name}
                      </span>
                      <span>removed</span>
                    </li>
                  ))}
              </ul>
            )}
            {o.adjustment_note && <p className="mt-2 rounded-2xl bg-brand-soft px-3 py-2">💬 To customer: {o.adjustment_note}</p>}
            {o.notes && <p className="mt-2 rounded-2xl bg-turmeric/20 px-3 py-2">📝 {o.notes}</p>}
            <p className="mt-2 text-xs text-muted">
              {hasGroceries ? `Foods ${money(o.subtotal_cents - grocerySub)} · Groceries ${money(grocerySub)}` : `Food ${money(o.subtotal_cents)}`}
              {o.discount_cents > 0 && ` · member −${money(o.discount_cents)}`}
              {o.fulfilment === "delivery" && ` · delivery ${o.fee_cents ? money(o.fee_cents) : "free"}`}
              {o.tax_cents > 0 && ` · GST ${money(o.tax_cents)}`}
            </p>
          </div>

          {/* Customer */}
          <div className="rounded-2xl bg-surface p-3">
            <p className="font-semibold text-night">{o.customer_name}</p>
            <p className="text-muted">{o.fulfilment === "delivery" ? o.address : "Pickup from Kayal"}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip href={`tel:${o.customer_phone.replace(/\s/g, "")}`}>Call {o.customer_phone}</Chip>
              <Chip href={whatsappLink(o.customer_phone, `Hi ${o.customer_name}, about your Kayal order ${o.id}: `)} external>
                WhatsApp
              </Chip>
              {o.customer_email && <Chip href={`mailto:${o.customer_email}`}>Email</Chip>}
            </div>
            {!closed && needsWhatsApp && (
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
                <span className="text-night/80">Not in the WhatsApp group yet</span>
                <button
                  type="button"
                  onClick={() => act(markWhatsAppAdded(o.id))}
                  className="shrink-0 rounded-full bg-night px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Mark added
                </button>
              </div>
            )}
          </div>

          {/* Payment history (older submissions) */}
          {proofs.filter((p) => p !== proof).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted">Earlier payment submissions</p>
              <ul className="mt-1 space-y-1 text-xs text-muted">
                {proofs
                  .filter((p) => p !== proof)
                  .map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3">
                      <span>
                        {p.txn_ref ?? "Receipt"} — {p.status}
                        {p.admin_note ? ` (“${p.admin_note}”)` : ""}
                      </span>
                      {p.has_file ? <ReceiptLink proofId={p.id!} onError={onError} /> : null}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <SecondaryActions order={o} act={act} />
        </div>
      )}
    </li>
  );
}

/** The one big action for where this order is in its life. */
function NextStep({
  order: o,
  proof,
  act,
  onError,
}: {
  order: AdminOrder;
  proof?: Proof;
  act: (p: Promise<{ ok: boolean; error?: string }>) => Promise<boolean>;
  onError: (m: string | null) => void;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if ((o.status === "confirmed" || o.status === "payment_failed") && proof) {
    return (
      <div className="rounded-2xl bg-turmeric/20 p-3">
        <p className="font-semibold text-night">Check the payment</p>
        <p className="mt-0.5 text-night/70">
          Expecting <strong>{money(o.total_cents)}</strong> with reference <strong>{o.id}</strong>.
          {proof.txn_ref && (
            <>
              {" "}
              Customer&apos;s ref: <strong>{proof.txn_ref}</strong>.
            </>
          )}
        </p>
        {proof.has_file ? (
          <div className="mt-2">
            <ReceiptLink proofId={proof.id!} onError={onError} big />
          </div>
        ) : null}
        {rejecting ? (
          <div className="mt-3 space-y-2">
            <input
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="What's wrong? e.g. amount is $10 short"
              className="h-11 w-full rounded-xl bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-chilli/30"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  if (await act(verifyPayment(proof.id!, "reject", reason))) setRejecting(false);
                }}
                className="h-11 flex-1 rounded-full bg-chilli text-sm font-semibold text-white"
              >
                Send back to customer
              </button>
              <button type="button" onClick={() => setRejecting(false)} className="h-11 rounded-full px-4 text-sm text-muted">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex gap-2">
            <Primary onClick={() => act(verifyPayment(proof.id!, "verify"))}>Payment received ✓</Primary>
            <button
              type="button"
              onClick={() => setRejecting(true)}
              className="h-12 shrink-0 rounded-full px-4 text-sm font-semibold text-chilli"
            >
              Doesn&apos;t match
            </button>
          </div>
        )}
      </div>
    );
  }

  switch (o.status) {
    case "pending":
      return <Primary onClick={() => act(confirmOrder(o.id))}>Confirm order</Primary>;
    case "confirmed":
      return (
        <Waiting>
          Waiting for the customer to pay <strong>{money(o.total_cents)}</strong> and send the receipt.
        </Waiting>
      );
    case "payment_failed":
      return <Waiting>Sent back to the customer — waiting for a new receipt.</Waiting>;
    case "payment_received":
      return (
        <Primary onClick={() => act(setOrderStatus(o.id, "ready"))}>
          {o.fulfilment === "delivery" ? "Ready — out for delivery" : "Ready for pickup"}
        </Primary>
      );
    case "ready":
      return (
        <Primary onClick={() => act(setOrderStatus(o.id, "completed"))}>
          {o.fulfilment === "delivery" ? "Delivered — complete order" : "Collected — complete order"}
        </Primary>
      );
    default:
      return <Waiting>{o.status === "completed" ? "This order is complete." : "This order was declined."}</Waiting>;
  }
}

function SecondaryActions({
  order: o,
  act,
}: {
  order: AdminOrder;
  act: (p: Promise<{ ok: boolean; error?: string }>) => Promise<boolean>;
}) {
  const [confirming, setConfirming] = useState(false);
  const canDecline = o.status === "pending" || o.status === "confirmed" || o.status === "payment_failed";
  if (!canDecline) return null;
  return confirming ? (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-chilli/10 px-3 py-2">
      <span className="text-chilli">Decline this order? The customer is emailed.</span>
      <span className="flex shrink-0 gap-2">
        <button type="button" onClick={() => act(setOrderStatus(o.id, "declined"))} className="rounded-full bg-chilli px-3 py-1.5 text-xs font-semibold text-white">
          Decline
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="rounded-full px-3 py-1.5 text-xs text-muted">
          Keep
        </button>
      </span>
    </div>
  ) : (
    <button type="button" onClick={() => setConfirming(true)} className="text-xs font-medium text-muted underline-offset-4 hover:underline">
      Decline order…
    </button>
  );
}

function ReceiptLink({ proofId, onError, big = false }: { proofId: string; onError: (m: string | null) => void; big?: boolean }) {
  return (
    <button
      type="button"
      onClick={async () => {
        if (!(await openReceipt(proofId))) onError("Couldn't open the receipt.");
      }}
      className={big ? "rounded-full bg-white px-4 py-2 text-sm font-semibold text-night" : "shrink-0 font-semibold text-night underline"}
    >
      {big ? "📎 View receipt" : "View"}
    </button>
  );
}

function Primary({ onClick, children }: { onClick: () => unknown; children: ReactNode }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await onClick();
        setBusy(false);
      }}
      className="h-12 w-full rounded-full bg-brand text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
    >
      {busy ? "Saving…" : children}
    </button>
  );
}

function Waiting({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl bg-surface px-4 py-3 text-night/70">{children}</p>;
}

function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone}`}>{children}</span>;
}

function Chip({ href, external = false, children }: { href: string; external?: boolean; children: ReactNode }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-night"
    >
      {children}
    </a>
  );
}

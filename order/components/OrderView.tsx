"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  STATUS_LABEL,
  fetchOrder,
  money,
  submitProof,
  type OrderStatus,
  type OrderView as Order,
  type PaymentInfo,
  type Proof,
} from "@/lib/api";
import { saveRecentOrder } from "@/lib/recentOrders";
import { Row } from "./shop/CartView";

const STEPS: { key: string; label: string; reached: OrderStatus[] }[] = [
  { key: "placed", label: "Placed", reached: ["pending", "confirmed", "payment_failed", "payment_received", "ready", "completed"] },
  { key: "confirmed", label: "Confirmed", reached: ["confirmed", "payment_failed", "payment_received", "ready", "completed"] },
  { key: "paid", label: "Paid", reached: ["payment_received", "ready", "completed"] },
  { key: "ready", label: "Ready", reached: ["ready", "completed"] },
];

const PROOF_LABEL: Record<Proof["status"], string> = {
  pending: "Checking",
  verified: "Verified",
  rejected: "Not matched",
  clarify: "Query",
};

export default function OrderView() {
  const [ids, setIds] = useState<{ id: string; token: string } | null>(null);
  const [data, setData] = useState<{ order: Order; proofs: Proof[]; payment: PaymentInfo } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (id: string, token: string) => {
    const r = await fetchOrder(id, token);
    if (r.ok) {
      setData(r);
      // Opened from the invoice email on a new device: make it show under Orders.
      saveRecentOrder({ id, token, total: r.order.total_cents, placedAt: r.order.created_at.replace(" ", "T") + "Z" });
    } else setError(r.error);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const id = q.get("id") ?? "";
    const token = q.get("t") ?? "";
    const t = setTimeout(() => {
      if (!id || !token) {
        setError("Order link is incomplete.");
        return;
      }
      setIds({ id, token });
      load(id, token);
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  if (error) {
    return (
      <main className="grid min-h-dvh place-items-center bg-white px-6 text-center">
        <p className="text-lg font-semibold text-night">{error}</p>
      </main>
    );
  }
  if (!data || !ids) {
    return (
      <main className="grid min-h-dvh place-items-center bg-white">
        <p className="font-semibold text-muted">Loading your order…</p>
      </main>
    );
  }

  const { order, proofs, payment } = data;
  const awaitingPayment = order.status === "pending" || order.status === "confirmed" || order.status === "payment_failed";
  const closed = order.status === "declined";

  return (
    <main className="min-h-dvh bg-white pb-12">
      <header className="px-5 pb-2 pt-6">
        <div className="mx-auto max-w-md md:max-w-lg">
          <Link href="/" className="inline-flex items-center gap-1 rounded-full bg-surface px-4 py-2 text-sm font-medium text-night">
            ← Menu
          </Link>
          <p className="mt-6 text-xs font-medium text-muted">Order</p>
          <h1 className="text-[1.75rem] font-bold text-night">{order.id}</h1>
          <p className="mt-2 inline-block rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-dark">{STATUS_LABEL[order.status]}</p>

          {!closed && (
            <ol className="mt-7 grid grid-cols-4 gap-2" aria-label="Order progress">
              {STEPS.map((s) => {
                const done = s.reached.includes(order.status);
                return (
                  <li key={s.key} className="text-center">
                    <span className={`block h-1.5 rounded-full ${done ? "bg-brand" : "bg-surface"}`} />
                    <span className={`mt-2 block text-[11px] font-medium ${done ? "text-night" : "text-muted"}`}>{s.label}</span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-md px-5 md:max-w-lg">
        {order.status === "payment_failed" && (
          <p className="mt-6 rounded-3xl bg-chilli/10 p-4 text-sm text-chilli">
            We couldn&apos;t match your payment to the total. Please check the amount and send your receipt again below.
          </p>
        )}

        {awaitingPayment && (
          <Card title="How to pay">
            <p className="text-sm text-muted">{payment.instructions}</p>
            <dl className="mt-4 space-y-2">
              <CopyRow label="Account name" value={payment.bank.accountName} />
              <CopyRow label="BSB" value={payment.bank.bsb} />
              <CopyRow label="Account number" value={payment.bank.accountNumber} />
              {payment.payid && <CopyRow label="PayID" value={payment.payid} />}
              <CopyRow label="Reference" value={order.id} highlight />
              <CopyRow label="Amount" value={money(order.total_cents)} copyValue={(order.total_cents / 100).toFixed(2)} highlight />
            </dl>
          </Card>
        )}

        {awaitingPayment && <ProofForm orderId={ids.id} token={ids.token} onDone={() => load(ids.id, ids.token)} />}

        {proofs.length > 0 && (
          <Card title="Your payment submissions">
            <ul className="space-y-2 text-sm">
              {proofs.map((p, idx) => (
                <li key={idx} className="rounded-2xl bg-surface p-3">
                  <p className="flex justify-between gap-3">
                    <span className="text-night">
                      {p.has_file ? "Receipt" : "Reference"}
                      {p.txn_ref ? ` · ${p.txn_ref}` : ""}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        p.status === "verified"
                          ? "bg-brand-soft text-brand-dark"
                          : p.status === "rejected"
                            ? "bg-chilli/10 text-chilli"
                            : "bg-white text-night"
                      }`}
                    >
                      {PROOF_LABEL[p.status]}
                    </span>
                  </p>
                  {p.admin_note && <p className="mt-1 text-muted">Note from Kayal: {p.admin_note}</p>}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <Card title="Your order">
          <ul className="space-y-1 text-sm">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 text-night">
                <span>
                  {i.qty} × {i.name}
                </span>
                <span>{money(i.unit_cents * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="my-3 border-t border-dashed border-line" />
          <div className="text-sm">
            <Row label="Subtotal" value={money(order.subtotal_cents)} />
            {order.discount_cents > 0 && <Row label="WhatsApp member discount" value={`−${money(order.discount_cents)}`} />}
            <Row label={order.fulfilment === "delivery" ? "Delivery" : "Pickup"} value={order.fee_cents ? money(order.fee_cents) : "Free"} />
            {order.tax_cents > 0 && <Row label="GST" value={money(order.tax_cents)} />}
            <div className="my-3 border-t border-dashed border-line" />
            <Row label="Total" value={money(order.total_cents)} strong />
          </div>
          <p className="mt-3 text-sm text-muted">
            {order.fulfilment === "delivery" ? `Delivering to ${order.address}` : "Pickup from Kayal"}
          </p>
        </Card>
      </div>
    </main>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5 rounded-3xl border border-line p-5">
      <h2 className="mb-3 text-base font-bold text-night">{title}</h2>
      {children}
    </section>
  );
}

function CopyRow({
  label,
  value,
  copyValue,
  highlight = false,
}: {
  label: string;
  value: string;
  copyValue?: string;
  highlight?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 ${highlight ? "bg-brand-soft" : "bg-surface"}`}>
      <div className="min-w-0">
        <dt className="text-xs text-muted">{label}</dt>
        <dd className="truncate font-semibold text-night">{value}</dd>
      </div>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(copyValue ?? value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            /* clipboard blocked — value is still visible to copy by hand */
          }
        }}
        className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-night active:scale-95"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function ProofForm({ orderId, token, onDone }: { orderId: string; token: string; onDone: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [txnRef, setTxnRef] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await submitProof(orderId, token, file, txnRef.trim());
    setBusy(false);
    if (!r.ok) return setError(r.error);
    setSent(true);
    setFile(null);
    setTxnRef("");
    onDone();
  }

  return (
    <section className="mt-5 rounded-3xl border border-line p-5">
      <h2 className="text-base font-bold text-night">Paid? Send us your receipt</h2>
      <form onSubmit={onSubmit} className="mt-3 space-y-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-line bg-surface px-4 py-4 text-sm">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-lg" aria-hidden="true">
            📎
          </span>
          <span className="min-w-0">
            <span className="block truncate font-semibold text-night">{file ? file.name : "Upload receipt screenshot"}</span>
            <span className="block text-xs text-muted">JPG, PNG, WebP or PDF · up to 8 MB</span>
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
        </label>
        <input
          placeholder="…or transaction reference"
          value={txnRef}
          onChange={(e) => setTxnRef(e.target.value)}
          className="w-full rounded-2xl border border-transparent bg-surface px-4 py-3.5 text-sm text-night placeholder:text-muted focus:border-brand/40 focus:bg-white focus:outline-none"
        />
        {error && <p className="text-sm font-medium text-chilli">{error}</p>}
        {sent && <p className="text-sm font-medium text-brand-dark">Thanks — we&apos;ll verify your payment shortly.</p>}
        <button
          type="submit"
          disabled={busy || (!file && !txnRef.trim())}
          className="flex h-14 w-full items-center justify-center rounded-full bg-brand text-base font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}

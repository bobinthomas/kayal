"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { bySection, money, submitOrder, type MenuData } from "@/lib/api";
import { computeTotals, type CartLine, type Location } from "@/lib/totals";
import { BillRows, FreeDeliveryMeter, Row, ScreenHeader } from "./CartView";
import { Icon, PrimaryButton } from "./ui";

const field =
  "w-full rounded-2xl border border-transparent bg-surface px-4 py-3.5 text-sm text-night placeholder:text-muted focus:border-brand/40 focus:bg-white focus:outline-none";

export default function CheckoutView({
  menu,
  lines,
  location,
  setLocation,
  onBack,
  onPlaced,
}: {
  menu: MenuData;
  lines: CartLine[];
  location: Location;
  setLocation: (l: Location) => void;
  onBack: () => void;
  onPlaced: (id: string, token: string, total: number) => void;
}) {
  const canDeliver = menu.delivery.deliveryEnabled && menu.zones.length > 0;
  const canPickup = menu.delivery.pickupEnabled;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [whatsappMember, setWhatsappMember] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idemKey] = useState(() => crypto.randomUUID());

  const totals = computeTotals(menu, lines, location, whatsappMember);
  const delivery = location.fulfilment === "delivery";
  const sections = bySection(lines, (l) => l.item.id);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const r = await submitOrder({
      website,
      idempotencyKey: idemKey,
      name,
      phone,
      email,
      fulfilment: location.fulfilment,
      address,
      zoneId: location.zoneId,
      notes,
      whatsappMember,
      items: lines.map((l) => ({ id: l.item.id, qty: l.qty })),
    });
    if (!r.ok) {
      setBusy(false);
      setError(r.error);
      return;
    }
    onPlaced(r.id, r.token, totals.total);
  }

  return (
    <main className="min-h-dvh bg-white pb-10">
      <form onSubmit={onSubmit} className="mx-auto max-w-md px-5 pt-6 md:max-w-lg">
        <ScreenHeader title="Checkout" onBack={onBack} />

        {/* Delivery or pickup — green active tab like "Ingredients / Instructions" */}
        <Section title="How would you like it?">
          <div className="grid grid-cols-2 gap-1 rounded-full bg-surface p-1">
            {canDeliver && (
              <Tab
                active={delivery}
                onClick={() => setLocation({ fulfilment: "delivery", zoneId: location.zoneId || menu.zones[0].id })}
              >
                Delivery
              </Tab>
            )}
            {canPickup && (
              <Tab active={!delivery} onClick={() => setLocation({ ...location, fulfilment: "pickup" })}>
                Pickup
              </Tab>
            )}
          </div>
          {delivery && (
            <div className="mt-3 space-y-3">
              <label className="relative block">
                <span className="sr-only">Suburb</span>
                <select
                  value={location.zoneId}
                  onChange={(e) => setLocation({ fulfilment: "delivery", zoneId: e.target.value })}
                  className={`${field} appearance-none pr-10`}
                >
                  {menu.zones.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted">{Icon.chevron}</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="Street address"
                autoComplete="street-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={field}
              />
            </div>
          )}
        </Section>

        <Section title="Your details">
          <div className="space-y-3">
            <input required placeholder="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={field} />
            <input required type="tel" placeholder="Mobile number" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
            <input type="email" placeholder="Email (for your invoice)" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
            <textarea rows={2} placeholder="Notes — allergies, spice level…" value={notes} onChange={(e) => setNotes(e.target.value)} className={field} />
          </div>
          <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-2xl bg-surface p-4 text-sm">
            <input
              type="checkbox"
              checked={whatsappMember}
              onChange={(e) => setWhatsappMember(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--brand)]"
            />
            <span className="text-night">
              I&apos;m in the Kayal WhatsApp group
              {menu.whatsapp.discountEnabled && menu.whatsapp.discountPercent > 0 && (
                <span className="block font-semibold text-brand">Members save {menu.whatsapp.discountPercent}% on food.</span>
              )}
              {!whatsappMember && <span className="block text-muted">Not yet? Leave this unticked and we&apos;ll add you.</span>}
            </span>
          </label>
          {/* Honeypot: hidden from real users */}
          <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" aria-hidden="true" name="website" />
        </Section>

        {delivery && totals.zone && <FreeDeliveryMeter totals={totals} />}

        <Section title="Order summary">
          {[
            { title: "Foods", rows: sections.foods },
            { title: "Groceries", rows: sections.groceries },
          ]
            .filter((s) => s.rows.length > 0)
            .map((s) => (
              <div key={s.title} className="mb-3">
                <h3 className="mb-1 text-xs font-bold uppercase tracking-wide text-muted">{s.title}</h3>
                <ul className="space-y-1 text-sm">
                  {s.rows.map((l) => (
                    <li key={l.item.id} className="flex justify-between gap-3 text-night">
                      <span className="truncate">
                        {l.qty} × {l.item.name}
                      </span>
                      <span>{money(l.item.price_cents * l.qty)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          <div className="my-3 border-t border-dashed border-line" />
          <div className="text-sm">
            <BillRows totals={totals} />
            {totals.discount > 0 && <Row label="WhatsApp member discount" value={`−${money(totals.discount)}`} />}
            <Row label={delivery ? "Delivery" : "Pickup"} value={!delivery || totals.fee === 0 ? "Free" : money(totals.fee)} />
            {totals.tax > 0 && <Row label="GST" value={money(totals.tax)} />}
            <div className="my-3 border-t border-dashed border-line" />
            <Row label="Total" value={money(totals.total)} strong />
          </div>
          <p className="mt-3 text-xs text-muted">
            This is an estimate. We&apos;ll confirm the final quantities and amount, then you pay by bank transfer.
          </p>
        </Section>

        {error && <p className="mt-4 rounded-2xl bg-chilli/10 px-4 py-3 text-sm font-medium text-chilli">{error}</p>}

        <div className="mt-6">
          <PrimaryButton type="submit" disabled={busy || lines.length === 0}>
            {busy ? "Placing order…" : `Place order · ${money(totals.total)}`}
          </PrimaryButton>
        </div>
      </form>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-base font-bold text-night">{title}</h2>
      {children}
    </section>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`h-11 rounded-full text-sm font-semibold transition ${active ? "bg-brand text-white" : "text-night/60"}`}
    >
      {children}
    </button>
  );
}

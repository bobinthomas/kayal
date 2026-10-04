"use client";

import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from "react";
import PhotoPicker from "@/components/PhotoPicker";
import { fetchSettings, saveSetting, type Settings } from "@/lib/api";

const field = "w-full rounded-xl border border-leaf/25 bg-white px-3 py-2";

export default function SettingsManager() {
  const [s, setS] = useState<Settings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetchSettings();
    if (r.ok) setS(r.settings);
    else setError(r.error);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  if (error) return <p className="mt-6 font-medium text-chilli">{error}</p>;
  if (!s) return <p className="mt-6 text-ink/60">Loading…</p>;

  const set = <K extends keyof Settings>(key: K, patch: Partial<Settings[K]>) =>
    setS({ ...s, [key]: { ...s[key], ...patch } });

  return (
    <div className="mt-6 space-y-6 pb-12 text-sm">
      <Section title="Home screen (what customers see first)" onSave={() => saveSetting("home", s.home)}>
        <PhotoPicker
          url={s.home.imageUrl}
          hint="Big photo at the top — a wide, bright dish photo works best."
          onChange={(url) => set("home", { imageUrl: url ?? "" })}
        />
        <Labeled label="Small label above the headline (optional)">
          <input value={s.home.badge} maxLength={40} onChange={(e) => set("home", { badge: e.target.value })} className={field} />
        </Labeled>
        <Labeled label="Headline">
          <input required value={s.home.headline} maxLength={90} onChange={(e) => set("home", { headline: e.target.value })} className={field} />
        </Labeled>
        <Labeled label="Text under the headline (optional)">
          <textarea rows={3} value={s.home.text} maxLength={280} onChange={(e) => set("home", { text: e.target.value })} className={field} />
        </Labeled>
        <Labeled label="Button">
          <input value={s.home.buttonLabel} maxLength={24} onChange={(e) => set("home", { buttonLabel: e.target.value })} className={`${field} sm:w-60`} />
        </Labeled>
        <p className="text-ink/60">
          Save, then{" "}
          <a href="/?welcome" target="_blank" rel="noreferrer" className="font-semibold text-leaf underline">
            preview the home screen
          </a>
          . Removing the photo puts the default biryani photo back.
        </p>
      </Section>

      <Section title="Restaurant" onSave={() => saveSetting("restaurant", s.restaurant)}>
        <Labeled label="Name">
          <input value={s.restaurant.name} onChange={(e) => set("restaurant", { name: e.target.value })} className={field} />
        </Labeled>
        <Labeled label="Phone">
          <input value={s.restaurant.phone} onChange={(e) => set("restaurant", { phone: e.target.value })} className={field} />
        </Labeled>
        <Labeled label="Email for new-order notifications">
          <input type="email" value={s.restaurant.email} onChange={(e) => set("restaurant", { email: e.target.value })} className={field} />
        </Labeled>
      </Section>

      <Section title="Payment details (shown on invoices and the order page)" onSave={() => saveSetting("payment", s.payment)}>
        <Labeled label="Instructions">
          <textarea rows={3} value={s.payment.instructions} onChange={(e) => set("payment", { instructions: e.target.value })} className={field} />
        </Labeled>
        <Labeled label="Account name">
          <input value={s.payment.bank.accountName} onChange={(e) => set("payment", { bank: { ...s.payment.bank, accountName: e.target.value } })} className={field} />
        </Labeled>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Labeled label="BSB">
            <input value={s.payment.bank.bsb} onChange={(e) => set("payment", { bank: { ...s.payment.bank, bsb: e.target.value } })} className={field} />
          </Labeled>
          <Labeled label="Account number">
            <input value={s.payment.bank.accountNumber} onChange={(e) => set("payment", { bank: { ...s.payment.bank, accountNumber: e.target.value } })} className={field} />
          </Labeled>
        </div>
        <Labeled label="PayID (optional)">
          <input value={s.payment.payid ?? ""} onChange={(e) => set("payment", { payid: e.target.value })} className={field} />
        </Labeled>
      </Section>

      <Section title="WhatsApp group member pricing" onSave={() => saveSetting("whatsapp", s.whatsapp)}>
        <p className="text-ink/60">
          Customers tick &quot;I&apos;m in the Kayal WhatsApp group&quot; at checkout. It isn&apos;t verified — the
          same trust model as the Onam member price.
        </p>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={s.whatsapp.discountEnabled}
            onChange={(e) => set("whatsapp", { discountEnabled: e.target.checked })}
          />
          Give WhatsApp group members a discount
        </label>
        <Labeled label="Discount on food (%)">
          <input
            inputMode="decimal"
            value={s.whatsapp.discountPercent}
            onChange={(e) => set("whatsapp", { discountPercent: parseFloat(e.target.value || "0") })}
            disabled={!s.whatsapp.discountEnabled}
            className={`${field} sm:w-32`}
          />
        </Labeled>
      </Section>

      <Section title="Tax" onSave={() => saveSetting("tax", s.tax)}>
        <Labeled label="GST rate (%)">
          <input
            inputMode="decimal"
            value={s.tax.rateBps / 100}
            onChange={(e) => set("tax", { rateBps: Math.round(parseFloat(e.target.value || "0") * 100) })}
            className={`${field} sm:w-32`}
          />
        </Labeled>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={s.tax.inclusive} onChange={(e) => set("tax", { inclusive: e.target.checked })} />
          Menu prices already include GST (don&apos;t add tax at checkout)
        </label>
      </Section>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-ink/60">{label}</span>
      {children}
    </label>
  );
}

function Section({
  title,
  onSave,
  children,
}: {
  title: string;
  onSave: () => Promise<{ ok: boolean; error?: string }>;
  children: ReactNode;
}) {
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await onSave();
    setBusy(false);
    setStatus(r.ok ? { ok: true, text: "Saved." } : { ok: false, text: r.error ?? "Save failed." });
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-leaf/15 bg-white p-4">
      <h2 className="font-semibold text-leaf">{title}</h2>
      {children}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy} className="rounded-full bg-clay px-6 py-2 font-semibold text-white disabled:opacity-60">
          {busy ? "Saving…" : "Save"}
        </button>
        {status && <span className={status.ok ? "text-leaf" : "text-chilli"}>{status.text}</span>}
      </div>
    </form>
  );
}

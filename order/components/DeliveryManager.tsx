"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  fetchSettings,
  fetchZones,
  money,
  saveSetting,
  zoneAction,
  type AdminZone,
  type Settings,
} from "@/lib/api";

const toCents = (s: string) => Math.round(parseFloat(s) * 100);
const toDollars = (c: number) => (c / 100).toFixed(2);
const field = "w-full rounded-xl border border-leaf/25 bg-white px-3 py-2";

export default function DeliveryManager() {
  const [zones, setZones] = useState<AdminZone[]>([]);
  const [modes, setModes] = useState<Settings["delivery"] | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [z, s] = await Promise.all([fetchZones(), fetchSettings()]);
    if (z.ok) setZones(z.zones);
    else setMsg(z.error);
    if (s.ok) setModes(s.settings.delivery);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  async function act(p: ReturnType<typeof zoneAction>) {
    const r = await p;
    setMsg(r.ok ? null : r.error);
    await load();
    return r.ok;
  }

  async function toggle(key: keyof Settings["delivery"]) {
    if (!modes) return;
    const next = { ...modes, [key]: !modes[key] };
    const r = await saveSetting("delivery", next);
    setMsg(r.ok ? null : r.error);
    if (r.ok) setModes(next);
  }

  return (
    <div className="mt-6 space-y-8 pb-12 text-sm">
      {msg && <p className="font-medium text-chilli">{msg}</p>}

      {modes && (
        <section className="flex flex-wrap gap-6 rounded-2xl border border-leaf/15 bg-white p-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={modes.deliveryEnabled} onChange={() => toggle("deliveryEnabled")} />
            Offer delivery
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={modes.pickupEnabled} onChange={() => toggle("pickupEnabled")} />
            Offer pickup
          </label>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-leaf">Delivery areas ({zones.length})</h2>
        <p className="text-ink/60">
          Customers choose an area at checkout. The fee is waived once the order reaches the free-delivery amount.
        </p>
        <ul className="mt-3 divide-y divide-leaf/10 rounded-2xl border border-leaf/15 bg-white">
          {zones.map((z) => (
            <ZoneRow key={z.id} zone={z} act={act} />
          ))}
          {zones.length === 0 && <li className="p-3 text-ink/60">No areas yet — delivery is hidden at checkout until you add one.</li>}
        </ul>
      </section>

      <ZoneForm
        title="Add a delivery area"
        submitLabel="Add area"
        onSubmit={(v) => act(zoneAction({ action: "create", ...v }))}
      />
    </div>
  );
}

type ZoneValues = {
  name: string;
  areas: string;
  feeCents: number;
  freeOverCents: number;
  etaMinutes: number | null;
  active: boolean;
};

function ZoneRow({ zone, act }: { zone: AdminZone; act: (p: ReturnType<typeof zoneAction>) => Promise<boolean> }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="p-3">
        <ZoneForm
          initial={zone}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={async (v) => {
            const ok = await act(zoneAction({ action: "update", id: zone.id, ...v }));
            if (ok) setEditing(false);
            return ok;
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 p-3">
      <div className="min-w-0">
        <p className="font-medium">
          {zone.name}
          {!zone.active && <span className="ml-2 rounded bg-ink/10 px-1.5 text-xs">hidden</span>}
        </p>
        {zone.areas && <p className="text-ink/60">{zone.areas}</p>}
        <p className="text-ink/60">
          Fee {money(zone.fee_cents)}
          {zone.free_over_cents > 0 ? ` · free from ${money(zone.free_over_cents)}` : " · never free"}
          {zone.eta_minutes ? ` · ~${zone.eta_minutes} min` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-full border px-3 py-1" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button
          className="rounded-full border border-chilli px-3 py-1 text-chilli"
          onClick={() => {
            if (window.confirm(`Delete delivery area "${zone.name}"?`)) act(zoneAction({ action: "delete", id: zone.id }));
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function ZoneForm({
  title,
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  title?: string;
  initial?: AdminZone;
  submitLabel: string;
  onSubmit: (v: ZoneValues) => Promise<boolean>;
  onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [areas, setAreas] = useState(initial?.areas ?? "");
  const [fee, setFee] = useState(initial ? toDollars(initial.fee_cents) : "10.00");
  const [freeOver, setFreeOver] = useState(initial ? toDollars(initial.free_over_cents) : "60.00");
  const [eta, setEta] = useState(initial?.eta_minutes?.toString() ?? "");
  const [active, setActive] = useState(initial ? Boolean(initial.active) : true);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const feeCents = toCents(fee);
    const freeOverCents = freeOver.trim() === "" ? 0 : toCents(freeOver);
    if (!Number.isFinite(feeCents) || !Number.isFinite(freeOverCents)) {
      setError("Enter amounts as numbers, e.g. 10 or 60.00.");
      return;
    }
    setError(null);
    const ok = await onSubmit({
      name,
      areas,
      feeCents,
      freeOverCents,
      etaMinutes: eta.trim() === "" ? null : Number(eta),
      active,
    });
    if (ok && !initial) {
      setName("");
      setAreas("");
      setEta("");
    }
  }

  return (
    <form onSubmit={submit} className={initial ? "space-y-3" : "space-y-3 rounded-2xl border border-leaf/15 bg-white p-4"}>
      {title && <h2 className="font-semibold text-leaf">{title}</h2>}
      <input required placeholder="Area name, e.g. Moorebank & nearby" value={name} onChange={(e) => setName(e.target.value)} className={field} />
      <input placeholder="Suburbs or postcodes covered (for your reference)" value={areas} onChange={(e) => setAreas(e.target.value)} className={field} />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <label className="space-y-1">
          <span className="text-ink/60">Delivery fee ($)</span>
          <input required inputMode="decimal" value={fee} onChange={(e) => setFee(e.target.value)} className={field} />
        </label>
        <label className="space-y-1">
          <span className="text-ink/60">Free delivery from ($, 0 = never)</span>
          <input inputMode="decimal" value={freeOver} onChange={(e) => setFreeOver(e.target.value)} className={field} />
        </label>
        <label className="space-y-1">
          <span className="text-ink/60">Est. time (minutes)</span>
          <input inputMode="numeric" value={eta} onChange={(e) => setEta(e.target.value)} className={field} />
        </label>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
        Show this area at checkout
      </label>
      {error && <p className="font-medium text-chilli">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="rounded-full bg-clay px-6 py-2 font-semibold text-white">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="rounded-full border px-6 py-2" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

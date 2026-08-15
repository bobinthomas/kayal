"use client";

import { useAdminContent } from "./useAdminContent";
import SaveBar from "./SaveBar";
import type { RestaurantFile } from "@/lib/content/schemas";
import { dayOrder, dayLabels, type Day } from "@/data/restaurant";

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
      />
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4">
      <legend className="px-1 text-sm font-semibold text-neutral-700">{title}</legend>
      {children}
    </fieldset>
  );
}

export default function RestaurantEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, dirty, conflict, setData, reload, save } =
    useAdminContent<RestaurantFile>("restaurant", password, onUnauthorized);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) return <p className="p-4 text-red-600">Could not load restaurant info.</p>;

  function updateDaySession(day: Day, sessionIndex: number, patch: Partial<{ open: string; close: string }>) {
    if (!data) return;
    const sessions = data.hours[day].sessions.slice();
    sessions[sessionIndex] = { ...sessions[sessionIndex], ...patch };
    setData({ ...data, hours: { ...data.hours, [day]: { ...data.hours[day], sessions } } });
  }

  function toggleHighlight(day: Day) {
    if (!data) return;
    setData({
      ...data,
      hours: { ...data.hours, [day]: { ...data.hours[day], highlight: !data.hours[day].highlight } },
    });
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <Section title="Identity">
          <Input label="Name" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
          <Input label="Tagline" value={data.tagline} onChange={(v) => setData({ ...data, tagline: v })} />
          <Input label="Positioning" value={data.positioning} onChange={(v) => setData({ ...data, positioning: v })} />
        </Section>

        <Section title="Address">
          <Input
            label="Street"
            value={data.address.street}
            onChange={(v) => setData({ ...data, address: { ...data.address, street: v } })}
          />
          <Input
            label="Suburb"
            value={data.address.suburb}
            onChange={(v) => setData({ ...data, address: { ...data.address, suburb: v } })}
          />
          <Input
            label="Full address (used for maps + directions links)"
            value={data.address.full}
            onChange={(v) => setData({ ...data, address: { ...data.address, full: v } })}
          />
        </Section>

        <Section title="Contact">
          <Input
            label="Phone (display)"
            value={data.phone.display}
            onChange={(v) => setData({ ...data, phone: { ...data.phone, display: v } })}
          />
          <Input
            label="Phone (tel: link, e.g. +61297349634)"
            value={data.phone.tel}
            onChange={(v) => setData({ ...data, phone: { ...data.phone, tel: v } })}
          />
          <Input
            label="WhatsApp number (digits only, e.g. 61400250111)"
            value={data.whatsapp.number}
            onChange={(v) => setData({ ...data, whatsapp: { ...data.whatsapp, number: v } })}
          />
          <Input label="Email" value={data.email} onChange={(v) => setData({ ...data, email: v })} />
        </Section>

        <Section title="Socials">
          <Input
            label="Facebook URL"
            value={data.socials.facebook}
            onChange={(v) => setData({ ...data, socials: { ...data.socials, facebook: v } })}
          />
          <Input
            label="Instagram URL"
            value={data.socials.instagram}
            onChange={(v) => setData({ ...data, socials: { ...data.socials, instagram: v } })}
          />
        </Section>

        <Section title="Hours">
          {dayOrder.map((day) => (
            <div key={day} className="flex flex-wrap items-center gap-2 border-b border-neutral-100 pb-2 last:border-0">
              <span className="w-24 text-sm font-medium">{dayLabels[day]}</span>
              {data.hours[day].sessions.map((session, i) => (
                <span key={i} className="flex items-center gap-1">
                  <input
                    type="time"
                    value={session.open}
                    onChange={(e) => updateDaySession(day, i, { open: e.target.value })}
                    className="rounded border border-neutral-300 p-1 text-sm"
                  />
                  <span className="text-neutral-400">–</span>
                  <input
                    type="time"
                    value={session.close}
                    onChange={(e) => updateDaySession(day, i, { close: e.target.value })}
                    className="rounded border border-neutral-300 p-1 text-sm"
                  />
                </span>
              ))}
              <label className="ml-auto flex items-center gap-1 text-xs text-neutral-500">
                <input
                  type="checkbox"
                  checked={Boolean(data.hours[day].highlight)}
                  onChange={() => toggleHighlight(day)}
                />
                Highlight
              </label>
            </div>
          ))}
        </Section>

        <Section title="Policies">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-500">Booking policy</span>
            <textarea
              value={data.policies.bookingOnly}
              onChange={(e) => setData({ ...data, policies: { ...data.policies, bookingOnly: e.target.value } })}
              rows={2}
              className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-500">Last orders</span>
            <textarea
              value={data.policies.lastOrders}
              onChange={(e) => setData({ ...data, policies: { ...data.policies, lastOrders: e.target.value } })}
              rows={2}
              className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-500">Sitting time</span>
            <textarea
              value={data.policies.sitting}
              onChange={(e) => setData({ ...data, policies: { ...data.policies, sitting: e.target.value } })}
              rows={2}
              className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
            />
          </label>
        </Section>

        <Section title="Finding us">
          <Input
            label="Headline"
            value={data.findingUs.headline}
            onChange={(v) => setData({ ...data, findingUs: { ...data.findingUs, headline: v } })}
          />
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-500">Blurb</span>
            <textarea
              value={data.findingUs.blurb}
              onChange={(e) => setData({ ...data, findingUs: { ...data.findingUs, blurb: e.target.value } })}
              rows={3}
              className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
            />
          </label>
          <Input
            label="Parking note"
            value={data.findingUs.parkingNote}
            onChange={(v) => setData({ ...data, findingUs: { ...data.findingUs, parkingNote: v } })}
          />
        </Section>
      </div>
    </div>
  );
}

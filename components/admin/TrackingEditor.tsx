"use client";

import { useAdminContent } from "./useAdminContent";
import SaveBar from "./SaveBar";
import type { TrackingFile } from "@/lib/content/schemas";

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
      />
      <span className="block text-xs text-neutral-400">{hint}</span>
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

export default function TrackingEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, issues, dirty, conflict, setData, reload, save } =
    useAdminContent<TrackingFile>("tracking", password, onUnauthorized);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) return <p className="p-4 text-red-600">Could not load tracking settings.</p>;

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} issues={issues} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <p className="text-sm text-neutral-500">
          Leave any field blank to skip it — nothing renders on the site until an id is set here.
          Saving triggers a full rebuild (~1–2 min) before a new tag goes live, same as any other edit.
        </p>

        <Section title="Google Analytics 4">
          <Field
            label="Measurement ID"
            hint='From GA4 → Admin → Data Streams → your stream → "Measurement ID". Format: G-XXXXXXXXXX.'
            placeholder="G-XXXXXXXXXX"
            value={data.gaMeasurementId ?? ""}
            onChange={(v) => setData({ ...data, gaMeasurementId: v })}
          />
        </Section>

        <Section title="Google Tag Manager">
          <Field
            label="Container ID"
            hint="From the GTM workspace, top right corner. Format: GTM-XXXXXXX. If you use GTM, you usually don't also need the GA4 field above — GTM can fire GA4 itself."
            placeholder="GTM-XXXXXXX"
            value={data.gtmContainerId ?? ""}
            onChange={(v) => setData({ ...data, gtmContainerId: v })}
          />
        </Section>

        <Section title="Meta (Facebook/Instagram) Pixel">
          <Field
            label="Pixel ID"
            hint="From Meta Events Manager → Data Sources → your pixel. Digits only."
            placeholder="123456789012345"
            value={data.metaPixelId ?? ""}
            onChange={(v) => setData({ ...data, metaPixelId: v })}
          />
        </Section>

        <Section title="Bing (Microsoft) Ads">
          <Field
            label="UET Tag ID"
            hint="From Microsoft Ads → Tools → UET Tags. Digits only, without the leading zeros shown in the UI."
            placeholder="12345678"
            value={data.bingUetTagId ?? ""}
            onChange={(v) => setData({ ...data, bingUetTagId: v })}
          />
        </Section>

        <Section title="Twitter / X Ads">
          <Field
            label="Pixel ID"
            hint="From X Ads → Tools → Events Manager → your pixel."
            placeholder="o1abc"
            value={data.twitterPixelId ?? ""}
            onChange={(v) => setData({ ...data, twitterPixelId: v })}
          />
        </Section>

        <Section title="Search engine verification">
          <Field
            label="Google Search Console"
            hint='From GSC → Settings → Ownership verification → HTML tag method → copy just the "content" value.'
            value={data.googleSiteVerification ?? ""}
            onChange={(v) => setData({ ...data, googleSiteVerification: v })}
          />
          <Field
            label="Bing Webmaster Tools"
            hint='From Bing Webmaster Tools → Settings → verify ownership → meta tag method → copy just the "content" value.'
            value={data.bingSiteVerification ?? ""}
            onChange={(v) => setData({ ...data, bingSiteVerification: v })}
          />
        </Section>

        <p className="text-xs text-neutral-400">
          Google Business Profile doesn&apos;t use a site tag — it&apos;s verified directly in Business
          Profile Manager. Make sure its Website field points to https://kayal.com.au.
        </p>
      </div>
    </div>
  );
}

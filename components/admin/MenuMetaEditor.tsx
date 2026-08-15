"use client";

import { useEffect, useState } from "react";
import { useAdminContent } from "./useAdminContent";
import { fetchContent } from "./adminApi";
import SaveBar from "./SaveBar";
import type { MenuFile, MenuMetaFile } from "@/lib/content/schemas";

type Spotlight = MenuMetaFile["spotlights"][number];

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-neutral-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
      />
    </label>
  );
}

export default function MenuMetaEditor({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const { data, loading, saving, error, dirty, conflict, setData, reload, save } =
    useAdminContent<MenuMetaFile>("menu-meta", password, onUnauthorized);
  const [sections, setSections] = useState<MenuFile["sections"] | null>(null);

  useEffect(() => {
    fetchContent<MenuFile>("menu", password).then((result) => {
      if (result.ok && result.data) setSections(result.data.sections);
    });
  }, [password]);

  if (loading) return <p className="p-4 text-neutral-500">Loading…</p>;
  if (!data) return <p className="p-4 text-red-600">Could not load menu page copy.</p>;

  function updateSpotlight(index: number, patch: Partial<Spotlight>) {
    if (!data) return;
    const next = data.spotlights.slice();
    next[index] = { ...next[index], ...patch };
    setData({ ...data, spotlights: next });
  }

  function updateStep(spotlightIndex: number, stepIndex: number, patch: Partial<{ label: string; title: string; detail: string }>) {
    if (!data) return;
    const spotlight = data.spotlights[spotlightIndex];
    const steps = (spotlight.steps ?? []).slice();
    steps[stepIndex] = { ...steps[stepIndex], ...patch };
    updateSpotlight(spotlightIndex, { steps });
  }

  function updateChoiceGroupOptions(spotlightIndex: number, groupIndex: number, optionsText: string) {
    if (!data) return;
    const spotlight = data.spotlights[spotlightIndex];
    const choiceGroups = (spotlight.choiceGroups ?? []).slice();
    choiceGroups[groupIndex] = {
      ...choiceGroups[groupIndex],
      options: optionsText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    updateSpotlight(spotlightIndex, { choiceGroups });
  }

  return (
    <div>
      <SaveBar dirty={dirty} saving={saving} error={error} conflict={conflict} onSave={save} onReload={reload} />
      <div className="mx-auto max-w-2xl space-y-6 p-4">
        <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-semibold text-neutral-700">Page intro</legend>
          <Input
            label="Eyebrow (left)"
            value={data.pageCopy.eyebrowLeft}
            onChange={(v) => setData({ ...data, pageCopy: { ...data.pageCopy, eyebrowLeft: v } })}
          />
          <Input
            label="Eyebrow (right)"
            value={data.pageCopy.eyebrowRight}
            onChange={(v) => setData({ ...data, pageCopy: { ...data.pageCopy, eyebrowRight: v } })}
          />
          <Input
            label="Discovery tagline"
            value={data.pageCopy.discoveryTagline}
            onChange={(v) => setData({ ...data, pageCopy: { ...data.pageCopy, discoveryTagline: v } })}
          />
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-500">Intro paragraph</span>
            <textarea
              value={data.pageCopy.intro}
              onChange={(e) => setData({ ...data, pageCopy: { ...data.pageCopy, intro: e.target.value } })}
              rows={3}
              className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
            />
          </label>
        </fieldset>

        <fieldset className="space-y-3 rounded-xl border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-semibold text-neutral-700">Category nav labels</legend>
          {!sections && <p className="text-sm text-neutral-400">Loading menu sections…</p>}
          {sections?.map((section) => (
            <Input
              key={section.id}
              label={`${section.title} (${section.id})`}
              value={data.navLabels[section.id] ?? ""}
              onChange={(v) => setData({ ...data, navLabels: { ...data.navLabels, [section.id]: v } })}
            />
          ))}
        </fieldset>

        <fieldset className="space-y-4 rounded-xl border border-neutral-200 p-4">
          <legend className="px-1 text-sm font-semibold text-neutral-700">Featured spotlights</legend>
          {data.spotlights.map((spotlight, i) => (
            <div key={spotlight.id} className="space-y-2 rounded-lg border border-neutral-200 p-3">
              <p className="text-xs font-medium text-neutral-400">{spotlight.id}</p>
              <Input label="Eyebrow" value={spotlight.eyebrow} onChange={(v) => updateSpotlight(i, { eyebrow: v })} />
              <Input label="Title" value={spotlight.title} onChange={(v) => updateSpotlight(i, { title: v })} />
              <label className="block space-y-1">
                <span className="text-xs font-medium text-neutral-500">Price (blank for none)</span>
                <input
                  type="number"
                  step="0.01"
                  value={spotlight.price ?? ""}
                  onChange={(e) =>
                    updateSpotlight(i, { price: e.target.value === "" ? undefined : Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                />
              </label>
              {spotlight.subtitle !== undefined && (
                <Input label="Subtitle" value={spotlight.subtitle} onChange={(v) => updateSpotlight(i, { subtitle: v })} />
              )}
              <label className="block space-y-1">
                <span className="text-xs font-medium text-neutral-500">Description</span>
                <textarea
                  value={spotlight.description}
                  onChange={(e) => updateSpotlight(i, { description: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 p-2 text-sm"
                />
              </label>

              {spotlight.steps && (
                <div className="space-y-2 rounded-lg bg-neutral-50 p-2">
                  <span className="text-xs font-medium text-neutral-500">Steps</span>
                  {spotlight.steps.map((step, si) => (
                    <div key={si} className="grid grid-cols-[3rem_1fr] gap-2">
                      <input
                        value={step.label}
                        onChange={(e) => updateStep(i, si, { label: e.target.value })}
                        className="rounded border border-neutral-300 p-1 text-sm"
                      />
                      <input
                        value={step.title}
                        onChange={(e) => updateStep(i, si, { title: e.target.value })}
                        className="rounded border border-neutral-300 p-1 text-sm"
                        placeholder="Title"
                      />
                      <span />
                      <textarea
                        value={step.detail}
                        onChange={(e) => updateStep(i, si, { detail: e.target.value })}
                        rows={2}
                        className="rounded border border-neutral-300 p-1 text-sm"
                        placeholder="Detail"
                      />
                    </div>
                  ))}
                </div>
              )}

              {spotlight.choiceGroups && (
                <div className="space-y-2 rounded-lg bg-neutral-50 p-2">
                  <span className="text-xs font-medium text-neutral-500">Choice groups</span>
                  {spotlight.choiceGroups.map((group, gi) => (
                    <div key={gi} className="space-y-1">
                      <input
                        value={group.label}
                        onChange={(e) => {
                          const choiceGroups = spotlight.choiceGroups!.slice();
                          choiceGroups[gi] = { ...choiceGroups[gi], label: e.target.value };
                          updateSpotlight(i, { choiceGroups });
                        }}
                        className="w-full rounded border border-neutral-300 p-1 text-sm font-medium"
                      />
                      <textarea
                        value={group.options.join("\n")}
                        onChange={(e) => updateChoiceGroupOptions(i, gi, e.target.value)}
                        rows={Math.max(2, group.options.length)}
                        className="w-full rounded border border-neutral-300 p-1 text-sm"
                        placeholder="One option per line"
                      />
                    </div>
                  ))}
                </div>
              )}

              {spotlight.href !== undefined && (
                <Input label="Link (#section-id)" value={spotlight.href} onChange={(v) => updateSpotlight(i, { href: v })} />
              )}
            </div>
          ))}
        </fieldset>
      </div>
    </div>
  );
}

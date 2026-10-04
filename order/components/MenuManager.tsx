"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import PhotoPicker from "@/components/PhotoPicker";
import { fetchAdminMenu, menuAction, money, type AdminMenuItem } from "@/lib/api";

type Cat = { id: string; name: string };

type Act = (p: ReturnType<typeof menuAction>) => Promise<boolean>;

export default function MenuManager() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [items, setItems] = useState<AdminMenuItem[]>([]);
  const [pick, setPick] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await fetchAdminMenu();
    if (r.ok) {
      setCats(r.categories);
      setItems(r.items);
    } else setMsg(r.error);
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 0);
    return () => clearTimeout(t);
  }, [load]);

  const act: Act = async (p) => {
    const r = await p;
    setMsg(r.ok ? null : r.error);
    await load();
    return r.ok;
  };

  const listed = items.filter((i) => i.listed);
  const unlisted = items.filter((i) => !i.listed);
  const picked = items.find((i) => i.id === pick);
  const missingPhotos = listed.filter((i) => !i.image_url).length;
  const input = "w-full rounded-xl border border-leaf/25 bg-white px-3 py-2";

  return (
    <div className="mt-6 space-y-8 pb-12 text-sm">
      {msg && <p className="font-medium text-chilli">{msg}</p>}

      <section className="rounded-2xl border border-leaf/15 bg-white p-4">
        <h2 className="font-semibold text-leaf">Add an item from the catalog</h2>
        <div className="mt-3 flex gap-2">
          <select value={pick} onChange={(e) => setPick(e.target.value)} className={input}>
            <option value="">Select a dish… ({unlisted.length} not shown)</option>
            {cats.map((c) => {
              const group = unlisted.filter((i) => i.category_id === c.id);
              if (!group.length) return null;
              return (
                <optgroup key={c.id} label={c.name}>
                  {group.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} — {money(i.price_cents)}
                      {i.image_url ? "" : " (no photo)"}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          <button
            disabled={!pick}
            onClick={async () => {
              if (await act(menuAction({ action: "list", id: pick }))) setPick("");
            }}
            className="rounded-full bg-leaf px-5 font-semibold text-cream disabled:opacity-50"
          >
            Add
          </button>
        </div>
        {picked && (
          <div className="mt-3 rounded-xl bg-cream p-3">
            <PhotoPicker
              url={picked.image_url}
              hint={picked.image_url ? "This dish has a photo." : "This dish has no photo yet — add one before showing it (optional)."}
              onChange={(url) => act(menuAction({ action: "image", id: picked.id, imageUrl: url ?? "" }))}
            />
          </div>
        )}
      </section>

      <CustomItemForm onCreate={(body) => act(menuAction({ action: "create", ...body }))} />

      <section>
        <h2 className="font-semibold text-leaf">Shown on the main page ({listed.length})</h2>
        {missingPhotos > 0 && (
          <p className="mt-1 text-ink/60">
            {`${missingPhotos} ${missingPhotos === 1 ? "dish has" : "dishes have"} no photo — tap "Add photo" to upload one.`}
          </p>
        )}
        {listed.length === 0 && (
          <p className="mt-2 text-ink/60">Nothing yet — add items above. Customers see an empty menu until you do.</p>
        )}
        <ul className="mt-3 divide-y divide-leaf/10 rounded-2xl border border-leaf/15 bg-white">
          {listed.map((i) => (
            <ItemRow key={i.id} item={i} catName={cats.find((c) => c.id === i.category_id)?.name ?? ""} act={act} />
          ))}
        </ul>
      </section>
    </div>
  );
}

function ItemRow({ item, catName, act }: { item: AdminMenuItem; catName: string; act: Act }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState((item.price_cents / 100).toFixed(2));
  const [desc, setDesc] = useState(item.description ?? "");
  const custom = item.id.startsWith("custom-");
  const field = "w-full rounded-xl border border-leaf/25 px-3 py-2";

  if (editing) {
    return (
      <li className="space-y-2 p-3">
        <input value={name} onChange={(e) => setName(e.target.value)} className={field} />
        <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" className={field} />
        <input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" className="w-32 rounded-xl border border-leaf/25 px-3 py-2" />
        <div className="flex gap-2">
          <button
            className="rounded-full bg-leaf px-4 py-1.5 text-cream"
            onClick={async () => {
              const ok = await act(
                menuAction({
                  action: "update",
                  id: item.id,
                  name,
                  description: desc,
                  priceCents: Math.round(parseFloat(price) * 100),
                  imageUrl: item.image_url ?? "",
                }),
              );
              if (ok) setEditing(false);
            }}
          >
            Save
          </button>
          <button className="rounded-full border px-4 py-1.5" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center justify-between gap-3 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <PhotoPicker
          compact
          url={item.image_url}
          onChange={(url) => act(menuAction({ action: "image", id: item.id, imageUrl: url ?? "" }))}
        />
        <div className="min-w-0">
          <p className="font-medium">
            {item.name}
            {custom && <span className="ml-2 rounded bg-turmeric/40 px-1.5 text-xs">grocery</span>}
            {!item.available && <span className="ml-2 rounded bg-chilli/15 px-1.5 text-xs text-chilli">sold out</span>}
          </p>
          <p className="text-ink/60">
            {catName} · {money(item.price_cents)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className={`rounded-full px-3 py-1 ${
            item.tags.includes("popular") ? "bg-leaf text-cream" : "border"
          }`}
          onClick={() => act(menuAction({ action: "popular", id: item.id, popular: !item.tags.includes("popular") }))}
        >
          {item.tags.includes("popular") ? "★ Popular" : "Mark popular"}
        </button>
        <button
          className="rounded-full border px-3 py-1"
          onClick={() => act(menuAction({ action: "availability", id: item.id, available: !item.available }))}
        >
          {item.available ? "Mark sold out" : "Mark available"}
        </button>
        <button className="rounded-full border px-3 py-1" onClick={() => setEditing(true)}>
          Edit
        </button>
        <button
          className="rounded-full border border-chilli px-3 py-1 text-chilli"
          onClick={() => act(menuAction({ action: custom ? "delete" : "unlist", id: item.id }))}
        >
          {custom ? "Delete" : "Remove"}
        </button>
      </div>
    </li>
  );
}

function CustomItemForm({
  onCreate,
}: {
  onCreate: (body: {
    name: string;
    description: string;
    priceCents: number;
    imageUrl: string;
    tags: string[];
  }) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [veg, setVeg] = useState(false);
  const [spicy, setSpicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = "w-full rounded-xl border border-leaf/25 bg-white px-3 py-2";

  async function submit(e: FormEvent) {
    e.preventDefault();
    const priceCents = Math.round(parseFloat(price) * 100);
    if (!Number.isFinite(priceCents)) {
      setError("Enter the price as a number, e.g. 12.50.");
      return;
    }
    setError(null);
    const ok = await onCreate({
      name,
      description: desc,
      priceCents,
      imageUrl: image ?? "",
      tags: [veg && "veg", spicy && "spicy"].filter(Boolean) as string[],
    });
    if (ok) {
      setName("");
      setDesc("");
      setPrice("");
      setImage(null);
      setVeg(false);
      setSpicy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-leaf/15 bg-white p-4">
      <h2 className="font-semibold text-leaf">Add a grocery item</h2>
      <p className="text-ink/60">Shown under Groceries on the customer app, billed in its own section.</p>
      <PhotoPicker url={image} hint="Photo (optional)" onChange={(url) => setImage(url)} />
      <input required placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
      <input placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} className={input} />
      <div className="flex flex-wrap gap-2">
        <input required placeholder="Price e.g. 12.50" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={`${input} sm:w-40`} />
      </div>
      {error && <p className="font-medium text-chilli">{error}</p>}
      <div className="flex gap-4">
        <label>
          <input type="checkbox" checked={veg} onChange={(e) => setVeg(e.target.checked)} /> Veg
        </label>
        <label>
          <input type="checkbox" checked={spicy} onChange={(e) => setSpicy(e.target.checked)} /> Spicy
        </label>
      </div>
      <button type="submit" className="rounded-full bg-clay px-6 py-2 font-semibold text-white">
        Add to Groceries
      </button>
    </form>
  );
}

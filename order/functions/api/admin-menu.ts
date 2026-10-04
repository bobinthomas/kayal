/**
 * Admin: choose which items appear on the storefront, and manage custom items.
 *   GET  -> every catalog item (listed or not) + categories
 *   POST -> { action: "list" | "unlist" | "availability" | "image" | "create" | "update" | "delete", ... }
 * "list"/"unlist" control storefront visibility; "availability" is the
 * in-stock toggle; "create" adds a custom item (listed immediately);
 * "delete" only removes custom items (ids prefixed "custom-").
 */
import { checkAdminAuth, type AdminEnv } from "./_auth";
import { json } from "./_util";

interface Env extends AdminEnv {
  DB: D1Database;
}

interface Body {
  action?: string;
  id?: string;
  available?: boolean;
  popular?: boolean;
  name?: string;
  description?: string;
  priceCents?: number;
  categoryId?: string;
  newCategory?: string;
  tags?: string[];
  imageUrl?: string;
}

// Site-relative path ("/images/...") or an https URL; anything else (e.g.
// "javascript:") is refused. Empty string clears the image.
function cleanImageUrl(v: unknown): string | null | false {
  const s = typeof v === "string" ? v.trim().slice(0, 500) : "";
  if (!s) return null;
  return /^(\/[^/]|https:\/\/)/.test(s) ? s : false;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);
  const [categories, items] = await Promise.all([
    env.DB.prepare(`SELECT id, name FROM categories ORDER BY sort, name`).all(),
    env.DB.prepare(
      `SELECT id, category_id, name, description, price_cents, tags_json, image_url, available, listed FROM menu_items ORDER BY sort`,
    ).all<{ tags_json: string }>(),
  ]);
  return json({
    ok: true,
    categories: categories.results,
    items: items.results.map((i) => ({ ...i, tags: JSON.parse(i.tags_json) as string[] })),
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!(await checkAdminAuth(request, env))) return json({ ok: false, error: "Unauthorized" }, 401);
  const b = (await request.json().catch(() => ({}))) as Body;
  const db = env.DB;

  if (b.action === "create") {
    const name = (b.name ?? "").trim().slice(0, 120);
    const description = (b.description ?? "").trim().slice(0, 400) || null;
    const price = typeof b.priceCents === "number" ? Math.round(b.priceCents) : NaN;
    if (!name) return json({ ok: false, error: "Name is required." }, 400);
    if (!Number.isFinite(price) || price < 0 || price > 500000) {
      return json({ ok: false, error: "Enter a valid price." }, 400);
    }

    let categoryId = b.categoryId ?? "";
    const newCat = (b.newCategory ?? "").trim().slice(0, 60);
    if (newCat) {
      categoryId = `cat-${slug(newCat) || crypto.randomUUID().slice(0, 6)}`;
      await db
        .prepare(
          `INSERT OR IGNORE INTO categories (id, name, sort) VALUES (?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM categories))`,
        )
        .bind(categoryId, newCat)
        .run();
    } else {
      const cat = await db.prepare(`SELECT id FROM categories WHERE id = ?`).bind(categoryId).first();
      if (!cat) return json({ ok: false, error: "Choose a category." }, 400);
    }

    const image = cleanImageUrl(b.imageUrl);
    if (image === false) return json({ ok: false, error: "Image must be an https:// link or a /images/… path." }, 400);
    const tags = (b.tags ?? []).filter((t) => typeof t === "string").slice(0, 6);
    const id = `custom-${crypto.randomUUID().slice(0, 8)}`;
    await db
      .prepare(
        `INSERT INTO menu_items (id, category_id, name, description, price_cents, tags_json, image_url, available, listed, sort)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1, (SELECT COALESCE(MAX(sort), 0) + 1 FROM menu_items))`,
      )
      .bind(id, categoryId, name, description, price, JSON.stringify(tags), image)
      .run();
    return json({ ok: true, id });
  }

  if (!b.id) return json({ ok: false, error: "Missing item id." }, 400);
  const exists = await db.prepare(`SELECT id FROM menu_items WHERE id = ?`).bind(b.id).first();
  if (!exists) return json({ ok: false, error: "Item not found." }, 404);

  switch (b.action) {
    case "list":
    case "unlist":
      await db
        .prepare(`UPDATE menu_items SET listed = ? WHERE id = ?`)
        .bind(b.action === "list" ? 1 : 0, b.id)
        .run();
      return json({ ok: true });
    case "image": {
      // Photo-only change (upload, replace or remove) without resending the rest.
      const image = cleanImageUrl(b.imageUrl);
      if (image === false) return json({ ok: false, error: "Image must be an https:// link or a /images/… path." }, 400);
      await db.prepare(`UPDATE menu_items SET image_url = ? WHERE id = ?`).bind(image, b.id).run();
      return json({ ok: true });
    }
    case "availability":
      await db
        .prepare(`UPDATE menu_items SET available = ? WHERE id = ?`)
        .bind(b.available ? 1 : 0, b.id)
        .run();
      return json({ ok: true });
    case "popular": {
      const row = await db.prepare(`SELECT tags_json FROM menu_items WHERE id = ?`).bind(b.id).first<{ tags_json: string }>();
      const rest = (JSON.parse(row?.tags_json ?? "[]") as string[]).filter((t) => t !== "popular");
      const tags = b.popular ? [...rest, "popular"] : rest;
      await db.prepare(`UPDATE menu_items SET tags_json = ? WHERE id = ?`).bind(JSON.stringify(tags), b.id).run();
      return json({ ok: true });
    }
    case "update": {
      const name = (b.name ?? "").trim().slice(0, 120);
      const price = typeof b.priceCents === "number" ? Math.round(b.priceCents) : NaN;
      if (!name || !Number.isFinite(price) || price < 0 || price > 500000) {
        return json({ ok: false, error: "Enter a name and valid price." }, 400);
      }
      const image = cleanImageUrl(b.imageUrl);
      if (image === false) return json({ ok: false, error: "Image must be an https:// link or a /images/… path." }, 400);
      await db
        .prepare(`UPDATE menu_items SET name = ?, price_cents = ?, description = ?, image_url = ? WHERE id = ?`)
        .bind(name, price, (b.description ?? "").trim().slice(0, 400) || null, image, b.id)
        .run();
      return json({ ok: true });
    }
    case "delete":
      if (!b.id.startsWith("custom-")) {
        return json({ ok: false, error: "Only custom items can be deleted; unlist catalog items instead." }, 400);
      }
      await db.prepare(`DELETE FROM menu_items WHERE id = ?`).bind(b.id).run();
      return json({ ok: true });
    default:
      return json({ ok: false, error: "Unknown action." }, 400);
  }
};

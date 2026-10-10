// Syncs the order app's catalog with the main site's menu (../content/menu.json).
//
//   node scripts/sync-catalog.mjs [--show-all]   → writes scripts/out/catalog-sync.sql
//   npx wrangler d1 execute DB --remote --config ./wrangler.toml --file scripts/out/catalog-sync.sql
//
// - Adds new dishes and categories; updates names, descriptions, prices, tags
//   and categories of existing ones (dollars -> cents).
// - Keeps what the admin set in the order app: photos (image_url), sold-out
//   (available) and, unless --show-all, whether a dish is shown (listed).
// - Dishes that disappeared from menu.json are hidden (listed = 0), not deleted,
//   so past orders still make sense. Custom items ("custom-…") are never touched.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const showAll = process.argv.includes("--show-all");
const menu = JSON.parse(readFileSync(new URL("../../content/menu.json", import.meta.url), "utf8"));
const q = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const out = [];

menu.sections.forEach((s, si) => {
  out.push(
    `INSERT INTO categories (id, name, blurb, sort) VALUES (${q(s.id)}, ${q(s.title)}, ${q(s.blurb)}, ${si})
  ON CONFLICT(id) DO UPDATE SET name = excluded.name, blurb = excluded.blurb, sort = excluded.sort;`,
  );
});

const ids = [];
menu.sections.forEach((s) =>
  s.items.forEach((it, ii) => {
    ids.push(it.id);
    const tags = (it.tags ?? []).filter((t) => t !== "availability");
    out.push(
      `INSERT INTO menu_items (id, category_id, name, description, price_cents, tags_json, available, listed, sort)
  VALUES (${q(it.id)}, ${q(s.id)}, ${q(it.name)}, ${q(it.desc)}, ${Math.round(it.price * 100)}, ${q(JSON.stringify(tags))}, 1, ${showAll ? 1 : 0}, ${ii})
  ON CONFLICT(id) DO UPDATE SET category_id = excluded.category_id, name = excluded.name, description = excluded.description,
    price_cents = excluded.price_cents, tags_json = excluded.tags_json, sort = excluded.sort${showAll ? ", listed = 1" : ""};`,
    );
  }),
);

// Hide catalog dishes no longer on the main menu.
out.push(
  `UPDATE menu_items SET listed = 0 WHERE id NOT LIKE 'custom-%' AND id NOT IN (${ids.map(q).join(", ")});`,
);

mkdirSync(new URL("./out/", import.meta.url), { recursive: true });
writeFileSync(new URL("./out/catalog-sync.sql", import.meta.url), out.join("\n") + "\n");
console.log(
  `Wrote scripts/out/catalog-sync.sql: ${menu.sections.length} categories, ${ids.length} dishes${showAll ? " (all shown)" : ""}`,
);

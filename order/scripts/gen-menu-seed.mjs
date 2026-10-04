// Generates migrations/0002_seed.sql from ../content/menu.json (dollars -> cents).
// Run: npm run seed:menu
import { readFileSync, writeFileSync } from "node:fs";

const menu = JSON.parse(readFileSync(new URL("../../content/menu.json", import.meta.url), "utf8"));
const q = (s) => (s == null ? "NULL" : `'${String(s).replace(/'/g, "''")}'`);
const out = [];

menu.sections.forEach((s, si) => {
  out.push(`INSERT INTO categories (id, name, blurb, sort) VALUES (${q(s.id)}, ${q(s.title)}, ${q(s.blurb)}, ${si});`);
  s.items.forEach((it, ii) => {
    const tags = (it.tags ?? []).filter((t) => t !== "availability");
    out.push(
      `INSERT INTO menu_items (id, category_id, name, description, price_cents, tags_json, available, listed, sort) VALUES (${q(it.id)}, ${q(s.id)}, ${q(it.name)}, ${q(it.desc)}, ${Math.round(it.price * 100)}, ${q(JSON.stringify(tags))}, 1, 0, ${ii});`,
    );
  });
});

// Default home for admin-created items (dashboard → Menu → custom item).
out.push(
  `INSERT INTO categories (id, name, blurb, sort) VALUES ('custom', 'Custom', NULL, ${menu.sections.length});`,
);

// Delivery areas served, one per suburb: $10 fee, free once the order
// subtotal reaches $60. Editable in dashboard → Delivery.
const suburbs = [
  ["Quakers Hill", "2763"],
  ["Marsden Park", "2765"],
  ["Riverstone", "2765"],
  ["Schofields", "2762"],
  ["The Ponds", "2769"],
  ["Tallawong", "2762"],
  ["Rouse Hill", "2155"],
  ["Kellyville Ridge", "2155"],
];
out.push(
  "INSERT INTO zones (id, name, areas, fee_cents, free_over_cents, eta_minutes, active, sort) VALUES\n" +
    suburbs
      .map(
        ([name, pc], i) =>
          `  (${q(`zone-${name.toLowerCase().replace(/\s+/g, "-")}`)}, ${q(`${name} ${pc}`)}, ${q(`${name} NSW ${pc}`)}, 1000, 6000, NULL, 1, ${i})`,
      )
      .join(",\n") +
    ";",
);
out.push(`

-- Placeholder payment details: set the real ones in dashboard → Settings.
INSERT INTO settings (key, value_json) VALUES
  ('restaurant', '{"name":"Kayal Foods","phone":"","email":"hello@kayal.com.au"}'),
  ('payment', '{"instructions":"Pay by bank transfer, then upload your receipt or enter the transaction reference on your order page.","bank":{"accountName":"REPLACE","bsb":"REPLACE","accountNumber":"REPLACE"},"payid":""}'),
  ('tax', '{"rateBps":1000,"inclusive":false}'),
  ('delivery', '{"pickupEnabled":true,"deliveryEnabled":true}');
`);

writeFileSync(new URL("../migrations/0002_seed.sql", import.meta.url), out.join("\n") + "\n");
console.log(`Wrote ${out.length} statements`);

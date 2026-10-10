/**
 * Public menu + checkout config. Only available items are returned; prices
 * are display-only (submit-order recomputes them server-side).
 */
import { getSetting, HOME_DEFAULTS, json, WHATSAPP_DEFAULTS } from "./_util";

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const [cats, items, zones, delivery, whatsapp, tax, restaurant, home] = await Promise.all([
    env.DB.prepare(`SELECT id, name, blurb FROM categories ORDER BY sort`).all(),
    env.DB.prepare(
      `SELECT id, category_id, name, description, price_cents, tags_json, image_url FROM menu_items WHERE available = 1 AND listed = 1 ORDER BY sort`,
    ).all<{ tags_json: string }>(),
    env.DB.prepare(
      `SELECT id, name, areas, fee_cents, free_over_cents, eta_minutes FROM zones WHERE active = 1 ORDER BY sort`,
    ).all(),
    getSetting(env.DB, "delivery", { pickupEnabled: true, deliveryEnabled: true }),
    getSetting(env.DB, "whatsapp", WHATSAPP_DEFAULTS),
    getSetting(env.DB, "tax", { rateBps: 0, inclusive: false }),
    getSetting(env.DB, "restaurant", { name: "Kayal Foods", phone: "" }),
    getSetting(env.DB, "home", HOME_DEFAULTS),
  ]);

  return json({
    ok: true,
    categories: cats.results,
    items: items.results.map((i) => ({ ...i, tags: JSON.parse(i.tags_json) as string[] })),
    zones: zones.results,
    delivery,
    whatsapp,
    tax,
    // Public subset only (the notification email stays private).
    restaurant: { name: restaurant.name, phone: restaurant.phone },
    home: { ...HOME_DEFAULTS, ...home },
  });
};

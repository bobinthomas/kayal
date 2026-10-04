# Kayal online ordering (order.kayal.com.au)

Same stack as `onam26/`: Next.js 16 static export → Cloudflare **Pages** + Pages Functions, **D1** (orders/menu/settings), **R2** (payment receipts), **Resend** (email), password-gated dashboard. Manual bank-transfer payment with receipt/reference proof.

## Flow
Menu → checkout (`POST /api/submit-order`, prices recomputed server-side) → invoice email + `/order/?id=&t=` page → customer uploads receipt/reference (`/api/upload-receipt`) → `/dashboard`: confirm → verify/reject payment → ready → completed. Each step emails the customer.

Statuses: pending → confirmed → payment_received | payment_failed → ready → completed (declined from pending/confirmed/payment_failed). Rules live in `functions/api/_util.ts` (`TRANSITIONS`).

## Setup (once)
```
cd order && npm install
npx wrangler d1 create kayal-order-db          # paste database_id into wrangler.toml
npx wrangler r2 bucket create kayal-order-receipts
npm run seed:menu                              # regenerates migrations/0002_seed.sql from ../content/menu.json
npx wrangler d1 migrations apply DB --remote
npx wrangler pages project create kayal-order
npx wrangler pages secret put DASHBOARD_PASSWORD --project-name=kayal-order
npx wrangler pages secret put RESEND_API_KEY --project-name=kayal-order
# optional: ORDER_TO_EMAIL (overrides the email in Settings), TURNSTILE_SECRET_KEY
```
Then open `/dashboard` and, before taking orders:
- **Settings**: enter the real bank details (the seed has `REPLACE` placeholders), restaurant contact, and tax. Tax defaults to 10% added on top; tick "prices already include GST" if menu prices are GST-inclusive.
- **Delivery**: check the delivery areas (seeded: $10 fee, free from $60) and the delivery/pickup toggles.
- **Menu**: add the dishes to show.

## Deploy
```
npm run build && npx wrangler pages deploy out --project-name=kayal-order
```
DNS: CNAME `order.kayal.com.au` → `kayal-order.pages.dev` at Bluehost.

## Local testing
`wrangler pages dev` run inside this repo picks up the *root* site's wrangler config and `.dev.vars`. Copy `out/ functions/ migrations/ wrangler.toml .dev.vars` (with `DASHBOARD_PASSWORD=...`) to a folder outside the repo, run `wrangler d1 migrations apply DB --local`, then `wrangler pages dev out --d1 DB=<database_id> --r2 RECEIPTS`.

## Storefront design
Flat, app-style UI (white screens, light-grey surfaces, green `brand` accent, black active pills, Poppins via `next/font`). Flow: welcome screen (once per session; photo + quick facts) → menu (deliver-to suburb picker, search, Veg filter, category pills, "Popular Dishes" photo cards = dishes tagged `signature` then dishes with photos, full menu list) → My Cart (free-delivery meter, totals incl. GST) → Checkout → order page (progress tracker, copy buttons for bank details, receipt upload). Bottom tab bar: Home, Search, black centre cart, Orders (orders placed or opened on this device, with live status — `lib/recentOrders.ts`), Info (delivery areas/fees, pickup, payment, call button when a phone is set in Settings). Screens: `components/shop/`; each pushes a `#cart`/`#checkout`/`#orders`/`#info` history entry so the phone back button works. Palette tokens in `app/globals.css`; totals preview in `lib/totals.ts` (mirrors the server).

Dish photos: `menu_items.image_url`. In dashboard → Menu, every dish has a photo slot — "Add photo" when picking a catalog dish, on the custom-item form, and on each listed dish. Photos are shrunk in the browser (max 1200px WebP), uploaded by `/api/admin-upload-image` to the R2 bucket under `menu-images/`, and served publicly by `/api/menu-image/<uuid>.webp` (only that prefix and uuid-shaped names are reachable, so receipts in the same bucket stay private). `migrations/0004_menu_images.sql` seeds six catalog photos from `public/images/dishes/`. Dishes without a photo show their category emoji.

## Home screen (dashboard → Settings → Home screen)
Badge, headline, text, button label and photo of the customer welcome screen are a `home` setting (defaults in `HOME_DEFAULTS`, `functions/api/_util.ts`), served with `/api/menu`. The quick facts (suburbs, free-delivery amount, pickup) come from live settings. Preview any time at `/?welcome`.

## Syncing the catalog from the main site
`npm run sync:catalog` (add `-- --show-all` to also show every dish) writes `scripts/out/catalog-sync.sql` from `../content/menu.json`, then:
```
npx wrangler d1 execute DB --remote --config ./wrangler.toml --file scripts/out/catalog-sync.sql
```
It adds new dishes and updates names/prices/categories, keeps photos, sold-out flags and (without `--show-all`) which dishes are shown, hides dishes removed from the main menu, and never touches custom items. Run wrangler with `--config ./wrangler.toml` from this folder — otherwise it can pick up the main site's config.

## Menu (dashboard → Menu tab)
The storefront shows only items the admin has added. The full catalog (seeded from `content/menu.json`) starts hidden; pick dishes from the dropdown to show them. Custom items (own name, price, category or a new category) are shown as soon as they're created. Catalog items can be edited, marked sold out or removed from the page; custom items can also be deleted. Orders for hidden or sold-out items are rejected server-side. Custom items default to the "Custom" category; "+ New category…" creates another.

## Delivery (dashboard → Delivery tab)
Each area has a name, the suburbs/postcodes it covers (admin reference), a fee, a free-delivery threshold (fee waived when the subtotal reaches it; 0 = never free), an optional time estimate, and a show/hide toggle. Fee logic: `deliveryFee()` in `functions/api/_util.ts` (server, authoritative) mirrored in `lib/api.ts` for the checkout preview. Delivery and pickup can each be switched off here.

## Settings (dashboard → Settings tab)
Restaurant (name, phone, notification email), payment details (instructions, account name, BSB, account number, PayID — shown on invoices and the order page) and tax. `functions/api/admin-settings.ts` only accepts these keys and rebuilds each value field by field.

## WhatsApp group
Checkout has an "I'm in the Kayal WhatsApp group" checkbox (self-declared, not verified — WhatsApp has no API for ordinary groups). Customers who don't tick it are flagged in the Orders tab; add them in the WhatsApp app, then press "I've added them" (`/api/whatsapp-added`), which clears the flag on every order from that number (phones compared via `normalizePhone()`). The new-order email to the owner also says whether to add them. Optional member discount on food: Settings → WhatsApp group member pricing (off by default, 0–50%); it's applied before delivery and tax, and the free-delivery threshold uses the pre-discount subtotal. Columns added in `migrations/0003_whatsapp.sql`.

## Not yet built (see plan)
Configurable states, notification templates, SLAs, reports, SMS/WhatsApp API, ADMIN_RATE_LIMITER (code supports the binding; Pages config for it not wired).

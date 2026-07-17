# Onam Sadhya 2026 — onam.kayal.com.au

Standalone booking microsite for Kayal Foods' Onam Sadhya 2026 event —
a Q&A-style wizard for dine-in/takeaway bookings, a password-gated
admin dashboard, and a kitchen prep view. Deployed as its own
Cloudflare Pages project, independent of the main kayal.com.au site,
sharing only its brand styling.

**Stack:** Next.js (App Router, static export) · TypeScript (strict) ·
Tailwind CSS v4 · Cloudflare Pages + Pages Functions · Cloudflare D1
(SQLite) · Cloudflare R2 · Resend (email).

## Architecture

The site is a fully static export (`output: "export"` in
`next.config.ts`) — there is no Next.js server at runtime. All dynamic
behavior (booking submission, dashboard data, file uploads) is handled
by **Cloudflare Pages Functions** living in `functions/api/*.ts`,
deployed alongside the static assets to the same Pages project. This
mirrors the pattern used by the main kayal.com.au repo.

```
Browser (static HTML/JS)
   │
   ├─▶ POST /api/submit-booking ───▶ D1 (bookings table) + Resend email
   ├─▶ POST /api/upload-receipt ───▶ R2 (kayal-onam26-receipts bucket)
   ├─▶ POST /api/track-event ──────▶ D1 (analytics_events table)
   │
   └─▶ /dashboard, /kitchen (password-gated, client-side)
          ├─▶ GET  /api/list-bookings
          ├─▶ GET  /api/list-events
          ├─▶ GET  /api/receipt?id=…      (streams from R2)
          └─▶ POST /api/update-booking-status  (→ Resend email to customer)
```

No env var or secret is required for local static rendering — only
the Pages Functions need the bindings/secrets listed below, and only
when actually invoked (submitting a booking, viewing the dashboard).

## Directory structure

```
app/
  page.tsx              Landing page: hero image + <BookingWizard />
  dashboard/page.tsx     Password-gated bookings dashboard
  kitchen/page.tsx       Password-gated kitchen prep view
components/
  BookingWizard.tsx      Step state machine — owns all wizard state
  booking-wizard/        One component per step (see "Booking flow" below)
  dashboard/             PasswordGate, SummaryCounts, BookingsTable, AnalyticsSummary
  kitchen/               KitchenDayView (grouped totals + per-booking list)
data/
  onam-event.ts          Single source of truth: dates, prices, bank details,
                          time slots, footnote copy, and all formatting helpers
lib/
  api.ts                 fetch wrappers for every /api/* endpoint
  analytics.ts            Session id + track() beacon sender
functions/api/
  submit-booking.ts       Public booking intake (validates, prices, stores, emails)
  upload-receipt.ts       Public receipt file upload → R2
  track-event.ts          Public analytics beacon intake → D1
  list-bookings.ts        Password-gated: all bookings
  list-events.ts          Password-gated: all analytics events
  update-booking-status.ts  Password-gated: confirm/decline → emails customer
  receipt.ts              Password-gated: streams a booking's receipt from R2
  _auth.ts                Shared dashboard-password check (not a route)
  _mail.ts                Shared Resend sender (not a route)
migrations/               D1 schema, applied in order (see "Data model")
wrangler.toml             D1 + R2 bindings, used for local dev and deploys
```

## Booking flow

`BookingWizard.tsx` is a client-side step machine (no page reloads).
Step order depends on service type — see `stepsForService()` in
`components/booking-wizard/types.ts`:

```
service → date → [timeslot, dine-in only] → details → contact → review → payment → done
```

1. **service** — Dine-in or Takeaway.
2. **date** — filtered to dates valid for that service (`datesForService()`).
3. **timeslot** *(dine-in only)* — Lunch (12/1/2pm, every dine-in date) and,
   on Aug 26/29/30 only, Dinner (6/7/8pm) — see `dineInSessionsForDate()`.
4. **details** — guest count (dine-in) or package size 2/4/10/20 (takeaway),
   plus WhatsApp Members Special Price vs Card/Non-WhatsApp (pricing tier only).
5. **contact** — name, phone (required), email (optional, triggers a
   confirmation email if given), notes, honeypot field.
6. **review** — read-only recap with per-field "Edit" links back to earlier steps.
7. **payment** — advance-payment message (bank details, computed total,
   dine-in grace-period footnote) + **receipt upload or bank reference
   number (at least one required)**. Submitting here is what actually
   calls the API — Review no longer submits directly.
8. **done** — confirmation screen + Call/WhatsApp quick links.

Every step view and key interaction is beaconed to `/api/track-event`
(see `lib/analytics.ts`) for the dashboard's funnel/drop-off view — no
third-party analytics, no cookies.

## Data model (Cloudflare D1)

Single database `kayal-onam26-db`, binding `DB`. Schema is the union
of `migrations/0001`–`0004`, applied in order:

```sql
bookings (
  id, created_at, updated_at,
  service_type,      -- 'dine_in' | 'takeaway'
  event_date,        -- 'YYYY-MM-DD'
  time_slot,         -- 'HH:MM', dine_in only
  guests,            -- dine_in only
  package_size,      -- 2|4|10|20, takeaway only
  payment_method,    -- 'whatsapp_cash' | 'card' (pricing tier, not payment channel)
  price_total,       -- cents; always recomputed server-side, never trusted from client
  customer_name, customer_phone, customer_email, notes,
  receipt_key,       -- R2 object key, if a receipt was uploaded
  payment_reference, -- typed bank transfer reference, if given instead
  status             -- 'pending' | 'confirmed' | 'declined'
)

analytics_events (
  id, created_at, session_id, event_name, step, detail
)
```

`price_total` is always recomputed server-side in `submit-booking.ts`
from `data/onam-event.ts`'s price tables — a tampered client-sent price
is never trusted.

## File storage (Cloudflare R2)

Bucket `kayal-onam26-receipts`, binding `RECEIPTS`. Receipt uploads
(`upload-receipt.ts`) accept JPG/PNG/WEBP/PDF up to 8MB, stored under a
random key. Objects are **not public** — `receipt.ts` streams a file
only after a valid `X-Dashboard-Password` header, looked up by
booking id (never exposes raw R2 keys to the browser).

## Email (Resend)

Sent from the verified `mail.kayal.com.au` subdomain (SPF/DKIM
verified in Resend, DNS added at Bluehost — scoped to that subdomain
only, doesn't touch the root domain's existing email). Shared sender
logic lives in `functions/api/_mail.ts`.

Two customer-facing emails:
- **On submission** (`submit-booking.ts`): "We've received your Onam
  Sadhya booking request" — only sent if the customer gave an email.
- **On confirm/decline** (`update-booking-status.ts`): "Your booking is
  confirmed" or a polite decline notice — same, email-optional.

Plus one owner notification per submission, to `ONAM_TO_EMAIL`
(default `hello@kayal.com.au`).

> MailChannels' free Cloudflare-anonymous relay was discontinued
> (confirmed via a direct 401 from their API) — this is why Resend is
> used instead of the pattern in the main site's `functions/api/contact.ts`.
> That form likely has the same silent-failure bug and hasn't been
> fixed as part of this project.

## Dashboard (`/dashboard`) and Kitchen view (`/kitchen`)

Both gated by a single shared secret (`DASHBOARD_PASSWORD`), entered
once via `PasswordGate` and stored in `sessionStorage` — it auto-unlocks
on the other page within the same browser session.

- **Dashboard**: bookings table (filter by status/service, confirm/decline
  per row, view uploaded receipt or reference), summary counts, and a
  collapsed-by-default "Clicks & drop-offs" funnel/analytics section.
- **Kitchen**: single-day view (date picker, defaults to the next
  upcoming event date), **confirmed bookings only**, grouped as
  Dine-in (by Lunch/Dinner session and time slot) and Takeaway (by
  package size), each with totals and a per-booking list including
  notes. Has a print button and print-friendly styling.

## Environment variables & bindings

Set per-project in the Cloudflare Pages dashboard (production) and in
`.dev.vars` (local only, gitignored):

| Name | Required | Purpose |
|---|---|---|
| `DASHBOARD_PASSWORD` | Yes | Shared secret for `/dashboard`, `/kitchen`, and the password-gated endpoints |
| `RESEND_API_KEY` | Yes | Resend API key for the `mail.kayal.com.au` sender |
| `ONAM_TO_EMAIL` | No | Owner notification recipient override (default `hello@kayal.com.au`) |
| `TURNSTILE_SECRET_KEY` | No | Enables Turnstile bot verification on `submit-booking.ts` |
| `DB` (D1 binding) | Yes | `kayal-onam26-db` — see `wrangler.toml` |
| `RECEIPTS` (R2 binding) | Yes | `kayal-onam26-receipts` — see `wrangler.toml` |

## Develop

```bash
npm install
npm run build                      # static export → out/
npx wrangler pages dev out         # local server with D1 + R2 simulation + .dev.vars
npm run lint
npm run typecheck                  # tsc for app + functions
```

D1 migrations, local vs. remote:

```bash
npx wrangler d1 migrations apply kayal-onam26-db --local   # local dev
npx wrangler d1 migrations apply kayal-onam26-db --remote  # production
```

## Deploy (Cloudflare Pages)

This project deploys via **direct upload** (`wrangler pages deploy`),
not GitHub-integrated builds — pushing to `main` alone does not
redeploy it.

```bash
npm run build
npx wrangler pages deploy out --project-name=kayal-onam26 --branch=main
```

- Pages project: `kayal-onam26`, custom domain `onam.kayal.com.au`
  (CNAME added at Bluehost — the root `kayal.com.au` zone is not on
  Cloudflare, so this is a partial/external-DNS custom domain, not a
  full zone).
- CI (`.github/workflows/ci-onam26.yml`) runs lint/typecheck/build on
  every push touching `onam26/**`, but does **not** deploy.

## Editing content

All dates, prices, time slots, bank details, and copy render from
`data/onam-event.ts` — edit there, not inline in components.

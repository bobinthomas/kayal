# Kayal Foods — kayal.com.au

Static website for Kayal Foods, the naadan Kerala restaurant in Moorebank,
Sydney. Built per the June 2026 rebuild PRD.

**Stack:** Next.js (App Router, static export) · TypeScript (strict) ·
Tailwind CSS v4 · Cloudflare Pages + Pages Functions.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run lint       # eslint
npm run typecheck  # tsc for app + functions
npm run build      # static export → out/
npm run assets     # regenerate OG images + apple icon (sharp)
```

## Editing content

All repeated copy renders from typed data files — edit, commit, push:

| File | Contents |
|---|---|
| `data/restaurant.ts` | NAP, hours, booking policies, socials, WhatsApp |
| `data/menu.ts` | Full menu (sections, items, prices, badges) |
| `data/specials.ts` | Specials grouping + home-page featured picks |
| `data/reviews.ts` | Curated review quotes |
| `data/copy.ts` | Verbatim brand copy, marquee dishes, catering categories |

## Deploy (Cloudflare Pages)

- Build command: `npm run build` · Output directory: `out`
- `functions/api/contact.ts` handles the contact/catering form
  (honeypot + optional Turnstile + MailChannels → hello@kayal.com.au).
- `functions/api/event.ts` collects booking-intent beacons.
- `public/_redirects` carries all legacy WordPress 301s.
- Env vars (optional): `TURNSTILE_SECRET_KEY`, `CONTACT_TO_EMAIL`,
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (build-time, enables the widget).

## Before launch — owner confirmations (PRD §11)

- ⛔ Current opening hours (`data/restaurant.ts`)
- ⛔ Real photography (`public/images/*.svg` are branded placeholders)
- ⛔ WhatsApp number + booking policy wording sign-off
- ◻ Toddy licensing accuracy, mini-mart status, chef story, ABN

## Notes

- Placeholder images are SVGs; swap with pre-optimized AVIF/WebP photos when
  supplied (keep hero ≤ 180 KB per the performance budget).
- Review quotes in `data/reviews.ts` must be replaced with verbatim GBP quotes.

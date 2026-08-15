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

Menu items/prices, restaurant info, reviews, and site copy are all editable at
**`/admin`** (password-gated) — no code changes needed. See
"Admin backend" below for how that works and how to set it up.

The underlying source of truth is `content/*.json`, which `/admin` edits via
GitHub commits. The `data/*.ts` files just import that JSON and re-export it
with types — edit `content/*.json` directly (or via `/admin`), not `data/*.ts`:

| Content file | Contents |
|---|---|
| `content/restaurant.json` | NAP, hours, booking policies, socials, WhatsApp |
| `content/menu.json` | Full menu (sections, items, prices, tags) |
| `content/specials.json` | Home-page featured specials picks |
| `content/reviews.json` | Curated review quotes |
| `content/copy.json` | Verbatim brand copy, marquee dishes, catering categories |
| `content/menu-meta.json` | Menu page intro copy, nav labels, featured spotlights |

## Admin backend

`/admin` is a password-gated content editor. There's no database — every save
is a real commit to this repo via the GitHub Contents API (made by a Cloudflare
Worker route, `functions/api/admin/*`), which lands on `main` and triggers a
normal rebuild (~1–2 min to go live). That means content history is just
`git log`, and a bad edit is a `git revert` away.

Auth is a single shared password sent as an `X-Admin-Password` header on every
admin API call (checked with a constant-time comparison) — no cookies or
sessions, mirroring the pattern already used in `onam26/functions/api/_auth.ts`.

**Note on hosting:** by the time this was built, Cloudflare's dashboard had
moved new-project creation from "Pages" to a unified **Workers** flow
(`Create application` → `Import a repository`, deploying via
`npx wrangler deploy` instead of the old Pages-specific pipeline). `onam26` —
created earlier — is still classic Pages (`onam26/wrangler.toml`,
`pages_build_output_dir`); this project targets the current Workers flow
instead. It uses the same `functions/api/admin/*` file-based-routing code
either way — `wrangler pages functions build` compiles that directory into a
single Worker script as part of the build (see `package.json`'s `cf:build`
script and `wrangler.jsonc`'s `assets`/`main` config). This has been verified
locally end-to-end (`npm run cf:dev`): static pages, `/admin`, and the
authenticated `/api/admin/*` routes all serve correctly under this setup.

**One-time setup** (do this once, on Cloudflare + GitHub):

1. **GitHub token** — create a fine-grained PAT at GitHub → Settings →
   Developer settings → Personal access tokens → Fine-grained tokens.
   Resource owner `bobinthomas`, repository access limited to **this repo
   only**, permission **Contents: Read and write**, a bounded expiry (not
   "no expiration"). Copy the token once — it's only shown at creation.
2. **Cloudflare Workers project** — Workers & Pages → Create application →
   Import a repository → `bobinthomas/kayal`. On the "Set up your
   application" screen:

   **Known gotcha:** the Git connection this creates can silently drop
   (Settings shows a "This project is disconnected from your Git account"
   banner) without anything else in the project config changing — build
   command, deploy command, branch, and env vars all stay intact, but pushes
   stop triggering builds (the Build history tab shows nothing new, and
   existing entries all say "Manually deployed" instead of being tied to a
   commit). If a content save from `/admin` isn't showing up live after a
   few minutes, check Settings → Git repository for that banner first,
   click **Manage** to re-authorize, then confirm Build history shows a new
   build actually landing.
   - Project name: your choice (e.g. `kayal`) — becomes part of the default
     `*.workers.dev` URL
   - Build command: `npm run cf:build`
   - Deploy command: leave the default, `npx wrangler deploy`
   - Path: leave as `/` (repo root — unlike `onam26`/`kayalevents`, this
     project isn't in a subfolder)
   - This is a brand-new, separate project from `kayal-onam26`, with its own
     domain and no shared bindings/secrets. Nothing about this setup reads,
     writes, or redeploys `kayal-onam26` / `onam.kayal.com.au`. One caveat:
     unlike classic Pages, Workers Builds has no per-path build exclusion, so
     a commit touching only `onam26/**` will still trigger a (harmless, just
     wasted) rebuild of this project.
3. **Env vars** — add on the same "Set up your application" screen (Variable
   name/value fields, with an "Encrypt" option for secrets), or afterward
   under the project's Settings → Variables and Secrets:
   - `ADMIN_PASSWORD` — a new password you choose (encrypt it)
   - `GITHUB_TOKEN` — the PAT from step 1 (encrypt it)
   - `GITHUB_OWNER` = `bobinthomas`
   - `GITHUB_REPO` = `kayal`
   - `GITHUB_BRANCH` = `main` (must match the project's production branch, or
     saves won't trigger a rebuild)
   - carry forward `TURNSTILE_SECRET_KEY`/`CONTACT_TO_EMAIL` if set
   - if added after the first deploy, trigger a redeploy afterward — env vars
     only take effect on the next build
4. **Test domain: `staging.kayal.com.au`** — Bluehost hosts DNS for
   `kayal.com.au` (nameservers `ns1`/`ns2.bluehost.in`) but can't run
   Next.js itself, so the site is *served* by Cloudflare while DNS *records*
   stay in Bluehost's panel. To wire up the subdomain: on the new Worker
   project, open the **Triggers** (or **Domains**) tab → Add Custom Domain →
   `staging.kayal.com.au`, then follow whatever CNAME target Cloudflare
   displays and create that record for `staging` at Bluehost — the same
   pattern already live for `onam.kayal.com.au` → `kayal-onam26.pages.dev`
   (verified via `nslookup`: the root zone's nameservers are still
   Bluehost's; only the one `onam` record was added there). This only adds
   one new subdomain record — the root zone and `onam.kayal.com.au` are
   untouched. `/admin` and the whole site are reachable at
   `https://staging.kayal.com.au/admin` once DNS propagates. Pointing the
   root `kayal.com.au` at this project is a separate, later "go live" step
   (see "Before launch" below) — not done as part of this setup.

**Local development** — copy `.dev.vars.example` to `.dev.vars` (gitignored)
and fill in real values, then:

```bash
npm run cf:dev   # builds (next build + compiles functions/) and serves via wrangler dev
```

## Deploy (Cloudflare Workers)

- Build command: `npm run cf:build` (runs `next build`, then compiles
  `functions/` into a Worker script via `wrangler pages functions build`) ·
  Deploy command: `npx wrangler deploy` · config: `wrangler.jsonc`
  (`assets.directory` = `out`, `main` = the compiled Worker script)
- `functions/api/contact.ts` handles the contact/catering form
  (honeypot + optional Turnstile + MailChannels → hello@kayal.com.au). Note:
  MailChannels' free relay was discontinued — this form is likely silently
  failing (see `onam26/README.md`, which switched to Resend for this reason).
- `functions/api/event.ts` collects booking-intent beacons.
- `functions/api/admin/*` powers `/admin` — see "Admin backend" above.
- `public/_redirects` carries all legacy WordPress 301s.
- Env vars (optional): `TURNSTILE_SECRET_KEY`, `CONTACT_TO_EMAIL`,
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (build-time, enables the widget).
- Env vars (required for `/admin`): see "Admin backend" above.

## Before launch — owner confirmations (PRD §11)

- ⛔ Current opening hours (`data/restaurant.ts`)
- ⛔ Real photography (`public/images/*.svg` are branded placeholders)
- ⛔ WhatsApp number + booking policy wording sign-off
- ◻ Toddy licensing accuracy, mini-mart status, chef story, ABN

## Notes

- Placeholder images are SVGs; swap with pre-optimized AVIF/WebP photos when
  supplied (keep hero ≤ 180 KB per the performance budget).
- Review quotes in `data/reviews.ts` must be replaced with verbatim GBP quotes.

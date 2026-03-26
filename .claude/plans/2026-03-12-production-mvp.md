# Plan: Lingua — Production MVP

## Context

The current app is a working SvelteKit MVP using **hardcoded mock data** for all routes. The goal is to promote it to a production-ready state by wiring in the full intended tech stack: TailwindCSS v4 with a custom design system, PostgreSQL Full-Text Search configured for Catalan, live database queries, PWA installability, and PostHog analytics — all testable with real (but seeded fake) data.

No routing changes are needed. No authentication. No admin panel. This is purely the infrastructure layer.

---

## Generated Design System

### Color Palette (easy to change: update `@theme` in `app.css`)

**Primary — Vermillion/Terracotta (base: `#fb542b`)**

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#fff4f0` | Tint backgrounds |
| `primary-100` | `#ffe4d9` | Hover states on light |
| `primary-200` | `#ffc5ad` | — |
| `primary-300` | `#ff9e7a` | — |
| `primary-400` | `#fd7347` | — |
| `primary-500` | `#fb542b` | **Base brand color** |
| `primary-600` | `#e03a12` | Hover on brand elements |
| `primary-700` | `#ba2d0e` | Active/pressed |
| `primary-800` | `#992714` | Text on light bg |
| `primary-900` | `#7e2416` | Dark headings |

**Neutral — Warm Zinc**

| Token | Hex | Usage |
|---|---|---|
| `neutral-50` | `#fafaf9` | Page background |
| `neutral-100` | `#f4f4f3` | Card backgrounds |
| `neutral-200` | `#e6e6e4` | Borders |
| `neutral-300` | `#d0d0cd` | Dividers |
| `neutral-400` | `#a6a6a2` | Disabled/placeholder |
| `neutral-500` | `#75756f` | Muted text |
| `neutral-600` | `#56564f` | Secondary text |
| `neutral-700` | `#3d3d37` | — |
| `neutral-800` | `#272722` | Primary text |
| `neutral-900` | `#141410` | Headings |

**Semantic aliases** (use these in components, not raw palette):
- `--color-brand` → primary-500
- `--color-brand-hover` → primary-600
- `--color-brand-light` → primary-100
- `--color-surface` → neutral-50
- `--color-surface-card` → white
- `--color-text` → neutral-800
- `--color-text-muted` → neutral-500
- `--color-border` → neutral-200

**To change the brand color later**: update only the `primary-*` values in `@theme`. Semantic aliases propagate everywhere automatically.

### Typography
- **Headings**: `font-serif` — "Lora" (Google Font, elegant for literary content) or Georgia as fallback
- **Body/UI**: `font-sans` — "Inter" (Google Font) or system-ui as fallback
- Scale: xs(0.75) / sm(0.875) / base(1) / lg(1.125) / xl(1.25) / 2xl(1.5) / 3xl(1.875) / 4xl(2.25)

### Component Spec (for `/design-system` route)
- **Button**: primary (bg-brand), secondary (border + brand text), ghost (text only)
- **Card**: white bg, border-border, shadow-sm, rounded-lg, padding-6
- **Badge**: small pill, bg-brand-light, text-brand-800
- **Input**: border-border, focus:ring-brand, rounded-md
- **SearchInput**: Input + submit button, full-width on mobile

---

## Steps

### Step 0 — Generate Initial CLAUDE.md ✅

**Goal:** Create a baseline `CLAUDE.md` at the project root so it's available from the very start. It captures the current state of the project and the target architecture. We'll update it incrementally as each subsequent step is completed, adding learnings, gotchas, and decisions we discover along the way.

**New file:** `CLAUDE.md`

Content should cover:
- **Project overview**: Lingua — Catalan phrase/idiom dictionary, SvelteKit 2 + Svelte 5
- **Current state**: mock data, no Tailwind, no PWA, no analytics yet
- **Target architecture** (what the plan will build): TailwindCSS v4, PostgreSQL FTS with Catalan, PWA, PostHog
- **Existing file structure**: routes, db schema, params, app.css
- **Existing commands**: `npm run dev`, `npm run build`, `npm run check`, `docker compose up -d`, `npm run db:generate`, `npm run db:push`, `npm run db:studio`
- **Environment variables**: `DATABASE_URL`
- **Conventions** (known so far): Svelte 5 runes, Drizzle ORM, Vercel adapter, `lang="ca"` in app.html

This is intentionally a living document — each step will append or update sections (e.g., Step 1 adds Tailwind conventions, Step 2 adds FTS architecture, Step 6 adds PostHog env vars, etc.).

**Verification:** `CLAUDE.md` exists at project root, is readable, and accurately reflects the pre-implementation state.

---

### Step 1 — TailwindCSS v4 + Design System ✅

**Completed.** All changes implemented and verified.

**What was done:**
- Installed `tailwindcss` + `@tailwindcss/vite` as dev dependencies
- `vite.config.ts` — added `tailwindcss()` plugin before `sveltekit()`
- `src/app.css` — replaced entirely with Tailwind v4 `@import "tailwindcss"`, `@theme` block with primary/neutral palettes + semantic aliases (`brand`, `brand-hover`, `brand-light`, `surface`, `surface-card`, `base`, `muted`, `border`), Google Fonts import, and base body/heading styles
- `src/app.html` — added `<link rel="preconnect">` for Google Fonts
- `src/routes/+layout.svelte` — migrated to Svelte 5 (`$props()` + `{@render children()}`) with Tailwind header/nav
- All `+page.svelte` files — replaced inline styles with Tailwind utilities, migrated to Svelte 5 runes (`$props()`, `$state()`)
- Created `/design-system` (English) and `/sistema-disseny` (Catalan) — full design system reference pages with 6 sections: Colors, Typography, Buttons, Cards, Badges, Forms. Tab-style anchor navigation.

**Deviations from original plan:**
- Semantic alias `--color-text` renamed to `--color-base`, `--color-text-muted` renamed to `--color-muted` (user request)
- Added `--color-surface-card` alias (white) not in original plan
- Design system page created in two languages: `/design-system` (EN) + `/sistema-disseny` (CA) instead of single route
- Tab-style section nav instead of pill links (user preference)

**Verification:** `npm run dev` → terracotta header renders, `/design-system` and `/sistema-disseny` show all swatches/components, `npm run check` passes with 0 errors and 0 warnings.

---

### Step 2 — Database Schema + Catalan FTS Configuration ✅

**Completed.** All changes implemented and verified.

**What was done:**
- Installed `tsx` and `@types/node` as dev dependencies (scripts use `tsx --env-file .env` instead of dotenv)
- Split DB setup into two phases to avoid trigger-before-table dependency:
  - `setup-fts.sql` — Phase 1 (before `db:push`): `unaccent` extension + `public.catalan` FTS config
  - `setup-trigger.sql` — Phase 2 (after `db:push`): trigger function + trigger + backfill
  - `run-setup.ts` — Runner script accepting `fts` or `trigger` argument
- `package.json` — added `db:setup:fts` and `db:setup:trigger` scripts
- `schema.ts` — `tsvector` customType for `search_vector` column, two GIN indexes:
  1. `search_vector_idx` — GIN on stored tsvector (catalan stemmed, primary FTS)
  2. `search_simple_idx` — GIN expression index on `to_tsvector('simple', phrase_text)` (fallback for archaic words)
- Drizzle's expression GIN index API worked correctly — no need for raw SQL fallback

**FTS Architecture Decisions:**
- Copied from `pg_catalog.catalan` (not `spanish`) for proper Catalan morphology
- Added `catalan_unaccent` pre-filter for accent-insensitive matching (e.g., `cafè` matches `cafe`)
- **No stopwords**: PostgreSQL has no `catalan.stop` file. Intentionally skipped — at 500 phrases the overhead is ~15KB (negligible). To add later: place `catalan.stop` file + run `UPDATE phrases SET phrase_text = phrase_text;` to recalculate all vectors
- Hunspell/ispell dicts would improve accuracy but cannot be used on Neon (requires filesystem access)
- `unaccent` extension is available on Neon

**Run order (CRITICAL — note the split):**
```bash
docker compose up -d
npm run db:setup:fts      # Phase 1: extensions + FTS config (no table dependency)
npm run db:generate
npm run db:push           # Creates tables
npm run db:setup:trigger  # Phase 2: trigger + backfill (requires phrases table)
```

**Verification:** `search_vector` column is `tsvector` type, both GIN indexes exist, FTS config `public.catalan` uses `catalan_unaccent` + `catalan_stem` for word/hword tokens, trigger active on `phrases` table, `npm run check` passes with 0 errors and 0 warnings.

---

### Step 3 — Seed Script ✅

**Completed.** All changes implemented and verified.

**What was done:**
- Created `src/lib/server/db/seed.ts` — inserts 5 categories and 25 Catalan idiomatic phrases (5 per category), plus 6 bidirectional phrase relations (12 rows total — both directions)
- Categories: Amor i Sentiments, Animals, Menjar i Beguda, Meteorologia, Cos i Salut
- `searchVector` omitted from inserts — the DB trigger fills it automatically on INSERT
- Script structure: delete relations → delete phrases → delete categories → insert categories (capture IDs) → insert phrases using captured IDs → insert relations
- `package.json` — added `"db:seed": "tsx --env-file .env src/lib/server/db/seed.ts"`
- DB connection uses `postgres(process.env.DATABASE_URL!)` (same pattern as `run-setup.ts`)

**Verification:** `npm run db:seed` → 5 categories, 25 phrases with non-null `search_vector` values (e.g., `'cor':3A 'el':2A 'ten':1A 'trenc':4A`), 12 relation rows. `npm run check` passes with 0 errors and 0 warnings.

---

### Step 4 — Wire Routes to Real Database Queries ✅

**Completed.** All mock data replaced with live Drizzle queries.

**What was done:**
- `src/routes/expressions/+page.server.ts` — `db.select().from(categories).orderBy(categories.name)`
- `src/routes/expressions/[slug]/+page.server.ts` — category lookup by slug (404 if not found), phrases by categoryId ordered by phraseText
- `src/routes/expressions/[id=integer]/+page.server.ts` — phrase by ID (404 if missing), category lookup for name/slug, related phrases via `phraseRelations` + `inArray` query
- `src/routes/cerca/+page.server.ts` — two-stage FTS with AND logic:
  - `buildTsquery()` splits input on whitespace, joins with `&`, adds `:*` prefix on last token (e.g., `"bots i"` → `bots & i:*`)
  - Stage 1: `to_tsquery('public.catalan', ...)` against `searchVector` column
  - Stage 2 (fallback if 0 results): `to_tsquery('simple', ...)` against expression index
- Updated 3 `.svelte` templates: `phrase.text` → `phrase.phraseText` in `[slug]/+page.svelte`, `[id=integer]/+page.svelte`, `cerca/+page.svelte`

**Deviations from original plan:**
- FTS uses AND logic with prefix on last token instead of single-token prefix — better for multi-word searches like "cor trencat" or "bots i barrals"
- Empty/whitespace search queries short-circuit to empty results (no DB hit)

**Verification:** `npm run check` passes with 0 errors and 0 warnings. All 5 routes verified in browser with live DB data: `/expressions` shows 5 categories, `/expressions/animals` shows 5 phrases, `/expressions/26` shows phrase detail with related phrases, `/cerca?paraula=ploure` returns "Ploure a bots i barrals", `/cerca?paraula=cor` returns "Tenir el cor trencat".

---

### Step 5 — PWA Setup ✅

**Completed.** All changes implemented and verified.

**What was done:**
- Installed `@vite-pwa/sveltekit` and `sharp` (+ `@types/sharp`) as dev dependencies
- `vite.config.ts` — added `SvelteKitPWA` plugin after `sveltekit()` with `generateSW` strategy, `autoUpdate` registration, manifest metadata, and `NetworkFirst` runtime caching for navigations (3s network timeout)
- `svelte.config.js` — disabled SvelteKit's built-in SW registration (`serviceWorker: { register: false }`)
- `src/routes/+layout.svelte` — added `onMount` with dynamic `import('virtual:pwa-register')` for SW registration
- `tsconfig.json` — added `"types": ["vite-plugin-pwa/client"]` for `virtual:pwa-register` type support
- `src/app.html` — added `<meta name="theme-color">`, Apple mobile web app meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-mobile-web-app-title`), and `<link rel="apple-touch-icon">`
- Created `static/icons/lingua.svg` (source SVG: terracotta rounded square with white "L")
- Created `scripts/generate-icons.ts` — uses `sharp` to generate PNGs from the source SVG
- Generated `static/icons/icon-192.png`, `static/icons/icon-512.png`, and `static/favicon.png`

**Icon Generation (for future reference):**
To regenerate icons after modifying `static/icons/lingua.svg`:
```bash
npx tsx scripts/generate-icons.ts
```
This produces three files from the SVG:
- `static/icons/icon-192.png` (192×192) — PWA manifest icon
- `static/icons/icon-512.png` (512×512) — PWA manifest icon (any + maskable)
- `static/favicon.png` (48×48) — browser tab favicon

**Deviations from original plan:**
- Added `sharp` as dev dependency + `scripts/generate-icons.ts` for reproducible icon generation (plan suggested manual/online tools)
- Added Apple mobile web app meta tags in `app.html` (not in original plan)
- Added `<meta name="theme-color">` in `app.html` for browser chrome theming
- Added `vite-plugin-pwa/client` types to `tsconfig.json` (not in original plan)
- Generated `static/favicon.png` (48×48) alongside PWA icons (plan only mentioned 192 + 512)

**Verification:** `npm run check` passes with 0 errors and 0 warnings. Full PWA verification (`npm run build && npm run preview` → Chrome DevTools > Application > Manifest) should be done manually.

---

### Step 6 — PostHog Integration ✅

**Completed.** Initial setup via PostHog AI Wizard (`npx @posthog/wizard --region eu`), then refined manually.

**What was done:**
- Installed `posthog-js` (client) and `posthog-node` (server) as runtime dependencies
- `src/hooks.client.ts` (new) — initializes `posthog-js` via SvelteKit `init` hook with `/ingest` reverse proxy, `defaults: '2026-01-30'` for automatic SPA pageview tracking, `capture_exceptions: true` for client-side error tracking, and `session_recording` config to unmask search inputs while masking all other inputs
- `src/hooks.server.ts` (new) — reverse proxy at `/ingest` routing to `eu.i.posthog.com` / `eu-assets.i.posthog.com` (ad-blocker resilience), plus server-side error capture via `posthog-node`. Both proxy and error capture are guarded by `PUBLIC_POSTHOG_ENABLED`
- `src/lib/server/posthog.ts` (new) — singleton `posthog-node` client factory (`flushAt: 1`, `flushInterval: 0` for serverless)
- `svelte.config.js` — added `paths: { relative: false }` (required for session replay)
- `.env` — added `PUBLIC_POSTHOG_ENABLED`, `PUBLIC_POSTHOG_PROJECT_TOKEN`, and `PUBLIC_POSTHOG_HOST`
- Custom events instrumented on all routes: `word_searched`, `search_results_viewed`, `phrase_clicked_from_search`, `category_clicked`, `phrase_clicked_from_category`, `related_phrase_clicked`
- Home page search input changed to `type="search"` so session replay shows search queries (unmasked via `maskInputOptions`)
- PostHog dashboards and insights auto-created in EU project

**Enable/disable toggle:**
- `PUBLIC_POSTHOG_ENABLED=true|false` in `.env` controls all PostHog behavior
- Client-side: uses `opt_out_capturing_by_default` — PostHog initializes but silently drops all events when disabled. No per-call guards needed in route files
- Server-side: explicit `enabled` guard on `/ingest` proxy and error capture (posthog-node lacks `opt_out_capturing_by_default`)

**Deviations from original plan:**
- Used `hooks.client.ts` `init()` instead of `+layout.ts` load function (more modern SvelteKit pattern)
- `defaults: '2026-01-30'` enables automatic SPA pageview tracking — no manual `afterNavigate` needed
- Added `/ingest` reverse proxy for ad-blocker avoidance (not in original plan)
- Added server-side error tracking with `posthog-node` (not in original plan)
- Env var named `PUBLIC_POSTHOG_PROJECT_TOKEN` instead of `PUBLIC_POSTHOG_KEY`
- Added `PUBLIC_POSTHOG_ENABLED` toggle for dev/prod flexibility
- Added session recording config: all inputs masked except `type="search"`

**PostHog dashboards (EU project 144826):**
- Analytics basics: https://eu.posthog.com/project/144826/dashboard/584716
- Word searches over time: https://eu.posthog.com/project/144826/insights/hllh5qLw
- Search-to-phrase click funnel: https://eu.posthog.com/project/144826/insights/RfCJ1X8i
- Category engagement over time: https://eu.posthog.com/project/144826/insights/ADIQcBgb
- Search quality (results vs. no results): https://eu.posthog.com/project/144826/insights/tU2tcJqT
- Related phrase clicks over time: https://eu.posthog.com/project/144826/insights/smqHU0w6

**Verification:** `npm run dev` with `PUBLIC_POSTHOG_ENABLED=true`, navigate pages → PostHog Dashboard > Live Events shows `$pageview` and custom events. Session recordings capture search input text. With `PUBLIC_POSTHOG_ENABLED=false`, no events are sent.

---

### Step 7 — Vercel + Neon: Deploy and Verify Production ✅

**Completed.** App deployed on Vercel with Neon PostgreSQL via the Vercel Managed Integration.

**What was done:**

**7a — Vercel + Neon Setup (Managed Integration)**
- Created Vercel account and project linked to the GitHub repository
- Installed the **Neon Managed Integration** for Vercel (https://neon.com/docs/guides/vercel-managed-integration) — Neon is accessed through the Vercel dashboard, not a separate Neon account
- The integration automatically provisions the Neon database and sets `DATABASE_URL` (+ other Neon env vars) in the Vercel project environment
- Manually added PostHog env vars (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`, `PUBLIC_POSTHOG_ENABLED`) in Vercel project settings

**7b — Database Initialization on Neon**
- Ran schema setup and seed against Neon from local machine using the Neon connection string:
  ```bash
  DATABASE_URL="<neon-connection-string>" npm run db:setup:fts
  DATABASE_URL="<neon-connection-string>" npm run db:push
  DATABASE_URL="<neon-connection-string>" npm run db:setup:trigger
  DATABASE_URL="<neon-connection-string>" npm run db:seed
  ```

**7c — Conditional DB Driver**
- `src/lib/server/db/index.ts` — now uses dynamic imports to select the DB driver at runtime:
  - **Development** (`dev === true`): `postgres` (postgres-js) for local Docker PostgreSQL
  - **Production**: `@neondatabase/serverless` (`neon-http` driver) for Vercel serverless functions
- Installed `@neondatabase/serverless` as a runtime dependency

**7d — Neon-to-Local Sync Script**
- Created `scripts/pull-neon.ts` — pulls data from Neon and loads it into local Docker PostgreSQL
- Uses `@neondatabase/serverless` (tagged template queries) to read from Neon and `postgres` to write locally
- Two modes:
  - `npm run db:pull` — **replace**: truncates local tables, inserts all Neon data
  - `npm run db:pull -- --merge` — **merge**: inserts Neon data, skips conflicts by id
- Resets sequences after insert so future local inserts get correct IDs
- Requires `NEON_DATABASE_URL` in `.env`

**New environment variable:**
| Variable | Scope | Description |
|---|---|---|
| `NEON_DATABASE_URL` | Local only (`.env`) | Neon pooled connection string for `db:pull` script |

**Verification:** App deployed and accessible on Vercel. All routes work with live Neon data. Local dev uses Docker PostgreSQL, production uses Neon serverless driver.

---

### Step 8 — Vite 8 Upgrade + PWA Fixes ✅

**Completed.** Upgraded from Vite 6 to Vite 8 and fixed PWA manifest warnings.

**What was done:**

**8a — Vite 6 → 8 Upgrade**
- Upgraded `vite` from `^6.4.1` to `^8.0.0` (Rolldown replaces esbuild + Rollup under the hood)
- Upgraded `@sveltejs/kit` from `^2.50.1` to `^2.55.0` (Vite 8 support added in 2.53.0)
- Upgraded `@sveltejs/vite-plugin-svelte` from `^6.2.4` to `^7.0.0` (required for Vite 8, drops Vite 7)
- Upgraded `@tailwindcss/vite` from `^4.2.1` to `^4.2.2` (adds Vite 8 to peer dep range)
- `vite-plugin-pwa@1.2.0` declares peer dep up to `^7.0.0` only — Vite 8 works via compatibility layer but shows a peer dep warning. No `vite-plugin-pwa` update available yet.

**8b — PWA Manifest Fixes**
- Split `icon-512.png` `purpose: 'any maskable'` into two separate entries: `icon-512.png` (purpose: any, default) and `icon-512-maskable.png` (purpose: maskable) — mixed purpose causes padding issues on some platforms
- Generated `icon-512-maskable.png` via `scripts/generate-icons.ts` — 512x512 with 80% inner icon centered on `#fb542b` brand background (safe zone padding)
- Added `screenshots` array to manifest for richer PWA install UI:
  - Desktop: `static/screenshots/desktop.png` (1280x720, `form_factor: 'wide'`)
  - Mobile: `static/screenshots/mobile.png` (780x1688 — 390x844 viewport at 2x DPR, `form_factor: 'narrow'`)
- Created `static/.well-known/appspecific/com.chrome.devtools.json` — silences Chrome DevTools config request message

**8c — Skill: `/refresh-pwa-assets`**
- Created `.claude/skills/refresh-pwa-assets/SKILL.md` — regenerates all icons (via `scripts/generate-icons.ts`) and takes desktop/mobile screenshots (via Puppeteer MCP) from the preview server

**Verification:** `npm run build && npm run preview` succeeds. Chrome DevTools > Application > Manifest shows no errors or warnings. PWA install prompt appears with richer UI (screenshots visible).

---

### Step 9 — Finalize ✅

**Completed.** Final review and cleanup of the entire project.

**What was done:**

1. **`README.md`** — fully rewritten: accurate tech stack (Vite 8, TailwindCSS v4, Svelte 5, Neon, PWA, PostHog), complete setup instructions with two-phase FTS setup, all available scripts, database schema + FTS architecture, env vars table, deployment guide, and updated project structure
2. **`README_CAT.md`** — rewritten in Catalan, matching the English version
3. **`.env.example`** — updated with all 6 environment variables (`NODE_ENV`, `DATABASE_URL`, `NEON_DATABASE_URL`, `PUBLIC_POSTHOG_ENABLED`, `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) and sensible defaults
4. **Project review** — codebase is clean: no mock data remnants, no TODO/FIXME comments, no unused imports, no dead files, no orphaned static assets, `npm run check` passes with 0 errors
5. **`CLAUDE.md` audit and cleanup** — trimmed from ~180 to ~85 lines:
   - Removed sections that duplicated README or were derivable from code (Current State, Target Architecture, Local Development, File Structure, Database Schema, FTS Architecture internals)
   - Fixed stale data: Vite 6 → 8, added `NEON_DATABASE_URL`, added `db:pull`/`staging` commands, updated `db/index.ts` description
   - Moved two workflow rules to a concise "Workflows" section (from 12 lines to 3)
   - Removed stale "Memory & Learnings" reference to nonexistent project-root MEMORY.md

**Verification:** All documentation is accurate and up-to-date. `.env.example` contains all required variables. `npm run check` passes with 0 errors and 0 warnings.

---

## Package Changes Summary

```bash
# Dev dependencies
npm install -D tailwindcss @tailwindcss/vite tsx @vite-pwa/sveltekit

# Runtime dependencies
npm install posthog-js posthog-node @neondatabase/serverless
```

---

## Gotchas

1. **Split `db:setup` into two phases**: `setup-fts.sql` (extensions + FTS config) runs before `db:push`; `setup-trigger.sql` (trigger + backfill) runs after `db:push` once the `phrases` table exists.

2. **Tailwind v4 utility names**: `@theme` custom properties automatically become Tailwind classes. `--color-brand` → `bg-brand`, `text-brand`, `border-brand`. No `extend` config needed.

3. **Svelte 5 slot migration**: All files using `<slot />` must switch to `{@render children()}` with `let { children } = $props()`. Mixing old/new syntax causes compiler warnings.

4. **posthog-js SSR guard**: PostHog accesses `window`/`document`. ALWAYS guard with `if (browser)` or dynamic `import()`. Never import it at the top level of any file that also runs on the server.

5. **Drizzle expression GIN index**: If `index().using('gin').on(sql`...`)` doesn't generate correctly, fall back to writing the expression index directly in `setup.sql`:
   ```sql
   CREATE INDEX IF NOT EXISTS search_simple_idx ON phrases
     USING GIN (to_tsvector('simple', phrase_text));
   ```

6. **PWA icons must be real PNGs**: Manifest validation fails if icon files are missing or malformed. Create both `icon-192.png` and `icon-512.png` before running `npm run build`.

7. **Neon serverless driver uses tagged templates**: `neon(url)` returns a tagged template function, not a regular function. Use `` sql`SELECT ...` `` not `sql('SELECT ...')` — the latter throws `This function can now be called only as a tagged-template function`.

8. **Vercel Managed Integration for Neon**: When using the Vercel integration, Neon is accessed through the Vercel dashboard. The integration auto-provisions `DATABASE_URL` and related env vars in Vercel. No separate Neon account login needed.

9. **Conditional DB driver for dev vs prod**: `src/lib/server/db/index.ts` uses dynamic `await import()` to load `postgres` (dev) or `@neondatabase/serverless` (prod). Top-level `await` works because the file is an ES module in a server-only path.

10. **Vite 8 + vite-plugin-pwa peer dep**: `vite-plugin-pwa@1.2.0` only declares `vite ^3–^7` in peer deps. Vite 8 works via Rolldown's compatibility layer but npm shows a peer dep warning. Monitor for a `vite-plugin-pwa` release that adds `^8`.

11. **PWA icon purpose split**: Don't use `purpose: 'any maskable'` on a single icon — it causes incorrect padding on some platforms. Use separate icon entries: one default (any) and one dedicated maskable icon with safe-zone padding.

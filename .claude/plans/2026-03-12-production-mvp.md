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

### Step 1 — TailwindCSS v4 + Design System

**Install:** `npm install -D tailwindcss @tailwindcss/vite`

**Files to modify:**
- `vite.config.ts` — add `tailwindcss()` plugin **before** `sveltekit()`:
  ```ts
  import tailwindcss from '@tailwindcss/vite';
  plugins: [tailwindcss(), sveltekit()]
  ```
- `src/app.css` — replace entirely:
  ```css
  @import "tailwindcss";
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

  @theme {
    --color-primary-50: #fff4f0;
    --color-primary-100: #ffe4d9;
    --color-primary-200: #ffc5ad;
    --color-primary-300: #ff9e7a;
    --color-primary-400: #fd7347;
    --color-primary-500: #fb542b;
    --color-primary-600: #e03a12;
    --color-primary-700: #ba2d0e;
    --color-primary-800: #992714;
    --color-primary-900: #7e2416;

    --color-neutral-50: #fafaf9;
    --color-neutral-100: #f4f4f3;
    --color-neutral-200: #e6e6e4;
    --color-neutral-300: #d0d0cd;
    --color-neutral-400: #a6a6a2;
    --color-neutral-500: #75756f;
    --color-neutral-600: #56564f;
    --color-neutral-700: #3d3d37;
    --color-neutral-800: #272722;
    --color-neutral-900: #141410;

    /* Semantic aliases — change these to retheme the whole app */
    --color-brand:        var(--color-primary-500);
    --color-brand-hover:  var(--color-primary-600);
    --color-brand-light:  var(--color-primary-100);
    --color-surface:      var(--color-neutral-50);
    --color-text:         var(--color-neutral-800);
    --color-text-muted:   var(--color-neutral-500);
    --color-border:       var(--color-neutral-200);

    --font-sans: 'Inter', system-ui, sans-serif;
    --font-serif: 'Lora', Georgia, serif;
  }

  *, *::before, *::after { box-sizing: border-box; }
  body { font-family: var(--font-sans); color: var(--color-text); background-color: var(--color-surface); line-height: 1.6; }
  ```
- `src/routes/+layout.svelte` — migrate to Svelte 5 `{@render children()}` AND apply Tailwind layout classes (header, nav, max-width container)
- `src/routes/+page.svelte` — replace inline styles with Tailwind utilities
- All other `+page.svelte` files — replace inline styles (style="margin-bottom: 15px;" etc.) with Tailwind utilities
- `src/app.html` — add `<link rel="preconnect">` for Google Fonts

**New file:** `src/routes/design-system/+page.svelte` — no server file needed; static page showing:
  - Color swatches grid (all primary-50→900 and neutral-50→900)
  - Typography scale (h1–h4, body, small, caption, with both fonts)
  - All component variants (buttons, card, badge, input)

**Verification:** `npm run dev` → header is terracotta, visit `/design-system` to see swatches, `npm run check` passes.

---

### Step 2 — Database Schema + Catalan FTS Configuration

**Install:** `npm install -D tsx dotenv`
_(tsx needed for running .ts scripts; dotenv to load .env in scripts)_

**2a — Custom SQL Setup File**

**New file:** `src/lib/server/db/setup.sql`

```sql
-- 1. Unaccent extension (for accent-insensitive matching)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- 2. Unaccent dictionary wrapper
CREATE TEXT SEARCH DICTIONARY catalan_unaccent (
  TEMPLATE = unaccent,
  RULES    = 'unaccent'
);

-- 3. Custom 'public.catalan' config
--    PostgreSQL ships with 'catalan_stem' Snowball dict but NO built-in 'catalan' config.
--    Copy from 'spanish' (closest Romance language base) then override word mappings.
CREATE TEXT SEARCH CONFIGURATION public.catalan ( COPY = pg_catalog.spanish );

ALTER TEXT SEARCH CONFIGURATION public.catalan
  ALTER MAPPING FOR hword, hword_part, word
  WITH catalan_unaccent, catalan_stem;

-- 4. Trigger function: auto-update search_vector on phrase insert/update
CREATE OR REPLACE FUNCTION phrases_fts_update()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('public.catalan', coalesce(NEW.phrase_text, '')), 'A');
  RETURN NEW;
END;
$$;

-- 5. Trigger (safe to re-run)
DROP TRIGGER IF EXISTS phrases_fts_trigger ON phrases;
CREATE TRIGGER phrases_fts_trigger
  BEFORE INSERT OR UPDATE OF phrase_text ON phrases
  FOR EACH ROW EXECUTE FUNCTION phrases_fts_update();

-- 6. Back-fill any existing rows
UPDATE phrases SET phrase_text = phrase_text;
```

**New file:** `src/lib/server/db/run-setup.ts`

```ts
import postgres from 'postgres';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL!);
const setupSql = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'setup.sql'), 'utf8');
await sql.unsafe(setupSql);
console.log('DB setup complete');
await sql.end();
```

**`package.json`** — add: `"db:setup": "tsx src/lib/server/db/run-setup.ts"`

**2b — Schema Update**

**`src/lib/server/db/schema.ts`** — replace `text` search_vector with tsvector `customType` and add both GIN indexes:

```ts
import { pgTable, serial, text, integer, index, customType } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const tsvector = customType<{ data: string }>({
  dataType() { return 'tsvector'; }
});

// ...categories unchanged...

export const phrases = pgTable('phrases', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').notNull().references(() => categories.id),
  phraseText: text('phrase_text').notNull(),
  explanation: text('explanation').notNull(),
  searchVector: tsvector('search_vector')       // auto-updated by trigger
}, (table) => ({
  // Index 1: GIN on the stored tsvector (catalan stemmed) — primary FTS
  searchVectorIdx: index('search_vector_idx').using('gin').on(table.searchVector),
  // Index 2: GIN expression index on 'simple' config — fallback for archaic words
  searchSimpleIdx: index('search_simple_idx').using('gin')
    .on(sql`to_tsvector('simple', ${table.phraseText})`)
}));
```

**Run order (CRITICAL):**
```bash
docker compose up -d
npm run db:setup     # MUST run before db:push (trigger references the phrases table)
npm run db:generate
npm run db:push
```

**Verification:** `npm run db:studio` → `search_vector` column shows type `tsvector`, two GIN indexes exist. `npm run check` passes.

---

### Step 3 — Seed Script

**New file:** `src/lib/server/db/seed.ts` — inserts 5 categories and 25 Catalan idiomatic phrases (5 per category), plus 6 bidirectional phrase relations. Categories:
- Amor i Sentiments (`amor-i-sentiments`)
- Animals (`animals`)
- Menjar i Beguda (`menjar-i-beguda`)
- Meteorologia (`meteorologia`)
- Cos i Salut (`cos-i-salut`)

The seed script must **omit `searchVector`** from inserts — the DB trigger fills it automatically on INSERT.

Script structure: delete relations → delete phrases → delete categories → insert categories (capture IDs) → insert phrases using captured IDs → insert relations.

**`package.json`** — add: `"db:seed": "tsx src/lib/server/db/seed.ts"`

**Run:** `npm run db:seed`

**Verification:** `npm run db:studio` → 5 categories, 25 phrases with non-null `search_vector` values (should look like `'algú':3 'colat':2 'estar':1`), 6 relation rows.

---

### Step 4 — Wire Routes to Real Database Queries

Replace ALL `MOCK_*` constants in every `+page.server.ts` with Drizzle queries against the live DB.

**`src/routes/expressions/+page.server.ts`:**
```ts
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
export const load = async () => ({
  categories: await db.select().from(categories).orderBy(categories.name)
});
```

**`src/routes/expressions/[slug]/+page.server.ts`:**
- `eq(categories.slug, params.slug)` → 404 if not found
- `eq(phrases.categoryId, category.id)` → ordered by phraseText

**`src/routes/expressions/[id=integer]/+page.server.ts`:**
- Query phrase by ID → 404 if missing
- Join to get category (name + slug)
- Query phraseRelations where phraseId = id → collect relatedPhraseIds → query those phrases

**`src/routes/cerca/+page.server.ts`** — two-stage FTS:
```ts
// Stage 1: catalan-stemmed (catches inflected forms)
const catalanQ = sql`to_tsquery('public.catalan', ${paraula + ':*'})`;
const results = await db.select(...).from(phrases)
  .where(sql`${phrases.searchVector} @@ ${catalanQ}`).limit(20);

// Stage 2 (fallback if 0 results): simple tokenization (archaic/unknown words)
if (results.length === 0) {
  const simpleQ = sql`to_tsquery('simple', ${paraula + ':*'})`;
  return db.select(...).from(phrases)
    .where(sql`to_tsvector('simple', ${phrases.phraseText}) @@ ${simpleQ}`).limit(20);
}
```

**Also update `.svelte` files:** mock data used `phrase.text` but schema uses `phrase.phraseText` — update template bindings in `[slug]/+page.svelte`, `[id=integer]/+page.svelte`, `cerca/+page.svelte`.

**Verification:** All 5 routes show live data. Search `/cerca?paraula=ploure` returns "Ploure a bots i barrals". Search `/cerca?paraula=cor` returns "Tenir el cor trencat".

---

### Step 5 — PWA Setup

**Install:** `npm install -D @vite-pwa/sveltekit`

**`vite.config.ts`** — add `SvelteKitPWA` plugin after `sveltekit()`:
```ts
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
plugins: [tailwindcss(), sveltekit(), SvelteKitPWA({
  strategies: 'generateSW',
  registerType: 'autoUpdate',
  manifest: {
    name: 'Lingua – Expressions Catalanes',
    short_name: 'Lingua',
    description: "Diccionari d'expressions i frases fetes catalanes",
    theme_color: '#fb542b',
    background_color: '#fafaf9',
    display: 'standalone',
    start_url: '/',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [{
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: { cacheName: 'pages', networkTimeoutSeconds: 3 }
    }]
  }
})]
```

**`svelte.config.js`** — disable SvelteKit's built-in SW registration:
```js
kit: { adapter: adapter(), serviceWorker: { register: false } }
```

**Icons:** Create `static/icons/` directory. Create this SVG as `static/icons/lingua.svg` (source for both icon sizes):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#fb542b"/>
  <text x="256" y="360" font-family="system-ui" font-size="340"
        font-weight="700" text-anchor="middle" fill="white">L</text>
</svg>
```
Then generate `icon-192.png` and `icon-512.png` from the SVG (use online tool, Inkscape, or `npm install -D sharp` for a quick conversion script).

**`src/routes/+layout.svelte`** — add SW registration on mount:
```svelte
import { onMount } from 'svelte';
onMount(async () => {
  const { registerSW } = await import('virtual:pwa-register');
  registerSW({ immediate: true });
});
```

**Verification:** `npm run build && npm run preview` → Chrome DevTools > Application > Manifest shows app info and icons. Lighthouse PWA audit passes installability.

---

### Step 6 — PostHog Integration

**Install:** `npm install posthog-js`

**`.env` and `.env.example`** — add:
```
PUBLIC_POSTHOG_KEY=phc_YOUR_KEY_HERE
PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com
```

**New file `src/routes/+layout.ts`** (NOT `.server.ts` — must run in browser):
```ts
import { browser } from '$app/environment';
import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public';

export const load = async () => {
  if (browser && PUBLIC_POSTHOG_KEY) {
    const { default: posthog } = await import('posthog-js');
    posthog.init(PUBLIC_POSTHOG_KEY, {
      api_host: PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false  // manual via afterNavigate
    });
  }
  return {};
};
```

**`src/routes/+layout.svelte`** — add pageview tracking:
```svelte
import { afterNavigate } from '$app/navigation';
import { browser } from '$app/environment';

afterNavigate(() => {
  if (browser) import('posthog-js').then(({ default: ph }) => ph.capture('$pageview'));
});
```

**Verification:** Set real PostHog key, `npm run dev`, navigate pages → PostHog Dashboard > Live Events shows `$pageview` events. With empty key, app works without errors.

---

### Step 7 — Finalize CLAUDE.md

**Goal:** Update the `CLAUDE.md` (created in Step 0 and incrementally updated throughout) to reflect the final complete state of the project after all steps.

**Update existing file:** `CLAUDE.md`

```markdown
# Lingua – CLAUDE.md

## Project Overview
Catalan phrase/idiom dictionary. Two core features:
1. **Word Search** (`/cerca?paraula=X`): FTS against phrases, shows DCVB iframe + matching phrases
2. **Phrase Browse** (`/expressions`): Categories → Phrases → Detail + related phrases

## Architecture
- **Framework**: SvelteKit 2, Svelte 5 (runes API)
- **Styling**: TailwindCSS v4, CSS-first config (`@theme` in `app.css`), no `tailwind.config.js`
- **Database**: PostgreSQL 16, Drizzle ORM (postgres-js driver), custom Catalan FTS
- **Deployment**: Vercel (adapter-vercel) + Neon (production DB)
- **PWA**: @vite-pwa/sveltekit, generateSW strategy, autoUpdate
- **Analytics**: PostHog (browser-only, `posthog-js`)

## Tech Stack Decisions
- **Svelte 5 runes**: Use `$props()`, `$state()`, `$derived()`. NOT `export let` or `$:` reactive labels.
  Layouts: `let { children } = $props()` → `{@render children()}`. NOT `<slot />`.
- **Tailwind v4**: `@import "tailwindcss"` + `@theme {}` in `app.css`. No config file.
  Use semantic aliases (`bg-brand`, `text-text-muted`) not raw palette (`bg-primary-500`).
- **Drizzle**: SQL-like API. `db.select().from(table).where(eq(col, val))`.
  For raw SQL: `sql` tag from `'drizzle-orm'`. Never use Prisma patterns.
- **tsvector**: `searchVector` column is type `tsvector` (via `customType`).
  NEVER set `searchVector` manually — the DB trigger `phrases_fts_trigger` handles it.
- **Public env vars** (`PUBLIC_*`): import from `$env/static/public`. Safe for browser.
  **Private env vars**: import from `$env/static/private`. Server-only.

## File Structure
src/
├── lib/server/db/
│   ├── index.ts          # Drizzle client export
│   ├── schema.ts         # Table definitions, tsvector customType, GIN indexes
│   ├── setup.sql         # One-time: unaccent ext, catalan FTS config, trigger
│   ├── run-setup.ts      # Script to execute setup.sql
│   └── seed.ts           # Dev seed: 5 categories, 25 phrases
├── routes/
│   ├── +layout.ts        # PostHog init (browser-only, NOT .server.ts)
│   ├── +layout.svelte    # App shell, app.css import, afterNavigate tracking
│   ├── +page.svelte      # Home: search form
│   ├── cerca/            # /cerca?paraula=X
│   ├── expressions/      # Category list
│   ├── expressions/[slug]/       # Phrases in a category
│   ├── expressions/[id=integer]/ # Phrase detail + related phrases
│   └── design-system/    # Dev reference: colors, typography, components
├── params/integer.ts     # Route param matcher
└── app.css               # Tailwind @import + @theme design tokens

## Database — FTS Architecture
- `search_vector` column stores `to_tsvector('public.catalan', phrase_text)` (weight A)
- `public.catalan` = Spanish base config + catalan_stem + catalan_unaccent (via unaccent ext)
- PostgreSQL has `catalan_stem` Snowball dict but NO built-in `catalan` text search config
- Two GIN indexes:
  1. On `search_vector` column (catalan-stemmed) — primary search
  2. Expression: `to_tsvector('simple', phrase_text)` — fallback for archaic/unknown words
- Search strategy in `/cerca`: try catalan first → if 0 results → try simple

## Fresh Database Setup (order matters!)
1. `npm run db:setup`    — FIRST: creates extension, FTS config, trigger function
2. `npm run db:generate` — generate Drizzle migration SQL
3. `npm run db:push`     — apply schema (creates tables)
4. `npm run db:seed`     — insert categories + phrases + relations

## Commands
| Command | Description |
|---|---|
| `npm run dev` | Dev server on port 5173 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run check` | TypeScript + Svelte typecheck |
| `docker compose up -d` | Start local PostgreSQL 16 |
| `npm run db:setup` | Run setup.sql (FTS config + trigger) |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:push` | Apply schema to DB |
| `npm run db:seed` | Seed with 5 categories + 25 phrases |
| `npm run db:studio` | Open Drizzle Studio GUI |

## Environment Variables
| Variable | Scope | Description |
|---|---|---|
| `DATABASE_URL` | Server (private) | postgres:// connection string |
| `PUBLIC_POSTHOG_KEY` | Client (public) | PostHog project API key |
| `PUBLIC_POSTHOG_HOST` | Client (public) | e.g. https://eu.i.posthog.com |

## Deployment (Vercel + Neon)
1. Create Neon project → copy pooled connection URL
2. Set env vars in Vercel dashboard (DATABASE_URL, PUBLIC_POSTHOG_*)
3. `DATABASE_URL=<neon_url> npm run db:setup` then `npm run db:push`
4. `DATABASE_URL=<neon_url> npm run db:seed` for initial content
5. Push to GitHub → Vercel auto-deploys

## Design System
See `/design-system` route for live reference of all colors, typography, and components.
Brand color: `#fb542b` (primary-500). To retheme: update `--color-primary-*` values in `@theme`.
```

---

### Step 8 — Vercel + Neon: Deploy and Verify Production

**Goal:** Get the app running live on Vercel connected to a real Neon PostgreSQL database.

**8a — Neon Database Setup**

1. Create a Neon account at [neon.tech](https://neon.tech) and create a new project (region: closest to Vercel's default, e.g. `us-east-1` or `eu-west-1`)
2. In the Neon dashboard, go to the project's **Connection Details** and copy the **pooled** connection string (it uses `pgbouncer=true` — required for serverless Vercel functions):
   ```
   postgres://user:password@ep-xxx.eu-west-2.aws.neon.tech/neondb?sslmode=require
   ```
3. Run schema setup and seed against Neon from your local machine:
   ```bash
   # Point all DB scripts at Neon for this session
   export DATABASE_URL="postgres://user:password@ep-xxx...neon.tech/neondb?sslmode=require"

   npm run db:setup     # creates extension, FTS config, trigger on Neon
   npm run db:generate  # generates migration files locally
   npm run db:push      # applies schema to Neon
   npm run db:seed      # seeds Neon with 5 categories + 25 phrases
   ```
4. Verify in Neon dashboard: Tables tab should show `categories` (5 rows), `phrases` (25 rows), `phrase_relations` (6 rows)

**8b — Vercel Project Setup**

Prerequisite: push the project to a GitHub repository first.

1. Go to [vercel.com](https://vercel.com) → New Project → Import the GitHub repository
2. Framework preset should auto-detect **SvelteKit**; no changes needed to build settings
3. In the **Environment Variables** section, add:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Neon pooled connection string |
   | `PUBLIC_POSTHOG_KEY` | PostHog project API key |
   | `PUBLIC_POSTHOG_HOST` | `https://eu.i.posthog.com` (or `us`) |
4. Click **Deploy** — Vercel builds and deploys the app

**8c — Post-Deploy Verification Checklist**

After deploy succeeds, visit the Vercel-assigned URL (e.g. `https://lingua-xxx.vercel.app`) and test:

- [ ] `/` — home page loads, search form renders with brand color header
- [ ] `/expressions` — shows 5 real categories from Neon DB
- [ ] `/expressions/animals` — shows 5 phrases for Animals category
- [ ] `/expressions/[id]` — phrase detail with related phrases (test any seeded phrase ID)
- [ ] `/cerca?paraula=ploure` — FTS returns "Ploure a bots i barrals"
- [ ] `/cerca?paraula=cor` — FTS returns "Tenir el cor trencat"
- [ ] Install PWA: Chrome address bar shows install icon; installed app opens in standalone window
- [ ] PostHog: navigate a few pages → Dashboard > Live Events shows `$pageview` events

**8d — Neon Branching for Future Development** _(optional but recommended)_

Neon supports database branches (like git branches). Create a `dev` branch for local/staging work:
```bash
# In Neon dashboard: Branches → Create Branch → name: "dev"
# Use the dev branch connection string in local .env
# Use the main branch connection string in Vercel production
```

**Verification:** All checklist items above pass. No 500 errors in Vercel Function logs.

---

## Package Changes Summary

```bash
# Dev dependencies
npm install -D tailwindcss @tailwindcss/vite tsx dotenv @vite-pwa/sveltekit

# Runtime dependencies
npm install posthog-js
```

---

## Gotchas

1. **`db:setup` before `db:push`**: `setup.sql` creates FTS config + trigger referencing the `phrases` table. Run setup first, then Drizzle creates the table. If reversed, trigger `CREATE` fails.

2. **Tailwind v4 utility names**: `@theme` custom properties automatically become Tailwind classes. `--color-brand` → `bg-brand`, `text-brand`, `border-brand`. No `extend` config needed.

3. **Svelte 5 slot migration**: All files using `<slot />` must switch to `{@render children()}` with `let { children } = $props()`. Mixing old/new syntax causes compiler warnings.

4. **posthog-js SSR guard**: PostHog accesses `window`/`document`. ALWAYS guard with `if (browser)` or dynamic `import()`. Never import it at the top level of any file that also runs on the server.

5. **Drizzle expression GIN index**: If `index().using('gin').on(sql`...`)` doesn't generate correctly, fall back to writing the expression index directly in `setup.sql`:
   ```sql
   CREATE INDEX IF NOT EXISTS search_simple_idx ON phrases
     USING GIN (to_tsvector('simple', phrase_text));
   ```

6. **PWA icons must be real PNGs**: Manifest validation fails if icon files are missing or malformed. Create both `icon-192.png` and `icon-512.png` before running `npm run build`.

# Lingua – CLAUDE.md

## Project Overview

Lingua is a Catalan phrase/idiom dictionary web application. Two core features:
1. **Word Search** (`/cerca?paraula=X`): Search for a word, see its definition (via embedded DCVB iframe) and related phrases
2. **Phrase Browse** (`/expressions`): Browse Catalan phrases organized by categories, with detailed explanations and related phrases

The app language is Catalan (`lang="ca"` in `app.html`).

## Current State

- All routes wired to **live PostgreSQL** via Drizzle queries (no mock data)
- **Styling**: TailwindCSS v4 with custom design system — `@theme` tokens in `app.css`, semantic aliases (`brand`, `base`, `muted`, `border`, `surface`)
- All `.svelte` files migrated to **Svelte 5 runes** (`$props()`, `$state()`, `{@render children()}`)
- Database schema in Drizzle with `tsvector` column, GIN indexes, and custom Catalan FTS config
- **Search** (`/cerca`): two-stage FTS — catalan-stemmed first, simple fallback; AND logic with prefix on last token
- Design system reference pages at `/design-system` (EN) and `/sistema-disseny` (CA)
- Seed script with 5 categories, 25 phrases, and 12 relation rows
- **PWA**: installable via `@vite-pwa/sveltekit` (`generateSW` strategy, `autoUpdate`, `NetworkFirst` for navigations)
- **Prerendered routes**: `/`, `/design-system`, `/sistema-disseny` (static pages with no DB dependency)
- No analytics, no production deployment yet

## Target Architecture (in progress)

- **Styling**: TailwindCSS v4 with custom design system (vermillion `#fb542b` palette)
- **Database**: PostgreSQL FTS with custom Catalan configuration (`catalan_stem` + `unaccent`)
- **PWA**: `@vite-pwa/sveltekit` for installability ✅
- **Analytics**: PostHog (`posthog-js`) for pageviews and feature flags
- **Deployment**: Vercel + Neon (serverless PostgreSQL)

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5 + TypeScript
- **Build**: Vite 6
- **ORM**: Drizzle ORM (`drizzle-orm` + `postgres` driver, NOT `pg`/`node-postgres`)
- **Database**: PostgreSQL 16 (Docker for local dev)
- **PWA**: `@vite-pwa/sveltekit` (generateSW, autoUpdate)
- **Deployment adapter**: `@sveltejs/adapter-vercel`

## Conventions

- **Svelte 5 runes**: Use `$props()`, `$state()`, `$derived()`. NOT `export let` or `$:` reactive labels.
  Layouts: `let { children } = $props()` → `{@render children()}`. NOT `<slot />`.
- **Drizzle ORM**: SQL-like API — `db.select().from(table).where(eq(col, val))`.
  For raw SQL: use `sql` tagged template from `'drizzle-orm'`.
- **Server data loading**: All DB queries go in `+page.server.ts` files (never expose `db` to client).
- **Route params**: Custom matchers live in `src/params/` (e.g., `integer.ts`).
- **Environment variables**: Private vars via `$env/static/private`, public via `$env/static/public`.
- **Tailwind v4**: `@import "tailwindcss"` + `@theme {}` in `app.css`. No config file.
  Use semantic aliases (`bg-brand`, `text-muted`, `text-base`) not raw palette (`bg-primary-500`).
  `text-base` is both a font-size utility (1rem) AND our base text color — both resolve correctly in v4.
- **Design system pages**: `/design-system` (English), `/sistema-disseny` (Catalan). Keep both in sync.
- **Prerendering**: Static pages (no DB dependency) use `export const prerender = true` in `+page.ts`.
- **PWA**: SW registered via `virtual:pwa-register` in `+layout.svelte` `onMount`. Manifest link is manual in `app.html` (not auto-injected by plugin with adapter-vercel).
- **Icons**: Source SVG at `static/icons/lingua.svg`. Regenerate all PNGs + favicon.ico via `npx tsx scripts/generate-icons.ts`.

## File Structure

```
src/
├── app.html              # Shell HTML, lang="ca"
├── app.css               # Tailwind v4 @import + @theme design tokens + base styles
├── params/
│   └── integer.ts        # Route param matcher for numeric IDs
├── lib/
│   └── server/
│       └── db/
│           ├── index.ts          # Drizzle client export (uses DATABASE_URL)
│           ├── schema.ts         # Table definitions, tsvector customType, GIN indexes
│           ├── setup-fts.sql     # Phase 1: unaccent ext + catalan FTS config (before db:push)
│           ├── setup-trigger.sql # Phase 2: trigger + backfill (after db:push)
│           ├── run-setup.ts      # Script to execute setup SQL (accepts 'fts' or 'trigger' arg)
│           └── seed.ts           # Dev seed: 5 categories, 25 phrases, 12 relations
└── routes/
    ├── +layout.svelte    # App shell: header + nav + SW registration
    ├── +page.ts          # prerender = true
    ├── +page.svelte      # Home: search form + about section
    ├── cerca/
    │   ├── +page.server.ts   # Two-stage FTS: catalan-stemmed → simple fallback
    │   └── +page.svelte      # Search results: DCVB iframe + phrase list
    ├── design-system/        # Design system reference (English, prerendered)
    ├── sistema-disseny/      # Design system reference (Catalan, prerendered)
    ├── expressions/
    │   ├── +page.server.ts   # Categories list (Drizzle query)
    │   ├── +page.svelte      # Category grid
    │   ├── [slug]/
    │   │   ├── +page.server.ts  # Phrases in category (Drizzle query)
    │   │   └── +page.svelte     # Phrase list for a category
    │   └── [id=integer]/
    │       ├── +page.server.ts  # Phrase + category + related phrases (Drizzle query)
    │       └── +page.svelte     # Phrase detail page
```

## Database Schema

Three tables defined in `src/lib/server/db/schema.ts`:
- **categories**: `id`, `name`, `slug` (unique), `description`
- **phrases**: `id`, `category_id` (FK), `phrase_text`, `explanation`, `search_vector` (`tsvector`, auto-updated by DB trigger — NEVER set manually)
- **phrase_relations**: `id`, `phrase_id` (FK), `related_phrase_id` (FK)

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Vite, port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run check` | `svelte-kit sync` + `svelte-check` TypeScript check |
| `docker compose up -d` | Start local PostgreSQL 16 |
| `npm run db:setup:fts` | Phase 1: extensions + FTS config (before db:push) |
| `npm run db:generate` | Generate Drizzle migration SQL files |
| `npm run db:push` | Apply schema directly to connected DB |
| `npm run db:setup:trigger` | Phase 2: trigger + backfill (after db:push) |
| `npm run db:seed` | Seed with 5 categories + 25 phrases + relations |
| `npm run db:studio` | Open Drizzle Studio GUI |

## Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `DATABASE_URL` | Server (private) | PostgreSQL connection string |

## Database — FTS Architecture

- `search_vector` column stores `to_tsvector('public.catalan', phrase_text)` (weight A)
- `public.catalan` = copy of built-in `pg_catalog.catalan` + `catalan_unaccent` pre-filter
- Two GIN indexes:
  1. On `search_vector` column (catalan-stemmed) — primary search
  2. Expression: `to_tsvector('simple', phrase_text)` — fallback for archaic/unknown words
- No stopwords — PostgreSQL has no `catalan.stop` file; negligible overhead at scale
- `searchVector` is auto-updated by the `phrases_fts_trigger` DB trigger — NEVER set it manually in inserts/updates
- **Search query strategy**: input split on whitespace, joined with `&` (AND), last token gets `:*` prefix (e.g., `"bots i"` → `bots & i:*`). Two-stage: catalan-stemmed first, simple fallback if 0 results

### Fresh Database Setup (order matters!)

1. `npm run db:setup:fts`     — Phase 1: extensions + FTS config (no table dependency)
2. `npm run db:generate`      — generate Drizzle migration SQL
3. `npm run db:push`          — apply schema (creates tables)
4. `npm run db:setup:trigger` — Phase 2: trigger + backfill (requires phrases table)

## Memory & Learnings

`MEMORY.md` (in the project root) contains insights, tips, and best practices discovered during previous tasks. **Read this file before running new tasks** to benefit from prior knowledge and avoid repeating past mistakes.

## Workflow: Learning from Corrections

When the user corrects a mistake, follow this process:
1. Acknowledge the correction
2. Propose a concise MEMORY.md update (show the exact text)
3. Ask the user: **add**, **tweak**, or **skip**
4. Only write to MEMORY.md after explicit approval

## Workflow: Post-Plan README Update

After completing all steps of a plan, revise and update `README.md` (and `README_CAT.md` if it exists) to reflect the new state of the project — updated setup instructions, new commands, changed architecture, added dependencies, etc. Ask the user to review before committing.

## Local Development

```bash
docker compose up -d                    # Start PostgreSQL
npm install                             # Install dependencies
npm run db:setup:fts                    # Phase 1: extensions + FTS config
npm run db:push                         # Apply schema (creates tables)
npm run db:setup:trigger                # Phase 2: trigger + backfill
npm run db:seed                         # Seed with sample data
npm run dev                             # Start dev server at localhost:5173
```

Docker PostgreSQL credentials: user `lingua`, password `lingua_dev_password`, database `lingua`, port `5432`.

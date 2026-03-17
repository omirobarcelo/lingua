# Lingua – CLAUDE.md

## Project Overview

Lingua is a Catalan phrase/idiom dictionary web application. Two core features:
1. **Word Search** (`/cerca?paraula=X`): Search for a word, see its definition (via embedded DCVB iframe) and related phrases
2. **Phrase Browse** (`/expressions`): Browse Catalan phrases organized by categories, with detailed explanations and related phrases

The app language is Catalan (`lang="ca"` in `app.html`).

## Current State

- All routes are functional but use **hardcoded mock data** (no real DB queries yet)
- Styling is plain CSS in `src/app.css` with CSS custom properties (no framework)
- Database schema exists in Drizzle but `search_vector` is typed as `text` (should be `tsvector`)
- No PWA support, no analytics, no production deployment yet

## Target Architecture (in progress)

- **Styling**: TailwindCSS v4 with custom design system (vermillion `#fb542b` palette)
- **Database**: PostgreSQL FTS with custom Catalan configuration (`catalan_stem` + `unaccent`)
- **PWA**: `@vite-pwa/sveltekit` for installability
- **Analytics**: PostHog (`posthog-js`) for pageviews and feature flags
- **Deployment**: Vercel + Neon (serverless PostgreSQL)

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5 + TypeScript
- **Build**: Vite 6
- **ORM**: Drizzle ORM (`drizzle-orm` + `postgres` driver, NOT `pg`/`node-postgres`)
- **Database**: PostgreSQL 16 (Docker for local dev)
- **Deployment adapter**: `@sveltejs/adapter-vercel`

## Conventions

- **Svelte 5 runes**: Use `$props()`, `$state()`, `$derived()`. NOT `export let` or `$:` reactive labels.
  Layouts: `let { children } = $props()` → `{@render children()}`. NOT `<slot />`.
- **Drizzle ORM**: SQL-like API — `db.select().from(table).where(eq(col, val))`.
  For raw SQL: use `sql` tagged template from `'drizzle-orm'`.
- **Server data loading**: All DB queries go in `+page.server.ts` files (never expose `db` to client).
- **Route params**: Custom matchers live in `src/params/` (e.g., `integer.ts`).
- **Environment variables**: Private vars via `$env/static/private`, public via `$env/static/public`.

## File Structure

```
src/
├── app.html              # Shell HTML, lang="ca"
├── app.css               # Global styles (plain CSS, will become Tailwind v4)
├── params/
│   └── integer.ts        # Route param matcher for numeric IDs
├── lib/
│   └── server/
│       └── db/
│           ├── index.ts  # Drizzle client export (uses DATABASE_URL)
│           └── schema.ts # Table definitions: categories, phrases, phraseRelations
└── routes/
    ├── +layout.svelte    # App shell: header + nav + main container
    ├── +page.svelte      # Home: search form + about section
    ├── cerca/
    │   ├── +page.server.ts   # Search logic (mock, will become FTS)
    │   └── +page.svelte      # Search results: DCVB iframe + phrase list
    ├── expressions/
    │   ├── +page.server.ts   # Categories list (mock)
    │   ├── +page.svelte      # Category grid
    │   ├── [slug]/
    │   │   ├── +page.server.ts  # Phrases in category (mock)
    │   │   └── +page.svelte     # Phrase list for a category
    │   └── [id=integer]/
    │       ├── +page.server.ts  # Single phrase + relations (mock)
    │       └── +page.svelte     # Phrase detail page
```

## Database Schema

Three tables defined in `src/lib/server/db/schema.ts`:
- **categories**: `id`, `name`, `slug` (unique), `description`
- **phrases**: `id`, `category_id` (FK), `phrase_text`, `explanation`, `search_vector` (currently `text`, will become `tsvector`)
- **phrase_relations**: `id`, `phrase_id` (FK), `related_phrase_id` (FK)

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Vite, port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run check` | `svelte-kit sync` + `svelte-check` TypeScript check |
| `docker compose up -d` | Start local PostgreSQL 16 |
| `npm run db:generate` | Generate Drizzle migration SQL files |
| `npm run db:push` | Apply schema directly to connected DB |
| `npm run db:studio` | Open Drizzle Studio GUI |

## Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `DATABASE_URL` | Server (private) | PostgreSQL connection string |

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
npm run dev                             # Start dev server at localhost:5173
```

Docker PostgreSQL credentials: user `lingua`, password `lingua_dev_password`, database `lingua`, port `5432`.

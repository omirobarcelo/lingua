# Lingua

Catalan phrase/idiom dictionary web application with full-text search and phrase browsing by categories.

## Features

- **Word Search** (`/cerca?paraula=X`): Search for a word, see its definition (via embedded DCVB iframe) and related phrases
- **Phrase Browse** (`/expressions`): Browse Catalan phrases organized by categories, with detailed explanations and related phrases
- **Catalan Full-Text Search**: PostgreSQL FTS with custom Catalan stemming configuration and accent-insensitive matching
- **PWA**: Installable progressive web app with offline-first navigation caching
- **Analytics**: PostHog integration with reverse proxy, custom events, and session recording

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5 + TypeScript
- **Build**: Vite 8
- **Styling**: TailwindCSS v4 with custom design system (vermillion `#fb542b` palette)
- **ORM**: Drizzle ORM (`drizzle-orm` + `postgres` driver)
- **Database**: PostgreSQL 16 (Docker locally, Neon serverless in production)
- **PWA**: `@vite-pwa/sveltekit` (generateSW, autoUpdate)
- **Analytics**: PostHog (`posthog-js` client + `posthog-node` server)
- **Deployment**: Vercel + Neon (via Vercel Managed Integration)

## Routes

| Route | Description |
|---|---|
| `/` | Home page with word search |
| `/cerca?paraula=<word>` | Word search results with DCVB definition |
| `/expressions` | Category list |
| `/expressions/<slug>` | Phrases in a category |
| `/expressions/<id>` | Phrase detail with related phrases |
| `/design-system` | Design system reference (English) |
| `/sistema-disseny` | Design system reference (Catalan) |

## Local Development

### Prerequisites

- Node.js 18+
- Docker and Docker Compose

### Setup

```bash
git clone <repository-url>
cd lingua
npm install
cp .env.example .env              # Configure environment variables
docker compose up -d               # Start local PostgreSQL
npm run db:setup:fts               # Phase 1: extensions + FTS config
npm run db:push                    # Apply schema (creates tables)
npm run db:setup:trigger           # Phase 2: trigger + backfill
npm run db:seed                    # Seed with sample data
npm run dev                        # Start dev server at localhost:5173
```

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Vite, port 5173) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run check` | TypeScript type checking (`svelte-kit sync` + `svelte-check`) |
| `docker compose up -d` | Start local PostgreSQL 16 |
| `npm run db:setup:fts` | Phase 1: extensions + FTS config (before `db:push`) |
| `npm run db:generate` | Generate Drizzle migration SQL files |
| `npm run db:push` | Apply schema directly to connected DB |
| `npm run db:setup:trigger` | Phase 2: trigger + backfill (after `db:push`) |
| `npm run db:seed` | Seed with 5 categories + 25 phrases + relations |
| `npm run db:studio` | Open Drizzle Studio GUI |
| `npm run db:pull` | Pull data from Neon into local Docker DB |
| `npm run db:pull -- --merge` | Merge Neon data into local DB (skip conflicts) |

## Database

### Schema

Three tables defined in `src/lib/server/db/schema.ts`:

- **categories**: `id`, `name`, `slug` (unique), `description`
- **phrases**: `id`, `category_id` (FK), `phrase_text`, `explanation`, `search_vector` (tsvector, auto-updated by DB trigger)
- **phrase_relations**: `id`, `phrase_id` (FK), `related_phrase_id` (FK)

### Full-Text Search Architecture

- Custom `public.catalan` FTS config with `catalan_unaccent` pre-filter for accent-insensitive matching
- Two GIN indexes: catalan-stemmed (primary) and simple (fallback for archaic words)
- Two-stage search: catalan-stemmed first, simple fallback if 0 results
- AND logic with prefix on last token (e.g., `"bots i"` → `bots & i:*`)

### Fresh Database Setup (order matters!)

```bash
npm run db:setup:fts       # Phase 1: extensions + FTS config (no table dependency)
npm run db:push            # Apply schema (creates tables)
npm run db:setup:trigger   # Phase 2: trigger + backfill (requires phrases table)
npm run db:seed            # Optional: seed with sample data
```

## Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `DATABASE_URL` | Server (private) | PostgreSQL connection string |
| `NEON_DATABASE_URL` | Local only (`.env`) | Neon pooled connection string for `db:pull` script |
| `PUBLIC_POSTHOG_ENABLED` | Client (public) | `true`/`false` — toggle all PostHog |
| `PUBLIC_POSTHOG_PROJECT_TOKEN` | Client (public) | PostHog project API key |
| `PUBLIC_POSTHOG_HOST` | Client (public) | PostHog ingestion host (e.g., `https://eu.i.posthog.com`) |

## Deployment

The app is deployed on **Vercel** with **Neon** (serverless PostgreSQL) via the Vercel Managed Integration.

- The integration auto-provisions `DATABASE_URL` in the Vercel project environment
- PostHog env vars must be added manually in Vercel project settings
- `src/lib/server/db/index.ts` uses the `postgres` driver locally and `@neondatabase/serverless` in production

To initialize the Neon database:

```bash
DATABASE_URL="<neon-connection-string>" npm run db:setup:fts
DATABASE_URL="<neon-connection-string>" npm run db:push
DATABASE_URL="<neon-connection-string>" npm run db:setup:trigger
DATABASE_URL="<neon-connection-string>" npm run db:seed
```

## Project Structure

```
src/
├── app.html              # Shell HTML (lang="ca")
├── app.css               # TailwindCSS v4 @import + @theme design tokens
├── hooks.client.ts       # PostHog client init + error capture
├── hooks.server.ts       # /ingest reverse proxy + server error capture
├── params/
│   └── integer.ts        # Route param matcher for numeric IDs
├── lib/
│   └── server/
│       ├── posthog.ts            # posthog-node singleton factory
│       └── db/
│           ├── index.ts          # Drizzle client (postgres locally, Neon in prod)
│           ├── schema.ts         # Table definitions + tsvector + GIN indexes
│           ├── setup-fts.sql     # Phase 1: unaccent ext + catalan FTS config
│           ├── setup-trigger.sql # Phase 2: trigger + backfill
│           ├── run-setup.ts      # Script to execute setup SQL
│           └── seed.ts           # Dev seed data
└── routes/
    ├── +layout.svelte    # App shell: header + nav + SW registration
    ├── +page.svelte      # Home: search form + about section
    ├── cerca/            # Word search (FTS)
    ├── expressions/      # Phrase browsing by category
    ├── design-system/    # Design system reference (EN)
    └── sistema-disseny/  # Design system reference (CA)
```

---

Per la versió en català d'aquest README, vegeu [README_CAT.md](README_CAT.md).

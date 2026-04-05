# Lingua – CLAUDE.md

## Project Overview

Lingua is a Catalan phrase/idiom dictionary web application. Two core features:

1. **Word Search** (`/cerca?paraula=X`): Search for a word, see definitions from DCVB and GDLC side by side, and related phrases
2. **Phrase Browse** (`/expressions`): Browse Catalan phrases organized by categories, with detailed explanations and related phrases

The app language is Catalan (`lang="ca"` in `app.html`).

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5 + TypeScript
- **Build**: Vite 8
- **ORM**: Drizzle ORM (`drizzle-orm` + `postgres` driver, NOT `pg`/`node-postgres`)
- **Database**: PostgreSQL 16 (Docker locally, Neon serverless in production)
- **Styling**: TailwindCSS v4 with custom design system (vermillion `#ba2d0e` brand palette)
- **PWA**: `@vite-pwa/sveltekit` (generateSW, autoUpdate)
- **Analytics**: PostHog — `posthog-js` (client), `posthog-node` (server)
- **Testing**: Playwright + `@axe-core/playwright` (a11y), Lighthouse CI (score threshold)
- **CI**: GitHub Actions — a11y checks on push/PR with ephemeral Neon branches
- **Deployment**: Vercel + Neon (via Vercel Managed Integration)

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
- **Layout groups**: Public routes live under `src/routes/(main)/`, admin routes under `src/routes/admin/`. The root `+layout.svelte` is minimal; the main app shell is in `(main)/+layout.svelte`.
- **Prerendering**: Static pages (no DB dependency) use `export const prerender = true` in `+page.ts`.
- **PWA**: SW registered via `virtual:pwa-register` in `+layout.svelte` `onMount`. Manifest link is manual in `app.html` (not auto-injected by plugin with adapter-vercel).
- **Icons**: Source SVG at `static/icons/lingua.svg`. Regenerate all PNGs + favicon.ico via `npx tsx scripts/generate-icons.ts`.
- **PostHog**: Initialized in `src/hooks.client.ts` via `init()` hook (NOT `+layout.ts`). Toggle with `PUBLIC_POSTHOG_ENABLED` env var. Client uses `opt_out_capturing_by_default` — no per-call guards needed in route files. Server-side (`posthog-node`) needs explicit guards. Reverse proxy at `/ingest` in `hooks.server.ts` for ad-blocker resilience.
- **DB driver**: `src/lib/server/db/index.ts` uses `postgres` (postgres-js) in dev and `@neondatabase/serverless` (neon-http) in production, selected at runtime via `dev` flag.
- **search_vector**: Auto-updated by the `phrases_fts_trigger` DB trigger — NEVER set it manually in inserts/updates.
- **Admin panel**: Password-protected at `/admin`. Auth via HMAC session cookie (`src/lib/server/admin/auth.ts`). Guard in `hooks.server.ts` via `sequence()`. Admin env vars: `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- **Admin routes**: `/admin/categories` and `/admin/frases` for CRUD. Phrase relations are always bidirectional (insert/delete both A→B and B→A).
- **External definitions**: Fetched server-side via `src/lib/server/definitions/` (`dcvb.ts`, `gdlc.ts`). Parsed with `node-html-parser`. Both sources have malformed HTML requiring pre-processing (self-closing spans, broken nesting). Client-side reload via `/api/definitions/[source]?word=X`.
- **Linting**: ESLint flat config (`eslint.config.js`) with `eslint-plugin-svelte` + `typescript-eslint`. `svelte/no-navigation-without-resolve` is off (no base path). `svelte/no-at-html-tags` is a warning (intentional use for definitions).
- **Formatting**: Prettier with `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`. `printWidth: 120`, `useTabs: true`, `singleQuote: true`. Run `npm run format` before committing.
- **Tailwind v4 renames**: Some v3 utilities are renamed. E.g. `break-words` → `wrap-break-word`. Check IDE diagnostics for `suggestCanonicalClasses` warnings.
- **`npx sv add`**: Requires a clean git working directory. Commit or stash before running.
- **A11y testing**: `tests/a11y.test.ts` runs axe-core via Playwright on public routes. External dictionary HTML (DCVB/GDLC `.dcvb-definition`, `.gdlc-definition`) is excluded from axe checks due to malformed third-party markup. `lighthouserc.cjs` configures Lighthouse CI with a 95+ a11y score threshold.
- **CI workflow**: `.github/workflows/a11y.yml` runs on push to `main` and PRs. Creates an ephemeral Neon branch per run (via `neondatabase/create-branch-action`), runs both test suites, then deletes the branch. Requires `NEON_API_KEY` secret and `NEON_PROJECT_ID` variable in GitHub repo settings. All `$env/static/*` vars need dummy values in the workflow env block for the build to succeed.

## Commands

| Command                      | Description                                         |
| ---------------------------- | --------------------------------------------------- |
| `npm run dev`                | Start dev server (Vite, port 5173)                  |
| `npm run staging`            | Start dev server in staging mode                    |
| `npm run build`              | Production build                                    |
| `npm run preview`            | Preview production build locally                    |
| `npm run check`              | `svelte-kit sync` + `svelte-check` TypeScript check |
| `npm run lint`               | ESLint (flat config, Svelte + TypeScript)           |
| `npm run format`             | Prettier (write mode)                               |
| `npm run format:check`       | Prettier (check mode, CI-friendly)                  |
| `npm run test:a11y`          | Run axe-core a11y tests via Playwright              |
| `npm run test:lighthouse`    | Run Lighthouse CI (fails if a11y score < 95)        |
| `docker compose up -d`       | Start local PostgreSQL 16                           |
| `npm run db:setup:fts`       | Phase 1: extensions + FTS config (before db:push)   |
| `npm run db:generate`        | Generate Drizzle migration SQL files                |
| `npm run db:push`            | Apply schema directly to connected DB               |
| `npm run db:setup:trigger`   | Phase 2: trigger + backfill (after db:push)         |
| `npm run db:seed`            | Seed with 5 categories + 25 phrases + relations     |
| `npm run db:studio`          | Open Drizzle Studio GUI                             |
| `npm run db:pull`            | Pull data from Neon into local Docker DB            |
| `npm run db:pull -- --merge` | Merge Neon data into local DB (skip conflicts)      |

## Environment Variables

| Variable                       | Scope               | Description                                              |
| ------------------------------ | ------------------- | -------------------------------------------------------- |
| `DATABASE_URL`                 | Server (private)    | PostgreSQL connection string                             |
| `NEON_DATABASE_URL`            | Local only (`.env`) | Neon pooled connection string for `db:pull` script       |
| `PUBLIC_POSTHOG_ENABLED`       | Client (public)     | `true`/`false` — toggle all PostHog                      |
| `PUBLIC_POSTHOG_PROJECT_TOKEN` | Client (public)     | PostHog project API key                                  |
| `PUBLIC_POSTHOG_HOST`          | Client (public)     | `https://eu.i.posthog.com`                               |
| `PUBLIC_SITE_URL`              | Client (public)     | Production URL for canonical/OG tags (fallback built-in) |
| `ADMIN_PASSWORD`               | Server (private)    | Shared password for admin panel login                    |
| `ADMIN_SESSION_SECRET`         | Server (private)    | HMAC secret for admin session cookies                    |

## Database Setup (order matters!)

1. `npm run db:setup:fts` — Phase 1: extensions + FTS config (no table dependency)
2. `npm run db:push` — apply schema (creates tables)
3. `npm run db:setup:trigger` — Phase 2: trigger + backfill (requires phrases table)
4. `npm run db:seed` — optional: seed with sample data

FTS uses a two-stage search strategy: catalan-stemmed first, simple fallback if 0 results. Input is split on whitespace, joined with `&` (AND), last token gets `:*` prefix.

## Memory

Check `MEMORY.md` at the start of each conversation for persistent context (feedback, user preferences, project state). Memory files live in `.claude/memory/`.

## Workflows

- **Plans**: Stored in `.claude/plans/` with naming convention `YYYY-MM-DD-descriptive-name.md`. When a plan specifies multiple commits, make each commit as you complete that phase — don't batch all changes and split retroactively.
- **Corrections**: When the user corrects a mistake — acknowledge, propose a concise CLAUDE.md or memory update (show exact text), ask **add/tweak/skip**, only write after approval.
- **Post-plan README**: After completing all steps of a plan, update `README.md` (and `README_CAT.md`) to reflect new state. Ask user to review before committing.

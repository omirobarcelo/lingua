# Word Metadata Feature

## Goal

Add a new `words` entity to store optional metadata (notes, related words) for specific words. Words are found via FTS stemming (searching "dones" matches "dona"). Results appear on the search page alongside dictionary definitions. Admin CRUD at `/admin/paraules`.

## Commits

### Commit 1: Add `words` table to schema + FTS trigger ✅

**Files:**

- `src/lib/server/db/schema.ts` — add `words` table:
  - `id` serial PK
  - `word` text NOT NULL UNIQUE
  - `notes` text
  - `relatedWords` text (column: `related_words`)
  - `searchVector` tsvector (auto-updated by trigger)
  - Two GIN indexes: `words_search_vector_idx` (catalan stemmed), `words_search_simple_idx` (simple fallback)
- `src/lib/server/db/setup-trigger.sql` — add `words_fts_update()` function + `words_fts_trigger` (mirrors phrases pattern, indexes only `word` column) + backfill

### Commit 2: Integrate words into search page (`/cerca`) ✅

**Files:**

- `src/routes/(main)/cerca/+page.server.ts` — add parallel FTS query against `words` table (same two-stage strategy: catalan-stemmed first, simple fallback). Return matching words in load data.
- `src/routes/(main)/cerca/+page.svelte` — add "Informació addicional" section below dictionary definitions, only shown when there are matching words. Display word, notes, and related words for each match.

**Tested:** Search "dona" shows word metadata section. Stemming works ("dones" → matches "dona").

### Commit 3: Admin CRUD — list + create (`/admin/paraules`) ✅

**Files:**

- `src/routes/admin/paraules/+page.server.ts` — load (list all words), create (single), createBulk (pipe-delimited: `Paraula | Notes | Paraules relacionades`), delete actions
- `src/routes/admin/paraules/+page.svelte` — list table + create/bulk-create forms, following exact patterns from `/admin/frases`

**Tested:** Admin list page shows words table, create action works (verified via DB and page reload).

### Commit 4: Admin CRUD — edit (`/admin/paraules/[id]`) ✅

**Files:**

- `src/routes/admin/paraules/[id]/+page.server.ts` — load (single word), update, delete actions
- `src/routes/admin/paraules/[id]/+page.svelte` — edit form + danger zone delete, following patterns from `/admin/frases/[id]`

**Tested:** Edit page loads with pre-filled values, danger zone delete button present.

### Commit 5: Add "Paraules" to admin sidebar nav ✅

**Files:**

- `src/routes/admin/+layout.svelte` — add `{ href: '/admin/paraules', label: 'Paraules' }` to `navItems`

**Tested:** Nav item appears in sidebar, highlighted when active.

### Commit 6: Create PR

- Push branch `feature/word-metadata`
- Create PR targeting `main`

## Infra: Vercel + Neon PR Branches (manual setup)

The Vercel-managed Neon integration supports automatic branch-per-PR:

1. **Vercel Dashboard** → Storage → Neon DB → Manage
2. Under **Deployments Configuration**, enable **"Create a database branch for deployment"** for **Preview**
3. Enable **"Resource must be active before deployment"**
4. Enable **"Automatically delete obsolete Neon branches"**
5. Optionally update Vercel **Build Command** to `npx drizzle-kit push && npm run build` so schema changes apply on the preview branch

No changes to the GitHub Actions CI workflow needed.

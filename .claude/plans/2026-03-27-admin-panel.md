# Admin Panel for Lingua

## Context

Lingua currently has no write paths in the app — all data is managed via CLI scripts (`seed.ts`, `pull-neon.ts`). Non-technical users (2-3 people) need a way to add/edit/delete categories, phrases, and phrase relations through a web UI. This plan adds a password-protected admin panel at `/admin` with full CRUD capabilities.

## Auth: Shared Password (Option A)

- Single `ADMIN_PASSWORD` env var + `ADMIN_SESSION_SECRET` for HMAC signing
- On login: compare password, generate HMAC token, store in `HttpOnly` session cookie (no `maxAge` — expires on browser close)
- `hooks.server.ts`: guard all `/admin/*` routes (except `/admin/login`) — redirect to `/admin/login` if unauthenticated
- Logout: clear cookie, redirect to `/admin/login`

### Future Upgrade to User Accounts (Option B — reference only)

When individual accounts are needed:

1. **New DB table** `admin_users`: `id serial PK`, `email text UNIQUE NOT NULL`, `password_hash text NOT NULL`, `created_at timestamp DEFAULT now()`
2. **Optional sessions table** `admin_sessions`: `id text PK` (UUID), `user_id integer FK→admin_users.id`, `expires_at timestamp`. Alternative: signed JWT with expiry.
3. **Replace `auth.ts`**:
   - `isAuthenticated(cookies)` → `getUserFromSession(cookies, db): { id, email } | null`
   - Login action: bcrypt compare against `password_hash`, create session row, set cookie
   - Registration: invite-only endpoint or CLI script to add users
4. **Update `app.d.ts`**: `locals.adminUser: { id; email } | null` instead of `locals.isAdminAuthenticated: boolean`
5. **Audit trail** (optional): add `created_by integer FK→admin_users.id` to `categories` and `phrases` tables
6. **No route changes needed** — the hooks guard and layout read from `locals`, everything else stays the same
7. **Estimated effort**: ~2-3 hours. Install `bcrypt` (or `@node-rs/argon2`), create migration, update `auth.ts` + `hooks.server.ts`.

## Route & File Structure

```
src/
  app.d.ts                                    MODIFIED ✅
  hooks.server.ts                             MODIFIED ✅

  lib/
    server/admin/
      auth.ts                                 DONE ✅
    utils/
      slug.ts                                 DONE ✅
    stores/
      adminToast.svelte.ts                    DONE ✅
      adminDialog.svelte.ts                   DONE ✅
    components/admin/
      AdminField.svelte                       DONE ✅
      AdminFormError.svelte                   DONE ✅
      ToastContainer.svelte                   DONE ✅
      ConfirmDialog.svelte                    DONE ✅

  routes/admin/
    +layout.server.ts                         DONE ✅
    +layout.svelte                            DONE ✅ (sidebar inlined here, no separate AdminSidebar)

    login/
      +page.server.ts                         DONE ✅
      +page.svelte                            DONE ✅

    +page.server.ts                           DONE ✅ (dashboard)
    +page.svelte                              DONE ✅

    categories/
      +page.server.ts                         DONE ✅
      +page.svelte                            DONE ✅

      [id]/
        +page.server.ts                       DONE ✅
        +page.svelte                          DONE ✅

    frases/
      +page.server.ts                         DONE ✅
      +page.svelte                            DONE ✅

      [id]/
        +page.server.ts                       DONE ✅
        +page.svelte                          DONE ✅
```

**Deviations from original plan:**
- `AdminSidebar.svelte` — not created as a separate component; sidebar is inlined in `+layout.svelte`
- `Toast.svelte` — not created; `ToastContainer.svelte` handles all toast rendering directly

**Total: ~18 new files, 2 modified files (all complete)**

## Environment Variables

| Variable | Scope | Where |
|---|---|---|
| `ADMIN_PASSWORD` | Server (private) | `.env` + Vercel |
| `ADMIN_SESSION_SECRET` | Server (private) | `.env` + Vercel |

## Implementation Phases

### Phase 1: Auth Infrastructure ✅ COMPLETE
Files: `app.d.ts`, `src/lib/server/admin/auth.ts`, `src/hooks.server.ts`

1. ✅ Created `src/lib/server/admin/auth.ts`:
   - `getValidToken()`: HMAC-SHA256 of `ADMIN_PASSWORD` with `ADMIN_SESSION_SECRET`
   - `setSessionCookie(cookies)`: set HttpOnly, SameSite=strict, Secure (prod), path=/admin, no maxAge
   - `clearSessionCookie(cookies)`: delete cookie
   - `isAuthenticated(cookies)`: compare cookie value to `getValidToken()` using `timingSafeEqual`

2. ✅ Modified `src/hooks.server.ts`:
   - Imported `sequence` from `@sveltejs/kit/hooks`
   - Split existing handle into `posthogHandle`
   - Added `adminAuthHandle`: guards `/admin/*` except `/admin/login`, sets `event.locals.isAdminAuthenticated`
   - Exports `handle = sequence(adminAuthHandle, posthogHandle)` (admin guard runs first)

3. ✅ Modified `src/app.d.ts`:
   - Added `isAdminAuthenticated: boolean` to `App.Locals`

### Phase 2: Login + Admin Layout ✅ COMPLETE
Files: `login/+page.server.ts`, `login/+page.svelte`, `+layout.server.ts`, `+layout.svelte`

1. ✅ Login page (`/admin/login`):
   - `load`: if already authenticated, `redirect(303, '/admin')`
   - `default` action: timing-safe password comparison, on success `setSessionCookie` + `redirect(303, '/admin')`, on fail `return fail(401, { error: 'Contrasenya incorrecta' })`
   - Simple centered card form with password input + submit button. Catalan labels.

2. ✅ Admin layout:
   - `+layout.server.ts`: reads `locals.isAdminAuthenticated`, passes to layout
   - `+layout.svelte`: sidebar nav (inlined, not separate component) + content area + ToastContainer + ConfirmDialog
   - Separate visual identity from public site
   - Layout effect auto-shows toasts on form success/error

### Phase 3: Shared Components + Utilities ✅ COMPLETE
Files: all `src/lib/components/admin/*.svelte`, `src/lib/stores/*.svelte.ts`, `src/lib/utils/slug.ts`

1. ✅ `slug.ts`: `generateSlug(text)` — handles Catalan diacritics via NFD normalize, special `l·l`→`ll` replacement
2. ✅ Sidebar implemented inline in `+layout.svelte` with active state highlighting (plan had separate `AdminSidebar.svelte`)
3. ✅ `AdminField.svelte`: supports text, textarea, select with error display + readonly state
4. ✅ `AdminFormError.svelte`: error message banner
5. ✅ Toast store + ToastContainer: `$state`-based, auto-dismiss after 4s
6. ✅ Dialog store + ConfirmDialog: `confirm(message)` returns `Promise<boolean>`, Escape key support

### Phase 4: Dashboard ✅ COMPLETE
Files: `admin/+page.server.ts`, `admin/+page.svelte`

- ✅ Load: count queries for categories, phrases, relations
- ✅ Display: 3 count cards + quick-action links to create category/phrase

### Phase 5: Categories CRUD ✅ COMPLETE
Files: `admin/categories/+page.server.ts`, `admin/categories/+page.svelte`, `admin/categories/[id]/+page.server.ts`, `admin/categories/[id]/+page.svelte`

**List + Create page** (`/admin/categories`):
- ✅ `load`: categories ordered by name + phrase count per category
- ✅ `create` action: validate name, auto-generate slug, check uniqueness, insert
- ✅ `createBulk` action: one per line `Nom | Descripció`, auto-generate slugs, single insert with transaction
- ✅ `delete` action: checks no phrases reference this category (FK guard)
- ✅ Table with columns: Nom, Slug, Descripció, Frases (count), Accions

**Edit page** (`/admin/categories/[id]`):
- ✅ `load`: fetch category by id, 404 if not found
- ✅ `update` action: validate, regenerate slug, check uniqueness excluding self, update
- ✅ `delete` action: same FK guard, redirect to `/admin/categories`
- ✅ Form: name input, slug preview (read-only), description textarea, danger zone

### Phase 6: Phrases CRUD ✅ COMPLETE
Files: `admin/frases/+page.server.ts`, `admin/frases/+page.svelte`, `admin/frases/[id]/+page.server.ts`, `admin/frases/[id]/+page.svelte`

**List + Create page** (`/admin/frases`):
- ✅ `load`: all phrases with category name (join), all categories for dropdown
- ✅ `create` action: validate phraseText + explanation + categoryId, insert — NEVER set `searchVector`
- ✅ `createBulk` action: one per line `Text | Explicació | categoria` (resolve category by name or slug)
- ✅ `delete` action: delete relations first (both directions), then delete phrase
- ✅ Table: Frase, Categoria, Accions

**Edit + Relations page** (`/admin/frases/[id]`):
- ✅ `load`: phrase + category + all categories + related phrases + all other phrases (for relation picker)
- ✅ `update` action: validate, update phraseText + explanation + categoryId
- ✅ `delete` action: cascade delete relations, delete phrase, redirect to `/admin/frases`
- ✅ `addRelation` action: validate (not self, not duplicate), insert BOTH directions (A→B and B→A)
- ✅ `removeRelation` action: delete BOTH directions
- ✅ UI: edit form at top, then "Expressions Relacionades" section with current relations list + add picker

## Key Invariants

1. **`searchVector`**: NEVER include in insert/update values — DB trigger `phrases_fts_trigger` handles it
2. **Relation symmetry**: always insert/delete BOTH directions (A→B and B→A) — public site queries only `WHERE phraseId = X`
3. **Slug generation**: server-side only, Catalan diacritics handled via NFD + `l·l`→`ll`
4. **FK cascade on delete**: check before deleting a category that no phrases reference it; for phrases, delete relations first
5. **No prerendering**: admin routes are always dynamic, never add `prerender = true`

## Existing Patterns to Reuse

- **DB access**: `import { db } from '$lib/server/db'` + `import { table } from '$lib/server/db/schema'` (see `src/lib/server/db/index.ts`)
- **Query pattern**: `db.select({...}).from(table).where(eq(col, val))` with destructured first result `const [item] = await db...` (see `src/routes/expressions/[id=integer]/+page.server.ts`)
- **404 pattern**: `if (!item) throw error(404, 'Catalan message')` (see `src/routes/expressions/[id=integer]/+page.server.ts:22`)
- **Svelte 5 props**: `let { data }: { data: PageData } = $props()` (see `src/routes/expressions/[id=integer]/+page.svelte:5`)
- **Layout pattern**: `let { children }: { children: Snippet } = $props()` + `{@render children()}` (see `src/routes/+layout.svelte`)
- **Design tokens**: `bg-brand`, `text-muted`, `bg-surface-card`, `border-border`, `rounded-xl`, card pattern (see `src/app.css`)
- **Input styling**: `rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none` (see `src/routes/design-system/+page.svelte:316`)
- **Button styling**: primary `rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer` (see `src/routes/design-system/+page.svelte:199`)
- **Insert pattern**: `db.insert(table).values({...}).returning({...})` (see `src/lib/server/db/seed.ts`)

## Verification

1. ✅ **Auth flow**: Navigate to `/admin` → redirected to `/admin/login` → enter wrong password → error message → enter correct password → dashboard
2. ✅ **Session**: close browser tab, reopen `/admin` → redirected to login (session cookie expired)
3. ✅ **Categories CRUD**: create a category → appears in list with auto-slug → edit name → slug updates → try delete with phrases → error → delete empty category → success
4. ✅ **Bulk create**: paste multiple categories separated by newlines → all created with correct slugs
5. ✅ **Phrases CRUD**: create phrase with category dropdown → appears in list → edit → update works → `searchVector` populated (check via Drizzle Studio)
6. ✅ **Relations**: on phrase edit page, add relation → both directions exist in DB → shows in public site → remove relation → both directions deleted
7. ✅ **Delete cascade**: delete phrase with relations → relations cleaned up → no orphan rows
8. ✅ **Production check**: `npm run build` succeeds, `npm run check` passes

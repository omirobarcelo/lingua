# Code Quality, Linter & Mobile Responsiveness

## Context

Lingua has no linter or formatter configured. The codebase is generally well-written (proper Svelte 5 runes, good Tailwind responsiveness), but has a few code quality gaps: missing error handling on definition reloads, missing aria-labels on interactive elements, and card padding that's slightly generous for small mobile screens.

---

## Part A: Linter & Formatter Setup

### A1. Scaffold ESLint + Prettier via `npx sv add`

```bash
npx sv add eslint
npx sv add prettier
```

This installs `eslint`, `eslint-plugin-svelte`, `typescript-eslint`, `prettier`, `prettier-plugin-svelte` and generates `eslint.config.js`, `.prettierrc`, `.prettierignore`.

### A2. Add npm scripts to `package.json`

```json
"lint": "eslint .",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

### A3. Optionally add `prettier-plugin-tailwindcss` for consistent class ordering

```bash
npm install -D prettier-plugin-tailwindcss
```

Add to `.prettierrc` plugins array.

### A4. Run formatter + linter across entire codebase

```bash
npm run format
npx eslint . --fix
npm run check
```

### A5. Create `.git-blame-ignore-revs` with the formatting commit hash

---

## Part B: Code Quality Fixes

### B1. Error handling in `reloadDefinition()` — [cerca/+page.svelte](src/routes/(main)/cerca/+page.svelte)

- Add `.catch(() => null)` to the promise chain (line 18-20)
- Add `{:catch}` blocks to both `{#await}` sections (after lines 71 and 97)

### B2. Aria-labels on reload buttons — [cerca/+page.svelte](src/routes/(main)/cerca/+page.svelte)

- Line 54: add `aria-label="Recarregar definicio GDLC"`
- Line 79: add `aria-label="Recarregar definicio DCVB"`

### B3. Aria-labels on nav and logo — [(main)/+layout.svelte](src/routes/(main)/+layout.svelte)

- `<nav>`: add `aria-label="Navegacio principal"`
- Logo `<a>`: add `aria-label="Lingua - Pagina principal"`

### B4. Fix spinner accessibility + `searching` state — [+page.svelte](src/routes/(main)/+page.svelte)

- Add `role="status"` and `aria-label="Cercant..."` to spinner SVG
- Add `.catch(() => { searching = false; })` to `goto()` call

### B5. Add `break-words` to long phrase links

- [expressions/[id=integer]/+page.svelte](src/routes/(main)/expressions/[id=integer]/+page.svelte) line 39
- [cerca/+page.svelte](src/routes/(main)/cerca/+page.svelte) line 108

---

## Part C: Mobile Responsiveness

### C1. Reduce header/main padding on small screens — [(main)/+layout.svelte](src/routes/(main)/+layout.svelte)

- Header inner div: `px-6` -> `px-4 sm:px-6`
- `<main>`: `px-6` -> `px-4 sm:px-6`

### C2. Stack search form on narrow screens — [+page.svelte](src/routes/(main)/+page.svelte)

- Form: `flex gap-3` -> `flex flex-col sm:flex-row gap-3`
- Button: `min-w-25` -> `sm:min-w-25`

### C3. Reduce card padding on mobile

In these files, change `p-8` to `p-5 sm:p-8`:
- [+page.svelte](src/routes/(main)/+page.svelte) (home) — lines 23, 50
- [cerca/+page.svelte](src/routes/(main)/cerca/+page.svelte) — lines 103, 117
- [expressions/[id=integer]/+page.svelte](src/routes/(main)/expressions/[id=integer]/+page.svelte) — lines 23, 28, 34

### C4. Reduce definition card inner padding on mobile — [cerca/+page.svelte](src/routes/(main)/cerca/+page.svelte)

- Card headers and content: `px-6` -> `px-4 sm:px-6`
- Applies to both GDLC and DCVB definition cards

---

## Commit Strategy

1. **"chore: add ESLint and Prettier with Svelte support"** — config files + scripts (A1-A3)
2. **"chore: apply Prettier formatting to entire codebase"** — pure formatting (A4-A5)
3. **"fix: add error handling and aria-labels to public routes"** — B1-B5
4. **"style: improve mobile spacing for small screens"** — C1-C4

---

## Verification

1. `npm run lint` — no errors
2. `npm run format:check` — all files formatted
3. `npm run check` — svelte-check passes
4. `npm run dev` — manually verify:
   - Home page search form stacks on narrow viewport
   - Definition cards have tighter padding on mobile
   - Reload buttons have accessible labels (inspect via dev tools)
   - Trigger a definition reload error (disconnect network) — should show fallback, not crash

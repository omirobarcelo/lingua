# SEO & Accessibility Plan

## Context

Lingua has good foundations (SSR, semantic HTML, `lang="ca"`, titles on every page) but is invisible to search engines: no meta descriptions, no sitemap, no `robots.txt`, no structured data. Accessibility is decent but has gaps (missing input labels, no skip link, borderline color contrast). Since Google rewards accessible sites, both tracks reinforce each other.

---

## Phase 1: Accessibility Foundations ✅

> Fixes that improve both a11y scores and SEO positioning.

**Completed.** Lighthouse a11y score: **100**. All axe-core audits pass.

**Changes made:**

- `src/app.css`: `--color-brand` → `primary-700` (#ba2d0e, ~5.9:1), `--color-brand-hover` → `primary-800`, `--color-muted` → `neutral-600`. Added `.skip-link` styles.
- `src/routes/(main)/+layout.svelte`: Skip link + `id="main-content"` on `<main>`. Nav link changed from `text-white/90` to `text-white` for contrast compliance.
- `src/routes/(main)/+page.svelte`: `<label for="home-search">` + `id="home-search"` on search input.

**Also set up automated a11y testing:**

- `tests/a11y.test.ts`: axe-core tests via Playwright for `/`, `/cerca`, `/expressions`
- `lighthouserc.cjs`: Lighthouse CI config with 95+ a11y score threshold
- `.github/workflows/a11y.yml`: GitHub Actions workflow with Neon branch per run
- Scripts: `npm run test:a11y`, `npm run test:lighthouse`

---

## Phase 2: Meta Descriptions, Canonical URLs, and `noindex` ✅

> Tell search engines what each page is about and which URL is authoritative.

**Completed.** All 5 public routes have meta descriptions and canonical URLs. Search page is marked `noindex`.

**Changes made:**

- `src/lib/seo.ts` (new): exports `SITE_URL` (from `PUBLIC_SITE_URL` with fallback) and `canonical(path)` helper.
- All 5 public page `.svelte` files: `<meta name="description">` + `<link rel="canonical">` in `<svelte:head>`.
- `/cerca`: additionally has `<meta name="robots" content="noindex">`.
- Category detail: dynamic description with category name + description.
- Phrase detail: dynamic description with phrase text + explanation + category name.
- Added `PUBLIC_SITE_URL` to `.env.example`, CI workflow, and all env var docs.

---

## Phase 3: Open Graph & Twitter Card Tags ✅

> Control how pages appear when shared on social media.

**Completed.** Created `SeoHead.svelte` component and refactored all 5 public pages to use it.

**Changes made:**

- `src/lib/components/SeoHead.svelte` (new): accepts `title`, `description`, `path`, optional `noindex`. Renders `<title>`, `<meta name="description">`, `<link rel="canonical">`, all OG tags (`og:type`, `og:title`, `og:description`, `og:url`, `og:image`, `og:locale=ca`, `og:site_name=Lingua`), and `twitter:card=summary`. Uses `/icons/icon-512.png` as OG image.
- All 5 public page `.svelte` files: replaced inline `<svelte:head>` meta tags with `<SeoHead>` component usage. `/cerca` passes `noindex` prop.

---

## Phase 4: `robots.txt`, Sitemap, and Admin `noindex`

> Let crawlers discover all pages and stay out of admin/API routes.

**Files to create/modify:**

| File                                      | Changes                                                                                                                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/robots.txt/+server.ts` (new)  | `Allow: /`, `Disallow: /admin/`, `/cerca`, `/api/`, `/design-system`, `/sistema-disseny`. Points to sitemap.                                                         |
| `src/routes/sitemap.xml/+server.ts` (new) | Dynamic sitemap querying DB for all categories (`slug`) and phrases (`id`). Static entries for `/` and `/expressions`. Returns XML with `changefreq` and `priority`. |
| `src/routes/admin/+layout.svelte`         | Add `<svelte:head><meta name="robots" content="noindex, nofollow"></svelte:head>` as defense-in-depth.                                                               |

**Verify:** Visit `/robots.txt` and `/sitemap.xml` in browser. Validate sitemap XML structure.

---

## Phase 5: JSON-LD Structured Data

> Help Google understand content semantically for potential rich results.

**Files to modify:**

| File                                                      | Schema Type                                                                     |
| --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/routes/(main)/+page.svelte`                          | `WebSite` with `SearchAction` pointing to `/cerca?paraula={search_term_string}` |
| `src/routes/(main)/expressions/+page.svelte`              | `CollectionPage`                                                                |
| `src/routes/(main)/expressions/[slug]/+page.svelte`       | `DefinedTermSet` with category name/description                                 |
| `src/routes/(main)/expressions/[id=integer]/+page.svelte` | `DefinedTerm` with phrase text, explanation, parent `DefinedTermSet`            |

All use `"inLanguage": "ca"` and are injected via `{@html '<script type="application/ld+json">...'}`.

**Verify:** Google Rich Results Test, validator.schema.org.

---

## Phase 6: Measurement & Google Search Console (manual steps)

> Not code changes — post-deploy checklist.

### Accessibility measurement (partially automated in Phase 1)

- ✅ **Lighthouse CI** (`npm run test:lighthouse`): automated in GitHub Actions, fails if score < 95.
- ✅ **axe-core** (`npm run test:a11y`): automated via Playwright, runs on every push/PR.
- **axe DevTools** browser extension: manual deeper audit for edge cases.
- **WAVE** (wave.webaim.org): visual overlay of a11y problems.
- **Manual keyboard test**: tab through every page, confirm all interactive elements reachable, focus visible, skip link works.
- **Screen reader test**: VoiceOver (Cmd+F5 on macOS) to navigate the site and verify content announced correctly.

### Google Search Console setup

1. Go to search.google.com/search-console.
2. Add property for the production domain.
3. Verify ownership via DNS TXT record (easiest with Vercel: add the record in Vercel DNS settings).
4. Submit sitemap: `https://<domain>/sitemap.xml`.
5. Monitor indexing weekly for the first month.
6. Check "Enhancements" section for structured data validation results.

### Ongoing monitoring

- Google Search Console: weekly for first month, then monthly.
- Re-run Lighthouse after each deploy that touches UI.
- Check "Coverage" report for indexing errors.

---

## Notes

- **Color change impact**: Darkening `--color-brand` affects the entire site. The header `bg-brand` with white text will get better contrast. Links on white become more readable. Review design system pages after the change.
- **`SITE_URL`**: Use `PUBLIC_SITE_URL` env var so it works across environments. Hardcode fallback to production domain.
- **Sitemap scale**: Current DB is small. If it grows past 10k phrases, consider caching or ISR for the sitemap route.
- **`SeoHead` component**: Worth it to avoid repeating 10+ meta tags across 5 pages. If we skip it, inline tags work fine too.

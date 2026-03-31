# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Lingua SvelteKit application. The following files were created or modified:

- **`src/hooks.client.ts`** (new) — initialises `posthog-js` on app boot via the SvelteKit `init` hook, routing traffic through the `/ingest` reverse proxy. Also wires `handleError` to automatically capture all unhandled client-side exceptions.
- **`src/hooks.server.ts`** (new) — implements the `/ingest` reverse proxy (EU cluster) to avoid ad-blocker interference, and captures server-side errors via `handleError` using `posthog-node`.
- **`src/lib/server/posthog.ts`** (new) — singleton factory for the server-side `posthog-node` client, configured with `flushAt: 1` and `flushInterval: 0` for reliable event delivery in serverless environments.
- **`svelte.config.js`** (modified) — added `paths: { relative: false }` required for PostHog session replay to work correctly with SSR.
- **`.env`** (updated) — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set to project values (EU cluster).

## Events instrumented

| Event                          | Description                                                                                                                                                 | File                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `word_searched`                | User submits a word search from the home page form                                                                                                          | `src/routes/+page.svelte`                          |
| `search_results_viewed`        | User lands on the search results page — top of the word-search funnel. Properties: `word`, `result_count`, `has_results`                                    | `src/routes/cerca/+page.svelte`                    |
| `phrase_clicked_from_search`   | User clicks a phrase link on the search results page. Properties: `phrase_id`, `phrase_text`, `search_word`                                                 | `src/routes/cerca/+page.svelte`                    |
| `category_clicked`             | User clicks a category card on the expressions browse page. Properties: `category_slug`, `category_name`                                                    | `src/routes/expressions/+page.svelte`              |
| `phrase_clicked_from_category` | User clicks a phrase card within a category listing. Properties: `phrase_id`, `phrase_text`, `category_slug`, `category_name`                               | `src/routes/expressions/[slug]/+page.svelte`       |
| `related_phrase_clicked`       | User clicks a related phrase link on a phrase detail page. Properties: `related_phrase_id`, `related_phrase_text`, `source_phrase_id`, `source_phrase_text` | `src/routes/expressions/[id=integer]/+page.svelte` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/144826/dashboard/584716
- **Word searches over time**: https://eu.posthog.com/project/144826/insights/hllh5qLw
- **Search-to-phrase click funnel**: https://eu.posthog.com/project/144826/insights/RfCJ1X8i
- **Category engagement over time**: https://eu.posthog.com/project/144826/insights/ADIQcBgb
- **Search quality: results vs. no results**: https://eu.posthog.com/project/144826/insights/tU2tcJqT
- **Related phrase clicks over time**: https://eu.posthog.com/project/144826/insights/smqHU0w6

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

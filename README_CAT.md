# Lingua

Diccionari d'expressions i frases fetes catalanes amb cerca de text complet i navegació per categories.

## Característiques

- **Cerca de Paraules** (`/cerca?paraula=X`): Cerca una paraula, consulta les definicions del DCVB i GDLC en paral·lel, i les expressions que la contenen
- **Consulta d'Expressions** (`/expressions`): Explora expressions catalanes organitzades per categories, amb explicacions detallades i expressions relacionades
- **Cerca de Text Complet en Català**: PostgreSQL FTS amb configuració de stemming català i concordança insensible als accents
- **PWA**: Aplicació web progressiva instal·lable amb navegació amb memòria cau
- **Panell d'Administració** (`/admin`): Interfície CRUD protegida amb contrasenya per gestionar categories, expressions i relacions
- **Analítica**: Integració amb PostHog amb proxy invers, esdeveniments personalitzats i enregistrament de sessions

## Stack Tecnològic

- **Framework**: SvelteKit 2 + Svelte 5 + TypeScript
- **Build**: Vite 8
- **Estils**: TailwindCSS v4 amb sistema de disseny personalitzat (paleta vermellosa `#fb542b`)
- **Linting**: ESLint (flat config) amb `eslint-plugin-svelte` + `typescript-eslint`
- **Format**: Prettier amb `prettier-plugin-svelte` + `prettier-plugin-tailwindcss`
- **ORM**: Drizzle ORM (`drizzle-orm` + driver `postgres`)
- **Base de dades**: PostgreSQL 16 (Docker localment, Neon serverless en producció)
- **PWA**: `@vite-pwa/sveltekit` (generateSW, autoUpdate)
- **Analítica**: PostHog (`posthog-js` client + `posthog-node` servidor)
- **Desplegament**: Vercel + Neon (via Vercel Managed Integration)

## Rutes

| Ruta                       | Descripció                                                      |
| -------------------------- | --------------------------------------------------------------- |
| `/`                        | Pàgina d'inici amb cerca de paraules                            |
| `/cerca?paraula=<paraula>` | Resultats de cerca amb definicions del DCVB + GDLC              |
| `/expressions`             | Llista de categories                                            |
| `/expressions/<slug>`      | Expressions d'una categoria                                     |
| `/expressions/<id>`        | Detall d'una expressió amb expressions relacionades             |
| `/admin`                   | Panell d'administració (requereix autenticació)                 |
| `/admin/categories`        | Gestió de categories (crear, editar, eliminar, creació massiva) |
| `/admin/frases`            | Gestió d'expressions (crear, editar, eliminar, creació massiva) |
| `/admin/frases/<id>`       | Editar expressió + gestionar expressions relacionades           |
| `/design-system`           | Referència del sistema de disseny (anglès)                      |
| `/sistema-disseny`         | Referència del sistema de disseny (català)                      |

## Desenvolupament Local

### Prerequisits

- Node.js 18+
- Docker i Docker Compose

### Configuració

```bash
git clone <repository-url>
cd lingua
npm install
cp .env.example .env              # Configura les variables d'entorn
docker compose up -d               # Inicia PostgreSQL local
npm run db:setup:fts               # Fase 1: extensions + configuració FTS
npm run db:push                    # Aplica l'esquema (crea les taules)
npm run db:setup:trigger           # Fase 2: trigger + backfill
npm run db:seed                    # Insereix dades de mostra
npm run dev                        # Inicia el servidor a localhost:5173
```

### Scripts Disponibles

| Comanda                      | Descripció                                                           |
| ---------------------------- | -------------------------------------------------------------------- |
| `npm run dev`                | Inicia el servidor de desenvolupament (Vite, port 5173)              |
| `npm run build`              | Build de producció                                                   |
| `npm run preview`            | Previsualitza el build de producció                                  |
| `npm run check`              | Comprovació de tipus TypeScript (`svelte-kit sync` + `svelte-check`) |
| `npm run lint`               | Executa ESLint                                                       |
| `npm run format`             | Formata tots els fitxers amb Prettier                                |
| `npm run format:check`       | Comprova el format sense escriure                                    |
| `docker compose up -d`       | Inicia PostgreSQL 16 local                                           |
| `npm run db:setup:fts`       | Fase 1: extensions + config FTS (abans de `db:push`)                 |
| `npm run db:generate`        | Genera fitxers SQL de migració Drizzle                               |
| `npm run db:push`            | Aplica l'esquema directament a la BD                                 |
| `npm run db:setup:trigger`   | Fase 2: trigger + backfill (després de `db:push`)                    |
| `npm run db:seed`            | Insereix 5 categories + 25 expressions + relacions                   |
| `npm run db:studio`          | Obre la GUI de Drizzle Studio                                        |
| `npm run db:pull`            | Descarrega dades de Neon a la BD local                               |
| `npm run db:pull -- --merge` | Fusiona dades de Neon a la BD local (omet conflictes)                |

## Base de Dades

### Esquema

Tres taules definides a `src/lib/server/db/schema.ts`:

- **categories**: `id`, `name`, `slug` (únic), `description`
- **phrases**: `id`, `category_id` (FK), `phrase_text`, `explanation`, `search_vector` (tsvector, actualitzat automàticament per trigger)
- **phrase_relations**: `id`, `phrase_id` (FK), `related_phrase_id` (FK)

### Arquitectura de Cerca de Text Complet

- Configuració FTS `public.catalan` personalitzada amb pre-filtre `catalan_unaccent` per a concordança insensible als accents
- Dos índexs GIN: stemming català (primari) i simple (fallback per a paraules arcaiques)
- Cerca en dues fases: stemming català primer, fallback simple si 0 resultats
- Lògica AND amb prefix a l'últim token (p. ex., `"bots i"` → `bots & i:*`)

### Configuració de BD des de zero (l'ordre importa!)

```bash
npm run db:setup:fts       # Fase 1: extensions + config FTS (sense dependència de taules)
npm run db:push            # Aplica l'esquema (crea les taules)
npm run db:setup:trigger   # Fase 2: trigger + backfill (requereix la taula phrases)
npm run db:seed            # Opcional: insereix dades de mostra
```

## Variables d'Entorn

| Variable                       | Àmbit                | Descripció                                                   |
| ------------------------------ | -------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`                 | Servidor (privada)   | Cadena de connexió PostgreSQL                                |
| `NEON_DATABASE_URL`            | Només local (`.env`) | Cadena de connexió Neon per a l'script `db:pull`             |
| `PUBLIC_POSTHOG_ENABLED`       | Client (pública)     | `true`/`false` — activa/desactiva PostHog                    |
| `PUBLIC_POSTHOG_PROJECT_TOKEN` | Client (pública)     | Clau API del projecte PostHog                                |
| `PUBLIC_POSTHOG_HOST`          | Client (pública)     | Host d'ingestió PostHog (p. ex., `https://eu.i.posthog.com`) |
| `ADMIN_PASSWORD`               | Servidor (privada)   | Contrasenya compartida per al panell d'administració         |
| `ADMIN_SESSION_SECRET`         | Servidor (privada)   | Secret HMAC per signar les cookies de sessió d'admin         |

## Desplegament

L'aplicació està desplegada a **Vercel** amb **Neon** (PostgreSQL serverless) via la Vercel Managed Integration.

- La integració aprovisiona automàticament `DATABASE_URL` a l'entorn del projecte Vercel
- Les variables de PostHog i d'admin (`ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`) s'han d'afegir manualment a la configuració del projecte Vercel
- `src/lib/server/db/index.ts` utilitza el driver `postgres` localment i `@neondatabase/serverless` en producció

Per inicialitzar la base de dades Neon:

```bash
DATABASE_URL="<cadena-connexió-neon>" npm run db:setup:fts
DATABASE_URL="<cadena-connexió-neon>" npm run db:push
DATABASE_URL="<cadena-connexió-neon>" npm run db:setup:trigger
DATABASE_URL="<cadena-connexió-neon>" npm run db:seed
```

## Estructura del Projecte

```
src/
├── app.html              # HTML shell (lang="ca")
├── app.css               # TailwindCSS v4 @import + @theme tokens de disseny
├── hooks.client.ts       # Inicialització PostHog client + captura d'errors
├── hooks.server.ts       # Guarda d'auth admin + proxy invers /ingest + captura d'errors servidor
├── params/
│   └── integer.ts        # Matcher de paràmetres de ruta per a IDs numèrics
├── lib/
│   ├── components/admin/         # Components UI d'admin (camp, toast, diàleg)
│   ├── stores/                   # Stores de toast + diàleg de confirmació
│   ├── utils/slug.ts             # Generació de slugs amb suport català
│   └── server/
│       ├── admin/auth.ts         # Auth de sessió HMAC (login, logout, guarda)
│       ├── posthog.ts            # Singleton posthog-node
│       ├── definitions/
│       │   ├── dcvb.ts           # Obtenció/parsing de definicions del DCVB
│       │   └── gdlc.ts           # Obtenció/parsing de definicions del GDLC
│       └── db/
│           ├── index.ts          # Client Drizzle (postgres local, Neon en prod)
│           ├── schema.ts         # Definicions de taules + tsvector + índexs GIN
│           ├── setup-fts.sql     # Fase 1: extensió unaccent + config FTS català
│           ├── setup-trigger.sql # Fase 2: trigger + backfill
│           ├── run-setup.ts      # Script per executar SQL de configuració
│           └── seed.ts           # Dades de mostra per a desenvolupament
└── routes/
    ├── +layout.svelte    # Shell: capçalera + navegació + registre SW
    ├── +page.svelte      # Inici: formulari de cerca + secció sobre
    ├── cerca/            # Cerca de paraules (FTS)
    ├── expressions/      # Navegació d'expressions per categoria
    ├── api/definitions/  # Endpoint API per recarregar definicions
    ├── admin/            # Panell d'admin (CRUD de categories, expressions, relacions)
    ├── design-system/    # Referència del sistema de disseny (EN)
    └── sistema-disseny/  # Referència del sistema de disseny (CA)
```

---

For the English version of this README, see [README.md](README.md).

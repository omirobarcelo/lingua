# Lingua

Diccionari d'expressions catalanes amb cerca de paraules i consulta d'expressions per categories.

## Característiques

- **Cerca de Paraules**: Cerca paraules per veure la seva definició (integració amb DCVB) i expressions que les contenen
- **Consulta d'Expressions**: Explora expressions catalanes organitzades per categories
- **Base de dades Postgres**: Utilitza Drizzle ORM amb columnes tsvector per a cerca amb stemming
- **Desplegament a Vercel**: Configurat amb l'adaptador de Vercel per a desplegament fàcil

## Estructura del Projecte

```
src/
├── lib/
│   └── server/
│       └── db/
│           ├── schema.ts      # Esquema de base de dades Drizzle
│           └── index.ts       # Connexió a la base de dades
├── params/
│   └── integer.ts            # Validador de paràmetres per a IDs
├── routes/
│   ├── +layout.svelte        # Layout principal
│   ├── +page.svelte          # Pàgina d'inici
│   ├── cerca/
│   │   ├── +page.svelte      # Resultats de cerca de paraules
│   │   └── +page.server.ts
│   └── expressions/
│       ├── +page.svelte      # Llista de categories
│       ├── +page.server.ts
│       ├── [slug]/           # Detall de categoria
│       │   ├── +page.svelte
│       │   └── +page.server.ts
│       └── [id=integer]/     # Detall d'expressió
│           ├── +page.svelte
│           └── +page.server.ts
└── app.css                   # Estils globals
```

## Desenvolupament Local

### Prerequisits

- Node.js 18+
- Docker i Docker Compose
- npm o pnpm

### Configuració

1. Clona el repositori:
```bash
git clone <repository-url>
cd lingua
```

2. Instal·la les dependències:
```bash
npm install
```

3. Inicia la base de dades Postgres amb Docker:
```bash
docker-compose up -d
```

4. Configura les variables d'entorn:
```bash
cp .env.example .env
```

L'arxiu `.env` ja està configurat per a desenvolupament local amb:
```
DATABASE_URL=postgres://lingua:lingua_dev_password@localhost:5432/lingua
```

5. (Opcional) Genera i aplica migracions de la base de dades:
```bash
npm run db:generate
npm run db:push
```

6. Inicia el servidor de desenvolupament:
```bash
npm run dev
```

L'aplicació estarà disponible a `http://localhost:5173`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desenvolupament
- `npm run build` - Construeix l'aplicació per a producció
- `npm run preview` - Previsualitza la construcció de producció
- `npm run check` - Comprova el tipus TypeScript
- `npm run db:generate` - Genera migracions de Drizzle
- `npm run db:push` - Aplica l'esquema a la base de dades
- `npm run db:studio` - Obre Drizzle Studio per a gestió de base de dades

## Estructura de la Base de Dades

### Taules

#### `categories`
- `id` (serial, primary key)
- `name` (text) - Nom de la categoria
- `slug` (text, unique) - Slug per a URLs
- `description` (text) - Descripció de la categoria

#### `phrases`
- `id` (serial, primary key)
- `category_id` (integer, foreign key) - Referència a categories
- `phrase_text` (text) - Text de l'expressió
- `explanation` (text) - Explicació de l'expressió
- `search_vector` (text) - Columna tsvector per a cerca amb stemming

#### `phrase_relations`
- `id` (serial, primary key)
- `phrase_id` (integer, foreign key) - Referència a phrases
- `related_phrase_id` (integer, foreign key) - Referència a l'expressió relacionada

## Implementació Actual

Actualment, l'aplicació utilitza dades mock hardcoded per a demostració. Les dades reals s'afegiran a la base de dades en futures iteracions.

## Desplegament a Vercel

1. Crea un projecte a [Vercel](https://vercel.com)

2. Crea una base de dades Postgres a [Neon](https://neon.tech)

3. Configura les variables d'entorn a Vercel:
```
DATABASE_URL=<your-neon-connection-string>
```

4. Desplega:
```bash
vercel deploy
```

o connecta el repositori de GitHub per a desplegament automàtic.

## Rutes

- `/` - Pàgina d'inici amb cerca de paraules
- `/cerca?paraula=<paraula>` - Resultats de cerca de paraules
- `/expressions` - Llista de categories d'expressions
- `/expressions/<category-slug>` - Expressions d'una categoria
- `/expressions/<phrase-id>` - Detall d'una expressió

## Tecnologies

- **SvelteKit** - Framework fullstack
- **TypeScript** - Tipus estàtics
- **Drizzle ORM** - ORM per a PostgreSQL
- **PostgreSQL** - Base de dades amb suport per a tsvector
- **Docker** - Contenidorització per a desenvolupament local
- **Vercel** - Plataforma de desplegament
- **Neon** - Base de dades Postgres serverless per a producció

## Futures Millores

- [ ] Poblar la base de dades amb expressions reals
- [ ] Implementar cerca full-text amb tsvector
- [ ] Afegir autenticació per a gestió d'expressions
- [ ] Interfície d'administració per a afegir/editar expressions
- [ ] API pública per a tercers
- [ ] Tests unitaris i d'integració
- [ ] Millores d'accessibilitat
- [ ] Suport per a múltiples idiomes (català, castellà, anglès)

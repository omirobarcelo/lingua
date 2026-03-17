# Lingua

Catalan phrase dictionary with word search and phrase consultation by categories.

## Features

- **Word Search**: Search for words to view their definition (DCVB integration) and phrases that contain them
- **Phrase Consultation**: Browse Catalan phrases organized by categories
- **Postgres Database**: Uses Drizzle ORM with tsvector columns for stemmed search
- **Vercel Deployment**: Configured with Vercel adapter for easy deployment

## Project Structure

```
src/
├── lib/
│   └── server/
│       └── db/
│           ├── schema.ts      # Drizzle database schema
│           └── index.ts       # Database connection
├── params/
│   └── integer.ts            # Parameter validator for IDs
├── routes/
│   ├── +layout.svelte        # Main layout
│   ├── +page.svelte          # Home page
│   ├── cerca/
│   │   ├── +page.svelte      # Word search results
│   │   └── +page.server.ts
│   └── expressions/
│       ├── +page.svelte      # Category list
│       ├── +page.server.ts
│       ├── [slug]/           # Category detail
│       │   ├── +page.svelte
│       │   └── +page.server.ts
│       └── [id=integer]/     # Phrase detail
│           ├── +page.svelte
│           └── +page.server.ts
└── app.css                   # Global styles
```

## Local Development

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or pnpm

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd lingua
```

2. Install dependencies:
```bash
npm install
```

3. Start the Postgres database with Docker:
```bash
docker-compose up -d
```

4. Set up environment variables:
```bash
cp .env.example .env
```

The `.env` file is already configured for local development with:
```
DATABASE_URL=postgres://lingua:lingua_dev_password@localhost:5432/lingua
```

5. (Optional) Generate and apply database migrations:
```bash
npm run db:generate
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Check TypeScript types
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:push` - Apply schema to database
- `npm run db:studio` - Open Drizzle Studio for database management

## Database Structure

### Tables

#### `categories`
- `id` (serial, primary key)
- `name` (text) - Category name
- `slug` (text, unique) - Slug for URLs
- `description` (text) - Category description

#### `phrases`
- `id` (serial, primary key)
- `category_id` (integer, foreign key) - Reference to categories
- `phrase_text` (text) - Phrase text
- `explanation` (text) - Phrase explanation
- `search_vector` (text) - tsvector column for stemmed search

#### `phrase_relations`
- `id` (serial, primary key)
- `phrase_id` (integer, foreign key) - Reference to phrases
- `related_phrase_id` (integer, foreign key) - Reference to related phrase

## Current Implementation

Currently, the application uses hardcoded mock data for demonstration. Real data will be added to the database in future iterations.

## Deployment to Vercel

1. Create a project at [Vercel](https://vercel.com)

2. Create a Postgres database at [Neon](https://neon.tech)

3. Configure environment variables in Vercel:
```
DATABASE_URL=<your-neon-connection-string>
```

4. Deploy:
```bash
vercel deploy
```

or connect your GitHub repository for automatic deployment.

## Routes

- `/` - Home page with word search
- `/cerca?paraula=<word>` - Word search results
- `/expressions` - List of phrase categories
- `/expressions/<category-slug>` - Phrases in a category
- `/expressions/<phrase-id>` - Phrase detail

## Technologies

- **SvelteKit** - Fullstack framework
- **TypeScript** - Static typing
- **Drizzle ORM** - ORM for PostgreSQL
- **PostgreSQL** - Database with tsvector support
- **Docker** - Containerization for local development
- **Vercel** - Deployment platform
- **Neon** - Serverless Postgres database for production

## Future Improvements

- [ ] Populate database with real phrases
- [ ] Implement full-text search with tsvector
- [ ] Add authentication for phrase management
- [ ] Admin interface to add/edit phrases
- [ ] Public API for third parties
- [ ] Unit and integration tests
- [ ] Accessibility improvements
- [ ] Multi-language support (Catalan, Spanish, English)

## Development Plan

### Phase 1: Foundation (Completed)
- [x] Initialize SvelteKit project with TypeScript
- [x] Configure Vercel adapter
- [x] Set up Docker Compose for local Postgres
- [x] Configure Drizzle ORM with database schema
- [x] Create basic routes and pages
- [x] Implement basic CSS styling
- [x] Create hardcoded mock data for testing

### Phase 2: Database Population (Next)
- [ ] Design data import pipeline
- [ ] Create seed data script
- [ ] Populate categories table
- [ ] Populate phrases table with real Catalan expressions
- [ ] Set up phrase relationships
- [ ] Implement tsvector search functionality

### Phase 3: Search Enhancement
- [ ] Implement full-text search with PostgreSQL tsvector
- [ ] Add stemming support for Catalan language
- [ ] Optimize search queries with indexes
- [ ] Add search filters (by category, relevance)
- [ ] Implement autocomplete for search

### Phase 4: Content Management
- [ ] Design admin authentication system
- [ ] Create admin dashboard
- [ ] Build CRUD interface for categories
- [ ] Build CRUD interface for phrases
- [ ] Add phrase relationship management
- [ ] Implement content validation

### Phase 5: Polish & Deploy
- [ ] Add loading states and error handling
- [ ] Implement proper SEO metadata
- [ ] Add analytics
- [ ] Performance optimization
- [ ] Deploy to Vercel with Neon database
- [ ] Set up CI/CD pipeline

---

For the Catalan version of this README, see [README_CAT.md](README_CAT.md).

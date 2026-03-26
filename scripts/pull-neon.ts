/**
 * Pull data from Neon and load it into the local Docker PostgreSQL.
 *
 * Usage:
 *   npm run db:pull              # Replace local data with Neon data
 *   npm run db:pull -- --merge   # Add Neon data into local (skip conflicts)
 *
 * Requires NEON_DATABASE_URL in .env (pooled Neon connection string).
 */

import { neon } from '@neondatabase/serverless';
import postgres from 'postgres';

const neonUrl = process.env.NEON_DATABASE_URL;
const localUrl = process.env.DATABASE_URL;

if (!neonUrl) {
	console.error('Missing NEON_DATABASE_URL in .env');
	process.exit(1);
}
if (!localUrl) {
	console.error('Missing DATABASE_URL in .env');
	process.exit(1);
}

const merge = process.argv.includes('--merge');

const remote = neon(neonUrl);
const local = postgres(localUrl);

try {
	console.log(`Mode: ${merge ? 'merge (skip conflicts)' : 'replace (truncate + insert)'}`);

	// Pull data from Neon
	console.log('Pulling from Neon...');
	const categories = await remote`SELECT * FROM categories ORDER BY id`;
	const phrases = await remote`SELECT id, category_id, phrase_text, explanation FROM phrases ORDER BY id`;
	const relations = await remote`SELECT * FROM phrase_relations ORDER BY id`;

	console.log(`  categories: ${categories.length}, phrases: ${phrases.length}, relations: ${relations.length}`);

	if (!merge) {
		// Replace mode: truncate and re-insert
		console.log('Truncating local tables...');
		await local`TRUNCATE phrase_relations, phrases, categories RESTART IDENTITY CASCADE`;
	}

	// Insert categories
	if (categories.length > 0) {
		const conflict = merge ? local`ON CONFLICT (id) DO NOTHING` : local``;
		await local`
			INSERT INTO categories ${local(categories as Record<string, unknown>[], 'id', 'name', 'slug', 'description')}
			${conflict}
		`;
		console.log(`  Inserted categories`);
	}

	// Insert phrases (without search_vector — the trigger fills it)
	if (phrases.length > 0) {
		const conflict = merge ? local`ON CONFLICT (id) DO NOTHING` : local``;
		await local`
			INSERT INTO phrases ${local(phrases as Record<string, unknown>[], 'id', 'category_id', 'phrase_text', 'explanation')}
			${conflict}
		`;
		console.log(`  Inserted phrases`);
	}

	// Insert relations
	if (relations.length > 0) {
		const conflict = merge ? local`ON CONFLICT (id) DO NOTHING` : local``;
		await local`
			INSERT INTO phrase_relations ${local(relations as Record<string, unknown>[], 'id', 'phrase_id', 'related_phrase_id')}
			${conflict}
		`;
		console.log(`  Inserted relations`);
	}

	// Reset sequences to max id so future inserts don't conflict
	await local`SELECT setval('categories_id_seq', COALESCE((SELECT MAX(id) FROM categories), 1))`;
	await local`SELECT setval('phrases_id_seq', COALESCE((SELECT MAX(id) FROM phrases), 1))`;
	await local`SELECT setval('phrase_relations_id_seq', COALESCE((SELECT MAX(id) FROM phrase_relations), 1))`;

	console.log('Done!');
} finally {
	await local.end();
}

import { pgTable, serial, text, integer, index, customType } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const tsvector = customType<{ data: string }>({
	dataType() {
		return 'tsvector';
	}
});

export const categories = pgTable('categories', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description')
});

export const phrases = pgTable(
	'phrases',
	{
		id: serial('id').primaryKey(),
		categoryId: integer('category_id')
			.notNull()
			.references(() => categories.id),
		phraseText: text('phrase_text').notNull(),
		explanation: text('explanation').notNull(),
		searchVector: tsvector('search_vector') // auto-updated by DB trigger
	},
	(table) => [
		// GIN on stored tsvector (catalan stemmed) — primary FTS
		index('search_vector_idx').using('gin', table.searchVector),
		// GIN expression index on 'simple' config — fallback for archaic words
		index('search_simple_idx').using('gin', sql`to_tsvector('simple', ${table.phraseText})`)
	]
);

export const phraseRelations = pgTable('phrase_relations', {
	id: serial('id').primaryKey(),
	phraseId: integer('phrase_id')
		.notNull()
		.references(() => phrases.id),
	relatedPhraseId: integer('related_phrase_id')
		.notNull()
		.references(() => phrases.id)
});

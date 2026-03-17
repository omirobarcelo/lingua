import { pgTable, serial, text, integer, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

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
		searchVector: text('search_vector')
	},
	(table) => ({
		searchVectorIdx: index('search_vector_idx').on(table.searchVector)
	})
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

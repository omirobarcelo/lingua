import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, phrases, phraseRelations } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const phraseId = parseInt(params.id);

	const [phrase] = await db
		.select({
			id: phrases.id,
			phraseText: phrases.phraseText,
			explanation: phrases.explanation,
			categoryId: phrases.categoryId
		})
		.from(phrases)
		.where(eq(phrases.id, phraseId))
		.limit(1);

	if (!phrase) {
		throw error(404, 'Expressió no trobada');
	}

	const [category] = await db
		.select({ name: categories.name, slug: categories.slug })
		.from(categories)
		.where(eq(categories.id, phrase.categoryId))
		.limit(1);

	if (!category) {
		throw error(404, 'Categoria no trobada');
	}

	// Find related phrases
	const relations = await db
		.select({ relatedPhraseId: phraseRelations.relatedPhraseId })
		.from(phraseRelations)
		.where(eq(phraseRelations.phraseId, phraseId));

	const relatedPhraseIds = relations.map((r) => r.relatedPhraseId);

	const relatedPhrases =
		relatedPhraseIds.length > 0
			? await db
					.select({
						id: phrases.id,
						phraseText: phrases.phraseText,
						explanation: phrases.explanation
					})
					.from(phrases)
					.where(inArray(phrases.id, relatedPhraseIds))
			: [];

	return {
		phrase,
		categoryName: category.name,
		categorySlug: category.slug,
		relatedPhrases
	};
};

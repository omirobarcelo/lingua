import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, phrases } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const [category] = await db
		.select()
		.from(categories)
		.where(eq(categories.slug, params.slug))
		.limit(1);

	if (!category) {
		throw error(404, 'Categoria no trobada');
	}

	const categoryPhrases = await db
		.select({
			id: phrases.id,
			phraseText: phrases.phraseText,
			explanation: phrases.explanation
		})
		.from(phrases)
		.where(eq(phrases.categoryId, category.id))
		.orderBy(phrases.phraseText);

	return {
		category,
		phrases: categoryPhrases
	};
};

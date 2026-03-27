import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and, or, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, phrases, phraseRelations } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw error(400, 'ID invàlid');

	const [phrase] = await db
		.select({
			id: phrases.id,
			phraseText: phrases.phraseText,
			explanation: phrases.explanation,
			categoryId: phrases.categoryId
		})
		.from(phrases)
		.where(eq(phrases.id, id))
		.limit(1);

	if (!phrase) throw error(404, 'Frase no trobada');

	const allCategories = await db
		.select({ id: categories.id, name: categories.name })
		.from(categories)
		.orderBy(categories.name);

	// Get related phrases
	const relations = await db
		.select({ relatedPhraseId: phraseRelations.relatedPhraseId })
		.from(phraseRelations)
		.where(eq(phraseRelations.phraseId, id));

	const relatedPhraseIds = relations.map((r) => r.relatedPhraseId);

	const relatedPhrases =
		relatedPhraseIds.length > 0
			? await db
					.select({ id: phrases.id, phraseText: phrases.phraseText })
					.from(phrases)
					.where(inArray(phrases.id, relatedPhraseIds))
			: [];

	// Get all other phrases for the relation picker (exclude self and already related)
	const excludeIds = [id, ...relatedPhraseIds];
	const availablePhrases = await db
		.select({ id: phrases.id, phraseText: phrases.phraseText })
		.from(phrases)
		.orderBy(phrases.phraseText);

	const filteredAvailable = availablePhrases.filter((p) => !excludeIds.includes(p.id));

	return {
		phrase,
		categories: allCategories,
		relatedPhrases,
		availablePhrases: filteredAvailable
	};
};

export const actions: Actions = {
	update: async ({ params, request }) => {
		const id = parseInt(params.id);
		const data = await request.formData();
		const phraseText = (data.get('phraseText') as string)?.trim();
		const explanation = (data.get('explanation') as string)?.trim();
		const categoryId = parseInt(data.get('categoryId') as string);

		const errors: Record<string, string> = {};
		if (!phraseText) errors.phraseText = "El text és obligatori";
		if (!explanation) errors.explanation = "L'explicació és obligatòria";
		if (isNaN(categoryId)) errors.categoryId = 'Selecciona una categoria';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}

		// Never set searchVector — trigger handles it
		await db
			.update(phrases)
			.set({ phraseText, explanation, categoryId })
			.where(eq(phrases.id, id));

		return { success: true, message: 'Frase actualitzada' };
	},

	delete: async ({ params }) => {
		const id = parseInt(params.id);

		// Delete relations first (both directions)
		await db
			.delete(phraseRelations)
			.where(
				or(eq(phraseRelations.phraseId, id), eq(phraseRelations.relatedPhraseId, id))
			);

		await db.delete(phrases).where(eq(phrases.id, id));
		throw redirect(303, '/admin/frases');
	},

	addRelation: async ({ params, request }) => {
		const phraseId = parseInt(params.id);
		const data = await request.formData();
		const relatedPhraseId = parseInt(data.get('relatedPhraseId') as string);

		if (isNaN(relatedPhraseId)) return fail(400, { error: 'Selecciona una frase' });
		if (relatedPhraseId === phraseId) return fail(400, { error: 'No es pot relacionar amb si mateixa' });

		// Check duplicate (both directions)
		const [existing] = await db
			.select({ id: phraseRelations.id })
			.from(phraseRelations)
			.where(
				or(
					and(
						eq(phraseRelations.phraseId, phraseId),
						eq(phraseRelations.relatedPhraseId, relatedPhraseId)
					),
					and(
						eq(phraseRelations.phraseId, relatedPhraseId),
						eq(phraseRelations.relatedPhraseId, phraseId)
					)
				)
			)
			.limit(1);

		if (existing) return fail(409, { error: 'Aquesta relació ja existeix' });

		// Insert both directions
		await db.insert(phraseRelations).values([
			{ phraseId, relatedPhraseId },
			{ phraseId: relatedPhraseId, relatedPhraseId: phraseId }
		]);

		return { success: true, message: 'Relació afegida' };
	},

	removeRelation: async ({ params, request }) => {
		const phraseId = parseInt(params.id);
		const data = await request.formData();
		const relatedPhraseId = parseInt(data.get('relatedPhraseId') as string);

		if (isNaN(relatedPhraseId)) return fail(400, { error: 'ID invàlid' });

		// Delete both directions
		await db
			.delete(phraseRelations)
			.where(
				and(
					eq(phraseRelations.phraseId, phraseId),
					eq(phraseRelations.relatedPhraseId, relatedPhraseId)
				)
			);

		await db
			.delete(phraseRelations)
			.where(
				and(
					eq(phraseRelations.phraseId, relatedPhraseId),
					eq(phraseRelations.relatedPhraseId, phraseId)
				)
			);

		return { success: true, message: 'Relació eliminada' };
	}
};

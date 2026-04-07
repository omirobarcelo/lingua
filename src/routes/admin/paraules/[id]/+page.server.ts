import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { words } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw error(400, 'ID invàlid');

	const [word] = await db
		.select({
			id: words.id,
			word: words.word,
			notes: words.notes,
			relatedWords: words.relatedWords
		})
		.from(words)
		.where(eq(words.id, id))
		.limit(1);

	if (!word) throw error(404, 'Paraula no trobada');

	return { word };
};

export const actions: Actions = {
	update: async ({ params, request }) => {
		const id = parseInt(params.id);
		const data = await request.formData();
		const word = (data.get('word') as string)?.trim();
		const notes = (data.get('notes') as string)?.trim() || null;
		const relatedWords = (data.get('relatedWords') as string)?.trim() || null;

		const errors: Record<string, string> = {};
		if (!word) errors.word = 'La paraula és obligatòria';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors });
		}

		// Never set searchVector — trigger handles it
		await db.update(words).set({ word, notes, relatedWords }).where(eq(words.id, id));

		return { success: true, message: 'Paraula actualitzada' };
	},

	delete: async ({ params }) => {
		const id = parseInt(params.id);
		await db.delete(words).where(eq(words.id, id));
		throw redirect(303, '/admin/paraules');
	}
};

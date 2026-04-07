import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { words } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const allWords = await db
		.select({
			id: words.id,
			word: words.word,
			notes: words.notes,
			relatedWords: words.relatedWords
		})
		.from(words)
		.orderBy(words.word);

	return { words: allWords };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const word = (data.get('word') as string)?.trim();
		const notes = (data.get('notes') as string)?.trim() || null;
		const relatedWords = (data.get('relatedWords') as string)?.trim() || null;

		if (!word) return fail(400, { error: 'La paraula és obligatòria', action: 'create' });

		// Never set searchVector — trigger handles it
		await db.insert(words).values({ word, notes, relatedWords });
		return { success: true, message: 'Paraula creada' };
	},

	createBulk: async ({ request }) => {
		const data = await request.formData();
		const entries = (data.get('entries') as string)?.trim();

		if (!entries) {
			return fail(400, { error: 'Introdueix almenys una paraula', action: 'createBulk' });
		}

		const lines = entries
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean);

		const values: { word: string; notes: string | null; relatedWords: string | null }[] = [];
		const errors: string[] = [];

		for (let i = 0; i < lines.length; i++) {
			const parts = lines[i].split('|').map((s) => s.trim());
			if (parts.length < 1) {
				errors.push(`Línia ${i + 1}: format invàlid (cal: Paraula | Notes | Paraules relacionades)`);
				continue;
			}
			const [word, notes, relatedWords] = parts;
			if (!word) {
				errors.push(`Línia ${i + 1}: paraula buida`);
				continue;
			}
			values.push({ word, notes: notes || null, relatedWords: relatedWords || null });
		}

		if (errors.length > 0) {
			return fail(400, { error: errors.join('\n'), action: 'createBulk' });
		}

		// Never set searchVector — trigger handles it
		await db.insert(words).values(values);
		return { success: true, message: `${values.length} paraules creades` };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (isNaN(id)) return fail(400, { error: 'ID invàlid' });

		await db.delete(words).where(eq(words.id, id));
		return { success: true, message: 'Paraula eliminada' };
	}
};

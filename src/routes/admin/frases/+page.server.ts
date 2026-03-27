import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, phrases, phraseRelations } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	const allPhrases = await db
		.select({
			id: phrases.id,
			phraseText: phrases.phraseText,
			categoryId: phrases.categoryId,
			categoryName: categories.name
		})
		.from(phrases)
		.leftJoin(categories, eq(phrases.categoryId, categories.id))
		.orderBy(phrases.phraseText);

	const allCategories = await db
		.select({ id: categories.id, name: categories.name, slug: categories.slug })
		.from(categories)
		.orderBy(categories.name);

	return { phrases: allPhrases, categories: allCategories };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const phraseText = (data.get('phraseText') as string)?.trim();
		const explanation = (data.get('explanation') as string)?.trim();
		const categoryId = parseInt(data.get('categoryId') as string);

		if (!phraseText) return fail(400, { error: "El text de la frase és obligatori", action: 'create' });
		if (!explanation) return fail(400, { error: "L'explicació és obligatòria", action: 'create' });
		if (isNaN(categoryId)) return fail(400, { error: 'Selecciona una categoria', action: 'create' });

		// Never set searchVector — trigger handles it
		await db.insert(phrases).values({ phraseText, explanation, categoryId });
		return { success: true, message: 'Frase creada' };
	},

	createBulk: async ({ request }) => {
		const data = await request.formData();
		const entries = (data.get('entries') as string)?.trim();

		if (!entries) {
			return fail(400, { error: 'Introdueix almenys una frase', action: 'createBulk' });
		}

		const lines = entries
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean);

		// Load categories for slug/name resolution
		const allCats = await db
			.select({ id: categories.id, name: categories.name, slug: categories.slug })
			.from(categories);

		const catLookup = new Map<string, number>();
		for (const cat of allCats) {
			catLookup.set(cat.name.toLowerCase(), cat.id);
			catLookup.set(cat.slug.toLowerCase(), cat.id);
		}

		const values: { phraseText: string; explanation: string; categoryId: number }[] = [];
		const errors: string[] = [];

		for (let i = 0; i < lines.length; i++) {
			const parts = lines[i].split('|').map((s) => s.trim());
			if (parts.length < 3) {
				errors.push(`Línia ${i + 1}: format invàlid (cal: Frase | Explicació | Categoria)`);
				continue;
			}
			const [phraseText, explanation, catRef] = parts;
			const catId = catLookup.get(catRef.toLowerCase());
			if (!catId) {
				errors.push(`Línia ${i + 1}: categoria "${catRef}" no trobada`);
				continue;
			}
			if (!phraseText || !explanation) {
				errors.push(`Línia ${i + 1}: frase o explicació buida`);
				continue;
			}
			values.push({ phraseText, explanation, categoryId: catId });
		}

		if (errors.length > 0) {
			return fail(400, { error: errors.join('\n'), action: 'createBulk' });
		}

		// Never set searchVector — trigger handles it
		await db.insert(phrases).values(values);
		return { success: true, message: `${values.length} frases creades` };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (isNaN(id)) return fail(400, { error: 'ID invàlid' });

		// Delete relations first (both directions)
		await db
			.delete(phraseRelations)
			.where(
				or(eq(phraseRelations.phraseId, id), eq(phraseRelations.relatedPhraseId, id))
			);

		await db.delete(phrases).where(eq(phrases.id, id));
		return { success: true, message: 'Frase eliminada' };
	}
};

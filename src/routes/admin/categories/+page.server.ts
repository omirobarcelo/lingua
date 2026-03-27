import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { eq, count, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, phrases } from '$lib/server/db/schema';
import { generateSlug } from '$lib/utils/slug';

export const load: PageServerLoad = async () => {
	const allCategories = await db
		.select({
			id: categories.id,
			name: categories.name,
			slug: categories.slug,
			description: categories.description,
			phraseCount: sql<number>`(select count(*) from phrases where phrases.category_id = ${categories.id})`.mapWith(Number)
		})
		.from(categories)
		.orderBy(categories.name);

	return { categories: allCategories };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const description = (data.get('description') as string)?.trim() || null;

		if (!name) {
			return fail(400, { error: 'El nom és obligatori', action: 'create' });
		}

		const slug = generateSlug(name);

		const [existing] = await db
			.select({ id: categories.id })
			.from(categories)
			.where(eq(categories.slug, slug))
			.limit(1);

		if (existing) {
			return fail(409, { error: 'Ja existeix una categoria amb aquest nom', action: 'create' });
		}

		await db.insert(categories).values({ name, slug, description });
		return { success: true, message: 'Categoria creada' };
	},

	createBulk: async ({ request }) => {
		const data = await request.formData();
		const entries = (data.get('entries') as string)?.trim();

		if (!entries) {
			return fail(400, { error: 'Introdueix almenys una categoria', action: 'createBulk' });
		}

		const lines = entries
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean);

		const values = lines.map((line) => {
			const [name, description] = line.split('|').map((s) => s.trim());
			return { name, slug: generateSlug(name), description: description || null };
		});

		const invalidNames = values.filter((v) => !v.name);
		if (invalidNames.length > 0) {
			return fail(400, { error: 'Algunes línies no tenen nom', action: 'createBulk' });
		}

		// Check for duplicate slugs within the batch
		const slugs = values.map((v) => v.slug);
		if (new Set(slugs).size !== slugs.length) {
			return fail(400, { error: 'Hi ha noms duplicats al llistat', action: 'createBulk' });
		}

		try {
			await db.insert(categories).values(values);
		} catch (err: unknown) {
			if (err && typeof err === 'object' && 'code' in err && err.code === '23505') {
				return fail(409, { error: 'Algunes categories ja existeixen', action: 'createBulk' });
			}
			throw err;
		}

		return { success: true, message: `${values.length} categories creades` };
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		if (isNaN(id)) {
			return fail(400, { error: 'ID invàlid' });
		}

		const [phraseCount] = await db
			.select({ count: count() })
			.from(phrases)
			.where(eq(phrases.categoryId, id));

		if (phraseCount.count > 0) {
			return fail(409, {
				error: `No es pot eliminar: té ${phraseCount.count} frases associades`
			});
		}

		await db.delete(categories).where(eq(categories.id, id));
		return { success: true, message: 'Categoria eliminada' };
	}
};

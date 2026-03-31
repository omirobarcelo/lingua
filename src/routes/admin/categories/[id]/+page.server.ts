import type { PageServerLoad, Actions } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq, and, ne, count } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { categories, phrases } from '$lib/server/db/schema';
import { generateSlug } from '$lib/utils/slug';

export const load: PageServerLoad = async ({ params }) => {
	const id = parseInt(params.id);
	if (isNaN(id)) throw error(400, 'ID invàlid');

	const [category] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);

	if (!category) throw error(404, 'Categoria no trobada');

	return { category };
};

export const actions: Actions = {
	update: async ({ params, request }) => {
		const id = parseInt(params.id);
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim();
		const description = (data.get('description') as string)?.trim() || null;

		if (!name) {
			return fail(400, { errors: { name: 'El nom és obligatori' } });
		}

		const slug = generateSlug(name);

		const [existing] = await db
			.select({ id: categories.id })
			.from(categories)
			.where(and(eq(categories.slug, slug), ne(categories.id, id)))
			.limit(1);

		if (existing) {
			return fail(409, { errors: { name: 'Ja existeix una altra categoria amb aquest nom' } });
		}

		await db.update(categories).set({ name, slug, description }).where(eq(categories.id, id));

		return { success: true, message: 'Categoria actualitzada' };
	},

	delete: async ({ params }) => {
		const id = parseInt(params.id);

		const [phraseCount] = await db.select({ count: count() }).from(phrases).where(eq(phrases.categoryId, id));

		if (phraseCount.count > 0) {
			return fail(409, {
				error: `No es pot eliminar: té ${phraseCount.count} frases associades`
			});
		}

		await db.delete(categories).where(eq(categories.id, id));
		throw redirect(303, '/admin/categories');
	}
};

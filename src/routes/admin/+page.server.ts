import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { categories, phrases, phraseRelations } from '$lib/server/db/schema';
import { count } from 'drizzle-orm';
import { clearSessionCookie } from '$lib/server/admin/auth';

export const load: PageServerLoad = async () => {
	const [catCount] = await db.select({ count: count() }).from(categories);
	const [phraseCount] = await db.select({ count: count() }).from(phrases);
	const [relationCount] = await db.select({ count: count() }).from(phraseRelations);

	return {
		categoryCount: catCount.count,
		phraseCount: phraseCount.count,
		relationCount: relationCount.count
	};
};

export const actions: Actions = {
	logout: async ({ cookies }) => {
		clearSessionCookie(cookies);
		throw redirect(303, '/admin/login');
	}
};

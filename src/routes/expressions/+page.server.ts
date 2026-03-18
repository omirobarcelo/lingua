import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';

export const load: PageServerLoad = async () => {
	return {
		categories: await db.select().from(categories).orderBy(categories.name)
	};
};

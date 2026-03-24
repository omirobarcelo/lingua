import { DATABASE_URL } from '$env/static/private';
import * as schema from './schema';
import { dev } from '$app/environment';

async function createDb() {
	if (dev) {
		const { drizzle } = await import('drizzle-orm/postgres-js');
		const postgres = (await import('postgres')).default;
		const client = postgres(DATABASE_URL);
		return drizzle(client, { schema });
	} else {
		const { drizzle } = await import('drizzle-orm/neon-http');
		const { neon } = await import('@neondatabase/serverless');
		const client = neon(DATABASE_URL);
		return drizzle({ client, schema });
	}
}

export const db = await createDb();

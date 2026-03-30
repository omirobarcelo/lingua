import type { PageServerLoad } from './$types';
import { sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { phrases } from '$lib/server/db/schema';
import { fetchDcvbDefinition } from '$lib/server/definitions/dcvb';

function buildTsquery(input: string): string | null {
	const tokens = input.trim().split(/\s+/).filter(Boolean);
	if (tokens.length === 0) return null;
	// All tokens joined with & (AND), last token gets :* for prefix matching
	return tokens
		.map((t, i) => (i === tokens.length - 1 ? `${t}:*` : t))
		.join(' & ');
}

export const load: PageServerLoad = async ({ url }) => {
	const paraula = url.searchParams.get('paraula') || '';
	const tsquery = buildTsquery(paraula);

	if (!tsquery) {
		return { paraula, phrases: [], definition: null };
	}

	const definitionPromise = fetchDcvbDefinition(paraula);

	// Stage 1: catalan-stemmed (catches inflected forms)
	const catalanQ = sql`to_tsquery('public.catalan', ${tsquery})`;
	const results = await db
		.select({
			id: phrases.id,
			phraseText: phrases.phraseText,
			explanation: phrases.explanation
		})
		.from(phrases)
		.where(sql`${phrases.searchVector} @@ ${catalanQ}`)
		.limit(20);

	if (results.length > 0) {
		return { paraula, phrases: results, definition: await definitionPromise };
	}

	// Stage 2 (fallback): simple tokenization (archaic/unknown words)
	const simpleQ = sql`to_tsquery('simple', ${tsquery})`;
	const fallbackResults = await db
		.select({
			id: phrases.id,
			phraseText: phrases.phraseText,
			explanation: phrases.explanation
		})
		.from(phrases)
		.where(sql`to_tsvector('simple', ${phrases.phraseText}) @@ ${simpleQ}`)
		.limit(20);

	return { paraula, phrases: fallbackResults, definition: await definitionPromise };
};

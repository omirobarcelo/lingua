import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { fetchDcvbDefinition } from '$lib/server/definitions/dcvb';
import { fetchGdlcDefinition } from '$lib/server/definitions/gdlc';

const fetchers: Record<string, (word: string) => Promise<string | null>> = {
	dcvb: fetchDcvbDefinition,
	gdlc: fetchGdlcDefinition
};

export const GET: RequestHandler = async ({ params, url }) => {
	const fetcher = fetchers[params.source];
	if (!fetcher) throw error(404, 'Unknown definition source');

	const word = url.searchParams.get('word');
	if (!word) throw error(400, 'Missing word parameter');

	const definition = await fetcher(word);
	return json({ definition });
};

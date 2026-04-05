import { SITE_URL } from '$lib/seo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
	const body = [
		'User-agent: *',
		'Allow: /',
		'Disallow: /admin/',
		'Disallow: /cerca',
		'Disallow: /api/',
		'Disallow: /design-system',
		'Disallow: /sistema-disseny',
		'',
		`Sitemap: ${SITE_URL}/sitemap.xml`
	].join('\n');

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain' }
	});
};

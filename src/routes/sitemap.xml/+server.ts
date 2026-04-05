import { db } from '$lib/server/db';
import { categories, phrases } from '$lib/server/db/schema';
import { SITE_URL } from '$lib/seo';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const allCategories = await db.select({ slug: categories.slug }).from(categories);
	const allPhrases = await db.select({ id: phrases.id }).from(phrases);

	const staticUrls = [
		{ loc: '/', changefreq: 'weekly', priority: '1.0' },
		{ loc: '/expressions', changefreq: 'weekly', priority: '0.9' }
	];

	const categoryUrls = allCategories.map((c) => ({
		loc: `/expressions/${c.slug}`,
		changefreq: 'weekly' as const,
		priority: '0.8'
	}));

	const phraseUrls = allPhrases.map((p) => ({
		loc: `/expressions/${p.id}`,
		changefreq: 'monthly' as const,
		priority: '0.6'
	}));

	const urls = [...staticUrls, ...categoryUrls, ...phraseUrls];

	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...urls.map(
			(u) =>
				`  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
		),
		'</urlset>'
	].join('\n');

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml' }
	});
};

import { parse } from 'node-html-parser';

const BASE_URL = 'https://dcvb.iec.cat';

export async function fetchDcvbDefinition(word: string): Promise<string | null> {
	try {
		const res = await fetch(`${BASE_URL}/results.asp?Word=${encodeURIComponent(word)}`);
		if (!res.ok) return null;

		// DCVB returns ISO-8859-1 encoded HTML
		const buffer = await res.arrayBuffer();
		const html = new TextDecoder('iso-8859-1').decode(buffer);

		const root = parse(html);
		const bodyEl = root.querySelector('p.body');
		if (!bodyEl) return null;

		// Transform camera icon links into direct image links
		bodyEl.querySelectorAll('a[href^="javascript:OpenImg"]').forEach((a) => {
			const match = a.getAttribute('href')?.match(/OpenImg\('([^']+)'\)/);
			if (match) {
				const imageUrl = `${BASE_URL}/${match[1]}`;
				a.setAttribute('href', imageUrl);
				a.setAttribute('target', '_blank');
				a.setAttribute('rel', 'noopener noreferrer');
				a.setAttribute('class', 'dcvb-image-link');
				a.setAttribute('title', 'Veure imatge');
				a.removeAttribute('onclick');
				a.set_content('&#128247;');
			}
		});
		// Remove any remaining img elements (camera icons)
		bodyEl.querySelectorAll('img').forEach((img) => img.remove());

		// Convert relative links to absolute DCVB URLs
		bodyEl.querySelectorAll('a[href]').forEach((a) => {
			const href = a.getAttribute('href');
			if (href && !href.startsWith('http') && !href.startsWith('javascript:')) {
				a.setAttribute('href', `${BASE_URL}/${href}`);
				a.setAttribute('target', '_blank');
				a.setAttribute('rel', 'noopener noreferrer');
			}
		});

		return bodyEl.innerHTML.trim() || null;
	} catch {
		return null;
	}
}

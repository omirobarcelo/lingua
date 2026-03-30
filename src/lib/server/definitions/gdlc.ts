import { parse } from 'node-html-parser';

const BASE_URL = 'https://www.diccionari.cat';
const SEARCH_URL = `${BASE_URL}/cerca/gran-diccionari-de-la-llengua-catalana`;

export async function fetchGdlcDefinition(word: string): Promise<string | null> {
	try {
		const url = new URL(SEARCH_URL);
		url.searchParams.set('search_api_fulltext_cust', word);
		url.searchParams.set('search_api_fulltext_cust_1', '');
		url.searchParams.set('field_faceta_cerca_1', '5065');
		url.searchParams.set('show', 'title');

		const res = await fetch(url);
		if (!res.ok) return null;

		const rawHtml = await res.text();
		// Fix XHTML self-closing spans (e.g. <span id="..."/>) that break the HTML parser
		const html = rawHtml.replace(/<(span|br)\s+([^>]*?)\/>/gi, '<$1 $2></$1>');

		// The page has malformed nesting that causes parsers to swallow later articles
		// into the first result's tree. Extract each <article>...</article> block individually.
		const articleRegex = /<article\s[^>]*>[\s\S]*?<\/article>/gi;
		const articleMatches = html.match(articleRegex) || [];
		const entries: string[] = [];

		for (const match of articleMatches) {
			const article = parse(match).querySelector('article');
			if (!article) continue;

			const bodyEl = article.querySelector('.field--name-body .field__item');
			if (!bodyEl) continue;

			// Extract title from the escaped XML inside the title span
			const titleText = extractTitle(article);

			// Extract etymology
			const etymEl = article.querySelector('.field--name-field-accessory .field__item');
			const etymHtml = etymEl ? cleanEtymology(etymEl) : '';

			// Clean up the body
			cleanBody(bodyEl);

			const entryHtml =
				`<div class="gdlc-entry">` +
				(titleText ? `<span class="gdlc-title">${titleText}</span> ` : '') +
				bodyEl.innerHTML.trim() +
				(etymHtml ? `<div class="gdlc-etym">${etymHtml}</div>` : '') +
				`</div>`;

			entries.push(entryHtml);
		}

		if (entries.length === 0) return null;
		return entries.join('\n');
	} catch {
		return null;
	}
}

function extractTitle(article: ReturnType<ReturnType<typeof parse>['querySelector']>): string {
	const titleSpan = article!.querySelector('.field--name-title');
	if (!titleSpan) return '';

	// The title contains escaped XML like <title type="display">moix</title><lbl type="homograph">1</lbl>
	const text = titleSpan.textContent || '';
	const displayMatch = text.match(/<title type="display">([^<]+)<\/title>/);
	const homographMatch = text.match(/<lbl type="homograph">([^<]+)<\/lbl>/);

	if (!displayMatch) return '';
	const display = displayMatch[1];
	const homograph = homographMatch ? `<sup>${homographMatch[1]}</sup>` : '';
	return `<strong>${display}</strong>${homograph}`;
}

function cleanBody(bodyEl: ReturnType<ReturnType<typeof parse>['querySelector']>): void {
	// Remove empty ID spans (anchors like <span id="EC-GDLC-..."></span>)
	bodyEl!.querySelectorAll('span[id^="EC-"]').forEach((s) => {
		if (!s.textContent?.trim()) s.remove();
	});

	// Remove .clear divs
	bodyEl!.querySelectorAll('.clear').forEach((el) => el.remove());

	// Convert relative links to absolute
	bodyEl!.querySelectorAll('a[href]').forEach((a) => {
		const href = a.getAttribute('href');
		if (href && !href.startsWith('http')) {
			a.setAttribute('href', `${BASE_URL}/${href.replace(/^\//, '')}`);
			a.setAttribute('target', '_blank');
			a.setAttribute('rel', 'noopener noreferrer');
		}
	});
}

function cleanEtymology(etymEl: ReturnType<ReturnType<typeof parse>['querySelector']>): string {
	// Extract just the etymology span, skip syllable partition
	const etymSpan = etymEl!.querySelector('.etym');
	if (!etymSpan) return '';
	return `<span class="gdlc-etym-label">Etimologia:</span> ${etymSpan.innerHTML.trim()}`;
}

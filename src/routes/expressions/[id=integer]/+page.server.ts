import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

// Hardcoded data for initial implementation
const MOCK_CATEGORIES = [
	{
		id: 1,
		name: 'Amor i Sentiments',
		slug: 'amor-i-sentiments',
		description: 'Expressions relacionades amb l\'amor, els sentiments i les emocions'
	},
	{
		id: 2,
		name: 'Roba i Vestimenta',
		slug: 'roba-i-vestimenta',
		description: 'Expressions sobre la roba i la manera de vestir'
	},
	{
		id: 3,
		name: 'Meteorologia',
		slug: 'meteorologia',
		description: 'Expressions relacionades amb el temps i els fenòmens meteorològics'
	},
	{
		id: 4,
		name: 'Animals',
		slug: 'animals',
		description: 'Expressions que fan referència a animals'
	}
];

const MOCK_PHRASES = [
	{ id: 1, categoryId: 1, text: 'Estar colat per algú', explanation: 'Estar molt enamorat d\'algú' },
	{ id: 2, categoryId: 1, text: 'Tenir el cor trencat', explanation: 'Estar molt trist per una decepció amorosa' },
	{ id: 3, categoryId: 1, text: 'Fer el salt', explanation: 'Enamorar-se perdudament' },
	{ id: 4, categoryId: 2, text: 'Anar fet un pinxo', explanation: 'Anar molt ben vestit i elegant' },
	{ id: 5, categoryId: 2, text: 'Estar en pilotes', explanation: 'Estar despullat o sense roba' },
	{ id: 6, categoryId: 2, text: 'Posar-se la gorra', explanation: 'Posar-se el barret, començar a treballar' },
	{ id: 7, categoryId: 3, text: 'Ploure a bots i barrals', explanation: 'Ploure molt fort' },
	{ id: 8, categoryId: 3, text: 'Fer un temps de gossos', explanation: 'Fer molt mal temps' },
	{ id: 9, categoryId: 4, text: 'Ser un gallina', explanation: 'Ser covard' },
	{ id: 10, categoryId: 4, text: 'Tenir memòria d\'elefant', explanation: 'Tenir molt bona memòria' }
];

// Mock related phrases relationships
const MOCK_RELATIONS = [
	{ phraseId: 1, relatedPhraseId: 2 },
	{ phraseId: 1, relatedPhraseId: 3 },
	{ phraseId: 2, relatedPhraseId: 1 },
	{ phraseId: 4, relatedPhraseId: 5 },
	{ phraseId: 7, relatedPhraseId: 8 },
	{ phraseId: 9, relatedPhraseId: 10 }
];

export const load: PageServerLoad = async ({ params }) => {
	const phraseId = parseInt(params.id);
	const phrase = MOCK_PHRASES.find(p => p.id === phraseId);

	if (!phrase) {
		throw error(404, 'Expressió no trobada');
	}

	const category = MOCK_CATEGORIES.find(cat => cat.id === phrase.categoryId);

	if (!category) {
		throw error(404, 'Categoria no trobada');
	}

	// Find related phrases
	const relatedIds = MOCK_RELATIONS
		.filter(rel => rel.phraseId === phraseId)
		.map(rel => rel.relatedPhraseId);

	const relatedPhrases = MOCK_PHRASES.filter(p => relatedIds.includes(p.id));

	return {
		phrase,
		categoryName: category.name,
		categorySlug: category.slug,
		relatedPhrases
	};
};

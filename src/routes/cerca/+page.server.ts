import type { PageServerLoad } from './$types';

// Hardcoded phrases for initial implementation
const MOCK_PHRASES = [
	{ id: 1, text: 'Caure dels núvols', explanation: "Sorprendre's molt per alguna cosa inesperada", stem: 'caure' },
	{ id: 2, text: "Estar en un núvol", explanation: 'Estar distret o absent mentalment', stem: 'estar' },
	{ id: 3, text: 'Posar els peus a terra', explanation: 'Ser realista i pràctic', stem: 'posar' },
	{ id: 4, text: 'Caure bé', explanation: 'Agradar una persona', stem: 'caure' },
	{ id: 5, text: 'Fer la guitza', explanation: 'Fer enfadar o molestar algú', stem: 'fer' }
];

export const load: PageServerLoad = async ({ url }) => {
	const paraula = url.searchParams.get('paraula') || '';

	// For now, return mock phrases that contain the word or its stem
	// In production, this would query the database using tsvector
	const filteredPhrases = MOCK_PHRASES.filter(phrase =>
		phrase.text.toLowerCase().includes(paraula.toLowerCase()) ||
		phrase.stem.toLowerCase().includes(paraula.toLowerCase())
	);

	return {
		paraula,
		phrases: filteredPhrases
	};
};

import type { PageServerLoad } from './$types';

// Hardcoded categories for initial implementation
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

export const load: PageServerLoad = async () => {
	// In production, this would query the database
	return {
		categories: MOCK_CATEGORIES
	};
};

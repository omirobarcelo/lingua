import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { categories, phrases, phraseRelations } from './schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

// --- Categories ---
const categoryData = [
	{
		name: 'Amor i Sentiments',
		slug: 'amor-i-sentiments',
		description: "Expressions relacionades amb l'amor, l'amistat i les emocions."
	},
	{
		name: 'Animals',
		slug: 'animals',
		description: 'Frases fetes que fan referència al món animal.'
	},
	{
		name: 'Menjar i Beguda',
		slug: 'menjar-i-beguda',
		description: 'Expressions vinculades a la gastronomia i els àpats.'
	},
	{
		name: 'Meteorologia',
		slug: 'meteorologia',
		description: 'Dites populars sobre el temps i els fenòmens atmosfèrics.'
	},
	{
		name: 'Cos i Salut',
		slug: 'cos-i-salut',
		description: 'Frases fetes relacionades amb el cos humà i la salut.'
	}
];

// --- Phrases per category (keyed by slug) ---
const phraseData: Record<string, { phraseText: string; explanation: string }[]> = {
	'amor-i-sentiments': [
		{
			phraseText: 'Tenir el cor trencat',
			explanation: "Estar molt trist per una decepció amorosa o una pèrdua sentimental profunda."
		},
		{
			phraseText: "Estimar-se com ceba i perol",
			explanation: "Tenir una relació molt estreta i inseparable, com dos elements que sempre van junts."
		},
		{
			phraseText: 'Fer el ploramiques',
			explanation: "Queixar-se constantment sense motiu real, exagerant les penes."
		},
		{
			phraseText: "Ser l'ànima de la festa",
			explanation: "Ser la persona més animada i divertida d'una reunió o celebració."
		},
		{
			phraseText: 'Tenir sang freda',
			explanation: "Mantenir la calma i el control emocional en situacions difícils o perilloses."
		}
	],
	animals: [
		{
			phraseText: 'Ser un ase',
			explanation: "Ser una persona tossuda o poc intel·ligent. També pot significar ser molt treballador."
		},
		{
			phraseText: 'Anar amb peus de plom',
			explanation: "Actuar amb molta precaució i prudència, com si es tinguessin els peus pesants."
		},
		{
			phraseText: 'Estar com una cabra',
			explanation: "Estar boig o comportar-se de manera estranya i imprevisible."
		},
		{
			phraseText: 'Ser més lent que una tortuga',
			explanation: "Fer les coses amb molta lentitud, trigar molt a acabar qualsevol tasca."
		},
		{
			phraseText: 'Cridar com un bou',
			explanation: "Cridar molt fort, amb una veu potent i estrident."
		}
	],
	'menjar-i-beguda': [
		{
			phraseText: 'Donar carabassa',
			explanation: "Rebutjar algú romànticament o suspendre en un examen."
		},
		{
			phraseText: 'Estar colat per algú',
			explanation: "Estar molt enamorat d'algú, sovint de manera no corresposta."
		},
		{
			phraseText: "Ser pa sucat amb oli",
			explanation: "Ser una cosa molt fàcil de fer, que no requereix cap esforç."
		},
		{
			phraseText: "Anar-se'n el sant al cel",
			explanation: "Oblidar-se del que s'havia de fer o dir, perdre el fil del pensament."
		},
		{
			phraseText: "Posar tota la carn a la graella",
			explanation: "Arriscar-ho tot en una sola acció, apostar tots els recursos disponibles."
		}
	],
	meteorologia: [
		{
			phraseText: 'Ploure a bots i barrals',
			explanation: "Ploure amb molta intensitat, de manera torrencial."
		},
		{
			phraseText: 'Fer un fred que pela',
			explanation: "Fer molt de fred, un fred intens que gairebé fa mal a la pell."
		},
		{
			phraseText: 'Estar al setè cel',
			explanation: "Sentir-se extremadament feliç, com si es fos al paradís."
		},
		{
			phraseText: 'Fer sol i ombra',
			explanation: "Alternar entre moments bons i dolents, ser inconstant."
		},
		{
			phraseText: "Portar tempesta de cap",
			explanation: "Estar molt preocupat o tenir molts problemes al cap."
		}
	],
	'cos-i-salut': [
		{
			phraseText: "No tenir pèls a la llengua",
			explanation: "Dir les coses tal com es pensen, sense filtres ni por de les conseqüències."
		},
		{
			phraseText: 'Tenir mala espina',
			explanation: "Tenir una sospita o un mal pressentiment sobre alguna cosa."
		},
		{
			phraseText: 'Fer-se el mandra',
			explanation: "Fingir que no es vol fer una cosa per mandra o desinterès."
		},
		{
			phraseText: 'Posar els peus a la galleda',
			explanation: "Equivocar-se greument, cometre un error important."
		},
		{
			phraseText: "Tenir la mosca al nas",
			explanation: "Estar enfadat o de mal humor, sospitar que alguna cosa no va bé."
		}
	]
};

// --- Seed ---
async function seed() {
	console.log('Clearing existing data...');
	await db.delete(phraseRelations);
	await db.delete(phrases);
	await db.delete(categories);

	console.log('Inserting categories...');
	const insertedCategories = await db
		.insert(categories)
		.values(categoryData)
		.returning({ id: categories.id, slug: categories.slug });

	const slugToId = Object.fromEntries(insertedCategories.map((c) => [c.slug, c.id]));

	console.log('Inserting phrases...');
	const allPhraseValues = Object.entries(phraseData).flatMap(([slug, items]) =>
		items.map((item) => ({
			categoryId: slugToId[slug],
			phraseText: item.phraseText,
			explanation: item.explanation
		}))
	);

	const insertedPhrases = await db
		.insert(phrases)
		.values(allPhraseValues)
		.returning({ id: phrases.id, phraseText: phrases.phraseText });

	// Build a lookup by phraseText for creating relations
	const textToId = Object.fromEntries(insertedPhrases.map((p) => [p.phraseText, p.id]));

	console.log('Inserting relations...');
	// 6 bidirectional relations (12 rows) linking thematically related phrases
	const relationPairs: [string, string][] = [
		['Tenir el cor trencat', 'Estar al setè cel'],
		['Tenir sang freda', 'Tenir mala espina'],
		['Ploure a bots i barrals', 'Fer un fred que pela'],
		['Donar carabassa', 'Estar colat per algú'],
		['Ser un ase', 'Estar com una cabra'],
		["No tenir pèls a la llengua", "Tenir la mosca al nas"]
	];

	const relationValues = relationPairs.flatMap(([a, b]) => [
		{ phraseId: textToId[a], relatedPhraseId: textToId[b] },
		{ phraseId: textToId[b], relatedPhraseId: textToId[a] }
	]);

	await db.insert(phraseRelations).values(relationValues);

	console.log(
		`Seed complete: ${insertedCategories.length} categories, ${insertedPhrases.length} phrases, ${relationValues.length} relation rows`
	);
	await client.end();
}

seed().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});

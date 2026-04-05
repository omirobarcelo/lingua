module.exports = {
	ci: {
		collect: {
			url: ['http://localhost:4173/', 'http://localhost:4173/expressions', 'http://localhost:4173/cerca?paraula=casa'],
			startServerCommand: 'npm run build && npm run preview',
			startServerReadyPattern: 'Local',
			numberOfRuns: 1,
			settings: {
				onlyCategories: ['accessibility'],
				chromeFlags: '--headless=new --no-sandbox'
			}
		},
		assert: {
			assertions: {
				'categories:accessibility': ['error', { minScore: 0.95 }]
			}
		},
		upload: {
			target: 'temporary-public-storage'
		}
	}
};

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const publicRoutes = [
	{ name: 'Homepage', path: '/' },
	{ name: 'Search', path: '/cerca?paraula=casa' },
	{ name: 'Categories', path: '/expressions' }
];

for (const route of publicRoutes) {
	test(`${route.name} (${route.path}) has no a11y violations`, async ({ page }) => {
		await page.goto(route.path);

		let builder = new AxeBuilder({ page });

		// External dictionary HTML (DCVB/GDLC) has malformed list structure
		// and non-focusable scrollable regions that we don't control
		if (route.path.startsWith('/cerca')) {
			builder = builder.exclude('.dcvb-definition').exclude('.gdlc-definition');
		}

		const results = await builder.analyze();

		expect(results.violations).toEqual([]);
	});
}

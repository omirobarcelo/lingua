<script lang="ts">
	import posthog from 'posthog-js';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { SITE_URL } from '$lib/seo';

	let { data }: { data: PageData } = $props();

	const jsonLdScript =
		'<script type="application/ld+json">' +
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: "Categories d'Expressions Catalanes",
			url: SITE_URL + '/expressions',
			inLanguage: 'ca',
			isPartOf: { '@type': 'WebSite', name: 'Lingua', url: SITE_URL }
		}) +
		'</' +
		'script>';

	function handleCategoryClick(categorySlug: string, categoryName: string) {
		posthog.capture('category_clicked', {
			category_slug: categorySlug,
			category_name: categoryName
		});
	}
</script>

<SeoHead
	title="Categories d'Expressions - Lingua"
	description="Explora les expressions catalanes organitzades per categories temàtiques a Lingua."
	path="/expressions"
/>

<svelte:head>
	{@html jsonLdScript}
</svelte:head>

<h2 class="mb-2 text-3xl text-primary-900">Categories d'Expressions</h2>
<p class="mb-8 text-muted">Explora les expressions catalanes organitzades per tem&agrave;tica.</p>

<div class="grid gap-5 sm:grid-cols-2">
	{#each data.categories as category (category.slug)}
		<a
			href="/expressions/{category.slug}"
			class="group rounded-xl border border-border bg-surface-card p-6 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
			onclick={() => handleCategoryClick(category.slug, category.name)}
		>
			<h3 class="mb-2 text-lg font-semibold text-primary-800 transition-colors group-hover:text-brand">
				{category.name}
			</h3>
			{#if category.description}
				<p class="text-sm leading-relaxed text-muted">{category.description}</p>
			{/if}
		</a>
	{/each}
</div>

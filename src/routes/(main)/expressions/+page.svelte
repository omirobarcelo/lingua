<script lang="ts">
	import posthog from 'posthog-js';
	import type { PageData } from './$types';
	import { canonical } from '$lib/seo';

	let { data }: { data: PageData } = $props();

	function handleCategoryClick(categorySlug: string, categoryName: string) {
		posthog.capture('category_clicked', {
			category_slug: categorySlug,
			category_name: categoryName
		});
	}
</script>

<svelte:head>
	<title>Categories d'Expressions - Lingua</title>
	<meta
		name="description"
		content="Explora les expressions catalanes organitzades per categories temàtiques a Lingua."
	/>
	<link rel="canonical" href={canonical('/expressions')} />
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

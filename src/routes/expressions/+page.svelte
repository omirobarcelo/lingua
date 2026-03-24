<script lang="ts">
	import posthog from 'posthog-js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function handleCategoryClick(categorySlug: string, categoryName: string) {
		posthog.capture('category_clicked', { category_slug: categorySlug, category_name: categoryName });
	}
</script>

<svelte:head>
	<title>Categories d'Expressions - Lingua</title>
</svelte:head>

<h2 class="text-3xl text-primary-900 mb-2">Categories d'Expressions</h2>
<p class="text-muted mb-8">Explora les expressions catalanes organitzades per tem&agrave;tica.</p>

<div class="grid gap-5 sm:grid-cols-2">
	{#each data.categories as category}
		<a
			href="/expressions/{category.slug}"
			class="group rounded-xl bg-surface-card border border-border p-6 shadow-sm no-underline transition-all hover:shadow-md hover:-translate-y-0.5"
			onclick={() => handleCategoryClick(category.slug, category.name)}
		>
			<h3 class="text-lg font-semibold text-primary-800 group-hover:text-brand transition-colors mb-2">{category.name}</h3>
			{#if category.description}
				<p class="text-sm text-muted leading-relaxed">{category.description}</p>
			{/if}
		</a>
	{/each}
</div>

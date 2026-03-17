<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Categories d'Expressions - Lingua</title>
</svelte:head>

<h2 style="margin-bottom: 20px; color: var(--primary-color);">Categories d'Expressions</h2>

<div class="category-list">
	{#each data.categories as category}
		<a href="/expressions/{category.slug}" class="category-card">
			<h3>{category.name}</h3>
			{#if category.description}
				<p>{category.description}</p>
			{/if}
		</a>
	{/each}
</div>

<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.category.name} - Lingua</title>
</svelte:head>

<a href="/expressions" class="back-link">← Tornar a categories</a>

<h2 style="margin-bottom: 10px; color: var(--primary-color);">{data.category.name}</h2>
{#if data.category.description}
	<p style="margin-bottom: 20px; color: #666;">{data.category.description}</p>
{/if}

<div class="phrase-list">
	{#each data.phrases as phrase}
		<a href="/expressions/{phrase.id}" class="phrase-card">
			<h3>{phrase.text}</h3>
			<p>{phrase.explanation}</p>
		</a>
	{/each}
</div>

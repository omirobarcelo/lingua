<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.phrase.text} - Lingua</title>
</svelte:head>

<a href="/expressions/{data.categorySlug}" class="back-link"
	>← Tornar a {data.categoryName}</a
>

<div class="card">
	<h2 style="color: var(--primary-color);">{data.phrase.text}</h2>
	<p style="margin-top: 10px; color: #666; font-style: italic;">Categoria: {data.categoryName}</p>
</div>

<div class="card">
	<h3>Explicació</h3>
	<p style="margin-top: 10px; line-height: 1.8;">{data.phrase.explanation}</p>
</div>

{#if data.relatedPhrases.length > 0}
	<div class="card">
		<h3>Expressions Relacionades</h3>
		<div class="related-phrases">
			<ul>
				{#each data.relatedPhrases as related}
					<li>
						<a href="/expressions/{related.id}">
							<strong>{related.text}</strong> - {related.explanation}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}

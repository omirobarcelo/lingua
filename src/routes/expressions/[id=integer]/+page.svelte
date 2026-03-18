<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.phrase.phraseText} - Lingua</title>
</svelte:head>

<a href="/expressions/{data.categorySlug}" class="inline-block mb-5 text-brand hover:text-brand-hover transition-colors font-medium">&larr; Tornar a {data.categoryName}</a>

<div class="rounded-xl bg-surface-card border border-border p-8 shadow-sm mb-6">
	<h2 class="text-2xl text-primary-900">{data.phrase.phraseText}</h2>
	<p class="mt-2 text-sm text-muted italic">Categoria: {data.categoryName}</p>
</div>

<div class="rounded-xl bg-surface-card border border-border p-8 shadow-sm mb-6">
	<h3 class="text-xl text-primary-800 mb-3">Explicaci&oacute;</h3>
	<p class="text-muted leading-relaxed">{data.phrase.explanation}</p>
</div>

{#if data.relatedPhrases.length > 0}
	<div class="rounded-xl bg-surface-card border border-border p-8 shadow-sm">
		<h3 class="text-xl text-primary-800 mb-4">Expressions Relacionades</h3>
		<ul class="space-y-3">
			{#each data.relatedPhrases as related}
				<li>
					<a href="/expressions/{related.id}" class="text-brand hover:text-brand-hover transition-colors">
						<strong>{related.phraseText}</strong>
						<span class="text-muted"> &mdash; {related.explanation}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<script lang="ts">
	import posthog from 'posthog-js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function handleRelatedPhraseClick(relatedId: number, relatedText: string) {
		posthog.capture('related_phrase_clicked', {
			related_phrase_id: relatedId,
			related_phrase_text: relatedText,
			source_phrase_id: data.phrase.id,
			source_phrase_text: data.phrase.phraseText
		});
	}
</script>

<svelte:head>
	<title>{data.phrase.phraseText} - Lingua</title>
</svelte:head>

<a
	href="/expressions/{data.categorySlug}"
	class="mb-5 inline-block font-medium text-brand transition-colors hover:text-brand-hover"
	>&larr; Tornar a {data.categoryName}</a
>

<div class="mb-6 rounded-xl border border-border bg-surface-card p-5 shadow-sm sm:p-8">
	<h2 class="text-2xl text-primary-900">{data.phrase.phraseText}</h2>
	<p class="mt-2 text-sm text-muted italic">Categoria: {data.categoryName}</p>
</div>

<div class="mb-6 rounded-xl border border-border bg-surface-card p-5 shadow-sm sm:p-8">
	<h3 class="mb-3 text-xl text-primary-800">Explicaci&oacute;</h3>
	<p class="leading-relaxed text-muted">{data.phrase.explanation}</p>
</div>

{#if data.relatedPhrases.length > 0}
	<div class="rounded-xl border border-border bg-surface-card p-5 shadow-sm sm:p-8">
		<h3 class="mb-4 text-xl text-primary-800">Expressions Relacionades</h3>
		<ul class="space-y-3">
			{#each data.relatedPhrases as related (related.id)}
				<li>
					<a
						href="/expressions/{related.id}"
						class="wrap-break-word text-brand transition-colors hover:text-brand-hover"
						onclick={() => handleRelatedPhraseClick(related.id, related.phraseText)}
					>
						<strong>{related.phraseText}</strong>
						<span class="text-muted"> &mdash; {related.explanation}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{/if}

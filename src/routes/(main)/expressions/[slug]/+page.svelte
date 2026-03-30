<script lang="ts">
	import posthog from 'posthog-js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function handlePhraseClick(phraseId: number, phraseText: string) {
		posthog.capture('phrase_clicked_from_category', {
			phrase_id: phraseId,
			phrase_text: phraseText,
			category_slug: data.category.slug,
			category_name: data.category.name
		});
	}
</script>

<svelte:head>
	<title>{data.category.name} - Lingua</title>
</svelte:head>

<a href="/expressions" class="inline-block mb-5 text-brand hover:text-brand-hover transition-colors font-medium">&larr; Tornar a categories</a>

<h2 class="text-3xl text-primary-900 mb-2">{data.category.name}</h2>
{#if data.category.description}
	<p class="text-muted mb-8">{data.category.description}</p>
{/if}

<div class="grid gap-5 sm:grid-cols-2">
	{#each data.phrases as phrase}
		<a
			href="/expressions/{phrase.id}"
			class="group rounded-xl bg-surface-card border border-border p-6 shadow-sm no-underline transition-all hover:shadow-md hover:-translate-y-0.5"
			onclick={() => handlePhraseClick(phrase.id, phrase.phraseText)}
		>
			<h3 class="text-lg font-semibold text-primary-800 group-hover:text-brand transition-colors mb-2">{phrase.phraseText}</h3>
			<p class="text-sm text-muted leading-relaxed">{phrase.explanation}</p>
		</a>
	{/each}
</div>

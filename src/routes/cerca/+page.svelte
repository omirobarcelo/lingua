<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		posthog.capture('search_results_viewed', {
			word: data.paraula,
			result_count: data.phrases.length,
			has_results: data.phrases.length > 0
		});
	});

	function handlePhraseClick(phraseId: number, phraseText: string) {
		posthog.capture('phrase_clicked_from_search', {
			phrase_id: phraseId,
			phrase_text: phraseText,
			search_word: data.paraula
		});
	}
</script>

<svelte:head>
	<title>Cerca: {data.paraula} - Lingua</title>
</svelte:head>

<a href="/" class="inline-block mb-5 text-brand hover:text-brand-hover transition-colors font-medium">&larr; Tornar a l'inici</a>

<div class="rounded-xl bg-surface-card border border-border p-8 shadow-sm mb-6">
	<h2 class="text-2xl text-primary-800 mb-4">Definici&oacute;: {data.paraula}</h2>
	<div class="w-full rounded-lg overflow-hidden border border-border">
		<iframe
			src="https://dcvb.iec.cat/results.asp?Word={encodeURIComponent(data.paraula)}"
			title="Definici&oacute; de {data.paraula}"
			class="w-full h-[600px] border-none"
		></iframe>
	</div>
</div>

{#if data.phrases.length > 0}
	<div class="rounded-xl bg-surface-card border border-border p-8 shadow-sm">
		<h3 class="text-xl text-primary-800 mb-4">Expressions que contenen &ldquo;{data.paraula}&rdquo;</h3>
		<ul class="space-y-3">
			{#each data.phrases as phrase}
				<li>
					<a href="/expressions/{phrase.id}" class="text-brand hover:text-brand-hover transition-colors" onclick={() => handlePhraseClick(phrase.id, phrase.phraseText)}>
						<strong>{phrase.phraseText}</strong>
						<span class="text-muted"> &mdash; {phrase.explanation}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<div class="rounded-xl bg-surface-card border border-border p-8 shadow-sm">
		<p class="text-muted">No s'han trobat expressions que continguin aquesta paraula.</p>
	</div>
{/if}

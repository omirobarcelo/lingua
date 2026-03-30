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

<div class="rounded-xl bg-surface-card border border-border shadow-sm mb-6">
	<h2 class="text-2xl text-primary-800 px-8 pt-8 pb-4">Definici&oacute;: {data.paraula}</h2>
	<div class="definition-box border-t border-border">
		{#if data.definition}
			<div class="dcvb-definition text-base leading-relaxed max-h-100 overflow-y-auto px-8 py-6">
				{@html data.definition}
			</div>
			<p class="px-8 py-3 text-sm text-muted border-t border-border">
				Font: <a href="https://dcvb.iec.cat/results.asp?Word={encodeURIComponent(data.paraula)}" target="_blank" rel="noopener noreferrer" class="text-brand hover:text-brand-hover transition-colors">Diccionari Catal&agrave;-Valenci&agrave;-Balear</a>
			</p>
		{:else}
			<p class="text-muted px-8 py-6">No s'ha pogut obtenir la definici&oacute; del DCVB.</p>
		{/if}
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

<style>
	/* Style DCVB definition HTML injected via {@html} */
	.dcvb-definition :global(.title) {
		font-family: var(--font-serif);
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--color-primary-800);
	}

	.dcvb-definition :global(.estreta) {
		font-style: italic;
		color: var(--color-neutral-600);
	}

	.dcvb-definition :global(.versaleta) {
		font-variant: small-caps;
	}

	.dcvb-definition :global(.rodona) {
		font-style: normal;
	}

	.dcvb-definition :global(a) {
		color: var(--color-brand);
		text-decoration: none;
	}

	.dcvb-definition :global(a:hover) {
		color: var(--color-brand-hover);
	}

	.dcvb-definition :global(.dcvb-image-link) {
		font-size: 0.85em;
		margin-inline: 0.15em;
		cursor: pointer;
		text-decoration: none;
	}
</style>

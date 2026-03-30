<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let gdlcHtml = $state<string | null>(null);
	let dcvbHtml = $state<string | null>(null);
	let gdlcLoading = $state(false);
	let dcvbLoading = $state(false);

	// Sync from server data (initial load + navigation)
	$effect(() => {
		gdlcHtml = data.gdlcDefinition;
		dcvbHtml = data.dcvbDefinition;
	});

	async function reloadDefinition(source: 'gdlc' | 'dcvb') {
		if (source === 'gdlc') gdlcLoading = true;
		else dcvbLoading = true;

		try {
			const res = await fetch(`/api/definitions/${source}?word=${encodeURIComponent(data.paraula)}`);
			if (res.ok) {
				const { definition } = await res.json();
				if (source === 'gdlc') gdlcHtml = definition;
				else dcvbHtml = definition;
			}
		} finally {
			if (source === 'gdlc') gdlcLoading = false;
			else dcvbLoading = false;
		}
	}

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

<h2 class="text-2xl text-primary-800 mb-4">Definicions: {data.paraula}</h2>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
	<div class="rounded-xl bg-surface-card border border-border shadow-sm flex flex-col">
		<div class="flex items-center justify-between px-6 pt-6 pb-3">
			<h3 class="text-lg text-primary-800 font-semibold">GDLC</h3>
			<button onclick={() => reloadDefinition('gdlc')} disabled={gdlcLoading} class="reload-btn" title="Recarregar definici&oacute;">
				<svg class="w-4 h-4" class:animate-spin={gdlcLoading} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
			</button>
		</div>
		<div class="border-t border-border flex flex-col flex-1">
			{#if gdlcLoading}
				<p class="text-muted px-6 py-4">Carregant...</p>
			{:else if gdlcHtml}
				<div class="gdlc-definition text-base leading-relaxed max-h-100 overflow-y-auto px-6 py-4 flex-1">
					{@html gdlcHtml}
				</div>
				<p class="px-6 py-2.5 text-sm text-muted border-t border-border">
					Font: <a href="https://www.diccionari.cat/cerca/gran-diccionari-de-la-llengua-catalana?search_api_fulltext_cust={encodeURIComponent(data.paraula)}&search_api_fulltext_cust_1&field_faceta_cerca_1=5065&show=title" target="_blank" rel="noopener noreferrer" class="text-brand hover:text-brand-hover transition-colors">Gran Diccionari de la Llengua Catalana</a>
				</p>
			{:else}
				<p class="text-muted px-6 py-4">No s'ha trobat cap definici&oacute; al GDLC.</p>
			{/if}
		</div>
	</div>

	<div class="rounded-xl bg-surface-card border border-border shadow-sm flex flex-col">
		<div class="flex items-center justify-between px-6 pt-6 pb-3">
			<h3 class="text-lg text-primary-800 font-semibold">DCVB</h3>
			<button onclick={() => reloadDefinition('dcvb')} disabled={dcvbLoading} class="reload-btn" title="Recarregar definici&oacute;">
				<svg class="w-4 h-4" class:animate-spin={dcvbLoading} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
			</button>
		</div>
		<div class="border-t border-border flex flex-col flex-1">
			{#if dcvbLoading}
				<p class="text-muted px-6 py-4">Carregant...</p>
			{:else if dcvbHtml}
				<div class="dcvb-definition text-base leading-relaxed max-h-100 overflow-y-auto px-6 py-4 flex-1">
					{@html dcvbHtml}
				</div>
				<p class="px-6 py-2.5 text-sm text-muted border-t border-border">
					Font: <a href="https://dcvb.iec.cat/results.asp?Word={encodeURIComponent(data.paraula)}" target="_blank" rel="noopener noreferrer" class="text-brand hover:text-brand-hover transition-colors">Diccionari Catal&agrave;-Valenci&agrave;-Balear</a>
				</p>
			{:else}
				<p class="text-muted px-6 py-4">No s'ha pogut obtenir la definici&oacute; del DCVB.</p>
			{/if}
		</div>
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

	/* Style GDLC definition HTML injected via {@html} */
	.gdlc-definition :global(.gdlc-entry + .gdlc-entry) {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.gdlc-definition :global(.gdlc-title) {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		color: var(--color-primary-800);
	}

	.gdlc-definition :global(.grammar) {
		color: var(--color-neutral-500);
	}

	.gdlc-definition :global(.dom) {
		font-variant: small-caps;
		color: var(--color-neutral-600);
	}

	.gdlc-definition :global(.register) {
		font-style: italic;
		color: var(--color-neutral-500);
	}

	.gdlc-definition :global(.gdlc-etym) {
		margin-top: 0.5rem;
		font-size: 0.9em;
		color: var(--color-neutral-600);
	}

	.gdlc-definition :global(.gdlc-etym-label) {
		font-weight: 600;
	}

	.gdlc-definition :global(ol.dict) {
		padding-left: 1.5rem;
		margin: 0.25rem 0;
	}

	.gdlc-definition :global(a) {
		color: var(--color-brand);
		text-decoration: none;
	}

	.gdlc-definition :global(a:hover) {
		color: var(--color-brand-hover);
	}

	.reload-btn {
		color: var(--color-neutral-400);
		cursor: pointer;
		padding: 0.25rem;
		border-radius: 0.375rem;
		transition: color 0.15s;
	}

	.reload-btn:hover {
		color: var(--color-brand);
	}

	.reload-btn:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>

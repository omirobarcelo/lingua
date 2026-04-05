<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/SeoHead.svelte';

	let { data }: { data: PageData } = $props();

	// Streamed from server, overridden on reload
	let gdlcPromise = $state(Promise.resolve(data.gdlcDefinition));
	let dcvbPromise = $state(Promise.resolve(data.dcvbDefinition));

	$effect(() => {
		gdlcPromise = Promise.resolve(data.gdlcDefinition);
		dcvbPromise = Promise.resolve(data.dcvbDefinition);
	});

	function reloadDefinition(source: 'gdlc' | 'dcvb') {
		const promise = fetch(`/api/definitions/${source}?word=${encodeURIComponent(data.paraula)}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((json) => json?.definition ?? null)
			.catch(() => null);

		if (source === 'gdlc') gdlcPromise = promise;
		else dcvbPromise = promise;
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

<SeoHead
	title="Cerca: {data.paraula} - Lingua"
	description="Resultats de cerca per «{data.paraula}» a Lingua."
	path="/cerca?paraula={encodeURIComponent(data.paraula)}"
	noindex
/>

<a href="/" class="mb-5 inline-block font-medium text-brand transition-colors hover:text-brand-hover"
	>&larr; Tornar a l'inici</a
>

<h2 class="mb-4 text-2xl text-primary-800">Definicions: {data.paraula}</h2>
<div class="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
	<div class="flex flex-col rounded-xl border border-border bg-surface-card shadow-sm">
		<div class="flex items-center justify-between px-4 pt-5 pb-3 sm:px-6 sm:pt-6">
			<h3 class="text-lg font-semibold text-primary-800">GDLC</h3>
			<button
				onclick={() => reloadDefinition('gdlc')}
				class="reload-btn"
				title="Recarregar definici&oacute;"
				aria-label="Recarregar definici&oacute; GDLC"
			>
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg
				>
			</button>
		</div>
		<div class="flex flex-1 flex-col border-t border-border">
			{#await gdlcPromise}
				<p class="px-4 py-4 text-muted sm:px-6">Carregant...</p>
			{:then gdlcHtml}
				{#if gdlcHtml}
					<div class="gdlc-definition max-h-100 flex-1 overflow-y-auto px-4 py-4 leading-relaxed text-base sm:px-6">
						{@html gdlcHtml}
					</div>
					<p class="border-t border-border px-4 py-2.5 text-sm text-muted sm:px-6">
						Font: <a
							href="https://www.diccionari.cat/cerca/gran-diccionari-de-la-llengua-catalana?search_api_fulltext_cust={encodeURIComponent(
								data.paraula
							)}&search_api_fulltext_cust_1&field_faceta_cerca_1=5065&show=title"
							target="_blank"
							rel="noopener noreferrer"
							class="text-brand transition-colors hover:text-brand-hover">Gran Diccionari de la Llengua Catalana</a
						>
					</p>
				{:else}
					<p class="px-4 py-4 text-muted sm:px-6">No s'ha trobat cap definici&oacute; al GDLC.</p>
				{/if}
			{/await}
		</div>
	</div>

	<div class="flex flex-col rounded-xl border border-border bg-surface-card shadow-sm">
		<div class="flex items-center justify-between px-4 pt-5 pb-3 sm:px-6 sm:pt-6">
			<h3 class="text-lg font-semibold text-primary-800">DCVB</h3>
			<button
				onclick={() => reloadDefinition('dcvb')}
				class="reload-btn"
				title="Recarregar definici&oacute;"
				aria-label="Recarregar definici&oacute; DCVB"
			>
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg
				>
			</button>
		</div>
		<div class="flex flex-1 flex-col border-t border-border">
			{#await dcvbPromise}
				<p class="px-4 py-4 text-muted sm:px-6">Carregant...</p>
			{:then dcvbHtml}
				{#if dcvbHtml}
					<div class="dcvb-definition max-h-100 flex-1 overflow-y-auto px-4 py-4 leading-relaxed text-base sm:px-6">
						{@html dcvbHtml}
					</div>
					<p class="border-t border-border px-4 py-2.5 text-sm text-muted sm:px-6">
						Font: <a
							href="https://dcvb.iec.cat/results.asp?Word={encodeURIComponent(data.paraula)}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-brand transition-colors hover:text-brand-hover"
							>Diccionari Catal&agrave;-Valenci&agrave;-Balear</a
						>
					</p>
				{:else}
					<p class="px-4 py-4 text-muted sm:px-6">No s'ha pogut obtenir la definici&oacute; del DCVB.</p>
				{/if}
			{/await}
		</div>
	</div>
</div>

{#if data.phrases.length > 0}
	<div class="rounded-xl border border-border bg-surface-card p-5 shadow-sm sm:p-8">
		<h3 class="mb-4 text-xl text-primary-800">
			Expressions que contenen &ldquo;{data.paraula}&rdquo;
		</h3>
		<ul class="space-y-3">
			{#each data.phrases as phrase (phrase.id)}
				<li>
					<a
						href="/expressions/{phrase.id}"
						class="wrap-break-word text-brand transition-colors hover:text-brand-hover"
						onclick={() => handlePhraseClick(phrase.id, phrase.phraseText)}
					>
						<strong>{phrase.phraseText}</strong>
						<span class="text-muted"> &mdash; {phrase.explanation}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<div class="rounded-xl border border-border bg-surface-card p-5 shadow-sm sm:p-8">
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

	.dcvb-definition :global(hr.dcvb-separator) {
		margin-top: 1rem;
		padding-top: 0;
		border: none;
		border-top: 1px solid var(--color-border);
		margin-bottom: 1rem;
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

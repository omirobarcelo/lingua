<script lang="ts">
	import posthog from 'posthog-js';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/SeoHead.svelte';
	import { SITE_URL } from '$lib/seo';

	let { data }: { data: PageData } = $props();

	const jsonLdScript = $derived(
		'<script type="application/ld+json">' +
			JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'DefinedTermSet',
				name: data.category.name,
				description: data.category.description || undefined,
				url: SITE_URL + '/expressions/' + data.category.slug,
				inLanguage: 'ca'
			}) +
			'</' +
			'script>'
	);

	function handlePhraseClick(phraseId: number, phraseText: string) {
		posthog.capture('phrase_clicked_from_category', {
			phrase_id: phraseId,
			phrase_text: phraseText,
			category_slug: data.category.slug,
			category_name: data.category.name
		});
	}
</script>

<SeoHead
	title="{data.category.name} - Lingua"
	description="Expressions catalanes de la categoria «{data.category.name}»{data.category.description
		? `: ${data.category.description}`
		: ''} a Lingua."
	path="/expressions/{data.category.slug}"
/>

<svelte:head>
	{@html jsonLdScript}
</svelte:head>

<a href="/expressions" class="mb-5 inline-block font-medium text-brand transition-colors hover:text-brand-hover"
	>&larr; Tornar a categories</a
>

<h2 class="mb-2 text-3xl text-primary-900">{data.category.name}</h2>
{#if data.category.description}
	<p class="mb-8 text-muted">{data.category.description}</p>
{/if}

<div class="grid gap-5 sm:grid-cols-2">
	{#each data.phrases as phrase (phrase.id)}
		<a
			href="/expressions/{phrase.id}"
			class="group rounded-xl border border-border bg-surface-card p-6 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
			onclick={() => handlePhraseClick(phrase.id, phrase.phraseText)}
		>
			<h3 class="mb-2 text-lg font-semibold text-primary-800 transition-colors group-hover:text-brand">
				{phrase.phraseText}
			</h3>
			<p class="text-sm leading-relaxed text-muted">{phrase.explanation}</p>
		</a>
	{/each}
</div>

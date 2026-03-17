<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Cerca: {data.paraula} - Lingua</title>
</svelte:head>

<a href="/" class="back-link">← Tornar a l'inici</a>

<div class="card">
	<h2>Definició: {data.paraula}</h2>
	<div class="iframe-container">
		<iframe
			src="https://dcvb.iec.cat/results.asp?Word={encodeURIComponent(data.paraula)}"
			title="Definició de {data.paraula}"
		></iframe>
	</div>
</div>

{#if data.phrases.length > 0}
	<div class="card">
		<h3>Expressions que contenen "{data.paraula}"</h3>
		<ul class="related-phrases">
			{#each data.phrases as phrase}
				<li>
					<a href="/expressions/{phrase.id}">
						<strong>{phrase.text}</strong> - {phrase.explanation}
					</a>
				</li>
			{/each}
		</ul>
	</div>
{:else}
	<div class="card">
		<p>No s'han trobat expressions que continguin aquesta paraula.</p>
	</div>
{/if}

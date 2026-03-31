<script lang="ts">
	import { goto } from '$app/navigation';
	import posthog from 'posthog-js';

	let searchWord = $state('');
	let searching = $state(false);

	function handleSearch(event: Event) {
		event.preventDefault();
		const trimmedWord = searchWord.trim();
		if (trimmedWord) {
			searching = true;
			posthog.capture('word_searched', { word: trimmedWord });
			goto(`/cerca?paraula=${encodeURIComponent(trimmedWord)}`).catch(() => {
				searching = false;
			});
		}
	}
</script>

<svelte:head>
	<title>Lingua - Diccionari d'Expressions Catalanes</title>
</svelte:head>

<div class="mb-8 rounded-xl border border-border bg-surface-card p-5 shadow-sm sm:p-8">
	<h2 class="mb-3 text-2xl text-primary-800">Cerca de Paraules</h2>
	<p class="mb-5 text-muted">Cerca paraules per veure la seva definici&oacute; i expressions relacionades.</p>
	<form class="flex flex-col gap-3 sm:flex-row" onsubmit={handleSearch}>
		<input
			type="search"
			bind:value={searchWord}
			placeholder="Introdueix una paraula..."
			required
			class="flex-1 rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
		/>
		<button
			type="submit"
			disabled={searching}
			class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-wait disabled:opacity-70 sm:min-w-25"
		>
			{#if searching}
				<svg
					class="inline-block h-5 w-5 animate-spin"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					role="status"
					aria-label="Cercant..."><path d="M12 2a10 10 0 0 1 10 10" /></svg
				>
			{:else}
				Cercar
			{/if}
		</button>
	</form>
</div>

<div class="rounded-xl border border-border bg-surface-card p-5 shadow-sm sm:p-8">
	<h2 class="mb-4 text-2xl text-primary-800">Sobre Lingua</h2>
	<p class="mb-4 leading-relaxed text-muted">
		Benvingut a Lingua, el teu diccionari d'expressions catalanes. Aquesta plataforma t'ofereix dues maneres d'explorar
		el ric patrimoni ling&uuml;&iacute;stic catal&agrave;:
	</p>
	<ul class="mb-4 ml-5 list-disc space-y-2 text-muted">
		<li>
			<strong class="text-base">Cerca de Paraules:</strong> Introdueix qualsevol paraula per veure la seva definici&oacute;
			i descobreix expressions que la contenen.
		</li>
		<li>
			<strong class="text-base">Consulta d'Expressions:</strong> Explora expressions catalanes organitzades per categories,
			amb explicacions detallades i expressions relacionades.
		</li>
	</ul>
	<p class="text-muted">
		Comen&ccedil;a la teva cerca utilitzant el cercador de dalt o <a
			href="/expressions"
			class="font-medium text-brand transition-colors hover:text-brand-hover">explora les expressions per categories</a
		>.
	</p>
</div>

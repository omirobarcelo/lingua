<script lang="ts">
	import { goto } from '$app/navigation';
	import posthog from 'posthog-js';

	let searchWord = $state('');

	function handleSearch(event: Event) {
		event.preventDefault();
		const trimmedWord = searchWord.trim();
		if (trimmedWord) {
			posthog.capture('word_searched', { word: trimmedWord });
			goto(`/cerca?paraula=${encodeURIComponent(trimmedWord)}`);
		}
	}
</script>

<svelte:head>
	<title>Lingua - Diccionari d'Expressions Catalanes</title>
</svelte:head>

<div class="rounded-xl bg-surface-card border border-border p-8 shadow-sm mb-8">
	<h2 class="text-2xl text-primary-800 mb-3">Cerca de Paraules</h2>
	<p class="text-muted mb-5">
		Cerca paraules per veure la seva definici&oacute; i expressions relacionades.
	</p>
	<form class="flex gap-3" onsubmit={handleSearch}>
		<input
			type="search"
			bind:value={searchWord}
			placeholder="Introdueix una paraula..."
			required
			class="flex-1 rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
		/>
		<button
			type="submit"
			class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
		>
			Cercar
		</button>
	</form>
</div>

<div class="rounded-xl bg-surface-card border border-border p-8 shadow-sm">
	<h2 class="text-2xl text-primary-800 mb-4">Sobre Lingua</h2>
	<p class="text-muted mb-4 leading-relaxed">
		Benvingut a Lingua, el teu diccionari d'expressions catalanes. Aquesta plataforma t'ofereix
		dues maneres d'explorar el ric patrimoni ling&uuml;&iacute;stic catal&agrave;:
	</p>
	<ul class="ml-5 mb-4 list-disc space-y-2 text-muted">
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
			class="text-brand font-medium hover:text-brand-hover transition-colors">explora les expressions per categories</a
		>.
	</p>
</div>

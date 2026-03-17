<script lang="ts">
	import { goto } from '$app/navigation';

	let searchWord = '';

	function handleSearch(event: Event) {
		event.preventDefault();
		if (searchWord.trim()) {
			goto(`/cerca?paraula=${encodeURIComponent(searchWord.trim())}`);
		}
	}
</script>

<svelte:head>
	<title>Lingua - Diccionari d'Expressions Catalanes</title>
</svelte:head>

<div class="search-box">
	<h2>Cerca de Paraules</h2>
	<p style="margin-bottom: 15px;">
		Cerca paraules per veure la seva definició i expressions relacionades.
	</p>
	<form class="search-form" on:submit={handleSearch}>
		<input
			type="text"
			bind:value={searchWord}
			placeholder="Introdueix una paraula..."
			required
		/>
		<button type="submit">Cercar</button>
	</form>
</div>

<div class="card">
	<h2>Sobre Lingua</h2>
	<p style="margin-bottom: 15px;">
		Benvingut a Lingua, el teu diccionari d'expressions catalanes. Aquesta plataforma t'ofereix
		dues maneres d'explorar el ric patrimoni lingüístic català:
	</p>
	<ul style="margin-left: 20px; margin-bottom: 15px;">
		<li style="margin-bottom: 8px;">
			<strong>Cerca de Paraules:</strong> Introdueix qualsevol paraula per veure la seva definició
			i descobreix expressions que la contenen.
		</li>
		<li style="margin-bottom: 8px;">
			<strong>Consulta d'Expressions:</strong> Explora expressions catalanes organitzades per categories,
			amb explicacions detallades i expressions relacionades.
		</li>
	</ul>
	<p>
		Comença la teva cerca utilitzant el cercador de dalt o <a
			href="/expressions"
			style="color: var(--primary-color);">explora les expressions per categories</a
		>.
	</p>
</div>

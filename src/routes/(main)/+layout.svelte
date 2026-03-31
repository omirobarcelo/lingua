<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	onMount(async () => {
		const { registerSW } = await import('virtual:pwa-register');
		registerSW({ immediate: true });
	});
</script>

<header class="bg-brand shadow-md">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
		<h1 class="text-2xl font-bold">
			<a
				href="/"
				aria-label="Lingua - P&agrave;gina principal"
				class="text-white no-underline transition-opacity hover:opacity-90">Lingua</a
			>
		</h1>
		<nav aria-label="Navegaci&oacute; principal" class="flex gap-6">
			<a
				href="/expressions"
				class="text-sm font-medium tracking-wide text-white/90 uppercase no-underline transition-colors hover:text-white"
			>
				Expressions
			</a>
		</nav>
	</div>
</header>

<main class="mx-auto max-w-5xl px-4 py-8 sm:px-6">
	{@render children()}
</main>

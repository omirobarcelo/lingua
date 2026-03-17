<script lang="ts">
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<header class="bg-brand shadow-md">
	<div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
		<h1 class="text-2xl font-bold">
			<a href="/" class="text-white no-underline hover:opacity-90 transition-opacity">Lingua</a>
		</h1>
		<nav class="flex gap-6">
			<a href="/expressions" class="text-white/90 no-underline hover:text-white transition-colors text-sm font-medium tracking-wide uppercase">
				Expressions
			</a>
		</nav>
	</div>
</header>

<main class="mx-auto max-w-5xl px-6 py-8">
	{@render children()}
</main>

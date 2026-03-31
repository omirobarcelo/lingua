<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Tauler - Lingua Admin</title>
</svelte:head>

<h1 class="mb-8 text-3xl text-primary-900">Tauler</h1>

<div class="mb-8 grid gap-5 sm:grid-cols-3">
	<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
		<p class="mb-1 text-sm text-muted">Categories</p>
		<p class="text-3xl font-bold text-primary-900">{data.categoryCount}</p>
	</div>
	<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
		<p class="mb-1 text-sm text-muted">Frases</p>
		<p class="text-3xl font-bold text-primary-900">{data.phraseCount}</p>
	</div>
	<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
		<p class="mb-1 text-sm text-muted">Relacions</p>
		<p class="text-3xl font-bold text-primary-900">{data.relationCount}</p>
	</div>
</div>

<div class="flex gap-3">
	<a
		href="/admin/categories"
		class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white no-underline transition-colors hover:bg-brand-hover"
	>
		Gestionar categories
	</a>
	<a
		href="/admin/frases"
		class="cursor-pointer rounded-lg border-2 border-brand bg-transparent px-6 py-3 font-medium text-brand no-underline transition-colors hover:bg-brand-light"
	>
		Gestionar frases
	</a>
</div>

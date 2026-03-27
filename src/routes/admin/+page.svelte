<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Tauler - Lingua Admin</title>
</svelte:head>

<h1 class="text-3xl text-primary-900 mb-8">Tauler</h1>

<div class="grid gap-5 sm:grid-cols-3 mb-8">
	<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
		<p class="text-sm text-muted mb-1">Categories</p>
		<p class="text-3xl font-bold text-primary-900">{data.categoryCount}</p>
	</div>
	<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
		<p class="text-sm text-muted mb-1">Frases</p>
		<p class="text-3xl font-bold text-primary-900">{data.phraseCount}</p>
	</div>
	<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
		<p class="text-sm text-muted mb-1">Relacions</p>
		<p class="text-3xl font-bold text-primary-900">{data.relationCount}</p>
	</div>
</div>

<div class="flex gap-3">
	<a
		href="/admin/categories"
		class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer no-underline"
	>
		Gestionar categories
	</a>
	<a
		href="/admin/frases"
		class="rounded-lg border-2 border-brand bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-brand-light cursor-pointer no-underline"
	>
		Gestionar frases
	</a>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import AdminField from '$lib/components/admin/AdminField.svelte';
	import AdminFormError from '$lib/components/admin/AdminFormError.svelte';
	import { confirm } from '$lib/stores/adminDialog.svelte';
	import { generateSlug } from '$lib/utils/slug';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let nameInput = $state(data.category.name);
	let slugPreview = $derived(generateSlug(nameInput));
</script>

<svelte:head>
	<title>Editar {data.category.name} - Lingua Admin</title>
</svelte:head>

<a href="/admin/categories" class="inline-block mb-5 text-brand hover:text-brand-hover transition-colors font-medium no-underline">&larr; Tornar a categories</a>

<h1 class="text-3xl text-primary-900 mb-6">Editar categoria</h1>

<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm mb-6">
	<AdminFormError message={form?.error} />

	<form method="POST" action="?/update" use:enhance>
		<div class="mb-4">
			<label class="block mb-1.5 text-sm font-medium text-base" for="name">Nom</label>
			<input
				id="name"
				name="name"
				type="text"
				bind:value={nameInput}
				required
				class="w-full rounded-lg border-2 px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none {form?.errors?.name ? 'border-red-400' : 'border-border'}"
			/>
			{#if form?.errors?.name}
				<p class="mt-1 text-sm text-red-600">{form.errors.name}</p>
			{/if}
		</div>

		<div class="mb-4">
			<span class="block mb-1.5 text-sm font-medium text-base">Slug (auto-generat)</span>
			<p class="rounded-lg border-2 border-border bg-neutral-100 px-4 py-3 text-muted">{slugPreview}</p>
		</div>

		<AdminField
			label="Descripció"
			name="description"
			type="textarea"
			rows={2}
			value={data.category.description ?? ''}
		/>

		<div class="flex gap-3">
			<button
				type="submit"
				class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
			>
				Desar
			</button>
		</div>
	</form>
</div>

<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
	<h2 class="text-xl text-primary-800 mb-4">Zona perillosa</h2>
	<form
		method="POST"
		action="?/delete"
		use:enhance={async ({ cancel }) => {
			const ok = await confirm(`Segur que vols eliminar "${data.category.name}"? Aquesta acció no es pot desfer.`);
			if (!ok) cancel();
		}}
	>
		<button
			type="submit"
			class="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700 cursor-pointer"
		>
			Eliminar categoria
		</button>
	</form>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import AdminField from '$lib/components/admin/AdminField.svelte';
	import { confirm } from '$lib/stores/adminDialog.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Editar paraula - Lingua Admin</title>
</svelte:head>

<a
	href="/admin/paraules"
	class="mb-5 inline-block font-medium text-brand no-underline transition-colors hover:text-brand-hover"
	>&larr; Tornar a paraules</a
>

<h1 class="mb-6 text-3xl text-primary-900">Editar paraula</h1>

<!-- Edit form -->
<div class="mb-6 rounded-xl border border-border bg-surface-card p-6 shadow-sm">
	<form
		method="POST"
		action="?/update"
		use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}
	>
		<AdminField label="Paraula" name="word" value={data.word.word} required error={form?.errors?.word} />
		<AdminField
			label="Notes"
			name="notes"
			type="textarea"
			rows={4}
			value={data.word.notes ?? ''}
			error={form?.errors?.notes}
		/>
		<AdminField
			label="Paraules relacionades"
			name="relatedWords"
			value={data.word.relatedWords ?? ''}
			error={form?.errors?.relatedWords}
		/>
		<button
			type="submit"
			class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
		>
			Desar
		</button>
	</form>
</div>

<!-- Danger zone -->
<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
	<h2 class="mb-4 text-xl text-primary-800">Zona perillosa</h2>
	<form
		method="POST"
		action="?/delete"
		use:enhance={async ({ cancel }) => {
			const ok = await confirm(`Segur que vols eliminar "${data.word.word}"?`);
			if (!ok) cancel();
		}}
	>
		<button
			type="submit"
			class="cursor-pointer rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
		>
			Eliminar paraula
		</button>
	</form>
</div>

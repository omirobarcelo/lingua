<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import AdminField from '$lib/components/admin/AdminField.svelte';
	import AdminFormError from '$lib/components/admin/AdminFormError.svelte';
	import { confirm } from '$lib/stores/adminDialog.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let categoryOptions = $derived(data.categories.map((c) => ({ value: String(c.id), label: c.name })));

	let relationOptions = $derived(data.availablePhrases.map((p) => ({ value: String(p.id), label: p.phraseText })));
</script>

<svelte:head>
	<title>Editar frase - Lingua Admin</title>
</svelte:head>

<a
	href="/admin/frases"
	class="mb-5 inline-block font-medium text-brand no-underline transition-colors hover:text-brand-hover"
	>&larr; Tornar a frases</a
>

<h1 class="mb-6 text-3xl text-primary-900">Editar frase</h1>

<!-- Edit form -->
<div class="mb-6 rounded-xl border border-border bg-surface-card p-6 shadow-sm">
	<AdminFormError message={form?.errors ? undefined : form?.error} />

	<form method="POST" action="?/update" use:enhance>
		<AdminField
			label="Frase"
			name="phraseText"
			value={data.phrase.phraseText}
			required
			error={form?.errors?.phraseText}
		/>
		<AdminField
			label="Explicació"
			name="explanation"
			type="textarea"
			rows={4}
			value={data.phrase.explanation}
			required
			error={form?.errors?.explanation}
		/>
		<AdminField
			label="Categoria"
			name="categoryId"
			type="select"
			value={String(data.phrase.categoryId)}
			required
			options={categoryOptions}
			error={form?.errors?.categoryId}
		/>
		<button
			type="submit"
			class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
		>
			Desar
		</button>
	</form>
</div>

<!-- Relations -->
<div class="mb-6 rounded-xl border border-border bg-surface-card p-6 shadow-sm">
	<h2 class="mb-4 text-xl text-primary-800">Expressions relacionades</h2>

	{#if data.relatedPhrases.length > 0}
		<ul class="mb-6 space-y-2">
			{#each data.relatedPhrases as related (related.id)}
				<li class="flex items-center justify-between rounded-lg border border-border px-4 py-2">
					<span class="font-medium">{related.phraseText}</span>
					<form
						method="POST"
						action="?/removeRelation"
						use:enhance={async ({ cancel }) => {
							const ok = await confirm(`Eliminar la relació amb "${related.phraseText}"?`);
							if (!ok) cancel();
						}}
					>
						<input type="hidden" name="relatedPhraseId" value={related.id} />
						<button
							type="submit"
							class="cursor-pointer rounded-md px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
						>
							Elimina
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mb-4 text-muted">Cap relació definida.</p>
	{/if}

	{#if relationOptions.length > 0}
		<form method="POST" action="?/addRelation" use:enhance class="flex items-end gap-3">
			<div class="flex-1">
				<AdminField
					label="Afegir relació"
					name="relatedPhraseId"
					type="select"
					options={relationOptions}
					placeholder="Selecciona una frase..."
				/>
			</div>
			<button
				type="submit"
				class="mb-4 cursor-pointer rounded-lg bg-brand px-4 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Afegir
			</button>
		</form>
	{/if}
</div>

<!-- Danger zone -->
<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
	<h2 class="mb-4 text-xl text-primary-800">Zona perillosa</h2>
	<form
		method="POST"
		action="?/delete"
		use:enhance={async ({ cancel }) => {
			const ok = await confirm(
				`Segur que vols eliminar "${data.phrase.phraseText}"? Aquesta acció eliminarà també totes les relacions.`
			);
			if (!ok) cancel();
		}}
	>
		<button
			type="submit"
			class="cursor-pointer rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
		>
			Eliminar frase
		</button>
	</form>
</div>

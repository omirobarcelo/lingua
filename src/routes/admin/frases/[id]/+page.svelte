<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import AdminField from '$lib/components/admin/AdminField.svelte';
	import AdminFormError from '$lib/components/admin/AdminFormError.svelte';
	import { confirm } from '$lib/stores/adminDialog.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let categoryOptions = $derived(
		data.categories.map((c) => ({ value: String(c.id), label: c.name }))
	);

	let relationOptions = $derived(
		data.availablePhrases.map((p) => ({ value: String(p.id), label: p.phraseText }))
	);
</script>

<svelte:head>
	<title>Editar frase - Lingua Admin</title>
</svelte:head>

<a href="/admin/frases" class="inline-block mb-5 text-brand hover:text-brand-hover transition-colors font-medium no-underline">&larr; Tornar a frases</a>

<h1 class="text-3xl text-primary-900 mb-6">Editar frase</h1>

<!-- Edit form -->
<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm mb-6">
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
			class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
		>
			Desar
		</button>
	</form>
</div>

<!-- Relations -->
<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm mb-6">
	<h2 class="text-xl text-primary-800 mb-4">Expressions relacionades</h2>

	{#if data.relatedPhrases.length > 0}
		<ul class="space-y-2 mb-6">
			{#each data.relatedPhrases as related}
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
							class="rounded-md px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
						>
							Elimina
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="text-muted mb-4">Cap relació definida.</p>
	{/if}

	{#if relationOptions.length > 0}
		<form method="POST" action="?/addRelation" use:enhance class="flex gap-3 items-end">
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
				class="rounded-lg bg-brand px-4 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer mb-4"
			>
				Afegir
			</button>
		</form>
	{/if}
</div>

<!-- Danger zone -->
<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
	<h2 class="text-xl text-primary-800 mb-4">Zona perillosa</h2>
	<form
		method="POST"
		action="?/delete"
		use:enhance={async ({ cancel }) => {
			const ok = await confirm(`Segur que vols eliminar "${data.phrase.phraseText}"? Aquesta acció eliminarà també totes les relacions.`);
			if (!ok) cancel();
		}}
	>
		<button
			type="submit"
			class="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700 cursor-pointer"
		>
			Eliminar frase
		</button>
	</form>
</div>

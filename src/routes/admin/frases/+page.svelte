<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import AdminField from '$lib/components/admin/AdminField.svelte';
	import AdminFormError from '$lib/components/admin/AdminFormError.svelte';
	import { confirm } from '$lib/stores/adminDialog.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let showBulk = $state(false);

	let categoryOptions = $derived(data.categories.map((c) => ({ value: String(c.id), label: c.name })));
</script>

<svelte:head>
	<title>Frases - Lingua Admin</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-3xl text-primary-900">Frases</h1>
	<button
		type="button"
		onclick={() => (showBulk = !showBulk)}
		class="cursor-pointer rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-neutral-100"
	>
		{showBulk ? 'Creació individual' : 'Creació massiva'}
	</button>
</div>

<!-- Create form -->
<div class="mb-8 rounded-xl border border-border bg-surface-card p-6 shadow-sm">
	<h2 class="mb-4 text-xl text-primary-800">{showBulk ? 'Crear frases (massiu)' : 'Nova frase'}</h2>

	{#if showBulk}
		<AdminFormError message={form?.action === 'createBulk' ? form?.error : ''} />
		<form method="POST" action="?/createBulk" use:enhance>
			<AdminField
				label="Frases (una per línia: Frase | Explicació | Categoria)"
				name="entries"
				type="textarea"
				rows={6}
				placeholder="Tenir el cor trencat | Estar molt trist per una decepció | Amor i Sentiments&#10;Ser un ase | Ser tossut o poc intel·ligent | Animals"
			/>
			<button
				type="submit"
				class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Crear totes
			</button>
		</form>
	{:else}
		<AdminFormError message={form?.action === 'create' ? form?.error : ''} />
		<form method="POST" action="?/create" use:enhance>
			<AdminField label="Frase" name="phraseText" required placeholder="Ex: Tenir el cor trencat" />
			<AdminField
				label="Explicació"
				name="explanation"
				type="textarea"
				rows={3}
				required
				placeholder="Significat de la frase"
			/>
			<AdminField
				label="Categoria"
				name="categoryId"
				type="select"
				required
				options={categoryOptions}
				placeholder="Selecciona una categoria"
			/>
			<button
				type="submit"
				class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Crear
			</button>
		</form>
	{/if}
</div>

<!-- Phrases table -->
{#if data.phrases.length > 0}
	<div class="overflow-hidden rounded-xl border border-border bg-surface-card shadow-sm">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border bg-neutral-50">
					<th class="px-4 py-3 text-left font-medium text-muted">Frase</th>
					<th class="px-4 py-3 text-left font-medium text-muted">Categoria</th>
					<th class="px-4 py-3 text-right font-medium text-muted">Accions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.phrases as phrase (phrase.id)}
					<tr class="border-b border-border last:border-0">
						<td class="px-4 py-3 font-medium">{phrase.phraseText}</td>
						<td class="px-4 py-3 text-muted">{phrase.categoryName}</td>
						<td class="px-4 py-3 text-right">
							<div class="flex items-center justify-end gap-2">
								<a
									href="/admin/frases/{phrase.id}"
									class="rounded-md px-3 py-1 text-sm font-medium text-brand no-underline transition-colors hover:bg-brand-light"
								>
									Edita
								</a>
								<form
									method="POST"
									action="?/delete"
									use:enhance={async ({ cancel }) => {
										const ok = await confirm(`Segur que vols eliminar "${phrase.phraseText}"?`);
										if (!ok) cancel();
									}}
								>
									<input type="hidden" name="id" value={phrase.id} />
									<button
										type="submit"
										class="cursor-pointer rounded-md px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
									>
										Elimina
									</button>
								</form>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<p class="text-muted">No hi ha frases. Crea'n una per començar.</p>
{/if}

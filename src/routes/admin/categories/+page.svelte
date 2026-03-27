<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import AdminField from '$lib/components/admin/AdminField.svelte';
	import AdminFormError from '$lib/components/admin/AdminFormError.svelte';
	import { confirm } from '$lib/stores/adminDialog.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	let showBulk = $state(false);
</script>

<svelte:head>
	<title>Categories - Lingua Admin</title>
</svelte:head>

<div class="flex items-center justify-between mb-6">
	<h1 class="text-3xl text-primary-900">Categories</h1>
	<button
		type="button"
		onclick={() => (showBulk = !showBulk)}
		class="rounded-lg bg-transparent px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-neutral-100 cursor-pointer"
	>
		{showBulk ? 'Creació individual' : 'Creació massiva'}
	</button>
</div>

<!-- Create form -->
<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm mb-8">
	<h2 class="text-xl text-primary-800 mb-4">{showBulk ? 'Crear categories (massiu)' : 'Nova categoria'}</h2>

	{#if showBulk}
		<AdminFormError message={form?.action === 'createBulk' ? form?.error : ''} />
		<form method="POST" action="?/createBulk" use:enhance>
			<AdminField
				label="Categories (una per línia: Nom | Descripció)"
				name="entries"
				type="textarea"
				rows={6}
				placeholder="Amor i Sentiments | Expressions relacionades amb l'amor&#10;Animals | Frases fetes amb animals"
			/>
			<button
				type="submit"
				class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
			>
				Crear totes
			</button>
		</form>
	{:else}
		<AdminFormError message={form?.action === 'create' ? form?.error : ''} />
		<form method="POST" action="?/create" use:enhance>
			<AdminField label="Nom" name="name" required placeholder="Ex: Amor i Sentiments" />
			<AdminField
				label="Descripció"
				name="description"
				type="textarea"
				rows={2}
				placeholder="Breu descripció de la categoria"
			/>
			<button
				type="submit"
				class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
			>
				Crear
			</button>
		</form>
	{/if}
</div>

<!-- Categories table -->
{#if data.categories.length > 0}
	<div class="rounded-xl bg-surface-card border border-border shadow-sm overflow-hidden">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border bg-neutral-50">
					<th class="px-4 py-3 text-left font-medium text-muted">Nom</th>
					<th class="px-4 py-3 text-left font-medium text-muted">Slug</th>
					<th class="px-4 py-3 text-left font-medium text-muted">Frases</th>
					<th class="px-4 py-3 text-right font-medium text-muted">Accions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.categories as cat}
					<tr class="border-b border-border last:border-0">
						<td class="px-4 py-3 font-medium">{cat.name}</td>
						<td class="px-4 py-3 text-muted">{cat.slug}</td>
						<td class="px-4 py-3 text-muted">{cat.phraseCount}</td>
						<td class="px-4 py-3 text-right">
							<div class="flex items-center justify-end gap-2">
								<a
									href="/admin/categories/{cat.id}"
									class="rounded-md px-3 py-1 text-sm font-medium text-brand hover:bg-brand-light transition-colors no-underline"
								>
									Edita
								</a>
								<form
									method="POST"
									action="?/delete"
									use:enhance={async ({ cancel }) => {
										const ok = await confirm(`Segur que vols eliminar "${cat.name}"?`);
										if (!ok) cancel();
									}}
								>
									<input type="hidden" name="id" value={cat.id} />
									<button
										type="submit"
										class="rounded-md px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
	<p class="text-muted">No hi ha categories. Crea'n una per començar.</p>
{/if}

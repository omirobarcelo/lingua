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
	<title>Paraules - Lingua Admin</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-3xl text-primary-900">Paraules</h1>
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
	<h2 class="mb-4 text-xl text-primary-800">{showBulk ? 'Crear paraules (massiu)' : 'Nova paraula'}</h2>

	{#if showBulk}
		<AdminFormError message={form?.action === 'createBulk' ? form?.error : ''} />
		<form method="POST" action="?/createBulk" use:enhance>
			<AdminField
				label="Paraules (una per línia: Paraula | Notes | Paraules relacionades)"
				name="entries"
				type="textarea"
				rows={6}
				placeholder="dona | Paraula molt usada en expressions catalanes | dones, senyora&#10;gat | Animal domèstic molt present en refranys | gats, gata"
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
			<AdminField label="Paraula" name="word" required placeholder="Ex: dona" />
			<AdminField
				label="Notes"
				name="notes"
				type="textarea"
				rows={3}
				placeholder="Notes o comentaris sobre la paraula"
			/>
			<AdminField label="Paraules relacionades" name="relatedWords" placeholder="Ex: dones, senyora" />
			<button
				type="submit"
				class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Crear
			</button>
		</form>
	{/if}
</div>

<!-- Words table -->
{#if data.words.length > 0}
	<div class="overflow-hidden rounded-xl border border-border bg-surface-card shadow-sm">
		<table class="w-full text-sm">
			<thead>
				<tr class="border-b border-border bg-neutral-50">
					<th class="px-4 py-3 text-left font-medium text-muted">Paraula</th>
					<th class="px-4 py-3 text-left font-medium text-muted">Notes</th>
					<th class="px-4 py-3 text-left font-medium text-muted">Paraules relacionades</th>
					<th class="px-4 py-3 text-right font-medium text-muted">Accions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.words as word (word.id)}
					<tr class="border-b border-border last:border-0">
						<td class="px-4 py-3 font-medium">{word.word}</td>
						<td class="max-w-xs truncate px-4 py-3 text-muted">{word.notes ?? ''}</td>
						<td class="max-w-xs truncate px-4 py-3 text-muted">{word.relatedWords ?? ''}</td>
						<td class="px-4 py-3 text-right">
							<div class="flex items-center justify-end gap-2">
								<a
									href="/admin/paraules/{word.id}"
									class="rounded-md px-3 py-1 text-sm font-medium text-brand no-underline transition-colors hover:bg-brand-light"
								>
									Edita
								</a>
								<form
									method="POST"
									action="?/delete"
									use:enhance={async ({ cancel }) => {
										const ok = await confirm(`Segur que vols eliminar "${word.word}"?`);
										if (!ok) cancel();
									}}
								>
									<input type="hidden" name="id" value={word.id} />
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
	<p class="text-muted">No hi ha paraules. Crea'n una per començar.</p>
{/if}

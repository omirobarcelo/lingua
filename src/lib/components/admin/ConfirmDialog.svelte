<script lang="ts">
	import { getState, accept, cancel } from '$lib/stores/adminDialog.svelte';

	let state = $derived(getState());
</script>

{#if state.open}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onkeydown={(e) => e.key === 'Escape' && cancel()}
	>
		<div class="w-full max-w-sm rounded-xl border border-border bg-surface-card p-6 shadow-lg">
			<p class="mb-6 text-base">{state.message}</p>
			<div class="flex justify-end gap-3">
				<button
					type="button"
					onclick={cancel}
					class="cursor-pointer rounded-lg border-2 border-border bg-transparent px-4 py-2 text-sm font-medium text-base transition-colors hover:bg-neutral-100"
				>
					Cancel·la
				</button>
				<button
					type="button"
					onclick={accept}
					class="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
				>
					Confirma
				</button>
			</div>
		</div>
	</div>
{/if}

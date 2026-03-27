<script lang="ts">
	import { getToasts } from '$lib/stores/adminToast.svelte';

	let toasts = $derived(getToasts());
</script>

{#if toasts.length > 0}
	<div class="fixed bottom-4 right-4 z-50 space-y-2">
		{#each toasts as toast (toast.id)}
			<div
				class="rounded-lg px-4 py-3 text-sm font-medium shadow-md {toast.type === 'ok'
					? 'bg-green-50 border border-green-200 text-green-700'
					: 'bg-red-50 border border-red-200 text-red-700'}"
			>
				{toast.message}
			</div>
		{/each}
	</div>
{/if}

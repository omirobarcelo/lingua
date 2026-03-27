<script lang="ts">
	let { message = '' }: { message?: string } = $props();
</script>

{#if message}
	<div class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
		{message}
	</div>
{/if}

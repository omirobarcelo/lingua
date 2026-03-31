<script lang="ts">
	let { message = '' }: { message?: string } = $props();
</script>

{#if message}
	<div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
		{message}
	</div>
{/if}

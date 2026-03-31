<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Iniciar sessió - Lingua Admin</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-surface">
	<div class="w-full max-w-sm rounded-xl border border-border bg-surface-card p-8 shadow-sm">
		<h1 class="mb-2 text-center text-2xl text-primary-900">Lingua Admin</h1>
		<p class="mb-6 text-center text-sm text-muted">Introdueix la contrasenya per accedir</p>

		{#if form?.error}
			<div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
				{form.error}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					await update({ reset: false });
				};
			}}
		>
			<label class="mb-1.5 block text-sm font-medium text-base" for="password">Contrasenya</label>
			<input
				id="password"
				name="password"
				type="password"
				required
				autocomplete="current-password"
				class="mb-4 w-full rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
			/>
			<button
				type="submit"
				class="w-full cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Entrar
			</button>
		</form>
	</div>
</div>

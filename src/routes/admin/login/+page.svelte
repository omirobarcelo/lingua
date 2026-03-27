<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<title>Iniciar sessió - Lingua Admin</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-surface">
	<div class="w-full max-w-sm rounded-xl bg-surface-card border border-border p-8 shadow-sm">
		<h1 class="text-2xl text-primary-900 mb-2 text-center">Lingua Admin</h1>
		<p class="text-sm text-muted mb-6 text-center">Introdueix la contrasenya per accedir</p>

		{#if form?.error}
			<div class="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
				{form.error}
			</div>
		{/if}

		<form method="POST" use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
			};
		}}>
			<label class="block mb-1.5 text-sm font-medium text-base" for="password">Contrasenya</label>
			<input
				id="password"
				name="password"
				type="password"
				required
				autocomplete="current-password"
				class="w-full rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none mb-4"
			/>
			<button
				type="submit"
				class="w-full rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer"
			>
				Entrar
			</button>
		</form>
	</div>
</div>

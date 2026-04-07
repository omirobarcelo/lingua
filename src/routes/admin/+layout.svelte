<script lang="ts">
	import '../../app.css';
	import { page } from '$app/state';
	import { untrack } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import ToastContainer from '$lib/components/admin/ToastContainer.svelte';
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
	import { addToast } from '$lib/stores/adminToast.svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	let lastFormJson = '';
	$effect(() => {
		const form = page.form;
		if (!form) return;
		const json = JSON.stringify(form);
		if (json === lastFormJson) return;
		untrack(() => {
			lastFormJson = json;
			if (form.success) addToast('ok', form.message ?? 'Canvis desats');
			if (form.error && !form.errors) addToast('error', form.error);
		});
	});

	const navItems = [
		{ href: '/admin', label: 'Tauler' },
		{ href: '/admin/categories', label: 'Categories' },
		{ href: '/admin/frases', label: 'Frases' },
		{ href: '/admin/paraules', label: 'Paraules' }
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/admin') return pathname === '/admin';
		return pathname.startsWith(href);
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !data.isAdminAuthenticated}
	{@render children()}
{:else}
	<div class="flex min-h-screen">
		<!-- Sidebar -->
		<aside class="w-56 shrink-0 border-r border-border bg-neutral-100">
			<div class="p-5">
				<a href="/admin" class="text-lg font-bold text-primary-900 no-underline">Lingua Admin</a>
			</div>
			<nav class="space-y-1 px-3">
				{#each navItems as item (item.href)}
					<a
						href={item.href}
						class="block rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors {isActive(
							item.href,
							page.url.pathname
						)
							? 'bg-brand text-white'
							: 'text-neutral-700 hover:bg-neutral-200'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<div class="absolute bottom-0 mt-auto w-56 border-t border-border p-3">
				<a
					href="/"
					class="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-neutral-200 hover:text-base"
				>
					Principi
				</a>
				<form method="POST" action="/admin?/logout">
					<button
						type="submit"
						class="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-muted transition-colors hover:bg-neutral-200 hover:text-base"
					>
						Sortir
					</button>
				</form>
			</div>
		</aside>

		<!-- Content -->
		<main class="flex-1 bg-surface p-8">
			<div class="mx-auto max-w-5xl">
				{@render children()}
			</div>
		</main>
	</div>

	<ToastContainer />
	<ConfirmDialog />
{/if}

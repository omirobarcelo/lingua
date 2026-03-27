<script lang="ts">
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import ToastContainer from '$lib/components/admin/ToastContainer.svelte';
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
	import { addToast } from '$lib/stores/adminToast.svelte';

	let { children, data }: { children: Snippet; data: LayoutData } = $props();

	let lastFormJson = '';
	$effect(() => {
		const form = $page.form;
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
		{ href: '/admin/frases', label: 'Frases' }
	];

	function isActive(href: string, pathname: string): boolean {
		if (href === '/admin') return pathname === '/admin';
		return pathname.startsWith(href);
	}
</script>

{#if !data.isAdminAuthenticated}
	{@render children()}
{:else}
	<div class="flex min-h-screen">
		<!-- Sidebar -->
		<aside class="w-56 shrink-0 bg-neutral-100 border-r border-border">
			<div class="p-5">
				<a href="/admin" class="text-lg font-bold text-primary-900 no-underline">Lingua Admin</a>
			</div>
			<nav class="px-3 space-y-1">
				{#each navItems as item}
					<a
						href={item.href}
						class="block rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors {isActive(item.href, $page.url.pathname)
							? 'bg-brand text-white'
							: 'text-neutral-700 hover:bg-neutral-200'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
			<div class="mt-auto p-3 border-t border-border absolute bottom-0 w-56">
				<form method="POST" action="/admin?/logout">
					<button
						type="submit"
						class="w-full rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-base hover:bg-neutral-200 transition-colors cursor-pointer text-left"
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

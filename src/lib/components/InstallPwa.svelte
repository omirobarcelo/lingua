<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';

	interface BeforeInstallPromptEvent extends Event {
		prompt(): Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	}

	interface NavigatorStandalone extends Navigator {
		standalone?: boolean;
	}

	let deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
	let isIos = $state(false);
	let showIosTooltip = $state(false);
	let isStandalone = $state(false);

	onMount(() => {
		isStandalone =
			window.matchMedia('(display-mode: standalone)').matches ||
			(navigator as NavigatorStandalone).standalone === true;
		isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

		const handler = (e: Event) => {
			e.preventDefault();
			deferredPrompt = e as BeforeInstallPromptEvent;
		};
		window.addEventListener('beforeinstallprompt', handler);

		window.addEventListener('appinstalled', () => {
			deferredPrompt = null;
		});

		return () => window.removeEventListener('beforeinstallprompt', handler);
	});

	async function handleInstall() {
		if (!deferredPrompt) return;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === 'accepted') {
			posthog.capture('pwa_installed');
		}
		deferredPrompt = null;
	}
</script>

{#if !isStandalone && (deferredPrompt || isIos)}
	<div class="mb-8 lg:hidden">
		{#if deferredPrompt}
			<button
				onclick={handleInstall}
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand-light px-5 py-4 font-medium text-primary-800 transition-colors hover:bg-primary-200"
			>
				<svg
					class="h-5 w-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 5v14M5 12l7 7 7-7" />
					<rect x="3" y="19" width="18" height="2" rx="1" />
				</svg>
				Instal&middot;la Lingua al teu dispositiu
			</button>
		{:else if isIos}
			<div class="relative">
				<button
					onclick={() => (showIosTooltip = !showIosTooltip)}
					class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand-light px-5 py-4 font-medium text-primary-800 transition-colors hover:bg-primary-200"
				>
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M12 5v14M5 12l7 7 7-7" />
						<rect x="3" y="19" width="18" height="2" rx="1" />
					</svg>
					Instal&middot;la Lingua al teu dispositiu
				</button>
				{#if showIosTooltip}
					<div class="mt-2 rounded-lg border border-border bg-surface-card p-4 text-sm text-muted shadow-md">
						<p>
							Toca la icona de compartir
							<svg
								class="inline-block h-4 w-4 align-text-bottom"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
								<polyline points="16 6 12 2 8 6" />
								<line x1="12" y1="2" x2="12" y2="15" />
							</svg>
							i despr&eacute;s <strong class="text-base">Afegir a la pantalla d'inici</strong>.
						</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			strategies: 'generateSW',
			registerType: 'autoUpdate',
			manifest: {
				name: 'Lingua – Expressions Catalanes',
				short_name: 'Lingua',
				description: "Diccionari d'expressions i frases fetes catalanes",
				theme_color: '#fb542b',
				background_color: '#fafaf9',
				display: 'standalone',
				start_url: '/',
				icons: [
					{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
					{ src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				],
				screenshots: [
					{ src: '/screenshots/desktop.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide', label: 'Lingua — Pàgina principal (escriptori)' },
					{ src: '/screenshots/mobile.png', sizes: '780x1688', type: 'image/png', form_factor: 'narrow', label: 'Lingua — Pàgina principal (mòbil)' }
				]
			},
			workbox: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,woff2}'],
				navigateFallback: null,
				runtimeCaching: [
					{
						urlPattern: ({ request, url }) => request.mode === 'navigate' && !url.pathname.startsWith('/admin'),
						handler: 'NetworkFirst',
						options: { cacheName: 'pages', networkTimeoutSeconds: 3 }
					}
				]
			}
		})
	]
});

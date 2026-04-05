<script lang="ts">
	const primaryColors = [
		{ name: 'primary-50', hex: '#fff4f0', desc: 'Tint backgrounds' },
		{ name: 'primary-100', hex: '#ffe4d9', desc: 'Hover states on light' },
		{ name: 'primary-200', hex: '#ffc5ad', desc: 'Light accents' },
		{ name: 'primary-300', hex: '#ff9e7a', desc: 'Decorative' },
		{ name: 'primary-400', hex: '#fd7347', desc: 'Active states' },
		{ name: 'primary-500', hex: '#fb542b', desc: 'Legacy brand (pre-a11y)' },
		{ name: 'primary-600', hex: '#e03a12', desc: 'Mid accent' },
		{ name: 'primary-700', hex: '#ba2d0e', desc: 'Brand color (WCAG AA)' },
		{ name: 'primary-800', hex: '#992714', desc: 'Text on light bg' },
		{ name: 'primary-900', hex: '#7e2416', desc: 'Dark headings' }
	];

	const neutralColors = [
		{ name: 'neutral-50', hex: '#fafaf9', desc: 'Page background' },
		{ name: 'neutral-100', hex: '#f4f4f3', desc: 'Card backgrounds' },
		{ name: 'neutral-200', hex: '#e6e6e4', desc: 'Borders' },
		{ name: 'neutral-300', hex: '#d0d0cd', desc: 'Dividers' },
		{ name: 'neutral-400', hex: '#a6a6a2', desc: 'Disabled / placeholder' },
		{ name: 'neutral-500', hex: '#75756f', desc: 'Muted text' },
		{ name: 'neutral-600', hex: '#56564f', desc: 'Secondary text' },
		{ name: 'neutral-700', hex: '#3d3d37', desc: 'Body text' },
		{ name: 'neutral-800', hex: '#272722', desc: 'Primary text' },
		{ name: 'neutral-900', hex: '#141410', desc: 'Headings' }
	];

	const semanticColors = [
		{ name: 'brand', alias: 'primary-700', hex: '#ba2d0e', desc: 'Primary actions, links' },
		{ name: 'brand-hover', alias: 'primary-800', hex: '#992714', desc: 'Hover states' },
		{
			name: 'brand-light',
			alias: 'primary-100',
			hex: '#ffe4d9',
			desc: 'Badge backgrounds, highlights'
		},
		{ name: 'surface', alias: 'neutral-50', hex: '#fafaf9', desc: 'Page background' },
		{ name: 'surface-card', alias: 'white', hex: '#ffffff', desc: 'Card backgrounds' },
		{ name: 'base', alias: 'neutral-800', hex: '#272722', desc: 'Primary text' },
		{ name: 'muted', alias: 'neutral-600', hex: '#56564f', desc: 'Secondary text' },
		{ name: 'border', alias: 'neutral-200', hex: '#e6e6e4', desc: 'Borders, dividers' }
	];

	const sections = [
		{ id: 'colors', label: 'Colors' },
		{ id: 'typography', label: 'Typography' },
		{ id: 'buttons', label: 'Buttons' },
		{ id: 'cards', label: 'Cards' },
		{ id: 'badges', label: 'Badges' },
		{ id: 'forms', label: 'Forms' }
	];
</script>

<svelte:head>
	<title>Design System - Lingua</title>
</svelte:head>

<!-- Hero header -->
<div class="mb-12">
	<p class="mb-3 text-xs font-medium tracking-widest text-brand uppercase">Visual reference</p>
	<h1 class="mb-4 text-4xl text-primary-900 sm:text-5xl">Design System</h1>
	<p class="max-w-2xl text-lg leading-relaxed text-muted">
		Colors, typography, and component guide for Lingua. This page serves as a reference to maintain visual consistency
		across the application.
	</p>
</div>

<!-- Table of contents -->
<nav class="mb-16 flex flex-wrap gap-6 border-b border-border">
	{#each sections as section (section.id)}
		<a
			href="#{section.id}"
			class="-mb-px border-b-2 border-transparent px-1 pb-3 text-sm font-medium text-muted no-underline transition-all hover:border-brand hover:text-brand"
		>
			{section.label}
		</a>
	{/each}
</nav>

<!-- ========== COLORS ========== -->
<section id="colors" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">01</p>
	<h2 class="mb-2 text-3xl text-primary-900">Colors</h2>
	<p class="mb-10 max-w-xl text-muted">
		The application's core palette. Use semantic aliases in components, not raw palette values.
	</p>

	<!-- Primary palette -->
	<h3 class="mb-4 text-xl text-primary-800">Primary — Vermillion / Terracotta</h3>
	<div class="mb-10 grid grid-cols-5 gap-3 sm:grid-cols-10">
		{#each primaryColors as color (color.name)}
			<div class="flex flex-col items-center">
				<div
					class="mb-2 h-16 w-16 rounded-lg border border-neutral-200/50 shadow-sm"
					style="background-color: {color.hex};"
				></div>
				<span class="text-[11px] font-medium text-base">{color.name.replace('primary-', '')}</span>
				<span class="text-[10px] text-muted">{color.hex}</span>
			</div>
		{/each}
	</div>

	<!-- Neutral palette -->
	<h3 class="mb-4 text-xl text-primary-800">Neutral — Warm Zinc</h3>
	<div class="mb-10 grid grid-cols-5 gap-3 sm:grid-cols-10">
		{#each neutralColors as color (color.name)}
			<div class="flex flex-col items-center">
				<div
					class="mb-2 h-16 w-16 rounded-lg border border-neutral-200/50 shadow-sm"
					style="background-color: {color.hex};"
				></div>
				<span class="text-[11px] font-medium text-base">{color.name.replace('neutral-', '')}</span>
				<span class="text-[10px] text-muted">{color.hex}</span>
			</div>
		{/each}
	</div>

	<!-- Semantic aliases -->
	<h3 class="mb-4 text-xl text-primary-800">Semantic aliases</h3>
	<p class="mb-5 text-sm text-muted">
		Use these names in components (e.g. <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-primary-700"
			>bg-brand</code
		>,
		<code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-primary-700">text-muted</code>).
	</p>
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each semanticColors as color (color.name)}
			<div class="flex items-center gap-3 rounded-lg border border-border p-3">
				<div
					class="h-10 w-10 shrink-0 rounded-md border border-neutral-200/50 shadow-sm"
					style="background-color: {color.hex};"
				></div>
				<div class="min-w-0">
					<p class="truncate text-sm font-medium text-base">{color.name}</p>
					<p class="text-[11px] text-muted">{color.alias} · {color.hex}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- ========== TYPOGRAPHY ========== -->
<section id="typography" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">02</p>
	<h2 class="mb-2 text-3xl text-primary-900">Typography</h2>
	<p class="mb-10 max-w-xl text-muted">
		Two families: <strong class="text-base">Lora</strong> (serif) for headings and
		<strong class="text-base">Inter</strong> (sans-serif) for body text and UI.
	</p>

	<div class="space-y-8">
		<!-- Heading scale -->
		<div class="rounded-xl border border-border bg-surface-card p-8">
			<h4 class="mb-6 text-xs font-medium tracking-widest text-muted uppercase">Heading scale — font-serif (Lora)</h4>
			<div class="space-y-6">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-4xl</span>
					<p class="font-serif text-4xl text-primary-900">The art of words</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-3xl</span>
					<p class="font-serif text-3xl text-primary-900">Catalan expressions</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-2xl</span>
					<p class="font-serif text-2xl text-primary-900">Word search</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-xl</span>
					<p class="font-serif text-xl text-primary-800">Related expressions</p>
				</div>
			</div>
		</div>

		<!-- Body scale -->
		<div class="rounded-xl border border-border bg-surface-card p-8">
			<h4 class="mb-6 text-xs font-medium tracking-widest text-muted uppercase">Body scale — font-sans (Inter)</h4>
			<div class="space-y-6">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-lg</span>
					<p class="text-lg text-base">Welcome to Lingua, your Catalan expression dictionary.</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-base</span>
					<p class="text-base">This platform offers two ways to explore the rich Catalan linguistic heritage.</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-sm</span>
					<p class="text-sm text-muted">Category: Love &amp; Feelings · 5 expressions</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-xs</span>
					<p class="text-xs tracking-widest text-muted uppercase">Visual reference</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ========== BUTTONS ========== -->
<section id="buttons" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">03</p>
	<h2 class="mb-2 text-3xl text-primary-900">Buttons</h2>
	<p class="mb-10 max-w-xl text-muted">
		Three variants: primary, secondary, and ghost. All with color transitions and pointer cursor.
	</p>

	<div class="rounded-xl border border-border bg-surface-card p-8">
		<div class="mb-8 flex flex-wrap items-center gap-4">
			<button
				class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Primary
			</button>
			<button
				class="cursor-pointer rounded-lg border-2 border-brand bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-brand-light"
			>
				Secondary
			</button>
			<button
				class="cursor-pointer rounded-lg bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-neutral-100"
			>
				Ghost
			</button>
		</div>

		<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Sizes</h4>
		<div class="mb-8 flex flex-wrap items-center gap-4">
			<button
				class="cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Small
			</button>
			<button
				class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Default
			</button>
			<button
				class="cursor-pointer rounded-lg bg-brand px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Large
			</button>
		</div>

		<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">States</h4>
		<div class="flex flex-wrap items-center gap-4">
			<button class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white"> Default </button>
			<button class="cursor-pointer rounded-lg bg-brand-hover px-6 py-3 font-medium text-white"> Hover </button>
			<button class="cursor-not-allowed rounded-lg bg-neutral-300 px-6 py-3 font-medium text-neutral-500" disabled>
				Disabled
			</button>
		</div>
	</div>
</section>

<!-- ========== CARDS ========== -->
<section id="cards" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">04</p>
	<h2 class="mb-2 text-3xl text-primary-900">Cards</h2>
	<p class="mb-10 max-w-xl text-muted">
		Content cards and interactive (link) cards. Interactive cards have a hover effect with shadow and vertical shift.
	</p>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Static card -->
		<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
			<h3 class="mb-2 text-lg font-semibold text-primary-800">Static card</h3>
			<p class="text-sm leading-relaxed text-muted">
				A standard content card. White background, subtle border, light shadow, and rounded corners.
			</p>
		</div>

		<!-- Interactive card -->
		<a
			href="#cards"
			class="group rounded-xl border border-border bg-surface-card p-6 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
		>
			<h3 class="mb-2 text-lg font-semibold text-primary-800 transition-colors group-hover:text-brand">
				Interactive card
			</h3>
			<p class="text-sm leading-relaxed text-muted">
				A link card with hover effect: larger shadow, upward shift, and title color change.
			</p>
		</a>

		<!-- Card with badge -->
		<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
			<span class="mb-3 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Weather</span
			>
			<h3 class="mb-2 text-lg font-semibold text-primary-800">With badge</h3>
			<p class="text-sm leading-relaxed text-muted">A card combined with a category badge for quick visual context.</p>
		</div>
	</div>
</section>

<!-- ========== BADGES ========== -->
<section id="badges" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">05</p>
	<h2 class="mb-2 text-3xl text-primary-900">Badges</h2>
	<p class="mb-10 max-w-xl text-muted">Lightweight pills for categories, labels, and metadata.</p>

	<div class="rounded-xl border border-border bg-surface-card p-8">
		<div class="flex flex-wrap items-center gap-3">
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Love &amp; Feelings</span
			>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Animals</span
			>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Food &amp; Drink</span
			>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Weather</span
			>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Body &amp; Health</span
			>
		</div>

		<div class="mt-6 border-t border-border pt-6">
			<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Variants</h4>
			<div class="flex flex-wrap items-center gap-3">
				<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
					>Default</span
				>
				<span class="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
					>Neutral</span
				>
				<span class="inline-block rounded-full border border-brand px-3 py-1 text-xs font-medium text-brand"
					>Outline</span
				>
			</div>
		</div>
	</div>
</section>

<!-- ========== FORMS ========== -->
<section id="forms" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">06</p>
	<h2 class="mb-2 text-3xl text-primary-900">Forms</h2>
	<p class="mb-10 max-w-xl text-muted">
		Input fields with brand focus ring. The search input combines a text field and button inline.
	</p>

	<div class="space-y-8 rounded-xl border border-border bg-surface-card p-8">
		<!-- Text input -->
		<div>
			<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Text input</h4>
			<label class="mb-1.5 block text-sm font-medium text-base" for="ds-input-1">Word</label>
			<input
				id="ds-input-1"
				type="text"
				placeholder="Enter a word..."
				class="w-full max-w-md rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
			/>
		</div>

		<!-- Search input (combined) -->
		<div>
			<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Search input (input + button)</h4>
			<div class="flex max-w-lg gap-3">
				<input
					type="text"
					placeholder="Search expressions..."
					class="flex-1 rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
				/>
				<button
					class="shrink-0 cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
				>
					Search
				</button>
			</div>
		</div>

		<!-- Focus state demo -->
		<div>
			<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Focus state</h4>
			<p class="mb-3 text-sm text-muted">Click the fields to see the brand focus ring.</p>
			<div class="flex max-w-md flex-col gap-3">
				<input
					type="text"
					placeholder="Normal state"
					class="rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Disabled"
					disabled
					class="cursor-not-allowed rounded-lg border-2 border-border bg-neutral-100 px-4 py-3 text-base text-neutral-400"
				/>
			</div>
		</div>
	</div>
</section>

<footer class="border-t border-border pt-8 pb-4 text-center text-sm text-muted">
	Lingua Design System · Last updated: April 2026
</footer>

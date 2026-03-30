<script lang="ts">
	const primaryColors = [
		{ name: 'primary-50', hex: '#fff4f0', desc: 'Tint backgrounds' },
		{ name: 'primary-100', hex: '#ffe4d9', desc: 'Hover states on light' },
		{ name: 'primary-200', hex: '#ffc5ad', desc: 'Light accents' },
		{ name: 'primary-300', hex: '#ff9e7a', desc: 'Decorative' },
		{ name: 'primary-400', hex: '#fd7347', desc: 'Active states' },
		{ name: 'primary-500', hex: '#fb542b', desc: 'Base brand color' },
		{ name: 'primary-600', hex: '#e03a12', desc: 'Hover on brand' },
		{ name: 'primary-700', hex: '#ba2d0e', desc: 'Active / pressed' },
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
		{ name: 'brand', alias: 'primary-500', hex: '#fb542b', desc: 'Primary actions, links' },
		{ name: 'brand-hover', alias: 'primary-600', hex: '#e03a12', desc: 'Hover states' },
		{ name: 'brand-light', alias: 'primary-100', hex: '#ffe4d9', desc: 'Badge backgrounds, highlights' },
		{ name: 'surface', alias: 'neutral-50', hex: '#fafaf9', desc: 'Page background' },
		{ name: 'surface-card', alias: 'white', hex: '#ffffff', desc: 'Card backgrounds' },
		{ name: 'base', alias: 'neutral-800', hex: '#272722', desc: 'Primary text' },
		{ name: 'muted', alias: 'neutral-500', hex: '#75756f', desc: 'Secondary text' },
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
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-3">Visual reference</p>
	<h1 class="text-4xl sm:text-5xl text-primary-900 mb-4">Design System</h1>
	<p class="text-lg text-muted max-w-2xl leading-relaxed">
		Colors, typography, and component guide for Lingua. This page serves as a reference
		to maintain visual consistency across the application.
	</p>
</div>

<!-- Table of contents -->
<nav class="mb-16 flex flex-wrap gap-6 border-b border-border">
	{#each sections as section}
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
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">01</p>
	<h2 class="text-3xl text-primary-900 mb-2">Colors</h2>
	<p class="text-muted mb-10 max-w-xl">The application's core palette. Use semantic aliases in components, not raw palette values.</p>

	<!-- Primary palette -->
	<h3 class="text-xl text-primary-800 mb-4">Primary — Vermillion / Terracotta</h3>
	<div class="grid grid-cols-5 gap-3 mb-10 sm:grid-cols-10">
		{#each primaryColors as color}
			<div class="flex flex-col items-center">
				<div
					class="mb-2 h-16 w-16 rounded-lg shadow-sm border border-neutral-200/50"
					style="background-color: {color.hex};"
				></div>
				<span class="text-[11px] font-medium text-base">{color.name.replace('primary-', '')}</span>
				<span class="text-[10px] text-muted">{color.hex}</span>
			</div>
		{/each}
	</div>

	<!-- Neutral palette -->
	<h3 class="text-xl text-primary-800 mb-4">Neutral — Warm Zinc</h3>
	<div class="grid grid-cols-5 gap-3 mb-10 sm:grid-cols-10">
		{#each neutralColors as color}
			<div class="flex flex-col items-center">
				<div
					class="mb-2 h-16 w-16 rounded-lg shadow-sm border border-neutral-200/50"
					style="background-color: {color.hex};"
				></div>
				<span class="text-[11px] font-medium text-base">{color.name.replace('neutral-', '')}</span>
				<span class="text-[10px] text-muted">{color.hex}</span>
			</div>
		{/each}
	</div>

	<!-- Semantic aliases -->
	<h3 class="text-xl text-primary-800 mb-4">Semantic aliases</h3>
	<p class="text-sm text-muted mb-5">Use these names in components (e.g. <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-primary-700">bg-brand</code>, <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-primary-700">text-muted</code>).</p>
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each semanticColors as color}
			<div class="flex items-center gap-3 rounded-lg border border-border p-3">
				<div
					class="h-10 w-10 shrink-0 rounded-md shadow-sm border border-neutral-200/50"
					style="background-color: {color.hex};"
				></div>
				<div class="min-w-0">
					<p class="text-sm font-medium text-base truncate">{color.name}</p>
					<p class="text-[11px] text-muted">{color.alias} · {color.hex}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- ========== TYPOGRAPHY ========== -->
<section id="typography" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">02</p>
	<h2 class="text-3xl text-primary-900 mb-2">Typography</h2>
	<p class="text-muted mb-10 max-w-xl">Two families: <strong class="text-base">Lora</strong> (serif) for headings and <strong class="text-base">Inter</strong> (sans-serif) for body text and UI.</p>

	<div class="space-y-8">
		<!-- Heading scale -->
		<div class="rounded-xl border border-border bg-surface-card p-8">
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-6">Heading scale — font-serif (Lora)</h4>
			<div class="space-y-6">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-4xl</span>
					<p class="font-serif text-4xl text-primary-900">The art of words</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-3xl</span>
					<p class="font-serif text-3xl text-primary-900">Catalan expressions</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-2xl</span>
					<p class="font-serif text-2xl text-primary-900">Word search</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-xl</span>
					<p class="font-serif text-xl text-primary-800">Related expressions</p>
				</div>
			</div>
		</div>

		<!-- Body scale -->
		<div class="rounded-xl border border-border bg-surface-card p-8">
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-6">Body scale — font-sans (Inter)</h4>
			<div class="space-y-6">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-lg</span>
					<p class="text-lg text-base">Welcome to Lingua, your Catalan expression dictionary.</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-base</span>
					<p class="text-base text-base">This platform offers two ways to explore the rich Catalan linguistic heritage.</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-sm</span>
					<p class="text-sm text-muted">Category: Love &amp; Feelings · 5 expressions</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-xs</span>
					<p class="text-xs text-muted uppercase tracking-widest">Visual reference</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ========== BUTTONS ========== -->
<section id="buttons" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">03</p>
	<h2 class="text-3xl text-primary-900 mb-2">Buttons</h2>
	<p class="text-muted mb-10 max-w-xl">Three variants: primary, secondary, and ghost. All with color transitions and pointer cursor.</p>

	<div class="rounded-xl border border-border bg-surface-card p-8">
		<div class="flex flex-wrap items-center gap-4 mb-8">
			<button class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer">
				Primary
			</button>
			<button class="rounded-lg border-2 border-brand bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-brand-light cursor-pointer">
				Secondary
			</button>
			<button class="rounded-lg bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-neutral-100 cursor-pointer">
				Ghost
			</button>
		</div>

		<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Sizes</h4>
		<div class="flex flex-wrap items-center gap-4 mb-8">
			<button class="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer">
				Small
			</button>
			<button class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer">
				Default
			</button>
			<button class="rounded-lg bg-brand px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer">
				Large
			</button>
		</div>

		<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">States</h4>
		<div class="flex flex-wrap items-center gap-4">
			<button class="rounded-lg bg-brand px-6 py-3 font-medium text-white cursor-pointer">
				Default
			</button>
			<button class="rounded-lg bg-brand-hover px-6 py-3 font-medium text-white cursor-pointer">
				Hover
			</button>
			<button class="rounded-lg bg-neutral-300 px-6 py-3 font-medium text-neutral-500 cursor-not-allowed" disabled>
				Disabled
			</button>
		</div>
	</div>
</section>

<!-- ========== CARDS ========== -->
<section id="cards" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">04</p>
	<h2 class="text-3xl text-primary-900 mb-2">Cards</h2>
	<p class="text-muted mb-10 max-w-xl">Content cards and interactive (link) cards. Interactive cards have a hover effect with shadow and vertical shift.</p>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Static card -->
		<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
			<h3 class="text-lg font-semibold text-primary-800 mb-2">Static card</h3>
			<p class="text-sm text-muted leading-relaxed">
				A standard content card. White background, subtle border, light shadow, and rounded corners.
			</p>
		</div>

		<!-- Interactive card -->
		<a
			href="#cards"
			class="group rounded-xl bg-surface-card border border-border p-6 shadow-sm no-underline transition-all hover:shadow-md hover:-translate-y-0.5"
		>
			<h3 class="text-lg font-semibold text-primary-800 group-hover:text-brand transition-colors mb-2">Interactive card</h3>
			<p class="text-sm text-muted leading-relaxed">
				A link card with hover effect: larger shadow, upward shift, and title color change.
			</p>
		</a>

		<!-- Card with badge -->
		<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800 mb-3">Weather</span>
			<h3 class="text-lg font-semibold text-primary-800 mb-2">With badge</h3>
			<p class="text-sm text-muted leading-relaxed">
				A card combined with a category badge for quick visual context.
			</p>
		</div>
	</div>
</section>

<!-- ========== BADGES ========== -->
<section id="badges" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">05</p>
	<h2 class="text-3xl text-primary-900 mb-2">Badges</h2>
	<p class="text-muted mb-10 max-w-xl">Lightweight pills for categories, labels, and metadata.</p>

	<div class="rounded-xl border border-border bg-surface-card p-8">
		<div class="flex flex-wrap items-center gap-3">
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Love &amp; Feelings</span>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Animals</span>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Food &amp; Drink</span>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Weather</span>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Body &amp; Health</span>
		</div>

		<div class="mt-6 border-t border-border pt-6">
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Variants</h4>
			<div class="flex flex-wrap items-center gap-3">
				<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Default</span>
				<span class="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">Neutral</span>
				<span class="inline-block rounded-full border border-brand px-3 py-1 text-xs font-medium text-brand">Outline</span>
			</div>
		</div>
	</div>
</section>

<!-- ========== FORMS ========== -->
<section id="forms" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">06</p>
	<h2 class="text-3xl text-primary-900 mb-2">Forms</h2>
	<p class="text-muted mb-10 max-w-xl">Input fields with brand focus ring. The search input combines a text field and button inline.</p>

	<div class="rounded-xl border border-border bg-surface-card p-8 space-y-8">
		<!-- Text input -->
		<div>
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Text input</h4>
			<label class="block mb-1.5 text-sm font-medium text-base" for="ds-input-1">Word</label>
			<input
				id="ds-input-1"
				type="text"
				placeholder="Enter a word..."
				class="w-full max-w-md rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
			/>
		</div>

		<!-- Search input (combined) -->
		<div>
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Search input (input + button)</h4>
			<div class="flex gap-3 max-w-lg">
				<input
					type="text"
					placeholder="Search expressions..."
					class="flex-1 rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
				/>
				<button class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer shrink-0">
					Search
				</button>
			</div>
		</div>

		<!-- Focus state demo -->
		<div>
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Focus state</h4>
			<p class="text-sm text-muted mb-3">Click the fields to see the brand focus ring.</p>
			<div class="flex flex-col gap-3 max-w-md">
				<input
					type="text"
					placeholder="Normal state"
					class="rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Disabled"
					disabled
					class="rounded-lg border-2 border-border px-4 py-3 text-base bg-neutral-100 text-neutral-400 cursor-not-allowed"
				/>
			</div>
		</div>
	</div>
</section>

<footer class="border-t border-border pt-8 pb-4 text-center text-sm text-muted">
	Lingua Design System · Last updated: March 2026
</footer>

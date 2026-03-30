<script lang="ts">
	const primaryColors = [
		{ name: 'primary-50', hex: '#fff4f0', desc: 'Fons tintats' },
		{ name: 'primary-100', hex: '#ffe4d9', desc: 'Estats hover clars' },
		{ name: 'primary-200', hex: '#ffc5ad', desc: 'Accents clars' },
		{ name: 'primary-300', hex: '#ff9e7a', desc: 'Decoratiu' },
		{ name: 'primary-400', hex: '#fd7347', desc: 'Estats actius' },
		{ name: 'primary-500', hex: '#fb542b', desc: 'Color de marca base' },
		{ name: 'primary-600', hex: '#e03a12', desc: 'Hover sobre marca' },
		{ name: 'primary-700', hex: '#ba2d0e', desc: 'Actiu / premut' },
		{ name: 'primary-800', hex: '#992714', desc: 'Text sobre fons clar' },
		{ name: 'primary-900', hex: '#7e2416', desc: 'Títols foscos' }
	];

	const neutralColors = [
		{ name: 'neutral-50', hex: '#fafaf9', desc: 'Fons de pàgina' },
		{ name: 'neutral-100', hex: '#f4f4f3', desc: 'Fons de targetes' },
		{ name: 'neutral-200', hex: '#e6e6e4', desc: 'Vores' },
		{ name: 'neutral-300', hex: '#d0d0cd', desc: 'Divisors' },
		{ name: 'neutral-400', hex: '#a6a6a2', desc: 'Desactivat / placeholder' },
		{ name: 'neutral-500', hex: '#75756f', desc: 'Text atenuat' },
		{ name: 'neutral-600', hex: '#56564f', desc: 'Text secundari' },
		{ name: 'neutral-700', hex: '#3d3d37', desc: 'Text de cos' },
		{ name: 'neutral-800', hex: '#272722', desc: 'Text principal' },
		{ name: 'neutral-900', hex: '#141410', desc: 'Títols' }
	];

	const semanticColors = [
		{ name: 'brand', alias: 'primary-500', hex: '#fb542b', desc: 'Accions primàries, enllaços' },
		{ name: 'brand-hover', alias: 'primary-600', hex: '#e03a12', desc: 'Estats hover' },
		{ name: 'brand-light', alias: 'primary-100', hex: '#ffe4d9', desc: 'Fons d\'insígnies, ressaltats' },
		{ name: 'surface', alias: 'neutral-50', hex: '#fafaf9', desc: 'Fons de pàgina' },
		{ name: 'surface-card', alias: 'white', hex: '#ffffff', desc: 'Fons de targetes' },
		{ name: 'base', alias: 'neutral-800', hex: '#272722', desc: 'Text principal' },
		{ name: 'muted', alias: 'neutral-500', hex: '#75756f', desc: 'Text secundari' },
		{ name: 'border', alias: 'neutral-200', hex: '#e6e6e4', desc: 'Vores, divisors' }
	];

	const sections = [
		{ id: 'colors', label: 'Colors' },
		{ id: 'typography', label: 'Tipografia' },
		{ id: 'buttons', label: 'Botons' },
		{ id: 'cards', label: 'Targetes' },
		{ id: 'badges', label: 'Insígnies' },
		{ id: 'forms', label: 'Formularis' }
	];
</script>

<svelte:head>
	<title>Sistema de Disseny - Lingua</title>
</svelte:head>

<!-- Hero header -->
<div class="mb-12">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-3">Referència visual</p>
	<h1 class="text-4xl sm:text-5xl text-primary-900 mb-4">Sistema de Disseny</h1>
	<p class="text-lg text-muted max-w-2xl leading-relaxed">
		Guia de colors, tipografia i components de Lingua. Aquesta pàgina serveix com a referència
		per mantenir la coherència visual de l'aplicació.
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
	<p class="text-muted mb-10 max-w-xl">Paleta principal de l'aplicació. Utilitzeu els alias semàntics als components, no els colors crus de la paleta.</p>

	<!-- Primary palette -->
	<h3 class="text-xl text-primary-800 mb-4">Primari — Vermell / Terracota</h3>
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
	<h3 class="text-xl text-primary-800 mb-4">Neutre — Zinc càlid</h3>
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
	<h3 class="text-xl text-primary-800 mb-4">Alias semàntics</h3>
	<p class="text-sm text-muted mb-5">Utilitzeu aquests noms als components (p. ex. <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-primary-700">bg-brand</code>, <code class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-primary-700">text-muted</code>).</p>
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
	<h2 class="text-3xl text-primary-900 mb-2">Tipografia</h2>
	<p class="text-muted mb-10 max-w-xl">Dues famílies: <strong class="text-base">Lora</strong> (serif) per a títols i <strong class="text-base">Inter</strong> (sans-serif) per a text de cos i UI.</p>

	<div class="space-y-8">
		<!-- Heading scale -->
		<div class="rounded-xl border border-border bg-surface-card p-8">
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-6">Escala de títols — font-serif (Lora)</h4>
			<div class="space-y-6">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-4xl</span>
					<p class="font-serif text-4xl text-primary-900">L'art de les paraules</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-3xl</span>
					<p class="font-serif text-3xl text-primary-900">Expressions catalanes</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-2xl</span>
					<p class="font-serif text-2xl text-primary-900">Cerca de paraules</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-xl</span>
					<p class="font-serif text-xl text-primary-800">Expressions relacionades</p>
				</div>
			</div>
		</div>

		<!-- Body scale -->
		<div class="rounded-xl border border-border bg-surface-card p-8">
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-6">Escala de cos — font-sans (Inter)</h4>
			<div class="space-y-6">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-lg</span>
					<p class="text-lg text-base">Benvingut a Lingua, el teu diccionari d'expressions catalanes.</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-base</span>
					<p class="text-base text-base">Aquesta plataforma t'ofereix dues maneres d'explorar el ric patrimoni lingüístic català.</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-sm</span>
					<p class="text-sm text-muted">Categoria: Amor i Sentiments · 5 expressions</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="shrink-0 text-xs font-mono text-muted w-24">text-xs</span>
					<p class="text-xs text-muted uppercase tracking-widest">Referència visual</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ========== BUTTONS ========== -->
<section id="buttons" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">03</p>
	<h2 class="text-3xl text-primary-900 mb-2">Botons</h2>
	<p class="text-muted mb-10 max-w-xl">Tres variants: primari, secundari i fantasma. Tots amb transició de color i cursor pointer.</p>

	<div class="rounded-xl border border-border bg-surface-card p-8">
		<div class="flex flex-wrap items-center gap-4 mb-8">
			<button class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer">
				Primari
			</button>
			<button class="rounded-lg border-2 border-brand bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-brand-light cursor-pointer">
				Secundari
			</button>
			<button class="rounded-lg bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-neutral-100 cursor-pointer">
				Fantasma
			</button>
		</div>

		<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Mides</h4>
		<div class="flex flex-wrap items-center gap-4 mb-8">
			<button class="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer">
				Petit
			</button>
			<button class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer">
				Normal
			</button>
			<button class="rounded-lg bg-brand px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer">
				Gran
			</button>
		</div>

		<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Estats</h4>
		<div class="flex flex-wrap items-center gap-4">
			<button class="rounded-lg bg-brand px-6 py-3 font-medium text-white cursor-pointer">
				Normal
			</button>
			<button class="rounded-lg bg-brand-hover px-6 py-3 font-medium text-white cursor-pointer">
				Hover
			</button>
			<button class="rounded-lg bg-neutral-300 px-6 py-3 font-medium text-neutral-500 cursor-not-allowed" disabled>
				Desactivat
			</button>
		</div>
	</div>
</section>

<!-- ========== CARDS ========== -->
<section id="cards" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">04</p>
	<h2 class="text-3xl text-primary-900 mb-2">Targetes</h2>
	<p class="text-muted mb-10 max-w-xl">Targetes de contingut i targetes interactives (enllaç). Les interactives tenen efecte hover amb ombra i desplaçament vertical.</p>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Static card -->
		<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
			<h3 class="text-lg font-semibold text-primary-800 mb-2">Targeta estàtica</h3>
			<p class="text-sm text-muted leading-relaxed">
				Aquesta és una targeta de contingut estàndard. Fons blanc, vora subtil, ombra lleu i cantonades arrodonides.
			</p>
		</div>

		<!-- Interactive card -->
		<a
			href="#cards"
			class="group rounded-xl bg-surface-card border border-border p-6 shadow-sm no-underline transition-all hover:shadow-md hover:-translate-y-0.5"
		>
			<h3 class="text-lg font-semibold text-primary-800 group-hover:text-brand transition-colors mb-2">Targeta interactiva</h3>
			<p class="text-sm text-muted leading-relaxed">
				Enllaç amb efecte hover: ombra més gran, desplaçament cap amunt, i canvi de color del títol.
			</p>
		</a>

		<!-- Card with badge -->
		<div class="rounded-xl bg-surface-card border border-border p-6 shadow-sm">
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800 mb-3">Meteorologia</span>
			<h3 class="text-lg font-semibold text-primary-800 mb-2">Amb insígnia</h3>
			<p class="text-sm text-muted leading-relaxed">
				Targeta combinada amb una insígnia de categoria per donar context visual ràpid.
			</p>
		</div>
	</div>
</section>

<!-- ========== BADGES ========== -->
<section id="badges" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">05</p>
	<h2 class="text-3xl text-primary-900 mb-2">Insígnies</h2>
	<p class="text-muted mb-10 max-w-xl">Píndoles lleugeres per a categories, etiquetes i metadata.</p>

	<div class="rounded-xl border border-border bg-surface-card p-8">
		<div class="flex flex-wrap items-center gap-3">
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Amor i Sentiments</span>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Animals</span>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Menjar i Beguda</span>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Meteorologia</span>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Cos i Salut</span>
		</div>

		<div class="mt-6 border-t border-border pt-6">
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Variants</h4>
			<div class="flex flex-wrap items-center gap-3">
				<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800">Per defecte</span>
				<span class="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">Neutra</span>
				<span class="inline-block rounded-full border border-brand px-3 py-1 text-xs font-medium text-brand">Contorn</span>
			</div>
		</div>
	</div>
</section>

<!-- ========== FORMS ========== -->
<section id="forms" class="mb-20 scroll-mt-8">
	<p class="text-xs font-medium uppercase tracking-widest text-brand mb-2">06</p>
	<h2 class="text-3xl text-primary-900 mb-2">Formularis</h2>
	<p class="text-muted mb-10 max-w-xl">Camps d'entrada amb focus ring de marca. El cercador combina input i botó en línia.</p>

	<div class="rounded-xl border border-border bg-surface-card p-8 space-y-8">
		<!-- Text input -->
		<div>
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Camp de text</h4>
			<label class="block mb-1.5 text-sm font-medium text-base" for="ds-input-1">Paraula</label>
			<input
				id="ds-input-1"
				type="text"
				placeholder="Introdueix una paraula..."
				class="w-full max-w-md rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
			/>
		</div>

		<!-- Search input (combined) -->
		<div>
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Cercador (input + botó)</h4>
			<div class="flex gap-3 max-w-lg">
				<input
					type="text"
					placeholder="Cerca expressions..."
					class="flex-1 rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
				/>
				<button class="rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover cursor-pointer shrink-0">
					Cercar
				</button>
			</div>
		</div>

		<!-- Focus state demo -->
		<div>
			<h4 class="text-xs font-medium uppercase tracking-widest text-muted mb-4">Estat de focus</h4>
			<p class="text-sm text-muted mb-3">Feu clic als camps per veure l'anell de focus de marca.</p>
			<div class="flex flex-col gap-3 max-w-md">
				<input
					type="text"
					placeholder="Estat normal"
					class="rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Desactivat"
					disabled
					class="rounded-lg border-2 border-border px-4 py-3 text-base bg-neutral-100 text-neutral-400 cursor-not-allowed"
				/>
			</div>
		</div>
	</div>
</section>

<footer class="border-t border-border pt-8 pb-4 text-center text-sm text-muted">
	Lingua — Sistema de Disseny · Última actualització: Març 2026
</footer>

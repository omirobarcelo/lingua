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
		{
			name: 'brand-light',
			alias: 'primary-100',
			hex: '#ffe4d9',
			desc: "Fons d'insígnies, ressaltats"
		},
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
	<p class="mb-3 text-xs font-medium tracking-widest text-brand uppercase">Referència visual</p>
	<h1 class="mb-4 text-4xl text-primary-900 sm:text-5xl">Sistema de Disseny</h1>
	<p class="max-w-2xl text-lg leading-relaxed text-muted">
		Guia de colors, tipografia i components de Lingua. Aquesta pàgina serveix com a referència per mantenir la
		coherència visual de l'aplicació.
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
		Paleta principal de l'aplicació. Utilitzeu els alias semàntics als components, no els colors crus de la paleta.
	</p>

	<!-- Primary palette -->
	<h3 class="mb-4 text-xl text-primary-800">Primari — Vermell / Terracota</h3>
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
	<h3 class="mb-4 text-xl text-primary-800">Neutre — Zinc càlid</h3>
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
	<h3 class="mb-4 text-xl text-primary-800">Alias semàntics</h3>
	<p class="mb-5 text-sm text-muted">
		Utilitzeu aquests noms als components (p. ex. <code
			class="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-primary-700">bg-brand</code
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
	<h2 class="mb-2 text-3xl text-primary-900">Tipografia</h2>
	<p class="mb-10 max-w-xl text-muted">
		Dues famílies: <strong class="text-base">Lora</strong> (serif) per a títols i
		<strong class="text-base">Inter</strong> (sans-serif) per a text de cos i UI.
	</p>

	<div class="space-y-8">
		<!-- Heading scale -->
		<div class="rounded-xl border border-border bg-surface-card p-8">
			<h4 class="mb-6 text-xs font-medium tracking-widest text-muted uppercase">
				Escala de títols — font-serif (Lora)
			</h4>
			<div class="space-y-6">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-4xl</span>
					<p class="font-serif text-4xl text-primary-900">L'art de les paraules</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-3xl</span>
					<p class="font-serif text-3xl text-primary-900">Expressions catalanes</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-2xl</span>
					<p class="font-serif text-2xl text-primary-900">Cerca de paraules</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-xl</span>
					<p class="font-serif text-xl text-primary-800">Expressions relacionades</p>
				</div>
			</div>
		</div>

		<!-- Body scale -->
		<div class="rounded-xl border border-border bg-surface-card p-8">
			<h4 class="mb-6 text-xs font-medium tracking-widest text-muted uppercase">Escala de cos — font-sans (Inter)</h4>
			<div class="space-y-6">
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-lg</span>
					<p class="text-lg text-base">Benvingut a Lingua, el teu diccionari d'expressions catalanes.</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-base</span>
					<p class="text-base">
						Aquesta plataforma t'ofereix dues maneres d'explorar el ric patrimoni lingüístic català.
					</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-sm</span>
					<p class="text-sm text-muted">Categoria: Amor i Sentiments · 5 expressions</p>
				</div>
				<div class="border-t border-border"></div>
				<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
					<span class="w-24 shrink-0 font-mono text-xs text-muted">text-xs</span>
					<p class="text-xs tracking-widest text-muted uppercase">Referència visual</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ========== BUTTONS ========== -->
<section id="buttons" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">03</p>
	<h2 class="mb-2 text-3xl text-primary-900">Botons</h2>
	<p class="mb-10 max-w-xl text-muted">
		Tres variants: primari, secundari i fantasma. Tots amb transició de color i cursor pointer.
	</p>

	<div class="rounded-xl border border-border bg-surface-card p-8">
		<div class="mb-8 flex flex-wrap items-center gap-4">
			<button
				class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Primari
			</button>
			<button
				class="cursor-pointer rounded-lg border-2 border-brand bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-brand-light"
			>
				Secundari
			</button>
			<button
				class="cursor-pointer rounded-lg bg-transparent px-6 py-3 font-medium text-brand transition-colors hover:bg-neutral-100"
			>
				Fantasma
			</button>
		</div>

		<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Mides</h4>
		<div class="mb-8 flex flex-wrap items-center gap-4">
			<button
				class="cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Petit
			</button>
			<button
				class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Normal
			</button>
			<button
				class="cursor-pointer rounded-lg bg-brand px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-brand-hover"
			>
				Gran
			</button>
		</div>

		<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Estats</h4>
		<div class="flex flex-wrap items-center gap-4">
			<button class="cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white"> Normal </button>
			<button class="cursor-pointer rounded-lg bg-brand-hover px-6 py-3 font-medium text-white"> Hover </button>
			<button class="cursor-not-allowed rounded-lg bg-neutral-300 px-6 py-3 font-medium text-neutral-500" disabled>
				Desactivat
			</button>
		</div>
	</div>
</section>

<!-- ========== CARDS ========== -->
<section id="cards" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">04</p>
	<h2 class="mb-2 text-3xl text-primary-900">Targetes</h2>
	<p class="mb-10 max-w-xl text-muted">
		Targetes de contingut i targetes interactives (enllaç). Les interactives tenen efecte hover amb ombra i desplaçament
		vertical.
	</p>

	<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
		<!-- Static card -->
		<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
			<h3 class="mb-2 text-lg font-semibold text-primary-800">Targeta estàtica</h3>
			<p class="text-sm leading-relaxed text-muted">
				Aquesta és una targeta de contingut estàndard. Fons blanc, vora subtil, ombra lleu i cantonades arrodonides.
			</p>
		</div>

		<!-- Interactive card -->
		<a
			href="#cards"
			class="group rounded-xl border border-border bg-surface-card p-6 no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
		>
			<h3 class="mb-2 text-lg font-semibold text-primary-800 transition-colors group-hover:text-brand">
				Targeta interactiva
			</h3>
			<p class="text-sm leading-relaxed text-muted">
				Enllaç amb efecte hover: ombra més gran, desplaçament cap amunt, i canvi de color del títol.
			</p>
		</a>

		<!-- Card with badge -->
		<div class="rounded-xl border border-border bg-surface-card p-6 shadow-sm">
			<span class="mb-3 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Meteorologia</span
			>
			<h3 class="mb-2 text-lg font-semibold text-primary-800">Amb insígnia</h3>
			<p class="text-sm leading-relaxed text-muted">
				Targeta combinada amb una insígnia de categoria per donar context visual ràpid.
			</p>
		</div>
	</div>
</section>

<!-- ========== BADGES ========== -->
<section id="badges" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">05</p>
	<h2 class="mb-2 text-3xl text-primary-900">Insígnies</h2>
	<p class="mb-10 max-w-xl text-muted">Píndoles lleugeres per a categories, etiquetes i metadata.</p>

	<div class="rounded-xl border border-border bg-surface-card p-8">
		<div class="flex flex-wrap items-center gap-3">
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Amor i Sentiments</span
			>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Animals</span
			>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Menjar i Beguda</span
			>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Meteorologia</span
			>
			<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
				>Cos i Salut</span
			>
		</div>

		<div class="mt-6 border-t border-border pt-6">
			<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Variants</h4>
			<div class="flex flex-wrap items-center gap-3">
				<span class="inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-primary-800"
					>Per defecte</span
				>
				<span class="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700"
					>Neutra</span
				>
				<span class="inline-block rounded-full border border-brand px-3 py-1 text-xs font-medium text-brand"
					>Contorn</span
				>
			</div>
		</div>
	</div>
</section>

<!-- ========== FORMS ========== -->
<section id="forms" class="mb-20 scroll-mt-8">
	<p class="mb-2 text-xs font-medium tracking-widest text-brand uppercase">06</p>
	<h2 class="mb-2 text-3xl text-primary-900">Formularis</h2>
	<p class="mb-10 max-w-xl text-muted">
		Camps d'entrada amb focus ring de marca. El cercador combina input i botó en línia.
	</p>

	<div class="space-y-8 rounded-xl border border-border bg-surface-card p-8">
		<!-- Text input -->
		<div>
			<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Camp de text</h4>
			<label class="mb-1.5 block text-sm font-medium text-base" for="ds-input-1">Paraula</label>
			<input
				id="ds-input-1"
				type="text"
				placeholder="Introdueix una paraula..."
				class="w-full max-w-md rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
			/>
		</div>

		<!-- Search input (combined) -->
		<div>
			<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Cercador (input + botó)</h4>
			<div class="flex max-w-lg gap-3">
				<input
					type="text"
					placeholder="Cerca expressions..."
					class="flex-1 rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
				/>
				<button
					class="shrink-0 cursor-pointer rounded-lg bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-hover"
				>
					Cercar
				</button>
			</div>
		</div>

		<!-- Focus state demo -->
		<div>
			<h4 class="mb-4 text-xs font-medium tracking-widest text-muted uppercase">Estat de focus</h4>
			<p class="mb-3 text-sm text-muted">Feu clic als camps per veure l'anell de focus de marca.</p>
			<div class="flex max-w-md flex-col gap-3">
				<input
					type="text"
					placeholder="Estat normal"
					class="rounded-lg border-2 border-border px-4 py-3 text-base transition-colors focus:border-brand focus:outline-none"
				/>
				<input
					type="text"
					placeholder="Desactivat"
					disabled
					class="cursor-not-allowed rounded-lg border-2 border-border bg-neutral-100 px-4 py-3 text-base text-neutral-400"
				/>
			</div>
		</div>
	</div>
</section>

<footer class="border-t border-border pt-8 pb-4 text-center text-sm text-muted">
	Lingua — Sistema de Disseny · Última actualització: Març 2026
</footer>

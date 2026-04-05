<script lang="ts">
	import { canonical, SITE_URL } from '$lib/seo';

	let {
		title,
		description,
		path,
		noindex = false
	}: {
		title: string;
		description: string;
		path: string;
		noindex?: boolean;
	} = $props();

	const url = $derived(canonical(path));
	const imageUrl = `${SITE_URL}/icons/icon-512.png`;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:locale" content="ca" />
	<meta property="og:site_name" content="Lingua" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>

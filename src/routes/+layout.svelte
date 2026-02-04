<script>
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import MobileDrawer from '$lib/components/MobileDrawer.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Track viewport width for responsive nav switching
	let innerWidth = $state(browser ? window.innerWidth : 1024);
	let isMobile = $derived(innerWidth < 768);
</script>

<svelte:window bind:innerWidth />

<div class="min-h-screen flex flex-col">
	<!-- Responsive navigation -->
	{#if isMobile}
		<MobileDrawer />
	{:else}
		<Nav />
	{/if}

	<!-- Main content area -->
	<main class="flex-1">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
			{@render children()}
		</div>
	</main>

	<!-- Footer -->
	<Footer />
</div>

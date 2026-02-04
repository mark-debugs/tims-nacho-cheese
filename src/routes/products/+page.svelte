<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { inview } from '$lib/actions/inview';
	import FlavorCard from '$lib/components/FlavorCard.svelte';
	import MegaSpiceCard from '$lib/components/MegaSpiceCard.svelte';
	import WhereToBuy from '$lib/components/WhereToBuy.svelte';
	import { flavors } from '$lib/data/flavors';

	let isHeaderInView = $state(false);
	let headerEl: HTMLDivElement;

	$effect(() => {
		if (!headerEl) return;

		const handleInview = () => {
			isHeaderInView = true;
		};

		headerEl.addEventListener('inview_enter', handleInview);

		return () => {
			headerEl.removeEventListener('inview_enter', handleInview);
		};
	});

	// Separate regular flavors from MEGA SPICE (star flavor)
	const regularFlavors = flavors.filter((f) => !f.isStar);
	const megaSpice = flavors.find((f) => f.isStar);
</script>

<div class="max-w-6xl mx-auto">
	<!-- Hero section with scroll-triggered entrance -->
	<div bind:this={headerEl} use:inview class="text-center mb-12 {isHeaderInView ? '' : 'min-h-[80px]'}">
		{#if isHeaderInView}
			<div in:fly={{ y: -20, duration: 400, easing: quintOut }}>
				<h1 class="font-display text-5xl md:text-6xl font-bold text-gray-800 mb-4">
					Our Flavors
				</h1>
				<p class="text-xl text-gray-600">
					Five legendary west coast cheese flavors. From chill to thrill.
				</p>
			</div>
		{/if}
	</div>

	<!-- Flavor grid -->
	<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
		{#each regularFlavors as flavor, i}
			<FlavorCard {flavor} index={i} />
		{/each}

		{#if megaSpice}
			<MegaSpiceCard flavor={megaSpice} index={regularFlavors.length} />
		{/if}
	</div>

	<!-- Where to Buy section -->
	<WhereToBuy />
</div>

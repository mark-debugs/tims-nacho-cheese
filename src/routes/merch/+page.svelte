<script lang="ts">
	import ProductGrid from '$lib/components/ProductGrid.svelte';
	import { inview } from '$lib/actions/inview';
	import { scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { prefersReducedMotion } from '$lib/utils/animations';

	const reducedMotion = prefersReducedMotion();

	let headerInView = $state(false);
	let bannerInView = $state(false);
	let philosophyInView = $state(false);
</script>

<div class="max-w-6xl mx-auto">
	<!-- Header -->
	<div
		use:inview
		oninview_enter={() => headerInView = true}
		class={headerInView ? '' : 'min-h-[200px]'}
	>
		{#if headerInView}
			<div
				transition:scale={{ start: 0.9, duration: 400, easing: elasticOut }}
				class="text-center mb-12"
			>
				<h1 class="font-display text-5xl md:text-6xl font-bold text-gray-800 mb-4">Merch</h1>
				<p class="text-xl text-gray-600">
					Rep the brand. Wear the vibes. Stay cheesy.
				</p>
			</div>
		{/if}
	</div>

	<!-- Product Grid -->
	<div class="mb-12">
		<ProductGrid />
	</div>

	<!-- Coming Soon Banner -->
	<div
		use:inview
		oninview_enter={() => bannerInView = true}
		class={bannerInView ? '' : 'min-h-[200px]'}
	>
		{#if bannerInView}
			<div
				transition:scale={{
					start: 0.9,
					duration: 400,
					easing: elasticOut,
					delay: reducedMotion ? 0 : 100
				}}
				class="bg-gradient-to-r from-nacho-400 to-spice-500 rounded-2xl p-12 text-center text-white mb-12"
			>
				<div class="text-7xl mb-4">🚀</div>
				<h2 class="font-display text-4xl font-bold mb-4">Merch Drops Coming Soon</h2>
				<p class="text-xl mb-6 max-w-2xl mx-auto">
					We're finalizing designs and finding the perfect manufacturers who share our west coast values.
					Quality takes time, but it's worth the wait.
				</p>
				<form class="max-w-md mx-auto flex gap-2">
					<input
						type="email"
						placeholder="Get notified when we launch"
						class="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
					/>
					<button
						type="submit"
						class="px-8 py-3 bg-white text-nacho-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
					>
						Notify Me
					</button>
				</form>
			</div>
		{/if}
	</div>

	<!-- About Merch Philosophy -->
	<div
		use:inview
		oninview_enter={() => philosophyInView = true}
		class={philosophyInView ? '' : 'min-h-[200px]'}
	>
		{#if philosophyInView}
			<div
				transition:scale={{
					start: 0.9,
					duration: 400,
					easing: elasticOut,
					delay: reducedMotion ? 0 : 150
				}}
				class="bg-white rounded-2xl p-8 border-2 border-nacho-300"
			>
				<h2 class="font-display text-3xl font-bold text-gray-800 mb-4 text-center">
					Our Merch Philosophy
				</h2>
				<div class="grid md:grid-cols-3 gap-8 text-center">
					<div>
						<div class="text-4xl mb-3">♻️</div>
						<h3 class="font-bold text-xl text-gray-800 mb-2">Sustainable</h3>
						<p class="text-gray-600">
							Organic materials, ethical manufacturing, minimal waste. Good for you, good for the planet.
						</p>
					</div>
					<div>
						<div class="text-4xl mb-3">🎨</div>
						<h3 class="font-bold text-xl text-gray-800 mb-2">Local Artists</h3>
						<p class="text-gray-600">
							Every design created by west coast artists. Supporting the community that supports us.
						</p>
					</div>
					<div>
						<div class="text-4xl mb-3">💯</div>
						<h3 class="font-bold text-xl text-gray-800 mb-2">Quality First</h3>
						<p class="text-gray-600">
							No cheap stuff. Everything built to last. You'll wear this until it's vintage.
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

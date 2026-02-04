<script lang="ts">
	import { fly } from 'svelte/transition';
	import { inview } from '$lib/actions/inview';

	let isInView = $state(false);
	let containerEl: HTMLDivElement;

	$effect(() => {
		if (!containerEl) return;

		const handleInview = () => {
			isInView = true;
		};

		containerEl.addEventListener('inview_enter', handleInview);

		return () => {
			containerEl.removeEventListener('inview_enter', handleInview);
		};
	});
</script>

<div
	bind:this={containerEl}
	use:inview
	class={isInView ? '' : 'min-h-[100px]'}
>
	{#if isInView}
		<div
			in:fly={{ y: 40, duration: 500 }}
			class="bg-gradient-to-br from-nacho-100 to-cheddar-100 rounded-2xl p-8 md:p-12"
		>
			<div class="text-center mb-8">
				<h2 class="font-display text-3xl font-bold text-gray-800 mb-3">
					Where to Get the Goods
				</h2>
				<p class="text-gray-700 text-lg">
					Ready to experience Tim's legendary nacho cheese? Here's how to get your hands on it.
				</p>
			</div>

			<div class="grid md:grid-cols-3 gap-6 mb-8">
				<!-- DM Us -->
				<div class="bg-white rounded-xl p-6 shadow-md text-center">
					<div class="text-4xl mb-3">💬</div>
					<h3 class="font-display text-xl font-bold text-gray-800 mb-2">DM Us</h3>
					<p class="text-gray-700 text-sm leading-relaxed">
						Slide into our DMs on Instagram or Twitter. We'll hook you up.
					</p>
				</div>

				<!-- Local Pickup -->
				<div class="bg-white rounded-xl p-6 shadow-md text-center">
					<div class="text-4xl mb-3">📍</div>
					<h3 class="font-display text-xl font-bold text-gray-800 mb-2">Local Pickup</h3>
					<p class="text-gray-700 text-sm leading-relaxed">
						Based in SoCal? Hit us up for local pickup. Fresh from Tim's kitchen.
					</p>
				</div>

				<!-- Coming Soon -->
				<div class="bg-white rounded-xl p-6 shadow-md text-center">
					<div class="text-4xl mb-3">🛒</div>
					<h3 class="font-display text-xl font-bold text-gray-800 mb-2">Coming Soon: Online Store</h3>
					<p class="text-gray-700 text-sm leading-relaxed">
						Full online ordering dropping soon. Get on the list.
					</p>
				</div>
			</div>

			<div class="text-center">
				<a
					href="/about"
					class="inline-block px-8 py-3 bg-nacho-500 text-white font-bold rounded-full hover:bg-nacho-600 transition-colors motion-reduce:transition-none"
				>
					Learn About Tim
				</a>
			</div>
		</div>
	{/if}
</div>

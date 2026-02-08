<script lang="ts">
	import { products, categories, type ProductCategory } from '$lib/data/products';
	import ProductCard from '$lib/components/ProductCard.svelte';
	import { inview } from '$lib/actions/inview';
	import { scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { prefersReducedMotion } from '$lib/utils/animations';

	let activeCategory = $state<ProductCategory | 'all'>('all');

	const filteredProducts = $derived(
		activeCategory === 'all'
			? products
			: products.filter(p => p.category === activeCategory)
	);

	const reducedMotion = prefersReducedMotion();

	let inView: Record<string, boolean> = $state({});
</script>

<div>
	<!-- Category Filter Buttons -->
	<div class="flex flex-wrap gap-3 mb-8 justify-center">
		<button
			onclick={() => activeCategory = 'all'}
			class="px-6 py-2 rounded-full font-medium transition-[background-color,color,border-color] {activeCategory === 'all' ? 'bg-nacho-500 text-white' : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-nacho-400'}"
		>
			All Products
		</button>
		{#each categories as category}
			<button
				onclick={() => activeCategory = category.id}
				class="px-6 py-2 rounded-full font-medium transition-[background-color,color,border-color] {activeCategory === category.id ? 'bg-nacho-500 text-white' : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-nacho-400'}"
			>
				{category.emoji} {category.label}
			</button>
		{/each}
	</div>

	<!-- Product Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each filteredProducts as product, index (product.id)}
			<div
				use:inview
				oninview_enter={() => inView[product.id] = true}
				class={inView[product.id] ? '' : 'min-h-[200px]'}
			>
				{#if inView[product.id]}
					<div
						transition:scale={{
							start: 0.8,
							duration: 400,
							easing: elasticOut,
							delay: reducedMotion ? 0 : index * 100
						}}
					>
						<ProductCard {product} />
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

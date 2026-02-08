<script lang="ts">
	import { cheeseStretch } from '$lib/actions/cheese-stretch';
	import type { Product } from '$lib/data/products';

	type Props = {
		product: Product;
	};

	let { product }: Props = $props();
</script>

<div
	use:cheeseStretch
	class="bg-white rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] hover:-translate-y-1 transition-[transform,box-shadow] cursor-pointer"
>
	<div class="bg-gradient-to-br {product.gradient} h-64 flex items-center justify-center">
		{#if product.image}
			<enhanced:img
				src={product.image}
				alt="{product.name} - Tim's Nacho Cheese merchandise"
				sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
				class="w-full h-full object-contain p-4"
			/>
		{:else}
			<div class="text-9xl">{product.emoji}</div>
		{/if}
	</div>
	<div class="p-6">
		<div class="flex items-center justify-between mb-2">
			<h3 class="font-display text-2xl font-bold text-gray-800">{product.name}</h3>
			{#if product.comingSoon}
				<span class="px-3 py-1 bg-nacho-500 text-white text-sm font-bold rounded-full">
					Coming Soon
				</span>
			{/if}
		</div>
		<p class="text-gray-600 mb-4">
			{product.description}
		</p>
		<p class="text-2xl font-display font-bold text-nacho-600">${product.price}</p>
	</div>
</div>

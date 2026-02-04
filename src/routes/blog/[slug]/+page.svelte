<script lang="ts">
	import { inview } from '$lib/actions/inview';
	import { cheeseStretch } from '$lib/actions/cheese-stretch';
	import { prefersReducedMotion } from '$lib/utils/animations';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import RecipeCard from '$lib/components/RecipeCard.svelte';
	import { flavors } from '$lib/data/flavors';

	let { data } = $props();

	let headerVisible = $state(false);
	let contentVisible = $state(false);

	// Format date nicely
	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
	}

	// Get category badge color
	function getCategoryColor(category: string): string {
		if (category === 'recipe') return 'bg-nacho-100 text-nacho-700';
		return 'bg-blue-100 text-blue-700';
	}

	// Get product name from product ID
	function getProductName(productId: string): string {
		const flavor = flavors.find((f) => f.id === productId);
		return flavor?.name || productId;
	}
</script>

<svelte:head>
	<title>{data.metadata.title} - Tim's Nacho Cheese</title>
</svelte:head>

<article class="max-w-3xl mx-auto">
	<!-- Back link -->
	<a
		href="/blog"
		class="inline-flex items-center text-nacho-600 font-medium hover:text-nacho-700 mb-8"
	>
		<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 16l-4-4m0 0l4-4m-4 4h18"
			/>
		</svg>
		Back to Blog
	</a>

	<!-- Header -->
	<header
		class="mb-12"
		use:inview={{ once: true }}
		oninview_enter={() => (headerVisible = true)}
	>
		{#if headerVisible}
			<div
				class="flex items-center gap-4 mb-4"
				in:fly={{ y: -20, duration: prefersReducedMotion() ? 0 : 400, easing: quintOut }}
			>
				<span class="text-6xl">{data.metadata.emoji}</span>
				<div>
					<div class="flex items-center gap-3 mb-2">
						<span class="text-sm text-gray-500">{formatDate(data.metadata.date)}</span>
						<span
							class="px-3 py-1 {getCategoryColor(data.metadata.category)} text-sm font-medium rounded-full"
						>
							{data.metadata.category === 'recipe' ? 'Recipe' : 'Lifestyle'}
						</span>
					</div>
				</div>
			</div>
			<h1
				class="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-4"
				in:fly={{
					y: -20,
					duration: prefersReducedMotion() ? 0 : 400,
					delay: 100,
					easing: quintOut
				}}
			>
				{data.metadata.title}
			</h1>
			<p
				class="text-xl text-gray-600"
				in:fly={{
					y: -20,
					duration: prefersReducedMotion() ? 0 : 400,
					delay: 200,
					easing: quintOut
				}}
			>
				{data.metadata.excerpt}
			</p>
		{/if}
	</header>

	<!-- Recipe info bar (if recipe) -->
	{#if data.metadata.category === 'recipe'}
		<div
			class="bg-nacho-50 rounded-2xl p-6 mb-8 grid grid-cols-3 gap-4 text-center"
			use:inview={{ once: true }}
			oninview_enter={() => (contentVisible = true)}
		>
			{#if contentVisible}
				<div in:fly={{ y: 20, duration: prefersReducedMotion() ? 0 : 300, easing: quintOut }}>
					<div class="text-2xl font-display font-bold text-nacho-700">
						{data.metadata.prepTime}
					</div>
					<div class="text-sm text-gray-600">Prep Time</div>
				</div>
				<div
					in:fly={{
						y: 20,
						duration: prefersReducedMotion() ? 0 : 300,
						delay: 50,
						easing: quintOut
					}}
				>
					<div class="text-2xl font-display font-bold text-nacho-700">
						{data.metadata.cookTime}
					</div>
					<div class="text-sm text-gray-600">Cook Time</div>
				</div>
				<div
					in:fly={{
						y: 20,
						duration: prefersReducedMotion() ? 0 : 300,
						delay: 100,
						easing: quintOut
					}}
				>
					<div class="text-2xl font-display font-bold text-nacho-700">
						{data.metadata.servings}
					</div>
					<div class="text-sm text-gray-600">Servings</div>
				</div>
			{/if}
		</div>

		<!-- Ingredients -->
		<section class="bg-white rounded-2xl p-8 shadow-lg mb-8" use:cheeseStretch>
			<h2 class="font-display text-2xl font-bold text-gray-800 mb-4">Ingredients</h2>
			<ul class="space-y-2">
				{#each data.metadata.ingredients as ingredient}
					<li class="flex items-start">
						<span class="text-nacho-500 mr-2">•</span>
						<span class="text-gray-700">{ingredient}</span>
					</li>
				{/each}
			</ul>
		</section>

		<!-- Instructions -->
		<section class="bg-white rounded-2xl p-8 shadow-lg mb-8" use:cheeseStretch>
			<h2 class="font-display text-2xl font-bold text-gray-800 mb-4">Instructions</h2>
			<ol class="space-y-4">
				{#each data.metadata.instructions as instruction, i}
					<li class="flex items-start">
						<span
							class="flex-shrink-0 w-8 h-8 bg-nacho-500 text-white rounded-full flex items-center justify-center font-bold mr-3"
						>
							{i + 1}
						</span>
						<span class="text-gray-700 pt-1">{instruction}</span>
					</li>
				{/each}
			</ol>
		</section>

		<!-- Products Used -->
		{#if data.metadata.products && data.metadata.products.length > 0}
			<section class="bg-gradient-to-r from-nacho-400 to-nacho-600 rounded-2xl p-8 mb-8 text-white">
				<h2 class="font-display text-2xl font-bold mb-4">Products Used</h2>
				<div class="space-y-3">
					{#each data.metadata.products as productId}
						<a
							href="/products#{productId}"
							class="block bg-white/20 hover:bg-white/30 rounded-lg px-4 py-3 transition-colors motion-reduce:transition-none font-medium"
						>
							{getProductName(productId)}
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Download Recipe Card -->
		<div class="mb-8">
			<RecipeCard recipe={data.metadata} />
		</div>
	{/if}

	<!-- Blog content (MDSveX) -->
	<div class="prose prose-lg max-w-none mb-12">
		<svelte:component this={data.content} />
	</div>

	<!-- Newsletter Signup -->
	<div class="mt-16">
		<NewsletterSignup />
	</div>
</article>

<style>
	:global(.prose h2) {
		@apply font-display text-3xl font-bold text-gray-800 mt-8 mb-4;
	}

	:global(.prose h3) {
		@apply font-display text-2xl font-bold text-gray-800 mt-6 mb-3;
	}

	:global(.prose p) {
		@apply text-gray-700 leading-relaxed mb-4;
	}

	:global(.prose ul) {
		@apply mb-4;
	}

	:global(.prose ul li) {
		@apply mb-2;
	}

	:global(.prose li) {
		@apply text-gray-700;
	}

	:global(.prose strong) {
		@apply text-gray-800 font-bold;
	}

	:global(.prose a) {
		@apply text-nacho-600 hover:text-nacho-700 font-medium;
	}
</style>

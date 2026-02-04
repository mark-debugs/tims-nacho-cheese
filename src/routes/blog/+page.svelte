<script lang="ts">
	import { inview } from '$lib/actions/inview';
	import { cheeseStretch } from '$lib/actions/cheese-stretch';
	import { bouncySpring, prefersReducedMotion } from '$lib/utils/animations';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';

	type Post = {
		slug: string;
		title: string;
		date: string;
		excerpt: string;
		category: string;
		emoji: string;
	};

	let { data } = $props();

	// Category filter state
	type Category = 'all' | 'recipe' | 'lifestyle';
	let activeCategory = $state<Category>('all');

	// Filtered posts based on active category
	let filteredPosts = $derived(
		activeCategory === 'all'
			? data.posts
			: data.posts.filter((p: Post) => p.category === activeCategory)
	);

	// Animation control
	let headerVisible = $state(false);

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

	// Get category border color
	function getBorderColor(category: string): string {
		if (category === 'recipe') return 'border-nacho-500';
		return 'border-blue-500';
	}
</script>

<div class="max-w-4xl mx-auto">
	<!-- Header -->
	<div
		class="text-center mb-12"
		use:inview={{ once: true }}
		oninview_enter={() => (headerVisible = true)}
	>
		{#if headerVisible}
			<h1
				class="font-display text-5xl md:text-6xl font-bold text-gray-800 mb-4"
				in:fly={{ y: -20, duration: prefersReducedMotion() ? 0 : 400, easing: quintOut }}
			>
				Blog
			</h1>
			<p
				class="text-xl text-gray-600"
				in:fly={{
					y: -20,
					duration: prefersReducedMotion() ? 0 : 400,
					delay: 100,
					easing: quintOut
				}}
			>
				Stories from the west coast. Cheese, surf, skate, and good vibes.
			</p>
		{/if}
	</div>

	<!-- Category filter tabs -->
	<div class="flex justify-center gap-4 mb-12">
		<button
			class="px-6 py-2 rounded-full font-medium transition-colors {activeCategory === 'all'
				? 'bg-nacho-500 text-white'
				: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
			onclick={() => (activeCategory = 'all')}
		>
			All
		</button>
		<button
			class="px-6 py-2 rounded-full font-medium transition-colors {activeCategory === 'recipe'
				? 'bg-nacho-500 text-white'
				: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
			onclick={() => (activeCategory = 'recipe')}
		>
			Recipes
		</button>
		<button
			class="px-6 py-2 rounded-full font-medium transition-colors {activeCategory === 'lifestyle'
				? 'bg-nacho-500 text-white'
				: 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
			onclick={() => (activeCategory = 'lifestyle')}
		>
			Lifestyle
		</button>
	</div>

	<!-- Blog post cards -->
	<div class="space-y-8 mb-16">
		{#each filteredPosts as post, i (post.slug)}
			<article
				class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow border-l-4 {getBorderColor(
					post.category
				)}"
				use:inview={{ once: true }}
				use:cheeseStretch
			>
				<div class="flex items-start gap-6">
					<div class="text-6xl">{post.emoji}</div>
					<div class="flex-1">
						<div class="flex flex-wrap items-center gap-4 mb-3">
							<span class="text-sm text-gray-500">{formatDate(post.date)}</span>
							<span
								class="px-3 py-1 {getCategoryColor(post.category)} text-sm font-medium rounded-full"
							>
								{post.category === 'recipe' ? 'Recipe' : 'Lifestyle'}
							</span>
						</div>
						<h2 class="font-display text-3xl font-bold text-gray-800 mb-3 hover:text-nacho-600">
							<a href="/blog/{post.slug}">{post.title}</a>
						</h2>
						<p class="text-gray-700 leading-relaxed mb-4">
							{post.excerpt}
						</p>
						<a
							href="/blog/{post.slug}"
							class="inline-flex items-center text-nacho-600 font-bold hover:text-nacho-700"
						>
							Read More
							<svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 8l4 4m0 0l-4 4m4-4H3"
								/>
							</svg>
						</a>
					</div>
				</div>
			</article>
		{/each}
	</div>

	<!-- Newsletter Signup -->
	<NewsletterSignup />
</div>

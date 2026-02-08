<script lang="ts">
	import { scale } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { inview } from '$lib/actions/inview';
	import { cheeseStretch } from '$lib/actions/cheese-stretch';
	import { prefersReducedMotion } from '$lib/utils/animations';
	import type { Flavor } from '$lib/data/flavors';

	type Props = {
		flavor: Flavor;
		index: number;
	};

	let { flavor, index }: Props = $props();

	let isInView = $state(false);
	let isHovered = $state(false);

	const reducedMotion = prefersReducedMotion();

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

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
	}
</script>

<div
	bind:this={containerEl}
	use:inview
	class="overflow-visible {isInView ? '' : 'min-h-[200px]'}"
>
	{#if isInView}
		<div
			in:scale={{
				start: 1.3,
				duration: 600,
				easing: elasticOut,
				opacity: 0,
				delay: reducedMotion ? 0 : index * 100
			}}
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				use:cheeseStretch
				onmouseenter={handleMouseEnter}
				onmouseleave={handleMouseLeave}
				class="relative rounded-2xl overflow-hidden shadow-lg border-2 border-spice-700 bg-gradient-to-br from-spice-400 to-spice-600 text-white md:col-span-2 lg:col-span-1 cursor-pointer"
			>
				<!-- Flame decorations (only visible on hover) -->
				{#if isHovered}
					<div class="absolute -top-8 left-1/4 text-4xl animate-flame-flicker z-20">
						🔥
					</div>
					<div class="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl animate-flame-flicker z-20" style="animation-delay: 0.1s;">
						🔥
					</div>
					<div class="absolute -top-8 right-1/4 text-4xl animate-flame-flicker z-20" style="animation-delay: 0.2s;">
						🔥
					</div>
				{/if}

				<!-- Heat shimmer overlay (only on hover) -->
				{#if isHovered}
					<div
						class="absolute inset-0 rounded-2xl bg-gradient-to-t from-spice-600/50 to-transparent pointer-events-none animate-heat-shimmer"
					></div>
				{/if}

				{#if flavor.image}
					<enhanced:img
						src={flavor.image}
						alt="MEGA SPICE Face Melter nacho cheese sauce with extreme heat"
						sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
						class="w-full h-48 object-cover"
					/>
				{:else}
					<div class="w-full h-48 flex items-center justify-center">
						<div class="text-6xl">{flavor.emoji}</div>
					</div>
				{/if}

				<!-- Card content -->
				<div class="relative z-10 p-8">
					<h3 class="font-display text-3xl font-bold text-white mb-2">MEGA SPICE</h3>
					<span class="inline-block text-lg mb-1 text-white/80">Face Melter</span>
					<div class="mb-4">
						<span
							class="inline-block px-3 py-1 bg-white/30 backdrop-blur text-white text-sm font-medium rounded-full"
						>
							⚠️ {flavor.badge}
						</span>
					</div>
					<p class="text-white/90 leading-relaxed mb-4">
						{flavor.description}
					</p>
					<div class="flex items-center gap-2 text-sm text-white/90">
						<span>🌶️ Heat Level:</span>
						<div class="flex-1 bg-white/30 h-2 rounded-full overflow-hidden">
							<div
								class="bg-white h-full w-full {isHovered ? 'animate-pulse' : ''}"
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

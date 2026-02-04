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
		if (!reducedMotion) {
			isHovered = true;
		}
	}

	function handleMouseLeave() {
		isHovered = false;
	}
</script>

<div
	bind:this={containerEl}
	use:inview
>
	{#if isInView}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			use:cheeseStretch
			in:scale={{
				start: 1.3,
				duration: 600,
				easing: elasticOut,
				opacity: 0,
				delay: reducedMotion ? 0 : index * 100
			}}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
			class="relative rounded-2xl p-8 shadow-lg border-2 border-spice-700 bg-gradient-to-br from-spice-400 to-spice-600 text-white md:col-span-2 lg:col-span-1"
		>
			<!-- Flame decorations (only visible on hover) -->
			{#if isHovered && !reducedMotion}
				<div class="absolute -top-6 left-1/4 text-4xl transition-all duration-300 -translate-y-2 animate-flame-flicker">
					🔥
				</div>
				<div class="absolute -top-6 left-1/2 text-5xl transition-all duration-300 -translate-y-2 animate-flame-flicker" style="animation-delay: 0.1s;">
					🔥
				</div>
				<div class="absolute -top-6 right-1/4 text-4xl transition-all duration-300 -translate-y-2 animate-flame-flicker" style="animation-delay: 0.2s;">
					🔥
				</div>
			{/if}

			<!-- Heat shimmer overlay (only on hover) -->
			{#if isHovered && !reducedMotion}
				<div
					class="absolute inset-0 rounded-2xl bg-gradient-to-t from-spice-600/50 to-transparent pointer-events-none animate-heat-shimmer"
				></div>
			{/if}

			<!-- Card content -->
			<div class="relative z-10">
				<div class="text-6xl mb-4">{flavor.emoji}</div>
				<h3 class="font-display text-3xl font-bold text-white mb-2">MEGA SPICE</h3>
				<span
					class="inline-block px-3 py-1 bg-white/30 backdrop-blur text-white text-sm font-medium rounded-full mb-4"
				>
					⚠️ {flavor.badge}
				</span>
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
	{/if}
</div>

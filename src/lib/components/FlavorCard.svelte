<script lang="ts">
	import { inview } from '$lib/actions/inview';
	import { cheeseStretch } from '$lib/actions/cheese-stretch';
	import { getFlavorAnimation } from '$lib/utils/scroll-animations';
	import { prefersReducedMotion } from '$lib/utils/animations';
	import type { Flavor } from '$lib/data/flavors';

	type Props = {
		flavor: Flavor;
		index: number;
	};

	let { flavor, index }: Props = $props();

	let isInView = $state(false);

	// Map flavor colors to Tailwind classes (must be statically analyzable for JIT)
	const colorMap: Record<
		string,
		{
			border: string;
			text: string;
			badgeBg: string;
			badgeText: string;
			heatBar: string;
		}
	> = {
		'white-cheese': {
			border: 'border-white-cheese-300',
			text: 'text-white-cheese-700',
			badgeBg: 'bg-white-cheese-200',
			badgeText: 'text-white-cheese-700',
			heatBar: 'bg-white-cheese-400'
		},
		nacho: {
			border: 'border-nacho-300',
			text: 'text-nacho-600',
			badgeBg: 'bg-nacho-200',
			badgeText: 'text-nacho-700',
			heatBar: 'bg-nacho-500'
		},
		mozz: {
			border: 'border-mozz-300',
			text: 'text-mozz-600',
			badgeBg: 'bg-mozz-100',
			badgeText: 'text-mozz-700',
			heatBar: 'bg-mozz-500'
		},
		cheddar: {
			border: 'border-cheddar-300',
			text: 'text-cheddar-600',
			badgeBg: 'bg-cheddar-200',
			badgeText: 'text-cheddar-700',
			heatBar: 'bg-cheddar-500'
		}
	};

	// Derived values - these are reactive to flavor prop changes
	let colors = $derived(colorMap[flavor.color]);
	let animation = $derived(getFlavorAnimation(flavor.id));
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
</script>

<div
	bind:this={containerEl}
	use:inview
	class={isInView ? '' : 'min-h-[200px]'}
>
	{#if isInView}
		<div
			transition:animation.transition={{
				...animation.params,
				delay: reducedMotion ? 0 : index * 100
			}}
		>
			<div
				use:cheeseStretch
				class="rounded-2xl p-8 shadow-lg border-2 bg-white {colors.border} cursor-pointer"
			>
			<div class="text-6xl mb-4">{flavor.emoji}</div>
			<h3 class="font-display text-2xl font-bold mb-2 {colors.text}">{flavor.name}</h3>
			<span
				class="inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 {colors.badgeBg} {colors.badgeText}"
			>
				{flavor.badge}
			</span>
			<p class="text-gray-700 leading-relaxed mb-4">
				{flavor.description}
			</p>
			<div class="flex items-center gap-2 text-sm text-gray-600">
				<span>🌶️ Heat Level:</span>
				<div class="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
					<div
						class="h-full {colors.heatBar}"
						style="width: {(flavor.heatLevel / 5) * 100}%"
					></div>
				</div>
			</div>
			</div>
		</div>
	{/if}
</div>

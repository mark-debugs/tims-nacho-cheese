<script lang="ts">
	import { bouncySpring, prefersReducedMotion } from '$lib/utils/animations';
	import { inview } from '$lib/actions/inview';
	import { cheeseStretch } from '$lib/actions/cheese-stretch';

	// Hero entrance animations
	let heroScale = bouncySpring(0);
	let heroRotation = bouncySpring(-15);
	let heroTitleY = bouncySpring(40);
	let heroSubtitleOpacity = bouncySpring(0);
	let heroCta1Scale = bouncySpring(0.8);
	let heroCta2Scale = bouncySpring(0.8);

	// Feature cards animations
	let card1Visible = $state(false);
	let card1Y = bouncySpring(30);
	let card1Opacity = bouncySpring(0);

	let card2Visible = $state(false);
	let card2Y = bouncySpring(30);
	let card2Opacity = bouncySpring(0);

	let card3Visible = $state(false);
	let card3Y = bouncySpring(30);
	let card3Opacity = bouncySpring(0);

	// Featured flavor section animations
	let featuredVisible = $state(false);
	let featuredY = bouncySpring(30);
	let featuredOpacity = bouncySpring(0);

	// Social proof section animations
	let socialVisible = $state(false);
	let socialY = bouncySpring(30);
	let socialOpacity = bouncySpring(0);

	// CTA section animations
	let ctaVisible = $state(false);
	let ctaY = bouncySpring(30);
	let ctaOpacity = bouncySpring(0);

	// Hero entrance on mount
	$effect(() => {
		const reduced = prefersReducedMotion();
		const opts = reduced ? { hard: true } : undefined;

		// Cheese emoji bounce in
		setTimeout(() => {
			heroScale.set(1, opts);
			heroRotation.set(0, opts);
		}, 100);

		// Title fly up
		setTimeout(() => {
			heroTitleY.set(0, opts);
		}, 300);

		// Subtitle fade in
		setTimeout(() => {
			heroSubtitleOpacity.set(1, opts);
		}, 500);

		// CTAs scale in
		setTimeout(() => {
			heroCta1Scale.set(1, opts);
		}, 700);
		setTimeout(() => {
			heroCta2Scale.set(1, opts);
		}, 850);
	});

	// Feature card entrance handlers
	function onCard1InView() {
		if (card1Visible) return;
		card1Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		card1Y.set(0, opts);
		card1Opacity.set(1, opts);
	}

	function onCard2InView() {
		if (card2Visible) return;
		card2Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		setTimeout(() => {
			card2Y.set(0, opts);
			card2Opacity.set(1, opts);
		}, 100);
	}

	function onCard3InView() {
		if (card3Visible) return;
		card3Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		setTimeout(() => {
			card3Y.set(0, opts);
			card3Opacity.set(1, opts);
		}, 200);
	}

	function onFeaturedInView() {
		if (featuredVisible) return;
		featuredVisible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		featuredY.set(0, opts);
		featuredOpacity.set(1, opts);
	}

	function onSocialInView() {
		if (socialVisible) return;
		socialVisible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		socialY.set(0, opts);
		socialOpacity.set(1, opts);
	}

	function onCtaInView() {
		if (ctaVisible) return;
		ctaVisible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		ctaY.set(0, opts);
		ctaOpacity.set(1, opts);
	}
</script>

<!-- Hero Section -->
<div
	class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-nacho-400 via-nacho-500 to-spice-500 p-8 md:p-16 mb-12 shadow-2xl"
>
	<div class="relative z-10 text-center text-white">
		<div
			class="text-8xl mb-6"
			style="transform: scale({$heroScale}) rotate({$heroRotation}deg); display: inline-block;"
		>
			🧀
		</div>
		<h1
			class="font-display text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg"
			style="transform: translateY({$heroTitleY}px);"
		>
			Tim's Nacho Cheese
		</h1>
		<p
			class="text-2xl md:text-3xl font-medium mb-8 drop-shadow"
			style="opacity: {$heroSubtitleOpacity};"
		>
			The cheesiest site on the internet
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="/products"
				use:cheeseStretch
				class="px-8 py-4 bg-white text-nacho-600 font-bold rounded-full text-lg shadow-lg"
				style="transform: scale({$heroCta1Scale});"
			>
				Shop Cheese
			</a>
			<a
				href="/quiz"
				use:cheeseStretch
				class="px-8 py-4 border-2 border-white text-white font-bold rounded-full text-lg shadow-lg"
				style="transform: scale({$heroCta2Scale});"
			>
				Find Your Flavor
			</a>
		</div>
	</div>
	<!-- Decorative background elements -->
	<div class="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🧀</div>
	<div class="absolute bottom-10 right-10 text-6xl opacity-20 animate-bounce delay-100">🧀</div>
</div>

<!-- Feature Cards -->
<div class="mb-16">
	<h2 class="font-display text-4xl font-bold text-center text-gray-800 mb-8">
		Why Tim's Nacho Cheese?
	</h2>
	<div class="grid md:grid-cols-3 gap-8">
		<div
			use:inview
			oninview_enter={onCard1InView}
			use:cheeseStretch
			class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
			style="transform: translateY({$card1Y}px); opacity: {$card1Opacity};"
		>
			<div class="text-5xl mb-4">🌊</div>
			<h3 class="font-display text-2xl font-bold text-nacho-600 mb-3">West Coast Vibes</h3>
			<p class="text-gray-700 leading-relaxed">
				Born from the laid-back surf culture of California. Every jar is infused with that chill
				west coast energy.
			</p>
		</div>

		<div
			use:inview
			oninview_enter={onCard2InView}
			use:cheeseStretch
			class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
			style="transform: translateY({$card2Y}px); opacity: {$card2Opacity};"
		>
			<div class="text-5xl mb-4">🔥</div>
			<h3 class="font-display text-2xl font-bold text-spice-600 mb-3">Bold Flavors</h3>
			<p class="text-gray-700 leading-relaxed">
				From mild to MEGA SPICE, we've got a heat level for everyone. No boring cheese here.
			</p>
		</div>

		<div
			use:inview
			oninview_enter={onCard3InView}
			use:cheeseStretch
			class="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow"
			style="transform: translateY({$card3Y}px); opacity: {$card3Opacity};"
		>
			<div class="text-5xl mb-4">🛹</div>
			<h3 class="font-display text-2xl font-bold text-cheddar-600 mb-3">Skater Approved</h3>
			<p class="text-gray-700 leading-relaxed">
				Created by Tim, a tattooed skateboarder who knows what real flavor tastes like. Checkered
				Vans optional.
			</p>
		</div>
	</div>
</div>

<!-- Featured Flavor Preview -->
<div
	class="mb-16"
	use:inview
	oninview_enter={onFeaturedInView}
	style="transform: translateY({$featuredY}px); opacity: {$featuredOpacity};"
>
	<h2 class="font-display text-4xl font-bold text-center text-gray-800 mb-8">
		Featured Flavor This Week
	</h2>
	<div class="bg-gradient-to-r from-spice-400 to-spice-600 rounded-3xl p-8 md:p-12 text-white">
		<div class="flex flex-col md:flex-row items-center gap-8">
			<div class="text-9xl">🌶️</div>
			<div class="flex-1 text-center md:text-left">
				<h3 class="font-display text-5xl font-bold mb-4 drop-shadow-lg">MEGA SPICE</h3>
				<p class="text-xl mb-6 drop-shadow">
					Our hottest cheese yet. Not for the faint of heart. You've been warned.
				</p>
				<a
					href="/products"
					use:cheeseStretch
					class="inline-block px-8 py-4 bg-white text-spice-600 font-bold rounded-full text-lg shadow-lg"
				>
					I Can Handle It
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Social Proof / Stats -->
<div
	class="mb-16"
	use:inview
	oninview_enter={onSocialInView}
	style="transform: translateY({$socialY}px); opacity: {$socialOpacity};"
>
	<div class="grid md:grid-cols-4 gap-8 text-center">
		<div class="bg-cream-50 rounded-2xl p-6 border-2 border-nacho-300">
			<div class="text-4xl font-display font-bold text-nacho-600 mb-2">5</div>
			<p class="text-gray-700 font-medium">Epic Flavors</p>
		</div>
		<div class="bg-cream-50 rounded-2xl p-6 border-2 border-nacho-300">
			<div class="text-4xl font-display font-bold text-nacho-600 mb-2">10k+</div>
			<p class="text-gray-700 font-medium">Jars Sold</p>
		</div>
		<div class="bg-cream-50 rounded-2xl p-6 border-2 border-nacho-300">
			<div class="text-4xl font-display font-bold text-nacho-600 mb-2">100%</div>
			<p class="text-gray-700 font-medium">Cheese Lovers</p>
		</div>
		<div class="bg-cream-50 rounded-2xl p-6 border-2 border-nacho-300">
			<div class="text-4xl font-display font-bold text-nacho-600 mb-2">∞</div>
			<p class="text-gray-700 font-medium">Good Vibes</p>
		</div>
	</div>
</div>

<!-- CTA Section -->
<div
	class="text-center bg-nacho-100 rounded-3xl p-12"
	use:inview
	oninview_enter={onCtaInView}
	style="transform: translateY({$ctaY}px); opacity: {$ctaOpacity};"
>
	<h2 class="font-display text-4xl font-bold text-gray-800 mb-4">Ready to Get Cheesy?</h2>
	<p class="text-xl text-gray-700 mb-8">
		Explore our full lineup of west coast inspired nacho cheese flavors
	</p>
	<a
		href="/products"
		use:cheeseStretch
		class="inline-block px-12 py-5 bg-nacho-500 text-white font-bold rounded-full text-xl hover:bg-nacho-600 shadow-xl"
	>
		See All Flavors
	</a>
</div>

<script lang="ts">
	import { bouncySpring, prefersReducedMotion } from '$lib/utils/animations';
	import { inview } from '$lib/actions/inview';
	import { cheeseStretch } from '$lib/actions/cheese-stretch';

	// Hero animations
	let heroScale = bouncySpring(0);
	let heroRotation = bouncySpring(-15);
	let heroTitleY = bouncySpring(40);
	let heroSubtitleOpacity = bouncySpring(0);

	// Origin story animation
	let storyVisible = $state(false);
	let storyX = bouncySpring(-30);
	let storyOpacity = bouncySpring(0);

	// Philosophy animation
	let philosophyVisible = $state(false);
	let philosophyX = bouncySpring(30);
	let philosophyOpacity = bouncySpring(0);

	// Stats grid animations
	let stats1Visible = $state(false);
	let stats1Scale = bouncySpring(0.8);
	let stats1Opacity = bouncySpring(0);

	let stats2Visible = $state(false);
	let stats2Scale = bouncySpring(0.8);
	let stats2Opacity = bouncySpring(0);

	let stats3Visible = $state(false);
	let stats3Scale = bouncySpring(0.8);
	let stats3Opacity = bouncySpring(0);

	let stats4Visible = $state(false);
	let stats4Scale = bouncySpring(0.8);
	let stats4Opacity = bouncySpring(0);

	// Essentials section animation
	let essentialsVisible = $state(false);
	let essentialsY = bouncySpring(30);
	let essentialsOpacity = bouncySpring(0);

	// Values grid animations
	let values1Visible = $state(false);
	let values1Y = bouncySpring(30);
	let values1Opacity = bouncySpring(0);

	let values2Visible = $state(false);
	let values2Y = bouncySpring(30);
	let values2Opacity = bouncySpring(0);

	let values3Visible = $state(false);
	let values3Y = bouncySpring(30);
	let values3Opacity = bouncySpring(0);

	// Contact CTA animation
	let ctaVisible = $state(false);
	let ctaOpacity = bouncySpring(0);

	// Hero entrance on mount
	$effect(() => {
		const reduced = prefersReducedMotion();
		const opts = reduced ? { hard: true } : undefined;

		setTimeout(() => {
			heroScale.set(1, opts);
			heroRotation.set(0, opts);
		}, 100);

		setTimeout(() => {
			heroTitleY.set(0, opts);
		}, 300);

		setTimeout(() => {
			heroSubtitleOpacity.set(1, opts);
		}, 500);
	});

	function onStoryInView() {
		if (storyVisible) return;
		storyVisible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		storyX.set(0, opts);
		storyOpacity.set(1, opts);
	}

	function onPhilosophyInView() {
		if (philosophyVisible) return;
		philosophyVisible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		philosophyX.set(0, opts);
		philosophyOpacity.set(1, opts);
	}

	function onStats1InView() {
		if (stats1Visible) return;
		stats1Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		stats1Scale.set(1, opts);
		stats1Opacity.set(1, opts);
	}

	function onStats2InView() {
		if (stats2Visible) return;
		stats2Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		setTimeout(() => {
			stats2Scale.set(1, opts);
			stats2Opacity.set(1, opts);
		}, 100);
	}

	function onStats3InView() {
		if (stats3Visible) return;
		stats3Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		setTimeout(() => {
			stats3Scale.set(1, opts);
			stats3Opacity.set(1, opts);
		}, 200);
	}

	function onStats4InView() {
		if (stats4Visible) return;
		stats4Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		setTimeout(() => {
			stats4Scale.set(1, opts);
			stats4Opacity.set(1, opts);
		}, 300);
	}

	function onEssentialsInView() {
		if (essentialsVisible) return;
		essentialsVisible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		essentialsY.set(0, opts);
		essentialsOpacity.set(1, opts);
	}

	function onValues1InView() {
		if (values1Visible) return;
		values1Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		values1Y.set(0, opts);
		values1Opacity.set(1, opts);
	}

	function onValues2InView() {
		if (values2Visible) return;
		values2Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		setTimeout(() => {
			values2Y.set(0, opts);
			values2Opacity.set(1, opts);
		}, 100);
	}

	function onValues3InView() {
		if (values3Visible) return;
		values3Visible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		setTimeout(() => {
			values3Y.set(0, opts);
			values3Opacity.set(1, opts);
		}, 200);
	}

	function onCtaInView() {
		if (ctaVisible) return;
		ctaVisible = true;
		const opts = prefersReducedMotion() ? { hard: true } : undefined;
		ctaOpacity.set(1, opts);
	}
</script>

<div class="max-w-4xl mx-auto">
	<!-- Hero Section -->
	<div class="text-center mb-16">
		<div
			class="text-9xl mb-6"
			style="transform: scale({$heroScale}) rotate({$heroRotation}deg); display: inline-block;"
		>
			🧀
		</div>
		<h1
			class="font-display text-5xl md:text-6xl font-bold text-gray-800 mb-4"
			style="transform: translateY({$heroTitleY}px);"
		>
			About Tim
		</h1>
		<p class="text-2xl text-gray-600" style="opacity: {$heroSubtitleOpacity};">
			Skater. Cheese Enthusiast. West Coast Legend.
		</p>
	</div>

	<!-- Main Story -->
	<div class="prose prose-lg max-w-none mb-12">
		<div
			use:inview
			oninview_enter={onStoryInView}
			class="bg-white rounded-2xl p-8 shadow-lg mb-8"
			style="transform: translateX({$storyX}px); opacity: {$storyOpacity};"
		>
			<h2 class="font-display text-3xl font-bold text-nacho-600 mb-4">The Origin Story</h2>
			<p class="text-gray-700 leading-relaxed mb-4">
				Tim's Nacho Cheese didn't start in a kitchen — it started on a skateboard. Growing up on
				the California coast, Tim spent his days at the skate park and his nights at taco trucks,
				always searching for the perfect nacho cheese. It never existed. So he made it.
			</p>
			<p class="text-gray-700 leading-relaxed mb-4">
				What began as late-night kitchen experiments in a tiny Venice Beach apartment turned into
				something bigger. Friends couldn't get enough. Local taco spots started asking for jars.
				Word spread through the skate community, then the surf scene, then everywhere.
			</p>
			<p class="text-gray-700 leading-relaxed">
				Today, Tim's still that same tattooed skater in checkered Vans, just with way more cheese
				jars to manage. The vibe hasn't changed — make killer cheese, stay humble, keep it west
				coast.
			</p>
		</div>

		<div
			use:inview
			oninview_enter={onPhilosophyInView}
			class="bg-gradient-to-r from-nacho-100 to-spice-100 rounded-2xl p-8 mb-8"
			style="transform: translateX({$philosophyX}px); opacity: {$philosophyOpacity};"
		>
			<h2 class="font-display text-3xl font-bold text-gray-800 mb-4">The Philosophy</h2>
			<blockquote class="text-xl italic text-gray-700 border-l-4 border-nacho-500 pl-6 mb-4">
				"Cheese should be like skateboarding — bold, fun, and unapologetic. No pretension. Just
				pure stoke."
				<footer class="text-base not-italic text-gray-600 mt-2">
					— Tim, probably at a skate park
				</footer>
			</blockquote>
			<p class="text-gray-700 leading-relaxed">
				Every jar of Tim's Nacho Cheese embodies west coast values: quality without ego, flavor
				without fuss, and community above everything. We're not trying to be fancy. We're trying to
				be real.
			</p>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid md:grid-cols-2 gap-8 mb-12">
		<div
			use:inview
			oninview_enter={onStats1InView}
			use:cheeseStretch
			class="bg-white rounded-2xl p-8 shadow-lg text-center"
			style="transform: scale({$stats1Scale}); opacity: {$stats1Opacity};"
		>
			<div class="text-6xl mb-4">🛹</div>
			<h3 class="font-display text-2xl font-bold text-gray-800 mb-2">15+ Years</h3>
			<p class="text-gray-600">Skateboarding and perfecting the cheese game</p>
		</div>

		<div
			use:inview
			oninview_enter={onStats2InView}
			use:cheeseStretch
			class="bg-white rounded-2xl p-8 shadow-lg text-center"
			style="transform: scale({$stats2Scale}); opacity: {$stats2Opacity};"
		>
			<div class="text-6xl mb-4">🌊</div>
			<h3 class="font-display text-2xl font-bold text-gray-800 mb-2">Venice Beach</h3>
			<p class="text-gray-600">Where it all started — still HQ today</p>
		</div>

		<div
			use:inview
			oninview_enter={onStats3InView}
			use:cheeseStretch
			class="bg-white rounded-2xl p-8 shadow-lg text-center"
			style="transform: scale({$stats3Scale}); opacity: {$stats3Opacity};"
		>
			<div class="text-6xl mb-4">🧀</div>
			<h3 class="font-display text-2xl font-bold text-gray-800 mb-2">5 Flavors</h3>
			<p class="text-gray-600">Each one crafted with obsessive attention to detail</p>
		</div>

		<div
			use:inview
			oninview_enter={onStats4InView}
			use:cheeseStretch
			class="bg-white rounded-2xl p-8 shadow-lg text-center"
			style="transform: scale({$stats4Scale}); opacity: {$stats4Opacity};"
		>
			<div class="text-6xl mb-4">❤️</div>
			<h3 class="font-display text-2xl font-bold text-gray-800 mb-2">100% Independent</h3>
			<p class="text-gray-600">No investors, no BS — just good cheese and good vibes</p>
		</div>
	</div>

	<!-- Tim's Essentials -->
	<div
		use:inview
		oninview_enter={onEssentialsInView}
		class="bg-gradient-to-br from-nacho-400 to-spice-500 rounded-2xl p-8 md:p-12 text-white mb-12"
		style="transform: translateY({$essentialsY}px); opacity: {$essentialsOpacity};"
	>
		<h2 class="font-display text-3xl font-bold mb-6 text-center">Tim's Essentials</h2>
		<div class="grid md:grid-cols-2 gap-6">
			<div class="flex items-start gap-4">
				<div class="text-3xl">👟</div>
				<div>
					<h3 class="font-bold text-xl mb-1">Checkered Vans</h3>
					<p class="text-white/90">The only acceptable footwear. Non-negotiable.</p>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<div class="text-3xl">🎸</div>
				<div>
					<h3 class="font-bold text-xl mb-1">Classic Punk</h3>
					<p class="text-white/90">Dead Kennedys, Black Flag, NOFX. Soundtrack of the kitchen.</p>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<div class="text-3xl">🌮</div>
				<div>
					<h3 class="font-bold text-xl mb-1">Late Night Tacos</h3>
					<p class="text-white/90">The original inspiration. Still the best research method.</p>
				</div>
			</div>

			<div class="flex items-start gap-4">
				<div class="text-3xl">🏄</div>
				<div>
					<h3 class="font-bold text-xl mb-1">Dawn Patrol</h3>
					<p class="text-white/90">Best ideas happen in the water before sunrise.</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Values -->
	<div class="grid md:grid-cols-3 gap-6 mb-12">
		<div
			use:inview
			oninview_enter={onValues1InView}
			use:cheeseStretch
			class="bg-white rounded-xl p-6 border-2 border-nacho-300 text-center"
			style="transform: translateY({$values1Y}px); opacity: {$values1Opacity};"
		>
			<div class="text-4xl mb-3">🤝</div>
			<h3 class="font-display text-xl font-bold text-gray-800 mb-2">Community First</h3>
			<p class="text-gray-600 text-sm">
				We hire local, source local, and give back to the skate/surf communities that raised us.
			</p>
		</div>

		<div
			use:inview
			oninview_enter={onValues2InView}
			use:cheeseStretch
			class="bg-white rounded-xl p-6 border-2 border-nacho-300 text-center"
			style="transform: translateY({$values2Y}px); opacity: {$values2Opacity};"
		>
			<div class="text-4xl mb-3">🌱</div>
			<h3 class="font-display text-xl font-bold text-gray-800 mb-2">Sustainable</h3>
			<p class="text-gray-600 text-sm">
				Real ingredients, recyclable packaging, minimal waste. Good cheese shouldn't trash the
				planet.
			</p>
		</div>

		<div
			use:inview
			oninview_enter={onValues3InView}
			use:cheeseStretch
			class="bg-white rounded-xl p-6 border-2 border-nacho-300 text-center"
			style="transform: translateY({$values3Y}px); opacity: {$values3Opacity};"
		>
			<div class="text-4xl mb-3">💯</div>
			<h3 class="font-display text-xl font-bold text-gray-800 mb-2">Authenticity</h3>
			<p class="text-gray-600 text-sm">
				No fake hype, no corporate speak. Just honest cheese made by real people.
			</p>
		</div>
	</div>

	<!-- Contact CTA -->
	<div
		use:inview
		oninview_enter={onCtaInView}
		class="bg-nacho-100 rounded-2xl p-8 text-center"
		style="opacity: {$ctaOpacity};"
	>
		<h2 class="font-display text-3xl font-bold text-gray-800 mb-4">Let's Connect</h2>
		<p class="text-gray-700 mb-6">
			Got questions? Want to collab? Just want to talk about cheese and skateboarding?
		</p>
		<div class="flex flex-col sm:flex-row gap-4 justify-center">
			<a
				href="mailto:tim@timsnachocheese.com"
				use:cheeseStretch
				class="inline-block px-8 py-3 bg-nacho-500 text-white font-bold rounded-full hover:bg-nacho-600 transition-colors motion-reduce:transition-none"
			>
				Email Tim
			</a>
			<a
				href="/blog"
				use:cheeseStretch
				class="inline-block px-8 py-3 bg-white text-nacho-600 font-bold rounded-full hover:bg-gray-100 transition-colors motion-reduce:transition-none border-2 border-nacho-300"
			>
				Read the Blog
			</a>
		</div>
	</div>
</div>

<style>
	.prose h2 {
		margin-top: 0;
	}
</style>

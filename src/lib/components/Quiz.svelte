<script lang="ts">
	import { spring } from 'svelte/motion';
	import { questions, quizResults, type Answer } from '$lib/data/quiz';
	import { flavors } from '$lib/data/flavors';
	import { bouncySpring, prefersReducedMotion } from '$lib/utils/animations';
	import { cheeseStretch } from '$lib/actions/cheese-stretch';

	// Quiz state
	let started = $state(false);
	let currentQuestion = $state(0);
	let scores = $state<Record<string, number>>({
		'white-cheese': 0,
		'orange-spice': 0,
		'mozz-pure': 0,
		'cheddar-beddar': 0,
		'mega-spice': 0
	});

	// Computed values
	let isComplete = $derived(started && currentQuestion >= questions.length);
	let winner = $derived.by(() => {
		if (!isComplete) return null;
		const entries = Object.entries(scores);
		if (entries.length === 0) return null;
		return entries.sort(([, a], [, b]) => b - a)[0][0];
	});

	// Transition springs
	let questionOpacity = bouncySpring(0);
	let questionX = bouncySpring(20);
	let resultScale = bouncySpring(0);

	// Animate question transitions
	$effect(() => {
		if (started && !isComplete) {
			// Reference currentQuestion to track changes
			currentQuestion;

			const reduced = prefersReducedMotion();
			if (reduced) {
				questionOpacity.set(1, { hard: true });
				questionX.set(0, { hard: true });
			} else {
				// Reset and animate in
				questionOpacity.set(0, { hard: true });
				questionX.set(20, { hard: true });
				setTimeout(() => {
					questionOpacity.set(1);
					questionX.set(0);
				}, 10);
			}
		}
	});

	// Animate result reveal
	$effect(() => {
		if (isComplete) {
			const reduced = prefersReducedMotion();
			if (reduced) {
				resultScale.set(1, { hard: true });
			} else {
				resultScale.set(0, { hard: true });
				setTimeout(() => {
					resultScale.set(1);
				}, 100);
			}
		}
	});

	function startQuiz() {
		started = true;
	}

	function selectAnswer(answer: Answer) {
		// Add scores for this answer
		Object.entries(answer.scores).forEach(([flavorId, points]) => {
			scores[flavorId] = (scores[flavorId] || 0) + points;
		});
		// Move to next question
		currentQuestion++;
	}

	function resetQuiz() {
		started = false;
		currentQuestion = 0;
		scores = {
			'white-cheese': 0,
			'orange-spice': 0,
			'mozz-pure': 0,
			'cheddar-beddar': 0,
			'mega-spice': 0
		};
	}
</script>

<div class="max-w-2xl mx-auto py-8 px-4">
	{#if !started}
		<!-- Intro Screen -->
		<div class="text-center">
			<div class="text-7xl mb-6">🧀</div>
			<h1 class="font-display text-5xl md:text-6xl font-bold text-nacho-600 mb-4">
				Which Tim's Cheese Are You?
			</h1>
			<p class="text-xl text-gray-700 mb-8">
				Answer 7 totally scientific questions to find your perfect match
			</p>
			<button
				use:cheeseStretch
				onclick={startQuiz}
				class="px-8 py-4 bg-gradient-to-r from-nacho-400 to-nacho-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-2xl transition-shadow motion-reduce:transition-none"
			>
				Let's Go! 🚀
			</button>
		</div>
	{:else if !isComplete}
		<!-- Questions Screen -->
		<div>
			<!-- Progress bar -->
			<div class="mb-8">
				<div class="flex justify-between text-sm text-gray-600 mb-2">
					<span>Question {currentQuestion + 1} of {questions.length}</span>
					<span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
				</div>
				<div class="h-3 bg-cream-100 rounded-full overflow-hidden">
					<div
						class="h-full bg-nacho-500 rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none"
						style="width: {((currentQuestion + 1) / questions.length) * 100}%"
					></div>
				</div>
			</div>

			<!-- Question content -->
			<div
				style="opacity: {$questionOpacity}; transform: translateX({$questionX}px)"
				class="transition-opacity"
			>
				<div class="text-center mb-8">
					<div class="text-6xl mb-4">{questions[currentQuestion].emoji}</div>
					<h2 class="font-display text-3xl md:text-4xl font-bold text-gray-800">
						{questions[currentQuestion].question}
					</h2>
				</div>

				<!-- Answer buttons -->
				<div class="grid md:grid-cols-2 gap-4">
					{#each questions[currentQuestion].answers as answer}
						<button
							use:cheeseStretch
							onclick={() => selectAnswer(answer)}
							class="bg-white border-2 border-transparent hover:border-nacho-300 hover:bg-nacho-50 rounded-xl p-6 text-left transition-[colors,box-shadow] motion-reduce:transition-none shadow-md hover:shadow-lg"
						>
							<p class="font-medium text-gray-800 text-lg">{answer.text}</p>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{:else if winner}
		<!-- Result Screen -->
		<div class="text-center" style="transform: scale({$resultScale})">
			<div class="text-8xl mb-6">{quizResults[winner].emoji}</div>
			<p class="text-xl text-gray-600 mb-2">You are...</p>
			<h2 class="font-display text-5xl md:text-6xl font-bold text-nacho-600 mb-4">
				{quizResults[winner].title}
			</h2>
			<p class="text-xl text-gray-700 mb-6 leading-relaxed">
				{quizResults[winner].description}
			</p>
			<p class="text-lg italic text-gray-600 mb-8">
				{quizResults[winner].vibe}
			</p>

			<!-- Matched flavor info -->
			{#if winner}
				{@const matchedFlavor = flavors.find((f) => f.id === winner)}
				{#if matchedFlavor}
					<div class="bg-{matchedFlavor.color}-100 rounded-2xl p-8 mb-8 border-2 border-{matchedFlavor.color}-300">
						<div class="text-5xl mb-3">{matchedFlavor.emoji}</div>
						<h3 class="font-display text-2xl font-bold text-gray-800 mb-2">
							{matchedFlavor.name}
						</h3>
						<p class="text-lg text-{matchedFlavor.color}-700 font-medium mb-3">
							{matchedFlavor.tagline}
						</p>
						<p class="text-gray-700">{matchedFlavor.description}</p>
					</div>
				{/if}
			{/if}

			<!-- CTA Buttons -->
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a
					href="/products"
					use:cheeseStretch
					class="px-8 py-4 bg-gradient-to-r from-nacho-400 to-nacho-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-2xl transition-shadow motion-reduce:transition-none"
				>
					See Your Cheese 🧀
				</a>
				<button
					use:cheeseStretch
					onclick={resetQuiz}
					class="px-8 py-4 bg-white border-2 border-nacho-400 text-nacho-600 font-bold text-lg rounded-full shadow-md hover:shadow-lg transition-shadow motion-reduce:transition-none"
				>
					Try Again 🔄
				</button>
			</div>
		</div>
	{/if}
</div>

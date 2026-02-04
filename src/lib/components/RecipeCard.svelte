<script lang="ts">
	import { cheeseStretch } from '$lib/actions/cheese-stretch';

	type RecipeData = {
		title: string;
		prepTime: string;
		cookTime: string;
		servings: number;
		ingredients: string[];
		instructions: string[];
	};

	let { recipe }: { recipe: RecipeData } = $props();

	let loading = $state(false);

	async function handleDownload() {
		loading = true;
		try {
			// Dynamic import to avoid SSR issues with jsPDF (browser-only library)
			const { generateRecipeCard } = await import('$lib/utils/pdf-generator');
			generateRecipeCard(recipe);
		} catch (error) {
			console.error('Failed to generate PDF:', error);
		} finally {
			// Keep loading state briefly to give visual feedback
			setTimeout(() => {
				loading = false;
			}, 500);
		}
	}
</script>

<button
	class="w-full bg-nacho-500 hover:bg-nacho-600 text-white font-bold py-3 px-6 rounded-full transition-colors motion-reduce:transition-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
	onclick={handleDownload}
	disabled={loading}
	use:cheeseStretch
>
	{#if loading}
		<svg
			class="animate-spin h-5 w-5"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
		Downloading...
	{:else}
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
			/>
		</svg>
		Download Recipe Card
	{/if}
</button>

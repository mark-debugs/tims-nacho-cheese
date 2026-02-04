<script lang="ts">
	import { enhance } from '$app/forms';

	let email = $state('');
	let status = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let errorMessage = $state('');
</script>

<div class="bg-gradient-to-r from-nacho-400 to-nacho-600 rounded-2xl p-8 text-center text-white">
	<h2 class="font-display text-3xl font-bold mb-4">Stay Cheesy</h2>
	<p class="text-lg mb-6">
		Get the latest stories, flavor drops, and west coast wisdom straight to your inbox.
	</p>

	{#if status === 'success'}
		<div class="max-w-md mx-auto">
			<div class="bg-white/20 rounded-full px-6 py-4 flex items-center justify-center gap-3">
				<svg class="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span class="font-bold">You're in! Stay cheesy.</span>
			</div>
		</div>
	{:else}
		<form
			method="POST"
			action="/newsletter"
			use:enhance={() => {
				status = 'loading';
				return async ({ result }) => {
					if (result.type === 'success') {
						status = 'success';
						email = '';
					} else if (result.type === 'failure') {
						status = 'error';
						const error = (result.data as { error?: string })?.error;
						errorMessage = error || 'Something went wrong';
					}
					// Do NOT call update() -- prevents full page navigation to /newsletter
				};
			}}
		>
			<div class="max-w-md mx-auto">
				<div class="flex gap-2 mb-2">
					<input
						type="email"
						name="email"
						bind:value={email}
						required
						placeholder="your@email.com"
						class="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
						disabled={status === 'loading'}
					/>
					<button
						type="submit"
						class="px-8 py-3 bg-white text-nacho-600 font-bold rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
						disabled={status === 'loading'}
					>
						{status === 'loading' ? 'Subscribing...' : 'Subscribe'}
					</button>
				</div>
				{#if status === 'error'}
					<p class="text-red-200 text-sm mt-2">{errorMessage}</p>
				{/if}
			</div>
		</form>
	{/if}
</div>

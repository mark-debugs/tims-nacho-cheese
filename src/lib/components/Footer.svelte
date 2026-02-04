<script lang="ts">
	import SocialLinks from '$lib/components/SocialLinks.svelte';
</script>

<footer class="bg-cream-50 border-t-4 border-nacho-400 py-8 mt-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col md:flex-row items-center justify-between gap-4">
			<div class="text-center md:text-left">
				<p class="text-nacho-600 font-display text-xl font-bold">Tim's Nacho Cheese</p>
				<p class="text-gray-600 text-sm mt-1">
					© {new Date().getFullYear()} — The cheesiest site on the internet
				</p>
			</div>

			<SocialLinks />
		</div>
	</div>
</footer>

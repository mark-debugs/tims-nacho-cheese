<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';

	let isOpen = $state(false);

	// Navigation links
	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/products', label: 'Products' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/merch', label: 'Merch' },
		{ href: '/about', label: 'About' }
	];

	function toggleDrawer() {
		isOpen = !isOpen;
	}

	function closeDrawer() {
		isOpen = false;
	}

	// Determine if a link is active
	function isActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<!-- Fixed header with brand and hamburger -->
<div class="fixed top-0 left-0 right-0 z-50 bg-cream-50 border-b-4 border-nacho-400 shadow-md">
	<div class="flex items-center justify-between h-16 px-4">
		<!-- Brand -->
		<a href="/" class="flex items-center gap-2" onclick={closeDrawer}>
			<div class="text-3xl">🧀</div>
			<h1 class="font-display text-xl font-bold text-nacho-600">Tim's Nacho Cheese</h1>
		</a>

		<!-- Hamburger button -->
		<button
			onclick={toggleDrawer}
			class="p-2 rounded-lg hover:bg-nacho-100 transition-colors"
			aria-label="Toggle menu"
			aria-expanded={isOpen}
		>
			<svg class="w-8 h-8 text-nacho-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{#if isOpen}
					<!-- X icon -->
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M6 18L18 6M6 6l12 12"
					/>
				{:else}
					<!-- Hamburger icon -->
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				{/if}
			</svg>
		</button>
	</div>
</div>

<!-- Spacer for fixed header -->
<div class="h-16"></div>

<!-- Backdrop overlay -->
{#if isOpen}
	<div
		transition:fade={{ duration: 200 }}
		class="fixed inset-0 bg-black/50 z-40"
		onclick={closeDrawer}
		role="presentation"
	></div>
{/if}

<!-- Slide-out drawer -->
{#if isOpen}
	<aside
		transition:fly={{ x: -300, duration: 300, easing: quintOut }}
		class="fixed top-0 left-0 bottom-0 w-80 bg-cream-50 z-50 shadow-2xl border-r-4 border-nacho-400 overflow-y-auto"
	>
		<!-- Drawer header -->
		<div class="p-6 border-b-2 border-nacho-200">
			<div class="flex items-center gap-3">
				<div class="text-5xl">🧀</div>
				<div>
					<h2 class="font-display text-2xl font-bold text-nacho-600">Tim's Nacho Cheese</h2>
					<p class="text-sm text-gray-600">West Coast Vibes</p>
				</div>
			</div>
		</div>

		<!-- Navigation links -->
		<nav class="p-4">
			<ul class="space-y-2">
				{#each links as link}
					<li>
						<a
							href={link.href}
							onclick={closeDrawer}
							class="block px-6 py-4 rounded-lg font-bold text-xl transition-all
								{isActive(link.href, $page.url.pathname)
								? 'bg-nacho-500 text-white shadow-lg'
								: 'bg-white text-gray-700 hover:bg-nacho-100 hover:text-nacho-700'}"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Footer section in drawer -->
		<div class="p-6 mt-8 border-t-2 border-nacho-200">
			<p class="text-sm text-gray-600 text-center">The cheesiest site on the internet</p>
			<div class="flex justify-center gap-4 mt-4">
				<a
					href="https://instagram.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-gray-600 hover:text-nacho-600"
					aria-label="Instagram"
				>
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
						/>
					</svg>
				</a>
				<a
					href="https://twitter.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-gray-600 hover:text-nacho-600"
					aria-label="Twitter"
				>
					<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
						/>
					</svg>
				</a>
			</div>
		</div>
	</aside>
{/if}

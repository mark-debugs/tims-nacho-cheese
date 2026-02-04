<script lang="ts">
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	let showNav = $state(true);
	let lastScrollY = $state(0);

	// Track scroll position to hide/show nav
	function handleScroll() {
		if (!browser) return;

		const currentScrollY = window.scrollY;

		// Show nav when scrolling up OR near top
		if (currentScrollY < lastScrollY || currentScrollY < 50) {
			showNav = true;
		} else if (currentScrollY > lastScrollY && currentScrollY > 100) {
			// Hide nav when scrolling down (after scrolling past 100px)
			showNav = false;
		}

		lastScrollY = currentScrollY;
	}

	// Navigation links
	const links = [
		{ href: '/products', label: 'Products' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/merch', label: 'Merch' },
		{ href: '/about', label: 'About' }
	];

	// Determine if a link is active
	function isActive(href: string, pathname: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}
</script>

<svelte:window onscroll={handleScroll} />

{#if showNav}
	<nav
		transition:fly={{ y: -100, duration: 300, easing: quintOut }}
		class="fixed top-0 left-0 right-0 z-50 bg-cream-50 border-b-4 border-nacho-400 shadow-md"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between h-20">
				<!-- Brand logo/name -->
				<a href="/" class="flex items-center gap-3 group">
					<div class="text-5xl group-hover:scale-110 transition-transform motion-reduce:transition-none">🧀</div>
					<div>
						<h1 class="font-display text-2xl md:text-3xl font-bold text-nacho-600 leading-tight">
							Tim's Nacho Cheese
						</h1>
						<p class="text-xs text-gray-600 hidden sm:block">West Coast Vibes</p>
					</div>
				</a>

				<!-- Desktop navigation links -->
				<div class="hidden md:flex items-center gap-8">
					{#each links as link}
						<a
							href={link.href}
							class="font-bold text-lg uppercase tracking-wide transition-colors duration-200 motion-reduce:transition-none relative group
								{isActive(link.href, $page.url.pathname)
								? 'text-nacho-600'
								: 'text-gray-700 hover:text-nacho-500'}"
						>
							{link.label}
							<!-- Active indicator underline -->
							{#if isActive(link.href, $page.url.pathname)}
								<span
									class="absolute -bottom-1 left-0 right-0 h-1 bg-nacho-500 rounded-full"
								></span>
							{:else}
								<span
									class="absolute -bottom-1 left-0 right-0 h-1 bg-nacho-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform motion-reduce:transition-none origin-left"
								></span>
							{/if}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</nav>
{/if}

<!-- Spacer to prevent content from hiding under fixed nav -->
<div class="h-20"></div>

# Phase 4: Merch & Polish - Research

**Researched:** 2026-02-04
**Domain:** Front-end performance optimization, product showcase design, accessibility
**Confidence:** HIGH

## Summary

Phase 4 focuses on three distinct areas: merch product showcasing without e-commerce, social media integration, and production-ready performance optimization. The research reveals that SvelteKit provides excellent built-in performance features that achieve 90+ Lighthouse scores with proper implementation. The stack already in use (SvelteKit, Tailwind CSS v3, Svelte 5) is well-suited for this phase.

Key findings indicate that achieving 90+ Lighthouse scores requires attention to image optimization (the biggest performance factor), proper animation handling with reduced-motion support, and careful use of performance hints like `will-change`. The merch showcase can follow established CSS Grid patterns with responsive design, while social media integration requires careful accessibility implementation with proper ARIA labels and visible text alternatives.

**Primary recommendation:** Focus on image optimization first (use @sveltejs/enhanced-img for build-time optimization), implement motion-safe/motion-reduce utilities throughout existing animations, and follow the "showcase gallery" pattern for merch products (similar to the existing flavor cards structure).

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @sveltejs/enhanced-img | Latest | Build-time image optimization | Official SvelteKit solution, generates responsive image sets with AVIF/WebP |
| Tailwind CSS v3 | 3.x | Utility-first CSS with motion utilities | Already in use, provides motion-safe/motion-reduce modifiers |
| Svelte 5 | 5.x | UI framework | Already in use, produces 40-50% smaller bundles than Svelte 4 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vite-plugin-imagetools | Latest | Alternative image optimization | If @sveltejs/enhanced-img doesn't meet needs |
| sharp | Latest | Image processing (backend) | Server-side image operations (dependency of enhanced-img) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @sveltejs/enhanced-img | CDN solution (Cloudinary, imgix) | CDN better for dynamic/user-uploaded images; enhanced-img better for static assets at build time |
| Native lazy loading | Intersection Observer | Native loading="lazy" sufficient for modern browsers; custom observers for more control |

**Installation:**
```bash
bun add -D @sveltejs/enhanced-img
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── routes/
│   ├── merch/
│   │   ├── +page.svelte           # Main merch showcase
│   │   └── +page.server.ts        # Product data loading
│   └── +layout.svelte              # Add social links to footer
├── lib/
│   ├── components/
│   │   ├── ProductCard.svelte      # Individual product display
│   │   ├── ProductGrid.svelte      # Responsive grid layout
│   │   └── SocialLinks.svelte      # Accessible social icons
│   ├── data/
│   │   └── products.ts             # Merch product data
│   └── utils/
│       └── animations.ts           # Already exists, add motion checks
└── static/
    └── images/
        └── merch/                  # Product images
```

### Pattern 1: Responsive Product Grid
**What:** CSS Grid with auto-fit columns that collapse gracefully on mobile
**When to use:** Displaying multiple products (apparel, skate decks, stickers, pins, accessories)
**Example:**
```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Realizing_common_layouts_using_grids */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
}
```

**Tailwind implementation:**
```svelte
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
  {#each products as product}
    <ProductCard {product} />
  {/each}
</div>
```

### Pattern 2: Optimized Image with Enhanced-img
**What:** Build-time image optimization with responsive sizes and modern formats
**When to use:** All product images, especially hero/above-the-fold images
**Example:**
```svelte
<!-- Source: https://svelte.dev/docs/kit/images -->
<script>
  import productImage from '$lib/assets/merch/tshirt.jpg?enhanced';
</script>

<!-- Above-the-fold/LCP image -->
<enhanced:img
  src={productImage}
  alt="MEGA SPICE T-Shirt"
  fetchpriority="high"
  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
/>

<!-- Below-the-fold images -->
<enhanced:img
  src={productImage}
  alt="MEGA SPICE Sticker Pack"
  loading="lazy"
  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
/>
```

### Pattern 3: Accessible Social Links
**What:** Social media icon links with visible text or proper ARIA labels
**When to use:** Footer, header, contact section
**Example:**
```svelte
<!-- Source: https://a11y-101.com/development/icons-and-links -->
<nav aria-label="Social media links" class="flex gap-4">
  <!-- Best: Visible text with icon -->
  <a href="https://instagram.com/megaspice" class="flex items-center gap-2">
    <svg aria-hidden="true" class="size-6"><!-- Instagram icon --></svg>
    <span>Instagram</span>
  </a>

  <!-- Alternative: Visually hidden text -->
  <a href="https://tiktok.com/@megaspice" class="relative">
    <svg aria-hidden="true" class="size-6"><!-- TikTok icon --></svg>
    <span class="sr-only">TikTok</span>
  </a>

  <!-- Last resort: ARIA label -->
  <a href="https://twitter.com/megaspice" aria-label="Follow us on Twitter">
    <svg aria-hidden="true" class="size-6"><!-- Twitter icon --></svg>
  </a>
</nav>
```

### Pattern 4: Motion-Safe Animations
**What:** Animations that respect prefers-reduced-motion preferences
**When to use:** All animations and transitions throughout the site
**Example:**
```svelte
<!-- Source: https://tailwindcss.com/docs/animation -->
<script>
  import { spring } from 'svelte/motion';

  // Check for reduced motion preference
  let prefersReducedMotion = false;
  $: if (typeof window !== 'undefined') {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  const scale = spring(1, {
    stiffness: prefersReducedMotion ? 1 : 0.1,
    damping: prefersReducedMotion ? 1 : 0.3
  });
</script>

<!-- Tailwind approach: use motion-safe modifier -->
<button class="transition-transform duration-300 motion-safe:hover:scale-105 motion-reduce:transition-none">
  Buy Now
</button>

<!-- CSS approach: media query -->
<style>
  .animate-card {
    animation: slideIn 0.5s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-card {
      animation: fadeIn 0.3s ease-out; /* Simpler animation */
    }
  }
</style>
```

### Pattern 5: 60fps Mobile Animations
**What:** GPU-accelerated animations using transform and opacity only
**When to use:** All animations, especially on mobile
**Example:**
```css
/* Source: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance */

/* ✅ GOOD: GPU-accelerated properties */
.product-card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.product-card:hover {
  transform: translateY(-8px) scale(1.02);
}

/* ❌ BAD: Triggers layout recalculation */
.product-card-bad {
  transition: top 0.3s ease, height 0.3s ease;
}
.product-card-bad:hover {
  top: -8px;
  height: 120%;
}
```

### Anti-Patterns to Avoid
- **Overusing will-change:** Apply will-change sparingly via JavaScript, not in stylesheets. Excessive use increases memory usage and degrades performance. Use as last resort only for existing performance problems.
- **Forgetting image dimensions:** Always set width/height on images to prevent Cumulative Layout Shift (CLS). @sveltejs/enhanced-img does this automatically.
- **Loading all images eagerly:** Use loading="lazy" for below-the-fold images. Only set fetchpriority="high" for LCP image.
- **Animating layout properties:** Never animate width, height, top, left, margin, padding on mobile. Use transform instead.
- **Adding motion without reduced-motion fallback:** All animations must respect prefers-reduced-motion. Use motion-safe/motion-reduce modifiers.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive image generation | Manual srcset/sizes with multiple image files | @sveltejs/enhanced-img | Handles format conversion (AVIF, WebP), multiple sizes, srcset generation, dimensions, and build-time optimization automatically |
| Lazy loading images | Custom Intersection Observer logic | Native loading="lazy" attribute | Browser-native, performant, handles edge cases (preloading, priority hints, etc.) |
| Reduced motion detection | Manual matchMedia checks throughout codebase | Tailwind motion-safe/motion-reduce modifiers | Declarative, centralized, works with SSR, handles media query changes |
| Social media icons | Custom SVG implementations | Existing icon libraries (Lucide, Heroicons) | Consistent sizing, accessibility attributes, optimized paths |
| Image optimization service | Custom server-side image processing | @sveltejs/enhanced-img (build time) or CDN (dynamic) | Complex edge cases: EXIF stripping, format detection, browser support, caching headers |

**Key insight:** Image optimization is deceptively complex. @sveltejs/enhanced-img handles format selection, browser compatibility, size generation, EXIF stripping, and caching automatically. Building this manually means reimplementing hundreds of edge cases that the community has already solved.

## Common Pitfalls

### Pitfall 1: Images Tanking Lighthouse Scores
**What goes wrong:** Adding images drops Lighthouse performance score by 20-30 points
**Why it happens:** Large unoptimized images are the #1 cause of poor Lighthouse scores. One developer noted a 25% decrease in Lighthouse score after introducing images from backend
**How to avoid:**
- Use @sveltejs/enhanced-img for all static images
- Set explicit width/height to prevent CLS
- Use loading="lazy" for below-the-fold images
- Set fetchpriority="high" only for LCP image
- Compress images before adding to project
**Warning signs:** LCP > 2.5s, large content download size, "Properly size images" audit failing

### Pitfall 2: will-change Overuse Degrading Performance
**What goes wrong:** Adding will-change everywhere makes animations slower, not faster
**Why it happens:** will-change creates compositor layers with memory overhead. Browser already optimizes well; excessive will-change makes it worse
**How to avoid:**
- Use will-change as last resort for proven performance problems
- Apply dynamically via JavaScript, not in stylesheets
- Remove after animation completes
- Test without it first - browser may already optimize
**Warning signs:** High memory usage, janky animations on mobile, GPU process consuming excessive resources

### Pitfall 3: Forgetting Reduced Motion for Accessibility
**What goes wrong:** Users with vestibular disorders experience nausea, dizziness from animations
**Why it happens:** Developers test with default system settings, don't consider motion sensitivity
**How to avoid:**
- Use motion-safe: prefix for all Tailwind animations
- Provide alternative animations (fade instead of scale/rotate)
- Test with prefers-reduced-motion enabled in DevTools
- Don't remove all animations - use subtle alternatives
**Warning signs:** WCAG 2.3.3 Animation from Interactions failure, accessibility audits flagging motion

### Pitfall 4: Layout Shift from Unsized Images
**What goes wrong:** Images load and cause page content to jump (CLS penalty)
**Why it happens:** Browser doesn't know image dimensions until loaded, reserves no space
**How to avoid:**
- Always set width and height attributes on images
- @sveltejs/enhanced-img does this automatically
- For dynamic images, use aspect-ratio CSS or wrapper with padding-bottom trick
- Reserve space with skeleton placeholders
**Warning signs:** CLS score > 0.1, Lighthouse "Image elements do not have explicit width and height" audit

### Pitfall 5: Expensive Animations on Mobile
**What goes wrong:** Smooth desktop animations are janky/stuttery on mobile devices
**Why it happens:** Mobile devices have less GPU power; animating layout properties forces expensive recalculations
**How to avoid:**
- Only animate transform and opacity (GPU-accelerated)
- Target 16.7ms per frame (60fps)
- Test on real mobile devices, not desktop DevTools
- Keep animation duration 200-300ms (sweet spot)
- Reduce complexity for older devices with media queries
**Warning signs:** Animation frame rate < 60fps, visible stuttering on mobile, high CPU usage during animations

### Pitfall 6: Lighthouse Testing in Dev Mode
**What goes wrong:** Lighthouse scores are 20-40 points lower than production
**Why it happens:** Dev mode includes HMR, source maps, unminified code, no optimizations
**How to avoid:**
- Always test Lighthouse in preview mode: `bun run build && bun run preview`
- Use production build for accurate scoring
- Test on real devices, not just desktop Chrome
- Use Chrome DevTools Lighthouse, not just PageSpeed Insights
**Warning signs:** Performance score < 50 in dev, dramatically better in preview

## Code Examples

Verified patterns from official sources:

### Merch Product Showcase Component
```svelte
<!-- src/lib/components/ProductCard.svelte -->
<script lang="ts">
  import type { Product } from '$lib/data/products';

  export let product: Product;

  // Lazy import for images
  const imageModules = import.meta.glob('$lib/assets/merch/*.{jpg,png,webp}', {
    query: '?enhanced',
    import: 'default'
  });
</script>

<article class="group relative">
  <div class="aspect-square overflow-hidden rounded-lg bg-gray-100">
    <enhanced:img
      src={product.image}
      alt={product.name}
      loading={product.priority ? undefined : "lazy"}
      fetchpriority={product.priority ? "high" : undefined}
      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
      class="size-full object-cover object-center transition-transform duration-300 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
    />
  </div>

  <div class="mt-4">
    <h3 class="text-lg font-bold">{product.name}</h3>
    <p class="mt-1 text-sm text-gray-600">{product.category}</p>
    {#if product.description}
      <p class="mt-2 text-sm">{product.description}</p>
    {/if}
  </div>
</article>
```

### Product Data Structure
```typescript
// src/lib/data/products.ts
export interface Product {
  id: string;
  name: string;
  category: 'apparel' | 'skate-decks' | 'stickers' | 'pins' | 'accessories';
  image: string; // Import path
  description?: string;
  priority?: boolean; // For LCP image
}

export const products: Product[] = [
  {
    id: 'tshirt-og',
    name: 'OG MEGA SPICE T-Shirt',
    category: 'apparel',
    image: '/src/lib/assets/merch/tshirt-og.jpg',
    description: 'Classic fit tee with bold MEGA SPICE logo',
    priority: true // LCP image on merch page
  },
  {
    id: 'deck-flame',
    name: 'Flame Skate Deck',
    category: 'skate-decks',
    image: '/src/lib/assets/merch/deck-flame.jpg',
    description: '8.25" deck with heat-reactive finish'
  },
  // ... more products
];
```

### Accessible Social Links Component
```svelte
<!-- src/lib/components/SocialLinks.svelte -->
<!-- Source: https://a11y-101.com/development/icons-and-links -->
<script lang="ts">
  interface SocialLink {
    name: string;
    url: string;
    icon: string; // SVG path or component
  }

  export let links: SocialLink[];
  export let showLabels = false;
</script>

<nav aria-label="Social media links" class="flex gap-4">
  {#each links as link}
    <a
      href={link.url}
      class="flex items-center gap-2 transition-colors duration-200 hover:text-primary motion-reduce:transition-none"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        aria-hidden="true"
        class="size-6"
        fill="currentColor"
      >
        <use href={link.icon} />
      </svg>
      {#if showLabels}
        <span>{link.name}</span>
      {:else}
        <span class="sr-only">{link.name}</span>
      {/if}
    </a>
  {/each}
</nav>

<style>
  /* Tailwind sr-only equivalent if not using Tailwind */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>
```

### Reduced Motion Detection Utility
```typescript
// src/lib/utils/motion.ts
import { readable } from 'svelte/store';

export const prefersReducedMotion = readable(false, (set) => {
  if (typeof window === 'undefined') return;

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Set initial value
  set(mediaQuery.matches);

  // Listen for changes
  const handler = (e: MediaQueryListEvent) => set(e.matches);
  mediaQuery.addEventListener('change', handler);

  return () => mediaQuery.removeEventListener('change', handler);
});

// Helper for animation configuration
export function getAnimationConfig(reducedMotion: boolean) {
  return {
    stiffness: reducedMotion ? 1 : 0.1,
    damping: reducedMotion ? 1 : 0.3,
    duration: reducedMotion ? 100 : 300
  };
}
```

### Performance-Optimized Animation Action
```typescript
// Add to existing src/lib/utils/animations.ts
import { prefersReducedMotion } from './motion';

export function smoothScale(node: HTMLElement, {
  scale = 1.05,
  duration = 300
}: { scale?: number; duration?: number } = {}) {
  let reduced = false;
  const unsubscribe = prefersReducedMotion.subscribe(value => reduced = value);

  return {
    duration: reduced ? 0 : duration,
    css: (t: number) => {
      if (reduced) return '';
      const s = 1 + (scale - 1) * t;
      return `transform: scale(${s});`;
    },
    destroy() {
      unsubscribe();
    }
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| First Meaningful Paint (FMP) | Largest Contentful Paint (LCP) | 2020 | LCP is more stable and measurable; focus on largest visible element |
| First Input Delay (FID) | Interaction to Next Paint (INP) | March 2024 | INP measures all interactions, not just first; better reflects real user experience |
| Manual image optimization | @sveltejs/enhanced-img | SvelteKit 1.x | Build-time optimization with automatic format conversion and responsive sizes |
| prefers-reduced-motion: no-motion | prefers-reduced-motion: reduce | Always | Value is 'reduce', not 'none' - provide alternative animations, don't remove all |
| transform: translateZ(0) hack | will-change (sparingly) | Modern browsers | Use will-change only for proven perf issues, remove after animation completes |

**Deprecated/outdated:**
- **First Meaningful Paint (FMP):** Replaced by LCP in Core Web Vitals; focus on LCP optimization instead
- **document.write for analytics:** Use server-side analytics (Cloudflare, Vercel, Netlify) or Partytown for third-party scripts
- **Offscreen images audit:** Removed from Lighthouse; native lazy loading with loading="lazy" is now standard
- **Large bundle sizes with Svelte 4:** Svelte 5 produces 40-50% smaller bundles; upgrade if not already done

## Open Questions

Things that couldn't be fully resolved:

1. **Merch product data source**
   - What we know: Products stored in code for v1 (no CMS per prior decisions)
   - What's unclear: Exact content source - will user provide product data, or should we use placeholder content?
   - Recommendation: Create products.ts with placeholder data structure, let user populate with real products during implementation

2. **Social media account URLs**
   - What we know: Links should connect to Instagram, TikTok, and other channels
   - What's unclear: Actual account URLs not provided
   - Recommendation: Use placeholder URLs (https://instagram.com/brandname) with TODO comments for user to replace

3. **Exact animation performance targets for mobile**
   - What we know: "Smooth" on mobile is success criteria; 60fps is goal
   - What's unclear: What "smooth" means to user - is 55fps acceptable on older devices?
   - Recommendation: Target 60fps on devices < 3 years old; degrade gracefully for older devices with media queries

4. **Merch category priority**
   - What we know: Five categories (apparel, skate decks, stickers, pins, accessories)
   - What's unclear: Display order and emphasis for each category
   - Recommendation: Show all categories equally unless user specifies priority during implementation

## Sources

### Primary (HIGH confidence)
- [SvelteKit Performance Documentation](https://svelte.dev/docs/kit/performance) - Official optimization techniques
- [SvelteKit Images Documentation](https://svelte.dev/docs/kit/images) - Official @sveltejs/enhanced-img guide
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Syntax and WCAG requirements
- [MDN will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change) - Best practices and warnings
- [Tailwind CSS Animation Documentation](https://tailwindcss.com/docs/animation) - Motion-safe/motion-reduce modifiers
- [MDN CSS Grid Layouts](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Realizing_common_layouts_using_grids) - Responsive grid patterns
- [MDN CSS Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance) - 60fps optimization

### Secondary (MEDIUM confidence)
- [Google Core Web Vitals Documentation](https://developers.google.com/search/docs/appearance/core-web-vitals) - LCP, CLS, INP standards
- [W3C WCAG Animation Techniques](https://www.w3.org/WAI/WCAG21/Techniques/css/C39) - Accessibility requirements
- [A11Y Icons and Links Guide](https://a11y-101.com/development/icons-and-links) - Social media accessibility patterns
- [SitePoint 60fps Mobile Animations](https://www.sitepoint.com/achieve-60-fps-mobile-animations-with-css3/) - GPU acceleration techniques
- [LogRocket will-change Usage](https://blog.logrocket.com/when-how-use-css-will-change/) - Performance pitfalls
- [Subframe Product Showcase Examples](https://www.subframe.com/tips/product-showcase-section-design-examples) - Design patterns
- [Request Metrics Image Optimization Guide](https://requestmetrics.com/web-performance/high-performance-images/) - Responsive images best practices
- [GeeksforGeeks Tailwind Motion Utilities](https://www.geeksforgeeks.org/css/how-to-use-motion-safe-and-motion-reduce-in-tailwind-css/) - Motion-safe/motion-reduce usage

### Tertiary (LOW confidence)
- WebSearch results for product showcase galleries - Design inspiration only, not technical implementation
- Community blog posts about Lighthouse optimization - Verify recommendations with official sources during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All recommendations from official SvelteKit/Tailwind documentation
- Architecture: HIGH - Patterns verified with MDN and official framework docs
- Pitfalls: HIGH - Based on official warnings (MDN, SvelteKit docs) and documented common issues
- Performance targets: MEDIUM - 90+ Lighthouse score achievable per official docs, but actual score depends on implementation quality
- Merch showcase patterns: MEDIUM - CSS Grid patterns well-established, but specific product display needs verification with user requirements

**Research date:** 2026-02-04
**Valid until:** 2026-03-04 (30 days - stable technologies with infrequent breaking changes)

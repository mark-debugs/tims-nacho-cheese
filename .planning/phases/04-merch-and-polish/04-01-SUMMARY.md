---
phase: 04-merch-and-polish
plan: 01
subsystem: merch-showcase
tags: [svelte, components, data-modeling, accessibility, social-media]
status: complete
completed: 2026-02-04
duration: 4.8 min

dependencies:
  requires:
    - 02-01-animations-infrastructure
    - 03-01-content-pipeline
  provides:
    - merch-product-data-model
    - product-card-components
    - category-filtering
    - social-links-component
  affects:
    - 04-02-performance

tech-stack:
  added: []
  patterns:
    - data-driven-components
    - category-filtering
    - accessible-social-links

key-files:
  created:
    - src/lib/data/products.ts
    - src/lib/components/ProductCard.svelte
    - src/lib/components/ProductGrid.svelte
    - src/lib/components/SocialLinks.svelte
  modified:
    - src/routes/merch/+page.svelte
    - src/lib/components/Footer.svelte

decisions:
  - id: product-data-structure
    what: Product type with category, gradient, and comingSoon fields
    why: Enables typed data-driven product display with category filtering
    alternatives: Hardcoded HTML, CMS integration
    impact: Clean separation of data and presentation, easy to extend

  - id: inline-social-data
    what: Social links data defined inline in SocialLinks component
    why: Small dataset (4 links), no need for separate data file
    alternatives: Separate data file
    impact: Simpler component structure, less file overhead

  - id: category-filter-pattern
    what: Active/inactive button states with conditional styling
    why: Matches blog category filter pattern, consistent UX
    alternatives: Dropdown, tabs
    impact: Familiar pattern for users, accessible keyboard navigation
---

# Phase 4 Plan 1: Merch Showcase Components Summary

**One-liner:** Componentized merch showcase with 8 products across 5 categories, category filtering, and accessible social media links (Instagram, TikTok, YouTube, X) in footer.

## What Was Built

### Task 1: Merch Data and Components
Created typed product data model and reusable product components:

**products.ts data file:**
- Product type with id, name, category, description, price, emoji, gradient, comingSoon
- 8 products across all 5 required categories:
  - Apparel: Classic Tee, Pullover Hoodie
  - Skate Decks: Skate Deck
  - Stickers: Sticker Pack
  - Pins: Enamel Pin Set
  - Accessories: Dad Hat, Tote Bag, Cheese Koozie
- Categories array with id, label, emoji for filter buttons
- All products marked comingSoon: true

**ProductCard component:**
- Accepts product prop
- Gradient placeholder area (h-64) with large emoji
- Product name, Coming Soon badge, description, price
- cheeseStretch hover effect for playful interaction
- motion-safe/motion-reduce modifiers for accessibility

**ProductGrid component:**
- Category filter buttons (All + 5 categories)
- Active/inactive button states (nacho-500 bg when active)
- Filters products by selected category using derived state
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Scroll-triggered entrance animations (inview + elastic bounce)
- Staggered delays (100ms per card) respecting reducedMotion

**Commit:** c8b755b

### Task 2: Merch Page and Social Links
Integrated components and added accessible social links:

**SocialLinks component:**
- 4 social platforms: Instagram, TikTok, YouTube, X
- Inline data definition (small dataset)
- Each link: target="_blank" rel="noopener noreferrer"
- Accessible: aria-label on link, sr-only span for screen readers
- SVG icons with aria-hidden="true"
- Hover: text-nacho-600 with motion-reduce modifier
- TODO comments for real account URLs

**Updated Footer:**
- Replaced hardcoded social SVGs with SocialLinks component
- Kept existing layout structure
- Now includes TikTok (was missing)

**Rewritten Merch Page:**
- Replaced 6 hardcoded product cards with ProductGrid component
- Added scroll animations to header, banner, and philosophy sections
- Uses inview action + scale transition + elasticOut easing
- Staggered delays (0/100/150ms) respecting reducedMotion
- Kept existing "Merch Drops Coming Soon" banner with email form
- Kept existing "Our Merch Philosophy" section (3 columns)

**Commit:** cc675a9

## Decisions Made

**Product Data Structure:**
Chose to include `gradient` field directly in product data (e.g. "from-nacho-300 to-nacho-500") for placeholder backgrounds. Alternative was to define gradients separately or use category-based colors. This approach gives each product a unique visual identity while keeping data self-contained.

**Inline Social Data:**
Defined social links array inline in SocialLinks component rather than separate data file. With only 4 links that rarely change, a dedicated data file adds unnecessary indirection. If we expand to 10+ platforms or need dynamic loading, we'll extract.

**Category Filter Pattern:**
Matched the blog category filter pattern (active/inactive button states) for consistency. Users familiar with blog filtering will immediately understand merch filtering. Alternative was dropdown or tabs, but buttons provide better discoverability.

## Deviations from Plan

None - plan executed exactly as written.

## Code Quality

**Type Safety:**
- All components use Svelte 5 runes ($props, $state, $derived)
- Product and ProductCategory types exported from data file
- svelte-check passes with 0 errors (9 pre-existing warnings in blog page)

**Accessibility:**
- All social links have aria-label attributes
- Screen reader text via sr-only spans
- All animations respect prefers-reduced-motion
- Keyboard navigation works for category filters
- Focus states on interactive elements

**Patterns:**
- Followed FlavorCard patterns (inview + scroll animations)
- Matched existing component structure (cheeseStretch action)
- Consistent motion-safe/motion-reduce modifiers throughout
- Reusable components with clear prop interfaces

## Performance Notes

- ProductGrid initializes all card states on mount
- Scroll animations only trigger for cards entering viewport
- No unnecessary re-renders (derived state for filtering)
- Category changes are instant (no network requests)

## Next Phase Readiness

**For 04-02 (Performance Optimization):**
- ProductGrid could benefit from lazy loading if product count grows
- Category filter could be extracted if reused elsewhere
- Image optimization needed when real product photos replace emoji placeholders

**For Future E-commerce:**
- Product data structure ready for inventory/availability fields
- comingSoon flag can toggle to add-to-cart buttons
- Category filtering foundation supports faceted search expansion

## Testing Notes

**Build Verification:**
- ✅ `npm run build` succeeds with no errors
- ✅ `npx svelte-check` passes (0 errors, 9 pre-existing warnings)
- ✅ All new files compile without TypeScript errors

**Manual Verification Needed:**
1. Visit /merch - products render from data file
2. Click category filters - only matching products show
3. Check footer - 4 social icons (Instagram, TikTok, YouTube, X)
4. Hover social icons - color changes to nacho-600
5. Check accessibility - screen reader announces link labels
6. Test reduced motion - animations disabled when preference set
7. Test scroll animations - products, banner, philosophy animate on scroll

## Metrics

**Files Changed:**
- Created: 4 files (products.ts, ProductCard, ProductGrid, SocialLinks)
- Modified: 2 files (merch +page, Footer)

**Lines of Code:**
- products.ts: ~70 lines (8 products + type definitions)
- ProductCard.svelte: ~30 lines
- ProductGrid.svelte: ~60 lines
- SocialLinks.svelte: ~50 lines
- Total new code: ~210 lines

**Commits:**
- 2 atomic commits (1 per task)
- Clear commit messages with scope and details

**Duration:** 4.8 minutes (2026-02-04T22:12:50Z to 2026-02-04T22:17:42Z)

## Related Files

**Dependencies:**
- src/lib/actions/inview.ts (scroll detection)
- src/lib/actions/cheese-stretch.ts (hover effects)
- src/lib/utils/animations.ts (motion preferences)

**Influenced By:**
- src/lib/data/flavors.ts (data structure pattern)
- src/lib/components/FlavorCard.svelte (component pattern)
- src/routes/blog/+page.svelte (category filter pattern)

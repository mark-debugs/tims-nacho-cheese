---
phase: 02-product-showcase
plan: 02
subsystem: product-showcase-ui
tags: [svelte, components, animations, hover-effects, scroll-triggers]
requires: [02-01]
provides:
  - FlavorCard component with per-flavor entrance animations and color treatments
  - MegaSpiceCard component with flame/shimmer hover effects
  - WhereToBuy component with ordering options
  - Products page composing all flavor cards in responsive grid
  - IntersectionObserver fixes for scroll restoration and 0-height race condition
affects: [03-01]
tech-stack:
  added: []
  patterns: [intersection-observer-height-guard, scroll-restoration-detection, transform-nesting]
key-files:
  created:
    - src/lib/components/FlavorCard.svelte
    - src/lib/components/MegaSpiceCard.svelte
    - src/lib/components/WhereToBuy.svelte
  modified:
    - src/routes/products/+page.svelte
    - src/lib/actions/inview.ts
key-decisions:
  - decision: Separate cheeseStretch action from Svelte transition div
    rationale: Both apply CSS transforms which conflict on same element
    impact: Nested div structure with transition outer, cheeseStretch inner
  - decision: Height > 0 guard on IntersectionObserver
    rationale: 0-height {#if} containers falsely report as intersecting per IO spec
    impact: Prevents all animations firing on page load
  - decision: Scroll restoration detection via requestAnimationFrame
    rationale: Elements above restored scroll position never intersect going forward
    impact: Cards render correctly after page refresh regardless of scroll position
  - decision: Min-height placeholders on inview containers
    rationale: Gives containers real height before content renders so IO works correctly
    impact: Prevents 0-height false positives, small layout shift when content appears
duration: ~15 minutes (including checkpoint debugging)
completed: 2026-02-04
---

# Phase 2 Plan 2: Product Showcase UI Summary

**One-liner:** Products page with 5 animated flavor cards, MEGA SPICE flame effects, where-to-buy section, and IntersectionObserver bug fixes for reliable scroll-triggered animations.

## Performance

**Tasks completed:** 3/3 (2 auto + 1 human-verify checkpoint)
**Files created:** 3 new components
**Files modified:** 2 (products page + inview action)
**Build status:** Passing

## What Was Accomplished

### Components Created

- **FlavorCard.svelte** (118 lines) — Reusable card for standard flavors with:
  - Per-flavor color mapping (static Tailwind class map for JIT compatibility)
  - Scroll-triggered entrance via `use:inview` with per-flavor animation from `getFlavorAnimation()`
  - Elastic hover effect via `use:cheeseStretch` on nested inner div
  - Heat level bar with proportional fill
  - Staggered entrance delays based on card index

- **MegaSpiceCard.svelte** (115 lines) — Special MEGA SPICE card with:
  - Explosive entrance: `in:scale` with elasticOut easing, starting at 1.3x
  - 3 flame emojis that appear on hover (positioned absolute at -top-8)
  - Heat shimmer overlay with gradient animation on hover
  - Pulsing heat level bar at full width when hovered
  - "Face Melter" subtitle and warning badge
  - `overflow-visible` container so flames render above card bounds

- **WhereToBuy.svelte** (81 lines) — Ordering info section with:
  - 3-column grid: DM Us, Local Pickup, Coming Soon: Online Store
  - Warm gradient background (nacho-100 to cheddar-100)
  - Fly-in entrance animation when scrolled into view
  - CTA button linking to About page

### Products Page Rebuilt

- Composes all components in responsive grid (`md:grid-cols-2 lg:grid-cols-3`)
- Separates regular flavors from MEGA SPICE (star flavor renders last)
- Hero header with scroll-triggered fly entrance
- Clean composition layer — all animation logic in components

### Critical Bug Fixes

1. **IntersectionObserver 0-height race condition**: Added `entry.boundingClientRect.height > 0` guard to prevent empty `{#if}` containers from falsely triggering all animations on page load
2. **Scroll restoration support**: Added `requestAnimationFrame` check to immediately fire `inview_enter` for elements already above viewport after browser scroll restoration (F5 refresh)
3. **Transform conflict**: Separated `use:cheeseStretch` action and Svelte `transition:` onto different DOM elements to prevent CSS transform overwriting
4. **Min-height placeholders**: Added `min-h-[200px]`, `min-h-[100px]`, `min-h-[80px]` to containers when content hasn't rendered, giving IntersectionObserver real geometry to work with

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create FlavorCard, MegaSpiceCard, WhereToBuy components | 4cfcccd | 3 new components |
| 2 | Rebuild products page with animated components | fe2dfb0 | products/+page.svelte |
| 3 | Fix IO race conditions and transform conflicts (post-checkpoint) | 544b065 | inview.ts, 4 components, bun.lock |

## Issues Encountered

### 1. IntersectionObserver 0-height false positives
**Issue:** All scroll-triggered animations fired within 65ms of page load instead of on scroll.
**Root cause:** `{#if isInView}` containers start empty (0 height). Per IO spec, 0-height elements within rootMargin report as intersecting with ratio 1.
**Resolution:** Height > 0 guard + min-height placeholders on containers.

### 2. Scroll restoration breaks inview
**Issue:** After page refresh, cards above the restored scroll position never render.
**Root cause:** Elements above viewport don't intersect and observer waits for forward scroll. With `once: true`, they stay hidden forever (until user scrolls back up).
**Resolution:** `requestAnimationFrame` check fires `inview_enter` for elements whose bottom is already above viewport.

### 3. Transform conflict between cheeseStretch and Svelte transitions
**Issue:** Both `use:cheeseStretch` (spring scale) and `transition:fn` (Svelte transition) apply CSS `transform` on the same element, overwriting each other.
**Resolution:** Nested div structure — transition on outer div, cheeseStretch on inner div.

### 4. Bun lockfile out of sync
**Issue:** Docker build failed with `--frozen-lockfile` because Wave 1 used npm instead of bun.
**Resolution:** Regenerated bun.lock with `bun install`.

## Deviations from Plan

- **Structural change**: FlavorCard and MegaSpiceCard use nested div pattern (transition + cheeseStretch on separate elements) instead of single div. Required to avoid transform conflicts.
- **inview.ts modified**: Added height guard and scroll restoration support — not in original plan but required for correct behavior.
- **Debug cycle**: Checkpoint required multiple rounds of debugging with Playwright MCP to identify root causes.

## Next Phase Readiness

### Ready to Proceed
- All 5 flavors display with distinct color treatments and animations
- MEGA SPICE has flame/shimmer hover effects
- Scroll-triggered entrances work correctly (including after refresh)
- Hover micro-interactions work on all cards
- Where to buy section present with ordering options
- Build passes, no TypeScript errors

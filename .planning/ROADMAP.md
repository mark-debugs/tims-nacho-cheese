# Roadmap: Tim's Nacho Cheese

## Overview

Build a playful, animation-heavy showcase website that feels like Tim — chill, west coast, and hungry-making. Start with SvelteKit foundation and animation infrastructure, build product showcase with GSAP effects, add brand story and blog content, then finish with merch and social integration. Every phase delivers something you can see and feel.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Infrastructure** - SvelteKit setup with animation utilities and Docker foundation
- [x] **Phase 2: Product Showcase** - 5 cheese flavors with playful animations and distinct personalities
- [x] **Phase 3: Brand & Content** - Homepage hero, Tim's story, and blog with recipes
- [x] **Phase 4: Merch & Polish** - Lifestyle products, social links, and production optimization
- [ ] **Phase 5: Custom Imagery with Fruitsnake** - Replace stock iconography and add high-quality product images using fruitsnake-mcp

## Phase Details

### Phase 1: Foundation & Infrastructure
**Goal**: Working SvelteKit site with navigation, responsive layout, and animation infrastructure ready for complex effects
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, HOME-02, HOME-03, HOME-04
**Success Criteria** (what must be TRUE):
  1. User can navigate between Products, Blog, Merch, and About pages with working links
  2. Site works on phone, tablet, and desktop with responsive breakpoints
  3. Pages load in under 3 seconds with optimized images
  4. Site runs in Docker container locally
  5. Animation utilities exist for consistent bouncy, orange-themed effects
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold SvelteKit project with Bun, Tailwind v3, and Docker containerization (completed 2026-02-04)
- [x] 01-02-PLAN.md — Navigation system, route pages, responsive layout, and animation utilities (completed 2026-02-04)

### Phase 2: Product Showcase
**Goal**: All 5 cheese flavors displayed with unique visual identities and playful animations that bring personality to life
**Depends on**: Phase 1
**Requirements**: PROD-01, PROD-02, PROD-03, ANIM-01, ANIM-02, ANIM-03, ANIM-04
**Success Criteria** (what must be TRUE):
  1. User sees all 5 flavors with imagery, descriptions, and distinct color/animation treatments
  2. MEGA SPICE has flame/melting effects that feel extreme
  3. Scrolling triggers animations that bring content to life
  4. Hovering buttons and cards triggers bouncy, cheese-themed micro-interactions
  5. Page transitions between routes are smooth and animated
  6. Where to buy section tells users how to order
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md — Animation infrastructure, flavor data, Svelte actions, page transitions (completed 2026-02-04)
- [x] 02-02-PLAN.md — Product showcase page with animated flavor cards, MEGA SPICE effects, and where-to-buy section (completed 2026-02-04)

### Phase 3: Brand & Content
**Goal**: Tim's personality shines through with hero section, brand story, and blog mixing recipes with west coast adventures
**Depends on**: Phase 2
**Requirements**: HOME-01, BRAND-01, BRAND-02, BLOG-01, BLOG-02, BLOG-03, BLOG-04
**Success Criteria** (what must be TRUE):
  1. Homepage displays animated hero showcasing brand personality with bouncy orange animations
  2. About page tells Tim's story — ex-skateboarder, tattooed, checkered Vans, chill vibes
  3. Interactive flavor finder quiz matches users to their ideal cheese
  4. Users can read recipe posts with ingredients, instructions, and product links
  5. Users can read lifestyle blog posts about Tim's adventures
  6. Users can download printable recipe cards
  7. Newsletter signup captures emails with validation
**Plans**: 3 plans

Plans:
- [x] 03-01-PLAN.md — Install deps (MDSveX, jsPDF, Shiki), animate homepage hero and about page with spring physics (completed 2026-02-04)
- [x] 03-02-PLAN.md — Interactive flavor finder quiz with personality questions and cheese matching (completed 2026-02-04)
- [x] 03-03-PLAN.md — Blog content system (MDSveX), recipe card PDF downloads, and newsletter signup (completed 2026-02-04)

### Phase 4: Merch & Polish
**Goal**: Merch line showcased, social channels connected, and site production-ready with performance optimization
**Depends on**: Phase 3
**Requirements**: MERCH-01, SOCL-01
**Success Criteria** (what must be TRUE):
  1. Users see merch products — apparel, skate decks, stickers, pins, accessories
  2. Social media links connect to Instagram, TikTok, and other channels
  3. Site passes Lighthouse performance audit with 90+ scores
  4. Reduced motion preference is respected for accessibility
  5. All animations perform smoothly on mobile devices
**Plans**: 2 plans

Plans:
- [x] 04-01-PLAN.md — Merch showcase with product data, category filtering, and accessible social links in footer (completed 2026-02-04)
- [x] 04-02-PLAN.md — Animation accessibility audit, performance optimization, and Lighthouse 90+ verification (completed 2026-02-04)

### Phase 5: Custom Imagery with Fruitsnake
**Goal**: Replace stock iconography and add high-quality custom product images using fruitsnake-mcp for a unique, branded visual identity
**Depends on**: Phase 4
**Requirements**: IMG-01 (flavor images), IMG-02 (merch images), IMG-03 (homepage imagery), IMG-04 (performance)
**Success Criteria** (what must be TRUE):
  1. Stock iconography replaced with custom-generated images that match the brand aesthetic
  2. Product images are high quality and visually consistent across all flavor cards
  3. Custom imagery integrates seamlessly with existing animations and layout
  4. Images are optimized for web performance (proper formats, sizing, compression)
  5. Site maintains Lighthouse 90+ scores after image additions
**Plans**: 3 plans

Plans:
- [ ] 05-01-PLAN.md — Generate 5 flavor product images with fruitsnake-mcp and integrate into flavor cards
- [ ] 05-02-PLAN.md — Generate 8 merch product images with fruitsnake-mcp and integrate into product cards
- [ ] 05-03-PLAN.md — Homepage imagery updates and full site visual/performance verification

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Infrastructure | 2/2 | Complete | 2026-02-04 |
| 2. Product Showcase | 2/2 | Complete | 2026-02-04 |
| 3. Brand & Content | 3/3 | Complete | 2026-02-04 |
| 4. Merch & Polish | 2/2 | Complete | 2026-02-04 |
| 5. Custom Imagery with Fruitsnake | 0/3 | Not Started | — |

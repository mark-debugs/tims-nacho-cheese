# Project Research Summary

**Project:** Tim's Nacho Cheese — Animated Showcase Website
**Domain:** Animation-heavy SvelteKit brand showcase site
**Researched:** 2026-02-03
**Confidence:** HIGH

## Executive Summary

Tim's Nacho Cheese is an artisan food brand showcase website requiring heavy playful animations (bouncy interactions, flame effects, melting cheese) built with SvelteKit and Bun. The research reveals a clear path: leverage SvelteKit's built-in transitions for simple UI animations, use GSAP 3 (now free) for complex timeline-based effects, and build with Tailwind v4 + shadcn-svelte for rapid UI iteration. The architecture centers on domain-driven component organization with careful SSR/hydration management for animation libraries.

The most critical risk is animation library lifecycle management during SvelteKit's client-side navigation. GSAP ScrollTrigger instances and timelines must be explicitly cleaned up in `onDestroy` hooks to prevent memory leaks and broken scroll calculations after route changes. The second major risk is animating layout-triggering CSS properties (width, height, left) instead of GPU-accelerated properties (transform, opacity), which causes visible jank on mobile devices. Establishing animation cleanup patterns and CSS performance guidelines in Phase 1 prevents rewrites later.

The recommended approach: Build in four phases starting with foundation (basic routing + animation utilities), then product showcase with GSAP effects, followed by blog with forms/SEO, and finally merch integration reusing product patterns. Deploy with Docker using `@sveltejs/adapter-node`, and if database integration is added, use the `imbios/bun-node` image for Prisma compatibility.

## Key Findings

### Recommended Stack

SvelteKit + Bun provides the ideal foundation for animation-heavy showcase sites. The stack combines SvelteKit's SSR capabilities (critical for blog SEO) with native animation primitives, while Bun delivers faster development builds and clean Docker deployment.

**Core technologies:**
- **SvelteKit + Tailwind v4** — Framework and styling foundation; v4 uses Vite plugin (simpler than PostCSS)
- **GSAP 3** — Complex timeline animations (flames, melting effects); FREE for commercial use (Webflow-sponsored)
- **Svelte built-in transitions** — Simple UI animations (bouncy buttons, page transitions); zero bundle size
- **shadcn-svelte** — Copy-paste UI components built on Tailwind; full code ownership enables animation customization
- **Superforms + Zod** — Type-safe form handling for blog comments and newsletter; use v2.27.4+ (security fix)
- **@sveltejs/enhanced-img** — Build-time image optimization (AVIF/WebP, responsive sizes); experimental but official
- **@sveltejs/adapter-node** — Docker deployment adapter; enables self-hosting with Node.js runtime

**Critical version notes:**
- Superforms v2.27.4+ required (CVE-2025-62381 prototype pollution fix)
- Tailwind v4 in RC, syntax changes from v3 (`@import "tailwindcss"` instead of `@tailwind` directives)
- GSAP integration via Svelte 5 `@attach` directive (cleaner than `onMount` + `bind:this`)

### Expected Features

Research identified clear feature hierarchy based on artisan food brand best practices and user expectations.

**Must have (table stakes):**
- Mobile-responsive design — 76% of food-related traffic is mobile
- Product showcase pages (5 flavors) — Core purpose, each needs dedicated treatment
- High-quality food photography — Users judge food products visually first
- Brand story / About page — Storytelling is primary differentiator for artisan brands
- Where to buy section — Without e-commerce, conversion path directs to retailers
- Simple recipe blog (5-10 recipes) — Demonstrates product use cases, drives SEO
- Fast page load times (under 3 seconds) — Slow sites = abandoned visits

**Should have (competitive advantage):**
- Product personalities showcase — 5 distinct flavor characters create emotional connection
- Playful animations — Matches skater/west coast vibe, differentiates from corporate food brands
- Lifestyle blog content — Extends beyond recipes into west coast culture
- Merch integration — Positions brand as lifestyle (not just food), stages future e-commerce
- Newsletter signup — Owned audience for launches/recipes (defer until 1000+ monthly visitors)

**Defer (v2+):**
- E-commerce checkout — Complex PCI/inventory/shipping logistics; use retailer links initially
- Video storytelling — High production cost; validate text/photo storytelling first
- Interactive flavor finder quiz — Custom development, nice-to-have vs essential
- Store locator with live data — Requires retail partnerships, budget for integration platform

**Anti-features to avoid:**
- Auto-playing video/audio — Annoying, kills mobile data, accessibility nightmare
- Pop-up newsletter on entry — Interrupts before user sees value; use contextual signup instead
- Overly complex animations — Slow load, janky mobile; subtle and purposeful only
- Center-aligned body text — Hard to read, users skip it; left-align body, center headlines only

### Architecture Approach

SvelteKit's file-based routing with domain-driven component organization provides clean boundaries for an animation-heavy showcase site. The architecture separates concerns: routes handle navigation and data loading, layouts provide shared UI structure, and lib/ contains reusable components organized by domain (product, hero, blog).

**Major components:**

1. **Routes Layer** (`src/routes/`) — File-based routing with +page.svelte for content, +layout.svelte for shared nav/footer, +page.js for data loading
2. **Animation Utilities** (`lib/utils/animations.ts`) — Centralized timing, easing, and configuration for consistent "bouncy, playful" aesthetic
3. **Domain Components** (`lib/components/`) — Organized by feature area (product/, hero/, navigation/) not technical type
4. **State Management** (Svelte 5 runes) — Client-side state via `$state`, `$derived` in .svelte.ts files; avoid stores for server data
5. **Image Optimization** (@sveltejs/enhanced-img plugin) — Build-time generation of AVIF/WebP formats with responsive sizes

**Key architectural patterns:**
- **Layout-based page transitions** — Use `onNavigate` hook in +layout.svelte with View Transitions API for smooth navigation
- **Progressive enhancement** — Built-in Svelte transitions for 80% of animations, GSAP for complex choreography (hero sections)
- **Component composition** — Slots and Svelte 5 snippets for flexible arrangements without prop explosion
- **SSR-safe animations** — All animation library initialization in `onMount` hooks (client-only), never at module level

**Data flow:**
User navigates → SvelteKit calls load() → Data fetched → Component receives props → Animations trigger on mount → onDestroy cleans up on route change

### Critical Pitfalls

Research identified three critical pitfalls that cause rewrites or severe performance issues if not addressed early.

1. **Animation library cleanup failure in SPA navigation** — GSAP ScrollTrigger instances persist across SvelteKit route changes, causing memory leaks, broken scroll calculations, and "stuck" animations. Prevention: Always cleanup in `onDestroy` hooks, call `trigger.kill()`, use `ScrollTrigger.refresh()` after initialization. Establish this pattern in Phase 1 foundation.

2. **SSR/hydration conflicts with browser-only code** — Animation libraries access `window`/`document` during server-side rendering, causing "window is not defined" build failures and hydration mismatches. Prevention: Initialize ALL animations in `onMount` (client-only), use `browser` check for conditional imports, guard browser API access with `typeof window !== 'undefined'`.

3. **Animating layout-triggering CSS properties** — Animating `width`, `height`, `left`, `top` causes browser reflow on every frame, resulting in 15-30 FPS jank on mobile. Prevention: ONLY animate `transform` and `opacity` (GPU-accelerated), use `translateX()` instead of `left`, use `scale()` instead of width/height changes. Test on actual mobile devices with DevTools CPU throttling.

4. **Missing accessibility (reduced motion support)** — Aggressive animations cause dizziness/nausea for users with vestibular disorders. Prevention: Respect `prefers-reduced-motion` CSS media query, provide simpler animation variants (crossfades instead of bounces), create motion preference Svelte store for JavaScript animations.

5. **View Transitions API conflicts** — Enabling SvelteKit's View Transitions causes double animations or timing conflicts with GSAP page transitions. Prevention: Choose ONE approach (View Transitions OR custom GSAP), not both; if mixing, delay GSAP init until View Transition completes.

## Implications for Roadmap

Based on research, suggested phase structure follows dependency order and risk mitigation strategy.

### Phase 1: Foundation & Animation Infrastructure
**Rationale:** Establish SSR-safe animation patterns, performance guidelines, and reusable utilities before building features. Prevents technical debt from improper animation initialization.

**Delivers:**
- SvelteKit project with routes/ structure
- Animation utilities library (`lib/utils/animations.ts`) with timing/easing constants
- SSR-safe animation wrapper components
- Reduced motion Svelte store
- Tailwind v4 configuration with orange palette
- Basic layout with nav/footer
- CSS performance guidelines (transform/opacity only)

**Addresses (from FEATURES.md):**
- Mobile-responsive design foundation
- Fast load times infrastructure
- Animation foundation for playful aesthetic

**Avoids (from PITFALLS.md):**
- SSR/hydration conflicts (onMount pattern established)
- CSS performance issues (animation utilities enforce transform/opacity)
- Accessibility violations (reduced motion store created)

**Stack elements (from STACK.md):**
- SvelteKit + Tailwind v4 + Vite
- Prettier + ESLint for code quality
- adapter-node for Docker deployment

### Phase 2: Product Showcase & Complex Animations
**Rationale:** Product personalities are the primary differentiator. Building showcase pages validates GSAP integration patterns and establishes animation cleanup lifecycle before expanding to other sections.

**Delivers:**
- Store route with 5 flavor pages
- Product personality components (distinct visual treatment per flavor)
- GSAP integration for MEGA SPICE (flames, melting effects)
- @sveltejs/enhanced-img for product photography
- ScrollTrigger with proper cleanup in onDestroy
- Product card components with bouncy hover animations

**Addresses (from FEATURES.md):**
- Product showcase pages (table stakes)
- Product personalities (differentiator)
- High-quality food photography
- Playful animations (differentiator)

**Uses (from STACK.md):**
- GSAP 3 for timeline animations
- Svelte transitions for simple UI
- Lucide icons for product features
- shadcn-svelte Card components

**Implements (from ARCHITECTURE.md):**
- Domain components (lib/components/product/)
- Animation composition with slots
- Image optimization pipeline

**Avoids (from PITFALLS.md):**
- Animation cleanup failure (ScrollTrigger.kill() pattern)
- Layout property animations (flames use transform, not height)
- Over-animating (focus on product hero, subtle elsewhere)

### Phase 3: Brand Story & Blog
**Rationale:** SEO-critical content requires SSR. Blog validates form handling (comments, newsletter) and meta tag management. Builds on animation patterns from Phase 2.

**Delivers:**
- Homepage with animated hero
- About page (brand story)
- Blog listing and individual post routes
- Blog comment forms (Superforms + Zod)
- Newsletter signup (email validation)
- SEO meta tags (svelte-meta-tags or manual svelte:head)
- Recipe content (5-10 posts)

**Addresses (from FEATURES.md):**
- Brand story / About page (table stakes)
- Recipe blog (table stakes)
- Newsletter signup (competitive advantage)

**Uses (from STACK.md):**
- Superforms v2.27.4+ + Zod for forms
- svelte-meta-tags for per-post SEO
- GSAP for hero animations (reuse Phase 2 patterns)

**Implements (from ARCHITECTURE.md):**
- +page.js load() functions for blog data
- Hero animation components (lib/components/hero/)
- Form validation patterns

**Avoids (from PITFALLS.md):**
- Form security (Superforms v2.27.4+ required)
- Client-side data fetching in onMount (use load() for blog posts)

### Phase 4: Merch & Lifestyle Content
**Rationale:** Merch reuses product showcase architecture from Phase 2. Lifestyle blog extends content strategy. This phase stages future e-commerce without building checkout.

**Delivers:**
- Merch route with product grid
- Merch detail pages (apparel, skate decks, accessories)
- Lifestyle blog posts (west coast/skate culture)
- Contact page
- Social media links integration
- "Coming soon" or contact-to-order CTA

**Addresses (from FEATURES.md):**
- Merch showcase (competitive advantage)
- Lifestyle blog content (competitive advantage)
- Contact information (table stakes)
- Social media links (table stakes)

**Uses (from STACK.md):**
- Reuse product components from Phase 2
- Reuse form patterns from Phase 3

**Implements (from ARCHITECTURE.md):**
- Product infrastructure reuse (merch uses product components)
- Content route expansion

### Phase 5: Docker Deployment & Production Polish
**Rationale:** Deploy early and often. Docker configuration tested in Phase 1, but full production setup (environment variables, image optimization, performance testing) happens here.

**Delivers:**
- Multi-stage Dockerfile with adapter-node
- Docker Compose for local testing
- Environment variable configuration (ORIGIN, PORT)
- Production image optimization (precompress)
- Performance audit (Lighthouse)
- Accessibility testing (reduced motion, keyboard nav)
- Final animation polish and optimization

**Uses (from STACK.md):**
- @sveltejs/adapter-node
- Docker with Bun runtime
- If database added: imbios/bun-node image for Prisma compatibility

**Avoids (from PITFALLS.md):**
- Bun + Prisma Docker compatibility issues (use imbios/bun-node if needed)
- Missing will-change cleanup (audit memory usage)
- Off-screen animations (IntersectionObserver pausing)

### Phase Ordering Rationale

1. **Foundation first** — Prevents animation anti-patterns from proliferating. Easier to establish patterns early than refactor later.
2. **Product before blog** — Product showcase is primary differentiator and validates complex animation patterns (GSAP + ScrollTrigger lifecycle).
3. **Blog before merch** — SEO content benefits from early deployment. Form patterns established in blog reused in merch.
4. **Deployment throughout** — Docker setup validated in Phase 1, tested continuously, polished in Phase 5.
5. **Animation complexity graduated** — Simple transitions (Phase 1) → Complex GSAP (Phase 2) → Reuse patterns (Phase 3-4).

**Dependency chain:**
- Animation utilities (Phase 1) required by all subsequent phases
- Product components (Phase 2) reused in merch (Phase 4)
- Form patterns (Phase 3) needed for newsletter/contact
- Docker foundation (Phase 1) tested throughout, optimized in Phase 5

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 2 (Product Showcase):** Melting cheese animation technique — SVG morphing vs transform-based approach, GSAP MorphSVG plugin licensing
- **Phase 2 (Product Showcase):** ScrollTrigger + View Transitions API interaction — limited sources, may conflict, test thoroughly
- **Phase 3 (Blog):** Blog data source decision — Markdown with frontmatter vs CMS vs simple JSON, affects load() implementation
- **Phase 5 (Deployment):** Bun production stability — community reports "experimental", validate in production-like environment early

Phases with standard patterns (skip research-phase):

- **Phase 1 (Foundation):** SvelteKit routing, Tailwind setup — well-documented, official docs sufficient
- **Phase 3 (Blog):** Superforms + Zod — community standard, extensive documentation and examples
- **Phase 4 (Merch):** Reuses Phase 2 patterns — no new research needed

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official SvelteKit docs, GSAP pricing verified, Tailwind v4 RC documented |
| Features | HIGH | Multiple artisan food brand case studies, consistent table stakes across sources |
| Architecture | HIGH | Official SvelteKit architecture docs, community patterns well-established |
| Pitfalls | MEDIUM-HIGH | GSAP cleanup patterns from official forums, CSS performance from Web.dev/MDN, View Transitions newer (SvelteKit 1.24+) |

**Overall confidence:** HIGH

Research drew from official documentation (SvelteKit, Tailwind, GSAP), authoritative sources (MDN, Web.dev), and community consensus (GSAP forums, SvelteKit showcases). All critical decisions have multiple confirming sources.

### Gaps to Address

**View Transitions API stability** — Introduced in SvelteKit 1.24 (late 2023), less battle-tested than other patterns. Limited sources on interaction with GSAP ScrollTrigger. Recommendation: Test View Transitions + ScrollTrigger integration in Phase 2 prototype before committing. Fallback: Use custom GSAP page transitions if conflicts arise.

**Bun production maturity** — Community sources mark Bun + SvelteKit as "experimental" for production. Docker compatibility with Prisma requires third-party image (imbios/bun-node). Recommendation: For showcase site without database, standard Bun image is fine. If database added later, test imbios/bun-node image early in Phase 5.

**Tailwind v4 stability** — Currently in RC (Release Candidate), not stable. Some third-party plugins may not support v4 yet. Recommendation: Pin Tailwind version in package.json, monitor changelog for breaking changes before 4.0 stable release.

**@sveltejs/enhanced-img maturity** — Pre-1.0 (v0.9.2), may introduce breaking changes. Requires Vite 6.3+ and vite-plugin-svelte 6.0+. Recommendation: Acceptable risk for official SvelteKit package. Only handles build-time images (not user uploads), which fits showcase use case.

**Animation accessibility edge cases** — Research focused on prefers-reduced-motion, but bouncy animations may trigger issues for users with specific sensitivities even with reduced motion. Recommendation: User testing with accessibility advocates in Phase 5, provide animation disable toggle if needed.

## Sources

### Primary (HIGH confidence)

**Stack:**
- [SvelteKit Official Documentation](https://svelte.dev/docs/kit)
- [Tailwind CSS with SvelteKit](https://tailwindcss.com/docs/guides/sveltekit)
- [GSAP Pricing (FREE confirmed)](https://gsap.com/pricing/)
- [Superforms Documentation](https://superforms.rocks/)
- [Zod Documentation](https://zod.dev/)

**Features:**
- [20 Best Artisan Websites for 2026 | CyberOptik](https://www.cyberoptik.net/blog/best-artisan-websites/)
- [Future of Food Marketing 2026 | SideChef](https://www.sidechef.com/business/food-advertising/food-marketing-playbook-2026)
- [Top 10 Website Features Every Food & Beverage Brand Needs](https://theartlogic.com/top-10-food-beverage-website-design-trends-2025/)

**Architecture:**
- [SvelteKit Project Structure](https://svelte.dev/docs/kit/project-structure)
- [SvelteKit Loading Data](https://svelte.dev/docs/kit/load)
- [Architectural Patterns for Scaling SvelteKit](https://oestechnology.co.uk/posts/architectural-patterns-scaling-sveltekit)

**Pitfalls:**
- [GSAP ScrollTrigger SvelteKit Issues (Official Forums)](https://gsap.com/community/forums/topic/40926-sveltekit-2-svelte-5-gsap-stuck-on-scrolltrigger-not-working-as-expected-after-route-change/)
- [How to Create High-Performance CSS Animations](https://web.dev/articles/animations-guide)
- [CSS Animation Performance (MDN)](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)
- [prefers-reduced-motion (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)

### Secondary (MEDIUM confidence)

**Stack:**
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no)
- [SvelteKit Image Plugin Guide](https://rodneylab.com/sveltekit-image-plugin/)
- [CVE-2025-62381 Superforms Security Advisory](https://advisories.gitlab.com/pkg/npm/sveltekit-superforms/CVE-2025-62381/)

**Architecture:**
- [Clean Frontend Architecture with SvelteKit](https://nikoheikkila.fi/blog/clean-frontend-architecture-with-sveltekit/)
- [Adding Page Transitions in SvelteKit](https://joshcollinsworth.com/blog/sveltekit-page-transitions)

**Pitfalls:**
- [SvelteKit Hydration Gotcha](https://www.captaincodeman.com/sveltekit-hydration-gotcha)
- [How to Dockerize SvelteKit with Prisma and Bun](https://systhoughts.com/how-to-dockerize-a-sveltekit-app-with-prisma-and-bun/)

### Tertiary (LOW confidence, needs validation)

- [Unlocking View Transitions in SvelteKit 1.24](https://svelte.dev/blog/view-transitions) — Official blog post but limited real-world testing with GSAP
- [Bun with SvelteKit Docker Benchmarks](https://medium.com/@anasmohammed361/bun-with-sveltekit-benchmarks-docker-591f2cbbe61b) — Community benchmarks, marked experimental

---
*Research completed: 2026-02-03*
*Ready for roadmap: yes*

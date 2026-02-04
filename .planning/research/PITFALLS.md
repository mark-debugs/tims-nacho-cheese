# Domain Pitfalls: SvelteKit Animation-Heavy Showcase Sites

**Domain:** SvelteKit animation-heavy showcase/brand sites
**Tech Stack:** SvelteKit + Bun + Docker + Heavy Animations
**Researched:** 2026-02-03
**Overall Confidence:** MEDIUM (Strong web search sources, awaiting Context7/official doc verification)

## Executive Summary

Animation-heavy SvelteKit showcase sites face three critical challenge areas: (1) animation library lifecycle management in SPA navigation, (2) SSR/hydration conflicts with browser-only animation code, and (3) performance degradation from animating the wrong CSS properties. These pitfalls are amplified by SvelteKit's SSR-first architecture and Docker deployment requirements.

The most common critical mistake: Failing to properly cleanup animation libraries (especially GSAP ScrollTrigger) during SvelteKit's client-side navigation, causing memory leaks, scroll position bugs, and "stuck" animations that break after route changes.

---

## Critical Pitfalls

Mistakes that cause rewrites, major bugs, or severe performance issues.

### Pitfall 1: Animation Library Cleanup Failure in SPA Navigation

**What goes wrong:**
ScrollTrigger instances, GSAP timelines, and event listeners persist across SvelteKit's client-side route changes. After navigating between pages, animations don't trigger correctly, scroll calculations are wrong, or animations from the previous page continue running invisibly, consuming memory.

**Why it happens:**
- SvelteKit uses client-side navigation (SPA behavior) but developers treat it like traditional multi-page apps
- GSAP/ScrollTrigger instances are created in `onMount` but never destroyed in `onDestroy`
- Developers don't understand that `onDestroy` runs on route change, not just component unmount
- ScrollTrigger calculates scroll positions at initialization; after SPA navigation, the DOM is different but calculations aren't refreshed

**Consequences:**
- Memory leaks - RAM usage climbs with each navigation
- "Stuck" scroll triggers that never fire or fire at wrong positions
- Animations lagging or becoming janky over time
- ScrollTrigger not working at all after navigating without activating scrollbar
- Scroll positions from previous pages affecting new pages

**Prevention:**

1. **Always cleanup in onDestroy**
```javascript
import { onMount, onDestroy } from 'svelte';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

onMount(() => {
  const trigger = ScrollTrigger.create({
    trigger: '.element',
    start: 'top center',
    onEnter: () => gsap.to('.element', { opacity: 1 })
  });

  // Return cleanup function
  return () => {
    trigger.kill();
  };
});

// OR use onDestroy explicitly
let trigger;
onMount(() => {
  trigger = ScrollTrigger.create({ /* ... */ });
});

onDestroy(() => {
  if (trigger) trigger.kill();
});
```

2. **Centralize GSAP configuration** - Import GSAP once globally, not per-page (causes reload on every route change)

3. **Call ScrollTrigger.refresh()** after all animations initialize on a page to recalculate positions after DOM render

4. **Use ScrollTrigger.getAll() for bulk cleanup** if needed:
```javascript
onDestroy(() => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
});
```

5. **Consider ScrollTrigger.clearScrollMemory()** if experiencing scroll position restoration bugs after navigation

**Detection:**
- Open DevTools Performance tab, navigate between pages multiple times, watch for increasing memory usage
- Check console for "ScrollTrigger.refresh() should be called after all animations..." warnings
- Test: Navigate away and back to animated page - do animations still work?
- Test: Scroll to trigger point on page A, navigate to page B, scroll - do page A's triggers still fire?

**Phase Impact:**
- **Phase 1 (Foundation)**: Establish animation cleanup pattern in first animated component
- **Phase 2-4**: Apply pattern consistently to all page animations
- Flag for research: Test ScrollTrigger with SvelteKit's View Transitions API (may conflict)

**Sources:**
- [GSAP ScrollTrigger SvelteKit Issues](https://gsap.com/community/forums/topic/40926-sveltekit-2-svelte-5-gsap-stuck-on-scrolltrigger-not-working-as-expected-after-route-change/)
- [GSAP ScrollTrigger Performance with SvelteKit](https://gsap.com/community/forums/topic/29465-gsap-scrolltrigger-with-sveltekit-performance-issue/)
- [Optimizing GSAP in Next.js (applicable patterns)](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232)

---

### Pitfall 2: SSR/Hydration Conflicts with Browser-Only Animation Code

**What goes wrong:**
Animation libraries access `window`, `document`, or browser APIs during server-side rendering, causing build failures ("window is not defined"), 500 errors on page load, or hydration mismatches where the server-rendered HTML doesn't match client-rendered HTML.

**Why it happens:**
- SvelteKit runs components on both server and client by default
- Animation libraries assume browser environment (window, document, requestAnimationFrame)
- Developers import/initialize animations at module level (runs during SSR) instead of in `onMount` (client-only)
- Time-based or random animations cause different output on server vs client

**Consequences:**
- Build failures: "ReferenceError: window is not defined"
- Runtime errors: 500 status pages for routes with animations
- Hydration warnings in console flooding logs
- Visual flash as server HTML is replaced by client HTML
- Safari-specific issues (Safari adds anchor tags around phone numbers, causing hydration mismatch)

**Prevention:**

1. **Initialize ALL animations in onMount**
```javascript
// BAD - runs during SSR
import { gsap } from 'gsap';
const tl = gsap.timeline(); // ERROR: window not defined

// GOOD - only runs on client
import { onMount } from 'svelte';
import { gsap } from 'gsap';

onMount(() => {
  const tl = gsap.timeline();
  // ... animation code
});
```

2. **Use browser check for conditional imports**
```javascript
import { browser } from '$app/environment';

let gsap, ScrollTrigger;

onMount(async () => {
  if (browser) {
    gsap = (await import('gsap')).gsap;
    ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  }
});
```

3. **Disable SSR for animation-heavy routes** (last resort)
```javascript
// +page.js or +page.server.js
export const ssr = false; // Client-side only
```

4. **Avoid time/random in templates**
```svelte
<!-- BAD - hydration mismatch -->
<div style="opacity: {Math.random()}">

<!-- GOOD - deterministic -->
<div style="opacity: 0" use:fadeIn>
```

5. **Guard browser API access**
```javascript
if (typeof window !== 'undefined') {
  // Browser-only code
}
```

**Detection:**
- Build fails with "window is not defined" or "document is not defined"
- Console warnings: "Hydration mismatch" or "Expected server HTML to contain..."
- Visual flash on page load (FOUC - Flash of Unstyled Content)
- Different behavior on SSR vs client-side navigation (first load vs route change)

**Phase Impact:**
- **Phase 1 (Foundation)**: Establish SSR-safe animation pattern in `lib/animations/`
- **Phase 2+**: Code review checklist - all animations use `onMount` or `browser` check
- Consider: Disable SSR for showcase pages (no SEO requirement vs e-commerce)

**Sources:**
- [SvelteKit Hydration Gotcha](https://www.captaincodeman.com/sveltekit-hydration-gotcha)
- [Advanced Troubleshooting in SvelteKit SSR/Hydration](https://www.mindfulchase.com/explore/troubleshooting-tips/front-end-frameworks/advanced-troubleshooting-in-sveltekit-fixing-ssr,-routing,-and-hydration-challenges.html)
- [Svelte Lifecycle Examples](https://geoffrich.net/posts/svelte-lifecycle-examples/)

---

### Pitfall 3: Animating Layout-Triggering CSS Properties

**What goes wrong:**
Animating `width`, `height`, `left`, `top`, `margin`, `padding`, or `border-radius` causes the browser to recalculate layout (reflow) and repaint on every animation frame. This makes animations jerky, laggy, and janky, especially on mobile devices. Battery drains rapidly on phones.

**Why it happens:**
- Developers use intuitive properties (`left: 0` to `left: 100px`) without understanding browser rendering pipeline
- WYSIWYG thinking: "I want to move it left, so I animate `left`"
- Performance differences aren't obvious on high-end development machines
- CSS tutorials often show these patterns without performance caveats

**Consequences:**
- Animations run at 15-30 FPS instead of 60 FPS (visible jank)
- Mobile devices stutter and lag
- Rapid battery drain on phones (CPU rendering instead of GPU)
- Main thread blocked, causing input lag and unresponsive UI
- "Janky" reputation for the whole site

**Prevention:**

1. **ONLY animate `transform` and `opacity`**
   - These properties skip layout and paint, run on compositor thread (GPU)
   - Achieve 60 FPS even on mobile devices

2. **Use transform instead of position**
```css
/* BAD - triggers layout */
.element {
  animation: slide 1s;
}
@keyframes slide {
  from { left: 0; }
  to { left: 100px; }
}

/* GOOD - GPU accelerated */
.element {
  animation: slide 1s;
}
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

3. **Use scale instead of width/height**
```css
/* BAD */
.grow {
  animation: grow 0.3s;
}
@keyframes grow {
  from { width: 100px; height: 100px; }
  to { width: 200px; height: 200px; }
}

/* GOOD */
.grow {
  width: 100px;
  height: 100px;
  animation: grow 0.3s;
}
@keyframes grow {
  from { transform: scale(1); }
  to { transform: scale(2); }
}
```

4. **Avoid animating `box-shadow`, `filter`, `border-radius`** on mobile
   - Heavy properties, cause paint on every frame
   - Use sparingly, reduce values on mobile

5. **Use `will-change` judiciously**
```css
.animated-element {
  will-change: transform, opacity; /* Promote to layer BEFORE animation */
}

/* Remove after animation completes */
.animated-element.done {
  will-change: auto; /* Avoid memory waste */
}
```

6. **Test on actual mobile devices** - Performance issues invisible on desktop

**Detection:**
- Open DevTools > Performance, record animation, look for purple "Layout" and green "Paint" bars
- Chrome DevTools > Rendering > Frame Rendering Stats - should show 60 FPS
- Mobile DevTools > Performance > CPU throttling 4x slowdown - still smooth?
- Battery drain test on phone - animations should not cause heat

**Phase Impact:**
- **Phase 1 (Foundation)**: CSS animation utilities/classes using only `transform` and `opacity`
- **Phase 2-4**: Code review - reject PRs animating layout properties
- **Phase 3 (Cheese Flavors)**: Melting/drip animations particularly at risk - use SVG morphing or transform

**Sources:**
- [How to Create High-Performance CSS Animations](https://web.dev/articles/animations-guide)
- [Ten Tips for Better CSS Transitions](https://joshcollinsworth.com/blog/great-transitions)
- [Optimizing Performance in CSS Animations](https://dev.to/nasehbadalov/optimizing-performance-in-css-animations-what-to-avoid-and-how-to-improve-it-bfa)
- [CSS and JavaScript Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)

---

## Moderate Pitfalls

Mistakes that cause delays, technical debt, or moderate issues.

### Pitfall 4: Missing Accessibility - No Reduced Motion Support

**What goes wrong:**
Users with vestibular disorders, motion sensitivity, or motion sickness experience dizziness, nausea, headaches, or seizures from aggressive animations. The site is literally unusable for 70+ million people with vestibular disorders.

**Why it happens:**
- Developers prioritize visual wow-factor over accessibility
- Unaware of `prefers-reduced-motion` CSS media query
- Assume "just make animations optional" means settings panel (requires finding it)
- Don't test with reduced motion enabled

**Consequences:**
- ADA/WCAG compliance violations (Success Criterion 2.3.3)
- Users abandoning site due to physical discomfort
- Legal risk for accessibility lawsuits
- Reputation damage ("flashy but inaccessible")
- Bouncy/playful brand animations specifically problematic (Tim's Nacho Cheese style)

**Prevention:**

1. **Respect `prefers-reduced-motion` query**
```css
/* Full animations by default */
.cheese-drip {
  animation: drip 2s ease-in-out infinite;
}

/* Reduced motion: crossfade only */
@media (prefers-reduced-motion: reduce) {
  .cheese-drip {
    animation: none;
    /* Or simple opacity fade */
    animation: fade 0.5s ease-in-out;
  }
}
```

2. **JavaScript animation respects preference**
```javascript
import { onMount } from 'svelte';

onMount(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    // Full bouncy animations
    gsap.to('.element', { y: -20, duration: 0.5, ease: 'bounce' });
  } else {
    // Simple fade
    gsap.to('.element', { opacity: 1, duration: 0.3 });
  }
});
```

3. **Svelte store for global motion preference**
```javascript
// lib/stores/motion.js
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const prefersReducedMotion = writable(
  browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches
);

if (browser) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', (e) => {
    prefersReducedMotion.set(e.matches);
  });
}
```

4. **Design reduced motion variants upfront**
   - Not "remove all animation" but "simpler, slower, less bouncy"
   - Crossfades, subtle opacity changes, small movements
   - Maintain brand playfulness without discomfort

5. **Test reduced motion enabled**
   - Windows 11: Settings > Accessibility > Visual Effects > Animation Effects
   - macOS: System Settings > Accessibility > Display > Reduce motion
   - Chrome DevTools > Rendering > Emulate CSS media feature prefers-reduced-motion

**Detection:**
- Manual test: Enable reduced motion in OS, reload site - still usable?
- Automated: Lighthouse accessibility audit flags missing reduced motion support
- Code review: All animation declarations have `@media (prefers-reduced-motion)` variant

**Phase Impact:**
- **Phase 1 (Foundation)**: Reduced motion Svelte store and utility classes
- **Phase 2-4**: Every animation component includes reduced motion variant
- **Phase 5 (Polish)**: QA checklist includes reduced motion testing

**Sources:**
- [prefers-reduced-motion MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [Understanding WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Animation and Motion Accessibility](https://web.dev/learn/accessibility/motion/)

---

### Pitfall 5: View Transitions API Conflicts with Existing Animations

**What goes wrong:**
Enabling SvelteKit's View Transitions API (via `onNavigate`) causes double animations, timing conflicts, or visual glitches when combined with custom page transition animations. GSAP ScrollTrigger may not reinitialize correctly after View Transitions.

**Why it happens:**
- View Transitions API is new (SvelteKit 1.24+), documentation scarce
- Both systems trying to animate the same elements during navigation
- View Transitions manipulates DOM in ways GSAP doesn't expect
- Timing coordination between native API and JS animations complex

**Consequences:**
- Elements animate twice (fade out via View Transitions, also fade out via GSAP)
- Jarring visual glitches as transitions conflict
- ScrollTrigger instances don't work after View Transitions complete
- "Stuck" animations as View Transitions lock the DOM temporarily

**Prevention:**

1. **Choose one navigation animation approach**
   - Either: View Transitions API for page transitions
   - Or: Custom GSAP page transitions
   - Mixing both is advanced; avoid in early phases

2. **If using View Transitions, delay GSAP init**
```javascript
import { onNavigate } from '$app/navigation';
import { onMount } from 'svelte';

onNavigate(() => {
  return new Promise((resolve) => {
    document.startViewTransition(() => {
      resolve();
    });
  });
});

onMount(() => {
  // Wait for View Transition to complete
  setTimeout(() => {
    // Initialize GSAP animations
    ScrollTrigger.refresh();
  }, 100);
});
```

3. **Disable View Transitions for specific routes**
```javascript
// +layout.js
export const load = ({ url }) => {
  if (url.pathname.includes('/animated-showcase')) {
    // Skip View Transitions on animation-heavy pages
    return { disableViewTransitions: true };
  }
};
```

4. **Test navigation in both directions**
   - Forward navigation (click link)
   - Back button navigation (history.back())
   - View Transitions behave differently in each case

**Detection:**
- Visual QA: Navigate between pages, watch for double fades or glitches
- Console: Check for GSAP warnings about DOM manipulation during animations
- Test: Enable View Transitions, navigate, check if ScrollTrigger still works

**Phase Impact:**
- **Phase 2 (Navigation)**: Decide View Transitions vs Custom GSAP transitions
- Flag for research: Test View Transitions + ScrollTrigger compatibility in SvelteKit 2.0+

**Sources:**
- [Unlocking View Transitions in SvelteKit 1.24](https://svelte.dev/blog/view-transitions)
- [Page Transitions in SvelteKit with View Transitions API](https://geoffrich.net/posts/page-transitions-1/)
- [Adding Page Transitions in SvelteKit](https://joshcollinsworth.com/blog/sveltekit-page-transitions)

---

### Pitfall 6: Svelte 5 Transition Quirks (|local and intro:true)

**What goes wrong:**
Svelte transitions don't play on first render without `intro: true`, which doesn't work in SvelteKit. Forgetting the `|local` directive causes transitions to update the entire DOM instead of just the component, breaking the app.

**Why it happens:**
- Svelte 5 changed transition behavior
- SvelteKit doesn't support `intro: true` flag
- `|local` directive easy to forget (seems optional)
- Documentation scattered between Svelte and SvelteKit docs

**Consequences:**
- Transitions don't play on first page load (only after navigation)
- Entire app re-renders on transition, destroying state
- Animations feel inconsistent (work on navigation, not on load)

**Prevention:**

1. **Always use |local directive**
```svelte
<!-- BAD - updates whole DOM -->
<div transition:fade>

<!-- GOOD - updates only this element -->
<div transition:fade|local>
```

2. **Trigger intro animations in onMount**
```svelte
<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let show = false;

  onMount(() => {
    show = true; // Triggers transition
  });
</script>

{#if show}
  <div transition:fade|local>
    Content
  </div>
{/if}
```

3. **Use in/out instead of transition for control**
```svelte
<div in:fade|local out:slide|local>
```

**Detection:**
- Code review: Search for `transition:` without `|local`
- Test: First page load vs navigation - animations consistent?

**Phase Impact:**
- **Phase 1 (Foundation)**: Animation component templates include `|local`
- Code review: Reject PRs with transitions missing `|local`

**Sources:**
- [Create Amazing User Interfaces Using Animation With Svelte](https://joyofcode.xyz/animation-with-svelte)
- [Essential Transitions and Animations in Svelte](https://blog.logrocket.com/essential-transitions-and-animations-in-svelte/)

---

### Pitfall 7: Docker + Bun + Prisma Compatibility Issues

**What goes wrong:**
Bun's official Docker image doesn't fully support Prisma, causing database connection failures or build errors in production. Prisma tries to use Node.js, but Bun Docker image doesn't include it.

**Why it happens:**
- Prisma not yet fully compatible with Bun runtime
- Bun Docker image is Bun-only (no Node.js fallback)
- Development (local Bun) works fine, production (Docker) fails

**Consequences:**
- Production build fails in Docker with Prisma errors
- Database connections fail at runtime
- Last-minute production deployment blockers

**Prevention:**

1. **Use imbios/bun-node Docker image**
```dockerfile
# Includes both Bun and Node.js
FROM imbios/bun-node:latest AS builder

WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install

COPY . .
RUN bun run build

FROM oven/bun:latest
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000
CMD ["bun", "run", "build"]
```

2. **Multi-stage build: Bun for build, Node for Prisma**
```dockerfile
FROM imbios/bun-node:latest AS builder
# ... Bun build stage

FROM imbios/bun-node:latest AS runner
# Includes Node.js for Prisma compatibility
```

3. **Test Docker build locally before production**
```bash
docker build -t sveltekit-app .
docker run -p 3000:3000 sveltekit-app
# Test database connections in containerized environment
```

4. **If not using Prisma/database, standard Bun image OK**
```dockerfile
FROM oven/bun:latest
# No Node.js needed for showcase sites without DB
```

**Detection:**
- Docker build fails with Prisma errors
- Runtime database connection errors in container
- Works locally (Bun), fails in Docker

**Phase Impact:**
- **Phase 1 (Foundation)**: If using database for CMS/analytics, use imbios/bun-node image
- For showcase-only (no database): Standard Bun image fine
- Test Docker build in Phase 1, not Phase 5

**Sources:**
- [How to Dockerize SvelteKit with Prisma and Bun](https://systhoughts.com/how-to-dockerize-a-sveltekit-app-with-prisma-and-bun/)
- [Bun with SvelteKit Docker Benchmarks](https://medium.com/@anasmohammed361/bun-with-sveltekit-benchmarks-docker-591f2cbbe61b)

---

## Minor Pitfalls

Mistakes that cause annoyance but are easily fixable.

### Pitfall 8: Page Transition Overuse ("Amateurish")

**What goes wrong:**
Every navigation triggers elaborate page transitions, making the site feel slow, over-designed, and "amateurish" rather than polished.

**Why it happens:**
- Excitement about new animation capabilities
- "If some animation is good, more is better"
- Not considering user journey (navigating 10+ pages)

**Consequences:**
- User frustration with slow navigation
- Brand perceived as trying too hard
- Reduced conversion (users abandon due to slow feel)

**Prevention:**
- Use subtle transitions (200-300ms fade/slide)
- Skip transitions for within-section navigation
- Reserve elaborate transitions for major context shifts (home → product detail)

**Sources:**
- [Adding Page Transitions in SvelteKit](https://joshcollinsworth.com/blog/sveltekit-page-transitions)

---

### Pitfall 9: Animating Large/Heavy Elements Off-Screen

**What goes wrong:**
Animating elements that are off-screen or hidden wastes CPU/GPU, degrading overall performance.

**Why it happens:**
- Animations run on all elements, not just visible ones
- Forgetting to pause/stop animations when elements scroll out of view

**Consequences:**
- Unnecessary performance overhead
- Battery drain on mobile
- Jank in visible animations (CPU busy with invisible ones)

**Prevention:**
- Use Intersection Observer to pause animations when off-screen
- GSAP ScrollTrigger handles this automatically with `toggleActions`

**Sources:**
- [Animation Optimization to Boost Performance](https://educationalvoice.co.uk/animation-optimisation/)

---

### Pitfall 10: Missing will-change Cleanup

**What goes wrong:**
Adding `will-change: transform` permanently creates extra compositor layers, wasting memory. Forgetting to remove it after animation completes causes memory bloat.

**Why it happens:**
- Know to add `will-change`, forget to remove it
- No cleanup logic after animations

**Consequences:**
- Memory waste (extra layers consume RAM)
- Mobile devices particularly affected

**Prevention:**
```javascript
element.style.willChange = 'transform';
// Animate
gsap.to(element, {
  x: 100,
  onComplete: () => {
    element.style.willChange = 'auto'; // Cleanup
  }
});
```

**Sources:**
- [How to Create High-Performance CSS Animations](https://web.dev/articles/animations-guide)

---

## Phase-Specific Warnings

Recommendations for which phases should address which pitfalls.

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: Foundation | SSR/hydration conflicts | Establish `onMount` animation pattern, create `lib/animations/` utilities |
| Phase 1: Foundation | CSS performance | Create animation utility classes using only `transform`/`opacity` |
| Phase 1: Foundation | Reduced motion | Create motion preference Svelte store |
| Phase 2: Navigation | Animation cleanup | Implement `onDestroy` cleanup for all GSAP instances |
| Phase 2: Navigation | View Transitions conflicts | Decide: View Transitions API OR custom GSAP (not both) |
| Phase 2: Navigation | Page transition overuse | Design subtle 200-300ms transitions, test user flow |
| Phase 3: Cheese Animations | Layout properties | Melting/drip effects use SVG morph or `transform: scaleY()`, NOT `height` |
| Phase 3: Cheese Animations | Off-screen animations | Use ScrollTrigger `toggleActions` to pause off-screen |
| Phase 4: Interactions | Svelte 5 transitions | Code review - all transitions use `\|local` |
| Phase 5: Docker Deploy | Bun + Prisma | Use imbios/bun-node if database needed, test Docker build early |
| All Phases | Accessibility | Every animation PR includes reduced motion variant |

---

## Confidence Assessment

| Area | Confidence | Rationale |
|------|------------|-----------|
| Animation cleanup patterns | **HIGH** | Multiple GSAP community forum threads with detailed solutions |
| SSR/hydration issues | **HIGH** | Official SvelteKit docs + community posts confirm patterns |
| CSS performance | **HIGH** | Web.dev, MDN, and recent 2025-2026 articles consensus |
| Accessibility | **HIGH** | WCAG standards + MDN docs + recent implementations |
| View Transitions | **MEDIUM** | Newer API (SvelteKit 1.24+), less battle-tested, fewer sources |
| Bun + Docker | **MEDIUM** | Community solutions exist but marked "experimental", Prisma compatibility evolving |
| Svelte 5 transitions | **MEDIUM** | Single authoritative source, needs Context7 verification |

---

## Research Quality Notes

**Verification approach:**
- Searched for 2026-dated sources to ensure currency
- Cross-referenced GSAP community forums (authoritative for GSAP issues)
- Consulted MDN/Web.dev for performance best practices (authoritative)
- Used official SvelteKit blog and docs where available

**Gaps identified:**
- Limited sources on View Transitions + GSAP ScrollTrigger interaction (needs phase research)
- Bun + SvelteKit production stability unclear (marked experimental by community)
- Svelte 5 specific quirks need official Context7 verification

**Next steps:**
- Phase 2 research: Deep dive on View Transitions vs GSAP page transitions
- Phase 5 research: Bun Docker production deployment checklist
- Ongoing: Monitor SvelteKit 2.x and Svelte 5.x changelog for animation changes

---

## Sources

### Critical Pitfalls
- [SvelteKit + GSAP ScrollTrigger Issues](https://gsap.com/community/forums/topic/40926-sveltekit-2-svelte-5-gsap-stuck-on-scrolltrigger-not-working-as-expected-after-route-change/)
- [GSAP ScrollTrigger Performance Issues](https://gsap.com/community/forums/topic/29465-gsap-scrolltrigger-with-sveltekit-performance-issue/)
- [Optimizing GSAP Animations in Next.js](https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232)
- [SvelteKit Hydration Gotcha](https://www.captaincodeman.com/sveltekit-hydration-gotcha)
- [Advanced Troubleshooting in SvelteKit](https://www.mindfulchase.com/explore/troubleshooting-tips/front-end-frameworks/advanced-troubleshooting-in-sveltekit-fixing-ssr,-routing,-and-hydration-challenges.html)
- [How to Create High-Performance CSS Animations](https://web.dev/articles/animations-guide)
- [Ten Tips for Better CSS Transitions](https://joshcollinsworth.com/blog/great-transitions)
- [Optimizing Performance in CSS Animations](https://dev.to/nasehbadalov/optimizing-performance-in-css-animations-what-to-avoid-and-how-to-improve-it-bfa)
- [CSS and JavaScript Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/CSS_JavaScript_animation_performance)

### Moderate Pitfalls
- [prefers-reduced-motion MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- [WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
- [Animation and Motion Accessibility](https://web.dev/learn/accessibility/motion/)
- [Unlocking View Transitions in SvelteKit 1.24](https://svelte.dev/blog/view-transitions)
- [Page Transitions with View Transitions API](https://geoffrich.net/posts/page-transitions-1/)
- [Adding Page Transitions in SvelteKit](https://joshcollinsworth.com/blog/sveltekit-page-transitions)
- [Create Amazing User Interfaces Using Animation With Svelte](https://joyofcode.xyz/animation-with-svelte)
- [Essential Transitions and Animations in Svelte](https://blog.logrocket.com/essential-transitions-and-animations-in-svelte/)
- [How to Dockerize SvelteKit with Prisma and Bun](https://systhoughts.com/how-to-dockerize-a-sveltekit-app-with-prisma-and-bun/)
- [Bun with SvelteKit Docker Benchmarks](https://medium.com/@anasmohammed361/bun-with-sveltekit-benchmarks-docker-591f2cbbe61b)

### Minor Pitfalls
- [Animation Optimization](https://educationalvoice.co.uk/animation-optimisation/)
- [How to Create High-Performance CSS Animations](https://web.dev/articles/animations-guide)

### General SvelteKit
- [Svelte Lifecycle Examples](https://geoffrich.net/posts/svelte-lifecycle-examples/)
- [SvelteKit onMount Documentation](https://learn.svelte.dev/tutorial/onmount)
- [$app/navigation Docs](https://svelte.dev/docs/kit/$app-navigation)

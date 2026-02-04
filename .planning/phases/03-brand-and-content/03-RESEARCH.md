# Phase 3: Brand & Content - Research

**Researched:** 2026-02-04
**Domain:** Content management, animation, forms, client-side PDF generation
**Confidence:** HIGH

## Summary

Phase 3 brings Tim's personality to life through hero animations, blog content, interactive quiz, and downloadable recipe cards. Research focused on five key technical domains:

1. **Hero animations** - Leveraging existing Svelte motion primitives (spring/tweened) for bouncy, personality-driven effects
2. **Blog/content architecture** - MDSveX + frontmatter for markdown-based content with no CMS complexity
3. **Interactive quiz** - Score-based matching using Svelte 5 runes state management
4. **Form handling** - SvelteKit form actions with progressive enhancement for newsletter signup
5. **PDF generation** - Client-side PDF creation using jsPDF for downloadable recipe cards

The stack aligns perfectly with Phase 1 & 2 decisions: Svelte 5 runes throughout, animation utilities already built, and accessibility-first approach (prefers-reduced-motion) already established.

**Primary recommendation:** Use MDSveX for blog content, jsPDF for recipe card downloads, native SvelteKit form actions (no library needed), and build quiz with $state runes following existing animation patterns.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| mdsvex | 0.12.x | Markdown preprocessor for Svelte | De facto standard for Svelte markdown blogs, allows Svelte components in markdown |
| jsPDF | 2.x | Client-side PDF generation | Most popular client-side PDF library, zero server dependencies, 28K+ GitHub stars |
| Shiki | 1.x | Syntax highlighting | Modern, zero-runtime highlighting used by VS Code, replaces older Prism/Highlight.js |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @bitmachina/highlighter | Latest | MDSveX + Shiki integration | Simplifies Shiki setup with mdsvex, handles escapeSvelte |
| svelte/motion | Built-in | Animation primitives | Already installed, no additional dependency |
| SvelteKit form actions | Built-in | Form handling | Native progressive enhancement, no library needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| jsPDF | pdfmake | More declarative, better for complex layouts, but Phase 3 needs simple recipe cards |
| MDSveX | Contentful/Sanity CMS | More features, but adds complexity, deployment dependencies, and v1 doesn't need it |
| Superforms | Native form actions | Superforms adds validation libraries (Zod), overkill for simple newsletter signup |

**Installation:**
```bash
bun add -d mdsvex @bitmachina/highlighter shiki
bun add jspdf
# svelte/motion and form actions already available
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── data/
│   │   ├── flavors.ts           # Existing flavor data
│   │   └── quiz.ts              # Quiz questions + matching logic
│   ├── utils/
│   │   ├── animations.ts        # Existing animation utilities
│   │   └── pdf-generator.ts    # Recipe card PDF creation
│   └── components/
│       ├── Quiz.svelte          # Interactive quiz component
│       └── RecipeCard.svelte    # Downloadable recipe card
├── routes/
│   ├── +page.svelte             # Hero with animated elements
│   ├── about/+page.svelte       # Tim's story (already exists, enhance)
│   ├── blog/
│   │   ├── +page.server.js      # Load all posts with import.meta.glob
│   │   ├── +page.svelte         # Blog listing page
│   │   └── [slug]/
│   │       ├── +page.server.js  # Load specific post
│   │       └── +page.svelte     # Post template
│   ├── quiz/
│   │   ├── +page.svelte         # Quiz UI
│   │   └── [result]/+page.svelte # Result page matching user to cheese
│   └── newsletter/
│       └── +page.server.js      # Form action for signup
└── content/
    └── blog/
        ├── recipes/
        │   └── *.md             # Recipe posts
        └── lifestyle/
            └── *.md             # Tim's adventures
```

### Pattern 1: MDSveX Blog with import.meta.glob
**What:** Load markdown posts dynamically using Vite's glob import
**When to use:** All blog content - recipes and lifestyle posts
**Example:**
```typescript
// Source: https://joyofcode.xyz/sveltekit-markdown-blog
// routes/blog/+page.server.js
export async function load() {
  const posts = import.meta.glob('/src/content/blog/**/*.md', { eager: true });

  const allPosts = Object.entries(posts).map(([path, post]) => {
    const slug = path.split('/').pop()?.replace('.md', '');
    return {
      slug,
      ...post.metadata  // frontmatter: title, date, excerpt, category
    };
  });

  // Sort by date, filter published
  return {
    posts: allPosts
      .filter(p => p.published)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  };
}
```

### Pattern 2: Frontmatter Structure
**What:** Consistent metadata for all blog posts
**When to use:** Every markdown file in /content/blog
**Example:**
```markdown
---
title: "Spicy Nachos with Cheddar is Beddar"
date: "2026-01-15"
excerpt: "A game-changing recipe that combines sharp cheddar with..."
category: "recipe"
published: true
prepTime: "10 min"
cookTime: "15 min"
servings: 4
products: ["cheddar-beddar"]  # Links to flavors
---

Content here with Svelte components available...
```

### Pattern 3: Hero Animation with Spring Physics
**What:** Bouncy, personality-driven animations using existing animation utilities
**When to use:** Homepage hero section
**Example:**
```svelte
<script>
  import { bouncySpring } from '$lib/utils/animations';
  import { inview } from '$lib/actions/inview';
  import { prefersReducedMotion } from '$lib/utils/animations';

  let scale = bouncySpring(0.8);
  let rotation = bouncySpring(0);

  function handleInView() {
    if (prefersReducedMotion()) {
      scale.set(1, { duration: 0 });
    } else {
      scale.set(1);
      rotation.set(360);
    }
  }
</script>

<div use:inview on:inview={handleInView}
     style="transform: scale({$scale}) rotate({$rotation}deg)">
  <!-- Hero content -->
</div>
```

### Pattern 4: Quiz State Management with $state Runes
**What:** Score-based personality matching using Svelte 5 runes
**When to use:** Flavor finder quiz
**Example:**
```svelte
<script>
  import { flavors } from '$lib/data/flavors';

  let currentQuestion = $state(0);
  let scores = $state({
    'white-cheese': 0,
    'orange-spice': 0,
    'mozz-pure': 0,
    'cheddar-beddar': 0,
    'mega-spice': 0
  });

  let winner = $derived(
    Object.entries(scores)
      .sort(([,a], [,b]) => b - a)[0][0]
  );

  function selectAnswer(flavorId: string) {
    scores[flavorId] += 1;
    currentQuestion += 1;
  }
</script>
```

### Pattern 5: Form Actions with Progressive Enhancement
**What:** Newsletter signup using SvelteKit native form actions
**When to use:** Newsletter signup form
**Example:**
```typescript
// Source: https://svelte.dev/docs/kit/form-actions
// routes/newsletter/+page.server.js
import { fail } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');

    // Basic validation
    if (!email || !email.includes('@')) {
      return fail(400, { email, error: 'Invalid email' });
    }

    // Store email (implement based on backend)
    // await db.newsletters.create({ email });

    return { success: true };
  }
};
```

```svelte
<!-- routes/newsletter/+page.svelte -->
<script>
  import { enhance } from '$app/forms';
  export let form;
</script>

<form method="POST" use:enhance>
  <input type="email" name="email" required
         value={form?.email ?? ''} />
  {#if form?.error}
    <p class="error">{form.error}</p>
  {/if}
  {#if form?.success}
    <p class="success">Thanks for subscribing!</p>
  {/if}
  <button type="submit">Subscribe</button>
</form>
```

### Pattern 6: Client-Side PDF Generation
**What:** Generate downloadable recipe cards using jsPDF
**When to use:** Recipe card download button
**Example:**
```typescript
// Source: https://github.com/parallax/jsPDF
// lib/utils/pdf-generator.ts
import { jsPDF } from 'jspdf';

export function generateRecipeCard(recipe: {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [4, 6]  // 4x6 recipe card
  });

  // Title
  doc.setFontSize(16);
  doc.text(recipe.title, 0.5, 0.5);

  // Ingredients
  doc.setFontSize(10);
  doc.text('Ingredients:', 0.5, 1);
  let y = 1.2;
  recipe.ingredients.forEach(ing => {
    doc.text(`• ${ing}`, 0.5, y);
    y += 0.2;
  });

  // Instructions
  doc.text('Instructions:', 0.5, y + 0.2);
  y += 0.4;
  recipe.instructions.forEach((step, i) => {
    doc.text(`${i + 1}. ${step}`, 0.5, y);
    y += 0.3;
  });

  doc.save(`${recipe.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}
```

### Anti-Patterns to Avoid
- **Building custom markdown parser** - MDSveX handles this, don't reinvent
- **Server-side PDF generation** - Adds deployment complexity, use client-side jsPDF
- **Complex form validation libraries** - Simple email validation doesn't need Zod/Yup
- **Imperative animation code** - Use existing spring/tweened stores, not manual requestAnimationFrame
- **Storing content in database** - Markdown in repo is simpler for v1, no CMS needed
- **Multiple `$effect` for derived state** - Use `$derived` instead, it's memoized

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown to HTML | Custom regex parser | MDSveX | Handles frontmatter, Svelte components, edge cases (nested lists, code blocks, escaping) |
| PDF generation | Canvas + blob APIs | jsPDF | Cross-browser compatibility, fonts, layout calculations, file encoding |
| Syntax highlighting | Regex-based colorizer | Shiki | Accurate tokenization, 100+ languages, theme support, maintained by VS Code team |
| Email validation | Simple regex | HTML5 + basic validation | Edge cases (unicode domains, quoted strings, comments in emails) are complex |
| Spring physics | Linear interpolation | svelte/motion springs | Calculates velocity, damping, stiffness - non-trivial physics |
| Form progressive enhancement | Custom fetch wrapper | use:enhance | Handles loading states, redirects, errors, history, accessibility |

**Key insight:** Content management looks simple but gets complex fast. MDSveX handles markdown quirks (nested formatting, special characters in code blocks, Svelte syntax collisions). jsPDF handles PDF edge cases (character encoding, font metrics, page breaks). Use proven solutions.

## Common Pitfalls

### Pitfall 1: Forgetting to Use $state for Quiz Reactivity
**What goes wrong:** Quiz scores don't update UI when answers are selected
**Why it happens:** Svelte 5 requires explicit `$state` rune - plain `let` isn't reactive anymore
**How to avoid:** Always use `let scores = $state({...})` for reactive state
**Warning signs:** UI doesn't update after interactions, console shows no errors

### Pitfall 2: MDSveX + Svelte Syntax Collisions
**What goes wrong:** Markdown code blocks with `{` or `<script>` break compilation
**Why it happens:** MDSveX processes Svelte syntax in markdown, special chars need escaping
**How to avoid:** Use Shiki's `escapeSvelte()` in highlighter config, or use backticks in markdown
**Warning signs:** Build errors about "unexpected token" in markdown files
**Example fix:**
```javascript
// In mdsvex.config.js
import { escapeSvelte } from 'mdsvex';
highlight: {
  highlighter: async (code, lang) => {
    const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
    return `{@html \`${html}\` }`;
  }
}
```

### Pitfall 3: Using $effect Instead of $derived for Computed Values
**What goes wrong:** Quiz results recalculate unnecessarily, performance degrades
**Why it happens:** `$effect` runs side effects on every change, `$derived` is memoized
**How to avoid:** Use `$derived` for pure computations, `$effect` only for side effects
**Warning signs:** Sluggish UI, excessive console logs, redundant calculations
**Rule of thumb:** If it returns a value → `$derived`. If it does something → `$effect`.

### Pitfall 4: Ignoring prefers-reduced-motion
**What goes wrong:** Users with motion sensitivity get bouncy animations anyway
**Why it happens:** Animations default to "on", developers forget to check user preference
**How to avoid:** Use existing `prefersReducedMotion()` utility before all animations
**Warning signs:** Accessibility audits fail, users report dizziness/discomfort
**Implementation:**
```typescript
if (prefersReducedMotion()) {
  scale.set(1, { duration: 0 });  // Instant, no motion
} else {
  scale.set(1);  // Bouncy spring animation
}
```

### Pitfall 5: Binding to Exported State in Runes Mode
**What goes wrong:** `<Quiz bind:currentQuestion />` causes compilation errors
**Why it happens:** Svelte 5 exports aren't bindable by default, need explicit `$bindable()`
**How to avoid:** Mark props as `let { currentQuestion = $bindable(0) } = $props()`
**Warning signs:** Error: "Cannot bind to this property in runes mode"

### Pitfall 6: Forgetting to Prerender Blog Routes
**What goes wrong:** Dynamic blog routes generate at request time, slow initial loads
**Why it happens:** SvelteKit doesn't know which slugs exist without prerender config
**How to avoid:** Add `export const prerender = true;` to blog +page.server.js files
**Warning signs:** Slow Time To First Byte, missing routes in static build

### Pitfall 7: jsPDF Text Overflow
**What goes wrong:** Long ingredient lists or instructions run off recipe card PDF
**Why it happens:** jsPDF doesn't auto-wrap text, needs manual line breaks
**How to avoid:** Use `doc.splitTextToSize()` or calculate line breaks based on width
**Warning signs:** Cut-off text in downloaded PDFs, overlapping content

## Code Examples

Verified patterns from official sources:

### MDSveX Configuration with Shiki
```javascript
// Source: https://github.com/johnhooks/highlighter
// svelte.config.js
import { defineMDSveXConfig, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

const theme = 'github-dark';
const highlighter = await createHighlighter({
  themes: [theme],
  langs: ['javascript', 'typescript', 'svelte', 'bash']
});

const mdsvexConfig = defineMDSveXConfig({
  extensions: ['.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const html = escapeSvelte(
        highlighter.codeToHtml(code, { lang, theme })
      );
      return `{@html \`${html}\` }`;
    }
  }
});

const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [vitePreprocess(), mdsvex(mdsvexConfig)],
  kit: {
    adapter: adapter()
  }
};

export default config;
```

### Dynamic Blog Route with Slug
```typescript
// Source: https://svelte.dev/docs/kit/routing
// routes/blog/[slug]/+page.server.js
export async function load({ params }) {
  try {
    const post = await import(`../../../content/blog/${params.slug}.md`);
    return {
      content: post.default,
      metadata: post.metadata
    };
  } catch (e) {
    throw error(404, 'Post not found');
  }
}
```

### Intersection Observer for Scroll Animations
```typescript
// Source: Existing implementation at src/lib/actions/inview.ts
// Already built in Phase 2, use this pattern for hero animations
export function inview(node: HTMLElement, options = {}) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.dispatchEvent(new CustomEvent('inview'));
        }
      });
    },
    { threshold: 0.5, ...options }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    }
  };
}
```

### Accessibility-First Animation Pattern
```svelte
<!-- Source: Existing pattern from Phase 2 -->
<script>
  import { bouncySpring, prefersReducedMotion } from '$lib/utils/animations';
  import { inview } from '$lib/actions/inview';

  let animated = $state(false);
  let y = bouncySpring(50);
  let opacity = bouncySpring(0);

  function animate() {
    if (animated) return;
    animated = true;

    if (prefersReducedMotion()) {
      y.set(0, { duration: 0 });
      opacity.set(1, { duration: 0 });
    } else {
      y.set(0);
      opacity.set(1);
    }
  }
</script>

<div use:inview on:inview={animate}
     style="transform: translateY({$y}px); opacity: {$opacity}">
  <!-- Content -->
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| let count = 0 | let count = $state(0) | Svelte 5 (2024) | Explicit reactivity, better performance |
| $: derived = count * 2 | let derived = $derived(count * 2) | Svelte 5 (2024) | Clearer intent, memoization |
| Prism.js / Highlight.js | Shiki | 2023+ | Zero runtime JS, build-time highlighting |
| on:click={handler} | onclick={handler} | Svelte 5 (2024) | Standard DOM properties |
| MDX (React) | MDSveX (Svelte) | N/A | Svelte-specific, better integration |

**Deprecated/outdated:**
- **Svelte stores for local state** - Still work but `$state` runes are preferred in new code
- **`export let prop`** - Use `let { prop } = $props()` in Svelte 5
- **`on:` event directives** - Use standard `onclick`, `onsubmit` properties
- **Static site adapters for blogs** - SvelteKit's built-in prerendering handles this now

## Open Questions

Things that couldn't be fully resolved:

1. **Email Storage Backend**
   - What we know: SvelteKit form actions handle submission, validation works
   - What's unclear: Where to store newsletter emails (database, email service API, flat file)
   - Recommendation: Defer to implementation phase - could be Mailchimp API, Resend, or simple JSON file for v1

2. **Quiz Result Persistence**
   - What we know: Score-based matching algorithm is straightforward
   - What's unclear: Should results be shareable URLs? Saved to localStorage?
   - Recommendation: Start with non-persistent, add localStorage if user testing shows value

3. **Blog Search/Filtering**
   - What we know: import.meta.glob loads all posts, frontmatter has categories
   - What's unclear: Is client-side filtering sufficient or needed at all for v1?
   - Recommendation: Category filtering only (recipes vs lifestyle), defer full search to Phase 4+

4. **Recipe Card Print Styling**
   - What we know: jsPDF generates downloadable PDFs
   - What's unclear: Should web recipe pages also have print CSS for direct printing?
   - Recommendation: Start with PDF download only, add print CSS if users request it

## Sources

### Primary (HIGH confidence)
- **Svelte 5 Runes** - https://svelte.dev/docs/svelte/v5-migration-guide - Official migration guide with patterns and pitfalls
- **SvelteKit Form Actions** - https://svelte.dev/docs/kit/form-actions - Official docs on progressive enhancement
- **Svelte Motion** - https://svelte.dev/docs/svelte/svelte-motion - Official spring/tweened documentation
- **jsPDF GitHub** - https://github.com/parallax/jsPDF - Official repository with usage examples
- **Superforms Documentation** - https://superforms.rocks - Official docs for form validation library

### Secondary (MEDIUM confidence)
- **MDSveX + SvelteKit Blog Tutorials** - https://joyofcode.xyz/sveltekit-markdown-blog, https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog - Comprehensive guides (2024-2025)
- **Shiki + MDSveX Integration** - https://github.com/johnhooks/highlighter, https://rodneylab.com/sveltekit-shiki-syntax-highlighting/ - Working implementations
- **Svelte 5 Global State Patterns** - https://mainmatter.com/blog/2025/03/11/global-state-in-svelte-5/ - Best practices from Mainmatter
- **Accessibility Animation Best Practices** - https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html - WCAG guidelines
- **Intersection Observer API** - https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API - MDN documentation

### Tertiary (LOW confidence - community findings)
- **Quiz Implementation Examples** - https://www.svelteexamples.com/projects/quiz-app/, https://github.com/eyssette/text2quiz - Community examples showing patterns
- **Email Validation Best Practices** - https://mailtrap.io/blog/javascript-email-validation/ - 2026 tutorial on validation approaches
- **PDF Recipe Card Design** - https://www.adobe.com/acrobat/guides/recipe-card-template.html - Design guidance from Adobe

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - MDSveX, jsPDF, and Shiki are established tools with active maintenance
- Architecture: HIGH - Patterns verified against official docs and existing Phase 1/2 code
- Pitfalls: HIGH - Documented in official Svelte 5 migration guide and real-world usage

**Research date:** 2026-02-04
**Valid until:** 2026-04-04 (60 days - stable ecosystem)

**Notes:**
- Svelte 5 is stable (released 2024), patterns are mature
- MDSveX is mature library, no breaking changes expected
- jsPDF is stable, v2.x maintained for 2+ years
- SvelteKit form actions are built-in, no version concerns
- Animation infrastructure from Phase 2 reuses perfectly - no new patterns needed

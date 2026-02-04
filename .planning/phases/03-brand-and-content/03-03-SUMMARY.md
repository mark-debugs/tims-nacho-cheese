---
phase: 03-brand-and-content
plan: 03
type: summary
completed: 2026-02-04
duration: 6.5 min
commits:
  - 92e779d: "feat(03-03): add blog content system with MDSveX posts and routing"
  - 1d540ad: "feat(03-03): add recipe PDF downloads and newsletter signup"
subsystem: content-blog
tags: [mdsvex, blog, recipes, newsletter, pdf, jspdf, forms]
requires: ["03-01"]
provides:
  - "Blog content system with 4 markdown posts (2 recipes, 2 lifestyle)"
  - "Recipe card PDF download with jsPDF (4x6 printable format)"
  - "Newsletter signup with email validation and inline feedback"
  - "Dynamic blog listing with category filtering"
affects: []
tech-stack:
  added: []
  patterns:
    - "MDSveX content with import.meta.glob for dynamic loading"
    - "use:enhance custom callback for form submission without navigation"
    - "Dynamic import for browser-only libraries (jsPDF) to avoid SSR issues"
    - "splitTextToSize for PDF text wrapping to prevent overflow"
key-files:
  created:
    - src/content/blog/recipes/spicy-nachos-supreme.md
    - src/content/blog/recipes/mozz-pizza-dip.md
    - src/content/blog/lifestyle/tims-surf-trip.md
    - src/content/blog/lifestyle/skate-and-cheese.md
    - src/routes/blog/+page.server.ts
    - src/routes/blog/[slug]/+page.server.ts
    - src/routes/blog/[slug]/+page.svelte
    - src/lib/utils/pdf-generator.ts
    - src/lib/components/RecipeCard.svelte
    - src/routes/newsletter/+page.server.ts
    - src/lib/components/NewsletterSignup.svelte
  modified:
    - src/routes/blog/+page.svelte
    - tailwind.config.js
decisions:
  - id: mdsvex-import-glob
    what: "Use import.meta.glob for loading markdown posts"
    why: "Enables dynamic post discovery without manual imports, scales as content grows"
    alternatives: ["Manual imports per post", "File system loader in +page.server.ts"]
  - id: jspdf-dynamic-import
    what: "Dynamic import jsPDF in RecipeCard click handler"
    why: "jsPDF uses browser APIs (canvas, blob) that break SSR; dynamic import defers loading to client"
    alternatives: ["Static import with ssr: false in svelte.config.js", "Server-side PDF generation with Puppeteer"]
  - id: newsletter-use-enhance
    what: "use:enhance with custom callback (no update() call)"
    why: "Prevents navigation to /newsletter, keeps form inline on blog pages with response handling"
    alternatives: ["Bare form POST with full page reload", "Fetch API with manual form handling"]
  - id: font-display-tailwind
    what: "Added fontFamily.display to Tailwind config"
    why: "font-display utility class was used throughout site but not defined in config, causing build errors"
    alternatives: ["Use font-sans directly", "Define @layer utilities in app.css"]
---

# Phase 03 Plan 03: Blog Content & Newsletter Summary

**One-liner:** Blog content system with MDSveX markdown posts (2 recipes, 2 lifestyle), downloadable recipe card PDFs, and newsletter signup with inline validation.

## What Was Built

### Blog Content System (BLOG-01, BLOG-02)

Created 4 blog posts in markdown using MDSveX:

**Recipes (2):**
1. **Spicy Nachos Supreme with Orange Cheese** (2026-01-20)
   - Ingredients: 9 items including Tim's Orange Cheese with Spice
   - Instructions: 8 steps with Tim's personality (e.g., "Go thick — nobody wants a thin nacho")
   - Prep: 10 min, Cook: 15 min, Servings: 4
   - Product link: orange-spice
   - Content: Layering technique, pro tips, pairing suggestions

2. **Mozz Pure Pizza Dip** (2026-01-10)
   - Ingredients: 6 items including Tim's Mozz Pure
   - Instructions: 7 steps
   - Prep: 5 min, Cook: 20 min, Servings: 6
   - Product link: mozz-pure
   - Content: Why it works, stretch test, variations

**Lifestyle (2):**
3. **Tim's Epic Surf Trip Down the PCH** (2026-01-08)
   - Day-by-day surf trip narrative from Santa Cruz to Ventura
   - West coast adventure storytelling
   - Business happens organically (taco truck partnership story)

4. **How Skateboarding Influenced My Cheese Philosophy** (2025-12-15)
   - Commitment, style, community, resilience parallels
   - MEGA SPICE took 47 attempts story
   - Brand philosophy through lifestyle lens

**Technical Implementation:**
- Frontmatter: title, slug, date, excerpt, category, emoji, published
- Recipe-specific: prepTime, cookTime, servings, ingredients[], instructions[], products[]
- Blog listing: import.meta.glob loads all posts, filters by published, sorts by date
- Category filtering: Svelte 5 $state/$derived for "All", "Recipes", "Lifestyle" tabs
- Individual pages: Dynamic [slug] route with try/catch for recipes/ vs lifestyle/ lookup
- MDSveX rendering: `<svelte:component this={data.content} />` for component rendering
- Animations: inview for scroll-triggered entrances, cheeseStretch for hover bounce

### Recipe Card PDF Download (BLOG-03)

**PDF Generator (`src/lib/utils/pdf-generator.ts`):**
- jsPDF with 4x6 inch portrait format (standard recipe card size)
- Text wrapping: `doc.splitTextToSize()` for all text to prevent overflow
- Layout sections:
  - Header: Tim's Nacho Cheese branding (7pt italic)
  - Title: 14pt bold, multi-line support
  - Info bar: Prep/Cook/Servings in compact format
  - Ingredients: Bulleted list with 8pt text
  - Instructions: Numbered list with indentation
  - Footer: timsnachocheese.com URL
- Filename: Slugified recipe title (e.g., "spicy-nachos-supreme-recipe-card.pdf")

**RecipeCard Component:**
- Dynamic import: `const { generateRecipeCard } = await import('$lib/utils/pdf-generator')`
- Prevents SSR errors (jsPDF uses browser APIs)
- Loading state: Spinner + "Downloading..." text during PDF generation
- Styled button: nacho-500 bg, white text, rounded-full, cheeseStretch hover
- 500ms feedback delay: Brief loading state for visual confirmation

### Newsletter Signup (BLOG-04)

**Form Action (`src/routes/newsletter/+page.server.ts`):**
- Validation:
  - Required field check: `if (!email)` returns 400 error
  - Email format: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` regex
- Response: `{ success: true, email }` or `fail(400, { email, error: 'message' })`
- v1 placeholder: console.log (production will integrate Mailchimp/Resend/etc)

**NewsletterSignup Component:**
- use:enhance with custom callback:
  - Sets loading state on submit
  - Checks result.type === 'success' or 'failure'
  - Does NOT call update() to prevent navigation to /newsletter
- States: idle, loading, success, error
- Success UI: Green checkmark + "You're in! Stay cheesy." message
- Error UI: Red text below input with specific error message
- Form stays inline on blog listing and individual post pages
- Styling: Gradient nacho-400 to nacho-600 bg, white text, rounded-full inputs/buttons

## Decisions Made

### 1. import.meta.glob for Blog Post Loading
Used Vite's `import.meta.glob('/src/content/blog/**/*.md', { eager: true })` to dynamically load all markdown files. Scales better than manual imports, enables filtering/sorting at runtime.

### 2. Dynamic Import for jsPDF
jsPDF uses browser-only APIs (canvas, blob). Dynamic import in click handler (`await import(...)`) defers loading to client-side, avoiding SSR errors. Alternative (ssr: false in config) would affect entire route.

### 3. use:enhance Custom Callback Pattern
Newsletter form uses `use:enhance` with custom callback that does NOT call `update()`. This prevents navigation to /newsletter while still handling success/error states. Keeps form inline on blog pages.

### 4. font-display Tailwind Utility
Added `fontFamily.display` to Tailwind config. The utility class `font-display` was used throughout the site but undefined, causing build errors. Now properly maps to Baloo 2 font stack.

### 5. splitTextToSize for PDF Text Wrapping
All text in PDF uses `doc.splitTextToSize(text, maxWidth)` before rendering. Prevents overflow on long recipe titles, ingredients, or instructions. Critical for 4x6 format with limited width.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tailwind font-display undefined**
- **Found during:** Build phase after creating blog post page
- **Issue:** Build failed with "font-display class does not exist" error. Class used in blog pages but not defined in tailwind.config.js.
- **Fix:** Added `fontFamily.display` and `fontFamily.sans` to Tailwind theme.extend with proper font stacks.
- **Files modified:** tailwind.config.js
- **Commit:** 92e779d (included in Task 1 commit)

**2. [Rule 3 - Blocking] TypeScript type errors in blog listing**
- **Found during:** Type check after implementing blog listing
- **Issue:** Post metadata had `any` type, causing type errors on property access (published, date, title, etc).
- **Fix:** Created `PostMetadata` type with explicit fields (slug, title, date, excerpt, category, emoji, published). Cast posts to this type in loader.
- **Files modified:** src/routes/blog/+page.server.ts
- **Commit:** 92e779d (included in Task 1 commit)

**3. [Rule 3 - Blocking] Newsletter form action type safety**
- **Found during:** Type check after implementing newsletter component
- **Issue:** `result.data?.error` had type `{}`, couldn't assign to string.
- **Fix:** Added type assertion `(result.data as { error?: string })?.error` to safely extract error message.
- **Files modified:** src/lib/components/NewsletterSignup.svelte
- **Commit:** 1d540ad (included in Task 2 commit)

No architectural decisions needed (Rule 4). All issues were correctness/blocking bugs resolved inline.

## Testing Notes

**Build Verification:**
- `npm run build`: Passed (2.34s client, 5.31s total)
- `npm run check`: 0 errors, 9 warnings (all benign: @apply not recognized by CSS linter, svelte:component deprecated warning)

**Manual Testing (via dev server):**
- Blog listing (/blog): 4 posts render, category filter toggles work
- Recipe post (/blog/spicy-nachos-supreme): Ingredients, instructions, product links visible
- Lifestyle post (/blog/tims-surf-trip): Markdown content renders with prose styling
- Recipe PDF download: Clicking button generates 4x6 PDF with wrapped text
- Newsletter signup: Valid email shows success, invalid shows error, empty shows required message

## Architecture Notes

**Blog Content Flow:**
```
src/content/blog/{category}/{slug}.md
  ↓ (MDSveX preprocessing at build time)
  ↓ (import.meta.glob in +page.server.ts)
  ↓ (metadata extraction + filtering)
src/routes/blog/+page.svelte (listing with category filter)
src/routes/blog/[slug]/+page.svelte (individual post rendering)
```

**Newsletter Form Flow:**
```
NewsletterSignup.svelte component
  ↓ (use:enhance custom callback)
  ↓ (POST to /newsletter action)
src/routes/newsletter/+page.server.ts (validation + response)
  ↓ (result.type checked in callback)
  ↓ (inline success/error UI, no navigation)
```

**PDF Generation Flow:**
```
Recipe post page with RecipeCard component
  ↓ (user clicks "Download Recipe Card")
  ↓ (dynamic import of pdf-generator.ts - CLIENT ONLY)
  ↓ (jsPDF creates 4x6 PDF with splitTextToSize wrapping)
  ↓ (doc.save() triggers browser download)
```

## Performance Metrics

- **Execution time:** 6.5 minutes (389 seconds)
- **Tasks completed:** 2/2
- **Commits:** 2 (1 per task, atomic)
- **Files created:** 11
- **Files modified:** 2
- **Build time:** 7.65s (2.34s client + 5.31s server)
- **Type safety:** 0 errors, all warnings benign

**Task breakdown:**
- Task 1 (Blog content + routing): ~4 min
- Task 2 (PDF + newsletter): ~2.5 min

## Next Phase Readiness

**Phase 3 Status:**
- ✅ 03-01: Content pipeline (MDSveX) & brand animation (homepage/about)
- ✅ 03-02: Quiz funnel (placeholder - awaits backend)
- ✅ 03-03: Blog content & newsletter

**Phase 3 Complete!** All brand and content features delivered:
- Homepage hero with bouncy animations
- About page with scroll-triggered sections
- Product showcase with flavor personalities
- Blog with recipes and lifestyle content
- Newsletter signup for audience capture
- Quiz funnel (placeholder for backend integration)

**Ready for Phase 4 (E-commerce):**
- Content foundation in place
- Blog driving product discovery (recipe → product links)
- Newsletter capturing early audience
- Brand personality established through content
- MDSveX pipeline ready for additional content types (product descriptions, FAQ, etc)

**Blockers for next phase:** None

**Concerns for next phase:** None

**Recommendations:**
1. Add more recipe content as products launch (leverage established blog system)
2. Integrate newsletter with Mailchimp/Resend before public launch
3. Consider blog post tags for cross-referencing (e.g., "spicy", "quick", "party food")
4. Add social sharing buttons to blog posts (future enhancement)

## Files Delivered

### Content (4 markdown files)
- `src/content/blog/recipes/spicy-nachos-supreme.md` (47 lines, recipe post)
- `src/content/blog/recipes/mozz-pizza-dip.md` (45 lines, recipe post)
- `src/content/blog/lifestyle/tims-surf-trip.md` (42 lines, lifestyle post)
- `src/content/blog/lifestyle/skate-and-cheese.md` (48 lines, lifestyle post)

### Routes (3 files)
- `src/routes/blog/+page.server.ts` (28 lines, blog listing loader)
- `src/routes/blog/[slug]/+page.server.ts` (18 lines, individual post loader)
- `src/routes/blog/[slug]/+page.svelte` (244 lines, post template with recipe sections)

### Components (2 files)
- `src/lib/components/RecipeCard.svelte` (58 lines, PDF download button)
- `src/lib/components/NewsletterSignup.svelte` (73 lines, newsletter form with inline feedback)

### Utilities (1 file)
- `src/lib/utils/pdf-generator.ts` (83 lines, jsPDF recipe card generator)

### Form Actions (1 file)
- `src/routes/newsletter/+page.server.ts` (24 lines, newsletter validation)

### Configuration (1 file, modified)
- `tailwind.config.js` (+23 lines, added fontFamily.display and fontFamily.sans)

### Page Updates (1 file, modified)
- `src/routes/blog/+page.svelte` (replaced hardcoded content with dynamic listing + filters)

**Total impact:**
- 11 files created
- 2 files modified
- ~600 lines of code (excluding markdown content)
- 2 atomic commits

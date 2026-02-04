# Technology Stack

**Project:** Tim's Nacho Cheese — Animated Showcase Website
**Researched:** 2026-02-03
**Confidence:** HIGH

## Executive Summary

For a SvelteKit showcase website with heavy animations (flame effects, melting cheese, bouncy interactions), the 2025 standard stack centers around:

- **SvelteKit + Tailwind CSS v4** for framework and styling
- **GSAP 3** for complex timeline-based animations (flames, melting effects)
- **Svelte's built-in transitions** for simple UI animations (bouncy buttons, page transitions)
- **@sveltejs/enhanced-img** for automatic image optimization
- **shadcn-svelte** for copy-paste UI components with full customization
- **Superforms + Zod** for blog comment forms and newsletter signup
- **@sveltejs/adapter-node** for Docker deployment

This stack prioritizes developer experience (DX), performance, and flexibility for creative animations while maintaining type safety and modern best practices.

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **SvelteKit** | Latest | Full-stack framework | Already decided. Provides SSR, routing, and server endpoints for blog |
| **Bun** | Latest | JavaScript runtime | Already decided. Faster than Node for development |
| **TypeScript** | ~5.5+ | Type safety | Standard for modern SvelteKit projects. Zod integration requires it |
| **Vite** | ~6.3+ | Build tool | Bundled with SvelteKit. Required for enhanced-img and Tailwind v4 |

**Confidence:** HIGH — Official SvelteKit stack, well-documented

---

### Styling & UI

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Tailwind CSS** | 4.1+ (v4) | Utility-first CSS framework | Industry standard for rapid UI development. v4 uses Vite plugin (simpler than PostCSS approach). Perfect for orange color palette and responsive design |
| **@tailwindcss/vite** | Latest | Tailwind v4 Vite integration | Required for Tailwind v4. Replaces old PostCSS setup |
| **shadcn-svelte** | Latest | Copy-paste UI components | Not a dependency — copy components into project. Built on Tailwind + Bits UI. Provides customizable buttons, cards, dialogs. Composable and AI-friendly |
| **Lucide Svelte** | ~0.562+ | Icon library | 1000+ SVG icons, tree-shakable, TypeScript support. Includes fire, cheese, skateboard icons needed for brand |

**Confidence:** HIGH — Official Tailwind docs confirm v4 approach. shadcn-svelte is community standard for SvelteKit

**Installation:**
```bash
# Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# Icons
npm install lucide-svelte

# shadcn-svelte (CLI-based, copies components)
npx shadcn-svelte@latest init
```

**Sources:**
- [Tailwind CSS with SvelteKit](https://tailwindcss.com/docs/guides/sveltekit)
- [shadcn-svelte](https://www.shadcn-svelte.com/docs)
- [Lucide Svelte](https://lucide.dev/guide/packages/lucide-svelte)

---

### Animation Libraries

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **GSAP** | ~3.14.2+ | Complex timeline animations | **FREE for commercial use** (Webflow-sponsored). Best for flame effects, melting cheese, scroll-triggered animations. Integrates with Svelte 5 via `@attach` or actions. Industry standard for professional web animation |
| **Svelte transitions** | Built-in | Simple UI animations | Use for page transitions, button hover effects, fade-ins. No external dependency. Performant and declarative |

**Confidence:** HIGH — GSAP is free (verified on official pricing page). Svelte transitions are built-in and well-documented

**When to use which:**
- **GSAP:** Flames licking up the screen, cheese dripping/melting, complex scroll animations, coordinated multi-element timelines
- **Svelte transitions:** Button bounces, fade-in on scroll, page transitions, menu open/close

**Installation:**
```bash
npm install gsap
```

**Integration pattern (Svelte 5):**
```typescript
// Use Svelte 5 @attach for GSAP animations
import { gsap } from 'gsap';

function animate(node: HTMLElement) {
  gsap.from(node, { opacity: 0, y: 50, duration: 1 });
}

// In component:
<div {@attach}={animate}>Animated content</div>
```

**Alternative considered:** Motion One (@motionone/svelte) — Rejected because package is 2+ years stale (last updated 2023). GSAP has active development and full Svelte 5 support.

**Sources:**
- [GSAP Pricing (FREE)](https://gsap.com/pricing/)
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no)
- [Svelte Attachments Explained](https://joyofcode.xyz/svelte-attachments-explained)

---

### Image Optimization

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **@sveltejs/enhanced-img** | ~0.9.2+ | Build-time image optimization | Official SvelteKit plugin. Auto-generates AVIF/WebP formats, multiple sizes for responsive images, sets intrinsic dimensions (prevents layout shift). Perfect for product photos (cheese bottles, merch) |
| **Vite asset handling** | Built-in | Static asset optimization | Automatic hash-based caching for imported images. Import from `src/lib/images` for immutable caching |

**Confidence:** MEDIUM — Package is experimental (pre-1.0) but official and actively maintained

**Installation:**
```bash
npm install -D @sveltejs/enhanced-img
```

**Configuration (svelte.config.js):**
```javascript
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  },
  plugins: [enhancedImages()]
};
```

**Usage:**
```svelte
<script>
  import cheeseBottle from '$lib/images/mega-spice.jpg?enhanced';
</script>

<enhanced:img src={cheeseBottle} alt="MEGA SPICE Face Melter" />
```

**Note:** For dynamic images (user-uploaded blog photos in future), consider CDN (Cloudinary) or runtime optimizer (SvelteKit Image Optimizer with Sharp). Not needed for MVP.

**Sources:**
- [SvelteKit Images Documentation](https://svelte.dev/docs/kit/images)
- [SvelteKit Image Plugin](https://rodneylab.com/sveltekit-image-plugin/)

---

### Forms & Validation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Superforms** | ~2.29.1+ | SvelteKit form library | De facto standard for SvelteKit forms. Handles server/client validation, loading states, progressive enhancement. Supports Zod, Valibot, Yup, and 8+ other validators |
| **Zod** | ~3.24+ | Schema validation | TypeScript-first validation. Industry standard. Zero dependencies, 2kb gzipped. Provides runtime validation + type inference |

**Confidence:** HIGH — Superforms is SvelteKit community standard. Zod is TypeScript ecosystem standard

**Use cases:**
- Blog comment forms (name, email, comment)
- Newsletter signup (email validation)
- Contact form (future phase)

**Installation:**
```bash
npm install sveltekit-superforms zod
```

**Example (blog comment):**
```typescript
// schema.ts
import { z } from 'zod';

export const commentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  comment: z.string().min(10, 'Comment must be at least 10 characters')
});
```

**Security note:** Superforms had a prototype pollution vulnerability in v2.27.3 and prior. **Use v2.27.4+** (current is 2.29.1).

**Sources:**
- [Superforms](https://superforms.rocks/)
- [Zod Documentation](https://zod.dev/)
- [CVE-2025-62381 (Superforms security fix)](https://advisories.gitlab.com/pkg/npm/sveltekit-superforms/CVE-2025-62381/)

---

### SEO & Meta Tags

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **svelte-meta-tags** | Latest | SEO metadata management | Simplifies Open Graph, Twitter Cards, JSON-LD for blog posts. Better than manual `<svelte:head>` tags for complex SEO needs |

**Confidence:** MEDIUM — Package is maintained but custom `<svelte:head>` is official alternative

**Alternative approach:** Use built-in `<svelte:head>` for simple cases (homepage, product pages). Add svelte-meta-tags if blog SEO becomes complex (per-post Open Graph images, structured data).

**Installation (deferred to blog phase):**
```bash
npm install svelte-meta-tags
```

**Sources:**
- [svelte-meta-tags npm](https://www.npmjs.com/package/svelte-meta-tags)
- [SvelteKit SEO Guide](https://rodneylab.com/sveltekit-seo/)

---

### Developer Experience

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Prettier** | Latest | Code formatting | Standard formatter. Auto-formats on save |
| **prettier-plugin-svelte** | ~4.x | Svelte formatting | Official Prettier plugin for .svelte files. v4 supports Svelte 5 |
| **ESLint** | Latest | Code linting | Catches errors, enforces code style |
| **@sveltejs/eslint-config** | Latest | Svelte ESLint rules | Official ESLint config for SvelteKit projects |

**Confidence:** HIGH — Official tooling

**Installation:**
```bash
npm install -D prettier prettier-plugin-svelte eslint @sveltejs/eslint-config
```

**Note:** prettier-plugin-svelte v4 requires Svelte 5. If using Svelte 4, use v3.x.

**Sources:**
- [prettier-plugin-svelte](https://github.com/sveltejs/prettier-plugin-svelte)
- [Svelte CLI Prettier Docs](https://svelte.dev/docs/cli/prettier)

---

### Deployment

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **@sveltejs/adapter-node** | Latest | Node.js server adapter | Compiles SvelteKit app for Node.js deployment. Required for Docker + self-hosting |
| **Docker** | Latest | Containerization | Already decided. Enables consistent deployment across environments |

**Confidence:** HIGH — Official adapter, standard Docker deployment pattern

**Installation:**
```bash
npm install -D @sveltejs/adapter-node
```

**Configuration (svelte.config.js):**
```javascript
import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter({
      out: 'build',
      precompress: true // Gzip/Brotli compression
    })
  }
};
```

**Dockerfile (multi-stage build):**
```dockerfile
FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build
RUN bun install --production --frozen-lockfile

FROM oven/bun:1-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
ENV ORIGIN=http://localhost:3000
CMD ["bun", "run", "build"]
```

**Environment variables:**
- `ORIGIN`: Set to production domain to avoid CSRF errors on form submissions
- `PORT`: Default 3000, override if needed

**Sources:**
- [SvelteKit adapter-node](https://svelte.dev/docs/kit/adapter-node)
- [Dockerizing SvelteKit (2025)](https://dev.to/code42cate/how-to-dockerize-sveltekit-3oho)
- [SvelteKit Docker Guide](https://khromov.se/dockerizing-your-sveltekit-applications-a-practical-guide/)

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| **Animation** | GSAP | Motion One | Motion One's Svelte bindings are 2+ years stale. GSAP is actively maintained and now free |
| **Animation** | GSAP | Svelte-Motion | Beta version, syntax may change. GSAP is production-ready |
| **Styling** | Tailwind v4 | UnoCSS | Tailwind has larger ecosystem, better SvelteKit docs, shadcn-svelte requires it |
| **UI Components** | shadcn-svelte | Flowbite Svelte | shadcn gives full code ownership (copy-paste). Flowbite is a dependency. Prefer control for custom animations |
| **Forms** | Superforms | Felte | Superforms is SvelteKit-specific with server/client validation. Felte is more generic |
| **Image Optimization** | enhanced-img | CDN (Cloudinary) | For static product photos, build-time optimization is simpler and free. CDN needed later for user uploads |
| **Deployment** | adapter-node | adapter-vercel | Self-hosted Docker was decided. adapter-node is correct choice |

---

## Installation Commands

### Initial Setup
```bash
# Core dependencies
npm install

# Styling
npm install tailwindcss @tailwindcss/vite lucide-svelte

# Animation
npm install gsap

# Forms & Validation
npm install sveltekit-superforms zod

# Image optimization
npm install -D @sveltejs/enhanced-img

# Developer experience
npm install -D prettier prettier-plugin-svelte eslint @sveltejs/eslint-config

# Deployment
npm install -D @sveltejs/adapter-node
```

### shadcn-svelte (Interactive CLI)
```bash
npx shadcn-svelte@latest init
```

This will ask for styling preferences (Tailwind theme) and install Bits UI dependencies.

---

## Stack Decisions Summary

| Decision | Confidence | Rationale |
|----------|------------|-----------|
| Tailwind v4 with Vite plugin | HIGH | Official 2025 approach, simpler than PostCSS |
| GSAP for complex animations | HIGH | Free, actively maintained, industry standard for timeline animations |
| Svelte transitions for simple UI | HIGH | Built-in, performant, declarative |
| shadcn-svelte over Flowbite | HIGH | Full code ownership enables custom animation integration |
| Superforms + Zod | HIGH | SvelteKit community standard, type-safe |
| @sveltejs/enhanced-img | MEDIUM | Experimental but official, actively maintained |
| svelte-meta-tags (deferred) | MEDIUM | Add later if blog SEO needs grow complex |
| adapter-node for Docker | HIGH | Official adapter, standard deployment pattern |

---

## Phase-Specific Recommendations

### Phase 1: Foundation
- SvelteKit + Tailwind v4
- Basic layout components (no heavy animation)
- Static asset handling via Vite

### Phase 2: Product Showcase
- GSAP for flame/melting effects on "MEGA SPICE" product
- @sveltejs/enhanced-img for product photos
- Lucide icons for product features

### Phase 3: Blog
- Superforms + Zod for comment forms
- svelte-meta-tags for per-post SEO
- Image optimization for blog post photos

### Phase 4: Merch Section
- Reuse product showcase patterns
- Add cart UI (no e-commerce backend yet)

### Phase 5: Deployment
- Dockerfile with adapter-node
- Environment variable configuration
- Docker Compose for local testing

---

## Known Issues & Gotchas

### @sveltejs/enhanced-img
- Pre-1.0 version (0.9.2), may introduce breaking changes
- Requires Vite 6.3+ and vite-plugin-svelte 6.0+
- Only works for build-time images (not dynamic/user-uploaded)

### Tailwind v4
- Currently in RC (Release Candidate), not stable
- Syntax changes: `@import "tailwindcss"` instead of `@tailwind base/components/utilities`
- Some third-party Tailwind plugins may not support v4 yet

### GSAP + Svelte 5
- Use `@attach` directive (Svelte 5 feature) for cleaner integration
- Avoid `onMount` + `bind:this` pattern (older approach, more verbose)

### Superforms Security
- CVE-2025-62381 affects v2.27.3 and prior
- **Must use v2.27.4+** (current is 2.29.1)

### Docker Deployment
- Set `ORIGIN` environment variable to production domain to avoid CSRF errors
- Use multi-stage build to keep image size small
- Bun's Docker image (`oven/bun:1-alpine`) is smaller than Node.js

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Framework (SvelteKit)** | HIGH | Official docs, already decided |
| **Styling (Tailwind v4)** | HIGH | Official Tailwind docs confirm Vite plugin approach |
| **Animation (GSAP)** | HIGH | Official pricing page confirms free use. Active community |
| **UI Components (shadcn)** | HIGH | Community standard for SvelteKit + Tailwind |
| **Forms (Superforms)** | HIGH | De facto SvelteKit form library |
| **Image Optimization** | MEDIUM | @sveltejs/enhanced-img is experimental (pre-1.0) |
| **SEO (svelte-meta-tags)** | MEDIUM | Custom `<svelte:head>` is official alternative |
| **Deployment (Docker)** | HIGH | Standard pattern, well-documented |

---

## Sources

### Framework & Build
- [SvelteKit Documentation](https://svelte.dev/docs/kit)
- [Tailwind CSS with SvelteKit](https://tailwindcss.com/docs/guides/sveltekit)
- [Svelte CLI Tailwind Docs](https://svelte.dev/docs/cli/tailwind)

### Animation
- [GSAP Pricing (FREE)](https://gsap.com/pricing/)
- [Integrating Svelte 5 with GSAP 3](https://dev.to/jasper-clarke/integrating-svelte-5-with-gsap-3-54no)
- [Svelte Attachments Explained](https://joyofcode.xyz/svelte-attachments-explained)
- [GSAP + Svelte Playground](https://svelte.dev/playground/000b2f192c204cd799dbb4f6d70a1c21)

### UI & Styling
- [shadcn-svelte](https://www.shadcn-svelte.com/docs)
- [Lucide Svelte](https://lucide.dev/guide/packages/lucide-svelte)

### Forms & Validation
- [Superforms](https://superforms.rocks/)
- [Zod Documentation](https://zod.dev/)
- [CVE-2025-62381 Security Advisory](https://advisories.gitlab.com/pkg/npm/sveltekit-superforms/CVE-2025-62381/)

### Images & Performance
- [SvelteKit Images Documentation](https://svelte.dev/docs/kit/images)
- [SvelteKit Image Plugin Guide](https://rodneylab.com/sveltekit-image-plugin/)

### SEO
- [svelte-meta-tags](https://github.com/oekazuma/svelte-meta-tags)
- [SvelteKit SEO Guide](https://rodneylab.com/sveltekit-seo/)

### Developer Experience
- [prettier-plugin-svelte](https://github.com/sveltejs/prettier-plugin-svelte)
- [Svelte CLI Prettier Docs](https://svelte.dev/docs/cli/prettier)

### Deployment
- [SvelteKit adapter-node](https://svelte.dev/docs/kit/adapter-node)
- [Dockerizing SvelteKit (2025)](https://dev.to/code42cate/how-to-dockerize-sveltekit-3oho)
- [SvelteKit Docker Practical Guide](https://khromov.se/dockerizing-your-sveltekit-applications-a-practical-guide/)
- [SvelteKit Dockerfile Gist](https://gist.github.com/aradalvand/04b2cad14b00e5ffe8ec96a3afbb34fb)

---

## Final Recommendation

This stack balances **creative freedom** (GSAP for wild animations), **developer experience** (Tailwind + shadcn for rapid UI), **type safety** (TypeScript + Zod), and **performance** (@sveltejs/enhanced-img, Svelte's reactivity).

**Key strengths for Tim's Nacho Cheese:**
1. **GSAP** enables the flame effects and melting cheese animations that make "MEGA SPICE" stand out
2. **Tailwind + shadcn** allow rapid iteration on the orange color palette and bouncy UI
3. **SvelteKit + adapter-node** provide server-side rendering for blog SEO while supporting Docker deployment
4. **Superforms + Zod** make blog comments and newsletter signup type-safe and user-friendly

**Start with:** SvelteKit + Tailwind v4 + GSAP + Lucide icons. Add Superforms when building blog forms. Add enhanced-img when product photos are finalized.

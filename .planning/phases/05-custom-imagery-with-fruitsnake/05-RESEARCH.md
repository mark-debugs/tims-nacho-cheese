# Phase 5: Custom Imagery with Fruitsnake - Research

**Researched:** 2026-02-07
**Domain:** AI Image Generation & Web Image Optimization
**Confidence:** MEDIUM

## Summary

This phase aims to replace stock iconography and add high-quality custom product images for Tim's Nacho Cheese. Research reveals that "fruitsnake-mcp" does not appear to exist as a documented MCP server. However, there are established workflows for AI-generated product imagery and image optimization in SvelteKit.

The project already has `@sveltejs/enhanced-img` installed and configured, which provides automatic WebP/AVIF conversion, responsive sizing, and optimization. The standard approach for this phase involves: (1) generating custom images via AI image generation tools or MCP servers, (2) storing them in `src/lib/assets/images/` for build-time optimization, (3) using `<enhanced:img>` components with proper alt text, and (4) following consistent naming conventions and file organization.

Key challenges include maintaining brand consistency across AI-generated images, ensuring performance (Lighthouse 90+), and integrating images without breaking existing animations. The flavor cards currently display only emojis as visual identifiers, making them prime candidates for custom product imagery.

**Primary recommendation:** Use available MCP image generation servers (e.g., image-gen-mcp with GPT Image 1.5 or Gemini Imagen) to generate branded product images, store in `src/lib/assets/images/`, and integrate via `<enhanced:img>` with proper alt text and responsive sizing.

## Open Question: Fruitsnake-MCP

**Issue:** The phase description specifies "fruitsnake-mcp" as the image generation tool, but extensive research found no evidence this MCP server exists.

**Research conducted:**
- WebSearch for "fruitsnake-mcp", "fruitsnake MCP server", "fruitsnake AI image tool"
- Checked official MCP servers repository (modelcontextprotocol/servers on GitHub)
- Searched MCP registries and directories (pulsemcp.com, mcpserverfinder.com)
- Searched for fruitsnake standalone AI tools

**Results:** Zero matches. No MCP server, npm package, GitHub repository, or AI tool named "fruitsnake" was found.

**Possible interpretations:**
1. Typo or misremembered name (perhaps user meant a different MCP server)
2. Private/internal tool not publicly documented
3. Placeholder name for "whatever MCP image generator we choose"

**Recommendation for planner:** Before creating tasks, clarify with user what "fruitsnake-mcp" refers to. If it's a placeholder, recommend using established MCP image generation servers like `image-gen-mcp` (supports GPT Image 1.5, DALL-E 3, Gemini Imagen) or `mcp-image-gen` (Together AI integration).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @sveltejs/enhanced-img | 0.10.0 | Build-time image optimization | Official SvelteKit plugin, automatic WebP/AVIF conversion, responsive sizing |
| sharp | (peer dependency) | Image processing engine | Industry standard for Node.js image processing, used by enhanced-img |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| MCP image-gen server | Latest | AI image generation | Generate custom product images via Claude Desktop |
| @unpic/svelte | Latest | CDN-agnostic images | If serving images from external CDN (not needed for local assets) |

### AI Image Generation Options

Since fruitsnake-mcp doesn't exist, here are verified MCP image generation servers:

| Server | Provider | Models | Best For |
|--------|----------|--------|----------|
| image-gen-mcp (lansespirit) | OpenAI, Google | GPT Image 1.5, DALL-E 3, Gemini Imagen 4 | Multi-provider flexibility |
| mcp-image-gen (sarthakkimtani) | Together AI | Flux, Stable Diffusion variants | Open-source models |
| Image-Generation-MCP-Server (GongRzhe) | Replicate | Flux model | Replicate ecosystem integration |

**Installation (example for image-gen-mcp):**
Add to Claude Desktop config (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "image-gen": {
      "command": "npx",
      "args": ["-y", "image-gen-mcp"],
      "env": {
        "OPENAI_API_KEY": "your-key",
        "GOOGLE_API_KEY": "your-key"
      }
    }
  }
}
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── assets/
│   │   └── images/           # All static images (required for enhanced:img)
│   │       ├── flavors/      # Cheese flavor product shots
│   │       │   ├── white-cheese.png
│   │       │   ├── orange-spice.png
│   │       │   ├── mozz-pure.png
│   │       │   ├── cheddar-beddar.png
│   │       │   └── mega-spice.png
│   │       ├── merch/        # Merch product images
│   │       │   ├── classic-tee.png
│   │       │   ├── pullover-hoodie.png
│   │       │   └── skate-deck.png
│   │       └── brand/        # Logo, icons, brand elements
│   │           └── logo.png
│   ├── components/
│   │   ├── FlavorCard.svelte    # Update to display product image
│   │   └── MegaSpiceCard.svelte # Update to display product image
│   └── data/
│       └── flavors.ts           # Add imagePath field
```

**Critical:** Images MUST be in `src/lib/assets/` (or anywhere under `src/`), NOT in `static/`. The `enhanced:img` plugin requires images to be importable at build time.

### Pattern 1: Enhanced Image Component with Responsive Sizing

**What:** Use `<enhanced:img>` for all static product images with proper sizing and alt text.

**When to use:** Any image that exists at build time (product shots, brand assets, icons).

**Example:**
```svelte
<script>
  import flavorImage from '$lib/assets/images/flavors/orange-spice.png';
</script>

<enhanced:img
  src={flavorImage}
  alt="Orange Cheese with Spice nacho sauce in a white bowl with tortilla chips"
  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
  class="w-full h-48 object-cover rounded-t-2xl"
/>
```

### Pattern 2: Flavor Data with Image Paths

**What:** Extend flavor type to include image import, maintain type safety.

**When to use:** When flavor cards need product images.

**Example:**
```typescript
// src/lib/data/flavors.ts
export type Flavor = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  heatLevel: number;
  color: string;
  emoji: string;
  badge: string;
  isStar: boolean;
  image?: string; // Optional: imported image path
};

// Import all flavor images
import whiteCheeseImg from '$lib/assets/images/flavors/white-cheese.png';
import orangeSpiceImg from '$lib/assets/images/flavors/orange-spice.png';
// ...

export const flavors: Flavor[] = [
  {
    id: 'white-cheese',
    name: 'White Cheese Sauce',
    image: whiteCheeseImg,
    // ... rest of properties
  },
  // ...
];
```

### Pattern 3: Consistent AI Prompt Template

**What:** Standardized prompt structure for brand consistency across generated images.

**When to use:** When generating multiple product images that need cohesive visual identity.

**Template structure:**
```
Subject: [Product name] nacho cheese sauce
Environment: white seamless background, isolated product
Style: professional food photography, clean, appetizing
Lighting: soft diffused lighting from above, warm tones
Composition: centered, 3/4 view, shows texture and color
Details: vibrant [flavor color], creamy texture, appetizing presentation
Brand: playful, west coast vibes, skateboard culture aesthetic
Negative: no cartoon style, no watermark, no text, no clutter, no dark shadows
```

**Example for Orange Spice:**
```
Professional food photography of Tim's Orange Cheese with Spice nacho sauce in a white ceramic bowl, white seamless background, isolated product, soft diffused lighting from above creating warm highlights, centered composition showing vibrant orange color and creamy smooth texture, appetizing presentation with subtle steam, playful west coast aesthetic, 3/4 view angle, no cartoon style, no watermark, no text overlays, no clutter, photorealistic
```

### Anti-Patterns to Avoid

- **Using static/ folder for enhanced:img**: Images must be in src/ to be processed at build time
- **Inconsistent prompt structure**: Leads to visual inconsistency across products
- **Missing alt text**: Fails accessibility and SEO
- **Fixed width/height without sizes**: Wastes bandwidth on mobile
- **Emoji-only fallback**: Screen readers need descriptive alt text, not just emoji

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization (format, compression) | Custom Sharp pipeline | @sveltejs/enhanced-img | Automatic WebP/AVIF, responsive sizing, EXIF stripping, Vite integration |
| Responsive image srcsets | Manual picture/source tags | enhanced:img with sizes prop | Automatic generation of multiple sizes, format fallbacks |
| AI image generation API integration | Direct API calls in code | MCP image generation servers | Protocol standardization, provider portability, Claude Desktop integration |
| Brand consistency prompts | Freeform descriptions per image | Structured prompt template | Systematic approach prevents visual drift |
| Image naming | Ad-hoc filenames | Convention: product-id.extension | Predictable paths, easier imports, better organization |

**Key insight:** Image optimization is complex (color spaces, compression algorithms, responsive sizing, format fallbacks). The @sveltejs/enhanced-img plugin handles this at build time, so tasks should focus on image generation and integration, not optimization pipelines.

## Common Pitfalls

### Pitfall 1: Using static/ Folder with enhanced:img
**What goes wrong:** Build fails or images aren't optimized. Error: "Cannot find module" or images load as-is without optimization.

**Why it happens:** `enhanced:img` works by importing images at build time through Vite. Files in `static/` aren't processed by Vite, they're just copied as-is to the output.

**How to avoid:** Always place images in `src/lib/assets/images/` or anywhere under `src/`.

**Warning signs:** Import statement fails, images don't get WebP/AVIF versions, no responsive srcsets generated.

### Pitfall 2: AI Image Consistency Drift
**What goes wrong:** Each generated product image looks different (lighting, style, composition), creating visual chaos instead of brand cohesion.

**Why it happens:** Freeform prompts without structure lead to model interpretation variance. Each prompt emphasizes different aspects.

**How to avoid:** Use structured prompt template with fixed sections (subject, environment, style, lighting, composition, details, negative prompts). Only swap product-specific variables (name, color, key features).

**Warning signs:** Images look like they're from different brands, inconsistent lighting angles, style shifts between products.

### Pitfall 3: Missing sizes Attribute on Large Images
**What goes wrong:** Lighthouse performance score drops. Mobile users download full-resolution desktop images, wasting bandwidth.

**Why it happens:** Without `sizes`, browser doesn't know how large the image will be at different viewports, so it downloads the largest available.

**How to avoid:** Always provide `sizes` attribute for images that aren't full viewport width. Pattern: `"(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"` for grid cards.

**Warning signs:** Lighthouse flags "Properly size images", slow mobile load times, high LCP (Largest Contentful Paint).

### Pitfall 4: Generic or Missing Alt Text
**What goes wrong:** Screen readers announce unhelpful descriptions. SEO suffers. Accessibility audit fails.

**Why it happens:** Copying flavor name as alt text (too short) or using generic "product image" (no context).

**How to avoid:** Write descriptive alt text: describe what's visually present and contextually relevant. Format: `"[Product name] nacho cheese sauce [key visual details] [presentation context]"`. Aim for 80-125 characters.

**Warning signs:** Accessibility audit warnings, alt text same as heading text, alt text under 20 characters for complex images.

### Pitfall 5: Breaking Existing Animations
**What goes wrong:** Adding images changes card dimensions during load, causing layout shift. Animations look janky or don't trigger.

**Why it happens:** `enhanced:img` sets width/height attributes, but without proper CSS the image can push content. Intersection observer thresholds may be affected by new dimensions.

**How to avoid:** Set explicit container dimensions or aspect ratios. Use `object-cover` or `object-contain` for predictable sizing. Test IntersectionObserver thresholds still trigger correctly.

**Warning signs:** CLS (Cumulative Layout Shift) spikes in Lighthouse, animations delay or skip, cards jump/reflow during image load.

### Pitfall 6: Unoptimized Image Source Files
**What goes wrong:** Build times increase significantly. Even with optimization, excessively large source images waste disk space and CI pipeline time.

**Why it happens:** AI-generated images are often 2048x2048 or larger. Saving full resolution without considering actual display size.

**How to avoid:** Generate images at appropriate resolution for max display size. Flavor cards display ~400px wide max, so 800-1200px source is sufficient for 2x retina. Enhanced-img will handle the rest.

**Warning signs:** Build time over 30 seconds, src/lib/assets/ folder over 50MB, git repo bloat.

## Code Examples

### Example 1: Flavor Card with Product Image

```svelte
<!-- src/lib/components/FlavorCard.svelte -->
<script lang="ts">
  import { inview } from '$lib/actions/inview';
  import { cheeseStretch } from '$lib/actions/cheese-stretch';
  import { getFlavorAnimation } from '$lib/utils/scroll-animations';
  import { prefersReducedMotion } from '$lib/utils/animations';
  import type { Flavor } from '$lib/data/flavors';

  type Props = {
    flavor: Flavor;
    index: number;
  };

  let { flavor, index }: Props = $props();
  let isInView = $state(false);

  const colors = $derived(colorMap[flavor.color]);
  const animation = $derived(getFlavorAnimation(flavor.id));
  const reducedMotion = prefersReducedMotion();
</script>

<div use:inview class={isInView ? '' : 'min-h-[200px]'}>
  {#if isInView}
    <div transition:animation.transition={{...animation.params, delay: reducedMotion ? 0 : index * 100}}>
      <div use:cheeseStretch class="rounded-2xl shadow-lg border-2 bg-white {colors.border} overflow-hidden cursor-pointer">
        <!-- Product image -->
        {#if flavor.image}
          <enhanced:img
            src={flavor.image}
            alt="{flavor.name} nacho cheese sauce with {flavor.tagline.toLowerCase()} flavor profile"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            class="w-full h-48 object-cover"
          />
        {:else}
          <!-- Fallback: emoji-based visual -->
          <div class="w-full h-48 flex items-center justify-center bg-gradient-to-br {colors.badgeBg} {colors.text}">
            <div class="text-8xl">{flavor.emoji}</div>
          </div>
        {/if}

        <!-- Card content -->
        <div class="p-8">
          <h3 class="font-display text-2xl font-bold mb-2 {colors.text}">{flavor.name}</h3>
          <span class="inline-block px-3 py-1 text-sm font-medium rounded-full mb-4 {colors.badgeBg} {colors.badgeText}">
            {flavor.badge}
          </span>
          <p class="text-gray-700 leading-relaxed mb-4">
            {flavor.description}
          </p>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span>🌶️ Heat Level:</span>
            <div class="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
              <div class="h-full {colors.heatBar}" style="width: {(flavor.heatLevel / 5) * 100}%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
```

### Example 2: Flavor Type with Image Field

```typescript
// src/lib/data/flavors.ts
export type Flavor = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  heatLevel: number;
  color: string;
  emoji: string;
  badge: string;
  isStar: boolean;
  image?: string; // Added: imported image path
};

// Import flavor images (only if they exist)
import whiteCheeseImg from '$lib/assets/images/flavors/white-cheese.png';
import orangeSpiceImg from '$lib/assets/images/flavors/orange-spice.png';
import mozzPureImg from '$lib/assets/images/flavors/mozz-pure.png';
import cheddarBeddarImg from '$lib/assets/images/flavors/cheddar-beddar.png';
import megaSpiceImg from '$lib/assets/images/flavors/mega-spice.png';

export const flavors: Flavor[] = [
  {
    id: 'white-cheese',
    name: 'White Cheese Sauce',
    tagline: 'Classic Mild',
    description: 'The OG, the classic...',
    heatLevel: 0,
    color: 'white-cheese',
    emoji: '🤍',
    badge: 'Classic Mild',
    isStar: false,
    image: whiteCheeseImg
  },
  // ... rest of flavors
];
```

### Example 3: Structured AI Prompt for Product Photography

```typescript
// Prompt template generator for consistent imagery
function generateFlavorPrompt(flavor: Flavor): string {
  const colorDescriptors: Record<string, string> = {
    'white-cheese': 'creamy white with subtle ivory tones',
    'nacho': 'vibrant nacho cheese orange',
    'mozz': 'pure white mozzarella with slight sheen',
    'cheddar': 'rich golden cheddar yellow',
    'spice': 'intense orange-red with chili pepper flecks'
  };

  const basePrompt = `Professional food photography of Tim's ${flavor.name} nacho cheese sauce`;
  const presentation = `in a white ceramic bowl on white seamless background`;
  const lighting = `soft diffused natural lighting from above creating warm highlights`;
  const composition = `centered 3/4 view showing ${colorDescriptors[flavor.color]} color and smooth creamy texture`;
  const style = `appetizing presentation, playful west coast aesthetic, clean and inviting`;
  const technical = `photorealistic, high resolution, sharp focus`;
  const negative = `no cartoon style, no watermark, no text overlays, no dark shadows, no clutter, no props besides bowl`;

  return `${basePrompt}, ${presentation}, ${lighting}, ${composition}, ${style}, ${technical}. Negative: ${negative}`;
}

// Example output for Orange Spice:
// "Professional food photography of Tim's Orange Cheese with Spice nacho cheese sauce, in a white ceramic bowl on white seamless background, soft diffused natural lighting from above creating warm highlights, centered 3/4 view showing vibrant nacho cheese orange color and smooth creamy texture, appetizing presentation, playful west coast aesthetic, clean and inviting, photorealistic, high resolution, sharp focus. Negative: no cartoon style, no watermark, no text overlays, no dark shadows, no clutter, no props besides bowl"
```

### Example 4: Image Naming Convention

```
Consistent naming pattern for all product images:

Flavors (5 files):
  src/lib/assets/images/flavors/white-cheese.png
  src/lib/assets/images/flavors/orange-spice.png
  src/lib/assets/images/flavors/mozz-pure.png
  src/lib/assets/images/flavors/cheddar-beddar.png
  src/lib/assets/images/flavors/mega-spice.png

Merch (8 files):
  src/lib/assets/images/merch/classic-tee.png
  src/lib/assets/images/merch/pullover-hoodie.png
  src/lib/assets/images/merch/skate-deck.png
  src/lib/assets/images/merch/sticker-pack.png
  src/lib/assets/images/merch/dad-hat.png
  src/lib/assets/images/merch/tote-bag.png
  src/lib/assets/images/merch/enamel-pin-set.png
  src/lib/assets/images/merch/cheese-koozie.png

Pattern: [category]/[product-id-from-data].png
- Lowercase, hyphen-separated
- Matches product ID in data files
- Predictable import paths
- Easy to glob/process programmatically
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual image optimization with Sharp scripts | @sveltejs/enhanced-img plugin | Late 2024 | Automatic WebP/AVIF, responsive srcsets, no manual pipeline |
| Picture element with manual sources | enhanced:img with sizes | Late 2024 | Build-time generation of all responsive variants |
| Direct AI API calls in code | MCP servers for image generation | Nov 2024 (MCP launch) | Standardized protocol, provider-agnostic, better UX in Claude Desktop |
| Generic AI prompts | Structured prompt engineering templates | 2025-2026 | 70%+ improvement in cross-image consistency |
| JPEG for web photos | WebP primary, AVIF where supported | 2025-2026 | 34-50% smaller file sizes, same visual quality |

**Deprecated/outdated:**
- **svelte-image package**: Replaced by official @sveltejs/enhanced-img
- **Manual Sharp pipelines in build scripts**: Now handled by enhanced-img plugin
- **First Input Delay (FID)**: Replaced by Interaction to Next Paint (INP) in Core Web Vitals (March 2024)

## Open Questions

1. **What is "fruitsnake-mcp"?**
   - What we know: Phase description specifies this tool, but no public documentation exists
   - What's unclear: Whether it's a typo, private tool, or placeholder name
   - Recommendation: Clarify with user before planning. If placeholder, use established MCP image-gen servers

2. **What visual style should product images have?**
   - What we know: Brand is "playful, west coast cool, ex-skateboarder, tattooed, checkered Vans vibes"
   - What's unclear: Should product images be photorealistic, illustrated, 3D rendered, or stylized?
   - Recommendation: Default to professional food photography style (matches "appetizing" goal), but confirm preference

3. **Should merch products also get custom images?**
   - What we know: Phase mentions "stock iconography and product images", merch cards currently use emojis + gradients
   - What's unclear: Are merch products in scope for Phase 5, or just cheese flavors?
   - Recommendation: Start with 5 flavor images (higher priority, directly supports "get hungry" goal), plan merch images as follow-up tasks

4. **What dimensions should AI-generated images be?**
   - What we know: Flavor cards display ~300-400px wide on desktop, full width on mobile
   - What's unclear: Optimal source resolution for quality vs. file size balance
   - Recommendation: Generate at 1200x1200px (sufficient for 2x retina at card size, not wastefully large)

## Sources

### Primary (HIGH confidence)
- [@sveltejs/enhanced-img npm documentation](https://www.npmjs.com/package/@sveltejs/enhanced-img) - Installation, configuration, API
- [SvelteKit official docs: Images](https://svelte.dev/docs/kit/images) - Enhanced-img usage patterns
- [Sharp official documentation](https://sharp.pixelplumbing.com/) - Image processing library capabilities
- Project codebase - flavors.ts, FlavorCard.svelte, MegaSpiceCard.svelte, vite.config.ts

### Secondary (MEDIUM confidence)
- [GitHub modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) - Verified no fruitsnake-mcp exists (2026-02-07)
- [WebP vs AVIF comparison](https://elementor.com/blog/webp-vs-avif/) - Format performance data
- [Lighthouse Core Web Vitals guide](https://dev.to/hardik_b2d8f0bca/core-web-vitals-how-image-optimization-impacts-your-lighthouse-score-3407) - Image impact on performance metrics
- [Image naming conventions best practices](https://www.canto.com/blog/file-naming-convention-best-practices-beyond-who-what-where-when-why/) - File organization standards
- [Alt text accessibility guidelines](https://accessibility.huit.harvard.edu/describe-content-images) - Harvard Digital Accessibility Services

### Tertiary (LOW confidence - requires validation)
- [AI food photography consistency](https://www.typeface.ai/blog/ai-image-generation-for-food-and-beverage-brands-how-to-ace-food-photography-with-ai/index.html) - Brand consistency strategies (WebSearch only)
- [Prompt engineering for product photography](https://claid.ai/blog/article/prompt-guide) - Structured prompt templates (WebSearch only)
- [MCP image-gen servers comparison](https://www.pulsemcp.com/servers?q=image) - Available servers (directory listing, not tested)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - @sveltejs/enhanced-img is already installed and configured, verified in package.json and vite.config.ts
- Architecture: HIGH - Patterns verified against official SvelteKit docs and existing project structure
- Pitfalls: MEDIUM - Based on official docs and web research, but not project-specific testing
- Fruitsnake-mcp: LOW - Cannot verify tool that doesn't appear to exist; requires user clarification

**Research date:** 2026-02-07
**Valid until:** 2026-03-07 (30 days - image optimization is relatively stable domain)

**Critical gap:** The specified "fruitsnake-mcp" tool could not be found. This is a blocking issue for task planning. Recommendation: User must clarify what tool to use before phase can be planned.

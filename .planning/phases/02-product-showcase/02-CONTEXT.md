# Phase 2: Product Showcase - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Display all 5 cheese flavors with unique visual identities, playful animations, and a "where to buy" section. Each flavor has a distinct personality brought to life through color accents and animation. MEGA SPICE is the star. Creating orders, brand storytelling, and blog content are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Flavor personalities
- Unified layout with per-flavor accents — consistent card/page structure, but each flavor gets a signature color and one unique animation touch
- Claude assigns color palettes per flavor (building from existing nacho-orange and spice-red Tailwind tokens)
- MEGA SPICE is the clear star of the show — dramatically more animation and visual intensity than the other 4

### The 5 flavors
1. **White Cheese Sauce** — Clean, mild, versatile
2. **Orange Cheese with Spice** — The classic with a kick
3. **Mozz Pure** — Silky, stretchy, mozzarella vibes
4. **Cheddar is Beddar** — Mild heat, big flavor, personality
5. **MEGA SPICE Face Melter** — Extreme ghost pepper heat, needs flames and melting visuals

### Scroll-triggered animations
- Playful entrances — cards bounce, wobble, or pop in with personality as they enter the viewport
- Each flavor could enter differently to reinforce its character

### MEGA SPICE effects
- Flames and melting effects are triggered on interaction (hover/scroll-in), not always-on
- Simmer down when user leaves — feels reactive and dangerous
- Significantly more dramatic than other flavor animations

### Hover micro-interactions
- Stretchy/elastic feel — like pulling cheese
- Elements stretch slightly toward cursor then snap back
- Applied to buttons and product cards

### Page transitions
- Smooth crossfade between routes — clean, polished, doesn't distract from content

### Claude's Discretion
- Exact color palette assignments per flavor
- Specific animation timing and easing curves
- Product card layout and information hierarchy
- "Where to buy" section design and placement
- Loading states and error handling
- Whether flavors get individual sub-pages or are all on one scrollable page

</decisions>

<specifics>
## Specific Ideas

- Cheese-stretching metaphor for hover interactions — like pulling melted cheese
- MEGA SPICE should feel "dangerous" — flames ignite, heat shimmer, the card comes alive on interaction
- Each flavor entrance animation should reinforce its personality (e.g., Mozz could stretch in, MEGA SPICE could burst in with sparks)
- Existing animation utilities from Phase 1 (bouncySpring, etc.) should be extended, not replaced

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-product-showcase*
*Context gathered: 2026-02-03*

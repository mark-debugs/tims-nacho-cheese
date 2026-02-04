# Tim's Nacho Cheese

## What This Is

A showcase website for Tim's Nacho Cheese — a west coast lifestyle brand selling artisan cheese sauces. The site features 5 signature flavors, a merch line, and a blog mixing recipes with Tim's adventures. Built with playful, bouncy animations and an orange cheese aesthetic that reflects Tim's personality: chill, tattooed, skater vibes.

## Core Value

The site must *feel* like Tim — fun, laid-back, west coast cool. If visitors don't smile and get hungry, we've failed.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Homepage with animated hero showcasing the brand personality
- [ ] Store section displaying 5 cheese flavors with distinct visual treatments
- [ ] Each flavor has its own personality (especially MEGA SPICE with flames/melting effects)
- [ ] Merch section for apparel, lifestyle gear, and accessories
- [ ] Blog section for recipes and Tim's adventures
- [ ] Consistent orange color palette with playful, bouncy animations
- [ ] "Coming soon" or contact-to-order flow (no checkout)
- [ ] Responsive design
- [ ] Containerized with Docker

### Out of Scope

- Payment processing / Stripe integration — deferred until showcase is complete
- Admin panel / CMS — content will be managed in code for v1
- User accounts / authentication — not needed for showcase
- Real e-commerce checkout flow — future milestone

## Context

**The Brand:**
Tim is real. Ex-skateboarder, lots of tattoos, west coast through and through. Checkered Vans slip-ons, never leaves the grass. The brand isn't just cheese — it's a lifestyle. Think chill vibes meets artisan food.

**The Products (5 Flavors):**
1. **White Cheese Sauce** — Clean, mild, versatile
2. **Orange Cheese with Spice** — The classic with a kick
3. **Mozz Pure** — Stretchy mozzarella goodness
4. **Cheddar is Beddar** — Fun name, solid cheddar
5. **MEGA SPICE Face Melter** — Extreme heat, needs flames and melting visuals

Products are sold in jars/containers.

**Merch Line:**
- Apparel: T-shirts, hoodies, hats
- Lifestyle: Skate decks, koozies
- Accessories: Stickers, pins, keychains

**Blog Content:**
- Recipes using the cheese sauces
- Behind-the-scenes with Tim
- Brand stories and adventures

## Constraints

- **Tech Stack**: SvelteKit + Bun — chosen for excellent animation support and fast development
- **Deployment**: Must run in Docker (Docker Desktop available)
- **Payments**: No Stripe integration in v1 — focus is design and excitement
- **Scope**: Showcase site only — no real checkout, "coming soon" or contact to order

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SvelteKit over Next.js/Astro | Built-in animation primitives (transitions, springs) perfect for bouncy cheese aesthetic | — Pending |
| Bun as runtime | Fast, native TypeScript, clean Docker setup | — Pending |
| Showcase-first approach | Get the vibe right before adding commerce complexity | — Pending |
| No CMS for v1 | Content managed in code keeps things simple, CMS adds complexity | — Pending |

---
*Last updated: 2026-02-03 after initialization*

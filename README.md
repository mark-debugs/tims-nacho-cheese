# Tim's Nacho Cheese

A lifestyle brand website for Tim's artisan nacho cheese sauces and merch. Built with SvelteKit, Tailwind CSS, and custom AI-generated imagery.

**Status: Work in progress**

This project doubles as a real-world test bench for [fruitsnake-mcp](https://github.com/mark-debugs/fruitsnake-mcp), an MCP server for generating web-ready image assets with AI. All product and merch imagery on the site was generated using fruitsnake-mcp.

## The Site

Five cheese sauce flavors (from classic white cheddar to the MEGA SPICE Face Melter), a merch line, a personality quiz ("Which Tim's Cheese Are You?"), blog, and about page -- all wrapped in a west coast skater brand aesthetic.

### Pages

- **/** -- Animated hero, featured flavors, social proof
- **/products** -- Flavor showcase with scroll-triggered animations and heat level indicators
- **/merch** -- Merchandise grid with category filtering (coming soon items)
- **/quiz** -- 7-question personality quiz that matches you to a cheese flavor
- **/about** -- Tim's origin story and brand values
- **/blog** -- Filterable posts with markdown support

## Tech Stack

- **SvelteKit 2** + **Svelte 5** (runes)
- **Tailwind CSS 3** with a custom nacho cheese color palette
- **TypeScript**
- **Bun** runtime + adapter
- **mdsvex** for blog markdown
- **@sveltejs/enhanced-img** for image optimization
- **Docker** for deployment

## Getting Started

```bash
bun install
bun run dev
```

## fruitsnake-mcp Integration

All product imagery (flavor jars, merch items, hero banners) was generated via [fruitsnake-mcp](https://github.com/mark-debugs/fruitsnake-mcp) during development. The `.planning/phases/05-custom-imagery-with-fruitsnake/` directory documents the image generation process and prompts used.

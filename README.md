# aum.

Website for aum. — seven cold-process botanical soaps, hand-produced in Subachoque, Colombia. Each bar mapped to one of the body's seven energy centers, infused with a natural crystal.

**Live:** [aum.co](https://aum.co)

---

## Stack

- [Eleventy (11ty) v3](https://www.11ty.dev/) — static site generator
- Nunjucks templates
- Vanilla CSS (no framework, no utility classes)
- Vanilla JavaScript (no bundler)
- Cloudflare Pages — deploys on push to `main`

---

## Getting started

Node.js 18+ required.

```bash
cd web
npm install
npm start        # http://localhost:3333 — live reload on save
npm run build    # production output → web/_site/
```

---

## Project structure

```
web/
├── src/
│   ├── _data/
│   │   ├── soaps.json           ← single source of truth for all 7 products
│   │   └── site.json            ← brand metadata, nav, WhatsApp config
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk         ← nav, footer, global CSS/JS
│   │   │   └── product.njk      ← extends base; injects crystal color token
│   │   └── components/
│   │       ├── nav.njk
│   │       ├── footer.njk
│   │       ├── logo.njk
│   │       ├── body-map.njk     ← SVG body map with crystal points
│   │       ├── cert-icons.njk   ← Lucide SVG certification icons
│   │       └── crystal-symbols.njk ← inline SVG crystal symbols
│   ├── css/
│   │   ├── tokens.css           ← all design tokens (Color System v3)
│   │   ├── base.css / fonts.css / animations.css
│   │   ├── nav.css / footer.css
│   │   ├── index.css / coleccion.css / nosotros.css / contacto.css
│   │   ├── product.css          ← shared across all 7 product pages
│   │   └── body-map.css
│   ├── js/
│   │   ├── nav.js               ← fixed nav, scroll state, mobile drawer
│   │   ├── reveal.js            ← scroll-triggered entrance animations
│   │   ├── coleccion.js         ← soap-nav highlight, smooth scroll, snap sync
│   │   ├── product.js           ← product page interactions
│   │   ├── contacto.js          ← contact page logic
│   │   ├── fit-text.js          ← auto-scale text to prevent overflow
│   │   └── analytics.js         ← click tracking (console.debug only)
│   ├── images/ fonts/
│   ├── soaps/
│   │   └── soaps.njk            ← one template generates all 7 product pages
│   ├── index.njk
│   ├── coleccion.njk
│   ├── nosotros.njk
│   ├── contacto.njk
│   ├── privacidad.njk
│   ├── 404.njk
│   ├── sitemap.njk / robots.njk
│   └── test.njk
├── eleventy.config.js
└── package.json
brain/                           ← brand knowledge base (voice, audience, positioning)
decisions/                       ← founder decision log
```

---

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero + collection entry point |
| La Colección | `/coleccion/` | All 7 soaps — full-viewport sections, sticky sub-nav, scroll snap |
| Product × 7 | `/coleccion/{slug}/` | Individual soap detail — oils, crystal, WhatsApp CTA |
| Nosotros | `/nosotros/` | Brand story, origin, production |
| Contacto | `/contacto/` | Contact info, WhatsApp link |
| Privacidad | `/privacidad/` | Privacy policy |

---

## Managing products

All product data lives in `web/src/_data/soaps.json`. Each soap object contains:
slug, name, crystal hex color, energy center, tagline, essential oils (common name + INCI), image filenames, and the pre-filled WhatsApp message.

Edit once — the collection page, all product pages, and the nav update automatically.

---

## Design tokens

All in `web/src/css/tokens.css`. Current system: **Color System v3 — Amber + Forest Bitonal**.

### Core palette

| Token | Hex | Name | Use |
|---|---|---|---|
| `--c-bg` | `#FAF7F1` | Pearl | All light surfaces |
| `--c-text` | `#262626` | Leather | Body text, nav, structural |
| `--c-accent` | `#A89478` | Amber | Dividers, hover, borders |
| `--c-secondary` | `#5C5445` | — | Descriptions, supporting copy |
| `--c-dark` | `#283618` | Black Forest | Hero backgrounds, banners |
| `--c-dark-bg` | `#344422` | Forest Medium | Footer, origin sections |
| `--c-gold` | `#C9AD88` | Gold | Labels/eyebrows on dark backgrounds |

### Crystal accents

Each soap has its own crystal color (`--cx-jasper`, `--cx-carnelian`, etc.) applied as `--cx` at the layout level. Used as the single accent color throughout that product page.

### Typography

| Role | Typeface | Source |
|---|---|---|
| Display / Headlines | **Instrument Serif** | Local `@font-face` from `/fonts/` |
| Body / UI | **Inter** | Local `@font-face` from `/fonts/` |

CSS tokens: `--ff-display` / `--ff-body` (product pages) and `--f-display` / `--f-body` (editorial pages) — aliased to the same fonts.

---

## Key features

- **Full-viewport soap sections** — each soap in the collection takes 100svh with photo + content grid
- **Sticky soap sub-nav** — highlights active section on scroll, smooth-scrolls on click
- **Scroll snap** — `proximity` snap on desktop for subtle magnetic alignment between soaps
- **Dynamic nav sync** — soap-nav sticky position synced to actual nav height via ResizeObserver
- **Scroll-triggered reveals** — two animation systems: `.rv` (product, 0.7s) and `.reveal` (editorial, 0.85s)
- **Responsive** — mobile-first with breakpoints at 480/768/1024/1366px + height queries for short laptops
- **Safe area support** — `viewport-fit=cover` with `env(safe-area-inset-*)` tokens for iOS notch
- **SVG crystal symbols** — inline reusable symbols for all 7 crystals
- **Body map** — interactive SVG body illustration with energy center points
- **Certification icons** — Lucide SVG icons for natural/cruelty-free/etc badges
- **WhatsApp CTA** — every "buy" action sends a pre-filled WhatsApp message
- **Reduced motion** — all animations and scroll snap disabled for `prefers-reduced-motion`

---

## Deployment

Cloudflare Pages builds on every push to `main`.

| Setting | Value |
|---|---|
| Build command | `npx @11ty/eleventy` |
| Output directory | `_site` |
| Root directory | `web` |

---

## Commit convention

```
feat:      new page, section, or feature
fix:       something broken, now working
style:     CSS / visual only, no logic change
content:   copy, images, or data (soaps.json)
refactor:  restructured, behavior unchanged
chore:     deps, config, tooling
docs:      documentation
test:      tests
perf:      performance
```

---

## About

aum. is a family project, not a startup. Made in Subachoque.

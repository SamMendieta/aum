# aum.

Website for aum. — seven cold-process botanical soaps, hand-produced in Subachoque, Colombia. Each bar mapped to one of the body's primary energy centers.

**Live:** [aumbotanicals.pages.dev](https://aumbotanicals.pages.dev)

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
│   │   ├── soaps.json       ← single source of truth for all 7 products
│   │   └── site.json        ← brand metadata, global config
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk     ← nav, footer, global CSS/JS
│   │   │   └── product.njk  ← extends base; injects crystal color token
│   │   └── components/
│   │       ├── nav.njk
│   │       └── footer.njk
│   ├── css/
│   │   ├── tokens.css       ← all design tokens live here
│   │   ├── base.css
│   │   ├── nav.css / footer.css / animations.css
│   │   ├── index.css / coleccion.css / nosotros.css / contacto.css
│   │   └── product.css      ← shared across all 7 product pages
│   ├── js/
│   │   ├── nav.js / reveal.js / product.js / coleccion.js / contacto.js
│   ├── images/
│   ├── fonts/               ← Pierson (display) · Biryani (body)
│   ├── soaps/
│   │   └── soaps.njk        ← one template generates all 7 product pages
│   ├── index.njk
│   ├── coleccion.njk
│   ├── nosotros.njk
│   └── contacto.njk
├── eleventy.config.js
└── package.json
```

---

## Managing products

All product data lives in `web/src/_data/soaps.json`. Each soap object contains:
slug, name, crystal hex color, energy center, tagline, essential oils (common name + INCI), image filenames, and the pre-filled WhatsApp message.

Edit once — the collection page, all product pages, and the nav update automatically.

---

## Design tokens

All in `web/src/css/tokens.css`.

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#f2ede6` | All light surfaces |
| `--color-text` | `#0d0d0d` | Body, nav, structural |
| `--color-accent` | `#c9a87c` | Dividers, hover, borders |
| `--color-secondary` | `#b09080` | Supporting copy |
| `--c-dark-bg` | `#6b5045` | Dark sections (hero, footer alt) |

Typefaces: **Pierson** (display, `@font-face` from `/fonts/`) · **Biryani Regular** (body, Google Fonts).

Each soap has its own crystal color defined in `soaps.json`. It's applied as `--cx` at the layout level and used as the accent color throughout that product page — no overrides scattered in stylesheets.

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
feat:      new page or section
fix:       something broken, now working
style:     CSS / visual only, no logic change
content:   copy, images, or data (soaps.json)
refactor:  restructured, behavior unchanged
chore:     deps, config, tooling
```

---

## About

aum. is a family project, not a startup. Made in Subachoque.

# aum.

Artisanal botanical soap brand website. First collection of 7 soap bars, 
each mapped to one of the body's primary energy centers. Hand-produced 
in Subachoque, Cundinamarca, Colombia.

Live site: [aumbotanicals.pages.dev](https://aumbotanicals.pages.dev)

---

## Stack

- [Eleventy (11ty) v3](https://www.11ty.dev/) — static site generator
- Nunjucks — templating
- Vanilla CSS — no frameworks
- Vanilla JavaScript — no frameworks
- [eleventy-img](https://www.11ty.dev/docs/plugins/image/) — build-time image optimization (AVIF / WebP)
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com/)

---

## Project structure
```
web/
├── src/
│   ├── _data/
│   │   ├── site.json        # Global brand tokens and site metadata
│   │   └── soaps.json       # All 7 soap products — single source of truth
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk     # Base layout — nav, footer, global CSS/JS
│   │   │   └── product.njk  # Product page layout — extends base
│   │   └── components/
│   │       ├── nav.njk
│   │       └── footer.njk
│   ├── css/
│   │   ├── tokens.css       # Design tokens — single source of truth
│   │   ├── base.css
│   │   ├── nav.css
│   │   ├── footer.css
│   │   ├── animations.css
│   │   ├── product.css
│   │   ├── coleccion.css
│   │   ├── index.css
│   │   ├── nosotros.css
│   │   └── contacto.css
│   ├── js/
│   │   ├── nav.js
│   │   ├── reveal.js
│   │   ├── product.js
│   │   ├── coleccion.js
│   │   └── contacto.js
│   ├── images/              # Source images (processed at build time)
│   ├── soaps/
│   │   └── soaps.njk        # Template — generates all 7 product pages
│   ├── index.njk            # Home
│   ├── coleccion.njk        # Collection overview
│   ├── nosotros.njk         # About
│   └── contacto.njk         # Contact / WhatsApp CTA
├── eleventy.config.js
├── package.json
└── .gitignore
```

---

## Local development

Requires Node.js 18+.
```bash
cd web
npm install
npm start
```

Site runs at `http://localhost:3333`. Eleventy watches for changes and 
rebuilds automatically.

To build for production:
```bash
npm run build
```

Output goes to `web/_site/`.

---

## Adding or editing a soap

All product content lives in one file: `web/src/_data/soaps.json`.

Each soap object contains: slug, name, crystal color, energy center, 
taglines, essential oils (common name + INCI), images, and WhatsApp 
message. Editing this file updates all instances across the site — 
collection page cards, product pages, and navigation — simultaneously.

---

## Deployment

Deployed automatically via Cloudflare Pages on every push to `main`.

Build settings:
- **Build command:** `npx @11ty/eleventy`
- **Build output directory:** `_site`
- **Root directory:** `web`

---

## Design system

| Token | Value |
|---|---|
| Background | `#f2ede6` |
| Text | `#0d0d0d` |
| Accent | `#c9a87c` |
| Secondary | `#b09080` |
| Dark sections | `#6b5045` |

Typefaces: Pierson (display, via @font-face) · Biryani Regular (body, Google Fonts).

Crystal accent colors are defined per-product in `soaps.json` and 
applied as CSS custom properties at the page level.

---

## Commit convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/).
```
feat:     new page or feature added
fix:      something broken, now corrected
content:  copy, text, or media changes
style:    CSS / visual changes, no logic change
refactor: code restructured, behavior unchanged
chore:    dependencies, config, maintenance
```

---

## Brand

aum. is a family project. Not a startup. Not an agency.  
A family, a formula, and Subachoque.

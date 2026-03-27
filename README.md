# aum.

Artisanal botanical soap brand website. Seven bars, each mapped to one of
the body's primary energy centers. Hand-produced in Subachoque, Colombia.

**Live:** [aumbotanicals.pages.dev](https://aumbotanicals.pages.dev)

---

## What this is

aum. sells soap the way other people sell the idea of soap. The product is
real — cold-process bars, olive oil and shea butter base, pure essential
oils, a crystal inside each one. The website's job is to make that feel
exactly as considered as it is.

Built with Eleventy. No frameworks. No JS where CSS works. The site ships
static HTML that a search engine can read and a slow connection can handle.

---

## Stack

- [Eleventy (11ty) v3](https://www.11ty.dev/) — static site generator
- Nunjucks — templating
- Vanilla CSS
- Vanilla JavaScript
- [eleventy-img](https://www.11ty.dev/docs/plugins/image/) — AVIF / WebP at build time
- [Cloudflare Pages](https://pages.cloudflare.com/) — deploys on push to `main`

---

## Structure
```
web/
├── src/
│   ├── _data/
│   │   ├── site.json        # Brand tokens, metadata, global config
│   │   └── soaps.json       # All 7 soaps — single source of truth
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk     # Nav, footer, global CSS/JS
│   │   │   └── product.njk  # Extends base — crystal color injected here
│   │   └── components/
│   │       ├── nav.njk
│   │       └── footer.njk
│   ├── css/
│   │   ├── tokens.css       # Design tokens — one file, no exceptions
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
│   ├── images/
│   ├── soaps/
│   │   └── soaps.njk        # One template → seven product pages
│   ├── index.njk
│   ├── coleccion.njk
│   ├── nosotros.njk
│   └── contacto.njk
├── eleventy.config.js
├── package.json
└── .gitignore
```

---

## Local development

Node.js 18+ required.
```bash
cd web
npm install
npm start
```

Runs at `http://localhost:3333`. Eleventy watches and rebuilds on save.

Production build:
```bash
npm run build
```

Output: `web/_site/`

---

## Adding or editing a soap

Everything lives in `web/src/_data/soaps.json`. One object per soap:
slug, name, crystal color, energy center, taglines, essential oils
(common name + INCI), image filenames, WhatsApp message.

Edit the file once. The collection page, product pages, and navigation
all update from the same source. No duplicated content to keep in sync.

---

## Deployment

Cloudflare Pages deploys automatically on every push to `main`.

Build settings:
- **Command:** `npx @11ty/eleventy`
- **Output directory:** `_site`
- **Root directory:** `web`

---

## Design system

| Token | Value | Use |
|---|---|---|
| Background | `#f2ede6` | All surfaces |
| Text | `#0d0d0d` | Body, nav, structural elements |
| Accent | `#c9a87c` | Dividers, hover, footer border |
| Secondary | `#b09080` | Supporting copy |
| Dark sections | `#6b5045` | Origin strip, footer |

Typefaces: Pierson (display, via `@font-face`) · Biryani Regular (body, Google Fonts).

Each soap has its own crystal color. It's defined in `soaps.json`,
applied as a CSS custom property at the page level, and used as the
accent throughout that product page. One token, one file, no overrides
scattered across stylesheets.

---

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/).
```
feat:      new page or feature
fix:       something broken, now working
content:   copy, text, or media
style:     CSS / visual, no logic change
refactor:  restructured, behavior unchanged
chore:     dependencies, config, maintenance
```

---

## Brand

aum. is a family project. Not a startup. Not an agency.
A family, a formula, and Subachoque.

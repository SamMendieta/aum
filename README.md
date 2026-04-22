# aum.

[![CI](https://github.com/SamMendieta/aum/actions/workflows/ci.yml/badge.svg)](https://github.com/SamMendieta/aum/actions/workflows/ci.yml)

Website for aum. — seven cold-process botanical soaps, hand-produced in Subachoque, Colombia. Each bar mapped to one of the body's seven energy centers, infused with a natural crystal.

**Live:** [aumbotanicals.com](https://www.aumbotanicals.com)

---

## For reviewers

Scope: solo-built by Sam Mendieta in collaboration with co-founders Andrea and Camila (brand voice, copy review, product decisions). First commit March 27 2026. Built in a 3-week sprint (102 commits, 10 active days) to take the brand from zero to production-ready. Now in steady maintenance.

**What to look at first:**

| Area | Path | What it demonstrates |
|---|---|---|
| Live production site | [aumbotanicals.com](https://www.aumbotanicals.com) | Shipped product |
| Data-driven architecture | `web/src/_data/soaps.json` | Single source of truth drives collection + 7 product pages via pagination |
| Design tokens | `web/src/css/tokens.css` | Color System v3 (Amber + Forest Bitonal), typography, spacing, safe-area, reduced-motion |
| Responsive design | `web/src/css/` + breakpoints 480/768/1024/1366 + height queries | One-section-one-screen principle enforced in code |
| Build config | `web/eleventy.config.js` | Eleventy v3 with pagination + passthrough copy |
| Skill-based governance | local `.claude/skills/aum*` (not in this repo) | 4 Claude skills orchestrate brand updates, copy review, and session state |

**Notable choices:**

- Vanilla CSS and vanilla JS with no bundler. Two npm dependencies (`@11ty/eleventy`, `@11ty/eleventy-img`). Deliberate minimalism for editorial control and deploy speed on Cloudflare Pages.
- Single-template product pagination: `src/soaps/soaps.njk` plus `soaps.json` generates all 7 product pages.
- Crystal color tokens (`--cx-*`) injected as `--cx` at the layout level so the same product template adopts the right accent per soap.
- Height-query responsive rules for short laptops in addition to width breakpoints.
- iOS safe-area inset tokens throughout (`env(safe-area-inset-*)`).
- `prefers-reduced-motion` honored across animations and scroll snap.

**What is NOT here:** revenue metrics (pre-launch), stress tests (no production traffic yet), analytics beyond console debug (intentional privacy default).

---

## Stack

- [Eleventy (11ty) v3](https://www.11ty.dev/) — static site generator
- Nunjucks templates
- Vanilla CSS (no framework, no utility classes)
- Vanilla JavaScript (no bundler)
- Cloudflare Pages — deploys on push to `main`
- GitHub Actions — build verification + internal link checking (see `.github/workflows/ci.yml`)

---

## Continuous integration

Every push and pull request runs `.github/workflows/ci.yml`:

1. **Build (Eleventy)** — runs `npm ci` and `npm run build`, verifies output exists with at least 10 HTML pages, uploads the built site as an artifact.
2. **Internal link check** — downloads the build artifact and runs [lychee](https://github.com/lycheeverse/lychee-action) offline against every generated HTML file. Broken internal links fail the run.

Cloudflare Pages picks up successful `main` builds and deploys to production automatically.

---

## Getting started

Node.js 20+ recommended (CI pins to 20).

```bash
cd web
npm install
npm start        # http://localhost:3333 — live reload on save
npm run build    # production output → web/_site/
```

---

## Brand governance architecture

aum ships with a disciplined decision-logging and brand-voice pipeline managed locally via Claude skills. Those skills are not in this repo (they live in the working tree only) but the artifacts they produce are:

- **Decision log** (`decisions/DECISIONS.md`, local): BRD-001 through BRD-027 as of April 2026. Every entry carries options considered, rationale, rejected alternatives, decision owner (Andrea / Camila / Sam), date, and status. Pattern is designed to prevent re-litigation of closed decisions.
- **Brand brain** (`brain/*.md`, local): six interconnected files covering audience, voice, positioning, product reference, content rules, and visual identity. Single source of truth for brand standards.
- **Content governance** (via local `aum-copy` skill): eight-sweep review process based on Andrea's principles, canonicality rules (one source, all uses), and a pending-alignment log for open questions.

Only `/web`, `/.github`, and this README live in the public repo. Brand brain and decisions remain in the local working tree.

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
│   │   │   └── product.njk      ← extends base, injects crystal color token
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
.github/
└── workflows/
    └── ci.yml                   ← build + link-check pipeline
```

---

## Pages

| Page | Path | Description |
|------|------|-------------|
| Home | `/` | Hero + collection entry point |
| La Colección | `/coleccion/` | All 7 soaps, full-viewport sections, sticky sub-nav, scroll snap |
| Product × 7 | `/coleccion/{slug}/` | Individual soap detail — oils, crystal, WhatsApp CTA |
| Nosotros | `/nosotros/` | Brand story, origin, production |
| Contacto | `/contacto/` | Contact info, WhatsApp link |
| Privacidad | `/privacidad/` | Privacy policy |

---

## Managing products

All product data lives in `web/src/_data/soaps.json`. Each soap object contains:
slug, name, crystal hex color, energy center, tagline, essential oils (common name + INCI), image filenames, and the pre-filled WhatsApp message.

Edit once. The collection page, all product pages, and the nav update automatically on next build.

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
| `--c-gold` | `#C9AD88` | Gold | Labels and eyebrows on dark backgrounds |

### Crystal accents

Each soap has its own crystal color (`--cx-jasper`, `--cx-carnelian`, etc.) applied as `--cx` at the layout level. Used as the single accent color throughout that product page.

### Typography

| Role | Typeface | Source |
|---|---|---|
| Display / Headlines | **Instrument Serif** | Local `@font-face` from `/fonts/` |
| Body / UI | **Inter** | Local `@font-face` from `/fonts/` |

CSS tokens: `--ff-display` / `--ff-body` (product pages) and `--f-display` / `--f-body` (editorial pages) aliased to the same fonts.

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
- **Certification icons** — Lucide SVG icons for natural / cruelty-free badges
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

GitHub Actions CI runs in parallel and blocks broken builds before Cloudflare deploys.

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

Enforced informally. Conventional prefixes on 96%+ of commits as of April 2026.

---

## About

aum. is a family project, not a startup. Made in Subachoque.

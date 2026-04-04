# Dual Website Design — Original Enhanced + La Revista
**Date:** 2026-04-04
**Status:** Pending approval

---

## Overview

Two production Eleventy websites, same GitHub repo, deployable to separate Cloudflare Pages projects.

| Site | Directory | Purpose |
|---|---|---|
| Original Enhanced | `web/` | Modify existing site with targeted visual upgrades |
| La Revista | `revista/` | New editorial-concept site, warmer and more contained than the mockup |

Founders compare both via their CF Pages URLs, then pick a direction.

---

## Shared Rules (both sites)

### Crystal SVGs — Universal
Every dot or indicator across the entire site uses the organic crystal SVG shape (`<symbol>` + `<use href="#cx-*"/>`), never a CSS `border-radius: 50%` circle. SVG symbols defined once per page in a hidden `<svg>` block.

### Order — Crown to Root, Always
01 Cuarzo Transparente (Corona) → 02 Amatista (Tercer Ojo) → 03 Sodalita (Garganta) → 04 Aventurina (Corazón) → 05 Citrino (Plexo Solar) → 06 Cornalina (Sacro) → 07 Jaspe Brechado (Raíz)

This applies to: soaps.json numbering, every soap listing, nav, footer spectrum bar, sticky nav dots, spine dots, contacto buttons.

### Soap Names
- `text-transform: uppercase` everywhere
- Color: neutral (Leather `#262626` on light backgrounds, Warm White `#F5F0E8` on dark backgrounds)
- Crystal color is NEVER applied to the soap name itself

### Crystal Accent Color
Applied ONLY to: vertical bars, horizontal rule accents, crystal SVG dots, hover states, decorative elements. Never to text content, never to soap names.

### Gold Hairline Dividers Between Soaps
A visible Gold `#C9AD88` divider between each soap section. Thickness: **3px** (thicker than the current 1px rule). Full-width or content-width depending on context. Both sites get this — introduced to Original if not present.

### Verticality — Crown→Root Journey
**Desktop:** Fixed spine on the left margin — thin Gold line (2px), 7 crystal SVG dots positioned along it. The current soap's dot highlights as you scroll. Collapses below 768px.

**Mobile:** Prominent section numbering per soap: `01 / 07 · Centro Corona` with crystal SVG dot inline.

**No scroll-snap.** Natural scrolling everywhere. No hijacked scroll behavior of any kind.

### Footer Spectrum Bar
7 crystal colors in a horizontal strip, 2px height, equal widths. Order: Crown→Root. Placed above the copyright line.

### WhatsApp CTA Buttons
All WhatsApp action buttons use a **solid dark background** (Leather `#262626`) with **white text** (`#F5F0E8`). Not ghost buttons. This includes: product page CTA, contacto page buttons, home page CTA, any "Pedir por WhatsApp" link.

### Brand Name
"aum" in all copy (no dot). "aum." only in logo SVG and brand images.

### Fonts
Instrument Serif (display, Regular + Italic, TTF, local) + Inter (body, Regular, WOFF2, local). Served from `/fonts/` directory.

### Energy Center Body Map (both home pages)

The 7-soap section on both home pages features a **custom editorial SVG illustration** mapping the 7 soaps to their energy centers on a seated human silhouette. This replaces the horizontal/vertical soap list.

**Visual treatment — editorial, arraigada, luxury:**
- **Silhouette:** Refined, minimal seated meditation figure. Single-weight outline stroke (1.5px) in Secondary `#5C5445`, no fill — just the contour. Clean, geometric-organic lines reminiscent of Aesop or Byredo illustration style. NOT a stock chakra diagram — this is an original, brand-quality illustration.
- **7 crystal points:** The actual organic crystal SVG shapes positioned along the spine/body at the correct anatomical positions (crown of head → base of spine). Each in its crystal color, sized ~12-16px.
- **Connecting lines:** Thin horizontal lines (1px, Amber `#A89478` at 40% opacity) extending from each crystal point to a text label block on the right side.
- **Labels (right side):** For each point:
  - Soap name in Instrument Serif, uppercase, Leather color, ~14px
  - Center name in Inter, sentence case, Secondary color, ~11px (e.g. "Centro Corona")
  - The number `01` – `07` in Inter, Gold, ~9px
- **Background:** Pearl on Original Enhanced, Black Forest on La Revista (with inverted colors: silhouette in Gold at 30% opacity, labels in Warm White/Gold)
- **Interaction:** Each soap name is a link to its product page. On hover, the crystal SVG pulses slightly (scale 1→1.08, 0.3s ease).
- **Mobile:** The silhouette scales down. Labels stack below the figure instead of beside it, in a vertical list connected by a thin Gold line.
- **Accessibility:** Each crystal point has a `<title>` and `aria-label`. The full illustration has `role="img"` with a descriptive `aria-label`.

**What this is NOT:**
- Not the stock "chakra stones chart" image — that image is reference only
- Not using the word "chakra" anywhere — always "centro de energía"
- Not using colored circles — the crystal SVG shapes are the indicators
- Not busy or cluttered — minimal lines, generous spacing, the illustration breathes

### Journal Section (both sites)
Placeholder layout — visual structure designed, content TBD.
- **On home page:** 3-card horizontal row below Filosofia. Section label "Journal", ghost button "Ver todo →"
- **`/journal/` page:** 6-card grid (2×3 desktop, 1-col mobile). Each card: image placeholder + title + date + excerpt.
- Cards: Pearl bg, 1px Amber border, no rounded corners, crystal SVG dot as category indicator.

---

## Site A: Original Enhanced (`web/`)

Modifying the existing Eleventy site. Same architecture, templates, data structure — visual upgrades only.

### Changes by Page

#### Home (`index.njk`)

**Hero — El Bosque treatment:**
- Background: Black Forest `#283618` (unchanged)
- Image opacity: **15%** (down from 22%)
- Remove flat amber rgba overlay → replace with subtle radial gradient: `radial-gradient(ellipse at 70% 40%, rgba(168, 148, 120, 0.06) 0%, transparent 60%)`
- Result: darker, more forest-dominant, more dramatic

**7-Soap Section → Energy Center Body Map:**
- Current: 7-column horizontal grid (`.coleccion__soaps`)
- Replace with: **Energy Center Body Map** — the custom editorial SVG illustration mapping all 7 soaps to a seated human silhouette (see Shared Rules)
- Pearl background, silhouette in Secondary, crystal SVGs at body points, labels on the right
- Each soap name links to its product page
- Section label: "La Coleccion" or "Siete centros de energia"

**Filosofia section:** Keep as-is (4-column pillars, already good)

**Journal section:** Add new 3-card row below Filosofia (see Shared Rules)

**Footer:** Add spectrum bar

#### Coleccion (`coleccion.njk`)

**Full-viewport soap sections (Approach A, no alternation):**
- Each soap = `min-height: 100vh` section
- **Image always on the left** (~55% width), text panel always on the right (~45%)
- No alternating positions — consistent layout for all 7 soaps
- 3px Gold hairline divider between each section
- Crystal accent: 3px vertical bar on the left edge of the text panel, crystal SVG dot next to soap number
- Soap name: uppercase, Leather color (neutral)
- Sticky soap nav: retained, crystal SVGs (already correct)
- Crystal color on: vertical bar, number dot, hover states — NOT on name

**Fixed spine (desktop):**
- Thin Gold line fixed on left margin (~3vw from edge)
- 7 crystal SVG dots, evenly distributed vertically
- Current section's dot highlights (scale + opacity)
- Hidden on mobile (< 768px)

#### Product Pages (`soaps/soaps.njk`)

- `hero__name` color → Leather `#262626` (was crystal color)
- Crystal color moves to: tagline border, accent bars, gallery active thumb border
- Add crystal SVG dot next to `01 / 07` meta label
- Dark crystal block (`cblock`): keeps crystal color on the large decorative name (ornamental, not the headline)
- WhatsApp button: solid Leather bg, white text
- Add crystal SVG symbols to page (currently missing)

#### Contacto (`contacto.njk`)

- Replace all `soap-btn__dot` CSS circles with crystal SVG shapes
- WhatsApp buttons: solid Leather bg, white text
- Fix order: Crown→Root

#### Nosotros (`nosotros.njk`)

- Add crystal SVG symbol definitions to page
- Add crystal indicators where appropriate (Filosofia pillars, or a soap reference section)
- Keep Filosofia pillars (2-column, already good)

#### Footer (`footer.njk`)

- Add 7-color spectrum strip (2px, full-width, Crown→Root order)

#### Global

- Fix soaps.json numbering: 01=Cuarzo through 07=Jaspe
- Update all references to match Crown→Root order
- All crystal dots → crystal SVGs site-wide

---

## Site B: La Revista (`revista/`)

New Eleventy project. Copied `soaps.json` (renumbered). Editorial magazine concept, but WARMER and more contained.

### Architecture

```
revista/
├── eleventy.config.js
├── package.json
├── src/
│   ├── _data/           soaps.json (renumbered Crown→Root), site.json
│   ├── _includes/
│   │   ├── layouts/     base.njk, product.njk
│   │   └── components/  nav.njk, logo.njk, footer.njk, crystal-symbols.njk
│   ├── css/             tokens.css, base.css, fonts.css, + per-page CSS
│   ├── js/              nav.js, reveal.js, spine.js
│   ├── fonts/           (symlinked or copied from web/src/fonts/)
│   ├── images/          (symlinked or copied from web/src/images/)
│   ├── soaps/           soaps.njk (pagination template)
│   └── *.njk            index, coleccion, nosotros, contacto, journal, privacidad, 404
└── _site/               Build output
```

### Color Strategy — Warmer, Not Cold

The mockup was too Pearl-dominant. Fix:

- Pearl `#FAF7F1` remains the base for light sections
- **Dark sections use Black Forest `#283618`** (NOT Forest Medium) — hero, origin, produccion, filosofia bg, footer
- Gold `#C9AD88` used prominently: section labels, eyebrows, dividers, rule lines
- Every 3rd major section alternates to a Black Forest dark band to break the Pearl monotony
- Text on dark: Warm White `#F5F0E8` for headlines, Gold for labels/eyebrows

### One Screen, One Element

- Sections sized to fit within one viewport height
- Images: `max-height: 60vh`, never overflow the screen
- No section requires scrolling to see its primary content
- Padding: `clamp(48px, 6vw, 96px)` (reduced from mockup's excessive 160px max)
- Content max-width: 1280px (consistent with original)

### Pages

#### Home (`/`)

1. **Hero** — Black Forest bg, lifestyle image at 15% opacity, centered headline in Warm White, Gold eyebrow label. Fits in one screen.
2. **Philosophy quote** — Pearl bg, single Instrument Serif Italic quote centered, max-width 800px. One screen.
3. **Energy Center Body Map** — The custom editorial SVG illustration (see Shared Rules). Black Forest background version: silhouette in Gold at 30% opacity, crystal SVGs at body points, labels in Warm White (soap names) and Gold (center names). One screen.
4. **Filosofia pillars** — 4-column grid: Botanica, Ritual, Naturaleza, Presencia. Numbered 01–04 with Amber accent. One screen.
5. **Certifications bar** — (see below)
6. **Formula** — 2-column: text left, image right. INCI ingredients list. One screen.
7. **Journal** — 3-card row, placeholder content. One screen.
8. **CTA** — "Siete centros. Siete jabones." with WhatsApp button (Leather bg, white text). One screen.
9. **Footer** — Black Forest bg, spectrum bar, links, copyright.

#### Coleccion (`/coleccion/`)

- Full-viewport sections, **image always on the left**, text always on the right
- No alternation
- 3px Gold hairline dividers between soaps
- Fixed spine on desktop (Gold line + crystal SVG dots)
- Section numbering: `01 / 07 · Centro Corona` with crystal SVG
- Sticky soap nav at top
- Crystal accent on bars/dots only, neutral soap names

#### Product Pages (`/coleccion/{slug}/`)

- 60/40 hero: image left (60%), text right (40%)
- Soap name: uppercase, Warm White or Leather (depending on bg), NOT crystal color
- Crystal color on: tagline accent border, vertical bar, gallery active state
- Narrative section: pull quote (Instrument Serif Italic) + body text
- Ingredients: essential oils list + base oils + INCI
- Dark crystal block: Black Forest bg, crystal photo, crystal description
- Gallery with lightbox
- WhatsApp CTA: Leather bg, white text
- Prev/Next product navigation

#### Nosotros (`/nosotros/`)

- Hero with Subachoque photo
- Historia section (photo + text)
- Filosofia pillars (2-column grid, expanded descriptions)
- Produccion facts (7 soaps, 110g, 100% natural)
- Subachoque panorama image
- Crystal SVGs throughout

#### Contacto (`/contacto/`)

- 7 WhatsApp buttons with crystal SVGs (not CSS dots)
- Leather bg buttons, white text
- Crown→Root order

#### Journal (`/journal/`)

- Placeholder: 6-card grid (2×3)
- Each card: image + title + date + excerpt
- Pearl bg, 1px Amber border

### Certifications & Commitments Section (La Revista only)

**Certifications bar** — horizontal row of 5 trust signals with line-art icons:

| Icon | Label |
|---|---|
| Leaf | 100% NATURAL |
| Rabbit/heart | CRUELTY FREE |
| Shield-cross | LIBRE DE PARABENOS |
| Water-drop-cross | LIBRE DE SULFATOS |
| Hands | HECHO A MANO |

Each: line-art SVG icon (Amber stroke, no fill) + uppercase Inter label below.
Background: Pearl or subtle warm tint. Full-width, centered row.

**Palm Oil Free callout** — dedicated section:
- Icon: palm tree with a cross/prohibition symbol (line-art, Amber)
- Headline: "Sin aceite de palma"
- Brief body text explaining why (deforestation, commitment to sustainable sourcing)
- Pearl bg, bordered section, stands alone as a commitment statement

### Additional Elements (from mockups)

1. **Pull quote (from El Estudio)** — Between collection preview and formula on home page. Single large Instrument Serif Italic quote, centered, max-width 800px, Pearl bg. Editorial breathing room.

2. **Fixed spine (from El Ritual)** — On Coleccion page. Gold vertical line with 7 crystal SVG dots tracking scroll position. Desktop only.

3. **Pearl cards on dark (from El Bosque)** — Used for ingredient panels or crystal descriptions floating on Black Forest sections. Pearl bg, 1px Amber border, max-width 480px.

---

## What's NOT included

- No alternating image positions (consistent image-left, text-right)
- No scroll-snap or hijacked scrolling
- No crystal color on soap names (neutral names, colored accents only)
- No CSS circle dots (crystal SVGs everywhere)
- No Forest Medium `#344422` in La Revista dark sections (Black Forest `#283618` only)
- No bounce, elastic, or scale animations
- No gradients, glassmorphism, or decorative shadows
- No horizontal soap grids (vertical stacks only)

---

## Deployment

| Site | CF Pages Project | Build Dir | Build Command | Port (local) |
|---|---|---|---|---|
| Original Enhanced | Existing project | `web/` | `npm run build` | 8080 |
| La Revista | New CF Pages project | `revista/` | `npm run build` | 8081 |

Both deploy from `main` branch. Each CF Pages project configured with its respective root directory.

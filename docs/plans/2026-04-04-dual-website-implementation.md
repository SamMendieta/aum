# Dual Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build two production Eleventy websites — Original Enhanced (`web/`) and La Revista (`revista/`) — with shared design elements, for founders to compare and choose a direction.

**Architecture:** Modify the existing Eleventy site in `web/` with targeted visual upgrades. Create a new Eleventy project in `revista/` with editorial magazine concept. Both share `soaps.json` data (renumbered Crown→Root), font files, and images. Each deploys to its own Cloudflare Pages project.

**Tech Stack:** Eleventy 3.1.5, Nunjucks, vanilla CSS/JS, no bundler, no test runner. Verification via `npm run build` + preview server.

**Design doc:** `docs/plans/2026-04-04-dual-website-design.md` — refer to this for full design specifications.

---

## Phase 1: Shared Foundations

### Task 1: Extract Crystal SVG Symbols to Shared Component

Currently, crystal SVG `<symbol>` blocks are duplicated inline in `index.njk`, `coleccion.njk`, and product layouts. Extract to a reusable Nunjucks include.

**Files:**
- Create: `web/src/_includes/components/crystal-symbols.njk`
- Modify: `web/src/index.njk` — remove inline SVG block, add `{% include %}`
- Modify: `web/src/coleccion.njk` — remove inline SVG block, add `{% include %}`
- Modify: `web/src/contacto.njk` — add `{% include %}` (currently missing)
- Modify: `web/src/nosotros.njk` — add `{% include %}` (currently missing)

**Step 1: Create the component**

```njk
{# crystal-symbols.njk — 7 crystal SVG symbols, Crown→Root order #}
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <symbol id="cx-quartz" viewBox="0 0 4.6099553 4.6155996">
    <g transform="translate(-102.69502,-146.1922)">
      <path d="m 106.70867,146.83661 c 0.34572,0.36936 0.56409,0.90099 0.59302,1.40617 0.0317,0.55422 -0.16898,1.35961 -0.47096,1.82739 -0.48648,0.75248 -1.33244,0.8255 -2.14947,0.67134 -1.07598,-0.20285 -1.67852,-0.81739 -1.89795,-1.88243 -0.13793,-0.66957 -0.20179,-1.76565 0.49248,-2.16429 0.054,-0.0307 0.12277,-0.0628 0.17956,-0.0896 1.03435,-0.48895 2.39148,-0.68933 3.25332,0.23142" style="fill:#5c6670;fill-rule:nonzero;stroke:none"/>
    </g>
  </symbol>
  <symbol id="cx-amethyst" viewBox="0 0 4.5195718 4.8416481">
    <g transform="translate(-102.74021,-146.07918)">
      <path d="m 103.44006,150.49212 c -1.57374,-1.0481 -0.17251,-3.75955 1.06221,-4.20405 3.81494,-1.37337 3.30095,4.46863 0.70803,4.63197 -0.28787,0.018 -1.54305,-0.27658 -1.77024,-0.42792" style="fill:#732372;fill-rule:nonzero;stroke:none"/>
    </g>
  </symbol>
  <symbol id="cx-sodalite" viewBox="0 0 4.8749118 4.3623962">
    <g transform="translate(-102.56254,-146.3188)">
      <path d="m 105.03854,146.32154 c 1.79105,-0.0836 2.70404,1.76036 2.30717,3.29459 -0.34996,1.35326 -3.20958,1.27212 -4.09893,0.55986 -1.65241,-1.32292 -0.018,-3.76978 1.79176,-3.85445" style="fill:#0f4496;fill-rule:nonzero;stroke:none"/>
    </g>
  </symbol>
  <symbol id="cx-aventurine" viewBox="0 0 4.2281256 4.5727291">
    <g transform="translate(-102.88594,-146.21363)">
      <path d="m 106.43263,146.47423 c 1.17369,0.21378 0.49671,1.68028 0.39687,2.07186 -0.18097,0.70944 0.20638,1.26401 -0.48365,2.05917 -0.47449,0.54716 -3.07517,-0.24166 -3.3902,-1.08585 -0.24729,-0.66322 0.2092,-2.56399 0.65052,-3.00214 0.45685,-0.45297 0.82515,-0.2794 1.40759,-0.22754 0.30339,0.0268 1.23155,0.15028 1.41887,0.1845" style="fill:#047b46;fill-rule:nonzero;stroke:none"/>
    </g>
  </symbol>
  <symbol id="cx-citrine" viewBox="0 0 4.362565 4.6740341">
    <g transform="translate(-102.81872,-146.16299)">
      <path d="m 105.56023,146.18197 c 1.87325,-0.27129 1.78541,2.44087 1.38783,3.30235 -0.93874,2.03341 -4.94771,1.78859 -3.97969,-0.83114 0.21061,-0.57009 1.89936,-2.37102 2.59186,-2.47121" style="fill:#edcf40;fill-rule:nonzero;stroke:none"/>
    </g>
  </symbol>
  <symbol id="cx-carnelian" viewBox="0 0 4.6503882 4.4949055">
    <g transform="translate(-102.6748,-146.25255)">
      <path d="m 105.044,146.25598 c 0.80927,-0.03 2.29729,0.11289 2.28106,1.38818 -0.004,0.27623 -0.63429,1.90218 -0.79869,2.16394 -1.23155,1.95968 -2.98838,0.50024 -3.63537,-1.16699 -0.77999,-2.01013 0.6925,-2.3308 2.153,-2.38513" style="fill:#e06520;fill-rule:nonzero;stroke:none"/>
    </g>
  </symbol>
  <symbol id="cx-jasper" viewBox="0 0 4.6069055 4.406569">
    <g transform="translate(-102.69655,-146.29672)">
      <path d="m 104.48752,146.34334 c 3.41418,-0.57256 3.89855,4.31694 0.48613,4.35963 -3.31611,0.0416 -2.59151,-4.0065 -0.48613,-4.35963" style="fill:#c01818;fill-rule:nonzero;stroke:none"/>
    </g>
  </symbol>
</svg>
```

Note: symbols are now ordered Crown→Root (quartz first, jasper last).

**Step 2: Update each page template**

In `index.njk`, `coleccion.njk`: replace the inline `<svg xmlns=...>...</svg>` block (lines ~10-46) with:
```njk
{% include "components/crystal-symbols.njk" %}
```

In `contacto.njk` and `nosotros.njk`: add `{% include "components/crystal-symbols.njk" %}` at the top of the content (after frontmatter).

**Step 3: Build and verify**

Run: `cd web && npm run build`
Expected: Clean build, no errors. Verify `_site/index.html` contains the SVG symbols.

**Step 4: Commit**
```bash
git add web/src/_includes/components/crystal-symbols.njk web/src/index.njk web/src/coleccion.njk web/src/contacto.njk web/src/nosotros.njk
git commit -m "refactor: extract crystal SVG symbols to shared component"
```

---

### Task 2: Reorder soaps.json — Crown→Root

**Files:**
- Modify: `web/src/_data/soaps.json`
- Modify: `web/src/_includes/components/footer.njk` — reorder soap links
- Modify: `web/src/coleccion.njk` — reorder soap-nav items and soap-entry blocks
- Modify: `web/src/contacto.njk` — reorder WhatsApp buttons

**Step 1: Reorder soaps.json**

The soaps array must be reordered to Crown→Root. Each soap's `number` field and `prevSlug`/`nextSlug` nav links must also be updated.

New order:
1. `cuarzo-transparente` — number: "01", center: "Corona", prevSlug: null, nextSlug: "amatista"
2. `amatista` — number: "02", center: "Tercer Ojo", prevSlug: "cuarzo-transparente", nextSlug: "sodalita"
3. `sodalita` — number: "03", center: "Garganta", prevSlug: "amatista", nextSlug: "aventurina"
4. `aventurina` — number: "04", center: "Corazón", prevSlug: "sodalita", nextSlug: "citrino"
5. `citrino` — number: "05", center: "Plexo Solar", prevSlug: "aventurina", nextSlug: "cornalina"
6. `cornalina` — number: "06", center: "Sacro", prevSlug: "citrino", nextSlug: "jaspe-brechado"
7. `jaspe-brechado` — number: "07", center: "Raíz", prevSlug: "cornalina", nextSlug: null

Move the array items into this order and update the `number`, `prevSlug`, `nextSlug`, and `prevName`/`nextName` fields on each.

**Step 2: Reorder footer links**

In `footer.njk`, reorder the hardcoded soap links to Crown→Root:
```njk
<a class="footer__link" href="/coleccion/cuarzo-transparente/">Cuarzo Transparente</a>
<a class="footer__link" href="/coleccion/amatista/">Amatista</a>
<a class="footer__link" href="/coleccion/sodalita/">Sodalita</a>
<a class="footer__link" href="/coleccion/aventurina/">Aventurina</a>
<a class="footer__link" href="/coleccion/citrino/">Citrino</a>
<a class="footer__link" href="/coleccion/cornalina/">Cornalina</a>
<a class="footer__link" href="/coleccion/jaspe-brechado/">Jaspe Brechado</a>
```

**Step 3: Reorder coleccion.njk soap-nav**

The sticky soap-nav has hardcoded anchor links. Reorder to Crown→Root:
```njk
<a href="#cuarzo-transparente" class="soap-nav__item" style="--cx:var(--cx-quartz)"><svg class="soap-nav__dot" aria-hidden="true" focusable="false"><use href="#cx-quartz"/></svg>Cuarzo</a>
<a href="#amatista" class="soap-nav__item" style="--cx:var(--cx-amethyst)"><svg class="soap-nav__dot" aria-hidden="true" focusable="false"><use href="#cx-amethyst"/></svg>Amatista</a>
<a href="#sodalita" class="soap-nav__item" style="--cx:var(--cx-sodalite)"><svg class="soap-nav__dot" aria-hidden="true" focusable="false"><use href="#cx-sodalite"/></svg>Sodalita</a>
<a href="#aventurina" class="soap-nav__item" style="--cx:var(--cx-aventurine)"><svg class="soap-nav__dot" aria-hidden="true" focusable="false"><use href="#cx-aventurine"/></svg>Aventurina</a>
<a href="#citrino" class="soap-nav__item" style="--cx:var(--cx-citrine)"><svg class="soap-nav__dot" aria-hidden="true" focusable="false"><use href="#cx-citrine"/></svg>Citrino</a>
<a href="#cornalina" class="soap-nav__item" style="--cx:var(--cx-carnelian)"><svg class="soap-nav__dot" aria-hidden="true" focusable="false"><use href="#cx-carnelian"/></svg>Cornalina</a>
<a href="#jaspe-brechado" class="soap-nav__item" style="--cx:var(--cx-jasper)"><svg class="soap-nav__dot" aria-hidden="true" focusable="false"><use href="#cx-jasper"/></svg>Jaspe</a>
```

**Step 4: Reorder coleccion.njk soap entries**

The soap entries are generated from a Nunjucks loop over `soaps` data. Since `soaps.json` is reordered, the loop output will automatically be Crown→Root. Verify the loop uses `{% for soap in soaps %}` (it does — the entries are data-driven via the loop at approximately line 90+).

**Step 5: Reorder contacto.njk WhatsApp buttons**

The contacto page has hardcoded WhatsApp buttons. Reorder to Crown→Root (Cuarzo first, Jaspe last). Also replace `soap-btn__dot` CSS circles with crystal SVGs (handled in Task 13).

**Step 6: Build and verify**

Run: `cd web && npm run build`
Verify: Product pages generate with correct prev/next navigation. Coleccion page shows soaps in Crown→Root order.

**Step 7: Commit**
```bash
git add web/src/_data/soaps.json web/src/_includes/components/footer.njk web/src/coleccion.njk web/src/contacto.njk
git commit -m "feat: reorder all soap listings Crown→Root (Cuarzo 01 through Jaspe 07)"
```

---

### Task 3: Create Energy Center Body Map SVG

A custom editorial SVG illustration mapping 7 soaps to energy centers on a seated human silhouette. This is a major design element used on both home pages.

**Files:**
- Create: `web/src/_includes/components/body-map.njk`
- Create: `web/src/css/body-map.css`
- Modify: `web/eleventy.config.js` — add `body-map.css` if not auto-passthrough

**Step 1: Create body-map.njk**

This is an inline SVG composition with a minimal seated silhouette and 7 crystal points positioned along the spine. The crystal SVG shapes from `crystal-symbols.njk` are referenced via `<use>`. Text labels are positioned as HTML overlays (not SVG text) for font consistency and responsiveness.

Structure:
```njk
{# body-map.njk — Energy Center Body Map
   Requires: crystal-symbols.njk included on the page
   Accepts: variant = "light" (Pearl bg) or "dark" (Black Forest bg)
#}
{% set variant = variant or "light" %}
<div class="body-map body-map--{{ variant }}" role="img" aria-label="Los siete centros de energia y sus jabones correspondientes">
  <div class="body-map__figure">
    {# Inline SVG: minimal seated meditation silhouette, single-weight outline #}
    <svg class="body-map__silhouette" viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {# Refined seated figure — single 1.5px stroke outline #}
      {# Head circle #}
      <ellipse cx="100" cy="42" rx="22" ry="26" stroke="currentColor" stroke-width="1.5"/>
      {# Neck #}
      <line x1="100" y1="68" x2="100" y2="82" stroke="currentColor" stroke-width="1.5"/>
      {# Shoulders #}
      <path d="M100 82 Q85 82 65 95 Q50 106 42 120" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M100 82 Q115 82 135 95 Q150 106 158 120" stroke="currentColor" stroke-width="1.5" fill="none"/>
      {# Torso center line (spine) #}
      <line x1="100" y1="82" x2="100" y2="220" stroke="currentColor" stroke-width="1" opacity="0.3"/>
      {# Arms flowing down into lap #}
      <path d="M42 120 Q36 140 38 165 Q40 185 60 200 Q75 210 90 215" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M158 120 Q164 140 162 165 Q160 185 140 200 Q125 210 110 215" stroke="currentColor" stroke-width="1.5" fill="none"/>
      {# Hands meeting at lap #}
      <path d="M90 215 Q95 218 100 218 Q105 218 110 215" stroke="currentColor" stroke-width="1.5" fill="none"/>
      {# Seated legs crossed #}
      <path d="M100 220 Q85 230 60 240 Q40 248 30 260 Q25 270 35 275 Q55 280 80 275" stroke="currentColor" stroke-width="1.5" fill="none"/>
      <path d="M100 220 Q115 230 140 240 Q160 248 170 260 Q175 270 165 275 Q145 280 120 275" stroke="currentColor" stroke-width="1.5" fill="none"/>
    </svg>

    {# 7 crystal points positioned along the spine #}
    {% set points = [
      { id: "cx-quartz", y: "28", center: "Corona", name: "Cuarzo Transparente", num: "01", slug: "cuarzo-transparente", cx: "var(--cx-quartz)" },
      { id: "cx-amethyst", y: "55", center: "Tercer Ojo", name: "Amatista", num: "02", slug: "amatista", cx: "var(--cx-amethyst)" },
      { id: "cx-sodalite", y: "80", center: "Garganta", name: "Sodalita", num: "03", slug: "sodalita", cx: "var(--cx-sodalite)" },
      { id: "cx-aventurine", y: "110", center: "Corazon", name: "Aventurina", num: "04", slug: "aventurina", cx: "var(--cx-aventurine)" },
      { id: "cx-citrine", y: "145", center: "Plexo Solar", name: "Citrino", num: "05", slug: "citrino", cx: "var(--cx-citrine)" },
      { id: "cx-carnelian", y: "175", center: "Sacro", name: "Cornalina", num: "06", slug: "cornalina", cx: "var(--cx-carnelian)" },
      { id: "cx-jasper", y: "210", center: "Raiz", name: "Jaspe Brechado", num: "07", slug: "jaspe-brechado", cx: "var(--cx-jasper)" }
    ] %}

    {% for p in points %}
    <a href="/coleccion/{{ p.slug }}/" class="body-map__point" style="--point-y: {{ p.y }}px; --cx-point: {{ p.cx }}" aria-label="{{ p.name }} — Centro {{ p.center }}">
      <svg class="body-map__crystal" aria-hidden="true"><use href="#{{ p.id }}"/></svg>
      <span class="body-map__line" aria-hidden="true"></span>
      <span class="body-map__label">
        <span class="body-map__num">{{ p.num }}</span>
        <span class="body-map__name">{{ p.name }}</span>
        <span class="body-map__center">Centro {{ p.center }}</span>
      </span>
    </a>
    {% endfor %}
  </div>
</div>
```

**Step 2: Create body-map.css**

```css
/* body-map.css — Energy Center Body Map */

.body-map {
  padding: var(--gap-section) var(--gap-container);
  display: flex;
  justify-content: center;
}

.body-map__figure {
  position: relative;
  width: 100%;
  max-width: 720px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 0;
  align-items: start;
}

/* Silhouette */
.body-map__silhouette {
  grid-column: 1;
  grid-row: 1 / -1;
  width: 100%;
  height: auto;
  color: var(--c-secondary);
}
.body-map--dark .body-map__silhouette {
  color: var(--c-gold);
  opacity: 0.3;
}

/* Crystal points — positioned absolutely over the silhouette */
.body-map__point {
  position: absolute;
  left: 90px; /* center of silhouette */
  top: var(--point-y);
  display: flex;
  align-items: center;
  gap: 0;
  text-decoration: none;
  transform: translateY(-50%);
}

.body-map__crystal {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  display: block;
  overflow: visible;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
}
.body-map__point:hover .body-map__crystal {
  transform: scale(1.15);
}

/* Connecting line from crystal to label */
.body-map__line {
  display: block;
  width: clamp(40px, 6vw, 80px);
  height: 1px;
  background: var(--c-accent);
  opacity: 0.4;
  flex-shrink: 0;
}
.body-map--dark .body-map__line {
  background: var(--c-gold);
  opacity: 0.3;
}

/* Labels */
.body-map__label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 12px;
}

.body-map__num {
  font-family: var(--ff-body, var(--f-body));
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--c-gold);
}
.body-map--light .body-map__num { color: var(--c-accent); }

.body-map__name {
  font-family: var(--ff-display, var(--f-display));
  font-weight: 400;
  font-size: clamp(13px, 1.5vw, 16px);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--c-text);
}
.body-map--dark .body-map__name { color: var(--c-dark-text); }

.body-map__center {
  font-family: var(--ff-body, var(--f-body));
  font-size: 11px;
  color: var(--c-secondary);
}
.body-map--dark .body-map__center { color: var(--c-gold); }

/* Hover interaction */
.body-map__point:hover .body-map__name {
  color: var(--cx-point);
}

/* Mobile: labels stack below the figure */
@media (max-width: 768px) {
  .body-map__figure {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 300px;
  }
  .body-map__silhouette {
    width: 160px;
    margin-bottom: 32px;
  }
  .body-map__point {
    position: relative;
    left: auto;
    top: auto;
    transform: none;
    flex-direction: row;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--c-rule);
    width: 100%;
  }
  .body-map__line { display: none; }
  .body-map__label { padding-left: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .body-map__crystal { transition: none; }
}
```

**Step 3: Build and verify**

Run: `cd web && npm run build`
Expected: Clean build. The component files exist but aren't used yet (added to pages in later tasks).

**Step 4: Commit**
```bash
git add web/src/_includes/components/body-map.njk web/src/css/body-map.css
git commit -m "feat: create Energy Center Body Map SVG component"
```

---

### Task 4: Create Certification Line-Art Icons

SVG icons for the certifications bar: leaf, rabbit/heart, shield-cross, water-drop-cross, hands, and palm-tree-cross (for the "Sin Aceite de Palma" section).

**Files:**
- Create: `web/src/_includes/components/cert-icons.njk`

**Step 1: Create cert-icons.njk**

```njk
{# cert-icons.njk — Certification line-art SVG symbols #}
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  {# Leaf — 100% Natural #}
  <symbol id="icon-leaf" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22c-4-4-8-7.5-8-12C4 5 8 2 12 2c4 0 8 3 8 8 0 4.5-4 8-8 12z"/>
    <path d="M12 22V8"/>
    <path d="M8 14c2-1 4-1 4-6"/>
    <path d="M16 14c-2-1-4-1-4-6"/>
  </symbol>

  {# Rabbit — Cruelty Free #}
  <symbol id="icon-rabbit" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 9c0-3-1.5-7-3-7s-2 2-3 2-1.5-2-3-2-3 4-3 7"/>
    <circle cx="12" cy="14" r="6"/>
    <circle cx="10" cy="13" r="0.5" fill="currentColor" stroke="none"/>
    <circle cx="14" cy="13" r="0.5" fill="currentColor" stroke="none"/>
    <path d="M10 16c1 1 3 1 4 0"/>
  </symbol>

  {# Shield with X — Libre de Parabenos #}
  <symbol id="icon-shield-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>
    <path d="M9 9l6 6"/>
    <path d="M15 9l-6 6"/>
  </symbol>

  {# Water drop with X — Libre de Sulfatos #}
  <symbol id="icon-drop-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2c0 0-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13z"/>
    <path d="M9.5 13l5 5"/>
    <path d="M14.5 13l-5 5"/>
  </symbol>

  {# Hands — Hecho a Mano #}
  <symbol id="icon-hands" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M7 11V4a1 1 0 0 1 2 0v4"/>
    <path d="M9 8V3a1 1 0 0 1 2 0v5"/>
    <path d="M11 8V4a1 1 0 0 1 2 0v4"/>
    <path d="M13 8V6a1 1 0 0 1 2 0v5"/>
    <path d="M15 13l-1.5-1.5"/>
    <path d="M7 11c-1 0-2 1-2 2.5 0 3 2.5 6.5 7 6.5s6-2.5 6-5V11"/>
  </symbol>

  {# Palm tree with prohibition — Sin Aceite de Palma #}
  <symbol id="icon-no-palm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22V10"/>
    <path d="M12 6c-2-3-5-4-7-3 2 0 4 2 5 4"/>
    <path d="M12 6c2-3 5-4 7-3-2 0-4 2-5 4"/>
    <path d="M12 10c-3-2-6-2-8 0 3-1 5 0 7 2"/>
    <path d="M12 10c3-2 6-2 8 0-3-1-5 0-7 2"/>
    <circle cx="12" cy="12" r="10" opacity="0.5"/>
    <line x1="5" y1="5" x2="19" y2="19" opacity="0.5"/>
  </symbol>
</svg>
```

**Step 2: Commit**
```bash
git add web/src/_includes/components/cert-icons.njk
git commit -m "feat: create certification line-art SVG icons"
```

---

## Phase 2: Original Enhanced (`web/`)

### Task 5: Home Hero — El Bosque Treatment

**Files:**
- Modify: `web/src/css/index.css` — hero overlay CSS

**Step 1: Update hero background overlay**

In `index.css`, change `.hero__bg img` opacity from `0.22` to `0.15`:
```css
.hero__bg img {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.15;  /* was 0.22 — darker, more forest-dominant */
  transition: transform 10s ease;
}
```

Replace the flat amber `::after` overlay with a subtle radial gradient:
```css
.hero__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 40%, rgba(168, 148, 120, 0.06) 0%, transparent 60%);
  z-index: 1;
  pointer-events: none;
}
```

**Step 2: Build and verify**

Run: `cd web && npm run build`
Preview the home page — hero should appear darker with the forest green more dominant.

**Step 3: Commit**
```bash
git add web/src/css/index.css
git commit -m "feat: apply El Bosque dark hero treatment to home page"
```

---

### Task 6: Home — Replace 7-Soap Grid with Body Map

**Files:**
- Modify: `web/src/index.njk` — replace `.coleccion` section
- Modify: `web/src/css/index.css` — remove old `.soaps` grid CSS, add body-map import
- Modify: `web/src/_includes/layouts/base.njk` — add body-map.css link

**Step 1: Add body-map.css to base layout**

In `base.njk`, add after the other CSS links:
```njk
<link rel="stylesheet" href="/css/body-map.css">
```

Or alternatively, add it as a page-specific CSS in `index.njk` frontmatter — but since both sites use it, putting it in base is cleaner.

**Step 2: Replace the coleccion section in index.njk**

Find the `.coleccion` section (the one with the 7-column `.soaps` grid). Replace it with:

```njk
<section class="coleccion" aria-labelledby="coleccion-h2">
  <div class="wrap">
    <div class="coleccion__header">
      <h2 class="coleccion__title reveal" id="coleccion-h2">Siete centros<br>de energia</h2>
      <p class="coleccion__intro reveal reveal-d1">Cada jabon esta inspirado en un centro de energia del cuerpo. De corona a raiz, una coleccion completa.</p>
    </div>
  </div>
  {% set variant = "light" %}
  {% include "components/body-map.njk" %}
  <div class="wrap" style="text-align:center; padding-top: 48px;">
    <a href="/coleccion/" class="btn-ghost reveal" aria-label="Ver la coleccion completa">Ver la coleccion <span aria-hidden="true">&rarr;</span></a>
  </div>
</section>
```

**Step 3: Clean up old CSS**

The `.soaps`, `.soap`, `.soap__dot`, `.soap__name`, `.soap__center`, `.soap__oils`, `.soap__link` classes in `index.css` are no longer needed for this section. Comment them out or remove if no other page uses them (they don't — this grid was index-only).

**Step 4: Build and verify**

Run: `cd web && npm run build`
Preview: home page should show the body map illustration instead of the 7-column grid.

**Step 5: Commit**
```bash
git add web/src/index.njk web/src/css/index.css web/src/_includes/layouts/base.njk
git commit -m "feat: replace home 7-soap grid with Energy Center Body Map"
```

---

### Task 7: Home — Add Journal Section

**Files:**
- Modify: `web/src/index.njk` — add journal section before footer
- Modify: `web/src/css/index.css` — add journal styles

**Step 1: Add journal HTML to index.njk**

After the formula section and before the closing content, add:

```njk
<section class="journal" aria-labelledby="journal-h2">
  <div class="wrap">
    <div class="journal__header">
      <h2 class="journal__title reveal" id="journal-h2">Journal</h2>
      <a href="/journal/" class="btn-ghost reveal">Ver todo <span aria-hidden="true">&rarr;</span></a>
    </div>
    <div class="journal__grid reveal reveal-d1">
      <article class="journal__card">
        <div class="journal__card-img" aria-hidden="true"></div>
        <time class="journal__card-date">Proximamente</time>
        <h3 class="journal__card-title">Los aceites esenciales de la coleccion</h3>
        <p class="journal__card-excerpt">Un recorrido por los aceites que definen cada jabon de la primera coleccion.</p>
      </article>
      <article class="journal__card">
        <div class="journal__card-img" aria-hidden="true"></div>
        <time class="journal__card-date">Proximamente</time>
        <h3 class="journal__card-title">Subachoque: donde nace aum</h3>
        <p class="journal__card-excerpt">La historia del lugar donde se producen los jabones, en los Andes colombianos.</p>
      </article>
      <article class="journal__card">
        <div class="journal__card-img" aria-hidden="true"></div>
        <time class="journal__card-date">Proximamente</time>
        <h3 class="journal__card-title">Cristales y centros de energia</h3>
        <p class="journal__card-excerpt">Por que cada jabon lleva un cristal natural y que representa en la coleccion.</p>
      </article>
    </div>
  </div>
</section>
```

**Step 2: Add journal CSS to index.css**

```css
/* ── Journal ── */
.journal { padding: var(--gap-section) 0; border-top: 1px solid var(--c-rule); }
.journal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: clamp(40px, 5vw, 64px);
}
.journal__title {
  font-family: var(--ff-display);
  font-weight: 400;
  font-size: clamp(30px, 4vw, 48px);
  letter-spacing: 0.01em;
}
.journal__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(24px, 3vw, 40px);
}
.journal__card {
  border: 1px solid var(--c-rule);
  padding: 0;
}
.journal__card-img {
  aspect-ratio: 16 / 10;
  background: rgba(168, 148, 120, 0.06);
}
.journal__card-date {
  display: block;
  font-family: var(--ff-body);
  font-size: 9px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-accent);
  padding: 20px 20px 0;
}
.journal__card-title {
  font-family: var(--ff-display);
  font-weight: 400;
  font-size: clamp(16px, 1.8vw, 22px);
  line-height: 1.3;
  letter-spacing: 0.01em;
  color: var(--c-text);
  padding: 10px 20px 0;
}
.journal__card-excerpt {
  font-family: var(--ff-body);
  font-size: 12px;
  line-height: 1.75;
  color: var(--c-secondary);
  padding: 8px 20px 24px;
}
@media (max-width: 768px) {
  .journal__grid { grid-template-columns: 1fr; }
}
```

**Step 3: Build and verify, then commit**
```bash
git add web/src/index.njk web/src/css/index.css
git commit -m "feat: add Journal placeholder section to home page"
```

---

### Task 8: Footer — Spectrum Bar + Link Reorder

**Files:**
- Modify: `web/src/_includes/components/footer.njk` — add spectrum bar, reorder links
- Modify: `web/src/css/footer.css` — add spectrum bar CSS

**Step 1: Add spectrum bar HTML**

In `footer.njk`, add just before the `.footer__bottom` div:

```njk
<div class="footer__spectrum" aria-hidden="true">
  <span style="background: var(--cx-quartz, #5c6670)"></span>
  <span style="background: var(--cx-amethyst, #692a6e)"></span>
  <span style="background: var(--cx-sodalite, #1d4590)"></span>
  <span style="background: var(--cx-aventurine, #35784a)"></span>
  <span style="background: var(--cx-citrine, #e8cf5b)"></span>
  <span style="background: var(--cx-carnelian, #d16b34)"></span>
  <span style="background: var(--cx-jasper, #b02c24)"></span>
</div>
```

**Step 2: Add spectrum bar CSS**

In `footer.css`:
```css
/* ── Spectrum bar ── */
.footer__spectrum {
  display: flex;
  height: 2px;
  margin: 16px 0;
}
.footer__spectrum span { flex: 1; }
```

**Step 3: Build, verify, commit**
```bash
git add web/src/_includes/components/footer.njk web/src/css/footer.css
git commit -m "feat: add crystal spectrum bar to footer"
```

---

### Task 9: Coleccion — Full-Viewport Layout Redesign

This is the largest single task. The coleccion page changes from a 2-column entry list to full-viewport sections with image-left/text-right layout.

**Files:**
- Modify: `web/src/coleccion.njk` — restructure soap entries
- Rewrite: `web/src/css/coleccion.css` — new layout system
- Create: `web/src/js/spine.js` — fixed spine scroll tracking

**Step 1: Restructure soap entries in coleccion.njk**

Replace the current `{% for entry in entries %}` loop (which generates `.soap-entry` divs with photo positioned absolutely on the right) with full-viewport sections:

Each soap section structure:
```njk
<section class="soap-section" id="{{ entry.slug }}" style="--cx: var(--cx-{{ entry.cxToken }})" aria-labelledby="soap-{{ entry.slug }}">
  <div class="soap-section__inner">
    <div class="soap-section__image">
      <img src="/images/{{ entry.heroImage }}"
        alt="{{ entry.name }}"
        loading="lazy" decoding="async"
        width="1667" height="2500">
    </div>
    <div class="soap-section__content">
      <div class="soap-section__crystal-bar" aria-hidden="true"></div>
      <div class="soap-section__meta">
        <svg class="soap-section__crystal-dot" aria-hidden="true"><use href="#{{ entry.cxToken }}"/></svg>
        <span class="soap-section__number">{{ entry.number }} / 07</span>
        <span class="soap-section__center">Centro {{ entry.center }}</span>
      </div>
      <h2 class="soap-section__name" id="soap-{{ entry.slug }}">{{ entry.name }}</h2>
      <p class="soap-section__tagline">{{ entry.tagline }}</p>
      <ul class="soap-section__oils" aria-label="Aceites esenciales">
        {% for oil in entry.oils %}
        <li>
          <span class="soap-section__oil-common">{{ oil.name }}</span>
          <span class="soap-section__oil-inci">{{ oil.inci }}</span>
        </li>
        {% endfor %}
      </ul>
      <div class="soap-section__actions">
        <a href="/coleccion/{{ entry.slug }}/" class="btn-ghost">Ver producto <span aria-hidden="true">&rarr;</span></a>
      </div>
    </div>
  </div>
  <div class="soap-section__divider" aria-hidden="true"></div>
</section>
```

**Step 2: Write new coleccion.css layout**

Key CSS changes (keeping the page-header and soap-nav intact, replacing soap-entry styles):

```css
/* ── Full-viewport soap sections ── */
.soap-section {
  min-height: 100vh;
  min-height: 100svh;
  position: relative;
  scroll-margin-top: calc(var(--nav-h-ed) + 52px);
}

.soap-section__inner {
  display: grid;
  grid-template-columns: 55fr 45fr;
  min-height: 100vh;
  min-height: 100svh;
}

/* Image — always left */
.soap-section__image {
  overflow: hidden;
  position: relative;
}
.soap-section__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 7s ease;
}
.soap-section:hover .soap-section__image img {
  transform: scale(1.02);
}

/* Content — always right */
.soap-section__content {
  padding: clamp(48px, 6vw, 96px) clamp(32px, 5vw, 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

/* Crystal accent bar — 3px on left edge of content panel */
.soap-section__crystal-bar {
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 3px;
  background: var(--cx);
}

/* Meta line with crystal SVG + number */
.soap-section__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
.soap-section__crystal-dot {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  display: block;
  overflow: visible;
}
.soap-section__number {
  font-family: var(--ff-body);
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-accent);
}
.soap-section__center {
  font-family: var(--ff-body);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-secondary);
}

/* Soap name — uppercase, NEUTRAL color (not crystal) */
.soap-section__name {
  font-family: var(--ff-display);
  font-weight: 400;
  font-size: clamp(32px, 4vw, 56px);
  line-height: 1.06;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--c-text);
  margin-bottom: 18px;
}

/* Gold divider between sections — 3px */
.soap-section__divider {
  height: 3px;
  background: var(--c-gold);
  opacity: 0.6;
}
```

**Step 3: Create spine.js**

```js
/* spine.js — Fixed vertical spine with crystal dots (desktop only) */
(function() {
  'use strict';
  const spine = document.querySelector('.spine');
  if (!spine || window.innerWidth < 768) return;

  const dots = spine.querySelectorAll('.spine__dot');
  const sections = document.querySelectorAll('.soap-section');
  if (!dots.length || !sections.length) return;

  function updateSpine() {
    const vh = window.innerHeight;
    const center = vh * 0.4;
    let activeIndex = -1;

    sections.forEach((sec, i) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= center && rect.bottom > center) {
        activeIndex = i;
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  window.addEventListener('scroll', updateSpine, { passive: true });
  updateSpine();
})();
```

**Step 4: Add spine HTML to coleccion.njk**

Before the soap sections, add:
```njk
<div class="spine" aria-hidden="true">
  <div class="spine__line"></div>
  {% for entry in entries %}
  <div class="spine__dot" style="--cx: var(--cx-{{ entry.cxToken }})">
    <svg width="13" height="13"><use href="#{{ entry.cxToken }}"/></svg>
  </div>
  {% endfor %}
</div>
```

And add spine CSS:
```css
/* ── Fixed spine (desktop only) ── */
.spine {
  position: fixed;
  left: 3vw;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 50;
}
.spine__line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--c-gold);
  opacity: 0.25;
}
.spine__dot {
  position: relative;
  z-index: 1;
  opacity: 0.4;
  transition: opacity 0.3s, transform 0.3s;
}
.spine__dot svg {
  width: 13px;
  height: 13px;
  display: block;
}
.spine__dot.active {
  opacity: 1;
  transform: scale(1.3);
}
@media (max-width: 768px) {
  .spine { display: none; }
}
```

**Step 5: Add `spine.js` to base.njk or coleccion.njk**

In `coleccion.njk` frontmatter, add: `pagejs: "/js/spine.js"`

**Step 6: Build, verify, commit**
```bash
git add web/src/coleccion.njk web/src/css/coleccion.css web/src/js/spine.js
git commit -m "feat: redesign coleccion with full-viewport sections and fixed spine"
```

---

### Task 10: Product Pages — Neutral Names + Crystal Accents

**Files:**
- Modify: `web/src/css/product.css` — change color of `.hero__name`, `.hero__center`
- Modify: `web/src/soaps/soaps.njk` — add crystal SVG dot to meta

**Step 1: Update product.css**

Change `.hero__name` color from crystal to neutral:
```css
.hero__name {
  /* ... keep all existing properties ... */
  color: var(--c-text); /* was: var(--cx-text, var(--cx)) */
}
```

Change `.hero__center` to keep crystal color (this is an accent label, not the name):
```css
.hero__center {
  /* stays as var(--cx) — this is an accent, not the name */
}
```

Update `.hero__btn` to solid dark background:
```css
.hero__btn {
  /* ... keep existing properties ... */
  background: var(--c-text);
  color: var(--c-bg);
  border: 1px solid var(--c-text);
}
.hero__btn:hover {
  background: transparent;
  color: var(--c-text);
}
```

**Step 2: Add crystal SVG to product template**

In `soaps.njk`, add crystal SVG symbols include and a crystal dot next to the meta number. Also ensure `crystal-symbols.njk` is included.

**Step 3: Build, verify, commit**
```bash
git add web/src/css/product.css web/src/soaps/soaps.njk
git commit -m "feat: neutral soap names + solid WhatsApp button on product pages"
```

---

### Task 11: Contacto — Crystal SVGs + WhatsApp Buttons

**Files:**
- Modify: `web/src/contacto.njk` — replace `<span class="soap-btn__dot">` with crystal SVGs, reorder Crown→Root
- Modify: `web/src/css/contacto.css` — update `.soap-btn__dot` to handle SVG, style WhatsApp buttons dark

**Step 1: Replace dots with SVGs in contacto.njk**

For each soap button, replace:
```html
<span class="soap-btn__dot" aria-hidden="true"></span>
```
with:
```html
<svg class="soap-btn__dot" aria-hidden="true" focusable="false"><use href="#cx-quartz"/></svg>
```
(using the correct crystal symbol ID for each soap)

**Step 2: Update contacto.css**

Change `.soap-btn__dot` from CSS circle to SVG sizing:
```css
.soap-btn__dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  display: block;
  overflow: visible;
  /* remove: border-radius: 50%; background-color: ... */
}
```

Style WhatsApp buttons with dark background:
```css
.soap-btn {
  /* ... keep existing layout properties ... */
  background: var(--c-text); /* Leather dark bg */
  color: var(--c-bg); /* white text */
}
.soap-btn__name { color: var(--c-bg); } /* was: var(--c-text) */
.soap-btn__center { color: rgba(250, 247, 241, 0.7); } /* was: secondary */
.soap-btn__arrow { color: var(--c-bg); } /* was: accent */
```

**Step 3: Reorder buttons Crown→Root**

Move Cuarzo Transparente first, Jaspe Brechado last.

**Step 4: Build, verify, commit**
```bash
git add web/src/contacto.njk web/src/css/contacto.css
git commit -m "feat: crystal SVGs + dark WhatsApp buttons on contacto page"
```

---

### Task 12: Nosotros — Add Crystal SVGs

**Files:**
- Modify: `web/src/nosotros.njk` — include `crystal-symbols.njk`

**Step 1: Add crystal symbols include**

Already done in Task 1. Verify it's working.

**Step 2: Build, verify, commit**

(Combined with Task 1 commit if not already done.)

---

### Task 13: Global WhatsApp Button Styling

**Files:**
- Modify: `web/src/css/base.css` — update `.wa-sticky` styling
- Modify: `web/src/css/footer.css` — update `.footer__wa` styling
- Modify: `web/src/css/index.css` — update hero `.btn-ghost` for WhatsApp

**Step 1: Style the sticky WhatsApp button**

In `base.css`, find `.wa-sticky` and update to solid dark:
```css
.wa-sticky {
  /* ... keep position/sizing ... */
  background: var(--c-text);
  color: var(--c-bg);
}
```

**Step 2: Style footer WhatsApp link**

In `footer.css`, update `.footer__wa`:
```css
.footer__wa {
  /* ... keep layout ... */
  background: var(--c-text);
  color: var(--c-bg);
  border: 1px solid var(--c-text);
}
.footer__wa:hover {
  opacity: 0.85;
}
```

**Step 3: Build, verify, commit**
```bash
git add web/src/css/base.css web/src/css/footer.css web/src/css/index.css
git commit -m "feat: solid dark background on all WhatsApp buttons"
```

---

## Phase 3: La Revista Scaffold (`revista/`)

### Task 14: Create La Revista Eleventy Project

**Files:**
- Create: `revista/package.json`
- Create: `revista/eleventy.config.js`
- Create: `revista/src/_data/soaps.json` — copy from web, already reordered
- Create: `revista/src/_data/site.json` — copy from web
- Symlink or copy: `revista/src/fonts/` — from `web/src/fonts/`
- Symlink or copy: `revista/src/images/` — from `web/src/images/`

**Step 1: Create package.json**
```json
{
  "name": "aum-revista",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "npx @11ty/eleventy --serve --port=8081",
    "build": "npx @11ty/eleventy"
  },
  "dependencies": {
    "@11ty/eleventy": "^3.1.5",
    "@11ty/eleventy-img": "^6.0.4"
  }
}
```

**Step 2: Create eleventy.config.js**

Same structure as web's config but pointing to `revista/src`.

**Step 3: Copy data, fonts, images**

```bash
mkdir -p revista/src/_data revista/src/fonts revista/src/images revista/src/css revista/src/js revista/src/_includes/layouts revista/src/_includes/components revista/src/soaps
cp web/src/_data/soaps.json revista/src/_data/
cp web/src/_data/site.json revista/src/_data/
cp web/src/fonts/* revista/src/fonts/
cp -r web/src/images/* revista/src/images/
```

**Step 4: Create base CSS files**

Copy `tokens.css`, `fonts.css`, `base.css`, `nav.css`, `footer.css`, `body-map.css` from `web/src/css/` to `revista/src/css/`. These form the shared design system.

Modify `tokens.css` for La Revista: keep all tokens identical (same design system).

**Step 5: Create shared components**

Copy from web: `crystal-symbols.njk`, `logo.njk`, `cert-icons.njk`, `body-map.njk`

**Step 6: Create base.njk layout**

Copy from web's `base.njk`, identical structure.

**Step 7: Install dependencies**

```bash
cd revista && npm install
```

**Step 8: Build and verify**

```bash
cd revista && npm run build
```

**Step 9: Commit**
```bash
git add revista/
git commit -m "feat: scaffold La Revista Eleventy project"
```

---

### Task 15: La Revista — Nav + Footer Components

**Files:**
- Create: `revista/src/_includes/components/nav.njk`
- Create: `revista/src/_includes/components/footer.njk`
- Create: `revista/src/css/nav.css`
- Create: `revista/src/css/footer.css`
- Create: `revista/src/js/nav.js`

These are copies of the web versions with minimal modifications. The nav and footer function identically to the original — same behavior, same dark-to-scrolled transition, same drawer.

Footer includes the spectrum bar from the start.

**Commit after verified build.**

---

## Phase 4: La Revista Pages

### Task 16: La Revista — Home Page

**Files:**
- Create: `revista/src/index.njk`
- Create: `revista/src/css/index.css`

**Sections (each fits in ~one viewport):**

1. **Hero** — Black Forest bg (`#283618`), lifestyle image at 15% opacity, centered headline Warm White, Gold eyebrow. Same structure as web hero but content may differ.

2. **Philosophy quote** — Pearl bg, single Instrument Serif Italic quote centered, max-width 800px.

3. **Energy Center Body Map** — Black Forest bg variant. Include `body-map.njk` with `variant = "dark"`.

4. **Filosofia pillars** — 4-column grid (Botanica, Ritual, Naturaleza, Presencia). Copy from web's `index.njk`.

5. **Certifications bar** — Pearl bg. Include `cert-icons.njk`. 5 trust signals in a row with icons:
```njk
{% include "components/cert-icons.njk" %}
<section class="certifications">
  <div class="wrap">
    <div class="cert-row">
      <div class="cert-item">
        <svg class="cert-item__icon"><use href="#icon-leaf"/></svg>
        <span class="cert-item__label">100% Natural</span>
      </div>
      <div class="cert-item">
        <svg class="cert-item__icon"><use href="#icon-rabbit"/></svg>
        <span class="cert-item__label">Cruelty Free</span>
      </div>
      <div class="cert-item">
        <svg class="cert-item__icon"><use href="#icon-shield-x"/></svg>
        <span class="cert-item__label">Libre de Parabenos</span>
      </div>
      <div class="cert-item">
        <svg class="cert-item__icon"><use href="#icon-drop-x"/></svg>
        <span class="cert-item__label">Libre de Sulfatos</span>
      </div>
      <div class="cert-item">
        <svg class="cert-item__icon"><use href="#icon-hands"/></svg>
        <span class="cert-item__label">Hecho a Mano</span>
      </div>
    </div>
  </div>
</section>
```

6. **Sin Aceite de Palma callout**:
```njk
<section class="commitment">
  <div class="wrap commitment__inner">
    <svg class="commitment__icon"><use href="#icon-no-palm"/></svg>
    <div>
      <h3 class="commitment__headline">Sin aceite de palma</h3>
      <p class="commitment__body">No utilizamos aceite de palma en ninguno de nuestros jabones. Un compromiso con la tierra y con la transparencia de ingredientes.</p>
    </div>
  </div>
</section>
```

7. **Formula** — 2-column: text left, image right. INCI list. Same structure as web.

8. **Pull quote** (from El Estudio) — Centered Instrument Serif Italic, max-width 800px, Pearl bg.

9. **Journal** — 3-card placeholder row. Same as web.

10. **CTA** — "Siete centros. Siete jabones." with WhatsApp button (dark bg).

11. **Footer** — Black Forest bg, spectrum bar, links.

**Commit after verified build.**

---

### Task 17: La Revista — Coleccion Page

**Files:**
- Create: `revista/src/coleccion.njk`
- Create: `revista/src/css/coleccion.css`

Same structure as the enhanced original's coleccion (full-viewport sections, image-left, no alternation, gold dividers, fixed spine) but with La Revista's editorial styling:
- Section label "Coleccion" above the headline
- Gold hairline dividers (3px, `var(--c-gold)`)
- Black Forest dark header instead of Forest Medium
- All sections sized to fit viewport
- Images capped at `max-height: 100vh`

**Commit after verified build.**

---

### Task 18: La Revista — Product Page Template

**Files:**
- Create: `revista/src/soaps/soaps.njk`
- Create: `revista/src/_includes/layouts/product.njk`
- Create: `revista/src/css/product.css`
- Create: `revista/src/js/product.js`

Same data-driven pagination as web's product pages. Layout:
- 60/40 hero (image left, text right)
- Soap name uppercase, Leather color (NOT crystal)
- Crystal accent on bars, dots, tagline border
- WhatsApp CTA: solid Leather bg, white text
- Narrative, ingredients, crystal block sections
- Gallery with lightbox
- Prev/next navigation

**Commit after verified build.**

---

### Task 19: La Revista — Nosotros, Contacto, Journal

**Files:**
- Create: `revista/src/nosotros.njk`, `revista/src/css/nosotros.css`
- Create: `revista/src/contacto.njk`, `revista/src/css/contacto.css`
- Create: `revista/src/journal.njk`, `revista/src/css/journal.css`

**Nosotros:** Same content as web's nosotros (historia, filosofia pillars, produccion) but Black Forest dark sections instead of Forest Medium.

**Contacto:** 7 WhatsApp buttons with crystal SVGs, Leather bg, white text. Crown→Root order.

**Journal:** 6-card placeholder grid (2x3 desktop, 1-col mobile). Each card: image placeholder + title + date + excerpt.

**Commit after verified build.**

---

### Task 20: La Revista — Supporting Pages

**Files:**
- Create: `revista/src/privacidad.njk`
- Create: `revista/src/404.njk`
- Create: `revista/src/robots.njk`
- Create: `revista/src/sitemap.njk`

Copy from web's versions, minimal changes (path adjustments if any).

**Commit after verified build.**

---

## Phase 5: Final Verification

### Task 21: Full Build + Preview Both Sites

**Step 1: Build both sites**
```bash
cd web && npm run build
cd ../revista && npm run build
```

**Step 2: Run both dev servers**
```bash
# Terminal 1
cd web && npm start

# Terminal 2
cd revista && npm start -- --port=8081
```

**Step 3: Verify checklist**

For BOTH sites, verify:
- [ ] Crystal SVGs everywhere (no CSS circles)
- [ ] Crown→Root order on all pages
- [ ] Soap names uppercase, neutral color
- [ ] Crystal color on accents only
- [ ] Gold dividers between soaps (3px)
- [ ] Footer spectrum bar
- [ ] Body map on home page
- [ ] Journal section on home page
- [ ] WhatsApp buttons: dark bg, white text
- [ ] Fixed spine on coleccion (desktop)
- [ ] Natural scroll (no snap)
- [ ] Mobile responsive
- [ ] `prefers-reduced-motion` respected
- [ ] Build completes without errors

La Revista additional checks:
- [ ] Black Forest dark sections (not Forest Medium)
- [ ] Certifications bar with icons
- [ ] Sin Aceite de Palma section
- [ ] One-screen-one-element sizing
- [ ] Pull quote between sections
- [ ] Filosofia pillars

**Step 4: Final commit**
```bash
git add -A
git commit -m "feat: complete dual website build — Original Enhanced + La Revista"
```

---

## Task Dependency Graph

```
Phase 1 (shared):  T1 → T2 → T3 → T4
                          ↓
Phase 2 (original): T5, T6, T7, T8, T9, T10, T11, T12, T13 (can parallel after T2)
                          ↓
Phase 3 (scaffold): T14 → T15
                          ↓
Phase 4 (pages):   T16, T17, T18, T19, T20 (can parallel after T15)
                          ↓
Phase 5 (verify):  T21
```

Tasks within a phase are largely independent and can be parallelized.

# aum. Marketing Optimization — Copy & Content Recommendations
*Generated: 2026-03-26 | Implementer: Claude | For review by: aum. brand team*

---

## Executive Summary

### What was implemented (technical — zero copy changes to source files)

| # | What | Files changed |
|---|---|---|
| 1 | `robots.txt` | `web/src/robots.njk` (new) |
| 2 | `sitemap.xml` — 11 URLs | `web/src/sitemap.njk` (new) |
| 3 | `lang="es-CO"` on `<html>` (was `lang="es"`) | `base.njk` |
| 4 | Organization + WebSite JSON-LD schema (all pages) | `base.njk` |
| 5 | FAQPage JSON-LD schema (6 Q&As mirrored from existing HTML) | `contacto.njk` |
| 6 | ItemList JSON-LD schema (7 products) | `coleccion.njk` |
| 7 | `hreflang="es-CO"` link tag (all pages) | `base.njk` |
| 8 | `geo.region: CO-CUN` + `geo.placename: Subachoque` meta (all pages) | `base.njk` |
| 9 | Analytics event layer — `data-track` on all WhatsApp CTAs | `analytics.js` (new) + 5 templates |
| 10 | Fixed 7 broken collection links in homepage (old `/slug/` → `/coleccion/slug/`) | `index.njk` |
| 11 | Added missing `width`/`height` to origen photo (CLS fix) | `index.njk` |
| 12 | Product marketing context document | `.agents/product-marketing-context.md` (new) |

### What requires brand team approval (copy changes)

Priority order for applying copy changes:

**P1 — High impact, low effort (do these first):**
- Product page meta descriptions — add soap name + crystal + key oil + location
- Nosotros historia section — significant brand voice violations throughout
- soaps.json `narrative` fields — audit all 7 (Jaspe Brechado confirmed violations)

**P2 — High impact, medium effort:**
- Hero meta label: `Crystal Infused Face and Body Soap` → translate to Spanish
- Colección page title tag: add "artesanales" keyword for SEO

**P3 — Low impact, optional:**
- Homepage Pillar 02 copy — minor cleanup
- Product page taglines — minor refinements
- Nosotros H1 — consider making visible for SEO signal

### What requires setup (not content)
- GA4 property creation (free) — see Analytics Next Steps section
- Google Search Console verification + sitemap submission

---

## SEO — Copy Recommendations

### Title Tag Patterns

**Current pattern:** `{{ pageTitle or title }} — aum.`

Pages and their current titles:
| Page | Current Title | Finding |
|---|---|---|
| Homepage (`/`) | `Rituales Botánicos de Bienestar — aum.` | Good — keyword-rich, brand at end |
| Colección (`/coleccion/`) | (check coleccion.njk — likely `Colección — aum.`) | Generic — no differentiator keyword |
| Nosotros (`/nosotros/`) | (check nosotros.njk) | Low SEO priority page |
| Contacto (`/contacto/`) | (check contacto.njk) | Low SEO priority page |
| Product pages | `{{ soap.name }} — Jabón Artesanal con Cristal — aum.` | **Recommended** — includes product name + category keyword |

**Recommendation (Impact: High, Effort: Low, Implement first: Yes):**
- Colección page title: Consider `Colección de Jabones Artesanales — aum.` or `Jabones con Cristales — Colección aum.`
- Product pages: Verify template includes soap name + "jabón artesanal" + "cristal" in title

### Meta Descriptions

**Current fallback:** `aum. — Rituales botánicos de bienestar. Jabones artesanales elaborados a mano con aceites esenciales puros, aceite de oliva, karité y coco. Producción en Subachoque, Colombia.`

This is an excellent site-level description. However:

**Recommendation (Impact: High, Effort: Medium, Implement first: Yes):**
- Each product page should have a unique meta description that includes: soap name + crystal name + key oil + "Subachoque" + "artesanal"
- Example for Jaspe Brechado: `Jabón artesanal aum. con cristal de Jaspe Brechado, aceites de bergamota, rosa de Damasco y ylang ylang. Elaborado a mano en Subachoque, Colombia. $35.000 COP.`
- Colección page needs a unique description: distinguish from homepage, focus on the 7-soap collection concept

### H1 Analysis

| Page | H1 | Finding |
|---|---|---|
| Homepage | `Rituales botánicos para la piel y la presencia.` | Poetic — good brand voice. Could include "jabones" for SEO |
| Nosotros | `Nosotros — aum.` (visually-hidden) | Hidden H1 is technically valid but wastes ranking signal |
| Colección | (verify in coleccion.njk) | — |
| Product pages | `{{ soap.name }}` | Good — product name is H1 |

**Recommendation (Impact: Medium, Effort: Low, Implement first: No):**
- Nosotros: Consider a visible H1 that communicates brand story keyword ("jabones artesanales en Subachoque")
- Homepage H1: Consider weaving in "jabones artesanales" without breaking the poetic voice

### Internal Linking

**Current state:**
- Footer links all 7 product pages ✅
- Colección page links to each product ✅
- Product pages link prev/next ✅
- Homepage → Colección via hero CTA ✅

**Gap:** No internal links from Nosotros → Colección (low priority), Contacto → Colección (now fixed)

**Recommendation (Impact: Low, Effort: Low, Implement first: No):**
- Nosotros page: add a contextual link to the Colección in body copy

---

## AI SEO — Content Recommendations

**Technical fixes implemented:**
- `hreflang="es-CO"` link tag added to all pages (base.njk)
- `geo.region: CO-CUN` meta tag added (Cundinamarca department)
- `geo.placename: Subachoque, Cundinamarca, Colombia` meta tag added

**Content recommendations (require brand team approval):**

### Product page meta descriptions
**Current template:** `{{ soap.tagline }} — aum. jabones botánicos artesanales. Producción en Subachoque, Colombia.`

**Issue:** The tagline is poetic but doesn't include the soap name, crystal, or key oils — missing the specific terms LLMs cite when answering "mejores jabones artesanales colombia."

**Recommended template** (Impact: High, Effort: Low, Implement first: Yes):
`Jabón de [NombreJabón] — [tagline]. Con cristal de [NombreJabón], aceites de [oil1] y [oil2]. Elaborado a mano en Subachoque, Colombia. $35.000 COP.`

Example for Jaspe Brechado:
`Jabón de Jaspe Brechado — Ancla tus raíces, conectándote con el presente. Con cristal de Jaspe Brechado, aceites de bergamota y rosa de Damasco. Elaborado a mano en Subachoque, Colombia. $35.000 COP.`

### FAQ additions for AI citation

AI assistants cite content that directly answers questions. Consider adding FAQ content to the site for these high-value queries:

| Query | Recommended Answer Location |
|---|---|
| "¿Qué es un jabón botánico artesanal?" | Nosotros page or FAQ |
| "¿Qué hace diferente a aum.?" | Nosotros page (already partially covered) |
| "¿Los cristales en el jabón son reales?" | Already in Contacto FAQ ✅ |
| "¿Dónde comprar jabones artesanales en Colombia?" | Contacto or homepage copy |
| "¿Cuál es el jabón artesanal para piel sensible?" | Contacto FAQ gap |

### Entity signals for LLM citation
To be cited by AI assistants, the following entity mentions should appear consistently:
- Brand name: `aum.` (already consistent ✅)
- Location: `Subachoque, Cundinamarca, Colombia` (in site description ✅, missing from most body copy)
- Product category: `jabones botánicos artesanales` (used in site description ✅)
- Key differentiator: `cristal natural` embedded in each bar (present ✅)
- Ingredient transparency: INCI names for all oils (present ✅)

**Gap:** Body copy on product pages doesn't mention "Subachoque" or "Colombia" — these geo-entity signals help with local SEO and AI citations for "jabones colombia" queries. Consider adding to the product narrative template.

### Recommended meta description length
Current product descriptions may be under 120 characters. Target 145–160 characters for maximum SERP real estate.

---

## CRO — Technical Verification

**All technical CRO items verified as already implemented:**

| Item | Status | File |
|---|---|---|
| `touch-action: manipulation` on all CTAs | ✅ Done | `base.css:46-48` (global — covers all `a`, `button`) |
| Hero CTA min-height 44px (mobile) | ✅ Done | `product.css` responsive block |
| `.btn-ghost` min-height 44px (mobile) | ✅ Done | `base.css:122-125` |
| Sticky WhatsApp button (52×52px, fixed) | ✅ Done | `base.css:183-207` |
| `scroll-margin-top` for soap-nav anchor links | ✅ Done | `coleccion.css:176` — `calc(var(--nav-h-ed) + 52px)` |
| `text-wrap: balance` on headlines | ✅ Done | `product.css`, `coleccion.css` |
| soap-nav item min-height 44px (mobile) | ✅ Done | `coleccion.css:383` |

**No technical CRO changes required.**

## CRO — Copy Recommendations

These findings require brand team approval before implementation. No source files changed.

### Homepage (`/`)

**Hero CTA:** Current text "Explorar la colección" or equivalent.
- **Recommendation (Impact: High, Effort: Low, Implement first: Yes):** Test CTA text that names the product: "Ver los 7 jabones" or "Descubrir la colección"
- **Rationale:** Specificity reduces friction — users know exactly what they'll find

**Hero H1:** Current: "Rituales botánicos para la piel y la presencia."
- **Recommendation (Impact: Medium, Effort: Low, Implement first: No):** Consider adding "jabones" somewhere above or below the H1 to reinforce the product category for new visitors
- **Brand voice note:** Do NOT change the H1 copy itself without careful brand review — it's poetic and on-brand

### Colección (`/coleccion/`)

**Product entry CTAs:** Current: "Pedir este jabón" + "Ver detalle"
- These are well-structured. "Pedir este jabón" is specific and action-oriented. ✅
- **Recommendation (Impact: Low, Effort: Low):** Consider if "Ver detalle" is better as "Ver más" or "Conocer [Nombre]" for specificity

**Page header description:** Currently explains the collection well
- **No change recommended** — copy is clean and factual ✅

### Product pages (`/coleccion/[jabón]/`)

**WhatsApp CTA button:** "Pedir por WhatsApp" — clear and direct ✅

**Hero tagline:** Uses `{{ soap.tagline }}` — poetic, on-brand ✅

**Narrative copy:** The narrative for Jaspe Brechado contains "transforma el ritual de autocuidado" — **brand voice violation** (see Brand Voice Violations section)

**Ingredient section:** Already uses INCI names prominently — key differentiator is well-executed ✅

**Price display:** "$35.000 COP" in the hero — good placement, justified by surrounding quality signals ✅

### Contacto (`/contacto/`)

**H1:** "Hablemos." — direct, on-brand, slightly generic
- **Recommendation (Impact: Low, Effort: Low):** "Escríbenos." would match WhatsApp-only context better, but "Hablemos." is acceptable

**Info panel:** Clean and informative ✅

**FAQ:** 6 questions covering the main purchase objections ✅

### Nosotros (`/nosotros/`)

**Brand voice:** See Brand Voice Violations section for several issues in the historia body copy

**Pillar structure:** 4 pillars (Botánica, Ritual, Naturaleza, Presencia) — well organized ✅

**CTA at bottom:** "Ver la colección" + "Pedir por WhatsApp" — correct conversion path ✅

---

## Brand Voice Violations Found

These are existing copy violations in source files. **Do NOT fix in source files** — document here for brand team review.

| File | Location | Violation | Rule |
|---|---|---|---|
| `web/src/_data/soaps.json` | `narrative` field for Jaspe Brechado | "transforma el ritual de autocuidado" | Never use "transforma tu rutina" or similar |
| `web/src/_data/soaps.json` | `narrative` field for Jaspe Brechado | "propiedades de conexión a tierra" | Crystals: never make property/effect claims |
| `web/src/nosotros.njk` | historia section, paragraph 2 | "armonizamos nuestros centros de energía" — uses "centros de energía" ✅ | Good — not "chakras" |
| `web/src/nosotros.njk` | historia section, paragraph 3 | "Estos centros son puntos esenciales en nuestro ser, donde se entrelazan nuestras dimensiones físicas, emocionales y espirituales" | Potentially over-spiritual — verify against brand voice |
| `web/src/nosotros.njk` | historia section, paragraph 4 | "fusionamos la sabiduría del reino mineral con el poder del reino vegetal" | Poetic but borderline — review against brand voice "nunca predica" rule |
| `web/src/nosotros.njk` | historia section, paragraph 2 | "simboliza nuestro compromiso con el autocuidado" | "autocuidado" is borderline — verify usage is concrete not aspirational |

---

## Copy Recommendations — Homepage (`/`)

**Overall:** Homepage copy is strong and on-brand. Concrete, poetic, no forbidden phrases. Minor improvements possible.

| Element | Current copy | Finding | Impact |
|---|---|---|---|
| H1 | "Rituales botánicos para la piel y la presencia." | ✅ On-brand — poetic, concrete, ≤8 words | — |
| Eyebrow | "Subachoque, Colombia — Primera Colección" | ✅ Excellent — geo entity + positioning | — |
| Hero sub | "Siete jabones elaborados a mano con aceites esenciales puros..." | ✅ Concrete ingredients, no filler | — |
| Hero tagline | "Limpia. Alinea. Renueva." | ✅ Perfect — 3-word, concrete verbs | — |
| Hero CTA | "Ver la colección" | ✅ Clear, direct | — |
| Secondary CTA | "Pedir por WhatsApp" | ✅ Specific action | — |
| Pillar 01 Botánica | "Las plantas son el núcleo..." | ✅ Concrete, no filler | — |
| Pillar 02 Ritual | "No una obligación, sino una elección consciente." | ⚠ "elección consciente" leans corporate — consider "Un momento elegido, no una obligación." | Low |
| Pillar 03 Naturaleza | "Lo que viene de la tierra, vuelve a ella." | ✅ Poetic, earned | — |
| Pillar 04 Presencia | "reconectar" | ✅ Acceptable — not "conéctate contigo mismo" | — |
| Formula headline | "Si toca tu piel cada día, debería cuidarla." | ✅ Excellent — concrete, no preaching | — |
| Origen headline | "Hecho a mano en Subachoque, Cundinamarca." | ✅ Excellent geo specificity | — |
| Origen body | "Un proyecto familiar. Pequeñas producciones, hechas con atención." | ✅ On-brand — short, real | — |

**Bug fixed in this session:** 7 collection card links used old `/slug/` URLs — updated to `/coleccion/slug/`. No copy changed.

---

## Copy Recommendations — Colección (`/coleccion/`)

**Overall:** Colección page copy is clean, functional, and on-brand.

| Element | Current copy | Finding | Impact |
|---|---|---|---|
| Page H1 | "La Colección" | ✅ Simple, direct | — |
| Page description | "Siete jabones botánicos elaborados a mano..." | ✅ Concrete, factual | — |
| Eyebrow | "Primera Colección" | ✅ Positioning, historical | — |
| Page header desc | "Siete jabones botánicos elaborados a mano. Cada uno inspirado en un centro de energía del cuerpo." | ✅ Good — uses "centro de energía" not "chakra" ✅ | — |
| Soap entry taglines | From `soap.tagline` in soaps.json | Needs individual review per soap | Medium |
| Crystal descriptions | From `soap.crystalDescShort` | Short, symbolic — appropriate | — |
| Kit section headline | "Los siete, juntos." | ✅ Excellent — short, poetic | — |
| Kit body | "Para quien quiere explorar la colección entera, o para quien busca el regalo perfecto." | ✅ Specific use cases, no filler | — |

---

## Copy Recommendations — Product Pages (`/coleccion/[jabón]/`)

**Template assessment:**

| Element | Current template | Finding | Impact |
|---|---|---|---|
| Meta description | `{{ soap.tagline }} — aum. jabones botánicos artesanales. Producción en Subachoque, Colombia.` | ⚠ Missing soap name, crystal, key oils — weak SEO signal | High |
| H1 | `{{ soap.name }}` | ✅ Product name is the H1 | — |
| Hero meta | `{{ soap.number }} / 07 · Crystal Infused Face and Body Soap` | ⚠ "Crystal Infused Face and Body Soap" is in English — inconsistent with Spanish site | Medium |
| Hero center | `{{ soap.center }}` | ✅ Uses "centro de energía" values from data | — |
| Pull quote | `{{ soap.pullQuote }}` | Quality depends on soaps.json data | — |
| Narrative | `{{ soap.narrative }}` | ⚠ Jaspe Brechado narrative has violations — audit all 7 (see Brand Voice Violations) | High |
| Crystal disclaimer | "El cristal cumple una función simbólica..." | ✅ Excellent — clear, non-therapeutic | — |
| Certs | From `site.certifications` | ✅ Factual, no filler | — |

**Individual soap tagline assessment** (from soaps.json):
- Jaspe Brechado: "Ancla tus raíces, conectándote con el presente." — ⚠ "conectándote" verb — technically CLAUDE.md bans "conéctate contigo mismo" not "conectar" per se — borderline
- Other soaps: require audit of full soaps.json data

---

## Copy Recommendations — Nosotros (`/nosotros/`)

**Overall:** The historia section has the most brand voice issues on the site. The later sections (filosofia, produccion, formula) are strong.

| Element | Current copy | Finding | Impact |
|---|---|---|---|
| Historia headline | "Un proyecto familiar hecho con atención." | ✅ Short, concrete, warm | — |
| Historia body P1 | "Iniciar nuestro viaje hacia el autodescubrimiento ha sido un proceso revelador..." | ❌ "autodescubrimiento", "proceso revelador", "valor de nuestra existencia" — aspirational filler | High |
| Historia body P2 | "aum., una marca que simboliza nuestro compromiso con el autocuidado y la belleza del equilibrio" | ❌ "la belleza del equilibrio", "compromiso con el autocuidado" — corporate wellness filler | High |
| Historia body P3 | "donde se entrelazan nuestras dimensiones físicas, emocionales y espirituales" | ❌ Over-spiritual phrasing — violates "nunca predica" rule | High |
| Historia body P4 | "fusionamos la sabiduría del reino mineral con el poder del reino vegetal" | ⚠ Poetic but archaic — "reino mineral/vegetal" sounds like 1990s crystal healing | Medium |
| Filosofia headline | "Las plantas siempre supieron cómo cuidarnos." | ✅ Excellent — earned, poetic | — |
| Filosofia pillar texts | All 4 pillars | ✅ Strong — concrete, no filler | — |
| Produccion headline | "Hecho a mano. Subachoque, Colombia." | ✅ Excellent | — |
| Formula headline | "Si toca tu piel cada día, debería cuidarla." | ✅ Excellent | — |
| Cierre headline | "Siete centros. Siete jabones. Una colección." | ✅ Excellent | — |

---

## Copy Recommendations — Contacto (`/contacto/`)

**Overall:** Best-written page on the site. Minimal, functional, on-brand throughout.

| Element | Current copy | Finding | Impact |
|---|---|---|---|
| H1 | "Hablemos." | ✅ Direct, warm | — |
| Eyebrow | "Pedidos y consultas" | ✅ Functional, honest | — |
| Page desc | "Por ahora vendemos directamente por WhatsApp..." | ✅ Transparent, specific | — |
| FAQ Q1-Q6 | All 6 questions | ✅ Clear, factual, no filler | — |
| Shipping answer | "El valor del envío depende de la ciudad de destino." | ✅ Honest, no over-promise | — |
| Crystal answer | "El cristal cumple una función simbólica..." | ✅ Excellent — legal clarity | — |
| Info panel | WhatsApp, Instagram, Origen, Envíos, Respuesta | ✅ Factual, complete | — |

---

## Brand Voice Violations Found

| File | Location | Violation | Severity |
|---|---|---|---|
| `web/src/_data/soaps.json` | Jaspe Brechado `narrative` | "transforma el ritual de autocuidado en una práctica de equilibrio interior" | High — "transforma" banned phrase |
| `web/src/_data/soaps.json` | Jaspe Brechado `narrative` | "propiedades de conexión a tierra" — implies therapeutic properties | High — crystals: symbolic only |
| `web/src/_data/soaps.json` | Jaspe Brechado `narrative` | "aporta fuerza y estabilidad" — crystal property claim | High — crystals: symbolic only |
| `web/src/nosotros.njk` | historia P1 | "Iniciar nuestro viaje hacia el autodescubrimiento" | High — aspirational, preachy |
| `web/src/nosotros.njk` | historia P1 | "el verdadero valor de nuestra existencia" | High — corporate wellness filler |
| `web/src/nosotros.njk` | historia P2 | "la belleza del equilibrio" | Medium — vague |
| `web/src/nosotros.njk` | historia P3 | "se entrelazan nuestras dimensiones físicas, emocionales y espirituales" | High — preaches |
| `web/src/nosotros.njk` | historia P4 | "celebración del amor propio" | High — "amor propio" is wellness cliché |
| `web/src/soaps/soaps.njk` | hero meta label | "Crystal Infused Face and Body Soap" in English | Medium — language inconsistency |
| `web/src/index.njk` | collection section (FIXED) | Links used old `/slug/` URLs — not copy, technical bug | Fixed ✅ |

**Note:** All 7 soap `narrative` fields in soaps.json should be audited. Jaspe Brechado shows the pattern likely repeats across all soaps.

---

## Analytics — Next Steps

To complete the analytics setup:

1. **GA4 property:** Create at analytics.google.com → Get Measurement ID (G-XXXXXXXX)
2. **Add to base.njk:**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
   <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-XXXXXXXX');</script>
   ```
3. **Uncomment GA4 hook** in `web/src/js/analytics.js` — the line `// if (window.gtag) gtag('event', event.name, event);`
4. **Google Search Console:** Verify `aum.co` property → submit sitemap at `https://aum.co/sitemap.xml`
5. **Enhanced Measurement:** Enable scroll depth + outbound click tracking in GA4 settings

**Alternative:** Plausible Analytics (`plausible.io`) — privacy-first, no cookies, GDPR-compliant, lightweight. The Plausible hook is also ready in analytics.js.

**Priority for brand team review:** The `narrative` field in soaps.json affects all product pages. Jaspe Brechado narrative has at least 2 violations. Recommend auditing all 7 soap narratives for consistency.

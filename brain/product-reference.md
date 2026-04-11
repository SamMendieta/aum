---
owner: Sam (sync with soaps.json when products change)
last-updated: 2026-04-06
review: When products change
---

# aum. Product Reference

## Operational Source of Truth
Product data lives in `web/src/_data/soaps.json`. That file drives the website via Eleventy pagination. This brain file summarizes for skill context. **If they conflict, soaps.json wins.**

## First Collection: 7 Botanical Soaps
Price: $35.000 COP per bar | Weight: 110g | Production: Subachoque, Cundinamarca

## Base Ingredients (all 7 soaps)
Saponified Olea Europaea Fruit Oil · Cocos Nucifera Oil · Butyrospermum Parkii (Shea Butter) · Mangifera Indica Seed Butter · Sodium Lactate

Note: Benzoin Tincture stays in INCI label but NOT in consumer-facing formula copy (Andrea instruction).

## Certifications
100% Natural · Cruelty Free · Libre de Parabenos · Libre de Sulfatos · Hecho a Mano · Sin Aceite de Palma

## Canonical Crystal Names (brand order: Crown → Root)

| # | Soap | Center | Crystal Name |
|---|---|---|---|
| 01 | Cuarzo Transparente | Corona | Cristal del maestro sanador |
| 02 | Amatista | Tercer Ojo | El cristal de la Humildad |
| 03 | Sodalita | Garganta | El cristal de la comunicación |
| 04 | Aventurina | Corazón | El cristal del amor |
| 05 | Citrino | Plexo Solar | El cristal de la abundancia |
| 06 | Cornalina | Sacro | Cristal de vitalidad |
| 07 | Jaspe Brechado | Raíz | el cristal de la conexión a tierra |

**Ordinal rule:** Crown (01) → Root (07). NOT traditional chakra order. "La cornalina conecta con el sexto centro" ✓ (not "segundo").

**Naming rules:** "cristal de" always — never "piedra de". Exact capitalization from this table. No mineral-science aliases ("jaspe rojo", "cuarzo hialino") in web copy.

## Sales Channel
Instagram (@aumbotanicals) → WhatsApp (+57 322 776 2560) → direct order.
Payment visible on site: **Nequi · Llaves (Bancolombia)** (BRD-019 — Andrea decision April 2026).
Payment accepted but not listed on site: Daviplata · Transferencia bancaria.
WhatsApp base: `https://wa.me/573227762560`
Per-product CTA: `wa.me/573227762560?text=Hola%2C%20me%20interesa%20el%20Jabón%20de%20[Nombre]%20de%20aum.%20%C2%BFC%C3%B3mo%20puedo%20pedirlo%3F`
Price display: Show **$35.000 COP** next to WhatsApp button on product pages (BRD-024).

## Approved Copy Structure — All 7 Soaps (April 2026)
*Source: Andrea + Camila review session. All fields implemented in soaps.json.*

Each soap now has these text fields approved by both founders:
- **tagline** — frase corta; under name in collection + top of product page
- **pullQuote** — frase destacada; highlighted quote on product page
- **narrative** — descripción completa; 3-paragraph main text (fragrance → crystal → formula)
- **crystalDesc** — crystal description for product page (2–3 sentences)
- **crystalDescShort** — short crystal description for collection page (1–2 sentences)
- **metaDesc** — Google search snippet (not visible on site)
- **reflection** — NEW: philosophical text about the energy center, ends with personal question. Not yet rendered on site — soaps.njk needs update to display.

### Copy Voice Rules (extracted from approved texts)
- Fragrance paragraph: oils first, name each contribution, end with overall impression
- Crystal paragraph: "[crystal] — [poetic name] —" as em-dash phrase, then energy center, then symbolic role (never therapeutic claims)
- Formula paragraph: saponification method, skin benefit, no "hasta tus manos"
- Reflections: 2–3 short paragraphs + 1 personal question. Philosophical, not product-adjacent.
- pullQuote: 1 line, no more. Statement, not question.

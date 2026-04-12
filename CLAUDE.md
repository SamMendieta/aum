# CLAUDE.md — aum. Brand Project
**Coordinator v4.0 — April 2026**

## What This Is
aum. is an artisanal botanical soap brand from Subachoque, Colombia.
7 soaps, each mapped to a body energy center. Sells via Instagram → WhatsApp.

## Brand Knowledge (load on demand)
- `brain/brand-voice.md` — how we sound (Andrea's 8 principles, two-register system)
- `brain/content-rules.md` — what we never do (forbidden words, patterns, structural rules)
- `brain/audience.md` — who we talk to (personas, discovery path, emotional goals)
- `brain/positioning.md` — why we're different (territory, pillars, philosophy)
- `brain/visual-identity.md` — how we look (Color System v3, Instrument Serif + Inter, layout)
- `brain/product-reference.md` — what we sell (7 soaps, crystal names, pricing, sales channel)

## Skills
- `/aum-copywriting` — write any aum. copy (loads brand-voice + content-rules + product-reference)
- `/aum-copy-review` — review copy against brand voice (loads brand-voice + content-rules)
- `/aum-instagram` — generate Instagram content (loads brand-voice + content-rules + audience + product-reference)
- `/aum-site-update` — apply founder feedback to website (loads product-reference + visual-identity)
- `/aum-brain-updater` — route finalized brand info to correct brain/ file (classify → route → write → verify)
- `/aum-brand-sync` — check and fix knowledge drift across all docs (loads all brain files)
- `/aum-design-guardian` — visual change verification with automated screenshots (loads visual-identity + positioning)

## Founder Decisions
- `decisions/DECISIONS.md` — resolved decisions with rationale
- `decisions/pending-alignment.md` — active Andrea/Camila disagreements (3 items)

## Session State
- `COORDINATION.md` — what's in flight, last sync date, next priorities. Read at session start, update at end.

## Founder-Facing Documents Rule
All documents that founders will read (AUM_MASTER_REFERENCE.md, decisions/ files, questionnaires, summaries) must be:
- **Completely in Spanish**
- **Non-technical** — no file paths, no code, no CSS tokens, no template names
- Describe website changes visually ("el texto grande al inicio de la página") not technically ("the h1 in index.njk")
- Self-explanatory — founders should never need to ask "¿dónde va este texto?" or "¿qué significa esto?"

## Tech Stack
- **SSG:** Eleventy 3.1.5 + Nunjucks (.njk templates)
- **CSS/JS:** Vanilla — no preprocessor, no bundler, no frameworks
- **Hosting:** Cloudflare Pages (auto-deploy from git push)
- **Build:** `npm start` (dev server) / `npm run build` (production → _site/)
- **Product data:** `web/src/_data/soaps.json` (7 entries, generates 7 pages via pagination)
- **Site config:** `web/src/_data/site.json`
- **Key templates:** index.njk, coleccion.njk, nosotros.njk, contacto.njk
- **Product template:** `web/src/soaps/soaps.njk` (Eleventy pagination from soaps.json)
- **Fonts:** `/fonts/` — InstrumentSerif-Regular.ttf, InstrumentSerif-Italic.ttf, Inter-Regular.woff2

## Gotchas
1. **Two font variable names:** `--ff-display`/`--ff-body` (product pages) vs `--f-display`/`--f-body` (editorial). Both aliased to same fonts in tokens.css.
2. **Two reveal systems:** `.rv` (product pages, 0.7s 14px) vs `.reveal` (editorial, 0.85s 20px). Intentional timing difference.
3. **Nav height tokens manually synced:** `--nav-h: 82px`, `--nav-h-sm: 58px` in tokens.css measured from live DOM. Update if nav padding changes.
4. **Analytics not wired:** `analytics.js` captures data-track clicks → console.debug only. GA4/Plausible hooks commented out.
5. **No CSS minification:** CSS/JS copied as-is to _site/ via passthrough.
6. **SVG crystal symbols duplicated:** Each page embeds all 7 inline.

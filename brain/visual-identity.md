---
owner: Sam
last-updated: 2026-04-06
review: When design system changes
---

# aum. Visual Identity

## Typography (Web — live on site)
| Role | Font | Weight | Source |
|---|---|---|---|
| Display / Headlines / Logo | **Instrument Serif** | Regular 400 + Italic | Local @font-face /fonts/ |
| Body / Labels / Nav / UI | **Inter** | Regular 400 | Local @font-face /fonts/ |

Rules: sentence case, generous tracking (0.04-0.08em), clamp() fluid scale. Never bold display. Never all-caps except 2-word labels. Both fonts always together on every page.

## Typography (Packaging — printed, unchanged)
Pierson (display) + Biryani (body). Physical packaging predates web font changes.

## Color System v3 (Amber + Forest Bitonal)
| Token | Hex | Name | Use |
|---|---|---|---|
| --c-bg | #FAF7F1 | Pearl | All light surfaces |
| --c-text | #262626 | Leather | Primary text, nav |
| --c-accent | #A89478 | Amber | Dividers, hover, borders. Never large fills. |
| --c-secondary | #5C5445 | Secondary | Body text, descriptions |
| --c-dark | #283618 | Black Forest | Hero bg, banner bg |
| --c-dark-bg | #344422 | Forest Medium | Footer, origin strip, produccion |
| --c-dark-text | #F5F0E8 | Warm White | Headlines on dark bg |
| --c-dark-sub | #C9AD88 | Gold | Labels/eyebrows on dark bg |
| --c-rule | rgba(168,148,120,0.22) | Amber 22% | Dividers on light bg |
| --c-rule-dark | rgba(201,173,136,0.20) | Gold 20% | Dividers on Forest bg |

## Crystal Colors (per product page — accent only, never large fills)
| Soap | Hex | Token |
|---|---|---|
| Jaspe Brechado | #b02c24 | --cx-jasper |
| Cornalina | #d16b34 | --cx-carnelian |
| Citrino | #e8cf5b | --cx-citrine |
| Aventurina | #35784a | --cx-aventurine |
| Sodalita | #1d4590 | --cx-sodalite |
| Amatista | #692a6e | --cx-amethyst |
| Cuarzo Transparente | #5c6670 | --cx-quartz |

## Design Principles
1. White space sells — min 96px desktop / 64px mobile between sections
2. One next step per screen — WhatsApp is the CTA
3. Ingredients are the argument — INCI + common names, always visible
4. Zero decorative noise — no icons, gradients, pill shapes, shadows >0 4px 12px rgba(0,0,0,0.06)
5. Mobile ≠ desktop shrunk — different compositions per breakpoint

## Layout
Grid: 12 col, 24px gutter, 80px margins desktop / 24px mobile, 1280px max.
Corners: 0-2px max. Buttons: ghost (1px border) or text links. Never filled except WhatsApp CTA.
Hover: 0.7 opacity or accent color, 0.3s ease. No bounce, no scale.

## Photography
Subjects: skin, hands, botanicals, earth textures, water, steam, neutral backgrounds.
Light: natural, lateral, warm. Never flash, never white studio bg.
Ratios: 1:1 product, 16:9 hero, 3:4 portrait.

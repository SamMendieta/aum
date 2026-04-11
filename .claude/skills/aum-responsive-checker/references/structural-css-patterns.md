# Structural CSS Patterns

## When to Read This File
Load when writing or reviewing a CSS fix. Check proposed fixes against these preferred patterns.

## Core Principle
CSS that works at ANY width 320-2560px. Structural fixes prevent future symptoms. Breakpoint patches create new problems at the next device width.

## Prefer / Over

| Prefer | Over | Reason |
|--------|------|--------|
| `clamp()` | Fixed `px` values | Scales continuously; no hard breakpoint |
| `auto-fit` / `minmax()` | Fixed column counts | Grid reflows itself without media queries |
| `min-height` | `height` | Allows content to grow; prevents overflow |
| `min-width: 0` | `overflow: hidden` | Fixes flex/grid child overflow without clipping |
| `@media (pointer: coarse)` | Base `min-height: 44px` | Touch targets only apply on touch devices |
| `gap` | `margin` between siblings | Gap is layout-aware; margin collapses unpredictably |
| `ch` units | Fixed `px` max-width on text | Scales with font size and user preferences |
| `svh` | `vh` | Avoids mobile browser chrome height bugs |

## aum-Specific CSS Constraints (from brain/visual-identity.md)

| Property | Value | Notes |
|----------|-------|-------|
| Section spacing | `clamp(64px, 8vw, 96px)` | Top and bottom padding on all major sections |
| Grid gutter | `clamp(24px, 5vw, 80px)` | Gap between columns and cards |
| Max content width | `1280px` | Centered with auto margins |
| Border radius | `0–2px` | Almost square; never pill or round |
| Hover opacity | `0.7` at `0.3s ease` | Consistent interaction feedback |
| Box shadows | `0 4px 12px rgba(0,0,0,0.06)` max | Subtle only; no dramatic elevation |
| Font scale | Fluid via `clamp()` | No stepped sizes; smooth across all widths |

## CSS Scope Rules (CRITICAL)

These rules determine where a fix may be placed. Placing a fix in the wrong scope causes regressions.

**Touch targets** — ONLY inside `@media (pointer: coarse)` or a mobile-specific query. Never in base rules. A `min-height: 44px` in a base rule will enlarge buttons on desktop.

**Layout shifts** — ONLY inside a specific breakpoint query (e.g., `@media (max-width: 767px)`). Structural reflows must be scoped to the viewport range where they are needed.

**Safe in base rules** — `overflow-x: clip` on `html`, `word-break`, `overflow-wrap`, `max-width: 100%` on media elements, `min-width: 0` on flex/grid children. These are safe at all widths.

**The test:** If you cannot explain why a rule is harmless at 1440px, it does not go in a base rule.

## 5 Structural Fixes Covering 90% of Cases

These five patterns resolve the majority of responsive failures without breakpoint patches:

1. **Horizontal overflow** — Add `overflow-x: clip` to `html`. Stops any element from causing a horizontal scrollbar without hiding content.

2. **Long text overflow** — Add `word-break: break-word; overflow-wrap: break-word` to long text containers (headings, product names, paragraphs). Prevents text from punching outside its container.

3. **Flex row overflow** — Add `flex-wrap: wrap` to any flex container that holds multiple items in a row. Allows items to stack when there is not enough width.

4. **Media overflow** — Add `max-width: 100%` to `img`, `video`, `canvas`, and `svg`. Prevents embedded media from exceeding its container width.

5. **Flex/grid child overflow** — Add `min-width: 0` to direct children of flex or grid containers. Overrides the default `min-width: auto` that prevents shrinking below content size.

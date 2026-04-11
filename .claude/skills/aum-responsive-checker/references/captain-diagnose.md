# Captain: Diagnose

## Purpose
Find and score responsive problems using multiple diagnostic frameworks. Produce a structural audit report and root cause classification.

---

## Step 1: Run Metrics

```bash
npm run audit:responsive -- --json
npm run audit:sweep -- --json
npm run test:responsive
```

Collect all output. Store raw JSON results in state file before proceeding.

---

## Step 2: Structural Audit

Score each dimension 0–4. Total score = sum of all five (max 20).

### Dimension 1 — Global Protections

Check `base.css` for the presence of:
- `max-width: 100%` on `img`
- `min-width: 0` on flex/grid children
- `overflow-x: clip` on `html`
- `box-sizing: border-box`
- `touch-action: manipulation`

| Score | Meaning |
|-------|---------|
| 0 | No reset present |
| 1 | Basic `box-sizing` only |
| 2 | `box-sizing` + `img` |
| 3 | Most protections present |
| 4 | Complete — all five present |

---

### Dimension 2 — Fluid Sizing

Count:
- **Bad:** `width: Npx` and `font-size: Npx` (hard-coded fixed values)
- **Good:** `clamp(`, `min(`, `max(` (fluid functions)

| Score | Meaning |
|-------|---------|
| 0 | All fixed |
| 1 | Few `clamp` instances |
| 2 | Mixed — roughly equal |
| 3 | Mostly fluid |
| 4 | Fluid-first — fixed only for borders/decorations |

---

### Dimension 3 — Layout Adaptability

Count:
- **Good:** `auto-fit`, `auto-fill`, `minmax(` in grid definitions
- **Risky:** `repeat(N, fixed columns)` and `height: 100svh`

| Score | Meaning |
|-------|---------|
| 0 | Fixed columns, no media queries |
| 1 | Fixed columns + media queries |
| 2 | Mix of intrinsic and fixed |
| 3 | Mostly intrinsic layout |
| 4 | Intrinsic-first — fixed columns only where truly required |

---

### Dimension 4 — Touch & Interaction

Check where touch targets are defined:
- **Correct:** inside `@media (pointer: coarse)` or mobile-scoped queries
- **WRONG:** in base rules (affects all devices)

| Score | Meaning |
|-------|---------|
| 0 | No touch targets defined |
| 1 | Touch targets exist but in base rules |
| 2 | In queries but incomplete coverage |
| 3 | Good coverage with minor gaps |
| 4 | All interactive elements ≥ 44px, scoped to `@media (pointer: coarse)` only |

---

### Dimension 5 — Viewport Containment

Use Playwright `page.evaluate()` to measure every `section`, `.hero`, `.soap-section`, and `[class*="section"]` against `window.innerHeight`.

```js
page.evaluate(() => {
  return [...document.querySelectorAll('section, .hero, .soap-section, [class*="section"]')]
    .map(el => ({
      selector: el.className || el.tagName,
      height: el.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
      exceeds: el.getBoundingClientRect().height > window.innerHeight
    }))
    .filter(r => r.exceeds)
})
```

| Score | Meaning |
|-------|---------|
| 0 | Multiple sections exceed viewport at multiple viewports |
| 1 | Some sections exceed on mobile |
| 2 | Most sections fit; 1–2 edge cases |
| 3 | All fit except at 320px |
| 4 | Every section fits every viewport in the test matrix |

---

## Step 3: Root Cause Classification

Map every finding to a root cause, domain, and target skill.

| Root Cause Pattern | Domain | Target Skill |
|--------------------|--------|-------------|
| Missing global protections | layout | Fix directly in `base.css` |
| Fixed values (`px` widths/fonts) | layout | `/normalize` |
| Layout doesn't adapt across viewports | layout | `/adapt` |
| Spacing breaks at certain sizes | layout | `/arrange` |
| Edge cases (320px, 2560px, unusual ratio) | layout | `/harden` |
| Font sizes feel wrong or overflow | visual | `/typeset` |
| Images overflow or distort | visual | `/optimize` |
| Final visual quality / polish | visual | `/polish` |
| Touch targets in base rules | layout | Fix directly — `@media (pointer: coarse)` ONLY |
| Design feels off / not aum | visual | `/aum-design-guardian` via Verify |

---

## Step 4: Routing Plan

Present the following table to the user before any fix is applied.

| # | Root Cause | Domain | Skill | CSS File(s) | Severity |
|---|------------|--------|-------|-------------|----------|
| 1 | … | layout / visual | /skill | file.css | critical / high / medium / low |
| 2 | … | | | | |

> **Proceed? [y / adjust]**

Do NOT invoke any fix skill until the user approves.

---

## Leaf Skill Routing

| Condition | Leaf Skill |
|-----------|-----------|
| Always | `/audit` |
| Responsive score < 3/4 or accessibility failures | `/design-auditor` |
| Need UX perspective or content hierarchy review | `/critique` |
| Modern best practices reference needed | `/web-interface-guidelines` |
| Token drift detected across files | `/design-system` |

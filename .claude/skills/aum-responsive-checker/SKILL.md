---
name: aum-responsive-checker
description: Use when making any CSS, layout, or template change to the aum. site that could affect responsive behavior. Also use when the user reports a device-specific display issue, says 'doesn't look right on my phone/laptop', 'responsive', 'broken on mobile', 'overflow', or 'doesn't fit'.
---

# aum. Responsive Checker v5

Tiered orchestrator for responsive design on the aum. website. Diagnoses structural CSS problems, dispatches specialized skills to fix them, and visually verifies every change across 14 viewports weighted for the Colombian market.

**This skill diagnoses, routes to captains, and verifies.** For simple fixes (< 5 lines, single file, well-understood root cause), apply CSS directly. For multi-file structural changes or uncertain approaches, dispatch leaf skills as subagents.

---

## Hard Gates (non-negotiable)

### 1. Viewport Containment Law
No element may be taller or wider than the viewport it is viewed on. Binary gate — not a scored dimension. Fail = block.

### 2. Visual Regression Gate
Screenshots at ALL viewports before and after. Any unintended visual change at ANY viewport = revert that change.

### 3. Brand Coherence Gate
Design must feel like aum. at every viewport. Delegates to `/aum-design-guardian`.

---

## Reference Files — Load On Demand

| File | Load WHEN |
|------|-----------|
| `references/captain-diagnose.md` | Entering Phase 1 (Diagnose) |
| `references/captain-fix.md` | Phase 1 complete, score < 18/20, routing plan approved by user |
| `references/captain-verify.md` | All approved fixes applied, entering Phase 3 (Verify) |
| `references/viewport-matrix.md` | Setting up Playwright viewports for screenshots or audit |
| `references/structural-css-patterns.md` | Writing or reviewing a CSS fix |
| `references/iteration-protocol.md` | A verification failure triggers re-iteration |

Do NOT pre-read captains. Load only when entering that phase.

---

## Workflow

### Phase 0 — Baseline (before ANY CSS edit)

```bash
cd web
npm start                                                         # Dev server (if not running)
```

**Port check:** Note the port Eleventy reports (may be 8080, 8082, etc. if port is in use). Pass `--port NNNN` to all screenshot/audit commands if not 8080.

**URL validation (mandatory):** Before running audits, verify ALL pages resolve (no 404s):
```bash
for page in / /coleccion/ /nosotros/ /contacto/ /coleccion/cuarzo-transparente/ /coleccion/amatista/ /coleccion/sodalita/ /coleccion/aventurina/ /coleccion/citrino/ /coleccion/cornalina/ /coleccion/jaspe-brechado/; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:8080$page")
  [ "$code" != "200" ] && echo "FAIL: $page → $code"
done
```
If any page returns non-200: **STOP. Fix the URL in the scripts before proceeding.** Prior audit data for that page is invalid.

```bash
node scripts/screenshot.mjs --label baseline --preset responsive  # 14 viewports × 11 pages
npm run audit:responsive -- --json                                # Primary audit (14 viewports)
npm run audit:sweep -- --json                                     # Supplementary: every 50px, 320-1920 (optional if audit:responsive provides sufficient data)
npm run test:responsive                                           # Playwright gate
```

Read key screenshots: index, coleccion, one product page at 360px, 390px, 414px, 768px, 1440px. This is what "correct" looks like. Any change that makes these look different (except the intended fix) is a regression.

Write initial state to `aum-responsive-audit-state.json` in project root.

### Phase 1 — Diagnose

Load `references/captain-diagnose.md`. Follow its instructions:
1. Run metrics (audit:responsive + audit:sweep + test:responsive)
2. Score 5 structural dimensions (0-4 each, total 0-20)
3. Classify root causes with domain, target skill, affected CSS files, severity
4. Present routing plan to user
5. **GATE: User approves routing plan before any fix proceeds**
6. Write diagnosis to state file

### Phase 2 — Fix (one change at a time)

Load `references/captain-fix.md`. Follow its per-fix protocol:
1. Make ONE CSS change (via subagent dispatch to leaf skill)
2. Screenshot ALL 14 viewports immediately
3. Read and compare screenshots at EVERY viewport
4. KEEP if no regressions, REVERT if any regression at any viewport
5. Write fix result to state file
6. Repeat for next root cause

### Phase 3 — Verify

Load `references/captain-verify.md`. Run full verification:
1. Audit sweep + Playwright tests + final screenshots
2. Check 3 hard gates: viewport containment, visual regression, brand coherence
3. Write verdict to state file

### Decision

| Result | Action |
|---|---|
| All gates PASS | ✅ DONE — write final report |
| Any gate FAIL + iteration < 3 | Load `references/iteration-protocol.md` — loop to Phase 1 |
| Any gate FAIL + iteration = 3 | STOP — report failures to user |
| Same failure in consecutive iterations | STOP — stuck, user must decide |
| Cross-domain conflict (layout fix breaks visual) | STOP — report conflict, user decides priority |

---

## Rationalization Table

These are shortcuts you WILL attempt. Each has an explicit counter.

| You Will Think | The Truth |
|---|---|
| "Audit passes, skip visual check" | NO. Audit metrics lie. The v4 failure proved this. Run screenshots. |
| "Audit says HIGH overflow, must be real" | MAYBE NOT. Elements inside `overflow-x: auto/scroll` containers legitimately exceed viewport bounds. Check if the BODY scrolls horizontally — if not, it's a false positive. Also: 1-4px overflow on Windows is typically a scrollbar-width measurement artifact. |
| "Fix works at target viewport, skip others" | NO. v4 broke desktop fixing mobile. Screenshot ALL viewports after EVERY change. |
| "Touch targets are safe in base rules" | NO. `min-height: 44px` in base rules stretches nav/buttons on desktop. ONLY in `@media (pointer: coarse)` or mobile media queries. |
| "I know what the captain would say, skip loading it" | NO. Load the captain file. It contains constraints you will forget under context pressure. |
| "One more fix before verifying, it's small" | NO. One change at a time. Screenshot after EVERY change. Non-negotiable. |
| "The revert restored things, skip re-screenshot" | NO. Verify reverts visually. Files can have merge artifacts. |
| "Context is long, skip iteration" | ONLY if context > 70%. Otherwise follow iteration protocol. |

---

## Context Management

### Subagent Dispatch
Leaf skills are invoked as SUBAGENTS (fresh context). Each subagent prompt must include:
- Root cause ID and description
- CSS files in scope
- aum constraints (spacing, corners, max-width)
- Viewports affected
- "CSS must work at ANY width 320-2560px"

### State File as Memory
`aum-responsive-audit-state.json` carries information between phases. In iteration 2+, read state instead of re-running full diagnosis. Schema: `state/audit-state.schema.json`.

---

## Final Report

```
RESPONSIVE CHECKER REPORT — [date]
====================================
Structural Score: ??/20 (before) → ??/20 (after)
Iterations: [N] of 3 max

Fixes applied: [N]
Fixes reverted (regression): [N]
Skills invoked: [list]

Hard Gates:
  Viewport Containment: ✓/✗
  Visual Regression:    ✓/✗
  Brand Coherence:      ✓/✗

Visual Verification (14 viewports):
  [viewport]: ✓ identical | ✗ [issue]
  ... (all 14)

Playwright Tests: ✓/✗
Verdict: PASS | SHIP_WITH_FIXES | FAIL
====================================
```

---

## Commands Reference

| Command | When |
|---|---|
| `npm run audit:responsive -- --json` | Primary audit (14 viewports) |
| `npm run audit:sweep -- --json` | Full sweep 320-1920px |
| `npm run test:responsive` | Playwright regression gate |
| `node scripts/screenshot.mjs --label NAME --preset responsive` | Screenshot capture |

## Key Files

| File | Purpose |
|---|---|
| `web/scripts/viewports.mjs` | Viewport definitions + presets |
| `web/scripts/responsive-audit.mjs` | Audit script |
| `web/scripts/screenshot.mjs` | Screenshot utility |
| `web/playwright.config.mjs` | Playwright config |
| `brain/visual-identity.md` | Brand design principles (loaded by captains) |

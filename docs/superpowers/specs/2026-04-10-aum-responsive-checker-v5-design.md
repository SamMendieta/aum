# aum-responsive-checker v5 — Design Specification

**Date:** 2026-04-10
**Status:** Draft — pending user review
**Replaces:** aum-responsive-checker v4 (287 lines, flat orchestrator)

---

## 1. Problem Statement

The current v4 skill is a flat orchestrator that routes directly to 6 leaf skills. It works, but has documented failure modes:

1. **Touch-target fixes in base CSS broke desktop layout** (commit `9b19c5c`, reverted in `61ebaf5`). The skill optimized for audit metrics without visual verification across all viewports.
2. **Only 3 breakpoints tested** (375/768/1440px). Real Colombian users are on 360px Samsung S24, 414px iPhone XR, 393px Pixel 7 — widths the skill never checked.
3. **No iteration loop**. If a fix introduces a regression, the skill reports it but doesn't loop back to fix the regression.
4. **No integration with aum brain**. The skill doesn't know about the brand's 96px/64px spacing minimums, 0-2px corner rule, editorial aesthetic, or "mobile ≠ desktop shrunk" principle.
5. **Flat routing to 6 skills**. When expanding to cover all available design/responsive skills (~13), flat dispatch exceeds the attention budget (Liu et al.: ~55% accuracy at position 10 of 20-item list).

## 2. Design Philosophy

### The Viewport Containment Law

> No single element may be taller or wider than the viewport it is viewed on.

This is not a scored dimension. It is a binary hard gate. If any section, hero, image, or card requires scrolling to see the whole element at any tested viewport, the design is broken. The design adapts to the viewport — never the reverse.

### Structural Fixes Over Breakpoint Patches

The goal is CSS that works at ANY width between 320px and 2560px, not CSS that works at specific device sizes. Prefer:
- `clamp()` over fixed px values
- `auto-fit`/`minmax()` over fixed column counts
- `min-height` over `height` for full-viewport sections
- `min-width: 0` on flex/grid children over `overflow: hidden` on parents
- `@media (pointer: coarse)` for touch targets over base-rule `min-height`

A structural fix at one point in the CSS prevents hundreds of future symptoms. A breakpoint patch at one device width creates a new problem at the next.

### Visual Truth Over Metric Truth

Audit metrics lie. A `min-height: 44px` passes touch-target audit but destroys desktop layout. An element inside `overflow: hidden` reports DOM overflow but is visually clipped — not a real issue. Screenshots at all viewports are the only source of truth.

## 3. Architecture

### 3.1 Overview

```
┌──────────────────────────────────────────────────┐
│              aum-responsive-checker v5            │
│                   (orchestrator)                  │
│                                                   │
│  SKILL.md < 500 lines                            │
│  Never touches CSS                                │
│  Routes to 3 captains via reference files         │
│  Owns iteration loop + hard gates                 │
│  State persisted to JSON file                     │
└────────────────────┬─────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
   ┌───────────┐ ┌────────┐ ┌──────────┐
   │ DIAGNOSE  │ │  FIX   │ │  VERIFY  │
   │ (captain) │ │(captain│ │ (captain)│
   │           │ │        │ │          │
   │ 5 skills  │ │7 skills│ │ 4 skills │
   └───────────┘ └────────┘ └──────────┘
```

### 3.2 File Structure

```
aum/.claude/skills/aum-responsive-checker/
├── SKILL.md                              # Orchestrator (< 500 lines)
│
├── references/
│   ├── captain-diagnose.md               # Diagnosis routing (< 150 lines)
│   ├── captain-fix.md                    # Fix routing, 2 sections (< 200 lines)
│   ├── captain-verify.md                 # Verification routing (< 150 lines)
│   ├── viewport-matrix.md               # Device/viewport testing matrix
│   ├── structural-css-patterns.md        # Fluid-first CSS patterns to prefer
│   └── iteration-protocol.md            # Loop rules, exit conditions, stuck detection
│
└── state/
    └── audit-state.schema.json           # JSON schema for shared state file
```

### 3.3 Progressive Disclosure — When to Load Each File

The orchestrator SKILL.md must contain explicit loading triggers:

| File | Load WHEN |
|------|-----------|
| `captain-diagnose.md` | Entering Diagnose phase |
| `captain-fix.md` | Diagnosis complete, score < 18/20, routing plan approved by user |
| `captain-verify.md` | All approved fixes applied, entering verification |
| `viewport-matrix.md` | Setting up Playwright viewports for screenshots or audit |
| `structural-css-patterns.md` | Writing or reviewing a CSS fix (to check preferred patterns) |
| `iteration-protocol.md` | A verification failure triggers re-iteration |

Files NOT listed above are NEVER loaded. Claude must not pre-read captains "just in case."

### 3.4 Captains and Their Leaf Skills

#### Captain: Diagnose (`captain-diagnose.md`)

**Purpose:** Find and score responsive problems using multiple diagnostic frameworks.

| Leaf Skill | Framework | When to Route |
|---|---|---|
| `/audit` | 5-dimension scored audit (responsive, a11y, perf, theming, anti-patterns) | Always — first diagnostic pass, produces the structural score |
| `/design-auditor` | 18-category audit with scoring formula and reference library | When `/audit` finds responsive score < 3/4 or accessibility issues |
| `/critique` | Nielsen heuristics, cognitive load, persona-based testing | When diagnosis needs UX perspective (e.g., "is the mobile CTA findable?") |
| `/web-interface-guidelines` | Vercel UI guidelines (touch-action, safe areas, overflow, a11y) | When checking CSS for modern best practices compliance |
| `/design-system` | Token consistency, responsive behavior dimension, AI slop detection | When tokens may have drifted or responsive behavior degraded |

**Output:** Structural Audit Report (scored 0-20) + root cause classification + routing plan for Fix captain.

#### Captain: Fix (`captain-fix.md`)

**Purpose:** Apply structural CSS fixes, routed by domain. Two sections.

**Section A — Layout & Viewport:**

| Leaf Skill | Domain | When to Route |
|---|---|---|
| `/adapt` | Layout rethink for viewport — breakpoints, container queries, clamp() | Layout doesn't adapt to viewport (fixed grids, rigid columns) |
| `/arrange` | Spacing, visual rhythm, grid patterns | Spacing inconsistent across viewports, visual hierarchy breaks |
| `/normalize` | Align to design tokens — replace hard-coded px with clamp()/tokens | Fixed values that should be fluid, token drift |
| `/harden` | Resilience — text overflow, flex/grid min-width:0, edge cases | Content breaks on extreme inputs, long text, empty states |

**Section B — Visual Quality:**

| Leaf Skill | Domain | When to Route |
|---|---|---|
| `/typeset` | Typography — fluid clamp(), ch units, font tokens | Font sizes don't scale, text containers overflow |
| `/optimize` | Performance — responsive images, srcset, CLS, aspect-ratio | Images unoptimized for viewport, CLS issues |
| `/polish` | Final pass — all breakpoints, touch targets, no h-scroll, WCAG | Final quality sweep after structural fixes are done |

**CSS Scope Rules (CRITICAL — prevents v4 failure repeat):**
- Touch targets → `@media (pointer: coarse)` or mobile media query ONLY. Never base rules.
- Layout shifts → media query for the specific breakpoint.
- `max-width`/`overflow` constraints → safe in base rules (only constrain, never expand).
- If you cannot explain why a change is safe at 1440px desktop, it does not go in a base rule.

**Output:** CSS changes (one at a time) + screenshot proof per change.

#### Captain: Verify (`captain-verify.md`)

**Purpose:** Prove fixes work. Screenshots, regression tests, brand alignment.

| Leaf Skill | What It Verifies | When to Route |
|---|---|---|
| `/aum-design-guardian` | Visual integrity + emotional coherence ("¿Se siente como aum.?") | Always — primary visual gate. Before/after screenshots, design principles audit |
| `/browser-qa` | Smoke test + visual regression + axe-core accessibility | When changes affect interactive elements or accessibility |
| `/e2e-testing` | Playwright regression gate — responsive.test.mjs + visual-regression.test.mjs | Always — hard gate. Tests must pass. |
| `/aum-brand-sync` | Brand token alignment — CSS tokens still match brain/visual-identity.md | After any CSS change that modifies tokens, spacing values, or color references |

**Output:** PASS / FAIL with specific viewport evidence.

### 3.5 State Schema

The shared state file (`aum-responsive-audit-state.json`, created in project root) carries information between phases and iterations. Concrete fields:

```json
{
  "version": "5.0",
  "timestamp": "ISO-8601",
  "iteration": 1,
  "maxIterations": 3,

  "baseline": {
    "screenshotLabel": "baseline",
    "screenshotPreset": "responsive",
    "capturedAt": "ISO-8601"
  },

  "diagnosis": {
    "structuralScore": {
      "globalProtections": 0,
      "fluidSizing": 0,
      "layoutAdaptability": 0,
      "touchInteraction": 0,
      "viewportContainment": 0,
      "total": 0
    },
    "rootCauses": [
      {
        "id": "RC-001",
        "description": "string",
        "domain": "layout | visual",
        "targetSkill": "/skill-name",
        "cssFiles": ["web/src/css/file.css"],
        "severity": "critical | high | medium | low",
        "viewportsAffected": ["iPhone XR", "Galaxy S24"]
      }
    ],
    "routingPlanApproved": false
  },

  "fixes": [
    {
      "rootCauseId": "RC-001",
      "skill": "/adapt",
      "description": "string",
      "cssFile": "web/src/css/file.css",
      "status": "pending | applied | verified | reverted",
      "screenshotLabel": "after-fix-001",
      "regressionDetected": false,
      "revertCommand": "git checkout -- web/src/css/file.css"
    }
  ],

  "verification": {
    "viewportContainment": "pass | fail",
    "visualRegression": "pass | fail",
    "brandCoherence": "pass | fail",
    "playwrightTests": "pass | fail",
    "failedViewports": [],
    "verdict": "PASS | SHIP_WITH_FIXES | FAIL | NEEDS_ITERATION"
  },

  "history": [
    {
      "iteration": 1,
      "diagnosisScore": 12,
      "fixesApplied": 3,
      "fixesReverted": 1,
      "verdict": "NEEDS_ITERATION",
      "regressionDetails": "string"
    }
  ]
}
```

In iteration 2+, read state file instead of re-running full diagnosis. The `history` array tells you what was already tried and failed — don't repeat it.

## 4. The Iteration Loop

### 4.1 Flow

```
PHASE 0: BASELINE
├── Start dev server: npm start (if not running)
├── Capture screenshots: node scripts/screenshot.mjs --label baseline --preset responsive
├── Read key screenshots: index + coleccion + product at 360px, 390px, 414px, 768px, 1440px
├── Run audit sweep: npm run audit:sweep -- --json
├── Run Playwright tests: npm run test:responsive
└── Write initial state to aum-responsive-audit-state.json

PHASE 1: DIAGNOSE
├── Load captain-diagnose.md
├── Run structural audit (5 dimensions, scored 0-20)
├── Classify root causes with domain, target skill, affected CSS files
├── Present routing plan to user
├── GATE: User approves routing plan before any fix
└── Write diagnosis to state file

PHASE 2: FIX (one change at a time)
├── Load captain-fix.md
├── For each approved root cause:
│   ├── Load structural-css-patterns.md (if not loaded)
│   ├── Invoke target leaf skill as SUBAGENT (context fork)
│   │   └── Subagent prompt includes: root cause, CSS files, aum constraints, viewport-matrix
│   ├── Apply ONE CSS change
│   ├── Screenshot ALL viewports: node scripts/screenshot.mjs --label after-fix-NNN --preset responsive
│   ├── Read screenshots at EVERY viewport
│   ├── Compare against baseline:
│   │   ├── Intended fix visible? → Good
│   │   ├── Unintended change at ANY viewport? → REVERT immediately
│   │   ├── Section now taller than viewport? → REVERT immediately
│   │   └── Desktop layout changed? → REVERT immediately
│   ├── Decision: KEEP (update baseline) or REVERT (git checkout, try different approach)
│   └── Write fix result to state file
└── All fixes attempted → proceed to Phase 3

PHASE 3: VERIFY
├── Load captain-verify.md
├── Run full verification suite:
│   ├── npm run audit:sweep -- --json (metric check)
│   ├── npm run test:responsive (Playwright regression gate)
│   ├── node scripts/screenshot.mjs --label final --preset responsive
│   ├── Invoke /aum-design-guardian (visual integrity + emotional coherence)
│   ├── Invoke /browser-qa (smoke + a11y if available)
│   └── Invoke /aum-brand-sync (token alignment)
├── Check hard gates:
│   ├── VIEWPORT CONTAINMENT: Any section exceed viewport at any tested size? → FAIL
│   ├── VISUAL REGRESSION: Unintended changes vs baseline? → FAIL
│   └── BRAND COHERENCE: Does it still feel like aum.? → FAIL
├── Write verification results to state file
└── Decision:
    ├── ALL PASS → ✅ DONE, write final report
    ├── ANY FAIL + iteration < 3 → Load iteration-protocol.md, loop to Phase 1
    └── ANY FAIL + iteration = 3 → STOP, report to user with specific failures
```

### 4.2 Exit Conditions

| Condition | Action |
|---|---|
| All hard gates pass | ✅ DONE — write final report |
| Max iterations reached (3) | STOP — report remaining failures to user |
| Same failure in consecutive iterations | STOP at iteration 2 — approach is wrong, user must decide |
| Fix in one domain creates failure in another | STOP — report the conflict, user decides priority |
| Context window approaching 70% utilization | STOP — recommend splitting into multiple sessions |

### 4.3 Rollback Protocol

Every CSS change must have an explicit revert path:

```bash
# Per-file revert (preferred — surgical)
git checkout -- web/src/css/[file.css]

# Per-fix revert (if multiple files changed)
git stash push -m "revert-fix-NNN" -- web/src/css/[files...]

# Nuclear revert (if state is confused)
git checkout -- web/src/css/
```

After EVERY revert, re-screenshot to confirm the revert restored baseline. Never assume.

## 5. Viewport Testing Matrix

### 5.1 Strategy: Sweep + Device Validation

**Phase 1 — Sweep** (find where layouts structurally break):
```bash
npm run audit:sweep   # Every 50px from 320px to 1920px
```
This finds the content-driven breakpoints — widths where the layout actually fails.

**Phase 2 — Device Validation** (confirm real devices don't fall in gaps):
Test at actual device viewports from Playwright's 143 built-in devices plus custom laptop/desktop viewports.

### 5.2 The `responsive` Preset (new, replaces `breakpoints`)

A new preset covering the most popular real-world viewports, weighted toward Colombia's device market (Android 80.74%, Samsung/Xiaomi/Motorola dominant).

```javascript
// Addition to web/scripts/viewports.mjs
responsive: [
  // ── Mobile: Colombia top 6 (covers 80%+ of Colombian mobile traffic) ──
  'Galaxy S24',            // 360×780  — Samsung S24 base, dominant mid-Android
  'iPhone 14',             // 390×664  — iPhone 14/16 (Colombia #3)
  'iPhone 14 Pro',         // 393×660  — Pixel 7/8 class (Colombia #2, width match)
  'iPhone XR',             // 414×896  — Colombia #1 mobile viewport
  'Galaxy A55',            // 480×1040 — Mid-range Android (huge in Colombia)
  'iPhone 14 Pro Max',     // 430×740  — iPhone Plus/Pro Max

  // ── Tablet ──
  'iPad Mini',             // 768×1024
  'iPad Pro 11',           // 834×1194

  // ── Desktop/Laptop ──
  'Desktop Chrome',        // 1280×720  — Playwright default desktop
  'macbook-air-11',        // 1366×768  — Colombian laptop baseline (custom)
  'macbook-air-13',        // 1440×900  — Standard laptop (custom)
  'windows-laptop-fhd',    // 1920×1080 — Desktop FHD (custom)

  // ── Edge cases ──
  'iPhone SE',             // 320×568  — Smallest active viewport
  'wcag-zoom-200',         // 720×450  — WCAG 200% zoom compliance (custom)
],
```

**14 viewports total.** Covers:
- 6 Colombian mobile priorities (360-480px width range)
- 2 tablets (768-834px)
- 4 desktop/laptop (1280-1920px)
- 2 edge cases (320px minimum, WCAG zoom)

### 5.3 Custom Viewport Additions

Add to `CUSTOM_VIEWPORTS` in `viewports.mjs`:

```javascript
'galaxy-s24-plus': {
  viewport: { width: 384, height: 832 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
},
```

The Galaxy S24+ (384×832) is Colombia's #4 mobile viewport but missing from Playwright. All other Colombian top viewports have Playwright built-in equivalents.

## 6. aum Brain Integration

### 6.1 Design Principles (from brain/visual-identity.md)

The orchestrator must enforce these during the Fix phase. They are loaded on demand (not pre-loaded):

| Principle | Responsive Implication | Enforced How |
|---|---|---|
| White space: 96px desktop / 64px mobile between sections | Spacing must use `clamp(64px, ..., 96px)` — never fixed at one value | captain-fix checks spacing values against this rule |
| One next step per screen — WhatsApp is the CTA | Each viewport must show exactly one clear CTA without scrolling | Viewport containment gate |
| Ingredients are the argument — always visible | INCI + common names cannot be collapsed behind toggles on mobile without clear affordance | captain-diagnose flags hidden ingredients |
| Zero decorative noise | No icons, gradients, pills, shadows > `0 4px 12px rgba(0,0,0,0.06)` | captain-verify brand coherence check |
| Mobile ≠ desktop shrunk — different compositions per breakpoint | Sections must have intentionally different layouts per breakpoint, not just scaled down | captain-diagnose layout adaptability dimension |
| Grid: 12 col, 24px gutter, 80px margins desktop / 24px mobile, 1280px max | Layout must honor these boundaries at every viewport | captain-fix checks grid compliance |
| Corners: 0-2px max | No rounded corners > 2px anywhere | captain-verify brand coherence |
| Hover: 0.7 opacity or accent color, 0.3s ease. No bounce, no scale | Touch devices must not depend on hover for interaction | captain-diagnose touch & interaction dimension |

### 6.2 Loading Strategy

Brain files are NOT loaded into the orchestrator. Instead:
- captain-diagnose knows to check design principles from `brain/visual-identity.md` when scoring
- captain-fix includes aum-specific CSS constraints (spacing clamp values, corner radius limits)
- captain-verify delegates to `/aum-design-guardian` which loads brain files as part of its own workflow

This keeps the orchestrator's context lean while still enforcing brand rules.

## 7. Hard Gates

### 7.1 Viewport Containment Gate (binary)

**Check:** For every tested viewport, does any section's rendered height exceed the viewport height?

```javascript
// Measured via Playwright page.evaluate()
const sections = document.querySelectorAll('section, .hero, .soap-section, [class*="section"]');
const viewportHeight = window.innerHeight;
const violations = [];
for (const el of sections) {
  const rect = el.getBoundingClientRect();
  if (rect.height > viewportHeight) {
    violations.push({
      selector: el.className,
      height: rect.height,
      viewportHeight,
      overflow: rect.height - viewportHeight
    });
  }
}
return violations;
```

**Result:** Empty array = PASS. Any entry = FAIL (with specific section + viewport + overflow amount).

**Exception:** Scrollable content areas (e.g., long ingredient lists inside a product section) are acceptable IF: (1) the scrollable area has a visible scroll affordance (scrollbar or fade indicator), (2) the containing section itself fits within the viewport height, and (3) the user can reach the next section without scrolling past hidden content. This exception does NOT apply to heroes, card grids, or navigation — those must always fit entirely.

### 7.2 Visual Regression Gate (comparison)

**Check:** Compare `final` screenshots against `baseline` screenshots at every viewport.

For each viewport:
1. Read baseline screenshot
2. Read final screenshot
3. Visual comparison: are they identical except for the intended fix?

**Result:** Identical (except intended changes) = PASS. Unintended changes at any viewport = FAIL.

**Additionally:** Run Playwright's `toHaveScreenshot()` for pixel-level regression with `maxDiffPixelRatio: 0.01`.

### 7.3 Brand Coherence Gate (qualitative)

**Check:** Delegated to `/aum-design-guardian` Phase 6 — reads final screenshots and evaluates:
- Does it still feel like aum.?
- Is the editorial aesthetic preserved at every viewport?
- Are spacing minimums (96px/64px) maintained?
- Are corners within 0-2px?
- Is the color system intact (amber + forest bitonal)?

**Result:** Coherent = PASS. Any brand violation = FAIL with specific screenshot + description.

## 8. Rationalization Table

These are documented shortcuts Claude will attempt. Each has an explicit counter.

| Rationalization | Counter |
|---|---|
| "Audit passes, skip visual check" | NO. Audit metrics lie. The v4 failure proved this. Visual screenshots are the ONLY truth. Run them. |
| "Fix works at target viewport, no need to check others" | NO. The v4 failure was exactly this — fix at mobile broke desktop. Screenshot ALL viewports after EVERY change. |
| "Touch targets are safe in base rules" | NO. `min-height: 44px` in base rules stretches nav, buttons, and cards on desktop. Touch targets ONLY in `@media (pointer: coarse)` or mobile media queries. |
| "I already know what the captain would say, skip loading it" | NO. Load the captain file. It contains routing logic and constraints you will forget under context pressure. |
| "One more fix before verifying, it's small" | NO. One change at a time. Screenshot after EVERY change. This is non-negotiable. |
| "The revert restored things, no need to re-screenshot" | NO. Verify the revert visually. Files can have merge artifacts. Never assume. |
| "Context is getting long, skip the iteration and report" | ACCEPTABLE only if context > 70%. Otherwise, follow the iteration protocol. |

## 9. Context Management

### 9.1 Subagent Dispatch for Leaf Skills

Leaf skills are invoked as SUBAGENTS (fresh context), not inline skill invocations. This prevents context bloat across the iteration loop.

Each subagent prompt must include:
```
## Task
[Specific fix or diagnostic to perform]

## Context
- Project: aum. — artisanal botanical soap brand, Eleventy SSG, vanilla CSS
- Working directory: C:\Users\Sam\Documents\Claude\aum\web
- CSS files in scope: [specific files from state]
- Viewports affected: [from state diagnosis]

## Constraints
- Touch targets: mobile media query ONLY, never base rules
- Spacing: clamp(64px, ..., 96px) between sections
- Corners: 0-2px max
- No decorative additions (zero noise principle)
- CSS must work at ANY width 320-2560px, not just tested viewports

## Expected Output
- CSS changes applied to specific files
- Status: DONE | DONE_WITH_CONCERNS | BLOCKED
```

### 9.2 State File as Memory

The state JSON file replaces context-based memory. In iteration 2+:
- Read state file to know what was tried
- Check `history` array for patterns (same failure repeating = stuck)
- Do NOT re-read prior phase outputs from context — they may be compacted

## 10. Viewport Preset Updates to viewports.mjs

### 10.1 New `responsive` Preset

14 devices covering Colombia's device market + edge cases. See Section 5.2 for the full list.

### 10.2 New Custom Viewport

Galaxy S24+ (384×832) — Colombia #4 mobile, missing from Playwright. See Section 5.3.

### 10.3 Existing Presets Unchanged

`quick`, `andrea`, `breakpoints`, `platforms`, `accessibility`, `full` remain as-is. The new `responsive` preset is additive.

## 11. npm Script Updates

```json
{
  "audit:responsive": "node scripts/responsive-audit.mjs --preset responsive",
  "audit:responsive:json": "node scripts/responsive-audit.mjs --preset responsive --json"
}
```

These join the existing `audit`, `audit:sweep`, `audit:andrea`, `audit:platforms` scripts.

## 12. Description (Frontmatter)

The v5 description must NOT summarize workflow (proven anti-pattern: Claude follows description shortcut instead of reading skill body).

**Current v4 description (WRONG — lists dispatched skills):**
> "Structural responsive audit with visual verification — coordinates /audit, /adapt, /harden, /browser-qa, /normalize, /optimize, and /aum-design-guardian."

**v5 description (triggering conditions only):**
> "Use when making any CSS, layout, or template change to the aum. site that could affect responsive behavior. Also use when the user reports a device-specific display issue, says 'doesn't look right on my phone/laptop', 'responsive', 'broken on mobile', 'overflow', or 'doesn't fit'."

## 13. Environment Consistency

### 13.1 Browser

Brave headless via Playwright. Path configured in `playwright.config.mjs`. The existing hardcoded path (`C:\Program Files\BraveSoftware\...`) should be moved to an environment variable for portability:

```javascript
const BRAVE_PATH = process.env.BRAVE_PATH ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
```

### 13.2 Font Loading

Replace blind `waitForTimeout(1500)` with deterministic font-ready wait:

```javascript
await page.waitForFunction(() => document.fonts.ready.then(() => true), { timeout: 5000 });
await page.waitForLoadState('networkidle');
```

### 13.3 Screenshot Stability

- `animations: 'disabled'` in Playwright config (CSS animations cause flaky diffs)
- `maxDiffPixelRatio: 0.01` for `toHaveScreenshot()` comparisons
- Golden images are per-OS (Windows goldens will differ from macOS)

## 14. Final Report Format

```
RESPONSIVE CHECKER REPORT — [date]
====================================
Structural Score: ??/20 (before) → ??/20 (after)
Iterations: [N] of 3 max

Fixes applied: [N]
Fixes reverted (visual regression): [N]
Skills invoked: [list with counts]

Hard Gates:
  Viewport Containment: ✓ PASS | ✗ FAIL — [violations]
  Visual Regression:    ✓ PASS | ✗ FAIL — [viewports]
  Brand Coherence:      ✓ PASS | ✗ FAIL — [issues]

Visual Verification (per viewport):
  iPhone SE (320px):        ✓ identical | ✗ [issue]
  Galaxy S24 (360px):       ✓ identical | ✗ [issue]
  Galaxy S24+ (384px):      ✓ identical | ✗ [issue]
  iPhone 14 (390px):        ✓ identical | ✗ [issue]
  iPhone 14 Pro (393px):    ✓ identical | ✗ [issue]
  iPhone XR (414px):        ✓ identical | ✗ [issue]
  iPhone 14 Pro Max (430px):✓ identical | ✗ [issue]
  Galaxy A55 (480px):       ✓ identical | ✗ [issue]
  WCAG 200% (720px):        ✓ identical | ✗ [issue]
  iPad Mini (768px):        ✓ identical | ✗ [issue]
  iPad Pro 11 (834px):      ✓ identical | ✗ [issue]
  Desktop (1280px):         ✓ identical | ✗ [issue]
  MacBook Air 11 (1366px):  ✓ identical | ✗ [issue]
  MacBook Air 13 (1440px):  ✓ identical | ✗ [issue]
  Windows FHD (1920px):     ✓ identical | ✗ [issue]

Playwright Tests: ✓ all pass | ✗ [failures]

Verdict: PASS | SHIP WITH FIXES | FAIL
====================================
```

## 15. aum-Specific Commands

| Command | When |
|---|---|
| `npm run audit:responsive -- --json` | Primary responsive audit (14 viewports) |
| `npm run audit:sweep -- --json` | Full sweep, every 50px 320-1920px |
| `npm run audit:andrea -- --json` | Founder's devices (iPhone 14, MacBook Air 11/13) |
| `npm run test:responsive` | Playwright regression gate |
| `node scripts/screenshot.mjs --label [name] --preset responsive` | Full screenshot capture at 14 viewports |
| `node scripts/screenshot.mjs --label [name] --preset responsive --pages [pages]` | Scoped capture |

## 16. Key Files

| File | Purpose |
|---|---|
| `web/scripts/viewports.mjs` | Viewport definitions, presets (modify to add `responsive` preset + Galaxy S24+) |
| `web/scripts/responsive-audit.mjs` | Audit script (sweep + targeted modes) |
| `web/scripts/screenshot.mjs` | Screenshot capture utility |
| `web/playwright.config.mjs` | Playwright test runner config |
| `web/tests/responsive.test.mjs` | Responsive regression tests |
| `web/tests/visual-regression.test.mjs` | Golden image comparison tests |
| `brain/visual-identity.md` | Brand design principles (loaded by captains, not orchestrator) |

## 17. Success Criteria

The refactored skill is successful when:

1. **Structural score improvement:** Diagnosis score ≥ 16/20 after fixes
2. **Zero viewport containment violations:** No section exceeds viewport at any of the 14 tested viewports
3. **Zero visual regressions:** No unintended changes at any viewport
4. **Brand coherence preserved:** aum-design-guardian emotional coherence test passes
5. **Playwright tests pass:** responsive.test.mjs and visual-regression.test.mjs green
6. **CSS is structural, not patched:** Fixes use clamp/auto-fit/min-height, not per-device media queries
7. **Iteration loop works:** When a fix causes regression, the skill detects it, reverts, and tries a different approach
8. **Colombian viewport coverage:** All 6 top Colombian mobile viewports tested (360, 384, 390, 393, 414, 480px)

## Appendix A: Research Sources

- Liu et al. (2023) "Lost in the Middle" — attention accuracy degrades at position 10+ of multi-item context
- FollowBench — accuracy drops below 50% with 5+ simultaneous constraints
- Azure Architecture Center — AI agent orchestration patterns (tiered > flat for 10+ capabilities)
- MindStudio — Claude Code skill chaining, state-file orchestration pattern
- DEV Community — Zero overflow responsive testing with Claude Code + Playwright
- StatCounter GlobalStats March 2026 — Colombia device market data
- superpowers:writing-skills — description must not summarize workflow
- skill-creator — progressive disclosure, reference file patterns, eval-driven development
- team-coordinator — quality-gated parallel orchestration, rationalization tables

## Appendix B: Migration from v4

1. Replace SKILL.md content entirely (v4 inline logic → v5 orchestrator routing)
2. Create `references/` directory with 6 captain + reference files
3. Create `state/` directory with JSON schema
4. Add `responsive` preset to `viewports.mjs`
5. Add `galaxy-s24-plus` custom viewport to `viewports.mjs`
6. Add `audit:responsive` npm scripts to `package.json`
7. Update `screenshot.mjs` font-load wait (replace `waitForTimeout` with `document.fonts.ready`)
8. Move Brave path to environment variable in `playwright.config.mjs`
9. Run baseline audit with v5 to establish new scores
10. Delete no files — all existing scripts, tests, and presets remain unchanged

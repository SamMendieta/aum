# aum-responsive-checker v5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the flat aum-responsive-checker v4 into a tiered orchestrator with 3 captains, 13 leaf skills, an iterative diagnose→fix→verify loop, comprehensive Colombian viewport coverage, and aum brain integration.

**Architecture:** Orchestrator SKILL.md (< 500 lines) routes to 3 captain reference files (Diagnose, Fix, Verify). Each captain routes to its leaf skills via clear trigger conditions. State persists to JSON. Iteration loop (max 3) catches cross-viewport regressions. Hard gates enforce viewport containment, visual regression, and brand coherence.

**Tech Stack:** Claude Code skills (SKILL.md + references/), Playwright + Brave headless, Node.js scripts (viewports.mjs, screenshot.mjs, responsive-audit.mjs), Eleventy dev server.

**Spec:** `docs/superpowers/specs/2026-04-10-aum-responsive-checker-v5-design.md`

---

## File Map

### New Files (create)
| File | Responsibility |
|------|----------------|
| `aum/.claude/skills/aum-responsive-checker/references/captain-diagnose.md` | Diagnosis routing — 5 leaf skills, structural audit scoring |
| `aum/.claude/skills/aum-responsive-checker/references/captain-fix.md` | Fix routing — 7 leaf skills in 2 sections (layout + visual) |
| `aum/.claude/skills/aum-responsive-checker/references/captain-verify.md` | Verification routing — 4 leaf skills, hard gate checks |
| `aum/.claude/skills/aum-responsive-checker/references/viewport-matrix.md` | Device/viewport testing matrix with Colombia data |
| `aum/.claude/skills/aum-responsive-checker/references/structural-css-patterns.md` | Fluid-first CSS patterns to prefer over breakpoint patches |
| `aum/.claude/skills/aum-responsive-checker/references/iteration-protocol.md` | Loop rules, exit conditions, stuck detection |
| `aum/.claude/skills/aum-responsive-checker/state/audit-state.schema.json` | JSON schema for shared state file |

### Modified Files
| File | What Changes |
|------|-------------|
| `aum/.claude/skills/aum-responsive-checker/SKILL.md` | Full rewrite — v4 flat orchestrator → v5 tiered orchestrator |
| `web/scripts/viewports.mjs` | Add `galaxy-s24-plus` custom viewport + `responsive` preset |
| `web/scripts/screenshot.mjs:25` | Move Brave path to env var, replace `waitForTimeout` with font-ready wait |
| `web/scripts/responsive-audit.mjs:28` | Move Brave path to env var |
| `web/playwright.config.mjs:5` | Move Brave path to env var, use `responsive` preset |
| `web/package.json:6-19` | Add `audit:responsive` npm scripts |

### Unchanged Files (reference only)
| File | Why Referenced |
|------|---------------|
| `brain/visual-identity.md` | Brand principles loaded by captains on demand |
| `web/tests/responsive.test.mjs` | Existing Playwright tests — not modified, used as hard gate |
| `web/tests/visual-regression.test.mjs` | Existing golden image tests — not modified |

---

## Task 1: Infrastructure — Viewport Matrix & Environment Consistency

**Files:**
- Modify: `web/scripts/viewports.mjs:14-69` (add custom viewport + preset)
- Modify: `web/scripts/screenshot.mjs:25` (env var for Brave path)
- Modify: `web/scripts/screenshot.mjs:96` (font-ready wait)
- Modify: `web/scripts/responsive-audit.mjs:28` (env var for Brave path)
- Modify: `web/playwright.config.mjs:5,8` (env var + preset)
- Modify: `web/package.json:6-19` (npm scripts)

- [ ] **Step 1: Add Galaxy S24+ custom viewport and `responsive` preset to viewports.mjs**

In `web/scripts/viewports.mjs`, add to `CUSTOM_VIEWPORTS` object (after `'ultrawide'` entry, before the closing `};`):

```javascript
  'galaxy-s24-plus': {
    viewport: { width: 384, height: 832 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
```

Then add to `PRESETS` object (after `full` entry, before the closing `};`):

```javascript
  responsive: [
    'Galaxy S24',
    'iPhone 14',
    'iPhone 14 Pro',
    'iPhone XR',
    'Galaxy A55',
    'iPhone 14 Pro Max',
    'iPad Mini',
    'iPad Pro 11',
    'Desktop Chrome',
    'macbook-air-11',
    'macbook-air-13',
    'windows-laptop-fhd',
    'iPhone SE',
    'wcag-zoom-200',
  ],
```

- [ ] **Step 2: Move Brave path to environment variable in screenshot.mjs**

Replace line 25 in `web/scripts/screenshot.mjs`:

```javascript
// Before:
const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

// After:
const BRAVE_PATH = process.env.BRAVE_PATH ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
```

- [ ] **Step 3: Replace waitForTimeout with deterministic font-ready wait in screenshot.mjs**

Replace line 96 in `web/scripts/screenshot.mjs`:

```javascript
// Before:
await page.waitForTimeout(1200);

// After:
await page.waitForFunction(() => document.fonts.ready.then(() => true), { timeout: 5000 });
await page.waitForLoadState('networkidle');
```

- [ ] **Step 4: Move Brave path to environment variable in responsive-audit.mjs**

Replace line 28 in `web/scripts/responsive-audit.mjs`:

```javascript
// Before:
const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

// After:
const BRAVE_PATH = process.env.BRAVE_PATH ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
```

- [ ] **Step 5: Update playwright.config.mjs — env var + responsive preset**

Replace lines 5 and 8 in `web/playwright.config.mjs`:

```javascript
// Before:
const BRAVE_PATH = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
// ...
const deviceList = resolveDevices('breakpoints');

// After:
const BRAVE_PATH = process.env.BRAVE_PATH ||
  'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';
// ...
const deviceList = resolveDevices('responsive');
```

- [ ] **Step 6: Add npm scripts to package.json**

Add these two entries to the `"scripts"` section in `web/package.json` (after `"audit:platforms"`):

```json
"audit:responsive": "node scripts/responsive-audit.mjs --preset responsive",
"audit:responsive:json": "node scripts/responsive-audit.mjs --preset responsive --json",
```

- [ ] **Step 7: Verify infrastructure changes work**

Run each command and confirm no errors:

```bash
cd web
node -e "import('./scripts/viewports.mjs').then(m => console.log('responsive preset:', m.PRESETS.responsive.length, 'devices'))"
```

Expected: `responsive preset: 14 devices`

- [ ] **Step 8: Commit**

```bash
git add web/scripts/viewports.mjs web/scripts/screenshot.mjs web/scripts/responsive-audit.mjs web/playwright.config.mjs web/package.json
git commit -m "$(cat <<'EOF'
feat: add responsive viewport preset and environment consistency

- Add Galaxy S24+ custom viewport (384×832, Colombia #4 mobile)
- Add 'responsive' preset with 14 viewports weighted for Colombia
- Move Brave path to BRAVE_PATH env var across all scripts
- Replace blind waitForTimeout with document.fonts.ready
- Add audit:responsive npm scripts
- Switch Playwright config to responsive preset
EOF
)"
```

---

## Task 2: State Schema

**Files:**
- Create: `aum/.claude/skills/aum-responsive-checker/state/audit-state.schema.json`

- [ ] **Step 1: Create state directory**

```bash
mkdir -p ".claude/skills/aum-responsive-checker/state"
```

- [ ] **Step 2: Write the JSON schema**

Create `aum/.claude/skills/aum-responsive-checker/state/audit-state.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "aum-responsive-audit-state",
  "description": "Shared state between orchestrator phases and iterations",
  "type": "object",
  "required": ["version", "timestamp", "iteration", "maxIterations"],
  "properties": {
    "version": {
      "const": "5.0"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    },
    "iteration": {
      "type": "integer",
      "minimum": 1,
      "maximum": 3
    },
    "maxIterations": {
      "const": 3
    },
    "baseline": {
      "type": "object",
      "required": ["screenshotLabel", "screenshotPreset", "capturedAt"],
      "properties": {
        "screenshotLabel": { "type": "string" },
        "screenshotPreset": { "type": "string" },
        "capturedAt": { "type": "string", "format": "date-time" }
      }
    },
    "diagnosis": {
      "type": "object",
      "properties": {
        "structuralScore": {
          "type": "object",
          "required": ["globalProtections", "fluidSizing", "layoutAdaptability", "touchInteraction", "viewportContainment", "total"],
          "properties": {
            "globalProtections": { "type": "integer", "minimum": 0, "maximum": 4 },
            "fluidSizing": { "type": "integer", "minimum": 0, "maximum": 4 },
            "layoutAdaptability": { "type": "integer", "minimum": 0, "maximum": 4 },
            "touchInteraction": { "type": "integer", "minimum": 0, "maximum": 4 },
            "viewportContainment": { "type": "integer", "minimum": 0, "maximum": 4 },
            "total": { "type": "integer", "minimum": 0, "maximum": 20 }
          }
        },
        "rootCauses": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "description", "domain", "targetSkill", "cssFiles", "severity"],
            "properties": {
              "id": { "type": "string", "pattern": "^RC-[0-9]{3}$" },
              "description": { "type": "string" },
              "domain": { "enum": ["layout", "visual"] },
              "targetSkill": { "type": "string" },
              "cssFiles": { "type": "array", "items": { "type": "string" } },
              "severity": { "enum": ["critical", "high", "medium", "low"] },
              "viewportsAffected": { "type": "array", "items": { "type": "string" } }
            }
          }
        },
        "routingPlanApproved": { "type": "boolean", "default": false }
      }
    },
    "fixes": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["rootCauseId", "skill", "description", "cssFile", "status"],
        "properties": {
          "rootCauseId": { "type": "string" },
          "skill": { "type": "string" },
          "description": { "type": "string" },
          "cssFile": { "type": "string" },
          "status": { "enum": ["pending", "applied", "verified", "reverted"] },
          "screenshotLabel": { "type": "string" },
          "regressionDetected": { "type": "boolean", "default": false },
          "revertCommand": { "type": "string" }
        }
      }
    },
    "verification": {
      "type": "object",
      "properties": {
        "viewportContainment": { "enum": ["pass", "fail"] },
        "visualRegression": { "enum": ["pass", "fail"] },
        "brandCoherence": { "enum": ["pass", "fail"] },
        "playwrightTests": { "enum": ["pass", "fail"] },
        "failedViewports": { "type": "array", "items": { "type": "string" } },
        "verdict": { "enum": ["PASS", "SHIP_WITH_FIXES", "FAIL", "NEEDS_ITERATION"] }
      }
    },
    "history": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["iteration", "diagnosisScore", "fixesApplied", "fixesReverted", "verdict"],
        "properties": {
          "iteration": { "type": "integer" },
          "diagnosisScore": { "type": "integer" },
          "fixesApplied": { "type": "integer" },
          "fixesReverted": { "type": "integer" },
          "verdict": { "type": "string" },
          "regressionDetails": { "type": "string" }
        }
      }
    }
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/aum-responsive-checker/state/audit-state.schema.json
git commit -m "feat: add JSON schema for responsive audit state file"
```

---

## Task 3: Reference — Viewport Matrix

**Files:**
- Create: `aum/.claude/skills/aum-responsive-checker/references/viewport-matrix.md`

- [ ] **Step 1: Create references directory**

```bash
mkdir -p ".claude/skills/aum-responsive-checker/references"
```

- [ ] **Step 2: Write viewport-matrix.md**

Create `aum/.claude/skills/aum-responsive-checker/references/viewport-matrix.md`:

```markdown
# Viewport Testing Matrix

## When to Read This File
Load when setting up Playwright viewports for screenshots or audit runs. Do NOT load during diagnosis or fix phases.

## Strategy: Sweep + Device Validation

1. **Sweep first** — `npm run audit:sweep` scans every 50px from 320-1920px. Finds where layouts structurally break.
2. **Device validation second** — `npm run audit:responsive` confirms real devices don't fall in gaps.

## The `responsive` Preset (14 viewports)

| Priority | Device | Width | Height | Why |
|----------|--------|-------|--------|-----|
| Critical | Galaxy S24 | 360 | 780 | Samsung S24 base — dominant mid-Android in Colombia |
| Critical | galaxy-s24-plus (custom) | 384 | 832 | Samsung S24+ — Colombia #4 mobile |
| Critical | iPhone 14 | 390 | 664 | iPhone 14/16 — Colombia #3 mobile |
| Critical | iPhone 14 Pro | 393 | 660 | Pixel 7/8 width match — Colombia #2 mobile |
| Critical | iPhone XR | 414 | 896 | Colombia #1 mobile viewport (7.38% traffic) |
| Critical | iPhone 14 Pro Max | 430 | 740 | iPhone Plus/Pro Max segment |
| High | Galaxy A55 | 480 | 1040 | Mid-range Android — huge in Colombian market |
| High | iPad Mini | 768 | 1024 | Tablet entry point |
| High | iPad Pro 11 | 834 | 1194 | Tablet flagship |
| High | Desktop Chrome | 1280 | 720 | Playwright default desktop |
| Standard | macbook-air-11 | 1366 | 768 | Colombian laptop baseline (old Lenovo/Dell) |
| Standard | macbook-air-13 | 1440 | 900 | Standard laptop |
| Standard | windows-laptop-fhd | 1920 | 1080 | Desktop FHD |
| Edge | iPhone SE | 320 | 568 | Smallest active viewport |
| Edge | wcag-zoom-200 | 720 | 450 | WCAG 200% zoom compliance |

## Width Bands (for structural CSS)

CSS should work across entire bands, not just at specific device widths:

| Band | Width Range | Key Pattern |
|------|-------------|-------------|
| Ultra-narrow | 320-359px | Single column, stacked everything |
| Small mobile | 360-414px | Primary mobile layout |
| Large mobile | 415-480px | Wider mobile, may fit 2-col elements |
| Small tablet | 481-767px | Transition zone — layouts must reflow |
| Tablet | 768-1023px | 2-column layouts possible |
| Small desktop | 1024-1365px | Full layouts begin |
| Desktop | 1366-1920px | Standard desktop layouts |
| Wide | 1921px+ | Max-width constraint (1280px) centers content |

## Commands

| Command | Viewports | When |
|---------|-----------|------|
| `npm run audit:responsive` | 14 (responsive preset) | Primary audit |
| `npm run audit:sweep` | Every 50px, 320-1920 | Find structural breaks |
| `npm run audit:andrea` | 3 (iPhone 14, MacBook Air 11/13) | Founder device check |
| `node scripts/screenshot.mjs --label NAME --preset responsive` | 14 | Full screenshot capture |
| `node scripts/screenshot.mjs --label NAME --preset responsive --pages PAGE` | 14 × 1 page | Scoped capture |
```

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/aum-responsive-checker/references/viewport-matrix.md
git commit -m "docs: add viewport testing matrix reference for responsive checker"
```

---

## Task 4: Reference — Structural CSS Patterns

**Files:**
- Create: `aum/.claude/skills/aum-responsive-checker/references/structural-css-patterns.md`

- [ ] **Step 1: Write structural-css-patterns.md**

Create `aum/.claude/skills/aum-responsive-checker/references/structural-css-patterns.md`:

```markdown
# Structural CSS Patterns

## When to Read This File
Load when writing or reviewing a CSS fix. Check proposed fixes against these preferred patterns.

## Core Principle
CSS that works at ANY width 320-2560px. Structural fixes prevent future symptoms. Breakpoint patches create new problems at the next device width.

## Prefer → Over

| Prefer | Over | Why |
|--------|------|-----|
| `clamp(min, preferred, max)` | Fixed `px` values | Fluid scaling without breakpoints |
| `auto-fit` / `minmax()` | Fixed column counts `repeat(3, 1fr)` | Grid adapts to available space |
| `min-height: 100svh` | `height: 100svh` | Content can exceed if needed, no clipping |
| `min-width: 0` on flex/grid children | `overflow: hidden` on parents | Fixes shrink bugs without hiding content |
| `@media (pointer: coarse)` for touch | `min-height: 44px` in base rules | Touch targets only where needed — desktop stays clean |
| `gap` | `margin` between siblings | No margin collapse, no cleanup hacks |
| `ch` units for `max-width` on text | Fixed `px` max-width | Scales with font size |
| `svh` (small viewport height) | `vh` | iOS address bar aware |

## aum-Specific CSS Constraints

From `brain/visual-identity.md`:

| Constraint | CSS Pattern |
|------------|-------------|
| Section spacing: 96px desktop / 64px mobile | `gap: clamp(64px, 8vw, 96px)` or `padding: clamp(64px, 8vw, 96px) 0` |
| Grid: 24px gutter, 80px margins desktop / 24px mobile | `padding: 0 clamp(24px, 5vw, 80px)` on `.wrap` |
| Max width: 1280px | `max-width: var(--max-w, 1280px)` on `.wrap` |
| Corners: 0-2px max | `border-radius: 0` or `border-radius: 2px` — nothing higher |
| Hover: 0.7 opacity, 0.3s ease | `transition: opacity 0.3s ease` — no scale, no bounce |
| Shadows: max `0 4px 12px rgba(0,0,0,0.06)` | Never darker or larger |
| Font scale: fluid | `font-size: clamp(min, preferred, max)` — already used throughout |

## CSS Scope Rules (CRITICAL)

These rules prevent the v4 failure where touch-target fixes in base CSS broke desktop:

1. **Touch targets** → `@media (pointer: coarse)` or `@media (max-width: 768px)` ONLY
2. **Layout shifts** → media query for the specific breakpoint where the layout breaks
3. **Constraints** (`max-width`, `overflow`, `box-sizing`) → safe in base rules (they only constrain, never expand)
4. **If you cannot explain why a change is safe at 1440px desktop, it does NOT go in a base rule**

## The 5 Structural Fixes That Cover 90% of Responsive Failures

1. `overflow-x: clip` on `html` — prevent horizontal scroll from any element
2. `word-break: break-word` + `overflow-wrap: break-word` on long text — prevent text overflow
3. `flex-wrap: wrap` on multi-item flex containers — prevent items overflowing narrow viewports
4. `max-width: 100%` on `img, video, canvas, svg` — prevent media exceeding container
5. `min-width: 0` on flex/grid children — allow items to shrink below content size
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/aum-responsive-checker/references/structural-css-patterns.md
git commit -m "docs: add structural CSS patterns reference for responsive checker"
```

---

## Task 5: Reference — Iteration Protocol

**Files:**
- Create: `aum/.claude/skills/aum-responsive-checker/references/iteration-protocol.md`

- [ ] **Step 1: Write iteration-protocol.md**

Create `aum/.claude/skills/aum-responsive-checker/references/iteration-protocol.md`:

```markdown
# Iteration Protocol

## When to Read This File
Load ONLY when a verification failure triggers re-iteration. Do not pre-read.

## Entry Conditions
You are here because Phase 3 (Verify) reported a FAIL on one or more hard gates. Before looping:

1. Read `aum-responsive-audit-state.json` — check `iteration` field
2. Check `history` array — has the same failure appeared before?

## Decision Tree

```
Is iteration >= maxIterations (3)?
├── YES → STOP. Report to user:
│         "Maximum iterations reached. Remaining failures: [list]"
│
└── NO → Check history for repeated failures:
         ├── Same root cause failed in consecutive iterations?
         │   └── YES → STOP. Report to user:
         │             "Stuck on [root cause]. Tried [approaches]. Need different strategy."
         │
         └── NO → Check for cross-domain conflict:
                  ├── Fix in layout domain caused failure in visual domain (or vice versa)?
                  │   └── YES → STOP. Report conflict:
                  │             "[Fix A] in [domain] conflicts with [Fix B] in [domain]. User decides priority."
                  │
                  └── NO → Proceed to next iteration:
                           1. Increment `iteration` in state file
                           2. Add entry to `history` array
                           3. Return to Phase 1 (Diagnose)
                           4. Read state to skip already-resolved root causes
```

## State File Update on Re-Iteration

Before looping back to Phase 1, write to state:

```json
{
  "iteration": 2,
  "history": [
    {
      "iteration": 1,
      "diagnosisScore": 12,
      "fixesApplied": 3,
      "fixesReverted": 1,
      "verdict": "NEEDS_ITERATION",
      "regressionDetails": "Fix RC-002 (/adapt on coleccion.css) passed at 390px but regressed hero height at 1440px"
    }
  ]
}
```

## Rollback Protocol

Every CSS change has a revert path. Use BEFORE re-iterating if the failed fix wasn't already reverted:

```bash
# Surgical per-file revert
git checkout -- web/src/css/[file.css]

# Multi-file revert
git stash push -m "revert-fix-NNN" -- web/src/css/file1.css web/src/css/file2.css

# Nuclear revert (all CSS to baseline)
git checkout -- web/src/css/
```

After EVERY revert: re-screenshot to confirm baseline restored. Never assume.

## Context Budget Check

If context window feels heavy (many tool results, long conversation):
- Check if context > 70% utilized
- If YES: STOP. Report: "Context budget approaching limit. Recommend new session for iteration [N]."
- If NO: proceed normally

## Re-Diagnosis in Iteration 2+

Do NOT re-run full diagnosis. Instead:
1. Read state file `diagnosis.rootCauses` — filter to unresolved causes
2. Read `history` — skip approaches already tried
3. Re-score only the dimensions that failed in verification
4. Update state with refined root causes
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/aum-responsive-checker/references/iteration-protocol.md
git commit -m "docs: add iteration protocol reference for responsive checker"
```

---

## Task 6: Captain — Diagnose

**Files:**
- Create: `aum/.claude/skills/aum-responsive-checker/references/captain-diagnose.md`

- [ ] **Step 1: Write captain-diagnose.md**

Create `aum/.claude/skills/aum-responsive-checker/references/captain-diagnose.md`:

```markdown
# Captain: Diagnose

## Purpose
Find and score responsive problems using multiple diagnostic frameworks. Produce a structural audit report and root cause classification.

## Step 1: Run Metrics

```bash
cd web
npm run audit:responsive -- --json     # 14 viewport targeted audit
npm run audit:sweep -- --json          # Sweep every 50px 320-1920
npm run test:responsive                # Playwright regression gate
```

## Step 2: Structural Audit (5 dimensions, scored 0-4 each)

### Dimension 1: Global Protections

Does `base.css` prevent common responsive failures?

Check for: `max-width: 100%` on img/video/canvas, `min-width: 0` on flex/grid children, `overflow-x: clip` on html, `box-sizing: border-box` on *, `touch-action: manipulation`.

| Score | Meaning |
|---|---|
| 0 | No reset — raw browser defaults |
| 1 | Basic box-sizing only |
| 2 | Box-sizing + img max-width, missing flex/grid protection |
| 3 | Most protections, minor gaps |
| 4 | Complete |

### Dimension 2: Fluid Sizing

How much CSS uses fluid values vs fixed?

Count `width: Npx` and `font-size: Npx` (fixed, bad) vs `clamp(`, `min(`, `max(` (fluid, good).

| Score | Meaning |
|---|---|
| 0 | All fixed px, no fluid |
| 1 | Few clamp(), mostly fixed |
| 2 | Mixed |
| 3 | Mostly fluid |
| 4 | Fluid-first |

### Dimension 3: Layout Adaptability

Do layouts adapt intrinsically or require breakpoint patches?

Count `auto-fit`/`auto-fill`/`minmax(` (intrinsic, good) vs `repeat(N,` fixed columns and `height: 100svh` (rigid, risky).

| Score | Meaning |
|---|---|
| 0 | Fixed grids, no media queries |
| 1 | Fixed grids + some media queries |
| 2 | Mix of auto-fit/fixed |
| 3 | Mostly intrinsic |
| 4 | Intrinsic-first |

### Dimension 4: Touch & Interaction

Are touch targets properly sized on mobile WITHOUT affecting desktop?

Check: touch targets inside `@media (pointer: coarse)` or mobile media queries (correct) vs touch targets in base rules (WRONG — breaks desktop).

| Score | Meaning |
|---|---|
| 0 | No touch target handling |
| 1 | Touch targets in base rules (breaks desktop) |
| 2 | Touch targets in media queries, incomplete |
| 3 | Good coverage, minor gaps |
| 4 | All interactive elements ≥44px on touch via scoped queries |

### Dimension 5: Viewport Containment

Does any section exceed viewport height at any tested viewport?

Use Playwright `page.evaluate()` to measure every `section`, `.hero`, `.soap-section`, `[class*="section"]` against `window.innerHeight` at each viewport in the responsive preset.

| Score | Meaning |
|---|---|
| 0 | Multiple sections exceed viewport |
| 1 | Some exceed on mobile, ok desktop |
| 2 | Most fit, 1-2 edge cases |
| 3 | All fit except at 320px |
| 4 | Every section fits at every viewport |

## Step 3: Root Cause Classification

For each issue, determine the ROOT CAUSE (not the symptom) and classify:

| Root Cause Pattern | Domain | Target Skill |
|---|---|---|
| Missing global CSS protections | layout | Fix directly in base.css (safe structural additions) |
| Fixed values that should be fluid | layout | `/normalize` |
| Layout doesn't adapt to viewport | layout | `/adapt` |
| Spacing breaks visual rhythm | layout | `/arrange` |
| Edge cases break on extreme inputs | layout | `/harden` |
| Font sizes don't scale | visual | `/typeset` |
| Images unoptimized for viewport | visual | `/optimize` |
| Final quality pass needed | visual | `/polish` |
| Touch targets too small on mobile | layout | Fix directly — `@media (pointer: coarse)` ONLY |
| Design doesn't feel right on mobile | visual | `/aum-design-guardian` (via Verify captain) |

## Step 4: Routing Plan

Present this table to the user BEFORE proceeding to Fix captain:

```
ROOT CAUSE ROUTING PLAN
================================
| # | Root Cause | Domain | Skill | CSS File(s) | Severity |
|---|---|---|---|---|---|
| RC-001 | [desc] | layout | /adapt | [file] | critical |
| RC-002 | [desc] | visual | /typeset | [file] | high |
================================
Proceed? [y / adjust]
```

Do NOT invoke any fix skill until the user approves.

## Leaf Skill Routing (when to escalate beyond basic audit)

| Condition | Invoke |
|---|---|
| Always — first pass | `/audit` |
| Responsive score < 3/4 or accessibility issues found | `/design-auditor` |
| Need UX perspective (mobile CTA findability, cognitive load) | `/critique` |
| Checking CSS for modern best practices | `/web-interface-guidelines` |
| Tokens may have drifted, responsive behavior degraded | `/design-system` |
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/aum-responsive-checker/references/captain-diagnose.md
git commit -m "docs: add diagnose captain reference for responsive checker"
```

---

## Task 7: Captain — Fix

**Files:**
- Create: `aum/.claude/skills/aum-responsive-checker/references/captain-fix.md`

- [ ] **Step 1: Write captain-fix.md**

Create `aum/.claude/skills/aum-responsive-checker/references/captain-fix.md`:

```markdown
# Captain: Fix

## Purpose
Apply structural CSS fixes, one at a time, routed by domain. Every change gets screenshot verification at ALL viewports immediately.

## Before Any Fix
1. Read `references/structural-css-patterns.md` for preferred CSS patterns
2. Read state file `diagnosis.rootCauses` for the approved routing plan
3. Confirm you are working on the NEXT unresolved root cause (in order of severity)

## CSS Scope Rules (CRITICAL — prevents v4 failure repeat)

These are NON-NEGOTIABLE:

1. **Touch targets** → `@media (pointer: coarse)` or `@media (max-width: 768px)` ONLY. NEVER in base rules.
2. **Layout shifts** → media query for the specific breakpoint.
3. **Constraints** (`max-width`, `overflow`, `box-sizing`) → safe in base rules.
4. **Test:** If you cannot explain why a change is safe at 1440px desktop, it does NOT go in a base rule.

## Section A: Layout & Viewport Fixes

| Root Cause | Leaf Skill | What It Does |
|---|---|---|
| Layout doesn't adapt to viewport | `/adapt` | Rethink layout for context — breakpoints, container queries, clamp() |
| Spacing inconsistent across viewports | `/arrange` | Fix spacing rhythm, grid patterns, visual hierarchy |
| Fixed values that should be fluid | `/normalize` | Replace hard-coded px with design tokens and clamp() |
| Content breaks on extreme inputs | `/harden` | Text overflow, flex/grid min-width:0, word-break, edge cases |
| Missing global protections | Fix directly | Safe additions to base.css: img max-width, flex min-width, overflow-x |
| Touch targets too small on mobile | Fix directly | ONLY inside `@media (pointer: coarse)` or mobile media query |

## Section B: Visual Quality Fixes

| Root Cause | Leaf Skill | What It Does |
|---|---|---|
| Font sizes don't scale | `/typeset` | Fluid clamp(), ch units, font tokens |
| Images unoptimized for viewport | `/optimize` | Responsive images, srcset, CLS, aspect-ratio |
| Final quality pass needed | `/polish` | All breakpoints, touch targets, no h-scroll, WCAG |

## Per-Fix Protocol (ONE change at a time)

```
1. MAKE one CSS change
   └── Invoke leaf skill as SUBAGENT with this context:
       - Root cause ID and description (from state)
       - CSS files in scope (from state)
       - aum constraints: spacing clamp(64px,8vw,96px), corners 0-2px, max-width 1280px
       - Viewports affected (from state)
       - "CSS must work at ANY width 320-2560px"

2. SCREENSHOT all viewports
   └── node scripts/screenshot.mjs --label after-fix-NNN --preset responsive

3. READ screenshots at EVERY viewport
   └── Compare against baseline. For EACH viewport:
       - Intended fix visible? → Good
       - Unintended change? → REVERT
       - Section taller than viewport? → REVERT
       - Desktop layout changed? → REVERT

4. DECIDE
   ├── Fix works + no regressions → KEEP
   │   └── Update baseline: node scripts/screenshot.mjs --label baseline --preset responsive
   │
   └── Any regression at ANY viewport → REVERT
       └── git checkout -- web/src/css/[file.css]
       └── Re-screenshot to confirm revert
       └── Try different approach for same root cause
       └── If 2 approaches fail for same cause → mark as BLOCKED in state, move to next

5. UPDATE state file
   └── Write fix result: status, screenshotLabel, regressionDetected, revertCommand
```

## Subagent Prompt Template

When dispatching a leaf skill as a subagent:

```
You are a [skill-name] specialist.

## Task
Fix this responsive issue: [root cause description]

## Context
- Project: aum. — artisanal botanical soap brand, Eleventy SSG, vanilla CSS
- Working directory: C:\Users\Sam\Documents\Claude\aum\web
- CSS file to modify: [specific file from state]
- Viewports affected: [list from state]

## Constraints
- Touch targets: @media (pointer: coarse) or mobile media query ONLY
- Spacing between sections: clamp(64px, 8vw, 96px)
- Corners: 0-2px max
- No decorative additions (zero noise principle)
- CSS must work at ANY width 320-2560px, not just tested viewports
- Prefer clamp() over fixed px, auto-fit over fixed columns, min-height over height

## Expected Output
- Specific CSS changes to apply (show exact before/after)
- Status: DONE | DONE_WITH_CONCERNS | BLOCKED
```
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/aum-responsive-checker/references/captain-fix.md
git commit -m "docs: add fix captain reference for responsive checker"
```

---

## Task 8: Captain — Verify

**Files:**
- Create: `aum/.claude/skills/aum-responsive-checker/references/captain-verify.md`

- [ ] **Step 1: Write captain-verify.md**

Create `aum/.claude/skills/aum-responsive-checker/references/captain-verify.md`:

```markdown
# Captain: Verify

## Purpose
Prove fixes work. Run screenshots, regression tests, and brand alignment checks. Apply hard gates.

## Verification Suite

Run ALL of these:

```bash
cd web
npm run audit:responsive -- --json     # Metric check at 14 viewports
npm run audit:sweep -- --json          # Full sweep 320-1920px
npm run test:responsive                # Playwright regression gate
node scripts/screenshot.mjs --label final --preset responsive   # Visual proof
```

Then invoke leaf skills:

| Skill | What It Checks | When |
|---|---|---|
| `/aum-design-guardian` | Visual integrity + emotional coherence + design principles | Always |
| `/browser-qa` | Smoke test + interaction test + axe-core accessibility | When changes affect interactive elements |
| `/e2e-testing` | Playwright test infrastructure (responsive.test.mjs + visual-regression.test.mjs) | Always — tests must pass |
| `/aum-brand-sync` | CSS tokens still match brain/visual-identity.md | After any CSS change that modifies tokens, spacing values, or colors |

## Hard Gate 1: Viewport Containment (binary)

For every viewport in the responsive preset, run this via Playwright:

```javascript
const violations = await page.evaluate(() => {
  const sections = document.querySelectorAll('section, .hero, .soap-section, [class*="section"]');
  const vh = window.innerHeight;
  const results = [];
  for (const el of sections) {
    const rect = el.getBoundingClientRect();
    if (rect.height > vh) {
      results.push({
        selector: el.className || el.tagName,
        height: Math.round(rect.height),
        viewportHeight: vh,
        overflow: Math.round(rect.height - vh)
      });
    }
  }
  return results;
});
```

**PASS:** Empty array at ALL viewports.
**FAIL:** Any entry at ANY viewport. Report: section, viewport, overflow amount.

**Exception:** Scrollable content areas inside a product section are acceptable IF:
1. Scrollable area has visible scroll affordance
2. Containing section fits within viewport
3. User can reach next section without scrolling past hidden content
This exception does NOT apply to heroes, card grids, or navigation.

## Hard Gate 2: Visual Regression (comparison)

Compare `final` screenshots against `baseline` screenshots at EVERY viewport.

For each viewport:
1. Read baseline screenshot (from Phase 0)
2. Read final screenshot (just captured)
3. Are they identical except for intended fixes?

**PASS:** Identical (except intended changes) at all viewports.
**FAIL:** Unintended visual change at ANY viewport. Report which viewport and what changed.

Also run: `npm run test:visual` for pixel-level `toHaveScreenshot()` with `maxDiffPixelRatio: 0.01`.

## Hard Gate 3: Brand Coherence (qualitative)

Delegate to `/aum-design-guardian` which evaluates:
- Does it still feel like aum.?
- Editorial aesthetic preserved at every viewport?
- Spacing minimums (96px desktop / 64px mobile) maintained?
- Corners within 0-2px?
- Color system intact (amber + forest bitonal)?

**PASS:** Guardian confirms coherence.
**FAIL:** Any brand violation. Report screenshot + specific issue.

## Verdict

| Result | Verdict |
|---|---|
| All 3 gates PASS + Playwright tests PASS | **PASS** |
| Gates PASS but minor audit findings remain | **SHIP_WITH_FIXES** — note remaining items |
| Any gate FAIL + iteration < 3 | **NEEDS_ITERATION** — load iteration-protocol.md |
| Any gate FAIL + iteration = 3 | **FAIL** — report to user with specific failures |

## State Update

Write verification results to state file:

```json
{
  "verification": {
    "viewportContainment": "pass",
    "visualRegression": "pass",
    "brandCoherence": "pass",
    "playwrightTests": "pass",
    "failedViewports": [],
    "verdict": "PASS"
  }
}
```

If verdict is NEEDS_ITERATION, also update `history` array with this iteration's results before looping.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/aum-responsive-checker/references/captain-verify.md
git commit -m "docs: add verify captain reference for responsive checker"
```

---

## Task 9: Orchestrator — SKILL.md Rewrite

**Files:**
- Modify: `aum/.claude/skills/aum-responsive-checker/SKILL.md` (full rewrite, 287 → ~450 lines)

This is the core task. The SKILL.md is the orchestrator brain — it routes to captains, enforces hard gates, owns the iteration loop, and contains the rationalization table.

- [ ] **Step 1: Write the new SKILL.md**

Replace the entire content of `aum/.claude/skills/aum-responsive-checker/SKILL.md` with:

```markdown
---
name: aum-responsive-checker
description: Use when making any CSS, layout, or template change to the aum. site that could affect responsive behavior. Also use when the user reports a device-specific display issue, says 'doesn't look right on my phone/laptop', 'responsive', 'broken on mobile', 'overflow', or 'doesn't fit'.
---

# aum. Responsive Checker v5

Tiered orchestrator for responsive design on the aum. website. Diagnoses structural CSS problems, dispatches specialized skills to fix them, and visually verifies every change across 14 viewports weighted for the Colombian market.

**This skill NEVER touches CSS itself.** It diagnoses, routes to captains, and verifies. All CSS changes happen through leaf skills dispatched as subagents.

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
node scripts/screenshot.mjs --label baseline --preset responsive  # 14 viewports × 11 pages
npm run audit:sweep -- --json                                     # Every 50px, 320-1920
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
```

- [ ] **Step 2: Verify line count is under 500**

```bash
wc -l .claude/skills/aum-responsive-checker/SKILL.md
```

Expected: ~200-250 lines (well under 500).

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/aum-responsive-checker/SKILL.md
git commit -m "$(cat <<'EOF'
feat: rewrite aum-responsive-checker as tiered v5 orchestrator

- 3 captain reference files (diagnose, fix, verify)
- 13 leaf skills routed by domain
- Iterative diagnose→fix→verify loop (max 3 iterations)
- Hard gates: viewport containment, visual regression, brand coherence
- Rationalization table defending against 7 documented shortcuts
- Subagent dispatch for leaf skills (context fork)
- State file (JSON) for cross-phase persistence
- Description stripped to triggering conditions only
EOF
)"
```

---

## Task 10: Integration Verification

**Files:**
- No new files. Verify all pieces work together.

- [ ] **Step 1: Verify file structure**

```bash
find .claude/skills/aum-responsive-checker -type f | sort
```

Expected output:
```
.claude/skills/aum-responsive-checker/SKILL.md
.claude/skills/aum-responsive-checker/references/captain-diagnose.md
.claude/skills/aum-responsive-checker/references/captain-fix.md
.claude/skills/aum-responsive-checker/references/captain-verify.md
.claude/skills/aum-responsive-checker/references/iteration-protocol.md
.claude/skills/aum-responsive-checker/references/structural-css-patterns.md
.claude/skills/aum-responsive-checker/references/viewport-matrix.md
.claude/skills/aum-responsive-checker/state/audit-state.schema.json
```

- [ ] **Step 2: Verify SKILL.md frontmatter is valid**

Check that:
- `name: aum-responsive-checker` (exact match)
- `description:` does NOT mention any skill names (no `/audit`, `/adapt`, etc.)
- Total frontmatter < 1024 characters

- [ ] **Step 3: Verify responsive preset resolves**

```bash
cd web && node -e "import('./scripts/viewports.mjs').then(m => { const d = m.resolveDevices('responsive'); console.log(d.length, 'devices:'); d.forEach(([n,v]) => console.log('  ' + n + ' → ' + v.viewport.width + 'x' + v.viewport.height)) })"
```

Expected: 14 devices listed with correct viewport dimensions.

- [ ] **Step 4: Verify audit:responsive runs**

```bash
cd web && npm run audit:responsive -- --pages index --json 2>&1 | head -20
```

Expected: Audit output targeting 14 viewports for the index page. No errors.

- [ ] **Step 5: Verify screenshots with responsive preset**

```bash
cd web && node scripts/screenshot.mjs --label test-v5 --preset responsive --pages index
```

Expected: 14 screenshots of index page saved to `.screenshots/test-v5/`. No errors.

- [ ] **Step 6: Clean up test artifacts**

```bash
rm -rf web/.screenshots/test-v5
```

- [ ] **Step 7: Final commit — all pieces together**

```bash
git add -A
git status
```

If any uncommitted files remain, commit:

```bash
git commit -m "chore: integration verification for responsive checker v5"
```

---

## Self-Review Checklist

### Spec Coverage
| Spec Section | Task |
|---|---|
| §1 Problem Statement | Addressed by full v5 rewrite (Task 9) |
| §2 Design Philosophy | Embedded in SKILL.md hard gates + captain-fix patterns |
| §3 Architecture (3.1-3.5) | Tasks 2-9 create all files described |
| §4 Iteration Loop | Task 5 (iteration-protocol.md) + Task 9 (SKILL.md workflow) |
| §5 Viewport Matrix | Task 1 (viewports.mjs) + Task 3 (viewport-matrix.md) |
| §6 aum Brain Integration | Task 4 (structural-css-patterns.md aum constraints) + Task 7 (subagent prompt template) |
| §7 Hard Gates | Task 8 (captain-verify.md) + Task 9 (SKILL.md hard gates) |
| §8 Rationalization Table | Task 9 (SKILL.md rationalization table) |
| §9 Context Management | Task 9 (SKILL.md subagent dispatch section) |
| §10 Viewport Preset Updates | Task 1 (viewports.mjs) |
| §11 npm Script Updates | Task 1 (package.json) |
| §12 Description | Task 9 (SKILL.md frontmatter) |
| §13 Environment Consistency | Task 1 (env var, font-ready wait) |
| §14 Final Report Format | Task 9 (SKILL.md final report section) |
| §17 Success Criteria | Task 10 (integration verification) |
| Appendix B Migration | Tasks 1-10 follow the 10-step migration path |

### Placeholder Scan
- No "TBD", "TODO", or "implement later" in any task ✓
- All code blocks contain complete code ✓
- All commands include expected output ✓
- No "similar to Task N" references ✓

### Type/Name Consistency
- `responsive` preset name used consistently across viewports.mjs, SKILL.md, captains, viewport-matrix.md ✓
- `aum-responsive-audit-state.json` state file name used consistently across SKILL.md, schema, captains ✓
- `BRAVE_PATH` env var name used consistently across screenshot.mjs, responsive-audit.mjs, playwright.config.mjs ✓
- Root cause IDs use `RC-NNN` format consistently across state schema and captain-diagnose ✓
- Leaf skill names match exact slash command names throughout ✓

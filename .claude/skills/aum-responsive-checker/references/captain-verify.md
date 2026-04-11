# Captain: Verify

## Purpose
Prove fixes work. Run screenshots, regression tests, and brand alignment checks. Apply hard gates.

---

## Verification Suite

Run all four commands before evaluating any gate:

```bash
npm run audit:responsive -- --json
npm run audit:sweep -- --json
npm run test:responsive
node scripts/screenshot.mjs --label final --preset responsive
```

Then invoke leaf skills **based on fix scope** (not all of them every time):

| Leaf Skill | Evaluates | When to Invoke |
|------------|-----------|----------------|
| `/aum-design-guardian` | Visual integrity + emotional coherence | Only when structural layout, color, or spacing changes were made. Skip for touch targets, min-width, or overflow-wrap fixes. |
| `/browser-qa` | Smoke tests + interaction + axe-core accessibility | Only when interactive elements or navigation changed |
| `/e2e-testing` | Playwright full-page gate | Only when layout or content structure changed. `npm run test:responsive` already covers responsive gates. |
| `/aum-brand-sync` | Token alignment across CSS files | Only after token, spacing, or color changes |

**Lightweight verification** (for simple fixes like touch targets, min-width, overflow-wrap): Screenshots + Playwright pass is sufficient. Don't invoke leaf skills for 1-2 line scoped CSS additions.

---

## Hard Gate 1: Viewport Containment

Run via Playwright `page.evaluate()` at every viewport in the test matrix.

```js
const violations = await page.evaluate(() => {
  const selectors = [
    'section',
    '.hero',
    '.soap-section',
    '[class*="section"]'
  ]
  const elements = selectors.flatMap(s => [...document.querySelectorAll(s)])
  return elements
    .map(el => ({
      selector: el.className || el.tagName,
      height: el.getBoundingClientRect().height,
      viewportHeight: window.innerHeight,
      exceeds: el.getBoundingClientRect().height > window.innerHeight
    }))
    .filter(r => r.exceeds)
})
```

- **PASS:** `violations` array is empty at all viewports
- **FAIL:** Any entry in `violations` at any viewport

**Exception for scrollable content areas** — a section may exceed `window.innerHeight` only if all three conditions are met:
1. It has `overflow-y: auto` or `overflow-y: scroll`
2. The design intent is explicitly a scrollable panel (not a full-bleed hero)
3. The section was already exceeding viewport height before any fix in this session

---

## Hard Gate 2: Visual Regression

Compare `final` screenshots against `baseline` screenshots at every viewport in the test matrix.

- **PASS:** Screenshots are identical except for the intended change
- **FAIL:** Any unintended visual change detected at any viewport

Also run:

```bash
npm run test:visual
```

Visual regression test must pass with `maxDiffPixelRatio: 0.01`. Any diff above 1% is a FAIL unless the diff corresponds directly to the approved fix.

---

## Hard Gate 3: Brand Coherence

Delegate to `/aum-design-guardian`. The guardian must evaluate:

- Does the site still feel like aum.?
- Is the editorial aesthetic preserved (Instrument Serif, amber/forest palette, generous whitespace)?
- Is spacing consistent with the system — section padding ~96px desktop, ~64px mobile?
- Are corners 0–2px maximum — no large rounded cards or buttons?
- Is the color system intact — amber + forest, no new accent colors introduced?

**PASS:** Guardian confirms all five criteria.
**FAIL:** Any criterion flagged as changed or degraded.

---

## Verdict

| Outcome | Conditions | Next Step |
|---------|-----------|-----------|
| **PASS** | All gates PASS + Playwright PASS | Mark session complete. Commit and push. |
| **SHIP_WITH_FIXES** | All gates PASS with minor guardian findings | Document findings. Founders approve. Commit. |
| **NEEDS_ITERATION** | Any gate FAIL and iteration count < 3 | Return to Fix captain. Address failing root cause. Re-run Verify. |
| **FAIL** | Any gate FAIL and iteration count = 3 | Stop. Report blockers. Do not commit. Escalate to founder review. |

---

## State Update

Write verification results to the session state file before reporting verdict:

```json
{
  "verification": {
    "iteration": 1,
    "auditResponsive": "PASS | FAIL",
    "auditSweep": "PASS | FAIL",
    "testResponsive": "PASS | FAIL",
    "screenshotLabel": "final",
    "gate1ViewportContainment": "PASS | FAIL",
    "gate2VisualRegression": "PASS | FAIL",
    "gate3BrandCoherence": "PASS | FAIL",
    "playwrightE2E": "PASS | FAIL",
    "verdict": "PASS | SHIP_WITH_FIXES | NEEDS_ITERATION | FAIL",
    "notes": ""
  }
}
```

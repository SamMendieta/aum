# Captain: Fix

## Purpose
Apply structural CSS fixes, one at a time, routed by domain. Every change gets screenshot verification at ALL viewports immediately.

## Before Any Fix
1. Read `references/structural-css-patterns.md` for preferred CSS patterns
2. Read state file `diagnosis.rootCauses` for the approved routing plan
3. Confirm you are working on the NEXT unresolved root cause (in order of severity)

---

## CSS Scope Rules (CRITICAL)

These rules are non-negotiable. Violating any one of them requires an immediate revert.

1. **Touch targets go ONLY inside `@media (pointer: coarse)` or `@media (max-width: 768px)`.** Never in base rules.
2. **Layout shifts belong inside the specific breakpoint query** where the shift occurs — not globally.
3. **Constraints that are safe at every width** (e.g. `max-width: 100%`, `box-sizing`) are safe in base rules.
4. **If you cannot explain why a rule is safe at 1440px desktop, it does not go in a base rule.**

---

## Section A — Layout & Viewport

| Root Cause | Route To |
|------------|----------|
| Layout doesn't adapt across viewports | `/adapt` |
| Spacing breaks at certain sizes | `/arrange` |
| Fixed values (`px` widths/fonts blocking reflow) | `/normalize` |
| Edge cases (320px, 2560px, unusual aspect ratio) | `/harden` |
| Missing global protections | Fix directly in `base.css` |
| Touch targets in base rules | Fix directly — move to `@media (pointer: coarse)` ONLY |

---

## Section B — Visual Quality

| Root Cause | Route To |
|------------|----------|
| Font sizes feel wrong or overflow | `/typeset` |
| Images overflow or distort | `/optimize` |
| Final visual quality / polish needed | `/polish` |

---

## Per-Fix Protocol

Follow these 5 steps for every single fix. No exceptions.

1. **MAKE** one change — invoke the appropriate leaf skill as a SUBAGENT with the prompt template below.

2. **SCREENSHOT** all viewports immediately after the change:
   ```bash
   node scripts/screenshot.mjs --label after-fix-NNN --preset responsive
   ```

3. **READ** screenshots at EVERY viewport. For each screenshot, verify:
   - Is the intended fix visible?
   - Is there any unintended change elsewhere?
   - Does any section exceed viewport height?
   - Did the desktop layout change?

4. **DECIDE:**
   - All good → keep change, update baseline screenshots
   - Any regression detected → REVERT immediately:
     ```bash
     git checkout -- <affected-file>
     ```
     Re-screenshot to confirm revert. Try a different approach. If 2 approaches both fail → mark root cause as **BLOCKED**.

5. **UPDATE** state file with fix result, screenshot label, and status (FIXED | BLOCKED | SKIPPED).

---

## Subagent Prompt Template

Use this template verbatim when dispatching a leaf skill as a subagent.

```
You are a [LEAF_SKILL_NAME] agent.

## Task
Apply one targeted CSS fix for the following root cause:
[ROOT_CAUSE_DESCRIPTION]

## Context
- Project: aum. — artisanal botanical soap brand, Eleventy SSG, vanilla CSS
- Working directory: C:\Users\Sam\Documents\Claude\aum\web
- CSS file to edit: [TARGET_CSS_FILE]
- Viewports to keep working: 320px, 375px, 390px, 428px, 768px, 1024px, 1280px, 1440px, 2560px

## Constraints
- Touch targets: mobile/coarse ONLY — never in base rules
- Spacing values: prefer `clamp(64px, 8vw, 96px)` pattern over fixed `px`
- Border radius: 0–2px maximum — no large rounded corners
- No decorative additions — fix only, do not redesign
- Every CSS rule must be valid at any width from 320px to 2560px
- Prefer `clamp()` over hard `px` values for any dimension that scales with viewport

## Expected Output
- The exact CSS changes made (file path + diff)
- Status: DONE | DONE_WITH_CONCERNS | BLOCKED
```

# Iteration Protocol

## When to Read This File
Load ONLY when a verification failure triggers re-iteration. Do not pre-read.

## Entry Conditions
You are here because Phase 3 (Verify) reported a FAIL on one or more hard gates. Before looping:

1. Read `aum-responsive-audit-state.json` — check `iteration` field
2. Check `history` array — has the same failure appeared before?

## Decision Tree

```
Is iteration >= 3?
  YES → STOP. Report to user: "Max iterations reached. Manual intervention required."
        List all unresolved rootCauses with their IDs and severity.
  NO  → Check history: does the same failure appear in the previous entry?
          YES (same cause, consecutive iterations) → STOP.
                Report to user: "Stuck on [rootCauseId]. Same failure in iterations N and N+1.
                Likely a cross-domain conflict or requires manual CSS authorship."
          NO  → Check for cross-domain conflict:
                  Did a layout fix cause a visual regression, or vice versa?
                  YES → STOP. Report conflict to user:
                        "Fix for [RC-XXX] resolved layout but introduced visual regression at [viewport].
                        These goals are in conflict. Please review and decide priority."
                  NO  → Proceed with next iteration:
                          1. Increment `iteration` field in state file
                          2. Append entry to `history` array
                          3. Return to Phase 1 (Baseline)
                          4. Read state `rootCauses` — skip any with status "verified"
                          5. Skip approaches already recorded in `history`
```

## State File Update — Iteration 2 Example

```json
{
  "version": "5.0",
  "iteration": 2,
  "history": [
    {
      "iteration": 1,
      "diagnosisScore": 11,
      "fixesApplied": ["RC-001", "RC-002"],
      "fixesReverted": ["RC-002"],
      "verdict": "NEEDS_ITERATION",
      "regressionDetails": "RC-002 fix caused visual regression at iphone-xr — hero image clipped"
    }
  ]
}
```

In iteration 2, read `rootCauses` and skip any entry where a fix has `status: "verified"`. Only re-diagnose and re-fix the entries that remain `pending` or `reverted`.

## Rollback Protocol

Use the most surgical rollback option available:

**Single file** — revert only the affected CSS file:
```
git checkout HEAD -- web/src/css/layout.css
```

**Multiple files** — stash all working changes first, then selectively restore:
```
git stash
git stash show -p | grep "^+++ b/web/src/css/tokens.css" -A 50
```

**Nuclear** — revert all CSS to last known good commit:
```
git checkout HEAD -- web/src/css/
```

After EVERY revert, re-screenshot all Critical viewports before writing any new fix. Never assume a revert restored a clean state without visual confirmation.

## Context Budget Check

Before starting a new iteration, estimate remaining context window usage.

If context utilization is above 70%:
- STOP the current session
- Write final state to `aum-responsive-audit-state.json` with `verdict: "NEEDS_ITERATION"`
- Report to user: "Context budget near limit. Recommend starting a new session for iteration [N+1]. State file is current."

Do not attempt a new iteration on a near-full context window. Partial fixes written under context pressure cause regressions.

## Re-Diagnosis in Iteration 2+

Do not re-run full diagnosis. Use the state file to scope work:

1. Read `diagnosis.rootCauses` from state — filter for entries where no fix has `status: "verified"`
2. Read `history` — note which CSS approaches were tried and failed; do not repeat them
3. Re-score ONLY the structural dimensions that correspond to unresolved root causes
4. Update `diagnosis.structuralScore` with new values for affected dimensions only; leave resolved dimensions unchanged
5. Write updated state before proceeding to Phase 2 (Fix)

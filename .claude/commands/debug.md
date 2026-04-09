---
description: Structured debugging protocol. Reproduces, finds root cause, fixes minimally.
argument-hint: '<bug description>'
---

# Debug Protocol

Bug: $ARGUMENTS

## Steps

### 1. Reproduce (autonomous)

Do NOT trust the bug report. Reproduce first.

- Write a failing test that captures the bug
- Or provide exact steps to reproduce manually
- Confirm the bug exists before proceeding

🛑 **If cannot reproduce**: STOP and ask Haim for more details.

### 2. Root Cause Analysis

- Use Grep/Read to trace the data flow
- Check git log for recent changes in affected area: `git log -p --since="2 weeks ago" -- path/to/file`
- Identify the ACTUAL cause, not symptoms
- "It works now" without understanding why is NOT acceptable

### 3. Failing Test

Write a test that captures the bug. Run it to confirm it fails.

### 4. Minimal Fix

- Smallest possible change to make the test pass
- Do NOT refactor while fixing
- Do NOT add "while we're here" improvements

### 5. Regression Check

Run full test suite. Ensure nothing else broke.

### 6. Document

If the bug was non-obvious, add to `docs/GOTCHAS.md`:

```markdown
## [Bug title]

**Discovered**: [date]
**Symptom**: ...
**Cause**: ...
**Fix**: ...
**Prevention**: ...
```

### 7. Report

```markdown
## Bug Fixed: [title]

### Root Cause

[Actual technical cause]

### Fix

[What was changed and why]

### Test Added

[Test file and name]

### Added to GOTCHAS

[yes/no + link]
```

---
description: Structured planning protocol. Creates detailed plan before any implementation. No code is written.
argument-hint: '<feature or task description>'
---

# Plan Mode — NO CODE YET

You are in planning mode. You must NOT write, edit, or create any code files. Your only output is a plan document.

## Task to Plan

$ARGUMENTS

## Protocol

### 1. Understand (autonomous)

- Read `CLAUDE.md` (repo root)
- Read `docs/PROJECT_MAP.md` if exists
- Read `docs/GOTCHAS.md` if exists
- Identify affected files/modules
- Read those files

### 2. Research (autonomous)

- Check existing patterns in the codebase
- Find similar implementations to mimic
- Check related tests

### 3. Design the Plan

Produce this document:

```markdown
# Plan: [Task Name]

## Goal

[One sentence: what will be true when done]

## Acceptance Criteria

- [ ] Specific, testable conditions

## Affected Files

### To Create

- `path/file.ts` — [purpose]

### To Modify

- `path/file.ts` — [what changes]

### To Delete

- [if any — flag as 🛑 critical junction]

## Approach

[2-3 paragraphs: strategy, why this approach, alternatives considered]

## Steps

1. [Concrete action]
2. [Concrete action]
3. ...

## Risks

- [What could go wrong]
- [Edge cases]

## Open Questions

[Anything blocking execution — ask Haim]

## Complexity

- Files: X
- Lines: ~Y
- Complexity: S/M/L/XL

## Testing

[What tests verify this works]

## Rollback

[How to undo if needed]
```

### 4. Present and WAIT

🛑 **STOP**. Present the plan in Hebrew. Wait for:

- ✅ Approval → proceed to implementation
- 🔄 Revisions → update plan
- ❌ Rejection → abandon

Do NOT start implementation until explicit approval.

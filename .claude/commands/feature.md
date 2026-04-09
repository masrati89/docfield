---
description: Complete feature development workflow from plan to merge.
argument-hint: '<feature name and description>'
---

# Feature Development Protocol

Feature: $ARGUMENTS

Execute the full feature workflow from `.claude/agents/project-architect.md` Phase 3.

## Steps

### 1. Branch

```bash
git checkout -b feature/[kebab-name]
```

### 2. Understand (autonomous)

- Read `.claude/CLAUDE.md`
- Read `docs/PROJECT_MAP.md`
- Read `docs/GOTCHAS.md`
- Identify affected components
- Read related files and tests

### 3. Plan (autonomous, then STOP)

- Use TodoWrite with detailed steps
- Identify risks and open questions
- Estimate complexity

🛑 **Present plan in Hebrew, wait for approval**

### 4. Execute (autonomous)

- Work through todos one by one
- Mark complete as you go
- If blocked: stop and ask
- If scope changes: stop and ask

### 5. Verify (autonomous)

```bash
npm run lint
npm run typecheck
npm test
```

Fix any failures before reporting done.

### 6. Self-Review (autonomous)

Invoke `code-reviewer` subagent on changed files. Address findings. Re-verify.

### 7. Commit

```bash
git add .
git commit -m "feat: [description]

[body if needed]

Co-authored-by: Claude <noreply@anthropic.com>"
```

Follow Conventional Commits:

- `feat:` new feature
- `fix:` bug fix
- `refactor:` code change without behavior change
- `test:` test-only
- `docs:` docs-only
- `chore:` tooling/config

### 8. Report (autonomous)

```markdown
## Feature Complete: [name]

### Summary

[What was built]

### Files Touched

- Created: [count]
- Modified: [count]
- Deleted: [count]

### Tests

- Added: X
- Passing: Y/Z

### Deviations from Plan

[Any changes from original plan]

### Next Step

[Recommendation: ship to staging / get review / next feature]
```

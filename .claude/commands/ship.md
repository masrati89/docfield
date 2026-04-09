---
description: Pre-ship verification and deployment protocol. Runs full quality checks before allowing deploy.
argument-hint: '[staging|production]'
---

# Ship Protocol

Target: $ARGUMENTS (default: staging)

## Pre-Ship Checklist (autonomous)

Run all checks and report results as a checklist:

```bash
# 1. Lint
npm run lint 2>&1 || yarn lint 2>&1 || pnpm lint 2>&1

# 2. Type check
npm run typecheck 2>&1 || npx tsc --noEmit 2>&1

# 3. Tests
npm test 2>&1 || yarn test 2>&1

# 4. Build
npm run build 2>&1 || yarn build 2>&1

# 5. Check for debug code in changed files
git diff HEAD --name-only | xargs grep -l "console.log\|debugger\|TODO\|FIXME" 2>/dev/null

# 6. Verify env vars
diff <(grep -oE "^[A-Z_]+" .env.example | sort) <(grep -oE "process\.env\.[A-Z_]+" -r src/ | grep -oE "[A-Z_]+$" | sort -u) 2>/dev/null

# 7. Git status
git status
git log origin/main..HEAD --oneline 2>/dev/null
```

## Report Format

```markdown
# Ship Report

## Checks

- [ ] Lint: ✅/❌
- [ ] Types: ✅/❌
- [ ] Tests: ✅/❌ (X passed, Y failed)
- [ ] Build: ✅/❌
- [ ] No debug code: ✅/❌
- [ ] Env vars documented: ✅/❌
- [ ] CHANGELOG updated: ✅/❌
- [ ] Version bumped: ✅/❌

## Changed Files

[list]

## Commits Since Last Deploy

[list]

## Ready to Ship?

[Yes / No — with reason]
```

## Critical Junction

🛑 If target is `production`: STOP and ask explicit confirmation in Hebrew before deploying.
🟢 If target is `staging`: proceed with deploy if all checks pass.

## After Deploy

1. Monitor logs 15 minutes
2. Smoke test critical paths
3. Report: deploy successful / rollback initiated

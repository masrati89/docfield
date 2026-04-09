---
description: Run code review on current changes using the code-reviewer subagent.
argument-hint: '[--staged | --branch | --all]'
---

# Code Review

Scope: $ARGUMENTS (default: unstaged changes)

## Steps

1. Determine scope:
   - `--staged`: `git diff --cached --name-only`
   - `--branch`: `git diff main...HEAD --name-only`
   - `--all`: all source files
   - default: `git diff --name-only`

2. Invoke `code-reviewer` subagent on those files

3. Additionally invoke `security-auditor` if any of these are touched:
   - Auth files
   - API routes
   - Database migrations
   - `.env*` files
   - Permissions/RLS

4. Additionally invoke `rtl-checker` if any UI files are touched (`.tsx`, `.jsx`, `.css`)

5. Consolidate findings into a single report

6. Report in Hebrew with severity markers (🔴🟠🟡🟢)

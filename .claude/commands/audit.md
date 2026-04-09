---
description: Re-run project audit. Use quarterly or when significant changes have been made.
---

# Audit Command

Invoke the `project-architect` agent in Phase 1: Discovery & Audit mode.

Execute the full audit protocol from `.claude/agents/project-architect.md`:

1. Fingerprint the project (1.1)
2. Read critical files (1.2)
3. Analyze codebase (1.3)
4. Build profile (1.4)
5. Gap analysis against `.claude/templates/AUDIT_CHECKLIST.md` (1.5)
6. Produce `AUDIT_REPORT.md` (1.6)

Compare with previous `AUDIT_REPORT.md` if it exists — highlight what improved and what regressed.

Report findings in Hebrew. Wait for approval before proceeding to any remediation.

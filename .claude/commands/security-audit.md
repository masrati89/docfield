---
name: security-audit
description: Run security check on current code
---

Check the current code against inField security standards:

1. Read docs/SECURITY_STANDARDS.md
2. Verify RLS is enabled on all tables
3. Verify no secrets or API keys in code
4. Verify all user inputs are validated with Zod
5. Verify tenant isolation (organization_id on all queries)
6. Verify auth tokens stored in expo-secure-store (not AsyncStorage)
7. Verify error messages don't expose internal details
8. Report findings with severity: 🔴 CRITICAL → 🟠 HIGH → 🟡 MEDIUM → 🟢 LOW

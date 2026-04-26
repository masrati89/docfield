# Audit Remediation Plan

**Date:** 2026-04-26  
**Based on:** AUDIT_2026-04-10.md, QA_REPORT_2026-04-11.md, UNFINISHED_FEATURES_2026-04-10.md

---

## Phase 1: Critical Issues (C1-C5) — Iron Rule Enforcement

### ✅ C1: Signature/stamp files use upsert on fixed paths

**Status:** IDENTIFIED  
**Root cause:** `useSignature.ts:56-59, 138-141` uploads to fixed path with `upsert: true`  
**Impact:** Every signature update overwrites previous PDFs' signatures  
**Fix:** Use content-hashed path per signature version

**Files to modify:**

- `apps/mobile/hooks/useSignature.ts` — add hash suffix to paths

---

### ✅ C2: PDF reads live project/apartment data instead of snapshot

**Status:** IDENTIFIED  
**Root cause:** `usePdfGeneration.ts:244-245` reads live joins  
**Impact:** Renamed projects/buildings change on old PDFs  
**Fix:** Add 4 snapshot columns + migration, read from snapshot

**Files to modify:**

- `supabase/migrations/034_add_property_snapshots.sql` (NEW)
- `lib/createReportWithSnapshot.ts` — write snapshot columns
- `hooks/usePdfGeneration.ts` — read snapshots, not live joins

---

### ✅ C3: RLS has no status-based protection on completed reports

**Status:** IDENTIFIED  
**Root cause:** RLS policies missing `AND status != 'completed'` check  
**Impact:** Malicious client can edit closed reports  
**Fix:** Add status guard to all UPDATE/DELETE policies

**Files to modify:**

- `supabase/migrations/035_add_status_guards_to_rls.sql` (NEW)
  - delivery_reports UPDATE/DELETE
  - defects UPDATE/DELETE
  - checklist_results UPDATE/DELETE

---

### ✅ C4: defects_insert doesn't verify parent report

**Status:** IDENTIFIED  
**Root cause:** `defects_insert` RLS only checks org, not report ownership  
**Impact:** Users can backfill defects into closed reports  
**Fix:** Add `EXISTS` check for parent report ownership

**Files to modify:**

- `supabase/migrations/035_add_status_guards_to_rls.sql` (same as C3)

---

### ✅ C5: sync Edge Function is TODO placeholder

**Status:** IDENTIFIED  
**Root cause:** `supabase/functions/sync/index.ts:117-129` is stub  
**Impact:** Offline sync promised but not delivered  
**Fix:** Delete the function or implement it (deferred to P2)

**Files to modify:**

- `supabase/functions/sync/index.ts` — DELETE (not in scope for MVP)

---

## Phase 2: High-Priority Issues (H1-H6)

### H1: RLS pattern inconsistency (028_rls_recursion_fix only on users)

**Status:** QUEUED  
**Complexity:** M (one sweep migration)  
**Fix:** Replace all inline subqueries with `get_user_org_id()`

**Files:** All RLS policies in 003-014 migrations

---

### H2: Every user becomes admin

**Status:** QUEUED  
**Complexity:** S (1-line change)  
**Fix:** Check first user = admin, invited = inspector

---

### H3: delivery_reports cascades to signatures

**Status:** QUEUED  
**Complexity:** S (FK policy change)  
**Fix:** Change `ON DELETE CASCADE` to `ON DELETE RESTRICT`

---

### H4: add-defect.tsx is 994 lines with empty catches

**Status:** QUEUED  
**Complexity:** M (refactor + error handling)  
**Fix:** Extract sub-hooks, add error logging

---

### H5: useChecklist debounce missing

**Status:** QUEUED  
**Complexity:** S (add debounce + status check)  
**Fix:** Debounce 400ms, skip if completed

---

### H6: Registration flow rollback incomplete

**Status:** QUEUED  
**Complexity:** M (transaction refactor)  
**Fix:** Move to Postgres function or Edge Function

---

## Phase 3: Code Quality (M1-M4)

### M1: useReport doesn't select snapshots

**Status:** QUEUED  
**Fix:** Add snapshot columns to SELECT for completed reports

---

### M2: CLAUDE.md out of date + duplicate

**Status:** QUEUED  
**Fix:** Update once, delete `.claude/CLAUDE.md`

---

### M3: Empty catch blocks (19 occurrences)

**Status:** QUEUED  
**Fix:** Add error logging + toast for each

---

### M4: .gitignore missing Zone.Identifier cleanup

**Status:** QUEUED  
**Fix:** Add `*:Zone.Identifier` to `.gitignore`

---

## Phase 4: QA Bugs (6 fixes)

From `FIX_PLAN_2026-04-11.md`:

### Group A: PDF Pipeline (6 bugs)

- A.1: useReport.ts — add floor field
- A.2: ReportPreviewModal.tsx — pass floor
- A.3: previewHtml.ts — != null checks + date formatter
- A.4: usePdfGeneration.ts — web branch for generatePdf
- A.5: usePdfGeneration.ts — web branch for sharePdf
- A.6: reports/[id]/index.tsx — close preview before summary

### Group B: PasswordField (1 bug)

- B.1: ChangePasswordSection.tsx — forwardRef wrapper

### Group C: SideMenu (1 bug — pending verification)

- C.0: Run Playwright screenshot first

---

## Execution Order

```
Week 1 (Priority):
  Phase 1.1: C1 (signature paths)
  Phase 1.2: C2 (property snapshots + migration)
  Phase 1.3: C3+C4 (RLS status guards)
  Phase 1.4: C5 (delete sync)
  → Run: npm run typecheck (after migrations loaded)

Week 2:
  Phase 2: H1-H6 (RLS + code cleanup)
  Phase 3.4: M4 (.gitignore)
  Phase 3.2: M2 (CLAUDE.md)

Week 3:
  Phase 3: M1, M3 (query + error logging)
  Phase 4: QA bug fixes (A1-A6, B1, C0)

Final:
  npm run typecheck
  Build + test
  Commit + push
```

---

## Risk Mitigation

- **Migrations:** All reversible with `supabase migration revert`
- **Storage:** Content-hash paths don't delete old files; coexist safely
- **RLS:** Only restricting, not opening up access
- **QA:** Each fix validated before next one starts

---

## Notes

- NativeWind typecheck issues (254 TS errors) are config-related, not blocking — Expo dev server works
- All Iron Rule fixes must land before MVP beta
- Team mode (H2, H6) deferred to Phase 2; MVP is solo-only

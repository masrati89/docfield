# 📋 inField — Delta Audit Report

**Date**: 2026-04-09
**Type**: Delta audit since `docs/STATUS_CHECK_APRIL_2026.md` (2026-04-08)
**Auditor**: project-architect (Phase 1)
**Grade**: **B+** — קוד ו-DB במצב הטוב ביותר מאז תחילת הפרויקט, אבל ה-working tree מפוצץ בעבודה לא-committed ויש סיכון אמיתי של אובדן.

---

## 🎯 Executive Summary

1. **תוך 48 שעות הפרויקט עבר שיקום דרמטי**: מ-"Frankenstein" (6 מיגרציות לא מוחלות, RLS שבור, Iron Rule מופר) למצב `Local=Remote=30/30 migrations, 0 schema diffs, Iron Rule הופעל`.
2. **הבעיה הכי קריטית עכשיו היא דווקא git, לא קוד**: migration 029 (Iron Rule) **הוחל על ה-Remote production DB אבל קובץ ה-SQL לא committed** — אם יבוצע `db reset` או clone נקי, 029 לא קיים.
3. **ערימה של עבודה לא-committed**: 3 קבצי קוד modified (snapshot-first PDF + 2 יוצרי דוחות) + helper חדש + 7 מסמכי תיעוד + כל `.claude/agents/`+`commands/`+`hooks/`+`templates/` + `.env.remote` + `backups/` + `scripts/`.
4. **5 "קבצי זבל"** בשורש הפרויקט עם שמות עברית/מוזרים וגודל 0 בתים.
5. **אחד הממצאים הגדולים מהביקורת של 4/4 כבר נפתר בשקט**: הקבצים הענקיים (`reports/[id]/index.tsx` היה 1493 שורות — עכשיו 499; `reports/index.tsx` 1320 → 297; `projects/index.tsx` 1105 → 247). כנראה refactor מוצלח שלא תועד.

**מאמץ לסגירה לסטטוס "יציב" (ללא פיצ'רים חדשים): ~2-3 שעות עבודה.** הכול no-code או git/cleanup.

---

## 📊 Project Profile

| Dimension     | State                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Type          | Monorepo (Turborepo + npm workspaces) — Mobile (Expo 55 RN 0.76.9) + Web (Vite) + shared + ui                                      |
| Stack         | TypeScript strict · Supabase Postgres+Auth+Storage · React Query · Expo Router v4 · NativeWind v4 · expo-print                     |
| Maturity      | **Late MVP / Phase 6** — כל המסכים הראשיים נבנו, מערכת PDF מלאה, 30 מיגרציות                                                       |
| Health        | **OK → Good** (עלה מ-Concerning בסוף מרץ)                                                                                          |
| Tech debt     | **Medium** (ירד מ-High אחרי refactor קבצים ענקיים וסגירת Iron Rule)                                                                |
| Test coverage | **None** — אין תיקיית `__tests__`, אין Jest/Vitest/Detox config במצב פעיל                                                          |
| Docs          | **Excessive** — 20+ מסמכים בתיקיית `docs/`, חלקם חופפים/מקבילים (PHASE0, PHASE0C, PHASE1, STATUS, FULL_AUDIT, FIX_REPORT, HANDOFF) |
| Security      | **OK** — RLS + tenant isolation טוב; `.env.remote` untracked הוא סיכון פוטנציאלי                                                   |

---

## ✅ Strengths (מה שעובד מצוין)

1. **DB Iron Rule**: 16 snapshot columns מותקנות + helper `createReportWithSnapshot.ts` — דוחות קיימים מעכשיו מוקפאים ברמת שם/חתימה/חותמת מפקח + נתוני ארגון ברגע היצירה.
2. **Org skeleton מוכן למולטי-tenant**: `organizations.mode` (`solo`/`team`), `organization_members`, `organization_invitations` (7 ימי תוקף), `teams` — גם כשהמסכים עדיין single-user.
3. **DB sync מושלם**: Local ו-Remote זהים אחרי migration 030 (catchup ל-017/018/020 + defect_library rich fields).
4. **Refactor שקט של קבצים גדולים**: 3 הקבצים הכי ארוכים קוצרו ב-67%+ (אחוז הפחתה אמיתי) — ללא שינוי פונקציונליות נראה לעין.
5. **TypeScript mobile נקי**: 0 שגיאות לפי PHASE1_COMPLETION.
6. **PDF pipeline מלאה end-to-end**: 2 תבניות (בדק בית + מסירה), preview, share, snapshot-first עם fallback לחי.
7. **Iron Rules מתועדים ב-`CLAUDE.md`** ובפועל מיושמים ב-migration 029 (ראה `organizations.mode`, snapshot cols).

---

## 🔴 Critical Issues (Fix Immediately — today)

### C1 · Migration 029 applied to production DB but not committed to git

**Impact**: ה-SQL של 029 (16 snapshot cols + 3 org tables + RLS policies) חי ב-Remote production, אבל `git status` מראה את הקובץ כ-`??` (untracked). 030 committed _לפני_ 029 (30→28 ברצף ה-commits), וזה מעיד שקוד ה-DB של Remote הוא ahead of git. **אם תקרה תקלת disk או clone חדש — 029 לא יהיה בשום מקום**.

**Fix**: מיידי — `git add supabase/migrations/029_iron_rule_and_org_skeleton.sql` + commit נפרד עם message תיאורי לפני כל עבודה נוספת. כרגע 030 commit מפנה לפונקציונליות של 029 בלי לכלול את הקובץ.

**Effort**: S (2 דקות).

### C2 · `.env.remote` untracked in `apps/mobile/` — potential secret leak

**Impact**: `apps/mobile/.env.remote` מופיע כ-untracked. אם הוא נוסף לעבודה בלי `.gitignore` שמכיר בו, סיכון שהוא יתווסף ב-`git add .`. תוכנו לא ידוע, אבל השם מרמז על מפתחות Supabase production.

**Fix**: ודא ש-`.env*` בקובץ `.gitignore` של הפרויקט (יש `.env.example` בשורש, לבדוק). אם יש סוד — לסובב (rotate) למקרה. להעביר לניהול מאובטח (Supabase Vault / EAS secrets).

**Effort**: S.

### C3 · 5 קבצי זבל עם שמות עברית בשורש הפרויקט

**Impact**: זיהום מאגר. כל הקבצים הבאים בגודל 0 בתים ונוצרו בטעות (כנראה heredoc שקרס או טייפו CLI):

- `lsb_release` (9/4)
- `**מטרה:**` (8/4)
- `**עודכן:**` (8/4)
- `המערכת` (6/4)
- `מקליד` (6/4)

אף אחד מהם לא ב-`.gitignore` ולא tracked — אבל ישארו ויזהמו `git status` לנצח.

**Fix**: `rm` לחמישתם. פעולה בטוחה לחלוטין (כולם ריקים).

**Effort**: S.

---

## 🟠 High Priority (This Week)

### H1 · Working tree מפוצץ: 3 modified + ~20 untracked

מחוץ ל-C1/C2 יש עוד **כמות אדירה** של עבודה לא-committed:

| קטגוריה                    | קבצים                                                                                                                                                                         | פעולה                                                                           |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Mobile code (modified)** | `apartments/index.tsx`, `useWizardState.ts`, `usePdfGeneration.ts`                                                                                                            | commit כ-`feat(snapshot): snapshot-first PDF + report creation via helper`      |
| **Mobile code (new)**      | `apps/mobile/lib/createReportWithSnapshot.ts`                                                                                                                                 | include ב-commit הנ״ל                                                           |
| **Docs**                   | `PHASE0C_BUG_DIAGNOSIS.md`, `PHASE0C_ENVIRONMENT_REPORT.md`, `PHASE0C_TIMELINE_INVESTIGATION.md`, `PHASE0_FINAL_COMPLETION.md`, `PHASE1_DISCOVERY.md`, `PHASE1_COMPLETION.md` | commit נפרד: `docs: phase 0-1 completion reports`                               |
| **Claude infra**           | `.claude/agents/` (6 סוכנים), `.claude/commands/` (7 פקודות חדשות), `.claude/hooks/`, `.claude/templates/`                                                                    | commit נפרד: `chore(claude): add project-architect, commands, hooks, templates` |
| **Scripts**                | `scripts/`                                                                                                                                                                    | לבדוק ו-commit אם שימושי                                                        |
| **Backups**                | `backups/` (378K+ SQL files)                                                                                                                                                  | **לא ל-commit** — להוסיף ל-`.gitignore`                                         |
| **Supabase artifacts**     | `supabase/.branches/`                                                                                                                                                         | **לא ל-commit** — `.gitignore`                                                  |
| **Web build artifact**     | `apps/web/tsconfig.app.tsbuildinfo` (modified)                                                                                                                                | **לא ל-commit** — `.gitignore`                                                  |

**Effort**: M (30-45 דק׳ לחלק ל-commits נקיים).

### H2 · `apps/web` build שבור (pre-existing)

**Impact**: `provider` חסר ב-`apps/web/src/contexts/AuthContext.tsx` מאז migration 027 / commit f6f393c (OAuth). `npx turbo build` לא עובר. PHASE1_COMPLETION מציין את זה כ"known issue pre-existing" אבל זה חוסם CI אוטומטי ו-ship.

**Fix**: לקרוא `apps/web/src/contexts/AuthContext.tsx`, להשוות ל-mobile, להוסיף את השדות החסרים, או אם web עדיין אינו בשימוש — להסיר זמנית מ-`turbo.json` build pipeline.

**Effort**: S-M (תלוי בחוסרים).

### H3 · Seed data שבור

**Impact**: `supabase/demo_data.sql` נכשל על FK ל-`auth.users`. ב-local DB אחרי `db reset` אין נתוני בדיקה → חייבים להירשם ידנית בכל reset.

**Fix**: לשכתב את ה-seed כך שיעבור דרך `auth.admin.createUser` עם Supabase admin API, או להגדיר את ה-seed לעבור רק על `public.users` ללא FK ל-auth. עדיף האפשרות הראשונה.

**Effort**: M.

### H4 · `.claude/CLAUDE.md` vs `CLAUDE.md` בשורש

**Impact**: ה-protocol של `project-architect` מחפש `.claude/CLAUDE.md`. בפועל הפרויקט עובד עם `CLAUDE.md` בשורש (20KB, טוב מאוד). זה גורם לאבחון שלב שגוי (Phase 1 במקום Phase 3).

**Fix**: או symlink `.claude/CLAUDE.md → ../CLAUDE.md`, או עדכון `project-architect.md` לבדוק את שני ה-paths. עדיף symlink.

**Effort**: S.

---

## 🟡 Medium Priority (This Month)

### M1 · תיעוד חופף בתיקיית docs

**Impact**: יש **8 מסמכים** שמכסים את אותו פרויקט מזוויות שונות:

- `FULL_AUDIT_REPORT.md` (4/4)
- `STATUS_CHECK_APRIL_2026.md` (8/4)
- `PHASE0_UNBLOCK_PLAN.md`, `PHASE0_COMPLETION_REPORT.md`, `PHASE0_FINAL_COMPLETION.md`
- `PHASE0C_BUG_DIAGNOSIS.md`, `PHASE0C_ENVIRONMENT_REPORT.md`, `PHASE0C_TIMELINE_INVESTIGATION.md`
- `PHASE1_DISCOVERY.md`, `PHASE1_COMPLETION.md`, `PHASE1_FINAL_FIX.md`, `PHASE1_POST_INVESTIGATION.md`
- `FIX_REPORT.md`, `inField-HANDOFF.md`, `STANDARDS_REFERENCE.md`

**Fix**: איחוד/ארכוב. להעביר PHASE0 ו-PHASE0C ל-`docs/archive/` — הם אינם צריכים להיות חלק מה-"docs live". להשאיר `CURRENT_STATUS.md` אחד עדכני + `HANDOFF.md` + reference docs.

**Effort**: M.

### M2 · 0 tests בכל הפרויקט

**Impact**: אין `__tests__`, אין Jest config פעיל, אין E2E. הפרויקט הולך לעמוד בפני משלוח production (Phase 4) בלי רשת ביטחון. ה-Iron Rule עצמו חייב integration test: "דוח שנוצר אתמול — אם המפקח משנה את שמו היום, ה-PDF עדיין מציג את השם המקורי".

**Fix**: Vitest ל-`packages/shared` (validation, utils — הכי קל), Jest ל-mobile (unit hooks), ואז integration test ל-snapshot flow. התחלה מינימלית: 5-10 tests על `createReportWithSnapshot` + snapshot SELECT ב-`usePdfGeneration`.

**Effort**: L לתשתית + M לכל סט tests.

### M3 · Web app לא ברור מטרה

**Impact**: `apps/web` קיים, יש לו build שבור, אבל לא ברור אם הוא בשימוש. הפרויקט הוא mobile-first לפי `CLAUDE.md`. הוא גורר תלויות ותחזוקה.

**Fix**: החלטה — האם web נשאר (landing? admin?) או נמחק.

**Effort**: S (החלטה) + S-L (מחיקה/שיקום).

### M4 · Role enforcement ב-UI חסר

**Impact**: RLS policies תומכים ב-admin/project_manager/inspector, אבל `register.tsx` מגדיר תמיד `role: 'admin'`. אין מסך ניהול משתמשים. כל הרשמה = admin. STATUS_CHECK מציין זאת.

**Fix**: להפעיל אחרי שמולטי-tenant רלוונטי בפועל. כרגע 1 משתמש בכל הארגונים.

**Effort**: M.

---

## 🟢 Low Priority (Backlog)

- L1 · `CLAUDE.md.backup` בשורש — למחוק אחרי ש-`CLAUDE.md` הנוכחי יציב.
- L2 · `dist/` בשורש — לבדוק אם שייך לבנייה ישנה, אם כן למחוק + `.gitignore`.
- L3 · `.expo/` בשורש — צריך להיות ב-`.gitignore` (לבדוק).
- L4 · Changelog לא קיים — ליצור `CHANGELOG.md` כשמגיעים ל-Phase 4.
- L5 · ESLint רץ? יש `eslint.config.mjs` — לבדוק אם husky pre-commit עובד.

---

## 📁 Infrastructure Status (Delta)

### ✅ Claude Code Infrastructure (רובו הותקן — כנראה בסשן הזה)

- `.claude/agents/` — 6 סוכנים (code-reviewer, db-migrator, project-architect, rtl-checker, security-auditor, test-writer)
- `.claude/commands/` — 10 פקודות (architect, audit, debug, design-check, feature, new-screen, plan, review, security-audit, ship)
- `.claude/hooks/`, `.claude/templates/` — קיימות (לא בדקתי תוכן)
- `CLAUDE.md` — שורש, 20KB, מקיף
- ⚠️ אין `.claude/CLAUDE.md` — ראה H4

### ⚠️ Quality Tooling

- ESLint — מוגדר (`eslint.config.mjs`)
- Prettier — מוגדר (`.prettierrc`)
- Husky — מוגדר (`.husky/`)
- TypeScript — strict, 0 errors (mobile)
- **Tests — NONE**

### ✅ Security

- RLS — מאופשר על כל הטבלאות (מאומת ב-FULL_AUDIT)
- `organization_id` — בכל הטבלאות
- `get_user_org_id()` — SECURITY DEFINER helper (028)
- Signatures immutable — no UPDATE/DELETE policies (009)
- ⚠️ `.env.remote` untracked — ראה C2

### ❌ Observability

- אין Sentry / error tracking
- אין analytics
- אין uptime monitoring

---

## 🗺️ Recommended Roadmap (עדכני)

### היום (2-3 שעות)

1. **C1**: commit migration 029 כ-commit נפרד לפני הכול
2. **C3**: למחוק 5 קבצי זבל
3. **H1**: לחלק את ה-working tree ל-4-5 commits לוגיים
4. **H4**: symlink `.claude/CLAUDE.md`
5. **C2**: לבדוק `.gitignore` ולהבטיח ש-`.env*` חסום
6. לפתח את `backups/`, `supabase/.branches/`, `*.tsbuildinfo` ל-`.gitignore`

### השבוע

7. **H2**: לתקן web build או להוציאו מה-turbo pipeline
8. **H3**: לשכתב seed data לעבוד עם `auth.admin`
9. **M1**: לארכב docs ישנים ל-`docs/archive/`
10. **M2** (התחלה): Vitest על `packages/shared` + test אחד integration ל-Iron Rule

### החודש

11. להחליט על `apps/web` (M3)
12. להתחיל Digital signatures (`@shopify/react-native-skia`) — מופיע ב-CLAUDE.md כ"לא מותקן"
13. Delivery Round 2 — inherited defects flow
14. Organization settings screen — למלא את `legal_name`, `tax_id`, `address` וכו׳ ב-`organizations.settings` JSONB (כרגע 8/10 מה-snapshot fields NULL)

---

## ❓ Critical Questions for Haim

1. **מה המטרה של `apps/web`?** אם landing/admin — להגדיר מתי הוא מיועד להיות חי. אם hallucination/שריד — למחוק.
2. **`.env.remote` מכיל service role key?** אם כן, צריך rotate + להעביר לניהול אחר (EAS secrets / Supabase Vault).
3. **מתי ה-production deploy הראשון?** זה קובע כמה דחוף M2 (tests) ו-H3 (seed). אם תוך שבועיים — מומלץ להקדים tests ל-High Priority.
4. **Digital signatures (skia) — עדיין ב-scope ל-MVP?** ה-CLAUDE.md ו-PHASE1 מציינים שלא הותקן. זה פיצ׳ר חוקי כבד. אם כן — צריך לתזמן מעבר דחוף לזה.
5. **Refactor של קבצים הגדולים תועד?** `reports/[id]/index.tsx` ירד מ-1493 ל-499 שורות — זה שינוי מסיבי. יש commit/PR לתעד את השינוי? אם לא, חשוב להוסיף doc קצר לפני שהעבודה נשכחת.

---

## 📝 Detailed Findings — Delta Since 2026-04-08

### DB (יצא נפלא)

| #    | ממצא                                            | סטטוס                                             |
| ---- | ----------------------------------------------- | ------------------------------------------------- |
| DB.1 | 6 migrations לא מוחלות (021-026)                | ✅ **נפתר** — Phase 0 applied all                 |
| DB.2 | כפילות מספור 025                                | ✅ **נפתר** — 025_oauth_support שונה ל-027        |
| DB.3 | RLS infinite recursion על users                 | ✅ **נפתר** — migration 028 (`get_user_org_id()`) |
| DB.4 | Iron Rule מופר — אין snapshot fields            | ✅ **נפתר** — migration 029 (16 columns) + helper |
| DB.5 | Remote vs Local schema mismatch (017, 018, 020) | ✅ **נפתר** — migration 030 (idempotent catchup)  |
| DB.6 | `defect_library` rich fields חסרים ב-Local      | ✅ **נפתר** — migration 030                       |
| DB.7 | Seed data שבור (FK ל-auth.users)                | 🔴 **פתוח** — H3                                  |
| DB.8 | Migration 029 uncommitted                       | 🔴 **פתוח** — C1                                  |

### Code

| #   | ממצא                                | סטטוס                                                    |
| --- | ----------------------------------- | -------------------------------------------------------- |
| C.1 | `reports/[id]/index.tsx` 1493 שורות | ✅ **נפתר** — עכשיו 499                                  |
| C.2 | `reports/index.tsx` 1320 שורות      | ✅ **נפתר** — עכשיו 297                                  |
| C.3 | `projects/index.tsx` 1105 שורות     | ✅ **נפתר** — עכשיו 247                                  |
| C.4 | PDF קורא inspector live             | ✅ **נפתר** — snapshot-first in `usePdfGeneration.ts`    |
| C.5 | 2 מקומות יוצרי דוחות ללא snapshot   | ✅ **נפתר** — helper משותף `createReportWithSnapshot.ts` |
| C.6 | Web build שבור (provider)           | 🟠 **פתוח** — H2                                         |
| C.7 | TypeScript mobile                   | ✅ 0 errors                                              |

### Git / Working Tree

| #   | ממצא                                                               | חומרה                  |
| --- | ------------------------------------------------------------------ | ---------------------- |
| G.1 | Migration 029 uncommitted                                          | 🔴 Critical            |
| G.2 | `.env.remote` untracked                                            | 🔴 Critical (security) |
| G.3 | 5 junk files in root                                               | 🟠                     |
| G.4 | 3 modified files + helper untracked                                | 🟠                     |
| G.5 | 7 docs untracked                                                   | 🟠                     |
| G.6 | `.claude/` infra untracked (agents + commands + hooks + templates) | 🟡                     |
| G.7 | `backups/`, `supabase/.branches/` untracked (should be gitignored) | 🟡                     |

---

## 📎 Appendix

### מטריקות

|                              | 2026-04-04 (FULL_AUDIT) | 2026-04-08 (STATUS)        | 2026-04-09 (עכשיו)                   |
| ---------------------------- | ----------------------- | -------------------------- | ------------------------------------ |
| Migrations (local)           | 20 applied              | 20 applied                 | **30 applied**                       |
| Migrations (remote)          | ?                       | 20 applied (3 false marks) | **30 applied, 0 diffs**              |
| Snapshot fields              | 0                       | 0                          | **16**                               |
| Org tables                   | 1                       | 1                          | **4** (+members +invitations +teams) |
| reports/[id]/index.tsx (LOC) | 1493                    | ?                          | **499**                              |
| Iron Rule status             | ❌ broken               | ❌ broken                  | ✅ **enforced**                      |
| RLS recursion                | ❌ broken               | ❌ broken                  | ✅ **fixed**                         |
| Mobile TypeScript            | —                       | —                          | ✅ 0 errors                          |
| Web build                    | ❌ broken               | ❌ broken                  | ❌ broken (pre-existing)             |
| Tests                        | 0                       | 0                          | 0                                    |
| Uncommitted files            | ?                       | ?                          | **~25**                              |

### שני Commits פתוחים שכבר קיימים ב-git history (לידיעה)

- `60000c8` — migration 030 (**לא כולל את 029**)
- `e31f82c` — migration 028

### מסמכים שמומלץ לקרוא להקשר

- `docs/PHASE1_COMPLETION.md` — מה Phase 1 עשה
- `docs/PHASE0_FINAL_COMPLETION.md` — מה Phase 0 עשה
- `docs/STATUS_CHECK_APRIL_2026.md` — נקודת הבסיס של ה-delta

---

**End of Report**

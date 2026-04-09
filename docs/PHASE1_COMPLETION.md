# Phase 1 — Iron Rule Snapshots — Completion Report

תאריך: 2026-04-09

## סיכום מנהלים

Phase 1 הושלם בהצלחה. דוחות הם עכשיו **מסמכים משפטיים עצמאיים** — כל נתוני המפקח והארגון מוקפאים ברגע יצירת הדוח (Iron Rule).

## מה נעשה

### A. Migration 029 — Iron Rule + Organization Skeleton

**16 Snapshot Columns על delivery_reports:**

| #   | עמודה                                    | מקור                                          |
| --- | ---------------------------------------- | --------------------------------------------- |
| 1   | `inspector_full_name_snapshot`           | `users.full_name`                             |
| 2   | `inspector_license_number_snapshot`      | `users.inspector_settings->>'license_number'` |
| 3   | `inspector_professional_title_snapshot`  | NULL (עתידי)                                  |
| 4   | `inspector_education_snapshot`           | `users.inspector_settings->>'education'`      |
| 5   | `inspector_signature_url_snapshot`       | `users.signature_url`                         |
| 6   | `inspector_stamp_url_snapshot`           | `users.stamp_url`                             |
| 7   | `inspector_phone_snapshot`               | `users.phone`                                 |
| 8   | `inspector_email_snapshot`               | `users.email`                                 |
| 9   | `organization_name_snapshot`             | `organizations.name`                          |
| 10  | `organization_logo_url_snapshot`         | `organizations.logo_url`                      |
| 11  | `organization_legal_name_snapshot`       | `organizations.settings->>'legal_name'`       |
| 12  | `organization_tax_id_snapshot`           | `organizations.settings->>'tax_id'`           |
| 13  | `organization_address_snapshot`          | `organizations.settings->>'address'`          |
| 14  | `organization_phone_snapshot`            | `organizations.settings->>'phone'`            |
| 15  | `organization_email_snapshot`            | `organizations.settings->>'email'`            |
| 16  | `organization_legal_disclaimer_snapshot` | `organizations.settings->>'legal_disclaimer'` |

**שדה חדש על organizations:**

- `mode` — `'solo'` (ברירת מחדל) או `'team'`

**3 טבלאות חדשות (Organization Skeleton):**

- `organization_members` — חברות בארגון עם role (owner/admin/project_manager/inspector)
- `organization_invitations` — הזמנות ממתינות (pending/accepted/declined/expired, 7 ימי תוקף)
- `teams` — קבוצות משנה בתוך ארגון

**RLS על כל הטבלאות החדשות** — כולן משתמשות ב-`get_user_org_id()` מ-028.

**Backfill:**

- `organization_members` מולא מ-`users` (כל משתמש קיים הפך לחבר בארגון שלו)
- 18 דוחות קיימים עודכנו עם snapshot fields (רוב השדות NULL כצפוי — רק `full_name`, `email`, `org_name` מלאים)

### B. createReportWithSnapshot() — Helper משותף

**קובץ:** `apps/mobile/lib/createReportWithSnapshot.ts`

פונקציה אחת שמרכזת את כל לוגיקת יצירת הדוח:

1. שולפת פרופיל מפקח + `inspector_settings` מ-`users`
2. שולפת נתוני ארגון + `settings` מ-`organizations`
3. בונה 16 snapshot fields
4. מבצעת INSERT ל-`delivery_reports`

**שני המקומות שיוצרים דוחות עודכנו:**

- `components/wizard/useWizardState.ts` — Wizard flow
- `app/(app)/projects/[projectId]/apartments/index.tsx` — Quick create

### C. PDF Generation — Snapshot-First

**קובץ:** `apps/mobile/hooks/usePdfGeneration.ts`

- ה-SELECT כולל עכשיו את כל 16 ה-snapshot fields
- Inspector name, license, education — נקראים מ-snapshot קודם, fallback ל-live
- Signature URL, stamp URL — snapshot-first
- Organization logo, disclaimer — snapshot-first
- Inspector settings נשלפים רק אם אין snapshot (דוחות ישנים)

## מצב סופי

| פרמטר              | Local                                | Remote        |
| ------------------ | ------------------------------------ | ------------- |
| Migrations         | 29/29 ✅                             | 29/29 ✅      |
| Snapshot columns   | 16/16 ✅                             | 16/16 ✅      |
| New tables         | 3/3 ✅                               | 3/3 ✅        |
| organizations.mode | ✅                                   | ✅            |
| Backfill           | N/A (empty)                          | 18 reports ✅ |
| TypeScript         | 0 errors (mobile) ✅                 | —             |
| Web build          | ❌ pre-existing (missing `provider`) | —             |

## קבצים שהשתנו

| קובץ                                                              | שינוי                  |
| ----------------------------------------------------------------- | ---------------------- |
| `supabase/migrations/029_iron_rule_and_org_skeleton.sql`          | **חדש** — migration    |
| `apps/mobile/lib/createReportWithSnapshot.ts`                     | **חדש** — helper       |
| `apps/mobile/hooks/usePdfGeneration.ts`                           | עודכן — snapshot-first |
| `apps/mobile/components/wizard/useWizardState.ts`                 | עודכן — uses helper    |
| `apps/mobile/app/(app)/projects/[projectId]/apartments/index.tsx` | עודכן — uses helper    |

## בעיות ידועות

1. **Web build שבור** — `provider` חסר ב-`apps/web/src/contexts/AuthContext.tsx`. קיים מלפני Phase 1 (מ-027).
2. **Seed data** — עדיין נכשל (FK constraint על auth.users). ידוע מ-Phase 0.
3. **`stamp_url`/`signature_url` חסרים ב-Remote** — migrations 017/009 מסומנות כ-applied אבל ייתכן שהעמודות לא קיימות. ה-backfill טיפל בזה עם EXCEPTION handler.

## מה נשאר

- Digital signatures — @shopify/react-native-skia
- Delivery Round 2 — inherited defects + review_status
- Organization settings screen — legal_name, tax_id, address, phone, email
- Inspector settings completion — professional_title field
- Full camera overlay
- Offline sync (post-MVP)

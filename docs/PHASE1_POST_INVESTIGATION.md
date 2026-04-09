# Post-Phase-1 Investigation Report

תאריך: 2026-04-09

## סיכום קצר

**Remote נמצא במצב Frankenstein חדש:** 29/29 migrations מסומנות applied, אבל **3 migrations בפועל לא רצו** (017, 018, 020). בנוסף, מישהו הוסיף 12 עמודות ידנית ל-`defect_library` ב-Remote שלא קיימות בשום migration file.

---

## חלק 1: signature_url + stamp_url

### Local (`users`)

- ✅ `signature_url` — קיים (מ-migration 012)
- ✅ `stamp_url` — קיים (מ-migration 017)

### Remote (`users`)

- ✅ `signature_url` — קיים (012 רץ)
- ❌ **`stamp_url` — לא קיים** (017 מסומנת applied אבל לא רצה)

### מה Migration 017 עושה

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS stamp_url TEXT;
```

פעולה אחת בלבד. ה-`IF NOT EXISTS` הופך אותה בטוחה, אבל היא פשוט לא הוחלה ב-Remote.

### הערה: אין טבלת `signatures` על users

ה-`signature_url` הוא **עמודה** על `users`, לא טבלה. יש גם טבלת `signatures` נפרדת (מ-migration 009) לחתימות של דוחות ספציפיים — זה דבר אחר לגמרי והיא מסונכרנת ב-Local ו-Remote.

### איפה ה-Helper מנסה לקרוא

`apps/mobile/lib/createReportWithSnapshot.ts:64`:

```typescript
.select('full_name, phone, email, signature_url, stamp_url, inspector_settings')
```

**הקריאה הזו נכשלת ב-Remote** כי `stamp_url` לא קיים. Phase 1 טיפל בזה רק ב-backfill של ה-migration, אבל הקוד החדש יקרוס בזמן יצירת דוח אמיתי מול Remote.

### שורש הבעיה

Migration 017 מסומנת applied ב-`schema_migrations` של Remote, אבל ה-SQL מעולם לא רץ על הטבלה. זו אותה תבנית שזיהינו ב-Phase 0 עם migrations 025-027 — רק שהפעם לא תוקן.

---

## חלק 2: Schema Diff Local vs Remote

### גודל ה-diff

- `local_schema.sql`: 2451 שורות
- `remote_schema.sql`: 1895 שורות
- `diff.txt`: 3488 שורות (רובן cosmetic — quoting וסדר)

### טבלאות

**20 טבלאות בשני הצדדים. אין טבלאות חסרות.**

- כולל 3 הטבלאות החדשות מ-029: `organization_members`, `organization_invitations`, `teams` ✅

### הבדלי עמודות (מהותיים)

| טבלה             | חסר ב-Remote                                                   | עודף ב-Remote                                                                                                                                                                    |
| ---------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`          | `stamp_url`                                                    | —                                                                                                                                                                                |
| `defects`        | `cost`, `cost_unit`, `notes`, `recommendation`, `standard_ref` | `standard_reference`                                                                                                                                                             |
| `defect_photos`  | `annotations_json`                                             | —                                                                                                                                                                                |
| `defect_library` | —                                                              | `cost`, `cost_unit`, `last_used_at`, `location`, `recommendation`, `source`, `standard`, `standard_description`, `title`, `updated_at`, `usage_count`, `user_id` (**12 עמודות**) |

### טבלאות מסונכרנות (SYNCED)

`delivery_reports` (50 עמודות כולל 16 snapshots), `signatures`, `apartments`, `buildings`, `projects`, `notifications`, `report_log`, `organizations`, `clients`, `checklist_*`, `teams`, `organization_members`, `organization_invitations`.

### ניתוח: איזו migration לא רצה

| Migration | מה הייתה אמורה לעשות                                                                          | מצב Remote |
| --------- | --------------------------------------------------------------------------------------------- | ---------- |
| **017**   | `users ADD COLUMN stamp_url`                                                                  | ❌ לא רצה  |
| **018**   | `defect_photos ADD COLUMN annotations_json`                                                   | ❌ לא רצה  |
| **020**   | `defects: RENAME standard_reference → standard_ref + ADD cost/cost_unit/notes/recommendation` | ❌ לא רצה  |

**כל השלוש מסומנות applied ב-`supabase migration list` — זה שקר.**

### ה-12 עמודות העודפות ב-`defect_library`

אינן מגיעות משום migration file בפרויקט. כנראה נוספו ידנית דרך Studio/SQL Editor ב-Remote. הטבלה המקורית (migration 008) מגדירה רק: `id, organization_id, description, category, default_severity, standard_reference, is_global, created_at`.

### קבצים שמורים

- `docs/schema_diff_20260409/local_schema.sql`
- `docs/schema_diff_20260409/remote_schema.sql`
- `docs/schema_diff_20260409/diff.txt`

---

## חלק 3: Code-DB Mismatches

### Types file

אין קובץ `database.types.ts` אוטומטי מ-Supabase בפרויקט. הקוד משתמש ב-type assertions ידניים — אין validation בזמן build שהעמודות קיימות.

### Hooks שנבדקו

| Hook                                 | טבלה               | עמודות שנקראות                                         | Local | Remote |
| ------------------------------------ | ------------------ | ------------------------------------------------------ | ----- | ------ |
| `useReportContent`                   | `delivery_reports` | `report_content`                                       | ✅    | ✅     |
| `useReportShortages`                 | `delivery_reports` | `client_*, tenant_*, property_*, report_content`       | ✅    | ✅     |
| `useInspectorSettings`               | `users`            | `inspector_settings`                                   | ✅    | ✅     |
| `usePdfGeneration`                   | `delivery_reports` | 16 snapshot fields + 026 fields                        | ✅    | ✅     |
| `usePdfGeneration`                   | `defects`          | `standard_ref, recommendation, notes, cost, cost_unit` | ✅    | ❌     |
| `usePdfGeneration`                   | `defect_photos`    | `annotations_json`                                     | ✅    | ❌     |
| `useReport`                          | `defects`          | `standard_ref`                                         | ✅    | ❌     |
| `useDefectLibrary`                   | `defect_library`   | `standard_reference, description, category, is_global` | ✅    | ✅     |
| `createReportWithSnapshot` (Phase 1) | `users`            | `signature_url, stamp_url`                             | ✅    | ❌     |
| `useSignature`                       | `users`            | `stamp_url` (UPDATE)                                   | ✅    | ❌     |

### קוד נוסף שנכשל ב-Remote

| קובץ                                        | שורה                                                                      | בעיה                  |
| ------------------------------------------- | ------------------------------------------------------------------------- | --------------------- |
| `app/(app)/reports/[id]/add-defect.tsx:357` | `INSERT defects { standard_ref, recommendation, notes, cost, cost_unit }` | ❌ 5 עמודות לא קיימות |
| `app/(app)/reports/[id]/add-defect.tsx:416` | `INSERT defect_photos { annotations_json }`                               | ❌ עמודה לא קיימת     |
| `hooks/useSignature.ts:143,171`             | `UPDATE users SET stamp_url = ...`                                        | ❌ עמודה לא קיימת     |
| `lib/createReportWithSnapshot.ts:64`        | `SELECT stamp_url FROM users`                                             | ❌ עמודה לא קיימת     |

### Cross-reference: שדות מ-026

כל 14 השדות של migration 026 **קיימים ב-Local וב-Remote**. ה-Phase 0 push עבד.

---

## רמת הסיכון

### 🔴 קריטי — חוסם משתמשים ב-Remote

1. **יצירת דוח (wizard + quick create)** — Phase 1's `createReportWithSnapshot` קורס מיד כי הוא קורא `stamp_url`
2. **הוספת defect** — `INSERT INTO defects` קורס על 5 עמודות חסרות + `annotations_json` על תמונות
3. **טעינת דוח (useReport)** — `SELECT standard_ref` קורס
4. **הפקת PDF** — קורס על `standard_ref, recommendation, notes, cost, cost_unit, annotations_json`
5. **עדכון חותמת מפקח (useSignature)** — `UPDATE users SET stamp_url` קורס

### 🟠 בינוני

6. **AuthContext `select('*')` על users** — לא קורס, אבל `stampUrl` תמיד undefined ב-Remote (כי אין עמודה)

### 🟡 קוסמטי

7. **12 עמודות עודפות ב-`defect_library` של Remote** — לא משפיעות על הקוד (הקוד לא קורא אותן), אבל הן schema drift מתועד

---

## ההמלצה לתיקון

### אופציה A: Migration 030 — Remote Catchup (מומלץ)

יצירת migration חדשה שמבצעת ידנית את מה ש-017, 018, 020 היו אמורות לעשות — עם `IF NOT EXISTS` ו-`DO $$ ... EXCEPTION`:

```sql
-- 030_remote_catchup.sql (idempotent)
ALTER TABLE users ADD COLUMN IF NOT EXISTS stamp_url TEXT;
ALTER TABLE defect_photos ADD COLUMN IF NOT EXISTS annotations_json JSONB;

DO $$
BEGIN
    ALTER TABLE defects RENAME COLUMN standard_reference TO standard_ref;
EXCEPTION WHEN undefined_column THEN NULL;
WHEN duplicate_column THEN NULL;
END $$;

ALTER TABLE defects ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE defects ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE defects ADD COLUMN IF NOT EXISTS cost NUMERIC(10,2);
ALTER TABLE defects ADD COLUMN IF NOT EXISTS cost_unit TEXT;
```

- בטוח להרצה גם ב-Local (לא ישנה כלום כי כבר קיים)
- בטוח להרצה גם ב-Remote (יוסיף את מה שחסר)
- פותר את כל 5 הבעיות הקריטיות במכה אחת

### אופציה B: לתעד את ה-12 עמודות העודפות

ליצור migration 031 שמוסיף את הסכימה של `defect_library` הנוסף לקבצי ה-migration המקומיים, כדי להשיג sync אמיתי. דורש להחליט קודם: האם הקוד צריך להשתמש בעמודות האלה? אם לא — אולי למחוק אותן מ-Remote במקום.

### אופציה C: דחייה

להתעלם לפי שעה ולעבוד רק מול Local. זה מסוכן כי כל deployment ל-Remote יכשל ברגע שמישהו ינסה ליצור דוח/defect.

---

## שאלות פתוחות לחיים

1. **אופציה A או B?** לדעתי **A** — תיקון מיידי של 5 בעיות קריטיות. ל-B (defect_library) לטפל בשלב נפרד כי זה דורש החלטות מוצר.

2. **ה-12 עמודות העודפות ב-defect_library** — יש להן שימוש מתוכנן? זה נראה כמו גרסה עשירה יותר של defect library (עם cost, location, usage tracking). מישהו התחיל לבנות את זה?

3. **איך זה קרה?** ה-migrations 017/018/020 מסומנות applied. האם Haim הריץ `migration repair` בעבר? או שזה קרה אוטומטית בזמן push שחלקית נכשל?

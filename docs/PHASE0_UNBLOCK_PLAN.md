# Phase 0 — תכנית Unblock

תאריך: 2026-04-09

## גיבוי

- קובץ: ~/infield/backups/db_backup_phase0_20260409_000932.sql
- גודל: 378K
- סטטוס: ✅ נוצר בהצלחה

## מצב נוכחי של ה-DB

### migrations שהוחלו (001-024): ✅

כל ה-migrations מ-001 עד 024 כולל מוחלות מקומית.

### migrations שלא הוחלו:

| קובץ                                   | סטטוס      |
| -------------------------------------- | ---------- |
| 025_add_user_first_name_profession.sql | ❌ לא הוחל |
| 025_oauth_support.sql                  | ❌ לא הוחל |
| 026_pdf_infrastructure.sql             | ❌ לא הוחל |

### עמודות חסרות ב-DB שהקוד מסתמך עליהן:

- `users`: חסרים `first_name`, `profession`, `avatar_url`, `provider`, `inspector_settings`
- `delivery_reports`: חסרים `report_number`, `client_name`, `client_phone`, `client_email`, `client_id_number`, `property_type`, `property_area`, `property_floor`, `property_description`, `report_content`, `pdf_draft_url`, `weather_conditions`, `contractor_name`, `contractor_phone`
- `defect_photos`: חסר `caption`

---

## ניתוח 024 vs 019

### מה 019 עושה:

```sql
ALTER TABLE delivery_reports
  ADD COLUMN IF NOT EXISTS checklist_state JSONB NOT NULL DEFAULT '{}'::jsonb;
```

מוסיף עמודת `checklist_state` עם `NOT NULL` ו-default `'{}'`.

### מה 024 עושה:

```sql
ALTER TABLE delivery_reports
    ADD COLUMN IF NOT EXISTS checklist_state jsonb DEFAULT '{}'::jsonb;
```

מוסיף את אותה עמודה **בלי** `NOT NULL`.

### דלתא:

ההבדל היחיד: 019 כולל `NOT NULL`, 024 לא. אבל בפועל **024 כבר הוחל** ועבר בהצלחה כי שניהם משתמשים ב-`IF NOT EXISTS` — העמודה כבר הייתה קיימת מ-019, אז 024 היה no-op.

### ⚠️ אין צורך בפעולה — 024 כבר הוחל ולא שינה כלום.

**ההמלצה שלי לגבי 024:**

- [x] לא לגעת — כבר הוחל כ-no-op, העמודה קיימת עם NOT NULL מ-019

---

## ניתוח 025 (הכפילות)

### 025_add_user_first_name_profession.sql:

מוסיף ל-`users`: עמודת `first_name TEXT` (nullable) ועמודת `profession TEXT` עם CHECK constraint (7 ערכים מותרים). פעולה פשוטה — 2 עמודות חדשות.

### 025_oauth_support.sql:

מוסיף ל-`users`: `avatar_url TEXT`, `provider TEXT` (default 'email', CHECK ל-3 ערכים). גם: הופך `organization_id` ל-nullable, מרפה את ה-CHECK על `full_name`, ומחליף את פונקציית `handle_new_user()` (הטריגר מ-021) בגרסה שמוסיפה `avatar_url` ו-`provider`.

### האם נוגעים באותן עמודות? **לא.** אין התנגשות כלל.

### איזה נוצר קודם?

- `025_add_user_first_name_profession.sql` — נוצר ב-commit `d9b1066` מתאריך 2026-04-07
- `025_oauth_support.sql` — **לא committed** (untracked file), נוצר אחרי

### איזה מהם הקוד מסתמך עליו?

- `first_name` / `profession` — 6 קבצים (settings, register, auth, PDF)
- `avatar_url` / `provider` — 2 קבצים (AuthContext, complete-profile)
- **שניהם נדרשים.**

**ההמלצה שלי לגבי 025:**

- [x] לשנות שם של `025_oauth_support.sql` → `027_oauth_support.sql`

**הסיבה:**

1. `025_add_user_first_name_profession` נוצר קודם ו-committed — הוא ה-025 "האמיתי"
2. `025_oauth_support` לא committed ולא הוחל — בטוח לשנות שם
3. אין תלויות בין שניהם, אז הסדר לא משנה ל-DB
4. 027 מחליף את `handle_new_user()` — חייב לרוץ אחרי 021 (שכבר הוחל), אין בעיה

---

## ניתוח 026

### 026_pdf_infrastructure.sql:

- **14 ALTER TABLE statements** על `delivery_reports` (client details, property details, report content, contractor)
- **1 ALTER TABLE** על `users` (inspector_settings JSONB)
- **1 ALTER TABLE** על `defect_photos` (caption TEXT)
- **2 פונקציות:** `generate_report_number(org_id)` + `set_report_number()` trigger

### טבלאות שנוגע בהן: `delivery_reports`, `users`, `defect_photos`

### עמודות חדשות: 15 עמודות סה"כ

### פעולות מסוכנות: **אין.** הכל ADD COLUMN רגיל (בלי IF NOT EXISTS!) + CREATE OR REPLACE FUNCTION + CREATE TRIGGER.

### ⚠️ סיכון קטן: ה-ADD COLUMN בלי `IF NOT EXISTS` — אם מריצים פעמיים, ייכשל. אבל כי זו migration, זה לא בעיה (Supabase לא יריץ פעמיים).

---

## תכנית הרצה מוצעת

הסדר המוצע (לפי תלויות):

| סדר | Migration                                                   | מה עושה                                  | תלוי ב-        |
| --- | ----------------------------------------------------------- | ---------------------------------------- | -------------- |
| 1   | שינוי שם: `025_oauth_support.sql` → `027_oauth_support.sql` | פתרון כפילות                             | —              |
| 2   | הרצת 025 (`add_user_first_name_profession`)                 | `first_name`, `profession` ב-users       | —              |
| 3   | הרצת 026 (`pdf_infrastructure`)                             | 15 עמודות + trigger                      | —              |
| 4   | הרצת 027 (`oauth_support`)                                  | `avatar_url`, `provider`, trigger update | 021 (כבר הוחל) |

**אחרי כל migration:**

- `npm run typecheck` — 0 errors
- פתיחת האפליקציה ובדיקה שלא קורסת

## סיכונים שזיהיתי

| סיכון                                                                      | חומרה     | מיטיגציה                                                                                       |
| -------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------- |
| 025 (first_name) — ADD COLUMN בלי IF NOT EXISTS, ייכשל אם העמודה כבר קיימת | 🟡 נמוך   | בדקנו — העמודה לא קיימת                                                                        |
| 026 — ADD COLUMN report_content עם NOT NULL DEFAULT, על טבלה עם data       | 🟡 נמוך   | מקומי בלבד, מעט data                                                                           |
| 027 — מחליף handle_new_user() trigger שכבר שונה ב-021                      | 🟡 נמוך   | הגרסה ב-027 היא superset של 021, כוללת avatar_url + provider                                   |
| 027 — DROP CONSTRAINT users_full_name_check                                | 🟡 נמוך   | מחליף ב-constraint רחב יותר (char_length >= 0)                                                 |
| 027 — ALTER COLUMN organization_id DROP NOT NULL                           | 🟠 בינוני | שינוי semantic — OAuth users יכולים להיות בלי org. הקוד כבר מתוכנן לזה (complete-profile flow) |

## סיכון כללי: 🟢 נמוך

כל ה-migrations הן ADD COLUMN / CREATE FUNCTION. אין DROP TABLE, אין שינוי סוג עמודה, אין מחיקת data. הגיבוי קיים למקרה חירום.

## שאלות פתוחות לחיים

1. **האם לשמור את 024 כמו שהוא?** הוא כבר הוחל כ-no-op. אפשר להשאיר (לא מזיק) או למחוק את הקובץ ולהסיר מ-migration history. ההמלצה שלי: **להשאיר** — לא שובר כלום ומחיקה מ-history מסובכת.

2. **025_oauth_support → 027: בסדר?** או שאתה מעדיף מספר אחר / שם אחר?

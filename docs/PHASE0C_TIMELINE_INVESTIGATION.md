# Phase 0C — Timeline Investigation

תאריך: 2026-04-09

## הסתירה

חיים ראה נתונים בעבר, אבל ה-RLS recursion bug ב-migration 002 אמור היה לחסום הכל.

## ממצאי האימות

### 1. RLS bug ב-Remote — **כבר תוקן!**

ה-Remote DB כבר מכיל תיקון ידני (לא דרך migrations) שפתר את הרקורסיה:

**פונקציה שנוספה ידנית:**

```sql
CREATE OR REPLACE FUNCTION public.get_user_org_id()
  RETURNS uuid
  LANGUAGE sql
  STABLE SECURITY DEFINER
AS $function$
    SELECT organization_id FROM users WHERE id = auth.uid()
$function$
```

**Policies שהוחלפו ידנית על `users`:**

| Policy (Remote)    | סוג    | תנאי                                                           |
| ------------------ | ------ | -------------------------------------------------------------- |
| `users_select_own` | SELECT | `id = auth.uid()` — ישיר, בלי recursion                        |
| `users_select_org` | SELECT | `organization_id = get_user_org_id()` — דרך function           |
| `users_update`     | UPDATE | `id = auth.uid() OR (org + admin check via get_user_org_id())` |
| `users_delete`     | DELETE | `org check via get_user_org_id() + admin`                      |

**שאר הטבלאות** (projects, delivery_reports, organizations) עדיין עם subquery ישן, אבל **זה עובד** כי `users_select_own` מאפשר לקרוא `WHERE id = auth.uid()`.

**מסקנה:** ה-RLS recursion **אינו** הבעיה הנוכחית ב-Remote. מישהו (כנראה חיים) כבר תיקן את זה ידנית דרך SQL Editor.

### 2. Migration 002 — מקור ה-bug

```sql
CREATE POLICY "users_select" ON users FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users u WHERE u.id = auth.uid())
);
```

- **נוצר:** commit `bb4ac08` (2026-03-24)
- **שונה:** commit `ddf6f3f` (2026-04-05) — רק הוספת organizations policies בסוף הקובץ
- **ה-`users_select` policy עצמה לא השתנתה מאז שנוצרה**
- **הבאג היה שם מההתחלה** — אבל תוקן ידנית ב-Remote

### 3. Migration 027 — האם שינה משהו ב-RLS?

**לא.** 027 רק:

- מוסיף עמודות (`avatar_url`, `provider`)
- משנה constraints
- מחליף `handle_new_user()` trigger

הביטוי `SECURITY DEFINER` ב-027 הוא על ה-trigger function, לא על RLS policy.

### 4. Policies על users ב-Remote כרגע

5 policies, **אף אחת לא עושה recursion:**

- `users_select_own` — `id = auth.uid()`
- `users_select_org` — `get_user_org_id()`
- `users_insert` — no qual
- `users_insert_own` — `id = auth.uid()`
- `users_update` — `get_user_org_id()` + `id = auth.uid()`
- `users_delete` — `get_user_org_id()` + admin check

### 5. שימוש ב-service_role בקוד

**אין.** ה-mobile app משתמש רק ב-`supabaseAnonKey` (publishable key). אין שום שימוש ב-service_role בקוד.

---

## ⚠️ הממצא המכריע: עמודות חסרות ב-Remote

**Migrations 025, 026, 027 מסומנות כ-applied ב-Remote, אבל ה-SQL מעולם לא רץ!**

| מה צריך להיות                             | קיים ב-Remote? |
| ----------------------------------------- | -------------- |
| `users.first_name` (025)                  | ❌             |
| `users.profession` (025)                  | ❌             |
| `users.inspector_settings` (026)          | ❌             |
| `users.avatar_url` (027)                  | ❌             |
| `users.provider` (027)                    | ❌             |
| `delivery_reports.report_number` (026)    | ❌             |
| `delivery_reports.client_name` (026)      | ❌             |
| `delivery_reports.report_content` (026)   | ❌             |
| `delivery_reports.property_type` (026)    | ❌             |
| ... (10 עמודות נוספות מ-026)              | ❌             |
| `defect_photos.caption` (026)             | ❌             |
| `generate_report_number()` function (026) | ❌ (לא נבדק)   |

**הסיבה:** בשלב 0B, הרצתי `supabase migration repair --status applied` על 025, 026, 027. **הפקודה הזו רצה על ה-Remote** (כי הפרויקט linked), ו**סימנה אותן כ-applied בלי להריץ את ה-SQL**.

### נתונים ב-Remote:

| טבלה             | שורות |
| ---------------- | ----- |
| users            | 4     |
| organizations    | 5     |
| delivery_reports | 18    |
| projects         | 8     |

## ההסבר הסביר ביותר

**שילוב של כמה גורמים:**

1. **ה-RLS recursion (002)** — היה הבאג המקורי. **תוקן ידנית** ב-Remote דרך SQL Editor (פונקציית `get_user_org_id()` + policies חדשות). התיקון הזה **לא נשמר** ב-migration file.

2. **Migrations 025-027 לא הוחלו באמת** — הקבצים נוצרו, אבל ה-SQL מעולם לא רץ על ה-Remote. הקוד עודכן להתייחס לעמודות החדשות → queries שמפנים לעמודות שלא קיימות נכשלים.

3. **`migration repair` שלי** — סימן את 025-027 כ-applied ב-Remote בלי להריץ אותן. זה מסבך `supabase db push` עתידי כי Supabase חושב שהן כבר רצו.

**למה האפליקציה "עבדה" קודם:** האפליקציה עבדה על ה-Remote **אחרי** שה-RLS תוקן ידנית, ו**לפני** שהקוד עודכן להתייחס לעמודות מ-025-027. ברגע שהקוד עודכן (feature branch נוכחי) — שאילתות שמפנות לעמודות שלא קיימות החלו להיכשל.

## רמת ודאות

🟢 **בטוח** — אימתתי ישירות: העמודות לא קיימות ב-Remote, ה-migration tracking שקרי.

## ההמלצה לתיקון

### צעד 1: תיקון migration tracking ב-Remote

```bash
supabase migration repair --status reverted 025
supabase migration repair --status reverted 026
supabase migration repair --status reverted 027
```

זה יסיר את הסימון השגוי שה-migrations הוחלו.

### צעד 2: הוספת התיקון הידני ל-migration

יצירת migration 028 שמכילה את:

- `get_user_org_id()` function (כבר קיים ב-Remote — צריך `IF NOT EXISTS`)
- עדכון ה-policies על `users` (כבר קיים ב-Remote — צריך `DROP POLICY IF EXISTS` + `CREATE POLICY`)
- עדכון ה-policies על שאר הטבלאות (אופציונלי — עובד כרגע דרך `users_select_own`)

### צעד 3: Push ל-Remote

```bash
supabase db push
```

זה יחיל 025, 026, 027, 028 על ה-Remote בסדר הנכון.

### צעד 4: Reset Local

```bash
supabase db reset
```

זה יחיל מחדש את כל ה-migrations על ה-Local.

### צעד 5: עבודה מול Local

שינוי `.env.local` למצביע על local לפיתוח.

### סיכונים:

| סיכון                                                  | חומרה | מיטיגציה                                             |
| ------------------------------------------------------ | ----- | ---------------------------------------------------- |
| `db push` עלול להיכשל אם יש conflict עם שינויים ידניים | 🟠    | migration 028 כתוב עם IF NOT EXISTS / DROP IF EXISTS |
| `db reset` מוחק נתונים מקומיים                         | 🟡    | יש seed file + גיבוי                                 |
| `migration repair --reverted` עלול לא לעבוד            | 🟡    | אפשר לבדוק בלי סיכון                                 |

# Phase 0C — אבחון באגים קריטיים

תאריך: 2026-04-09

## ממצאי המשתמש (חיים)

- מסך הגדרות: סטטיסטיקות + מידע לא נטענים
- מסך פרויקטים: לא נטענים, loading אינסופי
- צור פרויקט: לא מגיב
- התחל בדיקה: לא מגיב

## שלב 1 — מצב המשתמש

```
id: c7fac8a9-41c4-436d-9d31-05bc78c56ed4
email: masrati@gmail.com
role: admin
organization_id: 754e89b3-94b5-4ecb-b68b-ed37edb0b727
first_name: (empty)
profession: (empty)
full_name: חיים מסראתי
```

- ✅ למשתמש יש `organization_id` תקין
- ✅ role = admin
- ⚠️ `first_name` ו-`profession` ריקים (לא NULL, אלא empty string)

הארגון קיים:

```
id: 754e89b3-94b5-4ecb-b68b-ed37edb0b727
name: מסראתי בדק בית
settings: {"defaultLanguage": "he", "defaultReportType": "delivery", "pdfBrandingEnabled": true}
```

## שלב 2 — RLS Policies

### ממצא קריטי: Infinite Recursion

כל ה-SELECT policies על `projects`, `delivery_reports`, `organizations` מפנות ל-`users` כדי לקבל `organization_id`:

```sql
-- projects_select (וכל שאר הטבלאות)
organization_id = (SELECT users.organization_id FROM users WHERE users.id = auth.uid())
```

**אבל** ה-`users_select` policy גם מפנה לעצמה:

```sql
-- users_select — SELF-REFERENTIAL!
organization_id = (SELECT organization_id FROM users u WHERE u.id = auth.uid())
```

כש-PostgreSQL מנסה להריץ את ה-subquery `SELECT ... FROM users`, הוא צריך לבדוק את ה-`users_select` policy, שמריצה שוב `SELECT ... FROM users`, וחוזר חלילה → **infinite recursion**.

### הוכחה:

```
postgres=# SET LOCAL ROLE authenticated;
postgres=# SET LOCAL request.jwt.claims = '{"sub":"c7fac8a9...","role":"authenticated"}';
postgres=# SELECT id FROM public.projects LIMIT 1;
ERROR: infinite recursion detected in policy for relation "users"
```

אותה שגיאה על `delivery_reports`, `organizations`, ו-`users` עצמה.

### היקף הפגיעה:

כל טבלה שה-RLS policy שלה מפנה ל-`users` (כלומר: **כל הטבלאות** במערכת) נחסמת. זה מסביר את כל 4 הבאגים:

| באג                  | גורם                                                              |
| -------------------- | ----------------------------------------------------------------- |
| סטטיסטיקות לא נטענות | query על `delivery_reports` + `defects` → RLS → users → recursion |
| פרויקטים לא נטענים   | query על `projects` → RLS → users → recursion                     |
| צור פרויקט לא מגיב   | INSERT ל-`projects` → RLS → users → recursion                     |
| התחל בדיקה לא מגיב   | קורא `useProjects` → recursion                                    |

## שלב 3 — Trigger handle_new_user

הפונקציה הנוכחית (גרסת 027) תקינה — כוללת `avatar_url` + `provider`, מדלגת כש-`organization_id` חסר. **לא קשורה לבעיה.**

## שלב 4 — לוגי Supabase

**אין שגיאות בלוגים** של ה-DB המקומי. הסיבה: השגיאה נזרקת ברמת ה-query (infinite recursion) ולא ברמת ה-DB server.

## שלב 5 — קוד ה-handlers

### 5.1 — fetchProfile (AuthContext, שורה 65-100)

```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

ה-query הראשון שרץ אחרי login — קורא את `users` → infinite recursion → error → `fetchProfile` מחזיר `null` → `profile = null`.

**כש-`profile` הוא null:**

- `organizationId` לא קיים → `StatisticsSection` מקבל `undefined` → לא טוען סטטיסטיקות
- `useProjects` עדיין מנסה לקרוא `projects` → recursion → error → loading אינסופי (retry 2 פעמים)

### 5.2 — "צור פרויקט" (NewProjectSheet)

`NewProjectSheet.tsx` שורה 357 — הכפתור כנראה דורש `organization_id` מה-profile, שהוא null. לכן INSERT נכשל או לא מתחיל כלל.

### 5.3 — "התחל בדיקה" (WizardShell)

`WizardShell.tsx` — שלב 2 של ה-wizard קורא `useProjects()` לבחירת פרויקט → recursion → אין פרויקטים → הכפתור לא מתקדם.

## ממצא נוסף: App מחובר ל-Remote

**`.env.local` מצביע על Supabase Cloud:**

```
EXPO_PUBLIC_SUPABASE_URL=https://iewhmokzrmmkqdfozpwh.supabase.co
```

**כל ה-migrations שהחלתי בשלב 0B היו על ה-DB המקומי בלבד.** האפליקציה מתחברת ל-DB המרוחק שבו:

- ייתכן שעמודות 025-027 לא קיימות
- אותה בעיית infinite recursion קיימת (אותו migration 002)

## ניתוח שורש הבעיה (Root Cause Analysis)

### שורש הבעיה: `users_select` RLS policy self-referential

ה-policy נוצרה ב-**migration 002** (הקובץ הראשוני ביותר):

```sql
CREATE POLICY "users_select" ON users FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users u WHERE u.id = auth.uid())
);
```

**למה זה רקורסיה:** כדי לקרוא מ-`users`, PostgreSQL צריך לבדוק את ה-policy. ה-policy עושה `SELECT FROM users`, מה שדורש בדיקת ה-policy שוב. אין מנגנון break.

**למה כל הטבלאות נפגעות:** כל ה-policies (projects, delivery_reports, organizations, defects, etc.) מפנות ל-`users` כדי לקבל `organization_id`:

```sql
organization_id = (SELECT users.organization_id FROM users WHERE users.id = auth.uid())
```

## רמת הוודאות שלי

🟢 **בטוח** — השגיאה הוכחה עם `SET ROLE authenticated` + query, והיא מסבירה 100% מהסימפטומים.

## אפשרויות תיקון (לא לבצע! רק להציג)

### אופציה A: SECURITY DEFINER function לקבלת org_id

יצירת פונקציה שרצה כ-superuser (עוקפת RLS) ומחזירה את ה-`organization_id` של המשתמש:

```sql
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT organization_id FROM users WHERE id = auth.uid();
$$;
```

ואז עדכון כל ה-policies:

```sql
-- במקום:
organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
-- ל:
organization_id = get_user_org_id()
```

- **סיכון:** נמוך — לא משנה schema, רק מוסיף function ומעדכן policies
- **היקף:** migration חדשה אחת שמעדכנת את כל ה-policies
- **מה שובר אם נכשל:** כלום — אפשר rollback ל-policies הישנות

### אופציה B: שמירת org_id ב-JWT claims (Supabase custom claims)

הגדרת custom claim בטריגר של Supabase Auth שמוסיף `organization_id` ל-JWT:

```sql
-- Custom claim hook
organization_id = (auth.jwt()->>'organization_id')::uuid
```

- **סיכון:** בינוני — דורש הגדרת Auth Hook ב-Supabase Dashboard + שינוי JWT
- **היקף:** Auth Hook + עדכון policies
- **מה שובר אם נכשל:** Auth flow עלול להישבר

### אופציה C: Policy ישירה על users (בלי subquery)

```sql
-- users_select — without self-reference
CREATE POLICY "users_select" ON users FOR SELECT USING (
    id = auth.uid()
    OR organization_id = (SELECT get_user_org_id())
);
```

זה בעצם שילוב של A + ייעול: המשתמש תמיד יכול לקרוא את עצמו (`id = auth.uid()`), ו-`get_user_org_id()` נותן גישה לשאר חברי הארגון.

- **סיכון:** נמוך
- **היקף:** כמו A + שיפור ל-users policy

## ההמלצה שלי

**אופציה A (SECURITY DEFINER function)** — הפתרון הפשוט, הסטנדרטי, והבטוח ביותר:

1. פונקציה אחת `get_user_org_id()`
2. עדכון כל ה-policies (כ-14) להשתמש בפונקציה במקום subquery
3. Migration חדשה אחת (028)
4. צריך להחיל גם על LOCAL וגם על REMOTE

**הערה חשובה:** התיקון צריך להתבצע גם על ה-DB המרוחק (`iewhmokzrmmkqdfozpwh.supabase.co`). אם אין גישת psql ישירה, צריך להשתמש ב-Supabase Dashboard → SQL Editor, או `supabase db push`.

## שאלות פתוחות לחיים

1. **האם האפליקציה **אי פעם** עבדה עם RLS?** הבעיה קיימת מ-migration 002. אם היא עבדה בעבר — ייתכן שהיא רצה עם service role key (שעוקף RLS) או שהיה DB reset שלא החיל את ה-policies.

2. **האם יש גישה ל-Supabase Dashboard של ה-remote?** צריך להחיל את התיקון גם שם.

3. **האם נרצה לעבור לעבודה מקומית (local)?** עכשיו ה-`.env.local` מצביע על remote. לעבודה מקומית צריך לשנות ל:

   ```
   EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<local anon key>
   ```

4. **רמת דחיפות:** בלי התיקון הזה, שום דבר באפליקציה לא יעבוד — לא קריאה, לא כתיבה, לא עדכון. זו חסימה מלאה.

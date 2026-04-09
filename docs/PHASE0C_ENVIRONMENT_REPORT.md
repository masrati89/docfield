# Environment Diagnosis Report

תאריך: 2026-04-09

## חלק 1 — מה האפליקציה משתמשת בו?

**SUPABASE_URL ב-.env.local:** `https://iewhmokzrmmkqdfozpwh.supabase.co`
**זה Local או Remote?** **Remote** (Supabase Cloud)
**Project ref:** `iewhmokzrmmkqdfozpwh`
**Project name:** inField
**Region:** Central EU (Frankfurt)
**Linked ב-CLI:** ✅ כן (●)

**משמעות:** האפליקציה מתחברת ל-DB מרוחק. ה-Local DB רץ אבל לא בשימוש ע"י האפליקציה.

## חלק 2 — מצב Local

| פרמטר                               | ערך                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| Local Supabase רץ                   | ✅ כן                                                                             |
| API URL                             | `http://127.0.0.1:54321`                                                          |
| DB URL                              | `postgresql://postgres:postgres@127.0.0.1:54322/postgres`                         |
| Migrations ב-`schema_migrations`    | **20 בלבד** (001-020)                                                             |
| Migrations שהוחלו ידנית (psql)      | 025, 026, 027 — **העמודות קיימות, אבל לא רשומות ב-`schema_migrations`**           |
| 021-024                             | הקבצים קיימים, **אבל לא רשומים ב-`schema_migrations`**                            |
| משתמשים                             | 1                                                                                 |
| ארגונים                             | 1                                                                                 |
| דוחות                               | 3                                                                                 |
| פרויקטים                            | 2                                                                                 |
| ליקויים                             | 5                                                                                 |
| RLS recursion bug                   | ✅ **קיים ומאומת** — `infinite recursion detected in policy for relation "users"` |
| `users_insert_own` policy (023)     | ❌ **לא קיימת**                                                                   |
| `organizations_insert` policy (022) | ❌ **לא קיימת**                                                                   |

### ⚠️ בעיה ב-Local: ה-`schema_migrations` לא מסונכרן

ה-`supabase migration repair` שהרצתי בשלב 0B עדכן את ה-CLI tracking, אבל **לא** את טבלת `supabase_migrations.schema_migrations`. בפועל:

- העמודות מ-025/026/027 **כן קיימות** ב-DB (הוחלו ידנית)
- ה-policies מ-022/023 **לא קיימות** (ה-SQL מעולם לא רץ על ה-Local)
- Migrations 021-024 — לא ברור מה הסטטוס שלהם: הקבצים קיימים, ה-CLI חושב שהם מוחלים, אבל `schema_migrations` לא כולל אותם

## חלק 3 — מצב Remote

| פרמטר                       | ערך                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------- |
| יש גישת CLI ל-remote        | ✅ כן (access-token קיים, project linked)                                           |
| Migrations מוחלות ב-Remote  | **27** (001-027 כולן)                                                               |
| 025/026/027 מוחלות ב-Remote | ✅ **כן**                                                                           |
| נתונים ב-Remote             | **לא נבדק** (דורש אישור)                                                            |
| RLS recursion bug ב-Remote  | **לא נבדק ישירות**, אבל ה-`users_select` policy (מ-002) זהה → **כמעט בוודאות קיים** |

**משמעות:** ה-Remote DB **כבר כולל** את כל ה-migrations, כולל 025-027. הבעיה היא **לא** חוסר עמודות. הבעיה היא **RLS recursion** שקיים מ-migration 002.

## חלק 4 — האבחון

**ההסבר הסביר ביותר:**

**אופציה ב + RLS bug:** ה-Remote הוא ה-DB הפעיל. ה-Local הוא עותק פיתוח שלא בשימוש ע"י האפליקציה. **שתי ה-DBs סובלות מאותו באג:** ה-`users_select` RLS policy מ-migration 002 יוצרת infinite recursion.

**למה האפליקציה "עבדה" קודם:** ייתכנו מספר הסברים:

1. **האפליקציה מעולם לא עבדה באמת עם RLS** — ייתכן שהמשתמש ביצע login ואז ה-fetchProfile נכשל בשקט (catch → null), והאפליקציה הציגה מסכים ריקים שנראו כ"עובדים"
2. **ייתכן שהנתונים היו מוכנסים בדרך שעוקפת RLS** (service role, SQL editor, seed) — אז הם קיימים ב-DB, אבל ברגע שמנסים לקרוא אותם דרך ה-client → recursion
3. **ייתכן שהתנהגות Supabase Cloud שונה** מ-local לגבי self-referential policies (פחות סביר)

**רמת ודאות:** 🟠 **סביר מאוד** — הבאג מוכח מקומית, וה-policy זהה ב-remote. אבל לא אימתתי ישירות על ה-remote.

## חלק 5 — שאלות פתוחות לחיים

1. **האם תרצה שאבדוק RLS ישירות על ה-Remote?** אני יכול להריץ query בודד (SELECT קריאה בלבד) דרך Supabase SQL Editor API לאמת שהבאג קיים גם שם. אצטרך אישור.

2. **האם האפליקציה אי פעם הציגה נתונים אמיתיים?** כלומר: האם ראית פרויקטים, דוחות, או סטטיסטיקות שנטענו מה-DB? או שהנתונים היו תמיד ריקים/demo?

3. **איפה נרצה לעבוד?** Local או Remote? (ראה אופציות למטה)

4. **מצב ה-Local DB:** ה-`schema_migrations` לא מסונכרן — צריך להחליט אם לתקן (supabase db reset) או להתעלם.

## חלק 6 — אופציות תיקון אפשריות

### אופציה A: לתקן רק ב-Remote (באמצעות `supabase db push` או SQL Editor)

**מתי מתאים:** אם ממשיכים לפתח מול Remote
**מה דורש:**

- Migration 028 שיוצרת `get_user_org_id()` function ומעדכנת כל ה-policies
- להריץ על Remote דרך `supabase db push` (CLI linked) או SQL Editor
  **סיכון:** 🟡 נמוך — רק מוסיפים function ומחליפים policies
  **יתרון:** מתקן את הבאג ישירות על מה שהאפליקציה משתמשת בו

### אופציה B: לעבור ל-Local-only ולתקן שם

**מתי מתאים:** אם רוצים פיתוח מקומי מבודד
**מה דורש:**

1. `supabase db reset` — מחיל מחדש את כל ה-migrations (כולל 021-027) בסדר הנכון
2. Migration 028 — תיקון RLS
3. שינוי `.env.local` ל-`http://127.0.0.1:54321` + local anon key
   **סיכון:** 🟠 בינוני — `db reset` מוחק את כל הנתונים המקומיים (אבל יש seed)
   **יתרון:** פיתוח מקומי = מהיר יותר, לא תלוי באינטרנט, לא מסכן נתוני production

### אופציה C: לתקן בשניהם

**מתי מתאים:** אם רוצים ששני הסביבות יהיו תקינות
**מה דורש:**

1. Migration 028 (RLS fix)
2. `supabase db reset` מקומית
3. `supabase db push` לרמוט
   **סיכון:** 🟡 נמוך — שתי פעולות ידועות
   **יתרון:** שני ה-DBs עובדים, אפשר לעבור ביניהם

### אופציה D: Reset + Local-first + push לאחר כך

**מתי מתאים:** הכי נקי — מתחילים "נקי" מקומית, מוודאים שהכל עובד, ואז דוחפים ל-remote
**מה דורש:**

1. כתיבת Migration 028 (RLS fix)
2. `supabase db reset` מקומית (מחיל הכל מ-001 עד 028 בסדר)
3. שינוי `.env.local` → local
4. בדיקה מקומית שהכל עובד
5. `supabase db push` ל-remote
6. (אופציונלי) החזרת `.env.local` → remote
   **סיכון:** 🟢 הכי נמוך — מאמתים מקומית לפני שנוגעים ב-remote
   **יתרון:** תהליך בטוח ומסודר, שני ה-DBs מסונכרנים בסוף

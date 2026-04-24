# הכנה לחנויות אפליקציות — inField

## Google Play — Data Safety Form

מלא את הטופס הזה ב-Google Play Console → App content → Data safety.

### שאלה 1: האם האפליקציה אוספת או משתפת נתוני משתמש?

**תשובה: כן**

### שאלה 2: האם כל נתוני המשתמש מוצפנים בהעברה?

**תשובה: כן** (TLS/SSL לכל התקשורת עם Supabase)

### שאלה 3: האם המשתמשים יכולים לבקש מחיקת נתונים?

**תשובה: כן** (דרך הגדרות → מחיקת חשבון, או פנייה ל-privacy@infield.app)

### סוגי נתונים שנאספים:

| קטגוריה                  | סוג נתון         | נאסף?          | משותף? | מטרה               |
| ------------------------ | ---------------- | -------------- | ------ | ------------------ |
| Personal info            | Name             | כן             | לא     | App functionality  |
| Personal info            | Email address    | כן             | לא     | Account management |
| Personal info            | Phone number     | כן             | לא     | App functionality  |
| Photos and videos        | Photos           | כן             | לא     | App functionality  |
| App activity             | App interactions | כן             | לא     | Analytics          |
| App info and performance | Crash logs       | כן             | לא     | Analytics          |
| Device or other IDs      | Device ID        | כן (anonymous) | לא     | Analytics          |

### סוגי נתונים שלא נאספים:

- Financial info (payment via App Store/Play Store)
- Location
- Contacts
- Messages
- Audio
- Files and docs (beyond what user creates in-app)
- Calendar
- Browsing history
- Search history

---

## Google Play — IARC Content Rating

מלא ב-Google Play Console → App content → Content rating → Start questionnaire.

### תשובות לשאלון:

| שאלה                                          | תשובה                      |
| --------------------------------------------- | -------------------------- |
| Category                                      | Utility                    |
| Does the app contain violence?                | No                         |
| Does the app contain sexual content?          | No                         |
| Does the app feature gambling?                | No                         |
| Does the app contain profanity?               | No                         |
| Does the app feature drug/alcohol references? | No                         |
| Does the app feature user-generated content?  | Yes (reports, photos)      |
| Does the app allow users to communicate?      | No                         |
| Does the app share user location?             | No                         |
| Does the app allow purchases?                 | Yes (in-app subscriptions) |

**דירוג צפוי:** Everyone / 4+ (PEGI 3)

---

## Apple TestFlight — Beta App Review Info

### מידע נדרש:

| שדה                   | ערך                                                                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App Name              | inField                                                                                                                                                                                                                     |
| Beta App Description  | Construction inspection management app for the Israeli market. Enables inspectors to create bedek bayit (defect inspection) and delivery protocol reports with photos, annotations, digital signatures, and PDF generation. |
| Feedback Email        | beta@infield.app                                                                                                                                                                                                            |
| Privacy Policy URL    | https://infield.app/privacy (העלה את privacy-policy.html לשם)                                                                                                                                                               |
| Demo Account Email    | demo@infield.app                                                                                                                                                                                                            |
| Demo Account Password | (צור חשבון דמו ב-Supabase)                                                                                                                                                                                                  |
| What to Test          | 1. Create a new inspection report<br>2. Add defects with photos<br>3. Complete a checklist<br>4. Generate PDF<br>5. Share PDF                                                                                               |

---

## Apple App Store — Metadata

| שדה                  | ערך                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------- |
| App Name             | inField - ביקורת בנייה                                                                  |
| Subtitle             | דוחות בדק בית ומסירה                                                                    |
| Category             | Business                                                                                |
| Secondary Category   | Productivity                                                                            |
| Keywords (100 chars) | בדק בית,ביקורת בנייה,מסירת דירה,ליקויי בנייה,דוח בדיקה,פרוטוקול,inspection,construction |
| Privacy Policy URL   | https://infield.app/privacy                                                             |
| Support URL          | https://infield.app/support                                                             |
| Marketing URL        | https://infield.app                                                                     |

### תיאור מלא (עברית):

> inField — אפליקציית ביקורת בנייה חכמה למפקחים ויועצים מקצועיים.
>
> צרו דוחות בדק בית ופרוטוקולי מסירה מקצועיים ישירות מהשטח:
>
> ✓ תיעוד ליקויים עם מצלמה ואנוטציות
> ✓ צ'קליסט מסירה מובנה
> ✓ חתימה דיגיטלית של מפקח ודייר
> ✓ הפקת דוח PDF מקצועי ברגע
> ✓ ניהול פרויקטים, בניינים ודירות
> ✓ ספריית ליקויים עם 338 ליקויים מוכנים
> ✓ מעקב סבבי בדיקה (סבב 1, 2 ואילך)
>
> מיועד למפקחי בנייה, מהנדסים, יועצי בדק בית, קבלנים ויזמי נדל"ן.
>
> חינם עד 3 דוחות. מנויים מ-₪99/חודש.

---

## Google Play — Store Listing

| שדה                          | ערך                                                                    |
| ---------------------------- | ---------------------------------------------------------------------- |
| App name                     | inField - ביקורת בנייה                                                 |
| Short description (80 chars) | דוחות בדק בית ומסירת דירה — צילום, אנוטציה, חתימה דיגיטלית ו-PDF מהשטח |
| Full description             | (אותו תיאור כמו ב-App Store למעלה)                                     |
| Category                     | Business                                                               |
| Content Rating               | Everyone                                                               |
| Privacy Policy               | https://infield.app/privacy                                            |

---

## צילומי מסך נדרשים

### iOS:

- 6.7" (iPhone 15 Pro Max): 1290 × 2796
- 6.5" (iPhone 14 Plus): 1284 × 2778
- 5.5" (iPhone 8 Plus): 1242 × 2208
- iPad Pro 12.9": 2048 × 2732

### Android:

- לפחות 2 צילומים (מומלץ 4-8)
- גודל מינימלי: 320px, מקסימלי: 3840px
- יחס: 16:9 או 9:16

### מסכים מומלצים לצילום (5 מסכים):

1. **דף הבית** — מראה את הדאשבורד עם סטטיסטיקות
2. **רשימת דוחות** — מראה דוחות עם סטטוסים
3. **דוח בודד** — עם ליקויים ותמונות
4. **צ'קליסט מסירה** — עם פריטים מסומנים
5. **דוח PDF** — התוצר הסופי

**איך לצלם:**

1. הפעל את האפליקציה על מכשיר / סימולטור
2. מלא נתוני דמו (פרויקט, דירה, ליקויים)
3. צלם מסך (Power + Volume Up באנדרואיד, Side + Volume Up באייפון)
4. ניתן להוסיף מסגרת עם כלי כמו screenshots.pro

---

## הפעלת Email Confirmation ב-Supabase

### שלבים:

1. היכנס ל-[Supabase Dashboard](https://supabase.com/dashboard)
2. בחר את הפרויקט שלך
3. לך ל-**Authentication** → **Providers** → **Email**
4. הפעל **"Confirm email"** (toggle on)
5. הגדר את תבנית המייל:
   - Subject: `אימות כתובת אימייל — inField`
   - Template: ניתן להשאיר ברירת מחדל או להתאים
6. **חשוב:** ודא שהגדרת SMTP מוגדר (Supabase default שולח עד 4 מיילים/שעה)
   - מומלץ: Resend, SendGrid, או Mailgun
   - הגדרה ב-**Project Settings** → **Auth** → **SMTP Settings**

### בדיקה:

- נסה להירשם עם אימייל חדש
- ודא שמגיע מייל אימות
- ודא שהכניסה נחסמת לפני אימות
- המסך `verify-email.tsx` כבר קיים באפליקציה ✅

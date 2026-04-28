# 🔄 inField — HANDOFF (New Conversation)

> **מטרה:** פתיחת שיחה חדשה עם Claude. קרא את זה קודם, ואז את המסמכים הרלוונטיים למשימה.
> **עודכן:** מרץ 2026

---

## מה זה inField

אפליקציית מובייל (React Native + Expo) להפקת דוחות בדיקה מקצועיים בענף הבנייה בישראל. שני מצבי עבודה:

- **בדק בית** — דוח ליקויים לפי קטגוריות מקצועיות (אינסטלציה, חשמל, טיח...)
- **פרוטוקול מסירה** — צ׳קליסט מסירת דירה לפי חדרים, עם ליקויים

המתחרה העיקרי: Reporto (~80% שוק, WebView hybrid). הבידול שלנו: native feel + אופליין מלא.

## סטטוס נוכחי

**מה מוכן:**

- עיצוב: DESIGN_SYSTEM v7 סופי (18 סעיפים), כל ה-mockups סופיים
- ארכיטקטורה: מודל נתונים מלא, TypeScript interfaces, RLS policies
- תיעוד: כל המסמכים מאוחדים ומעודכנים
- צ׳קליסט: mockup סופי + מפרט implementation

**מה לא ידוע (צריך בדיקה ב-repo):**

- סטטוס ה-repo (מה בנוי, מה רץ, מה שבור)
- האם navigation, Supabase connection, seed data קיימים

**מה הבא:**

- בדיקת מוכנות טכנית ב-repo (מסלול ב׳)
- סגירת פערי תשתית אם יש
- implementation של מסך הצ׳קליסט

## מבנה המסמכים

### ליבה (קרא תמיד)

| מסמך                      | תוכן                                                    |
| ------------------------- | ------------------------------------------------------- |
| `DESIGN_SYSTEM.md`        | מקור אמת לכל עיצוב — צבעים, components, מסכים, PDF      |
| `ARCHITECTURE_INFIELD.md` | מבנה נתונים, סכמות DB, TypeScript interfaces, data flow |
| `SCREEN_STANDARDS.md`     | כללים פונקציונליים שחלים על כל מסך                      |

### לפי משימה

| משימה          | קרא                                                               |
| -------------- | ----------------------------------------------------------------- |
| בניית UI / מסך | DESIGN_SYSTEM + SCREEN_STANDARDS + mockup רלוונטי                 |
| צ׳קליסט        | DESIGN_SYSTEM §14-16 + checklist-implementation-notes.md + mockup |
| Backend / DB   | ARCHITECTURE_INFIELD §5-6                                         |
| אבטחה          | SECURITY_STANDARDS.md                                             |
| PDF            | DESIGN_SYSTEM §12 + mockup רלוונטי                                |

### Mockups (בתיקיית mockups/)

| קובץ                           | מסך                |
| ------------------------------ | ------------------ |
| `DocField-Checklist-FINAL.jsx` | צ׳קליסט — FINAL    |
| `inField-MainScreen-v6.jsx`    | מסך ראשי בדק בית   |
| `inField-AddDefect-v6.jsx`     | טופס הוספת ממצא    |
| `inField-BedekBayit-PDF.jsx`   | PDF בדק בית        |
| `inField-Protocol-PDF.jsx`     | PDF פרוטוקול מסירה |

## כללי עבודה

- **שם המוצר:** inField — מילה אחת, camelCase עם F גדול
- **שפת UI:** עברית, RTL, פונט Rubik
- **שפת קוד:** אנגלית
- **Iron Rule:** דוח = מסמך משפטי. שום שינוי במערכת לא משנה דוח קיים. ממצאים נשמרים כ-snapshot מלא
- **Pixel-perfect:** לבנות ישירות מקוד ה-mockup, לא לפרש את ה-Design System בצורה עצמאית
- **רקע:** cr50 (#FEFDFB) תמיד, אף פעם לבן. צללים חמים בלבד

## טכנולוגיה

```
Mobile:    React Native + Expo SDK 52+
Web:       React + Vite
Monorepo:  Turborepo + npm workspaces
Backend:   Supabase (RLS-enforced multi-tenant)
Data MVP:  React Query + Supabase direct
Offline:   WatermelonDB (deferred to post-MVP)
Styling:   NativeWind 4
Icons:     @expo/vector-icons (Feather)
Repo:      github.com/masrati89/docfield
```

---

_הקובץ הזה הוא נקודת כניסה בלבד. כל הפרטים נמצאים במסמכים המפורטים._

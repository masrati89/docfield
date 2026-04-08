# Status Check — אפריל 2026

> נוצר ב-2026-04-08 על בסיס בדיקה אמיתית מול הקוד וה-DB המקומי.

---

## סעיף 1: מצב Database

### Migrations

סה"כ קיימות **27 קבצי migration** בתיקיית `supabase/migrations/` (001–026, עם שני קבצים בשם 025).

**מיגרציות שהוחלו על ה-DB:** 001–020 בלבד.

**מיגרציות שלא הוחלו (021–026):**

| קובץ                                   | תוכן                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| 021_fix_auth_trigger_nullable_org.sql  | תיקון trigger auth ל-nullable org                                            |
| 022_org_insert_policy.sql              | RLS policy ל-INSERT על organizations                                         |
| 023_users_self_insert_policy.sql       | RLS policy ל-self insert על users                                            |
| 024_add_checklist_state_column.sql     | עמודת checklist_state (כפילות? 019 כבר הוסיפה)                               |
| 025_add_user_first_name_profession.sql | שדות first_name, profession ל-users                                          |
| 025_oauth_support.sql                  | ⚠️ **כפילות מספור!** קובץ שני עם אותו מספר                                   |
| 026_pdf_infrastructure.sql             | report_number, client details, property details, inspector_settings, caption |

### טבלאות קיימות (17)

apartments, buildings, checklist_categories, checklist_items, checklist_results, checklist_templates, clients, defect_library, defect_photos, defects, delivery_reports, notifications, organizations, projects, report_log, signatures, users

### תשובות לשאלות

1. **`delivery_reports.report_number` קיים?** ❌ **לא** — מוגדר ב-026 שלא הוחלה
2. **Snapshot fields ב-delivery_reports?** ❌ **לא** — אין שום `_snapshot` fields. הדוח שומר רק `inspector_id` (FK חי)
3. **Photos:** `defect_photos` — שדות `image_url` (text), `annotations` (jsonb), `annotations_json` (jsonb). **caption** ❌ לא קיים — מוגדר ב-026 שלא הוחלה
4. **טבלת `inspector_settings`?** ❌ **לא קיימת** כטבלה. מיגרציה 026 מגדירה עמודת JSONB `inspector_settings` על טבלת `users`, אך לא הוחלה
5. **טבלת `organization_settings`?** ❌ **לא קיימת** כטבלה נפרדת
6. **`organizations.settings` JSONB:** ✅ קיים — מכיל: `{"defaultLanguage": "he", "defaultReportType": "delivery", "pdfBrandingEnabled": true}`
7. **שדות users:**
   - `professional_title` — ❌ לא קיים
   - `license_number` — ❌ לא קיים (מוגדר בתוך `inspector_settings` JSONB שלא הוחל)
   - `signature_url` — ✅ קיים
   - `stamp_url` — ✅ קיים
   - `first_name` — ❌ לא קיים (מוגדר ב-025 שלא הוחלה)
   - `profession` — ❌ לא קיים (מוגדר ב-025 שלא הוחלה)
8. **כמה משתמשים:** **1**
9. **כמה ארגונים:** **1**
10. **כמה דוחות:** **3**

### ⚠️ גילוי מפתיע

**6 מיגרציות לא הוחלו!** הקוד (UI + hooks) כבר מתייחס לעמודות שלא קיימות ב-DB — למשל `inspector_settings`, `report_number`, `client_name`, `caption`. זה יגרום לשגיאות runtime.

בנוסף: **כפילות מספור** — שני קבצים עם מספר 025 (first_name + oauth).

---

## סעיף 2: מצב Settings Screen

### תשובות

1. **הטאב הרביעי מוגדר ב-navigation?** ✅ כן — `app/(app)/settings/index.tsx`
2. **שם הקובץ הראשי:** `apps/mobile/app/(app)/settings/index.tsx`
3. **המסך מלא ופעיל** — 7 sections עם תוכן אמיתי:
   - ProfileSection — שם, אימייל, תפקיד, מקצוע, ארגון
   - ChangePasswordSection — שינוי סיסמה
   - PreferencesSection — העדפות
   - SignatureStampSection — חתימה + חותמת (העלאה/ציור/מחיקה)
   - InspectorProfileSection — 7 שדות: מספר רישיון, השכלה, ניסיון, שם חברה, הצהרה, כלים, מגבלות
   - StatisticsSection — סטטיסטיקות (סה"כ דוחות, ממצאים, בדק בית, מסירה, הושלמו, החודש)
   - InfoSection — מידע
   - SignOutButton — התנתקות
4. **שדות/סעיפים קיימים:** כל הנ"ל — מסך עשיר עם 7 sections
5. **מסך משנה לפרופיל מקצועי?** ❌ אין מסך נפרד — InspectorProfileSection מוטמע ישירות בדף ההגדרות כ-inline form
6. **מסך משנה לפרטי חברה?** ❌ לא — שם החברה נמצא בתוך InspectorProfileSection
7. **מסך משנה לברירות מחדל לדוחות?** ❌ אין מסך נפרד — הצהרה, כלים ומגבלות נמצאים ב-InspectorProfileSection

### ⚠️ גילוי מפתיע

InspectorProfileSection משתמש ב-hook `useInspectorSettings` שכותב ל-`users.inspector_settings` — עמודה שלא קיימת ב-DB (מיגרציה 026 לא הוחלה). **המסך יקרוס בפועל.**

---

## סעיף 3: מצב מערכת ה-PDF

### תשובות

1. **expo-print מותקן?** ✅ כן — גרסה `~55.0.9`
2. **Service להפקת PDF?** ✅ — `apps/mobile/hooks/usePdfGeneration.ts` (338 שורות) + תבניות ב-`apps/mobile/lib/pdf/`:
   - `bedekBayit.ts` — תבנית בדק בית
   - `protocol.ts` — תבנית פרוטוקול מסירה
   - `shared.ts` — פונקציות משותפות (styles, components)
   - `types.ts` — טיפוסים
   - `previewHtml.ts` — HTML לתצוגה מקדימה
3. **מחובר לכפתור?** ✅ — מסך ReportDetail (`reports/[id]/index.tsx`):
   - כפתור "הורד" → generatePdf
   - כפתור "שתף" → sharePdf
   - כפתור "תצוגה מקדימה" → ReportPreviewModal
   - PrePdfSummary modal → לפני הפקה
   - TenantSignatureScreen → חתימת דייר (למסירה)
4. **HTML template לבדק בית?** ✅ — `apps/mobile/lib/pdf/bedekBayit.ts` — כולל: כותרת, פרטי נכס, ממצאים עם תמונות+captions, הפניות לתקן, המלצות, עלויות, חתימות
5. **HTML template לפרוטוקול מסירה?** ✅ — `apps/mobile/lib/pdf/protocol.ts`
6. **מה עובד מקצה לקצה?**
   - ✅ לחיצה על הכפתור → PrePdfSummary → הפקת HTML → expo-print → PDF file → שיתוף
   - ✅ תמונות עם annotations (אם @shopify/react-native-skia מותקן — lazy load)
   - ✅ חתימת מפקח מ-profile + חתימת דייר
   - ⚠️ **הקוד מנסה לשלוף `report_number`, `client_name`, `inspector_settings` ועוד — עמודות שלא קיימות ב-DB.** הפקת PDF תתרסק או תחזיר ערכים ריקים.

---

## סעיף 4: מצב לשוניות הדוח (ReportDetail)

### תשובות

1. **לשוניות קיימות בפועל:** 4 — ממצאים, פרטי דוח, תוכן, חוסרים
   (מוגדרות ב-`reportDetailConstants.ts` כ-`findings | details | content | shortages`)

2. **לשונית "ממצאים" (findings):** ✅ **עובדת מלאה** — CategoryAccordion, DefectRow, empty state, הוספת ממצא, מחיקה, ניווט ל-add-defect

3. **לשונית "פרטי דוח" (details):** ✅ **קיימת ומלאה** — `ReportDetailsTab.tsx` — 10 שדות: client_name, client_phone, client_email, client_id_number, property_type, property_area, property_floor, property_description, contractor_name, contractor_phone. **⚠️ עמודות אלה לא קיימות ב-DB** (מיגרציה 026 לא הוחלה) — הטאב יקרוס.

4. **לשונית "תוכן" (content):** ✅ **קיימת ומלאה** — `ReportContentTab.tsx` — sections: declaration, scope, limitations, tools, property_description. משתמשת ב-`useReportContent` + `useInspectorSettings`. **⚠️ תלויה ב-`report_content` JSONB ו-`inspector_settings` — עמודות שלא קיימות ב-DB.**

5. **לשונית "חוסרים" (shortages):** ✅ **קיימת ומלאה** — `ReportShortagesTab.tsx` — כוללת SummaryBanner, categories, validation. משתמשת ב-`useReportShortages`.

### סיכום

כל 4 הלשוניות **נבנו** וכוללות UI מלא. אבל 3 מתוך 4 (details, content, shortages) תלויות בעמודות DB שלא קיימות.

---

## סעיף 5: Roles ו-Permissions

### תשובות

1. **`users.role` קיים ב-DB?** ✅ כן — `text NOT NULL DEFAULT 'inspector'`
2. **ערכים מותרים:** `admin`, `project_manager`, `inspector` (CHECK constraint)
3. **האם ה-UI בודק role?**
   - `ProfileSection.tsx:21` — מציג תווית עברית (admin → מנהל)
   - `register.tsx:231` — הרשמה יוצרת תמיד `role: 'admin'`
   - `complete-profile.tsx:158` — אותו דבר
   - **RLS policies:** delivery_reports SELECT/UPDATE — admin+project_manager רואים הכל, inspector רואה רק שלו. DELETE — admin בלבד.
   - **⚠️ אין הפרדה ב-UI** — אין מסך ניהול מפקחים, אין הגבלת UI לפי role
4. **כל המשתמשים באותו role?** ✅ כן — המשתמש היחיד הוא `admin`

### ⚠️ גילוי

- כל הרשמה חדשה יוצרת `admin` — אין flow ליצירת `inspector` או `project_manager`
- ה-RLS כבר מוכן לרב-משתמשים, אבל ה-UI עדיין single-user

---

## סעיף 6: Iron Rule — האם הוא בסכנה?

### ניתוח

1. **איך הדוח קורא פרטי מפקח?**
   - PDF: `usePdfGeneration.ts:179-185` — שולף `users.inspector_settings` **חי** (לא snapshot)
   - PDF: `inspector.name` מגיע מ-`profile?.fullName` **חי** (לא snapshot)
   - UI: `ReportDetailScreen:111-117` — `inspectorProfile` נבנה מ-`profile?.fullName`, `profile?.signatureUrl`, `profile?.stampUrl` — **הכל חי**

2. **איך הדוח קורא פרטי ארגון?**
   - אין snapshot — לוגו/שם חברה נשלפים מ-`inspector_settings` חי

3. **מאיפה ה-PDF שולף?**
   - שם מפקח: `users.full_name` חי
   - חתימה: `users.signature_url` חי
   - חותמת: `users.stamp_url` חי
   - פרטי מקצוע: `users.inspector_settings` חי
   - חתימות: `signatures` table (immutable ✅) — רק חתימות דייר

### 🔴 מסוכן

**אם מפקח ישנה את שמו, חתימתו, או חותמתו — כל הדוחות שלו (כולל ישנים) יופקו עם הפרטים החדשים.** אין snapshot mechanism. השדה `inspector_id` הוא FK חי ל-`users`, ובכל הפקת PDF הנתונים נשלפים מ-profile הנוכחי.

**חתימות דייר:** 🟢 בטוח — נשמרות ב-`signatures` table שהוא immutable (no UPDATE/DELETE policy).

**חתימות מפקח:** 🔴 מסוכן — לא נשמרות ב-`signatures`, נשלפות מ-`users.signature_url` חי.

---

## סעיף 7: סיכום

### מה כבר עובד?

- ✅ מערכת PDF מלאה — 2 תבניות (בדק בית + מסירה) + תצוגה מקדימה + שיתוף
- ✅ מסך הגדרות עשיר — פרופיל, חתימה, חותמת, פרטי מפקח, סטטיסטיקות
- ✅ 4 לשוניות דוח — ממצאים, פרטים, תוכן, חוסרים
- ✅ RLS מוכן לרב-משתמשים עם 3 תפקידים
- ✅ חתימת דייר immutable
- ✅ 20 מיגרציות מוחלות, DB עובד

### מה לא עובד / חסר?

- 🔴 **6 מיגרציות לא הוחלו** (021–026) — הקוד מתייחס לעמודות שלא קיימות
- 🔴 **Iron Rule מופר** — פרטי מפקח נשלפים חי, לא כ-snapshot
- 🔴 **כפילות מספור מיגרציה** — שני קבצים 025
- 🟠 אין flow ליצירת מפקחים (כל הרשמה = admin)
- 🟠 אין UI ניהול ארגון/מפקחים
- 🟠 Digital signatures עדיין לא מחוברות (skia)
- 🟠 אין offline sync

### המלצה — מה הכי קריטי לתקן קודם?

1. **ראשון:** להחיל מיגרציות 021–026 (אחרי תיקון כפילות 025). בלי זה — חצי מהמסכים לא עובדים.
2. **שני:** Iron Rule — להוסיף snapshot fields ל-delivery_reports (inspector_name_snapshot, inspector_signature_snapshot, org_name_snapshot, org_logo_snapshot) ולשמור אותם ברגע יצירת הדוח.
3. **שלישי:** לבנות flow ליצירת מפקחים ולהפריד בין admin ל-inspector ב-UI.

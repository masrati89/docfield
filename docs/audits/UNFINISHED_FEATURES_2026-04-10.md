# inField — פיצ'רים לא גמורים

**תאריך סריקה:** 2026-04-10
**אופי:** Read-only. שום קובץ קוד לא שונה. הדוח מתאר מצב עדכני, לא מציע פתרונות.

---

## חלק 1 — סקירה כללית

זוהו **19 פריטים** לא-גמורים ברמות שונות של בשלות, שמתקבצים ל-**13 "סיפורים"** עיקריים. המצב הכללי: הפרויקט מרגיש בשל מבחינת הקצה הקדמי של הזרימה העיקרית (דו"ח יחיד ← ליקויים ← PDF), אבל יש מעגל שני של פיצ'רים שהתחילו להיבנות ב-DB ובמודלי הנתונים ונעצרו לפני שהגיעו ל-UI.

**דפוסי הנטישה הדומיננטיים:**

1. **Migrations שרצו → אין קוד אפליקציה** (חלק מהטבלאות לא נגועות ע"י שום hook/query). הסיכון הגדול ביותר.
2. **Backend קיים + hook + אפילו badge ב-UI → אין מסך/panel שמציג את הנתון** (קלאסיקה: notifications).
3. **"בקרוב" tosts** — כפתורים פעילים שמציגים toast במקום פעולה.
4. **דוקומנטציה פנימית (CLAUDE.md) מיושנת** — מצהירה "15 migrations" אבל בפועל 31; מצהירה "signatures not built" אבל בפועל יש hook+SignaturePad+TenantSignatureScreen מלאים.
5. **Iron Rule snapshot fields** נוצרו ב-DB אבל חסרות ערוצי קלט (אין עריכת פרטי ארגון → 7/8 שדות snapshot של הארגון ישבו כ-NULL לנצח).

---

## חלק 2 — רשימת פיצ'רים לא גמורים

| #   | שם משוער של הפיצ'ר                                             | מה קיים בקוד                                                                                                                                                                                                                                                                                                                                 | מה חסר כדי שיעבוד                                                                                                                                                  | אחוז השלמה        | מיקומים                                                                                                                                                                        | סימני נטישה         |
| --- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| 1   | **פאנל התראות (Notification Panel)**                           | DB ✓ (014), RLS ✓, `useNotifications` hook מלא (count+list+markRead+markAllRead), badge אדום ב-SharedTabHeader, polling כל 60s                                                                                                                                                                                                               | רכיב Panel/BottomSheet שמציג את הרשימה; ניתוב `onBell`                                                                                                             | 70%               | `hooks/useNotifications.ts`, `components/ui/SharedTabHeader.tsx:83-127`, `app/(app)/_layout.tsx:67`                                                                            | 2, 5                |
| 2   | **Push notifications (התראות מערכת)**                          | Toggle ב-PreferencesSection ששומר ל-AsyncStorage בלבד                                                                                                                                                                                                                                                                                        | אין `expo-notifications`, אין `ExpoPushToken`, אין registration, אין בקשת הרשאה                                                                                    | 10%               | `components/settings/PreferencesSection.tsx:11-35`                                                                                                                             | 5, 8                |
| 3   | **Report audit log (report_log)**                              | טבלה ✓ (013) עם `action CHECK` enum כולל `pdf_generated, status_completed, defect_added/updated/deleted, photos_updated, whatsapp_sent`, policy insert-only (append-only)                                                                                                                                                                    | אף קוד mobile לא כותב ל-`report_log`. 0 INSERTs                                                                                                                    | 15%               | `supabase/migrations/013_create_report_log.sql`, `supabase/migrations/012_add_missing_fields.sql` (enum)                                                                       | 1                   |
| 4   | **Organization settings UI (branding + legal)**                | 16 שדות snapshot ב-delivery_reports ✓ (029), PDF generation קורא אותם (usePdfGeneration.ts:57-64), `createReportWithSnapshot` קורא מ-`organizations.settings` JSONB                                                                                                                                                                          | אין מסך עריכת Organization (אין קלט ל-`legal_name, tax_id, address, phone, email, legal_disclaimer, logo_url`). תוצאה: 7/8 שדות snapshot של הארגון תמיד NULL ב-PDF | 40%               | `lib/createReportWithSnapshot.ts:87-124`, `hooks/usePdfGeneration.ts:240-284`, migration 029                                                                                   | 1, 4                |
| 5   | **Team mode / multi-user organization**                        | Migration 029 ✓: `organization_members`, `organization_invitations`, `teams` טבלאות מלאות עם RLS, ארבעה roles (owner/admin/project_manager/inspector), `organizations.mode IN (solo, team)`, backfill של חברים קיימים                                                                                                                        | אפס UI: אין הזמנת משתמש, אין ניהול חברים, אין בחירת מצב, אין קבלת הזמנה, אין מסך "הצוות שלי"                                                                       | 25%               | `supabase/migrations/029_iron_rule_and_org_skeleton.sql:58-209`, שום קובץ mobile מתייחס                                                                                        | 1                   |
| 6   | **Delivery Round 2 — inherited defects + review UI**           | `defects.review_status` ✓ (enum: pending_review/fixed/not_fixed/partially_fixed, migration 012), `delivery_reports.previous_round_id` + `round_number` ✓, wizard מחשב round_number אוטומטית (`useWizardState.ts:461-469`), `createReportWithSnapshot` מעביר את הערכים, types ✓ ב-`packages/shared/src/types/defect.types.ts:26`, i18n keys ✓ | אין העתקת ליקויים מסיבוב קודם ב-`createReportWithSnapshot`; אין UI לעדכון `review_status` על ליקוי מועבר; אין סימון ויזואלי של "ליקוי ירושה"; אין פילטר            | 30%               | `lib/createReportWithSnapshot.ts:96-97`, `components/wizard/useWizardState.ts:461-469`, `packages/shared/src/i18n/he.json:151`, `packages/shared/src/types/defect.types.ts:26` | 1, 8                |
| 7   | **Clients CRM**                                                | Migration 010 ✓ — טבלת `clients` מלאה עם RLS                                                                                                                                                                                                                                                                                                 | 0 שימוש: אף hook/query ב-mobile לא קורא/כותב. פרטי לקוח נשמרים ישירות כעמודות על `delivery_reports` (client_name, client_phone וכו')                               | 15%               | `supabase/migrations/010_create_clients.sql`, הכפילות ב-`delivery_reports`                                                                                                     | 1, 12               |
| 8   | **Configurable checklist templates**                           | Migration 004 ✓ — שלוש טבלאות מלאות: `checklist_templates, checklist_categories, checklist_items` עם RLS                                                                                                                                                                                                                                     | 0 שימוש במובייל. הצ'קליסט קשיח ב-`components/checklist/constants.ts`. אין מסך admin לניהול תבניות/קטגוריות/סעיפים                                                  | 10%               | `supabase/migrations/004_create_checklist_templates.sql`, `apps/mobile/components/checklist/constants.ts`                                                                      | 1, 12               |
| 9   | **WhatsApp send (Green API)**                                  | `report_log.action` enum כולל `whatsapp_sent` ✓                                                                                                                                                                                                                                                                                              | אין wrapper ל-Green API, אין UI "שלח בוואטסאפ", אין env vars, אין webhook handler                                                                                  | 5%                | `docs/schema_diff_20260409/local_schema_after.sql:745` (enum בלבד)                                                                                                             | 1                   |
| 10  | **Report detail — search feature**                             | `components/reports/SearchOverlay.tsx` קיים ומיובא ב-`reports/[id]/index.tsx:38`, state `showSearch` מוגדר (שורה 86), רכיב מורנדר תחת תנאי (שורות 474-482), כפתור חיפוש ב-`ReportInfoCard.tsx:144`                                                                                                                                           | **`setShowSearch(true)` לא נקרא משום מקום**. הכפתור ב-ReportInfoCard עם `// TODO: open search overlay` במקום navigation. SearchOverlay dead code עד שמחברים        | 85%               | `app/(app)/reports/[id]/index.tsx:86,474-482`, `components/reports/ReportInfoCard.tsx:144-147`                                                                                 | 5, 7                |
| 11  | **Checklist — search feature**                                 | כפתור חיפוש ב-ChecklistHeader עם `onSearch` prop                                                                                                                                                                                                                                                                                             | `onSearch={() => showToast('חיפוש — בקרוב', 'info')}` — toast במקום חיפוש                                                                                          | 20%               | `app/(app)/reports/[id]/checklist.tsx:383`                                                                                                                                     | 3, 5                |
| 12  | **Report settings sheet (bedek bayit)**                        | כפתור "הגדרות" ב-ReportSubHeader                                                                                                                                                                                                                                                                                                             | `onSettings={() => showToast('הגדרות דוח — בקרוב', 'info')}`. ChecklistReportSettingsSheet קיים אבל רק למצב delivery                                               | 10%               | `app/(app)/reports/[id]/index.tsx:353`, `components/checklist/ReportSettingsSheet.tsx`                                                                                         | 3, 5                |
| 13  | **Defect detail / edit flow**                                  | `DefectRow.tsx` swipeable עם onPress                                                                                                                                                                                                                                                                                                         | `// TODO: navigate to defect detail` — אין מסך פרטי ליקוי יחיד, אין edit flow. עריכה אפשרית רק דרך add-defect חדש                                                  | 5%                | `components/reports/DefectRow.tsx:92-97`                                                                                                                                       | 5, 7                |
| 14  | **Side menu — עזרה/תמיכה**                                     | פריט "עזרה" ב-SideMenu                                                                                                                                                                                                                                                                                                                       | `route: null, toastMessage: 'בקרוב'` — אין מסך עזרה                                                                                                                | 5%                | `components/ui/SideMenu.tsx:41`                                                                                                                                                | 3                   |
| 15  | **Settings InfoSection — coming soon item**                    | `handleComingSoon` callback שמוזרק ל-`InfoSection`                                                                                                                                                                                                                                                                                           | פריט בתוך InfoSection שמציג toast "בקרוב" במקום לפתוח משהו                                                                                                         | 5%                | `app/(app)/settings/index.tsx:44-46,131`, `components/settings/InfoSection.tsx`                                                                                                | 3                   |
| 16  | **Admin settings — categories/templates/locations management** | כלום ב-mobile                                                                                                                                                                                                                                                                                                                                | מסך admin לניהול קטגוריות, תבניות צ'קליסט, מיקומים נפוצים, בנק המלצות                                                                                              | 0%                | לא קיים                                                                                                                                                                        | (מוצהר ב-CLAUDE.md) |
| 17  | **Web app dashboard (admin console)**                          | שלד `apps/web` עם Vite + React Router + AuthProvider + LoginPage מלא (335 שורות) + DashboardPage (143 שורות)                                                                                                                                                                                                                                 | `ProjectsPage.tsx`, `ReportsPage.tsx`, `SettingsPage.tsx` = 20 שורות כל אחד, רק כותרת + טקסט "תופיע כאן"                                                           | 30%               | `apps/web/src/pages/ProjectsPage.tsx`, `ReportsPage.tsx`, `SettingsPage.tsx`                                                                                                   | 4, 7                |
| 18  | **inspector_professional_title**                               | עמודת snapshot קיימת (029), placeholder ב-`createReportWithSnapshot.ts:108` עם `// Future: from inspector_settings`                                                                                                                                                                                                                          | אין שדה קלט ב-`InspectorProfileSection` למרות ששדות אחרים (license, education, company) כן קיימים; הקוד מכניס null                                                 | 50%               | `lib/createReportWithSnapshot.ts:108`, `components/settings/InspectorProfileSection.tsx`                                                                                       | 7                   |
| 19  | **defect_library — standard/standard_reference duplication**   | שני שמות עמודה במקביל: `standard` (חדש) ו-`standard_reference` (ישן). `useDefectLibrary` עדיין כותב/קורא מ-`standard_reference`, `useReport` קורא מ-`standard_ref`, ה-seed מאכלס את שניהם                                                                                                                                                    | החלטה ומעבר מלא לעמודה אחת, הסרת הכפילות. מתועד ב-`.claude/GOTCHAS.md:37-76`                                                                                       | 50% (באופן מכוון) | `hooks/useDefectLibrary.ts:46,159,185`, `hooks/useReport.ts:83`, `.claude/GOTCHAS.md`                                                                                          | 9                   |

**מקרא לסימני נטישה** (מ-12 הקטגוריות במשימה):
`1` טבלאות/עמודות ללא קוד; `2` API יתום; `3` UI→endpoint חסר; `4` קומפוננטה לא מיובאת; `5` Handler ריק/TODO; `7` הערה מפורשת (TODO/בקרוב); `8` Types ללא יישום; `9` Migrations לא סגורות; `12` seed/mock שרדי.

---

## חלק 3 — קיבוץ לפי "סיפור"

### סיפור A — Organization & Team Management (פריטים 4, 5)

שני שלבים שתוכננו יחד: "גיבוש זהות הארגון" (לוגו, פרטי חברה, דיסקליימר משפטי) + "ארגונים רב-משתמש" (הזמנות, roles, צוותים). Migration 029 מכסה את כל צד ה-DB, כולל backfill. בצד ה-UI לא נבנה **כלום**. כרגע inField פועל דה-פקטו כ-"solo org" גם כשה-DB מוכן ל-team.

### סיפור B — Delivery Round 2 (פריט 6)

תמיכה בסיבוב שני/שלישי של פרוטוקול מסירה, כולל העברת ליקויים מסיבוב קודם, סימון `review_status` שלהם, ופילטר. ה-DB, ה-wizard, ה-types וה-i18n כולם הוכנו. הלוגיקה של ההעתקה (`createReportWithSnapshot` שיעתיק את הליקויים עם `review_status='pending_review'`) + ה-UI לעדכון הסטטוס — לא נבנו. זה פיצ'ר ליבה שמוצהר במפורש כלא בנוי ב-CLAUDE.md:36.

### סיפור C — Notifications stack (פריטים 1, 2)

שלושה שכבות: (1) התראות in-app (panel + badge) — backend מלא, badge מצויר, פאנל חסר; (2) push notifications — רק toggle ב-preferences שלא מחובר לכלום; (3) ההנחה היא שיש גם webhook/cron שיוצר התראות, אבל לא אותר. הפריט הכי "תקוע באמצע" בפרויקט — פערים קטנים של UI עומדים בין המצב הנוכחי ל-feature מלא.

### סיפור D — Report audit & legal traceability (פריטים 3, 9)

`report_log` נבנה כאמצעי לעמידה ב-Iron Rule (מעקב append-only אחרי שינויים מהותיים בדוח — PDF שנוצר, סטטוס שהשתנה, ליקויים שנמחקו, WhatsApp שנשלח). הטבלה והמדיניות קיימים. אף מודול לא רושם אליה. WhatsApp עצמו (Green API) גם לא בנוי.

### סיפור E — Data-driven catalogs (clients, checklist templates, admin settings) (פריטים 7, 8, 16)

שלושה מסכים/טבלאות שנועדו להפוך את האפליקציה ל-data-driven: לקוחות חוזרים, תבניות צ'קליסט להתאמה אישית, וקונסולת admin לקטגוריות/מיקומים/המלצות. כיום הכל hardcoded ב-`packages/shared/constants` וב-`components/checklist/constants.ts`. ה-DB של clients ושל checklist_templates קיים; הקוד לא משתמש בהם.

### סיפור F — Search (פריטים 10, 11)

חיפוש בתוך דוח/צ'קליסט. ב-report detail יש רכיב `SearchOverlay` מלא — הוא פשוט לא מחובר (dead code עד שמחברים כפתור ל-`setShowSearch(true)`). בצ'קליסט — toast "בקרוב".

### סיפור G — Defect detail flow (פריט 13)

היום עריכת ליקוי קיימת רק כ-"Add Defect" חדש. אין מסך פרטי ליקוי קיים (עם היסטוריה, עריכה, סטטוס). DefectRow מצפה לניווט שאיננו.

### סיפור H — Report settings sheet בדק בית (פריט 12)

Sheet ההגדרות של צ'קליסט (`ReportSettingsSheet` — פרטי דייר, הערות כלליות) קיים לצד delivery. ב-bedek_bait אותו כפתור רק מציג toast. כנראה תוכנן להיות Sheet מקביל עם שדות שונים (declaration, scope, tools וכו').

### סיפור I — Help & onboarding (פריטים 14, 15)

מסך עזרה/תמיכה/FAQ. שני entry points (side menu + settings InfoSection) מחכים ליעד שלא נבנה.

### סיפור J — Inspector profile completion (פריט 18)

פער קטן — עמודת `professional_title` חסרה בטופס קלט למרות שיתר השדות (license, education, company) קיימים.

### סיפור K — Web admin console (פריט 17)

יש app שלם ב-`apps/web` עם routing+auth+login+dashboard, אבל 3 עמודים עיקריים (Projects/Reports/Settings) הם stubs של 20 שורות. מצב לא ברור — זה "הוקפא בכוונה" (mobile-first), או "נכון לפני שמעבירים"?

### סיפור L — defect_library schema cleanup (פריט 19)

תיעוד ב-GOTCHAS כבר קיים, עם מעבר מתוכנן בשני שלבים. זה פחות "פיצ'ר לא גמור" ויותר "migration path שתוכנן ונעצר באמצע".

### סיפור M — CLAUDE.md reality drift

לא פריט בדוח אבל ראוי לציון: CLAUDE.md מצהיר 15 migrations (בפועל 31), מצהיר שחתימות/camera overlay/annotations לא בנויים (בפועל כן בנויים במלואם: `SignaturePad`, `SignatureStampSection`, `TenantSignatureScreen`, `useSignature`, `AnnotationEditor`, `useAnnotationEditor`, `annotations_json` column). התיעוד מספר סיפור ישן.

---

## חלק 4 — דגלים אדומים

פיצ'רים שכבר גלויים למשתמש ויוצרים סיכון פעיל (לא רק חסרים):

### 🔴 D1 — פעמון התראות עם handler ריק

**איפה:** `app/(app)/_layout.tsx:67` → `onBell={() => {}}`
**למה:** המשתמש רואה badge אדום עם מספר, לוחץ — לא קורה כלום. זה "כשל שקט" קלאסי. גרוע במיוחד בגלל שה-hook באמת מושך נתונים אמיתיים ומתעדכן כל 60 שניות, אז הבאג ידגים את עצמו ברגע שמישהו ינסה.

### 🔴 D2 — PDF עם פרטי ארגון ריקים (Iron Rule chill)

**איפה:** `lib/createReportWithSnapshot.ts:87-124`, `hooks/usePdfGeneration.ts:240-284`
**למה:** PDFs שמופקים היום שומרים `organization_legal_name/tax_id/address/phone/email/legal_disclaimer/logo_url` כ-NULL (אין UI למלא את `organizations.settings`). אלו מסמכים משפטיים שנועדו להיות "חתומים בזמן" — הם נחתמים ריקים. מרגע שיתווסף UI, הדוחות הישנים לא יתעדכנו (iron rule).

### 🔴 D3 — report_log append-only שלא נכתב אליו

**איפה:** `supabase/migrations/013_create_report_log.sql`
**למה:** טבלת audit חוקית קיימת והופצה ללקוחות, אבל הקוד לא רושם אליה. אם תצטרך להוכיח בבית משפט מתי PDF הופק או מי מחק ליקוי — אין לך את המידע. גרוע יותר משאין audit בכלל כי הנוכחות של הטבלה יוצרת ציפייה.

### 🔴 D4 — Round 2 — ליקויים לא עוברים אבל הסיבוב כן מתקדם

**איפה:** `lib/createReportWithSnapshot.ts:96-97`, `components/wizard/useWizardState.ts:461-469`
**למה:** Wizard מזהה אוטומטית שזה סיבוב 2 ושם `round_number=2, previous_round_id=<prev>`. אבל לא מעתיק את הליקויים מסיבוב 1. המשתמש ייצור "סיבוב שני" ויקבל דוח ריק — חוויה מבלבלת מאוד, נראה כאילו הליקויים נעלמו. בפועל, זה יכול לגרום לבודק ל"אשר" מסירה עם ליקויים פתוחים מבלי שהוא יודע.

### 🔴 D5 — SearchOverlay dead code בתוך production screen

**איפה:** `app/(app)/reports/[id]/index.tsx:474-482`
**למה:** לא כשל נראה למשתמש, אבל רכיב מלא של 500+ שורות ב-production שלא נגיש — מגדיל bundle, מבלבל code review, ועלול להישאר במצב שבור כי אף אחד לא בודק אותו.

### 🔴 D6 — Web pages stubs בפרודקשן build

**איפה:** `apps/web/src/pages/{Projects,Reports,Settings}Page.tsx`
**למה:** אם ה-web app מתארח איפשהו (יש `apps/web/dist/`), משתמש שיתחבר ויקליק על "פרויקטים" יראה "רשימת פרויקטים תופיע כאן". זה כשל נראה לעין. אם ה-web נטוש — עדיף למחוק מ-routing.

### 🔴 D7 — Tables ללא שימוש עם RLS (אבל גם ללא INSERTs)

**איפה:** `clients`, `checklist_templates`, `checklist_categories`, `checklist_items`, `organization_members`, `organization_invitations`, `teams`
**למה:** לא סיכון פעיל ישיר, אבל יוצרים בלבול ב-backup/migration. אם מישהו יתחבר ל-DB ויראה "teams", הוא יחפש קוד שמשתמש בו. 4 טבלאות מ-029 שכתובות כ-feature מובנה לגמרי, עם RLS מתוחזק.

---

## חלק 5 — שאלות אליי

רק 5, ממוקדות, למקרים שבהם הכוונה המקורית לא ברורה:

1. **Web app (סיפור K, דגל D6):** האם `apps/web` הוא (א) הקפאה מכוונת לאחרי MVP, (ב) ניסיון שיש למחוק, (ג) קונסולה אדמיניסטרטיבית ל-B2B שעדיין רלוונטית? אם (א)/(ב) — אולי למחוק את ה-stubs ולא להשאיר אותם להתרקב?

2. **Checklist templates (פריט 8):** האם הכוונה המקורית הייתה להפוך את הצ'קליסט ל-data-driven (כל ארגון בונה תבנית משלו), או שהטבלאות נבנו אופטימית ב-Phase 0 והוחלט בינתיים להישאר hardcoded? התשובה משנה אם למחוק את הטבלאות, להשאיר, או להתחיל לאכלס seed.

3. **Team mode (סיפור A):** האם inField 1.0 אמור לתמוך רק ב-solo inspectors, או שיש לקוח/שותף שמצפה ל-team mode בגרסה הבאה? 4 טבלאות ו-RLS מחכים לתשובה.

4. **Notifications (סיפור C):** מה אמור לייצר את ההתראות בצד השרת? ראיתי רק את הטבלה ואת הקריאה. יש trigger? Edge function? Cron? או זה היה אמור להיבנות יחד עם WhatsApp / Round 2 reminders ונתקע?

5. **report_log (סיפור D):** האם נחוץ עכשיו לצרכי הגנה משפטית/Iron Rule, או שהטבלה נבנתה "ליום שיבוא"? התשובה משנה אם זה P0 (צריך להתחיל לרשום היום) או P3 (אפשר למחוק מה-schema ולצאת מהחוב).

---

## נספח — מה נבדק ולא הוצג

הדברים האלה נבדקו במהלך הסריקה והיו **לא רלוונטיים** (כלומר: כן בנויים או כבר לא תקועים), והוצאו מהרשימה כדי לא לבלבל:

- **Signatures** (inspector + tenant): קיים במלואו — `SignaturePad`, `SignaturePad.web`, `SignatureStampSection`, `TenantSignatureScreen`, hook `useSignature` מלא, storage buckets, שימוש ב-PDF. CLAUDE.md שוגה.
- **Camera overlay + annotations**: קיים — `CameraCapture`, `CameraPreview`, `AnnotationEditor` (lazy-loaded לתאימות web), `AnnotationToolbar`, `useAnnotationEditor`, `PhotoReviewGrid`, עמודת `annotations_json` נקראת/נכתבת.
- **Pre-PDF summary**: `PrePdfSummary.tsx` קיים ומחובר ב-report detail שורה 452. בנוי.
- **ReportContentTab / ReportShortagesTab / ReportDetailsTab**: שלושת הטאבים החדשים בנויים ומחוברים.
- **OAuth (Google/Apple)**: קיים ב-`useOAuth`, `SocialAuthButtons`, משולב ב-login+register.
- **Complete profile / verify email**: מסכים קיימים ב-`(auth)/`.
- **Inline project creation** (wizard + projects page): בנוי.
- **Round number detection**: בנוי ב-wizard (מה שלא בנוי — _מה שקורה אחרי_ זיהוי הסיבוב; ראה פריט 6).
- **Delete report / delete project**: hooks קיימים.
- **Idle timeout, side menu, OAuth, inspector settings, test** (`useReport.test.ts`): בנויים.

---

**סוף הדוח — read only. שום קובץ קוד לא נערך.**

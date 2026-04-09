# Phase 1 Discovery Report

תאריך: 2026-04-09

## 1. inspector_settings JSONB structure

**ריק בכל המשתמשים** — גם Local וגם Remote. אף משתמש לא מילא את ה-settings.

המבנה המוגדר ב-TypeScript (`hooks/useInspectorSettings.ts:9-18`):

```typescript
interface InspectorSettings {
  license_number?: string;
  education?: string;
  experience?: string;
  company_name?: string;
  company_logo_url?: string;
  default_declaration?: string;
  default_tools?: string;
  default_limitations?: string;
}
```

**שליפה:** `inspector_settings->>'license_number'` וכו'.

## 2. organizations.settings JSONB structure

**מבנה בפועל (Remote):**

```json
{
  "defaultLanguage": "he",
  "defaultReportType": "delivery",
  "pdfBrandingEnabled": true
}
```

**עמודות קיימות ב-organizations:** `id`, `name`, `logo_url`, `settings`, `created_at`, `updated_at`

**⚠️ שדות חסרים:** ה-settings **לא מכילים** `legal_name`, `tax_id`, `address`, `phone`, `email`, `legal_disclaimer`. שדות אלה מתוכננים ל-Phase 2 (מסך הגדרות ארגון). כלומר, **כל ה-organization snapshot fields מלבד name ו-logo_url יהיו NULL** בזמן ה-backfill.

## 3. PDF generation files

### קובץ ראשי: `hooks/usePdfGeneration.ts` (344 שורות)

**איך קורא נתוני מפקח:**

1. מקבל `InspectorProfile` כ-parameter (name, signatureUrl, stampUrl) — מגיע מה-component שקורא ל-hook
2. שולף `inspector_settings` בזמן אמת מ-`users` table (שורות 177-192)
3. ממפה ל-`PdfReportData.inspector` (שורות 209-216): `name`, `licenseNumber`, `education`, `experience`, `companyName`, `companyLogoUrl`

**איך קורא נתוני ארגון:**

- **לא קורא ישירות מ-organizations!** משתמש ב-`inspectorSettings.company_name` ו-`inspectorSettings.company_logo_url` (שורות 214-215, 252)

**קבצים נוספים:**

- `lib/pdf/bedekBayit.ts` — Bedek Bayit HTML template
- `lib/pdf/protocol.ts` — Protocol Mesira HTML template
- `lib/pdf/shared.ts` — shared PDF helpers
- `lib/pdf/types.ts` — PdfReportData interface

## 4. Report creation files

### שני מקומות ליצירת דוח:

**1. Wizard: `components/wizard/useWizardState.ts` (שורות 473-498)**

```typescript
const insertData = {
  apartment_id,
  organization_id,
  inspector_id,
  report_type,
  status: 'draft',
  round_number,
  previous_round_id,
  report_date,
  project_name_freetext,
  apartment_label_freetext,
  tenant_name,
  tenant_phone,
  tenant_email,
};
```

**אין snapshot fields.**

**2. Quick Create: `app/(app)/projects/[projectId]/apartments/index.tsx` (שורות 458-470)**

```typescript
.insert({
  apartment_id, organization_id, inspector_id, report_type,
  status: 'draft', round_number: 1, report_date
})
```

**אין snapshot fields.**

## 5. Snapshot references קיימות בקוד

**אין.** המילה "snapshot" מופיעה רק ב-`annotations/renderAnnotations.ts` (image snapshot של Skia canvas). אין שום התייחסות ל-report snapshot fields.

## 6. נתונים שיושפעו מ-backfill

| DB     | דוחות                     | users | organizations |
| ------ | ------------------------- | ----- | ------------- |
| Local  | **0** (DB ריק אחרי reset) | 0     | 0             |
| Remote | **18**                    | 4     | 5             |

## 7. הצעת mapping ל-backfill

```sql
-- Inspector fields (from users table)
inspector_full_name_snapshot       = u.full_name
inspector_license_number_snapshot  = u.inspector_settings->>'license_number'  -- NULL לכולם כרגע
inspector_professional_title_snapshot = u.inspector_settings->>'education'    -- קרוב ביותר ל-"תואר מקצועי"
inspector_signature_url_snapshot   = u.signature_url
inspector_stamp_url_snapshot       = u.stamp_url
inspector_phone_snapshot           = u.phone
inspector_email_snapshot           = u.email

-- Organization fields (from organizations table)
organization_name_snapshot         = o.name
organization_logo_url_snapshot     = o.logo_url                              -- NULL לכולם כרגע
organization_legal_name_snapshot   = o.settings->>'legal_name'               -- NULL — שדה לא קיים עדיין
organization_tax_id_snapshot       = o.settings->>'tax_id'                   -- NULL — שדה לא קיים עדיין
organization_address_snapshot      = o.settings->>'address'                  -- NULL — שדה לא קיים עדיין
organization_phone_snapshot        = o.settings->>'phone'                    -- NULL — שדה לא קיים עדיין
organization_email_snapshot        = o.settings->>'email'                    -- NULL — שדה לא קיים עדיין
organization_legal_disclaimer_snapshot = o.settings->>'legal_disclaimer'     -- NULL — שדה לא קיים עדיין
```

**בפועל, רק 3 שדות יקבלו ערך אמיתי ב-backfill:**

- `inspector_full_name_snapshot` — כל המשתמשים יש להם full_name
- `inspector_email_snapshot` — כל המשתמשים יש להם email
- `organization_name_snapshot` — כל הארגונים יש להם name

**שאר השדות יהיו NULL** כי ה-data עדיין לא הוזן (inspector_settings ריק, organization settings חסרים).

## 8. סיכונים שזיהיתי

| סיכון                                                       | חומרה | מיטיגציה                                                |
| ----------------------------------------------------------- | ----- | ------------------------------------------------------- |
| Local DB ריק — backfill לא יעשה כלום מקומית                 | 🟡    | צפוי — backfill רלוונטי רק ל-Remote                     |
| רוב ה-snapshot fields יהיו NULL בbackfill                   | 🟡    | צפוי — הנתונים עדיין לא הוזנו. PDF fallback ל-live data |
| `professional_title` לא קיים כשדה — הכי קרוב זה `education` | 🟡    | ממפה education → professional_title_snapshot            |
| organization settings חסרים (legal_name, tax_id וכו')       | 🟡    | יתמלאו בשלב 2 עם מסך הגדרות ארגון                       |
| שני מקומות שיוצרים דוחות (wizard + apartments quick create) | 🟠    | צריך לעדכן שניהם עם snapshot logic                      |

## 9. שאלות פתוחות לחיים

1. **`inspector_professional_title_snapshot`** — האם למפות ל-`education` או להשאיר NULL ולהוסיף שדה `professional_title` ל-`InspectorSettings` בעתיד?

2. **Backfill ב-Remote עם רוב שדות NULL** — האם זה מקובל? ב-18 דוחות קיימים, רק `full_name`, `email`, `org_name` ימולאו. ה-PDF fallback יטפל בשאר.

3. **האם לאחד את לוגיקת יצירת דוח?** יש שני מקומות (wizard + apartments). אפשר ליצור helper function משותף, או לעדכן כל אחד בנפרד. מה מעדיף?

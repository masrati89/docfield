# Digital Signatures + Pre-PDF Summary — Design Spec

## Overview

Add digital signature capture and a pre-PDF summary screen to the report finalization flow. Inspector signature is saved once in Settings and reused across all reports. Tenant signature is captured per-report for protocol mesira (delivery) only. Summary screen shows defect counts by category before PDF generation.

## Flow

### Bedek Bayit (בדק בית)

```
"שתף" / "הורד PDF" → Summary Screen → PDF generated (inspector signature only) → Share/Download
```

### Protocol Mesira (פרוטוקול מסירה)

```
"שתף" / "הורד PDF" → Summary Screen → Tenant Signature Screen → PDF generated (both signatures) → Share/Download
```

## Feature 1: SignaturePad Component

Reusable Skia-based drawing canvas for signature capture.

**Location:** `components/ui/SignaturePad.tsx`

**Dependencies:** `@shopify/react-native-skia` (to install)

**Props:**

```typescript
interface SignaturePadProps {
  onSave: (base64Png: string) => void;
  onClear?: () => void;
  initialImage?: string; // base64 or URL for preview
  height?: number; // default 200
  disabled?: boolean;
  strokeColor?: string; // default '#000000'
  strokeWidth?: number; // default 2.5
  backgroundColor?: string; // default '#FFFFFF'
}
```

**Behavior:**

- White canvas with thin gray border (cr200)
- Smooth pen strokes using Skia Path with cubic interpolation
- "נקה" (Clear) button — top-left, text button
- Exports to base64 PNG via `makeImageSnapshot()`
- Minimum stroke validation — at least 2 distinct points required to save
- Canvas respects RTL layout

**Design:**

- Border: 1px cr200, radius 12px
- Background: white (#FFFFFF)
- Prompt text centered when empty: "חתום כאן" (n400, Rubik Regular 14)
- Height: 200px default, full width

## Feature 2: Inspector Signature in Settings

**Location:** New `SignatureStampSection` component in `components/settings/`

**Position in Settings screen:** Between PreferencesSection and InfoSection

**UI:**

- Section title: "חתימה וחותמת"
- **Signature area:**
  - If no signature saved: SignaturePad component
  - If signature saved: Preview image (120px height) + "החלף" / "מחק" buttons
  - Save triggers upload to Supabase Storage → updates `users.signature_url`
- **Stamp area (optional):**
  - Label: "חותמת (אופציונלי)"
  - If no stamp: dashed border button "העלה חותמת" → expo-image-picker (gallery only)
  - If stamp saved: Preview image (100px height) + "החלף" / "מחק" buttons
  - Image cropped/resized to max 300x150 → upload to Storage → updates `users.stamp_url`
- Both are independently optional — inspector can have signature only, stamp only, or both

**Storage:**

- Signature: `signatures/{org_id}/inspector_{user_id}.png` (reuses existing bucket)
- Stamp: `signatures/{org_id}/stamp_{user_id}.png`
- Both stored as PNG, max 5MB (bucket limit)

**DB change:**

- New migration: `ALTER TABLE users ADD COLUMN stamp_url TEXT;`

## Feature 3: Pre-PDF Summary Screen

**Location:** `components/reports/PrePdfSummary.tsx`

**Triggered by:** "שתף" or "הורד PDF" buttons in ReportActionsBar

**Presentation:** Full-screen modal (same pattern as wizard — bottom sheet, 85% height, spring animation)

**Content:**

- **Header:** Report identifier (project name + apartment or freetext label)
- **Stats row:** Total defects count | Average severity badge
- **Category breakdown:** List of categories that have defects:
  - Category icon + Hebrew name + defect count
  - Sorted by count descending
  - Only categories with defects shown
- **Footer buttons:**
  - Bedek bayit: "הפק PDF" (primary green CTA)
  - Protocol mesira: "המשך לחתימה" (primary green CTA)
  - Both: "חזרה" (text button, left/start side)

**Data:** Uses already-fetched report data from `useReport` hook — no additional API calls.

## Feature 4: Tenant Signature Screen

**Location:** `components/reports/TenantSignatureScreen.tsx`

**Triggered by:** "המשך לחתימה" from Summary (protocol mesira only)

**Presentation:** Full-screen modal (replaces summary in same modal flow)

**Content:**

- **Header:** "חתימת דייר"
- **Signer name field:** Text input, required, placeholder "שם הדייר"
  - Pre-filled from `delivery_reports.tenant_name` if exists
- **SignaturePad:** Full-width drawing canvas
- **Footer:**
  - "חתום והפק PDF" (primary green CTA) — disabled until name filled + signature drawn
  - "חזרה" (text button)

**On submit:**

1. Export signature canvas to base64 PNG
2. Upload PNG to Supabase Storage: `signatures/{org_id}/{report_id}/tenant_{uuid}.png`
3. Insert row into `signatures` table (signer_type='tenant', signer_name, image_url)
4. Trigger PDF generation (existing `usePdfGeneration` hook)
5. Return to report screen with PDF ready

## Feature 5: Report Status Toggle

**Location:** Modify `ReportHeaderBar` or report detail screen header

**Current state:** Large "סמן כהושלם" button in ReportActionsBar

**New behavior:**

- Remove status transition buttons from ReportActionsBar
- Add small status badge/chip next to report title in header
- Tap badge → bottom sheet or dropdown with status options: "טיוטה" / "בביצוע" / "הושלם" / "נשלח"
- "הושלם" still requires confirmation (legal document)
- Revert from "הושלם" still requires double confirmation (Iron Rule preserved)
- No status change blocks or gates any other action

## Feature 6: Updated PDF Generation Flow

**Modified hook:** `usePdfGeneration.ts`

**Changes:**

- `generatePdf` now called AFTER signature flow completes (not directly from button)
- Inspector signature: fetched from `users.signature_url` (current user)
- Inspector stamp: fetched from `users.stamp_url` (current user)
- Tenant signature: fetched from `signatures` table (as already implemented)
- Both PDF templates already support signature rendering — no template changes needed

**New flow in hook:**

```typescript
// Called after summary + optional tenant signature
async function generateAndShare(
  reportId: string,
  action: 'share' | 'download'
) {
  // 1. Fetch inspector signature/stamp from current user profile
  // 2. Fetch tenant signature from signatures table (if exists)
  // 3. Generate HTML with all signatures
  // 4. Convert to PDF
  // 5. Share or save based on action
}
```

## New Files

| File                                            | Type      | Purpose                                          |
| ----------------------------------------------- | --------- | ------------------------------------------------ |
| `components/ui/SignaturePad.tsx`                | Component | Skia drawing canvas                              |
| `components/settings/SignatureStampSection.tsx` | Component | Settings section for inspector signature + stamp |
| `components/reports/PrePdfSummary.tsx`          | Component | Summary before PDF                               |
| `components/reports/TenantSignatureScreen.tsx`  | Component | Tenant signature capture                         |
| `hooks/useSignature.ts`                         | Hook      | Save/fetch signatures + stamps                   |
| `supabase/migrations/016_add_stamp_url.sql`     | Migration | Add stamp_url to users                           |

## Modified Files

| File                                      | Change                                                   |
| ----------------------------------------- | -------------------------------------------------------- |
| `components/settings/index.ts`            | Export SignatureStampSection                             |
| `components/reports/index.ts`             | Export PrePdfSummary, TenantSignatureScreen              |
| `app/(app)/settings/index.tsx`            | Add SignatureStampSection                                |
| `components/reports/ReportActionsBar.tsx` | Remove status buttons, trigger summary flow on PDF/share |
| `components/reports/ReportHeaderBar.tsx`  | Add status badge toggle                                  |
| `hooks/usePdfGeneration.ts`               | Integrate inspector signature from user profile          |
| `hooks/useReportStatus.ts`                | Simplify — only used by status badge now                 |
| `packages/shared/src/i18n/he.json`        | New keys for signature/summary UI                        |
| `packages/shared/src/i18n/en.json`        | New keys for signature/summary UI                        |

## i18n Keys (new)

```json
{
  "signature.title": "חתימה וחותמת",
  "signature.signHere": "חתום כאן",
  "signature.clear": "נקה",
  "signature.save": "שמור",
  "signature.replace": "החלף",
  "signature.delete": "מחק",
  "signature.stamp": "חותמת (אופציונלי)",
  "signature.uploadStamp": "העלה חותמת",
  "signature.tenantTitle": "חתימת דייר",
  "signature.tenantName": "שם הדייר",
  "signature.signAndGenerate": "חתום והפק PDF",
  "signature.noSignature": "לא הוגדרה חתימה — הגדר בהגדרות",
  "summary.title": "סיכום דוח",
  "summary.totalDefects": "סה\"כ ליקויים",
  "summary.generatePdf": "הפק PDF",
  "summary.continueToSignature": "המשך לחתימה",
  "summary.back": "חזרה"
}
```

## Design Tokens

All new UI follows existing design system:

- Backgrounds: cr50 (#FEFDFB)
- Borders: cr200 (#F5EFE6)
- Primary CTA: g500 (#1B7A44)
- Text: n700/n900
- Shadows: warm rgba(20,19,17,x)
- Border radius: 12px on cards/inputs, 10px minimum on interactive
- Font: Rubik throughout
- RTL: logical properties only (ms/me/ps/pe)
- Press feedback: scale(0.98) + Haptics.impactAsync(Light)

## Security

- **RLS:** Signatures table already has RLS with org_id isolation (migration 009). No UPDATE/DELETE policies (immutable). No changes needed.
- **Stamp access:** `users.stamp_url` protected by existing users table RLS (org_id scoped SELECT/UPDATE).
- **Storage policies:** Existing `signatures` bucket policies (org_id scoped INSERT/SELECT, no DELETE) cover both inspector and tenant signature uploads.
- **Validation:** New Zod schema `SignatureUploadSchema` in `packages/shared/src/validation/` — validates signer_name (min 2 chars, max 200), signer_type enum, delivery_report_id UUID.
- **Stamp upload validation:** File type (PNG/WebP only), max 5MB enforced by bucket config + client-side check.

## useSignature Hook Interface

```typescript
interface UseSignatureReturn {
  // Inspector (from user profile)
  inspectorSignatureUrl: string | null;
  inspectorStampUrl: string | null;
  saveInspectorSignature: (base64Png: string) => Promise<void>;
  deleteInspectorSignature: () => Promise<void>;
  saveInspectorStamp: (imageUri: string) => Promise<void>;
  deleteInspectorStamp: () => Promise<void>;

  // Tenant (per report)
  saveTenantSignature: (
    reportId: string,
    name: string,
    base64Png: string
  ) => Promise<void>;
  getTenantSignature: (reportId: string) => Promise<PdfSignature | null>;

  // State
  isUploading: boolean;
  error: string | null;
}
```

Integrates with `usePdfGeneration` by providing signature URLs that the PDF hook fetches during generation.

## UX Details

- **Loading states:** Signature upload shows skeleton overlay on canvas (SkeletonBlock pattern). PDF generation shows existing loading indicator from usePdfGeneration.
- **Button sizing:** All footer CTA buttons 48px height per design system. Text buttons 36px min-height.
- **SignaturePad in tenant modal:** Height adapts to available space (flex: 1) within the modal, minimum 200px. KeyboardAvoidingView wraps the modal content so name field + canvas stay visible when keyboard opens.
- **Back button:** Dismisses the modal (closes sheet), same as wizard pattern.
- **Dirty check:** If tenant has started signing (canvas has strokes) and taps back, show confirmation: "יש חתימה שלא נשמרה. לצאת?" per SCREEN_STANDARDS dirty check pattern.
- **Delete confirmation:** Deleting inspector signature/stamp requires confirmation dialog: "למחוק את החתימה?" with destructive-style confirm button.
- **Validation errors:** Tenant name field shows inline red error text below field if empty on submit attempt: "שם הדייר הוא שדה חובה". Disabled CTA is secondary visual indicator only.
- **Toast notifications:** Follow design system — success (primary[500]), error (clRed), 3s auto-dismiss, slide animation.

## Migration Numbering

Next migration file: `supabase/migrations/016_add_stamp_url.sql` (follows existing 015_nullable_apartment_id.sql).

## Storage Path Convention

All paths use existing `signatures` bucket with consistent org_id prefix:

```
signatures/{org_id}/inspector_{user_id}.png       # Inspector signature
signatures/{org_id}/stamp_{user_id}.png            # Inspector stamp
signatures/{org_id}/{report_id}/tenant_{uuid}.png  # Tenant signature per report
```

## Edge Cases

- **No inspector signature saved:** Show inline warning in summary: "לא הוגדרה חתימה — הגדר בהגדרות" with link to Settings. PDF still generates without signature.
- **Tenant cancels signature:** Returns to summary, nothing saved. Dirty check if canvas has strokes.
- **Report has no defects:** Summary shows "אין ליקויים" with checkmark icon. PDF still generates.
- **Existing tenant signature:** If re-generating PDF for a protocol that already has a tenant signature, skip signature screen and use existing. Show note: "חתימת דייר קיימת".
- **Network error during upload:** Toast error, signature not lost (stays on canvas), retry available.

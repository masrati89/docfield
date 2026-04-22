# Design Brief — Protocol Mesira PDF Mockup (פרוטוקול מסירה)

## What to build

A **React JSX mockup** (preview component, not real PDF) of a delivery protocol document — an A4 legal document used in Israeli construction inspections. **Two variants** needed:

1. **With checklist** — 3 pages
2. **Without checklist** — 3 pages

Use a page selector (buttons at top) to toggle between pages, and a variant toggle to switch between "with checklist" and "without checklist".

## Language & Direction

- **Hebrew (RTL)** — `direction: rtl` everywhere
- Font: `Rubik` from Google Fonts (import: `https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap`)

## Design System — Colors

```
dk     = #1a1a1a   (headings, primary text)
md     = #444444   (body text)
lt     = #777777   (secondary text, labels)
vlt    = #aaaaaa   (placeholders)
bg     = #FEFDFB   (page background — warm off-white, NOT pure white)
bdr    = #D1CEC8   (borders)
bdrLt  = #F5EFE6   (light borders, photo placeholders)
accent = #1B7A44   (green — primary brand color)
accentLt = #F0F7F4 (light green background)
red    = #b91c1c   (defect/error)
amber  = #92600a   (partial/warning)
```

## Page Container Style

```
width: 100%, maxWidth: 520px
aspectRatio: 210/297 (A4)
background: white
borderRadius: 2px
boxShadow: 0 2px 16px rgba(60,54,42,.10), 0 0 0 1px rgba(60,54,42,.06)
padding: 20px 24px
fontFamily: 'Rubik', sans-serif
direction: rtl
display: flex, flexDirection: column
```

Outer wrapper background: `#F5EFE6`

## Section Title Style

```
fontSize: 10px, fontWeight: 700, color: dk
padding: 4px 0 3px
borderBottom: 2px solid dk
marginBottom: 4px, marginTop: 8px
```

## Sub-Section Title Style (category headers in defects)

```
fontSize: 10px, fontWeight: 700, color: accent (#1B7A44)
padding: 4px 8px 3px
background: accentLt (#F0F7F4)
borderRight: 3px solid accent
borderRadius: 2px
marginTop: 8px, marginBottom: 3px
```

## Footer (bottom of every page)

```
marginTop: auto (pushes to bottom)
paddingTop: 6px, borderTop: 1px solid bdr
display: flex, justifyContent: space-between
fontSize: 6.5px, color: lt
Content: [Logo placeholder] — [עמוד N] — [פרוטוקול מסירה — DD.MM.YYYY]
```

---

## VARIANT 1 — With Checklist (עם צ'קליסט)

### Page 1

**Header:**

```
Left side:
  Line 1: "פרוטוקול מסירה" — fontSize: 13px, fontWeight: 700, color: dk
  Line 2: "מסירה ראשונית | תאריך: 25.03.2026 | מספר דוח: DF-2026-0412"
          fontSize: 7.5px, color: lt

Right side:
  Round badge: "סיבוב 1"
    fontSize: 7px, fontWeight: 700, color: white
    background: accent (#1B7A44), borderRadius: 8px
    padding: 2px 8px

  Logo placeholder: 52x20px box, border: 1px solid bdrLt, text "לוגו" centered

Separator: borderBottom: 2px solid dk
```

**Details box:**

```
marginTop: 4px
padding: 4px 8px
border: 1px solid bdr, borderRadius: 2px
background: bg (#FEFDFB)
fontSize: 9px
display: flex, flexWrap: wrap, gap: 2px 14px

Fields (label in lt color, value in dk fontWeight 500):
  פרויקט: פארק ת"א - בניין 3
  דירה: דירה 12, קומה 4
  דייר: ישראל כהן | ת.ז. 012345678 | 050-1234567
  מפקח: דני לוי, מהנדס בניין
```

**Checklist section:**

```
Section title: "צ׳קליסט מסירה"

Container: border: 1px solid bdr, borderRadius: 2px, padding: 6px 8px, background: bg

Layout: 2-column grid (grid-template-columns: 1fr 1fr, gap: 0 20px)

Category header:
  fontSize: 9px, fontWeight: 700, color: dk
  borderBottom: 0.5px solid bdr, paddingBottom: 2px, marginBottom: 2px

Checklist item:
  display: flex, alignItems: center, gap: 4px
  padding: 1.5px 0, fontSize: 10px, color: md

  Status symbol (left of text):
    width: 16px, height: 16px, borderRadius: 2px
    fontSize: 12px, fontWeight: 700, centered
    ✓ ok:      color: accent, background: #ecfdf5
    ✗ defect:  color: red,    background: #fef2f2
    ~ partial: color: amber,  background: #fefaed

  Text: flex: 1

  Reference (for non-ok items): "ראה סעיף #N"
    color: red, fontSize: 8px, flexShrink: 0

Column 1 categories & items:
  אינסטלציה:
    ברזים תקינים — ✗ (ref #2)
    כיורים מותקנים — ✓
    ניקוז תקין — ✗ (ref #5)
    אסלות תקינות — ✓
  חשמל:
    נקודות חשמל תקינות — ✓
    לוח חשמל תקין — ✓
    אינטרקום מותקן — ✗ (ref #1)
  ריצוף:
    ריצוף שלם ואחיד — ✗ (ref #3)
    ריצוף ספייר קיים — ✓

Column 2 categories & items:
  אלומיניום:
    חלונות נסגרים — ✓
    תריסים חשמליים — ✗ (ref #4)
    אטימה תקינה — ~ (ref #7)
  נגרות:
    דלתות פנים מותקנות — ✓
    ארונות מטבח — ✓
    משקופים שלמים — ✓
  שיש ומשטחים:
    שיש מטבח מותקן — ✓
    משטחי עבודה — ✓
  איטום:
    איטום חדרים רטובים — ✓
    שיפועים תקינים — ✗ (ref #6)

Legend bar (below checklist):
  borderTop: 0.5px solid bdr, marginTop: 4px, paddingTop: 3px
  display: flex, justifyContent: space-between
  fontSize: 8px, color: lt
  Left: ✓ תקין | ✗ לא תקין | ~ תקין חלקית
  Right: "22 פריטים | 15 תקין | 6 לא תקין | 1 חלקי" (fontWeight: 600, color: md)
```

**Defects start (2 defects on page 1):**

```
Section title: "ממצאים"

Sub-section title: "חשמל" (green accent bar)

Defect row:
  padding: 4px 0 5px, borderBottom: 0.5px solid bdrLt

  Layout:
    Number: fontSize: 10px, fontWeight: 600, color: md, width: 16px
    Content (flex: 1):
      Title: fontSize: 11px, fontWeight: 500, color: dk
      Location: fontSize: 9px, color: lt, marginTop: 1px
      Recommendation: fontSize: 9px, color: accent (#1B7A44), marginTop: 2px
        Format: "המלצה: [text]"
      Photos row: display: flex, gap: 3px, marginTop: 4px, marginRight: 22px
        Photo: 80x60px, borderRadius: 2px
        Placeholder: background bdrLt, border 1px solid bdrLt, camera icon centered

Defect 1: (sub-section: חשמל)
  1. אינטרקום לא מותקן במבואת הכניסה
     מבואת כניסה
     המלצה: להתקין אינטרקום תקני בהתאם לתוכנית החשמל
     [photo placeholder]

Defect 2: (sub-section: אינסטלציה)
  2. נזילה בברז כיור מטבח — ברז חם לא נסגר עד הסוף
     מטבח
     המלצה: להחליף ברז או אטם פנימי
     [photo placeholder] [photo placeholder]
```

### Page 2 — Continuation Defects

**Mini header:**

```
display: flex, justifyContent: space-between
paddingBottom: 4px, borderBottom: 1px solid bdr
Left: "פרוטוקול מסירה | פארק ת"א | דירה 12" — fontSize: 9px, fontWeight: 600, color: dk
Right: Logo placeholder
```

**Section title:** "ממצאים (המשך)"

**5 defects with same structure as page 1:**

```
Defect 3: (ריצוף) מרצפת שבורה בכניסה לדירה — פינה ימנית / מבואת כניסה / המלצה: להחליף מרצפת שבורה / 4 photos
Defect 4: (אלומיניום) תריס חשמלי בסלון לא יורד עד הסוף / סלון / המלצה: לכוון מנוע תריס ולבדוק פסי הסטה / 2 photos
Defect 5: (אינסטלציה) ניקוז איטי במקלחת / חדר רחצה / המלצה: לנקות נקז ולבדוק שיפוע / 1 photo
Defect 6: (איטום) שיפועים לא תקינים במרפסת שירות / מרפסת שירות / המלצה: לתקן שיפועים בהתאם לתקן / 3 photos
Defect 7: (אלומיניום) אטימה חלקית בחלון חדר שינה 1 / חדר שינה 1 / המלצה: להחליף גומיית אטימה / 2 photos
```

### Page 3 — Summary + Signatures

**Mini header** (same as page 2)

**Section: "סיכום"**

```
4 stat cards in grid (grid-template-columns: 1fr 1fr 1fr 1fr, gap: 5px)
Each card: textAlign center, padding: 5px 3px, borderRadius: 3px, border: 1px solid bdrLt

Card 1: "22" (fontSize: 14px, fontWeight: 700) + "פריטים" (fontSize: 6.5px, color: lt) — bg: bg
Card 2: "15" + "תקין" — bg: #ecfdf5
Card 3: "6" + "לא תקין" — bg: #fef2f2
Card 4: "1" + "חלקי" — bg: #fefaed
```

**Section: "קבלת מפתחות"** — HIDDEN for round 1. Show note: "\* מפתחות יימסרו במסירה הסופית" in lt color, fontSize 8px, italic

**Section: "הערות הדייר"**

```
padding: 5px 8px, border: 1px solid bdr, borderRadius: 2px, background: bg
minHeight: 24px, fontSize: 9px, color: md, lineHeight: 1.5
Text: "הדייר מבקש תיקון דחוף של האינטרקום והתריס בסלון. שאר הממצאים ניתנים לתיקון בתוך 30 יום."
```

**Section: "תנאים ואחריות"**

```
fontSize: 8px, color: lt, lineHeight: 1.5
Text: 'פרוטוקול זה נערך בהתאם לחוק המכר (דירות), תשל"ג-1973. תקופת הבדק בהתאם לסוג הליקוי (בין שנה ל-7 שנים). תקופת אחריות 3 שנים מתום תקופת הבדק. הדייר מתבקש לשמור מסמך זה כאסמכתא.'
```

**Section: "חתימות"**

```
2-column grid, gap: 16px

Each signature box:
  Label: fontSize: 7.5px, color: lt (מפקח / דייר)
  Signature area: height: 32px, border: 1px solid bdr, borderRadius: 2px, centered "חתימה" in vlt
  Name: fontSize: 7.5px, fontWeight: 500, color: dk
  Date: fontSize: 6px, color: lt

Box 1: מפקח / דני לוי / 25.03.2026
Box 2: דייר / ישראל כהן / 25.03.2026
```

**Company stamp:**

```
marginTop: 10px, textAlign: center
Inline-block box: padding: 5px 18px, border: 1px solid bdr, borderRadius: 3px
Text: "חותמת חברה" fontSize: 7px, color: vlt
```

---

## VARIANT 2 — Without Checklist (ללא צ'קליסט)

### Page 1 — same header & details, NO checklist, MORE defects

Everything same as Variant 1 page 1 EXCEPT:

- **No checklist section at all**
- **6 defects fit on page 1** (instead of 2)
- Defects 1-6 with the same sub-section category headers

```
Defect 1: (חשמל) אינטרקום לא מותקן / מבואת כניסה / המלצה: להתקין אינטרקום תקני / 1 photo
Defect 2: (אינסטלציה) נזילה בברז / מטבח / המלצה: להחליף ברז או אטם / 2 photos
Defect 3: (ריצוף) מרצפת שבורה / מבואת כניסה / המלצה: להחליף מרצפת / 4 photos
Defect 4: (אלומיניום) תריס חשמלי / סלון / המלצה: לכוון מנוע תריס / 2 photos
Defect 5: (אינסטלציה) ניקוז איטי / חדר רחצה / המלצה: לנקות נקז / 1 photo
Defect 6: (איטום) שיפועים לא תקינים / מרפסת שירות / המלצה: לתקן שיפועים / 3 photos
```

### Page 2 — Remaining defects

Same mini header pattern.

```
Defect 7: (אלומיניום) אטימה חלקית / חדר שינה 1 / המלצה: להחליף גומיית אטימה / 2 photos
```

### Page 3 — Summary + Signatures

Same as Variant 1 page 3 EXCEPT the summary section:

**Section: "סיכום ממצאים"**

```
Category cards — dynamic number of cards based on categories + 1 total card
Use grid: grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)), gap: 5px

Card per category (each with a unique soft color):
  [חשמל: 1] bg: #FFF4E5
  [אינסטלציה: 2] bg: #E8F4FD
  [ריצוף: 1] bg: #FEF7E0
  [אלומיניום: 2] bg: #F3E8F9
  [איטום: 1] bg: #FEF2F2

Last card (total, always):
  [סה"כ: 7] bg: bg (#FEFDFB), border slightly darker (bdr)

Each card: same style as checklist summary cards
  Number: fontSize: 14px, fontWeight: 700, color: dk
  Label: fontSize: 6.5px, color: lt
```

**Key delivery section:** Show normally for round 2+ (this variant can be any round).

Everything else same as Variant 1 page 3.

---

## Interaction

Add at the top of the component:

1. **Variant toggle**: two buttons — "עם צ'קליסט" / "ללא צ'קליסט" (highlight active with accent bg + white text, inactive: white bg + #555 text)
2. **Page selector**: "עמוד 1" / "עמוד 2" / "עמוד 3" buttons (same toggle style, dk bg when active)

Both button rows: display flex, gap 5px, flexWrap wrap, justifyContent center, marginBottom 8px

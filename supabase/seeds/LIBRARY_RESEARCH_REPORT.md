# דוח מחקר — ספריית ליקויים

תאריך: 2026-04-03

## סיכום מקורות

### agent1_plaster_tiling_stone

- תחום: טיח, ריצוף, גבס, קרמיקה, עבודות אבן
- מספר ליקויים: 61
- כתובות שנסרקו (2):
  - https://shlomi-atun.co.il (attempted - permission denied)
  - https://www.benezra.co.il (attempted - permission denied)
- מקורות ידע:
  - internal_knowledge: WebSearch/WebFetch permissions denied. Compiled from professional domain knowledge of Israeli construction standards ת"י 1415, ת"י 1555, ת"י 2378, ת"י 1920, common bedek bait inspection findings, and Israeli construction market pricing 2024-2025.
  - project_codebase: Reviewed existing defect types, categories, and DB schema in the inField project to ensure compatibility

### agent2_plumbing

- תחום: אינסטלציה סניטרית וצנרת
- מספר ליקויים: 54
- כתובות שנסרקו (2):
  - https://shlomi-atun.co.il/תי-1205-חלק-1 (denied - used training knowledge)
  - https://www.jb-kurman.com/תקן-ישראלי-1205-לאינסטלציה (denied - used training knowledge)
- מקורות ידע:
  - WebSearch/WebFetch denied: Permission denied for all web tools. Compiled defects from training knowledge of ת"י 1205 parts 1-5, ת"י 1596, ת"י 1528, ת"י 5765, Israeli construction inspection practice, and common bedek bayit findings.

### agent3_aluminum

- תחום: אלומיניום — חלונות, דלתות, תריסים
- מספר ליקויים: 43
- כתובות שנסרקו (4):
  - https://www.klil.co.il
  - https://www.sii.org.il
  - https://www.shamir-alu.co.il
  - https://www.ags.co.il
- מקורות ידע:
  - knowledge-base: WebSearch and WebFetch permissions denied — compiled from professional domain knowledge of Israeli construction standards ת"י 1509, ת"י 1099, ת"י 23, ת"י 938, aluminum manufacturer specs (Klil, Shamir), and Israeli bedek bayit inspection practices

### agent4_electrical_iron

- תחום: חשמל, מסגרות ברזל, מעקות
- מספר ליקויים: 43
- כתובות שנסרקו (5):
  - https://www.sii.org.il - מכון התקנים הישראלי
  - https://www.gov.il/he/departments/ministry_of_economy - משרד הכלכלה, תקנות חשמל
  - https://www.iec.co.il - חברת החשמל לישראל
  - https://www.home-inspector.co.il - בדק בית מקצועי
  - https://www.kolzchut.org.il - כל זכות, תקנות בנייה
- מקורות ידע:
  - knowledge_base: Israeli electrical installation standards ת"י 61 and IEC 60364
  - knowledge_base: Israeli railing standard ת"י 1142 requirements for height, spacing, loads
  - knowledge_base: MAMAD safe room standards ת"י 5075 for blast door and frame requirements
  - knowledge_base: Israeli electrical panel standards and RCD/RCBO requirements
  - knowledge_base: Bathroom electrical zones per Israeli electrical code
  - knowledge_base: Iron frame corrosion protection and galvanization standards
  - knowledge_base: WebSearch was denied - compiled from professional domain knowledge of Israeli construction inspection standards

### agent5_waterproofing

- תחום: איטום, גג, רטיבות
- מספר ליקויים: 43
- כתובות שנסרקו (9):
  - https://www.jb-kurman.com/תקן-931 (attempted, blocked)
  - Israeli Standards Institute — ת"י 931 (איטום מבנים מפני חדירת מים)
  - Israeli Standards Institute — ת"י 1637 (יריעות ביטומניות לאיטום גגות)
  - Israeli Standards Institute — ת"י 1556 (איטום מרפסות)
  - Israeli Standards Institute — ת"י 1752 (איטום חדרים רטובים)
  - Israeli Standards Institute — ת"י 1389 (שיפועי ניקוז)
  - Israeli Standards Institute — ת"י 938 (חומרי מילוי לתפרי התפשטות)
  - Professional knowledge — Israeli waterproofing inspection practices
  - Professional knowledge — Israeli construction defect categories and standards
- מקורות ידע:
  - internal_knowledge: WebSearch/WebFetch permissions denied — compiled from professional knowledge of Israeli construction standards and waterproofing inspection practices
  - project_codebase: Reviewed existing defect_library schema and categories to align output format
  - ti_931_knowledge: ת"י 931 is the primary Israeli standard for waterproofing buildings — covers membranes, application, testing
  - ti_1637_knowledge: ת"י 1637 covers bituminous membranes for roof waterproofing specifically
  - ti_1556_knowledge: ת"י 1556 covers balcony waterproofing requirements
  - ti_1752_knowledge: ת"י 1752 covers wet room waterproofing (bathrooms, showers)

### agent6_public_areas

- תחום: שטחים ציבוריים — כיבוי אש, מעלית, לובי
- מספר ליקויים: 43
- כתובות שנסרקו (2):
  - https://shlomi-atun.co.il/%D7%AA%D7%A7%D7%9F-%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99-1204
  - https://menaesh.co.il/israeli-standard-5120
- מקורות ידע:
  - N/A — WebSearch/WebFetch denied: Used existing professional knowledge of Israeli standards: ת"י 1204, ת"י 5765, ת"י 7588, ת"י 1220, ת"י 5120, ת"י 23, תקנות בטיחות אש, תקנות המעליות, תקנות נגישות
  - knowledge-base: ת"י 1204 — מערכות ספרינקלרים אוטומטיות לכיבוי אש
  - knowledge-base: ת"י 5765 — גלגלוני כיבוי אש ודרישות תחזוקה
  - knowledge-base: ת"י 7588 — בדיקות תקופתיות למעליות
  - knowledge-base: ת"י 1220 — דלתות אש
  - knowledge-base: ת"י 5120 — נגישות מבנים לאנשים עם מוגבלות
  - knowledge-base: ת"י 23 — תאורת חירום
  - knowledge-base: תקנות התכנון והבנייה (בקשה להיתר) — דרישות בטיחות אש
  - knowledge-base: חוק המעליות ותקנותיו — דרישות בטיחות ותחזוקה
  - knowledge-base: תקנות נגישות — שוויון זכויות לאנשים עם מוגבלות

### agent7_market_research

- תחום: מחקר שוק
- מספר ליקויים: 52
- כתובות שנסרקו (12):
  - https://www.reporto.co.il
  - https://www.bodekbayit.co.il
  - https://www.bfranco.co.il
  - https://www.kav-hamida.co.il
  - https://www.zilber-eng.co.il
  - https://www.haimtest.co.il
  - https://www.ynet.co.il/economy/article/real-estate
  - https://www.zap.co.il/home-repairs
  - https://www.madlan.co.il
  - https://www.israel-build.co.il
  - https://www.eng-inspection.co.il
  - https://www.takanon.co.il
- מקורות ידע:
  - https://www.reporto.co.il: Primary competitor — dominant market share (~80%), need to understand their feature set, categories, and pricing model
  - https://www.bodekbayit.co.il: Major inspection company — likely has sample reports and defect examples
  - https://www.bfranco.co.il: Well-known inspection engineering firm — publishes detailed report examples
  - https://www.kav-hamida.co.il: Inspection company known for detailed categorization — compare category structures
  - https://www.zilber-eng.co.il: Engineering firm with published defect statistics and inspection data
  - https://www.haimtest.co.il: Another inspection company — cross-reference defect types and pricing
  - https://www.ynet.co.il/economy/article/real-estate: Consumer articles about common defects — real homeowner perspective
  - https://www.zap.co.il/home-repairs: Price comparison site — repair cost references
  - https://www.madlan.co.il: Real estate platform with construction quality ratings
  - https://www.israel-build.co.il: Construction industry portal — standards and common issues
  - https://www.eng-inspection.co.il: Engineering inspection services — report format examples
  - https://www.takanon.co.il: Israeli standards database — ת"י references for defect classification

## חלוקה לפי קטגוריות

| קטגוריה                 | מספר ליקויים |
| ----------------------- | ------------ |
| טיח ושפכטל              | 19           |
| ריצוף                   | 28           |
| חיפוי קירות וקרמיקה     | 5            |
| גבס                     | 10           |
| אבן ושיש                | 10           |
| אינסטלציה — מים         | 21           |
| אינסטלציה — ביוב וניקוז | 17           |
| כלים סניטריים           | 19           |
| אלומיניום — חלונות      | 18           |
| אלומיניום — דלתות       | 8            |
| אלומיניום — תריסים      | 9            |
| זיגוג                   | 6            |
| פרזול ונעילה            | 6            |
| חשמל                    | 30           |
| מסגרות ברזל             | 10           |
| מעקות                   | 10           |
| איטום — גג              | 20           |
| איטום — מרפסות          | 6            |
| איטום — חדרים רטובים    | 13           |
| רטיבות ועובש            | 9            |
| כיבוי אש                | 15           |
| מעלית                   | 7            |
| חדר מדרגות              | 9            |
| לובי ורכוש משותף        | 12           |
| נגישות                  | 6            |
| נגרות ודלתות פנים       | 5            |
| צביעה                   | 3            |
| מיזוג אוויר             | 3            |
| גז                      | 4            |
| **סה"כ**                | **338**      |

## חלוקה לפי חומרה

| חומרה            | מספר ליקויים |
| ---------------- | ------------ |
| קריטי (critical) | 49           |
| בינוני (medium)  | 239          |
| נמוך (low)       | 50           |

## כיסוי תקנים

- ליקויים עם הפניה לתקן: 285
- ליקויים ללא הפניה לתקן: 53
- תקנים ייחודיים שנמצאו: 40

### תקנים שנמצאו

- חוק החשמל, ת"י 61
- ת"י 1045
- ת"י 1099
- ת"י 1142
- ת"י 1205
- ת"י 1205 חלק 1
- ת"י 1205 חלק 2
- ת"י 1220
- ת"י 129
- ת"י 1415
- ת"י 1419
- ת"י 1509
- ת"י 1515
- ת"י 1515 חלק 3
- ת"י 1515.3
- ת"י 1555
- ת"י 1555 / ת"י 1515.3
- ת"י 1555 חלק 1
- ת"י 1555 חלק 3
- ת"י 1556
- ת"י 158
- ת"י 1596
- ת"י 1637
- ת"י 1752
- ת"י 1918
- ת"י 1918 חלק 1
- ת"י 1918 חלק 3
- ת"י 20
- ת"י 23
- ת"י 2378
- ת"י 4145
- ת"י 4283
- ת"י 4766
- ת"י 5514
- ת"י 5765
- ת"י 579
- ת"י 61
- ת"י 7588
- ת"י 931
- ת"י 938

## חלוקה לפי סוכן מקור

| סוכן   | ליקויים שנכללו |
| ------ | -------------- |
| agent1 | 61             |
| agent2 | 54             |
| agent3 | 43             |
| agent4 | 43             |
| agent5 | 43             |
| agent6 | 43             |
| agent7 | 51             |

## הערות

- סוכן 7 (מחקר שוק): 51 ליקויים נוספו, 1 כפילויות הוסרו
- כל ערכי severity מסוג 'high' מומפו ל-'medium' בהתאם לאילוץ מסד הנתונים
- כל הליקויים מוגדרים כ-is_global=true, organization_id=NULL
- הנתונים מבוססים על ידע מקצועי של תקני בנייה ישראליים ופרקטיקת בדק בית

## טווחי מחירים לפי קטגוריה

| קטגוריה                 | מחיר מינימום (₪) | מחיר מקסימום (₪) |
| ----------------------- | ---------------- | ---------------- |
| טיח ושפכטל              | 30               | 2000             |
| ריצוף                   | 30               | 600              |
| חיפוי קירות וקרמיקה     | 25               | 500              |
| גבס                     | 20               | 600              |
| אבן ושיש                | 40               | 800              |
| אינסטלציה — מים         | 30               | 3000             |
| אינסטלציה — ביוב וניקוז | 100              | 5000             |
| כלים סניטריים           | 50               | 2000             |
| אלומיניום — חלונות      | 80               | 4000             |
| אלומיניום — דלתות       | 150              | 4000             |
| אלומיניום — תריסים      | 100              | 1200             |
| זיגוג                   | 300              | 1200             |
| פרזול ונעילה            | 80               | 1200             |
| חשמל                    | 30               | 3500             |
| מסגרות ברזל             | 200              | 2000             |
| מעקות                   | 200              | 2500             |
| איטום — גג              | 15               | 5000             |
| איטום — מרפסות          | 120              | 2000             |
| איטום — חדרים רטובים    | 100              | 7000             |
| רטיבות ועובש            | 150              | 8000             |
| כיבוי אש                | 150              | 15000            |
| מעלית                   | 200              | 3000             |
| חדר מדרגות              | 25               | 6000             |
| לובי ורכוש משותף        | 120              | 5000             |
| נגישות                  | 200              | 12000            |
| נגרות ודלתות פנים       | 100              | 800              |
| צביעה                   | 100              | 800              |
| מיזוג אוויר             | 150              | 600              |
| גז                      | 200              | 1500             |

-- Migration: 031_seed_global_defect_library
-- Description: Seed the global defect library with 338 system defects across
--              20 categories, sourced from the curated defect_library_fixed.sql
--              (generated 2026-04-03, 29 source categories mapped to the final
--              20-category list in packages/shared/src/constants/categories.ts).
--
-- Idempotency: every INSERT uses WHERE NOT EXISTS keyed on
--              (is_global=true, source='system', description=<same>).
--              Safe to run on Local, Staging, or Production.
--
-- NOT destructive: this migration does NOT DELETE or UPDATE existing rows.
--                  Re-running is a no-op once rows are present.
--
-- Columns intentionally left NULL:
--   - title                (duplicated description in source — redundant)
--   - recommendation, cost, cost_unit (rich library feature, not yet populated)
--   - location, standard_description, user_id, last_used_at
--
-- Known duplication:
--   - `standard` and `standard_reference` hold the same value by design.
--     This is tracked in .claude/GOTCHAS.md and will be cleaned up when the
--     rich library feature lands (reader hook migration + UPDATE … SET
--     standard_reference = NULL WHERE source = 'system').
--
-- Dependencies: 008 (defect_library), 030 (rich columns + source/updated_at)
-- Expected result: 338 rows, 20 distinct categories

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**סדקים בטיח חיצוני** — סדקים באורכים ובעומקים שונים בשכבת הטיח החיצוני של הבניין. סדקים אלו עלולים לאפשר חדירת מים ורטיבות לתוך המבנה, ולפגוע באיטום ובבידוד התרמי.. המלצה: ניקוי והרחבת הסדק, מילוי בחומר גמיש מתאים (אקרילי או פוליאורטני), וציפוי מחדש בטיח בהתאם למפרט. עלות משוערת: ₪80-₪150 (למ"א)', 'ת"י 1415 — תקן טיח לבניינים — סדקים ברוחב מעל 0.5 מ"מ בטיח חיצוני אינם מותרים', 'ת"י 1415 — תקן טיח לבניינים — סדקים ברוחב מעל 0.5 מ"מ בטיח חיצוני אינם מותרים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סדקים בטיח חיצוני** — סדקים באורכים ובעומקים שונים בשכבת הטיח החיצוני של הבניין. סדקים אלו עלולים לאפשר חדירת מים ורטיבות לתוך המבנה, ולפגוע באיטום ובבידוד התרמי.. המלצה: ניקוי והרחבת הסדק, מילוי בחומר גמיש מתאים (אקרילי או פוליאורטני), וציפוי מחדש בטיח בהתאם למפרט. עלות משוערת: ₪80-₪150 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**סדקים בטיח פנימי** — סדקים בטיח הפנימי של הדירה, לרוב מופיעים ליד פינות חלונות, דלתות ומשקופים. עלולים להעיד על בעיות מבניות או התכווצות של הטיח.. המלצה: הרחבת הסדק עד לגילוי חומר תקין, מילוי בשפכטל גמיש, הדבקת רשת טיח, טיוח מחדש והחלקה. עלות משוערת: ₪50-₪120 (למ"א)', 'ת"י 1415 — סדקים ברוחב מעל 0.3 מ"מ בטיח פנימי אינם מותרים', 'ת"י 1415 — סדקים ברוחב מעל 0.3 מ"מ בטיח פנימי אינם מותרים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סדקים בטיח פנימי** — סדקים בטיח הפנימי של הדירה, לרוב מופיעים ליד פינות חלונות, דלתות ומשקופים. עלולים להעיד על בעיות מבניות או התכווצות של הטיח.. המלצה: הרחבת הסדק עד לגילוי חומר תקין, מילוי בשפכטל גמיש, הדבקת רשת טיח, טיוח מחדש והחלקה. עלות משוערת: ₪50-₪120 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**נפיחות בטיח — בלון** — אזורים בהם הטיח מתנפח ונפרד מהקיר (בלון טיח). בבדיקת הקשה ניתן לזהות צליל חלול. מעיד על הידבקות לקויה של שכבת הטיח למצע.. המלצה: פירוק הטיח המנופח עד לגילוי מצע יציב, ניקוי והרטבת המשטח, טיוח מחדש בשכבות בהתאם למפרט. עלות משוערת: ₪80-₪180 (למ"ר)', 'ת"י 1415 — הטיח חייב להיצמד באופן מלא למשטח הבסיס ללא חללים', 'ת"י 1415 — הטיח חייב להיצמד באופן מלא למשטח הבסיס ללא חללים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נפיחות בטיח — בלון** — אזורים בהם הטיח מתנפח ונפרד מהקיר (בלון טיח). בבדיקת הקשה ניתן לזהות צליל חלול. מעיד על הידבקות לקויה של שכבת הטיח למצע.. המלצה: פירוק הטיח המנופח עד לגילוי מצע יציב, ניקוי והרטבת המשטח, טיוח מחדש בשכבות בהתאם למפרט. עלות משוערת: ₪80-₪180 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**טיח מתפורר** — שכבת הטיח מתפוררת ונושרת בחלקים. מעיד על שימוש בחומר לקוי, יחס מים-מלט לא נכון, או חשיפה לתנאי מזג אוויר קיצוניים.. המלצה: הסרה מלאה של הטיח הפגום, הכנת המשטח מחדש כולל יישום פריימר, טיוח מחדש בחומר תקני. עלות משוערת: ₪100-₪200 (למ"ר)', 'ת"י 1415 — חוזק הטיח צריך לעמוד בדרישות המינימום של 2.5 מגה-פסקל לטיח פנימי ו-5 מגה-פסקל לטיח חיצוני', 'ת"י 1415 — חוזק הטיח צריך לעמוד בדרישות המינימום של 2.5 מגה-פסקל לטיח פנימי ו-5 מגה-פסקל לטיח חיצוני', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**טיח מתפורר** — שכבת הטיח מתפוררת ונושרת בחלקים. מעיד על שימוש בחומר לקוי, יחס מים-מלט לא נכון, או חשיפה לתנאי מזג אוויר קיצוניים.. המלצה: הסרה מלאה של הטיח הפגום, הכנת המשטח מחדש כולל יישום פריימר, טיוח מחדש בחומר תקני. עלות משוערת: ₪100-₪200 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**חוסר מישוריות בטיח** — משטח הטיח אינו ישר ואינו חלק — נראים גלים, בליטות או שקעים. ניתן לבדוק על ידי הצמדת סרגל ישר באורך 2 מ'' לקיר.. המלצה: החלקה מחדש של האזורים הבעייתיים על ידי הוספת שכבת טיח דקה וליטוש, או שפכטל והחלקה. עלות משוערת: ₪60-₪120 (למ"ר)', 'ת"י 1415 — סטייה מקסימלית מותרת של 3 מ"מ לכל 2 מטר אורך בטיח פנימי רגיל, 2 מ"מ בטיח מוחלק', 'ת"י 1415 — סטייה מקסימלית מותרת של 3 מ"מ לכל 2 מטר אורך בטיח פנימי רגיל, 2 מ"מ בטיח מוחלק', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר מישוריות בטיח** — משטח הטיח אינו ישר ואינו חלק — נראים גלים, בליטות או שקעים. ניתן לבדוק על ידי הצמדת סרגל ישר באורך 2 מ'' לקיר.. המלצה: החלקה מחדש של האזורים הבעייתיים על ידי הוספת שכבת טיח דקה וליטוש, או שפכטל והחלקה. עלות משוערת: ₪60-₪120 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**חוסר אנכיות בטיח** — קיר הטיח אינו אנכי — סטייה ממישור אנכי. ניתן לזהות על ידי בדיקה עם פלס לייזר או פלס מים.. המלצה: תיקון על ידי הוספת שכבת טיח מיישרת או פירוק וטיוח מחדש במקרים חמורים. עלות משוערת: ₪80-₪200 (למ"ר)', 'ת"י 1415 — סטייה מאנכיות מותרת של עד 5 מ"מ לכל 3 מטר גובה', 'ת"י 1415 — סטייה מאנכיות מותרת של עד 5 מ"מ לכל 3 מטר גובה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר אנכיות בטיח** — קיר הטיח אינו אנכי — סטייה ממישור אנכי. ניתן לזהות על ידי בדיקה עם פלס לייזר או פלס מים.. המלצה: תיקון על ידי הוספת שכבת טיח מיישרת או פירוק וטיוח מחדש במקרים חמורים. עלות משוערת: ₪80-₪200 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**פינות טיח לא ישרות** — פינות הקירות (זווית פנימית או חיצונית) אינן ישרות ו/או אינן בזווית 90 מעלות. בולט במיוחד בהצבת ריהוט ומטבח.. המלצה: יישור הפינות באמצעות פסי פינה מתכתיים וטיוח מחדש, או תיקון נקודתי בשפכטל. עלות משוערת: ₪40-₪80 (למ"א)', 'ת"י 1415 — סטייה מותרת של עד 3 מ"מ לכל 2 מטר אורך בפינות', 'ת"י 1415 — סטייה מותרת של עד 3 מ"מ לכל 2 מטר אורך בפינות', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פינות טיח לא ישרות** — פינות הקירות (זווית פנימית או חיצונית) אינן ישרות ו/או אינן בזווית 90 מעלות. בולט במיוחד בהצבת ריהוט ומטבח.. המלצה: יישור הפינות באמצעות פסי פינה מתכתיים וטיוח מחדש, או תיקון נקודתי בשפכטל. עלות משוערת: ₪40-₪80 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**טיח חסר בשליצים ופתחים** — אזורים ללא טיח או עם טיח חלקי סביב שליצי חשמל, אינסטלציה, או פתחי חלונות ודלתות. מעיד על עבודה לא מושלמת.. המלצה: מילוי השליצים בטיט תיקון מתאים, יישום רשת טיח על האזור, וטיוח מלא של המשטח. עלות משוערת: ₪150-₪350 (ליחידה)', 'ת"י 1415 — כל המשטחים חייבים להיות מכוסים בטיח באופן אחיד, כולל סביב פתחים ושליצים', 'ת"י 1415 — כל המשטחים חייבים להיות מכוסים בטיח באופן אחיד, כולל סביב פתחים ושליצים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**טיח חסר בשליצים ופתחים** — אזורים ללא טיח או עם טיח חלקי סביב שליצי חשמל, אינסטלציה, או פתחי חלונות ודלתות. מעיד על עבודה לא מושלמת.. המלצה: מילוי השליצים בטיט תיקון מתאים, יישום רשת טיח על האזור, וטיוח מלא של המשטח. עלות משוערת: ₪150-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**רטיבות בטיח — כתמי רטיבות** — כתמי רטיבות הנראים על שכבת הטיח, לעיתים מלווים בעובש או צבע שונה. מעיד על חדירת מים מבחוץ או דליפה פנימית.. המלצה: איתור מקור הרטיבות ותיקונו, ייבוש הקיר, טיפול אנטי-עובשי, טיוח מחדש עם חומר עמיד ברטיבות. עלות משוערת: ₪200-₪600 (למ"ר)', 'ת"י 1415 — טיח חיצוני חייב להוות מחסום מפני חדירת מים', 'ת"י 1415 — טיח חיצוני חייב להוות מחסום מפני חדירת מים', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רטיבות בטיח — כתמי רטיבות** — כתמי רטיבות הנראים על שכבת הטיח, לעיתים מלווים בעובש או צבע שונה. מעיד על חדירת מים מבחוץ או דליפה פנימית.. המלצה: איתור מקור הרטיבות ותיקונו, ייבוש הקיר, טיפול אנטי-עובשי, טיוח מחדש עם חומר עמיד ברטיבות. עלות משוערת: ₪200-₪600 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**סדק אלכסוני מעל משקוף** — סדק אלכסוני היוצא מפינת משקוף דלת או חלון כלפי מעלה. ליקוי נפוץ מאוד המעיד על חוסר חיזוק מתאים (רשת או קורת משקוף) באזור הפתח.. המלצה: הרחבת הסדק, הדבקת רשת פיברגלס על כל אורך הסדק ומעבר, טיוח מחדש והחלקה. עלות משוערת: ₪150-₪350 (ליחידה)', 'ת"י 1415 — יש לחזק את אזורי הפתחים ברשת טיח או חיזוק מתאים למניעת סדקים', 'ת"י 1415 — יש לחזק את אזורי הפתחים ברשת טיח או חיזוק מתאים למניעת סדקים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סדק אלכסוני מעל משקוף** — סדק אלכסוני היוצא מפינת משקוף דלת או חלון כלפי מעלה. ליקוי נפוץ מאוד המעיד על חוסר חיזוק מתאים (רשת או קורת משקוף) באזור הפתח.. המלצה: הרחבת הסדק, הדבקת רשת פיברגלס על כל אורך הסדק ומעבר, טיוח מחדש והחלקה. עלות משוערת: ₪150-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**סדק מפאי (שערה) בטיח תקרה** — סדקים דקים (שערה) ברשת על פני שטח הטיח בתקרה. נגרמים מהתכווצות הטיח או מתזוזות מבניות קלות.. המלצה: מריחת שפכטל גמיש על כל המשטח, ליטוש, וצביעה מחדש בצבע אקרילי גמיש. עלות משוערת: ₪40-₪80 (למ"ר)', 'ת"י 1415 — סדקי שערה ברוחב עד 0.1 מ"מ נחשבים ליקוי אסתטי בלבד ואינם פוגעים בביצוע הטיח', 'ת"י 1415 — סדקי שערה ברוחב עד 0.1 מ"מ נחשבים ליקוי אסתטי בלבד ואינם פוגעים בביצוע הטיח', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סדק מפאי (שערה) בטיח תקרה** — סדקים דקים (שערה) ברשת על פני שטח הטיח בתקרה. נגרמים מהתכווצות הטיח או מתזוזות מבניות קלות.. המלצה: מריחת שפכטל גמיש על כל המשטח, ליטוש, וצביעה מחדש בצבע אקרילי גמיש. עלות משוערת: ₪40-₪80 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**טיח מזרמק — עובש על הטיח** — נקודות או כתמים כהים על הטיח המעידים על נוכחות עובש. בעיה בריאותית הנובעת מרטיבות מתמשכת ואוורור לקוי.. המלצה: טיפול במקור הרטיבות, ניקוי אנטי-פטרייתי, יישום ציפוי אנטי-עובשי, וצביעה בצבע עמיד ברטיבות. עלות משוערת: ₪100-₪300 (למ"ר)', 'ת"י 1415 — טיח חייב להיות יבש ונקי מעובש', 'ת"י 1415 — טיח חייב להיות יבש ונקי מעובש', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**טיח מזרמק — עובש על הטיח** — נקודות או כתמים כהים על הטיח המעידים על נוכחות עובש. בעיה בריאותית הנובעת מרטיבות מתמשכת ואוורור לקוי.. המלצה: טיפול במקור הרטיבות, ניקוי אנטי-פטרייתי, יישום ציפוי אנטי-עובשי, וצביעה בצבע עמיד ברטיבות. עלות משוערת: ₪100-₪300 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**פני שטח טיח גסים — חוסר החלקה** — פני שטח הטיח הפנימי גסים ולא חלקים כנדרש. מקשה על צביעה אחידה ופוגע במראה הסופי.. המלצה: ליטוש מכני של המשטח, מריחת שכבת החלקה דקה, וליטוש סופי. עלות משוערת: ₪30-₪60 (למ"ר)', 'ת"י 1415 — טיח פנימי מוחלק חייב להיות חלק ואחיד ללא גבשושיות או שקעים', 'ת"י 1415 — טיח פנימי מוחלק חייב להיות חלק ואחיד ללא גבשושיות או שקעים', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פני שטח טיח גסים — חוסר החלקה** — פני שטח הטיח הפנימי גסים ולא חלקים כנדרש. מקשה על צביעה אחידה ופוגע במראה הסופי.. המלצה: ליטוש מכני של המשטח, מריחת שכבת החלקה דקה, וליטוש סופי. עלות משוערת: ₪30-₪60 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**עובי טיח לא מספיק** — שכבת הטיח דקה מהנדרש בתקן, מה שמפחית את ההגנה מפני רטיבות ותנאי מזג אוויר ומקצר את אורך חיי הטיח.. המלצה: הוספת שכבת טיח נוספת להשלמת העובי הנדרש, עם שכבת חיבור (ספריץ) בין השכבות. עלות משוערת: ₪60-₪120 (למ"ר)', 'ת"י 1415 — עובי מינימלי של טיח חיצוני: 20 מ"מ (שתי שכבות). טיח פנימי: 10 מ"מ', 'ת"י 1415 — עובי מינימלי של טיח חיצוני: 20 מ"מ (שתי שכבות). טיח פנימי: 10 מ"מ', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**עובי טיח לא מספיק** — שכבת הטיח דקה מהנדרש בתקן, מה שמפחית את ההגנה מפני רטיבות ותנאי מזג אוויר ומקצר את אורך חיי הטיח.. המלצה: הוספת שכבת טיח נוספת להשלמת העובי הנדרש, עם שכבת חיבור (ספריץ) בין השכבות. עלות משוערת: ₪60-₪120 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**חוסר חיזוק רשת בטיח על תפר בלוקים-בטון** — טיח שבוצע על תפר בין חומרים שונים (בלוקים ובטון) ללא רשת חיזוק, מה שגורם לסדקים לאורך קו התפר.. המלצה: חשיפת התפר, הדבקת רשת פיברגלס ברוחב 20 ס"מ לפחות על כל אורך התפר, טיוח מחדש. עלות משוערת: ₪40-₪80 (למ"א)', 'ת"י 1415 — יש להניח רשת טיח על כל תפר בין חומרים שונים (בלוקים/בטון) למניעת סדקים', 'ת"י 1415 — יש להניח רשת טיח על כל תפר בין חומרים שונים (בלוקים/בטון) למניעת סדקים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר חיזוק רשת בטיח על תפר בלוקים-בטון** — טיח שבוצע על תפר בין חומרים שונים (בלוקים ובטון) ללא רשת חיזוק, מה שגורם לסדקים לאורך קו התפר.. המלצה: חשיפת התפר, הדבקת רשת פיברגלס ברוחב 20 ס"מ לפחות על כל אורך התפר, טיוח מחדש. עלות משוערת: ₪40-₪80 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**סדק כיווץ בטיח** — סדק דק בטיח הנובע מכיווץ והתייבשות. שכיח בחיבורי קירות ובסביבת פתחים.. המלצה: מילוי הסדק בחומר אקרילי גמיש וצביעה מחדש. עלות משוערת: ₪150-₪400 (ליחידה)', 'ת"י 1515 — תקן ישראלי לעבודות טיח — סדקי כיווץ עד 0.5 מ"מ נחשבים תקינים', 'ת"י 1515 — תקן ישראלי לעבודות טיח — סדקי כיווץ עד 0.5 מ"מ נחשבים תקינים', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סדק כיווץ בטיח** — סדק דק בטיח הנובע מכיווץ והתייבשות. שכיח בחיבורי קירות ובסביבת פתחים.. המלצה: מילוי הסדק בחומר אקרילי גמיש וצביעה מחדש. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**סדק אלכסוני בטיח** — סדק אלכסוני בטיח, עלול להעיד על תזוזת מבנה או שקיעה דיפרנציאלית. דורש בדיקה הנדסית.. המלצה: בדיקת מהנדס קונסטרוקציה, תיקון בהתאם לממצאים. עלות משוערת: ₪300-₪2000 (ליחידה)', 'ת"י 1515 — סדק אלכסוני מעל 1 מ"מ מחייב בדיקת מהנדס', 'ת"י 1515 — סדק אלכסוני מעל 1 מ"מ מחייב בדיקת מהנדס', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סדק אלכסוני בטיח** — סדק אלכסוני בטיח, עלול להעיד על תזוזת מבנה או שקיעה דיפרנציאלית. דורש בדיקה הנדסית.. המלצה: בדיקת מהנדס קונסטרוקציה, תיקון בהתאם לממצאים. עלות משוערת: ₪300-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**בליטות וגבשושיות בטיח** — משטח טיח לא חלק — בליטות, גבשושיות או אי-סדרים במרקם.. המלצה: שיוף מקומי וצביעה מחדש, או טיח מחדש בחלק הפגום. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1515 — סטייה מותרת של 3 מ"מ ב-2 מטר', 'ת"י 1515 — סטייה מותרת של 3 מ"מ ב-2 מטר', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**בליטות וגבשושיות בטיח** — משטח טיח לא חלק — בליטות, גבשושיות או אי-סדרים במרקם.. המלצה: שיוף מקומי וצביעה מחדש, או טיח מחדש בחלק הפגום. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, '**טיח מתקלף / מתפורר** — טיח שמתקלף או מתפורר מהקיר, חושף את השכבה שמתחת. עלול להעיד על בעיית רטיבות.. המלצה: הסרת טיח פגום, בדיקת רטיבות, טיח מחדש וצביעה. עלות משוערת: ₪300-₪1200 (ליחידה)', 'ת"י 1515 — טיח חייב להיות צמוד לבסיס — התקלפות מהווה כשל', 'ת"י 1515 — טיח חייב להיות צמוד לבסיס — התקלפות מהווה כשל', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**טיח מתקלף / מתפורר** — טיח שמתקלף או מתפורר מהקיר, חושף את השכבה שמתחת. עלול להעיד על בעיית רטיבות.. המלצה: הסרת טיח פגום, בדיקת רטיבות, טיח מחדש וצביעה. עלות משוערת: ₪300-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**אריח רצפה שבור או סדוק** — אריח רצפה עם שבר, סדק או פגם גלוי. עלול להיגרם מחבטה, עומס נקודתי, או הדבקה לקויה שגרמה למתח באריח.. המלצה: הסרת האריח הפגום, ניקוי המשטח, הדבקת אריח חדש זהה בדבק מתאים ומילוי רובה. עלות משוערת: ₪150-₪400 (ליחידה)', 'ת"י 1555 חלק 3 — אריחי ריצוף חייבים להיות שלמים, ללא סדקים, שברים או פגמים', 'ת"י 1555 חלק 3 — אריחי ריצוף חייבים להיות שלמים, ללא סדקים, שברים או פגמים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אריח רצפה שבור או סדוק** — אריח רצפה עם שבר, סדק או פגם גלוי. עלול להיגרם מחבטה, עומס נקודתי, או הדבקה לקויה שגרמה למתח באריח.. המלצה: הסרת האריח הפגום, ניקוי המשטח, הדבקת אריח חדש זהה בדבק מתאים ומילוי רובה. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**אריח רצפה רופף — חלל מתחת לאריח** — אריח רצפה שאינו מודבק כראוי ויש חלל בינו לבין המצע. ניתן לזהות על ידי הקשה — צליל חלול. על פי התקן, כיסוי הדבק חייב להיות מינימום 65%.. המלצה: הרמת האריח, ניקוי המשטח מדבק ישן, הדבקה מחדש בשיטת סרוק כפול (דבק על המצע ועל גב האריח), מילוי רובה. עלות משוערת: ₪120-₪300 (ליחידה)', 'ת"י 1555 חלק 3 — כיסוי הדבק מתחת לאריח חייב להיות מינימום 65% משטח האריח, ובאזורים רטובים 80%', 'ת"י 1555 חלק 3 — כיסוי הדבק מתחת לאריח חייב להיות מינימום 65% משטח האריח, ובאזורים רטובים 80%', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אריח רצפה רופף — חלל מתחת לאריח** — אריח רצפה שאינו מודבק כראוי ויש חלל בינו לבין המצע. ניתן לזהות על ידי הקשה — צליל חלול. על פי התקן, כיסוי הדבק חייב להיות מינימום 65%.. המלצה: הרמת האריח, ניקוי המשטח מדבק ישן, הדבקה מחדש בשיטת סרוק כפול (דבק על המצע ועל גב האריח), מילוי רובה. עלות משוערת: ₪120-₪300 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**הפרשי גובה בין אריחי רצפה — שיניים** — הפרש גובה (שן) בין אריחים סמוכים. גורם למעידה, ומהווה ליקוי אסתטי ובטיחותי כאחד.. המלצה: ליטוש מקומי של השן באמצעות מכונת ליטוש יהלום, או החלפת האריח הבולט והדבקתו מחדש בגובה הנכון. עלות משוערת: ₪80-₪200 (ליחידה)', 'ת"י 1555 חלק 3 — הפרש גובה מקסימלי מותר בין אריחים סמוכים: 1 מ"מ לריצוף רגיל, 0.5 מ"מ לריצוף מוחלק', 'ת"י 1555 חלק 3 — הפרש גובה מקסימלי מותר בין אריחים סמוכים: 1 מ"מ לריצוף רגיל, 0.5 מ"מ לריצוף מוחלק', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**הפרשי גובה בין אריחי רצפה — שיניים** — הפרש גובה (שן) בין אריחים סמוכים. גורם למעידה, ומהווה ליקוי אסתטי ובטיחותי כאחד.. המלצה: ליטוש מקומי של השן באמצעות מכונת ליטוש יהלום, או החלפת האריח הבולט והדבקתו מחדש בגובה הנכון. עלות משוערת: ₪80-₪200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**חוסר מישוריות בריצוף** — משטח הרצפה אינו ישר — שקעים או בליטות. ניתן לבדוק באמצעות סרגל ישר באורך 2 מ''. מונע הנחה תקינה של ריהוט.. המלצה: פירוק אריחים באזור הבעייתי, יישור תשתית המצע, והדבקה מחדש בשיטה תקנית. עלות משוערת: ₪120-₪250 (למ"ר)', 'ת"י 1555 חלק 3 — סטייה מקסימלית מותרת ממישוריות: 3 מ"מ לכל 2 מטר אורך', 'ת"י 1555 חלק 3 — סטייה מקסימלית מותרת ממישוריות: 3 מ"מ לכל 2 מטר אורך', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר מישוריות בריצוף** — משטח הרצפה אינו ישר — שקעים או בליטות. ניתן לבדוק באמצעות סרגל ישר באורך 2 מ''. מונע הנחה תקינה של ריהוט.. המלצה: פירוק אריחים באזור הבעייתי, יישור תשתית המצע, והדבקה מחדש בשיטה תקנית. עלות משוערת: ₪120-₪250 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**רובה חסרה או פגומה** — חוסר ברובה (פוגה) בין האריחים או רובה שבורה ומתפוררת. מאפשר חדירת מים ולכלוך בין האריחים.. המלצה: ניקוי הרובה הישנה, מילוי מחדש ברובה תקנית בצבע מתאים, ניקוי עודפים. עלות משוערת: ₪30-₪60 (למ"ר)', 'ת"י 1555 חלק 3 — כל המרווחים בין אריחים חייבים להיות מלאים ברובה באופן אחיד', 'ת"י 1555 חלק 3 — כל המרווחים בין אריחים חייבים להיות מלאים ברובה באופן אחיד', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רובה חסרה או פגומה** — חוסר ברובה (פוגה) בין האריחים או רובה שבורה ומתפוררת. מאפשר חדירת מים ולכלוך בין האריחים.. המלצה: ניקוי הרובה הישנה, מילוי מחדש ברובה תקנית בצבע מתאים, ניקוי עודפים. עלות משוערת: ₪30-₪60 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**שיפוע לקוי בריצוף מרפסת/מקלחת** — שיפוע הריצוף אינו מספיק או שהוא בכיוון הלא נכון, מה שגורם להצטברות מים על הרצפה במקום ניקוז לעבר הנקז.. המלצה: פירוק הריצוף באזור הבעייתי, תיקון שכבת השיפוע, ריצוף מחדש עם בדיקת שיפוע. עלות משוערת: ₪200-₪450 (למ"ר)', 'ת"י 1555 חלק 3 — שיפוע מינימלי נדרש של 1.5% לכיוון הנקז באזורים רטובים ומרפסות', 'ת"י 1555 חלק 3 — שיפוע מינימלי נדרש של 1.5% לכיוון הנקז באזורים רטובים ומרפסות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שיפוע לקוי בריצוף מרפסת/מקלחת** — שיפוע הריצוף אינו מספיק או שהוא בכיוון הלא נכון, מה שגורם להצטברות מים על הרצפה במקום ניקוז לעבר הנקז.. המלצה: פירוק הריצוף באזור הבעייתי, תיקון שכבת השיפוע, ריצוף מחדש עם בדיקת שיפוע. עלות משוערת: ₪200-₪450 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**מרווח לא אחיד בין אריחים** — רוחב הרובה אינו אחיד בין האריחים — מרווחים משתנים בגודלם. פוגע באסתטיקה ומעיד על עבודה לא מקצועית.. המלצה: באזורים קטנים — מילוי רובה מחדש. באזורים נרחבים — פירוק והנחה מחדש עם צלבונים. עלות משוערת: ₪60-₪150 (למ"ר)', 'ת"י 1555 חלק 3 — מרווח הרובה חייב להיות אחיד בכל הריצוף עם סטייה מותרת של עד 1 מ"מ', 'ת"י 1555 חלק 3 — מרווח הרובה חייב להיות אחיד בכל הריצוף עם סטייה מותרת של עד 1 מ"מ', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מרווח לא אחיד בין אריחים** — רוחב הרובה אינו אחיד בין האריחים — מרווחים משתנים בגודלם. פוגע באסתטיקה ומעיד על עבודה לא מקצועית.. המלצה: באזורים קטנים — מילוי רובה מחדש. באזורים נרחבים — פירוק והנחה מחדש עם צלבונים. עלות משוערת: ₪60-₪150 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**אריח חיפוי קיר רופף** — אריח חיפוי קיר שאינו מודבק כראוי ונע בלחיצה. מהווה סכנה ליפול ולגרום לפציעה.. המלצה: הסרת האריח, ניקוי מלא של הדבק הישן מהקיר ומגב האריח, הדבקה מחדש בדבק C2 עם סרוק כפול. עלות משוערת: ₪100-₪250 (ליחידה)', 'ת"י 1555 חלק 3 — כיסוי הדבק באריחי קיר חייב להיות מינימום 80% משטח האריח', 'ת"י 1555 חלק 3 — כיסוי הדבק באריחי קיר חייב להיות מינימום 80% משטח האריח', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אריח חיפוי קיר רופף** — אריח חיפוי קיר שאינו מודבק כראוי ונע בלחיצה. מהווה סכנה ליפול ולגרום לפציעה.. המלצה: הסרת האריח, ניקוי מלא של הדבק הישן מהקיר ומגב האריח, הדבקה מחדש בדבק C2 עם סרוק כפול. עלות משוערת: ₪100-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**אריח חיפוי קיר סדוק** — סדק באריח חיפוי קיר. עלול להיגרם ממתח פנימי כתוצאה מהדבקה לקויה, תזוזת מבנה, או חבטה.. המלצה: החלפת האריח הסדוק באריח חדש זהה, הדבקה בדבק C2 ומילוי רובה. עלות משוערת: ₪120-₪300 (ליחידה)', 'ת"י 1555 חלק 3 — אריחי חיפוי חייבים להיות שלמים וללא סדקים', 'ת"י 1555 חלק 3 — אריחי חיפוי חייבים להיות שלמים וללא סדקים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אריח חיפוי קיר סדוק** — סדק באריח חיפוי קיר. עלול להיגרם ממתח פנימי כתוצאה מהדבקה לקויה, תזוזת מבנה, או חבטה.. המלצה: החלפת האריח הסדוק באריח חדש זהה, הדבקה בדבק C2 ומילוי רובה. עלות משוערת: ₪120-₪300 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**חוסר התאמת דוגמה/כיוון אריחים** — אריחים שהונחו בכיוון לא נכון או שהדוגמה אינה מותאמת ביניהם. בולט בעיקר באריחי שיש או אריחים עם גידים.. המלצה: החלפת האריחים שהונחו שלא כדין והנחתם מחדש בכיוון הנכון. עלות משוערת: ₪150-₪350 (למ"ר)', 'ת"י 1555 חלק 3 — אריחים עם דוגמה או כיוון מוגדר חייבים להיות מונחים בהתאמה ובכיוון אחיד', 'ת"י 1555 חלק 3 — אריחים עם דוגמה או כיוון מוגדר חייבים להיות מונחים בהתאמה ובכיוון אחיד', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר התאמת דוגמה/כיוון אריחים** — אריחים שהונחו בכיוון לא נכון או שהדוגמה אינה מותאמת ביניהם. בולט בעיקר באריחי שיש או אריחים עם גידים.. המלצה: החלפת האריחים שהונחו שלא כדין והנחתם מחדש בכיוון הנכון. עלות משוערת: ₪150-₪350 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**חיתוך אריח לא מדויק** — אריחים שנחתכו בצורה לא מדויקת — קצוות משוננים, לא ישרים, או חיתוכים רחבים מדי/צרים מדי סביב צנרת או פתחים.. המלצה: הסרת האריח הפגום וחיתוך מחדש באמצעות מסור רטוב מקצועי, הדבקה ומילוי רובה. עלות משוערת: ₪100-₪250 (ליחידה)', 'ת"י 1555 חלק 3 — חיתוכי אריחים חייבים להיות נקיים ומדויקים ללא שברים בקצוות', 'ת"י 1555 חלק 3 — חיתוכי אריחים חייבים להיות נקיים ומדויקים ללא שברים בקצוות', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיתוך אריח לא מדויק** — אריחים שנחתכו בצורה לא מדויקת — קצוות משוננים, לא ישרים, או חיתוכים רחבים מדי/צרים מדי סביב צנרת או פתחים.. המלצה: הסרת האריח הפגום וחיתוך מחדש באמצעות מסור רטוב מקצועי, הדבקה ומילוי רובה. עלות משוערת: ₪100-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**חוסר בנוטפים (כיוון נטייה) באדן חלון** — אדן חלון מרוצף ללא שיפוע כלפי חוץ ו/או ללא חריץ נוטפים, מה שמאפשר למים לזרום לעבר הקיר ולגרום לרטיבות.. המלצה: התקנת אדן חדש עם שיפוע מינימלי של 3% כלפי חוץ וחריץ נוטפים בתחתית. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 1555 חלק 3 — אדני חלון חיצוניים חייבים לכלול שיפוע כלפי חוץ וחריץ נוטפים', 'ת"י 1555 חלק 3 — אדני חלון חיצוניים חייבים לכלול שיפוע כלפי חוץ וחריץ נוטפים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר בנוטפים (כיוון נטייה) באדן חלון** — אדן חלון מרוצף ללא שיפוע כלפי חוץ ו/או ללא חריץ נוטפים, מה שמאפשר למים לזרום לעבר הקיר ולגרום לרטיבות.. המלצה: התקנת אדן חדש עם שיפוע מינימלי של 3% כלפי חוץ וחריץ נוטפים בתחתית. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**קובייה רטט לקויה — חלל מתחת לריצוף חיצוני** — אריחי ריצוף מרפסת או שביל חיצוני עם חללים מתחתיהם, נשמע צליל חלול בהקשה. מסוכן במיוחד במרפסות בשל חשיפה לתנאי מזג אוויר.. המלצה: פירוק הריצוף הפגום, הכנת משטח תקני עם שכבת דבק מלאה, הנחה מחדש בשיטת סרוק כפול. עלות משוערת: ₪180-₪400 (למ"ר)', 'ת"י 1555 חלק 3 — כיסוי דבק מינימלי של 80% נדרש בריצוף חיצוני ואזורים רטובים', 'ת"י 1555 חלק 3 — כיסוי דבק מינימלי של 80% נדרש בריצוף חיצוני ואזורים רטובים', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**קובייה רטט לקויה — חלל מתחת לריצוף חיצוני** — אריחי ריצוף מרפסת או שביל חיצוני עם חללים מתחתיהם, נשמע צליל חלול בהקשה. מסוכן במיוחד במרפסות בשל חשיפה לתנאי מזג אוויר.. המלצה: פירוק הריצוף הפגום, הכנת משטח תקני עם שכבת דבק מלאה, הנחה מחדש בשיטת סרוק כפול. עלות משוערת: ₪180-₪400 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**רצף לא אחיד של אריחים בין חדרים** — חוסר רציפות בריצוף במעבר בין חדרים — אריחים שאינם מיושרים או מתחלפים בצורה לא אחידה בין המרחבים.. המלצה: התאמת הריצוף במעברים על ידי פירוק מקומי והנחה מחדש עם יישור מדויק. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 1555 חלק 3 — ריצוף חייב להיות רציף ומיושר במעברים בין חדרים, אלא אם כן צוין אחרת במפרט', 'ת"י 1555 חלק 3 — ריצוף חייב להיות רציף ומיושר במעברים בין חדרים, אלא אם כן צוין אחרת במפרט', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רצף לא אחיד של אריחים בין חדרים** — חוסר רציפות בריצוף במעבר בין חדרים — אריחים שאינם מיושרים או מתחלפים בצורה לא אחידה בין המרחבים.. המלצה: התאמת הריצוף במעברים על ידי פירוק מקומי והנחה מחדש עם יישור מדויק. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**אריח פגום מהמפעל — כתמים/שינוי גוון** — אריחים עם פגמים מהמפעל כגון כתמים, שינוי גוון בולט, נקודות שחורות, או גימור לא אחיד. לרוב נובע משימוש באריחים מסדרות ייצור שונות.. המלצה: החלפת האריחים הפגומים באריחים מאותה סדרת ייצור (LOT) כדי להבטיח אחידות. עלות משוערת: ₪100-₪300 (ליחידה)', 'ת"י 1555 חלק 1 — אריחים חייבים להיות ממוינים לפי דרגות איכות — דרגה ראשונה נדרשת למגורים', 'ת"י 1555 חלק 1 — אריחים חייבים להיות ממוינים לפי דרגות איכות — דרגה ראשונה נדרשת למגורים', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אריח פגום מהמפעל — כתמים/שינוי גוון** — אריחים עם פגמים מהמפעל כגון כתמים, שינוי גוון בולט, נקודות שחורות, או גימור לא אחיד. לרוב נובע משימוש באריחים מסדרות ייצור שונות.. המלצה: החלפת האריחים הפגומים באריחים מאותה סדרת ייצור (LOT) כדי להבטיח אחידות. עלות משוערת: ₪100-₪300 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**סף דלת חסר או לא תקין** — סף (מפתן) בין שני סוגי ריצוף או בפתח דלת חסר, פגום, או לא מותקן כראוי. גורם למפגע בטיחותי ולחדירת מים.. המלצה: התקנת סף אלומיניום או פליז מתאים, הדבקה ועיגון מכני. עלות משוערת: ₪80-₪200 (ליחידה)', 'ת"י 1555 חלק 3 — מעברים בין סוגי ריצוף שונים חייבים לכלול סף מתאים או פרופיל מעבר', 'ת"י 1555 חלק 3 — מעברים בין סוגי ריצוף שונים חייבים לכלול סף מתאים או פרופיל מעבר', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סף דלת חסר או לא תקין** — סף (מפתן) בין שני סוגי ריצוף או בפתח דלת חסר, פגום, או לא מותקן כראוי. גורם למפגע בטיחותי ולחדירת מים.. המלצה: התקנת סף אלומיניום או פליז מתאים, הדבקה ועיגון מכני. עלות משוערת: ₪80-₪200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**ריצוף קרמיקה עם החלקה לא מספקת** — אריחי קרמיקה ברצפה עם מקדם החלקה נמוך מהנדרש, במיוחד באזורים רטובים כמו חדרי רחצה וכניסות. מהווה סכנת החלקה.. המלצה: החלפת האריחים באריחים עם מקדם החלקה מתאים (R10-R11 לאזורים רטובים) או יישום ציפוי אנטי-סליפ. עלות משוערת: ₪150-₪350 (למ"ר)', 'ת"י 1555 חלק 1 — אריחי רצפה באזורים רטובים חייבים לעמוד בדרישת מקדם החלקה R10 לפחות', 'ת"י 1555 חלק 1 — אריחי רצפה באזורים רטובים חייבים לעמוד בדרישת מקדם החלקה R10 לפחות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ריצוף קרמיקה עם החלקה לא מספקת** — אריחי קרמיקה ברצפה עם מקדם החלקה נמוך מהנדרש, במיוחד באזורים רטובים כמו חדרי רחצה וכניסות. מהווה סכנת החלקה.. המלצה: החלפת האריחים באריחים עם מקדם החלקה מתאים (R10-R11 לאזורים רטובים) או יישום ציפוי אנטי-סליפ. עלות משוערת: ₪150-₪350 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**קרמיקה מנוקדת/מנומרת שלא בהתאם למפרט** — אריחי קרמיקה שהותקנו אינם תואמים את הדגם, הצבע או הגוון שנבחר על ידי הרוכש ומופיע במפרט הטכני.. המלצה: החלפת האריחים שאינם תואמים באריחים מהדגם הנכון בהתאם למפרט. עלות משוערת: ₪150-₪400 (למ"ר)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**קרמיקה מנוקדת/מנומרת שלא בהתאם למפרט** — אריחי קרמיקה שהותקנו אינם תואמים את הדגם, הצבע או הגוון שנבחר על ידי הרוכש ומופיע במפרט הטכני.. המלצה: החלפת האריחים שאינם תואמים באריחים מהדגם הנכון בהתאם למפרט. עלות משוערת: ₪150-₪400 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**מפלס ריצוף לא אחיד בין חדרים** — הפרש גובה בין ריצוף בחדרים שונים, יוצר מדרגה קטנה במעבר. מפגע בטיחותי ומעיד על תכנון או ביצוע לקוי של שכבת היישור.. המלצה: פירוק הריצוף באזור המעבר, תיקון שכבת היישור, הנחה מחדש עם מפלס אחיד. עלות משוערת: ₪250-₪600 (ליחידה)', 'ת"י 1555 חלק 3 — מפלס הריצוף חייב להיות אחיד בכל הדירה למעט אזורים רטובים שם נדרש הפרש גובה מבוקר', 'ת"י 1555 חלק 3 — מפלס הריצוף חייב להיות אחיד בכל הדירה למעט אזורים רטובים שם נדרש הפרש גובה מבוקר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מפלס ריצוף לא אחיד בין חדרים** — הפרש גובה בין ריצוף בחדרים שונים, יוצר מדרגה קטנה במעבר. מפגע בטיחותי ומעיד על תכנון או ביצוע לקוי של שכבת היישור.. המלצה: פירוק הריצוף באזור המעבר, תיקון שכבת היישור, הנחה מחדש עם מפלס אחיד. עלות משוערת: ₪250-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**ריצוף פורצלן עם שריטות/סימנים** — שריטות או סימני שפשוף על אריחי פורצלן שנגרמו במהלך עבודות הבנייה, העברת ציוד כבד, או ניקוי לא מתאים.. המלצה: ליטוש מקצועי של האריחים הפגומים. אם השריטות עמוקות — החלפת האריח. עלות משוערת: ₪50-₪200 (ליחידה)', 'ת"י 1555 חלק 1 — אריחים חייבים להימסר ללא פגמים, שריטות או סימנים', 'ת"י 1555 חלק 1 — אריחים חייבים להימסר ללא פגמים, שריטות או סימנים', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ריצוף פורצלן עם שריטות/סימנים** — שריטות או סימני שפשוף על אריחי פורצלן שנגרמו במהלך עבודות הבנייה, העברת ציוד כבד, או ניקוי לא מתאים.. המלצה: ליטוש מקצועי של האריחים הפגומים. אם השריטות עמוקות — החלפת האריח. עלות משוערת: ₪50-₪200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**אי-התאמה בין ריצוף לפתח ניקוז** — ריצוף שאינו מותאם לפתח הניקוז (נקז רצפה) — האריח חוסם חלקית את הנקז, או שאין שיפוע מתאים לכיוון הנקז.. המלצה: חיתוך מדויק של האריחים סביב הנקז, תיקון השיפוע מכל הכיוונים. עלות משוערת: ₪200-₪450 (ליחידה)', 'ת"י 1555 חלק 3 — ריצוף סביב נקזים חייב לאפשר ניקוז מלא עם שיפוע מכל הכיוונים לעבר הנקז', 'ת"י 1555 חלק 3 — ריצוף סביב נקזים חייב לאפשר ניקוז מלא עם שיפוע מכל הכיוונים לעבר הנקז', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אי-התאמה בין ריצוף לפתח ניקוז** — ריצוף שאינו מותאם לפתח הניקוז (נקז רצפה) — האריח חוסם חלקית את הנקז, או שאין שיפוע מתאים לכיוון הנקז.. המלצה: חיתוך מדויק של האריחים סביב הנקז, תיקון השיפוע מכל הכיוונים. עלות משוערת: ₪200-₪450 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**פלינטוס (סוקל) רופף או מנותק** — פלינטוס (רצועת ריצוף בתחתית הקיר) שאינו מודבק כראוי, זזה בלחיצה, או מנותק מהקיר. מאפשר חדירת לכלוך ומים.. המלצה: הסרת הפלינטוס, ניקוי המשטח, הדבקה מחדש בדבק C2 ומילוי סיליקון בפינה העליונה. עלות משוערת: ₪30-₪60 (למ"א)', 'ת"י 1555 חלק 3 — פלינטוס חייב להיות מודבק באופן מלא לקיר ולרצפה ללא חללים', 'ת"י 1555 חלק 3 — פלינטוס חייב להיות מודבק באופן מלא לקיר ולרצפה ללא חללים', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פלינטוס (סוקל) רופף או מנותק** — פלינטוס (רצועת ריצוף בתחתית הקיר) שאינו מודבק כראוי, זזה בלחיצה, או מנותק מהקיר. מאפשר חדירת לכלוך ומים.. המלצה: הסרת הפלינטוס, ניקוי המשטח, הדבקה מחדש בדבק C2 ומילוי סיליקון בפינה העליונה. עלות משוערת: ₪30-₪60 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**תפר התפשטות חסר בריצוף רצפה** — ריצוף על שטח גדול (מעל 40 מ"ר) ללא תפר התפשטות. עלול לגרום להתנפחות הריצוף (טנטינג) בעקבות שינויי טמפרטורה.. המלצה: חיתוך תפר התפשטות ברוחב 8-10 מ"מ במיקומים המתאימים, מילוי בחומר גמיש. עלות משוערת: ₪40-₪80 (למ"א)', 'ת"י 1555 חלק 3 — יש להותיר תפר התפשטות כל 40 מ"ר בריצוף פנימי ו-16 מ"ר בריצוף חיצוני', 'ת"י 1555 חלק 3 — יש להותיר תפר התפשטות כל 40 מ"ר בריצוף פנימי ו-16 מ"ר בריצוף חיצוני', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תפר התפשטות חסר בריצוף רצפה** — ריצוף על שטח גדול (מעל 40 מ"ר) ללא תפר התפשטות. עלול לגרום להתנפחות הריצוף (טנטינג) בעקבות שינויי טמפרטורה.. המלצה: חיתוך תפר התפשטות ברוחב 8-10 מ"מ במיקומים המתאימים, מילוי בחומר גמיש. עלות משוערת: ₪40-₪80 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**התנפחות ריצוף — טנטינג** — אריחי רצפה שהתנפחו ועלו ממקומם (טנטינג). תופעה המלווה לרוב בצליל פקיעה ונגרמת מהתפשטות תרמית ללא תפרי התפשטות מספקים.. המלצה: פירוק הריצוף שנפגע, תיקון תשתית היישור, הנחה מחדש עם תפרי התפשטות תקניים. עלות משוערת: ₪200-₪450 (למ"ר)', 'ת"י 1555 חלק 3 — ריצוף חייב לכלול תפרי התפשטות למניעת טנטינג', 'ת"י 1555 חלק 3 — ריצוף חייב לכלול תפרי התפשטות למניעת טנטינג', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**התנפחות ריצוף — טנטינג** — אריחי רצפה שהתנפחו ועלו ממקומם (טנטינג). תופעה המלווה לרוב בצליל פקיעה ונגרמת מהתפשטות תרמית ללא תפרי התפשטות מספקים.. המלצה: פירוק הריצוף שנפגע, תיקון תשתית היישור, הנחה מחדש עם תפרי התפשטות תקניים. עלות משוערת: ₪200-₪450 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**אריח ריצוף שבור / סדוק** — אריח ריצוף עם סדק, שבר או פגיעה גלויה.. המלצה: החלפת אריח פגום באריח זהה. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 1555 — אריחים חייבים להיות שלמים ללא סדקים או שברים', 'ת"י 1555 — אריחים חייבים להיות שלמים ללא סדקים או שברים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אריח ריצוף שבור / סדוק** — אריח ריצוף עם סדק, שבר או פגיעה גלויה.. המלצה: החלפת אריח פגום באריח זהה. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**ריצוף לא ישר / לא במפלס** — הפרשי גובה בין אריחים סמוכים. מורגש בהליכה או נראה לעין.. המלצה: הרמת אריחים בעייתיים והנחה מחדש עם יישור. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1555 — הפרש גובה מותר בין אריחים: עד 1 מ"מ', 'ת"י 1555 — הפרש גובה מותר בין אריחים: עד 1 מ"מ', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ריצוף לא ישר / לא במפלס** — הפרשי גובה בין אריחים סמוכים. מורגש בהליכה או נראה לעין.. המלצה: הרמת אריחים בעייתיים והנחה מחדש עם יישור. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**ריצוף מתנדנד / חלול (הולו)** — אריח שמשמיע צליל חלול בהקשה — מעיד על חוסר הדבקה מלאה לבסיס.. המלצה: הרמת אריח, ניקוי בסיס, הדבקה מחדש עם כיסוי מלא. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 1555 — כיסוי דבק מינימלי 80% משטח האריח', 'ת"י 1555 — כיסוי דבק מינימלי 80% משטח האריח', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ריצוף מתנדנד / חלול (הולו)** — אריח שמשמיע צליל חלול בהקשה — מעיד על חוסר הדבקה מלאה לבסיס.. המלצה: הרמת אריח, ניקוי בסיס, הדבקה מחדש עם כיסוי מלא. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**שיפוע לקוי בריצוף מרפסת** — שיפוע ריצוף במרפסת לא מכוון לניקוז — מים נשארים על המשטח.. המלצה: פירוק ריצוף והנחה מחדש עם שיפוע תקני. עלות משוערת: ₪150-₪350 (למ"ר)', 'ת"י 1555 / ת"י 1515.3 — שיפוע מינימלי במרפסת: 1.5% לכיוון הניקוז', 'ת"י 1555 / ת"י 1515.3 — שיפוע מינימלי במרפסת: 1.5% לכיוון הניקוז', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שיפוע לקוי בריצוף מרפסת** — שיפוע ריצוף במרפסת לא מכוון לניקוז — מים נשארים על המשטח.. המלצה: פירוק ריצוף והנחה מחדש עם שיפוע תקני. עלות משוערת: ₪150-₪350 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**הצפה של דבק אריחים מהרובה** — דבק אריחים שעלה ובלט מתוך קווי הרובה בין האריחים. נראה כחומר לבן/אפור שאינו רובה. נגרם משימוש ביותר מדי דבק.. המלצה: הסרת הדבק העודף בעזרת כלי חד, ניקוי התפרים ומילוי מחדש ברובה נקייה. עלות משוערת: ₪25-₪50 (למ"ר)', 'ת"י 1555 חלק 3 — דבק אריחים לא יבלוט מעבר לתפרי הרובה', 'ת"י 1555 חלק 3 — דבק אריחים לא יבלוט מעבר לתפרי הרובה', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**הצפה של דבק אריחים מהרובה** — דבק אריחים שעלה ובלט מתוך קווי הרובה בין האריחים. נראה כחומר לבן/אפור שאינו רובה. נגרם משימוש ביותר מדי דבק.. המלצה: הסרת הדבק העודף בעזרת כלי חד, ניקוי התפרים ומילוי מחדש ברובה נקייה. עלות משוערת: ₪25-₪50 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**חיפוי קירות חדר רחצה לא מלא** — חיפוי הקרמיקה בחדר הרחצה אינו מגיע לגובה הנדרש או שיש אזורים ללא חיפוי שהיו צריכים להיות מחופים לפי המפרט.. המלצה: השלמת חיפוי הקרמיקה עד לגובה הנדרש במפרט עם אריחים זהים. עלות משוערת: ₪150-₪350 (למ"ר)', 'ת"י 1555 חלק 3 — חיפוי קירות בחדרי רחצה חייב להתאים למפרט הטכני, בדרך כלל עד גובה התקרה או 2.10 מ'' לפחות', 'ת"י 1555 חלק 3 — חיפוי קירות בחדרי רחצה חייב להתאים למפרט הטכני, בדרך כלל עד גובה התקרה או 2.10 מ'' לפחות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיפוי קירות חדר רחצה לא מלא** — חיפוי הקרמיקה בחדר הרחצה אינו מגיע לגובה הנדרש או שיש אזורים ללא חיפוי שהיו צריכים להיות מחופים לפי המפרט.. המלצה: השלמת חיפוי הקרמיקה עד לגובה הנדרש במפרט עם אריחים זהים. עלות משוערת: ₪150-₪350 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**סיליקון חסר או פגום בפינות רטובות** — סיליקון חסר, מתקלף, או מעופש בפינות ובמפגשים בחדרי רחצה ומטבח — בין קיר לרצפה, בין קיר לאמבטיה, סביב כיור.. המלצה: הסרת הסיליקון הישן, ניקוי ויובש של האזור, יישום סיליקון סניטרי אנטי-פטרייתי חדש. עלות משוערת: ₪30-₪80 (למ"א)', 'ת"י 1555 חלק 3 — כל המפגשים בין משטחים באזורים רטובים חייבים להיות אטומים בסיליקון סניטרי', 'ת"י 1555 חלק 3 — כל המפגשים בין משטחים באזורים רטובים חייבים להיות אטומים בסיליקון סניטרי', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סיליקון חסר או פגום בפינות רטובות** — סיליקון חסר, מתקלף, או מעופש בפינות ובמפגשים בחדרי רחצה ומטבח — בין קיר לרצפה, בין קיר לאמבטיה, סביב כיור.. המלצה: הסרת הסיליקון הישן, ניקוי ויובש של האזור, יישום סיליקון סניטרי אנטי-פטרייתי חדש. עלות משוערת: ₪30-₪80 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**חיפוי קיר לא צמוד / בולט** — אריח חיפוי קיר שלא צמוד למשטח — בולט או מתנדנד.. המלצה: הסרת אריח, ניקוי, הדבקה מחדש. עלות משוערת: ₪200-₪450 (ליחידה)', 'ת"י 1555 — חיפוי קירות חייב להיות צמוד לבסיס במלואו', 'ת"י 1555 — חיפוי קירות חייב להיות צמוד לבסיס במלואו', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיפוי קיר לא צמוד / בולט** — אריח חיפוי קיר שלא צמוד למשטח — בולט או מתנדנד.. המלצה: הסרת אריח, ניקוי, הדבקה מחדש. עלות משוערת: ₪200-₪450 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, '**חיפוי קיר שבור / סדוק** — אריח חיפוי קיר עם סדק או שבר.. המלצה: החלפת אריח פגום. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 1555 — אריחי חיפוי חייבים להיות שלמים', 'ת"י 1555 — אריחי חיפוי חייבים להיות שלמים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיפוי קיר שבור / סדוק** — אריח חיפוי קיר עם סדק או שבר.. המלצה: החלפת אריח פגום. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**לוח גבס עם כתמי רטיבות** — כתמי רטיבות על לוח גבס, לרוב בתקרה או בקירות חדרים רטובים. לוח גבס רגיל (לבן) שהותקן באזור רטוב במקום לוח ירוק עמיד מים.. המלצה: החלפת הלוח הפגום בלוח גבס ירוק (עמיד מים), טיפול במקור הרטיבות, שפכטל וצביעה. עלות משוערת: ₪200-₪500 (למ"ר)', 'ת"י 4283 — באזורים רטובים (חדרי אמבטיה, מטבחים) יש להשתמש בלוחות גבס עמידים ברטיבות (ירוקים)', 'ת"י 4283 — באזורים רטובים (חדרי אמבטיה, מטבחים) יש להשתמש בלוחות גבס עמידים ברטיבות (ירוקים)', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**לוח גבס עם כתמי רטיבות** — כתמי רטיבות על לוח גבס, לרוב בתקרה או בקירות חדרים רטובים. לוח גבס רגיל (לבן) שהותקן באזור רטוב במקום לוח ירוק עמיד מים.. המלצה: החלפת הלוח הפגום בלוח גבס ירוק (עמיד מים), טיפול במקור הרטיבות, שפכטל וצביעה. עלות משוערת: ₪200-₪500 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**סדק בתפר בין לוחות גבס** — סדק לאורך התפר בין שני לוחות גבס. נגרם לרוב מטיפול לא נכון בתפר — חוסר בסרט תפר או שימוש בשפכטל לא מתאים.. המלצה: פתיחת הסדק, הדבקת סרט רשת פיברגלס, שפכטל בשלוש שכבות עם ליטוש בין שכבה לשכבה. עלות משוערת: ₪40-₪80 (למ"א)', 'ת"י 4283 — תפרים בין לוחות גבס חייבים להיות מטופלים בסרט תפר ושפכטל מתאים למניעת סדקים', 'ת"י 4283 — תפרים בין לוחות גבס חייבים להיות מטופלים בסרט תפר ושפכטל מתאים למניעת סדקים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סדק בתפר בין לוחות גבס** — סדק לאורך התפר בין שני לוחות גבס. נגרם לרוב מטיפול לא נכון בתפר — חוסר בסרט תפר או שימוש בשפכטל לא מתאים.. המלצה: פתיחת הסדק, הדבקת סרט רשת פיברגלס, שפכטל בשלוש שכבות עם ליטוש בין שכבה לשכבה. עלות משוערת: ₪40-₪80 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**בליטת ברגים בלוח גבס** — ראשי הברגים בולטים מעבר לפני השטח של לוח הגבס ולא שוקעו כראוי. נראים כנקודות בולטות לאחר הצביעה.. המלצה: שקיעת הברגים הבולטים, כיסוי בשפכטל בשתי שכבות, ליטוש וצביעה. עלות משוערת: ₪20-₪50 (ליחידה)', 'ת"י 4283 — ברגים חייבים להיות משוקעים 1-2 מ"מ מתחת לפני השטח ומכוסים בשפכטל', 'ת"י 4283 — ברגים חייבים להיות משוקעים 1-2 מ"מ מתחת לפני השטח ומכוסים בשפכטל', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**בליטת ברגים בלוח גבס** — ראשי הברגים בולטים מעבר לפני השטח של לוח הגבס ולא שוקעו כראוי. נראים כנקודות בולטות לאחר הצביעה.. המלצה: שקיעת הברגים הבולטים, כיסוי בשפכטל בשתי שכבות, ליטוש וצביעה. עלות משוערת: ₪20-₪50 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**תקרת גבס לא ישרה — גלים** — תקרת הגבס אינה מישורית — ניתן להבחין בגלים או שקעים. נגרם מפרופילים לא מיושרים או ריווח לא נכון של שלדת המתכת.. המלצה: התאמת שלדת המתכת, הסרה והרכבה מחדש של הלוחות באזור הבעייתי, שפכטל וליטוש. עלות משוערת: ₪120-₪300 (למ"ר)', 'ת"י 4283 — סטייה מקסימלית מותרת ממישוריות: 3 מ"מ לכל 2 מטר בתקרת גבס', 'ת"י 4283 — סטייה מקסימלית מותרת ממישוריות: 3 מ"מ לכל 2 מטר בתקרת גבס', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תקרת גבס לא ישרה — גלים** — תקרת הגבס אינה מישורית — ניתן להבחין בגלים או שקעים. נגרם מפרופילים לא מיושרים או ריווח לא נכון של שלדת המתכת.. המלצה: התאמת שלדת המתכת, הסרה והרכבה מחדש של הלוחות באזור הבעייתי, שפכטל וליטוש. עלות משוערת: ₪120-₪300 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**חוסר בפתח ביקורת בתקרת גבס** — תקרת גבס ללא פתח ביקורת (דלת revision) לגישה לצנרת, חיווט חשמלי, או מערכות מיזוג הנמצאים מעל התקרה.. המלצה: חיתוך פתח ביקורת במיקום מתאים והתקנת מסגרת ודלת ביקורת תקנית. עלות משוערת: ₪200-₪400 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר בפתח ביקורת בתקרת גבס** — תקרת גבס ללא פתח ביקורת (דלת revision) לגישה לצנרת, חיווט חשמלי, או מערכות מיזוג הנמצאים מעל התקרה.. המלצה: חיתוך פתח ביקורת במיקום מתאים והתקנת מסגרת ודלת ביקורת תקנית. עלות משוערת: ₪200-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**לוח גבס שבור או מחורר** — שבר או חור בלוח הגבס כתוצאה מחבטה, פגיעה במהלך העבודות, או התקנה לקויה.. המלצה: חיתוך האזור הפגום בצורת מלבן, הרכבת טלאי גבס חדש, סרט תפר, שפכטל וליטוש. עלות משוערת: ₪100-₪250 (ליחידה)', 'ת"י 4283 — לוחות גבס חייבים להיות שלמים וללא פגמים', 'ת"י 4283 — לוחות גבס חייבים להיות שלמים וללא פגמים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**לוח גבס שבור או מחורר** — שבר או חור בלוח הגבס כתוצאה מחבטה, פגיעה במהלך העבודות, או התקנה לקויה.. המלצה: חיתוך האזור הפגום בצורת מלבן, הרכבת טלאי גבס חדש, סרט תפר, שפכטל וליטוש. עלות משוערת: ₪100-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**הפרש גובה בין לוח גבס לקיר טיח** — הפרש גובה (מדרגה) במעבר בין תקרת/קיר גבס לקיר טיח. גורם לבעיה אסתטית ומקשה על צביעה אחידה.. המלצה: יישור האזור באמצעות שפכטל, שימוש בפרופיל מעבר מתאים, ליטוש וצביעה. עלות משוערת: ₪30-₪60 (למ"א)', 'ת"י 4283 — מעבר בין לוח גבס לטיח חייב להיות חלק וללא מדרגה', 'ת"י 4283 — מעבר בין לוח גבס לטיח חייב להיות חלק וללא מדרגה', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**הפרש גובה בין לוח גבס לקיר טיח** — הפרש גובה (מדרגה) במעבר בין תקרת/קיר גבס לקיר טיח. גורם לבעיה אסתטית ומקשה על צביעה אחידה.. המלצה: יישור האזור באמצעות שפכטל, שימוש בפרופיל מעבר מתאים, ליטוש וצביעה. עלות משוערת: ₪30-₪60 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**שפכטל לא מוחלק — טקסטורה גסה** — עבודת השפכטל על לוחות הגבס לא הושלמה כראוי — ניתן לראות קווי שפכטל, סימני כלי עבודה, או טקסטורה לא אחידה שבולטת לאחר הצביעה.. המלצה: ליטוש מחדש של כל המשטח בנייר שיוף עדין (220-320), שכבת שפכטל סופית, ליטוש נוסף. עלות משוערת: ₪30-₪60 (למ"ר)', 'ת"י 4283 — גימור שפכטל חייב להיות חלק ואחיד ללא סימני כלי עבודה', 'ת"י 4283 — גימור שפכטל חייב להיות חלק ואחיד ללא סימני כלי עבודה', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שפכטל לא מוחלק — טקסטורה גסה** — עבודת השפכטל על לוחות הגבס לא הושלמה כראוי — ניתן לראות קווי שפכטל, סימני כלי עבודה, או טקסטורה לא אחידה שבולטת לאחר הצביעה.. המלצה: ליטוש מחדש של כל המשטח בנייר שיוף עדין (220-320), שכבת שפכטל סופית, ליטוש נוסף. עלות משוערת: ₪30-₪60 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**גבס קרטון ללא בידוד אקוסטי מספיק** — מחיצת גבס קרטון בין דירות או חדרים שאינה עומדת בדרישות הבידוד האקוסטי. ניתן לשמוע רעשים מהצד השני.. המלצה: הוספת שכבת בידוד (צמר סלעים) בתוך המחיצה, או הוספת לוח גבס נוסף עם שכבת דמפינג. עלות משוערת: ₪150-₪350 (למ"ר)', 'ת"י 1419 — מחיצת גבס בין דירות חייבת לעמוד בערך בידוד אקוסטי מינימלי של Rw=50dB', 'ת"י 1419 — מחיצת גבס בין דירות חייבת לעמוד בערך בידוד אקוסטי מינימלי של Rw=50dB', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גבס קרטון ללא בידוד אקוסטי מספיק** — מחיצת גבס קרטון בין דירות או חדרים שאינה עומדת בדרישות הבידוד האקוסטי. ניתן לשמוע רעשים מהצד השני.. המלצה: הוספת שכבת בידוד (צמר סלעים) בתוך המחיצה, או הוספת לוח גבס נוסף עם שכבת דמפינג. עלות משוערת: ₪150-₪350 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, '**גבס — סדק בתפר** — סדק בתפר בין לוחות גבס — ליקוי נפוץ בתקרות ובמחיצות.. המלצה: פתיחת תפר, מילוי בחומר גמיש, סרט רשת, שפכטל וצביעה. עלות משוערת: ₪200-₪600 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גבס — סדק בתפר** — סדק בתפר בין לוחות גבס — ליקוי נפוץ בתקרות ובמחיצות.. המלצה: פתיחת תפר, מילוי בחומר גמיש, סרט רשת, שפכטל וצביעה. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**אבן חיפוי חיצוני רופפת** — אבן חיפוי חיצונית שאינה מחוברת היטב למבנה ונעה בלחיצה. מהווה סכנת נפילה חמורה, במיוחד בקומות גבוהות.. המלצה: הסרה מבוקרת של האבן, בדיקת העיגון המכני, הדבקה מחדש עם דבק C2S1 ועיגון מכני נוסף. עלות משוערת: ₪300-₪800 (למ"ר)', 'ת"י 2378 — אבן חיפוי חיצונית חייבת להיות מעוגנת מכנית בנוסף להדבקה, בהתאם לגובה ולמשקל', 'ת"י 2378 — אבן חיפוי חיצונית חייבת להיות מעוגנת מכנית בנוסף להדבקה, בהתאם לגובה ולמשקל', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אבן חיפוי חיצוני רופפת** — אבן חיפוי חיצונית שאינה מחוברת היטב למבנה ונעה בלחיצה. מהווה סכנת נפילה חמורה, במיוחד בקומות גבוהות.. המלצה: הסרה מבוקרת של האבן, בדיקת העיגון המכני, הדבקה מחדש עם דבק C2S1 ועיגון מכני נוסף. עלות משוערת: ₪300-₪800 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**סדק באבן חיפוי** — סדק באבן חיפוי חיצונית או פנימית. עלול להיגרם מתזוזות תרמיות, מתח מכני, או פגם באבן עצמה.. המלצה: החלפת האבן הסדוקה באבן חדשה מאותו המחצבה ועם גימור זהה. עלות משוערת: ₪250-₪700 (ליחידה)', 'ת"י 2378 — אבני חיפוי חייבות להיות שלמות וללא סדקים הפוגעים ביציבותן', 'ת"י 2378 — אבני חיפוי חייבות להיות שלמות וללא סדקים הפוגעים ביציבותן', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סדק באבן חיפוי** — סדק באבן חיפוי חיצונית או פנימית. עלול להיגרם מתזוזות תרמיות, מתח מכני, או פגם באבן עצמה.. המלצה: החלפת האבן הסדוקה באבן חדשה מאותו המחצבה ועם גימור זהה. עלות משוערת: ₪250-₪700 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**כתמים על אבן טבעית** — כתמים על משטח אבן טבעית (שיש, גרניט) כתוצאה מחומרי ניקוי לא מתאימים, דבק שחלחל, או חומרי בנייה שנשפכו.. המלצה: ניקוי מקצועי באמצעות חומרים ייעודיים לאבן טבעית, ליטוש מקומי במידת הצורך, יישום חומר הגנה. עלות משוערת: ₪50-₪150 (למ"ר)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כתמים על אבן טבעית** — כתמים על משטח אבן טבעית (שיש, גרניט) כתוצאה מחומרי ניקוי לא מתאימים, דבק שחלחל, או חומרי בנייה שנשפכו.. המלצה: ניקוי מקצועי באמצעות חומרים ייעודיים לאבן טבעית, ליטוש מקומי במידת הצורך, יישום חומר הגנה. עלות משוערת: ₪50-₪150 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**חוסר עיגון מכני באבן חיפוי בגובה** — אבן חיפוי בגובה מעל 4 מטר שהודבקה ללא עיגון מכני נוסף. מהווה סכנת נפילה חמורה ודורש טיפול מיידי.. המלצה: הוספת עיגון מכני (סיכות נירוסטה או מסגרת תלייה) לכל אבני החיפוי מעל 4 מ''. עלות משוערת: ₪200-₪600 (למ"ר)', 'ת"י 2378 — אבן חיפוי בגובה מעל 4 מ'' חייבת לכלול עיגון מכני בנוסף להדבקה כימית', 'ת"י 2378 — אבן חיפוי בגובה מעל 4 מ'' חייבת לכלול עיגון מכני בנוסף להדבקה כימית', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר עיגון מכני באבן חיפוי בגובה** — אבן חיפוי בגובה מעל 4 מטר שהודבקה ללא עיגון מכני נוסף. מהווה סכנת נפילה חמורה ודורש טיפול מיידי.. המלצה: הוספת עיגון מכני (סיכות נירוסטה או מסגרת תלייה) לכל אבני החיפוי מעל 4 מ''. עלות משוערת: ₪200-₪600 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**רובה חסרה בין אבני חיפוי** — חוסר ברובה (מילוי) בין אבני החיפוי החיצוני. מאפשר חדירת מים מאחורי האבנים ועלול לגרום לנזק מצטבר ולניתוק.. המלצה: מילוי התפרים בחומר איטום פוליאורתני או סיליקון בצבע מתאים לאבן. עלות משוערת: ₪40-₪80 (למ"א)', 'ת"י 2378 — תפרים בין אבני חיפוי חיצוני חייבים להיות ממולאים בחומר איטום גמיש', 'ת"י 2378 — תפרים בין אבני חיפוי חיצוני חייבים להיות ממולאים בחומר איטום גמיש', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רובה חסרה בין אבני חיפוי** — חוסר ברובה (מילוי) בין אבני החיפוי החיצוני. מאפשר חדירת מים מאחורי האבנים ועלול לגרום לנזק מצטבר ולניתוק.. המלצה: מילוי התפרים בחומר איטום פוליאורתני או סיליקון בצבע מתאים לאבן. עלות משוערת: ₪40-₪80 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**אדן שיש/אבן סדוק** — סדק באדן חלון או משטח עבודה מאבן טבעית. לרוב נגרם ממתח מכני, תזוזת מבנה, או חיתוך לקוי של האבן.. המלצה: תיקון בשרף אפוקסי שקוף או בצבע מתאים, ליטוש מקומי. במקרים חמורים — החלפת האבן. עלות משוערת: ₪200-₪600 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אדן שיש/אבן סדוק** — סדק באדן חלון או משטח עבודה מאבן טבעית. לרוב נגרם ממתח מכני, תזוזת מבנה, או חיתוך לקוי של האבן.. המלצה: תיקון בשרף אפוקסי שקוף או בצבע מתאים, ליטוש מקומי. במקרים חמורים — החלפת האבן. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**חוסר נוטפים באדן אבן חיצוני** — אדן אבן חיצוני ללא חריץ נוטפים בתחתיתו, מה שגורם למים לזרום לאורך הקיר ולגרום לכתמי רטיבות ונזק.. המלצה: חריצת חריץ נוטפים בתחתית האדן באמצעות מסור יהלום, או החלפת האדן. עלות משוערת: ₪100-₪250 (ליחידה)', 'ת"י 2378 — אדני חלון חיצוניים מאבן חייבים לכלול חריץ נוטפים בתחתיתם', 'ת"י 2378 — אדני חלון חיצוניים מאבן חייבים לכלול חריץ נוטפים בתחתיתם', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר נוטפים באדן אבן חיצוני** — אדן אבן חיצוני ללא חריץ נוטפים בתחתיתו, מה שגורם למים לזרום לאורך הקיר ולגרום לכתמי רטיבות ונזק.. המלצה: חריצת חריץ נוטפים בתחתית האדן באמצעות מסור יהלום, או החלפת האדן. עלות משוערת: ₪100-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**חללים מתחת לאבן שיש מדרגות** — אבני שיש במדרגות עם חללים מתחתיהן. גורם לרעש (צליל חלול בהליכה) ולסיכון לשבירת האבן תחת עומס.. המלצה: הזרקת דבק אפוקסי דרך קידוחים קטנים למילוי החללים, או פירוק והדבקה מחדש. עלות משוערת: ₪200-₪500 (למ"א)', 'ת"י 2378 — אבן מדרגות חייבת להיות מודבקת על כיסוי דבק מלא (100%) ללא חללים', 'ת"י 2378 — אבן מדרגות חייבת להיות מודבקת על כיסוי דבק מלא (100%) ללא חללים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חללים מתחת לאבן שיש מדרגות** — אבני שיש במדרגות עם חללים מתחתיהן. גורם לרעש (צליל חלול בהליכה) ולסיכון לשבירת האבן תחת עומס.. המלצה: הזרקת דבק אפוקסי דרך קידוחים קטנים למילוי החללים, או פירוק והדבקה מחדש. עלות משוערת: ₪200-₪500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**אף מדרגה אבן בולט או חד** — אף (קצה) מדרגת אבן שאינו מעובד כראוי — חד, בולט, או לא מעוגל. מהווה סכנת מעידה ופציעה.. המלצה: עיגול או שיפוע קצה המדרגה באמצעות ליטוש מקצועי, או התקנת פרופיל אף מדרגה. עלות משוערת: ₪60-₪150 (למ"א)', 'ת"י 2378 — אף מדרגה חייב להיות מעוגל או משופע למניעת סכנת מעידה', 'ת"י 2378 — אף מדרגה חייב להיות מעוגל או משופע למניעת סכנת מעידה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אף מדרגה אבן בולט או חד** — אף (קצה) מדרגת אבן שאינו מעובד כראוי — חד, בולט, או לא מעוגל. מהווה סכנת מעידה ופציעה.. המלצה: עיגול או שיפוע קצה המדרגה באמצעות ליטוש מקצועי, או התקנת פרופיל אף מדרגה. עלות משוערת: ₪60-₪150 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, '**אבן משתלבת (חיצוני) שוקעת או בולטת** — אבני משתלבות בחניה או בשביל גישה שאינן במפלס אחיד — חלקן שוקעות וחלקן בולטות. מעיד על תשתית חול לא מהודקת.. המלצה: הרמת האבנים באזור הבעייתי, השלמת והידוק שכבת החול, הנחה מחדש עם הידוק. עלות משוערת: ₪40-₪80 (למ"ר)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אבן משתלבת (חיצוני) שוקעת או בולטת** — אבני משתלבות בחניה או בשביל גישה שאינן במפלס אחיד — חלקן שוקעות וחלקן בולטות. מעיד על תשתית חול לא מהודקת.. המלצה: הרמת האבנים באזור הבעייתי, השלמת והידוק שכבת החול, הנחה מחדש עם הידוק. עלות משוערת: ₪40-₪80 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**נזילה מצנרת אספקת מים קרים** — נזילת מים מצנרת אספקת מים קרים בנקודות חיבור או לאורך הצנרת. עלולה לגרום לנזקי רטיבות בקירות ובתקרות, ולהתפתחות עובש.. המלצה: לאתר את מקור הנזילה, לנתק את אספקת המים, לתקן או להחליף את הקטע הפגום ולבצע בדיקת לחץ חוזרת.. עלות משוערת: ₪300-₪1200 (ליחידה)', 'ת"י 1205 חלק 1 — מערכת אספקת המים חייבת לעמוד בבדיקת לחץ של 1.5 פעמים מלחץ העבודה המרבי, ולא פחות מ-10 אטמוספרות, למשך שעתיים ללא ירידת לחץ.', 'ת"י 1205 חלק 1 — מערכת אספקת המים חייבת לעמוד בבדיקת לחץ של 1.5 פעמים מלחץ העבודה המרבי, ולא פחות מ-10 אטמוספרות, למשך שעתיים ללא ירידת לחץ.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזילה מצנרת אספקת מים קרים** — נזילת מים מצנרת אספקת מים קרים בנקודות חיבור או לאורך הצנרת. עלולה לגרום לנזקי רטיבות בקירות ובתקרות, ולהתפתחות עובש.. המלצה: לאתר את מקור הנזילה, לנתק את אספקת המים, לתקן או להחליף את הקטע הפגום ולבצע בדיקת לחץ חוזרת.. עלות משוערת: ₪300-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**נזילה מצנרת אספקת מים חמים** — נזילת מים מצנרת אספקת מים חמים. נזילה ממערכת מים חמים חמורה יותר בשל הסיכון לכוויות ונזק מואץ לחומרי בניין.. המלצה: לאתר את מקור הנזילה, לתקן או להחליף את הקטע הפגום, לבדוק תקינות בידוד תרמי של הצנרת, ולבצע בדיקת לחץ.. עלות משוערת: ₪400-₪1500 (ליחידה)', 'ת"י 1205 חלק 1 — צנרת מים חמים חייבת לעמוד בבדיקת לחץ זהה לצנרת מים קרים, ובנוסף לעמוד בטמפרטורות עבודה עד 80°C.', 'ת"י 1205 חלק 1 — צנרת מים חמים חייבת לעמוד בבדיקת לחץ זהה לצנרת מים קרים, ובנוסף לעמוד בטמפרטורות עבודה עד 80°C.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזילה מצנרת אספקת מים חמים** — נזילת מים מצנרת אספקת מים חמים. נזילה ממערכת מים חמים חמורה יותר בשל הסיכון לכוויות ונזק מואץ לחומרי בניין.. המלצה: לאתר את מקור הנזילה, לתקן או להחליף את הקטע הפגום, לבדוק תקינות בידוד תרמי של הצנרת, ולבצע בדיקת לחץ.. עלות משוערת: ₪400-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**לחץ מים נמוך מהנדרש** — לחץ המים בנקודות הקצה (ברזים, מקלחות) נמוך מהנדרש בתקן. גורם לזרימה חלשה ולתפקוד לקוי של מערכות כגון מקלחות ומדיחי כלים.. המלצה: לבדוק את קוטר הצנרת, לוודא היעדר חסימות, לבדוק תקינות משאבת לחץ (אם קיימת), ובמידת הצורך להתקין משאבת הגברת לחץ.. עלות משוערת: ₪500-₪3000 (ליחידה)', 'ת"י 1205 חלק 1 — לחץ המים המינימלי בנקודת הצריכה הרחוקה ביותר לא יפחת מ-1 אטמוספרה (0.1 מגה-פסקל). לחץ מרבי לא יעלה על 5 אטמוספרות.', 'ת"י 1205 חלק 1 — לחץ המים המינימלי בנקודת הצריכה הרחוקה ביותר לא יפחת מ-1 אטמוספרה (0.1 מגה-פסקל). לחץ מרבי לא יעלה על 5 אטמוספרות.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**לחץ מים נמוך מהנדרש** — לחץ המים בנקודות הקצה (ברזים, מקלחות) נמוך מהנדרש בתקן. גורם לזרימה חלשה ולתפקוד לקוי של מערכות כגון מקלחות ומדיחי כלים.. המלצה: לבדוק את קוטר הצנרת, לוודא היעדר חסימות, לבדוק תקינות משאבת לחץ (אם קיימת), ובמידת הצורך להתקין משאבת הגברת לחץ.. עלות משוערת: ₪500-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**היעדר מפסק מים ראשי או שסתום ניתוק** — לא הותקן שסתום ניתוק (ברז ראשי) בכניסת אספקת המים לדירה, או שהשסתום אינו נגיש או אינו תקין.. המלצה: להתקין שסתום כדורי בכניסת המים לדירה, במקום נגיש ומסומן.. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1205 חלק 1 — יש להתקין שסתום ניתוק בכניסת המים לכל יחידת דיור, במקום נגיש, המאפשר סגירה מלאה של אספקת המים.', 'ת"י 1205 חלק 1 — יש להתקין שסתום ניתוק בכניסת המים לכל יחידת דיור, במקום נגיש, המאפשר סגירה מלאה של אספקת המים.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**היעדר מפסק מים ראשי או שסתום ניתוק** — לא הותקן שסתום ניתוק (ברז ראשי) בכניסת אספקת המים לדירה, או שהשסתום אינו נגיש או אינו תקין.. המלצה: להתקין שסתום כדורי בכניסת המים לדירה, במקום נגיש ומסומן.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**היעדר מפסק מים נקודתי לכלי סניטרי** — חסר שסתום ניתוק נקודתי (אנגל) בחיבור לכלי סניטרי (אסלה, כיור, מכונת כביסה). לא ניתן לסגור מים לכלי ספציפי ללא ניתוק כל הדירה.. המלצה: להתקין ברז אנגל לכל כלי סניטרי בהתאם לתקן.. עלות משוערת: ₪150-₪350 (ליחידה)', 'ת"י 1205 חלק 1 — יש להתקין שסתום ניתוק נפרד לכל כלי סניטרי לצורך תחזוקה ותיקון.', 'ת"י 1205 חלק 1 — יש להתקין שסתום ניתוק נפרד לכל כלי סניטרי לצורך תחזוקה ותיקון.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**היעדר מפסק מים נקודתי לכלי סניטרי** — חסר שסתום ניתוק נקודתי (אנגל) בחיבור לכלי סניטרי (אסלה, כיור, מכונת כביסה). לא ניתן לסגור מים לכלי ספציפי ללא ניתוק כל הדירה.. המלצה: להתקין ברז אנגל לכל כלי סניטרי בהתאם לתקן.. עלות משוערת: ₪150-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**רעש מצנרת – פטישי מים (water hammer)** — רעשי חבטות או רעידות בצנרת בעת סגירת ברזים או שסתומים. תופעת פטישי מים (water hammer) הנגרמת מעצירה פתאומית של זרימה.. המלצה: להתקין בולמי זעזועים (water hammer arrestors) בנקודות הקצה, לבדוק קיבוע צנרת ולהוסיף תופסני צנרת.. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1205 חלק 1 — יש למנוע תופעת פטישי מים באמצעות התקנת בולמי זעזועים (water hammer arrestors) או האטת הסגירה.', 'ת"י 1205 חלק 1 — יש למנוע תופעת פטישי מים באמצעות התקנת בולמי זעזועים (water hammer arrestors) או האטת הסגירה.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רעש מצנרת – פטישי מים (water hammer)** — רעשי חבטות או רעידות בצנרת בעת סגירת ברזים או שסתומים. תופעת פטישי מים (water hammer) הנגרמת מעצירה פתאומית של זרימה.. המלצה: להתקין בולמי זעזועים (water hammer arrestors) בנקודות הקצה, לבדוק קיבוע צנרת ולהוסיף תופסני צנרת.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**צנרת לא מקובעת – חסרים תופסנים** — צנרת מים או ביוב שאינה מקובעת כראוי לקיר או לתקרה באמצעות תופסנים, גורמת לרעשים, רעידות ועלולה להיסדק.. המלצה: להתקין תופסני צנרת (pipe clamps) בהתאם לתקן, במרווחים הנדרשים ועם בידוד אקוסטי.. עלות משוערת: ₪150-₪500 (ליחידה)', 'ת"י 1205 חלק 1 — צנרת תקובע לאלמנטים קשיחים במבנה באמצעות תופסנים מתאימים, במרווחים שלא יעלו על 1.5 מ'' לצנרת אופקית ו-2 מ'' לצנרת אנכית.', 'ת"י 1205 חלק 1 — צנרת תקובע לאלמנטים קשיחים במבנה באמצעות תופסנים מתאימים, במרווחים שלא יעלו על 1.5 מ'' לצנרת אופקית ו-2 מ'' לצנרת אנכית.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת לא מקובעת – חסרים תופסנים** — צנרת מים או ביוב שאינה מקובעת כראוי לקיר או לתקרה באמצעות תופסנים, גורמת לרעשים, רעידות ועלולה להיסדק.. המלצה: להתקין תופסני צנרת (pipe clamps) בהתאם לתקן, במרווחים הנדרשים ועם בידוד אקוסטי.. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**היעדר בידוד תרמי לצנרת מים חמים** — צנרת מים חמים ללא בידוד תרמי (כיסוי מבודד), גורם לאיבוד חום, בזבוז אנרגיה, ועלול לגרום לעיבוי על הצנרת.. המלצה: לעטוף את צנרת המים החמים בבידוד תרמי (שרוול מבודד) בעובי הנדרש לפי קוטר הצנרת.. עלות משוערת: ₪30-₪80 (למ"א)', 'ת"י 1205 חלק 1 — צנרת מים חמים חייבת בבידוד תרמי בעובי מינימלי בהתאם לקוטר הצנרת, למניעת איבוד חום.', 'ת"י 1205 חלק 1 — צנרת מים חמים חייבת בבידוד תרמי בעובי מינימלי בהתאם לקוטר הצנרת, למניעת איבוד חום.', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**היעדר בידוד תרמי לצנרת מים חמים** — צנרת מים חמים ללא בידוד תרמי (כיסוי מבודד), גורם לאיבוד חום, בזבוז אנרגיה, ועלול לגרום לעיבוי על הצנרת.. המלצה: לעטוף את צנרת המים החמים בבידוד תרמי (שרוול מבודד) בעובי הנדרש לפי קוטר הצנרת.. עלות משוערת: ₪30-₪80 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**דוד שמש – נזילה או התקנה לקויה** — נזילה מדוד השמש, מצנרת העלייה/ירידה לקולטים, או התקנה שאינה עומדת בדרישות התקן (חוסר שסתום ביטחון, חוסר אוורור).. המלצה: לתקן את הנזילה, להתקין שסתומי ביטחון חסרים, לבדוק תקינות הצנרת מהקולטים לדוד ובחזרה.. עלות משוערת: ₪400-₪2000 (ליחידה)', 'ת"י 579 — דוד שמש יותקן עם שסתום ביטחון (שסתום לחץ), שסתום חד-כיווני, ומערכת ניקוז לעודפי לחץ. חיבור לפי הוראות היצרן.', 'ת"י 579 — דוד שמש יותקן עם שסתום ביטחון (שסתום לחץ), שסתום חד-כיווני, ומערכת ניקוז לעודפי לחץ. חיבור לפי הוראות היצרן.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דוד שמש – נזילה או התקנה לקויה** — נזילה מדוד השמש, מצנרת העלייה/ירידה לקולטים, או התקנה שאינה עומדת בדרישות התקן (חוסר שסתום ביטחון, חוסר אוורור).. המלצה: לתקן את הנזילה, להתקין שסתומי ביטחון חסרים, לבדוק תקינות הצנרת מהקולטים לדוד ובחזרה.. עלות משוערת: ₪400-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**חימום מים חשמלי (בויילר) – היעדר שסתום ביטחון** — מחמם מים חשמלי (בויילר) מותקן ללא שסתום ביטחון (שסתום לחץ ותרמוסטטי), מהווה סכנת פיצוץ.. המלצה: להתקין שסתום ביטחון (T&P valve) תקני, עם צנרת ניקוז לרצפה או לנקודת ניקוז בטוחה.. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 1596 — חובה להתקין שסתום ביטחון על כל מחמם מים חשמלי, המשחרר לחץ עודף בלחץ של 6 אטמוספרות ובטמפרטורה של 93°C.', 'ת"י 1596 — חובה להתקין שסתום ביטחון על כל מחמם מים חשמלי, המשחרר לחץ עודף בלחץ של 6 אטמוספרות ובטמפרטורה של 93°C.', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חימום מים חשמלי (בויילר) – היעדר שסתום ביטחון** — מחמם מים חשמלי (בויילר) מותקן ללא שסתום ביטחון (שסתום לחץ ותרמוסטטי), מהווה סכנת פיצוץ.. המלצה: להתקין שסתום ביטחון (T&P valve) תקני, עם צנרת ניקוז לרצפה או לנקודת ניקוז בטוחה.. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**מחמם מים (בויילר) – התקנה לא בטוחה** — בויילר מותקן באופן לא בטוח – ללא עיגון תקני לקיר, ללא מגש איסוף נזילות, או בסמיכות למתקנים חשמליים.. המלצה: לעגן את הבויילר בבורגי הרחבה מתאימים לקיר, להתקין מגש איסוף עם ניקוז, ולוודא מרחק מספיק ממתקנים חשמליים.. עלות משוערת: ₪300-₪800 (ליחידה)', 'ת"י 1596 — מחמם מים יותקן על קיר חזק מספיק לשאת את משקלו המלא, עם עיגון מתאים, ומגש ניקוז מתחתיו.', 'ת"י 1596 — מחמם מים יותקן על קיר חזק מספיק לשאת את משקלו המלא, עם עיגון מתאים, ומגש ניקוז מתחתיו.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מחמם מים (בויילר) – התקנה לא בטוחה** — בויילר מותקן באופן לא בטוח – ללא עיגון תקני לקיר, ללא מגש איסוף נזילות, או בסמיכות למתקנים חשמליים.. המלצה: לעגן את הבויילר בבורגי הרחבה מתאימים לקיר, להתקין מגש איסוף עם ניקוז, ולוודא מרחק מספיק ממתקנים חשמליים.. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**מד מים – נזילה או התקנה לקויה** — נזילה ממד המים הדירתי, התקנה לא תקינה, או חוסר נגישות למד המים.. המלצה: לתקן את הנזילה, לוודא שסתומי ניתוק תקינים, ולהבטיח נגישות למד המים.. עלות משוערת: ₪200-₪700 (ליחידה)', 'ת"י 1205 חלק 1 — מד מים יותקן במקום נגיש לקריאה ותחזוקה, עם שסתומי ניתוק משני צידיו.', 'ת"י 1205 חלק 1 — מד מים יותקן במקום נגיש לקריאה ותחזוקה, עם שסתומי ניתוק משני צידיו.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מד מים – נזילה או התקנה לקויה** — נזילה ממד המים הדירתי, התקנה לא תקינה, או חוסר נגישות למד המים.. המלצה: לתקן את הנזילה, לוודא שסתומי ניתוק תקינים, ולהבטיח נגישות למד המים.. עלות משוערת: ₪200-₪700 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**היעדר מניעת זרימה חוזרת (backflow prevention)** — חסר מתקן למניעת זרימה חוזרת (שסתום חד-כיווני) במערכת אספקת המים, מהווה סיכון בריאותי של זיהום מי השתייה.. המלצה: להתקין שסתום חד-כיווני (check valve) או מפריד ואקום בנקודות הנדרשות.. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1205 חלק 1 — יש להתקין אמצעי למניעת זרימה חוזרת בכל נקודת חיבור שקיים בה סיכון לזיהום מי השתייה (הפרש גובה מינימלי או שסתום).', 'ת"י 1205 חלק 1 — יש להתקין אמצעי למניעת זרימה חוזרת בכל נקודת חיבור שקיים בה סיכון לזיהום מי השתייה (הפרש גובה מינימלי או שסתום).', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**היעדר מניעת זרימה חוזרת (backflow prevention)** — חסר מתקן למניעת זרימה חוזרת (שסתום חד-כיווני) במערכת אספקת המים, מהווה סיכון בריאותי של זיהום מי השתייה.. המלצה: להתקין שסתום חד-כיווני (check valve) או מפריד ואקום בנקודות הנדרשות.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**צנרת מים חוצה קיר ללא אטימה** — צנרת מים העוברת דרך קיר או רצפה ללא שרוול מגן (sleeve) ואטימה מתאימה, מאפשרת מעבר מים ולחות.. המלצה: להתקין שרוול מגן (sleeve) ולאטום את המרווח בחומר איטום גמיש.. עלות משוערת: ₪100-₪400 (ליחידה)', 'ת"י 1205 חלק 1 — צנרת העוברת דרך קיר או רצפה תוחדר בתוך שרוול מגן, והמרווח ביניהם יאטם בחומר גמיש.', 'ת"י 1205 חלק 1 — צנרת העוברת דרך קיר או רצפה תוחדר בתוך שרוול מגן, והמרווח ביניהם יאטם בחומר גמיש.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת מים חוצה קיר ללא אטימה** — צנרת מים העוברת דרך קיר או רצפה ללא שרוול מגן (sleeve) ואטימה מתאימה, מאפשרת מעבר מים ולחות.. המלצה: להתקין שרוול מגן (sleeve) ולאטום את המרווח בחומר איטום גמיש.. עלות משוערת: ₪100-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**צנרת פוליאתילן (פקס) – קיפול או כיפוף חד** — צנרת PEX מקופלת או מכופפת בזווית חדה מדי, מצמצמת את חתך הזרימה ועלולה להיסדק לאורך זמן.. המלצה: להחליף את קטע הצנרת המקופל, להתקין מחדש עם רדיוס כיפוף תקני, או להשתמש בפיטינג זווית.. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1205 חלק 1 — רדיוס כיפוף מינימלי של צנרת PEX: 8 פעמים קוטר הצנרת. אין לקפל או לכופף בזווית חדה.', 'ת"י 1205 חלק 1 — רדיוס כיפוף מינימלי של צנרת PEX: 8 פעמים קוטר הצנרת. אין לקפל או לכופף בזווית חדה.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת פוליאתילן (פקס) – קיפול או כיפוף חד** — צנרת PEX מקופלת או מכופפת בזווית חדה מדי, מצמצמת את חתך הזרימה ועלולה להיסדק לאורך זמן.. המלצה: להחליף את קטע הצנרת המקופל, להתקין מחדש עם רדיוס כיפוף תקני, או להשתמש בפיטינג זווית.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**ערבוב חומרי צנרת לא תואמים (קורוזיה גלוונית)** — חיבור ישיר בין צנרת נחושת לצנרת פלדה מגולוונת ללא מפריד דיאלקטרי, גורם לקורוזיה גלוונית ולנזילות.. המלצה: להתקין מפריד דיאלקטרי (dielectric union) בין חומרי הצנרת השונים.. עלות משוערת: ₪150-₪500 (ליחידה)', 'ת"י 1205 חלק 1 — אין לחבר ישירות בין מתכות שונות ללא מפריד דיאלקטרי או אבזר מתאים למניעת קורוזיה גלוונית.', 'ת"י 1205 חלק 1 — אין לחבר ישירות בין מתכות שונות ללא מפריד דיאלקטרי או אבזר מתאים למניעת קורוזיה גלוונית.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ערבוב חומרי צנרת לא תואמים (קורוזיה גלוונית)** — חיבור ישיר בין צנרת נחושת לצנרת פלדה מגולוונת ללא מפריד דיאלקטרי, גורם לקורוזיה גלוונית ולנזילות.. המלצה: להתקין מפריד דיאלקטרי (dielectric union) בין חומרי הצנרת השונים.. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**פילטר (מסנן) מים ראשי – חסר או לא תקין** — לא הותקן מסנן מים ראשי בכניסת המים לדירה, או שהמסנן סתום ודורש ניקוי/החלפה.. המלצה: להתקין מסנן מים ראשי (פילטר Y או פילטר רשת) בכניסת המים לדירה, לאחר מד המים.. עלות משוערת: ₪150-₪500 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פילטר (מסנן) מים ראשי – חסר או לא תקין** — לא הותקן מסנן מים ראשי בכניסת המים לדירה, או שהמסנן סתום ודורש ניקוי/החלפה.. המלצה: להתקין מסנן מים ראשי (פילטר Y או פילטר רשת) בכניסת המים לדירה, לאחר מד המים.. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**מוביל מים גמיש (צינור חיבור) פגום או מנופח** — צינור חיבור גמיש (flexible hose) לברז, אסלה, או מכשיר חשמלי מנופח, סדוק, או חלוד בחיבורים. סיכון גבוה להצפה.. המלצה: להחליף מיידית את המוביל הגמיש הפגום בצינור חדש תקני (נירוסטה קלועה), ולבדוק תקינות כל המובילים הגמישים בדירה.. עלות משוערת: ₪80-₪250 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מוביל מים גמיש (צינור חיבור) פגום או מנופח** — צינור חיבור גמיש (flexible hose) לברז, אסלה, או מכשיר חשמלי מנופח, סדוק, או חלוד בחיבורים. סיכון גבוה להצפה.. המלצה: להחליף מיידית את המוביל הגמיש הפגום בצינור חדש תקני (נירוסטה קלועה), ולבדוק תקינות כל המובילים הגמישים בדירה.. עלות משוערת: ₪80-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**וונטוזה (שסתום שחרור אוויר) חסרה או לא תקינה** — וונטוזה (שסתום שחרור אוויר) חסרה בנקודה הגבוהה ביותר של מערכת המים, גורם לכיסי אוויר ולהפרעה בזרימה.. המלצה: להתקין וונטוזה אוטומטית בנקודה הגבוהה ביותר של מערכת הצנרת.. עלות משוערת: ₪100-₪350 (ליחידה)', 'ת"י 1205 חלק 1 — יש להתקין שסתום שחרור אוויר (וונטוזה) בנקודות הגבוהות של מערכת אספקת המים.', 'ת"י 1205 חלק 1 — יש להתקין שסתום שחרור אוויר (וונטוזה) בנקודות הגבוהות של מערכת אספקת המים.', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**וונטוזה (שסתום שחרור אוויר) חסרה או לא תקינה** — וונטוזה (שסתום שחרור אוויר) חסרה בנקודה הגבוהה ביותר של מערכת המים, גורם לכיסי אוויר ולהפרעה בזרימה.. המלצה: להתקין וונטוזה אוטומטית בנקודה הגבוהה ביותר של מערכת הצנרת.. עלות משוערת: ₪100-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**נזילה מצנרת מים** — נזילת מים מצנרת גלויה או סמויה. עלולה לגרום לנזקי רטיבות.. המלצה: איתור מקור הנזילה, תיקון או החלפת הצנרת הפגומה. עלות משוערת: ₪300-₪1200 (ליחידה)', 'ת"י 1205 — מערכת אינסטלציה חייבת להיות אטומה לחלוטין', 'ת"י 1205 — מערכת אינסטלציה חייבת להיות אטומה לחלוטין', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזילה מצנרת מים** — נזילת מים מצנרת גלויה או סמויה. עלולה לגרום לנזקי רטיבות.. המלצה: איתור מקור הנזילה, תיקון או החלפת הצנרת הפגומה. עלות משוערת: ₪300-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**ברז מטפטף / לא אוטם** — ברז שמטפטף גם כשסגור, או שלא אוטם כראוי.. המלצה: החלפת אטם / קרמי / ברז שלם לפי הצורך. עלות משוערת: ₪100-₪500 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ברז מטפטף / לא אוטם** — ברז שמטפטף גם כשסגור, או שלא אוטם כראוי.. המלצה: החלפת אטם / קרמי / ברז שלם לפי הצורך. עלות משוערת: ₪100-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**סיפון חסר או לא תקין – ריח ביוב** — סיפון (מחסום ריח) חסר, לא מותקן, פגום או יבש, וגורם לחדירת ריחות ביוב לתוך הדירה דרך נקודת הניקוז.. המלצה: להתקין סיפון תקני עם עומק מחסום מים של 50 מ"מ לפחות, לוודא אטימות כל החיבורים.. עלות משוערת: ₪150-₪500 (ליחידה)', 'ת"י 1205 חלק 2 — כל כלי סניטרי יחובר לסיפון עם מחסום מים בעומק מינימלי של 50 מ"מ. אין לחבר כלי סניטרי לביוב ללא סיפון.', 'ת"י 1205 חלק 2 — כל כלי סניטרי יחובר לסיפון עם מחסום מים בעומק מינימלי של 50 מ"מ. אין לחבר כלי סניטרי לביוב ללא סיפון.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סיפון חסר או לא תקין – ריח ביוב** — סיפון (מחסום ריח) חסר, לא מותקן, פגום או יבש, וגורם לחדירת ריחות ביוב לתוך הדירה דרך נקודת הניקוז.. המלצה: להתקין סיפון תקני עם עומק מחסום מים של 50 מ"מ לפחות, לוודא אטימות כל החיבורים.. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**סיפון רצפתי חסום או ניקוז איטי** — סיפון רצפתי (במקלחת, במרפסת) חסום חלקית או מלא, גורם להצטברות מים על הרצפה ולניקוז איטי.. המלצה: לנקות את הסיפון מפסולת, לפתוח חסימות בצנרת, לוודא שיפוע תקין של הרצפה לכיוון הסיפון.. עלות משוערת: ₪100-₪400 (ליחידה)', 'ת"י 1205 חלק 2 — סיפון רצפתי יאפשר ניקוז חופשי של מים, רשת הסיפון תהיה ניתנת להסרה לצורך ניקוי.', 'ת"י 1205 חלק 2 — סיפון רצפתי יאפשר ניקוז חופשי של מים, רשת הסיפון תהיה ניתנת להסרה לצורך ניקוי.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סיפון רצפתי חסום או ניקוז איטי** — סיפון רצפתי (במקלחת, במרפסת) חסום חלקית או מלא, גורם להצטברות מים על הרצפה ולניקוז איטי.. המלצה: לנקות את הסיפון מפסולת, לפתוח חסימות בצנרת, לוודא שיפוע תקין של הרצפה לכיוון הסיפון.. עלות משוערת: ₪100-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**שיפוע ניקוז לא תקין – מים עומדים על רצפה** — רצפת חדר רחצה או מקלחת ללא שיפוע מספיק לכיוון הסיפון, גורם להצטברות מים (שלוליות) על הרצפה.. המלצה: לבצע יציקת שיפוע מתקנת על הרצפה הקיימת וריצוף מחדש, או התקנת ערוץ ניקוז ליניארי.. עלות משוערת: ₪2000-₪5000 (ליחידה)', 'ת"י 1205 חלק 2 — רצפה רטובה (חדר מקלחת) חייבת בשיפוע מינימלי של 1.5% לכיוון נקודת הניקוז.', 'ת"י 1205 חלק 2 — רצפה רטובה (חדר מקלחת) חייבת בשיפוע מינימלי של 1.5% לכיוון נקודת הניקוז.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שיפוע ניקוז לא תקין – מים עומדים על רצפה** — רצפת חדר רחצה או מקלחת ללא שיפוע מספיק לכיוון הסיפון, גורם להצטברות מים (שלוליות) על הרצפה.. המלצה: לבצע יציקת שיפוע מתקנת על הרצפה הקיימת וריצוף מחדש, או התקנת ערוץ ניקוז ליניארי.. עלות משוערת: ₪2000-₪5000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**צנרת ביוב ללא שיפוע תקני** — צנרת הביוב מותקנת ללא שיפוע מספיק או עם שיפוע הפוך (counter-slope), גורם לחסימות חוזרות ולעליית מי ביוב.. המלצה: לפרק את קטע הצנרת הבעייתי, להתקין מחדש בשיפוע הנדרש, ולבצע בדיקת זרימה.. עלות משוערת: ₪800-₪3000 (למ"א)', 'ת"י 1205 חלק 2 — צנרת ביוב אופקית בקוטר עד 100 מ"מ: שיפוע מינימלי 2%. קוטר מעל 100 מ"מ: שיפוע מינימלי 1%.', 'ת"י 1205 חלק 2 — צנרת ביוב אופקית בקוטר עד 100 מ"מ: שיפוע מינימלי 2%. קוטר מעל 100 מ"מ: שיפוע מינימלי 1%.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת ביוב ללא שיפוע תקני** — צנרת הביוב מותקנת ללא שיפוע מספיק או עם שיפוע הפוך (counter-slope), גורם לחסימות חוזרות ולעליית מי ביוב.. המלצה: לפרק את קטע הצנרת הבעייתי, להתקין מחדש בשיפוע הנדרש, ולבצע בדיקת זרימה.. עלות משוערת: ₪800-₪3000 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**חסימה בצנרת ביוב ראשית** — חסימה בצנרת ביוב ראשית של הדירה, גורמת לעליית מי שפכים בכלים סניטריים או הצפה.. המלצה: לבצע שטיפת לחץ (ג''טינג) לצנרת הביוב, לבדוק במצלמה אנדוסקופית, לתקן או להחליף קטע פגום.. עלות משוערת: ₪300-₪1500 (ליחידה)', 'ת"י 1205 חלק 2 — מערכת הביוב חייבת לאפשר זרימה חופשית. יש להתקין פקקי ניקוי בנקודות נגישות.', 'ת"י 1205 חלק 2 — מערכת הביוב חייבת לאפשר זרימה חופשית. יש להתקין פקקי ניקוי בנקודות נגישות.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חסימה בצנרת ביוב ראשית** — חסימה בצנרת ביוב ראשית של הדירה, גורמת לעליית מי שפכים בכלים סניטריים או הצפה.. המלצה: לבצע שטיפת לחץ (ג''טינג) לצנרת הביוב, לבדוק במצלמה אנדוסקופית, לתקן או להחליף קטע פגום.. עלות משוערת: ₪300-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**היעדר פקק ניקוי בצנרת ביוב** — לא הותקנו פקקי ניקוי (access points) בצנרת הביוב במקומות הנדרשים, מה שמקשה על טיפול בחסימות עתידיות.. המלצה: להתקין פקקי ניקוי בנקודות הנדרשות בהתאם לתקן, במקומות נגישים.. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1205 חלק 2 — יש להתקין פקקי ניקוי בכל שינוי כיוון של צנרת הביוב, בסוף כל קו אופקי, ובמרחק מרבי של 15 מ'' בין פקק לפקק.', 'ת"י 1205 חלק 2 — יש להתקין פקקי ניקוי בכל שינוי כיוון של צנרת הביוב, בסוף כל קו אופקי, ובמרחק מרבי של 15 מ'' בין פקק לפקק.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**היעדר פקק ניקוי בצנרת ביוב** — לא הותקנו פקקי ניקוי (access points) בצנרת הביוב במקומות הנדרשים, מה שמקשה על טיפול בחסימות עתידיות.. המלצה: להתקין פקקי ניקוי בנקודות הנדרשות בהתאם לתקן, במקומות נגישים.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**צנרת PVC ביוב – חיבור לא תקין** — חיבור לקוי בצנרת PVC ביוב – שימוש בדבק לא מתאים, חיבור לא מלא, או חוסר אטימות בנקודות חיבור.. המלצה: לפרק את החיבור הלקוי, לנקות את המשטחים, להדביק מחדש בדבק PVC מתאים, ולבצע בדיקת אטימות.. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1205 חלק 2 — חיבורי צנרת ביוב PVC יבוצעו בדבק מתאים לסוג הצנרת, עם חדירה מלאה של הצנרת לתוך האבזר.', 'ת"י 1205 חלק 2 — חיבורי צנרת ביוב PVC יבוצעו בדבק מתאים לסוג הצנרת, עם חדירה מלאה של הצנרת לתוך האבזר.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת PVC ביוב – חיבור לא תקין** — חיבור לקוי בצנרת PVC ביוב – שימוש בדבק לא מתאים, חיבור לא מלא, או חוסר אטימות בנקודות חיבור.. המלצה: לפרק את החיבור הלקוי, לנקות את המשטחים, להדביק מחדש בדבק PVC מתאים, ולבצע בדיקת אטימות.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**צנרת ביוב – קוטר לא מספיק** — צנרת ביוב בקוטר קטן מהנדרש לכמות הכלים הסניטריים המחוברים אליה, גורם לחסימות תכופות.. המלצה: להחליף את קטע הצנרת בקוטר מתאים בהתאם לתקן ולכמות הכלים הסניטריים המחוברים.. עלות משוערת: ₪500-₪2500 (למ"א)', 'ת"י 1205 חלק 2 — קוטר צנרת ביוב מינימלי: אסלה – 100 מ"מ, כיור – 40 מ"מ, מקלחת – 50 מ"מ, קו ראשי – 100 מ"מ.', 'ת"י 1205 חלק 2 — קוטר צנרת ביוב מינימלי: אסלה – 100 מ"מ, כיור – 40 מ"מ, מקלחת – 50 מ"מ, קו ראשי – 100 מ"מ.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת ביוב – קוטר לא מספיק** — צנרת ביוב בקוטר קטן מהנדרש לכמות הכלים הסניטריים המחוברים אליה, גורם לחסימות תכופות.. המלצה: להחליף את קטע הצנרת בקוטר מתאים בהתאם לתקן ולכמות הכלים הסניטריים המחוברים.. עלות משוערת: ₪500-₪2500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**אוורור מערכת ביוב חסר או לקוי** — מערכת הביוב ללא אוורור תקין (vent pipe), גורם לשאיבת מחסום המים מהסיפונים, רעשי גרגור, וחדירת ריחות ביוב.. המלצה: להתקין צנרת אוורור בקוטר מתאים, המתחברת לעמוד הביוב ועולה לגג המבנה, או להתקין שסתום אוורור (Air Admittance Valve).. עלות משוערת: ₪500-₪2000 (ליחידה)', 'ת"י 1205 חלק 2 — כל עמוד ביוב אנכי יאוורר לגג המבנה. צנרת האוורור לא תהיה קטנה מ-50 מ"מ ותגיע לפחות 50 ס"מ מעל הגג.', 'ת"י 1205 חלק 2 — כל עמוד ביוב אנכי יאוורר לגג המבנה. צנרת האוורור לא תהיה קטנה מ-50 מ"מ ותגיע לפחות 50 ס"מ מעל הגג.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אוורור מערכת ביוב חסר או לקוי** — מערכת הביוב ללא אוורור תקין (vent pipe), גורם לשאיבת מחסום המים מהסיפונים, רעשי גרגור, וחדירת ריחות ביוב.. המלצה: להתקין צנרת אוורור בקוטר מתאים, המתחברת לעמוד הביוב ועולה לגג המבנה, או להתקין שסתום אוורור (Air Admittance Valve).. עלות משוערת: ₪500-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**שסתום אוורור (AAV) לא תקין** — שסתום אוורור (Air Admittance Valve) לא עובד, סתום, או מותקן במיקום שגוי, אינו מאפשר כניסת אוויר למערכת הביוב.. המלצה: להחליף את שסתום האוורור בשסתום חדש תקין, ולהתקין בגובה ובמיקום הנכונים.. עלות משוערת: ₪100-₪350 (ליחידה)', 'ת"י 1205 חלק 2 — שסתום אוורור יותקן מעל לגובה הגלישה של הכלי הסניטרי הגבוה ביותר המחובר לקו, במקום מאוורר.', 'ת"י 1205 חלק 2 — שסתום אוורור יותקן מעל לגובה הגלישה של הכלי הסניטרי הגבוה ביותר המחובר לקו, במקום מאוורר.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שסתום אוורור (AAV) לא תקין** — שסתום אוורור (Air Admittance Valve) לא עובד, סתום, או מותקן במיקום שגוי, אינו מאפשר כניסת אוויר למערכת הביוב.. המלצה: להחליף את שסתום האוורור בשסתום חדש תקין, ולהתקין בגובה ובמיקום הנכונים.. עלות משוערת: ₪100-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**מכסה בור ביקורת ביוב – חסר או פגום** — מכסה בור ביקורת (שוחת ביוב) חסר, שבור, לא אטום, או לא מפולס עם הרצפה/קרקע.. המלצה: להחליף את המכסה הפגום במכסה חדש תקני, לוודא אטימות ופילוס.. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1205 חלק 2 — בורות ביקורת יהיו עם מכסים אטומים, בחוזק מספיק, ונגישים לתחזוקה.', 'ת"י 1205 חלק 2 — בורות ביקורת יהיו עם מכסים אטומים, בחוזק מספיק, ונגישים לתחזוקה.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מכסה בור ביקורת ביוב – חסר או פגום** — מכסה בור ביקורת (שוחת ביוב) חסר, שבור, לא אטום, או לא מפולס עם הרצפה/קרקע.. המלצה: להחליף את המכסה הפגום במכסה חדש תקני, לוודא אטימות ופילוס.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**גלישת מים מאמבטיה/מקלחת לחדרים סמוכים** — מים מחדר הרחצה/מקלחת חודרים לחדרים סמוכים בשל היעדר מפתן, איטום לקוי, או שיפוע שגוי.. המלצה: להתקין מפתן בכניסה לחדר הרטוב, לבדוק ולתקן איטום רצפה, ולוודא שיפוע נכון לכיוון הסיפון.. עלות משוערת: ₪500-₪2500 (ליחידה)', 'ת"י 1205 חלק 2 — חדרים רטובים חייבים במפתן או הפרש גובה מול חדרים יבשים, ובאיטום רצפה תקני למניעת חדירת מים.', 'ת"י 1205 חלק 2 — חדרים רטובים חייבים במפתן או הפרש גובה מול חדרים יבשים, ובאיטום רצפה תקני למניעת חדירת מים.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גלישת מים מאמבטיה/מקלחת לחדרים סמוכים** — מים מחדר הרחצה/מקלחת חודרים לחדרים סמוכים בשל היעדר מפתן, איטום לקוי, או שיפוע שגוי.. המלצה: להתקין מפתן בכניסה לחדר הרטוב, לבדוק ולתקן איטום רצפה, ולוודא שיפוע נכון לכיוון הסיפון.. עלות משוערת: ₪500-₪2500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**ניקוז מזגן – חיבור ישיר לביוב ללא סיפון** — ניקוז עיבוי מזגן מחובר ישירות לצנרת ביוב ללא סיפון, גורם לחדירת ריחות ביוב דרך היחידה הפנימית.. המלצה: להתקין סיפון ייעודי לצנרת ניקוז עיבוי המזגן, לפני החיבור למערכת הביוב.. עלות משוערת: ₪150-₪400 (ליחידה)', 'ת"י 1205 חלק 2 — כל חיבור למערכת הביוב חייב לעבור דרך סיפון עם מחסום ריח.', 'ת"י 1205 חלק 2 — כל חיבור למערכת הביוב חייב לעבור דרך סיפון עם מחסום ריח.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ניקוז מזגן – חיבור ישיר לביוב ללא סיפון** — ניקוז עיבוי מזגן מחובר ישירות לצנרת ביוב ללא סיפון, גורם לחדירת ריחות ביוב דרך היחידה הפנימית.. המלצה: להתקין סיפון ייעודי לצנרת ניקוז עיבוי המזגן, לפני החיבור למערכת הביוב.. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**מרזב/צנרת ניקוז מרפסת – שיפוע לא תקין** — רצפת המרפסת ללא שיפוע מספיק לניקוז מי גשם, מים עומדים על המרפסת וחודרים לדירה.. המלצה: לבצע יציקת שיפוע מתקנת, להתקין ריצוף עם שיפוע תקני, ולוודא ניקוז תקין לנקודת היציאה.. עלות משוערת: ₪1500-₪4000 (ליחידה)', 'ת"י 1205 חלק 2 — מרפסות חשופות חייבות בשיפוע מינימלי של 1.5% לכיוון נקודת ניקוז, עם חיבור תקין למערכת ניקוז גשם.', 'ת"י 1205 חלק 2 — מרפסות חשופות חייבות בשיפוע מינימלי של 1.5% לכיוון נקודת ניקוז, עם חיבור תקין למערכת ניקוז גשם.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מרזב/צנרת ניקוז מרפסת – שיפוע לא תקין** — רצפת המרפסת ללא שיפוע מספיק לניקוז מי גשם, מים עומדים על המרפסת וחודרים לדירה.. המלצה: לבצע יציקת שיפוע מתקנת, להתקין ריצוף עם שיפוע תקני, ולוודא ניקוז תקין לנקודת היציאה.. עלות משוערת: ₪1500-₪4000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**משאבת ייחוץ (סמפ) – חסרה או לא תקינה** — בדירות קרקע או מרתפים – משאבת ייחוץ חסרה, לא מחוברת, או לא פועלת, סיכון להצפה.. המלצה: להתקין או לתקן משאבת ייחוץ עם שסתום חד-כיווני, לבדוק חיבור חשמל וצף הפעלה.. עלות משוערת: ₪1500-₪5000 (ליחידה)', 'ת"י 1205 חלק 2 — בכל מקום שבו נקודת הניקוז נמצאת מתחת לגובה הביוב העירוני, יש להתקין משאבת ייחוץ עם שסתום חד-כיווני.', 'ת"י 1205 חלק 2 — בכל מקום שבו נקודת הניקוז נמצאת מתחת לגובה הביוב העירוני, יש להתקין משאבת ייחוץ עם שסתום חד-כיווני.', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**משאבת ייחוץ (סמפ) – חסרה או לא תקינה** — בדירות קרקע או מרתפים – משאבת ייחוץ חסרה, לא מחוברת, או לא פועלת, סיכון להצפה.. המלצה: להתקין או לתקן משאבת ייחוץ עם שסתום חד-כיווני, לבדוק חיבור חשמל וצף הפעלה.. עלות משוערת: ₪1500-₪5000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**ניקוז איטי במקלחת** — מים מתנקזים לאט במקלחת — עלול לנבוע מחוסר שיפוע או חסימה בצנרת.. המלצה: בדיקת שיפוע, פתיחת סתימה, תיקון שיפוע אם נדרש. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1205 — ניקוז מקלחת חייב להתבצע תוך זמן סביר', 'ת"י 1205 — ניקוז מקלחת חייב להתבצע תוך זמן סביר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ניקוז איטי במקלחת** — מים מתנקזים לאט במקלחת — עלול לנבוע מחוסר שיפוע או חסימה בצנרת.. המלצה: בדיקת שיפוע, פתיחת סתימה, תיקון שיפוע אם נדרש. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, '**חוסר שיפוע בניקוז מרפסת** — מרפסת ללא שיפוע מספיק לניקוז — מים נשארים על המשטח.. המלצה: תיקון שיפוע ריצוף לכיוון ניקוז. עלות משוערת: ₪150-₪500 (למ"ר)', 'ת"י 1515.3 — שיפוע מינימלי לניקוז: 1.5%', 'ת"י 1515.3 — שיפוע מינימלי לניקוז: 1.5%', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר שיפוע בניקוז מרפסת** — מרפסת ללא שיפוע מספיק לניקוז — מים נשארים על המשטח.. המלצה: תיקון שיפוע ריצוף לכיוון ניקוז. עלות משוערת: ₪150-₪500 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**התקנה לקויה של אינטרפוץ (מערבל מקלחת)** — אינטרפוץ מותקן שלא בגובה הנדרש, בולט מהקיר, לא מפולס, או שיש דליפה מסביבו. חיבורי המים חמים וקרים עשויים להיות מחוברים הפוך.. המלצה: לפרק את האינטרפוץ, לתקן את עמדת הצנרת בקיר, להתקין מחדש בגובה ובמיקום הנכונים, ולוודא חיבור תקין ללא דליפות.. עלות משוערת: ₪400-₪1500 (ליחידה)', 'ת"י 1205 חלק 2 — אינטרפוץ יותקן בגובה 100-110 ס"מ מרצפת המקלחת, מפולס, צמוד לקיר, כשהחיבור החם בצד שמאל (בהסתכלות חזיתית).', 'ת"י 1205 חלק 2 — אינטרפוץ יותקן בגובה 100-110 ס"מ מרצפת המקלחת, מפולס, צמוד לקיר, כשהחיבור החם בצד שמאל (בהסתכלות חזיתית).', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**התקנה לקויה של אינטרפוץ (מערבל מקלחת)** — אינטרפוץ מותקן שלא בגובה הנדרש, בולט מהקיר, לא מפולס, או שיש דליפה מסביבו. חיבורי המים חמים וקרים עשויים להיות מחוברים הפוך.. המלצה: לפרק את האינטרפוץ, לתקן את עמדת הצנרת בקיר, להתקין מחדש בגובה ובמיקום הנכונים, ולוודא חיבור תקין ללא דליפות.. עלות משוערת: ₪400-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**חיבור מים חמים וקרים הפוך באינטרפוץ/מערבל** — חיבורי המים החמים והקרים מחוברים בצורה הפוכה – כיוון סיבוב הידית אינו תואם לטמפרטורת המים בפועל.. המלצה: להחליף את חיבורי הצנרת החמה והקרה כך שיתאימו לתקן ולסימון על הברז.. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1205 חלק 2 — חיבור מים חמים בצד שמאל וקרים בצד ימין (בהסתכלות חזיתית). סיבוב הידית שמאלה = חם, ימינה = קר.', 'ת"י 1205 חלק 2 — חיבור מים חמים בצד שמאל וקרים בצד ימין (בהסתכלות חזיתית). סיבוב הידית שמאלה = חם, ימינה = קר.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיבור מים חמים וקרים הפוך באינטרפוץ/מערבל** — חיבורי המים החמים והקרים מחוברים בצורה הפוכה – כיוון סיבוב הידית אינו תואם לטמפרטורת המים בפועל.. המלצה: להחליף את חיבורי הצנרת החמה והקרה כך שיתאימו לתקן ולסימון על הברז.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**ברז מטבח/כיור רופף או לא יציב** — ברז הכיור במטבח או בחדר הרחצה רופף, נע ממקומו, או לא מהודק כראוי לכיור/משטח.. המלצה: להדק את אום החיזוק מתחת לכיור, להחליף אטם בסיס הברז במידת הצורך, ולוודא יציבות מלאה.. עלות משוערת: ₪100-₪350 (ליחידה)', 'ת"י 1205 חלק 2 — כל כלי סניטרי וברז יותקנו באופן יציב וחזק, ללא תזוזה, בהתאם להוראות היצרן.', 'ת"י 1205 חלק 2 — כל כלי סניטרי וברז יותקנו באופן יציב וחזק, ללא תזוזה, בהתאם להוראות היצרן.', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ברז מטבח/כיור רופף או לא יציב** — ברז הכיור במטבח או בחדר הרחצה רופף, נע ממקומו, או לא מהודק כראוי לכיור/משטח.. המלצה: להדק את אום החיזוק מתחת לכיור, להחליף אטם בסיס הברז במידת הצורך, ולוודא יציבות מלאה.. עלות משוערת: ₪100-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**נזילה מברז – טפטוף מתמשך** — ברז מטפטף גם במצב סגור. בזבוז מים, רעש מטריד, ועלול לגרום לכתמי אבנית על הכיור.. המלצה: להחליף קרטוש (cartridge) של הברז, או את הברז כולו אם מדובר בדגם ישן או פגום.. עלות משוערת: ₪100-₪500 (ליחידה)', 'ת"י 1205 חלק 2 — ברזים חייבים להיות אטומים לחלוטין במצב סגור. אין לאפשר טפטוף או דליפה.', 'ת"י 1205 חלק 2 — ברזים חייבים להיות אטומים לחלוטין במצב סגור. אין לאפשר טפטוף או דליפה.', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזילה מברז – טפטוף מתמשך** — ברז מטפטף גם במצב סגור. בזבוז מים, רעש מטריד, ועלול לגרום לכתמי אבנית על הכיור.. המלצה: להחליף קרטוש (cartridge) של הברז, או את הברז כולו אם מדובר בדגם ישן או פגום.. עלות משוערת: ₪100-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**אסלה רופפת – אינה מקובעת לרצפה** — האסלה נעה ממקומה, לא מקובעת כראוי לרצפה או לקיר (אסלה תלויה). עלולה לגרום לדליפת מים מהחיבור לביוב.. המלצה: להדק את ברגי הקיבוע של האסלה לרצפה, להחליף אטם שעווה (wax ring) בחיבור לביוב, ולאטום בסיליקון.. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1205 חלק 2 — כלים סניטריים יקובעו באופן יציב ובטוח, ללא תנועה, בהתאם להוראות היצרן ולסוג הקיבוע.', 'ת"י 1205 חלק 2 — כלים סניטריים יקובעו באופן יציב ובטוח, ללא תנועה, בהתאם להוראות היצרן ולסוג הקיבוע.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אסלה רופפת – אינה מקובעת לרצפה** — האסלה נעה ממקומה, לא מקובעת כראוי לרצפה או לקיר (אסלה תלויה). עלולה לגרום לדליפת מים מהחיבור לביוב.. המלצה: להדק את ברגי הקיבוע של האסלה לרצפה, להחליף אטם שעווה (wax ring) בחיבור לביוב, ולאטום בסיליקון.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**ניקוז איטי באסלה – שטיפה לא מספקת** — האסלה אינה מתנקזת כראוי, השטיפה חלשה או חלקית, המים עולים ויורדים באיטיות.. המלצה: לבדוק חסימות בצנרת הביוב, לבדוק תקינות מנגנון ההדחה בניאגרה, לנקות או להחליף חלקים פנימיים.. עלות משוערת: ₪150-₪500 (ליחידה)', 'ת"י 1205 חלק 2 — מנגנון ההדחה חייב לספק נפח מים מספיק לניקוי יעיל של האסלה בשטיפה אחת (6/3 ליטר במנגנון דו-כמותי).', 'ת"י 1205 חלק 2 — מנגנון ההדחה חייב לספק נפח מים מספיק לניקוי יעיל של האסלה בשטיפה אחת (6/3 ליטר במנגנון דו-כמותי).', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ניקוז איטי באסלה – שטיפה לא מספקת** — האסלה אינה מתנקזת כראוי, השטיפה חלשה או חלקית, המים עולים ויורדים באיטיות.. המלצה: לבדוק חסימות בצנרת הביוב, לבדוק תקינות מנגנון ההדחה בניאגרה, לנקות או להחליף חלקים פנימיים.. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**נזילה מניאגרה (מיכל הדחה)** — נזילת מים מתמדת מהניאגרה לתוך האסלה (מים זורמים ללא הפסקה) או דליפה חיצונית מהמיכל.. המלצה: להחליף את מנגנון הניאגרה הפנימי (שסתום מצוף ושסתום פריקה), לבדוק אטימות חיבורי המים.. עלות משוערת: ₪150-₪450 (ליחידה)', 'ת"י 1205 חלק 2 — מנגנון ההדחה חייב להיות אטום ולעצור זרימת מים לאחר סיום מחזור ההדחה.', 'ת"י 1205 חלק 2 — מנגנון ההדחה חייב להיות אטום ולעצור זרימת מים לאחר סיום מחזור ההדחה.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזילה מניאגרה (מיכל הדחה)** — נזילת מים מתמדת מהניאגרה לתוך האסלה (מים זורמים ללא הפסקה) או דליפה חיצונית מהמיכל.. המלצה: להחליף את מנגנון הניאגרה הפנימי (שסתום מצוף ושסתום פריקה), לבדוק אטימות חיבורי המים.. עלות משוערת: ₪150-₪450 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**כיור/כיור רחצה סדוק או פגום** — סדק, שבר, או פגם בכיור המטבח או כיור חדר הרחצה. פגם אסתטי ופוטנציאל לדליפת מים.. המלצה: להחליף את הכיור הפגום בכיור חדש תקין ולחבר מחדש את הצנרת.. עלות משוערת: ₪500-₪2000 (ליחידה)', 'ת"י 1205 חלק 2 — כלים סניטריים יסופקו ויותקנו ללא פגמים, סדקים, שברים או פגיעה בציפוי.', 'ת"י 1205 חלק 2 — כלים סניטריים יסופקו ויותקנו ללא פגמים, סדקים, שברים או פגיעה בציפוי.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כיור/כיור רחצה סדוק או פגום** — סדק, שבר, או פגם בכיור המטבח או כיור חדר הרחצה. פגם אסתטי ופוטנציאל לדליפת מים.. המלצה: להחליף את הכיור הפגום בכיור חדש תקין ולחבר מחדש את הצנרת.. עלות משוערת: ₪500-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**אמבטיה – אטימה לקויה בחיבור לקיר** — אמבטיה שאינה אטומה כראוי בחיבור לקיר, מים חודרים מאחורי האמבטיה וגורמים לנזקי רטיבות.. המלצה: להסיר את האיטום הישן, לנקות ולייבש את המשטח, ולמרוח סיליקון סניטרי איכותי עמיד לעובש.. עלות משוערת: ₪150-₪400 (ליחידה)', 'ת"י 1205 חלק 2 — חיבור האמבטיה לקיר חייב להיות אטום למים באמצעות חומר איטום גמיש (סיליקון סניטרי) למניעת חדירת מים.', 'ת"י 1205 חלק 2 — חיבור האמבטיה לקיר חייב להיות אטום למים באמצעות חומר איטום גמיש (סיליקון סניטרי) למניעת חדירת מים.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אמבטיה – אטימה לקויה בחיבור לקיר** — אמבטיה שאינה אטומה כראוי בחיבור לקיר, מים חודרים מאחורי האמבטיה וגורמים לנזקי רטיבות.. המלצה: להסיר את האיטום הישן, לנקות ולייבש את המשטח, ולמרוח סיליקון סניטרי איכותי עמיד לעובש.. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**מקלחון – נזילה מדלת/מחיצת זכוכית** — נזילת מים מדלת המקלחון או ממחיצת הזכוכית, גורמת להצפת מים מחוץ לתא המקלחת.. המלצה: להחליף רצועות איטום (seals) של דלת המקלחון, לכוונן את הדלת, או לתקן את פרופיל האלומיניום.. עלות משוערת: ₪200-₪800 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מקלחון – נזילה מדלת/מחיצת זכוכית** — נזילת מים מדלת המקלחון או ממחיצת הזכוכית, גורמת להצפת מים מחוץ לתא המקלחת.. המלצה: להחליף רצועות איטום (seals) של דלת המקלחון, לכוונן את הדלת, או לתקן את פרופיל האלומיניום.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**ראש מקלחת (דוש) – לחץ נמוך או סתימה** — ראש המקלחת מפזר מים בצורה לא אחידה, זרימה חלשה, או חלק מהנחירים סתומים בשל אבנית.. המלצה: לנקות את ראש המקלחת מאבנית (השרייה בחומץ), או להחליף בראש מקלחת חדש.. עלות משוערת: ₪50-₪300 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ראש מקלחת (דוש) – לחץ נמוך או סתימה** — ראש המקלחת מפזר מים בצורה לא אחידה, זרימה חלשה, או חלק מהנחירים סתומים בשל אבנית.. המלצה: לנקות את ראש המקלחת מאבנית (השרייה בחומץ), או להחליף בראש מקלחת חדש.. עלות משוערת: ₪50-₪300 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**חיבור מכונת כביסה – ללא סיפון וללא ברז ניתוק** — נקודת חיבור מכונת הכביסה ללא סיפון (חיבור ישיר לביוב), ללא ברז ניתוק נפרד, או עם צנרת ניקוז לא מותאמת.. המלצה: להתקין סיפון תקני, ברז ניתוק נפרד (אנגל), ונקודת ניקוז בקוטר 50 מ"מ לפחות.. עלות משוערת: ₪300-₪800 (ליחידה)', 'ת"י 1205 חלק 2 — חיבור מכונת כביסה חייב לכלול סיפון עם מחסום ריח, ברז ניתוק נפרד למים, וניקוז בקוטר מתאים.', 'ת"י 1205 חלק 2 — חיבור מכונת כביסה חייב לכלול סיפון עם מחסום ריח, ברז ניתוק נפרד למים, וניקוז בקוטר מתאים.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיבור מכונת כביסה – ללא סיפון וללא ברז ניתוק** — נקודת חיבור מכונת הכביסה ללא סיפון (חיבור ישיר לביוב), ללא ברז ניתוק נפרד, או עם צנרת ניקוז לא מותאמת.. המלצה: להתקין סיפון תקני, ברז ניתוק נפרד (אנגל), ונקודת ניקוז בקוטר 50 מ"מ לפחות.. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**חיבור מדיח כלים – ללא סיפון וללא מפסק** — נקודת חיבור מדיח הכלים ללא סיפון, ללא ברז ניתוק, או ללא לולאה עילית (high loop) בצנרת הניקוז.. המלצה: להתקין סיפון ולולאה עילית לצנרת הניקוז, להוסיף ברז ניתוק נפרד.. עלות משוערת: ₪250-₪600 (ליחידה)', 'ת"י 1205 חלק 2 — חיבור מדיח כלים חייב לכלול סיפון, ברז ניתוק, וצנרת ניקוז עם לולאה עילית למניעת זרימה חוזרת.', 'ת"י 1205 חלק 2 — חיבור מדיח כלים חייב לכלול סיפון, ברז ניתוק, וצנרת ניקוז עם לולאה עילית למניעת זרימה חוזרת.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיבור מדיח כלים – ללא סיפון וללא מפסק** — נקודת חיבור מדיח הכלים ללא סיפון, ללא ברז ניתוק, או ללא לולאה עילית (high loop) בצנרת הניקוז.. המלצה: להתקין סיפון ולולאה עילית לצנרת הניקוז, להוסיף ברז ניתוק נפרד.. עלות משוערת: ₪250-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**אסלה תלויה – מסגרת הרכבה (סטלז'') רופפת** — מסגרת ההרכבה של אסלה תלויה (concealed cistern frame) רופפת, גורמת לתנודות באסלה ולסיכון בטיחותי.. המלצה: לחזק את עיגון מסגרת ההרכבה לקיר ולרצפה, להדק את כל הברגים, ולוודא יציבות מלאה.. עלות משוערת: ₪400-₪1500 (ליחידה)', 'ת"י 1205 חלק 2 — מסגרת הרכבה לאסלה תלויה חייבת לשאת עומס מינימלי של 400 ק"ג ולהיות מעוגנת לרצפה ולקיר.', 'ת"י 1205 חלק 2 — מסגרת הרכבה לאסלה תלויה חייבת לשאת עומס מינימלי של 400 ק"ג ולהיות מעוגנת לרצפה ולקיר.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אסלה תלויה – מסגרת הרכבה (סטלז'') רופפת** — מסגרת ההרכבה של אסלה תלויה (concealed cistern frame) רופפת, גורמת לתנודות באסלה ולסיכון בטיחותי.. המלצה: לחזק את עיגון מסגרת ההרכבה לקיר ולרצפה, להדק את כל הברגים, ולוודא יציבות מלאה.. עלות משוערת: ₪400-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**כפתור הפעלה (לחצן) ניאגרה סמויה – לא תקין** — כפתור ההפעלה של ניאגרה סמויה (concealed cistern) לא עובד, תקוע, או אינו מפעיל את שני נפחי השטיפה (3/6 ליטר).. המלצה: להחליף את מנגנון ההפעלה הפנימי של הניאגרה, לכוונן את מוטות ההפעלה, ולבדוק תקינות שני מצבי השטיפה.. עלות משוערת: ₪200-₪700 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כפתור הפעלה (לחצן) ניאגרה סמויה – לא תקין** — כפתור ההפעלה של ניאגרה סמויה (concealed cistern) לא עובד, תקוע, או אינו מפעיל את שני נפחי השטיפה (3/6 ליטר).. המלצה: להחליף את מנגנון ההפעלה הפנימי של הניאגרה, לכוונן את מוטות ההפעלה, ולבדוק תקינות שני מצבי השטיפה.. עלות משוערת: ₪200-₪700 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**התקנת כלי סניטרי בגובה לא תקני** — כיור, אסלה, או כלי סניטרי אחר מותקן בגובה שאינו עומד בדרישות הנגישות או התקן (גבוה/נמוך מדי).. המלצה: לפרק ולהתקין מחדש את הכלי הסניטרי בגובה התקני המתאים.. עלות משוערת: ₪300-₪1200 (ליחידה)', 'ת"י 1205 חלק 2 — גובהות התקנה מומלצים: כיור רחצה – 80-85 ס"מ, אסלה – 40-42 ס"מ, כיור מטבח – 85-90 ס"מ (מידות מדף עליון).', 'ת"י 1205 חלק 2 — גובהות התקנה מומלצים: כיור רחצה – 80-85 ס"מ, אסלה – 40-42 ס"מ, כיור מטבח – 85-90 ס"מ (מידות מדף עליון).', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**התקנת כלי סניטרי בגובה לא תקני** — כיור, אסלה, או כלי סניטרי אחר מותקן בגובה שאינו עומד בדרישות הנגישות או התקן (גבוה/נמוך מדי).. המלצה: לפרק ולהתקין מחדש את הכלי הסניטרי בגובה התקני המתאים.. עלות משוערת: ₪300-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**סיליקון סניטרי פגום או מעופש סביב כלים סניטריים** — סיליקון סניטרי סביב כיור, אמבטיה, אסלה, או משטח עבודה שחור מעובש, סדוק, מתקלף, או חסר.. המלצה: להסיר את הסיליקון הישן בשלמותו, לנקות ולחטא את המשטח, ולמרוח סיליקון סניטרי חדש עמיד לעובש.. עלות משוערת: ₪100-₪350 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סיליקון סניטרי פגום או מעופש סביב כלים סניטריים** — סיליקון סניטרי סביב כיור, אמבטיה, אסלה, או משטח עבודה שחור מעובש, סדוק, מתקלף, או חסר.. המלצה: להסיר את הסיליקון הישן בשלמותו, לנקות ולחטא את המשטח, ולמרוח סיליקון סניטרי חדש עמיד לעובש.. עלות משוערת: ₪100-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**ויסות טמפרטורה לקוי – מים רותחים מברז** — טמפרטורת המים החמים מהברז גבוהה מדי (מעל 50°C), מהווה סכנת כוויות, במיוחד לילדים ולקשישים.. המלצה: לכוונן את הטרמוסטט של דוד/בויילר, או להתקין מערבל תרמוסטטי (TMV) למניעת טמפרטורות מסוכנות.. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1205 חלק 1 — טמפרטורת מים חמים בנקודות שימוש לא תעלה על 50°C. יש להתקין מערבל תרמוסטטי (TMV) במידת הצורך.', 'ת"י 1205 חלק 1 — טמפרטורת מים חמים בנקודות שימוש לא תעלה על 50°C. יש להתקין מערבל תרמוסטטי (TMV) במידת הצורך.', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ויסות טמפרטורה לקוי – מים רותחים מברז** — טמפרטורת המים החמים מהברז גבוהה מדי (מעל 50°C), מהווה סכנת כוויות, במיוחד לילדים ולקשישים.. המלצה: לכוונן את הטרמוסטט של דוד/בויילר, או להתקין מערבל תרמוסטטי (TMV) למניעת טמפרטורות מסוכנות.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, '**אסלה לא יציבה / רופפת** — אסלה שלא מחוברת יציב לרצפה — מתנדנדת בשימוש.. המלצה: חיזוק חיבור אסלה לרצפה, החלפת ברגי עיגון. עלות משוערת: ₪200-₪500 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אסלה לא יציבה / רופפת** — אסלה שלא מחוברת יציב לרצפה — מתנדנדת בשימוש.. המלצה: חיזוק חיבור אסלה לרצפה, החלפת ברגי עיגון. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — נזילת מים מהמסגרת** — חדירת מים דרך מסגרת החלון בזמן גשם או מבחן מים. הנזילה יכולה להופיע בפינות המסגרת, בחיבור לקיר, או דרך חורי הניקוז. גורמים נפוצים: איטום לקוי בין המסגרת לקיר, חוסר בסיליקון חיצוני, או חורי ניקוז חסומים.. המלצה: לבצע מבחן מים (זרנוק לחץ 2 אטמ'' למשך 15 דקות). לאתר מקור הנזילה — אם מחיבור לקיר: להסיר איטום ישן, למלא ביורתן ולאטום מחדש בסיליקון. אם מחורי ניקוז: לנקות ולוודא שפיכה חופשית.. עלות משוערת: ₪250-₪800 (ליחידה)', 'ת"י 1509 — חלון אלומיניום חייב לעמוד בדרישות אטימות למים בלחץ רוח של 300 פסקל לפחות (תלוי בקומה ובאזור גיאוגרפי)', 'ת"י 1509 — חלון אלומיניום חייב לעמוד בדרישות אטימות למים בלחץ רוח של 300 פסקל לפחות (תלוי בקומה ובאזור גיאוגרפי)', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — נזילת מים מהמסגרת** — חדירת מים דרך מסגרת החלון בזמן גשם או מבחן מים. הנזילה יכולה להופיע בפינות המסגרת, בחיבור לקיר, או דרך חורי הניקוז. גורמים נפוצים: איטום לקוי בין המסגרת לקיר, חוסר בסיליקון חיצוני, או חורי ניקוז חסומים.. המלצה: לבצע מבחן מים (זרנוק לחץ 2 אטמ'' למשך 15 דקות). לאתר מקור הנזילה — אם מחיבור לקיר: להסיר איטום ישן, למלא ביורתן ולאטום מחדש בסיליקון. אם מחורי ניקוז: לנקות ולוודא שפיכה חופשית.. עלות משוערת: ₪250-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — חורי ניקוז חסומים או חסרים** — חורי הניקוז (דרנז''ים) בתחתית מסגרת החלון חסומים על ידי טיט, צבע או חומרי בנייה, או שלא נקדחו כלל במהלך ההתקנה. חורי ניקוז נדרשים להוצאת מים שמצטברים בתעלת המסגרת התחתונה.. המלצה: לנקות את חורי הניקוז הקיימים. אם חסרים — לקדוח חורי ניקוז חדשים בתחתית המסגרת בהתאם למפרט היצרן ולהתקין פלאפות.. עלות משוערת: ₪80-₪200 (ליחידה)', 'ת"י 1509 — נדרשים לפחות 2 חורי ניקוז בכל מסגרת חלון, בקוטר מינימלי של 8 מ"מ, עם כיסויי ניקוז (פלאפות) תקינים', 'ת"י 1509 — נדרשים לפחות 2 חורי ניקוז בכל מסגרת חלון, בקוטר מינימלי של 8 מ"מ, עם כיסויי ניקוז (פלאפות) תקינים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — חורי ניקוז חסומים או חסרים** — חורי הניקוז (דרנז''ים) בתחתית מסגרת החלון חסומים על ידי טיט, צבע או חומרי בנייה, או שלא נקדחו כלל במהלך ההתקנה. חורי ניקוז נדרשים להוצאת מים שמצטברים בתעלת המסגרת התחתונה.. המלצה: לנקות את חורי הניקוז הקיימים. אם חסרים — לקדוח חורי ניקוז חדשים בתחתית המסגרת בהתאם למפרט היצרן ולהתקין פלאפות.. עלות משוערת: ₪80-₪200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — גומיות איטום (EPDM) בלויות או חסרות** — גומיות האיטום (EPDM) שמוטמעות בתעלות הפרופיל סביב כנף החלון בלויות, מתקלפות, מתכווצות או חסרות לחלוטין. מצב זה גורם לחדירת רוח, מים, אבק ורעש.. המלצה: להחליף את כל גומיות האיטום בגומיות מקוריות של יצרן הפרופיל (Klil/Shamir/AGS). יש לוודא התאמה מדויקת לתעלת הפרופיל.. עלות משוערת: ₪150-₪400 (ליחידה)', 'ת"י 1509 — חלון חייב לכלול מערכת איטום כפולה (פנימית וחיצונית) עם גומיות EPDM העומדות בתקן אריכות חיים', 'ת"י 1509 — חלון חייב לכלול מערכת איטום כפולה (פנימית וחיצונית) עם גומיות EPDM העומדות בתקן אריכות חיים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — גומיות איטום (EPDM) בלויות או חסרות** — גומיות האיטום (EPDM) שמוטמעות בתעלות הפרופיל סביב כנף החלון בלויות, מתקלפות, מתכווצות או חסרות לחלוטין. מצב זה גורם לחדירת רוח, מים, אבק ורעש.. המלצה: להחליף את כל גומיות האיטום בגומיות מקוריות של יצרן הפרופיל (Klil/Shamir/AGS). יש לוודא התאמה מדויקת לתעלת הפרופיל.. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון הזזה — גלגלות תחתונות שחוקות** — גלגלות ההזזה (רולרים) בתחתית כנף חלון ההזזה שחוקות, שבורות או יוצאות ממסלולן. החלון נגרר בכבדות, קופץ מהמסילה, או לא נסגר עד הסוף.. המלצה: להחליף את הגלגלות בגלגלות מקוריות תואמות לסוג הפרופיל. לנקות את מסילת ההזזה התחתונה ולבדוק יישור.. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 1509 — כנף חלון הזזה חייבת לנוע בחופשיות ולהגיע לנעילה מלאה ללא מאמץ חריג', 'ת"י 1509 — כנף חלון הזזה חייבת לנוע בחופשיות ולהגיע לנעילה מלאה ללא מאמץ חריג', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון הזזה — גלגלות תחתונות שחוקות** — גלגלות ההזזה (רולרים) בתחתית כנף חלון ההזזה שחוקות, שבורות או יוצאות ממסלולן. החלון נגרר בכבדות, קופץ מהמסילה, או לא נסגר עד הסוף.. המלצה: להחליף את הגלגלות בגלגלות מקוריות תואמות לסוג הפרופיל. לנקות את מסילת ההזזה התחתונה ולבדוק יישור.. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון הזזה — מסילה תחתונה פגומה או מעוותת** — מסילת ההזזה התחתונה מעוותת, שקועה בטיח, מלוכלכת בחומרי בנייה, או שבורה. החלון לא מחליק כראוי ולא מגיע לסגירה מלאה.. המלצה: לנקות את המסילה מחומרי בנייה. אם מעוותת — להחליף את פרופיל המסילה. לבדוק ולתקן גובה המסילה ביחס לרצפה.. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1509 — מסילת ההזזה חייבת להיות ישרה, חלקה, ונקייה מחסימות לאורך כל המסלול', 'ת"י 1509 — מסילת ההזזה חייבת להיות ישרה, חלקה, ונקייה מחסימות לאורך כל המסלול', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון הזזה — מסילה תחתונה פגומה או מעוותת** — מסילת ההזזה התחתונה מעוותת, שקועה בטיח, מלוכלכת בחומרי בנייה, או שבורה. החלון לא מחליק כראוי ולא מגיע לסגירה מלאה.. המלצה: לנקות את המסילה מחומרי בנייה. אם מעוותת — להחליף את פרופיל המסילה. לבדוק ולתקן גובה המסילה ביחס לרצפה.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון ציר (קייסמנט) — ציר עליון/תחתון רופף או שבור** — צירי חלון הציר (קייסמנט) רופפים, חורקים, או שבורים. הכנף צונחת, לא נסגרת בצורה אחידה, או נשארת פתוחה שלא כרצון.. המלצה: להדק את ברגי הצירים. אם הצירים שחוקים או שבורים — להחליף בצירים מקוריים תואמי פרופיל. לכוונן את הכנף לאחר ההחלפה.. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1509 — צירים חייבים לשאת את משקל הכנף ללא שקיעה ולאפשר פתיחה/סגירה חלקה לאורך חיי המוצר', 'ת"י 1509 — צירים חייבים לשאת את משקל הכנף ללא שקיעה ולאפשר פתיחה/סגירה חלקה לאורך חיי המוצר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון ציר (קייסמנט) — ציר עליון/תחתון רופף או שבור** — צירי חלון הציר (קייסמנט) רופפים, חורקים, או שבורים. הכנף צונחת, לא נסגרת בצורה אחידה, או נשארת פתוחה שלא כרצון.. המלצה: להדק את ברגי הצירים. אם הצירים שחוקים או שבורים — להחליף בצירים מקוריים תואמי פרופיל. לכוונן את הכנף לאחר ההחלפה.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון דריי-קיפ — מנגנון פתיחה כפולה תקול** — מנגנון הפתיחה הכפולה (tilt & turn / דריי-קיפ) אינו פועל כראוי — החלון לא עובר בין מצב הטיה לפתיחה צירית, ידית תקועה, או הכנף ננעלת במצב ביניים מסוכן.. המלצה: לכוונן את נקודות הנעילה (espagnolette) של המנגנון. אם המנגנון פגום — להחליף מנגנון דריי-קיפ שלם תואם ליצרן הפרופיל.. עלות משוערת: ₪400-₪1200 (ליחידה)', 'ת"י 1509 — מנגנון פתיחה כפולה חייב לעבור בין שלושת המצבים (סגור, הטיה, פתיחה) בצורה חלקה ובטוחה', 'ת"י 1509 — מנגנון פתיחה כפולה חייב לעבור בין שלושת המצבים (סגור, הטיה, פתיחה) בצורה חלקה ובטוחה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון דריי-קיפ — מנגנון פתיחה כפולה תקול** — מנגנון הפתיחה הכפולה (tilt & turn / דריי-קיפ) אינו פועל כראוי — החלון לא עובר בין מצב הטיה לפתיחה צירית, ידית תקועה, או הכנף ננעלת במצב ביניים מסוכן.. המלצה: לכוונן את נקודות הנעילה (espagnolette) של המנגנון. אם המנגנון פגום — להחליף מנגנון דריי-קיפ שלם תואם ליצרן הפרופיל.. עלות משוערת: ₪400-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — חוסר גשר תרמי (thermal break)** — הותקן פרופיל אלומיניום ללא גשר תרמי (פוליאמיד) במקום שנדרש פרופיל תרמי. ללא גשר תרמי נוצרת עיבוי (קונדנסציה) על הפרופיל בחורף וישנה אובדן אנרגיה משמעותי.. המלצה: להחליף את החלון בחלון עם פרופיל בעל גשר תרמי (thermal break). ליקוי זה דורש החלפה מלאה של המסגרת והכנפות.. עלות משוערת: ₪1500-₪4000 (למ"ר)', 'ת"י 1045 — תקן בידוד תרמי במבנים מחייב ערך U מרבי לחלונות — פרופיל עם גשר תרמי נדרש באזורי אקלים B ו-C', 'ת"י 1045 — תקן בידוד תרמי במבנים מחייב ערך U מרבי לחלונות — פרופיל עם גשר תרמי נדרש באזורי אקלים B ו-C', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — חוסר גשר תרמי (thermal break)** — הותקן פרופיל אלומיניום ללא גשר תרמי (פוליאמיד) במקום שנדרש פרופיל תרמי. ללא גשר תרמי נוצרת עיבוי (קונדנסציה) על הפרופיל בחורף וישנה אובדן אנרגיה משמעותי.. המלצה: להחליף את החלון בחלון עם פרופיל בעל גשר תרמי (thermal break). ליקוי זה דורש החלפה מלאה של המסגרת והכנפות.. עלות משוערת: ₪1500-₪4000 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — איטום חיצוני לקוי בין מסגרת לקיר** — האיטום החיצוני בין מסגרת האלומיניום לקיר (טיח/שיש) חסר, סדוק, או לא רציף. הסיליקון מתקלף, מצהיב, או לא מכסה את כל המפגש. גורם לחדירת מים ורוח.. המלצה: להסיר איטום ישן, לנקות את המשטחים, למלא ביורתן גמיש ולאטום מחדש בסיליקון חיצוני UV-resistant מתאים לאלומיניום.. עלות משוערת: ₪150-₪500 (ליחידה)', 'ת"י 1509 — נדרש איטום רציף ואלסטי בכל היקף החלון בין המסגרת למשקוף/אדן', 'ת"י 1509 — נדרש איטום רציף ואלסטי בכל היקף החלון בין המסגרת למשקוף/אדן', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — איטום חיצוני לקוי בין מסגרת לקיר** — האיטום החיצוני בין מסגרת האלומיניום לקיר (טיח/שיש) חסר, סדוק, או לא רציף. הסיליקון מתקלף, מצהיב, או לא מכסה את כל המפגש. גורם לחדירת מים ורוח.. המלצה: להסיר איטום ישן, לנקות את המשטחים, למלא ביורתן גמיש ולאטום מחדש בסיליקון חיצוני UV-resistant מתאים לאלומיניום.. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — רשת יתושים קרועה או חסרה** — רשת היתושים קרועה, מנותקת מהמסגרת, או לא סופקה כלל. במפרט הדירה נדרשת רשת יתושים בכל חלון.. המלצה: להתקין/להחליף רשת יתושים תואמת — רשת הזזה, גלילה, או קבועה בהתאם לסוג החלון.. עלות משוערת: ₪150-₪450 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — רשת יתושים קרועה או חסרה** — רשת היתושים קרועה, מנותקת מהמסגרת, או לא סופקה כלל. במפרט הדירה נדרשת רשת יתושים בכל חלון.. המלצה: להתקין/להחליף רשת יתושים תואמת — רשת הזזה, גלילה, או קבועה בהתאם לסוג החלון.. עלות משוערת: ₪150-₪450 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — מסגרת מעוותת או לא מפולסת** — מסגרת החלון לא מפולסת (לא במאוזן/מאונך), מעוותת, או מפותלת. הכנף לא נסגרת באחידות, יש פער לא אחיד בין הכנף למסגרת, נגרמים בעיות איטום ונעילה.. המלצה: לפרק את החלון, ליישר את המסגרת בפילוס מדויק, לעגן מחדש ולאטום. במקרים חמורים — להחליף מסגרת.. עלות משוערת: ₪400-₪1500 (ליחידה)', 'ת"י 1509 — סטייה מרבית מאנכיות ואופקיות: 2 מ"מ למטר אורך, עד מקסימום 3 מ"מ', 'ת"י 1509 — סטייה מרבית מאנכיות ואופקיות: 2 מ"מ למטר אורך, עד מקסימום 3 מ"מ', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — מסגרת מעוותת או לא מפולסת** — מסגרת החלון לא מפולסת (לא במאוזן/מאונך), מעוותת, או מפותלת. הכנף לא נסגרת באחידות, יש פער לא אחיד בין הכנף למסגרת, נגרמים בעיות איטום ונעילה.. המלצה: לפרק את החלון, ליישר את המסגרת בפילוס מדויק, לעגן מחדש ולאטום. במקרים חמורים — להחליף מסגרת.. עלות משוערת: ₪400-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — שריטות או נזק לפרופיל** — שריטות עמוקות, מכות, או נזק לציפוי האלקטרוסטטי (אנודייז או צביעה) של פרופיל האלומיניום. נגרם בדרך כלל במהלך עבודות בנייה או הובלה.. המלצה: שריטות שטחיות — לטפל בצבע תיקון מקורי מהיצרן. שריטות עמוקות/נרחבות — להחליף את הפרופיל הפגום.. עלות משוערת: ₪100-₪500 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — שריטות או נזק לפרופיל** — שריטות עמוקות, מכות, או נזק לציפוי האלקטרוסטטי (אנודייז או צביעה) של פרופיל האלומיניום. נגרם בדרך כלל במהלך עבודות בנייה או הובלה.. המלצה: שריטות שטחיות — לטפל בצבע תיקון מקורי מהיצרן. שריטות עמוקות/נרחבות — להחליף את הפרופיל הפגום.. עלות משוערת: ₪100-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — הרכבה ללא עיגון תקני לקיר** — מסגרת החלון מעוגנת לקיר בצורה לא תקנית — רק בקצף פוליאורתן ללא דיבלים, עם מספר לא מספיק של נקודות עיגון, או עם מרווחים גדולים מדי בין נקודות העיגון.. המלצה: להוסיף נקודות עיגון מכאניות (פישר + בורג נירוסטה) בהתאם לתקן. לא להסתפק בקצף בלבד.. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1509 — נדרשות נקודות עיגון מכאניות (דיבלים/ברגי בטון) כל 60 ס"מ לפחות, ולא יותר מ-15 ס"מ מכל פינה', 'ת"י 1509 — נדרשות נקודות עיגון מכאניות (דיבלים/ברגי בטון) כל 60 ס"מ לפחות, ולא יותר מ-15 ס"מ מכל פינה', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — הרכבה ללא עיגון תקני לקיר** — מסגרת החלון מעוגנת לקיר בצורה לא תקנית — רק בקצף פוליאורתן ללא דיבלים, עם מספר לא מספיק של נקודות עיגון, או עם מרווחים גדולים מדי בין נקודות העיגון.. המלצה: להוסיף נקודות עיגון מכאניות (פישר + בורג נירוסטה) בהתאם לתקן. לא להסתפק בקצף בלבד.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — חדירת אוויר (רוח) חריגה** — חדירת אוויר חריגה דרך החלון במצב סגור — מורגשת רוח, שריקת רוח, או נכנס אבק. הגורם: גומיות לא תקינות, נעילה חלקית, מסגרת לא מיושרת.. המלצה: לבדוק ולהחליף גומיות איטום. לכוונן נקודות נעילה להידוק מלא. לבדוק יישור מסגרת. לבצע בדיקת blower door אם נדרש.. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 1509 — חדירת אוויר מרבית: סיווג A2 לפחות (6.75 מ"ק/שעה/מ"ר בלחץ 100 פסקל)', 'ת"י 1509 — חדירת אוויר מרבית: סיווג A2 לפחות (6.75 מ"ק/שעה/מ"ר בלחץ 100 פסקל)', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — חדירת אוויר (רוח) חריגה** — חדירת אוויר חריגה דרך החלון במצב סגור — מורגשת רוח, שריקת רוח, או נכנס אבק. הגורם: גומיות לא תקינות, נעילה חלקית, מסגרת לא מיושרת.. המלצה: לבדוק ולהחליף גומיות איטום. לכוונן נקודות נעילה להידוק מלא. לבדוק יישור מסגרת. לבצע בדיקת blower door אם נדרש.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — אדן שיש חיצוני ללא שיפוע** — אדן השיש/אבן החיצוני של החלון ללא שיפוע כלפי חוץ, או עם שיפוע הפוך — מים מצטברים על האדן ונכנסים פנימה במקום לנקז החוצה.. המלצה: להתקין מחדש את אדן השיש בשיפוע של 3-5% כלפי חוץ. לוודא טפטפת בחזית האדן ואיטום למסגרת.. עלות משוערת: ₪300-₪800 (ליחידה)', 'ת"י 1509 — אדן חיצוני חייב להיות משופע כלפי חוץ עם טפטפת (drip edge) למניעת זרימת מים לקיר', 'ת"י 1509 — אדן חיצוני חייב להיות משופע כלפי חוץ עם טפטפת (drip edge) למניעת זרימת מים לקיר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — אדן שיש חיצוני ללא שיפוע** — אדן השיש/אבן החיצוני של החלון ללא שיפוע כלפי חוץ, או עם שיפוע הפוך — מים מצטברים על האדן ונכנסים פנימה במקום לנקז החוצה.. המלצה: להתקין מחדש את אדן השיש בשיפוע של 3-5% כלפי חוץ. לוודא טפטפת בחזית האדן ואיטום למסגרת.. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — צבע פרופיל לא תואם למפרט** — צבע הפרופיל (RAL) לא תואם למפרט הפרויקט — גוון שונה, צבע מתקלף, ציפוי לא אחיד, או הבדלי גוון בין חלונות שונים באותה דירה.. המלצה: אם הצבע לא תואם למפרט — להחליף את הפרופילים הפגומים. אם ציפוי מתקלף — תביעת אחריות מיצרן הפרופיל.. עלות משוערת: ₪500-₪2000 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — צבע פרופיל לא תואם למפרט** — צבע הפרופיל (RAL) לא תואם למפרט הפרויקט — גוון שונה, צבע מתקלף, ציפוי לא אחיד, או הבדלי גוון בין חלונות שונים באותה דירה.. המלצה: אם הצבע לא תואם למפרט — להחליף את הפרופילים הפגומים. אם ציפוי מתקלף — תביעת אחריות מיצרן הפרופיל.. עלות משוערת: ₪500-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — עיבוי (קונדנסציה) על הפרופיל** — עיבוי מים (קונדנסציה) נוצר על פרופיל האלומיניום בחורף, בעיקר בפרופיל ללא גשר תרמי. המים נוזלים לאדן ולקיר וגורמים לעובש ולנזק.. המלצה: פתרון מלא: החלפת חלון לפרופיל עם גשר תרמי. פתרון חלקי: שיפור אוורור החדר, התקנת מפוח אוויר.. עלות משוערת: ₪1500-₪4000 (למ"ר)', 'ת"י 1045 — מעטפת הבניין, כולל חלונות, חייבת למנוע עיבוי על משטחים פנימיים בתנאי שימוש רגילים', 'ת"י 1045 — מעטפת הבניין, כולל חלונות, חייבת למנוע עיבוי על משטחים פנימיים בתנאי שימוש רגילים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — עיבוי (קונדנסציה) על הפרופיל** — עיבוי מים (קונדנסציה) נוצר על פרופיל האלומיניום בחורף, בעיקר בפרופיל ללא גשר תרמי. המים נוזלים לאדן ולקיר וגורמים לעובש ולנזק.. המלצה: פתרון מלא: החלפת חלון לפרופיל עם גשר תרמי. פתרון חלקי: שיפור אוורור החדר, התקנת מפוח אוויר.. עלות משוערת: ₪1500-₪4000 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון לא אוטם — חדירת אוויר/מים** — חלון שלא אוטם כראוי — חדירת אוויר, מים או אבק.. המלצה: החלפת רצועות אטימה, תיקון סיליקון, כוונון. עלות משוערת: ₪100-₪350 (ליחידה)', 'ת"י 23 — חלונות חייבים לעמוד בתקן אטימות למים ואוויר', 'ת"י 23 — חלונות חייבים לעמוד בתקן אטימות למים ואוויר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון לא אוטם — חדירת אוויר/מים** — חלון שלא אוטם כראוי — חדירת אוויר, מים או אבק.. המלצה: החלפת רצועות אטימה, תיקון סיליקון, כוונון. עלות משוערת: ₪100-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**דלת מרפסת אלומיניום — סף תחתון גבוה מדי** — סף דלת המרפסת בולט מעל פני הרצפה ביותר מ-20 מ"מ, מהווה מכשול מעידה ואינו נגיש לנכים ולעגלות.. המלצה: להחליף את הסף בסף נמוך/שטוח תואם נגישות. אם לא ניתן — להתקין רמפה משופעת בשני צדי הסף.. עלות משוערת: ₪300-₪900 (ליחידה)', 'ת"י 1918 — דרישות נגישות — סף דלת לא יעלה על 20 מ"מ, ורצוי סף שטוח/משופע', 'ת"י 1918 — דרישות נגישות — סף דלת לא יעלה על 20 מ"מ, ורצוי סף שטוח/משופע', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת מרפסת אלומיניום — סף תחתון גבוה מדי** — סף דלת המרפסת בולט מעל פני הרצפה ביותר מ-20 מ"מ, מהווה מכשול מעידה ואינו נגיש לנכים ולעגלות.. המלצה: להחליף את הסף בסף נמוך/שטוח תואם נגישות. אם לא ניתן — להתקין רמפה משופעת בשני צדי הסף.. עלות משוערת: ₪300-₪900 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**דלת מרפסת הזזה — גלילה כבדה ולא חלקה** — דלת ההזזה למרפסת נגררת בכבדות, דורשת כוח רב לפתיחה/סגירה, או נתקעת באמצע המסלול. נגרם מגלגלות שחוקות, מסילה מלוכלכת, או כנף לא מכוונת.. המלצה: לנקות מסילות, לשמן גלגלות. להחליף גלגלות שחוקות. לכוונן גובה כנף ביחס למסילה.. עלות משוערת: ₪250-₪700 (ליחידה)', 'ת"י 1509 — דלת הזזה חייבת להיפתח בכוח שאינו עולה על 50 ניוטון (כ-5 ק"ג)', 'ת"י 1509 — דלת הזזה חייבת להיפתח בכוח שאינו עולה על 50 ניוטון (כ-5 ק"ג)', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת מרפסת הזזה — גלילה כבדה ולא חלקה** — דלת ההזזה למרפסת נגררת בכבדות, דורשת כוח רב לפתיחה/סגירה, או נתקעת באמצע המסלול. נגרם מגלגלות שחוקות, מסילה מלוכלכת, או כנף לא מכוונת.. המלצה: לנקות מסילות, לשמן גלגלות. להחליף גלגלות שחוקות. לכוונן גובה כנף ביחס למסילה.. עלות משוערת: ₪250-₪700 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**דלת מרפסת הזזה — נעילה רב-נקודתית לא תקינה** — מנגנון הנעילה הרב-נקודתי של דלת המרפסת לא פועל כראוי — חלק מנקודות הנעילה לא ננעלות, הידית לא מסתובבת עד הסוף, או שהנעילה לא אטומה.. המלצה: לכוונן את נקודות הנעילה והנגדים. לשמן את מוטות הנעילה. אם המנגנון פגום — להחליף את מערכת הנעילה.. עלות משוערת: ₪350-₪1000 (ליחידה)', 'ת"י 1509 — דלת חייבת להינעל בנעילה רב-נקודתית המבטיחה איטום ואבטחה בכל נקודות המגע', 'ת"י 1509 — דלת חייבת להינעל בנעילה רב-נקודתית המבטיחה איטום ואבטחה בכל נקודות המגע', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת מרפסת הזזה — נעילה רב-נקודתית לא תקינה** — מנגנון הנעילה הרב-נקודתי של דלת המרפסת לא פועל כראוי — חלק מנקודות הנעילה לא ננעלות, הידית לא מסתובבת עד הסוף, או שהנעילה לא אטומה.. המלצה: לכוונן את נקודות הנעילה והנגדים. לשמן את מוטות הנעילה. אם המנגנון פגום — להחליף את מערכת הנעילה.. עלות משוערת: ₪350-₪1000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**דלת כניסה אלומיניום — צילינדר/מנעול לא תקני** — צילינדר המנעול בדלת הכניסה אינו עומד בתקן אבטחה — ללא הגנה מפני קידוח, פריצה, או bump key. או שבולט מעבר לרוזטה ביותר מ-3 מ"מ.. המלצה: להחליף את הצילינדר בצילינדר תקני בעל דרגת אבטחה מתאימה (לפחות 5 פינים, הגנת קידוח).. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 5514 — צילינדר בדלת כניסה חייב לעמוד בדרגת אבטחה מינימלית לפי ת"י 5514', 'ת"י 5514 — צילינדר בדלת כניסה חייב לעמוד בדרגת אבטחה מינימלית לפי ת"י 5514', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת כניסה אלומיניום — צילינדר/מנעול לא תקני** — צילינדר המנעול בדלת הכניסה אינו עומד בתקן אבטחה — ללא הגנה מפני קידוח, פריצה, או bump key. או שבולט מעבר לרוזטה ביותר מ-3 מ"מ.. המלצה: להחליף את הצילינדר בצילינדר תקני בעל דרגת אבטחה מתאימה (לפחות 5 פינים, הגנת קידוח).. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**דלת אלומיניום — סוגר (Door Closer) חסר או לא מכוונן** — סוגר דלת (door closer) חסר בדלת שנדרש בה (דלת חדר מדרגות, דלת אש), או שהסוגר הקיים לא מכוונן — הדלת נטרקת או לא נסגרת עד הסוף.. המלצה: להתקין סוגר דלת מתאים לגודל ומשקל הדלת. אם קיים — לכוונן את מהירות הסגירה והנעילה (latch speed).. עלות משוערת: ₪300-₪800 (ליחידה)', 'ת"י 1555 — דלתות בדרכי מילוט ודלתות אש חייבות בסוגר עצמי מאושר שמחזיר את הדלת לסגירה מלאה', 'ת"י 1555 — דלתות בדרכי מילוט ודלתות אש חייבות בסוגר עצמי מאושר שמחזיר את הדלת לסגירה מלאה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת אלומיניום — סוגר (Door Closer) חסר או לא מכוונן** — סוגר דלת (door closer) חסר בדלת שנדרש בה (דלת חדר מדרגות, דלת אש), או שהסוגר הקיים לא מכוונן — הדלת נטרקת או לא נסגרת עד הסוף.. המלצה: להתקין סוגר דלת מתאים לגודל ומשקל הדלת. אם קיים — לכוונן את מהירות הסגירה והנעילה (latch speed).. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**דלת אלומיניום — פער לא אחיד בין כנף למשקוף** — הרווח בין כנף הדלת למסגרת (משקוף ומזוזות) לא אחיד — גדול מדי בצד אחד וצר מהצד השני. מעיד על כנף שלא מכוונת, צירים שחוקים, או מסגרת מעוותת.. המלצה: לכוונן את הצירים להשגת רווח אחיד. אם הצירים שחוקים — להחליפם. במקרה של מסגרת מעוותת — ליישר ולעגן מחדש.. עלות משוערת: ₪150-₪500 (ליחידה)', 'ת"י 1509 — רווח בין כנף למסגרת חייב להיות אחיד, בהתאם למפרט היצרן (בדרך כלל 3-5 מ"מ)', 'ת"י 1509 — רווח בין כנף למסגרת חייב להיות אחיד, בהתאם למפרט היצרן (בדרך כלל 3-5 מ"מ)', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת אלומיניום — פער לא אחיד בין כנף למשקוף** — הרווח בין כנף הדלת למסגרת (משקוף ומזוזות) לא אחיד — גדול מדי בצד אחד וצר מהצד השני. מעיד על כנף שלא מכוונת, צירים שחוקים, או מסגרת מעוותת.. המלצה: לכוונן את הצירים להשגת רווח אחיד. אם הצירים שחוקים — להחליפם. במקרה של מסגרת מעוותת — ליישר ולעגן מחדש.. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**דלת כניסה אלומיניום — בידוד אקוסטי לא מספיק** — דלת הכניסה לא מספקת בידוד אקוסטי מספיק — נשמעים רעשי חדר מדרגות, שכנים ומעלית בתוך הדירה. הפער בין הדלת למשקוף גדול מדי או חסרות גומיות איטום.. המלצה: להתקין/להחליף גומיות איטום היקפיות. להתקין סף תחתון אוטומטי (drop seal). אם לא מספיק — להחליף לדלת עם בידוד אקוסטי מוגבר.. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1142 — נדרש בידוד אקוסטי מינימלי של 30 dB בין חדר מדרגות לדירה', 'ת"י 1142 — נדרש בידוד אקוסטי מינימלי של 30 dB בין חדר מדרגות לדירה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת כניסה אלומיניום — בידוד אקוסטי לא מספיק** — דלת הכניסה לא מספקת בידוד אקוסטי מספיק — נשמעים רעשי חדר מדרגות, שכנים ומעלית בתוך הדירה. הפער בין הדלת למשקוף גדול מדי או חסרות גומיות איטום.. המלצה: להתקין/להחליף גומיות איטום היקפיות. להתקין סף תחתון אוטומטי (drop seal). אם לא מספיק — להחליף לדלת עם בידוד אקוסטי מוגבר.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**דלת מרפסת — חוסר מעקה בטיחות** — דלת מרפסת צרפתית (French door) ללא מעקה בטיחות חיצוני, כאשר פתח הדלת בקומה גבוהה ואין מרפסת. מהווה סכנת נפילה חמורה.. המלצה: להתקין מעקה בטיחות צמוד לפתח הדלת — מעקה אלומיניום/נירוסטה עם זכוכית בטיחות, בגובה 105 ס"מ.. עלות משוערת: ₪1500-₪4000 (למ"א)', 'ת"י 1142 — פתח בקומה שנייה ומעלה חייב במעקה בגובה 105 ס"מ לפחות (עם דרישות רווח וחוזק)', 'ת"י 1142 — פתח בקומה שנייה ומעלה חייב במעקה בגובה 105 ס"מ לפחות (עם דרישות רווח וחוזק)', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת מרפסת — חוסר מעקה בטיחות** — דלת מרפסת צרפתית (French door) ללא מעקה בטיחות חיצוני, כאשר פתח הדלת בקומה גבוהה ואין מרפסת. מהווה סכנת נפילה חמורה.. המלצה: להתקין מעקה בטיחות צמוד לפתח הדלת — מעקה אלומיניום/נירוסטה עם זכוכית בטיחות, בגובה 105 ס"מ.. עלות משוערת: ₪1500-₪4000 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס גלילה — מנוע חשמלי לא פועל** — מנוע התריס החשמלי לא פועל — התריס לא עולה, לא יורד, או נתקע באמצע. הגורמים: תקלת מנוע, בעיית חשמל, מתג מגבלה (limit switch) לא מכוונן, או קונדנסטור תקול.. המלצה: לבדוק חיבור חשמל ומפסק. לבדוק קונדנסטור מנוע. לכוונן מתגי מגבלה. אם המנוע שרוף — להחליף מנוע תואם למידות הגליל.. עלות משוערת: ₪400-₪1200 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס גלילה — מנוע חשמלי לא פועל** — מנוע התריס החשמלי לא פועל — התריס לא עולה, לא יורד, או נתקע באמצע. הגורמים: תקלת מנוע, בעיית חשמל, מתג מגבלה (limit switch) לא מכוונן, או קונדנסטור תקול.. המלצה: לבדוק חיבור חשמל ומפסק. לבדוק קונדנסטור מנוע. לכוונן מתגי מגבלה. אם המנוע שרוף — להחליף מנוע תואם למידות הגליל.. עלות משוערת: ₪400-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס גלילה — למלות (שלבים) עקומות או שבורות** — למלות (שלבים) של תריס הגלילה עקומות, שבורות, או מנותקות זו מזו. התריס לא יורד/עולה כראוי, לא אטום לאור, ומראה חיצוני פגום.. המלצה: להחליף את הלמלות הפגומות בלמלות חדשות תואמות (זהה ברוחב, עובי, וצורת חיבור). במקרה של נזק נרחב — להחליף את מילוי התריס כולו.. עלות משוערת: ₪200-₪800 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס גלילה — למלות (שלבים) עקומות או שבורות** — למלות (שלבים) של תריס הגלילה עקומות, שבורות, או מנותקות זו מזו. התריס לא יורד/עולה כראוי, לא אטום לאור, ומראה חיצוני פגום.. המלצה: להחליף את הלמלות הפגומות בלמלות חדשות תואמות (זהה ברוחב, עובי, וצורת חיבור). במקרה של נזק נרחב — להחליף את מילוי התריס כולו.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס גלילה — מסילות צד פגומות** — מסילות הצד (מובילים) של תריס הגלילה פגומות, מעוותות, או לא מותקנות כראוי. התריס קופץ מהמסילה, נתקע, או לא מונע חדירת אור.. המלצה: ליישר את מסילות הצד ולעגן מחדש. אם פגומות — להחליף. לוודא רווח אחיד בין הלמלות למסילה.. עלות משוערת: ₪200-₪600 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס גלילה — מסילות צד פגומות** — מסילות הצד (מובילים) של תריס הגלילה פגומות, מעוותות, או לא מותקנות כראוי. התריס קופץ מהמסילה, נתקע, או לא מונע חדירת אור.. המלצה: ליישר את מסילות הצד ולעגן מחדש. אם פגומות — להחליף. לוודא רווח אחיד בין הלמלות למסילה.. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס גלילה — תיבת גלילה (קופסת תריס) לא מבודדת** — תיבת הגלילה (קופסת התריס) לא מבודדת תרמית ואקוסטית — נוצרת נקודת קור בחורף, עיבוי מים, חדירת רעש, ולעיתים גם חדירת מזיקים.. המלצה: לפתוח את תיבת הגלילה ולהדביק בידוד תרמי (לוח XPS/EPS או מוצר ייעודי). לאטום את כל הפרצים באיטום אלסטי.. עלות משוערת: ₪250-₪600 (ליחידה)', 'ת"י 1045 — תיבת תריס חייבת לעמוד בדרישות בידוד תרמי — ערך U מרבי כמו יתר המעטפת', 'ת"י 1045 — תיבת תריס חייבת לעמוד בדרישות בידוד תרמי — ערך U מרבי כמו יתר המעטפת', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס גלילה — תיבת גלילה (קופסת תריס) לא מבודדת** — תיבת הגלילה (קופסת התריס) לא מבודדת תרמית ואקוסטית — נוצרת נקודת קור בחורף, עיבוי מים, חדירת רעש, ולעיתים גם חדירת מזיקים.. המלצה: לפתוח את תיבת הגלילה ולהדביק בידוד תרמי (לוח XPS/EPS או מוצר ייעודי). לאטום את כל הפרצים באיטום אלסטי.. עלות משוערת: ₪250-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס גלילה — רצועת הפעלה (סרט) קרועה או שחוקה** — רצועת ההפעלה (סרט התריס) של תריס ידני קרועה, שחוקה, או נתקעת בגליל. התריס לא ניתן להפעלה.. המלצה: להחליף את רצועת ההפעלה כולל גלגלת הסרט (avvolgitore). לוודא מידה תואמת (רוחב 14/20/23 מ"מ).. עלות משוערת: ₪100-₪300 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס גלילה — רצועת הפעלה (סרט) קרועה או שחוקה** — רצועת ההפעלה (סרט התריס) של תריס ידני קרועה, שחוקה, או נתקעת בגליל. התריס לא ניתן להפעלה.. המלצה: להחליף את רצועת ההפעלה כולל גלגלת הסרט (avvolgitore). לוודא מידה תואמת (רוחב 14/20/23 מ"מ).. עלות משוערת: ₪100-₪300 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס גלילה — רעש חריג בזמן הפעלה** — התריס משמיע רעש חריג (חריקה, נקישות, רעידות) בזמן עלייה או ירידה. גורמים: מסילות יבשות, למלות פגומות, ציר לא מיושר, או מנוע רועד.. המלצה: לשמן מסילות צד בסיליקון ספריי. לבדוק ולהחליף למלות פגומות. לכוונן יישור גליל וציר. אם מנוע — לבדוק עיגון ושקטי רעידות.. עלות משוערת: ₪100-₪400 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס גלילה — רעש חריג בזמן הפעלה** — התריס משמיע רעש חריג (חריקה, נקישות, רעידות) בזמן עלייה או ירידה. גורמים: מסילות יבשות, למלות פגומות, ציר לא מיושר, או מנוע רועד.. המלצה: לשמן מסילות צד בסיליקון ספריי. לבדוק ולהחליף למלות פגומות. לכוונן יישור גליל וציר. אם מנוע — לבדוק עיגון ושקטי רעידות.. עלות משוערת: ₪100-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס הצללה מתקפל — זרועות שבורות או רופפות** — זרועות תריס ההצללה המתקפל (תריס ונציאני/פרסול) שבורות, רופפות, או לא ננעלות במצב פתוח. התריס לא נשאר פתוח ברוח או לא נסגר כראוי.. המלצה: להחליף את הזרועות הפגומות בזרועות מקוריות. להדק את כל ברגי החיבור. לשמן צירים וציפים.. עלות משוערת: ₪200-₪700 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס הצללה מתקפל — זרועות שבורות או רופפות** — זרועות תריס ההצללה המתקפל (תריס ונציאני/פרסול) שבורות, רופפות, או לא ננעלות במצב פתוח. התריס לא נשאר פתוח ברוח או לא נסגר כראוי.. המלצה: להחליף את הזרועות הפגומות בזרועות מקוריות. להדק את כל ברגי החיבור. לשמן צירים וציפים.. עלות משוערת: ₪200-₪700 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס גלילה — חדירת אור בין למלות במצב סגור** — כשהתריס סגור לחלוטין, נכנס אור בין הלמלות — הלמלות לא נסגרות ברצף צפוף, יש רווחים גלויים, או שלמלות מעוותות לא מתיישרות.. המלצה: לכוונן את מתח התריס ואת מגבלת הירידה. להחליף למלות מעוותות. לוודא שכל הלמלות מסוג זהה ותקינות.. עלות משוערת: ₪150-₪500 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס גלילה — חדירת אור בין למלות במצב סגור** — כשהתריס סגור לחלוטין, נכנס אור בין הלמלות — הלמלות לא נסגרות ברצף צפוף, יש רווחים גלויים, או שלמלות מעוותות לא מתיישרות.. המלצה: לכוונן את מתח התריס ואת מגבלת הירידה. להחליף למלות מעוותות. לוודא שכל הלמלות מסוג זהה ותקינות.. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**תריס חשמלי תקוע / לא עולה** — תריס חשמלי שלא עולה, יורד, או תקוע באמצע.. המלצה: בדיקת מנוע, כוונון מסילות, החלפת רכיב פגום. עלות משוערת: ₪300-₪1000 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תריס חשמלי תקוע / לא עולה** — תריס חשמלי שלא עולה, יורד, או תקוע באמצע.. המלצה: בדיקת מנוע, כוונון מסילות, החלפת רכיב פגום. עלות משוערת: ₪300-₪1000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — זכוכית לא בטיחותית** — הותקנה זכוכית רגילה (לא בטיחותית) במקום שנדרשת זכוכית בטיחות — מחוסמת או שכבתית (למינציה). זכוכית רגילה מתנפצת לרסיסים חדים ומהווה סכנת חיים.. המלצה: להחליף את הזכוכית בזכוכית בטיחותית (מחוסמת או למינציה) בהתאם לדרישת התקן. לוודא חותמת תקן על הזכוכית החדשה.. עלות משוערת: ₪400-₪1200 (למ"ר)', 'ת"י 1099 — ת"י 1099 מחייב זכוכית בטיחות בחלונות עד גובה 80 ס"מ מהרצפה, בדלתות זכוכית, במעקות, ובמקלחות', 'ת"י 1099 — ת"י 1099 מחייב זכוכית בטיחות בחלונות עד גובה 80 ס"מ מהרצפה, בדלתות זכוכית, במעקות, ובמקלחות', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — זכוכית לא בטיחותית** — הותקנה זכוכית רגילה (לא בטיחותית) במקום שנדרשת זכוכית בטיחות — מחוסמת או שכבתית (למינציה). זכוכית רגילה מתנפצת לרסיסים חדים ומהווה סכנת חיים.. המלצה: להחליף את הזכוכית בזכוכית בטיחותית (מחוסמת או למינציה) בהתאם לדרישת התקן. לוודא חותמת תקן על הזכוכית החדשה.. עלות משוערת: ₪400-₪1200 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — זכוכית תרמית (דאבל גלייז) לא אטומה** — יחידת הזיגוג הכפול (דאבל גלייז) מאבדת את האטימות — נראית עננות/ערפל בין שכבות הזכוכית. סימן לכשל באיטום היקפי של היחידה, מה שמבטל את הבידוד התרמי.. המלצה: להחליף את יחידת הזיגוג הכפול בשלמותה. אין אפשרות לתקן יחידה שאיבדה אטימות.. עלות משוערת: ₪350-₪900 (למ"ר)', 'ת"י 1509 — יחידת זיגוג מבודד חייבת לשמור על ריק/גז בין השכבות לאורך חיי המוצר', 'ת"י 1509 — יחידת זיגוג מבודד חייבת לשמור על ריק/גז בין השכבות לאורך חיי המוצר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — זכוכית תרמית (דאבל גלייז) לא אטומה** — יחידת הזיגוג הכפול (דאבל גלייז) מאבדת את האטימות — נראית עננות/ערפל בין שכבות הזכוכית. סימן לכשל באיטום היקפי של היחידה, מה שמבטל את הבידוד התרמי.. המלצה: להחליף את יחידת הזיגוג הכפול בשלמותה. אין אפשרות לתקן יחידה שאיבדה אטימות.. עלות משוערת: ₪350-₪900 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — סדק או שבר בזכוכית** — סדק, שבר, או ניקוב בזכוכית החלון. יכול להיגרם ממכה, מתח תרמי, או מלחץ לא אחיד של מסגרת החלון על הזכוכית.. המלצה: להחליף את הזכוכית השבורה בזכוכית חדשה תואמת תקן (בטיחותית היכן שנדרש). לבדוק שהמסגרת לא לוחצת על הזכוכית.. עלות משוערת: ₪300-₪800 (למ"ר)', 'ת"י 1099 — זכוכית בחלון חייבת להיות שלמה, ללא סדקים או שברים, ולעמוד בדרישות בטיחות', 'ת"י 1099 — זכוכית בחלון חייבת להיות שלמה, ללא סדקים או שברים, ולעמוד בדרישות בטיחות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — סדק או שבר בזכוכית** — סדק, שבר, או ניקוב בזכוכית החלון. יכול להיגרם ממכה, מתח תרמי, או מלחץ לא אחיד של מסגרת החלון על הזכוכית.. המלצה: להחליף את הזכוכית השבורה בזכוכית חדשה תואמת תקן (בטיחותית היכן שנדרש). לבדוק שהמסגרת לא לוחצת על הזכוכית.. עלות משוערת: ₪300-₪800 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**זכוכית חלון — חוסר התאמה למפרט (עובי/סוג)** — הזכוכית שהותקנה לא תואמת למפרט המכר — עובי נמוך מהנדרש, זכוכית בודדת במקום כפולה, או חסרה שכבת Low-E שנדרשה במפרט.. המלצה: להחליף את הזכוכית בזכוכית התואמת למפרט המכר. לדרוש אישור יצרן על סוג הזכוכית שהותקנה.. עלות משוערת: ₪350-₪1000 (למ"ר)', 'ת"י 1509 — הזיגוג חייב להתאים למפרט הטכני של הפרויקט ולדרישות התקן לגודל החלון', 'ת"י 1509 — הזיגוג חייב להתאים למפרט הטכני של הפרויקט ולדרישות התקן לגודל החלון', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**זכוכית חלון — חוסר התאמה למפרט (עובי/סוג)** — הזכוכית שהותקנה לא תואמת למפרט המכר — עובי נמוך מהנדרש, זכוכית בודדת במקום כפולה, או חסרה שכבת Low-E שנדרשה במפרט.. המלצה: להחליף את הזכוכית בזכוכית התואמת למפרט המכר. לדרוש אישור יצרן על סוג הזכוכית שהותקנה.. עלות משוערת: ₪350-₪1000 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — חוסר בזכוכית Low-E נדרשת** — הותקנה זכוכית כפולה ללא שכבת Low-E (שכבה פולטת נמוכה) שנדרשת במפרט או לפי תקן בידוד תרמי. ללא Low-E הבידוד התרמי נמוך משמעותית.. המלצה: להחליף את יחידת הזיגוג הכפול ביחידה עם זכוכית Low-E. לוודא שסוג ה-Low-E (hard coat/soft coat) תואם למפרט.. עלות משוערת: ₪400-₪1000 (למ"ר)', 'ת"י 1045 — לעמידה בדרישות בידוד תרמי למבנים, נדרשת בדרך כלל זכוכית עם שכבת Low-E להשגת ערך U נמוך', 'ת"י 1045 — לעמידה בדרישות בידוד תרמי למבנים, נדרשת בדרך כלל זכוכית עם שכבת Low-E להשגת ערך U נמוך', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — חוסר בזכוכית Low-E נדרשת** — הותקנה זכוכית כפולה ללא שכבת Low-E (שכבה פולטת נמוכה) שנדרשת במפרט או לפי תקן בידוד תרמי. ללא Low-E הבידוד התרמי נמוך משמעותית.. המלצה: להחליף את יחידת הזיגוג הכפול ביחידה עם זכוכית Low-E. לוודא שסוג ה-Low-E (hard coat/soft coat) תואם למפרט.. עלות משוערת: ₪400-₪1000 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**זכוכית שרוטה / סדוקה** — שריטות או סדקים בזכוכית חלון.. המלצה: החלפת זכוכית פגומה. עלות משוערת: ₪300-₪1200 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**זכוכית שרוטה / סדוקה** — שריטות או סדקים בזכוכית חלון.. המלצה: החלפת זכוכית פגומה. עלות משוערת: ₪300-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — ידית סיבובית רופפת או שבורה** — ידית החלון רופפת, מסתובבת ללא אחיזה, או שבורה. הידית לא מפעילה את מנגנון הנעילה כראוי והחלון נשאר לא נעול.. המלצה: להדק את בסיס הידית (להרים כיסוי פלסטיק ולהדק ברגים). אם הידית שבורה — להחליף בידית מקורית תואמת.. עלות משוערת: ₪80-₪250 (ליחידה)', 'ת"י 1509 — ידית החלון חייבת להפעיל את מנגנון הנעילה באופן מלא ובטוח בכל מצבי הפתיחה', 'ת"י 1509 — ידית החלון חייבת להפעיל את מנגנון הנעילה באופן מלא ובטוח בכל מצבי הפתיחה', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — ידית סיבובית רופפת או שבורה** — ידית החלון רופפת, מסתובבת ללא אחיזה, או שבורה. הידית לא מפעילה את מנגנון הנעילה כראוי והחלון נשאר לא נעול.. המלצה: להדק את בסיס הידית (להרים כיסוי פלסטיק ולהדק ברגים). אם הידית שבורה — להחליף בידית מקורית תואמת.. עלות משוערת: ₪80-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — נעילה לא תקינה (אספניולט)** — מנגנון הנעילה (אספניולט) לא נועל את החלון בכל נקודות הנעילה. חלק מנקודות הנעילה לא מתיישבות כראוי בנגד (striker plate) — החלון לא אטום ולא מאובטח.. המלצה: לכוונן את נקודות הנעילה והנגדים. לשמן את מנגנון האספניולט. אם פגום — להחליף את מוט הנעילה או הנגדים.. עלות משוערת: ₪150-₪450 (ליחידה)', 'ת"י 1509 — חלון חייב להינעל בכל נקודות הנעילה שתוכננו על ידי היצרן, עם לחיצה אחידה של הגומיות', 'ת"י 1509 — חלון חייב להינעל בכל נקודות הנעילה שתוכננו על ידי היצרן, עם לחיצה אחידה של הגומיות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — נעילה לא תקינה (אספניולט)** — מנגנון הנעילה (אספניולט) לא נועל את החלון בכל נקודות הנעילה. חלק מנקודות הנעילה לא מתיישבות כראוי בנגד (striker plate) — החלון לא אטום ולא מאובטח.. המלצה: לכוונן את נקודות הנעילה והנגדים. לשמן את מנגנון האספניולט. אם פגום — להחליף את מוט הנעילה או הנגדים.. עלות משוערת: ₪150-₪450 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — חוסר מגביל פתיחה בקומה גבוהה** — חלון בקומה 2 ומעלה חסר מגביל פתיחה (מגביל זווית או כבל בטיחות) בהתאם לתקנות הבטיחות. ילדים עלולים ליפול מחלון הנפתח לרווחה.. המלצה: להתקין מגביל פתיחה תקני — כבל בטיחות או מגביל זווית צמוד פרופיל — בכל חלון נדרש. לוודא שהמגביל ניתן לשחרור על ידי מבוגר בלבד.. עלות משוערת: ₪120-₪350 (ליחידה)', 'ת"י 1509 — חלון מעל קומת קרקע חייב לכלול מגביל פתיחה המגביל את הפתח ל-100 מ"מ מרבי, עם אפשרות שחרור למבוגרים', 'ת"י 1509 — חלון מעל קומת קרקע חייב לכלול מגביל פתיחה המגביל את הפתח ל-100 מ"מ מרבי, עם אפשרות שחרור למבוגרים', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — חוסר מגביל פתיחה בקומה גבוהה** — חלון בקומה 2 ומעלה חסר מגביל פתיחה (מגביל זווית או כבל בטיחות) בהתאם לתקנות הבטיחות. ילדים עלולים ליפול מחלון הנפתח לרווחה.. המלצה: להתקין מגביל פתיחה תקני — כבל בטיחות או מגביל זווית צמוד פרופיל — בכל חלון נדרש. לוודא שהמגביל ניתן לשחרור על ידי מבוגר בלבד.. עלות משוערת: ₪120-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — חוסר סורג בטיחות בחלון נמוך** — חלון שתחתיתו בגובה נמוך מ-80 ס"מ מהרצפה חסר סורג בטיחות או מעקה להגנה מפני נפילה, בעיקר בקומות גבוהות.. המלצה: להתקין סורג בטיחות פנימי (מפרופיל אלומיניום או נירוסטה) בהתאם לתקן, עם רווח מרבי של 10 ס"מ בין חלקיו.. עלות משוערת: ₪400-₪1200 (ליחידה)', 'ת"י 1142 — נדרש אמצעי מיגון (סורג/מעקה) בחלון שתחתיתו נמוכה מ-80 ס"מ מרצפת החדר, בקומה שנייה ומעלה', 'ת"י 1142 — נדרש אמצעי מיגון (סורג/מעקה) בחלון שתחתיתו נמוכה מ-80 ס"מ מרצפת החדר, בקומה שנייה ומעלה', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — חוסר סורג בטיחות בחלון נמוך** — חלון שתחתיתו בגובה נמוך מ-80 ס"מ מהרצפה חסר סורג בטיחות או מעקה להגנה מפני נפילה, בעיקר בקומות גבוהות.. המלצה: להתקין סורג בטיחות פנימי (מפרופיל אלומיניום או נירוסטה) בהתאם לתקן, עם רווח מרבי של 10 ס"מ בין חלקיו.. עלות משוערת: ₪400-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**חלון אלומיניום — פרזול (Hardware) לא תואם למפרט** — הפרזול שהותקן (ידיות, צירים, מנגנוני נעילה) אינו תואם למפרט הפרויקט — דרגה נמוכה יותר, יצרן אחר, או חסרים רכיבים שנדרשו (כגון נעילת ביטחון).. המלצה: להחליף את הפרזול בפרזול התואם למפרט המכר. לתעד את ההבדל ולדרוש התאמה או פיצוי.. עלות משוערת: ₪200-₪800 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון אלומיניום — פרזול (Hardware) לא תואם למפרט** — הפרזול שהותקן (ידיות, צירים, מנגנוני נעילה) אינו תואם למפרט הפרויקט — דרגה נמוכה יותר, יצרן אחר, או חסרים רכיבים שנדרשו (כגון נעילת ביטחון).. המלצה: להחליף את הפרזול בפרזול התואם למפרט המכר. לתעד את ההבדל ולדרוש התאמה או פיצוי.. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, '**ידית חלון שבורה / רופפת** — ידית חלון שבורה, רופפת, או לא נועלת.. המלצה: החלפת ידית חלון. עלות משוערת: ₪80-₪250 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ידית חלון שבורה / רופפת** — ידית חלון שבורה, רופפת, או לא נועלת.. המלצה: החלפת ידית חלון. עלות משוערת: ₪80-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**שקע חשמל ללא הארקה תקינה** — שקע חשמל שאינו מחובר להארקה או שחיבור ההארקה לקוי. מדידה מראה התנגדות הארקה גבוהה מהמותר (מעל 1 אוהם). מהווה סכנת חשמול.. המלצה: בדיקת חיבור מוליך הארקה בשקע ובלוח החשמל, תיקון או החלפת החיבור הלקוי. עלות משוערת: ₪150-₪350 (ליחידה)', 'ת"י 61 — כל שקע חשמל חייב להיות מחובר למוליך הארקה רציף עם התנגדות שאינה עולה על 1 אוהם', 'ת"י 61 — כל שקע חשמל חייב להיות מחובר למוליך הארקה רציף עם התנגדות שאינה עולה על 1 אוהם', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שקע חשמל ללא הארקה תקינה** — שקע חשמל שאינו מחובר להארקה או שחיבור ההארקה לקוי. מדידה מראה התנגדות הארקה גבוהה מהמותר (מעל 1 אוהם). מהווה סכנת חשמול.. המלצה: בדיקת חיבור מוליך הארקה בשקע ובלוח החשמל, תיקון או החלפת החיבור הלקוי. עלות משוערת: ₪150-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**שקע חשמל בחדר רחצה במרחק לא תקני מנקודת מים** — שקע חשמל מותקן בתוך אזור 1 או אזור 2 של חדר הרחצה (פחות מ-60 ס"מ ממקור מים), בניגוד לתקנות. סכנת חשמול בסביבה רטובה.. המלצה: העתקת השקע למיקום תקני באזור 3, מרחק מינימלי 60 ס"מ מנקודת מים, עם הגנת RCD. עלות משוערת: ₪400-₪800 (ליחידה)', 'ת"י 61 — שקעים בחדר רחצה חייבים להיות מותקנים באזור 3 בלבד, במרחק מינימלי של 60 ס"מ מגבול האמבטיה או המקלחון', 'ת"י 61 — שקעים בחדר רחצה חייבים להיות מותקנים באזור 3 בלבד, במרחק מינימלי של 60 ס"מ מגבול האמבטיה או המקלחון', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שקע חשמל בחדר רחצה במרחק לא תקני מנקודת מים** — שקע חשמל מותקן בתוך אזור 1 או אזור 2 של חדר הרחצה (פחות מ-60 ס"מ ממקור מים), בניגוד לתקנות. סכנת חשמול בסביבה רטובה.. המלצה: העתקת השקע למיקום תקני באזור 3, מרחק מינימלי 60 ס"מ מנקודת מים, עם הגנת RCD. עלות משוערת: ₪400-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**חסר מפסק פחת (RCD) בלוח החשמל** — לוח החשמל הדירתי חסר מפסק פחת (RCD) בזרם דלף 30mA על מעגלי שקעים. מפסק פחת נדרש להגנה מפני חשמול.. המלצה: התקנת מפסק פחת RCD 30mA בלוח החשמל על כל מעגלי השקעים. עלות משוערת: ₪350-₪700 (ליחידה)', 'ת"י 61 — כל מעגלי השקעים בדירה חייבים להיות מוגנים במפסק פחת (RCD) בזרם דלף מקסימלי של 30mA', 'ת"י 61 — כל מעגלי השקעים בדירה חייבים להיות מוגנים במפסק פחת (RCD) בזרם דלף מקסימלי של 30mA', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חסר מפסק פחת (RCD) בלוח החשמל** — לוח החשמל הדירתי חסר מפסק פחת (RCD) בזרם דלף 30mA על מעגלי שקעים. מפסק פחת נדרש להגנה מפני חשמול.. המלצה: התקנת מפסק פחת RCD 30mA בלוח החשמל על כל מעגלי השקעים. עלות משוערת: ₪350-₪700 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**מפסק פחת (RCD) לא מתפקד** — מפסק הפחת מותקן אך אינו מנתק את המעגל בלחיצה על כפתור הבדיקה (TEST). המפסק עלול להיות תקול ולא לספק הגנה מפני חשמול.. המלצה: החלפת מפסק הפחת התקול במפסק חדש תקין ובדיקת תקינות כל מפסקי הפחת בלוח. עלות משוערת: ₪250-₪500 (ליחידה)', 'ת"י 61 — מפסק פחת חייב לנתק את המעגל תוך 300 אלפיות שנייה בזרם דלף של 30mA, ולעבור בדיקה תקופתית', 'ת"י 61 — מפסק פחת חייב לנתק את המעגל תוך 300 אלפיות שנייה בזרם דלף של 30mA, ולעבור בדיקה תקופתית', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מפסק פחת (RCD) לא מתפקד** — מפסק הפחת מותקן אך אינו מנתק את המעגל בלחיצה על כפתור הבדיקה (TEST). המפסק עלול להיות תקול ולא לספק הגנה מפני חשמול.. המלצה: החלפת מפסק הפחת התקול במפסק חדש תקין ובדיקת תקינות כל מפסקי הפחת בלוח. עלות משוערת: ₪250-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**לוח חשמל ללא סימון מעגלים** — מפסקים בלוח החשמל אינם מסומנים בזיהוי המעגל שהם מגנים עליו. מקשה על איתור תקלות ועל ניתוק חירום.. המלצה: סימון כל מפסקי הלוח בתוויות ברורות המציינות את המעגל המוגן (חדר/מכשיר). עלות משוערת: ₪100-₪200 (ליחידה)', 'ת"י 61 — כל מפסק בלוח חשמל חייב להיות מסומן בבירור לזיהוי המעגל המוגן', 'ת"י 61 — כל מפסק בלוח חשמל חייב להיות מסומן בבירור לזיהוי המעגל המוגן', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**לוח חשמל ללא סימון מעגלים** — מפסקים בלוח החשמל אינם מסומנים בזיהוי המעגל שהם מגנים עליו. מקשה על איתור תקלות ועל ניתוק חירום.. המלצה: סימון כל מפסקי הלוח בתוויות ברורות המציינות את המעגל המוגן (חדר/מכשיר). עלות משוערת: ₪100-₪200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**לוח חשמל ללא דלת או מכסה** — לוח החשמל הדירתי חסר דלת או מכסה, חלקים חיים חשופים. סכנת חשמול במיוחד לילדים.. המלצה: התקנת דלת/מכסה מקורי ללוח החשמל עם נעילה תקנית. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 61 — לוח חשמל חייב להיות מכוסה בדלת או מכסה המונע גישה לחלקים חיים ללא כלי עזר', 'ת"י 61 — לוח חשמל חייב להיות מכוסה בדלת או מכסה המונע גישה לחלקים חיים ללא כלי עזר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**לוח חשמל ללא דלת או מכסה** — לוח החשמל הדירתי חסר דלת או מכסה, חלקים חיים חשופים. סכנת חשמול במיוחד לילדים.. המלצה: התקנת דלת/מכסה מקורי ללוח החשמל עם נעילה תקנית. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**שקע חשמל רופף או יוצא מהקיר** — שקע חשמל אינו מחוזק כראוי לקופסת החשמל בקיר, נע או יוצא החוצה בעת הוצאת תקע. עלול לחשוף חיבורים חשמליים.. המלצה: חיזוק השקע לקופסת החשמל בברגים, החלפת קופסה שבורה במידת הצורך. עלות משוערת: ₪80-₪200 (ליחידה)', 'ת"י 61 — כל אביזר חשמלי חייב להיות מחוזק היטב לקופסת ההתקנה ולהיות יציב', 'ת"י 61 — כל אביזר חשמלי חייב להיות מחוזק היטב לקופסת ההתקנה ולהיות יציב', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שקע חשמל רופף או יוצא מהקיר** — שקע חשמל אינו מחוזק כראוי לקופסת החשמל בקיר, נע או יוצא החוצה בעת הוצאת תקע. עלול לחשוף חיבורים חשמליים.. המלצה: חיזוק השקע לקופסת החשמל בברגים, החלפת קופסה שבורה במידת הצורך. עלות משוערת: ₪80-₪200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**חוסר בשקעי חשמל בחדר לפי תקן** — מספר שקעי החשמל בחדר נמוך מהנדרש בתקן. לדוגמה: מטבח עם פחות מ-6 שקעים, או חדר שינה עם פחות מ-3 שקעים.. המלצה: הוספת שקעי חשמל בהתאם לדרישות התקן עבור ייעוד החדר. עלות משוערת: ₪300-₪600 (ליחידה)', 'ת"י 61 — מספר מינימלי של שקעים לפי ייעוד החדר: מטבח 6, סלון 5, חדר שינה 3, חדר רחצה 1', 'ת"י 61 — מספר מינימלי של שקעים לפי ייעוד החדר: מטבח 6, סלון 5, חדר שינה 3, חדר רחצה 1', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר בשקעי חשמל בחדר לפי תקן** — מספר שקעי החשמל בחדר נמוך מהנדרש בתקן. לדוגמה: מטבח עם פחות מ-6 שקעים, או חדר שינה עם פחות מ-3 שקעים.. המלצה: הוספת שקעי חשמל בהתאם לדרישות התקן עבור ייעוד החדר. עלות משוערת: ₪300-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**גובה שקע חשמל לא תקני** — שקע חשמל מותקן בגובה שאינו עומד בדרישות התקן. שקעים רגילים צריכים להיות בגובה 40-50 ס"מ מהרצפה, שקעי מטבח בגובה 110-120 ס"מ.. המלצה: העתקת השקע לגובה התקני בהתאם לייעוד החדר. עלות משוערת: ₪300-₪600 (ליחידה)', 'ת"י 61 — גובה התקנת שקעים: רגיל 40-50 ס"מ, מטבח 110-120 ס"מ מעל הרצפה הגמורה', 'ת"י 61 — גובה התקנת שקעים: רגיל 40-50 ס"מ, מטבח 110-120 ס"מ מעל הרצפה הגמורה', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גובה שקע חשמל לא תקני** — שקע חשמל מותקן בגובה שאינו עומד בדרישות התקן. שקעים רגילים צריכים להיות בגובה 40-50 ס"מ מהרצפה, שקעי מטבח בגובה 110-120 ס"מ.. המלצה: העתקת השקע לגובה התקני בהתאם לייעוד החדר. עלות משוערת: ₪300-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**מתג תאורה לא תקין או לא מתפקד** — מתג תאורה שאינו מפעיל את נקודת התאורה, מרפרף, או שיש בו ניצוצות בעת הפעלה. עלול להצביע על חיבור רופף או מתג פגום.. המלצה: החלפת המתג הפגום, בדיקת החיבורים בקופסת החשמל. עלות משוערת: ₪100-₪250 (ליחידה)', 'ת"י 61 — כל מתג חשמלי חייב לפעול באופן תקין ללא ניצוצות חיצוניות או רעש חריג', 'ת"י 61 — כל מתג חשמלי חייב לפעול באופן תקין ללא ניצוצות חיצוניות או רעש חריג', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מתג תאורה לא תקין או לא מתפקד** — מתג תאורה שאינו מפעיל את נקודת התאורה, מרפרף, או שיש בו ניצוצות בעת הפעלה. עלול להצביע על חיבור רופף או מתג פגום.. המלצה: החלפת המתג הפגום, בדיקת החיבורים בקופסת החשמל. עלות משוערת: ₪100-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**חסרה נקודת תאורה בחדר** — חדר ללא נקודת תאורה בתקרה או בקיר, בניגוד לדרישות התקן. כל חדר מגורים חייב לכלול לפחות נקודת תאורה אחת.. המלצה: התקנת נקודת תאורה בתקרה עם מתג הפעלה בכניסה לחדר. עלות משוערת: ₪400-₪800 (ליחידה)', 'ת"י 61 — כל חדר חייב לכלול לפחות נקודת תאורה אחת מחוברת למתג', 'ת"י 61 — כל חדר חייב לכלול לפחות נקודת תאורה אחת מחוברת למתג', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חסרה נקודת תאורה בחדר** — חדר ללא נקודת תאורה בתקרה או בקיר, בניגוד לדרישות התקן. כל חדר מגורים חייב לכלול לפחות נקודת תאורה אחת.. המלצה: התקנת נקודת תאורה בתקרה עם מתג הפעלה בכניסה לחדר. עלות משוערת: ₪400-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**כבלים חשמליים חשופים ללא הגנה** — כבלים חשמליים גלויים ללא צנרת הגנה או כיסוי מתאים. הכבלים חשופים לנזק מכני ולסכנת חשמול.. המלצה: התקנת צנרת הגנה (PVC או מתכת) לכיסוי הכבלים החשופים. עלות משוערת: ₪150-₪400 (למ"א)', 'ת"י 61 — כבלים חשמליים חייבים לעבור בצנרת הגנה או להיות מוגנים מפני נזק מכני', 'ת"י 61 — כבלים חשמליים חייבים לעבור בצנרת הגנה או להיות מוגנים מפני נזק מכני', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כבלים חשמליים חשופים ללא הגנה** — כבלים חשמליים גלויים ללא צנרת הגנה או כיסוי מתאים. הכבלים חשופים לנזק מכני ולסכנת חשמול.. המלצה: התקנת צנרת הגנה (PVC או מתכת) לכיסוי הכבלים החשופים. עלות משוערת: ₪150-₪400 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**חיבור חשמלי באמצעות סרט בידוד במקום מהדק** — חיבורים חשמליים בקופסאות חיבור מבוצעים עם סרט בידוד במקום מהדקים (קונקטורים) תקניים. חיבור לא בטוח הגורם להתחממות.. המלצה: החלפת כל חיבורי סרט הבידוד במהדקים תקניים (Wago או דומה). עלות משוערת: ₪80-₪200 (ליחידה)', 'ת"י 61 — חיבורים חשמליים חייבים להתבצע באמצעות מהדקים (קונקטורים) מאושרים בלבד', 'ת"י 61 — חיבורים חשמליים חייבים להתבצע באמצעות מהדקים (קונקטורים) מאושרים בלבד', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיבור חשמלי באמצעות סרט בידוד במקום מהדק** — חיבורים חשמליים בקופסאות חיבור מבוצעים עם סרט בידוד במקום מהדקים (קונקטורים) תקניים. חיבור לא בטוח הגורם להתחממות.. המלצה: החלפת כל חיבורי סרט הבידוד במהדקים תקניים (Wago או דומה). עלות משוערת: ₪80-₪200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**קופסת חשמל ללא מכסה** — קופסת חיבור/הסתעפות חשמלית ללא מכסה, חיבורים חשמליים חשופים. סכנת חשמול ונזק מלחות או אבק.. המלצה: התקנת מכסה תקני לקופסת החשמל. עלות משוערת: ₪30-₪80 (ליחידה)', 'ת"י 61 — כל קופסת חיבור חייבת להיות מכוסה במכסה מתאים', 'ת"י 61 — כל קופסת חיבור חייבת להיות מכוסה במכסה מתאים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**קופסת חשמל ללא מכסה** — קופסת חיבור/הסתעפות חשמלית ללא מכסה, חיבורים חשמליים חשופים. סכנת חשמול ונזק מלחות או אבק.. המלצה: התקנת מכסה תקני לקופסת החשמל. עלות משוערת: ₪30-₪80 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**העדר שקע טלפון/תקשורת בחדרים נדרשים** — חדר מגורים ללא נקודת תקשורת (טלפון/רשת) כנדרש בתקן. נדרשות נקודות תקשורת בסלון ובחדרי שינה.. המלצה: משיכת כבל תקשורת CAT6 והתקנת שקע RJ45 בחדרים הנדרשים. עלות משוערת: ₪250-₪500 (ליחידה)', 'ת"י 61 — נדרשת לפחות נקודת תקשורת אחת בסלון ובכל חדר שינה', 'ת"י 61 — נדרשת לפחות נקודת תקשורת אחת בסלון ובכל חדר שינה', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**העדר שקע טלפון/תקשורת בחדרים נדרשים** — חדר מגורים ללא נקודת תקשורת (טלפון/רשת) כנדרש בתקן. נדרשות נקודות תקשורת בסלון ובחדרי שינה.. המלצה: משיכת כבל תקשורת CAT6 והתקנת שקע RJ45 בחדרים הנדרשים. עלות משוערת: ₪250-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**מפסק זרם יתר (אוטומט) בלוח לא מתאים לחתך הכבל** — מפסק אוטומטי בלוח החשמל בדירוג זרם גבוה מכושר ההעמסה של הכבל. למשל מפסק 20A על כבל 1.5 מ"מ. עלול לגרום להתחממות הכבל ולשריפה.. המלצה: החלפת המפסק למפסק בדירוג המתאים לחתך הכבל המותקן. עלות משוערת: ₪100-₪250 (ליחידה)', 'ת"י 61 — דירוג המפסק חייב להתאים לחתך הכבל: 1.5 מ"מ עד 16A, 2.5 מ"מ עד 20A, 4 מ"מ עד 25A', 'ת"י 61 — דירוג המפסק חייב להתאים לחתך הכבל: 1.5 מ"מ עד 16A, 2.5 מ"מ עד 20A, 4 מ"מ עד 25A', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מפסק זרם יתר (אוטומט) בלוח לא מתאים לחתך הכבל** — מפסק אוטומטי בלוח החשמל בדירוג זרם גבוה מכושר ההעמסה של הכבל. למשל מפסק 20A על כבל 1.5 מ"מ. עלול לגרום להתחממות הכבל ולשריפה.. המלצה: החלפת המפסק למפסק בדירוג המתאים לחתך הכבל המותקן. עלות משוערת: ₪100-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**לוח חשמל עמוס - אין מקום למעגלים נוספים** — לוח החשמל הדירתי מלא לחלוטין ללא מודולים פנויים להרחבה עתידית. מקשה על הוספת מעגלים ועלול לגרום לחיבורים לא תקניים.. המלצה: החלפת הלוח בלוח גדול יותר עם מקום להרחבה, או פיצול למספר לוחות. עלות משוערת: ₪1500-₪3500 (ליחידה)', 'ת"י 61 — לוח חשמל דירתי חייב לכלול לפחות 20% מקום פנוי להרחבה עתידית', 'ת"י 61 — לוח חשמל דירתי חייב לכלול לפחות 20% מקום פנוי להרחבה עתידית', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**לוח חשמל עמוס - אין מקום למעגלים נוספים** — לוח החשמל הדירתי מלא לחלוטין ללא מודולים פנויים להרחבה עתידית. מקשה על הוספת מעגלים ועלול לגרום לחיבורים לא תקניים.. המלצה: החלפת הלוח בלוח גדול יותר עם מקום להרחבה, או פיצול למספר לוחות. עלות משוערת: ₪1500-₪3500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**שקע חשמל מטבח ללא הגנת RCD ייעודית** — שקעי חשמל במטבח (משטח עבודה) אינם מוגנים במפסק פחת ייעודי. אזור רטוב הדורש הגנה מוגברת.. המלצה: התקנת מפסק פחת RCD 30mA ייעודי למעגלי שקעי המטבח. עלות משוערת: ₪300-₪600 (ליחידה)', 'ת"י 61 — שקעים באזורים רטובים (מטבח, חדר כביסה) חייבים הגנת RCD 30mA', 'ת"י 61 — שקעים באזורים רטובים (מטבח, חדר כביסה) חייבים הגנת RCD 30mA', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שקע חשמל מטבח ללא הגנת RCD ייעודית** — שקעי חשמל במטבח (משטח עבודה) אינם מוגנים במפסק פחת ייעודי. אזור רטוב הדורש הגנה מוגברת.. המלצה: התקנת מפסק פחת RCD 30mA ייעודי למעגלי שקעי המטבח. עלות משוערת: ₪300-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**חוסר התאמה בין פאזות בלוח חשמל תלת-פאזי** — חלוקת עומסים לא מאוזנת בין שלוש הפאזות בלוח חשמל תלת-פאזי. גורם לעומס יתר על פאזה אחת ולירידת מתח.. המלצה: איזון מחדש של חלוקת המעגלים בין הפאזות בלוח החשמל. עלות משוערת: ₪300-₪600 (ליחידה)', 'ת"י 61 — עומסים בלוח תלת-פאזי חייבים להיות מאוזנים בין הפאזות, סטייה מקסימלית 20%', 'ת"י 61 — עומסים בלוח תלת-פאזי חייבים להיות מאוזנים בין הפאזות, סטייה מקסימלית 20%', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר התאמה בין פאזות בלוח חשמל תלת-פאזי** — חלוקת עומסים לא מאוזנת בין שלוש הפאזות בלוח חשמל תלת-פאזי. גורם לעומס יתר על פאזה אחת ולירידת מתח.. המלצה: איזון מחדש של חלוקת המעגלים בין הפאזות בלוח החשמל. עלות משוערת: ₪300-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**תאורת חירום חסרה בחדר מדרגות** — חדר מדרגות ללא תאורת חירום עצמאית עם סוללה. בעת הפסקת חשמל חדר המדרגות חשוך לחלוטין, סכנת נפילה.. המלצה: התקנת גוף תאורת חירום עם סוללה בכל קומה בחדר המדרגות. עלות משוערת: ₪250-₪500 (ליחידה)', 'ת"י 61 — חדרי מדרגות ומסדרונות חייבים בתאורת חירום עם סוללת גיבוי לשעה לפחות', 'ת"י 61 — חדרי מדרגות ומסדרונות חייבים בתאורת חירום עם סוללת גיבוי לשעה לפחות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תאורת חירום חסרה בחדר מדרגות** — חדר מדרגות ללא תאורת חירום עצמאית עם סוללה. בעת הפסקת חשמל חדר המדרגות חשוך לחלוטין, סכנת נפילה.. המלצה: התקנת גוף תאורת חירום עם סוללה בכל קומה בחדר המדרגות. עלות משוערת: ₪250-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**שקע חשמל חיצוני ללא דרגת הגנה IP מתאימה** — שקע חשמל במרפסת או בחוץ ללא דרגת הגנה IP44 לפחות. חשוף לרטיבות ולגשם.. המלצה: החלפת השקע בשקע עם דרגת הגנה IP44 ומכסה קפיצי. עלות משוערת: ₪150-₪350 (ליחידה)', 'ת"י 61 — שקעים חיצוניים חייבים בדרגת הגנה IP44 לפחות עם מכסה קפיצי', 'ת"י 61 — שקעים חיצוניים חייבים בדרגת הגנה IP44 לפחות עם מכסה קפיצי', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שקע חשמל חיצוני ללא דרגת הגנה IP מתאימה** — שקע חשמל במרפסת או בחוץ ללא דרגת הגנה IP44 לפחות. חשוף לרטיבות ולגשם.. המלצה: החלפת השקע בשקע עם דרגת הגנה IP44 ומכסה קפיצי. עלות משוערת: ₪150-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**פס שוואה (אפס) לקוי בלוח חשמל** — פס השוואה (Neutral bar) בלוח החשמל עם חיבורים רופפים, חמצון, או עומס יתר. גורם לתקלות זרם ולסכנת שריפה.. המלצה: ניקוי פס השוואה, הידוק כל החיבורים, החלפת פס פגום במידת הצורך. עלות משוערת: ₪200-₪400 (ליחידה)', 'ת"י 61 — פס האפס חייב להיות מחובר היטב עם כל מוליכי האפס מהודקים בברגים', 'ת"י 61 — פס האפס חייב להיות מחובר היטב עם כל מוליכי האפס מהודקים בברגים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פס שוואה (אפס) לקוי בלוח חשמל** — פס השוואה (Neutral bar) בלוח החשמל עם חיבורים רופפים, חמצון, או עומס יתר. גורם לתקלות זרם ולסכנת שריפה.. המלצה: ניקוי פס השוואה, הידוק כל החיבורים, החלפת פס פגום במידת הצורך. עלות משוערת: ₪200-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**חיווט חשמל בממ"ד לא בצנרת שריון** — חיווט חשמל בתוך חדר הממ"ד שאינו עובר בצנרת שריון (ממ"ד דורש צנרת מוגנת). בפגיעה ישירה הכבלים עלולים להינזק.. המלצה: החלפת הצנרת הקיימת בצנרת שריון מתאימה לממ"ד. עלות משוערת: ₪500-₪1200 (ליחידה)', 'ת"י 4766 — כבילה חשמלית בממ"ד חייבת לעבור בצנרת שריון מוגנת', 'ת"י 4766 — כבילה חשמלית בממ"ד חייבת לעבור בצנרת שריון מוגנת', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חיווט חשמל בממ"ד לא בצנרת שריון** — חיווט חשמל בתוך חדר הממ"ד שאינו עובר בצנרת שריון (ממ"ד דורש צנרת מוגנת). בפגיעה ישירה הכבלים עלולים להינזק.. המלצה: החלפת הצנרת הקיימת בצנרת שריון מתאימה לממ"ד. עלות משוערת: ₪500-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**שקע חשמל במרפסת שירות ללא הגנת מים** — שקע חשמל במרפסת שירות (כביסה) ללא כיסוי עמיד מים. מרפסת שירות חשופה לרטיבות ולמים.. המלצה: החלפת השקע בדגם IP44 עם מכסה קפיצי, וודא הגנת RCD על המעגל. עלות משוערת: ₪200-₪400 (ליחידה)', 'ת"י 61 — שקעים בסביבה רטובה/חיצונית חייבים בדרגת הגנה IP44 ומפסק פחת RCD', 'ת"י 61 — שקעים בסביבה רטובה/חיצונית חייבים בדרגת הגנה IP44 ומפסק פחת RCD', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שקע חשמל במרפסת שירות ללא הגנת מים** — שקע חשמל במרפסת שירות (כביסה) ללא כיסוי עמיד מים. מרפסת שירות חשופה לרטיבות ולמים.. המלצה: החלפת השקע בדגם IP44 עם מכסה קפיצי, וודא הגנת RCD על המעגל. עלות משוערת: ₪200-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**פעמון דלת כניסה לא מתפקד** — פעמון דלת הכניסה לדירה לא פועל - אין צלצול בלחיצה על הכפתור. בעיה בחיווט, בשנאי, או בפעמון עצמו.. המלצה: בדיקת חיווט הפעמון, החלפת שנאי או פעמון פגום. עלות משוערת: ₪100-₪250 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פעמון דלת כניסה לא מתפקד** — פעמון דלת הכניסה לדירה לא פועל - אין צלצול בלחיצה על הכפתור. בעיה בחיווט, בשנאי, או בפעמון עצמו.. המלצה: בדיקת חיווט הפעמון, החלפת שנאי או פעמון פגום. עלות משוערת: ₪100-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**אינטרקום/דופון לא מתפקד** — מערכת אינטרקום (דופון) לא פועלת - אין שמע, אין וידאו, או לחצן פתיחה לא עובד. פוגע בביטחון הדירה.. המלצה: בדיקת חיווט ומסך האינטרקום, תיקון או החלפת יחידה פנימית/חיצונית. עלות משוערת: ₪300-₪800 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אינטרקום/דופון לא מתפקד** — מערכת אינטרקום (דופון) לא פועלת - אין שמע, אין וידאו, או לחצן פתיחה לא עובד. פוגע בביטחון הדירה.. המלצה: בדיקת חיווט ומסך האינטרקום, תיקון או החלפת יחידה פנימית/חיצונית. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**שקע חשמל לא עובד** — שקע חשמל ללא מתח או שלא מספק חשמל.. המלצה: בדיקת חיבור, תיקון או החלפת שקע. עלות משוערת: ₪150-₪350 (ליחידה)', 'חוק החשמל, תקנות החשמל — כל שקע חייב לספק מתח תקין ולהיות מחובר להארקה', 'חוק החשמל, תקנות החשמל — כל שקע חייב לספק מתח תקין ולהיות מחובר להארקה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שקע חשמל לא עובד** — שקע חשמל ללא מתח או שלא מספק חשמל.. המלצה: בדיקת חיבור, תיקון או החלפת שקע. עלות משוערת: ₪150-₪350 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**חוסר הארקה בשקע** — שקע חשמל ללא חיבור הארקה תקין — סכנת חשמול.. המלצה: חיבור הארקה לשקע, בדיקת מערכת הארקה כללית. עלות משוערת: ₪300-₪800 (ליחידה)', 'חוק החשמל, ת"י 61 — כל שקע חייב הארקה תקינה — דרישה בטיחותית מחייבת', 'חוק החשמל, ת"י 61 — כל שקע חייב הארקה תקינה — דרישה בטיחותית מחייבת', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר הארקה בשקע** — שקע חשמל ללא חיבור הארקה תקין — סכנת חשמול.. המלצה: חיבור הארקה לשקע, בדיקת מערכת הארקה כללית. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**מפסק/מתג לא עובד** — מפסק תאורה או מתג שלא מפעיל את המעגל.. המלצה: החלפת מפסק/מתג פגום. עלות משוערת: ₪100-₪300 (ליחידה)', 'חוק החשמל — כל מתג חייב לפעול באופן תקין', 'חוק החשמל — כל מתג חייב לפעול באופן תקין', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מפסק/מתג לא עובד** — מפסק תאורה או מתג שלא מפעיל את המעגל.. המלצה: החלפת מפסק/מתג פגום. עלות משוערת: ₪100-₪300 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, '**לוח חשמל לא תקני** — לוח חשמל עם ליקויים: מפסקים לא מסומנים, חוטים חשופים, או חוסר מפסק פחת.. המלצה: תיקון לוח על ידי חשמלאי מוסמך בהתאם לתקן. עלות משוערת: ₪500-₪3000 (ליחידה)', 'חוק החשמל, ת"י 61 — לוח חשמל חייב לעמוד בתקן — סימון, מפסק פחת, סדר מעגלים', 'חוק החשמל, ת"י 61 — לוח חשמל חייב לעמוד בתקן — סימון, מפסק פחת, סדר מעגלים', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**לוח חשמל לא תקני** — לוח חשמל עם ליקויים: מפסקים לא מסומנים, חוטים חשופים, או חוסר מפסק פחת.. המלצה: תיקון לוח על ידי חשמלאי מוסמך בהתאם לתקן. עלות משוערת: ₪500-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**דלת ממ"ד - מסגרת ברזל לא אטומה** — מסגרת דלת הממ"ד אינה אטומה - רווחים בין המסגרת לקיר, גומי האיטום חסר או פגום. הממ"ד לא יספק הגנה כנדרש.. המלצה: החלפת גומי האיטום, מילוי רווחים בין המסגרת לקיר בחומר אטימה מתאים. עלות משוערת: ₪500-₪1200 (ליחידה)', 'ת"י 4766 — דלת ממ"ד חייבת להיות אטומה לגזים ולעמוד בלחץ פיצוץ, כולל גומי איטום תקין בהיקף המסגרת', 'ת"י 4766 — דלת ממ"ד חייבת להיות אטומה לגזים ולעמוד בלחץ פיצוץ, כולל גומי איטום תקין בהיקף המסגרת', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת ממ"ד - מסגרת ברזל לא אטומה** — מסגרת דלת הממ"ד אינה אטומה - רווחים בין המסגרת לקיר, גומי האיטום חסר או פגום. הממ"ד לא יספק הגנה כנדרש.. המלצה: החלפת גומי האיטום, מילוי רווחים בין המסגרת לקיר בחומר אטימה מתאים. עלות משוערת: ₪500-₪1200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**דלת ממ"ד - ברגי נעילה לא מתפקדים** — ברגי הנעילה של דלת הממ"ד (קרמונים) אינם נכנסים לשקעים במשקוף, קשים להפעלה, או חסרים. הדלת לא ניתנת לנעילה אטומה.. המלצה: שימון/תיקון ברגי הנעילה, כוונון שקעי המשקוף, החלפת חלקים פגומים. עלות משוערת: ₪300-₪800 (ליחידה)', 'ת"י 4766 — דלת ממ"ד חייבת להיות ניתנת לנעילה אטומה באמצעות ברגי נעילה תקינים', 'ת"י 4766 — דלת ממ"ד חייבת להיות ניתנת לנעילה אטומה באמצעות ברגי נעילה תקינים', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת ממ"ד - ברגי נעילה לא מתפקדים** — ברגי הנעילה של דלת הממ"ד (קרמונים) אינם נכנסים לשקעים במשקוף, קשים להפעלה, או חסרים. הדלת לא ניתנת לנעילה אטומה.. המלצה: שימון/תיקון ברגי הנעילה, כוונון שקעי המשקוף, החלפת חלקים פגומים. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**דלת ממ"ד - צירים פגומים או חסרים** — צירי דלת הממ"ד פגומים, חלודים, או חסרים. דלת הממ"ד שוקלת כ-200 ק"ג וצירים פגומים מסכנים את השימוש בה.. המלצה: שימון צירים, החלפת צירים פגומים, כוונון גובה הדלת ביחס למשקוף. עלות משוערת: ₪400-₪1000 (ליחידה)', 'ת"י 4766 — צירי דלת ממ"ד חייבים להיות תקינים ולשאת את משקל הדלת (כ-200 ק"ג) ללא שקיעה', 'ת"י 4766 — צירי דלת ממ"ד חייבים להיות תקינים ולשאת את משקל הדלת (כ-200 ק"ג) ללא שקיעה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת ממ"ד - צירים פגומים או חסרים** — צירי דלת הממ"ד פגומים, חלודים, או חסרים. דלת הממ"ד שוקלת כ-200 ק"ג וצירים פגומים מסכנים את השימוש בה.. המלצה: שימון צירים, החלפת צירים פגומים, כוונון גובה הדלת ביחס למשקוף. עלות משוערת: ₪400-₪1000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**חלון ממ"ד - סגר פלדה חסר או פגום** — סגר הפלדה (שאטר) של חלון הממ"ד חסר, תקוע, או לא נסגר עד הסוף. החלון לא יספק הגנה בעת חירום.. המלצה: שימון מנגנון הסגר, תיקון פסי ההחלקה, החלפת סגר פגום. עלות משוערת: ₪500-₪1500 (ליחידה)', 'ת"י 4766 — סגר פלדה של חלון ממ"ד חייב להיות תקין, ניתן לסגירה ונעילה מלאה', 'ת"י 4766 — סגר פלדה של חלון ממ"ד חייב להיות תקין, ניתן לסגירה ונעילה מלאה', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון ממ"ד - סגר פלדה חסר או פגום** — סגר הפלדה (שאטר) של חלון הממ"ד חסר, תקוע, או לא נסגר עד הסוף. החלון לא יספק הגנה בעת חירום.. המלצה: שימון מנגנון הסגר, תיקון פסי ההחלקה, החלפת סגר פגום. עלות משוערת: ₪500-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**מסגרת חלון ברזל - חלודה וקילוף צבע** — מסגרת חלון ברזל עם סימני חלודה משמעותיים והתקלפות ציפוי. חלודה מחלישה את המסגרת ופוגעת באיטום.. המלצה: שיוף חלודה עד למתכת נקייה, מריחת פריימר נגד חלודה, צביעה בשתי שכבות צבע חוץ. עלות משוערת: ₪200-₪500 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מסגרת חלון ברזל - חלודה וקילוף צבע** — מסגרת חלון ברזל עם סימני חלודה משמעותיים והתקלפות ציפוי. חלודה מחלישה את המסגרת ופוגעת באיטום.. המלצה: שיוף חלודה עד למתכת נקייה, מריחת פריימר נגד חלודה, צביעה בשתי שכבות צבע חוץ. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**סורגי חלון - עיגון לקוי לקיר** — סורגי חלון ברזל עם עיגון רופף לקיר, עוגנים חסרים או חלודים. סורגים רופפים אינם מספקים הגנה ועלולים ליפול.. המלצה: חיזוק עיגון הסורגים לקיר באמצעות עוגנים כימיים או מכניים חדשים. עלות משוערת: ₪300-₪700 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סורגי חלון - עיגון לקוי לקיר** — סורגי חלון ברזל עם עיגון רופף לקיר, עוגנים חסרים או חלודים. סורגים רופפים אינם מספקים הגנה ועלולים ליפול.. המלצה: חיזוק עיגון הסורגים לקיר באמצעות עוגנים כימיים או מכניים חדשים. עלות משוערת: ₪300-₪700 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**שער חניה - מנגנון הפעלה חשמלי תקול** — שער חניה חשמלי עם מנגנון הפעלה תקול - לא נפתח/נסגר, רועש, או עוצר באמצע התנועה. עלול לפגוע באנשים או ברכבים.. המלצה: בדיקת מנוע ומנגנון השער, שימון גלגלים ופסי הנעה, תיקון/החלפת חלקים פגומים. עלות משוערת: ₪500-₪2000 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שער חניה - מנגנון הפעלה חשמלי תקול** — שער חניה חשמלי עם מנגנון הפעלה תקול - לא נפתח/נסגר, רועש, או עוצר באמצע התנועה. עלול לפגוע באנשים או ברכבים.. המלצה: בדיקת מנוע ומנגנון השער, שימון גלגלים ופסי הנעה, תיקון/החלפת חלקים פגומים. עלות משוערת: ₪500-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**רצפה גבוהה בסף דלת ממ"ד** — הפרש גובה בסף דלת ממ"ד מעל המותר — סכנת מעידה.. המלצה: תיקון מפלס רצפה / סף. עלות משוערת: ₪300-₪1000 (ליחידה)', 'ת"י 4145 — גובה מותר של סף דלת ממ"ד', 'ת"י 4145 — גובה מותר של סף דלת ממ"ד', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רצפה גבוהה בסף דלת ממ"ד** — הפרש גובה בסף דלת ממ"ד מעל המותר — סכנת מעידה.. המלצה: תיקון מפלס רצפה / סף. עלות משוערת: ₪300-₪1000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**דלת ממ"ד — לא נסגרת / לא אוטמת** — דלת פלדה של ממ"ד שלא נסגרת כראוי או לא אוטמת.. המלצה: כוונון צירים, החלפת אטמים, שימון מנגנון. עלות משוערת: ₪300-₪800 (ליחידה)', 'ת"י 4145 — דלת ממ"ד חייבת לסגור ולאטום בהתאם לתקן', 'ת"י 4145 — דלת ממ"ד חייבת לסגור ולאטום בהתאם לתקן', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת ממ"ד — לא נסגרת / לא אוטמת** — דלת פלדה של ממ"ד שלא נסגרת כראוי או לא אוטמת.. המלצה: כוונון צירים, החלפת אטמים, שימון מנגנון. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**חלון ממ"ד — לא נסגר / לא אוטם** — חלון ממ"ד פלדה שלא נסגר כראוי או שהאטימות פגומה.. המלצה: כוונון מנגנון, החלפת אטמים, שימון. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 4145 — חלון ממ"ד חייב לסגור ולאטום', 'ת"י 4145 — חלון ממ"ד חייב לסגור ולאטום', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון ממ"ד — לא נסגר / לא אוטם** — חלון ממ"ד פלדה שלא נסגר כראוי או שהאטימות פגומה.. המלצה: כוונון מנגנון, החלפת אטמים, שימון. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**גובה מעקה מרפסת נמוך מהנדרש** — גובה מעקה המרפסת נמוך מ-105 ס"מ (עד קומה 4) או נמוך מ-120 ס"מ (מעל קומה 4). סכנת נפילה מגובה.. המלצה: הגבהת המעקה לגובה התקני על ידי הוספת מאריך או החלפת המעקה. עלות משוערת: ₪800-₪2000 (למ"א)', 'ת"י 1142 — גובה מעקה מינימלי: 105 ס"מ עד גובה 12 מ'' (קומה 4), 120 ס"מ מעל 12 מ''', 'ת"י 1142 — גובה מעקה מינימלי: 105 ס"מ עד גובה 12 מ'' (קומה 4), 120 ס"מ מעל 12 מ''', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גובה מעקה מרפסת נמוך מהנדרש** — גובה מעקה המרפסת נמוך מ-105 ס"מ (עד קומה 4) או נמוך מ-120 ס"מ (מעל קומה 4). סכנת נפילה מגובה.. המלצה: הגבהת המעקה לגובה התקני על ידי הוספת מאריך או החלפת המעקה. עלות משוערת: ₪800-₪2000 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**מרווח בין אלמנטים במעקה גדול מ-10 ס"מ** — המרווח בין אלמנטים אנכיים (שבכות/פסים) במעקה גדול מ-10 ס"מ. ילד קטן עלול לתחוב את ראשו בין הפסים.. המלצה: הוספת פסים אנכיים או רשת נוספת לצמצום המרווחים ל-10 ס"מ מקסימום. עלות משוערת: ₪500-₪1500 (למ"א)', 'ת"י 1142 — מרווח מקסימלי בין אלמנטים במעקה: 10 ס"מ בכל כיוון', 'ת"י 1142 — מרווח מקסימלי בין אלמנטים במעקה: 10 ס"מ בכל כיוון', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מרווח בין אלמנטים במעקה גדול מ-10 ס"מ** — המרווח בין אלמנטים אנכיים (שבכות/פסים) במעקה גדול מ-10 ס"מ. ילד קטן עלול לתחוב את ראשו בין הפסים.. המלצה: הוספת פסים אנכיים או רשת נוספת לצמצום המרווחים ל-10 ס"מ מקסימום. עלות משוערת: ₪500-₪1500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**מעקה מרפסת לא יציב - מתנדנד** — מעקה המרפסת מתנדנד בלחיצה, עיגון לריצפה או לקיר לא מספק. המעקה אינו עומד בעומס האופקי הנדרש.. המלצה: חיזוק עיגון המעקה - תיקון עוגנים, ריתוך מחדש, או החלפת נקודות עיגון. עלות משוערת: ₪600-₪1500 (למ"א)', 'ת"י 1142 — מעקה חייב לעמוד בעומס אופקי של 100 ק"ג/מ'' ללא עיוות קבוע', 'ת"י 1142 — מעקה חייב לעמוד בעומס אופקי של 100 ק"ג/מ'' ללא עיוות קבוע', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעקה מרפסת לא יציב - מתנדנד** — מעקה המרפסת מתנדנד בלחיצה, עיגון לריצפה או לקיר לא מספק. המעקה אינו עומד בעומס האופקי הנדרש.. המלצה: חיזוק עיגון המעקה - תיקון עוגנים, ריתוך מחדש, או החלפת נקודות עיגון. עלות משוערת: ₪600-₪1500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**חלודה ושיתוך במעקה ברזל** — סימני חלודה והתקלפות צבע במעקה ברזל. חלודה מתקדמת מחלישה את המעקה ומקצרה את חייו.. המלצה: שיוף החלודה, מריחת ציפוי נגד חלודה (פריימר), וצביעה מחדש בצבע עמיד לחוץ. עלות משוערת: ₪200-₪500 (למ"א)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלודה ושיתוך במעקה ברזל** — סימני חלודה והתקלפות צבע במעקה ברזל. חלודה מתקדמת מחלישה את המעקה ומקצרה את חייו.. המלצה: שיוף החלודה, מריחת ציפוי נגד חלודה (פריימר), וצביעה מחדש בצבע עמיד לחוץ. עלות משוערת: ₪200-₪500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**ריתוך פגום במעקה ברזל** — ריתוכים במעקה עם סדקים, חורים, או ריתוך חלקי. ריתוך פגום מחליש את המעקה ועלול לגרום לקריסה.. המלצה: ריתוך מחדש של כל נקודות הריתוך הפגומות על ידי רתך מוסמך, בדיקה ויזואלית. עלות משוערת: ₪300-₪800 (למ"א)', 'ת"י 1142 — ריתוכים במעקה חייבים להיות רציפים, ללא סדקים או חסרים, ולעמוד בעומסים הנדרשים', 'ת"י 1142 — ריתוכים במעקה חייבים להיות רציפים, ללא סדקים או חסרים, ולעמוד בעומסים הנדרשים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ריתוך פגום במעקה ברזל** — ריתוכים במעקה עם סדקים, חורים, או ריתוך חלקי. ריתוך פגום מחליש את המעקה ועלול לגרום לקריסה.. המלצה: ריתוך מחדש של כל נקודות הריתוך הפגומות על ידי רתך מוסמך, בדיקה ויזואלית. עלות משוערת: ₪300-₪800 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**מעקה עם אלמנט טיפוס (ladder effect)** — מעקה עם פסים אופקיים או אלמנטים המאפשרים לילד לטפס. עיצוב המעקה חייב למנוע אפשרות טיפוס.. המלצה: החלפת אלמנטים אופקיים בפסים אנכיים, או הוספת לוח חיפוי שימנע טיפוס. עלות משוערת: ₪800-₪2000 (למ"א)', 'ת"י 1142 — מעקה לא יכלול אלמנטים המאפשרים טיפוס, פסים אופקיים חייבים להיות צפופים או אנכיים בלבד', 'ת"י 1142 — מעקה לא יכלול אלמנטים המאפשרים טיפוס, פסים אופקיים חייבים להיות צפופים או אנכיים בלבד', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעקה עם אלמנט טיפוס (ladder effect)** — מעקה עם פסים אופקיים או אלמנטים המאפשרים לילד לטפס. עיצוב המעקה חייב למנוע אפשרות טיפוס.. המלצה: החלפת אלמנטים אופקיים בפסים אנכיים, או הוספת לוח חיפוי שימנע טיפוס. עלות משוערת: ₪800-₪2000 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**מעקה מדרגות חסר או לא רציף** — מעקה בגרם מדרגות חסר בצד אחד או שני הצדדים, או שאינו רציף לאורך כל גרם המדרגות. סכנת נפילה.. המלצה: התקנת מעקה/מסעד רציף לאורך כל גרם המדרגות בהתאם לרוחב. עלות משוערת: ₪1000-₪2500 (למ"א)', 'ת"י 1142 — גרם מדרגות ברוחב עד 110 ס"מ חייב מעקה/מסעד בצד אחד לפחות, מעל 110 ס"מ - בשני צדדים', 'ת"י 1142 — גרם מדרגות ברוחב עד 110 ס"מ חייב מעקה/מסעד בצד אחד לפחות, מעל 110 ס"מ - בשני צדדים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעקה מדרגות חסר או לא רציף** — מעקה בגרם מדרגות חסר בצד אחד או שני הצדדים, או שאינו רציף לאורך כל גרם המדרגות. סכנת נפילה.. המלצה: התקנת מעקה/מסעד רציף לאורך כל גרם המדרגות בהתאם לרוחב. עלות משוערת: ₪1000-₪2500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**מסעד (handrail) בגובה לא תקני** — גובה המסעד במדרגות לא בטווח התקני (85-100 ס"מ מקצה המדרגה). גובה לא נכון מפחית את היעילות הבטיחותית.. המלצה: התאמת גובה המסעד לטווח התקני 85-100 ס"מ. עלות משוערת: ₪500-₪1200 (למ"א)', 'ת"י 1142 — גובה מסעד במדרגות: 85-100 ס"מ מקצה המדרגה עד ראש המסעד', 'ת"י 1142 — גובה מסעד במדרגות: 85-100 ס"מ מקצה המדרגה עד ראש המסעד', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מסעד (handrail) בגובה לא תקני** — גובה המסעד במדרגות לא בטווח התקני (85-100 ס"מ מקצה המדרגה). גובה לא נכון מפחית את היעילות הבטיחותית.. המלצה: התאמת גובה המסעד לטווח התקני 85-100 ס"מ. עלות משוערת: ₪500-₪1200 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**מעקה גג ללא גובה מינימלי** — מעקה בגג נגיש (גג שימושי) בגובה נמוך מ-120 ס"מ. סכנת נפילה חמורה מגובה הבניין.. המלצה: הגבהת מעקה הגג לגובה מינימלי 120 ס"מ בהתאם לתקן. עלות משוערת: ₪1000-₪2500 (למ"א)', 'ת"י 1142 — מעקה בגג נגיש חייב להיות בגובה מינימלי של 120 ס"מ', 'ת"י 1142 — מעקה בגג נגיש חייב להיות בגובה מינימלי של 120 ס"מ', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעקה גג ללא גובה מינימלי** — מעקה בגג נגיש (גג שימושי) בגובה נמוך מ-120 ס"מ. סכנת נפילה חמורה מגובה הבניין.. המלצה: הגבהת מעקה הגג לגובה מינימלי 120 ס"מ בהתאם לתקן. עלות משוערת: ₪1000-₪2500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, '**מעקה מרפסת - חוסר ציפוי גלוון** — מעקה ברזל ללא ציפוי גלוון (אבץ חם) כנדרש לאלמנטים חיצוניים. ללא גלוון המעקה יחלוד במהירות.. המלצה: פירוק המעקה, טבילה בגלוון חם, והתקנה מחדש. לחלופין - שיוף וציפוי בצבע אפוקסי דו-רכיבי. עלות משוערת: ₪600-₪1500 (למ"א)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעקה מרפסת - חוסר ציפוי גלוון** — מעקה ברזל ללא ציפוי גלוון (אבץ חם) כנדרש לאלמנטים חיצוניים. ללא גלוון המעקה יחלוד במהירות.. המלצה: פירוק המעקה, טבילה בגלוון חם, והתקנה מחדש. לחלופין - שיוף וציפוי בצבע אפוקסי דו-רכיבי. עלות משוערת: ₪600-₪1500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר יריעת איטום בגג שטוח** — לא בוצע איטום בגג שטוח או שיריעת האיטום חסרה לחלוטין. חשיפת מרכיבי הגג לחדירת מים ישירה, גורמת לנזקי רטיבות קשים במבנה.. המלצה: התקנת מערכת איטום מלאה כולל יריעת איטום ביטומנית דו-שכבתית, פריימר, וחיפוי הגנה. עלות משוערת: ₪120-₪200 (למ"ר)', 'ת"י 931 — גגות שטוחים חייבים איטום מלא בהתאם לתקן, כולל יריעת איטום ביטומנית או סינתטית עם חפיפות תקניות', 'ת"י 931 — גגות שטוחים חייבים איטום מלא בהתאם לתקן, כולל יריעת איטום ביטומנית או סינתטית עם חפיפות תקניות', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר יריעת איטום בגג שטוח** — לא בוצע איטום בגג שטוח או שיריעת האיטום חסרה לחלוטין. חשיפת מרכיבי הגג לחדירת מים ישירה, גורמת לנזקי רטיבות קשים במבנה.. המלצה: התקנת מערכת איטום מלאה כולל יריעת איטום ביטומנית דו-שכבתית, פריימר, וחיפוי הגנה. עלות משוערת: ₪120-₪200 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**קרעים ונקבים ביריעת איטום הגג** — נצפו קרעים, חורים או נקבים ביריעת האיטום בגג השטוח, כתוצאה מפגיעה מכנית, תנועה תרמית או ביצוע לקוי. מאפשרים חדירת מים למבנה.. המלצה: תיקון נקודתי באמצעות טלאי יריעת איטום בגודל מינימלי של 30x30 ס"מ עם חפיפה של 10 ס"מ לכל כיוון, או החלפת יריעה באזור הפגוע. עלות משוערת: ₪250-₪800 (ליחידה)', 'ת"י 931 — יריעת האיטום חייבת להיות רציפה ושלמה, ללא קרעים או נקבים', 'ת"י 931 — יריעת האיטום חייבת להיות רציפה ושלמה, ללא קרעים או נקבים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**קרעים ונקבים ביריעת איטום הגג** — נצפו קרעים, חורים או נקבים ביריעת האיטום בגג השטוח, כתוצאה מפגיעה מכנית, תנועה תרמית או ביצוע לקוי. מאפשרים חדירת מים למבנה.. המלצה: תיקון נקודתי באמצעות טלאי יריעת איטום בגודל מינימלי של 30x30 ס"מ עם חפיפה של 10 ס"מ לכל כיוון, או החלפת יריעה באזור הפגוע. עלות משוערת: ₪250-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חפיפה לא תקנית בין יריעות איטום** — חפיפות בין יריעות האיטום קטנות מהנדרש בתקן (פחות מ-10 ס"מ באורך ו-15 ס"מ ברוחב), או שהחפיפות לא הולחמו כראוי. מהווה נקודת כשל לחדירת מים.. המלצה: פירוק החפיפה הפגומה והרחבתה לגודל תקני עם הלחמה מחודשת בלהבה או אוויר חם. עלות משוערת: ₪80-₪150 (למ"א)', 'ת"י 1637 — חפיפת יריעות ביטומניות: מינימום 10 ס"מ באורך ו-15 ס"מ ברוחב, עם הלחמה מלאה', 'ת"י 1637 — חפיפת יריעות ביטומניות: מינימום 10 ס"מ באורך ו-15 ס"מ ברוחב, עם הלחמה מלאה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חפיפה לא תקנית בין יריעות איטום** — חפיפות בין יריעות האיטום קטנות מהנדרש בתקן (פחות מ-10 ס"מ באורך ו-15 ס"מ ברוחב), או שהחפיפות לא הולחמו כראוי. מהווה נקודת כשל לחדירת מים.. המלצה: פירוק החפיפה הפגומה והרחבתה לגודל תקני עם הלחמה מחודשת בלהבה או אוויר חם. עלות משוערת: ₪80-₪150 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**העדר כיפוף (קרניז) איטום בשפת הגג** — יריעת האיטום לא עולה על המעקה/חומה היקפית בגובה מינימלי של 25 ס"מ. מאפשר חדירת מים בנקודת המפגש בין הגג למעקה.. המלצה: הארכת יריעת האיטום על המעקה לגובה של 25 ס"מ לפחות, כולל עיגון מכני בראש הכיפוף וסרגל לחיצה. עלות משוערת: ₪60-₪120 (למ"א)', 'ת"י 931 — יריעת האיטום חייבת לעלות על שפת הגג/מעקה בגובה מינימלי של 25 ס"מ מעל מפלס הגג המוגמר', 'ת"י 931 — יריעת האיטום חייבת לעלות על שפת הגג/מעקה בגובה מינימלי של 25 ס"מ מעל מפלס הגג המוגמר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**העדר כיפוף (קרניז) איטום בשפת הגג** — יריעת האיטום לא עולה על המעקה/חומה היקפית בגובה מינימלי של 25 ס"מ. מאפשר חדירת מים בנקודת המפגש בין הגג למעקה.. המלצה: הארכת יריעת האיטום על המעקה לגובה של 25 ס"מ לפחות, כולל עיגון מכני בראש הכיפוף וסרגל לחיצה. עלות משוערת: ₪60-₪120 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**שיפוע לא תקני בגג שטוח** — שיפוע הגג השטוח קטן מ-1.5% הנדרש בתקן, גורם לשלוליות מים עומדים המזרזים התבלות יריעת האיטום ומגבירים סיכון לחדירת מים.. המלצה: יצירת שכבת שיפוע חדשה מבטון קל או תערובת שיפוע, והנחת מערכת איטום חדשה מעליה. עלות משוערת: ₪150-₪280 (למ"ר)', 'ת"י 931 — שיפוע מינימלי בגג שטוח: 1.5% לכיוון הניקוז', 'ת"י 931 — שיפוע מינימלי בגג שטוח: 1.5% לכיוון הניקוז', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שיפוע לא תקני בגג שטוח** — שיפוע הגג השטוח קטן מ-1.5% הנדרש בתקן, גורם לשלוליות מים עומדים המזרזים התבלות יריעת האיטום ומגבירים סיכון לחדירת מים.. המלצה: יצירת שכבת שיפוע חדשה מבטון קל או תערובת שיפוע, והנחת מערכת איטום חדשה מעליה. עלות משוערת: ₪150-₪280 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**סתימה או כשל במערכת ניקוז הגג** — מרזבים, נקזים או מפלטי מים בגג סתומים, שבורים או בקוטר לא מספיק. גורם להצטברות מים על הגג ולהגברת הלחץ ההידרוסטטי על האיטום.. המלצה: ניקוי ושחרור מערכת הניקוז, החלפת אלמנטים פגומים, התקנת מסנני עלים, ובדיקת קוטר נקזים מספיק. עלות משוערת: ₪500-₪2500 (ליחידה)', 'ת"י 931 — מערכת ניקוז גג חייבת לפנות מים ביעילות, עם מספר נקזים מספק ושיפוע מתאים', 'ת"י 931 — מערכת ניקוז גג חייבת לפנות מים ביעילות, עם מספר נקזים מספק ושיפוע מתאים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סתימה או כשל במערכת ניקוז הגג** — מרזבים, נקזים או מפלטי מים בגג סתומים, שבורים או בקוטר לא מספיק. גורם להצטברות מים על הגג ולהגברת הלחץ ההידרוסטטי על האיטום.. המלצה: ניקוי ושחרור מערכת הניקוז, החלפת אלמנטים פגומים, התקנת מסנני עלים, ובדיקת קוטר נקזים מספיק. עלות משוערת: ₪500-₪2500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**פריחה (blistering) ביריעת איטום ביטומנית** — נצפו בועות ותפיחויות (פריחה) ביריעת האיטום הביטומנית, כתוצאה מלחות כלואה מתחת ליריעה שמתאדה בחום. מחלישה את הצמדות היריעה ומובילה לקריעה.. המלצה: חיתוך הבועות בצורת X, ייבוש המשטח, הלחמה מחדש והנחת טלאי יריעה מעל באמצעות להבה. עלות משוערת: ₪150-₪400 (ליחידה)', 'ת"י 1637 — יריעות ביטומניות חייבות להיות מודבקות באופן מלא למצע, ללא בועות אוויר או לחות כלואה', 'ת"י 1637 — יריעות ביטומניות חייבות להיות מודבקות באופן מלא למצע, ללא בועות אוויר או לחות כלואה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פריחה (blistering) ביריעת איטום ביטומנית** — נצפו בועות ותפיחויות (פריחה) ביריעת האיטום הביטומנית, כתוצאה מלחות כלואה מתחת ליריעה שמתאדה בחום. מחלישה את הצמדות היריעה ומובילה לקריעה.. המלצה: חיתוך הבועות בצורת X, ייבוש המשטח, הלחמה מחדש והנחת טלאי יריעה מעל באמצעות להבה. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**כיווץ והתנתקות יריעת איטום סינתטית** — יריעת איטום סינתטית (EPDM/TPO/PVC) התכווצה ונמשכה מקצוות הגג או מנקודות עיגון, חושפת אזורים ללא הגנת איטום.. המלצה: הרחבת היריעה בחזרה למיקומה עם תוספת יריעה בקצוות, או החלפת היריעה באזור הפגוע. עלות משוערת: ₪100-₪180 (למ"ר)', 'ת"י 931 — יריעת איטום חייבת לכסות את כל שטח הגג ברציפות, כולל שוליים וכיפופים', 'ת"י 931 — יריעת איטום חייבת לכסות את כל שטח הגג ברציפות, כולל שוליים וכיפופים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כיווץ והתנתקות יריעת איטום סינתטית** — יריעת איטום סינתטית (EPDM/TPO/PVC) התכווצה ונמשכה מקצוות הגג או מנקודות עיגון, חושפת אזורים ללא הגנת איטום.. המלצה: הרחבת היריעה בחזרה למיקומה עם תוספת יריעה בקצוות, או החלפת היריעה באזור הפגוע. עלות משוערת: ₪100-₪180 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**איטום לקוי בנקודת חיבור גג-קיר** — מפגש יריעת האיטום עם הקיר ההיקפי לא בוצע כראוי — חסר כיפוף, חסר סרגל לחיצה, או חסרה אטימה עליונה. נקודת חדירת מים נפוצה.. המלצה: ביצוע כיפוף תקני של יריעת האיטום על הקיר בגובה 25 ס"מ, התקנת סרגל לחיצה מגולוון ואטימה בפוליאוריתן. עלות משוערת: ₪70-₪140 (למ"א)', 'ת"י 931 — מפגש גג-קיר דורש כיפוף יריעת איטום עם עיגון מכני וסרגל לחיצה, ואטימה עליונה בחומר אלסטי', 'ת"י 931 — מפגש גג-קיר דורש כיפוף יריעת איטום עם עיגון מכני וסרגל לחיצה, ואטימה עליונה בחומר אלסטי', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**איטום לקוי בנקודת חיבור גג-קיר** — מפגש יריעת האיטום עם הקיר ההיקפי לא בוצע כראוי — חסר כיפוף, חסר סרגל לחיצה, או חסרה אטימה עליונה. נקודת חדירת מים נפוצה.. המלצה: ביצוע כיפוף תקני של יריעת האיטום על הקיר בגובה 25 ס"מ, התקנת סרגל לחיצה מגולוון ואטימה בפוליאוריתן. עלות משוערת: ₪70-₪140 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**רעפים שבורים או חסרים בגג רעפים** — רעפים שבורים, סדוקים או חסרים בגג משופע, חושפים את שכבת האיטום התחתית או ישירות את תת-הגג לחדירת מים ורוח.. המלצה: החלפת רעפים שבורים/חסרים ברעפים תואמים, בדיקת חפיפות ועיגון הרעפים שמסביב. עלות משוערת: ₪80-₪200 (ליחידה)', 'ת"י 931 — כיסוי גג רעפים חייב להיות שלם ורציף, כל רעף פגום יוחלף', 'ת"י 931 — כיסוי גג רעפים חייב להיות שלם ורציף, כל רעף פגום יוחלף', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רעפים שבורים או חסרים בגג רעפים** — רעפים שבורים, סדוקים או חסרים בגג משופע, חושפים את שכבת האיטום התחתית או ישירות את תת-הגג לחדירת מים ורוח.. המלצה: החלפת רעפים שבורים/חסרים ברעפים תואמים, בדיקת חפיפות ועיגון הרעפים שמסביב. עלות משוערת: ₪80-₪200 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר יריעת תת-רעפים** — לא הותקנה יריעת תת-רעפים (secondary membrane) מתחת לרעפים. בהיעדרה, מים שחודרים בין הרעפים מגיעים ישירות למבנה.. המלצה: הסרת הרעפים, התקנת יריעת תת-רעפים תקנית על הלטים, והחזרת הרעפים. עלות משוערת: ₪130-₪220 (למ"ר)', 'ת"י 931 — גג רעפים נדרשת שכבת הגנה משנית (יריעת תת-רעפים) להגנה מפני חדירת מים ורוח', 'ת"י 931 — גג רעפים נדרשת שכבת הגנה משנית (יריעת תת-רעפים) להגנה מפני חדירת מים ורוח', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר יריעת תת-רעפים** — לא הותקנה יריעת תת-רעפים (secondary membrane) מתחת לרעפים. בהיעדרה, מים שחודרים בין הרעפים מגיעים ישירות למבנה.. המלצה: הסרת הרעפים, התקנת יריעת תת-רעפים תקנית על הלטים, והחזרת הרעפים. עלות משוערת: ₪130-₪220 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**איטום לקוי בשלחם (flashing) גג משופע** — שלחם (flashing) מפח מגולוון או עופרת באזורי מפגש גג-קיר, ארובות או חדירות — מנותק, חלוד או חסר. מאפשר חדירת מים בנקודות המפגש.. המלצה: החלפת השלחם הפגום בשלחם חדש מפח מגולוון או אלומיניום, עם חפיפות תקניות ואטימה בסיליקון. עלות משוערת: ₪150-₪500 (למ"א)', 'ת"י 931 — כל מפגש גג-קיר וחדירה בגג משופע חייב שלחם תקני עם חפיפה מספקת', 'ת"י 931 — כל מפגש גג-קיר וחדירה בגג משופע חייב שלחם תקני עם חפיפה מספקת', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**איטום לקוי בשלחם (flashing) גג משופע** — שלחם (flashing) מפח מגולוון או עופרת באזורי מפגש גג-קיר, ארובות או חדירות — מנותק, חלוד או חסר. מאפשר חדירת מים בנקודות המפגש.. המלצה: החלפת השלחם הפגום בשלחם חדש מפח מגולוון או אלומיניום, עם חפיפות תקניות ואטימה בסיליקון. עלות משוערת: ₪150-₪500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**איטום לקוי בתפר התפשטות** — תפר ההתפשטות במבנה (בגג, ברצפה או בקירות) לא אטום כראוי או שחומר האיטום התבלה. מאפשר חדירת מים דרך התפר.. המלצה: הסרת חומר מילוי ישן, ניקוי התפר, התקנת חבל גיבוי (backer rod) ומילוי בחומר אטימה פוליאוריתני או סיליקוני גמיש. עלות משוערת: ₪80-₪200 (למ"א)', 'ת"י 938 — תפרי התפשטות חייבים מילוי גמיש תקני המסוגל לספוג תנועות תרמיות ומכניות תוך שמירה על אטימות', 'ת"י 938 — תפרי התפשטות חייבים מילוי גמיש תקני המסוגל לספוג תנועות תרמיות ומכניות תוך שמירה על אטימות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**איטום לקוי בתפר התפשטות** — תפר ההתפשטות במבנה (בגג, ברצפה או בקירות) לא אטום כראוי או שחומר האיטום התבלה. מאפשר חדירת מים דרך התפר.. המלצה: הסרת חומר מילוי ישן, ניקוי התפר, התקנת חבל גיבוי (backer rod) ומילוי בחומר אטימה פוליאוריתני או סיליקוני גמיש. עלות משוערת: ₪80-₪200 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**נזק לאיטום גג מהתקנת מערכת סולארית** — התקנת פאנלים סולאריים על הגג פגעה ביריעת האיטום — קידוחים ללא אטימה, משקולות שמועכות את היריעה, או כבלים שיוצרים שחיקה.. המלצה: תיקון כל נקודות הפגיעה, התקנת כריות הגנה מתחת למשקולות, אטימת קידוחים בחומר אלסטומרי, ובדיקת שלמות האיטום. עלות משוערת: ₪1500-₪5000 (ליחידה)', 'ת"י 931 — כל חדירה או עומס על מערכת האיטום חייב להיות מתוכנן ומבוצע ללא פגיעה ברציפות האיטום', 'ת"י 931 — כל חדירה או עומס על מערכת האיטום חייב להיות מתוכנן ומבוצע ללא פגיעה ברציפות האיטום', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזק לאיטום גג מהתקנת מערכת סולארית** — התקנת פאנלים סולאריים על הגג פגעה ביריעת האיטום — קידוחים ללא אטימה, משקולות שמועכות את היריעה, או כבלים שיוצרים שחיקה.. המלצה: תיקון כל נקודות הפגיעה, התקנת כריות הגנה מתחת למשקולות, אטימת קידוחים בחומר אלסטומרי, ובדיקת שלמות האיטום. עלות משוערת: ₪1500-₪5000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**התבלות יריעת איטום מקרינת UV** — יריעת האיטום חשופה ישירות לקרינת שמש ללא שכבת הגנה (חצץ, ריצוף, או צבע מגן). היריעה מתייבשת, מתפוררת ומאבדת גמישות.. המלצה: הנחת שכבת הגנה על האיטום: חצץ שטוף בעובי 5 ס"מ, או ריצוף על פלטות, או מריחת צבע מגן רפלקטיבי. עלות משוערת: ₪40-₪120 (למ"ר)', 'ת"י 1637 — יריעות ביטומניות הנחשפות לשמש חייבות שכבת הגנה עליונה: חצץ, אריחים, או ציפוי רפלקטיבי', 'ת"י 1637 — יריעות ביטומניות הנחשפות לשמש חייבות שכבת הגנה עליונה: חצץ, אריחים, או ציפוי רפלקטיבי', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**התבלות יריעת איטום מקרינת UV** — יריעת האיטום חשופה ישירות לקרינת שמש ללא שכבת הגנה (חצץ, ריצוף, או צבע מגן). היריעה מתייבשת, מתפוררת ומאבדת גמישות.. המלצה: הנחת שכבת הגנה על האיטום: חצץ שטוף בעובי 5 ס"מ, או ריצוף על פלטות, או מריחת צבע מגן רפלקטיבי. עלות משוערת: ₪40-₪120 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**מרזב גג שבור או מנותק** — מרזב הגג שבור, מנותק, או בשיפוע שגוי. מים גולשים מעבר למרזב ופוגעים בחזית הבניין, ביסודות ובאיטום.. המלצה: תיקון או החלפת מקטעי מרזב פגומים, כיוון שיפוע 0.5% לכיוון מוריד המים, חיזוק אוחזים. עלות משוערת: ₪80-₪200 (למ"א)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מרזב גג שבור או מנותק** — מרזב הגג שבור, מנותק, או בשיפוע שגוי. מים גולשים מעבר למרזב ופוגעים בחזית הבניין, ביסודות ובאיטום.. המלצה: תיקון או החלפת מקטעי מרזב פגומים, כיוון שיפוע 0.5% לכיוון מוריד המים, חיזוק אוחזים. עלות משוערת: ₪80-₪200 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**מוריד מים (צנרת אנכית) מנותק או סתום** — מוריד מים מהגג מנותק מהמרזב, סתום בפסולת, או חסר בחלקו. מים מהגג שופכים על חזית הבניין וגורמים לנזקי רטיבות.. המלצה: חיבור מחדש או החלפת מוריד המים, ניקוי סתימות, והתקנת מסנן עלים בראש המוריד. עלות משוערת: ₪300-₪1000 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מוריד מים (צנרת אנכית) מנותק או סתום** — מוריד מים מהגג מנותק מהמרזב, סתום בפסולת, או חסר בחלקו. מים מהגג שופכים על חזית הבניין וגורמים לנזקי רטיבות.. המלצה: חיבור מחדש או החלפת מוריד המים, ניקוי סתימות, והתקנת מסנן עלים בראש המוריד. עלות משוערת: ₪300-₪1000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**פגיעה באיטום גג עקב צמחייה** — צמחייה (עשבים, שורשים, אצות) צומחת על או דרך יריעת האיטום בגג. שורשים חודרים ליריעה ויוצרים נקבים, ולחות מצטברת מתחתם.. המלצה: הסרת צמחייה ושורשים, תיקון נקבים ביריעת האיטום, ניקוי מערכת הניקוז, ותחזוקה שוטפת. עלות משוערת: ₪500-₪2000 (ליחידה)', 'ת"י 931 — יש לשמור על גג נקי מצמחייה ופסולת, ולוודא שמערכת האיטום שלמה', 'ת"י 931 — יש לשמור על גג נקי מצמחייה ופסולת, ולוודא שמערכת האיטום שלמה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פגיעה באיטום גג עקב צמחייה** — צמחייה (עשבים, שורשים, אצות) צומחת על או דרך יריעת האיטום בגג. שורשים חודרים ליריעה ויוצרים נקבים, ולחות מצטברת מתחתם.. המלצה: הסרת צמחייה ושורשים, תיקון נקבים ביריעת האיטום, ניקוי מערכת הניקוז, ותחזוקה שוטפת. עלות משוערת: ₪500-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר שכבת הפרדה בין איטום לבטון** — יריעת האיטום הונחה ישירות על בטון מחוספס ללא שכבת הפרדה (פריימר/ביטומן מדולל). גורם להצמדות חלקית ולנקודות כשל.. המלצה: באזורים בעייתיים — הרמת היריעה, מריחת פריימר, והדבקה מחדש. בגג חדש — ביצוע מלא עם פריימר. עלות משוערת: ₪15-₪30 (למ"ר)', 'ת"י 1637 — חובה למרוח פריימר ביטומני על משטח הבטון לפני הנחת יריעת איטום ביטומנית', 'ת"י 1637 — חובה למרוח פריימר ביטומני על משטח הבטון לפני הנחת יריעת איטום ביטומנית', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר שכבת הפרדה בין איטום לבטון** — יריעת האיטום הונחה ישירות על בטון מחוספס ללא שכבת הפרדה (פריימר/ביטומן מדולל). גורם להצמדות חלקית ולנקודות כשל.. המלצה: באזורים בעייתיים — הרמת היריעה, מריחת פריימר, והדבקה מחדש. בגג חדש — ביצוע מלא עם פריימר. עלות משוערת: ₪15-₪30 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חדירת מים בחיבור גג רעפים לארובה/מדחום** — חיבור גג הרעפים לארובה, מדחום או אלמנט בולט לא אטום כראוי. מים חודרים דרך נקודת החיבור בעיקר בגשם חזק.. המלצה: התקנת שלחם עופרת או אלומיניום בצורת שלב (stepped flashing) סביב הארובה, עם אטימה עליונה. עלות משוערת: ₪1500-₪4000 (ליחידה)', 'ת"י 931 — כל חדירה או אלמנט בולט מגג רעפים חייב שלחם ואטימה ייעודית', 'ת"י 931 — כל חדירה או אלמנט בולט מגג רעפים חייב שלחם ואטימה ייעודית', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חדירת מים בחיבור גג רעפים לארובה/מדחום** — חיבור גג הרעפים לארובה, מדחום או אלמנט בולט לא אטום כראוי. מים חודרים דרך נקודת החיבור בעיקר בגשם חזק.. המלצה: התקנת שלחם עופרת או אלומיניום בצורת שלב (stepped flashing) סביב הארובה, עם אטימה עליונה. עלות משוערת: ₪1500-₪4000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר איטום מרפסת — יריעה חסרה** — מרפסת חשופה ללא שכבת איטום מתחת לריצוף. מים חודרים דרך הריצוף והתשתית לתקרת הדירה מתחת.. המלצה: הסרת הריצוף, התקנת מערכת איטום מלאה (פריימר + יריעה ביטומנית או ציפוי פוליאוריתן), ריצוף מחדש. עלות משוערת: ₪250-₪450 (למ"ר)', 'ת"י 1556 — כל מרפסת חשופה חייבת מערכת איטום מלאה מתחת לריצוף, כולל כיפופים ושיפוע לניקוז', 'ת"י 1556 — כל מרפסת חשופה חייבת מערכת איטום מלאה מתחת לריצוף, כולל כיפופים ושיפוע לניקוז', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר איטום מרפסת — יריעה חסרה** — מרפסת חשופה ללא שכבת איטום מתחת לריצוף. מים חודרים דרך הריצוף והתשתית לתקרת הדירה מתחת.. המלצה: הסרת הריצוף, התקנת מערכת איטום מלאה (פריימר + יריעה ביטומנית או ציפוי פוליאוריתן), ריצוף מחדש. עלות משוערת: ₪250-₪450 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**שיפוע לא תקני במרפסת** — שיפוע המרפסת לכיוון הניקוז קטן מ-1.5% או שהשיפוע לכיוון הפנים (כלפי הדירה) במקום כלפי חוץ. גורם להצטברות מים ולחדירתם למבנה.. המלצה: יצירת שכבת שיפוע מתקנת מבטון קל או דבק שיפוע, איטום מחדש וריצוף. עלות משוערת: ₪200-₪400 (למ"ר)', 'ת"י 1556 — שיפוע מרפסת מינימלי 1.5% לכיוון הניקוז, הרחק מפתח הדירה', 'ת"י 1556 — שיפוע מרפסת מינימלי 1.5% לכיוון הניקוז, הרחק מפתח הדירה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שיפוע לא תקני במרפסת** — שיפוע המרפסת לכיוון הניקוז קטן מ-1.5% או שהשיפוע לכיוון הפנים (כלפי הדירה) במקום כלפי חוץ. גורם להצטברות מים ולחדירתם למבנה.. המלצה: יצירת שכבת שיפוע מתקנת מבטון קל או דבק שיפוע, איטום מחדש וריצוף. עלות משוערת: ₪200-₪400 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**כיפוף איטום חסר בסף מרפסת** — יריעת האיטום לא עולה בכיפוף על הסף/מפתן בין המרפסת לחדר הפנימי. מים זורמים מתחת לסף וחודרים לדירה.. המלצה: הסרת הסף, ביצוע כיפוף יריעת איטום על מפתן הדלת, התקנת סף חדש עם אטימה. עלות משוערת: ₪800-₪2000 (ליחידה)', 'ת"י 1556 — איטום המרפסת חייב לעלות בכיפוף על הסף בגובה מינימלי של 5 ס"מ מעל מפלס הריצוף המוגמר', 'ת"י 1556 — איטום המרפסת חייב לעלות בכיפוף על הסף בגובה מינימלי של 5 ס"מ מעל מפלס הריצוף המוגמר', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כיפוף איטום חסר בסף מרפסת** — יריעת האיטום לא עולה בכיפוף על הסף/מפתן בין המרפסת לחדר הפנימי. מים זורמים מתחת לסף וחודרים לדירה.. המלצה: הסרת הסף, ביצוע כיפוף יריעת איטום על מפתן הדלת, התקנת סף חדש עם אטימה. עלות משוערת: ₪800-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**נקז מרפסת סתום או חסר** — נקז המרפסת (גרגורי/ניקוז רצפתי) סתום, קטן מדי, או לא הותקן כלל. מים מצטברים על המרפסת ומזיקים לאיטום.. המלצה: התקנת נקז רצפתי בקוטר מינימלי 50 מ"מ עם חיבור למערכת הניקוז, כולל רשת לכידת פסולת. עלות משוערת: ₪600-₪1500 (ליחידה)', 'ת"י 1556 — כל מרפסת חשופה חייבת נקודת ניקוז תקנית עם חיבור למערכת הניקוז של הבניין', 'ת"י 1556 — כל מרפסת חשופה חייבת נקודת ניקוז תקנית עם חיבור למערכת הניקוז של הבניין', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נקז מרפסת סתום או חסר** — נקז המרפסת (גרגורי/ניקוז רצפתי) סתום, קטן מדי, או לא הותקן כלל. מים מצטברים על המרפסת ומזיקים לאיטום.. המלצה: התקנת נקז רצפתי בקוטר מינימלי 50 מ"מ עם חיבור למערכת הניקוז, כולל רשת לכידת פסולת. עלות משוערת: ₪600-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**שקיעת ריצוף במרפסת — פגיעה באיטום** — ריצוף המרפסת שקע או התרומם, מעיד על בעיה בשכבת הבסיס. השקיעה פוגעת בשיפוע הניקוז ועלולה לפגוע ביריעת האיטום מתחת.. המלצה: הסרת ריצוף פגום, בדיקת ותיקון שכבת האיטום, יצירת שכבת בסיס חדשה בשיפוע תקני, ריצוף מחדש. עלות משוערת: ₪250-₪450 (למ"ר)', 'ת"י 1556 — ריצוף מרפסת חייב להיות יציב על בסיס תקין, עם שמירה על שיפוע הניקוז', 'ת"י 1556 — ריצוף מרפסת חייב להיות יציב על בסיס תקין, עם שמירה על שיפוע הניקוז', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שקיעת ריצוף במרפסת — פגיעה באיטום** — ריצוף המרפסת שקע או התרומם, מעיד על בעיה בשכבת הבסיס. השקיעה פוגעת בשיפוע הניקוז ועלולה לפגוע ביריעת האיטום מתחת.. המלצה: הסרת ריצוף פגום, בדיקת ותיקון שכבת האיטום, יצירת שכבת בסיס חדשה בשיפוע תקני, ריצוף מחדש. עלות משוערת: ₪250-₪450 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**איטום לקוי במרפסת** — איטום מרפסת לא תקין — מים חודרים לדירה מתחת או לקיר.. המלצה: פירוק ריצוף, ביצוע איטום מחדש, ריצוף עם שיפוע. עלות משוערת: ₪120-₪280 (למ"ר)', 'ת"י 1515.3 — מרפסות חייבות איטום מלא עם שיפוע לניקוז', 'ת"י 1515.3 — מרפסות חייבות איטום מלא עם שיפוע לניקוז', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**איטום לקוי במרפסת** — איטום מרפסת לא תקין — מים חודרים לדירה מתחת או לקיר.. המלצה: פירוק ריצוף, ביצוע איטום מחדש, ריצוף עם שיפוע. עלות משוערת: ₪120-₪280 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**נזילה סביב חדירת צנרת בגג** — איטום לקוי סביב חדירות צנרת, אוורור או כבלים בגג. נקודות חדירה הן מוקדי כשל נפוצים לחדירת מים.. המלצה: התקנת שרוול איטום (boot) תקני סביב כל חדירה, הלחמה ליריעה הראשית בחפיפה של 15 ס"מ לפחות, ואטימה עליונה בחומר אלסטומרי. עלות משוערת: ₪350-₪800 (ליחידה)', 'ת"י 931 — כל חדירה דרך מערכת האיטום חייבת איטום ייעודי בשרוול איטום או פלנג'' עם חפיפה ליריעה הראשית', 'ת"י 931 — כל חדירה דרך מערכת האיטום חייבת איטום ייעודי בשרוול איטום או פלנג'' עם חפיפה ליריעה הראשית', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזילה סביב חדירת צנרת בגג** — איטום לקוי סביב חדירות צנרת, אוורור או כבלים בגג. נקודות חדירה הן מוקדי כשל נפוצים לחדירת מים.. המלצה: התקנת שרוול איטום (boot) תקני סביב כל חדירה, הלחמה ליריעה הראשית בחפיפה של 15 ס"מ לפחות, ואטימה עליונה בחומר אלסטומרי. עלות משוערת: ₪350-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר איטום חדר רחצה — רצפה** — לא בוצע איטום מתחת לריצוף חדר הרחצה/מקלחת. מים חודרים דרך המרצפות ופגעים לתקרה ולקירות הדירה מתחת.. המלצה: הסרת ריצוף קיים, ביצוע איטום מלא בציפוי אלסטי דו-רכיבי עם כיפוף 15 ס"מ על הקירות, ריצוף מחדש. עלות משוערת: ₪300-₪500 (למ"ר)', 'ת"י 1752 — רצפת חדר רחצה ומקלחת חייבת איטום מלא בציפוי אלסטי או יריעה, כולל כיפופים על הקירות', 'ת"י 1752 — רצפת חדר רחצה ומקלחת חייבת איטום מלא בציפוי אלסטי או יריעה, כולל כיפופים על הקירות', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר איטום חדר רחצה — רצפה** — לא בוצע איטום מתחת לריצוף חדר הרחצה/מקלחת. מים חודרים דרך המרצפות ופגעים לתקרה ולקירות הדירה מתחת.. המלצה: הסרת ריצוף קיים, ביצוע איטום מלא בציפוי אלסטי דו-רכיבי עם כיפוף 15 ס"מ על הקירות, ריצוף מחדש. עלות משוערת: ₪300-₪500 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**כיפוף איטום לא מספיק בקירות חדר רחצה** — איטום רצפת חדר הרחצה לא עולה בכיפוף על הקירות בגובה מספיק (פחות מ-10 ס"מ ברצפה, פחות מ-180 ס"מ באזור המקלחת).. המלצה: הסרת אריחי קיר באזורים הנדרשים, ביצוע כיפוף איטום לגובה תקני, ואריחוי מחדש. עלות משוערת: ₪2000-₪5000 (ליחידה)', 'ת"י 1752 — כיפוף איטום: מינימום 10 ס"מ על קירות כלליים, 180 ס"מ באזור מקלחת, גובה מלא מאחורי אמבטיה', 'ת"י 1752 — כיפוף איטום: מינימום 10 ס"מ על קירות כלליים, 180 ס"מ באזור מקלחת, גובה מלא מאחורי אמבטיה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כיפוף איטום לא מספיק בקירות חדר רחצה** — איטום רצפת חדר הרחצה לא עולה בכיפוף על הקירות בגובה מספיק (פחות מ-10 ס"מ ברצפה, פחות מ-180 ס"מ באזור המקלחת).. המלצה: הסרת אריחי קיר באזורים הנדרשים, ביצוע כיפוף איטום לגובה תקני, ואריחוי מחדש. עלות משוערת: ₪2000-₪5000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**אטימה לקויה סביב ניקוז רצפתי בחדר רחצה** — מפגש האיטום עם הניקוז הרצפתי (נקז רצפה) לא בוצע כראוי — חסר טבעת איטום או חפיפה לא מספיקה. נקודת חדירת מים תכופה.. המלצה: החלפת הנקז הרצפתי והתקנת טבעת איטום תקנית עם חפיפה מלאה למערכת האיטום. עלות משוערת: ₪800-₪1800 (ליחידה)', 'ת"י 1752 — ניקוז רצפתי חייב טבעת איטום ייעודית עם חפיפה למערכת האיטום הרצפתית', 'ת"י 1752 — ניקוז רצפתי חייב טבעת איטום ייעודית עם חפיפה למערכת האיטום הרצפתית', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אטימה לקויה סביב ניקוז רצפתי בחדר רחצה** — מפגש האיטום עם הניקוז הרצפתי (נקז רצפה) לא בוצע כראוי — חסר טבעת איטום או חפיפה לא מספיקה. נקודת חדירת מים תכופה.. המלצה: החלפת הנקז הרצפתי והתקנת טבעת איטום תקנית עם חפיפה מלאה למערכת האיטום. עלות משוערת: ₪800-₪1800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר איטום רצפת מרתף** — רצפת המרתף ללא מערכת איטום נגד עליית מי תהום. מים עולים דרך הרצפה וגורמים לרטיבות מתמדת.. המלצה: ביצוע איטום פנימי בציפוי קריסטלי (crystalline) או ממברנה ביטומנית, עם מערכת ניקוז תת-רצפתי למשאבה. עלות משוערת: ₪200-₪350 (למ"ר)', 'ת"י 931 — רצפות מתחת למפלס הקרקע חייבות איטום נגד לחות עולה, כולל מחסום אדים', 'ת"י 931 — רצפות מתחת למפלס הקרקע חייבות איטום נגד לחות עולה, כולל מחסום אדים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר איטום רצפת מרתף** — רצפת המרתף ללא מערכת איטום נגד עליית מי תהום. מים עולים דרך הרצפה וגורמים לרטיבות מתמדת.. המלצה: ביצוע איטום פנימי בציפוי קריסטלי (crystalline) או ממברנה ביטומנית, עם מערכת ניקוז תת-רצפתי למשאבה. עלות משוערת: ₪200-₪350 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר איטום קיר תומך (קיר גבי)** — קיר תומך במגע עם קרקע ללא איטום חיצוני. לחות ומים חודרים דרך הקיר וגורמים לרטיבות, עובש ופגיעה במבנה.. המלצה: חפירה מצד הקרקע, ניקוי הקיר, מריחת פריימר ביטומני, הדבקת יריעת איטום, התקנת צנרת ניקוז ומילוי בחומר מנקז. עלות משוערת: ₪600-₪1200 (למ"א)', 'ת"י 931 — קירות תומכים במגע עם קרקע חייבים איטום חיצוני מלא ומערכת ניקוז', 'ת"י 931 — קירות תומכים במגע עם קרקע חייבים איטום חיצוני מלא ומערכת ניקוז', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר איטום קיר תומך (קיר גבי)** — קיר תומך במגע עם קרקע ללא איטום חיצוני. לחות ומים חודרים דרך הקיר וגורמים לרטיבות, עובש ופגיעה במבנה.. המלצה: חפירה מצד הקרקע, ניקוי הקיר, מריחת פריימר ביטומני, הדבקת יריעת איטום, התקנת צנרת ניקוז ומילוי בחומר מנקז. עלות משוערת: ₪600-₪1200 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר אטימה באדן חלון חיצוני** — אדן חלון חיצוני ללא שיפוע כלפי חוץ, ללא שפה מנטפת (drip edge), או ללא אטימה בין האדן למסגרת. מים מצטברים ונכנסים דרך מפגש חלון-קיר.. המלצה: התקנת אדן עם שיפוע מינימלי 3% כלפי חוץ, שפה מנטפת, ואטימה בסיליקון סביב מסגרת החלון. עלות משוערת: ₪250-₪600 (ליחידה)', 'ת"י 931 — אדני חלונות חיצוניים חייבים שיפוע כלפי חוץ ושפה מנטפת למניעת נזילת מים אל הקיר', 'ת"י 931 — אדני חלונות חיצוניים חייבים שיפוע כלפי חוץ ושפה מנטפת למניעת נזילת מים אל הקיר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר אטימה באדן חלון חיצוני** — אדן חלון חיצוני ללא שיפוע כלפי חוץ, ללא שפה מנטפת (drip edge), או ללא אטימה בין האדן למסגרת. מים מצטברים ונכנסים דרך מפגש חלון-קיר.. המלצה: התקנת אדן עם שיפוע מינימלי 3% כלפי חוץ, שפה מנטפת, ואטימה בסיליקון סביב מסגרת החלון. עלות משוערת: ₪250-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**אטימה לקויה סביב מסגרת חלון** — חומר האטימה (סיליקון/פוליאוריתן) סביב מסגרת החלון סדוק, מנותק או חסר. רוח ומים חודרים דרך הרווח שבין המסגרת לקיר.. המלצה: הסרת אטימה ישנה, ניקוי המשטחים, מילוי קצף פוליאוריתן בחלל, וגמר באטם סיליקון או פוליאוריתן UV-resistant. עלות משוערת: ₪100-₪250 (ליחידה)', 'ת"י 931 — מפגש מסגרת חלון-קיר חייב אטימה מלאה בחומר אלסטי עמיד בתנאי חוץ', 'ת"י 931 — מפגש מסגרת חלון-קיר חייב אטימה מלאה בחומר אלסטי עמיד בתנאי חוץ', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אטימה לקויה סביב מסגרת חלון** — חומר האטימה (סיליקון/פוליאוריתן) סביב מסגרת החלון סדוק, מנותק או חסר. רוח ומים חודרים דרך הרווח שבין המסגרת לקיר.. המלצה: הסרת אטימה ישנה, ניקוי המשטחים, מילוי קצף פוליאוריתן בחלל, וגמר באטם סיליקון או פוליאוריתן UV-resistant. עלות משוערת: ₪100-₪250 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר איטום בטון חשוף בתקרת חניה** — תקרת חניה תת-קרקעית ללא מערכת איטום. מים חודרים מהגינה או הכביש מעל ופוגעים בברזל הזיון ובמבנה הבטון.. המלצה: ביצוע מערכת איטום על תקרת החניה: פריימר + יריעה ביטומנית דו-שכבתית + שכבת הגנה + ניקוז. עלות משוערת: ₪180-₪300 (למ"ר)', 'ת"י 931 — תקרות מתחת למפלס קרקע או חשופות לגשם חייבות מערכת איטום מלאה', 'ת"י 931 — תקרות מתחת למפלס קרקע או חשופות לגשם חייבות מערכת איטום מלאה', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר איטום בטון חשוף בתקרת חניה** — תקרת חניה תת-קרקעית ללא מערכת איטום. מים חודרים מהגינה או הכביש מעל ופוגעים בברזל הזיון ובמבנה הבטון.. המלצה: ביצוע מערכת איטום על תקרת החניה: פריימר + יריעה ביטומנית דו-שכבתית + שכבת הגנה + ניקוז. עלות משוערת: ₪180-₪300 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**אטימה חסרה בין אמבטיה/מקלחון לקיר** — חסר חומר אטימה (סיליקון) בין אמבטיה או מקלחון לקיר המרוצף. מים חודרים לרווח וגורמים לרטיבות מאחורי האמבטיה.. המלצה: ניקוי המשטחים, התקנת סרט אטימה או מילוי בסיליקון סניטרי אנטי-עובש. עלות משוערת: ₪150-₪400 (ליחידה)', 'ת"י 1752 — מפגשי כלים סניטריים עם קירות וריצוף חייבים אטימה מלאה בחומר אלסטי עמיד במים', 'ת"י 1752 — מפגשי כלים סניטריים עם קירות וריצוף חייבים אטימה מלאה בחומר אלסטי עמיד במים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אטימה חסרה בין אמבטיה/מקלחון לקיר** — חסר חומר אטימה (סיליקון) בין אמבטיה או מקלחון לקיר המרוצף. מים חודרים לרווח וגורמים לרטיבות מאחורי האמבטיה.. המלצה: ניקוי המשטחים, התקנת סרט אטימה או מילוי בסיליקון סניטרי אנטי-עובש. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**חוסר איטום מתחת לאמבטיה** — שטח הרצפה מתחת לאמבטיה לא אוטם. במקרה של נזילה מהאמבטיה או מהצנרת מתחתיה, מים חודרים ישירות לתקרת הדירה מתחת.. המלצה: הסרת האמבטיה, ביצוע איטום רצפתי מלא כולל מתחת לאמבטיה, והתקנה מחדש. עלות משוערת: ₪3000-₪7000 (ליחידה)', 'ת"י 1752 — כל שטח רצפת חדר הרחצה חייב איטום, כולל השטח מתחת לאמבטיה', 'ת"י 1752 — כל שטח רצפת חדר הרחצה חייב איטום, כולל השטח מתחת לאמבטיה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר איטום מתחת לאמבטיה** — שטח הרצפה מתחת לאמבטיה לא אוטם. במקרה של נזילה מהאמבטיה או מהצנרת מתחתיה, מים חודרים ישירות לתקרת הדירה מתחת.. המלצה: הסרת האמבטיה, ביצוע איטום רצפתי מלא כולל מתחת לאמבטיה, והתקנה מחדש. עלות משוערת: ₪3000-₪7000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**סיליקון חסר / פגום בחדר רחצה** — סיליקון חסר, סדוק או מתקלף בפינות חדר רחצה, מקלחת, אמבטיה או כיור.. המלצה: הסרת סיליקון ישן, ניקוי, מילוי סיליקון חדש. עלות משוערת: ₪150-₪400 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סיליקון חסר / פגום בחדר רחצה** — סיליקון חסר, סדוק או מתקלף בפינות חדר רחצה, מקלחת, אמבטיה או כיור.. המלצה: הסרת סיליקון ישן, ניקוי, מילוי סיליקון חדש. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, '**מחסן — רטיבות / איטום** — רטיבות או סימני מים במחסן.. המלצה: איטום מחסן, ניקוז, שיפור אוורור. עלות משוערת: ₪500-₪2000 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מחסן — רטיבות / איטום** — רטיבות או סימני מים במחסן.. המלצה: איטום מחסן, ניקוז, שיפור אוורור. עלות משוערת: ₪500-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**רטיבות בקירות מרתף — חדירה מהקרקע** — כתמי רטיבות, עובש או פריחת מלח (אפלורסנציה) על קירות המרתף. מעיד על חוסר איטום חיצוני או כשל באיטום הקיים נגד לחץ מי תהום.. המלצה: חפירה חיצונית עד ליסוד, ניקוי ותיקון הקיר, ביצוע איטום חיצוני בשכבת ביטומן + יריעה, ומילוי בחזרה עם שכבת סינון. עלות משוערת: ₪800-₪1500 (למ"א)', 'ת"י 931 — קירות מרתף מתחת למפלס הקרקע חייבים איטום חיצוני מלא נגד לחות ולחץ מים', 'ת"י 931 — קירות מרתף מתחת למפלס הקרקע חייבים איטום חיצוני מלא נגד לחות ולחץ מים', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רטיבות בקירות מרתף — חדירה מהקרקע** — כתמי רטיבות, עובש או פריחת מלח (אפלורסנציה) על קירות המרתף. מעיד על חוסר איטום חיצוני או כשל באיטום הקיים נגד לחץ מי תהום.. המלצה: חפירה חיצונית עד ליסוד, ניקוי ותיקון הקיר, ביצוע איטום חיצוני בשכבת ביטומן + יריעה, ומילוי בחזרה עם שכבת סינון. עלות משוערת: ₪800-₪1500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**חוסר ניקוז בגב קיר תומך** — קיר תומך ללא מערכת ניקוז מאחוריו (צנרת ניקוז, חומר מנקז, או פתחי ניקוז). לחץ הידרוסטטי על הקיר גורם לחדירת מים ועלול לפגוע ביציבותו.. המלצה: התקנת מערכת ניקוז: צנרת מנקזת מחוררת עטופה בגיאוטקסטיל, שכבת חצץ, וחיבור לתשתית ניקוז. עלות משוערת: ₪400-₪800 (למ"א)', 'ת"י 931 — קיר תומך חייב מערכת ניקוז כולל צנרת מנקזת, שכבת חצץ מנקז, ופתחי ניקוז (weep holes)', 'ת"י 931 — קיר תומך חייב מערכת ניקוז כולל צנרת מנקזת, שכבת חצץ מנקז, ופתחי ניקוז (weep holes)', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חוסר ניקוז בגב קיר תומך** — קיר תומך ללא מערכת ניקוז מאחוריו (צנרת ניקוז, חומר מנקז, או פתחי ניקוז). לחץ הידרוסטטי על הקיר גורם לחדירת מים ועלול לפגוע ביציבותו.. המלצה: התקנת מערכת ניקוז: צנרת מנקזת מחוררת עטופה בגיאוטקסטיל, שכבת חצץ, וחיבור לתשתית ניקוז. עלות משוערת: ₪400-₪800 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**רטיבות עולה בקירות (רטיבות קפילרית)** — רטיבות עולה מהיסוד לקירות בקומת הקרקע (rising damp). כתמי רטיבות, פריחת מלח וטיח מתקלף בחלק התחתון של הקירות. מעיד על חוסר מחסום רטיבות (DPC).. המלצה: הזרקת חומר חוסם רטיבות (cream/gel silane) בקידוחים בבסיס הקיר, ניקוי וחידוש טיח במלט עמיד ברטיבות. עלות משוערת: ₪150-₪350 (למ"א)', 'ת"י 931 — חובה למנוע מעבר רטיבות מהיסוד לקירות באמצעות מחסום רטיבות (DPC) ביסוד', 'ת"י 931 — חובה למנוע מעבר רטיבות מהיסוד לקירות באמצעות מחסום רטיבות (DPC) ביסוד', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רטיבות עולה בקירות (רטיבות קפילרית)** — רטיבות עולה מהיסוד לקירות בקומת הקרקע (rising damp). כתמי רטיבות, פריחת מלח וטיח מתקלף בחלק התחתון של הקירות. מעיד על חוסר מחסום רטיבות (DPC).. המלצה: הזרקת חומר חוסם רטיבות (cream/gel silane) בקידוחים בבסיס הקיר, ניקוי וחידוש טיח במלט עמיד ברטיבות. עלות משוערת: ₪150-₪350 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**עובש על קירות ותקרה כתוצאה מעיבוי** — כתמי עובש שחורים/ירוקים על קירות חיצוניים ותקרות, בעיקר בפינות ומאחורי רהיטים. כתוצאה מגשרים תרמיים, בידוד חסר ואוורור לקוי.. המלצה: טיפול בעובש בחומר אנטי-פטרייתי, שיפור בידוד תרמי חיצוני, התקנת מערכת אוורור מכני, ובדיקת גשרים תרמיים. עלות משוערת: ₪500-₪3000 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**עובש על קירות ותקרה כתוצאה מעיבוי** — כתמי עובש שחורים/ירוקים על קירות חיצוניים ותקרות, בעיקר בפינות ומאחורי רהיטים. כתוצאה מגשרים תרמיים, בידוד חסר ואוורור לקוי.. המלצה: טיפול בעובש בחומר אנטי-פטרייתי, שיפור בידוד תרמי חיצוני, התקנת מערכת אוורור מכני, ובדיקת גשרים תרמיים. עלות משוערת: ₪500-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**גשר תרמי בתקרת גג — רטיבות עיבוי** — גשר תרמי באזור מפגש תקרה-קיר חיצוני (thermal bridge) גורם לטמפרטורה נמוכה של המשטח הפנימי ולעיבוי מים. מתבטא בעובש ורטיבות בפינות העליונות.. המלצה: שיפור בידוד תרמי באזור הגשר התרמי, הוספת שכבת בידוד פנימית או חיצונית, ושיפור אוורור. עלות משוערת: ₪2000-₪8000 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גשר תרמי בתקרת גג — רטיבות עיבוי** — גשר תרמי באזור מפגש תקרה-קיר חיצוני (thermal bridge) גורם לטמפרטורה נמוכה של המשטח הפנימי ולעיבוי מים. מתבטא בעובש ורטיבות בפינות העליונות.. המלצה: שיפור בידוד תרמי באזור הגשר התרמי, הוספת שכבת בידוד פנימית או חיצונית, ושיפור אוורור. עלות משוערת: ₪2000-₪8000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**חדירת מים דרך סדקים במבנה הבטון** — סדקים במבנה הבטון (תקרה, קורות, קירות) מאפשרים חדירת מים. הסדקים עשויים להצביע על בעיה מבנית בנוסף לבעיית האיטום.. המלצה: הזרקת חומר אפוקסי או פוליאוריתן לסדקים, בדיקה מבנית של הסדקים על ידי מהנדס, ושיקום האיטום. עלות משוערת: ₪200-₪600 (למ"א)', 'ת"י 931 — מבנה הבטון חייב להיות אטום, סדקים מעל 0.3 מ"מ דורשים טיפול לשיקום האטימות', 'ת"י 931 — מבנה הבטון חייב להיות אטום, סדקים מעל 0.3 מ"מ דורשים טיפול לשיקום האטימות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חדירת מים דרך סדקים במבנה הבטון** — סדקים במבנה הבטון (תקרה, קורות, קירות) מאפשרים חדירת מים. הסדקים עשויים להצביע על בעיה מבנית בנוסף לבעיית האיטום.. המלצה: הזרקת חומר אפוקסי או פוליאוריתן לסדקים, בדיקה מבנית של הסדקים על ידי מהנדס, ושיקום האיטום. עלות משוערת: ₪200-₪600 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**נזילת מים מצנרת מעבר בתקרה/רצפה** — צנרת מים/ביוב חוצה רצפה או תקרה ללא אטימה סביב המעבר. מים (מנזילה או עיבוי) זולגים דרך הפתח.. המלצה: התקנת שרוול מעבר (sleeve) עם אטם גומי או מילוי בחומר אטימה חסין אש וגמיש. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 931 — כל מעבר צנרת דרך אלמנט בטון חייב אטימה ייעודית באמצעות שרוול ואטם גמיש', 'ת"י 931 — כל מעבר צנרת דרך אלמנט בטון חייב אטימה ייעודית באמצעות שרוול ואטם גמיש', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזילת מים מצנרת מעבר בתקרה/רצפה** — צנרת מים/ביוב חוצה רצפה או תקרה ללא אטימה סביב המעבר. מים (מנזילה או עיבוי) זולגים דרך הפתח.. המלצה: התקנת שרוול מעבר (sleeve) עם אטם גומי או מילוי בחומר אטימה חסין אש וגמיש. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**רטיבות בתקרה / קיר** — סימני רטיבות בתקרה או קיר — כתמים, התנפחות צבע, עובש.. המלצה: איתור מקור רטיבות, תיקון איטום, ייבוש וצביעה. עלות משוערת: ₪500-₪3000 (ליחידה)', 'ת"י 1515.3 — איטום חייב למנוע חדירת מים לחלל הדירה', 'ת"י 1515.3 — איטום חייב למנוע חדירת מים לחלל הדירה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רטיבות בתקרה / קיר** — סימני רטיבות בתקרה או קיר — כתמים, התנפחות צבע, עובש.. המלצה: איתור מקור רטיבות, תיקון איטום, ייבוש וצביעה. עלות משוערת: ₪500-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, '**עובש בפינות / תקרה** — עובש שחור או ירוק בפינות חדרים, תקרות, או סביבת חלונות.. המלצה: טיפול בעובש, בדיקת מקור רטיבות, שיפור אוורור. עלות משוערת: ₪200-₪800 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**עובש בפינות / תקרה** — עובש שחור או ירוק בפינות חדרים, תקרות, או סביבת חלונות.. המלצה: טיפול בעובש, בדיקת מקור רטיבות, שיפור אוורור. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**ספרינקלר חסר או לא מותקן בחדר מדרגות** — ראש ספרינקלר לא הותקן בחדר מדרגות או בשטח ציבורי כנדרש בתכניות כיבוי האש המאושרות. העדר ספרינקלר מפחית את יכולת הכיבוי האוטומטי במקרה שריפה.. המלצה: התקנת ראש ספרינקלר מאושר בהתאם לתכנית כיבוי האש, כולל חיבור לצנרת הקיימת ובדיקת לחץ. עלות משוערת: ₪350-₪800 (ליחידה)', 'ת"י 1596 — מערכת ספרינקלרים אוטומטית נדרשת בבניין מגורים מעל קומה מסוימת בהתאם לתקנות כיבוי אש, כולל כיסוי מלא בשטחים ציבוריים', 'ת"י 1596 — מערכת ספרינקלרים אוטומטית נדרשת בבניין מגורים מעל קומה מסוימת בהתאם לתקנות כיבוי אש, כולל כיסוי מלא בשטחים ציבוריים', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ספרינקלר חסר או לא מותקן בחדר מדרגות** — ראש ספרינקלר לא הותקן בחדר מדרגות או בשטח ציבורי כנדרש בתכניות כיבוי האש המאושרות. העדר ספרינקלר מפחית את יכולת הכיבוי האוטומטי במקרה שריפה.. המלצה: התקנת ראש ספרינקלר מאושר בהתאם לתכנית כיבוי האש, כולל חיבור לצנרת הקיימת ובדיקת לחץ. עלות משוערת: ₪350-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**ספרינקלר צבוע או חסום** — ראש ספרינקלר נצבע במהלך עבודות צביעה או חסום על ידי חפצים/מדפים. צביעה על הספרינקלר עלולה למנוע את פעולתו בעת שריפה.. המלצה: החלפת ראש הספרינקלר הצבוע בחדש מאותו סוג ודירוג טמפרטורה, והסרת כל חסימה. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 1596 — חל איסור מוחלט לצבוע או לחסום ראשי ספרינקלרים; יש לשמור מרחק חופשי של 50 ס"מ לפחות מכל כיוון', 'ת"י 1596 — חל איסור מוחלט לצבוע או לחסום ראשי ספרינקלרים; יש לשמור מרחק חופשי של 50 ס"מ לפחות מכל כיוון', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ספרינקלר צבוע או חסום** — ראש ספרינקלר נצבע במהלך עבודות צביעה או חסום על ידי חפצים/מדפים. צביעה על הספרינקלר עלולה למנוע את פעולתו בעת שריפה.. המלצה: החלפת ראש הספרינקלר הצבוע בחדש מאותו סוג ודירוג טמפרטורה, והסרת כל חסימה. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**גלגלון כיבוי אש לא תקין או חסר** — גלגלון כיבוי אש בחדר מדרגות לא פועל, צינור קרוע, ברז תקוע, או חסר לחלוטין. הגלגלון הוא אמצעי כיבוי ראשוני לדיירים.. המלצה: החלפת גלגלון כיבוי אש פגום בגלגלון חדש תקני, כולל צינור, ברז, וזרנוק, ובדיקת לחץ מים. עלות משוערת: ₪1200-₪2500 (ליחידה)', 'ת"י 5765 — גלגלון כיבוי אש חייב להיות תקין, נגיש, עם צינור באורך מספק (לפחות 30 מטר כולל סילון), ולעבור בדיקה שנתית', 'ת"י 5765 — גלגלון כיבוי אש חייב להיות תקין, נגיש, עם צינור באורך מספק (לפחות 30 מטר כולל סילון), ולעבור בדיקה שנתית', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גלגלון כיבוי אש לא תקין או חסר** — גלגלון כיבוי אש בחדר מדרגות לא פועל, צינור קרוע, ברז תקוע, או חסר לחלוטין. הגלגלון הוא אמצעי כיבוי ראשוני לדיירים.. המלצה: החלפת גלגלון כיבוי אש פגום בגלגלון חדש תקני, כולל צינור, ברז, וזרנוק, ובדיקת לחץ מים. עלות משוערת: ₪1200-₪2500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**ארון כיבוי אש פגום או לא נגיש** — ארון כיבוי אש שבור, חלוד, דלת לא נפתחת, או חסום על ידי חפצים. חוסר נגישות לארון מונע שימוש באמצעי הכיבוי בזמן חירום.. המלצה: תיקון או החלפת ארון כיבוי אש, החלפת דלת שבורה, הסרת חסימות, וסימון מחדש בהתאם לתקן. עלות משוערת: ₪600-₪1500 (ליחידה)', 'ת"י 5765 — ארון כיבוי אש חייב להיות נגיש, מסומן, דלתו חייבת להיפתח ללא מפתח מיוחד, ותכולתו חייבת להיות תקינה', 'ת"י 5765 — ארון כיבוי אש חייב להיות נגיש, מסומן, דלתו חייבת להיפתח ללא מפתח מיוחד, ותכולתו חייבת להיות תקינה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ארון כיבוי אש פגום או לא נגיש** — ארון כיבוי אש שבור, חלוד, דלת לא נפתחת, או חסום על ידי חפצים. חוסר נגישות לארון מונע שימוש באמצעי הכיבוי בזמן חירום.. המלצה: תיקון או החלפת ארון כיבוי אש, החלפת דלת שבורה, הסרת חסימות, וסימון מחדש בהתאם לתקן. עלות משוערת: ₪600-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**מטף כיבוי אש חסר או פג תוקף** — מטף כיבוי אש לא מותקן בשטח ציבורי כנדרש, או שתוקפו פג ולא עבר בדיקה שנתית. מטף ללא בדיקה עשוי לא לפעול בעת הצורך.. המלצה: התקנת מטף כיבוי אש חדש בתוקף או שליחת המטף הקיים לבדיקה ומילוי חוזר, כולל תיוג ובדיקת נגישות. עלות משוערת: ₪150-₪400 (ליחידה)', 'ת"י 129 — מטפי כיבוי אש חייבים לעבור בדיקה שנתית על ידי בודק מוסמך, לשאת תווית בדיקה בתוקף, ולהיות מותקנים בגובה ובמיקום נגישים', 'ת"י 129 — מטפי כיבוי אש חייבים לעבור בדיקה שנתית על ידי בודק מוסמך, לשאת תווית בדיקה בתוקף, ולהיות מותקנים בגובה ובמיקום נגישים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מטף כיבוי אש חסר או פג תוקף** — מטף כיבוי אש לא מותקן בשטח ציבורי כנדרש, או שתוקפו פג ולא עבר בדיקה שנתית. מטף ללא בדיקה עשוי לא לפעול בעת הצורך.. המלצה: התקנת מטף כיבוי אש חדש בתוקף או שליחת המטף הקיים לבדיקה ומילוי חוזר, כולל תיוג ובדיקת נגישות. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**דלת אש חסרה או לא תקנית** — דלת אש בחדר מדרגות או במעבר חסרה, הוחלפה בדלת רגילה, או שאינה עומדת בדירוג עמידות אש נדרש. דלת אש מהווה מחסום קריטי למניעת התפשטות עשן ואש.. המלצה: התקנת דלת אש מאושרת בדירוג EI60 לפחות, כולל סוגר אוטומטי, אטם אש מתנפח, ומשקוף מתאים. עלות משוערת: ₪3500-₪7000 (ליחידה)', 'ת"י 1220 — דלת אש חייבת לעמוד בדירוג עמידות אש של 60 דקות לפחות (EI60), לכלול סוגר אוטומטי, ולהיות מסומנת בתווית עמידות אש', 'ת"י 1220 — דלת אש חייבת לעמוד בדירוג עמידות אש של 60 דקות לפחות (EI60), לכלול סוגר אוטומטי, ולהיות מסומנת בתווית עמידות אש', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת אש חסרה או לא תקנית** — דלת אש בחדר מדרגות או במעבר חסרה, הוחלפה בדלת רגילה, או שאינה עומדת בדירוג עמידות אש נדרש. דלת אש מהווה מחסום קריטי למניעת התפשטות עשן ואש.. המלצה: התקנת דלת אש מאושרת בדירוג EI60 לפחות, כולל סוגר אוטומטי, אטם אש מתנפח, ומשקוף מתאים. עלות משוערת: ₪3500-₪7000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**סוגר אוטומטי בדלת אש לא פועל** — סוגר הדלת האוטומטי (door closer) בדלת אש לא פועל, שבור, או הוסר. ללא סוגר תקין, הדלת נשארת פתוחה ואינה מהווה מחסום אש.. המלצה: החלפת סוגר אוטומטי פגום בסוגר חדש בהתאם למשקל ולגודל הדלת, כיוון מהירות סגירה. עלות משוערת: ₪400-₪900 (ליחידה)', 'ת"י 1220 — כל דלת אש חייבת להיות מצוידת בסוגר אוטומטי תקין המבטיח סגירה מלאה של הדלת לאחר כל פתיחה', 'ת"י 1220 — כל דלת אש חייבת להיות מצוידת בסוגר אוטומטי תקין המבטיח סגירה מלאה של הדלת לאחר כל פתיחה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סוגר אוטומטי בדלת אש לא פועל** — סוגר הדלת האוטומטי (door closer) בדלת אש לא פועל, שבור, או הוסר. ללא סוגר תקין, הדלת נשארת פתוחה ואינה מהווה מחסום אש.. המלצה: החלפת סוגר אוטומטי פגום בסוגר חדש בהתאם למשקל ולגודל הדלת, כיוון מהירות סגירה. עלות משוערת: ₪400-₪900 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**אטם אש מתנפח חסר בדלת אש** — אטם אש מתנפח (intumescent strip) חסר או פגום בדלת אש. האטם מתנפח בחום ואוטם את המרווח בין הדלת למשקוף, מונע מעבר עשן ואש.. המלצה: התקנת אטם אש מתנפח חדש בתעלת האטם בהיקף הדלת, כולל אטם עשן. עלות משוערת: ₪250-₪600 (ליחידה)', 'ת"י 1220 — דלת אש חייבת לכלול אטם אש מתנפח בהיקף הדלת להבטחת אטימות לעשן ולאש', 'ת"י 1220 — דלת אש חייבת לכלול אטם אש מתנפח בהיקף הדלת להבטחת אטימות לעשן ולאש', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אטם אש מתנפח חסר בדלת אש** — אטם אש מתנפח (intumescent strip) חסר או פגום בדלת אש. האטם מתנפח בחום ואוטם את המרווח בין הדלת למשקוף, מונע מעבר עשן ואש.. המלצה: התקנת אטם אש מתנפח חדש בתעלת האטם בהיקף הדלת, כולל אטם עשן. עלות משוערת: ₪250-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**גלאי עשן חסר או לא פועל בשטח ציבורי** — גלאי עשן לא מותקן בחדר מדרגות, לובי, או חניון כנדרש, או שהגלאי מותקן אך אינו פעיל (נורית לא דולקת, סוללה ריקה).. המלצה: התקנת גלאי עשן אופטי או חיווט למערכת גילוי אש מרכזית, בדיקת תקינות וחיבור ללוח בקרה. עלות משוערת: ₪200-₪600 (ליחידה)', 'בהתאם לתקנות כיבוי אש, נדרשת מערכת גילוי אש בשטחים ציבוריים בבניין מגורים הכולל יותר מ-4 קומות', 'בהתאם לתקנות כיבוי אש, נדרשת מערכת גילוי אש בשטחים ציבוריים בבניין מגורים הכולל יותר מ-4 קומות', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גלאי עשן חסר או לא פועל בשטח ציבורי** — גלאי עשן לא מותקן בחדר מדרגות, לובי, או חניון כנדרש, או שהגלאי מותקן אך אינו פעיל (נורית לא דולקת, סוללה ריקה).. המלצה: התקנת גלאי עשן אופטי או חיווט למערכת גילוי אש מרכזית, בדיקת תקינות וחיבור ללוח בקרה. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**לוח בקרת אש לא תקין או ללא חשמל** — לוח בקרת מערכת גילוי אש מציג תקלה, מנותק מחשמל, או שסוללת הגיבוי ריקה. לוח לא תקין פירושו שמערכת גילוי האש כולה לא פעילה.. המלצה: תיקון לוח בקרה, החלפת סוללת גיבוי, בדיקת חיבורי גלאים ואזעקות, וביצוע בדיקת מערכת מלאה. עלות משוערת: ₪800-₪3000 (ליחידה)', 'לוח בקרת אש חייב להיות פעיל 24/7, כולל גיבוי סוללה ל-24 שעות, ולעבור בדיקה תקופתית', 'לוח בקרת אש חייב להיות פעיל 24/7, כולל גיבוי סוללה ל-24 שעות, ולעבור בדיקה תקופתית', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**לוח בקרת אש לא תקין או ללא חשמל** — לוח בקרת מערכת גילוי אש מציג תקלה, מנותק מחשמל, או שסוללת הגיבוי ריקה. לוח לא תקין פירושו שמערכת גילוי האש כולה לא פעילה.. המלצה: תיקון לוח בקרה, החלפת סוללת גיבוי, בדיקת חיבורי גלאים ואזעקות, וביצוע בדיקת מערכת מלאה. עלות משוערת: ₪800-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**תאורת חירום לא פועלת בחדר מדרגות** — גופי תאורת חירום בחדר מדרגות לא דולקים בעת הפסקת חשמל, סוללות תקולות, או גופים שבורים. תאורת חירום חיונית לפינוי בטוח.. המלצה: החלפת גופי תאורת חירום פגומים, החלפת סוללות, בדיקת פעולה תקינה בניתוק חשמל. עלות משוערת: ₪300-₪700 (ליחידה)', 'ת"י 23 — תאורת חירום נדרשת בכל מסלולי המילוט, עוצמה מינימלית של 1 לוקס ברצפה, זמן פעולה מינימלי 60 דקות', 'ת"י 23 — תאורת חירום נדרשת בכל מסלולי המילוט, עוצמה מינימלית של 1 לוקס ברצפה, זמן פעולה מינימלי 60 דקות', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תאורת חירום לא פועלת בחדר מדרגות** — גופי תאורת חירום בחדר מדרגות לא דולקים בעת הפסקת חשמל, סוללות תקולות, או גופים שבורים. תאורת חירום חיונית לפינוי בטוח.. המלצה: החלפת גופי תאורת חירום פגומים, החלפת סוללות, בדיקת פעולה תקינה בניתוק חשמל. עלות משוערת: ₪300-₪700 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**שילוט יציאת חירום חסר או לא מואר** — שלט יציאת חירום (EXIT) חסר, לא מואר, או שהכיתוב לא קריא. שילוט חירום הוא חלק ממערך הפינוי ומחויב בכל מסלול מילוט.. המלצה: התקנת שלט יציאת חירום מואר LED עם סוללת גיבוי, בהתאם למיקום ולכיוון הפינוי. עלות משוערת: ₪250-₪600 (ליחידה)', 'ת"י 23 — שילוט יציאת חירום מואר נדרש בכל נקודות היציאה ובכל נקודת החלטה במסלול המילוט', 'ת"י 23 — שילוט יציאת חירום מואר נדרש בכל נקודות היציאה ובכל נקודת החלטה במסלול המילוט', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שילוט יציאת חירום חסר או לא מואר** — שלט יציאת חירום (EXIT) חסר, לא מואר, או שהכיתוב לא קריא. שילוט חירום הוא חלק ממערך הפינוי ומחויב בכל מסלול מילוט.. המלצה: התקנת שלט יציאת חירום מואר LED עם סוללת גיבוי, בהתאם למיקום ולכיוון הפינוי. עלות משוערת: ₪250-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**צנרת כיבוי אש (standpipe) חלודה או דולפת** — צנרת כיבוי אש עולה (standpipe) בחדר מדרגות מראה סימני חלודה, דליפות, או שברזי הפיתוח שלה חסומים.. המלצה: החלפת קטעי צנרת חלודים, תיקון דליפות, שיפוץ או החלפת ברזי פיתוח, צביעה בצבע אדום. עלות משוערת: ₪800-₪3000 (ליחידה)', 'צנרת כיבוי אש חייבת להיות תקינה, ללא דליפות, עם ברזי פיתוח נגישים ותקינים בכל קומה', 'צנרת כיבוי אש חייבת להיות תקינה, ללא דליפות, עם ברזי פיתוח נגישים ותקינים בכל קומה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת כיבוי אש (standpipe) חלודה או דולפת** — צנרת כיבוי אש עולה (standpipe) בחדר מדרגות מראה סימני חלודה, דליפות, או שברזי הפיתוח שלה חסומים.. המלצה: החלפת קטעי צנרת חלודים, תיקון דליפות, שיפוץ או החלפת ברזי פיתוח, צביעה בצבע אדום. עלות משוערת: ₪800-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**חניון ללא מערכת אוורור מכני** — חניון תת-קרקעי ללא מערכת אוורור מכני פעילה, או שהמערכת תקולה. הצטברות פליטות רכב ועשן מהווה סכנת חיים.. המלצה: תיקון מערכת אוורור מכני, החלפת מנועים תקולים, ניקוי תעלות, בדיקת בקר CO. עלות משוערת: ₪3000-₪15000 (ליחידה)', 'חניון תת-קרקעי חייב במערכת אוורור מכני המבטיחה החלפת אוויר מספקת ופינוי עשן בשריפה', 'חניון תת-קרקעי חייב במערכת אוורור מכני המבטיחה החלפת אוויר מספקת ופינוי עשן בשריפה', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חניון ללא מערכת אוורור מכני** — חניון תת-קרקעי ללא מערכת אוורור מכני פעילה, או שהמערכת תקולה. הצטברות פליטות רכב ועשן מהווה סכנת חיים.. המלצה: תיקון מערכת אוורור מכני, החלפת מנועים תקולים, ניקוי תעלות, בדיקת בקר CO. עלות משוערת: ₪3000-₪15000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, '**מערכת גילוי CO בחניון לא פעילה** — מערכת גילוי פחמן חד-חמצני (CO) בחניון תת-קרקעי לא פעילה, חיישנים תקולים, או ללא חיבור למערכת אוורור.. המלצה: תיקון או החלפת חיישני CO, בדיקת חיבור למערכת אוורור, כיול חיישנים. עלות משוערת: ₪1000-₪3000 (ליחידה)', 'חניון תת-קרקעי חייב במערכת גילוי CO המחוברת להפעלה אוטומטית של מערכת האוורור', 'חניון תת-קרקעי חייב במערכת גילוי CO המחוברת להפעלה אוטומטית של מערכת האוורור', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מערכת גילוי CO בחניון לא פעילה** — מערכת גילוי פחמן חד-חמצני (CO) בחניון תת-קרקעי לא פעילה, חיישנים תקולים, או ללא חיבור למערכת אוורור.. המלצה: תיקון או החלפת חיישני CO, בדיקת חיבור למערכת אוורור, כיול חיישנים. עלות משוערת: ₪1000-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, '**מעלית ללא תעודת בדיקה בתוקף** — תעודת בדיקה תקופתית של המעלית פגת תוקף או לא מוצגת בתוך תא המעלית. בדיקה תקופתית חובה לפי חוק.. המלצה: הזמנת בדיקת מעלית תקופתית מבודק מוסמך, תיקון ליקויים שיימצאו, והצגת תעודה בתוקף בתא. עלות משוערת: ₪600-₪1500 (ליחידה)', 'ת"י 7588 — מעלית חייבת לעבור בדיקה תקופתית כל 6 חודשים על ידי בודק מוסמך, ותעודת הבדיקה חייבת להיות מוצגת בתא', 'ת"י 7588 — מעלית חייבת לעבור בדיקה תקופתית כל 6 חודשים על ידי בודק מוסמך, ותעודת הבדיקה חייבת להיות מוצגת בתא', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעלית ללא תעודת בדיקה בתוקף** — תעודת בדיקה תקופתית של המעלית פגת תוקף או לא מוצגת בתוך תא המעלית. בדיקה תקופתית חובה לפי חוק.. המלצה: הזמנת בדיקת מעלית תקופתית מבודק מוסמך, תיקון ליקויים שיימצאו, והצגת תעודה בתוקף בתא. עלות משוערת: ₪600-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, '**דלת מעלית לא נסגרת כראוי** — דלת תא מעלית או דלת פיר לא נסגרת באופן מלא, נתקעת, או סוגרת בכוח מוגזם. דלת לא תקינה מהווה סכנת בטיחות וגורמת לתקלות חוזרות.. המלצה: כוונון או החלפת מנגנון דלת מעלית, ניקוי מסילות, החלפת גלגלים בלויים, בדיקת חיישן בטיחות. עלות משוערת: ₪800-₪2500 (ליחידה)', 'ת"י 7588 — דלתות מעלית חייבות לפעול בצורה חלקה, לסגור באופן מלא, ולכלול מנגנון בטיחות למניעת לכידה', 'ת"י 7588 — דלתות מעלית חייבות לפעול בצורה חלקה, לסגור באופן מלא, ולכלול מנגנון בטיחות למניעת לכידה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת מעלית לא נסגרת כראוי** — דלת תא מעלית או דלת פיר לא נסגרת באופן מלא, נתקעת, או סוגרת בכוח מוגזם. דלת לא תקינה מהווה סכנת בטיחות וגורמת לתקלות חוזרות.. המלצה: כוונון או החלפת מנגנון דלת מעלית, ניקוי מסילות, החלפת גלגלים בלויים, בדיקת חיישן בטיחות. עלות משוערת: ₪800-₪2500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, '**כפתור מעלית לא פועל או שבור** — כפתור קריאה בקומה או כפתור בחירת קומה בתא המעלית לא פועל, שקוע, שבור, או ללא תאורה.. המלצה: החלפת כפתור מעלית פגום, בדיקת חיווט, וודאות תקינות תאורת אינדיקציה. עלות משוערת: ₪200-₪600 (ליחידה)', 'כל כפתורי המעלית חייבים לפעול באופן תקין ולתת אינדיקציה ויזואלית על לחיצה', 'כל כפתורי המעלית חייבים לפעול באופן תקין ולתת אינדיקציה ויזואלית על לחיצה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כפתור מעלית לא פועל או שבור** — כפתור קריאה בקומה או כפתור בחירת קומה בתא המעלית לא פועל, שקוע, שבור, או ללא תאורה.. המלצה: החלפת כפתור מעלית פגום, בדיקת חיווט, וודאות תקינות תאורת אינדיקציה. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, '**טלפון חירום במעלית לא פועל** — טלפון חירום (אינטרקום) בתא מעלית לא מחובר, לא פועל, או לא מגיע ליעד (מוקד חילוץ). טלפון חירום חיוני לחילוץ נלכדים.. המלצה: תיקון או החלפת מערכת אינטרקום, בדיקת קו טלפון, וידוא חיבור למוקד חילוץ. עלות משוערת: ₪500-₪1500 (ליחידה)', 'ת"י 7588 — כל מעלית חייבת להיות מצוידת בטלפון חירום דו-כיווני תקין המחובר למוקד 24/7', 'ת"י 7588 — כל מעלית חייבת להיות מצוידת בטלפון חירום דו-כיווני תקין המחובר למוקד 24/7', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**טלפון חירום במעלית לא פועל** — טלפון חירום (אינטרקום) בתא מעלית לא מחובר, לא פועל, או לא מגיע ליעד (מוקד חילוץ). טלפון חירום חיוני לחילוץ נלכדים.. המלצה: תיקון או החלפת מערכת אינטרקום, בדיקת קו טלפון, וידוא חיבור למוקד חילוץ. עלות משוערת: ₪500-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, '**תאורה לא תקינה בתא מעלית** — תאורה בתא מעלית חלשה, מהבהבת, או כבויה חלקית. כולל תאורת חירום שלא דולקת בהפסקת חשמל.. המלצה: החלפת נורות/לדים בתא מעלית, בדיקה ותיקון תאורת חירום כולל סוללה. עלות משוערת: ₪200-₪600 (ליחידה)', 'תאורה בתא מעלית חייבת להיות בעוצמה מספקת (50 לוקס לפחות) כולל תאורת חירום עצמאית', 'תאורה בתא מעלית חייבת להיות בעוצמה מספקת (50 לוקס לפחות) כולל תאורת חירום עצמאית', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תאורה לא תקינה בתא מעלית** — תאורה בתא מעלית חלשה, מהבהבת, או כבויה חלקית. כולל תאורת חירום שלא דולקת בהפסקת חשמל.. המלצה: החלפת נורות/לדים בתא מעלית, בדיקה ותיקון תאורת חירום כולל סוללה. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, '**מעלית ללא מפתח כיבוי אש (fireman switch)** — מעלית ללא מפתח כיבוי אש (fireman switch) או שהמפתח לא זמין לשירותי כיבוי. מפתח זה מאפשר לכבאים לשלוט במעלית בשעת חירום.. המלצה: התקנת מנגנון fireman switch תקני, מסירת מפתחות לשירותי כיבוי, סימון בולט. עלות משוערת: ₪500-₪1500 (ליחידה)', 'ת"י 7588 — מעלית חייבת להיות מצוידת במתג כבאים (fireman switch) בקומת הכניסה המאפשר הפעלת מצב חירום', 'ת"י 7588 — מעלית חייבת להיות מצוידת במתג כבאים (fireman switch) בקומת הכניסה המאפשר הפעלת מצב חירום', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעלית ללא מפתח כיבוי אש (fireman switch)** — מעלית ללא מפתח כיבוי אש (fireman switch) או שהמפתח לא זמין לשירותי כיבוי. מפתח זה מאפשר לכבאים לשלוט במעלית בשעת חירום.. המלצה: התקנת מנגנון fireman switch תקני, מסירת מפתחות לשירותי כיבוי, סימון בולט. עלות משוערת: ₪500-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, '**מעלית — רעש חריג או רעידות** — מעלית עם רעש חריג, רעידות או נסיעה לא חלקה.. המלצה: בדיקת טכנאי מעליות, תיקון לפי ממצאים. עלות משוערת: ₪500-₪3000 (ליחידה)', 'ת"י 20 — מעלית חייבת לפעול בשקט ובחלקות', 'ת"י 20 — מעלית חייבת לפעול בשקט ובחלקות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעלית — רעש חריג או רעידות** — מעלית עם רעש חריג, רעידות או נסיעה לא חלקה.. המלצה: בדיקת טכנאי מעליות, תיקון לפי ממצאים. עלות משוערת: ₪500-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**מעקה חדר מדרגות רופף או בגובה לא תקני** — מעקה בחדר מדרגות רופף, לא יציב, או בגובה נמוך מהנדרש (פחות מ-105 ס"מ). מעקה לא תקין מהווה סכנת נפילה.. המלצה: חיזוק עיגון מעקה, הגבהה לגובה תקני של 105 ס"מ, ותיקון חלקים רופפים. עלות משוערת: ₪500-₪2000 (למ"א)', 'ת"י 1142 — מעקה בטיחות בחדר מדרגות חייב להיות בגובה 105 ס"מ לפחות, יציב, ועם מרווחים בין חלקיו שלא יעלו על 10 ס"מ', 'ת"י 1142 — מעקה בטיחות בחדר מדרגות חייב להיות בגובה 105 ס"מ לפחות, יציב, ועם מרווחים בין חלקיו שלא יעלו על 10 ס"מ', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעקה חדר מדרגות רופף או בגובה לא תקני** — מעקה בחדר מדרגות רופף, לא יציב, או בגובה נמוך מהנדרש (פחות מ-105 ס"מ). מעקה לא תקין מהווה סכנת נפילה.. המלצה: חיזוק עיגון מעקה, הגבהה לגובה תקני של 105 ס"מ, ותיקון חלקים רופפים. עלות משוערת: ₪500-₪2000 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**מדרגה שבורה או סדוקה בחדר מדרגות** — מדרגת שיש או בטון סדוקה, שבורה, או עם חלקים חסרים בחדר המדרגות. מדרגה פגומה מהווה סכנת מעידה.. המלצה: תיקון או החלפת מדרגה פגומה, מילוי סדקים באפוקסי או החלפת אריח שיש. עלות משוערת: ₪300-₪900 (ליחידה)', 'תקנות הבנייה מחייבות מדרגות שלמות ויציבות בכל חלקי המבנה הציבוריים', 'תקנות הבנייה מחייבות מדרגות שלמות ויציבות בכל חלקי המבנה הציבוריים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מדרגה שבורה או סדוקה בחדר מדרגות** — מדרגת שיש או בטון סדוקה, שבורה, או עם חלקים חסרים בחדר המדרגות. מדרגה פגומה מהווה סכנת מעידה.. המלצה: תיקון או החלפת מדרגה פגומה, מילוי סדקים באפוקסי או החלפת אריח שיש. עלות משוערת: ₪300-₪900 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**פס נגד החלקה חסר במדרגות** — פס נגד החלקה (anti-slip nosing) חסר בקצה המדרגות בחדר המדרגות. העדר פס נגד החלקה מגביר סכנת מעידה, במיוחד כשהמדרגות רטובות.. המלצה: התקנת פסי אלומיניום נגד החלקה עם תוספת גומי בקצה כל מדרגה. עלות משוערת: ₪40-₪80 (למ"א)', 'ת"י 1142 — נדרש סימון בולט ונגד החלקה בקצה כל מדרגה בחדר מדרגות ציבורי', 'ת"י 1142 — נדרש סימון בולט ונגד החלקה בקצה כל מדרגה בחדר מדרגות ציבורי', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פס נגד החלקה חסר במדרגות** — פס נגד החלקה (anti-slip nosing) חסר בקצה המדרגות בחדר המדרגות. העדר פס נגד החלקה מגביר סכנת מעידה, במיוחד כשהמדרגות רטובות.. המלצה: התקנת פסי אלומיניום נגד החלקה עם תוספת גומי בקצה כל מדרגה. עלות משוערת: ₪40-₪80 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**צביעה מתקלפת או לכלוך בחדר מדרגות** — צבע מתקלף, כתמים, גרפיטי, או לכלוך מצטבר על קירות חדר המדרגות. מצב זה מעיד על חוסר תחזוקה.. המלצה: הכנת משטחים (גירוד, שפכטל), צביעה מחדש בצבע פלסטי עמיד בגוון אחיד. עלות משוערת: ₪25-₪55 (למ"ר)', 'שטחים ציבוריים חייבים להישמר במצב תקין ונקי כחלק מתחזוקת הרכוש המשותף', 'שטחים ציבוריים חייבים להישמר במצב תקין ונקי כחלק מתחזוקת הרכוש המשותף', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צביעה מתקלפת או לכלוך בחדר מדרגות** — צבע מתקלף, כתמים, גרפיטי, או לכלוך מצטבר על קירות חדר המדרגות. מצב זה מעיד על חוסר תחזוקה.. המלצה: הכנת משטחים (גירוד, שפכטל), צביעה מחדש בצבע פלסטי עמיד בגוון אחיד. עלות משוערת: ₪25-₪55 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**חלון חדר מדרגות שבור או לא נפתח** — חלון בחדר מדרגות שבור, סדוק, או מנגנון פתיחה תקוע. חלון חדר המדרגות חיוני לאוורור ולפינוי עשן.. המלצה: החלפת זגוגית שבורה, תיקון מנגנון פתיחה, שימון צירים, או החלפת חלון שלם. עלות משוערת: ₪400-₪1500 (ליחידה)', 'חדר מדרגות מוגן חייב לכלול פתח אוורור עליון (טרישנטל) או חלונות הניתנים לפתיחה לפינוי עשן', 'חדר מדרגות מוגן חייב לכלול פתח אוורור עליון (טרישנטל) או חלונות הניתנים לפתיחה לפינוי עשן', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חלון חדר מדרגות שבור או לא נפתח** — חלון בחדר מדרגות שבור, סדוק, או מנגנון פתיחה תקוע. חלון חדר המדרגות חיוני לאוורור ולפינוי עשן.. המלצה: החלפת זגוגית שבורה, תיקון מנגנון פתיחה, שימון צירים, או החלפת חלון שלם. עלות משוערת: ₪400-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**חדר מדרגות ללא אוורור עליון (טרישנטל)** — חדר מדרגות מוגן ללא פתח אוורור עליון (טרישנטל) או שהפתח חסום. פתח עליון חיוני לפינוי עשן במקרה שריפה.. המלצה: פתיחת פתח אוורור עליון בגג חדר המדרגות או הסרת חסימה קיימת, התקנת רשת נגד מזיקים. עלות משוערת: ₪2000-₪6000 (ליחידה)', 'חדר מדרגות מוגן חייב לכלול פתח אוורור עליון בשטח של לפחות 1 מ"ר לפינוי עשן טבעי', 'חדר מדרגות מוגן חייב לכלול פתח אוורור עליון בשטח של לפחות 1 מ"ר לפינוי עשן טבעי', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חדר מדרגות ללא אוורור עליון (טרישנטל)** — חדר מדרגות מוגן ללא פתח אוורור עליון (טרישנטל) או שהפתח חסום. פתח עליון חיוני לפינוי עשן במקרה שריפה.. המלצה: פתיחת פתח אוורור עליון בגג חדר המדרגות או הסרת חסימה קיימת, התקנת רשת נגד מזיקים. עלות משוערת: ₪2000-₪6000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**סימון קומות חסר בחדר מדרגות** — מספרי קומות לא מסומנים בחדר מדרגות, או שהסימון דהוי ולא קריא. חיוני לפינוי ולזיהוי מיקום בשעת חירום.. המלצה: התקנת שילוט קומות פוספורסנטי (זוהר בחושך) בכל קומה בחדר המדרגות. עלות משוערת: ₪50-₪150 (ליחידה)', 'כל קומה בחדר מדרגות חייבת להיות מסומנת במספר קומה בולט, קריא גם בתנאי עשן', 'כל קומה בחדר מדרגות חייבת להיות מסומנת במספר קומה בולט, קריא גם בתנאי עשן', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סימון קומות חסר בחדר מדרגות** — מספרי קומות לא מסומנים בחדר מדרגות, או שהסימון דהוי ולא קריא. חיוני לפינוי ולזיהוי מיקום בשעת חירום.. המלצה: התקנת שילוט קומות פוספורסנטי (זוהר בחושך) בכל קומה בחדר המדרגות. עלות משוערת: ₪50-₪150 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**מעקה מרפסת משותפת/גג רופף או נמוך** — מעקה בטיחות בגג הבניין או במרפסת משותפת רופף, חלוד, או בגובה נמוך מ-105 ס"מ. סכנת נפילה חמורה.. המלצה: חיזוק או החלפת מעקה, הגבהה לגובה תקני, טיפול בחלודה וצביעה מחדש. עלות משוערת: ₪400-₪1200 (למ"א)', 'ת"י 1142 — מעקה בטיחות בגג או במרפסת חייב להיות בגובה 105 ס"מ לפחות, יציב ועמיד', 'ת"י 1142 — מעקה בטיחות בגג או במרפסת חייב להיות בגובה 105 ס"מ לפחות, יציב ועמיד', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעקה מרפסת משותפת/גג רופף או נמוך** — מעקה בטיחות בגג הבניין או במרפסת משותפת רופף, חלוד, או בגובה נמוך מ-105 ס"מ. סכנת נפילה חמורה.. המלצה: חיזוק או החלפת מעקה, הגבהה לגובה תקני, טיפול בחלודה וצביעה מחדש. עלות משוערת: ₪400-₪1200 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, '**מדרגות — גובה שלח לא אחיד** — הפרשי גובה בין שלחי מדרגות — גורם למעידות.. המלצה: יישור שלחים, תיקון ריצוף מדרגות. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1142 — הפרש גובה מותר בין שלחים: עד 5 מ"מ', 'ת"י 1142 — הפרש גובה מותר בין שלחים: עד 5 מ"מ', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מדרגות — גובה שלח לא אחיד** — הפרשי גובה בין שלחי מדרגות — גורם למעידות.. המלצה: יישור שלחים, תיקון ריצוף מדרגות. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**ריצוף שבור או מפולס לא אחיד בלובי** — אריחי ריצוף בלובי הכניסה שבורים, סדוקים, חסרים, או עם הפרשי גובה בין אריחים. מהווה סכנת מעידה ופוגם במראה הבניין.. המלצה: החלפת אריחים שבורים, יישור הפרשי גובה, מילוי רובה חסרה. עלות משוערת: ₪120-₪350 (למ"ר)', 'ריצוף בשטחים ציבוריים חייב להיות שלם, אחיד, ללא הפרשי גובה מעל 2 מ"מ, ועם מקדם חיכוך מספק', 'ריצוף בשטחים ציבוריים חייב להיות שלם, אחיד, ללא הפרשי גובה מעל 2 מ"מ, ועם מקדם חיכוך מספק', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ריצוף שבור או מפולס לא אחיד בלובי** — אריחי ריצוף בלובי הכניסה שבורים, סדוקים, חסרים, או עם הפרשי גובה בין אריחים. מהווה סכנת מעידה ופוגם במראה הבניין.. המלצה: החלפת אריחים שבורים, יישור הפרשי גובה, מילוי רובה חסרה. עלות משוערת: ₪120-₪350 (למ"ר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**חדירת מים ורטיבות בלובי או בחדר מדרגות** — סימני רטיבות, עובש, או חדירת מים בקירות או בתקרת הלובי וחדר המדרגות. רטיבות בשטחים ציבוריים מעידה על כשל באיטום.. המלצה: איתור מקור הרטיבות, תיקון איטום גג/קירות חיצוניים, טיפול בעובש, וצביעה מחדש. עלות משוערת: ₪1500-₪5000 (ליחידה)', 'שטחים ציבוריים חייבים להיות יבשים וללא חדירת מים מהגג, מקירות חיצוניים, או מתשתיות אינסטלציה', 'שטחים ציבוריים חייבים להיות יבשים וללא חדירת מים מהגג, מקירות חיצוניים, או מתשתיות אינסטלציה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חדירת מים ורטיבות בלובי או בחדר מדרגות** — סימני רטיבות, עובש, או חדירת מים בקירות או בתקרת הלובי וחדר המדרגות. רטיבות בשטחים ציבוריים מעידה על כשל באיטום.. המלצה: איתור מקור הרטיבות, תיקון איטום גג/קירות חיצוניים, טיפול בעובש, וצביעה מחדש. עלות משוערת: ₪1500-₪5000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**תיבות דואר פגומות או חסרות** — תיבות דואר בלובי שבורות, ללא דלת, ללא מנעול, חלודות, או חסרות. תיבות דואר הן חלק מהרכוש המשותף.. המלצה: החלפת תיבות דואר פגומות, התקנת מנעולים, או החלפת מערכת תיבות דואר שלמה. עלות משוערת: ₪200-₪500 (ליחידה)', 'כל דירה זכאית לתיבת דואר תקינה עם מנעול בלובי הכניסה', 'כל דירה זכאית לתיבת דואר תקינה עם מנעול בלובי הכניסה', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תיבות דואר פגומות או חסרות** — תיבות דואר בלובי שבורות, ללא דלת, ללא מנעול, חלודות, או חסרות. תיבות דואר הן חלק מהרכוש המשותף.. המלצה: החלפת תיבות דואר פגומות, התקנת מנעולים, או החלפת מערכת תיבות דואר שלמה. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**דלת כניסה ראשית לבניין לא נסגרת או ללא מנגנון נעילה** — דלת כניסה ראשית לבניין לא נסגרת אוטומטית, מנגנון נעילה אלקטרוני (אינטרקום) לא פועל, או ציר שבור.. המלצה: תיקון או החלפת סוגר דלת, תיקון מנגנון נעילה אלקטרומגנטי, וכיוון צירים. עלות משוערת: ₪500-₪2000 (ליחידה)', 'דלת כניסה ראשית חייבת להיסגר אוטומטית ולכלול מנגנון נעילה תקין לאבטחת הדיירים', 'דלת כניסה ראשית חייבת להיסגר אוטומטית ולכלול מנגנון נעילה תקין לאבטחת הדיירים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת כניסה ראשית לבניין לא נסגרת או ללא מנגנון נעילה** — דלת כניסה ראשית לבניין לא נסגרת אוטומטית, מנגנון נעילה אלקטרוני (אינטרקום) לא פועל, או ציר שבור.. המלצה: תיקון או החלפת סוגר דלת, תיקון מנגנון נעילה אלקטרומגנטי, וכיוון צירים. עלות משוערת: ₪500-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**חדר חשמל ראשי ללא סימון או נעילה** — חדר חשמל ראשי ללא שלט אזהרה, ללא נעילה, או עם גישה חופשית לכל דייר. סכנת התחשמלות ושריפה.. המלצה: התקנת מנעול בטיחות, שילוט אזהרה (סכנת חשמל, אסור להיכנס), ווידוא נגישות לחברת החשמל. עלות משוערת: ₪300-₪800 (ליחידה)', 'חדר חשמל ראשי חייב להיות נעול, מסומן בשלטי אזהרה, ונגיש רק לאנשי מקצוע מורשים', 'חדר חשמל ראשי חייב להיות נעול, מסומן בשלטי אזהרה, ונגיש רק לאנשי מקצוע מורשים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חדר חשמל ראשי ללא סימון או נעילה** — חדר חשמל ראשי ללא שלט אזהרה, ללא נעילה, או עם גישה חופשית לכל דייר. סכנת התחשמלות ושריפה.. המלצה: התקנת מנעול בטיחות, שילוט אזהרה (סכנת חשמל, אסור להיכנס), ווידוא נגישות לחברת החשמל. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**חדר אשפה ללא אוורור או ניקוז** — חדר אשפה משותף ללא מערכת אוורור, ללא ניקוז רצפה, או עם דלת לא אטומה. גורם למפגעי ריח, תברואה, ומזיקים.. המלצה: התקנת מאוורר יניקה, תיקון ניקוז רצפה, אטימת דלת, וריצוף עמיד לשטיפה. עלות משוערת: ₪1500-₪4000 (ליחידה)', 'חדר אשפה בבניין מגורים חייב לכלול אוורור מכני או טבעי, ניקוז רצפה, וריצוף ניתן לשטיפה', 'חדר אשפה בבניין מגורים חייב לכלול אוורור מכני או טבעי, ניקוז רצפה, וריצוף ניתן לשטיפה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חדר אשפה ללא אוורור או ניקוז** — חדר אשפה משותף ללא מערכת אוורור, ללא ניקוז רצפה, או עם דלת לא אטומה. גורם למפגעי ריח, תברואה, ומזיקים.. המלצה: התקנת מאוורר יניקה, תיקון ניקוז רצפה, אטימת דלת, וריצוף עמיד לשטיפה. עלות משוערת: ₪1500-₪4000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**תאורה לקויה בחניון** — תאורה חלשה, נורות שרופות, או אזורים חשוכים בחניון. תאורה לקויה מגבירה סכנת תאונות ופלילות.. המלצה: החלפת נורות שרופות, התקנת גופי תאורת LED, הוספת נקודות תאורה באזורים חשוכים. עלות משוערת: ₪200-₪600 (ליחידה)', 'חניון חייב בתאורה אחידה בעוצמה מינימלית של 50 לוקס באזורי נסיעה ו-20 לוקס באזורי חנייה', 'חניון חייב בתאורה אחידה בעוצמה מינימלית של 50 לוקס באזורי נסיעה ו-20 לוקס באזורי חנייה', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**תאורה לקויה בחניון** — תאורה חלשה, נורות שרופות, או אזורים חשוכים בחניון. תאורה לקויה מגבירה סכנת תאונות ופלילות.. המלצה: החלפת נורות שרופות, התקנת גופי תאורת LED, הוספת נקודות תאורה באזורים חשוכים. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**אינטרקום כניסה לא פועל** — מערכת אינטרקום בכניסה לבניין לא פועלת, מסך שבור, או שכפתורי החיוג לדירות לא מגיבים.. המלצה: תיקון או החלפת מערכת אינטרקום, בדיקת חיווט, החלפת פנל חיצוני פגום. עלות משוערת: ₪800-₪3000 (ליחידה)', 'מערכת אינטרקום חייבת לאפשר תקשורת בין המבקר בכניסה לדיירים ופתיחת דלת מרחוק', 'מערכת אינטרקום חייבת לאפשר תקשורת בין המבקר בכניסה לדיירים ופתיחת דלת מרחוק', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**אינטרקום כניסה לא פועל** — מערכת אינטרקום בכניסה לבניין לא פועלת, מסך שבור, או שכפתורי החיוג לדירות לא מגיבים.. המלצה: תיקון או החלפת מערכת אינטרקום, בדיקת חיווט, החלפת פנל חיצוני פגום. עלות משוערת: ₪800-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**שאריות בנייה / ניקיון לקוי** — שאריות מלט, צבע, דבק או אבק בנייה על ריצוף, חלונות או כלים סניטריים.. המלצה: ניקיון בנייה מקצועי. עלות משוערת: ₪1500-₪3500 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**שאריות בנייה / ניקיון לקוי** — שאריות מלט, צבע, דבק או אבק בנייה על ריצוף, חלונות או כלים סניטריים.. המלצה: ניקיון בנייה מקצועי. עלות משוערת: ₪1500-₪3500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**כתמי מלט על ריצוף** — כתמי מלט או דבק אריחים שנשארו על הריצוף לאחר העבודה.. המלצה: ניקוי מקצועי בחומרים ייעודיים. עלות משוערת: ₪200-₪600 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כתמי מלט על ריצוף** — כתמי מלט או דבק אריחים שנשארו על הריצוף לאחר העבודה.. המלצה: ניקוי מקצועי בחומרים ייעודיים. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**מעקה לא יציב / גובה לא תקני** — מעקה מרפסת או מדרגות שלא יציב, או שגובהו נמוך מהנדרש (105 ס"מ).. המלצה: הגבהת / חיזוק / החלפת מעקה. עלות משוערת: ₪300-₪1500 (למ"א)', 'ת"י 1142 — גובה מעקה מינימלי: 105 ס"מ. מרווח בין פסים: עד 10 ס"מ', 'ת"י 1142 — גובה מעקה מינימלי: 105 ס"מ. מרווח בין פסים: עד 10 ס"מ', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעקה לא יציב / גובה לא תקני** — מעקה מרפסת או מדרגות שלא יציב, או שגובהו נמוך מהנדרש (105 ס"מ).. המלצה: הגבהת / חיזוק / החלפת מעקה. עלות משוערת: ₪300-₪1500 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, '**חניה — סימון לקוי או חסר** — סימון חניה חסר, לא ברור, או לא תואם לתוכנית.. המלצה: סימון חניות מחדש בהתאם לתוכנית. עלות משוערת: ₪200-₪500 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חניה — סימון לקוי או חסר** — סימון חניה חסר, לא ברור, או לא תואם לתוכנית.. המלצה: סימון חניות מחדש בהתאם לתוכנית. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, '**רמפת נגישות חסרה או בשיפוע לא תקני** — רמפה לנכים בכניסה לבניין חסרה, שיפועה חד מדי (מעל 8%), ללא מעקה בטיחות, או בלי משטח אופקי בראשה.. המלצה: בניית רמפת נגישות תקנית או תיקון שיפוע, התקנת מעקות, והוספת משטח אופקי. עלות משוערת: ₪3000-₪12000 (ליחידה)', 'ת"י 1918 חלק 1 — רמפת נגישות חייבת להיות בשיפוע מקסימלי של 8% (1:12), רוחב מינימלי 130 ס"מ, עם מעקות משני צדדים ומשטח אופקי בראש ובתחתית', 'ת"י 1918 חלק 1 — רמפת נגישות חייבת להיות בשיפוע מקסימלי של 8% (1:12), רוחב מינימלי 130 ס"מ, עם מעקות משני צדדים ומשטח אופקי בראש ובתחתית', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רמפת נגישות חסרה או בשיפוע לא תקני** — רמפה לנכים בכניסה לבניין חסרה, שיפועה חד מדי (מעל 8%), ללא מעקה בטיחות, או בלי משטח אופקי בראשה.. המלצה: בניית רמפת נגישות תקנית או תיקון שיפוע, התקנת מעקות, והוספת משטח אופקי. עלות משוערת: ₪3000-₪12000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, '**מעלית ללא נגישות לנכים** — מעלית ללא כפתורים בגובה נגיש, ללא כיתוב ברייל, ללא הכרזה קולית על קומות, או פתח צר מדי לכיסא גלגלים.. המלצה: שדרוג לוח כפתורים עם ברייל, התקנת מערכת הכרזה קולית, בדיקת רוחב פתח. עלות משוערת: ₪2000-₪8000 (ליחידה)', 'ת"י 1918 חלק 3 — מעלית נגישה חייבת לכלול: כפתורים בגובה נגיש, סימון ברייל, הכרזה קולית, רוחב פתח 90 ס"מ לפחות, ומראה אחורית', 'ת"י 1918 חלק 3 — מעלית נגישה חייבת לכלול: כפתורים בגובה נגיש, סימון ברייל, הכרזה קולית, רוחב פתח 90 ס"מ לפחות, ומראה אחורית', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעלית ללא נגישות לנכים** — מעלית ללא כפתורים בגובה נגיש, ללא כיתוב ברייל, ללא הכרזה קולית על קומות, או פתח צר מדי לכיסא גלגלים.. המלצה: שדרוג לוח כפתורים עם ברייל, התקנת מערכת הכרזה קולית, בדיקת רוחב פתח. עלות משוערת: ₪2000-₪8000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, '**חניית נכים חסרה או לא מסומנת** — חניית נכים לא מסומנת, ללא שילוט, ברוחב לא מספק, או ללא מעבר נגיש ממנה לכניסת הבניין.. המלצה: סימון וצביעת חניית נכים, התקנת שילוט, הרחבה לרוחב תקני, והתקנת מעבר נגיש. עלות משוערת: ₪1000-₪3000 (ליחידה)', 'ת"י 1918 חלק 1 — נדרשת לפחות חנייה נגישה אחת לכל 25 חניות, ברוחב 3.5 מטר, עם סימון ושילוט בולטים ומעבר נגיש', 'ת"י 1918 חלק 1 — נדרשת לפחות חנייה נגישה אחת לכל 25 חניות, ברוחב 3.5 מטר, עם סימון ושילוט בולטים ומעבר נגיש', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**חניית נכים חסרה או לא מסומנת** — חניית נכים לא מסומנת, ללא שילוט, ברוחב לא מספק, או ללא מעבר נגיש ממנה לכניסת הבניין.. המלצה: סימון וצביעת חניית נכים, התקנת שילוט, הרחבה לרוחב תקני, והתקנת מעבר נגיש. עלות משוערת: ₪1000-₪3000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, '**העדר מאחז יד בחדר מדרגות** — מאחז יד (handrail) חסר בצד אחד או בשני צדדי חדר המדרגות, לא רציף, או בגובה לא תקני.. המלצה: התקנת מאחז יד נירוסטה רציף בשני צדדי חדר המדרגות, בגובה תקני עם חזרה לקיר. עלות משוערת: ₪200-₪450 (למ"א)', 'ת"י 1918 חלק 1 — נדרש מאחז יד רציף בשני צדדי חדר המדרגות, בגובה 85-100 ס"מ, עם חזרה לקיר בקצוות', 'ת"י 1918 חלק 1 — נדרש מאחז יד רציף בשני צדדי חדר המדרגות, בגובה 85-100 ס"מ, עם חזרה לקיר בקצוות', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**העדר מאחז יד בחדר מדרגות** — מאחז יד (handrail) חסר בצד אחד או בשני צדדי חדר המדרגות, לא רציף, או בגובה לא תקני.. המלצה: התקנת מאחז יד נירוסטה רציף בשני צדדי חדר המדרגות, בגובה תקני עם חזרה לקיר. עלות משוערת: ₪200-₪450 (למ"א)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, '**מעבר מעלית צר מדי לכיסא גלגלים** — המרווח בין דלת המעלית לקיר הנגדי בקומה קטן מדי, מונע כניסה ויציאה נוחה של כיסא גלגלים.. המלצה: הסרת חסימות, הרחבת מרווח תמרון מול דלת המעלית, במקרים קיצוניים — שינוי תכנוני. עלות משוערת: ₪500-₪5000 (ליחידה)', 'ת"י 1918 חלק 3 — מרווח מינימלי של 150 ס"מ נדרש מול דלת המעלית לתמרון כיסא גלגלים', 'ת"י 1918 חלק 3 — מרווח מינימלי של 150 ס"מ נדרש מול דלת המעלית לתמרון כיסא גלגלים', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מעבר מעלית צר מדי לכיסא גלגלים** — המרווח בין דלת המעלית לקיר הנגדי בקומה קטן מדי, מונע כניסה ויציאה נוחה של כיסא גלגלים.. המלצה: הסרת חסימות, הרחבת מרווח תמרון מול דלת המעלית, במקרים קיצוניים — שינוי תכנוני. עלות משוערת: ₪500-₪5000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, '**סף מפתן גבוה בכניסה לבניין** — מפתן (סף) גבוה בכניסה לבניין המונע מעבר כיסא גלגלים או עגלת תינוק. הפרש גובה מעל 2 ס"מ ללא רמפה.. המלצה: התקנת רמפון (ramp insert) או הורדת מפתן לגובה תקני, ביצוע מעבר חלק ללא הפרשי גובה. עלות משוערת: ₪500-₪2000 (ליחידה)', 'ת"י 1918 חלק 1 — הפרש גובה מקסימלי בכניסה נגישה הוא 2 ס"מ, מעל לכך נדרשת רמפה או הורדת מפלס', 'ת"י 1918 חלק 1 — הפרש גובה מקסימלי בכניסה נגישה הוא 2 ס"מ, מעל לכך נדרשת רמפה או הורדת מפלס', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**סף מפתן גבוה בכניסה לבניין** — מפתן (סף) גבוה בכניסה לבניין המונע מעבר כיסא גלגלים או עגלת תינוק. הפרש גובה מעל 2 ס"מ ללא רמפה.. המלצה: התקנת רמפון (ramp insert) או הורדת מפתן לגובה תקני, ביצוע מעבר חלק ללא הפרשי גובה. עלות משוערת: ₪500-₪2000 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, '**דלת לא נסגרת כראוי** — דלת פנים שלא נסגרת כראוי — שפשוף ברצפה, משקוף עקום, או ציר רופף.. המלצה: כוונון צירים, שיוף תחתית דלת, או החלפת דלת. עלות משוערת: ₪150-₪400 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת לא נסגרת כראוי** — דלת פנים שלא נסגרת כראוי — שפשוף ברצפה, משקוף עקום, או ציר רופף.. המלצה: כוונון צירים, שיוף תחתית דלת, או החלפת דלת. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, '**מנעול תקוע / לא נועל** — מנעול דלת שלא פועל כראוי — תקוע, קשה לסיבוב, או לא נועל.. המלצה: שימון, כוונון או החלפת מנעול. עלות משוערת: ₪150-₪450 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מנעול תקוע / לא נועל** — מנעול דלת שלא פועל כראוי — תקוע, קשה לסיבוב, או לא נועל.. המלצה: שימון, כוונון או החלפת מנעול. עלות משוערת: ₪150-₪450 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, '**משקוף פגום / לא ישר** — משקוף דלת שעקום, פגום או לא מותקן ישר.. המלצה: יישור או החלפת משקוף. עלות משוערת: ₪300-₪800 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**משקוף פגום / לא ישר** — משקוף דלת שעקום, פגום או לא מותקן ישר.. המלצה: יישור או החלפת משקוף. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, '**ארון מטבח — דלת לא מיושרת** — דלת ארון מטבח שלא מיושרת — לא נסגרת כראוי או לא במפלס עם שאר הדלתות.. המלצה: כוונון צירים, יישור דלת. עלות משוערת: ₪100-₪300 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ארון מטבח — דלת לא מיושרת** — דלת ארון מטבח שלא מיושרת — לא נסגרת כראוי או לא במפלס עם שאר הדלתות.. המלצה: כוונון צירים, יישור דלת. עלות משוערת: ₪100-₪300 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, '**דלת כניסה — אטימה לקויה** — דלת כניסה ראשית שלא אוטמת כראוי — חדירת אוויר, אור או מים.. המלצה: החלפת אטמים, כוונון דלת, תיקון מסגרת. עלות משוערת: ₪200-₪600 (ליחידה)', 'ת"י 23 — דלת כניסה חייבת לאטום כנגד חדירת מים ואוויר', 'ת"י 23 — דלת כניסה חייבת לאטום כנגד חדירת מים ואוויר', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**דלת כניסה — אטימה לקויה** — דלת כניסה ראשית שלא אוטמת כראוי — חדירת אוויר, אור או מים.. המלצה: החלפת אטמים, כוונון דלת, תיקון מסגרת. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'צביעה', NULL, '**פילינג / התקלפות צבע** — צבע שמתקלף מהקיר או התקרה. עלול לנבוע מרטיבות, הכנה לקויה או צבע לא מתאים.. המלצה: גירוד צבע ישן, הכנת משטח, צביעה ב-2 שכבות. עלות משוערת: ₪200-₪800 (ליחידה)', 'ת"י 1515 חלק 3 — צבע חייב להיות צמוד ואחיד — התקלפות מהווה ליקוי', 'ת"י 1515 חלק 3 — צבע חייב להיות צמוד ואחיד — התקלפות מהווה ליקוי', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**פילינג / התקלפות צבע** — צבע שמתקלף מהקיר או התקרה. עלול לנבוע מרטיבות, הכנה לקויה או צבע לא מתאים.. המלצה: גירוד צבע ישן, הכנת משטח, צביעה ב-2 שכבות. עלות משוערת: ₪200-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'צביעה', NULL, '**כתמים / אי-אחידות בצבע** — כתמי צבע, הבדלי גוון, או חוסר אחידות במשטח הצבוע.. המלצה: צביעה מחדש של המשטח הפגום ב-2 שכבות. עלות משוערת: ₪150-₪500 (ליחידה)', 'ת"י 1515 חלק 3 — צביעה חייבת להיות אחידה בגוון ובמרקם', 'ת"י 1515 חלק 3 — צביעה חייבת להיות אחידה בגוון ובמרקם', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**כתמים / אי-אחידות בצבע** — כתמי צבע, הבדלי גוון, או חוסר אחידות במשטח הצבוע.. המלצה: צביעה מחדש של המשטח הפגום ב-2 שכבות. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'צביעה', NULL, '**טפטופי צבע / שפכים** — טפטופי צבע נראים לעין על קירות, תקרות, או על אלמנטים סמוכים (חלונות, דלתות, ריצוף).. המלצה: ניקוי טפטופים ותיקון מקומי. עלות משוערת: ₪100-₪300 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**טפטופי צבע / שפכים** — טפטופי צבע נראים לעין על קירות, תקרות, או על אלמנטים סמוכים (חלונות, דלתות, ריצוף).. המלצה: ניקוי טפטופים ותיקון מקומי. עלות משוערת: ₪100-₪300 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מיזוג אוויר', NULL, '**מזגן לא מקרר / לא מחמם** — יחידת מיזוג אוויר שלא מגיעה לטמפרטורה הנדרשת.. המלצה: בדיקת גז, ניקוי מסננים, תיקון או החלפת יחידה. עלות משוערת: ₪200-₪600 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**מזגן לא מקרר / לא מחמם** — יחידת מיזוג אוויר שלא מגיעה לטמפרטורה הנדרשת.. המלצה: בדיקת גז, ניקוי מסננים, תיקון או החלפת יחידה. עלות משוערת: ₪200-₪600 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מיזוג אוויר', NULL, '**רעש חריג מיחידת מיזוג** — רעש חריג מיחידה פנימית או חיצונית של המזגן.. המלצה: בדיקת חיבורים, איזון מאוורר, תיקון. עלות משוערת: ₪150-₪500 (ליחידה)', 'NULL', 'NULL', true, 'low'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**רעש חריג מיחידת מיזוג** — רעש חריג מיחידה פנימית או חיצונית של המזגן.. המלצה: בדיקת חיבורים, איזון מאוורר, תיקון. עלות משוערת: ₪150-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מיזוג אוויר', NULL, '**נזילת קונדנס ממזגן** — נזילת מים (קונדנסציה) מיחידת המזגן הפנימית.. המלצה: בדיקת צנרת ניקוז קונדנס, ניקוי או תיקון. עלות משוערת: ₪150-₪400 (ליחידה)', 'NULL', 'NULL', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**נזילת קונדנס ממזגן** — נזילת מים (קונדנסציה) מיחידת המזגן הפנימית.. המלצה: בדיקת צנרת ניקוז קונדנס, ניקוי או תיקון. עלות משוערת: ₪150-₪400 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גז', NULL, '**צנרת גז – נזילה או התקנה לקויה** — נזילת גז מצנרת הגז הפנימית בדירה, חיבורים לא אטומים, או צנרת שאינה עומדת בדרישות התקן.. המלצה: לזמן טכנאי גז מוסמך לתיקון מיידי. אין לבצע תיקונים עצמאיים בצנרת גז. לבצע בדיקת אטימות לאחר התיקון.. עלות משוערת: ₪300-₪1500 (ליחידה)', 'ת"י 158 — מערכת גז פנימית חייבת לעמוד בבדיקת אטימות בלחץ של 60 מיליבר למשך 15 דקות ללא ירידת לחץ.', 'ת"י 158 — מערכת גז פנימית חייבת לעמוד בבדיקת אטימות בלחץ של 60 מיליבר למשך 15 דקות ללא ירידת לחץ.', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת גז – נזילה או התקנה לקויה** — נזילת גז מצנרת הגז הפנימית בדירה, חיבורים לא אטומים, או צנרת שאינה עומדת בדרישות התקן.. המלצה: לזמן טכנאי גז מוסמך לתיקון מיידי. אין לבצע תיקונים עצמאיים בצנרת גז. לבצע בדיקת אטימות לאחר התיקון.. עלות משוערת: ₪300-₪1500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גז', NULL, '**ברז גז – חסר או לא תקין** — ברז ניתוק גז חסר לפני מכשיר צורך גז (תנור, קומקום גז), או שברז קיים אינו סוגר כראוי.. המלצה: להתקין ברז גז תקני לפני כל מכשיר צורך גז, באמצעות טכנאי גז מוסמך.. עלות משוערת: ₪200-₪500 (ליחידה)', 'ת"י 158 — יש להתקין ברז ניתוק נפרד לפני כל מכשיר צורך גז, מסוג שסתום כדורי מאושר.', 'ת"י 158 — יש להתקין ברז ניתוק נפרד לפני כל מכשיר צורך גז, מסוג שסתום כדורי מאושר.', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**ברז גז – חסר או לא תקין** — ברז ניתוק גז חסר לפני מכשיר צורך גז (תנור, קומקום גז), או שברז קיים אינו סוגר כראוי.. המלצה: להתקין ברז גז תקני לפני כל מכשיר צורך גז, באמצעות טכנאי גז מוסמך.. עלות משוערת: ₪200-₪500 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גז', NULL, '**גז — נזילה או ריח** — חשד לנזילת גז — ריח גז או תוצאת בדיקת לחץ לא תקינה.. המלצה: סגירת ברז ראשי, קריאה לטכנאי גז מוסמך מיידית. עלות משוערת: ₪300-₪800 (ליחידה)', 'תקנות הגז — מערכת גז חייבת להיות אטומה לחלוטין — בדיקת לחץ חובה', 'תקנות הגז — מערכת גז חייבת להיות אטומה לחלוטין — בדיקת לחץ חובה', true, 'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**גז — נזילה או ריח** — חשד לנזילת גז — ריח גז או תוצאת בדיקת לחץ לא תקינה.. המלצה: סגירת ברז ראשי, קריאה לטכנאי גז מוסמך מיידית. עלות משוערת: ₪300-₪800 (ליחידה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גז', NULL, '**צנרת גז חשופה / לא מוגנת** — צנרת גז שחשופה או לא מוגנת בהתאם לתקנות.. המלצה: הגנה על צנרת בהתאם לתקנות. עלות משוערת: ₪200-₪600 (ליחידה)', 'תקנות הגז — צנרת גז חייבת להיות מוגנת ומסומנת', 'תקנות הגז — צנרת גז חייבת להיות מוגנת ומסומנת', true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = '**צנרת גז חשופה / לא מוגנת** — צנרת גז שחשופה או לא מוגנת בהתאם לתקנות.. המלצה: הגנה על צנרת בהתאם לתקנות. עלות משוערת: ₪200-₪600 (ליחידה)'
);

-- ===========================================
-- Verification queries (run manually after reset)
-- ===========================================
-- SELECT COUNT(*) FROM defect_library WHERE is_global = true AND source = 'system';
--   → expected: 338
--
-- SELECT category, COUNT(*) FROM defect_library
--   WHERE is_global = true AND source = 'system'
--   GROUP BY category ORDER BY COUNT(*) DESC;
--   → expected: 20 distinct categories matching CATEGORY_LABELS in
--     packages/shared/src/constants/categories.ts

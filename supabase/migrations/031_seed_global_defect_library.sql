-- Migration: 031_seed_global_defect_library_updated
-- Description: Seed 338 system defects with recommendation and price
-- Dependencies: 008_create_defect_library, 049_add_recommendation_price_to_defect_library

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'סדקים בטיח חיצוני — סדקים באורכים ובעומקים שונים בשכבת הטיח החיצוני של הבניין. סדקים אלו עלולים לאפשר חדירת מים ורטיבות לתוך המבנה, ולפגוע באיטום ובבידוד התרמי', 'ת"י 1415 — תקן טיח לבניינים — סדקים ברוחב מעל 0.5 מ"מ בטיח חיצוני אינם מותרים', 'ת"י 1415 — תקן טיח לבניינים — סדקים ברוחב מעל 0.5 מ"מ בטיח חיצוני אינם מותרים', 'ניקוי והרחבת הסדק, מילוי בחומר גמיש מתאים (אקרילי או פוליאורטני), וציפוי מחדש בטיח בהתאם למפרט', 150, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סדקים בטיח חיצוני — סדקים באורכים ובעומקים שונים בשכבת הטיח החיצוני של הבניין. סדקים אלו עלולים לאפשר חדירת מים ורטיבות לתוך המבנה, ולפגוע באיטום ובבידוד התרמי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'סדקים בטיח פנימי — סדקים בטיח הפנימי של הדירה, לרוב מופיעים ליד פינות חלונות, דלתות ומשקופים. עלולים להעיד על בעיות מבניות או התכווצות של הטיח', 'ת"י 1415 — סדקים ברוחב מעל 0.3 מ"מ בטיח פנימי אינם מותרים', 'ת"י 1415 — סדקים ברוחב מעל 0.3 מ"מ בטיח פנימי אינם מותרים', 'הרחבת הסדק עד לגילוי חומר תקין, מילוי בשפכטל גמיש, הדבקת רשת טיח, טיוח מחדש והחלקה', 120, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סדקים בטיח פנימי — סדקים בטיח הפנימי של הדירה, לרוב מופיעים ליד פינות חלונות, דלתות ומשקופים. עלולים להעיד על בעיות מבניות או התכווצות של הטיח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'נפיחות בטיח — בלון — אזורים בהם הטיח מתנפח ונפרד מהקיר (בלון טיח). בבדיקת הקשה ניתן לזהות צליל חלול. מעיד על הידבקות לקויה של שכבת הטיח למצע', 'ת"י 1415 — הטיח חייב להיצמד באופן מלא למשטח הבסיס ללא חללים', 'ת"י 1415 — הטיח חייב להיצמד באופן מלא למשטח הבסיס ללא חללים', 'פירוק הטיח המנופח עד לגילוי מצע יציב, ניקוי והרטבת המשטח, טיוח מחדש בשכבות בהתאם למפרט', 180, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נפיחות בטיח — בלון — אזורים בהם הטיח מתנפח ונפרד מהקיר (בלון טיח). בבדיקת הקשה ניתן לזהות צליל חלול. מעיד על הידבקות לקויה של שכבת הטיח למצע'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'טיח מתפורר — שכבת הטיח מתפוררת ונושרת בחלקים. מעיד על שימוש בחומר לקוי, יחס מים-מלט לא נכון, או חשיפה לתנאי מזג אוויר קיצוניים', 'ת"י 1415 — חוזק הטיח צריך לעמוד בדרישות המינימום של 2.5 מגה-פסקל לטיח פנימי ו-5 מגה-פסקל לטיח חיצוני', 'ת"י 1415 — חוזק הטיח צריך לעמוד בדרישות המינימום של 2.5 מגה-פסקל לטיח פנימי ו-5 מגה-פסקל לטיח חיצוני', 'הסרה מלאה של הטיח הפגום, הכנת המשטח מחדש כולל יישום פריימר, טיוח מחדש בחומר תקני', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'טיח מתפורר — שכבת הטיח מתפוררת ונושרת בחלקים. מעיד על שימוש בחומר לקוי, יחס מים-מלט לא נכון, או חשיפה לתנאי מזג אוויר קיצוניים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'חוסר מישוריות בטיח — משטח הטיח אינו ישר ואינו חלק — נראים גלים, בליטות או שקעים. ניתן לבדוק על ידי הצמדת סרגל ישר באורך 2 מ'' לקיר', 'ת"י 1415 — סטייה מקסימלית מותרת של 3 מ"מ לכל 2 מטר אורך בטיח פנימי רגיל, 2 מ"מ בטיח מוחלק', 'ת"י 1415 — סטייה מקסימלית מותרת של 3 מ"מ לכל 2 מטר אורך בטיח פנימי רגיל, 2 מ"מ בטיח מוחלק', 'החלקה מחדש של האזורים הבעייתיים על ידי הוספת שכבת טיח דקה וליטוש, או שפכטל והחלקה', 120, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר מישוריות בטיח — משטח הטיח אינו ישר ואינו חלק — נראים גלים, בליטות או שקעים. ניתן לבדוק על ידי הצמדת סרגל ישר באורך 2 מ'' לקיר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'חוסר אנכיות בטיח — קיר הטיח אינו אנכי — סטייה ממישור אנכי. ניתן לזהות על ידי בדיקה עם פלס לייזר או פלס מים', 'ת"י 1415 — סטייה מאנכיות מותרת של עד 5 מ"מ לכל 3 מטר גובה', 'ת"י 1415 — סטייה מאנכיות מותרת של עד 5 מ"מ לכל 3 מטר גובה', 'תיקון על ידי הוספת שכבת טיח מיישרת או פירוק וטיוח מחדש במקרים חמורים', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר אנכיות בטיח — קיר הטיח אינו אנכי — סטייה ממישור אנכי. ניתן לזהות על ידי בדיקה עם פלס לייזר או פלס מים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'פינות טיח לא ישרות — פינות הקירות (זווית פנימית או חיצונית) אינן ישרות ו/או אינן בזווית 90 מעלות. בולט במיוחד בהצבת ריהוט ומטבח', 'ת"י 1415 — סטייה מותרת של עד 3 מ"מ לכל 2 מטר אורך בפינות', 'ת"י 1415 — סטייה מותרת של עד 3 מ"מ לכל 2 מטר אורך בפינות', 'יישור הפינות באמצעות פסי פינה מתכתיים וטיוח מחדש, או תיקון נקודתי בשפכטל', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פינות טיח לא ישרות — פינות הקירות (זווית פנימית או חיצונית) אינן ישרות ו/או אינן בזווית 90 מעלות. בולט במיוחד בהצבת ריהוט ומטבח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'טיח חסר בשליצים ופתחים — אזורים ללא טיח או עם טיח חלקי סביב שליצי חשמל, אינסטלציה, או פתחי חלונות ודלתות. מעיד על עבודה לא מושלמת', 'ת"י 1415 — כל המשטחים חייבים להיות מכוסים בטיח באופן אחיד, כולל סביב פתחים ושליצים', 'ת"י 1415 — כל המשטחים חייבים להיות מכוסים בטיח באופן אחיד, כולל סביב פתחים ושליצים', 'מילוי השליצים בטיט תיקון מתאים, יישום רשת טיח על האזור, וטיוח מלא של המשטח', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'טיח חסר בשליצים ופתחים — אזורים ללא טיח או עם טיח חלקי סביב שליצי חשמל, אינסטלציה, או פתחי חלונות ודלתות. מעיד על עבודה לא מושלמת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'רטיבות בטיח — כתמי רטיבות — כתמי רטיבות הנראים על שכבת הטיח, לעיתים מלווים בעובש או צבע שונה. מעיד על חדירת מים מבחוץ או דליפה פנימית', 'ת"י 1415 — טיח חיצוני חייב להוות מחסום מפני חדירת מים', 'ת"י 1415 — טיח חיצוני חייב להוות מחסום מפני חדירת מים', 'איתור מקור הרטיבות ותיקונו, ייבוש הקיר, טיפול אנטי-עובשי, טיוח מחדש עם חומר עמיד ברטיבות', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רטיבות בטיח — כתמי רטיבות — כתמי רטיבות הנראים על שכבת הטיח, לעיתים מלווים בעובש או צבע שונה. מעיד על חדירת מים מבחוץ או דליפה פנימית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'סדק אלכסוני מעל משקוף — סדק אלכסוני היוצא מפינת משקוף דלת או חלון כלפי מעלה. ליקוי נפוץ מאוד המעיד על חוסר חיזוק מתאים (רשת או קורת משקוף) באזור הפתח', 'ת"י 1415 — יש לחזק את אזורי הפתחים ברשת טיח או חיזוק מתאים למניעת סדקים', 'ת"י 1415 — יש לחזק את אזורי הפתחים ברשת טיח או חיזוק מתאים למניעת סדקים', 'הרחבת הסדק, הדבקת רשת פיברגלס על כל אורך הסדק ומעבר, טיוח מחדש והחלקה', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סדק אלכסוני מעל משקוף — סדק אלכסוני היוצא מפינת משקוף דלת או חלון כלפי מעלה. ליקוי נפוץ מאוד המעיד על חוסר חיזוק מתאים (רשת או קורת משקוף) באזור הפתח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'סדק מפאי (שערה) בטיח תקרה — סדקים דקים (שערה) ברשת על פני שטח הטיח בתקרה. נגרמים מהתכווצות הטיח או מתזוזות מבניות קלות', 'ת"י 1415 — סדקי שערה ברוחב עד 0.1 מ"מ נחשבים ליקוי אסתטי בלבד ואינם פוגעים בביצוע הטיח', 'ת"י 1415 — סדקי שערה ברוחב עד 0.1 מ"מ נחשבים ליקוי אסתטי בלבד ואינם פוגעים בביצוע הטיח', 'מריחת שפכטל גמיש על כל המשטח, ליטוש, וצביעה מחדש בצבע אקרילי גמיש', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סדק מפאי (שערה) בטיח תקרה — סדקים דקים (שערה) ברשת על פני שטח הטיח בתקרה. נגרמים מהתכווצות הטיח או מתזוזות מבניות קלות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'טיח מזרמק — עובש על הטיח — נקודות או כתמים כהים על הטיח המעידים על נוכחות עובש. בעיה בריאותית הנובעת מרטיבות מתמשכת ואוורור לקוי', 'ת"י 1415 — טיח חייב להיות יבש ונקי מעובש', 'ת"י 1415 — טיח חייב להיות יבש ונקי מעובש', 'טיפול במקור הרטיבות, ניקוי אנטי-פטרייתי, יישום ציפוי אנטי-עובשי, וצביעה בצבע עמיד ברטיבות', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'טיח מזרמק — עובש על הטיח — נקודות או כתמים כהים על הטיח המעידים על נוכחות עובש. בעיה בריאותית הנובעת מרטיבות מתמשכת ואוורור לקוי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'פני שטח טיח גסים — חוסר החלקה — פני שטח הטיח הפנימי גסים ולא חלקים כנדרש. מקשה על צביעה אחידה ופוגע במראה הסופי', 'ת"י 1415 — טיח פנימי מוחלק חייב להיות חלק ואחיד ללא גבשושיות או שקעים', 'ת"י 1415 — טיח פנימי מוחלק חייב להיות חלק ואחיד ללא גבשושיות או שקעים', 'ליטוש מכני של המשטח, מריחת שכבת החלקה דקה, וליטוש סופי', 60, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פני שטח טיח גסים — חוסר החלקה — פני שטח הטיח הפנימי גסים ולא חלקים כנדרש. מקשה על צביעה אחידה ופוגע במראה הסופי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'עובי טיח לא מספיק — שכבת הטיח דקה מהנדרש בתקן, מה שמפחית את ההגנה מפני רטיבות ותנאי מזג אוויר ומקצר את אורך חיי הטיח', 'ת"י 1415 — עובי מינימלי של טיח חיצוני: 20 מ"מ (שתי שכבות). טיח פנימי: 10 מ"מ', 'ת"י 1415 — עובי מינימלי של טיח חיצוני: 20 מ"מ (שתי שכבות). טיח פנימי: 10 מ"מ', 'הוספת שכבת טיח נוספת להשלמת העובי הנדרש, עם שכבת חיבור (ספריץ) בין השכבות', 120, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'עובי טיח לא מספיק — שכבת הטיח דקה מהנדרש בתקן, מה שמפחית את ההגנה מפני רטיבות ותנאי מזג אוויר ומקצר את אורך חיי הטיח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'חוסר חיזוק רשת בטיח על תפר בלוקים-בטון — טיח שבוצע על תפר בין חומרים שונים (בלוקים ובטון) ללא רשת חיזוק, מה שגורם לסדקים לאורך קו התפר', 'ת"י 1415 — יש להניח רשת טיח על כל תפר בין חומרים שונים (בלוקים/בטון) למניעת סדקים', 'ת"י 1415 — יש להניח רשת טיח על כל תפר בין חומרים שונים (בלוקים/בטון) למניעת סדקים', 'חשיפת התפר, הדבקת רשת פיברגלס ברוחב 20 ס"מ לפחות על כל אורך התפר, טיוח מחדש', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר חיזוק רשת בטיח על תפר בלוקים-בטון — טיח שבוצע על תפר בין חומרים שונים (בלוקים ובטון) ללא רשת חיזוק, מה שגורם לסדקים לאורך קו התפר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'סדק כיווץ בטיח — סדק דק בטיח הנובע מכיווץ והתייבשות. שכיח בחיבורי קירות ובסביבת פתחים', 'ת"י 1515 — תקן ישראלי לעבודות טיח — סדקי כיווץ עד 0.5 מ"מ נחשבים תקינים', 'ת"י 1515 — תקן ישראלי לעבודות טיח — סדקי כיווץ עד 0.5 מ"מ נחשבים תקינים', 'מילוי הסדק בחומר אקרילי גמיש וצביעה מחדש', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סדק כיווץ בטיח — סדק דק בטיח הנובע מכיווץ והתייבשות. שכיח בחיבורי קירות ובסביבת פתחים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'סדק אלכסוני בטיח — סדק אלכסוני בטיח, עלול להעיד על תזוזת מבנה או שקיעה דיפרנציאלית. דורש בדיקה הנדסית', 'ת"י 1515 — סדק אלכסוני מעל 1 מ"מ מחייב בדיקת מהנדס', 'ת"י 1515 — סדק אלכסוני מעל 1 מ"מ מחייב בדיקת מהנדס', 'בדיקת מהנדס קונסטרוקציה, תיקון בהתאם לממצאים', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סדק אלכסוני בטיח — סדק אלכסוני בטיח, עלול להעיד על תזוזת מבנה או שקיעה דיפרנציאלית. דורש בדיקה הנדסית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'בליטות וגבשושיות בטיח — משטח טיח לא חלק — בליטות, גבשושיות או אי-סדרים במרקם', 'ת"י 1515 — סטייה מותרת של 3 מ"מ ב-2 מטר', 'ת"י 1515 — סטייה מותרת של 3 מ"מ ב-2 מטר', 'שיוף מקומי וצביעה מחדש, או טיח מחדש בחלק הפגום', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'בליטות וגבשושיות בטיח — משטח טיח לא חלק — בליטות, גבשושיות או אי-סדרים במרקם'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'טיח מתקלף / מתפורר — טיח שמתקלף או מתפורר מהקיר, חושף את השכבה שמתחת. עלול להעיד על בעיית רטיבות', 'ת"י 1515 — טיח חייב להיות צמוד לבסיס — התקלפות מהווה כשל', 'ת"י 1515 — טיח חייב להיות צמוד לבסיס — התקלפות מהווה כשל', 'הסרת טיח פגום, בדיקת רטיבות, טיח מחדש וצביעה', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'טיח מתקלף / מתפורר — טיח שמתקלף או מתפורר מהקיר, חושף את השכבה שמתחת. עלול להעיד על בעיית רטיבות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'אריח רצפה שבור או סדוק — אריח רצפה עם שבר, סדק או פגם גלוי. עלול להיגרם מחבטה, עומס נקודתי, או הדבקה לקויה שגרמה למתח באריח', 'ת"י 1555 חלק 3 — אריחי ריצוף חייבים להיות שלמים, ללא סדקים, שברים או פגמים', 'ת"י 1555 חלק 3 — אריחי ריצוף חייבים להיות שלמים, ללא סדקים, שברים או פגמים', 'הסרת האריח הפגום, ניקוי המשטח, הדבקת אריח חדש זהה בדבק מתאים ומילוי רובה', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אריח רצפה שבור או סדוק — אריח רצפה עם שבר, סדק או פגם גלוי. עלול להיגרם מחבטה, עומס נקודתי, או הדבקה לקויה שגרמה למתח באריח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'אריח רצפה רופף — חלל מתחת לאריח — אריח רצפה שאינו מודבק כראוי ויש חלל בינו לבין המצע. ניתן לזהות על ידי הקשה — צליל חלול. על פי התקן, כיסוי הדבק חייב להיות מינימום 65%', 'ת"י 1555 חלק 3 — כיסוי הדבק מתחת לאריח חייב להיות מינימום 65% משטח האריח, ובאזורים רטובים 80%', 'ת"י 1555 חלק 3 — כיסוי הדבק מתחת לאריח חייב להיות מינימום 65% משטח האריח, ובאזורים רטובים 80%', 'הרמת האריח, ניקוי המשטח מדבק ישן, הדבקה מחדש בשיטת סרוק כפול (דבק על המצע ועל גב האריח), מילוי רובה', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אריח רצפה רופף — חלל מתחת לאריח — אריח רצפה שאינו מודבק כראוי ויש חלל בינו לבין המצע. ניתן לזהות על ידי הקשה — צליל חלול. על פי התקן, כיסוי הדבק חייב להיות מינימום 65%'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'הפרשי גובה בין אריחי רצפה — שיניים — הפרש גובה (שן) בין אריחים סמוכים. גורם למעידה, ומהווה ליקוי אסתטי ובטיחותי כאחד', 'ת"י 1555 חלק 3 — הפרש גובה מקסימלי מותר בין אריחים סמוכים: 1 מ"מ לריצוף רגיל, 0.5 מ"מ לריצוף מוחלק', 'ת"י 1555 חלק 3 — הפרש גובה מקסימלי מותר בין אריחים סמוכים: 1 מ"מ לריצוף רגיל, 0.5 מ"מ לריצוף מוחלק', 'ליטוש מקומי של השן באמצעות מכונת ליטוש יהלום, או החלפת האריח הבולט והדבקתו מחדש בגובה הנכון', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'הפרשי גובה בין אריחי רצפה — שיניים — הפרש גובה (שן) בין אריחים סמוכים. גורם למעידה, ומהווה ליקוי אסתטי ובטיחותי כאחד'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'חוסר מישוריות בריצוף — משטח הרצפה אינו ישר — שקעים או בליטות. ניתן לבדוק באמצעות סרגל ישר באורך 2 מ''. מונע הנחה תקינה של ריהוט', 'ת"י 1555 חלק 3 — סטייה מקסימלית מותרת ממישוריות: 3 מ"מ לכל 2 מטר אורך', 'ת"י 1555 חלק 3 — סטייה מקסימלית מותרת ממישוריות: 3 מ"מ לכל 2 מטר אורך', 'פירוק אריחים באזור הבעייתי, יישור תשתית המצע, והדבקה מחדש בשיטה תקנית', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר מישוריות בריצוף — משטח הרצפה אינו ישר — שקעים או בליטות. ניתן לבדוק באמצעות סרגל ישר באורך 2 מ''. מונע הנחה תקינה של ריהוט'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'רובה חסרה או פגומה — חוסר ברובה (פוגה) בין האריחים או רובה שבורה ומתפוררת. מאפשר חדירת מים ולכלוך בין האריחים', 'ת"י 1555 חלק 3 — כל המרווחים בין אריחים חייבים להיות מלאים ברובה באופן אחיד', 'ת"י 1555 חלק 3 — כל המרווחים בין אריחים חייבים להיות מלאים ברובה באופן אחיד', 'ניקוי הרובה הישנה, מילוי מחדש ברובה תקנית בצבע מתאים, ניקוי עודפים', 60, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רובה חסרה או פגומה — חוסר ברובה (פוגה) בין האריחים או רובה שבורה ומתפוררת. מאפשר חדירת מים ולכלוך בין האריחים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'שיפוע לקוי בריצוף מרפסת/מקלחת — שיפוע הריצוף אינו מספיק או שהוא בכיוון הלא נכון, מה שגורם להצטברות מים על הרצפה במקום ניקוז לעבר הנקז', 'ת"י 1555 חלק 3 — שיפוע מינימלי נדרש של 1.5% לכיוון הנקז באזורים רטובים ומרפסות', 'ת"י 1555 חלק 3 — שיפוע מינימלי נדרש של 1.5% לכיוון הנקז באזורים רטובים ומרפסות', 'פירוק הריצוף באזור הבעייתי, תיקון שכבת השיפוע, ריצוף מחדש עם בדיקת שיפוע', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שיפוע לקוי בריצוף מרפסת/מקלחת — שיפוע הריצוף אינו מספיק או שהוא בכיוון הלא נכון, מה שגורם להצטברות מים על הרצפה במקום ניקוז לעבר הנקז'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'מרווח לא אחיד בין אריחים — רוחב הרובה אינו אחיד בין האריחים — מרווחים משתנים בגודלם. פוגע באסתטיקה ומעיד על עבודה לא מקצועית', 'ת"י 1555 חלק 3 — מרווח הרובה חייב להיות אחיד בכל הריצוף עם סטייה מותרת של עד 1 מ"מ', 'ת"י 1555 חלק 3 — מרווח הרובה חייב להיות אחיד בכל הריצוף עם סטייה מותרת של עד 1 מ"מ', 'באזורים קטנים — מילוי רובה מחדש. באזורים נרחבים — פירוק והנחה מחדש עם צלבונים', 150, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מרווח לא אחיד בין אריחים — רוחב הרובה אינו אחיד בין האריחים — מרווחים משתנים בגודלם. פוגע באסתטיקה ומעיד על עבודה לא מקצועית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'אריח חיפוי קיר רופף — אריח חיפוי קיר שאינו מודבק כראוי ונע בלחיצה. מהווה סכנה ליפול ולגרום לפציעה', 'ת"י 1555 חלק 3 — כיסוי הדבק באריחי קיר חייב להיות מינימום 80% משטח האריח', 'ת"י 1555 חלק 3 — כיסוי הדבק באריחי קיר חייב להיות מינימום 80% משטח האריח', 'הסרת האריח, ניקוי מלא של הדבק הישן מהקיר ומגב האריח, הדבקה מחדש בדבק C2 עם סרוק כפול', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אריח חיפוי קיר רופף — אריח חיפוי קיר שאינו מודבק כראוי ונע בלחיצה. מהווה סכנה ליפול ולגרום לפציעה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'אריח חיפוי קיר סדוק — סדק באריח חיפוי קיר. עלול להיגרם ממתח פנימי כתוצאה מהדבקה לקויה, תזוזת מבנה, או חבטה', 'ת"י 1555 חלק 3 — אריחי חיפוי חייבים להיות שלמים וללא סדקים', 'ת"י 1555 חלק 3 — אריחי חיפוי חייבים להיות שלמים וללא סדקים', 'החלפת האריח הסדוק באריח חדש זהה, הדבקה בדבק C2 ומילוי רובה', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אריח חיפוי קיר סדוק — סדק באריח חיפוי קיר. עלול להיגרם ממתח פנימי כתוצאה מהדבקה לקויה, תזוזת מבנה, או חבטה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'חוסר התאמת דוגמה/כיוון אריחים — אריחים שהונחו בכיוון לא נכון או שהדוגמה אינה מותאמת ביניהם. בולט בעיקר באריחי שיש או אריחים עם גידים', 'ת"י 1555 חלק 3 — אריחים עם דוגמה או כיוון מוגדר חייבים להיות מונחים בהתאמה ובכיוון אחיד', 'ת"י 1555 חלק 3 — אריחים עם דוגמה או כיוון מוגדר חייבים להיות מונחים בהתאמה ובכיוון אחיד', 'החלפת האריחים שהונחו שלא כדין והנחתם מחדש בכיוון הנכון', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר התאמת דוגמה/כיוון אריחים — אריחים שהונחו בכיוון לא נכון או שהדוגמה אינה מותאמת ביניהם. בולט בעיקר באריחי שיש או אריחים עם גידים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'חיתוך אריח לא מדויק — אריחים שנחתכו בצורה לא מדויקת — קצוות משוננים, לא ישרים, או חיתוכים רחבים מדי/צרים מדי סביב צנרת או פתחים', 'ת"י 1555 חלק 3 — חיתוכי אריחים חייבים להיות נקיים ומדויקים ללא שברים בקצוות', 'ת"י 1555 חלק 3 — חיתוכי אריחים חייבים להיות נקיים ומדויקים ללא שברים בקצוות', 'הסרת האריח הפגום וחיתוך מחדש באמצעות מסור רטוב מקצועי, הדבקה ומילוי רובה', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיתוך אריח לא מדויק — אריחים שנחתכו בצורה לא מדויקת — קצוות משוננים, לא ישרים, או חיתוכים רחבים מדי/צרים מדי סביב צנרת או פתחים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'חוסר בנוטפים (כיוון נטייה) באדן חלון — אדן חלון מרוצף ללא שיפוע כלפי חוץ ו/או ללא חריץ נוטפים, מה שמאפשר למים לזרום לעבר הקיר ולגרום לרטיבות', 'ת"י 1555 חלק 3 — אדני חלון חיצוניים חייבים לכלול שיפוע כלפי חוץ וחריץ נוטפים', 'ת"י 1555 חלק 3 — אדני חלון חיצוניים חייבים לכלול שיפוע כלפי חוץ וחריץ נוטפים', 'התקנת אדן חדש עם שיפוע מינימלי של 3% כלפי חוץ וחריץ נוטפים בתחתית', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר בנוטפים (כיוון נטייה) באדן חלון — אדן חלון מרוצף ללא שיפוע כלפי חוץ ו/או ללא חריץ נוטפים, מה שמאפשר למים לזרום לעבר הקיר ולגרום לרטיבות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'קובייה רטט לקויה — חלל מתחת לריצוף חיצוני — אריחי ריצוף מרפסת או שביל חיצוני עם חללים מתחתיהם, נשמע צליל חלול בהקשה. מסוכן במיוחד במרפסות בשל חשיפה לתנאי מזג אוויר', 'ת"י 1555 חלק 3 — כיסוי דבק מינימלי של 80% נדרש בריצוף חיצוני ואזורים רטובים', 'ת"י 1555 חלק 3 — כיסוי דבק מינימלי של 80% נדרש בריצוף חיצוני ואזורים רטובים', 'פירוק הריצוף הפגום, הכנת משטח תקני עם שכבת דבק מלאה, הנחה מחדש בשיטת סרוק כפול', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'קובייה רטט לקויה — חלל מתחת לריצוף חיצוני — אריחי ריצוף מרפסת או שביל חיצוני עם חללים מתחתיהם, נשמע צליל חלול בהקשה. מסוכן במיוחד במרפסות בשל חשיפה לתנאי מזג אוויר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'רצף לא אחיד של אריחים בין חדרים — חוסר רציפות בריצוף במעבר בין חדרים — אריחים שאינם מיושרים או מתחלפים בצורה לא אחידה בין המרחבים', 'ת"י 1555 חלק 3 — ריצוף חייב להיות רציף ומיושר במעברים בין חדרים, אלא אם כן צוין אחרת במפרט', 'ת"י 1555 חלק 3 — ריצוף חייב להיות רציף ומיושר במעברים בין חדרים, אלא אם כן צוין אחרת במפרט', 'התאמת הריצוף במעברים על ידי פירוק מקומי והנחה מחדש עם יישור מדויק', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רצף לא אחיד של אריחים בין חדרים — חוסר רציפות בריצוף במעבר בין חדרים — אריחים שאינם מיושרים או מתחלפים בצורה לא אחידה בין המרחבים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'אריח פגום מהמפעל — כתמים/שינוי גוון — אריחים עם פגמים מהמפעל כגון כתמים, שינוי גוון בולט, נקודות שחורות, או גימור לא אחיד. לרוב נובע משימוש באריחים מסדרות ייצור שונות', 'ת"י 1555 חלק 1 — אריחים חייבים להיות ממוינים לפי דרגות איכות — דרגה ראשונה נדרשת למגורים', 'ת"י 1555 חלק 1 — אריחים חייבים להיות ממוינים לפי דרגות איכות — דרגה ראשונה נדרשת למגורים', 'החלפת האריחים הפגומים באריחים מאותה סדרת ייצור (LOT) כדי להבטיח אחידות', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אריח פגום מהמפעל — כתמים/שינוי גוון — אריחים עם פגמים מהמפעל כגון כתמים, שינוי גוון בולט, נקודות שחורות, או גימור לא אחיד. לרוב נובע משימוש באריחים מסדרות ייצור שונות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'סף דלת חסר או לא תקין — סף (מפתן) בין שני סוגי ריצוף או בפתח דלת חסר, פגום, או לא מותקן כראוי. גורם למפגע בטיחותי ולחדירת מים', 'ת"י 1555 חלק 3 — מעברים בין סוגי ריצוף שונים חייבים לכלול סף מתאים או פרופיל מעבר', 'ת"י 1555 חלק 3 — מעברים בין סוגי ריצוף שונים חייבים לכלול סף מתאים או פרופיל מעבר', 'התקנת סף אלומיניום או פליז מתאים, הדבקה ועיגון מכני', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סף דלת חסר או לא תקין — סף (מפתן) בין שני סוגי ריצוף או בפתח דלת חסר, פגום, או לא מותקן כראוי. גורם למפגע בטיחותי ולחדירת מים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'ריצוף קרמיקה עם החלקה לא מספקת — אריחי קרמיקה ברצפה עם מקדם החלקה נמוך מהנדרש, במיוחד באזורים רטובים כמו חדרי רחצה וכניסות. מהווה סכנת החלקה', 'ת"י 1555 חלק 1 — אריחי רצפה באזורים רטובים חייבים לעמוד בדרישת מקדם החלקה R10 לפחות', 'ת"י 1555 חלק 1 — אריחי רצפה באזורים רטובים חייבים לעמוד בדרישת מקדם החלקה R10 לפחות', 'החלפת האריחים באריחים עם מקדם החלקה מתאים (R10-R11 לאזורים רטובים) או יישום ציפוי אנטי-סליפ', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ריצוף קרמיקה עם החלקה לא מספקת — אריחי קרמיקה ברצפה עם מקדם החלקה נמוך מהנדרש, במיוחד באזורים רטובים כמו חדרי רחצה וכניסות. מהווה סכנת החלקה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'קרמיקה מנוקדת/מנומרת שלא בהתאם למפרט — אריחי קרמיקה שהותקנו אינם תואמים את הדגם, הצבע או הגוון שנבחר על ידי הרוכש ומופיע במפרט הטכני', 'NULL', 'NULL', 'החלפת האריחים שאינם תואמים באריחים מהדגם הנכון בהתאם למפרט', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'קרמיקה מנוקדת/מנומרת שלא בהתאם למפרט — אריחי קרמיקה שהותקנו אינם תואמים את הדגם, הצבע או הגוון שנבחר על ידי הרוכש ומופיע במפרט הטכני'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'מפלס ריצוף לא אחיד בין חדרים — הפרש גובה בין ריצוף בחדרים שונים, יוצר מדרגה קטנה במעבר. מפגע בטיחותי ומעיד על תכנון או ביצוע לקוי של שכבת היישור', 'ת"י 1555 חלק 3 — מפלס הריצוף חייב להיות אחיד בכל הדירה למעט אזורים רטובים שם נדרש הפרש גובה מבוקר', 'ת"י 1555 חלק 3 — מפלס הריצוף חייב להיות אחיד בכל הדירה למעט אזורים רטובים שם נדרש הפרש גובה מבוקר', 'פירוק הריצוף באזור המעבר, תיקון שכבת היישור, הנחה מחדש עם מפלס אחיד', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מפלס ריצוף לא אחיד בין חדרים — הפרש גובה בין ריצוף בחדרים שונים, יוצר מדרגה קטנה במעבר. מפגע בטיחותי ומעיד על תכנון או ביצוע לקוי של שכבת היישור'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'ריצוף פורצלן עם שריטות/סימנים — שריטות או סימני שפשוף על אריחי פורצלן שנגרמו במהלך עבודות הבנייה, העברת ציוד כבד, או ניקוי לא מתאים', 'ת"י 1555 חלק 1 — אריחים חייבים להימסר ללא פגמים, שריטות או סימנים', 'ת"י 1555 חלק 1 — אריחים חייבים להימסר ללא פגמים, שריטות או סימנים', 'ליטוש מקצועי של האריחים הפגומים. אם השריטות עמוקות — החלפת האריח', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ריצוף פורצלן עם שריטות/סימנים — שריטות או סימני שפשוף על אריחי פורצלן שנגרמו במהלך עבודות הבנייה, העברת ציוד כבד, או ניקוי לא מתאים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'אי-התאמה בין ריצוף לפתח ניקוז — ריצוף שאינו מותאם לפתח הניקוז (נקז רצפה) — האריח חוסם חלקית את הנקז, או שאין שיפוע מתאים לכיוון הנקז', 'ת"י 1555 חלק 3 — ריצוף סביב נקזים חייב לאפשר ניקוז מלא עם שיפוע מכל הכיוונים לעבר הנקז', 'ת"י 1555 חלק 3 — ריצוף סביב נקזים חייב לאפשר ניקוז מלא עם שיפוע מכל הכיוונים לעבר הנקז', 'חיתוך מדויק של האריחים סביב הנקז, תיקון השיפוע מכל הכיוונים', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אי-התאמה בין ריצוף לפתח ניקוז — ריצוף שאינו מותאם לפתח הניקוז (נקז רצפה) — האריח חוסם חלקית את הנקז, או שאין שיפוע מתאים לכיוון הנקז'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'פלינטוס (סוקל) רופף או מנותק — פלינטוס (רצועת ריצוף בתחתית הקיר) שאינו מודבק כראוי, זזה בלחיצה, או מנותק מהקיר. מאפשר חדירת לכלוך ומים', 'ת"י 1555 חלק 3 — פלינטוס חייב להיות מודבק באופן מלא לקיר ולרצפה ללא חללים', 'ת"י 1555 חלק 3 — פלינטוס חייב להיות מודבק באופן מלא לקיר ולרצפה ללא חללים', 'הסרת הפלינטוס, ניקוי המשטח, הדבקה מחדש בדבק C2 ומילוי סיליקון בפינה העליונה', 60, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פלינטוס (סוקל) רופף או מנותק — פלינטוס (רצועת ריצוף בתחתית הקיר) שאינו מודבק כראוי, זזה בלחיצה, או מנותק מהקיר. מאפשר חדירת לכלוך ומים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'תפר התפשטות חסר בריצוף רצפה — ריצוף על שטח גדול (מעל 40 מ"ר) ללא תפר התפשטות. עלול לגרום להתנפחות הריצוף (טנטינג) בעקבות שינויי טמפרטורה', 'ת"י 1555 חלק 3 — יש להותיר תפר התפשטות כל 40 מ"ר בריצוף פנימי ו-16 מ"ר בריצוף חיצוני', 'ת"י 1555 חלק 3 — יש להותיר תפר התפשטות כל 40 מ"ר בריצוף פנימי ו-16 מ"ר בריצוף חיצוני', 'חיתוך תפר התפשטות ברוחב 8-10 מ"מ במיקומים המתאימים, מילוי בחומר גמיש', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תפר התפשטות חסר בריצוף רצפה — ריצוף על שטח גדול (מעל 40 מ"ר) ללא תפר התפשטות. עלול לגרום להתנפחות הריצוף (טנטינג) בעקבות שינויי טמפרטורה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'התנפחות ריצוף — טנטינג — אריחי רצפה שהתנפחו ועלו ממקומם (טנטינג). תופעה המלווה לרוב בצליל פקיעה ונגרמת מהתפשטות תרמית ללא תפרי התפשטות מספקים', 'ת"י 1555 חלק 3 — ריצוף חייב לכלול תפרי התפשטות למניעת טנטינג', 'ת"י 1555 חלק 3 — ריצוף חייב לכלול תפרי התפשטות למניעת טנטינג', 'פירוק הריצוף שנפגע, תיקון תשתית היישור, הנחה מחדש עם תפרי התפשטות תקניים', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'התנפחות ריצוף — טנטינג — אריחי רצפה שהתנפחו ועלו ממקומם (טנטינג). תופעה המלווה לרוב בצליל פקיעה ונגרמת מהתפשטות תרמית ללא תפרי התפשטות מספקים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'אריח ריצוף שבור / סדוק — אריח ריצוף עם סדק, שבר או פגיעה גלויה', 'ת"י 1555 — אריחים חייבים להיות שלמים ללא סדקים או שברים', 'ת"י 1555 — אריחים חייבים להיות שלמים ללא סדקים או שברים', 'החלפת אריח פגום באריח זהה', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אריח ריצוף שבור / סדוק — אריח ריצוף עם סדק, שבר או פגיעה גלויה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'ריצוף לא ישר / לא במפלס — הפרשי גובה בין אריחים סמוכים. מורגש בהליכה או נראה לעין', 'ת"י 1555 — הפרש גובה מותר בין אריחים: עד 1 מ"מ', 'ת"י 1555 — הפרש גובה מותר בין אריחים: עד 1 מ"מ', 'הרמת אריחים בעייתיים והנחה מחדש עם יישור', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ריצוף לא ישר / לא במפלס — הפרשי גובה בין אריחים סמוכים. מורגש בהליכה או נראה לעין'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'ריצוף מתנדנד / חלול (הולו) — אריח שמשמיע צליל חלול בהקשה — מעיד על חוסר הדבקה מלאה לבסיס', 'ת"י 1555 — כיסוי דבק מינימלי 80% משטח האריח', 'ת"י 1555 — כיסוי דבק מינימלי 80% משטח האריח', 'הרמת אריח, ניקוי בסיס, הדבקה מחדש עם כיסוי מלא', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ריצוף מתנדנד / חלול (הולו) — אריח שמשמיע צליל חלול בהקשה — מעיד על חוסר הדבקה מלאה לבסיס'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'שיפוע לקוי בריצוף מרפסת — שיפוע ריצוף במרפסת לא מכוון לניקוז — מים נשארים על המשטח', 'ת"י 1555 / ת"י 1515.3 — שיפוע מינימלי במרפסת: 1.5% לכיוון הניקוז', 'ת"י 1555 / ת"י 1515.3 — שיפוע מינימלי במרפסת: 1.5% לכיוון הניקוז', 'פירוק ריצוף והנחה מחדש עם שיפוע תקני', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שיפוע לקוי בריצוף מרפסת — שיפוע ריצוף במרפסת לא מכוון לניקוז — מים נשארים על המשטח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'הצפה של דבק אריחים מהרובה — דבק אריחים שעלה ובלט מתוך קווי הרובה בין האריחים. נראה כחומר לבן/אפור שאינו רובה. נגרם משימוש ביותר מדי דבק', 'ת"י 1555 חלק 3 — דבק אריחים לא יבלוט מעבר לתפרי הרובה', 'ת"י 1555 חלק 3 — דבק אריחים לא יבלוט מעבר לתפרי הרובה', 'הסרת הדבק העודף בעזרת כלי חד, ניקוי התפרים ומילוי מחדש ברובה נקייה', 50, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'הצפה של דבק אריחים מהרובה — דבק אריחים שעלה ובלט מתוך קווי הרובה בין האריחים. נראה כחומר לבן/אפור שאינו רובה. נגרם משימוש ביותר מדי דבק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'חיפוי קירות חדר רחצה לא מלא — חיפוי הקרמיקה בחדר הרחצה אינו מגיע לגובה הנדרש או שיש אזורים ללא חיפוי שהיו צריכים להיות מחופים לפי המפרט', 'ת"י 1555 חלק 3 — חיפוי קירות בחדרי רחצה חייב להתאים למפרט הטכני, בדרך כלל עד גובה התקרה או 2.10 מ'' לפחות', 'ת"י 1555 חלק 3 — חיפוי קירות בחדרי רחצה חייב להתאים למפרט הטכני, בדרך כלל עד גובה התקרה או 2.10 מ'' לפחות', 'השלמת חיפוי הקרמיקה עד לגובה הנדרש במפרט עם אריחים זהים', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיפוי קירות חדר רחצה לא מלא — חיפוי הקרמיקה בחדר הרחצה אינו מגיע לגובה הנדרש או שיש אזורים ללא חיפוי שהיו צריכים להיות מחופים לפי המפרט'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'סיליקון חסר או פגום בפינות רטובות — סיליקון חסר, מתקלף, או מעופש בפינות ובמפגשים בחדרי רחצה ומטבח — בין קיר לרצפה, בין קיר לאמבטיה, סביב כיור', 'ת"י 1555 חלק 3 — כל המפגשים בין משטחים באזורים רטובים חייבים להיות אטומים בסיליקון סניטרי', 'ת"י 1555 חלק 3 — כל המפגשים בין משטחים באזורים רטובים חייבים להיות אטומים בסיליקון סניטרי', 'הסרת הסיליקון הישן, ניקוי ויובש של האזור, יישום סיליקון סניטרי אנטי-פטרייתי חדש', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סיליקון חסר או פגום בפינות רטובות — סיליקון חסר, מתקלף, או מעופש בפינות ובמפגשים בחדרי רחצה ומטבח — בין קיר לרצפה, בין קיר לאמבטיה, סביב כיור'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'חיפוי קיר לא צמוד / בולט — אריח חיפוי קיר שלא צמוד למשטח — בולט או מתנדנד', 'ת"י 1555 — חיפוי קירות חייב להיות צמוד לבסיס במלואו', 'ת"י 1555 — חיפוי קירות חייב להיות צמוד לבסיס במלואו', 'הסרת אריח, ניקוי, הדבקה מחדש', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיפוי קיר לא צמוד / בולט — אריח חיפוי קיר שלא צמוד למשטח — בולט או מתנדנד'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'ריצוף וחיפוי קרמיקה', NULL, 'חיפוי קיר שבור / סדוק — אריח חיפוי קיר עם סדק או שבר', 'ת"י 1555 — אריחי חיפוי חייבים להיות שלמים', 'ת"י 1555 — אריחי חיפוי חייבים להיות שלמים', 'החלפת אריח פגום', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיפוי קיר שבור / סדוק — אריח חיפוי קיר עם סדק או שבר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'לוח גבס עם כתמי רטיבות — כתמי רטיבות על לוח גבס, לרוב בתקרה או בקירות חדרים רטובים. לוח גבס רגיל (לבן) שהותקן באזור רטוב במקום לוח ירוק עמיד מים', 'ת"י 4283 — באזורים רטובים (חדרי אמבטיה, מטבחים) יש להשתמש בלוחות גבס עמידים ברטיבות (ירוקים)', 'ת"י 4283 — באזורים רטובים (חדרי אמבטיה, מטבחים) יש להשתמש בלוחות גבס עמידים ברטיבות (ירוקים)', 'החלפת הלוח הפגום בלוח גבס ירוק (עמיד מים), טיפול במקור הרטיבות, שפכטל וצביעה', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'לוח גבס עם כתמי רטיבות — כתמי רטיבות על לוח גבס, לרוב בתקרה או בקירות חדרים רטובים. לוח גבס רגיל (לבן) שהותקן באזור רטוב במקום לוח ירוק עמיד מים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'סדק בתפר בין לוחות גבס — סדק לאורך התפר בין שני לוחות גבס. נגרם לרוב מטיפול לא נכון בתפר — חוסר בסרט תפר או שימוש בשפכטל לא מתאים', 'ת"י 4283 — תפרים בין לוחות גבס חייבים להיות מטופלים בסרט תפר ושפכטל מתאים למניעת סדקים', 'ת"י 4283 — תפרים בין לוחות גבס חייבים להיות מטופלים בסרט תפר ושפכטל מתאים למניעת סדקים', 'פתיחת הסדק, הדבקת סרט רשת פיברגלס, שפכטל בשלוש שכבות עם ליטוש בין שכבה לשכבה', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סדק בתפר בין לוחות גבס — סדק לאורך התפר בין שני לוחות גבס. נגרם לרוב מטיפול לא נכון בתפר — חוסר בסרט תפר או שימוש בשפכטל לא מתאים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'בליטת ברגים בלוח גבס — ראשי הברגים בולטים מעבר לפני השטח של לוח הגבס ולא שוקעו כראוי. נראים כנקודות בולטות לאחר הצביעה', 'ת"י 4283 — ברגים חייבים להיות משוקעים 1-2 מ"מ מתחת לפני השטח ומכוסים בשפכטל', 'ת"י 4283 — ברגים חייבים להיות משוקעים 1-2 מ"מ מתחת לפני השטח ומכוסים בשפכטל', 'שקיעת הברגים הבולטים, כיסוי בשפכטל בשתי שכבות, ליטוש וצביעה', 50, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'בליטת ברגים בלוח גבס — ראשי הברגים בולטים מעבר לפני השטח של לוח הגבס ולא שוקעו כראוי. נראים כנקודות בולטות לאחר הצביעה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'תקרת גבס לא ישרה — גלים — תקרת הגבס אינה מישורית — ניתן להבחין בגלים או שקעים. נגרם מפרופילים לא מיושרים או ריווח לא נכון של שלדת המתכת', 'ת"י 4283 — סטייה מקסימלית מותרת ממישוריות: 3 מ"מ לכל 2 מטר בתקרת גבס', 'ת"י 4283 — סטייה מקסימלית מותרת ממישוריות: 3 מ"מ לכל 2 מטר בתקרת גבס', 'התאמת שלדת המתכת, הסרה והרכבה מחדש של הלוחות באזור הבעייתי, שפכטל וליטוש', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תקרת גבס לא ישרה — גלים — תקרת הגבס אינה מישורית — ניתן להבחין בגלים או שקעים. נגרם מפרופילים לא מיושרים או ריווח לא נכון של שלדת המתכת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'חוסר בפתח ביקורת בתקרת גבס — תקרת גבס ללא פתח ביקורת (דלת revision) לגישה לצנרת, חיווט חשמלי, או מערכות מיזוג הנמצאים מעל התקרה', 'NULL', 'NULL', 'חיתוך פתח ביקורת במיקום מתאים והתקנת מסגרת ודלת ביקורת תקנית', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר בפתח ביקורת בתקרת גבס — תקרת גבס ללא פתח ביקורת (דלת revision) לגישה לצנרת, חיווט חשמלי, או מערכות מיזוג הנמצאים מעל התקרה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'לוח גבס שבור או מחורר — שבר או חור בלוח הגבס כתוצאה מחבטה, פגיעה במהלך העבודות, או התקנה לקויה', 'ת"י 4283 — לוחות גבס חייבים להיות שלמים וללא פגמים', 'ת"י 4283 — לוחות גבס חייבים להיות שלמים וללא פגמים', 'חיתוך האזור הפגום בצורת מלבן, הרכבת טלאי גבס חדש, סרט תפר, שפכטל וליטוש', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'לוח גבס שבור או מחורר — שבר או חור בלוח הגבס כתוצאה מחבטה, פגיעה במהלך העבודות, או התקנה לקויה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'הפרש גובה בין לוח גבס לקיר טיח — הפרש גובה (מדרגה) במעבר בין תקרת/קיר גבס לקיר טיח. גורם לבעיה אסתטית ומקשה על צביעה אחידה', 'ת"י 4283 — מעבר בין לוח גבס לטיח חייב להיות חלק וללא מדרגה', 'ת"י 4283 — מעבר בין לוח גבס לטיח חייב להיות חלק וללא מדרגה', 'יישור האזור באמצעות שפכטל, שימוש בפרופיל מעבר מתאים, ליטוש וצביעה', 60, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'הפרש גובה בין לוח גבס לקיר טיח — הפרש גובה (מדרגה) במעבר בין תקרת/קיר גבס לקיר טיח. גורם לבעיה אסתטית ומקשה על צביעה אחידה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'שפכטל לא מוחלק — טקסטורה גסה — עבודת השפכטל על לוחות הגבס לא הושלמה כראוי — ניתן לראות קווי שפכטל, סימני כלי עבודה, או טקסטורה לא אחידה שבולטת לאחר הצביעה', 'ת"י 4283 — גימור שפכטל חייב להיות חלק ואחיד ללא סימני כלי עבודה', 'ת"י 4283 — גימור שפכטל חייב להיות חלק ואחיד ללא סימני כלי עבודה', 'ליטוש מחדש של כל המשטח בנייר שיוף עדין (220-320), שכבת שפכטל סופית, ליטוש נוסף', 60, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שפכטל לא מוחלק — טקסטורה גסה — עבודת השפכטל על לוחות הגבס לא הושלמה כראוי — ניתן לראות קווי שפכטל, סימני כלי עבודה, או טקסטורה לא אחידה שבולטת לאחר הצביעה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'גבס קרטון ללא בידוד אקוסטי מספיק — מחיצת גבס קרטון בין דירות או חדרים שאינה עומדת בדרישות הבידוד האקוסטי. ניתן לשמוע רעשים מהצד השני', 'ת"י 1419 — מחיצת גבס בין דירות חייבת לעמוד בערך בידוד אקוסטי מינימלי של Rw=50dB', 'ת"י 1419 — מחיצת גבס בין דירות חייבת לעמוד בערך בידוד אקוסטי מינימלי של Rw=50dB', 'הוספת שכבת בידוד (צמר סלעים) בתוך המחיצה, או הוספת לוח גבס נוסף עם שכבת דמפינג', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גבס קרטון ללא בידוד אקוסטי מספיק — מחיצת גבס קרטון בין דירות או חדרים שאינה עומדת בדרישות הבידוד האקוסטי. ניתן לשמוע רעשים מהצד השני'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גבס', NULL, 'גבס — סדק בתפר — סדק בתפר בין לוחות גבס — ליקוי נפוץ בתקרות ובמחיצות', 'NULL', 'NULL', 'פתיחת תפר, מילוי בחומר גמיש, סרט רשת, שפכטל וצביעה', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גבס — סדק בתפר — סדק בתפר בין לוחות גבס — ליקוי נפוץ בתקרות ובמחיצות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'אבן חיפוי חיצוני רופפת — אבן חיפוי חיצונית שאינה מחוברת היטב למבנה ונעה בלחיצה. מהווה סכנת נפילה חמורה, במיוחד בקומות גבוהות', 'ת"י 2378 — אבן חיפוי חיצונית חייבת להיות מעוגנת מכנית בנוסף להדבקה, בהתאם לגובה ולמשקל', 'ת"י 2378 — אבן חיפוי חיצונית חייבת להיות מעוגנת מכנית בנוסף להדבקה, בהתאם לגובה ולמשקל', 'הסרה מבוקרת של האבן, בדיקת העיגון המכני, הדבקה מחדש עם דבק C2S1 ועיגון מכני נוסף', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אבן חיפוי חיצוני רופפת — אבן חיפוי חיצונית שאינה מחוברת היטב למבנה ונעה בלחיצה. מהווה סכנת נפילה חמורה, במיוחד בקומות גבוהות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'סדק באבן חיפוי — סדק באבן חיפוי חיצונית או פנימית. עלול להיגרם מתזוזות תרמיות, מתח מכני, או פגם באבן עצמה', 'ת"י 2378 — אבני חיפוי חייבות להיות שלמות וללא סדקים הפוגעים ביציבותן', 'ת"י 2378 — אבני חיפוי חייבות להיות שלמות וללא סדקים הפוגעים ביציבותן', 'החלפת האבן הסדוקה באבן חדשה מאותו המחצבה ועם גימור זהה', 700, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סדק באבן חיפוי — סדק באבן חיפוי חיצונית או פנימית. עלול להיגרם מתזוזות תרמיות, מתח מכני, או פגם באבן עצמה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'כתמים על אבן טבעית — כתמים על משטח אבן טבעית (שיש, גרניט) כתוצאה מחומרי ניקוי לא מתאימים, דבק שחלחל, או חומרי בנייה שנשפכו', 'NULL', 'NULL', 'ניקוי מקצועי באמצעות חומרים ייעודיים לאבן טבעית, ליטוש מקומי במידת הצורך, יישום חומר הגנה', 150, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כתמים על אבן טבעית — כתמים על משטח אבן טבעית (שיש, גרניט) כתוצאה מחומרי ניקוי לא מתאימים, דבק שחלחל, או חומרי בנייה שנשפכו'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'חוסר עיגון מכני באבן חיפוי בגובה — אבן חיפוי בגובה מעל 4 מטר שהודבקה ללא עיגון מכני נוסף. מהווה סכנת נפילה חמורה ודורש טיפול מיידי', 'ת"י 2378 — אבן חיפוי בגובה מעל 4 מ'' חייבת לכלול עיגון מכני בנוסף להדבקה כימית', 'ת"י 2378 — אבן חיפוי בגובה מעל 4 מ'' חייבת לכלול עיגון מכני בנוסף להדבקה כימית', 'הוספת עיגון מכני (סיכות נירוסטה או מסגרת תלייה) לכל אבני החיפוי מעל 4 מ''', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר עיגון מכני באבן חיפוי בגובה — אבן חיפוי בגובה מעל 4 מטר שהודבקה ללא עיגון מכני נוסף. מהווה סכנת נפילה חמורה ודורש טיפול מיידי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'רובה חסרה בין אבני חיפוי — חוסר ברובה (מילוי) בין אבני החיפוי החיצוני. מאפשר חדירת מים מאחורי האבנים ועלול לגרום לנזק מצטבר ולניתוק', 'ת"י 2378 — תפרים בין אבני חיפוי חיצוני חייבים להיות ממולאים בחומר איטום גמיש', 'ת"י 2378 — תפרים בין אבני חיפוי חיצוני חייבים להיות ממולאים בחומר איטום גמיש', 'מילוי התפרים בחומר איטום פוליאורתני או סיליקון בצבע מתאים לאבן', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רובה חסרה בין אבני חיפוי — חוסר ברובה (מילוי) בין אבני החיפוי החיצוני. מאפשר חדירת מים מאחורי האבנים ועלול לגרום לנזק מצטבר ולניתוק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'אדן שיש/אבן סדוק — סדק באדן חלון או משטח עבודה מאבן טבעית. לרוב נגרם ממתח מכני, תזוזת מבנה, או חיתוך לקוי של האבן', 'NULL', 'NULL', 'תיקון בשרף אפוקסי שקוף או בצבע מתאים, ליטוש מקומי. במקרים חמורים — החלפת האבן', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אדן שיש/אבן סדוק — סדק באדן חלון או משטח עבודה מאבן טבעית. לרוב נגרם ממתח מכני, תזוזת מבנה, או חיתוך לקוי של האבן'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'חוסר נוטפים באדן אבן חיצוני — אדן אבן חיצוני ללא חריץ נוטפים בתחתיתו, מה שגורם למים לזרום לאורך הקיר ולגרום לכתמי רטיבות ונזק', 'ת"י 2378 — אדני חלון חיצוניים מאבן חייבים לכלול חריץ נוטפים בתחתיתם', 'ת"י 2378 — אדני חלון חיצוניים מאבן חייבים לכלול חריץ נוטפים בתחתיתם', 'חריצת חריץ נוטפים בתחתית האדן באמצעות מסור יהלום, או החלפת האדן', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר נוטפים באדן אבן חיצוני — אדן אבן חיצוני ללא חריץ נוטפים בתחתיתו, מה שגורם למים לזרום לאורך הקיר ולגרום לכתמי רטיבות ונזק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'חללים מתחת לאבן שיש מדרגות — אבני שיש במדרגות עם חללים מתחתיהן. גורם לרעש (צליל חלול בהליכה) ולסיכון לשבירת האבן תחת עומס', 'ת"י 2378 — אבן מדרגות חייבת להיות מודבקת על כיסוי דבק מלא (100%) ללא חללים', 'ת"י 2378 — אבן מדרגות חייבת להיות מודבקת על כיסוי דבק מלא (100%) ללא חללים', 'הזרקת דבק אפוקסי דרך קידוחים קטנים למילוי החללים, או פירוק והדבקה מחדש', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חללים מתחת לאבן שיש מדרגות — אבני שיש במדרגות עם חללים מתחתיהן. גורם לרעש (צליל חלול בהליכה) ולסיכון לשבירת האבן תחת עומס'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'אף מדרגה אבן בולט או חד — אף (קצה) מדרגת אבן שאינו מעובד כראוי — חד, בולט, או לא מעוגל. מהווה סכנת מעידה ופציעה', 'ת"י 2378 — אף מדרגה חייב להיות מעוגל או משופע למניעת סכנת מעידה', 'ת"י 2378 — אף מדרגה חייב להיות מעוגל או משופע למניעת סכנת מעידה', 'עיגול או שיפוע קצה המדרגה באמצעות ליטוש מקצועי, או התקנת פרופיל אף מדרגה', 150, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אף מדרגה אבן בולט או חד — אף (קצה) מדרגת אבן שאינו מעובד כראוי — חד, בולט, או לא מעוגל. מהווה סכנת מעידה ופציעה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אבן ושיש', NULL, 'אבן משתלבת (חיצוני) שוקעת או בולטת — אבני משתלבות בחניה או בשביל גישה שאינן במפלס אחיד — חלקן שוקעות וחלקן בולטות. מעיד על תשתית חול לא מהודקת', 'NULL', 'NULL', 'הרמת האבנים באזור הבעייתי, השלמת והידוק שכבת החול, הנחה מחדש עם הידוק', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אבן משתלבת (חיצוני) שוקעת או בולטת — אבני משתלבות בחניה או בשביל גישה שאינן במפלס אחיד — חלקן שוקעות וחלקן בולטות. מעיד על תשתית חול לא מהודקת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'נזילה מצנרת אספקת מים קרים — נזילת מים מצנרת אספקת מים קרים בנקודות חיבור או לאורך הצנרת. עלולה לגרום לנזקי רטיבות בקירות ובתקרות, ולהתפתחות עובש', 'ת"י 1205 חלק 1 — מערכת אספקת המים חייבת לעמוד בבדיקת לחץ של 1.5 פעמים מלחץ העבודה המרבי, ולא פחות מ-10 אטמוספרות, למשך שעתיים ללא ירידת לחץ.', 'ת"י 1205 חלק 1 — מערכת אספקת המים חייבת לעמוד בבדיקת לחץ של 1.5 פעמים מלחץ העבודה המרבי, ולא פחות מ-10 אטמוספרות, למשך שעתיים ללא ירידת לחץ.', 'לאתר את מקור הנזילה, לנתק את אספקת המים, לתקן או להחליף את הקטע הפגום ולבצע בדיקת לחץ חוזרת', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזילה מצנרת אספקת מים קרים — נזילת מים מצנרת אספקת מים קרים בנקודות חיבור או לאורך הצנרת. עלולה לגרום לנזקי רטיבות בקירות ובתקרות, ולהתפתחות עובש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'נזילה מצנרת אספקת מים חמים — נזילת מים מצנרת אספקת מים חמים. נזילה ממערכת מים חמים חמורה יותר בשל הסיכון לכוויות ונזק מואץ לחומרי בניין', 'ת"י 1205 חלק 1 — צנרת מים חמים חייבת לעמוד בבדיקת לחץ זהה לצנרת מים קרים, ובנוסף לעמוד בטמפרטורות עבודה עד 80°C.', 'ת"י 1205 חלק 1 — צנרת מים חמים חייבת לעמוד בבדיקת לחץ זהה לצנרת מים קרים, ובנוסף לעמוד בטמפרטורות עבודה עד 80°C.', 'לאתר את מקור הנזילה, לתקן או להחליף את הקטע הפגום, לבדוק תקינות בידוד תרמי של הצנרת, ולבצע בדיקת לחץ', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזילה מצנרת אספקת מים חמים — נזילת מים מצנרת אספקת מים חמים. נזילה ממערכת מים חמים חמורה יותר בשל הסיכון לכוויות ונזק מואץ לחומרי בניין'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'לחץ מים נמוך מהנדרש — לחץ המים בנקודות הקצה (ברזים, מקלחות) נמוך מהנדרש בתקן. גורם לזרימה חלשה ולתפקוד לקוי של מערכות כגון מקלחות ומדיחי כלים', 'ת"י 1205 חלק 1 — לחץ המים המינימלי בנקודת הצריכה הרחוקה ביותר לא יפחת מ-1 אטמוספרה (0.1 מגה-פסקל). לחץ מרבי לא יעלה על 5 אטמוספרות.', 'ת"י 1205 חלק 1 — לחץ המים המינימלי בנקודת הצריכה הרחוקה ביותר לא יפחת מ-1 אטמוספרה (0.1 מגה-פסקל). לחץ מרבי לא יעלה על 5 אטמוספרות.', 'לבדוק את קוטר הצנרת, לוודא היעדר חסימות, לבדוק תקינות משאבת לחץ (אם קיימת), ובמידת הצורך להתקין משאבת הגברת לחץ', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'לחץ מים נמוך מהנדרש — לחץ המים בנקודות הקצה (ברזים, מקלחות) נמוך מהנדרש בתקן. גורם לזרימה חלשה ולתפקוד לקוי של מערכות כגון מקלחות ומדיחי כלים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'היעדר מפסק מים ראשי או שסתום ניתוק — לא הותקן שסתום ניתוק (ברז ראשי) בכניסת אספקת המים לדירה, או שהשסתום אינו נגיש או אינו תקין', 'ת"י 1205 חלק 1 — יש להתקין שסתום ניתוק בכניסת המים לכל יחידת דיור, במקום נגיש, המאפשר סגירה מלאה של אספקת המים.', 'ת"י 1205 חלק 1 — יש להתקין שסתום ניתוק בכניסת המים לכל יחידת דיור, במקום נגיש, המאפשר סגירה מלאה של אספקת המים.', 'להתקין שסתום כדורי בכניסת המים לדירה, במקום נגיש ומסומן', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'היעדר מפסק מים ראשי או שסתום ניתוק — לא הותקן שסתום ניתוק (ברז ראשי) בכניסת אספקת המים לדירה, או שהשסתום אינו נגיש או אינו תקין'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'היעדר מפסק מים נקודתי לכלי סניטרי — חסר שסתום ניתוק נקודתי (אנגל) בחיבור לכלי סניטרי (אסלה, כיור, מכונת כביסה). לא ניתן לסגור מים לכלי ספציפי ללא ניתוק כל הדירה', 'ת"י 1205 חלק 1 — יש להתקין שסתום ניתוק נפרד לכל כלי סניטרי לצורך תחזוקה ותיקון.', 'ת"י 1205 חלק 1 — יש להתקין שסתום ניתוק נפרד לכל כלי סניטרי לצורך תחזוקה ותיקון.', 'להתקין ברז אנגל לכל כלי סניטרי בהתאם לתקן', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'היעדר מפסק מים נקודתי לכלי סניטרי — חסר שסתום ניתוק נקודתי (אנגל) בחיבור לכלי סניטרי (אסלה, כיור, מכונת כביסה). לא ניתן לסגור מים לכלי ספציפי ללא ניתוק כל הדירה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'רעש מצנרת – פטישי מים (water hammer) — רעשי חבטות או רעידות בצנרת בעת סגירת ברזים או שסתומים. תופעת פטישי מים (water hammer) הנגרמת מעצירה פתאומית של זרימה', 'ת"י 1205 חלק 1 — יש למנוע תופעת פטישי מים באמצעות התקנת בולמי זעזועים (water hammer arrestors) או האטת הסגירה.', 'ת"י 1205 חלק 1 — יש למנוע תופעת פטישי מים באמצעות התקנת בולמי זעזועים (water hammer arrestors) או האטת הסגירה.', 'להתקין בולמי זעזועים (water hammer arrestors) בנקודות הקצה, לבדוק קיבוע צנרת ולהוסיף תופסני צנרת', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רעש מצנרת – פטישי מים (water hammer) — רעשי חבטות או רעידות בצנרת בעת סגירת ברזים או שסתומים. תופעת פטישי מים (water hammer) הנגרמת מעצירה פתאומית של זרימה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'צנרת לא מקובעת – חסרים תופסנים — צנרת מים או ביוב שאינה מקובעת כראוי לקיר או לתקרה באמצעות תופסנים, גורמת לרעשים, רעידות ועלולה להיסדק', 'ת"י 1205 חלק 1 — צנרת תקובע לאלמנטים קשיחים במבנה באמצעות תופסנים מתאימים, במרווחים שלא יעלו על 1.5 מ'' לצנרת אופקית ו-2 מ'' לצנרת אנכית.', 'ת"י 1205 חלק 1 — צנרת תקובע לאלמנטים קשיחים במבנה באמצעות תופסנים מתאימים, במרווחים שלא יעלו על 1.5 מ'' לצנרת אופקית ו-2 מ'' לצנרת אנכית.', 'להתקין תופסני צנרת (pipe clamps) בהתאם לתקן, במרווחים הנדרשים ועם בידוד אקוסטי', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת לא מקובעת – חסרים תופסנים — צנרת מים או ביוב שאינה מקובעת כראוי לקיר או לתקרה באמצעות תופסנים, גורמת לרעשים, רעידות ועלולה להיסדק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'היעדר בידוד תרמי לצנרת מים חמים — צנרת מים חמים ללא בידוד תרמי (כיסוי מבודד), גורם לאיבוד חום, בזבוז אנרגיה, ועלול לגרום לעיבוי על הצנרת', 'ת"י 1205 חלק 1 — צנרת מים חמים חייבת בבידוד תרמי בעובי מינימלי בהתאם לקוטר הצנרת, למניעת איבוד חום.', 'ת"י 1205 חלק 1 — צנרת מים חמים חייבת בבידוד תרמי בעובי מינימלי בהתאם לקוטר הצנרת, למניעת איבוד חום.', 'לעטוף את צנרת המים החמים בבידוד תרמי (שרוול מבודד) בעובי הנדרש לפי קוטר הצנרת', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'היעדר בידוד תרמי לצנרת מים חמים — צנרת מים חמים ללא בידוד תרמי (כיסוי מבודד), גורם לאיבוד חום, בזבוז אנרגיה, ועלול לגרום לעיבוי על הצנרת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'דוד שמש – נזילה או התקנה לקויה — נזילה מדוד השמש, מצנרת העלייה/ירידה לקולטים, או התקנה שאינה עומדת בדרישות התקן (חוסר שסתום ביטחון, חוסר אוורור)', 'ת"י 579 — דוד שמש יותקן עם שסתום ביטחון (שסתום לחץ), שסתום חד-כיווני, ומערכת ניקוז לעודפי לחץ. חיבור לפי הוראות היצרן.', 'ת"י 579 — דוד שמש יותקן עם שסתום ביטחון (שסתום לחץ), שסתום חד-כיווני, ומערכת ניקוז לעודפי לחץ. חיבור לפי הוראות היצרן.', 'לתקן את הנזילה, להתקין שסתומי ביטחון חסרים, לבדוק תקינות הצנרת מהקולטים לדוד ובחזרה', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דוד שמש – נזילה או התקנה לקויה — נזילה מדוד השמש, מצנרת העלייה/ירידה לקולטים, או התקנה שאינה עומדת בדרישות התקן (חוסר שסתום ביטחון, חוסר אוורור)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'חימום מים חשמלי (בויילר) – היעדר שסתום ביטחון — מחמם מים חשמלי (בויילר) מותקן ללא שסתום ביטחון (שסתום לחץ ותרמוסטטי), מהווה סכנת פיצוץ', 'ת"י 1596 — חובה להתקין שסתום ביטחון על כל מחמם מים חשמלי, המשחרר לחץ עודף בלחץ של 6 אטמוספרות ובטמפרטורה של 93°C.', 'ת"י 1596 — חובה להתקין שסתום ביטחון על כל מחמם מים חשמלי, המשחרר לחץ עודף בלחץ של 6 אטמוספרות ובטמפרטורה של 93°C.', 'להתקין שסתום ביטחון (T&P valve) תקני, עם צנרת ניקוז לרצפה או לנקודת ניקוז בטוחה', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חימום מים חשמלי (בויילר) – היעדר שסתום ביטחון — מחמם מים חשמלי (בויילר) מותקן ללא שסתום ביטחון (שסתום לחץ ותרמוסטטי), מהווה סכנת פיצוץ'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'מחמם מים (בויילר) – התקנה לא בטוחה — בויילר מותקן באופן לא בטוח – ללא עיגון תקני לקיר, ללא מגש איסוף נזילות, או בסמיכות למתקנים חשמליים', 'ת"י 1596 — מחמם מים יותקן על קיר חזק מספיק לשאת את משקלו המלא, עם עיגון מתאים, ומגש ניקוז מתחתיו.', 'ת"י 1596 — מחמם מים יותקן על קיר חזק מספיק לשאת את משקלו המלא, עם עיגון מתאים, ומגש ניקוז מתחתיו.', 'לעגן את הבויילר בבורגי הרחבה מתאימים לקיר, להתקין מגש איסוף עם ניקוז, ולוודא מרחק מספיק ממתקנים חשמליים', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מחמם מים (בויילר) – התקנה לא בטוחה — בויילר מותקן באופן לא בטוח – ללא עיגון תקני לקיר, ללא מגש איסוף נזילות, או בסמיכות למתקנים חשמליים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'מד מים – נזילה או התקנה לקויה — נזילה ממד המים הדירתי, התקנה לא תקינה, או חוסר נגישות למד המים', 'ת"י 1205 חלק 1 — מד מים יותקן במקום נגיש לקריאה ותחזוקה, עם שסתומי ניתוק משני צידיו.', 'ת"י 1205 חלק 1 — מד מים יותקן במקום נגיש לקריאה ותחזוקה, עם שסתומי ניתוק משני צידיו.', 'לתקן את הנזילה, לוודא שסתומי ניתוק תקינים, ולהבטיח נגישות למד המים', 700, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מד מים – נזילה או התקנה לקויה — נזילה ממד המים הדירתי, התקנה לא תקינה, או חוסר נגישות למד המים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'היעדר מניעת זרימה חוזרת (backflow prevention) — חסר מתקן למניעת זרימה חוזרת (שסתום חד-כיווני) במערכת אספקת המים, מהווה סיכון בריאותי של זיהום מי השתייה', 'ת"י 1205 חלק 1 — יש להתקין אמצעי למניעת זרימה חוזרת בכל נקודת חיבור שקיים בה סיכון לזיהום מי השתייה (הפרש גובה מינימלי או שסתום).', 'ת"י 1205 חלק 1 — יש להתקין אמצעי למניעת זרימה חוזרת בכל נקודת חיבור שקיים בה סיכון לזיהום מי השתייה (הפרש גובה מינימלי או שסתום).', 'להתקין שסתום חד-כיווני (check valve) או מפריד ואקום בנקודות הנדרשות', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'היעדר מניעת זרימה חוזרת (backflow prevention) — חסר מתקן למניעת זרימה חוזרת (שסתום חד-כיווני) במערכת אספקת המים, מהווה סיכון בריאותי של זיהום מי השתייה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'צנרת מים חוצה קיר ללא אטימה — צנרת מים העוברת דרך קיר או רצפה ללא שרוול מגן (sleeve) ואטימה מתאימה, מאפשרת מעבר מים ולחות', 'ת"י 1205 חלק 1 — צנרת העוברת דרך קיר או רצפה תוחדר בתוך שרוול מגן, והמרווח ביניהם יאטם בחומר גמיש.', 'ת"י 1205 חלק 1 — צנרת העוברת דרך קיר או רצפה תוחדר בתוך שרוול מגן, והמרווח ביניהם יאטם בחומר גמיש.', 'להתקין שרוול מגן (sleeve) ולאטום את המרווח בחומר איטום גמיש', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת מים חוצה קיר ללא אטימה — צנרת מים העוברת דרך קיר או רצפה ללא שרוול מגן (sleeve) ואטימה מתאימה, מאפשרת מעבר מים ולחות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'צנרת פוליאתילן (פקס) – קיפול או כיפוף חד — צנרת PEX מקופלת או מכופפת בזווית חדה מדי, מצמצמת את חתך הזרימה ועלולה להיסדק לאורך זמן', 'ת"י 1205 חלק 1 — רדיוס כיפוף מינימלי של צנרת PEX: 8 פעמים קוטר הצנרת. אין לקפל או לכופף בזווית חדה.', 'ת"י 1205 חלק 1 — רדיוס כיפוף מינימלי של צנרת PEX: 8 פעמים קוטר הצנרת. אין לקפל או לכופף בזווית חדה.', 'להחליף את קטע הצנרת המקופל, להתקין מחדש עם רדיוס כיפוף תקני, או להשתמש בפיטינג זווית', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת פוליאתילן (פקס) – קיפול או כיפוף חד — צנרת PEX מקופלת או מכופפת בזווית חדה מדי, מצמצמת את חתך הזרימה ועלולה להיסדק לאורך זמן'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'ערבוב חומרי צנרת לא תואמים (קורוזיה גלוונית) — חיבור ישיר בין צנרת נחושת לצנרת פלדה מגולוונת ללא מפריד דיאלקטרי, גורם לקורוזיה גלוונית ולנזילות', 'ת"י 1205 חלק 1 — אין לחבר ישירות בין מתכות שונות ללא מפריד דיאלקטרי או אבזר מתאים למניעת קורוזיה גלוונית.', 'ת"י 1205 חלק 1 — אין לחבר ישירות בין מתכות שונות ללא מפריד דיאלקטרי או אבזר מתאים למניעת קורוזיה גלוונית.', 'להתקין מפריד דיאלקטרי (dielectric union) בין חומרי הצנרת השונים', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ערבוב חומרי צנרת לא תואמים (קורוזיה גלוונית) — חיבור ישיר בין צנרת נחושת לצנרת פלדה מגולוונת ללא מפריד דיאלקטרי, גורם לקורוזיה גלוונית ולנזילות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'פילטר (מסנן) מים ראשי – חסר או לא תקין — לא הותקן מסנן מים ראשי בכניסת המים לדירה, או שהמסנן סתום ודורש ניקוי/החלפה', 'NULL', 'NULL', 'להתקין מסנן מים ראשי (פילטר Y או פילטר רשת) בכניסת המים לדירה, לאחר מד המים', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פילטר (מסנן) מים ראשי – חסר או לא תקין — לא הותקן מסנן מים ראשי בכניסת המים לדירה, או שהמסנן סתום ודורש ניקוי/החלפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'מוביל מים גמיש (צינור חיבור) פגום או מנופח — צינור חיבור גמיש (flexible hose) לברז, אסלה, או מכשיר חשמלי מנופח, סדוק, או חלוד בחיבורים. סיכון גבוה להצפה', 'NULL', 'NULL', 'להחליף מיידית את המוביל הגמיש הפגום בצינור חדש תקני (נירוסטה קלועה), ולבדוק תקינות כל המובילים הגמישים בדירה', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מוביל מים גמיש (צינור חיבור) פגום או מנופח — צינור חיבור גמיש (flexible hose) לברז, אסלה, או מכשיר חשמלי מנופח, סדוק, או חלוד בחיבורים. סיכון גבוה להצפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'וונטוזה (שסתום שחרור אוויר) חסרה או לא תקינה — וונטוזה (שסתום שחרור אוויר) חסרה בנקודה הגבוהה ביותר של מערכת המים, גורם לכיסי אוויר ולהפרעה בזרימה', 'ת"י 1205 חלק 1 — יש להתקין שסתום שחרור אוויר (וונטוזה) בנקודות הגבוהות של מערכת אספקת המים.', 'ת"י 1205 חלק 1 — יש להתקין שסתום שחרור אוויר (וונטוזה) בנקודות הגבוהות של מערכת אספקת המים.', 'להתקין וונטוזה אוטומטית בנקודה הגבוהה ביותר של מערכת הצנרת', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'וונטוזה (שסתום שחרור אוויר) חסרה או לא תקינה — וונטוזה (שסתום שחרור אוויר) חסרה בנקודה הגבוהה ביותר של מערכת המים, גורם לכיסי אוויר ולהפרעה בזרימה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'נזילה מצנרת מים — נזילת מים מצנרת גלויה או סמויה. עלולה לגרום לנזקי רטיבות', 'ת"י 1205 — מערכת אינסטלציה חייבת להיות אטומה לחלוטין', 'ת"י 1205 — מערכת אינסטלציה חייבת להיות אטומה לחלוטין', 'איתור מקור הנזילה, תיקון או החלפת הצנרת הפגומה', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזילה מצנרת מים — נזילת מים מצנרת גלויה או סמויה. עלולה לגרום לנזקי רטיבות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'ברז מטפטף / לא אוטם — ברז שמטפטף גם כשסגור, או שלא אוטם כראוי', 'NULL', 'NULL', 'החלפת אטם / קרמי / ברז שלם לפי הצורך', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ברז מטפטף / לא אוטם — ברז שמטפטף גם כשסגור, או שלא אוטם כראוי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'סיפון חסר או לא תקין – ריח ביוב — סיפון (מחסום ריח) חסר, לא מותקן, פגום או יבש, וגורם לחדירת ריחות ביוב לתוך הדירה דרך נקודת הניקוז', 'ת"י 1205 חלק 2 — כל כלי סניטרי יחובר לסיפון עם מחסום מים בעומק מינימלי של 50 מ"מ. אין לחבר כלי סניטרי לביוב ללא סיפון.', 'ת"י 1205 חלק 2 — כל כלי סניטרי יחובר לסיפון עם מחסום מים בעומק מינימלי של 50 מ"מ. אין לחבר כלי סניטרי לביוב ללא סיפון.', 'להתקין סיפון תקני עם עומק מחסום מים של 50 מ"מ לפחות, לוודא אטימות כל החיבורים', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סיפון חסר או לא תקין – ריח ביוב — סיפון (מחסום ריח) חסר, לא מותקן, פגום או יבש, וגורם לחדירת ריחות ביוב לתוך הדירה דרך נקודת הניקוז'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'סיפון רצפתי חסום או ניקוז איטי — סיפון רצפתי (במקלחת, במרפסת) חסום חלקית או מלא, גורם להצטברות מים על הרצפה ולניקוז איטי', 'ת"י 1205 חלק 2 — סיפון רצפתי יאפשר ניקוז חופשי של מים, רשת הסיפון תהיה ניתנת להסרה לצורך ניקוי.', 'ת"י 1205 חלק 2 — סיפון רצפתי יאפשר ניקוז חופשי של מים, רשת הסיפון תהיה ניתנת להסרה לצורך ניקוי.', 'לנקות את הסיפון מפסולת, לפתוח חסימות בצנרת, לוודא שיפוע תקין של הרצפה לכיוון הסיפון', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סיפון רצפתי חסום או ניקוז איטי — סיפון רצפתי (במקלחת, במרפסת) חסום חלקית או מלא, גורם להצטברות מים על הרצפה ולניקוז איטי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'שיפוע ניקוז לא תקין – מים עומדים על רצפה — רצפת חדר רחצה או מקלחת ללא שיפוע מספיק לכיוון הסיפון, גורם להצטברות מים (שלוליות) על הרצפה', 'ת"י 1205 חלק 2 — רצפה רטובה (חדר מקלחת) חייבת בשיפוע מינימלי של 1.5% לכיוון נקודת הניקוז.', 'ת"י 1205 חלק 2 — רצפה רטובה (חדר מקלחת) חייבת בשיפוע מינימלי של 1.5% לכיוון נקודת הניקוז.', 'לבצע יציקת שיפוע מתקנת על הרצפה הקיימת וריצוף מחדש, או התקנת ערוץ ניקוז ליניארי', 5000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שיפוע ניקוז לא תקין – מים עומדים על רצפה — רצפת חדר רחצה או מקלחת ללא שיפוע מספיק לכיוון הסיפון, גורם להצטברות מים (שלוליות) על הרצפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'צנרת ביוב ללא שיפוע תקני — צנרת הביוב מותקנת ללא שיפוע מספיק או עם שיפוע הפוך (counter-slope), גורם לחסימות חוזרות ולעליית מי ביוב', 'ת"י 1205 חלק 2 — צנרת ביוב אופקית בקוטר עד 100 מ"מ: שיפוע מינימלי 2%. קוטר מעל 100 מ"מ: שיפוע מינימלי 1%.', 'ת"י 1205 חלק 2 — צנרת ביוב אופקית בקוטר עד 100 מ"מ: שיפוע מינימלי 2%. קוטר מעל 100 מ"מ: שיפוע מינימלי 1%.', 'לפרק את קטע הצנרת הבעייתי, להתקין מחדש בשיפוע הנדרש, ולבצע בדיקת זרימה', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת ביוב ללא שיפוע תקני — צנרת הביוב מותקנת ללא שיפוע מספיק או עם שיפוע הפוך (counter-slope), גורם לחסימות חוזרות ולעליית מי ביוב'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'חסימה בצנרת ביוב ראשית — חסימה בצנרת ביוב ראשית של הדירה, גורמת לעליית מי שפכים בכלים סניטריים או הצפה', 'ת"י 1205 חלק 2 — מערכת הביוב חייבת לאפשר זרימה חופשית. יש להתקין פקקי ניקוי בנקודות נגישות.', 'ת"י 1205 חלק 2 — מערכת הביוב חייבת לאפשר זרימה חופשית. יש להתקין פקקי ניקוי בנקודות נגישות.', 'לבצע שטיפת לחץ (ג''טינג) לצנרת הביוב, לבדוק במצלמה אנדוסקופית, לתקן או להחליף קטע פגום', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חסימה בצנרת ביוב ראשית — חסימה בצנרת ביוב ראשית של הדירה, גורמת לעליית מי שפכים בכלים סניטריים או הצפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'היעדר פקק ניקוי בצנרת ביוב — לא הותקנו פקקי ניקוי (access points) בצנרת הביוב במקומות הנדרשים, מה שמקשה על טיפול בחסימות עתידיות', 'ת"י 1205 חלק 2 — יש להתקין פקקי ניקוי בכל שינוי כיוון של צנרת הביוב, בסוף כל קו אופקי, ובמרחק מרבי של 15 מ'' בין פקק לפקק.', 'ת"י 1205 חלק 2 — יש להתקין פקקי ניקוי בכל שינוי כיוון של צנרת הביוב, בסוף כל קו אופקי, ובמרחק מרבי של 15 מ'' בין פקק לפקק.', 'להתקין פקקי ניקוי בנקודות הנדרשות בהתאם לתקן, במקומות נגישים', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'היעדר פקק ניקוי בצנרת ביוב — לא הותקנו פקקי ניקוי (access points) בצנרת הביוב במקומות הנדרשים, מה שמקשה על טיפול בחסימות עתידיות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'צנרת PVC ביוב – חיבור לא תקין — חיבור לקוי בצנרת PVC ביוב – שימוש בדבק לא מתאים, חיבור לא מלא, או חוסר אטימות בנקודות חיבור', 'ת"י 1205 חלק 2 — חיבורי צנרת ביוב PVC יבוצעו בדבק מתאים לסוג הצנרת, עם חדירה מלאה של הצנרת לתוך האבזר.', 'ת"י 1205 חלק 2 — חיבורי צנרת ביוב PVC יבוצעו בדבק מתאים לסוג הצנרת, עם חדירה מלאה של הצנרת לתוך האבזר.', 'לפרק את החיבור הלקוי, לנקות את המשטחים, להדביק מחדש בדבק PVC מתאים, ולבצע בדיקת אטימות', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת PVC ביוב – חיבור לא תקין — חיבור לקוי בצנרת PVC ביוב – שימוש בדבק לא מתאים, חיבור לא מלא, או חוסר אטימות בנקודות חיבור'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'צנרת ביוב – קוטר לא מספיק — צנרת ביוב בקוטר קטן מהנדרש לכמות הכלים הסניטריים המחוברים אליה, גורם לחסימות תכופות', 'ת"י 1205 חלק 2 — קוטר צנרת ביוב מינימלי: אסלה – 100 מ"מ, כיור – 40 מ"מ, מקלחת – 50 מ"מ, קו ראשי – 100 מ"מ.', 'ת"י 1205 חלק 2 — קוטר צנרת ביוב מינימלי: אסלה – 100 מ"מ, כיור – 40 מ"מ, מקלחת – 50 מ"מ, קו ראשי – 100 מ"מ.', 'להחליף את קטע הצנרת בקוטר מתאים בהתאם לתקן ולכמות הכלים הסניטריים המחוברים', 2500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת ביוב – קוטר לא מספיק — צנרת ביוב בקוטר קטן מהנדרש לכמות הכלים הסניטריים המחוברים אליה, גורם לחסימות תכופות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'אוורור מערכת ביוב חסר או לקוי — מערכת הביוב ללא אוורור תקין (vent pipe), גורם לשאיבת מחסום המים מהסיפונים, רעשי גרגור, וחדירת ריחות ביוב', 'ת"י 1205 חלק 2 — כל עמוד ביוב אנכי יאוורר לגג המבנה. צנרת האוורור לא תהיה קטנה מ-50 מ"מ ותגיע לפחות 50 ס"מ מעל הגג.', 'ת"י 1205 חלק 2 — כל עמוד ביוב אנכי יאוורר לגג המבנה. צנרת האוורור לא תהיה קטנה מ-50 מ"מ ותגיע לפחות 50 ס"מ מעל הגג.', 'להתקין צנרת אוורור בקוטר מתאים, המתחברת לעמוד הביוב ועולה לגג המבנה, או להתקין שסתום אוורור (Air Admittance Valve)', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אוורור מערכת ביוב חסר או לקוי — מערכת הביוב ללא אוורור תקין (vent pipe), גורם לשאיבת מחסום המים מהסיפונים, רעשי גרגור, וחדירת ריחות ביוב'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'שסתום אוורור (AAV) לא תקין — שסתום אוורור (Air Admittance Valve) לא עובד, סתום, או מותקן במיקום שגוי, אינו מאפשר כניסת אוויר למערכת הביוב', 'ת"י 1205 חלק 2 — שסתום אוורור יותקן מעל לגובה הגלישה של הכלי הסניטרי הגבוה ביותר המחובר לקו, במקום מאוורר.', 'ת"י 1205 חלק 2 — שסתום אוורור יותקן מעל לגובה הגלישה של הכלי הסניטרי הגבוה ביותר המחובר לקו, במקום מאוורר.', 'להחליף את שסתום האוורור בשסתום חדש תקין, ולהתקין בגובה ובמיקום הנכונים', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שסתום אוורור (AAV) לא תקין — שסתום אוורור (Air Admittance Valve) לא עובד, סתום, או מותקן במיקום שגוי, אינו מאפשר כניסת אוויר למערכת הביוב'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'מכסה בור ביקורת ביוב – חסר או פגום — מכסה בור ביקורת (שוחת ביוב) חסר, שבור, לא אטום, או לא מפולס עם הרצפה/קרקע', 'ת"י 1205 חלק 2 — בורות ביקורת יהיו עם מכסים אטומים, בחוזק מספיק, ונגישים לתחזוקה.', 'ת"י 1205 חלק 2 — בורות ביקורת יהיו עם מכסים אטומים, בחוזק מספיק, ונגישים לתחזוקה.', 'להחליף את המכסה הפגום במכסה חדש תקני, לוודא אטימות ופילוס', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מכסה בור ביקורת ביוב – חסר או פגום — מכסה בור ביקורת (שוחת ביוב) חסר, שבור, לא אטום, או לא מפולס עם הרצפה/קרקע'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'גלישת מים מאמבטיה/מקלחת לחדרים סמוכים — מים מחדר הרחצה/מקלחת חודרים לחדרים סמוכים בשל היעדר מפתן, איטום לקוי, או שיפוע שגוי', 'ת"י 1205 חלק 2 — חדרים רטובים חייבים במפתן או הפרש גובה מול חדרים יבשים, ובאיטום רצפה תקני למניעת חדירת מים.', 'ת"י 1205 חלק 2 — חדרים רטובים חייבים במפתן או הפרש גובה מול חדרים יבשים, ובאיטום רצפה תקני למניעת חדירת מים.', 'להתקין מפתן בכניסה לחדר הרטוב, לבדוק ולתקן איטום רצפה, ולוודא שיפוע נכון לכיוון הסיפון', 2500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גלישת מים מאמבטיה/מקלחת לחדרים סמוכים — מים מחדר הרחצה/מקלחת חודרים לחדרים סמוכים בשל היעדר מפתן, איטום לקוי, או שיפוע שגוי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'ניקוז מזגן – חיבור ישיר לביוב ללא סיפון — ניקוז עיבוי מזגן מחובר ישירות לצנרת ביוב ללא סיפון, גורם לחדירת ריחות ביוב דרך היחידה הפנימית', 'ת"י 1205 חלק 2 — כל חיבור למערכת הביוב חייב לעבור דרך סיפון עם מחסום ריח.', 'ת"י 1205 חלק 2 — כל חיבור למערכת הביוב חייב לעבור דרך סיפון עם מחסום ריח.', 'להתקין סיפון ייעודי לצנרת ניקוז עיבוי המזגן, לפני החיבור למערכת הביוב', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ניקוז מזגן – חיבור ישיר לביוב ללא סיפון — ניקוז עיבוי מזגן מחובר ישירות לצנרת ביוב ללא סיפון, גורם לחדירת ריחות ביוב דרך היחידה הפנימית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'מרזב/צנרת ניקוז מרפסת – שיפוע לא תקין — רצפת המרפסת ללא שיפוע מספיק לניקוז מי גשם, מים עומדים על המרפסת וחודרים לדירה', 'ת"י 1205 חלק 2 — מרפסות חשופות חייבות בשיפוע מינימלי של 1.5% לכיוון נקודת ניקוז, עם חיבור תקין למערכת ניקוז גשם.', 'ת"י 1205 חלק 2 — מרפסות חשופות חייבות בשיפוע מינימלי של 1.5% לכיוון נקודת ניקוז, עם חיבור תקין למערכת ניקוז גשם.', 'לבצע יציקת שיפוע מתקנת, להתקין ריצוף עם שיפוע תקני, ולוודא ניקוז תקין לנקודת היציאה', 4000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מרזב/צנרת ניקוז מרפסת – שיפוע לא תקין — רצפת המרפסת ללא שיפוע מספיק לניקוז מי גשם, מים עומדים על המרפסת וחודרים לדירה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'משאבת ייחוץ (סמפ) – חסרה או לא תקינה — בדירות קרקע או מרתפים – משאבת ייחוץ חסרה, לא מחוברת, או לא פועלת, סיכון להצפה', 'ת"י 1205 חלק 2 — בכל מקום שבו נקודת הניקוז נמצאת מתחת לגובה הביוב העירוני, יש להתקין משאבת ייחוץ עם שסתום חד-כיווני.', 'ת"י 1205 חלק 2 — בכל מקום שבו נקודת הניקוז נמצאת מתחת לגובה הביוב העירוני, יש להתקין משאבת ייחוץ עם שסתום חד-כיווני.', 'להתקין או לתקן משאבת ייחוץ עם שסתום חד-כיווני, לבדוק חיבור חשמל וצף הפעלה', 5000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'משאבת ייחוץ (סמפ) – חסרה או לא תקינה — בדירות קרקע או מרתפים – משאבת ייחוץ חסרה, לא מחוברת, או לא פועלת, סיכון להצפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'ניקוז איטי במקלחת — מים מתנקזים לאט במקלחת — עלול לנבוע מחוסר שיפוע או חסימה בצנרת', 'ת"י 1205 — ניקוז מקלחת חייב להתבצע תוך זמן סביר', 'ת"י 1205 — ניקוז מקלחת חייב להתבצע תוך זמן סביר', 'בדיקת שיפוע, פתיחת סתימה, תיקון שיפוע אם נדרש', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ניקוז איטי במקלחת — מים מתנקזים לאט במקלחת — עלול לנבוע מחוסר שיפוע או חסימה בצנרת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אינסטלציה (מים וביוב)', NULL, 'חוסר שיפוע בניקוז מרפסת — מרפסת ללא שיפוע מספיק לניקוז — מים נשארים על המשטח', 'ת"י 1515.3 — שיפוע מינימלי לניקוז: 1.5%', 'ת"י 1515.3 — שיפוע מינימלי לניקוז: 1.5%', 'תיקון שיפוע ריצוף לכיוון ניקוז', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר שיפוע בניקוז מרפסת — מרפסת ללא שיפוע מספיק לניקוז — מים נשארים על המשטח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'התקנה לקויה של אינטרפוץ (מערבל מקלחת) — אינטרפוץ מותקן שלא בגובה הנדרש, בולט מהקיר, לא מפולס, או שיש דליפה מסביבו. חיבורי המים חמים וקרים עשויים להיות מחוברים הפוך', 'ת"י 1205 חלק 2 — אינטרפוץ יותקן בגובה 100-110 ס"מ מרצפת המקלחת, מפולס, צמוד לקיר, כשהחיבור החם בצד שמאל (בהסתכלות חזיתית).', 'ת"י 1205 חלק 2 — אינטרפוץ יותקן בגובה 100-110 ס"מ מרצפת המקלחת, מפולס, צמוד לקיר, כשהחיבור החם בצד שמאל (בהסתכלות חזיתית).', 'לפרק את האינטרפוץ, לתקן את עמדת הצנרת בקיר, להתקין מחדש בגובה ובמיקום הנכונים, ולוודא חיבור תקין ללא דליפות', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'התקנה לקויה של אינטרפוץ (מערבל מקלחת) — אינטרפוץ מותקן שלא בגובה הנדרש, בולט מהקיר, לא מפולס, או שיש דליפה מסביבו. חיבורי המים חמים וקרים עשויים להיות מחוברים הפוך'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'חיבור מים חמים וקרים הפוך באינטרפוץ/מערבל — חיבורי המים החמים והקרים מחוברים בצורה הפוכה – כיוון סיבוב הידית אינו תואם לטמפרטורת המים בפועל', 'ת"י 1205 חלק 2 — חיבור מים חמים בצד שמאל וקרים בצד ימין (בהסתכלות חזיתית). סיבוב הידית שמאלה = חם, ימינה = קר.', 'ת"י 1205 חלק 2 — חיבור מים חמים בצד שמאל וקרים בצד ימין (בהסתכלות חזיתית). סיבוב הידית שמאלה = חם, ימינה = קר.', 'להחליף את חיבורי הצנרת החמה והקרה כך שיתאימו לתקן ולסימון על הברז', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיבור מים חמים וקרים הפוך באינטרפוץ/מערבל — חיבורי המים החמים והקרים מחוברים בצורה הפוכה – כיוון סיבוב הידית אינו תואם לטמפרטורת המים בפועל'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'ברז מטבח/כיור רופף או לא יציב — ברז הכיור במטבח או בחדר הרחצה רופף, נע ממקומו, או לא מהודק כראוי לכיור/משטח', 'ת"י 1205 חלק 2 — כל כלי סניטרי וברז יותקנו באופן יציב וחזק, ללא תזוזה, בהתאם להוראות היצרן.', 'ת"י 1205 חלק 2 — כל כלי סניטרי וברז יותקנו באופן יציב וחזק, ללא תזוזה, בהתאם להוראות היצרן.', 'להדק את אום החיזוק מתחת לכיור, להחליף אטם בסיס הברז במידת הצורך, ולוודא יציבות מלאה', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ברז מטבח/כיור רופף או לא יציב — ברז הכיור במטבח או בחדר הרחצה רופף, נע ממקומו, או לא מהודק כראוי לכיור/משטח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'נזילה מברז – טפטוף מתמשך — ברז מטפטף גם במצב סגור. בזבוז מים, רעש מטריד, ועלול לגרום לכתמי אבנית על הכיור', 'ת"י 1205 חלק 2 — ברזים חייבים להיות אטומים לחלוטין במצב סגור. אין לאפשר טפטוף או דליפה.', 'ת"י 1205 חלק 2 — ברזים חייבים להיות אטומים לחלוטין במצב סגור. אין לאפשר טפטוף או דליפה.', 'להחליף קרטוש (cartridge) של הברז, או את הברז כולו אם מדובר בדגם ישן או פגום', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזילה מברז – טפטוף מתמשך — ברז מטפטף גם במצב סגור. בזבוז מים, רעש מטריד, ועלול לגרום לכתמי אבנית על הכיור'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'אסלה רופפת – אינה מקובעת לרצפה — האסלה נעה ממקומה, לא מקובעת כראוי לרצפה או לקיר (אסלה תלויה). עלולה לגרום לדליפת מים מהחיבור לביוב', 'ת"י 1205 חלק 2 — כלים סניטריים יקובעו באופן יציב ובטוח, ללא תנועה, בהתאם להוראות היצרן ולסוג הקיבוע.', 'ת"י 1205 חלק 2 — כלים סניטריים יקובעו באופן יציב ובטוח, ללא תנועה, בהתאם להוראות היצרן ולסוג הקיבוע.', 'להדק את ברגי הקיבוע של האסלה לרצפה, להחליף אטם שעווה (wax ring) בחיבור לביוב, ולאטום בסיליקון', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אסלה רופפת – אינה מקובעת לרצפה — האסלה נעה ממקומה, לא מקובעת כראוי לרצפה או לקיר (אסלה תלויה). עלולה לגרום לדליפת מים מהחיבור לביוב'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'ניקוז איטי באסלה – שטיפה לא מספקת — האסלה אינה מתנקזת כראוי, השטיפה חלשה או חלקית, המים עולים ויורדים באיטיות', 'ת"י 1205 חלק 2 — מנגנון ההדחה חייב לספק נפח מים מספיק לניקוי יעיל של האסלה בשטיפה אחת (6/3 ליטר במנגנון דו-כמותי).', 'ת"י 1205 חלק 2 — מנגנון ההדחה חייב לספק נפח מים מספיק לניקוי יעיל של האסלה בשטיפה אחת (6/3 ליטר במנגנון דו-כמותי).', 'לבדוק חסימות בצנרת הביוב, לבדוק תקינות מנגנון ההדחה בניאגרה, לנקות או להחליף חלקים פנימיים', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ניקוז איטי באסלה – שטיפה לא מספקת — האסלה אינה מתנקזת כראוי, השטיפה חלשה או חלקית, המים עולים ויורדים באיטיות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'נזילה מניאגרה (מיכל הדחה) — נזילת מים מתמדת מהניאגרה לתוך האסלה (מים זורמים ללא הפסקה) או דליפה חיצונית מהמיכל', 'ת"י 1205 חלק 2 — מנגנון ההדחה חייב להיות אטום ולעצור זרימת מים לאחר סיום מחזור ההדחה.', 'ת"י 1205 חלק 2 — מנגנון ההדחה חייב להיות אטום ולעצור זרימת מים לאחר סיום מחזור ההדחה.', 'להחליף את מנגנון הניאגרה הפנימי (שסתום מצוף ושסתום פריקה), לבדוק אטימות חיבורי המים', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזילה מניאגרה (מיכל הדחה) — נזילת מים מתמדת מהניאגרה לתוך האסלה (מים זורמים ללא הפסקה) או דליפה חיצונית מהמיכל'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'כיור/כיור רחצה סדוק או פגום — סדק, שבר, או פגם בכיור המטבח או כיור חדר הרחצה. פגם אסתטי ופוטנציאל לדליפת מים', 'ת"י 1205 חלק 2 — כלים סניטריים יסופקו ויותקנו ללא פגמים, סדקים, שברים או פגיעה בציפוי.', 'ת"י 1205 חלק 2 — כלים סניטריים יסופקו ויותקנו ללא פגמים, סדקים, שברים או פגיעה בציפוי.', 'להחליף את הכיור הפגום בכיור חדש תקין ולחבר מחדש את הצנרת', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כיור/כיור רחצה סדוק או פגום — סדק, שבר, או פגם בכיור המטבח או כיור חדר הרחצה. פגם אסתטי ופוטנציאל לדליפת מים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'אמבטיה – אטימה לקויה בחיבור לקיר — אמבטיה שאינה אטומה כראוי בחיבור לקיר, מים חודרים מאחורי האמבטיה וגורמים לנזקי רטיבות', 'ת"י 1205 חלק 2 — חיבור האמבטיה לקיר חייב להיות אטום למים באמצעות חומר איטום גמיש (סיליקון סניטרי) למניעת חדירת מים.', 'ת"י 1205 חלק 2 — חיבור האמבטיה לקיר חייב להיות אטום למים באמצעות חומר איטום גמיש (סיליקון סניטרי) למניעת חדירת מים.', 'להסיר את האיטום הישן, לנקות ולייבש את המשטח, ולמרוח סיליקון סניטרי איכותי עמיד לעובש', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אמבטיה – אטימה לקויה בחיבור לקיר — אמבטיה שאינה אטומה כראוי בחיבור לקיר, מים חודרים מאחורי האמבטיה וגורמים לנזקי רטיבות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'מקלחון – נזילה מדלת/מחיצת זכוכית — נזילת מים מדלת המקלחון או ממחיצת הזכוכית, גורמת להצפת מים מחוץ לתא המקלחת', 'NULL', 'NULL', 'להחליף רצועות איטום (seals) של דלת המקלחון, לכוונן את הדלת, או לתקן את פרופיל האלומיניום', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מקלחון – נזילה מדלת/מחיצת זכוכית — נזילת מים מדלת המקלחון או ממחיצת הזכוכית, גורמת להצפת מים מחוץ לתא המקלחת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'ראש מקלחת (דוש) – לחץ נמוך או סתימה — ראש המקלחת מפזר מים בצורה לא אחידה, זרימה חלשה, או חלק מהנחירים סתומים בשל אבנית', 'NULL', 'NULL', 'לנקות את ראש המקלחת מאבנית (השרייה בחומץ), או להחליף בראש מקלחת חדש', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ראש מקלחת (דוש) – לחץ נמוך או סתימה — ראש המקלחת מפזר מים בצורה לא אחידה, זרימה חלשה, או חלק מהנחירים סתומים בשל אבנית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'חיבור מכונת כביסה – ללא סיפון וללא ברז ניתוק — נקודת חיבור מכונת הכביסה ללא סיפון (חיבור ישיר לביוב), ללא ברז ניתוק נפרד, או עם צנרת ניקוז לא מותאמת', 'ת"י 1205 חלק 2 — חיבור מכונת כביסה חייב לכלול סיפון עם מחסום ריח, ברז ניתוק נפרד למים, וניקוז בקוטר מתאים.', 'ת"י 1205 חלק 2 — חיבור מכונת כביסה חייב לכלול סיפון עם מחסום ריח, ברז ניתוק נפרד למים, וניקוז בקוטר מתאים.', 'להתקין סיפון תקני, ברז ניתוק נפרד (אנגל), ונקודת ניקוז בקוטר 50 מ"מ לפחות', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיבור מכונת כביסה – ללא סיפון וללא ברז ניתוק — נקודת חיבור מכונת הכביסה ללא סיפון (חיבור ישיר לביוב), ללא ברז ניתוק נפרד, או עם צנרת ניקוז לא מותאמת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'חיבור מדיח כלים – ללא סיפון וללא מפסק — נקודת חיבור מדיח הכלים ללא סיפון, ללא ברז ניתוק, או ללא לולאה עילית (high loop) בצנרת הניקוז', 'ת"י 1205 חלק 2 — חיבור מדיח כלים חייב לכלול סיפון, ברז ניתוק, וצנרת ניקוז עם לולאה עילית למניעת זרימה חוזרת.', 'ת"י 1205 חלק 2 — חיבור מדיח כלים חייב לכלול סיפון, ברז ניתוק, וצנרת ניקוז עם לולאה עילית למניעת זרימה חוזרת.', 'להתקין סיפון ולולאה עילית לצנרת הניקוז, להוסיף ברז ניתוק נפרד', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיבור מדיח כלים – ללא סיפון וללא מפסק — נקודת חיבור מדיח הכלים ללא סיפון, ללא ברז ניתוק, או ללא לולאה עילית (high loop) בצנרת הניקוז'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'אסלה תלויה – מסגרת הרכבה (סטלז'') רופפת — מסגרת ההרכבה של אסלה תלויה (concealed cistern frame) רופפת, גורמת לתנודות באסלה ולסיכון בטיחותי', 'ת"י 1205 חלק 2 — מסגרת הרכבה לאסלה תלויה חייבת לשאת עומס מינימלי של 400 ק"ג ולהיות מעוגנת לרצפה ולקיר.', 'ת"י 1205 חלק 2 — מסגרת הרכבה לאסלה תלויה חייבת לשאת עומס מינימלי של 400 ק"ג ולהיות מעוגנת לרצפה ולקיר.', 'לחזק את עיגון מסגרת ההרכבה לקיר ולרצפה, להדק את כל הברגים, ולוודא יציבות מלאה', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אסלה תלויה – מסגרת הרכבה (סטלז'') רופפת — מסגרת ההרכבה של אסלה תלויה (concealed cistern frame) רופפת, גורמת לתנודות באסלה ולסיכון בטיחותי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'כפתור הפעלה (לחצן) ניאגרה סמויה – לא תקין — כפתור ההפעלה של ניאגרה סמויה (concealed cistern) לא עובד, תקוע, או אינו מפעיל את שני נפחי השטיפה (3/6 ליטר)', 'NULL', 'NULL', 'להחליף את מנגנון ההפעלה הפנימי של הניאגרה, לכוונן את מוטות ההפעלה, ולבדוק תקינות שני מצבי השטיפה', 700, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כפתור הפעלה (לחצן) ניאגרה סמויה – לא תקין — כפתור ההפעלה של ניאגרה סמויה (concealed cistern) לא עובד, תקוע, או אינו מפעיל את שני נפחי השטיפה (3/6 ליטר)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'התקנת כלי סניטרי בגובה לא תקני — כיור, אסלה, או כלי סניטרי אחר מותקן בגובה שאינו עומד בדרישות הנגישות או התקן (גבוה/נמוך מדי)', 'ת"י 1205 חלק 2 — גובהות התקנה מומלצים: כיור רחצה – 80-85 ס"מ, אסלה – 40-42 ס"מ, כיור מטבח – 85-90 ס"מ (מידות מדף עליון).', 'ת"י 1205 חלק 2 — גובהות התקנה מומלצים: כיור רחצה – 80-85 ס"מ, אסלה – 40-42 ס"מ, כיור מטבח – 85-90 ס"מ (מידות מדף עליון).', 'לפרק ולהתקין מחדש את הכלי הסניטרי בגובה התקני המתאים', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'התקנת כלי סניטרי בגובה לא תקני — כיור, אסלה, או כלי סניטרי אחר מותקן בגובה שאינו עומד בדרישות הנגישות או התקן (גבוה/נמוך מדי)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'סיליקון סניטרי פגום או מעופש סביב כלים סניטריים — סיליקון סניטרי סביב כיור, אמבטיה, אסלה, או משטח עבודה שחור מעובש, סדוק, מתקלף, או חסר', 'NULL', 'NULL', 'להסיר את הסיליקון הישן בשלמותו, לנקות ולחטא את המשטח, ולמרוח סיליקון סניטרי חדש עמיד לעובש', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סיליקון סניטרי פגום או מעופש סביב כלים סניטריים — סיליקון סניטרי סביב כיור, אמבטיה, אסלה, או משטח עבודה שחור מעובש, סדוק, מתקלף, או חסר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'ויסות טמפרטורה לקוי – מים רותחים מברז — טמפרטורת המים החמים מהברז גבוהה מדי (מעל 50°C), מהווה סכנת כוויות, במיוחד לילדים ולקשישים', 'ת"י 1205 חלק 1 — טמפרטורת מים חמים בנקודות שימוש לא תעלה על 50°C. יש להתקין מערבל תרמוסטטי (TMV) במידת הצורך.', 'ת"י 1205 חלק 1 — טמפרטורת מים חמים בנקודות שימוש לא תעלה על 50°C. יש להתקין מערבל תרמוסטטי (TMV) במידת הצורך.', 'לכוונן את הטרמוסטט של דוד/בויילר, או להתקין מערבל תרמוסטטי (TMV) למניעת טמפרטורות מסוכנות', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ויסות טמפרטורה לקוי – מים רותחים מברז — טמפרטורת המים החמים מהברז גבוהה מדי (מעל 50°C), מהווה סכנת כוויות, במיוחד לילדים ולקשישים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כלים סניטריים', NULL, 'אסלה לא יציבה / רופפת — אסלה שלא מחוברת יציב לרצפה — מתנדנדת בשימוש', 'NULL', 'NULL', 'חיזוק חיבור אסלה לרצפה, החלפת ברגי עיגון', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אסלה לא יציבה / רופפת — אסלה שלא מחוברת יציב לרצפה — מתנדנדת בשימוש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — נזילת מים מהמסגרת — חדירת מים דרך מסגרת החלון בזמן גשם או מבחן מים. הנזילה יכולה להופיע בפינות המסגרת, בחיבור לקיר, או דרך חורי הניקוז. גורמים נפוצים: איטום לקוי בין המסגרת לקיר, חוסר בסיליקון חיצוני, או חורי ניקוז חסומים', 'ת"י 1509 — חלון אלומיניום חייב לעמוד בדרישות אטימות למים בלחץ רוח של 300 פסקל לפחות (תלוי בקומה ובאזור גיאוגרפי)', 'ת"י 1509 — חלון אלומיניום חייב לעמוד בדרישות אטימות למים בלחץ רוח של 300 פסקל לפחות (תלוי בקומה ובאזור גיאוגרפי)', 'לבצע מבחן מים (זרנוק לחץ 2 אטמ'' למשך 15 דקות). לאתר מקור הנזילה — אם מחיבור לקיר: להסיר איטום ישן, למלא ביורתן ולאטום מחדש בסיליקון. אם מחורי ניקוז: לנקות ולוודא שפיכה חופשית', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — נזילת מים מהמסגרת — חדירת מים דרך מסגרת החלון בזמן גשם או מבחן מים. הנזילה יכולה להופיע בפינות המסגרת, בחיבור לקיר, או דרך חורי הניקוז. גורמים נפוצים: איטום לקוי בין המסגרת לקיר, חוסר בסיליקון חיצוני, או חורי ניקוז חסומים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — חורי ניקוז חסומים או חסרים — חורי הניקוז (דרנז''ים) בתחתית מסגרת החלון חסומים על ידי טיט, צבע או חומרי בנייה, או שלא נקדחו כלל במהלך ההתקנה. חורי ניקוז נדרשים להוצאת מים שמצטברים בתעלת המסגרת התחתונה', 'ת"י 1509 — נדרשים לפחות 2 חורי ניקוז בכל מסגרת חלון, בקוטר מינימלי של 8 מ"מ, עם כיסויי ניקוז (פלאפות) תקינים', 'ת"י 1509 — נדרשים לפחות 2 חורי ניקוז בכל מסגרת חלון, בקוטר מינימלי של 8 מ"מ, עם כיסויי ניקוז (פלאפות) תקינים', 'לנקות את חורי הניקוז הקיימים. אם חסרים — לקדוח חורי ניקוז חדשים בתחתית המסגרת בהתאם למפרט היצרן ולהתקין פלאפות', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — חורי ניקוז חסומים או חסרים — חורי הניקוז (דרנז''ים) בתחתית מסגרת החלון חסומים על ידי טיט, צבע או חומרי בנייה, או שלא נקדחו כלל במהלך ההתקנה. חורי ניקוז נדרשים להוצאת מים שמצטברים בתעלת המסגרת התחתונה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — גומיות איטום (EPDM) בלויות או חסרות — גומיות האיטום (EPDM) שמוטמעות בתעלות הפרופיל סביב כנף החלון בלויות, מתקלפות, מתכווצות או חסרות לחלוטין. מצב זה גורם לחדירת רוח, מים, אבק ורעש', 'ת"י 1509 — חלון חייב לכלול מערכת איטום כפולה (פנימית וחיצונית) עם גומיות EPDM העומדות בתקן אריכות חיים', 'ת"י 1509 — חלון חייב לכלול מערכת איטום כפולה (פנימית וחיצונית) עם גומיות EPDM העומדות בתקן אריכות חיים', 'להחליף את כל גומיות האיטום בגומיות מקוריות של יצרן הפרופיל (Klil/Shamir/AGS). יש לוודא התאמה מדויקת לתעלת הפרופיל', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — גומיות איטום (EPDM) בלויות או חסרות — גומיות האיטום (EPDM) שמוטמעות בתעלות הפרופיל סביב כנף החלון בלויות, מתקלפות, מתכווצות או חסרות לחלוטין. מצב זה גורם לחדירת רוח, מים, אבק ורעש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון הזזה — גלגלות תחתונות שחוקות — גלגלות ההזזה (רולרים) בתחתית כנף חלון ההזזה שחוקות, שבורות או יוצאות ממסלולן. החלון נגרר בכבדות, קופץ מהמסילה, או לא נסגר עד הסוף', 'ת"י 1509 — כנף חלון הזזה חייבת לנוע בחופשיות ולהגיע לנעילה מלאה ללא מאמץ חריג', 'ת"י 1509 — כנף חלון הזזה חייבת לנוע בחופשיות ולהגיע לנעילה מלאה ללא מאמץ חריג', 'להחליף את הגלגלות בגלגלות מקוריות תואמות לסוג הפרופיל. לנקות את מסילת ההזזה התחתונה ולבדוק יישור', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון הזזה — גלגלות תחתונות שחוקות — גלגלות ההזזה (רולרים) בתחתית כנף חלון ההזזה שחוקות, שבורות או יוצאות ממסלולן. החלון נגרר בכבדות, קופץ מהמסילה, או לא נסגר עד הסוף'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון הזזה — מסילה תחתונה פגומה או מעוותת — מסילת ההזזה התחתונה מעוותת, שקועה בטיח, מלוכלכת בחומרי בנייה, או שבורה. החלון לא מחליק כראוי ולא מגיע לסגירה מלאה', 'ת"י 1509 — מסילת ההזזה חייבת להיות ישרה, חלקה, ונקייה מחסימות לאורך כל המסלול', 'ת"י 1509 — מסילת ההזזה חייבת להיות ישרה, חלקה, ונקייה מחסימות לאורך כל המסלול', 'לנקות את המסילה מחומרי בנייה. אם מעוותת — להחליף את פרופיל המסילה. לבדוק ולתקן גובה המסילה ביחס לרצפה', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון הזזה — מסילה תחתונה פגומה או מעוותת — מסילת ההזזה התחתונה מעוותת, שקועה בטיח, מלוכלכת בחומרי בנייה, או שבורה. החלון לא מחליק כראוי ולא מגיע לסגירה מלאה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון ציר (קייסמנט) — ציר עליון/תחתון רופף או שבור — צירי חלון הציר (קייסמנט) רופפים, חורקים, או שבורים. הכנף צונחת, לא נסגרת בצורה אחידה, או נשארת פתוחה שלא כרצון', 'ת"י 1509 — צירים חייבים לשאת את משקל הכנף ללא שקיעה ולאפשר פתיחה/סגירה חלקה לאורך חיי המוצר', 'ת"י 1509 — צירים חייבים לשאת את משקל הכנף ללא שקיעה ולאפשר פתיחה/סגירה חלקה לאורך חיי המוצר', 'להדק את ברגי הצירים. אם הצירים שחוקים או שבורים — להחליף בצירים מקוריים תואמי פרופיל. לכוונן את הכנף לאחר ההחלפה', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון ציר (קייסמנט) — ציר עליון/תחתון רופף או שבור — צירי חלון הציר (קייסמנט) רופפים, חורקים, או שבורים. הכנף צונחת, לא נסגרת בצורה אחידה, או נשארת פתוחה שלא כרצון'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון דריי-קיפ — מנגנון פתיחה כפולה תקול — מנגנון הפתיחה הכפולה (tilt & turn / דריי-קיפ) אינו פועל כראוי — החלון לא עובר בין מצב הטיה לפתיחה צירית, ידית תקועה, או הכנף ננעלת במצב ביניים מסוכן', 'ת"י 1509 — מנגנון פתיחה כפולה חייב לעבור בין שלושת המצבים (סגור, הטיה, פתיחה) בצורה חלקה ובטוחה', 'ת"י 1509 — מנגנון פתיחה כפולה חייב לעבור בין שלושת המצבים (סגור, הטיה, פתיחה) בצורה חלקה ובטוחה', 'לכוונן את נקודות הנעילה (espagnolette) של המנגנון. אם המנגנון פגום — להחליף מנגנון דריי-קיפ שלם תואם ליצרן הפרופיל', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון דריי-קיפ — מנגנון פתיחה כפולה תקול — מנגנון הפתיחה הכפולה (tilt & turn / דריי-קיפ) אינו פועל כראוי — החלון לא עובר בין מצב הטיה לפתיחה צירית, ידית תקועה, או הכנף ננעלת במצב ביניים מסוכן'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — חוסר גשר תרמי (thermal break) — הותקן פרופיל אלומיניום ללא גשר תרמי (פוליאמיד) במקום שנדרש פרופיל תרמי. ללא גשר תרמי נוצרת עיבוי (קונדנסציה) על הפרופיל בחורף וישנה אובדן אנרגיה משמעותי', 'ת"י 1045 — תקן בידוד תרמי במבנים מחייב ערך U מרבי לחלונות — פרופיל עם גשר תרמי נדרש באזורי אקלים B ו-C', 'ת"י 1045 — תקן בידוד תרמי במבנים מחייב ערך U מרבי לחלונות — פרופיל עם גשר תרמי נדרש באזורי אקלים B ו-C', 'להחליף את החלון בחלון עם פרופיל בעל גשר תרמי (thermal break). ליקוי זה דורש החלפה מלאה של המסגרת והכנפות', 4000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — חוסר גשר תרמי (thermal break) — הותקן פרופיל אלומיניום ללא גשר תרמי (פוליאמיד) במקום שנדרש פרופיל תרמי. ללא גשר תרמי נוצרת עיבוי (קונדנסציה) על הפרופיל בחורף וישנה אובדן אנרגיה משמעותי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — איטום חיצוני לקוי בין מסגרת לקיר — האיטום החיצוני בין מסגרת האלומיניום לקיר (טיח/שיש) חסר, סדוק, או לא רציף. הסיליקון מתקלף, מצהיב, או לא מכסה את כל המפגש. גורם לחדירת מים ורוח', 'ת"י 1509 — נדרש איטום רציף ואלסטי בכל היקף החלון בין המסגרת למשקוף/אדן', 'ת"י 1509 — נדרש איטום רציף ואלסטי בכל היקף החלון בין המסגרת למשקוף/אדן', 'להסיר איטום ישן, לנקות את המשטחים, למלא ביורתן גמיש ולאטום מחדש בסיליקון חיצוני UV-resistant מתאים לאלומיניום', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — איטום חיצוני לקוי בין מסגרת לקיר — האיטום החיצוני בין מסגרת האלומיניום לקיר (טיח/שיש) חסר, סדוק, או לא רציף. הסיליקון מתקלף, מצהיב, או לא מכסה את כל המפגש. גורם לחדירת מים ורוח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — רשת יתושים קרועה או חסרה — רשת היתושים קרועה, מנותקת מהמסגרת, או לא סופקה כלל. במפרט הדירה נדרשת רשת יתושים בכל חלון', 'NULL', 'NULL', 'להתקין/להחליף רשת יתושים תואמת — רשת הזזה, גלילה, או קבועה בהתאם לסוג החלון', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — רשת יתושים קרועה או חסרה — רשת היתושים קרועה, מנותקת מהמסגרת, או לא סופקה כלל. במפרט הדירה נדרשת רשת יתושים בכל חלון'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — מסגרת מעוותת או לא מפולסת — מסגרת החלון לא מפולסת (לא במאוזן/מאונך), מעוותת, או מפותלת. הכנף לא נסגרת באחידות, יש פער לא אחיד בין הכנף למסגרת, נגרמים בעיות איטום ונעילה', 'ת"י 1509 — סטייה מרבית מאנכיות ואופקיות: 2 מ"מ למטר אורך, עד מקסימום 3 מ"מ', 'ת"י 1509 — סטייה מרבית מאנכיות ואופקיות: 2 מ"מ למטר אורך, עד מקסימום 3 מ"מ', 'לפרק את החלון, ליישר את המסגרת בפילוס מדויק, לעגן מחדש ולאטום. במקרים חמורים — להחליף מסגרת', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — מסגרת מעוותת או לא מפולסת — מסגרת החלון לא מפולסת (לא במאוזן/מאונך), מעוותת, או מפותלת. הכנף לא נסגרת באחידות, יש פער לא אחיד בין הכנף למסגרת, נגרמים בעיות איטום ונעילה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — שריטות או נזק לפרופיל — שריטות עמוקות, מכות, או נזק לציפוי האלקטרוסטטי (אנודייז או צביעה) של פרופיל האלומיניום. נגרם בדרך כלל במהלך עבודות בנייה או הובלה', 'NULL', 'NULL', 'שריטות שטחיות — לטפל בצבע תיקון מקורי מהיצרן. שריטות עמוקות/נרחבות — להחליף את הפרופיל הפגום', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — שריטות או נזק לפרופיל — שריטות עמוקות, מכות, או נזק לציפוי האלקטרוסטטי (אנודייז או צביעה) של פרופיל האלומיניום. נגרם בדרך כלל במהלך עבודות בנייה או הובלה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — הרכבה ללא עיגון תקני לקיר — מסגרת החלון מעוגנת לקיר בצורה לא תקנית — רק בקצף פוליאורתן ללא דיבלים, עם מספר לא מספיק של נקודות עיגון, או עם מרווחים גדולים מדי בין נקודות העיגון', 'ת"י 1509 — נדרשות נקודות עיגון מכאניות (דיבלים/ברגי בטון) כל 60 ס"מ לפחות, ולא יותר מ-15 ס"מ מכל פינה', 'ת"י 1509 — נדרשות נקודות עיגון מכאניות (דיבלים/ברגי בטון) כל 60 ס"מ לפחות, ולא יותר מ-15 ס"מ מכל פינה', 'להוסיף נקודות עיגון מכאניות (פישר + בורג נירוסטה) בהתאם לתקן. לא להסתפק בקצף בלבד', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — הרכבה ללא עיגון תקני לקיר — מסגרת החלון מעוגנת לקיר בצורה לא תקנית — רק בקצף פוליאורתן ללא דיבלים, עם מספר לא מספיק של נקודות עיגון, או עם מרווחים גדולים מדי בין נקודות העיגון'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — חדירת אוויר (רוח) חריגה — חדירת אוויר חריגה דרך החלון במצב סגור — מורגשת רוח, שריקת רוח, או נכנס אבק. הגורם: גומיות לא תקינות, נעילה חלקית, מסגרת לא מיושרת', 'ת"י 1509 — חדירת אוויר מרבית: סיווג A2 לפחות (6.75 מ"ק/שעה/מ"ר בלחץ 100 פסקל)', 'ת"י 1509 — חדירת אוויר מרבית: סיווג A2 לפחות (6.75 מ"ק/שעה/מ"ר בלחץ 100 פסקל)', 'לבדוק ולהחליף גומיות איטום. לכוונן נקודות נעילה להידוק מלא. לבדוק יישור מסגרת. לבצע בדיקת blower door אם נדרש', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — חדירת אוויר (רוח) חריגה — חדירת אוויר חריגה דרך החלון במצב סגור — מורגשת רוח, שריקת רוח, או נכנס אבק. הגורם: גומיות לא תקינות, נעילה חלקית, מסגרת לא מיושרת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — אדן שיש חיצוני ללא שיפוע — אדן השיש/אבן החיצוני של החלון ללא שיפוע כלפי חוץ, או עם שיפוע הפוך — מים מצטברים על האדן ונכנסים פנימה במקום לנקז החוצה', 'ת"י 1509 — אדן חיצוני חייב להיות משופע כלפי חוץ עם טפטפת (drip edge) למניעת זרימת מים לקיר', 'ת"י 1509 — אדן חיצוני חייב להיות משופע כלפי חוץ עם טפטפת (drip edge) למניעת זרימת מים לקיר', 'להתקין מחדש את אדן השיש בשיפוע של 3-5% כלפי חוץ. לוודא טפטפת בחזית האדן ואיטום למסגרת', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — אדן שיש חיצוני ללא שיפוע — אדן השיש/אבן החיצוני של החלון ללא שיפוע כלפי חוץ, או עם שיפוע הפוך — מים מצטברים על האדן ונכנסים פנימה במקום לנקז החוצה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — צבע פרופיל לא תואם למפרט — צבע הפרופיל (RAL) לא תואם למפרט הפרויקט — גוון שונה, צבע מתקלף, ציפוי לא אחיד, או הבדלי גוון בין חלונות שונים באותה דירה', 'NULL', 'NULL', 'אם הצבע לא תואם למפרט — להחליף את הפרופילים הפגומים. אם ציפוי מתקלף — תביעת אחריות מיצרן הפרופיל', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — צבע פרופיל לא תואם למפרט — צבע הפרופיל (RAL) לא תואם למפרט הפרויקט — גוון שונה, צבע מתקלף, ציפוי לא אחיד, או הבדלי גוון בין חלונות שונים באותה דירה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — עיבוי (קונדנסציה) על הפרופיל — עיבוי מים (קונדנסציה) נוצר על פרופיל האלומיניום בחורף, בעיקר בפרופיל ללא גשר תרמי. המים נוזלים לאדן ולקיר וגורמים לעובש ולנזק', 'ת"י 1045 — מעטפת הבניין, כולל חלונות, חייבת למנוע עיבוי על משטחים פנימיים בתנאי שימוש רגילים', 'ת"י 1045 — מעטפת הבניין, כולל חלונות, חייבת למנוע עיבוי על משטחים פנימיים בתנאי שימוש רגילים', 'פתרון מלא: החלפת חלון לפרופיל עם גשר תרמי. פתרון חלקי: שיפור אוורור החדר, התקנת מפוח אוויר', 4000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — עיבוי (קונדנסציה) על הפרופיל — עיבוי מים (קונדנסציה) נוצר על פרופיל האלומיניום בחורף, בעיקר בפרופיל ללא גשר תרמי. המים נוזלים לאדן ולקיר וגורמים לעובש ולנזק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון לא אוטם — חדירת אוויר/מים — חלון שלא אוטם כראוי — חדירת אוויר, מים או אבק', 'ת"י 23 — חלונות חייבים לעמוד בתקן אטימות למים ואוויר', 'ת"י 23 — חלונות חייבים לעמוד בתקן אטימות למים ואוויר', 'החלפת רצועות אטימה, תיקון סיליקון, כוונון', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון לא אוטם — חדירת אוויר/מים — חלון שלא אוטם כראוי — חדירת אוויר, מים או אבק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'דלת מרפסת אלומיניום — סף תחתון גבוה מדי — סף דלת המרפסת בולט מעל פני הרצפה ביותר מ-20 מ"מ, מהווה מכשול מעידה ואינו נגיש לנכים ולעגלות', 'ת"י 1918 — דרישות נגישות — סף דלת לא יעלה על 20 מ"מ, ורצוי סף שטוח/משופע', 'ת"י 1918 — דרישות נגישות — סף דלת לא יעלה על 20 מ"מ, ורצוי סף שטוח/משופע', 'להחליף את הסף בסף נמוך/שטוח תואם נגישות. אם לא ניתן — להתקין רמפה משופעת בשני צדי הסף', 900, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת מרפסת אלומיניום — סף תחתון גבוה מדי — סף דלת המרפסת בולט מעל פני הרצפה ביותר מ-20 מ"מ, מהווה מכשול מעידה ואינו נגיש לנכים ולעגלות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'דלת מרפסת הזזה — גלילה כבדה ולא חלקה — דלת ההזזה למרפסת נגררת בכבדות, דורשת כוח רב לפתיחה/סגירה, או נתקעת באמצע המסלול. נגרם מגלגלות שחוקות, מסילה מלוכלכת, או כנף לא מכוונת', 'ת"י 1509 — דלת הזזה חייבת להיפתח בכוח שאינו עולה על 50 ניוטון (כ-5 ק"ג)', 'ת"י 1509 — דלת הזזה חייבת להיפתח בכוח שאינו עולה על 50 ניוטון (כ-5 ק"ג)', 'לנקות מסילות, לשמן גלגלות. להחליף גלגלות שחוקות. לכוונן גובה כנף ביחס למסילה', 700, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת מרפסת הזזה — גלילה כבדה ולא חלקה — דלת ההזזה למרפסת נגררת בכבדות, דורשת כוח רב לפתיחה/סגירה, או נתקעת באמצע המסלול. נגרם מגלגלות שחוקות, מסילה מלוכלכת, או כנף לא מכוונת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'דלת מרפסת הזזה — נעילה רב-נקודתית לא תקינה — מנגנון הנעילה הרב-נקודתי של דלת המרפסת לא פועל כראוי — חלק מנקודות הנעילה לא ננעלות, הידית לא מסתובבת עד הסוף, או שהנעילה לא אטומה', 'ת"י 1509 — דלת חייבת להינעל בנעילה רב-נקודתית המבטיחה איטום ואבטחה בכל נקודות המגע', 'ת"י 1509 — דלת חייבת להינעל בנעילה רב-נקודתית המבטיחה איטום ואבטחה בכל נקודות המגע', 'לכוונן את נקודות הנעילה והנגדים. לשמן את מוטות הנעילה. אם המנגנון פגום — להחליף את מערכת הנעילה', 1000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת מרפסת הזזה — נעילה רב-נקודתית לא תקינה — מנגנון הנעילה הרב-נקודתי של דלת המרפסת לא פועל כראוי — חלק מנקודות הנעילה לא ננעלות, הידית לא מסתובבת עד הסוף, או שהנעילה לא אטומה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'דלת כניסה אלומיניום — צילינדר/מנעול לא תקני — צילינדר המנעול בדלת הכניסה אינו עומד בתקן אבטחה — ללא הגנה מפני קידוח, פריצה, או bump key. או שבולט מעבר לרוזטה ביותר מ-3 מ"מ', 'ת"י 5514 — צילינדר בדלת כניסה חייב לעמוד בדרגת אבטחה מינימלית לפי ת"י 5514', 'ת"י 5514 — צילינדר בדלת כניסה חייב לעמוד בדרגת אבטחה מינימלית לפי ת"י 5514', 'להחליף את הצילינדר בצילינדר תקני בעל דרגת אבטחה מתאימה (לפחות 5 פינים, הגנת קידוח)', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת כניסה אלומיניום — צילינדר/מנעול לא תקני — צילינדר המנעול בדלת הכניסה אינו עומד בתקן אבטחה — ללא הגנה מפני קידוח, פריצה, או bump key. או שבולט מעבר לרוזטה ביותר מ-3 מ"מ'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'דלת אלומיניום — סוגר (Door Closer) חסר או לא מכוונן — סוגר דלת (door closer) חסר בדלת שנדרש בה (דלת חדר מדרגות, דלת אש), או שהסוגר הקיים לא מכוונן — הדלת נטרקת או לא נסגרת עד הסוף', 'ת"י 1555 — דלתות בדרכי מילוט ודלתות אש חייבות בסוגר עצמי מאושר שמחזיר את הדלת לסגירה מלאה', 'ת"י 1555 — דלתות בדרכי מילוט ודלתות אש חייבות בסוגר עצמי מאושר שמחזיר את הדלת לסגירה מלאה', 'להתקין סוגר דלת מתאים לגודל ומשקל הדלת. אם קיים — לכוונן את מהירות הסגירה והנעילה (latch speed)', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת אלומיניום — סוגר (Door Closer) חסר או לא מכוונן — סוגר דלת (door closer) חסר בדלת שנדרש בה (דלת חדר מדרגות, דלת אש), או שהסוגר הקיים לא מכוונן — הדלת נטרקת או לא נסגרת עד הסוף'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'דלת אלומיניום — פער לא אחיד בין כנף למשקוף — הרווח בין כנף הדלת למסגרת (משקוף ומזוזות) לא אחיד — גדול מדי בצד אחד וצר מהצד השני. מעיד על כנף שלא מכוונת, צירים שחוקים, או מסגרת מעוותת', 'ת"י 1509 — רווח בין כנף למסגרת חייב להיות אחיד, בהתאם למפרט היצרן (בדרך כלל 3-5 מ"מ)', 'ת"י 1509 — רווח בין כנף למסגרת חייב להיות אחיד, בהתאם למפרט היצרן (בדרך כלל 3-5 מ"מ)', 'לכוונן את הצירים להשגת רווח אחיד. אם הצירים שחוקים — להחליפם. במקרה של מסגרת מעוותת — ליישר ולעגן מחדש', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת אלומיניום — פער לא אחיד בין כנף למשקוף — הרווח בין כנף הדלת למסגרת (משקוף ומזוזות) לא אחיד — גדול מדי בצד אחד וצר מהצד השני. מעיד על כנף שלא מכוונת, צירים שחוקים, או מסגרת מעוותת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'דלת כניסה אלומיניום — בידוד אקוסטי לא מספיק — דלת הכניסה לא מספקת בידוד אקוסטי מספיק — נשמעים רעשי חדר מדרגות, שכנים ומעלית בתוך הדירה. הפער בין הדלת למשקוף גדול מדי או חסרות גומיות איטום', 'ת"י 1142 — נדרש בידוד אקוסטי מינימלי של 30 dB בין חדר מדרגות לדירה', 'ת"י 1142 — נדרש בידוד אקוסטי מינימלי של 30 dB בין חדר מדרגות לדירה', 'להתקין/להחליף גומיות איטום היקפיות. להתקין סף תחתון אוטומטי (drop seal). אם לא מספיק — להחליף לדלת עם בידוד אקוסטי מוגבר', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת כניסה אלומיניום — בידוד אקוסטי לא מספיק — דלת הכניסה לא מספקת בידוד אקוסטי מספיק — נשמעים רעשי חדר מדרגות, שכנים ומעלית בתוך הדירה. הפער בין הדלת למשקוף גדול מדי או חסרות גומיות איטום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'דלת מרפסת — חוסר מעקה בטיחות — דלת מרפסת צרפתית (French door) ללא מעקה בטיחות חיצוני, כאשר פתח הדלת בקומה גבוהה ואין מרפסת. מהווה סכנת נפילה חמורה', 'ת"י 1142 — פתח בקומה שנייה ומעלה חייב במעקה בגובה 105 ס"מ לפחות (עם דרישות רווח וחוזק)', 'ת"י 1142 — פתח בקומה שנייה ומעלה חייב במעקה בגובה 105 ס"מ לפחות (עם דרישות רווח וחוזק)', 'להתקין מעקה בטיחות צמוד לפתח הדלת — מעקה אלומיניום/נירוסטה עם זכוכית בטיחות, בגובה 105 ס"מ', 4000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת מרפסת — חוסר מעקה בטיחות — דלת מרפסת צרפתית (French door) ללא מעקה בטיחות חיצוני, כאשר פתח הדלת בקומה גבוהה ואין מרפסת. מהווה סכנת נפילה חמורה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס גלילה — מנוע חשמלי לא פועל — מנוע התריס החשמלי לא פועל — התריס לא עולה, לא יורד, או נתקע באמצע. הגורמים: תקלת מנוע, בעיית חשמל, מתג מגבלה (limit switch) לא מכוונן, או קונדנסטור תקול', 'NULL', 'NULL', 'לבדוק חיבור חשמל ומפסק. לבדוק קונדנסטור מנוע. לכוונן מתגי מגבלה. אם המנוע שרוף — להחליף מנוע תואם למידות הגליל', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס גלילה — מנוע חשמלי לא פועל — מנוע התריס החשמלי לא פועל — התריס לא עולה, לא יורד, או נתקע באמצע. הגורמים: תקלת מנוע, בעיית חשמל, מתג מגבלה (limit switch) לא מכוונן, או קונדנסטור תקול'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס גלילה — למלות (שלבים) עקומות או שבורות — למלות (שלבים) של תריס הגלילה עקומות, שבורות, או מנותקות זו מזו. התריס לא יורד/עולה כראוי, לא אטום לאור, ומראה חיצוני פגום', 'NULL', 'NULL', 'להחליף את הלמלות הפגומות בלמלות חדשות תואמות (זהה ברוחב, עובי, וצורת חיבור). במקרה של נזק נרחב — להחליף את מילוי התריס כולו', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס גלילה — למלות (שלבים) עקומות או שבורות — למלות (שלבים) של תריס הגלילה עקומות, שבורות, או מנותקות זו מזו. התריס לא יורד/עולה כראוי, לא אטום לאור, ומראה חיצוני פגום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס גלילה — מסילות צד פגומות — מסילות הצד (מובילים) של תריס הגלילה פגומות, מעוותות, או לא מותקנות כראוי. התריס קופץ מהמסילה, נתקע, או לא מונע חדירת אור', 'NULL', 'NULL', 'ליישר את מסילות הצד ולעגן מחדש. אם פגומות — להחליף. לוודא רווח אחיד בין הלמלות למסילה', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס גלילה — מסילות צד פגומות — מסילות הצד (מובילים) של תריס הגלילה פגומות, מעוותות, או לא מותקנות כראוי. התריס קופץ מהמסילה, נתקע, או לא מונע חדירת אור'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס גלילה — תיבת גלילה (קופסת תריס) לא מבודדת — תיבת הגלילה (קופסת התריס) לא מבודדת תרמית ואקוסטית — נוצרת נקודת קור בחורף, עיבוי מים, חדירת רעש, ולעיתים גם חדירת מזיקים', 'ת"י 1045 — תיבת תריס חייבת לעמוד בדרישות בידוד תרמי — ערך U מרבי כמו יתר המעטפת', 'ת"י 1045 — תיבת תריס חייבת לעמוד בדרישות בידוד תרמי — ערך U מרבי כמו יתר המעטפת', 'לפתוח את תיבת הגלילה ולהדביק בידוד תרמי (לוח XPS/EPS או מוצר ייעודי). לאטום את כל הפרצים באיטום אלסטי', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס גלילה — תיבת גלילה (קופסת תריס) לא מבודדת — תיבת הגלילה (קופסת התריס) לא מבודדת תרמית ואקוסטית — נוצרת נקודת קור בחורף, עיבוי מים, חדירת רעש, ולעיתים גם חדירת מזיקים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס גלילה — רצועת הפעלה (סרט) קרועה או שחוקה — רצועת ההפעלה (סרט התריס) של תריס ידני קרועה, שחוקה, או נתקעת בגליל. התריס לא ניתן להפעלה', 'NULL', 'NULL', 'להחליף את רצועת ההפעלה כולל גלגלת הסרט (avvolgitore). לוודא מידה תואמת (רוחב 14/20/23 מ"מ)', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס גלילה — רצועת הפעלה (סרט) קרועה או שחוקה — רצועת ההפעלה (סרט התריס) של תריס ידני קרועה, שחוקה, או נתקעת בגליל. התריס לא ניתן להפעלה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס גלילה — רעש חריג בזמן הפעלה — התריס משמיע רעש חריג (חריקה, נקישות, רעידות) בזמן עלייה או ירידה. גורמים: מסילות יבשות, למלות פגומות, ציר לא מיושר, או מנוע רועד', 'NULL', 'NULL', 'לשמן מסילות צד בסיליקון ספריי. לבדוק ולהחליף למלות פגומות. לכוונן יישור גליל וציר. אם מנוע — לבדוק עיגון ושקטי רעידות', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס גלילה — רעש חריג בזמן הפעלה — התריס משמיע רעש חריג (חריקה, נקישות, רעידות) בזמן עלייה או ירידה. גורמים: מסילות יבשות, למלות פגומות, ציר לא מיושר, או מנוע רועד'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס הצללה מתקפל — זרועות שבורות או רופפות — זרועות תריס ההצללה המתקפל (תריס ונציאני/פרסול) שבורות, רופפות, או לא ננעלות במצב פתוח. התריס לא נשאר פתוח ברוח או לא נסגר כראוי', 'NULL', 'NULL', 'להחליף את הזרועות הפגומות בזרועות מקוריות. להדק את כל ברגי החיבור. לשמן צירים וציפים', 700, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס הצללה מתקפל — זרועות שבורות או רופפות — זרועות תריס ההצללה המתקפל (תריס ונציאני/פרסול) שבורות, רופפות, או לא ננעלות במצב פתוח. התריס לא נשאר פתוח ברוח או לא נסגר כראוי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס גלילה — חדירת אור בין למלות במצב סגור — כשהתריס סגור לחלוטין, נכנס אור בין הלמלות — הלמלות לא נסגרות ברצף צפוף, יש רווחים גלויים, או שלמלות מעוותות לא מתיישרות', 'NULL', 'NULL', 'לכוונן את מתח התריס ואת מגבלת הירידה. להחליף למלות מעוותות. לוודא שכל הלמלות מסוג זהה ותקינות', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס גלילה — חדירת אור בין למלות במצב סגור — כשהתריס סגור לחלוטין, נכנס אור בין הלמלות — הלמלות לא נסגרות ברצף צפוף, יש רווחים גלויים, או שלמלות מעוותות לא מתיישרות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'תריס חשמלי תקוע / לא עולה — תריס חשמלי שלא עולה, יורד, או תקוע באמצע', 'NULL', 'NULL', 'בדיקת מנוע, כוונון מסילות, החלפת רכיב פגום', 1000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תריס חשמלי תקוע / לא עולה — תריס חשמלי שלא עולה, יורד, או תקוע באמצע'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — זכוכית לא בטיחותית — הותקנה זכוכית רגילה (לא בטיחותית) במקום שנדרשת זכוכית בטיחות — מחוסמת או שכבתית (למינציה). זכוכית רגילה מתנפצת לרסיסים חדים ומהווה סכנת חיים', 'ת"י 1099 — ת"י 1099 מחייב זכוכית בטיחות בחלונות עד גובה 80 ס"מ מהרצפה, בדלתות זכוכית, במעקות, ובמקלחות', 'ת"י 1099 — ת"י 1099 מחייב זכוכית בטיחות בחלונות עד גובה 80 ס"מ מהרצפה, בדלתות זכוכית, במעקות, ובמקלחות', 'להחליף את הזכוכית בזכוכית בטיחותית (מחוסמת או למינציה) בהתאם לדרישת התקן. לוודא חותמת תקן על הזכוכית החדשה', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — זכוכית לא בטיחותית — הותקנה זכוכית רגילה (לא בטיחותית) במקום שנדרשת זכוכית בטיחות — מחוסמת או שכבתית (למינציה). זכוכית רגילה מתנפצת לרסיסים חדים ומהווה סכנת חיים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — זכוכית תרמית (דאבל גלייז) לא אטומה — יחידת הזיגוג הכפול (דאבל גלייז) מאבדת את האטימות — נראית עננות/ערפל בין שכבות הזכוכית. סימן לכשל באיטום היקפי של היחידה, מה שמבטל את הבידוד התרמי', 'ת"י 1509 — יחידת זיגוג מבודד חייבת לשמור על ריק/גז בין השכבות לאורך חיי המוצר', 'ת"י 1509 — יחידת זיגוג מבודד חייבת לשמור על ריק/גז בין השכבות לאורך חיי המוצר', 'להחליף את יחידת הזיגוג הכפול בשלמותה. אין אפשרות לתקן יחידה שאיבדה אטימות', 900, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — זכוכית תרמית (דאבל גלייז) לא אטומה — יחידת הזיגוג הכפול (דאבל גלייז) מאבדת את האטימות — נראית עננות/ערפל בין שכבות הזכוכית. סימן לכשל באיטום היקפי של היחידה, מה שמבטל את הבידוד התרמי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — סדק או שבר בזכוכית — סדק, שבר, או ניקוב בזכוכית החלון. יכול להיגרם ממכה, מתח תרמי, או מלחץ לא אחיד של מסגרת החלון על הזכוכית', 'ת"י 1099 — זכוכית בחלון חייבת להיות שלמה, ללא סדקים או שברים, ולעמוד בדרישות בטיחות', 'ת"י 1099 — זכוכית בחלון חייבת להיות שלמה, ללא סדקים או שברים, ולעמוד בדרישות בטיחות', 'להחליף את הזכוכית השבורה בזכוכית חדשה תואמת תקן (בטיחותית היכן שנדרש). לבדוק שהמסגרת לא לוחצת על הזכוכית', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — סדק או שבר בזכוכית — סדק, שבר, או ניקוב בזכוכית החלון. יכול להיגרם ממכה, מתח תרמי, או מלחץ לא אחיד של מסגרת החלון על הזכוכית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'זכוכית חלון — חוסר התאמה למפרט (עובי/סוג) — הזכוכית שהותקנה לא תואמת למפרט המכר — עובי נמוך מהנדרש, זכוכית בודדת במקום כפולה, או חסרה שכבת Low-E שנדרשה במפרט', 'ת"י 1509 — הזיגוג חייב להתאים למפרט הטכני של הפרויקט ולדרישות התקן לגודל החלון', 'ת"י 1509 — הזיגוג חייב להתאים למפרט הטכני של הפרויקט ולדרישות התקן לגודל החלון', 'להחליף את הזכוכית בזכוכית התואמת למפרט המכר. לדרוש אישור יצרן על סוג הזכוכית שהותקנה', 1000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'זכוכית חלון — חוסר התאמה למפרט (עובי/סוג) — הזכוכית שהותקנה לא תואמת למפרט המכר — עובי נמוך מהנדרש, זכוכית בודדת במקום כפולה, או חסרה שכבת Low-E שנדרשה במפרט'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — חוסר בזכוכית Low-E נדרשת — הותקנה זכוכית כפולה ללא שכבת Low-E (שכבה פולטת נמוכה) שנדרשת במפרט או לפי תקן בידוד תרמי. ללא Low-E הבידוד התרמי נמוך משמעותית', 'ת"י 1045 — לעמידה בדרישות בידוד תרמי למבנים, נדרשת בדרך כלל זכוכית עם שכבת Low-E להשגת ערך U נמוך', 'ת"י 1045 — לעמידה בדרישות בידוד תרמי למבנים, נדרשת בדרך כלל זכוכית עם שכבת Low-E להשגת ערך U נמוך', 'להחליף את יחידת הזיגוג הכפול ביחידה עם זכוכית Low-E. לוודא שסוג ה-Low-E (hard coat/soft coat) תואם למפרט', 1000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — חוסר בזכוכית Low-E נדרשת — הותקנה זכוכית כפולה ללא שכבת Low-E (שכבה פולטת נמוכה) שנדרשת במפרט או לפי תקן בידוד תרמי. ללא Low-E הבידוד התרמי נמוך משמעותית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'זכוכית שרוטה / סדוקה — שריטות או סדקים בזכוכית חלון', 'NULL', 'NULL', 'החלפת זכוכית פגומה', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'זכוכית שרוטה / סדוקה — שריטות או סדקים בזכוכית חלון'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — ידית סיבובית רופפת או שבורה — ידית החלון רופפת, מסתובבת ללא אחיזה, או שבורה. הידית לא מפעילה את מנגנון הנעילה כראוי והחלון נשאר לא נעול', 'ת"י 1509 — ידית החלון חייבת להפעיל את מנגנון הנעילה באופן מלא ובטוח בכל מצבי הפתיחה', 'ת"י 1509 — ידית החלון חייבת להפעיל את מנגנון הנעילה באופן מלא ובטוח בכל מצבי הפתיחה', 'להדק את בסיס הידית (להרים כיסוי פלסטיק ולהדק ברגים). אם הידית שבורה — להחליף בידית מקורית תואמת', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — ידית סיבובית רופפת או שבורה — ידית החלון רופפת, מסתובבת ללא אחיזה, או שבורה. הידית לא מפעילה את מנגנון הנעילה כראוי והחלון נשאר לא נעול'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — נעילה לא תקינה (אספניולט) — מנגנון הנעילה (אספניולט) לא נועל את החלון בכל נקודות הנעילה. חלק מנקודות הנעילה לא מתיישבות כראוי בנגד (striker plate) — החלון לא אטום ולא מאובטח', 'ת"י 1509 — חלון חייב להינעל בכל נקודות הנעילה שתוכננו על ידי היצרן, עם לחיצה אחידה של הגומיות', 'ת"י 1509 — חלון חייב להינעל בכל נקודות הנעילה שתוכננו על ידי היצרן, עם לחיצה אחידה של הגומיות', 'לכוונן את נקודות הנעילה והנגדים. לשמן את מנגנון האספניולט. אם פגום — להחליף את מוט הנעילה או הנגדים', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — נעילה לא תקינה (אספניולט) — מנגנון הנעילה (אספניולט) לא נועל את החלון בכל נקודות הנעילה. חלק מנקודות הנעילה לא מתיישבות כראוי בנגד (striker plate) — החלון לא אטום ולא מאובטח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — חוסר מגביל פתיחה בקומה גבוהה — חלון בקומה 2 ומעלה חסר מגביל פתיחה (מגביל זווית או כבל בטיחות) בהתאם לתקנות הבטיחות. ילדים עלולים ליפול מחלון הנפתח לרווחה', 'ת"י 1509 — חלון מעל קומת קרקע חייב לכלול מגביל פתיחה המגביל את הפתח ל-100 מ"מ מרבי, עם אפשרות שחרור למבוגרים', 'ת"י 1509 — חלון מעל קומת קרקע חייב לכלול מגביל פתיחה המגביל את הפתח ל-100 מ"מ מרבי, עם אפשרות שחרור למבוגרים', 'להתקין מגביל פתיחה תקני — כבל בטיחות או מגביל זווית צמוד פרופיל — בכל חלון נדרש. לוודא שהמגביל ניתן לשחרור על ידי מבוגר בלבד', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — חוסר מגביל פתיחה בקומה גבוהה — חלון בקומה 2 ומעלה חסר מגביל פתיחה (מגביל זווית או כבל בטיחות) בהתאם לתקנות הבטיחות. ילדים עלולים ליפול מחלון הנפתח לרווחה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — חוסר סורג בטיחות בחלון נמוך — חלון שתחתיתו בגובה נמוך מ-80 ס"מ מהרצפה חסר סורג בטיחות או מעקה להגנה מפני נפילה, בעיקר בקומות גבוהות', 'ת"י 1142 — נדרש אמצעי מיגון (סורג/מעקה) בחלון שתחתיתו נמוכה מ-80 ס"מ מרצפת החדר, בקומה שנייה ומעלה', 'ת"י 1142 — נדרש אמצעי מיגון (סורג/מעקה) בחלון שתחתיתו נמוכה מ-80 ס"מ מרצפת החדר, בקומה שנייה ומעלה', 'להתקין סורג בטיחות פנימי (מפרופיל אלומיניום או נירוסטה) בהתאם לתקן, עם רווח מרבי של 10 ס"מ בין חלקיו', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — חוסר סורג בטיחות בחלון נמוך — חלון שתחתיתו בגובה נמוך מ-80 ס"מ מהרצפה חסר סורג בטיחות או מעקה להגנה מפני נפילה, בעיקר בקומות גבוהות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'חלון אלומיניום — פרזול (Hardware) לא תואם למפרט — הפרזול שהותקן (ידיות, צירים, מנגנוני נעילה) אינו תואם למפרט הפרויקט — דרגה נמוכה יותר, יצרן אחר, או חסרים רכיבים שנדרשו (כגון נעילת ביטחון)', 'NULL', 'NULL', 'להחליף את הפרזול בפרזול התואם למפרט המכר. לתעד את ההבדל ולדרוש התאמה או פיצוי', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון אלומיניום — פרזול (Hardware) לא תואם למפרט — הפרזול שהותקן (ידיות, צירים, מנגנוני נעילה) אינו תואם למפרט הפרויקט — דרגה נמוכה יותר, יצרן אחר, או חסרים רכיבים שנדרשו (כגון נעילת ביטחון)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'אלומיניום', NULL, 'ידית חלון שבורה / רופפת — ידית חלון שבורה, רופפת, או לא נועלת', 'NULL', 'NULL', 'החלפת ידית חלון', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ידית חלון שבורה / רופפת — ידית חלון שבורה, רופפת, או לא נועלת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'שקע חשמל ללא הארקה תקינה — שקע חשמל שאינו מחובר להארקה או שחיבור ההארקה לקוי. מדידה מראה התנגדות הארקה גבוהה מהמותר (מעל 1 אוהם). מהווה סכנת חשמול', 'ת"י 61 — כל שקע חשמל חייב להיות מחובר למוליך הארקה רציף עם התנגדות שאינה עולה על 1 אוהם', 'ת"י 61 — כל שקע חשמל חייב להיות מחובר למוליך הארקה רציף עם התנגדות שאינה עולה על 1 אוהם', 'בדיקת חיבור מוליך הארקה בשקע ובלוח החשמל, תיקון או החלפת החיבור הלקוי', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שקע חשמל ללא הארקה תקינה — שקע חשמל שאינו מחובר להארקה או שחיבור ההארקה לקוי. מדידה מראה התנגדות הארקה גבוהה מהמותר (מעל 1 אוהם). מהווה סכנת חשמול'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'שקע חשמל בחדר רחצה במרחק לא תקני מנקודת מים — שקע חשמל מותקן בתוך אזור 1 או אזור 2 של חדר הרחצה (פחות מ-60 ס"מ ממקור מים), בניגוד לתקנות. סכנת חשמול בסביבה רטובה', 'ת"י 61 — שקעים בחדר רחצה חייבים להיות מותקנים באזור 3 בלבד, במרחק מינימלי של 60 ס"מ מגבול האמבטיה או המקלחון', 'ת"י 61 — שקעים בחדר רחצה חייבים להיות מותקנים באזור 3 בלבד, במרחק מינימלי של 60 ס"מ מגבול האמבטיה או המקלחון', 'העתקת השקע למיקום תקני באזור 3, מרחק מינימלי 60 ס"מ מנקודת מים, עם הגנת RCD', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שקע חשמל בחדר רחצה במרחק לא תקני מנקודת מים — שקע חשמל מותקן בתוך אזור 1 או אזור 2 של חדר הרחצה (פחות מ-60 ס"מ ממקור מים), בניגוד לתקנות. סכנת חשמול בסביבה רטובה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'חסר מפסק פחת (RCD) בלוח החשמל — לוח החשמל הדירתי חסר מפסק פחת (RCD) בזרם דלף 30mA על מעגלי שקעים. מפסק פחת נדרש להגנה מפני חשמול', 'ת"י 61 — כל מעגלי השקעים בדירה חייבים להיות מוגנים במפסק פחת (RCD) בזרם דלף מקסימלי של 30mA', 'ת"י 61 — כל מעגלי השקעים בדירה חייבים להיות מוגנים במפסק פחת (RCD) בזרם דלף מקסימלי של 30mA', 'התקנת מפסק פחת RCD 30mA בלוח החשמל על כל מעגלי השקעים', 700, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חסר מפסק פחת (RCD) בלוח החשמל — לוח החשמל הדירתי חסר מפסק פחת (RCD) בזרם דלף 30mA על מעגלי שקעים. מפסק פחת נדרש להגנה מפני חשמול'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'מפסק פחת (RCD) לא מתפקד — מפסק הפחת מותקן אך אינו מנתק את המעגל בלחיצה על כפתור הבדיקה (TEST). המפסק עלול להיות תקול ולא לספק הגנה מפני חשמול', 'ת"י 61 — מפסק פחת חייב לנתק את המעגל תוך 300 אלפיות שנייה בזרם דלף של 30mA, ולעבור בדיקה תקופתית', 'ת"י 61 — מפסק פחת חייב לנתק את המעגל תוך 300 אלפיות שנייה בזרם דלף של 30mA, ולעבור בדיקה תקופתית', 'החלפת מפסק הפחת התקול במפסק חדש תקין ובדיקת תקינות כל מפסקי הפחת בלוח', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מפסק פחת (RCD) לא מתפקד — מפסק הפחת מותקן אך אינו מנתק את המעגל בלחיצה על כפתור הבדיקה (TEST). המפסק עלול להיות תקול ולא לספק הגנה מפני חשמול'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'לוח חשמל ללא סימון מעגלים — מפסקים בלוח החשמל אינם מסומנים בזיהוי המעגל שהם מגנים עליו. מקשה על איתור תקלות ועל ניתוק חירום', 'ת"י 61 — כל מפסק בלוח חשמל חייב להיות מסומן בבירור לזיהוי המעגל המוגן', 'ת"י 61 — כל מפסק בלוח חשמל חייב להיות מסומן בבירור לזיהוי המעגל המוגן', 'סימון כל מפסקי הלוח בתוויות ברורות המציינות את המעגל המוגן (חדר/מכשיר)', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'לוח חשמל ללא סימון מעגלים — מפסקים בלוח החשמל אינם מסומנים בזיהוי המעגל שהם מגנים עליו. מקשה על איתור תקלות ועל ניתוק חירום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'לוח חשמל ללא דלת או מכסה — לוח החשמל הדירתי חסר דלת או מכסה, חלקים חיים חשופים. סכנת חשמול במיוחד לילדים', 'ת"י 61 — לוח חשמל חייב להיות מכוסה בדלת או מכסה המונע גישה לחלקים חיים ללא כלי עזר', 'ת"י 61 — לוח חשמל חייב להיות מכוסה בדלת או מכסה המונע גישה לחלקים חיים ללא כלי עזר', 'התקנת דלת/מכסה מקורי ללוח החשמל עם נעילה תקנית', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'לוח חשמל ללא דלת או מכסה — לוח החשמל הדירתי חסר דלת או מכסה, חלקים חיים חשופים. סכנת חשמול במיוחד לילדים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'שקע חשמל רופף או יוצא מהקיר — שקע חשמל אינו מחוזק כראוי לקופסת החשמל בקיר, נע או יוצא החוצה בעת הוצאת תקע. עלול לחשוף חיבורים חשמליים', 'ת"י 61 — כל אביזר חשמלי חייב להיות מחוזק היטב לקופסת ההתקנה ולהיות יציב', 'ת"י 61 — כל אביזר חשמלי חייב להיות מחוזק היטב לקופסת ההתקנה ולהיות יציב', 'חיזוק השקע לקופסת החשמל בברגים, החלפת קופסה שבורה במידת הצורך', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שקע חשמל רופף או יוצא מהקיר — שקע חשמל אינו מחוזק כראוי לקופסת החשמל בקיר, נע או יוצא החוצה בעת הוצאת תקע. עלול לחשוף חיבורים חשמליים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'חוסר בשקעי חשמל בחדר לפי תקן — מספר שקעי החשמל בחדר נמוך מהנדרש בתקן. לדוגמה: מטבח עם פחות מ-6 שקעים, או חדר שינה עם פחות מ-3 שקעים', 'ת"י 61 — מספר מינימלי של שקעים לפי ייעוד החדר: מטבח 6, סלון 5, חדר שינה 3, חדר רחצה 1', 'ת"י 61 — מספר מינימלי של שקעים לפי ייעוד החדר: מטבח 6, סלון 5, חדר שינה 3, חדר רחצה 1', 'הוספת שקעי חשמל בהתאם לדרישות התקן עבור ייעוד החדר', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר בשקעי חשמל בחדר לפי תקן — מספר שקעי החשמל בחדר נמוך מהנדרש בתקן. לדוגמה: מטבח עם פחות מ-6 שקעים, או חדר שינה עם פחות מ-3 שקעים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'גובה שקע חשמל לא תקני — שקע חשמל מותקן בגובה שאינו עומד בדרישות התקן. שקעים רגילים צריכים להיות בגובה 40-50 ס"מ מהרצפה, שקעי מטבח בגובה 110-120 ס"מ', 'ת"י 61 — גובה התקנת שקעים: רגיל 40-50 ס"מ, מטבח 110-120 ס"מ מעל הרצפה הגמורה', 'ת"י 61 — גובה התקנת שקעים: רגיל 40-50 ס"מ, מטבח 110-120 ס"מ מעל הרצפה הגמורה', 'העתקת השקע לגובה התקני בהתאם לייעוד החדר', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גובה שקע חשמל לא תקני — שקע חשמל מותקן בגובה שאינו עומד בדרישות התקן. שקעים רגילים צריכים להיות בגובה 40-50 ס"מ מהרצפה, שקעי מטבח בגובה 110-120 ס"מ'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'מתג תאורה לא תקין או לא מתפקד — מתג תאורה שאינו מפעיל את נקודת התאורה, מרפרף, או שיש בו ניצוצות בעת הפעלה. עלול להצביע על חיבור רופף או מתג פגום', 'ת"י 61 — כל מתג חשמלי חייב לפעול באופן תקין ללא ניצוצות חיצוניות או רעש חריג', 'ת"י 61 — כל מתג חשמלי חייב לפעול באופן תקין ללא ניצוצות חיצוניות או רעש חריג', 'החלפת המתג הפגום, בדיקת החיבורים בקופסת החשמל', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מתג תאורה לא תקין או לא מתפקד — מתג תאורה שאינו מפעיל את נקודת התאורה, מרפרף, או שיש בו ניצוצות בעת הפעלה. עלול להצביע על חיבור רופף או מתג פגום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'חסרה נקודת תאורה בחדר — חדר ללא נקודת תאורה בתקרה או בקיר, בניגוד לדרישות התקן. כל חדר מגורים חייב לכלול לפחות נקודת תאורה אחת', 'ת"י 61 — כל חדר חייב לכלול לפחות נקודת תאורה אחת מחוברת למתג', 'ת"י 61 — כל חדר חייב לכלול לפחות נקודת תאורה אחת מחוברת למתג', 'התקנת נקודת תאורה בתקרה עם מתג הפעלה בכניסה לחדר', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חסרה נקודת תאורה בחדר — חדר ללא נקודת תאורה בתקרה או בקיר, בניגוד לדרישות התקן. כל חדר מגורים חייב לכלול לפחות נקודת תאורה אחת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'כבלים חשמליים חשופים ללא הגנה — כבלים חשמליים גלויים ללא צנרת הגנה או כיסוי מתאים. הכבלים חשופים לנזק מכני ולסכנת חשמול', 'ת"י 61 — כבלים חשמליים חייבים לעבור בצנרת הגנה או להיות מוגנים מפני נזק מכני', 'ת"י 61 — כבלים חשמליים חייבים לעבור בצנרת הגנה או להיות מוגנים מפני נזק מכני', 'התקנת צנרת הגנה (PVC או מתכת) לכיסוי הכבלים החשופים', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כבלים חשמליים חשופים ללא הגנה — כבלים חשמליים גלויים ללא צנרת הגנה או כיסוי מתאים. הכבלים חשופים לנזק מכני ולסכנת חשמול'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'חיבור חשמלי באמצעות סרט בידוד במקום מהדק — חיבורים חשמליים בקופסאות חיבור מבוצעים עם סרט בידוד במקום מהדקים (קונקטורים) תקניים. חיבור לא בטוח הגורם להתחממות', 'ת"י 61 — חיבורים חשמליים חייבים להתבצע באמצעות מהדקים (קונקטורים) מאושרים בלבד', 'ת"י 61 — חיבורים חשמליים חייבים להתבצע באמצעות מהדקים (קונקטורים) מאושרים בלבד', 'החלפת כל חיבורי סרט הבידוד במהדקים תקניים (Wago או דומה)', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיבור חשמלי באמצעות סרט בידוד במקום מהדק — חיבורים חשמליים בקופסאות חיבור מבוצעים עם סרט בידוד במקום מהדקים (קונקטורים) תקניים. חיבור לא בטוח הגורם להתחממות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'קופסת חשמל ללא מכסה — קופסת חיבור/הסתעפות חשמלית ללא מכסה, חיבורים חשמליים חשופים. סכנת חשמול ונזק מלחות או אבק', 'ת"י 61 — כל קופסת חיבור חייבת להיות מכוסה במכסה מתאים', 'ת"י 61 — כל קופסת חיבור חייבת להיות מכוסה במכסה מתאים', 'התקנת מכסה תקני לקופסת החשמל', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'קופסת חשמל ללא מכסה — קופסת חיבור/הסתעפות חשמלית ללא מכסה, חיבורים חשמליים חשופים. סכנת חשמול ונזק מלחות או אבק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'העדר שקע טלפון/תקשורת בחדרים נדרשים — חדר מגורים ללא נקודת תקשורת (טלפון/רשת) כנדרש בתקן. נדרשות נקודות תקשורת בסלון ובחדרי שינה', 'ת"י 61 — נדרשת לפחות נקודת תקשורת אחת בסלון ובכל חדר שינה', 'ת"י 61 — נדרשת לפחות נקודת תקשורת אחת בסלון ובכל חדר שינה', 'משיכת כבל תקשורת CAT6 והתקנת שקע RJ45 בחדרים הנדרשים', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'העדר שקע טלפון/תקשורת בחדרים נדרשים — חדר מגורים ללא נקודת תקשורת (טלפון/רשת) כנדרש בתקן. נדרשות נקודות תקשורת בסלון ובחדרי שינה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'מפסק זרם יתר (אוטומט) בלוח לא מתאים לחתך הכבל — מפסק אוטומטי בלוח החשמל בדירוג זרם גבוה מכושר ההעמסה של הכבל. למשל מפסק 20A על כבל 1.5 מ"מ. עלול לגרום להתחממות הכבל ולשריפה', 'ת"י 61 — דירוג המפסק חייב להתאים לחתך הכבל: 1.5 מ"מ עד 16A, 2.5 מ"מ עד 20A, 4 מ"מ עד 25A', 'ת"י 61 — דירוג המפסק חייב להתאים לחתך הכבל: 1.5 מ"מ עד 16A, 2.5 מ"מ עד 20A, 4 מ"מ עד 25A', 'החלפת המפסק למפסק בדירוג המתאים לחתך הכבל המותקן', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מפסק זרם יתר (אוטומט) בלוח לא מתאים לחתך הכבל — מפסק אוטומטי בלוח החשמל בדירוג זרם גבוה מכושר ההעמסה של הכבל. למשל מפסק 20A על כבל 1.5 מ"מ. עלול לגרום להתחממות הכבל ולשריפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'לוח חשמל עמוס - אין מקום למעגלים נוספים — לוח החשמל הדירתי מלא לחלוטין ללא מודולים פנויים להרחבה עתידית. מקשה על הוספת מעגלים ועלול לגרום לחיבורים לא תקניים', 'ת"י 61 — לוח חשמל דירתי חייב לכלול לפחות 20% מקום פנוי להרחבה עתידית', 'ת"י 61 — לוח חשמל דירתי חייב לכלול לפחות 20% מקום פנוי להרחבה עתידית', 'החלפת הלוח בלוח גדול יותר עם מקום להרחבה, או פיצול למספר לוחות', 3500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'לוח חשמל עמוס - אין מקום למעגלים נוספים — לוח החשמל הדירתי מלא לחלוטין ללא מודולים פנויים להרחבה עתידית. מקשה על הוספת מעגלים ועלול לגרום לחיבורים לא תקניים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'שקע חשמל מטבח ללא הגנת RCD ייעודית — שקעי חשמל במטבח (משטח עבודה) אינם מוגנים במפסק פחת ייעודי. אזור רטוב הדורש הגנה מוגברת', 'ת"י 61 — שקעים באזורים רטובים (מטבח, חדר כביסה) חייבים הגנת RCD 30mA', 'ת"י 61 — שקעים באזורים רטובים (מטבח, חדר כביסה) חייבים הגנת RCD 30mA', 'התקנת מפסק פחת RCD 30mA ייעודי למעגלי שקעי המטבח', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שקע חשמל מטבח ללא הגנת RCD ייעודית — שקעי חשמל במטבח (משטח עבודה) אינם מוגנים במפסק פחת ייעודי. אזור רטוב הדורש הגנה מוגברת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'חוסר התאמה בין פאזות בלוח חשמל תלת-פאזי — חלוקת עומסים לא מאוזנת בין שלוש הפאזות בלוח חשמל תלת-פאזי. גורם לעומס יתר על פאזה אחת ולירידת מתח', 'ת"י 61 — עומסים בלוח תלת-פאזי חייבים להיות מאוזנים בין הפאזות, סטייה מקסימלית 20%', 'ת"י 61 — עומסים בלוח תלת-פאזי חייבים להיות מאוזנים בין הפאזות, סטייה מקסימלית 20%', 'איזון מחדש של חלוקת המעגלים בין הפאזות בלוח החשמל', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר התאמה בין פאזות בלוח חשמל תלת-פאזי — חלוקת עומסים לא מאוזנת בין שלוש הפאזות בלוח חשמל תלת-פאזי. גורם לעומס יתר על פאזה אחת ולירידת מתח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'תאורת חירום חסרה בחדר מדרגות — חדר מדרגות ללא תאורת חירום עצמאית עם סוללה. בעת הפסקת חשמל חדר המדרגות חשוך לחלוטין, סכנת נפילה', 'ת"י 61 — חדרי מדרגות ומסדרונות חייבים בתאורת חירום עם סוללת גיבוי לשעה לפחות', 'ת"י 61 — חדרי מדרגות ומסדרונות חייבים בתאורת חירום עם סוללת גיבוי לשעה לפחות', 'התקנת גוף תאורת חירום עם סוללה בכל קומה בחדר המדרגות', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תאורת חירום חסרה בחדר מדרגות — חדר מדרגות ללא תאורת חירום עצמאית עם סוללה. בעת הפסקת חשמל חדר המדרגות חשוך לחלוטין, סכנת נפילה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'שקע חשמל חיצוני ללא דרגת הגנה IP מתאימה — שקע חשמל במרפסת או בחוץ ללא דרגת הגנה IP44 לפחות. חשוף לרטיבות ולגשם', 'ת"י 61 — שקעים חיצוניים חייבים בדרגת הגנה IP44 לפחות עם מכסה קפיצי', 'ת"י 61 — שקעים חיצוניים חייבים בדרגת הגנה IP44 לפחות עם מכסה קפיצי', 'החלפת השקע בשקע עם דרגת הגנה IP44 ומכסה קפיצי', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שקע חשמל חיצוני ללא דרגת הגנה IP מתאימה — שקע חשמל במרפסת או בחוץ ללא דרגת הגנה IP44 לפחות. חשוף לרטיבות ולגשם'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'פס שוואה (אפס) לקוי בלוח חשמל — פס השוואה (Neutral bar) בלוח החשמל עם חיבורים רופפים, חמצון, או עומס יתר. גורם לתקלות זרם ולסכנת שריפה', 'ת"י 61 — פס האפס חייב להיות מחובר היטב עם כל מוליכי האפס מהודקים בברגים', 'ת"י 61 — פס האפס חייב להיות מחובר היטב עם כל מוליכי האפס מהודקים בברגים', 'ניקוי פס השוואה, הידוק כל החיבורים, החלפת פס פגום במידת הצורך', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פס שוואה (אפס) לקוי בלוח חשמל — פס השוואה (Neutral bar) בלוח החשמל עם חיבורים רופפים, חמצון, או עומס יתר. גורם לתקלות זרם ולסכנת שריפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'חיווט חשמל בממ"ד לא בצנרת שריון — חיווט חשמל בתוך חדר הממ"ד שאינו עובר בצנרת שריון (ממ"ד דורש צנרת מוגנת). בפגיעה ישירה הכבלים עלולים להינזק', 'ת"י 4766 — כבילה חשמלית בממ"ד חייבת לעבור בצנרת שריון מוגנת', 'ת"י 4766 — כבילה חשמלית בממ"ד חייבת לעבור בצנרת שריון מוגנת', 'החלפת הצנרת הקיימת בצנרת שריון מתאימה לממ"ד', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חיווט חשמל בממ"ד לא בצנרת שריון — חיווט חשמל בתוך חדר הממ"ד שאינו עובר בצנרת שריון (ממ"ד דורש צנרת מוגנת). בפגיעה ישירה הכבלים עלולים להינזק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'שקע חשמל במרפסת שירות ללא הגנת מים — שקע חשמל במרפסת שירות (כביסה) ללא כיסוי עמיד מים. מרפסת שירות חשופה לרטיבות ולמים', 'ת"י 61 — שקעים בסביבה רטובה/חיצונית חייבים בדרגת הגנה IP44 ומפסק פחת RCD', 'ת"י 61 — שקעים בסביבה רטובה/חיצונית חייבים בדרגת הגנה IP44 ומפסק פחת RCD', 'החלפת השקע בדגם IP44 עם מכסה קפיצי, וודא הגנת RCD על המעגל', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שקע חשמל במרפסת שירות ללא הגנת מים — שקע חשמל במרפסת שירות (כביסה) ללא כיסוי עמיד מים. מרפסת שירות חשופה לרטיבות ולמים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'פעמון דלת כניסה לא מתפקד — פעמון דלת הכניסה לדירה לא פועל - אין צלצול בלחיצה על הכפתור. בעיה בחיווט, בשנאי, או בפעמון עצמו', 'NULL', 'NULL', 'בדיקת חיווט הפעמון, החלפת שנאי או פעמון פגום', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פעמון דלת כניסה לא מתפקד — פעמון דלת הכניסה לדירה לא פועל - אין צלצול בלחיצה על הכפתור. בעיה בחיווט, בשנאי, או בפעמון עצמו'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'אינטרקום/דופון לא מתפקד — מערכת אינטרקום (דופון) לא פועלת - אין שמע, אין וידאו, או לחצן פתיחה לא עובד. פוגע בביטחון הדירה', 'NULL', 'NULL', 'בדיקת חיווט ומסך האינטרקום, תיקון או החלפת יחידה פנימית/חיצונית', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אינטרקום/דופון לא מתפקד — מערכת אינטרקום (דופון) לא פועלת - אין שמע, אין וידאו, או לחצן פתיחה לא עובד. פוגע בביטחון הדירה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'שקע חשמל לא עובד — שקע חשמל ללא מתח או שלא מספק חשמל', 'חוק החשמל, תקנות החשמל — כל שקע חייב לספק מתח תקין ולהיות מחובר להארקה', 'חוק החשמל, תקנות החשמל — כל שקע חייב לספק מתח תקין ולהיות מחובר להארקה', 'בדיקת חיבור, תיקון או החלפת שקע', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שקע חשמל לא עובד — שקע חשמל ללא מתח או שלא מספק חשמל'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'חוסר הארקה בשקע — שקע חשמל ללא חיבור הארקה תקין — סכנת חשמול', 'חוק החשמל, ת"י 61 — כל שקע חייב הארקה תקינה — דרישה בטיחותית מחייבת', 'חוק החשמל, ת"י 61 — כל שקע חייב הארקה תקינה — דרישה בטיחותית מחייבת', 'חיבור הארקה לשקע, בדיקת מערכת הארקה כללית', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר הארקה בשקע — שקע חשמל ללא חיבור הארקה תקין — סכנת חשמול'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'מפסק/מתג לא עובד — מפסק תאורה או מתג שלא מפעיל את המעגל', 'חוק החשמל — כל מתג חייב לפעול באופן תקין', 'חוק החשמל — כל מתג חייב לפעול באופן תקין', 'החלפת מפסק/מתג פגום', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מפסק/מתג לא עובד — מפסק תאורה או מתג שלא מפעיל את המעגל'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חשמל', NULL, 'לוח חשמל לא תקני — לוח חשמל עם ליקויים: מפסקים לא מסומנים, חוטים חשופים, או חוסר מפסק פחת', 'חוק החשמל, ת"י 61 — לוח חשמל חייב לעמוד בתקן — סימון, מפסק פחת, סדר מעגלים', 'חוק החשמל, ת"י 61 — לוח חשמל חייב לעמוד בתקן — סימון, מפסק פחת, סדר מעגלים', 'תיקון לוח על ידי חשמלאי מוסמך בהתאם לתקן', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'לוח חשמל לא תקני — לוח חשמל עם ליקויים: מפסקים לא מסומנים, חוטים חשופים, או חוסר מפסק פחת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'דלת ממ"ד - מסגרת ברזל לא אטומה — מסגרת דלת הממ"ד אינה אטומה - רווחים בין המסגרת לקיר, גומי האיטום חסר או פגום. הממ"ד לא יספק הגנה כנדרש', 'ת"י 4766 — דלת ממ"ד חייבת להיות אטומה לגזים ולעמוד בלחץ פיצוץ, כולל גומי איטום תקין בהיקף המסגרת', 'ת"י 4766 — דלת ממ"ד חייבת להיות אטומה לגזים ולעמוד בלחץ פיצוץ, כולל גומי איטום תקין בהיקף המסגרת', 'החלפת גומי האיטום, מילוי רווחים בין המסגרת לקיר בחומר אטימה מתאים', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת ממ"ד - מסגרת ברזל לא אטומה — מסגרת דלת הממ"ד אינה אטומה - רווחים בין המסגרת לקיר, גומי האיטום חסר או פגום. הממ"ד לא יספק הגנה כנדרש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'דלת ממ"ד - ברגי נעילה לא מתפקדים — ברגי הנעילה של דלת הממ"ד (קרמונים) אינם נכנסים לשקעים במשקוף, קשים להפעלה, או חסרים. הדלת לא ניתנת לנעילה אטומה', 'ת"י 4766 — דלת ממ"ד חייבת להיות ניתנת לנעילה אטומה באמצעות ברגי נעילה תקינים', 'ת"י 4766 — דלת ממ"ד חייבת להיות ניתנת לנעילה אטומה באמצעות ברגי נעילה תקינים', 'שימון/תיקון ברגי הנעילה, כוונון שקעי המשקוף, החלפת חלקים פגומים', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת ממ"ד - ברגי נעילה לא מתפקדים — ברגי הנעילה של דלת הממ"ד (קרמונים) אינם נכנסים לשקעים במשקוף, קשים להפעלה, או חסרים. הדלת לא ניתנת לנעילה אטומה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'דלת ממ"ד - צירים פגומים או חסרים — צירי דלת הממ"ד פגומים, חלודים, או חסרים. דלת הממ"ד שוקלת כ-200 ק"ג וצירים פגומים מסכנים את השימוש בה', 'ת"י 4766 — צירי דלת ממ"ד חייבים להיות תקינים ולשאת את משקל הדלת (כ-200 ק"ג) ללא שקיעה', 'ת"י 4766 — צירי דלת ממ"ד חייבים להיות תקינים ולשאת את משקל הדלת (כ-200 ק"ג) ללא שקיעה', 'שימון צירים, החלפת צירים פגומים, כוונון גובה הדלת ביחס למשקוף', 1000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת ממ"ד - צירים פגומים או חסרים — צירי דלת הממ"ד פגומים, חלודים, או חסרים. דלת הממ"ד שוקלת כ-200 ק"ג וצירים פגומים מסכנים את השימוש בה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'חלון ממ"ד - סגר פלדה חסר או פגום — סגר הפלדה (שאטר) של חלון הממ"ד חסר, תקוע, או לא נסגר עד הסוף. החלון לא יספק הגנה בעת חירום', 'ת"י 4766 — סגר פלדה של חלון ממ"ד חייב להיות תקין, ניתן לסגירה ונעילה מלאה', 'ת"י 4766 — סגר פלדה של חלון ממ"ד חייב להיות תקין, ניתן לסגירה ונעילה מלאה', 'שימון מנגנון הסגר, תיקון פסי ההחלקה, החלפת סגר פגום', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון ממ"ד - סגר פלדה חסר או פגום — סגר הפלדה (שאטר) של חלון הממ"ד חסר, תקוע, או לא נסגר עד הסוף. החלון לא יספק הגנה בעת חירום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'מסגרת חלון ברזל - חלודה וקילוף צבע — מסגרת חלון ברזל עם סימני חלודה משמעותיים והתקלפות ציפוי. חלודה מחלישה את המסגרת ופוגעת באיטום', 'NULL', 'NULL', 'שיוף חלודה עד למתכת נקייה, מריחת פריימר נגד חלודה, צביעה בשתי שכבות צבע חוץ', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מסגרת חלון ברזל - חלודה וקילוף צבע — מסגרת חלון ברזל עם סימני חלודה משמעותיים והתקלפות ציפוי. חלודה מחלישה את המסגרת ופוגעת באיטום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'סורגי חלון - עיגון לקוי לקיר — סורגי חלון ברזל עם עיגון רופף לקיר, עוגנים חסרים או חלודים. סורגים רופפים אינם מספקים הגנה ועלולים ליפול', 'NULL', 'NULL', 'חיזוק עיגון הסורגים לקיר באמצעות עוגנים כימיים או מכניים חדשים', 700, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סורגי חלון - עיגון לקוי לקיר — סורגי חלון ברזל עם עיגון רופף לקיר, עוגנים חסרים או חלודים. סורגים רופפים אינם מספקים הגנה ועלולים ליפול'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'שער חניה - מנגנון הפעלה חשמלי תקול — שער חניה חשמלי עם מנגנון הפעלה תקול - לא נפתח/נסגר, רועש, או עוצר באמצע התנועה. עלול לפגוע באנשים או ברכבים', 'NULL', 'NULL', 'בדיקת מנוע ומנגנון השער, שימון גלגלים ופסי הנעה, תיקון/החלפת חלקים פגומים', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שער חניה - מנגנון הפעלה חשמלי תקול — שער חניה חשמלי עם מנגנון הפעלה תקול - לא נפתח/נסגר, רועש, או עוצר באמצע התנועה. עלול לפגוע באנשים או ברכבים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'רצפה גבוהה בסף דלת ממ"ד — הפרש גובה בסף דלת ממ"ד מעל המותר — סכנת מעידה', 'ת"י 4145 — גובה מותר של סף דלת ממ"ד', 'ת"י 4145 — גובה מותר של סף דלת ממ"ד', 'תיקון מפלס רצפה / סף', 1000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רצפה גבוהה בסף דלת ממ"ד — הפרש גובה בסף דלת ממ"ד מעל המותר — סכנת מעידה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'דלת ממ"ד — לא נסגרת / לא אוטמת — דלת פלדה של ממ"ד שלא נסגרת כראוי או לא אוטמת', 'ת"י 4145 — דלת ממ"ד חייבת לסגור ולאטום בהתאם לתקן', 'ת"י 4145 — דלת ממ"ד חייבת לסגור ולאטום בהתאם לתקן', 'כוונון צירים, החלפת אטמים, שימון מנגנון', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת ממ"ד — לא נסגרת / לא אוטמת — דלת פלדה של ממ"ד שלא נסגרת כראוי או לא אוטמת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'חלון ממ"ד — לא נסגר / לא אוטם — חלון ממ"ד פלדה שלא נסגר כראוי או שהאטימות פגומה', 'ת"י 4145 — חלון ממ"ד חייב לסגור ולאטום', 'ת"י 4145 — חלון ממ"ד חייב לסגור ולאטום', 'כוונון מנגנון, החלפת אטמים, שימון', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון ממ"ד — לא נסגר / לא אוטם — חלון ממ"ד פלדה שלא נסגר כראוי או שהאטימות פגומה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'גובה מעקה מרפסת נמוך מהנדרש — גובה מעקה המרפסת נמוך מ-105 ס"מ (עד קומה 4) או נמוך מ-120 ס"מ (מעל קומה 4). סכנת נפילה מגובה', 'ת"י 1142 — גובה מעקה מינימלי: 105 ס"מ עד גובה 12 מ'' (קומה 4), 120 ס"מ מעל 12 מ''', 'ת"י 1142 — גובה מעקה מינימלי: 105 ס"מ עד גובה 12 מ'' (קומה 4), 120 ס"מ מעל 12 מ''', 'הגבהת המעקה לגובה התקני על ידי הוספת מאריך או החלפת המעקה', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גובה מעקה מרפסת נמוך מהנדרש — גובה מעקה המרפסת נמוך מ-105 ס"מ (עד קומה 4) או נמוך מ-120 ס"מ (מעל קומה 4). סכנת נפילה מגובה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'מרווח בין אלמנטים במעקה גדול מ-10 ס"מ — המרווח בין אלמנטים אנכיים (שבכות/פסים) במעקה גדול מ-10 ס"מ. ילד קטן עלול לתחוב את ראשו בין הפסים', 'ת"י 1142 — מרווח מקסימלי בין אלמנטים במעקה: 10 ס"מ בכל כיוון', 'ת"י 1142 — מרווח מקסימלי בין אלמנטים במעקה: 10 ס"מ בכל כיוון', 'הוספת פסים אנכיים או רשת נוספת לצמצום המרווחים ל-10 ס"מ מקסימום', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מרווח בין אלמנטים במעקה גדול מ-10 ס"מ — המרווח בין אלמנטים אנכיים (שבכות/פסים) במעקה גדול מ-10 ס"מ. ילד קטן עלול לתחוב את ראשו בין הפסים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'מעקה מרפסת לא יציב - מתנדנד — מעקה המרפסת מתנדנד בלחיצה, עיגון לריצפה או לקיר לא מספק. המעקה אינו עומד בעומס האופקי הנדרש', 'ת"י 1142 — מעקה חייב לעמוד בעומס אופקי של 100 ק"ג/מ'' ללא עיוות קבוע', 'ת"י 1142 — מעקה חייב לעמוד בעומס אופקי של 100 ק"ג/מ'' ללא עיוות קבוע', 'חיזוק עיגון המעקה - תיקון עוגנים, ריתוך מחדש, או החלפת נקודות עיגון', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעקה מרפסת לא יציב - מתנדנד — מעקה המרפסת מתנדנד בלחיצה, עיגון לריצפה או לקיר לא מספק. המעקה אינו עומד בעומס האופקי הנדרש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'חלודה ושיתוך במעקה ברזל — סימני חלודה והתקלפות צבע במעקה ברזל. חלודה מתקדמת מחלישה את המעקה ומקצרה את חייו', 'NULL', 'NULL', 'שיוף החלודה, מריחת ציפוי נגד חלודה (פריימר), וצביעה מחדש בצבע עמיד לחוץ', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלודה ושיתוך במעקה ברזל — סימני חלודה והתקלפות צבע במעקה ברזל. חלודה מתקדמת מחלישה את המעקה ומקצרה את חייו'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'ריתוך פגום במעקה ברזל — ריתוכים במעקה עם סדקים, חורים, או ריתוך חלקי. ריתוך פגום מחליש את המעקה ועלול לגרום לקריסה', 'ת"י 1142 — ריתוכים במעקה חייבים להיות רציפים, ללא סדקים או חסרים, ולעמוד בעומסים הנדרשים', 'ת"י 1142 — ריתוכים במעקה חייבים להיות רציפים, ללא סדקים או חסרים, ולעמוד בעומסים הנדרשים', 'ריתוך מחדש של כל נקודות הריתוך הפגומות על ידי רתך מוסמך, בדיקה ויזואלית', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ריתוך פגום במעקה ברזל — ריתוכים במעקה עם סדקים, חורים, או ריתוך חלקי. ריתוך פגום מחליש את המעקה ועלול לגרום לקריסה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'מעקה עם אלמנט טיפוס (ladder effect) — מעקה עם פסים אופקיים או אלמנטים המאפשרים לילד לטפס. עיצוב המעקה חייב למנוע אפשרות טיפוס', 'ת"י 1142 — מעקה לא יכלול אלמנטים המאפשרים טיפוס, פסים אופקיים חייבים להיות צפופים או אנכיים בלבד', 'ת"י 1142 — מעקה לא יכלול אלמנטים המאפשרים טיפוס, פסים אופקיים חייבים להיות צפופים או אנכיים בלבד', 'החלפת אלמנטים אופקיים בפסים אנכיים, או הוספת לוח חיפוי שימנע טיפוס', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעקה עם אלמנט טיפוס (ladder effect) — מעקה עם פסים אופקיים או אלמנטים המאפשרים לילד לטפס. עיצוב המעקה חייב למנוע אפשרות טיפוס'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'מעקה מדרגות חסר או לא רציף — מעקה בגרם מדרגות חסר בצד אחד או שני הצדדים, או שאינו רציף לאורך כל גרם המדרגות. סכנת נפילה', 'ת"י 1142 — גרם מדרגות ברוחב עד 110 ס"מ חייב מעקה/מסעד בצד אחד לפחות, מעל 110 ס"מ - בשני צדדים', 'ת"י 1142 — גרם מדרגות ברוחב עד 110 ס"מ חייב מעקה/מסעד בצד אחד לפחות, מעל 110 ס"מ - בשני צדדים', 'התקנת מעקה/מסעד רציף לאורך כל גרם המדרגות בהתאם לרוחב', 2500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעקה מדרגות חסר או לא רציף — מעקה בגרם מדרגות חסר בצד אחד או שני הצדדים, או שאינו רציף לאורך כל גרם המדרגות. סכנת נפילה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'מסעד (handrail) בגובה לא תקני — גובה המסעד במדרגות לא בטווח התקני (85-100 ס"מ מקצה המדרגה). גובה לא נכון מפחית את היעילות הבטיחותית', 'ת"י 1142 — גובה מסעד במדרגות: 85-100 ס"מ מקצה המדרגה עד ראש המסעד', 'ת"י 1142 — גובה מסעד במדרגות: 85-100 ס"מ מקצה המדרגה עד ראש המסעד', 'התאמת גובה המסעד לטווח התקני 85-100 ס"מ', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מסעד (handrail) בגובה לא תקני — גובה המסעד במדרגות לא בטווח התקני (85-100 ס"מ מקצה המדרגה). גובה לא נכון מפחית את היעילות הבטיחותית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'מעקה גג ללא גובה מינימלי — מעקה בגג נגיש (גג שימושי) בגובה נמוך מ-120 ס"מ. סכנת נפילה חמורה מגובה הבניין', 'ת"י 1142 — מעקה בגג נגיש חייב להיות בגובה מינימלי של 120 ס"מ', 'ת"י 1142 — מעקה בגג נגיש חייב להיות בגובה מינימלי של 120 ס"מ', 'הגבהת מעקה הגג לגובה מינימלי 120 ס"מ בהתאם לתקן', 2500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעקה גג ללא גובה מינימלי — מעקה בגג נגיש (גג שימושי) בגובה נמוך מ-120 ס"מ. סכנת נפילה חמורה מגובה הבניין'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מסגרות ברזל ומעקות', NULL, 'מעקה מרפסת - חוסר ציפוי גלוון — מעקה ברזל ללא ציפוי גלוון (אבץ חם) כנדרש לאלמנטים חיצוניים. ללא גלוון המעקה יחלוד במהירות', 'NULL', 'NULL', 'פירוק המעקה, טבילה בגלוון חם, והתקנה מחדש. לחלופין - שיוף וציפוי בצבע אפוקסי דו-רכיבי', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעקה מרפסת - חוסר ציפוי גלוון — מעקה ברזל ללא ציפוי גלוון (אבץ חם) כנדרש לאלמנטים חיצוניים. ללא גלוון המעקה יחלוד במהירות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר יריעת איטום בגג שטוח — לא בוצע איטום בגג שטוח או שיריעת האיטום חסרה לחלוטין. חשיפת מרכיבי הגג לחדירת מים ישירה, גורמת לנזקי רטיבות קשים במבנה', 'ת"י 931 — גגות שטוחים חייבים איטום מלא בהתאם לתקן, כולל יריעת איטום ביטומנית או סינתטית עם חפיפות תקניות', 'ת"י 931 — גגות שטוחים חייבים איטום מלא בהתאם לתקן, כולל יריעת איטום ביטומנית או סינתטית עם חפיפות תקניות', 'התקנת מערכת איטום מלאה כולל יריעת איטום ביטומנית דו-שכבתית, פריימר, וחיפוי הגנה', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר יריעת איטום בגג שטוח — לא בוצע איטום בגג שטוח או שיריעת האיטום חסרה לחלוטין. חשיפת מרכיבי הגג לחדירת מים ישירה, גורמת לנזקי רטיבות קשים במבנה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'קרעים ונקבים ביריעת איטום הגג — נצפו קרעים, חורים או נקבים ביריעת האיטום בגג השטוח, כתוצאה מפגיעה מכנית, תנועה תרמית או ביצוע לקוי. מאפשרים חדירת מים למבנה', 'ת"י 931 — יריעת האיטום חייבת להיות רציפה ושלמה, ללא קרעים או נקבים', 'ת"י 931 — יריעת האיטום חייבת להיות רציפה ושלמה, ללא קרעים או נקבים', 'תיקון נקודתי באמצעות טלאי יריעת איטום בגודל מינימלי של 30x30 ס"מ עם חפיפה של 10 ס"מ לכל כיוון, או החלפת יריעה באזור הפגוע', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'קרעים ונקבים ביריעת איטום הגג — נצפו קרעים, חורים או נקבים ביריעת האיטום בגג השטוח, כתוצאה מפגיעה מכנית, תנועה תרמית או ביצוע לקוי. מאפשרים חדירת מים למבנה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חפיפה לא תקנית בין יריעות איטום — חפיפות בין יריעות האיטום קטנות מהנדרש בתקן (פחות מ-10 ס"מ באורך ו-15 ס"מ ברוחב), או שהחפיפות לא הולחמו כראוי. מהווה נקודת כשל לחדירת מים', 'ת"י 1637 — חפיפת יריעות ביטומניות: מינימום 10 ס"מ באורך ו-15 ס"מ ברוחב, עם הלחמה מלאה', 'ת"י 1637 — חפיפת יריעות ביטומניות: מינימום 10 ס"מ באורך ו-15 ס"מ ברוחב, עם הלחמה מלאה', 'פירוק החפיפה הפגומה והרחבתה לגודל תקני עם הלחמה מחודשת בלהבה או אוויר חם', 150, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חפיפה לא תקנית בין יריעות איטום — חפיפות בין יריעות האיטום קטנות מהנדרש בתקן (פחות מ-10 ס"מ באורך ו-15 ס"מ ברוחב), או שהחפיפות לא הולחמו כראוי. מהווה נקודת כשל לחדירת מים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'העדר כיפוף (קרניז) איטום בשפת הגג — יריעת האיטום לא עולה על המעקה/חומה היקפית בגובה מינימלי של 25 ס"מ. מאפשר חדירת מים בנקודת המפגש בין הגג למעקה', 'ת"י 931 — יריעת האיטום חייבת לעלות על שפת הגג/מעקה בגובה מינימלי של 25 ס"מ מעל מפלס הגג המוגמר', 'ת"י 931 — יריעת האיטום חייבת לעלות על שפת הגג/מעקה בגובה מינימלי של 25 ס"מ מעל מפלס הגג המוגמר', 'הארכת יריעת האיטום על המעקה לגובה של 25 ס"מ לפחות, כולל עיגון מכני בראש הכיפוף וסרגל לחיצה', 120, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'העדר כיפוף (קרניז) איטום בשפת הגג — יריעת האיטום לא עולה על המעקה/חומה היקפית בגובה מינימלי של 25 ס"מ. מאפשר חדירת מים בנקודת המפגש בין הגג למעקה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'שיפוע לא תקני בגג שטוח — שיפוע הגג השטוח קטן מ-1.5% הנדרש בתקן, גורם לשלוליות מים עומדים המזרזים התבלות יריעת האיטום ומגבירים סיכון לחדירת מים', 'ת"י 931 — שיפוע מינימלי בגג שטוח: 1.5% לכיוון הניקוז', 'ת"י 931 — שיפוע מינימלי בגג שטוח: 1.5% לכיוון הניקוז', 'יצירת שכבת שיפוע חדשה מבטון קל או תערובת שיפוע, והנחת מערכת איטום חדשה מעליה', 280, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שיפוע לא תקני בגג שטוח — שיפוע הגג השטוח קטן מ-1.5% הנדרש בתקן, גורם לשלוליות מים עומדים המזרזים התבלות יריעת האיטום ומגבירים סיכון לחדירת מים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'סתימה או כשל במערכת ניקוז הגג — מרזבים, נקזים או מפלטי מים בגג סתומים, שבורים או בקוטר לא מספיק. גורם להצטברות מים על הגג ולהגברת הלחץ ההידרוסטטי על האיטום', 'ת"י 931 — מערכת ניקוז גג חייבת לפנות מים ביעילות, עם מספר נקזים מספק ושיפוע מתאים', 'ת"י 931 — מערכת ניקוז גג חייבת לפנות מים ביעילות, עם מספר נקזים מספק ושיפוע מתאים', 'ניקוי ושחרור מערכת הניקוז, החלפת אלמנטים פגומים, התקנת מסנני עלים, ובדיקת קוטר נקזים מספיק', 2500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סתימה או כשל במערכת ניקוז הגג — מרזבים, נקזים או מפלטי מים בגג סתומים, שבורים או בקוטר לא מספיק. גורם להצטברות מים על הגג ולהגברת הלחץ ההידרוסטטי על האיטום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'פריחה (blistering) ביריעת איטום ביטומנית — נצפו בועות ותפיחויות (פריחה) ביריעת האיטום הביטומנית, כתוצאה מלחות כלואה מתחת ליריעה שמתאדה בחום. מחלישה את הצמדות היריעה ומובילה לקריעה', 'ת"י 1637 — יריעות ביטומניות חייבות להיות מודבקות באופן מלא למצע, ללא בועות אוויר או לחות כלואה', 'ת"י 1637 — יריעות ביטומניות חייבות להיות מודבקות באופן מלא למצע, ללא בועות אוויר או לחות כלואה', 'חיתוך הבועות בצורת X, ייבוש המשטח, הלחמה מחדש והנחת טלאי יריעה מעל באמצעות להבה', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פריחה (blistering) ביריעת איטום ביטומנית — נצפו בועות ותפיחויות (פריחה) ביריעת האיטום הביטומנית, כתוצאה מלחות כלואה מתחת ליריעה שמתאדה בחום. מחלישה את הצמדות היריעה ומובילה לקריעה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'כיווץ והתנתקות יריעת איטום סינתטית — יריעת איטום סינתטית (EPDM/TPO/PVC) התכווצה ונמשכה מקצוות הגג או מנקודות עיגון, חושפת אזורים ללא הגנת איטום', 'ת"י 931 — יריעת איטום חייבת לכסות את כל שטח הגג ברציפות, כולל שוליים וכיפופים', 'ת"י 931 — יריעת איטום חייבת לכסות את כל שטח הגג ברציפות, כולל שוליים וכיפופים', 'הרחבת היריעה בחזרה למיקומה עם תוספת יריעה בקצוות, או החלפת היריעה באזור הפגוע', 180, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כיווץ והתנתקות יריעת איטום סינתטית — יריעת איטום סינתטית (EPDM/TPO/PVC) התכווצה ונמשכה מקצוות הגג או מנקודות עיגון, חושפת אזורים ללא הגנת איטום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'איטום לקוי בנקודת חיבור גג-קיר — מפגש יריעת האיטום עם הקיר ההיקפי לא בוצע כראוי — חסר כיפוף, חסר סרגל לחיצה, או חסרה אטימה עליונה. נקודת חדירת מים נפוצה', 'ת"י 931 — מפגש גג-קיר דורש כיפוף יריעת איטום עם עיגון מכני וסרגל לחיצה, ואטימה עליונה בחומר אלסטי', 'ת"י 931 — מפגש גג-קיר דורש כיפוף יריעת איטום עם עיגון מכני וסרגל לחיצה, ואטימה עליונה בחומר אלסטי', 'ביצוע כיפוף תקני של יריעת האיטום על הקיר בגובה 25 ס"מ, התקנת סרגל לחיצה מגולוון ואטימה בפוליאוריתן', 140, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'איטום לקוי בנקודת חיבור גג-קיר — מפגש יריעת האיטום עם הקיר ההיקפי לא בוצע כראוי — חסר כיפוף, חסר סרגל לחיצה, או חסרה אטימה עליונה. נקודת חדירת מים נפוצה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'רעפים שבורים או חסרים בגג רעפים — רעפים שבורים, סדוקים או חסרים בגג משופע, חושפים את שכבת האיטום התחתית או ישירות את תת-הגג לחדירת מים ורוח', 'ת"י 931 — כיסוי גג רעפים חייב להיות שלם ורציף, כל רעף פגום יוחלף', 'ת"י 931 — כיסוי גג רעפים חייב להיות שלם ורציף, כל רעף פגום יוחלף', 'החלפת רעפים שבורים/חסרים ברעפים תואמים, בדיקת חפיפות ועיגון הרעפים שמסביב', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רעפים שבורים או חסרים בגג רעפים — רעפים שבורים, סדוקים או חסרים בגג משופע, חושפים את שכבת האיטום התחתית או ישירות את תת-הגג לחדירת מים ורוח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר יריעת תת-רעפים — לא הותקנה יריעת תת-רעפים (secondary membrane) מתחת לרעפים. בהיעדרה, מים שחודרים בין הרעפים מגיעים ישירות למבנה', 'ת"י 931 — גג רעפים נדרשת שכבת הגנה משנית (יריעת תת-רעפים) להגנה מפני חדירת מים ורוח', 'ת"י 931 — גג רעפים נדרשת שכבת הגנה משנית (יריעת תת-רעפים) להגנה מפני חדירת מים ורוח', 'הסרת הרעפים, התקנת יריעת תת-רעפים תקנית על הלטים, והחזרת הרעפים', 220, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר יריעת תת-רעפים — לא הותקנה יריעת תת-רעפים (secondary membrane) מתחת לרעפים. בהיעדרה, מים שחודרים בין הרעפים מגיעים ישירות למבנה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'איטום לקוי בשלחם (flashing) גג משופע — שלחם (flashing) מפח מגולוון או עופרת באזורי מפגש גג-קיר, ארובות או חדירות — מנותק, חלוד או חסר. מאפשר חדירת מים בנקודות המפגש', 'ת"י 931 — כל מפגש גג-קיר וחדירה בגג משופע חייב שלחם תקני עם חפיפה מספקת', 'ת"י 931 — כל מפגש גג-קיר וחדירה בגג משופע חייב שלחם תקני עם חפיפה מספקת', 'החלפת השלחם הפגום בשלחם חדש מפח מגולוון או אלומיניום, עם חפיפות תקניות ואטימה בסיליקון', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'איטום לקוי בשלחם (flashing) גג משופע — שלחם (flashing) מפח מגולוון או עופרת באזורי מפגש גג-קיר, ארובות או חדירות — מנותק, חלוד או חסר. מאפשר חדירת מים בנקודות המפגש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'איטום לקוי בתפר התפשטות — תפר ההתפשטות במבנה (בגג, ברצפה או בקירות) לא אטום כראוי או שחומר האיטום התבלה. מאפשר חדירת מים דרך התפר', 'ת"י 938 — תפרי התפשטות חייבים מילוי גמיש תקני המסוגל לספוג תנועות תרמיות ומכניות תוך שמירה על אטימות', 'ת"י 938 — תפרי התפשטות חייבים מילוי גמיש תקני המסוגל לספוג תנועות תרמיות ומכניות תוך שמירה על אטימות', 'הסרת חומר מילוי ישן, ניקוי התפר, התקנת חבל גיבוי (backer rod) ומילוי בחומר אטימה פוליאוריתני או סיליקוני גמיש', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'איטום לקוי בתפר התפשטות — תפר ההתפשטות במבנה (בגג, ברצפה או בקירות) לא אטום כראוי או שחומר האיטום התבלה. מאפשר חדירת מים דרך התפר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'נזק לאיטום גג מהתקנת מערכת סולארית — התקנת פאנלים סולאריים על הגג פגעה ביריעת האיטום — קידוחים ללא אטימה, משקולות שמועכות את היריעה, או כבלים שיוצרים שחיקה', 'ת"י 931 — כל חדירה או עומס על מערכת האיטום חייב להיות מתוכנן ומבוצע ללא פגיעה ברציפות האיטום', 'ת"י 931 — כל חדירה או עומס על מערכת האיטום חייב להיות מתוכנן ומבוצע ללא פגיעה ברציפות האיטום', 'תיקון כל נקודות הפגיעה, התקנת כריות הגנה מתחת למשקולות, אטימת קידוחים בחומר אלסטומרי, ובדיקת שלמות האיטום', 5000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזק לאיטום גג מהתקנת מערכת סולארית — התקנת פאנלים סולאריים על הגג פגעה ביריעת האיטום — קידוחים ללא אטימה, משקולות שמועכות את היריעה, או כבלים שיוצרים שחיקה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'התבלות יריעת איטום מקרינת UV — יריעת האיטום חשופה ישירות לקרינת שמש ללא שכבת הגנה (חצץ, ריצוף, או צבע מגן). היריעה מתייבשת, מתפוררת ומאבדת גמישות', 'ת"י 1637 — יריעות ביטומניות הנחשפות לשמש חייבות שכבת הגנה עליונה: חצץ, אריחים, או ציפוי רפלקטיבי', 'ת"י 1637 — יריעות ביטומניות הנחשפות לשמש חייבות שכבת הגנה עליונה: חצץ, אריחים, או ציפוי רפלקטיבי', 'הנחת שכבת הגנה על האיטום: חצץ שטוף בעובי 5 ס"מ, או ריצוף על פלטות, או מריחת צבע מגן רפלקטיבי', 120, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'התבלות יריעת איטום מקרינת UV — יריעת האיטום חשופה ישירות לקרינת שמש ללא שכבת הגנה (חצץ, ריצוף, או צבע מגן). היריעה מתייבשת, מתפוררת ומאבדת גמישות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'מרזב גג שבור או מנותק — מרזב הגג שבור, מנותק, או בשיפוע שגוי. מים גולשים מעבר למרזב ופוגעים בחזית הבניין, ביסודות ובאיטום', 'NULL', 'NULL', 'תיקון או החלפת מקטעי מרזב פגומים, כיוון שיפוע 0.5% לכיוון מוריד המים, חיזוק אוחזים', 200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מרזב גג שבור או מנותק — מרזב הגג שבור, מנותק, או בשיפוע שגוי. מים גולשים מעבר למרזב ופוגעים בחזית הבניין, ביסודות ובאיטום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'מוריד מים (צנרת אנכית) מנותק או סתום — מוריד מים מהגג מנותק מהמרזב, סתום בפסולת, או חסר בחלקו. מים מהגג שופכים על חזית הבניין וגורמים לנזקי רטיבות', 'NULL', 'NULL', 'חיבור מחדש או החלפת מוריד המים, ניקוי סתימות, והתקנת מסנן עלים בראש המוריד', 1000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מוריד מים (צנרת אנכית) מנותק או סתום — מוריד מים מהגג מנותק מהמרזב, סתום בפסולת, או חסר בחלקו. מים מהגג שופכים על חזית הבניין וגורמים לנזקי רטיבות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'פגיעה באיטום גג עקב צמחייה — צמחייה (עשבים, שורשים, אצות) צומחת על או דרך יריעת האיטום בגג. שורשים חודרים ליריעה ויוצרים נקבים, ולחות מצטברת מתחתם', 'ת"י 931 — יש לשמור על גג נקי מצמחייה ופסולת, ולוודא שמערכת האיטום שלמה', 'ת"י 931 — יש לשמור על גג נקי מצמחייה ופסולת, ולוודא שמערכת האיטום שלמה', 'הסרת צמחייה ושורשים, תיקון נקבים ביריעת האיטום, ניקוי מערכת הניקוז, ותחזוקה שוטפת', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פגיעה באיטום גג עקב צמחייה — צמחייה (עשבים, שורשים, אצות) צומחת על או דרך יריעת האיטום בגג. שורשים חודרים ליריעה ויוצרים נקבים, ולחות מצטברת מתחתם'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר שכבת הפרדה בין איטום לבטון — יריעת האיטום הונחה ישירות על בטון מחוספס ללא שכבת הפרדה (פריימר/ביטומן מדולל). גורם להצמדות חלקית ולנקודות כשל', 'ת"י 1637 — חובה למרוח פריימר ביטומני על משטח הבטון לפני הנחת יריעת איטום ביטומנית', 'ת"י 1637 — חובה למרוח פריימר ביטומני על משטח הבטון לפני הנחת יריעת איטום ביטומנית', 'באזורים בעייתיים — הרמת היריעה, מריחת פריימר, והדבקה מחדש. בגג חדש — ביצוע מלא עם פריימר', 30, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר שכבת הפרדה בין איטום לבטון — יריעת האיטום הונחה ישירות על בטון מחוספס ללא שכבת הפרדה (פריימר/ביטומן מדולל). גורם להצמדות חלקית ולנקודות כשל'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חדירת מים בחיבור גג רעפים לארובה/מדחום — חיבור גג הרעפים לארובה, מדחום או אלמנט בולט לא אטום כראוי. מים חודרים דרך נקודת החיבור בעיקר בגשם חזק', 'ת"י 931 — כל חדירה או אלמנט בולט מגג רעפים חייב שלחם ואטימה ייעודית', 'ת"י 931 — כל חדירה או אלמנט בולט מגג רעפים חייב שלחם ואטימה ייעודית', 'התקנת שלחם עופרת או אלומיניום בצורת שלב (stepped flashing) סביב הארובה, עם אטימה עליונה', 4000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חדירת מים בחיבור גג רעפים לארובה/מדחום — חיבור גג הרעפים לארובה, מדחום או אלמנט בולט לא אטום כראוי. מים חודרים דרך נקודת החיבור בעיקר בגשם חזק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר איטום מרפסת — יריעה חסרה — מרפסת חשופה ללא שכבת איטום מתחת לריצוף. מים חודרים דרך הריצוף והתשתית לתקרת הדירה מתחת', 'ת"י 1556 — כל מרפסת חשופה חייבת מערכת איטום מלאה מתחת לריצוף, כולל כיפופים ושיפוע לניקוז', 'ת"י 1556 — כל מרפסת חשופה חייבת מערכת איטום מלאה מתחת לריצוף, כולל כיפופים ושיפוע לניקוז', 'הסרת הריצוף, התקנת מערכת איטום מלאה (פריימר + יריעה ביטומנית או ציפוי פוליאוריתן), ריצוף מחדש', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר איטום מרפסת — יריעה חסרה — מרפסת חשופה ללא שכבת איטום מתחת לריצוף. מים חודרים דרך הריצוף והתשתית לתקרת הדירה מתחת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'שיפוע לא תקני במרפסת — שיפוע המרפסת לכיוון הניקוז קטן מ-1.5% או שהשיפוע לכיוון הפנים (כלפי הדירה) במקום כלפי חוץ. גורם להצטברות מים ולחדירתם למבנה', 'ת"י 1556 — שיפוע מרפסת מינימלי 1.5% לכיוון הניקוז, הרחק מפתח הדירה', 'ת"י 1556 — שיפוע מרפסת מינימלי 1.5% לכיוון הניקוז, הרחק מפתח הדירה', 'יצירת שכבת שיפוע מתקנת מבטון קל או דבק שיפוע, איטום מחדש וריצוף', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שיפוע לא תקני במרפסת — שיפוע המרפסת לכיוון הניקוז קטן מ-1.5% או שהשיפוע לכיוון הפנים (כלפי הדירה) במקום כלפי חוץ. גורם להצטברות מים ולחדירתם למבנה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'כיפוף איטום חסר בסף מרפסת — יריעת האיטום לא עולה בכיפוף על הסף/מפתן בין המרפסת לחדר הפנימי. מים זורמים מתחת לסף וחודרים לדירה', 'ת"י 1556 — איטום המרפסת חייב לעלות בכיפוף על הסף בגובה מינימלי של 5 ס"מ מעל מפלס הריצוף המוגמר', 'ת"י 1556 — איטום המרפסת חייב לעלות בכיפוף על הסף בגובה מינימלי של 5 ס"מ מעל מפלס הריצוף המוגמר', 'הסרת הסף, ביצוע כיפוף יריעת איטום על מפתן הדלת, התקנת סף חדש עם אטימה', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כיפוף איטום חסר בסף מרפסת — יריעת האיטום לא עולה בכיפוף על הסף/מפתן בין המרפסת לחדר הפנימי. מים זורמים מתחת לסף וחודרים לדירה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'נקז מרפסת סתום או חסר — נקז המרפסת (גרגורי/ניקוז רצפתי) סתום, קטן מדי, או לא הותקן כלל. מים מצטברים על המרפסת ומזיקים לאיטום', 'ת"י 1556 — כל מרפסת חשופה חייבת נקודת ניקוז תקנית עם חיבור למערכת הניקוז של הבניין', 'ת"י 1556 — כל מרפסת חשופה חייבת נקודת ניקוז תקנית עם חיבור למערכת הניקוז של הבניין', 'התקנת נקז רצפתי בקוטר מינימלי 50 מ"מ עם חיבור למערכת הניקוז, כולל רשת לכידת פסולת', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נקז מרפסת סתום או חסר — נקז המרפסת (גרגורי/ניקוז רצפתי) סתום, קטן מדי, או לא הותקן כלל. מים מצטברים על המרפסת ומזיקים לאיטום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'שקיעת ריצוף במרפסת — פגיעה באיטום — ריצוף המרפסת שקע או התרומם, מעיד על בעיה בשכבת הבסיס. השקיעה פוגעת בשיפוע הניקוז ועלולה לפגוע ביריעת האיטום מתחת', 'ת"י 1556 — ריצוף מרפסת חייב להיות יציב על בסיס תקין, עם שמירה על שיפוע הניקוז', 'ת"י 1556 — ריצוף מרפסת חייב להיות יציב על בסיס תקין, עם שמירה על שיפוע הניקוז', 'הסרת ריצוף פגום, בדיקת ותיקון שכבת האיטום, יצירת שכבת בסיס חדשה בשיפוע תקני, ריצוף מחדש', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שקיעת ריצוף במרפסת — פגיעה באיטום — ריצוף המרפסת שקע או התרומם, מעיד על בעיה בשכבת הבסיס. השקיעה פוגעת בשיפוע הניקוז ועלולה לפגוע ביריעת האיטום מתחת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'איטום לקוי במרפסת — איטום מרפסת לא תקין — מים חודרים לדירה מתחת או לקיר', 'ת"י 1515.3 — מרפסות חייבות איטום מלא עם שיפוע לניקוז', 'ת"י 1515.3 — מרפסות חייבות איטום מלא עם שיפוע לניקוז', 'פירוק ריצוף, ביצוע איטום מחדש, ריצוף עם שיפוע', 280, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'איטום לקוי במרפסת — איטום מרפסת לא תקין — מים חודרים לדירה מתחת או לקיר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'נזילה סביב חדירת צנרת בגג — איטום לקוי סביב חדירות צנרת, אוורור או כבלים בגג. נקודות חדירה הן מוקדי כשל נפוצים לחדירת מים', 'ת"י 931 — כל חדירה דרך מערכת האיטום חייבת איטום ייעודי בשרוול איטום או פלנג'' עם חפיפה ליריעה הראשית', 'ת"י 931 — כל חדירה דרך מערכת האיטום חייבת איטום ייעודי בשרוול איטום או פלנג'' עם חפיפה ליריעה הראשית', 'התקנת שרוול איטום (boot) תקני סביב כל חדירה, הלחמה ליריעה הראשית בחפיפה של 15 ס"מ לפחות, ואטימה עליונה בחומר אלסטומרי', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזילה סביב חדירת צנרת בגג — איטום לקוי סביב חדירות צנרת, אוורור או כבלים בגג. נקודות חדירה הן מוקדי כשל נפוצים לחדירת מים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר איטום חדר רחצה — רצפה — לא בוצע איטום מתחת לריצוף חדר הרחצה/מקלחת. מים חודרים דרך המרצפות ופגעים לתקרה ולקירות הדירה מתחת', 'ת"י 1752 — רצפת חדר רחצה ומקלחת חייבת איטום מלא בציפוי אלסטי או יריעה, כולל כיפופים על הקירות', 'ת"י 1752 — רצפת חדר רחצה ומקלחת חייבת איטום מלא בציפוי אלסטי או יריעה, כולל כיפופים על הקירות', 'הסרת ריצוף קיים, ביצוע איטום מלא בציפוי אלסטי דו-רכיבי עם כיפוף 15 ס"מ על הקירות, ריצוף מחדש', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר איטום חדר רחצה — רצפה — לא בוצע איטום מתחת לריצוף חדר הרחצה/מקלחת. מים חודרים דרך המרצפות ופגעים לתקרה ולקירות הדירה מתחת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'כיפוף איטום לא מספיק בקירות חדר רחצה — איטום רצפת חדר הרחצה לא עולה בכיפוף על הקירות בגובה מספיק (פחות מ-10 ס"מ ברצפה, פחות מ-180 ס"מ באזור המקלחת)', 'ת"י 1752 — כיפוף איטום: מינימום 10 ס"מ על קירות כלליים, 180 ס"מ באזור מקלחת, גובה מלא מאחורי אמבטיה', 'ת"י 1752 — כיפוף איטום: מינימום 10 ס"מ על קירות כלליים, 180 ס"מ באזור מקלחת, גובה מלא מאחורי אמבטיה', 'הסרת אריחי קיר באזורים הנדרשים, ביצוע כיפוף איטום לגובה תקני, ואריחוי מחדש', 5000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כיפוף איטום לא מספיק בקירות חדר רחצה — איטום רצפת חדר הרחצה לא עולה בכיפוף על הקירות בגובה מספיק (פחות מ-10 ס"מ ברצפה, פחות מ-180 ס"מ באזור המקלחת)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'אטימה לקויה סביב ניקוז רצפתי בחדר רחצה — מפגש האיטום עם הניקוז הרצפתי (נקז רצפה) לא בוצע כראוי — חסר טבעת איטום או חפיפה לא מספיקה. נקודת חדירת מים תכופה', 'ת"י 1752 — ניקוז רצפתי חייב טבעת איטום ייעודית עם חפיפה למערכת האיטום הרצפתית', 'ת"י 1752 — ניקוז רצפתי חייב טבעת איטום ייעודית עם חפיפה למערכת האיטום הרצפתית', 'החלפת הנקז הרצפתי והתקנת טבעת איטום תקנית עם חפיפה מלאה למערכת האיטום', 1800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אטימה לקויה סביב ניקוז רצפתי בחדר רחצה — מפגש האיטום עם הניקוז הרצפתי (נקז רצפה) לא בוצע כראוי — חסר טבעת איטום או חפיפה לא מספיקה. נקודת חדירת מים תכופה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר איטום רצפת מרתף — רצפת המרתף ללא מערכת איטום נגד עליית מי תהום. מים עולים דרך הרצפה וגורמים לרטיבות מתמדת', 'ת"י 931 — רצפות מתחת למפלס הקרקע חייבות איטום נגד לחות עולה, כולל מחסום אדים', 'ת"י 931 — רצפות מתחת למפלס הקרקע חייבות איטום נגד לחות עולה, כולל מחסום אדים', 'ביצוע איטום פנימי בציפוי קריסטלי (crystalline) או ממברנה ביטומנית, עם מערכת ניקוז תת-רצפתי למשאבה', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר איטום רצפת מרתף — רצפת המרתף ללא מערכת איטום נגד עליית מי תהום. מים עולים דרך הרצפה וגורמים לרטיבות מתמדת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר איטום קיר תומך (קיר גבי) — קיר תומך במגע עם קרקע ללא איטום חיצוני. לחות ומים חודרים דרך הקיר וגורמים לרטיבות, עובש ופגיעה במבנה', 'ת"י 931 — קירות תומכים במגע עם קרקע חייבים איטום חיצוני מלא ומערכת ניקוז', 'ת"י 931 — קירות תומכים במגע עם קרקע חייבים איטום חיצוני מלא ומערכת ניקוז', 'חפירה מצד הקרקע, ניקוי הקיר, מריחת פריימר ביטומני, הדבקת יריעת איטום, התקנת צנרת ניקוז ומילוי בחומר מנקז', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר איטום קיר תומך (קיר גבי) — קיר תומך במגע עם קרקע ללא איטום חיצוני. לחות ומים חודרים דרך הקיר וגורמים לרטיבות, עובש ופגיעה במבנה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר אטימה באדן חלון חיצוני — אדן חלון חיצוני ללא שיפוע כלפי חוץ, ללא שפה מנטפת (drip edge), או ללא אטימה בין האדן למסגרת. מים מצטברים ונכנסים דרך מפגש חלון-קיר', 'ת"י 931 — אדני חלונות חיצוניים חייבים שיפוע כלפי חוץ ושפה מנטפת למניעת נזילת מים אל הקיר', 'ת"י 931 — אדני חלונות חיצוניים חייבים שיפוע כלפי חוץ ושפה מנטפת למניעת נזילת מים אל הקיר', 'התקנת אדן עם שיפוע מינימלי 3% כלפי חוץ, שפה מנטפת, ואטימה בסיליקון סביב מסגרת החלון', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר אטימה באדן חלון חיצוני — אדן חלון חיצוני ללא שיפוע כלפי חוץ, ללא שפה מנטפת (drip edge), או ללא אטימה בין האדן למסגרת. מים מצטברים ונכנסים דרך מפגש חלון-קיר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'אטימה לקויה סביב מסגרת חלון — חומר האטימה (סיליקון/פוליאוריתן) סביב מסגרת החלון סדוק, מנותק או חסר. רוח ומים חודרים דרך הרווח שבין המסגרת לקיר', 'ת"י 931 — מפגש מסגרת חלון-קיר חייב אטימה מלאה בחומר אלסטי עמיד בתנאי חוץ', 'ת"י 931 — מפגש מסגרת חלון-קיר חייב אטימה מלאה בחומר אלסטי עמיד בתנאי חוץ', 'הסרת אטימה ישנה, ניקוי המשטחים, מילוי קצף פוליאוריתן בחלל, וגמר באטם סיליקון או פוליאוריתן UV-resistant', 250, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אטימה לקויה סביב מסגרת חלון — חומר האטימה (סיליקון/פוליאוריתן) סביב מסגרת החלון סדוק, מנותק או חסר. רוח ומים חודרים דרך הרווח שבין המסגרת לקיר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר איטום בטון חשוף בתקרת חניה — תקרת חניה תת-קרקעית ללא מערכת איטום. מים חודרים מהגינה או הכביש מעל ופוגעים בברזל הזיון ובמבנה הבטון', 'ת"י 931 — תקרות מתחת למפלס קרקע או חשופות לגשם חייבות מערכת איטום מלאה', 'ת"י 931 — תקרות מתחת למפלס קרקע או חשופות לגשם חייבות מערכת איטום מלאה', 'ביצוע מערכת איטום על תקרת החניה: פריימר + יריעה ביטומנית דו-שכבתית + שכבת הגנה + ניקוז', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר איטום בטון חשוף בתקרת חניה — תקרת חניה תת-קרקעית ללא מערכת איטום. מים חודרים מהגינה או הכביש מעל ופוגעים בברזל הזיון ובמבנה הבטון'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'אטימה חסרה בין אמבטיה/מקלחון לקיר — חסר חומר אטימה (סיליקון) בין אמבטיה או מקלחון לקיר המרוצף. מים חודרים לרווח וגורמים לרטיבות מאחורי האמבטיה', 'ת"י 1752 — מפגשי כלים סניטריים עם קירות וריצוף חייבים אטימה מלאה בחומר אלסטי עמיד במים', 'ת"י 1752 — מפגשי כלים סניטריים עם קירות וריצוף חייבים אטימה מלאה בחומר אלסטי עמיד במים', 'ניקוי המשטחים, התקנת סרט אטימה או מילוי בסיליקון סניטרי אנטי-עובש', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אטימה חסרה בין אמבטיה/מקלחון לקיר — חסר חומר אטימה (סיליקון) בין אמבטיה או מקלחון לקיר המרוצף. מים חודרים לרווח וגורמים לרטיבות מאחורי האמבטיה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'חוסר איטום מתחת לאמבטיה — שטח הרצפה מתחת לאמבטיה לא אוטם. במקרה של נזילה מהאמבטיה או מהצנרת מתחתיה, מים חודרים ישירות לתקרת הדירה מתחת', 'ת"י 1752 — כל שטח רצפת חדר הרחצה חייב איטום, כולל השטח מתחת לאמבטיה', 'ת"י 1752 — כל שטח רצפת חדר הרחצה חייב איטום, כולל השטח מתחת לאמבטיה', 'הסרת האמבטיה, ביצוע איטום רצפתי מלא כולל מתחת לאמבטיה, והתקנה מחדש', 7000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר איטום מתחת לאמבטיה — שטח הרצפה מתחת לאמבטיה לא אוטם. במקרה של נזילה מהאמבטיה או מהצנרת מתחתיה, מים חודרים ישירות לתקרת הדירה מתחת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'סיליקון חסר / פגום בחדר רחצה — סיליקון חסר, סדוק או מתקלף בפינות חדר רחצה, מקלחת, אמבטיה או כיור', 'NULL', 'NULL', 'הסרת סיליקון ישן, ניקוי, מילוי סיליקון חדש', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סיליקון חסר / פגום בחדר רחצה — סיליקון חסר, סדוק או מתקלף בפינות חדר רחצה, מקלחת, אמבטיה או כיור'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'איטום', NULL, 'מחסן — רטיבות / איטום — רטיבות או סימני מים במחסן', 'NULL', 'NULL', 'איטום מחסן, ניקוז, שיפור אוורור', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מחסן — רטיבות / איטום — רטיבות או סימני מים במחסן'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'רטיבות בקירות מרתף — חדירה מהקרקע — כתמי רטיבות, עובש או פריחת מלח (אפלורסנציה) על קירות המרתף. מעיד על חוסר איטום חיצוני או כשל באיטום הקיים נגד לחץ מי תהום', 'ת"י 931 — קירות מרתף מתחת למפלס הקרקע חייבים איטום חיצוני מלא נגד לחות ולחץ מים', 'ת"י 931 — קירות מרתף מתחת למפלס הקרקע חייבים איטום חיצוני מלא נגד לחות ולחץ מים', 'חפירה חיצונית עד ליסוד, ניקוי ותיקון הקיר, ביצוע איטום חיצוני בשכבת ביטומן + יריעה, ומילוי בחזרה עם שכבת סינון', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רטיבות בקירות מרתף — חדירה מהקרקע — כתמי רטיבות, עובש או פריחת מלח (אפלורסנציה) על קירות המרתף. מעיד על חוסר איטום חיצוני או כשל באיטום הקיים נגד לחץ מי תהום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'חוסר ניקוז בגב קיר תומך — קיר תומך ללא מערכת ניקוז מאחוריו (צנרת ניקוז, חומר מנקז, או פתחי ניקוז). לחץ הידרוסטטי על הקיר גורם לחדירת מים ועלול לפגוע ביציבותו', 'ת"י 931 — קיר תומך חייב מערכת ניקוז כולל צנרת מנקזת, שכבת חצץ מנקז, ופתחי ניקוז (weep holes)', 'ת"י 931 — קיר תומך חייב מערכת ניקוז כולל צנרת מנקזת, שכבת חצץ מנקז, ופתחי ניקוז (weep holes)', 'התקנת מערכת ניקוז: צנרת מנקזת מחוררת עטופה בגיאוטקסטיל, שכבת חצץ, וחיבור לתשתית ניקוז', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חוסר ניקוז בגב קיר תומך — קיר תומך ללא מערכת ניקוז מאחוריו (צנרת ניקוז, חומר מנקז, או פתחי ניקוז). לחץ הידרוסטטי על הקיר גורם לחדירת מים ועלול לפגוע ביציבותו'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'רטיבות עולה בקירות (רטיבות קפילרית) — רטיבות עולה מהיסוד לקירות בקומת הקרקע (rising damp). כתמי רטיבות, פריחת מלח וטיח מתקלף בחלק התחתון של הקירות. מעיד על חוסר מחסום רטיבות (DPC)', 'ת"י 931 — חובה למנוע מעבר רטיבות מהיסוד לקירות באמצעות מחסום רטיבות (DPC) ביסוד', 'ת"י 931 — חובה למנוע מעבר רטיבות מהיסוד לקירות באמצעות מחסום רטיבות (DPC) ביסוד', 'הזרקת חומר חוסם רטיבות (cream/gel silane) בקידוחים בבסיס הקיר, ניקוי וחידוש טיח במלט עמיד ברטיבות', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רטיבות עולה בקירות (רטיבות קפילרית) — רטיבות עולה מהיסוד לקירות בקומת הקרקע (rising damp). כתמי רטיבות, פריחת מלח וטיח מתקלף בחלק התחתון של הקירות. מעיד על חוסר מחסום רטיבות (DPC)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'עובש על קירות ותקרה כתוצאה מעיבוי — כתמי עובש שחורים/ירוקים על קירות חיצוניים ותקרות, בעיקר בפינות ומאחורי רהיטים. כתוצאה מגשרים תרמיים, בידוד חסר ואוורור לקוי', 'NULL', 'NULL', 'טיפול בעובש בחומר אנטי-פטרייתי, שיפור בידוד תרמי חיצוני, התקנת מערכת אוורור מכני, ובדיקת גשרים תרמיים', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'עובש על קירות ותקרה כתוצאה מעיבוי — כתמי עובש שחורים/ירוקים על קירות חיצוניים ותקרות, בעיקר בפינות ומאחורי רהיטים. כתוצאה מגשרים תרמיים, בידוד חסר ואוורור לקוי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'גשר תרמי בתקרת גג — רטיבות עיבוי — גשר תרמי באזור מפגש תקרה-קיר חיצוני (thermal bridge) גורם לטמפרטורה נמוכה של המשטח הפנימי ולעיבוי מים. מתבטא בעובש ורטיבות בפינות העליונות', 'NULL', 'NULL', 'שיפור בידוד תרמי באזור הגשר התרמי, הוספת שכבת בידוד פנימית או חיצונית, ושיפור אוורור', 8000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גשר תרמי בתקרת גג — רטיבות עיבוי — גשר תרמי באזור מפגש תקרה-קיר חיצוני (thermal bridge) גורם לטמפרטורה נמוכה של המשטח הפנימי ולעיבוי מים. מתבטא בעובש ורטיבות בפינות העליונות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'חדירת מים דרך סדקים במבנה הבטון — סדקים במבנה הבטון (תקרה, קורות, קירות) מאפשרים חדירת מים. הסדקים עשויים להצביע על בעיה מבנית בנוסף לבעיית האיטום', 'ת"י 931 — מבנה הבטון חייב להיות אטום, סדקים מעל 0.3 מ"מ דורשים טיפול לשיקום האטימות', 'ת"י 931 — מבנה הבטון חייב להיות אטום, סדקים מעל 0.3 מ"מ דורשים טיפול לשיקום האטימות', 'הזרקת חומר אפוקסי או פוליאוריתן לסדקים, בדיקה מבנית של הסדקים על ידי מהנדס, ושיקום האיטום', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חדירת מים דרך סדקים במבנה הבטון — סדקים במבנה הבטון (תקרה, קורות, קירות) מאפשרים חדירת מים. הסדקים עשויים להצביע על בעיה מבנית בנוסף לבעיית האיטום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'נזילת מים מצנרת מעבר בתקרה/רצפה — צנרת מים/ביוב חוצה רצפה או תקרה ללא אטימה סביב המעבר. מים (מנזילה או עיבוי) זולגים דרך הפתח', 'ת"י 931 — כל מעבר צנרת דרך אלמנט בטון חייב אטימה ייעודית באמצעות שרוול ואטם גמיש', 'ת"י 931 — כל מעבר צנרת דרך אלמנט בטון חייב אטימה ייעודית באמצעות שרוול ואטם גמיש', 'התקנת שרוול מעבר (sleeve) עם אטם גומי או מילוי בחומר אטימה חסין אש וגמיש', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזילת מים מצנרת מעבר בתקרה/רצפה — צנרת מים/ביוב חוצה רצפה או תקרה ללא אטימה סביב המעבר. מים (מנזילה או עיבוי) זולגים דרך הפתח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'רטיבות בתקרה / קיר — סימני רטיבות בתקרה או קיר — כתמים, התנפחות צבע, עובש', 'ת"י 1515.3 — איטום חייב למנוע חדירת מים לחלל הדירה', 'ת"י 1515.3 — איטום חייב למנוע חדירת מים לחלל הדירה', 'איתור מקור רטיבות, תיקון איטום, ייבוש וצביעה', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רטיבות בתקרה / קיר — סימני רטיבות בתקרה או קיר — כתמים, התנפחות צבע, עובש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'רטיבות ועובש', NULL, 'עובש בפינות / תקרה — עובש שחור או ירוק בפינות חדרים, תקרות, או סביבת חלונות', 'NULL', 'NULL', 'טיפול בעובש, בדיקת מקור רטיבות, שיפור אוורור', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'עובש בפינות / תקרה — עובש שחור או ירוק בפינות חדרים, תקרות, או סביבת חלונות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'ספרינקלר חסר או לא מותקן בחדר מדרגות — ראש ספרינקלר לא הותקן בחדר מדרגות או בשטח ציבורי כנדרש בתכניות כיבוי האש המאושרות. העדר ספרינקלר מפחית את יכולת הכיבוי האוטומטי במקרה שריפה', 'ת"י 1596 — מערכת ספרינקלרים אוטומטית נדרשת בבניין מגורים מעל קומה מסוימת בהתאם לתקנות כיבוי אש, כולל כיסוי מלא בשטחים ציבוריים', 'ת"י 1596 — מערכת ספרינקלרים אוטומטית נדרשת בבניין מגורים מעל קומה מסוימת בהתאם לתקנות כיבוי אש, כולל כיסוי מלא בשטחים ציבוריים', 'התקנת ראש ספרינקלר מאושר בהתאם לתכנית כיבוי האש, כולל חיבור לצנרת הקיימת ובדיקת לחץ', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ספרינקלר חסר או לא מותקן בחדר מדרגות — ראש ספרינקלר לא הותקן בחדר מדרגות או בשטח ציבורי כנדרש בתכניות כיבוי האש המאושרות. העדר ספרינקלר מפחית את יכולת הכיבוי האוטומטי במקרה שריפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'ספרינקלר צבוע או חסום — ראש ספרינקלר נצבע במהלך עבודות צביעה או חסום על ידי חפצים/מדפים. צביעה על הספרינקלר עלולה למנוע את פעולתו בעת שריפה', 'ת"י 1596 — חל איסור מוחלט לצבוע או לחסום ראשי ספרינקלרים; יש לשמור מרחק חופשי של 50 ס"מ לפחות מכל כיוון', 'ת"י 1596 — חל איסור מוחלט לצבוע או לחסום ראשי ספרינקלרים; יש לשמור מרחק חופשי של 50 ס"מ לפחות מכל כיוון', 'החלפת ראש הספרינקלר הצבוע בחדש מאותו סוג ודירוג טמפרטורה, והסרת כל חסימה', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ספרינקלר צבוע או חסום — ראש ספרינקלר נצבע במהלך עבודות צביעה או חסום על ידי חפצים/מדפים. צביעה על הספרינקלר עלולה למנוע את פעולתו בעת שריפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'גלגלון כיבוי אש לא תקין או חסר — גלגלון כיבוי אש בחדר מדרגות לא פועל, צינור קרוע, ברז תקוע, או חסר לחלוטין. הגלגלון הוא אמצעי כיבוי ראשוני לדיירים', 'ת"י 5765 — גלגלון כיבוי אש חייב להיות תקין, נגיש, עם צינור באורך מספק (לפחות 30 מטר כולל סילון), ולעבור בדיקה שנתית', 'ת"י 5765 — גלגלון כיבוי אש חייב להיות תקין, נגיש, עם צינור באורך מספק (לפחות 30 מטר כולל סילון), ולעבור בדיקה שנתית', 'החלפת גלגלון כיבוי אש פגום בגלגלון חדש תקני, כולל צינור, ברז, וזרנוק, ובדיקת לחץ מים', 2500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גלגלון כיבוי אש לא תקין או חסר — גלגלון כיבוי אש בחדר מדרגות לא פועל, צינור קרוע, ברז תקוע, או חסר לחלוטין. הגלגלון הוא אמצעי כיבוי ראשוני לדיירים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'ארון כיבוי אש פגום או לא נגיש — ארון כיבוי אש שבור, חלוד, דלת לא נפתחת, או חסום על ידי חפצים. חוסר נגישות לארון מונע שימוש באמצעי הכיבוי בזמן חירום', 'ת"י 5765 — ארון כיבוי אש חייב להיות נגיש, מסומן, דלתו חייבת להיפתח ללא מפתח מיוחד, ותכולתו חייבת להיות תקינה', 'ת"י 5765 — ארון כיבוי אש חייב להיות נגיש, מסומן, דלתו חייבת להיפתח ללא מפתח מיוחד, ותכולתו חייבת להיות תקינה', 'תיקון או החלפת ארון כיבוי אש, החלפת דלת שבורה, הסרת חסימות, וסימון מחדש בהתאם לתקן', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ארון כיבוי אש פגום או לא נגיש — ארון כיבוי אש שבור, חלוד, דלת לא נפתחת, או חסום על ידי חפצים. חוסר נגישות לארון מונע שימוש באמצעי הכיבוי בזמן חירום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'מטף כיבוי אש חסר או פג תוקף — מטף כיבוי אש לא מותקן בשטח ציבורי כנדרש, או שתוקפו פג ולא עבר בדיקה שנתית. מטף ללא בדיקה עשוי לא לפעול בעת הצורך', 'ת"י 129 — מטפי כיבוי אש חייבים לעבור בדיקה שנתית על ידי בודק מוסמך, לשאת תווית בדיקה בתוקף, ולהיות מותקנים בגובה ובמיקום נגישים', 'ת"י 129 — מטפי כיבוי אש חייבים לעבור בדיקה שנתית על ידי בודק מוסמך, לשאת תווית בדיקה בתוקף, ולהיות מותקנים בגובה ובמיקום נגישים', 'התקנת מטף כיבוי אש חדש בתוקף או שליחת המטף הקיים לבדיקה ומילוי חוזר, כולל תיוג ובדיקת נגישות', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מטף כיבוי אש חסר או פג תוקף — מטף כיבוי אש לא מותקן בשטח ציבורי כנדרש, או שתוקפו פג ולא עבר בדיקה שנתית. מטף ללא בדיקה עשוי לא לפעול בעת הצורך'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'דלת אש חסרה או לא תקנית — דלת אש בחדר מדרגות או במעבר חסרה, הוחלפה בדלת רגילה, או שאינה עומדת בדירוג עמידות אש נדרש. דלת אש מהווה מחסום קריטי למניעת התפשטות עשן ואש', 'ת"י 1220 — דלת אש חייבת לעמוד בדירוג עמידות אש של 60 דקות לפחות (EI60), לכלול סוגר אוטומטי, ולהיות מסומנת בתווית עמידות אש', 'ת"י 1220 — דלת אש חייבת לעמוד בדירוג עמידות אש של 60 דקות לפחות (EI60), לכלול סוגר אוטומטי, ולהיות מסומנת בתווית עמידות אש', 'התקנת דלת אש מאושרת בדירוג EI60 לפחות, כולל סוגר אוטומטי, אטם אש מתנפח, ומשקוף מתאים', 7000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת אש חסרה או לא תקנית — דלת אש בחדר מדרגות או במעבר חסרה, הוחלפה בדלת רגילה, או שאינה עומדת בדירוג עמידות אש נדרש. דלת אש מהווה מחסום קריטי למניעת התפשטות עשן ואש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'סוגר אוטומטי בדלת אש לא פועל — סוגר הדלת האוטומטי (door closer) בדלת אש לא פועל, שבור, או הוסר. ללא סוגר תקין, הדלת נשארת פתוחה ואינה מהווה מחסום אש', 'ת"י 1220 — כל דלת אש חייבת להיות מצוידת בסוגר אוטומטי תקין המבטיח סגירה מלאה של הדלת לאחר כל פתיחה', 'ת"י 1220 — כל דלת אש חייבת להיות מצוידת בסוגר אוטומטי תקין המבטיח סגירה מלאה של הדלת לאחר כל פתיחה', 'החלפת סוגר אוטומטי פגום בסוגר חדש בהתאם למשקל ולגודל הדלת, כיוון מהירות סגירה', 900, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סוגר אוטומטי בדלת אש לא פועל — סוגר הדלת האוטומטי (door closer) בדלת אש לא פועל, שבור, או הוסר. ללא סוגר תקין, הדלת נשארת פתוחה ואינה מהווה מחסום אש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'אטם אש מתנפח חסר בדלת אש — אטם אש מתנפח (intumescent strip) חסר או פגום בדלת אש. האטם מתנפח בחום ואוטם את המרווח בין הדלת למשקוף, מונע מעבר עשן ואש', 'ת"י 1220 — דלת אש חייבת לכלול אטם אש מתנפח בהיקף הדלת להבטחת אטימות לעשן ולאש', 'ת"י 1220 — דלת אש חייבת לכלול אטם אש מתנפח בהיקף הדלת להבטחת אטימות לעשן ולאש', 'התקנת אטם אש מתנפח חדש בתעלת האטם בהיקף הדלת, כולל אטם עשן', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אטם אש מתנפח חסר בדלת אש — אטם אש מתנפח (intumescent strip) חסר או פגום בדלת אש. האטם מתנפח בחום ואוטם את המרווח בין הדלת למשקוף, מונע מעבר עשן ואש'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'גלאי עשן חסר או לא פועל בשטח ציבורי — גלאי עשן לא מותקן בחדר מדרגות, לובי, או חניון כנדרש, או שהגלאי מותקן אך אינו פעיל (נורית לא דולקת, סוללה ריקה)', 'בהתאם לתקנות כיבוי אש, נדרשת מערכת גילוי אש בשטחים ציבוריים בבניין מגורים הכולל יותר מ-4 קומות', 'בהתאם לתקנות כיבוי אש, נדרשת מערכת גילוי אש בשטחים ציבוריים בבניין מגורים הכולל יותר מ-4 קומות', 'התקנת גלאי עשן אופטי או חיווט למערכת גילוי אש מרכזית, בדיקת תקינות וחיבור ללוח בקרה', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גלאי עשן חסר או לא פועל בשטח ציבורי — גלאי עשן לא מותקן בחדר מדרגות, לובי, או חניון כנדרש, או שהגלאי מותקן אך אינו פעיל (נורית לא דולקת, סוללה ריקה)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'לוח בקרת אש לא תקין או ללא חשמל — לוח בקרת מערכת גילוי אש מציג תקלה, מנותק מחשמל, או שסוללת הגיבוי ריקה. לוח לא תקין פירושו שמערכת גילוי האש כולה לא פעילה', 'לוח בקרת אש חייב להיות פעיל 24/7, כולל גיבוי סוללה ל-24 שעות, ולעבור בדיקה תקופתית', 'לוח בקרת אש חייב להיות פעיל 24/7, כולל גיבוי סוללה ל-24 שעות, ולעבור בדיקה תקופתית', 'תיקון לוח בקרה, החלפת סוללת גיבוי, בדיקת חיבורי גלאים ואזעקות, וביצוע בדיקת מערכת מלאה', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'לוח בקרת אש לא תקין או ללא חשמל — לוח בקרת מערכת גילוי אש מציג תקלה, מנותק מחשמל, או שסוללת הגיבוי ריקה. לוח לא תקין פירושו שמערכת גילוי האש כולה לא פעילה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'תאורת חירום לא פועלת בחדר מדרגות — גופי תאורת חירום בחדר מדרגות לא דולקים בעת הפסקת חשמל, סוללות תקולות, או גופים שבורים. תאורת חירום חיונית לפינוי בטוח', 'ת"י 23 — תאורת חירום נדרשת בכל מסלולי המילוט, עוצמה מינימלית של 1 לוקס ברצפה, זמן פעולה מינימלי 60 דקות', 'ת"י 23 — תאורת חירום נדרשת בכל מסלולי המילוט, עוצמה מינימלית של 1 לוקס ברצפה, זמן פעולה מינימלי 60 דקות', 'החלפת גופי תאורת חירום פגומים, החלפת סוללות, בדיקת פעולה תקינה בניתוק חשמל', 700, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תאורת חירום לא פועלת בחדר מדרגות — גופי תאורת חירום בחדר מדרגות לא דולקים בעת הפסקת חשמל, סוללות תקולות, או גופים שבורים. תאורת חירום חיונית לפינוי בטוח'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'שילוט יציאת חירום חסר או לא מואר — שלט יציאת חירום (EXIT) חסר, לא מואר, או שהכיתוב לא קריא. שילוט חירום הוא חלק ממערך הפינוי ומחויב בכל מסלול מילוט', 'ת"י 23 — שילוט יציאת חירום מואר נדרש בכל נקודות היציאה ובכל נקודת החלטה במסלול המילוט', 'ת"י 23 — שילוט יציאת חירום מואר נדרש בכל נקודות היציאה ובכל נקודת החלטה במסלול המילוט', 'התקנת שלט יציאת חירום מואר LED עם סוללת גיבוי, בהתאם למיקום ולכיוון הפינוי', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שילוט יציאת חירום חסר או לא מואר — שלט יציאת חירום (EXIT) חסר, לא מואר, או שהכיתוב לא קריא. שילוט חירום הוא חלק ממערך הפינוי ומחויב בכל מסלול מילוט'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'צנרת כיבוי אש (standpipe) חלודה או דולפת — צנרת כיבוי אש עולה (standpipe) בחדר מדרגות מראה סימני חלודה, דליפות, או שברזי הפיתוח שלה חסומים', 'צנרת כיבוי אש חייבת להיות תקינה, ללא דליפות, עם ברזי פיתוח נגישים ותקינים בכל קומה', 'צנרת כיבוי אש חייבת להיות תקינה, ללא דליפות, עם ברזי פיתוח נגישים ותקינים בכל קומה', 'החלפת קטעי צנרת חלודים, תיקון דליפות, שיפוץ או החלפת ברזי פיתוח, צביעה בצבע אדום', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת כיבוי אש (standpipe) חלודה או דולפת — צנרת כיבוי אש עולה (standpipe) בחדר מדרגות מראה סימני חלודה, דליפות, או שברזי הפיתוח שלה חסומים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'חניון ללא מערכת אוורור מכני — חניון תת-קרקעי ללא מערכת אוורור מכני פעילה, או שהמערכת תקולה. הצטברות פליטות רכב ועשן מהווה סכנת חיים', 'חניון תת-קרקעי חייב במערכת אוורור מכני המבטיחה החלפת אוויר מספקת ופינוי עשן בשריפה', 'חניון תת-קרקעי חייב במערכת אוורור מכני המבטיחה החלפת אוויר מספקת ופינוי עשן בשריפה', 'תיקון מערכת אוורור מכני, החלפת מנועים תקולים, ניקוי תעלות, בדיקת בקר CO', 15000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חניון ללא מערכת אוורור מכני — חניון תת-קרקעי ללא מערכת אוורור מכני פעילה, או שהמערכת תקולה. הצטברות פליטות רכב ועשן מהווה סכנת חיים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'כיבוי אש', NULL, 'מערכת גילוי CO בחניון לא פעילה — מערכת גילוי פחמן חד-חמצני (CO) בחניון תת-קרקעי לא פעילה, חיישנים תקולים, או ללא חיבור למערכת אוורור', 'חניון תת-קרקעי חייב במערכת גילוי CO המחוברת להפעלה אוטומטית של מערכת האוורור', 'חניון תת-קרקעי חייב במערכת גילוי CO המחוברת להפעלה אוטומטית של מערכת האוורור', 'תיקון או החלפת חיישני CO, בדיקת חיבור למערכת אוורור, כיול חיישנים', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מערכת גילוי CO בחניון לא פעילה — מערכת גילוי פחמן חד-חמצני (CO) בחניון תת-קרקעי לא פעילה, חיישנים תקולים, או ללא חיבור למערכת אוורור'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, 'מעלית ללא תעודת בדיקה בתוקף — תעודת בדיקה תקופתית של המעלית פגת תוקף או לא מוצגת בתוך תא המעלית. בדיקה תקופתית חובה לפי חוק', 'ת"י 7588 — מעלית חייבת לעבור בדיקה תקופתית כל 6 חודשים על ידי בודק מוסמך, ותעודת הבדיקה חייבת להיות מוצגת בתא', 'ת"י 7588 — מעלית חייבת לעבור בדיקה תקופתית כל 6 חודשים על ידי בודק מוסמך, ותעודת הבדיקה חייבת להיות מוצגת בתא', 'הזמנת בדיקת מעלית תקופתית מבודק מוסמך, תיקון ליקויים שיימצאו, והצגת תעודה בתוקף בתא', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעלית ללא תעודת בדיקה בתוקף — תעודת בדיקה תקופתית של המעלית פגת תוקף או לא מוצגת בתוך תא המעלית. בדיקה תקופתית חובה לפי חוק'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, 'דלת מעלית לא נסגרת כראוי — דלת תא מעלית או דלת פיר לא נסגרת באופן מלא, נתקעת, או סוגרת בכוח מוגזם. דלת לא תקינה מהווה סכנת בטיחות וגורמת לתקלות חוזרות', 'ת"י 7588 — דלתות מעלית חייבות לפעול בצורה חלקה, לסגור באופן מלא, ולכלול מנגנון בטיחות למניעת לכידה', 'ת"י 7588 — דלתות מעלית חייבות לפעול בצורה חלקה, לסגור באופן מלא, ולכלול מנגנון בטיחות למניעת לכידה', 'כוונון או החלפת מנגנון דלת מעלית, ניקוי מסילות, החלפת גלגלים בלויים, בדיקת חיישן בטיחות', 2500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת מעלית לא נסגרת כראוי — דלת תא מעלית או דלת פיר לא נסגרת באופן מלא, נתקעת, או סוגרת בכוח מוגזם. דלת לא תקינה מהווה סכנת בטיחות וגורמת לתקלות חוזרות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, 'כפתור מעלית לא פועל או שבור — כפתור קריאה בקומה או כפתור בחירת קומה בתא המעלית לא פועל, שקוע, שבור, או ללא תאורה', 'כל כפתורי המעלית חייבים לפעול באופן תקין ולתת אינדיקציה ויזואלית על לחיצה', 'כל כפתורי המעלית חייבים לפעול באופן תקין ולתת אינדיקציה ויזואלית על לחיצה', 'החלפת כפתור מעלית פגום, בדיקת חיווט, וודאות תקינות תאורת אינדיקציה', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כפתור מעלית לא פועל או שבור — כפתור קריאה בקומה או כפתור בחירת קומה בתא המעלית לא פועל, שקוע, שבור, או ללא תאורה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, 'טלפון חירום במעלית לא פועל — טלפון חירום (אינטרקום) בתא מעלית לא מחובר, לא פועל, או לא מגיע ליעד (מוקד חילוץ). טלפון חירום חיוני לחילוץ נלכדים', 'ת"י 7588 — כל מעלית חייבת להיות מצוידת בטלפון חירום דו-כיווני תקין המחובר למוקד 24/7', 'ת"י 7588 — כל מעלית חייבת להיות מצוידת בטלפון חירום דו-כיווני תקין המחובר למוקד 24/7', 'תיקון או החלפת מערכת אינטרקום, בדיקת קו טלפון, וידוא חיבור למוקד חילוץ', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'טלפון חירום במעלית לא פועל — טלפון חירום (אינטרקום) בתא מעלית לא מחובר, לא פועל, או לא מגיע ליעד (מוקד חילוץ). טלפון חירום חיוני לחילוץ נלכדים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, 'תאורה לא תקינה בתא מעלית — תאורה בתא מעלית חלשה, מהבהבת, או כבויה חלקית. כולל תאורת חירום שלא דולקת בהפסקת חשמל', 'תאורה בתא מעלית חייבת להיות בעוצמה מספקת (50 לוקס לפחות) כולל תאורת חירום עצמאית', 'תאורה בתא מעלית חייבת להיות בעוצמה מספקת (50 לוקס לפחות) כולל תאורת חירום עצמאית', 'החלפת נורות/לדים בתא מעלית, בדיקה ותיקון תאורת חירום כולל סוללה', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תאורה לא תקינה בתא מעלית — תאורה בתא מעלית חלשה, מהבהבת, או כבויה חלקית. כולל תאורת חירום שלא דולקת בהפסקת חשמל'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, 'מעלית ללא מפתח כיבוי אש (fireman switch) — מעלית ללא מפתח כיבוי אש (fireman switch) או שהמפתח לא זמין לשירותי כיבוי. מפתח זה מאפשר לכבאים לשלוט במעלית בשעת חירום', 'ת"י 7588 — מעלית חייבת להיות מצוידת במתג כבאים (fireman switch) בקומת הכניסה המאפשר הפעלת מצב חירום', 'ת"י 7588 — מעלית חייבת להיות מצוידת במתג כבאים (fireman switch) בקומת הכניסה המאפשר הפעלת מצב חירום', 'התקנת מנגנון fireman switch תקני, מסירת מפתחות לשירותי כיבוי, סימון בולט', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעלית ללא מפתח כיבוי אש (fireman switch) — מעלית ללא מפתח כיבוי אש (fireman switch) או שהמפתח לא זמין לשירותי כיבוי. מפתח זה מאפשר לכבאים לשלוט במעלית בשעת חירום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מעלית', NULL, 'מעלית — רעש חריג או רעידות — מעלית עם רעש חריג, רעידות או נסיעה לא חלקה', 'ת"י 20 — מעלית חייבת לפעול בשקט ובחלקות', 'ת"י 20 — מעלית חייבת לפעול בשקט ובחלקות', 'בדיקת טכנאי מעליות, תיקון לפי ממצאים', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעלית — רעש חריג או רעידות — מעלית עם רעש חריג, רעידות או נסיעה לא חלקה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'מעקה חדר מדרגות רופף או בגובה לא תקני — מעקה בחדר מדרגות רופף, לא יציב, או בגובה נמוך מהנדרש (פחות מ-105 ס"מ). מעקה לא תקין מהווה סכנת נפילה', 'ת"י 1142 — מעקה בטיחות בחדר מדרגות חייב להיות בגובה 105 ס"מ לפחות, יציב, ועם מרווחים בין חלקיו שלא יעלו על 10 ס"מ', 'ת"י 1142 — מעקה בטיחות בחדר מדרגות חייב להיות בגובה 105 ס"מ לפחות, יציב, ועם מרווחים בין חלקיו שלא יעלו על 10 ס"מ', 'חיזוק עיגון מעקה, הגבהה לגובה תקני של 105 ס"מ, ותיקון חלקים רופפים', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעקה חדר מדרגות רופף או בגובה לא תקני — מעקה בחדר מדרגות רופף, לא יציב, או בגובה נמוך מהנדרש (פחות מ-105 ס"מ). מעקה לא תקין מהווה סכנת נפילה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'מדרגה שבורה או סדוקה בחדר מדרגות — מדרגת שיש או בטון סדוקה, שבורה, או עם חלקים חסרים בחדר המדרגות. מדרגה פגומה מהווה סכנת מעידה', 'תקנות הבנייה מחייבות מדרגות שלמות ויציבות בכל חלקי המבנה הציבוריים', 'תקנות הבנייה מחייבות מדרגות שלמות ויציבות בכל חלקי המבנה הציבוריים', 'תיקון או החלפת מדרגה פגומה, מילוי סדקים באפוקסי או החלפת אריח שיש', 900, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מדרגה שבורה או סדוקה בחדר מדרגות — מדרגת שיש או בטון סדוקה, שבורה, או עם חלקים חסרים בחדר המדרגות. מדרגה פגומה מהווה סכנת מעידה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'פס נגד החלקה חסר במדרגות — פס נגד החלקה (anti-slip nosing) חסר בקצה המדרגות בחדר המדרגות. העדר פס נגד החלקה מגביר סכנת מעידה, במיוחד כשהמדרגות רטובות', 'ת"י 1142 — נדרש סימון בולט ונגד החלקה בקצה כל מדרגה בחדר מדרגות ציבורי', 'ת"י 1142 — נדרש סימון בולט ונגד החלקה בקצה כל מדרגה בחדר מדרגות ציבורי', 'התקנת פסי אלומיניום נגד החלקה עם תוספת גומי בקצה כל מדרגה', 80, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פס נגד החלקה חסר במדרגות — פס נגד החלקה (anti-slip nosing) חסר בקצה המדרגות בחדר המדרגות. העדר פס נגד החלקה מגביר סכנת מעידה, במיוחד כשהמדרגות רטובות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'צביעה מתקלפת או לכלוך בחדר מדרגות — צבע מתקלף, כתמים, גרפיטי, או לכלוך מצטבר על קירות חדר המדרגות. מצב זה מעיד על חוסר תחזוקה', 'שטחים ציבוריים חייבים להישמר במצב תקין ונקי כחלק מתחזוקת הרכוש המשותף', 'שטחים ציבוריים חייבים להישמר במצב תקין ונקי כחלק מתחזוקת הרכוש המשותף', 'הכנת משטחים (גירוד, שפכטל), צביעה מחדש בצבע פלסטי עמיד בגוון אחיד', 55, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צביעה מתקלפת או לכלוך בחדר מדרגות — צבע מתקלף, כתמים, גרפיטי, או לכלוך מצטבר על קירות חדר המדרגות. מצב זה מעיד על חוסר תחזוקה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'חלון חדר מדרגות שבור או לא נפתח — חלון בחדר מדרגות שבור, סדוק, או מנגנון פתיחה תקוע. חלון חדר המדרגות חיוני לאוורור ולפינוי עשן', 'חדר מדרגות מוגן חייב לכלול פתח אוורור עליון (טרישנטל) או חלונות הניתנים לפתיחה לפינוי עשן', 'חדר מדרגות מוגן חייב לכלול פתח אוורור עליון (טרישנטל) או חלונות הניתנים לפתיחה לפינוי עשן', 'החלפת זגוגית שבורה, תיקון מנגנון פתיחה, שימון צירים, או החלפת חלון שלם', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חלון חדר מדרגות שבור או לא נפתח — חלון בחדר מדרגות שבור, סדוק, או מנגנון פתיחה תקוע. חלון חדר המדרגות חיוני לאוורור ולפינוי עשן'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'חדר מדרגות ללא אוורור עליון (טרישנטל) — חדר מדרגות מוגן ללא פתח אוורור עליון (טרישנטל) או שהפתח חסום. פתח עליון חיוני לפינוי עשן במקרה שריפה', 'חדר מדרגות מוגן חייב לכלול פתח אוורור עליון בשטח של לפחות 1 מ"ר לפינוי עשן טבעי', 'חדר מדרגות מוגן חייב לכלול פתח אוורור עליון בשטח של לפחות 1 מ"ר לפינוי עשן טבעי', 'פתיחת פתח אוורור עליון בגג חדר המדרגות או הסרת חסימה קיימת, התקנת רשת נגד מזיקים', 6000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חדר מדרגות ללא אוורור עליון (טרישנטל) — חדר מדרגות מוגן ללא פתח אוורור עליון (טרישנטל) או שהפתח חסום. פתח עליון חיוני לפינוי עשן במקרה שריפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'סימון קומות חסר בחדר מדרגות — מספרי קומות לא מסומנים בחדר מדרגות, או שהסימון דהוי ולא קריא. חיוני לפינוי ולזיהוי מיקום בשעת חירום', 'כל קומה בחדר מדרגות חייבת להיות מסומנת במספר קומה בולט, קריא גם בתנאי עשן', 'כל קומה בחדר מדרגות חייבת להיות מסומנת במספר קומה בולט, קריא גם בתנאי עשן', 'התקנת שילוט קומות פוספורסנטי (זוהר בחושך) בכל קומה בחדר המדרגות', 150, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סימון קומות חסר בחדר מדרגות — מספרי קומות לא מסומנים בחדר מדרגות, או שהסימון דהוי ולא קריא. חיוני לפינוי ולזיהוי מיקום בשעת חירום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'מעקה מרפסת משותפת/גג רופף או נמוך — מעקה בטיחות בגג הבניין או במרפסת משותפת רופף, חלוד, או בגובה נמוך מ-105 ס"מ. סכנת נפילה חמורה', 'ת"י 1142 — מעקה בטיחות בגג או במרפסת חייב להיות בגובה 105 ס"מ לפחות, יציב ועמיד', 'ת"י 1142 — מעקה בטיחות בגג או במרפסת חייב להיות בגובה 105 ס"מ לפחות, יציב ועמיד', 'חיזוק או החלפת מעקה, הגבהה לגובה תקני, טיפול בחלודה וצביעה מחדש', 1200, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעקה מרפסת משותפת/גג רופף או נמוך — מעקה בטיחות בגג הבניין או במרפסת משותפת רופף, חלוד, או בגובה נמוך מ-105 ס"מ. סכנת נפילה חמורה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'חדר מדרגות', NULL, 'מדרגות — גובה שלח לא אחיד — הפרשי גובה בין שלחי מדרגות — גורם למעידות', 'ת"י 1142 — הפרש גובה מותר בין שלחים: עד 5 מ"מ', 'ת"י 1142 — הפרש גובה מותר בין שלחים: עד 5 מ"מ', 'יישור שלחים, תיקון ריצוף מדרגות', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מדרגות — גובה שלח לא אחיד — הפרשי גובה בין שלחי מדרגות — גורם למעידות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'ריצוף שבור או מפולס לא אחיד בלובי — אריחי ריצוף בלובי הכניסה שבורים, סדוקים, חסרים, או עם הפרשי גובה בין אריחים. מהווה סכנת מעידה ופוגם במראה הבניין', 'ריצוף בשטחים ציבוריים חייב להיות שלם, אחיד, ללא הפרשי גובה מעל 2 מ"מ, ועם מקדם חיכוך מספק', 'ריצוף בשטחים ציבוריים חייב להיות שלם, אחיד, ללא הפרשי גובה מעל 2 מ"מ, ועם מקדם חיכוך מספק', 'החלפת אריחים שבורים, יישור הפרשי גובה, מילוי רובה חסרה', 350, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ריצוף שבור או מפולס לא אחיד בלובי — אריחי ריצוף בלובי הכניסה שבורים, סדוקים, חסרים, או עם הפרשי גובה בין אריחים. מהווה סכנת מעידה ופוגם במראה הבניין'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'חדירת מים ורטיבות בלובי או בחדר מדרגות — סימני רטיבות, עובש, או חדירת מים בקירות או בתקרת הלובי וחדר המדרגות. רטיבות בשטחים ציבוריים מעידה על כשל באיטום', 'שטחים ציבוריים חייבים להיות יבשים וללא חדירת מים מהגג, מקירות חיצוניים, או מתשתיות אינסטלציה', 'שטחים ציבוריים חייבים להיות יבשים וללא חדירת מים מהגג, מקירות חיצוניים, או מתשתיות אינסטלציה', 'איתור מקור הרטיבות, תיקון איטום גג/קירות חיצוניים, טיפול בעובש, וצביעה מחדש', 5000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חדירת מים ורטיבות בלובי או בחדר מדרגות — סימני רטיבות, עובש, או חדירת מים בקירות או בתקרת הלובי וחדר המדרגות. רטיבות בשטחים ציבוריים מעידה על כשל באיטום'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'תיבות דואר פגומות או חסרות — תיבות דואר בלובי שבורות, ללא דלת, ללא מנעול, חלודות, או חסרות. תיבות דואר הן חלק מהרכוש המשותף', 'כל דירה זכאית לתיבת דואר תקינה עם מנעול בלובי הכניסה', 'כל דירה זכאית לתיבת דואר תקינה עם מנעול בלובי הכניסה', 'החלפת תיבות דואר פגומות, התקנת מנעולים, או החלפת מערכת תיבות דואר שלמה', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תיבות דואר פגומות או חסרות — תיבות דואר בלובי שבורות, ללא דלת, ללא מנעול, חלודות, או חסרות. תיבות דואר הן חלק מהרכוש המשותף'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'דלת כניסה ראשית לבניין לא נסגרת או ללא מנגנון נעילה — דלת כניסה ראשית לבניין לא נסגרת אוטומטית, מנגנון נעילה אלקטרוני (אינטרקום) לא פועל, או ציר שבור', 'דלת כניסה ראשית חייבת להיסגר אוטומטית ולכלול מנגנון נעילה תקין לאבטחת הדיירים', 'דלת כניסה ראשית חייבת להיסגר אוטומטית ולכלול מנגנון נעילה תקין לאבטחת הדיירים', 'תיקון או החלפת סוגר דלת, תיקון מנגנון נעילה אלקטרומגנטי, וכיוון צירים', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת כניסה ראשית לבניין לא נסגרת או ללא מנגנון נעילה — דלת כניסה ראשית לבניין לא נסגרת אוטומטית, מנגנון נעילה אלקטרוני (אינטרקום) לא פועל, או ציר שבור'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'חדר חשמל ראשי ללא סימון או נעילה — חדר חשמל ראשי ללא שלט אזהרה, ללא נעילה, או עם גישה חופשית לכל דייר. סכנת התחשמלות ושריפה', 'חדר חשמל ראשי חייב להיות נעול, מסומן בשלטי אזהרה, ונגיש רק לאנשי מקצוע מורשים', 'חדר חשמל ראשי חייב להיות נעול, מסומן בשלטי אזהרה, ונגיש רק לאנשי מקצוע מורשים', 'התקנת מנעול בטיחות, שילוט אזהרה (סכנת חשמל, אסור להיכנס), ווידוא נגישות לחברת החשמל', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חדר חשמל ראשי ללא סימון או נעילה — חדר חשמל ראשי ללא שלט אזהרה, ללא נעילה, או עם גישה חופשית לכל דייר. סכנת התחשמלות ושריפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'חדר אשפה ללא אוורור או ניקוז — חדר אשפה משותף ללא מערכת אוורור, ללא ניקוז רצפה, או עם דלת לא אטומה. גורם למפגעי ריח, תברואה, ומזיקים', 'חדר אשפה בבניין מגורים חייב לכלול אוורור מכני או טבעי, ניקוז רצפה, וריצוף ניתן לשטיפה', 'חדר אשפה בבניין מגורים חייב לכלול אוורור מכני או טבעי, ניקוז רצפה, וריצוף ניתן לשטיפה', 'התקנת מאוורר יניקה, תיקון ניקוז רצפה, אטימת דלת, וריצוף עמיד לשטיפה', 4000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חדר אשפה ללא אוורור או ניקוז — חדר אשפה משותף ללא מערכת אוורור, ללא ניקוז רצפה, או עם דלת לא אטומה. גורם למפגעי ריח, תברואה, ומזיקים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'תאורה לקויה בחניון — תאורה חלשה, נורות שרופות, או אזורים חשוכים בחניון. תאורה לקויה מגבירה סכנת תאונות ופלילות', 'חניון חייב בתאורה אחידה בעוצמה מינימלית של 50 לוקס באזורי נסיעה ו-20 לוקס באזורי חנייה', 'חניון חייב בתאורה אחידה בעוצמה מינימלית של 50 לוקס באזורי נסיעה ו-20 לוקס באזורי חנייה', 'החלפת נורות שרופות, התקנת גופי תאורת LED, הוספת נקודות תאורה באזורים חשוכים', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'תאורה לקויה בחניון — תאורה חלשה, נורות שרופות, או אזורים חשוכים בחניון. תאורה לקויה מגבירה סכנת תאונות ופלילות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'אינטרקום כניסה לא פועל — מערכת אינטרקום בכניסה לבניין לא פועלת, מסך שבור, או שכפתורי החיוג לדירות לא מגיבים', 'מערכת אינטרקום חייבת לאפשר תקשורת בין המבקר בכניסה לדיירים ופתיחת דלת מרחוק', 'מערכת אינטרקום חייבת לאפשר תקשורת בין המבקר בכניסה לדיירים ופתיחת דלת מרחוק', 'תיקון או החלפת מערכת אינטרקום, בדיקת חיווט, החלפת פנל חיצוני פגום', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'אינטרקום כניסה לא פועל — מערכת אינטרקום בכניסה לבניין לא פועלת, מסך שבור, או שכפתורי החיוג לדירות לא מגיבים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'שאריות בנייה / ניקיון לקוי — שאריות מלט, צבע, דבק או אבק בנייה על ריצוף, חלונות או כלים סניטריים', 'NULL', 'NULL', 'ניקיון בנייה מקצועי', 3500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'שאריות בנייה / ניקיון לקוי — שאריות מלט, צבע, דבק או אבק בנייה על ריצוף, חלונות או כלים סניטריים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'כתמי מלט על ריצוף — כתמי מלט או דבק אריחים שנשארו על הריצוף לאחר העבודה', 'NULL', 'NULL', 'ניקוי מקצועי בחומרים ייעודיים', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כתמי מלט על ריצוף — כתמי מלט או דבק אריחים שנשארו על הריצוף לאחר העבודה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'מעקה לא יציב / גובה לא תקני — מעקה מרפסת או מדרגות שלא יציב, או שגובהו נמוך מהנדרש (105 ס"מ)', 'ת"י 1142 — גובה מעקה מינימלי: 105 ס"מ. מרווח בין פסים: עד 10 ס"מ', 'ת"י 1142 — גובה מעקה מינימלי: 105 ס"מ. מרווח בין פסים: עד 10 ס"מ', 'הגבהת / חיזוק / החלפת מעקה', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעקה לא יציב / גובה לא תקני — מעקה מרפסת או מדרגות שלא יציב, או שגובהו נמוך מהנדרש (105 ס"מ)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'לובי ורכוש משותף', NULL, 'חניה — סימון לקוי או חסר — סימון חניה חסר, לא ברור, או לא תואם לתוכנית', 'NULL', 'NULL', 'סימון חניות מחדש בהתאם לתוכנית', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חניה — סימון לקוי או חסר — סימון חניה חסר, לא ברור, או לא תואם לתוכנית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, 'רמפת נגישות חסרה או בשיפוע לא תקני — רמפה לנכים בכניסה לבניין חסרה, שיפועה חד מדי (מעל 8%), ללא מעקה בטיחות, או בלי משטח אופקי בראשה', 'ת"י 1918 חלק 1 — רמפת נגישות חייבת להיות בשיפוע מקסימלי של 8% (1:12), רוחב מינימלי 130 ס"מ, עם מעקות משני צדדים ומשטח אופקי בראש ובתחתית', 'ת"י 1918 חלק 1 — רמפת נגישות חייבת להיות בשיפוע מקסימלי של 8% (1:12), רוחב מינימלי 130 ס"מ, עם מעקות משני צדדים ומשטח אופקי בראש ובתחתית', 'בניית רמפת נגישות תקנית או תיקון שיפוע, התקנת מעקות, והוספת משטח אופקי', 12000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רמפת נגישות חסרה או בשיפוע לא תקני — רמפה לנכים בכניסה לבניין חסרה, שיפועה חד מדי (מעל 8%), ללא מעקה בטיחות, או בלי משטח אופקי בראשה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, 'מעלית ללא נגישות לנכים — מעלית ללא כפתורים בגובה נגיש, ללא כיתוב ברייל, ללא הכרזה קולית על קומות, או פתח צר מדי לכיסא גלגלים', 'ת"י 1918 חלק 3 — מעלית נגישה חייבת לכלול: כפתורים בגובה נגיש, סימון ברייל, הכרזה קולית, רוחב פתח 90 ס"מ לפחות, ומראה אחורית', 'ת"י 1918 חלק 3 — מעלית נגישה חייבת לכלול: כפתורים בגובה נגיש, סימון ברייל, הכרזה קולית, רוחב פתח 90 ס"מ לפחות, ומראה אחורית', 'שדרוג לוח כפתורים עם ברייל, התקנת מערכת הכרזה קולית, בדיקת רוחב פתח', 8000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעלית ללא נגישות לנכים — מעלית ללא כפתורים בגובה נגיש, ללא כיתוב ברייל, ללא הכרזה קולית על קומות, או פתח צר מדי לכיסא גלגלים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, 'חניית נכים חסרה או לא מסומנת — חניית נכים לא מסומנת, ללא שילוט, ברוחב לא מספק, או ללא מעבר נגיש ממנה לכניסת הבניין', 'ת"י 1918 חלק 1 — נדרשת לפחות חנייה נגישה אחת לכל 25 חניות, ברוחב 3.5 מטר, עם סימון ושילוט בולטים ומעבר נגיש', 'ת"י 1918 חלק 1 — נדרשת לפחות חנייה נגישה אחת לכל 25 חניות, ברוחב 3.5 מטר, עם סימון ושילוט בולטים ומעבר נגיש', 'סימון וצביעת חניית נכים, התקנת שילוט, הרחבה לרוחב תקני, והתקנת מעבר נגיש', 3000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'חניית נכים חסרה או לא מסומנת — חניית נכים לא מסומנת, ללא שילוט, ברוחב לא מספק, או ללא מעבר נגיש ממנה לכניסת הבניין'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, 'העדר מאחז יד בחדר מדרגות — מאחז יד (handrail) חסר בצד אחד או בשני צדדי חדר המדרגות, לא רציף, או בגובה לא תקני', 'ת"י 1918 חלק 1 — נדרש מאחז יד רציף בשני צדדי חדר המדרגות, בגובה 85-100 ס"מ, עם חזרה לקיר בקצוות', 'ת"י 1918 חלק 1 — נדרש מאחז יד רציף בשני צדדי חדר המדרגות, בגובה 85-100 ס"מ, עם חזרה לקיר בקצוות', 'התקנת מאחז יד נירוסטה רציף בשני צדדי חדר המדרגות, בגובה תקני עם חזרה לקיר', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'העדר מאחז יד בחדר מדרגות — מאחז יד (handrail) חסר בצד אחד או בשני צדדי חדר המדרגות, לא רציף, או בגובה לא תקני'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, 'מעבר מעלית צר מדי לכיסא גלגלים — המרווח בין דלת המעלית לקיר הנגדי בקומה קטן מדי, מונע כניסה ויציאה נוחה של כיסא גלגלים', 'ת"י 1918 חלק 3 — מרווח מינימלי של 150 ס"מ נדרש מול דלת המעלית לתמרון כיסא גלגלים', 'ת"י 1918 חלק 3 — מרווח מינימלי של 150 ס"מ נדרש מול דלת המעלית לתמרון כיסא גלגלים', 'הסרת חסימות, הרחבת מרווח תמרון מול דלת המעלית, במקרים קיצוניים — שינוי תכנוני', 5000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מעבר מעלית צר מדי לכיסא גלגלים — המרווח בין דלת המעלית לקיר הנגדי בקומה קטן מדי, מונע כניסה ויציאה נוחה של כיסא גלגלים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'נגישות', NULL, 'סף מפתן גבוה בכניסה לבניין — מפתן (סף) גבוה בכניסה לבניין המונע מעבר כיסא גלגלים או עגלת תינוק. הפרש גובה מעל 2 ס"מ ללא רמפה', 'ת"י 1918 חלק 1 — הפרש גובה מקסימלי בכניסה נגישה הוא 2 ס"מ, מעל לכך נדרשת רמפה או הורדת מפלס', 'ת"י 1918 חלק 1 — הפרש גובה מקסימלי בכניסה נגישה הוא 2 ס"מ, מעל לכך נדרשת רמפה או הורדת מפלס', 'התקנת רמפון (ramp insert) או הורדת מפתן לגובה תקני, ביצוע מעבר חלק ללא הפרשי גובה', 2000, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'סף מפתן גבוה בכניסה לבניין — מפתן (סף) גבוה בכניסה לבניין המונע מעבר כיסא גלגלים או עגלת תינוק. הפרש גובה מעל 2 ס"מ ללא רמפה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, 'דלת לא נסגרת כראוי — דלת פנים שלא נסגרת כראוי — שפשוף ברצפה, משקוף עקום, או ציר רופף', 'NULL', 'NULL', 'כוונון צירים, שיוף תחתית דלת, או החלפת דלת', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת לא נסגרת כראוי — דלת פנים שלא נסגרת כראוי — שפשוף ברצפה, משקוף עקום, או ציר רופף'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, 'מנעול תקוע / לא נועל — מנעול דלת שלא פועל כראוי — תקוע, קשה לסיבוב, או לא נועל', 'NULL', 'NULL', 'שימון, כוונון או החלפת מנעול', 450, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מנעול תקוע / לא נועל — מנעול דלת שלא פועל כראוי — תקוע, קשה לסיבוב, או לא נועל'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, 'משקוף פגום / לא ישר — משקוף דלת שעקום, פגום או לא מותקן ישר', 'NULL', 'NULL', 'יישור או החלפת משקוף', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'משקוף פגום / לא ישר — משקוף דלת שעקום, פגום או לא מותקן ישר'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, 'ארון מטבח — דלת לא מיושרת — דלת ארון מטבח שלא מיושרת — לא נסגרת כראוי או לא במפלס עם שאר הדלתות', 'NULL', 'NULL', 'כוונון צירים, יישור דלת', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ארון מטבח — דלת לא מיושרת — דלת ארון מטבח שלא מיושרת — לא נסגרת כראוי או לא במפלס עם שאר הדלתות'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'דלתות פנים ונגרות', NULL, 'דלת כניסה — אטימה לקויה — דלת כניסה ראשית שלא אוטמת כראוי — חדירת אוויר, אור או מים', 'ת"י 23 — דלת כניסה חייבת לאטום כנגד חדירת מים ואוויר', 'ת"י 23 — דלת כניסה חייבת לאטום כנגד חדירת מים ואוויר', 'החלפת אטמים, כוונון דלת, תיקון מסגרת', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'דלת כניסה — אטימה לקויה — דלת כניסה ראשית שלא אוטמת כראוי — חדירת אוויר, אור או מים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'צביעה', NULL, 'פילינג / התקלפות צבע — צבע שמתקלף מהקיר או התקרה. עלול לנבוע מרטיבות, הכנה לקויה או צבע לא מתאים', 'ת"י 1515 חלק 3 — צבע חייב להיות צמוד ואחיד — התקלפות מהווה ליקוי', 'ת"י 1515 חלק 3 — צבע חייב להיות צמוד ואחיד — התקלפות מהווה ליקוי', 'גירוד צבע ישן, הכנת משטח, צביעה ב-2 שכבות', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'פילינג / התקלפות צבע — צבע שמתקלף מהקיר או התקרה. עלול לנבוע מרטיבות, הכנה לקויה או צבע לא מתאים'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'צביעה', NULL, 'כתמים / אי-אחידות בצבע — כתמי צבע, הבדלי גוון, או חוסר אחידות במשטח הצבוע', 'ת"י 1515 חלק 3 — צביעה חייבת להיות אחידה בגוון ובמרקם', 'ת"י 1515 חלק 3 — צביעה חייבת להיות אחידה בגוון ובמרקם', 'צביעה מחדש של המשטח הפגום ב-2 שכבות', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'כתמים / אי-אחידות בצבע — כתמי צבע, הבדלי גוון, או חוסר אחידות במשטח הצבוע'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'צביעה', NULL, 'טפטופי צבע / שפכים — טפטופי צבע נראים לעין על קירות, תקרות, או על אלמנטים סמוכים (חלונות, דלתות, ריצוף)', 'NULL', 'NULL', 'ניקוי טפטופים ותיקון מקומי', 300, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'טפטופי צבע / שפכים — טפטופי צבע נראים לעין על קירות, תקרות, או על אלמנטים סמוכים (חלונות, דלתות, ריצוף)'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מיזוג אוויר', NULL, 'מזגן לא מקרר / לא מחמם — יחידת מיזוג אוויר שלא מגיעה לטמפרטורה הנדרשת', 'NULL', 'NULL', 'בדיקת גז, ניקוי מסננים, תיקון או החלפת יחידה', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'מזגן לא מקרר / לא מחמם — יחידת מיזוג אוויר שלא מגיעה לטמפרטורה הנדרשת'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מיזוג אוויר', NULL, 'רעש חריג מיחידת מיזוג — רעש חריג מיחידה פנימית או חיצונית של המזגן', 'NULL', 'NULL', 'בדיקת חיבורים, איזון מאוורר, תיקון', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'רעש חריג מיחידת מיזוג — רעש חריג מיחידה פנימית או חיצונית של המזגן'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'מיזוג אוויר', NULL, 'נזילת קונדנס ממזגן — נזילת מים (קונדנסציה) מיחידת המזגן הפנימית', 'NULL', 'NULL', 'בדיקת צנרת ניקוז קונדנס, ניקוי או תיקון', 400, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'נזילת קונדנס ממזגן — נזילת מים (קונדנסציה) מיחידת המזגן הפנימית'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גז', NULL, 'צנרת גז – נזילה או התקנה לקויה — נזילת גז מצנרת הגז הפנימית בדירה, חיבורים לא אטומים, או צנרת שאינה עומדת בדרישות התקן', 'ת"י 158 — מערכת גז פנימית חייבת לעמוד בבדיקת אטימות בלחץ של 60 מיליבר למשך 15 דקות ללא ירידת לחץ.', 'ת"י 158 — מערכת גז פנימית חייבת לעמוד בבדיקת אטימות בלחץ של 60 מיליבר למשך 15 דקות ללא ירידת לחץ.', 'לזמן טכנאי גז מוסמך לתיקון מיידי. אין לבצע תיקונים עצמאיים בצנרת גז. לבצע בדיקת אטימות לאחר התיקון', 1500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת גז – נזילה או התקנה לקויה — נזילת גז מצנרת הגז הפנימית בדירה, חיבורים לא אטומים, או צנרת שאינה עומדת בדרישות התקן'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גז', NULL, 'ברז גז – חסר או לא תקין — ברז ניתוק גז חסר לפני מכשיר צורך גז (תנור, קומקום גז), או שברז קיים אינו סוגר כראוי', 'ת"י 158 — יש להתקין ברז ניתוק נפרד לפני כל מכשיר צורך גז, מסוג שסתום כדורי מאושר.', 'ת"י 158 — יש להתקין ברז ניתוק נפרד לפני כל מכשיר צורך גז, מסוג שסתום כדורי מאושר.', 'להתקין ברז גז תקני לפני כל מכשיר צורך גז, באמצעות טכנאי גז מוסמך', 500, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'ברז גז – חסר או לא תקין — ברז ניתוק גז חסר לפני מכשיר צורך גז (תנור, קומקום גז), או שברז קיים אינו סוגר כראוי'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גז', NULL, 'גז — נזילה או ריח — חשד לנזילת גז — ריח גז או תוצאת בדיקת לחץ לא תקינה', 'תקנות הגז — מערכת גז חייבת להיות אטומה לחלוטין — בדיקת לחץ חובה', 'תקנות הגז — מערכת גז חייבת להיות אטומה לחלוטין — בדיקת לחץ חובה', 'סגירת ברז ראשי, קריאה לטכנאי גז מוסמך מיידית', 800, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'גז — נזילה או ריח — חשד לנזילת גז — ריח גז או תוצאת בדיקת לחץ לא תקינה'
);

INSERT INTO defect_library (organization_id, user_id, source, category, title, description, standard, standard_reference, recommendation, price, is_global, default_severity)
SELECT NULL, NULL, 'system', 'גז', NULL, 'צנרת גז חשופה / לא מוגנת — צנרת גז שחשופה או לא מוגנת בהתאם לתקנות', 'תקנות הגז — צנרת גז חייבת להיות מוגנת ומסומנת', 'תקנות הגז — צנרת גז חייבת להיות מוגנת ומסומנת', 'הגנה על צנרת בהתאם לתקנות', 600, true, 'medium'
WHERE NOT EXISTS (
  SELECT 1 FROM defect_library
  WHERE is_global = true AND source = 'system' AND description = 'צנרת גז חשופה / לא מוגנת — צנרת גז שחשופה או לא מוגנת בהתאם לתקנות'
);

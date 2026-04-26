# Release Notes — inField v1.0.0

---

## Hebrew Version

### What's New in inField 1.0.0

```
🎉 הגרסה הראשונה של inField — אפליקציית ביקורת בנייה מלאה לשוק הישראלי.

✨ תכונות ליבה:
✓ דוחות בדק בית מקצועיים — תיעוד מובנה של ליקויים בנכסים
✓ דוחות מסירה (עם סבבים) — תעוד מלא של תהליך הבדיקה
✓ צילום וביאורים — לכל ליקוי תמונה + הערות ממישירות
✓ סיווג אוטומטי — 338 סוגי ליקויים מסווגים (חוקים בנייה, בטיחות, עיצוב)
✓ חתימה דיגיטלית — חתימה חוקית, בלתי ניתנת לשינוי
✓ ייצא PDF מיד — דוח מעוצב בדקה אחת
✓ שיתוף — שלח via WhatsApp, email, AirDrop

🔒 אבטחה ופרטיות:
✓ הצפנה מלאה (TLS/AES)
✓ עיבוד נתונים רק בישראל + שרתי Supabase
✓ RLS (Row-Level Security) — רק אתה רואה את הדוחות שלך
✓ דיווח שגיאות עם Sentry (לא אישי)

📊 ניתוח וסטטיסטיקות:
✓ ספירת דוחות וליקויים
✓ תקציר פרויקטים ובניינים
✓ עוד סטטיסטיקות טיל בעתיד

🌐 עיבוד ללא אינטרנט:
✓ עבוד בכל מקום — ללא חיבור אינטרנט
✓ נתונים מסונכרנים כשחוזר לאינטרנט
✓ חתימות מלאות בלתי תלויות בחיבור

💰 תמחור ואפשרויות:
✓ חינמי: 3 דוחות לחודש
✓ מקצועי: ₪99 בשנה (דוחות בלתי מוגבלים)
✓ עסקי: ₪199–₪349 בשנה (+ תכניות מותאם)
✓ ביטול מנוי בכל עת דרך הגדרות

🛠️ תכניות בעתיד (Phase 2):
• ניהול צוות (הוסף בודקים נוספים, הגדר הרשאות)
• תכניות משתמש בהתאמה (בחר שדות לדוח)
• שיתוף אחסון קבצים (עם בעלי זכויות)
• אנליטיקה מתקדמת (דוחות ומטרות)

🙏 תודה על השימוש!
זה הדבר הראשון שלנו. אנחנו מקשיבים למשוב שלך.
שלח לנו דוא״ל: support@infield.app

מה שונה מ-0.0.1 (preview):
✓ בדיקה משפטית מלאה של חתימות דיגיטליות
✓ סטטיסטיקות מובנה בעברית ובעברית
✓ עדכונים בטיחות: RLS, הצפנה, תקשורת
✓ ממשק משתמש משופר: כללים טובים יותר, אנימציות חלקות
✓ תיעוד חוקי מלא (Privacy Policy, Terms of Service) — ישראל חוקית
```

---

## English Version

### What's New in inField 1.0.0

```
🎉 inField 1.0.0 — Israel's first native construction inspection app.

✨ Core Features:
✓ Professional inspection reports—structured defect documentation for properties
✓ Delivery reports (with rounds)—complete inspection workflow
✓ Photo + annotations—every defect photographed with on-screen notes
✓ Auto-classification—338 defect types (building codes, safety, design)
✓ Digital signature—legally valid, immutable signature
✓ Instant PDF export—professional report in one minute
✓ Sharing—send via WhatsApp, email, AirDrop

🔒 Security & Privacy:
✓ End-to-end encryption (TLS/AES)
✓ Data processed in Israel + Supabase servers
✓ Row-Level Security (RLS)—only you see your reports
✓ Error reporting with Sentry (non-personally identifiable)

📊 Analytics & Statistics:
✓ Report and defect counts
✓ Project and building summaries
✓ More advanced analytics coming

🌐 Offline-First:
✓ Work anywhere—no internet required
✓ Data syncs when connected
✓ Signatures fully functional offline

💰 Pricing & Options:
✓ Free: 3 reports/month
✓ Professional: ₪99/year (unlimited reports)
✓ Business: ₪199–₪349/year (+ customization)
✓ Cancel anytime from settings

🛠️ Coming in Phase 2:
• Team management (add inspectors, set permissions)
• Custom report templates (choose your fields)
• Shared file storage (with stakeholders)
• Advanced analytics (dashboards & goals)

🙏 Thank You!
This is our first release. We listen to your feedback.
Email us: support@infield.app

What Changed from 0.0.1 (preview):
✓ Full legal review of digital signatures
✓ Built-in statistics (Hebrew + English)
✓ Security updates: RLS, encryption, communication
✓ Improved UI: better affordances, smooth animations
✓ Complete legal documentation (Privacy Policy, Terms of Service) — Israeli compliant
```

---

## Deployment Notes

- **Version:** 1.0.0
- **Build Numbers:**
  - iOS: buildNumber = "1"
  - Android: versionCode = 1
- **Status:** Full Release (Production)
- **Regions:** Israel (primary), International (secondary)
- **Languages:** Hebrew (primary), English (secondary)
- **Minimum OS:**
  - iOS: 14.0+
  - Android: 8.0+ (API 26+)

### Testing Before Release

- [ ] Test on iOS 14, 15, 16, 17 (latest)
- [ ] Test on Android 8, 10, 12, 14 (latest)
- [ ] Verify Hebrew RTL rendering
- [ ] Test digital signature flow end-to-end
- [ ] Test offline report creation
- [ ] Verify PDF export and sharing
- [ ] Confirm all links (Privacy, Terms, Support) working
- [ ] Check push notification permissions
- [ ] Verify App Store screenshots match UI

### Post-Launch

- Monitor crash reports (Sentry)
- Check App Store reviews daily
- Respond to user feedback
- Plan Phase 2 features

# 📋 CHECKLIST SCREEN — Implementation Notes for React Native

> **Purpose:** Functional issues found during mockup audit that MUST be handled in React Native/Expo implementation.
> These items work fine in web mockup but will break or degrade on actual mobile devices.

---

## 🔴 CRITICAL — Will Break in Production

### 1. KeyboardAvoidingView for Defect Textarea

**Problem:** When inspector taps a defective item at the bottom of the screen, the keyboard opens and hides the textarea. Inspector types blind.
**Solution:** Wrap the checklist scroll area in `KeyboardAvoidingView` with `behavior="padding"` (iOS) / `behavior="height"` (Android). When a defect row opens, `scrollToEnd` or `scrollTo` the textarea into view above the keyboard.

```tsx
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  keyboardVerticalOffset={headerHeight}
>
  <ScrollView ref={scrollRef}>{/* rooms + items */}</ScrollView>
</KeyboardAvoidingView>
```

### 2. Dropdown Clipping Inside Bottom Sheet

**Problem:** ComboField dropdowns for category/location in the FAB sheet use `position:absolute`. If the dropdown list is long, it clips against the bottom sheet boundary.
**Solution Options:**

- Use a `Modal` or `Portal` for the dropdown overlay so it renders above the bottom sheet
- Or use a full-screen picker sheet instead of an inline dropdown
- Or use `react-native-bottom-sheet` with `enableDynamicSizing`

### 3. Accordion Height Recalculation

**Problem:** Accordion uses `maxHeight` with a `+500` buffer. When defect rows open/close inside an accordion, the content height changes but the accordion doesn't recalculate.
**Solution:** Use `LayoutAnimation` or `Animated.Value` driven by actual content measurement. In React Native, use `onLayout` to measure inner content and animate to exact height.

```tsx
const onInnerLayout = (event) => {
  const { height } = event.nativeEvent.layout;
  Animated.timing(animatedHeight, {
    toValue: height,
    duration: 300,
    useNativeDriver: false,
  }).start();
};
```

---

## 🟠 IMPORTANT — Will Hurt UX

### 4. ScrollIntoView on Room Open

**Problem:** When inspector opens a room accordion that's partially below the fold, the expanded content is not visible. Inspector must scroll manually.
**Solution:** After accordion animation completes (~300ms), call `scrollTo` on the parent ScrollView to bring the opened room header into view.

```tsx
const openRoom = (roomId) => {
  setOpenRoom(roomId);
  setTimeout(() => {
    roomRefs[roomId]?.measureLayout(scrollViewRef, (x, y) => {
      scrollViewRef.scrollTo({ y: y - 10, animated: true });
    });
  }, 350);
};
```

### 5. ScrollIntoView on Defect Row Open

**Problem:** Same issue — when marking an item as defective, the textarea row appears below the current viewport.
**Solution:** Same pattern as #4. After status change animation, scroll the defect row into view.

### 6. Haptic Feedback on Status Selection

**Problem:** Design System specifies haptic feedback on checklist status changes (תקין/לקוי).
**Solution:** Use `expo-haptics` on every status button press.

```tsx
import * as Haptics from 'expo-haptics';

const onStatus = (key) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  setStatus(key);
};
```

### 7. Swipe Gestures

**Problem:** Product decision: swipe left = תקין, swipe right = opens defect detail. Not implemented in mockup.
**Solution:** Use `react-native-gesture-handler` `Swipeable` or `PanGestureHandler` on each checklist item row.

---

## 🟢 POLISH — Quality Details

### 8. Input Attributes (DONE in mockup)

All inputs/textareas now have:

- `fontSize: 16` — prevents iOS Safari zoom
- `autoComplete="off"` — prevents device autocomplete suggestions
- `spellCheck={false}` — prevents red underline on Hebrew text
- `dir="rtl"` — correct text direction

In React Native these translate to:

```tsx
<TextInput
  style={{ fontSize: 16 }}
  autoCorrect={false}
  autoComplete="off"
  spellCheck={false}
  textAlign="right"
/>
```

### 9. First-Time Hints

**Problem:** Design System requires "לחץ לסימון" hint on first item, shown once and dismissed.
**Solution:** Store `hasSeenChecklistHint` in AsyncStorage. Show animated hint on first load only.

### 10. Skeleton Loading (DONE in mockup)

Skeleton shimmer animation is in the mockup. In React Native, use `expo-linear-gradient` or `react-native-skeleton-placeholder` for native performance.

### 11. Safe Area (DONE in mockup)

Footer uses `env(safe-area-inset-bottom)`. In React Native, use `useSafeAreaInsets()` from `react-native-safe-area-context`.

```tsx
const insets = useSafeAreaInsets();
<View style={{ paddingBottom: Math.max(24, insets.bottom) }}>
```

### 12. Bath Type Persistence

The מקלחון/אמבטיה selection per bathroom room is stored in component state. In production, this must persist to the report data model so it survives app restart.

---

## 📐 Design Decisions Locked in Mockup

| Decision               | Value                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Room header style      | Full `g50` background + 4px solid `g500` bar (Option A)                                                             |
| Room badge             | Dynamic count — shows total items initially, switches to checked count with color (green if all ok, red if defects) |
| Counter in report card | `fontSize:18` per Design System v6                                                                                  |
| Footer buttons         | 3 buttons: "הוסף ליקוי" + camera + search (v6)                                                                      |
| Backgrounds            | `cr50` everywhere, no `#fff`                                                                                        |
| Shadows                | `rgba(60,54,42)` warm tint per Design System                                                                        |
| FAB sheet height       | `85vh` fixed height                                                                                                 |
| FAB fields             | Category (ComboField) + Location (ComboField) + Description (textarea) + Camera                                     |
| Both ComboFields       | Same visual style, both with "+ הוסף" option for new items                                                          |
| Defect row             | Only one open at a time, others collapse to text preview                                                            |
| Defect save button     | Full-width button in status color, closes the row                                                                   |
| Status colors          | ✓ ok `#1B7A44`, ✗ defect `#b91c1c`, ~ partial `#92600a`, — skip `n400`                                              |
| Exit animations        | Menu: slideOutRight + fadeOut. Search: slideDown + fadeOut. FAB: slideDown + fadeOut                                |
| Staggered entrance     | 60ms delay per room                                                                                                 |

---

## 🔧 ADMIN SETTINGS — Checklist Management

### Editable Lists via Settings Screen

The system admin (or inspector with admin role) can manage all checklist data from the **settings screen**:

### Categories (קטגוריות בעלי מקצוע)

| Feature             | Details                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| View all categories | List: אינסטלציה, חשמל, אלומיניום, ריצוף, טיח וצבע, איטום, נגרות, כללי                  |
| Add category        | Free text, becomes available in all new reports                                        |
| Rename category     | Updates display name. Existing reports NOT affected (snapshot rule)                    |
| Delete category     | Soft delete. Blocked if used in active drafts. Existing completed reports NOT affected |
| Reorder categories  | Drag to reorder display order in dropdowns                                             |

### Locations (מיקומים/חדרים)

| Feature            | Details                                                               |
| ------------------ | --------------------------------------------------------------------- |
| View all locations | List per apartment template (see below)                               |
| Add location       | Becomes available in checklist + FAB location dropdown                |
| Rename location    | Updates display name. Existing reports NOT affected                   |
| Delete location    | Blocked if has checklist items under it. Must move/delete items first |
| Reorder locations  | Drag to reorder — controls physical walkthrough order                 |

### Checklist Items (סעיפי בדיקה)

| Feature                     | Details                                                            |
| --------------------------- | ------------------------------------------------------------------ |
| View items per location     | Grouped by room, shows question text                               |
| Add item to room            | Free text question, optional: conditional parent, bath type filter |
| Edit item text              | Updates for future reports only. Existing reports NOT affected     |
| Delete item                 | Removes from future reports. Existing reports NOT affected         |
| Reorder items within room   | Drag to reorder                                                    |
| Move item to different room | Changes room assignment                                            |

### Data Model Impact

```typescript
// Settings tables (editable by admin)
interface ChecklistTemplate {
  id: string;
  apartmentTypeId: string; // links to apartment template
  roomId: string;
  question: string;
  order: number;
  parentItemId?: string; // for conditional items
  bathType?: 'shower' | 'bath';
  isActive: boolean; // soft delete
  createdAt: string;
  updatedAt: string;
}

interface ProfessionalCategory {
  id: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface RoomTemplate {
  id: string;
  apartmentTypeId: string;
  name: string;
  order: number;
  isActive: boolean;
  createdAt: string;
}
```

### Report Integrity Rule (Iron Rule applies)

> **שינוי בהגדרות לעולם לא משנה דוח קיים.**
> When a report is created, the system takes a SNAPSHOT of the current template.
> All subsequent edits to templates affect only NEW reports.

---

## 🏠 APARTMENT TEMPLATES — Preset Configurations

### Template Types

Each apartment type comes with a default set of rooms and checklist items:

| Template             | Default Rooms                                                                                         | Notes                 |
| -------------------- | ----------------------------------------------------------------------------------------------------- | --------------------- |
| **דירת 3 חדרים**     | מבואה, מסדרון, סלון, מטבח, חדר שינה הורים, חדר שינה, ממ"ד, חדר רחצה, שירותי אורחים, מרפסת, חניה, מחסן | Standard              |
| **דירת 4 חדרים**     | Same as 3 + חדר שינה נוסף                                                                             | Extra bedroom         |
| **דירת 5 חדרים**     | Same as 4 + חדר שינה נוסף + חדר רחצה נוסף                                                             | Two extra rooms       |
| **דירת גן**          | Same as relevant size + גינה, מחסן גינה, ברז חיצוני                                                   | Garden-specific items |
| **בית קרקע / קוטג'** | מבואה, סלון, מטבח, חדרי שינה ×3-4, ממ"ד, חדרי רחצה ×2, חדר כביסה, מרפסת, גינה, חניה, מחסן, גג/עלייה   | Full house            |
| **מותאם אישית**      | ריק — המפקח בונה מאפס                                                                                 | See "free form" below |

### Template Flow

```
יצירת דוח חדש
  ├── בחר סוג נכס:
  │     דירת 3 חדרים | 4 חדרים | 5 חדרים | דירת גן | בית קרקע | מותאם אישית
  │
  ├── Template loads default rooms + items
  │
  ├── Inspector can CUSTOMIZE before starting:
  │     ✅ Add rooms (from master list or free text)
  │     ✅ Remove rooms (swipe delete)
  │     ✅ Add items to any room
  │     ✅ Remove items (swipe delete)
  │     ❌ Cannot edit system template items text (locked)
  │     ✅ Can add own items with own text
  │
  └── Start inspection → snapshot taken → template changes no longer affect this report
```

### Admin Can Edit Templates

From settings, admin can:

- Create new apartment type template
- Edit existing template (add/remove/reorder rooms and items)
- Duplicate template as starting point for new type
- Set default template for new reports

### Data Model

```typescript
interface ApartmentType {
  id: string;
  name: string; // "דירת 3 חדרים"
  description?: string;
  isSystem: boolean; // system templates are locked
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// When report is created, system copies template into report-specific data
interface ReportChecklist {
  id: string;
  reportId: string;
  apartmentTypeId: string; // which template was used (reference only)
  rooms: ReportRoom[]; // SNAPSHOT — independent copy
  createdAt: string;
}

interface ReportRoom {
  id: string;
  reportChecklistId: string;
  name: string;
  order: number;
  items: ReportChecklistItem[];
}

interface ReportChecklistItem {
  id: string;
  roomId: string;
  question: string;
  status: 'ok' | 'defect' | 'partial' | 'skip' | null;
  defectText?: string;
  defectPhotos?: string[];
  defectCategory?: string; // professional category for defect routing
  order: number;
  parentItemId?: string;
  bathType?: 'shower' | 'bath';
}
```

---

## 📝 FREE-FORM MODE — Clean Protocol

### Use Case

Inspector arrives at an apartment and wants to do a handover protocol **without a pre-built checklist**. Just walk through with the tenant and note defects as they find them. No rooms, no items, no checkmarks — just a clean sheet.

### How It Works

```
יצירת דוח חדש
  ├── בחר סוג נכס: "מותאם אישית"
  │
  └── Opens EMPTY checklist screen:
        - No rooms loaded
        - Header shows report details
        - Footer: "הוסף ליקוי" button (same FAB as regular mode)
        - Screen shows empty state: "אין ליקויים עדיין. הוסף ליקוי ראשון"

Adding defects:
  ├── Tap "הוסף ליקוי"
  │     → FAB sheet opens (same as regular mode)
  │     → Select category (בעל מקצוע)
  │     → Select/add location (חדר)
  │     → Describe defect
  │     → Camera
  │     → Save
  │
  └── Defects appear on screen grouped by location (room)
        → Rooms are created dynamically as defects are added
        → Each room section shows its defects as a list
        → Inspector can tap any defect to edit
```

### Visual Difference from Checklist Mode

| Element         | Checklist Mode                       | Free-Form Mode                                        |
| --------------- | ------------------------------------ | ----------------------------------------------------- |
| Room headers    | Pre-loaded with items                | Created dynamically when first defect added to a room |
| Checklist items | Questions with ✓/✗/~/—               | Not shown — no pre-built questions                    |
| Room content    | Checklist items + defect detail rows | Only defect cards (like bedek bayit style)            |
| Progress bar    | Shows X/Y items checked              | Shows total defects count per room                    |
| Badge on room   | Item count → checked count           | Defect count                                          |
| Empty room      | Shows checklist items to check       | Cannot exist (room only appears when it has defects)  |

### PDF Output

Both modes produce the **same PDF structure**:

1. Page 1: Details + checklist summary (free-form shows only defective items, no ✓ items since none were checked)
2. Defect pages: By profession, with photos
3. Last page: Summary + signatures

### Data Model

Same `ReportChecklist` structure, but:

- `rooms` array starts empty
- Rooms are added dynamically when first defect in that room is created
- No `ReportChecklistItem` records with status — only defect records
- Report has a flag: `mode: 'checklist' | 'freeform'`

```typescript
interface Report {
  // ... existing fields ...
  checklistMode: 'checklist' | 'freeform';
  apartmentTypeId?: string; // null for freeform
}
```

---

## 🏗️ PROJECT HIERARCHY — Full Flow

### Data Structure

```
פרויקט (Project)
  ├── שם: "גני השרון"
  ├── כתובת, עיר, קבלן
  │
  ├── בניין A
  │     ├── דירה 1  →  [דייר: —]  [חדרים: —]  [פרוטוקולים: 0]
  │     ├── דירה 2  →  [דייר: —]  [חדרים: —]  [פרוטוקולים: 0]
  │     ├── דירה 3  →  [דייר: כהן]  [חדרים: 4]  [פרוטוקולים: 1 טיוטה]
  │     └── ...
  │
  ├── בניין B
  │     ├── דירה 1  →  ...
  │     └── ...
  │
  └── בניין C
        └── ...
```

### Data Models

```typescript
interface Project {
  id: string;
  businessId: string; // tenant isolation
  name: string; // "גני השרון"
  address?: string;
  city?: string;
  contractor?: string; // שם הקבלן
  contactPerson?: string;
  contactPhone?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface Building {
  id: string;
  projectId: string;
  name: string; // "A", "B", "1", "מגדל צפון"
  order: number;
  createdAt: string;
}

interface Apartment {
  id: string;
  buildingId: string;
  number: string; // "12", "3א"
  floor?: number;
  apartmentTypeId?: string; // null = לא הוגדר, filled = 3/4/5 rooms etc.
  tenantName?: string;
  tenantPhone?: string;
  tenantId?: string; // ת.ז.
  tenantEmail?: string;
  status: 'pending' | 'in_progress' | 'completed';
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Flow 1: Project Setup (Admin/Manager)

```
הקמת פרויקט חדש
  │
  ├── פרטי פרויקט: שם, כתובת, קבלן
  │
  ├── הוספת בניינים:
  │     [+ הוסף בניין]  →  שם בניין (A / B / 1 / מגדל צפון)
  │
  ├── הוספת דירות לכל בניין:
  │     [+ הוסף דירות]  →  מספרים: 1-20 (טווח) או ידני
  │     כל דירה נוצרת עם: מספר, קומה (אופציונלי)
  │     סוג דירה + פרטי דייר = ריק (ברירת מחדל)
  │
  └── (אופציונלי) הגדרות מתקדמות בפרויקט:
        → הזנת סוג דירה (חדרים) למספרי דירות ספציפיים
        → למשל: דירות 1-8 = 4 חדרים, דירות 9-12 = 5 חדרים, דירות 13-16 = 3 חדרים
        → הזנה בטבלה או bulk edit
```

### Flow 2: Starting a Protocol (Inspector)

```
מפקח נכנס לפרויקט
  │
  ├── רואה רשימת בניינים
  │     → בוחר בניין A
  │
  ├── רואה רשימת דירות
  │     → כל דירה מציגה: מספר, קומה, דייר (אם הוזן), סטטוס
  │     → בוחר דירה 12
  │
  ├── מסך דירה:
  │     → רואה פרוטוקולים קיימים (אם יש)
  │     → לוחץ [+ פרוטוקול מסירה חדש]
  │
  ├── מסך "פרטי פרוטוקול" (טופס קצר):
  │     ┌─────────────────────────────────────┐
  │     │  פרטי דייר                           │
  │     │  שם: [_______________] *             │
  │     │  טלפון: [_______________]            │
  │     │  ת.ז.: [_______________]             │
  │     │  אימייל: [_______________]           │
  │     │                                     │
  │     │  פרטי דירה                           │
  │     │  סוג דירה: [3 חדרים ▾] *            │
  │     │    (3 | 4 | 5 | דירת גן |           │
  │     │     בית קרקע | מותאם אישית)          │
  │     │                                     │
  │     │  הערות: [_______________]            │
  │     │                                     │
  │     │  [התחל פרוטוקול]                     │
  │     └─────────────────────────────────────┘
  │
  │     → אם סוג דירה כבר הוגדר בהגדרות הפרויקט
  │       → השדה מגיע pre-filled (אבל ניתן לשינוי)
  │     → אם לא הוגדר → המפקח בוחר עכשיו
  │     → פרטי דייר נשמרים גם ברמת הדירה (Apartment)
  │       לשימוש חוזר בפרוטוקולים עתידיים
  │
  ├── לחיצה על "התחל פרוטוקול":
  │     → מערכת טוענת את תבנית הצ'קליסט לפי סוג הדירה
  │     → SNAPSHOT נלקח — שינויים בתבנית לא ישפיעו
  │     → דוח נוצר בסטטוס "טיוטה"
  │
  └── מסך הצ'קליסט (מה שבנינו) נפתח
```

### Flow 3: Pre-filled vs Manual

| Scenario                   | מה קורה                                            |
| -------------------------- | -------------------------------------------------- |
| **סוג דירה הוגדר בפרויקט** | השדה "סוג דירה" מגיע מלא, המפקח יכול לשנות אם צריך |
| **סוג דירה לא הוגדר**      | השדה ריק, המפקח חייב לבחור לפני "התחל פרוטוקול"    |
| **פרטי דייר מוזנים מקודם** | השדות מגיעים מלאים מרמת ה-Apartment                |
| **פרטי דייר ריקים**        | המפקח ממלא עכשיו, נשמר גם ב-Apartment לפעם הבאה    |
| **"מותאם אישית" נבחר**     | צ'קליסט ריק נפתח — מצב Free-Form                   |

### Multiple Protocols per Apartment

דירה יכולה לקבל יותר מפרוטוקול אחד:

- **פרוטוקול מסירה ראשון** — מסירת מפתח
- **פרוטוקול תיקונים** — אחרי שהקבלן תיקן, בדיקה חוזרת
- **פרוטוקול שנה** — בדק שנה

כל פרוטוקול הוא דוח עצמאי עם snapshot משלו.

### Project Settings Screen (Admin)

```
הגדרות פרויקט
  │
  ├── פרטי פרויקט (שם, כתובת, קבלן)
  │
  ├── בניינים ודירות
  │     → הוסף/מחק בניינים
  │     → הוסף/מחק דירות
  │     → הזנת סוגי דירות (bulk):
  │       ┌──────────────────────────────┐
  │       │  בניין A                     │
  │       │  דירה 1-8:   [4 חדרים ▾]    │
  │       │  דירה 9-12:  [5 חדרים ▾]    │
  │       │  דירה 13-16: [3 חדרים ▾]    │
  │       │  [+ הוסף טווח]              │
  │       └──────────────────────────────┘
  │
  ├── קטגוריות בעלי מקצוע
  │     → הוסף/מחק/שנה סדר
  │
  ├── תבניות צ'קליסט
  │     → ערוך חדרים ופריטים לכל סוג דירה
  │
  └── צוות
        → הוסף מפקחים לפרויקט
```

---

## 🔮 Not Yet Built (Documented for Next Phase)

1. **Pre-close summary screen** — Shows all skipped items before report generation. Inspector can mark ok, mark defect, or remove from report.
2. **Notes field** — Free text at end of report.
3. **Camera flow** — Full camera overlay with shutter, review grid, "צלם עוד" / "הוסף ממצא".
4. **Conditional questions** — Kitchen sub-items (שיש, חיפוי) only visible when "מטבח מותקן" = ok. ✅ Logic exists in mockup.
5. **Bathroom radio** — מקלחון/אמבטיה toggle. ✅ Exists in mockup.

---

## 📄 PROTOCOL MESIRA — Unique Features (from PRD v2)

> Content below is from the original Product Requirements Document.
> Not yet built — documented here for when these features are implemented.

### Skip → Not Relevant Logic

בסיום הצ'קליסט, המערכת מחזירה אוטומטית את המפקח לכל הפריטים שדולגו. רק בשלב הזה מופיע כפתור "לא רלוונטי" עם אישור כפול (לחיצה + אישור). מונע שימוש עצלני.

### Mandatory Summary Screen

לפני הפקת דוח, המערכת מציגה סיכום:

- כמה תקין, כמה לא תקין, כמה דילוגים פתוחים
- דילוגים פתוחים **חוסמים** הפקת דוח
- כפתור "קח אותי לפריטים החסרים"

### Second Handover (מסירה שנייה)

כפתור "צור מסירה שנייה" על דוח מסירה ראשונית קיים:

- המערכת משכפלת את הדוח
- מוסיפה עמודת סטטוס לכל ממצא: תוקן / לא תוקן / תוקן חלקית
- מאפשרת הוספת ממצאים חדשים

### Key Handover (קבלת מפתחות)

במסירה שנייה — סקציה לקבלת מפתחות:

- פירוט כמות וסוג: מפתחות דירה, ת.דואר, שלט חניה, שלט כניסה, קוד, מחסן
- הדייר חותם על הכמות שקיבל

### Tenant ID Photo (צילום ת.ז. דייר)

בשלב מילוי פרטים, כפתור מצלמה לצילום ת.ז. שמצורף לדוח.

### Document Attachments (צירוף מסמכים)

אפשרות לצרף: תוכניות שינויים, חשבוניות שדרוגים, מפרטים טכניים.

### Digital Signatures (חתימה דיגיטלית)

חתימת דייר ומפקח על המסך + הערות דייר בכתב יד.

### Legal Text (טקסט משפטי)

פסקה קבועה על חוק המכר (דירות) תשל"ג-1973:

- תקופות בדק ואחריות
- אחריות הקבלן
- מופיעה בעמוד האחרון של כל דוח פרוטוקול

### Branded Report (דוח ממותג)

הדוח הסופי כולל: לוגו חברה יזמית, מילות סיכום, חותמת/חתימת המפקח.

### PDF Structure — Protocol Mesira

- עמוד ראשון: שליש עליון פרטי דירה + דייר + ת.ז. (קומפקטי), אח"כ טבלת צ'קליסט ב-2 עמודות לפי בעלי מקצוע עם סימונים (✓/✗/~)
- עמודים הבאים: ממצאים לפי בעלי מקצוע — שורה עליונה (מספור + תיאור + מיקום), תמונות מתחת (עד 4 בגודל אחיד)
- עמוד אחרון: סיכום, קבלת מפתחות (במסירה שנייה), הערות דייר, טקסט משפטי, חתימות, חותמת חברה

### PDF Structure — Bedek Bayit

- עמוד שער: לוגו מפקח, סוג בדיקה, פרטי נכס + מזמין + מפקח
- עמוד פרטים: פרטי מפקח (שם, מ.ר., השכלה, ניסיון), תנאי בדיקה, כלים
- עמודי ממצאים: לפי קטגוריות עם ציטוט תקן ישראלי + המלצה + עלות + תמונות
- עמוד עלויות: טבלת כתב כמויות (מספור, תיאור, עלות, סה"כ + מע"מ), סיכום, חתימה + חותמת + מ.ר.

---

_Document version: 1.1 | Updated: March 2026 | Merged PRD v2 unique content_
_Reference: DocField-Checklist-FINAL.jsx_

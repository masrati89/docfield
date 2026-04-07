# 🎨 DESIGN SYSTEM — inField

> **Load when:** Before ANY UI task — component building, screen design, PDF layout, styling.
> This is the single source of truth for all visual and interaction decisions.

---

## 1. COLOR PALETTE

### Primary — Forest Green

| Token  | Hex       | Usage                                               |
| ------ | --------- | --------------------------------------------------- |
| `g50`  | `#F0F7F4` | Tinted backgrounds, hover states, subtle fills      |
| `g100` | `#D1E7DD` | Borders on active green elements                    |
| `g200` | `#A3D1B5` | Active input borders, dashed borders                |
| `g300` | `#6DB88C` | —                                                   |
| `g500` | `#1B7A44` | **Primary** — buttons, icons, active states, badges |
| `g600` | `#14643A` | Button hover, gradient end                          |
| `g700` | `#0F4F2E` | Header gradient start, dark text on green           |

### Cream (Background)

| Token   | Hex       | Usage                                           |
| ------- | --------- | ----------------------------------------------- |
| `cr50`  | `#FEFDFB` | **Main background** — replaces white EVERYWHERE |
| `cr100` | `#FBF8F3` | Input backgrounds, search bars, subtle surfaces |
| `cr200` | `#F5EFE6` | Borders, dividers, separators                   |
| `cr300` | `#EBE1D3` | Scrollbar, handle bars, inactive chip borders   |

### Gold (Accent)

| Token   | Hex       | Usage                                          |
| ------- | --------- | ---------------------------------------------- |
| `go100` | `#FDF4E7` | Cost total background, "from library" badge bg |
| `go300` | `#F0C66B` | —                                              |
| `go500` | `#C8952E` | Gold accent text                               |
| `go700` | `#8B6514` | Cost values, library badge text                |

### Neutral

| Token  | Hex       | Usage                                       |
| ------ | --------- | ------------------------------------------- |
| `n300` | `#D1CEC8` | Grip handles, disabled icons                |
| `n400` | `#A8A49D` | Placeholder text, secondary icons, captions |
| `n500` | `#7A766F` | Secondary text, inactive tabs               |
| `n600` | `#5C5852` | Body text                                   |
| `n700` | `#3D3A36` | Headings, emphasis text                     |
| `n800` | `#252420` | Primary text, titles                        |

### Status

| Token     | Hex       | Usage                                                  |
| --------- | --------- | ------------------------------------------------------ |
| `sR`      | `#EF4444` | Error, delete, required asterisk                       |
| `sG`      | `#10B981` | Success, synced status                                 |
| `clRed`   | `#b91c1c` | Checklist: לא תקין (defect red — darker, professional) |
| `clAmber` | `#92600a` | Checklist: תקין חלקית (amber)                          |

**Note:** `sR` (#EF4444) is for app-level errors/delete. `clRed` (#b91c1c) is for checklist defect status only. Different contexts, different reds.

### Rules

- ❌ **אין רקע לבן** — רק `cr50` (#FEFDFB)
- ❌ **אין borders אפורים** — רק `cr200` (#F5EFE6)
- ✅ צללים חמים: `rgba(60,54,42,...)` — לא `rgba(0,0,0,...)`
- ✅ כל הדוחות והאפליקציה משתמשים באותו `g500` (#1B7A44) כ-accent

---

## 2. TYPOGRAPHY

### Font Stack

```css
font-family: 'Rubik', 'Heebo', 'Assistant', system-ui, sans-serif;
```

- **עברית:** Rubik (Regular 400, Medium 500, SemiBold 600, Bold 700)
- **אנגלית:** Inter

### Font Scale (App)

| Role          | Size | Weight  | Token                                 |
| ------------- | ---- | ------- | ------------------------------------- |
| Display       | 32px | 700     | —                                     |
| Page Title    | 24px | 700     | —                                     |
| Section Title | 20px | 700     | —                                     |
| Card Title    | 18px | 700     | Header brand name                     |
| Subtitle      | 14px | 600     | Card titles, form section headers     |
| Body          | 15px | 400     | General text                          |
| Input Text    | 16px | 400     | **Must be 16px to prevent iOS zoom**  |
| Body Small    | 13px | 500     | Category names, defect titles in list |
| Caption       | 12px | 400-500 | Metadata, counters, tab labels        |
| Micro         | 10px | 400-500 | Badges, photo counts, secondary info  |

### Font Scale in Mockup

Sizes used in mockups: `10, 12, 13, 14, 18`

### Font Scale (PDF Reports)

| Role              | Size                     |
| ----------------- | ------------------------ |
| Cover title       | 22px                     |
| Section header    | 10px bold                |
| Category subtitle | 10px bold (accent color) |
| Defect title      | 9px semibold             |
| Body text         | 8px                      |
| Caption/meta      | 7-7.5px                  |
| Legal text        | 6.5px                    |
| Footer            | 7px                      |

---

## 3. SPACING

### Scale

`4, 8, 12, 16, 24`

All spacing (padding, margin, gap) uses only these values.

### Application

| Context                  | Spacing |
| ------------------------ | ------- |
| Inline gap (icon + text) | 4px     |
| Between items in list    | 8px     |
| Form field margin-bottom | 12px    |
| Section padding          | 16px    |
| Large section gaps       | 24px    |

---

## 4. TOUCH TARGETS & SIZING

| Element            | Min Height |
| ------------------ | ---------- |
| Buttons (standard) | 36px       |
| Footer buttons     | 44px       |
| Save/CTA button    | 46-48px    |
| Thumbnail photos   | 64×64px    |

---

## 5. BORDER RADIUS

| Element                        | Radius  |
| ------------------------------ | ------- |
| Small elements (badges, chips) | 5-6px   |
| Cards                          | 8-10px  |
| Main card                      | 12px    |
| Interactive buttons            | 10px+   |
| Chip/pill buttons              | 16-20px |
| Bottom sheet top corners       | 16px    |

---

## 6. SHADOWS (Warm, Cream-Tinted)

```javascript
const shadow = {
  sm: '0 1px 3px rgba(60,54,42,.06)', // Cards, list items
  md: '0 2px 8px rgba(60,54,42,.08)', // Dropdowns, elevated surfaces
  lg: '0 4px 16px rgba(60,54,42,.10)', // Modals
  up: '0 -4px 20px rgba(60,54,42,.12)', // Bottom sheets, footer
};
```

**Rule:** Never use `rgba(0,0,0,...)` for shadows.

---

## 7. ANIMATION & INTERACTION

### Animation Types (CSS — for web/PDF)

| Animation               | CSS                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| Fade in                 | `@keyframes fadeIn { from{opacity:0} to{opacity:1} }` — 0.2s ease                                             |
| Slide up (bottom sheet) | `@keyframes slideUp { from{transform:translateY(100%)} to{translateY(0)} }` — 0.35s cubic-bezier(.22,1,.36,1) |
| Slide in right (menu)   | `@keyframes slideInRight { from{transform:translateX(100%)} to{translateX(0)} }` — 0.3s ease                  |
| Accordion               | `max-height` transition — 0.3s ease                                                                           |
| Hover scale             | `transform: scale(1.02)` — 0.1s                                                                               |

### React Native Animation Patterns (react-native-reanimated)

**These are the actual implementations used in the mobile app. Use these exact patterns.**

| Pattern                 | Reanimated Code                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Accordion content open  | `<Animated.View entering={FadeInDown.duration(250)}>`                                                              |
| Accordion content close | `<Animated.View exiting={FadeOutUp.duration(200)}>`                                                                |
| List item stagger       | `<Animated.View entering={FadeInUp.delay(60 * index).duration(200)}>`                                              |
| Section stagger         | Header: `FadeInDown.duration(200)`, Search: `.delay(50)`, Chips: `.delay(100)`                                     |
| Chevron rotation        | `useAnimatedStyle(() => ({ transform: [{ rotate: withTiming(isOpen ? '180deg' : '0deg', { duration: 200 }) }] }))` |
| Progress bar fill       | `withTiming(targetWidth, { duration: 600, easing: Easing.bezier(.25,.1,.25,1) })`                                  |
| Counter number          | `useSharedValue(0)` + `withTiming(target)` + `useAnimatedReaction` + `runOnJS(setDisplayValue)`                    |
| Press feedback          | `withSpring(0.98)` on press in, `withSpring(1)` on press out                                                       |
| FAB press               | `withSpring(0.92)` scale + `Haptics.impactAsync(Light)`                                                            |

### Design Principles

- ✅ **Spring animations** (withSpring / cubic-bezier) — לא linear/ease
- ✅ **Skeleton loading** — לא spinners (use SkeletonBlock component)
- ✅ **Haptic feedback** — `Haptics.impactAsync(Light)` על כל אלמנט אינטראקטיבי
- ✅ **Staggered entrance animations** — `FadeInUp.delay(60 * index)` בכל רשימה
- ✅ **Accordion animation** — `FadeInDown` / `FadeOutUp` + chevron rotation
- ✅ **Press scale** — `scale(0.98)` spring על כל Pressable
- ✅ **Progress animation** — withTiming עם bezier easing על כל progress bar
- ✅ **First-time hints** — "החלק שמאלה" מופיע פעם אחת ונעלם

### Icon Size Guide (Feather icons)

| Context                                | Size    | Example                              |
| -------------------------------------- | ------- | ------------------------------------ |
| Inline metadata (next to 10-12px text) | 10-12px | clock, map-pin, camera in list items |
| Inline labels (next to 13-14px text)   | 14px    | chevron in rows, status icons        |
| Toolbar / action buttons               | 20px    | edit, share, download in headers     |
| Header icons                           | 20-24px | bell, menu, back arrow               |
| Tab bar                                | 22px    | home, file-text, folder, settings    |
| FAB                                    | 24px    | plus icon                            |
| Empty state                            | 48-64px | illustration icon                    |

**Rule:** Icon size must MATCH the font size of adjacent text. Never use 16px icons next to 10px text.

---

## 8. COMPONENTS

### Bottom Sheet

- Height: 92vh (leaves thin strip of background visible)
- Handle bar: 36×4px, `cr300`, centered, 8px top padding
- Top corners: 16px radius
- Shadow: `shadow.up`
- Animation: `slideUp` with spring curve

### ComboField (Universal Search+Select+Edit)

Used for: קטגוריה, ממצא, מיקום, תקן, המלצה

**Behavior:**

1. Click/focus → opens dropdown with full list below
2. Type → filters list by keyword/prefix match
3. Select from list → fills field as editable text
4. Continue typing → free text, user can write anything
5. No results → shows `+ הוסף למאגר` button immediately (no "no results" message)

**Visual:**

- Clean textarea input (no search icon)
- X button to clear (top-right)
- Active state: top corners rounded, bottom corners square (connected to dropdown)
- Border: `g500` when active, `g200` when filled, `cr300` when empty
- Dropdown: max-height 200-240px, scrollable, connected border
- Filled state: green checkmark (✓) next to label

**Textarea behavior:**

- Auto-grows with content (min 1 row, max ~80px)
- Supports line breaks (Enter key)
- Text wraps naturally

### Category Dropdown

- Same as ComboField
- Additional: `+ הוסף קטגוריה "[name]"` when typing new category not in list
- New category gets added to the list dynamically

### Standard (תקן) Dropdown

- Grouped by standard number (e.g., ת"י 1205.1)
- Group header: compact single line with green bar left + green text
- Sections: 2 lines each — code+title (bold) + description (gray)
- Search filters both headers and section content

### Location Dropdown

- Simple flat list of locations
- Free text accepted (not limited to list)

### Cost Field

- Unit selector: chips row — סכום | מ"ר | מ"א | יח' | ימים
- Fixed: single `₪` input
- Unit-based: quantity × price per unit = total (calculated, shown in gold bar)
- Numeric keyboard on mobile (`inputMode="numeric"`)

### Photo Grid

- 64×64px thumbnails
- X button for delete (red circle, top-right, overlapping)
- Single "הוסף תמונה" button (dashed green border, g50 background)
- Wraps to multiple rows

### Toast Notification

- Position: Bottom of screen, above footer
- Duration: 3 seconds, auto-dismiss
- Background:
  - Success: `g500` (#1B7A44) with white text + ✓ icon
  - Error: `clRed` (#b91c1c) with white text + ✗ icon
- Animation: Slide up + fade in / slide down + fade out
- Shadow: `shadow.md`
- Border-radius: 10px
- Min height: 44px
- Font: 13px, weight 500

### Confirmation Dialog

```
┌──────────────────────────────┐
│  [Title]                     │
│  [Description]               │
│                              │
│  [ביטול]          [Action]   │
└──────────────────────────────┘
```

- Background: `cr50`
- Border-radius: 16px (top corners if bottom sheet), 12px (if centered modal)
- Shadow: `shadow.lg`
- Backdrop: `rgba(0,0,0,.4)`
- Buttons:
  - ביטול — always on right (RTL primary position), outline style
  - Destructive action — `clRed` background, white text
  - Non-destructive action — `g500` background, white text
- Animation: fadeIn backdrop + slideUp sheet

### Bottom Tab Bar

- Position: fixed bottom, full width
- Background: `rgba(254,253,251,.92)` with `backdrop-filter: blur(16px)`
- Border-top: `1px solid cr200`
- Padding: `6px 8px 22px` (22px = safe area bottom)
- 4 tabs RTL order: בית | דוחות | פרויקטים | הגדרות
- Tab structure: icon (22px Feather) + label (10px Rubik)
- Active state: `g500` color, fontWeight 600, green dot (4×4px) below label
- Inactive state: `n400` color, fontWeight 400
- Badge (on דוחות tab): red circle (`sR`), 14px diameter, white text 8px bold

### Filter Chips (Status)

- Height: 36px (touch target compliant)
- Border-radius: 10px
- Active: background `g50`, border `g200`, color `g700`, weight 600
- Inactive: background transparent, border `cr200`, color `n500`, weight 400
- Transition: `all 0.15s ease`

### Sort/Filter Button

- Size: 36×36px, border-radius 10px
- Default: background `cr50`, border `cr200`, icon `n500`
- Active (has filters): background `g50`, border `g200`, icon `g500`
- Indicator: green dot (8px) top-right when filters active
- Icon: sliders (Feather)

### Sort/Filter Bottom Sheet

- Height: auto (content-based, not 92vh)
- Handle: standard (36×4px, `cr300`)
- Header: title centered, X button right (RTL), "איפוס" link left (RTL)
- Options: full-width rows, 44px min-height, label right, checkmark left (`g500`)
- CTA: "החל" button, `g500`, 46px, full width, radius 12px
- Animation IN: `slideUp 0.35s cubic-bezier(.22,1,.36,1)`
- Animation OUT: `slideDown 0.25s ease` (exit before unmount)
- Backdrop: `rgba(0,0,0,.4)`, z-index 150

### Active Filter Tags

- Min-height: 36px (touch target)
- Border-radius: 10px
- Type filter tag: background `go100`, color `go700`, with ✕ to remove
- Sort tag: background `cr100`, border `cr200`, color `n600`

### FAB (Floating Action Button)

- Position: absolute bottom 80px (with tab bar) or 28px (without), left 16px (RTL: visual right)
- Size: 48×48px, borderRadius: 24 (perfect circle)
- Background: `g500` (#1B7A44)
- Shadow: `0 4px 16px rgba(27,122,68,.3)` — green-tinted, NOT generic gray
- Icon: Feather "plus", 24px, white
- Press: `scale(0.92)` spring + `Haptics.impactAsync(Light)`
- z-index: 25

**React Native implementation:**

```typescript
<Pressable style={{
  position: 'absolute', bottom: 80, left: 16,
  width: 48, height: 48, borderRadius: 24,
  backgroundColor: '#1B7A44',
  alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 4px 16px rgba(27,122,68,.3)',
  zIndex: 25,
}}>
  <Feather name="plus" size={24} color="white" />
</Pressable>
```

### Search Bar

- Height: 38px
- Background: `cr100`, border `1px solid cr200`, radius 10px
- Input: fontSize **16px** (iOS zoom prevention), Rubik, `n800`, dir="rtl"
- Attributes: `autoComplete="off"`, `spellCheck={false}`
- Search icon: 16px, `n400`
- Clear button: X circle, appears when value not empty

---

## 9. FORM LOGIC — הוספת ממצא

### Field Order

```
1. קטגוריה (required)    — icon: grid (4 squares)
2. תיאור ממצא (required) — icon: alert-triangle
3. מיקום                 — icon: map-pin
4. תקן ישראלי            — icon: book
── separator (optional fields below) ──
5. המלצה לתיקון          — icon: wrench/tool
6. עלות תיקון            — icon: calculator
7. הערות                 — icon: message-square
8. תמונות                — icon: camera
9. נספח                  — icon: paperclip
```

### Field Label Styling

- Required fields: label color `n700` (darker, bolder)
- Optional fields: label color `n500` (softer)
- Filled field: green checkmark (✓) aligned right of label
- Separator line (`cr200`) between field 4 and 5

### Three Entry Paths

| Entry                       | What Happens                          |
| --------------------------- | ------------------------------------- |
| Footer "הוסף ממצא"          | Empty form, choose category first     |
| "+" in category             | Form opens with category pre-selected |
| Library panel → select item | All fields filled from library data   |

### Dropdown Behavior

- **Only one dropdown open at a time** — clicking a field closes any other open dropdown
- **Click outside closes all dropdowns**
- **Focus on text field (textarea) closes dropdowns**

### Category Filtering (Tree Logic)

- Selecting a category filters ALL suggestions below (ממצא, תקן, המלצה) to that category only
- Changing category: fields keep their values, only dropdown suggestions re-filter
- No data is erased on category change

### Library Selection (from defect description field)

- Dropdown shows rich cards: title + category badge + location + cost
- Selecting a library item fills: קטגוריה, תיאור, מיקום, תקן, המלצה, עלות
- All filled fields remain editable

### Save to Library Logic

#### Three States

| מקור הממצא               | שינויים? | מה מופיע        |
| ------------------------ | -------- | --------------- |
| הקלדה חופשית (לא מהמאגר) | —        | `+ הוסף למאגר`  |
| אחרי הוספה למאגר         | כן       | `+ עדכן במאגר`  |
| נבחר מהמאגר              | לא       | כלום (כבר שמור) |
| נבחר מהמאגר              | כן       | `+ עדכן במאגר`  |

#### Button placement

מתחת לכפתור "שמור ממצא" כשורה משנית (link style, לא כפתור primary).

#### State 1: ממצא חדש (הקלדה חופשית)

```
הקלדת תיאור שלא קיים במאגר
→ "+ הוסף למאגר" מופיע
→ לחיצה → שומר את כל השדות המלאים כפריט חדש
→ כפתור משתנה ל-"✓ נשמר במאגר" (ירוק, לא לחיץ)
→ שינוי נוסף בכל שדה → כפתור משתנה ל-"+ עדכן במאגר"
→ לחיצה → מעדכן את הפריט שנוצר (בלי popup — כי זה פריט חדש שלו)
```

#### State 2: נבחר מהמאגר, ללא שינויים

```
בחירה מהמאגר → שדות מתמלאים
→ לא מופיע שום כפתור מאגר
→ "שמור ממצא" שומר לדוח בלבד
```

#### State 3: נבחר מהמאגר, עם שינויים

```
בחירה מהמאגר → שדות מתמלאים → שינוי בכל שדה שהוא
→ "+ עדכן במאגר" מופיע
→ לחיצה → popup:
    ┌──────────────────────────────────┐
    │  עדכון מאגר                      │
    │                                  │
    │  ○ להחליף את הפריט המקורי        │
    │  ○ לשמור כפריט חדש               │
    │                                  │
    │  [ביטול]          [אישור]        │
    └──────────────────────────────────┘
→ "להחליף" → מעדכן הפריט הקיים
→ "לשמור כפריט חדש" → יוצר פריט נפרד, המקורי נשאר
→ בשני המקרים → "✓ נשמר במאגר"
```

#### Dirty Check — כל השדות

שינוי בכל שדה שהוא (כולל מיקום) מפעיל dirty check. הסיבה: מפקחים רוצים וריאציות של אותו ממצא לתרחישים שונים (מיקום שונה, גודל סדק שונה, עלות שונה).

**שדות שנבדקים:** title, location, standard, recommendation, cost, costUnit, notes

**שדות שלא נבדקים (ספציפיים לדוח):** תמונות, נספח

#### מה נשמר במאגר

כל מה שמלא ברגע הלחיצה:

```typescript
{
  category: string;           // חובה
  title: string;              // חובה
  location?: string;          // אם מלא
  standard?: string;          // אם מלא
  standardDescription?: string;
  recommendation?: string;
  cost?: number;
  costUnit?: string;
  notes?: string;
  // לא נשמרים: תמונות, נספח
}
```

#### Snapshot mechanism

```
ברגע בחירה מהמאגר → שומר snapshot של כל השדות
בכל שינוי → משווה state נוכחי ל-snapshot
הבדל באחד או יותר → isDirty = true → מציג "עדכן במאגר"
```

#### Library growth pattern

המאגר גדל אורגנית עם וריאציות:

```
נזילה בצנרת מים קרים — מטבח         ₪850
נזילה בצנרת מים קרים — חדר רחצה      ₪850
נזילה בצנרת מים חמים — ללא בידוד     ₪1,200
סדק בצנרת ניקוז — 2 ס"מ             ₪600
סדק בצנרת ניקוז — 5 ס"מ+            ₪1,400
```

### X Button (Close) Logic

| Came From             | X Behavior                                        |
| --------------------- | ------------------------------------------------- |
| Footer / category "+" | Closes form, returns to main screen               |
| Library panel         | Returns to library panel (to choose another item) |

### Save Button

- Disabled until: category + description filled
- Saves to current report's defect list
- Returns to main screen (defect list)

---

## 10. LIBRARY (מאגר ממצאים)

### Dual Library Architecture

```
┌─────────────────────────────────────────────┐
│  מאגר מערכת (System) 🔒                      │
│  • 300+ ממצאים מובנים                        │
│  • כתובים מקצועית עם תקנים                   │
│  • locked — לא ניתן לעריכה/מחיקה             │
│  • מתעדכן רק ע"י inField (עדכוני אפליקציה)  │
│  • זמין לכל המשתמשים                         │
├─────────────────────────────────────────────┤
│  מאגר אישי (User) ✏️                         │
│  • ממצאים שהמפקח הוסיף בעצמו                 │
│  • per-user (כל מפקח — מאגר נפרד)            │
│  • editable — עריכה, מחיקה, עדכון             │
│  • גדל אורגנית מעבודת שטח                    │
│  • V2: per-organization למנוי Business        │
└─────────────────────────────────────────────┘
```

### Search Results Display

```
┌──────────────────────────────────┐
│ 🔍 נזילה...                      │
├──────────────────────────────────┤
│ מהמאגר שלי                ← first │
│  נזילה בצנרת מים — חדר רחצה ✏️   │
│  נזילת צנרת חמים — ללא בידוד ✏️  │
├──────────────────────────────────┤
│ מאגר inField                    │
│  נזילה בצנרת מים קרים 🔒          │
│  נזילה בצנרת ניקוז 🔒             │
└──────────────────────────────────┘
```

- מאגר אישי מופיע **קודם** (רלוונטי יותר)
- פריטי מערכת: 🔒 (locked)
- פריטי משתמש: ✏️ (editable)
- "הוסף למאגר" תמיד שומר **למאגר האישי**
- "עדכן במאגר" עובד רק על פריטים אישיים

### Search Results Order

1. פריטים שהמפקח השתמש בהם לאחרונה → למעלה
2. פריטים פופולריים (הרבה שימושים) → אחרי
3. שאר → לפי רלוונטיות חיפוש

### System Item as Template

```
מפקח בוחר פריט מערכת 🔒
→ שדות מתמלאים בטופס
→ משנה/מתאים (מיקום, עלות, תיאור...)
→ "+ עדכן במאגר"
→ אין "להחליף" (פריט מערכת 🔒)
→ רק "שמור כפריט חדש" (למאגר אישי ✏️)
```

### Library Panel Layout

- Bottom sheet, 92vh
- Search bar at top
- Category filter chips row (scrollable horizontal)
- Defect cards list with chevron (scrollable)
- Cards show: title + category badge + location + cost + 🔒/✏️

### Defect Card

```
┌───────────────────────────────────────────┐
│ נזילה בצנרת מים קרים מתחת לכיור  ₪850  › │
│ [אינסטלציה]  מטבח  ת"י 1205.1    🔒     │
└───────────────────────────────────────────┘
```

- Title: 13px, weight 500, n800
- Category: green badge (g50 bg, g700 text)
- Location + standard: 10px, n400
- Cost: gold badge (go100 bg, go700 text)
- Chevron (›) on left for affordance
- Lock/edit icon for source indication

### Deletion from User Library

- מחיקת פריט מהמאגר **לא משפיעה** על דוחות קיימים
- ממצא בדוח עצמאי אחרי שנשמר — לא קשור לפריט במאגר
- אישור מחיקה: "הפריט יימחק מהמאגר. דוחות קיימים לא יושפעו."

### Similarity Detection (duplicate prevention)

**מתי מופעל:** כשהמשתמש לוחץ "+ הוסף למאגר" על ממצא חדש.

**שיטות זיהוי (V1, בלי AI):**

| שיטה                         | דוגמה                                   | חוזק  |
| ---------------------------- | --------------------------------------- | ----- |
| כותרת זהה                    | "נזילה בצנרת מטבח" = "נזילה בצנרת מטבח" | ודאי  |
| 3+ מילות מפתח משותפות בכותרת | "נזילה בצנרת מטבח" ~ "נזילת צנרת במטבח" | גבוה  |
| prefix match (התחלות מילים)  | "נזיל..." = "נזילה", "נזילת"            | משלים |
| אותו תקן + אותה קטגוריה      | שני ממצאים מפנים לת"י 1205.1 §3.2       | סביר  |

**מילון מילות מפתח לפי קטגוריה:**

```
אינסטלציה: [נזילה, צנרת, ניקוז, ברז, סיפון, לחץ, אטם, בידוד...]
חשמל: [שקע, הארקה, לוח, מפסק, תאורה, חיווט...]
אלומיניום: [חלון, תריס, ידית, אטימה, נעילה, מסגרת...]
ריצוף: [אריח, סדק, שבר, מפלס, הדבקה, רובה...]
טיח: [סדק, בליטה, אחידות, עובי, צבע, קילוף...]
איטום: [רטיבות, שיפוע, ניקוז, חדירה, מים...]
נגרות: [דלת, ארון, ציר, משקוף, מגירה...]
```

**סדר עדיפויות:**

```
1. כותרת זהה               → כפילות ודאית → popup
2. 3+ מילות מפתח משותפות    → דמיון גבוה → popup
3. אותו תקן + קטגוריה      → V2: hint עדין (לא חוסם)
4. 2 מילות מפתח משותפות     → V2: hint עדין (לא חוסם)
```

רק דמיון 1-2 (ודאי/גבוה) מפעיל popup ב-V1.

**ה-popup:**

```
┌──────────────────────────────────────┐
│  ממצאים דומים נמצאו במאגר            │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ נזילה בצנרת מים קרים — מטבח  │    │
│  │ [אינסטלציה] ₪850             │    │
│  │              [השתמש בזה ←]   │    │
│  └──────────────────────────────┘    │
│                                      │
│  [הוסף בכל זאת]     [ביטול]         │
└──────────────────────────────────────┘
```

**שלושה מסלולים:**

- **"השתמש בזה"** → מחליף נתונים בטופס עם הפריט הקיים
- **"הוסף בכל זאת"** → שומר כפריט חדש למרות הדמיון
- **"ביטול"** → חוזר לטופס בלי לשמור למאגר

### Library Data Structure

```typescript
interface LibraryItem {
  id: string;
  source: 'system' | 'user';
  userId?: string; // null for system, user_id for personal
  category: string;
  title: string;
  location?: string;
  standard?: string;
  standardDescription?: string;
  recommendation?: string;
  cost?: number;
  costUnit?: 'fixed' | 'sqm' | 'lm' | 'unit' | 'day';
  notes?: string;
  usageCount: number; // how many times used in reports
  lastUsedAt?: string; // for sorting by recency
  createdAt: string;
  updatedAt: string;
}
```

### V2 Library Roadmap

- Per-organization shared library (Business plan)
- AI-powered similarity grouping & auto-tags
- Import/export library (CSV/JSON)
- Usage analytics — most used defects per category

---

## 11. REPORT INTEGRITY (שלמות הדוח)

### Iron Rule

> הדוח הוא מסמך משפטי — חוות דעת הנדסית. שום שינוי במערכת לא ישנה דוח קיים. רק המפקח יכול לערוך את הדוח שלו.

### What NEVER Changes a Report

| פעולה במערכת           | השפעה על דוח קיים                  |
| ---------------------- | ---------------------------------- |
| עדכון ממצא במאגר       | ❌ אפס                             |
| מחיקת ממצא מהמאגר      | ❌ אפס                             |
| עדכון תקן ישראלי במאגר | ❌ אפס                             |
| עדכון מחירון/עלויות    | ❌ אפס                             |
| שינוי נוסח המלצה במאגר | ❌ אפס                             |
| עדכון גרסת אפליקציה    | ❌ אפס                             |
| שינוי לוגו חברה        | ❌ אפס — הלוגו בדוח הוא מרגע ההפקה |

### What CAN Change a Report

| פעולה              | מי         | תנאי               |
| ------------------ | ---------- | ------------------ |
| עריכת ממצא         | המפקח בלבד | דוח בסטטוס "טיוטה" |
| הוספת/מחיקת ממצא   | המפקח בלבד | דוח בסטטוס "טיוטה" |
| שינוי תמונות       | המפקח בלבד | דוח בסטטוס "טיוטה" |
| הפקת PDF           | המפקח בלבד | —                  |
| סימון "הושלם"      | המפקח בלבד | —                  |
| עריכה אחרי "הושלם" | המפקח בלבד | אישור כפול         |

### Report Statuses

```
טיוטה (draft)      → עריכה חופשית, ללא הגבלות
הושלם (completed)   → עריכה עם אישור כפול
```

### Preview vs PDF

|        | תצוגה מקדימה       | הפקת PDF           |
| ------ | ------------------ | ------------------ |
| פורמט  | מסך באפליקציה      | קובץ PDF           |
| תמונות | thumbnails מוקטנות | איכות מלאה         |
| מהירות | מיידי              | כמה שניות          |
| נשמר?  | לא                 | כן — דורס את הקודם |
| כפתור  | 👁 "תצוגה מקדימה"  | 📤 "הפק דוח"       |

### Full Flow

```
טיוטה
  ├── תצוגה מקדימה (כמה שרוצה, בתוך האפליקציה)
  ├── הפק PDF (כמה שרוצה — דורס כל פעם)
  └── "סמן כהושלם" → "אתה בטוח?" → הושלם

הושלם
  ├── צפייה + הורדה + שליחה
  └── "עריכה" → אישור כפול:
        "הדוח הושלם. לחזור למצב עריכה?"
        [ביטול]  [אישור]
      → חוזר לטיוטה
      → עריכה חופשית
      → הפק PDF (דורס)
      → "סמן כהושלם"
```

### PDF — One File, Overwritten

- PDF אחד בלבד לכל דוח — לא גרסאות
- כל הפקה דורסת את הקובץ הקודם
- הלקוח מקבל PDF נקי — בלי מספר גרסה, בלי היסטוריה

### Activity Log (לוג פעולות)

**מתחיל לתעד:** מרגע הפקת PDF ראשונה (לא לפני).

**פנימי בלבד:** רק המפקח רואה. הלקוח לא רואה שום היסטוריה.

```
26.03 14:30  סטטוס שונה ל"הושלם"
26.03 14:28  הופק PDF
26.03 14:20  עודכן ממצא #2 — עלות
26.03 10:00  הופק PDF
25.03 16:00  סטטוס שונה ל"הושלם"
25.03 15:50  הופק PDF ← הלוג מתחיל כאן
```

**מה מתועד:**

| פעולה             | תיעוד                    |
| ----------------- | ------------------------ |
| הפקת PDF          | "הופק PDF"               |
| סימון הושלם       | "סטטוס שונה להושלם"      |
| חזרה לעריכה       | "סטטוס שונה לטיוטה"      |
| עדכון ממצא        | "עודכן ממצא #X — [שדה]"  |
| הוספת ממצא        | "נוסף ממצא #X"           |
| מחיקת ממצא        | "נמחק ממצא #X"           |
| הוספת/מחיקת תמונה | "עודכנו תמונות בממצא #X" |

### Data Structure — Report Defect (Snapshot)

```typescript
interface ReportDefect {
  id: string;
  reportId: string;

  // ══ SNAPSHOT — independent copy, NOT a reference ══
  category: string;
  title: string;
  location: string;
  standard: string; // full text, not ID
  standardDescription: string;
  recommendation: string;
  cost: number;
  costUnit: string;
  notes: string;

  // ══ Loose link to library — convenience only ══
  libraryItemId?: string; // where it came from (nullable)
  // if library item is deleted — nothing breaks

  // ══ Media — belongs to report only ══
  photos: string[]; // URLs in storage
  annexUrl?: string;

  // ══ Meta ══
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Data Structure — Activity Log

```typescript
interface ReportLog {
  id: string;
  reportId: string;
  action:
    | 'pdf_generated'
    | 'status_changed'
    | 'defect_updated'
    | 'defect_added'
    | 'defect_deleted'
    | 'photos_updated';
  details?: string; // e.g. "ממצא #2 — עלות"
  createdAt: string;
  createdBy: string; // userId
}
```

---

## 12. PDF REPORT STYLES

### Shared Between Both Report Types

| Element             | Value                                 |
| ------------------- | ------------------------------------- | -------------------- | -------------------------- |
| Page padding        | 20px top/bottom, 24px left/right      |
| Image size          | 56×42px (uniform across all reports)  |
| Accent color        | `#1B7A44` (same as app)               |
| Background sections | `#FEFDFB` (cr50)                      |
| Border color        | `#D1CEC8` (n300)                      |
| Light border        | `#F5EFE6` (cr200)                     |
| Font                | Rubik                                 |
| Direction           | RTL                                   |
| Footer              | Logo (right)                          | Page number (center) | Report title + date (left) |
| Logo                | Small, top-right corner of every page |
| Shadows             | `0 2px 12px rgba(60,54,42,.10)`       |

### Category Headers (Both Reports)

```
Background: g50 (#F0F7F4)
Border-right: 3px solid g500 (#1B7A44)
Font: 10px bold, accent color
```

### בדק בית — Report Structure

1. **שער** — Logo, title, inspection type, property/client/inspector details, report number
2. **פרטים** — Inspector, property, client, inspection conditions, tools used
3. **ממצאים** (multiple pages) — By professional category. Each defect:
   - Number badge (dark circle) + title + location
   - Standard citation (green left border, gray bg)
   - Recommendation + note (above photos)
   - Cost badge (green pill)
   - Photos (uniform size)
   - Annex (if applicable)
4. **כתב כמויות** — Cost table by category → items → subtotal + VAT + total
5. **סיכום** — Stats, general notes, signature + stamp + license number

### פרוטוקול מסירה — Report Structure

1. **עמוד 1** — Details (compact top third) → Checklist in 2 columns by profession
   - Statuses: ✓ (green) / ✗ (red) / ~ (amber)
   - "ראה סעיף #X" references on non-OK items
   - Legend + summary counts at bottom
2. **ממצאים** (multiple pages) — By profession, defect text + photos below
3. **עמוד אחרון** — Summary stats, key reception, tenant notes, legal text, signatures + stamp

---

## 13. ACCESSIBILITY

- Focus-visible: `outline: 2px solid #1B7A44; outline-offset: 2px`
- All interactive elements: keyboard accessible
- Form labels: connected to inputs
- Color not sole indicator: icons + text alongside colors
- Touch targets: minimum 36px
- RTL: `dir="rtl"` on root, logical properties (ms/me/ps/pe)

---

## 14. CHECKLIST (פרוטוקול מסירה בלבד)

### Statuses

| Status     | Symbol | Color               | Background | Border    |
| ---------- | ------ | ------------------- | ---------- | --------- |
| תקין       | ✓      | `#1B7A44` (g500)    | `#ecfdf5`  | `g200`    |
| לא תקין    | ✗      | `#b91c1c` (clRed)   | `#fef2f2`  | `#f5c6c6` |
| תקין חלקית | ~      | `#92600a` (clAmber) | `#fefaed`  | `#f0dca0` |
| דלג        | —      | `n400`              | `cr100`    | `cr300`   |

**Note:** `clRed` (#b91c1c) for checklist defects, NOT `sR` (#EF4444) which is for app errors.

### Rules

- "לא תקין" or "תקין חלקית" opens inline detail row (description + camera + save button)
- "דלג" marks item for return — NO "לא רלוונטי" at this stage
- End of checklist: system returns to all skipped items → only then "לא רלוונטי" with double confirmation
- Progress bar at top of each room (spring animation: cubic-bezier(.22,1,.36,1))
- Mandatory summary screen before report generation
- Only ONE defect detail row open at a time — others collapse to text preview

### Room Header Style

- Background: `g50` (#F0F7F4) — full width
- Right border: 4px solid `g500` (#1B7A44)
- Font: 14px, weight 700, color `g700`
- Badge: 22×22px rounded square, dynamic:
  - Before checking: shows total item count, background `cr200`, color `n500`
  - After checking: shows checked count, background `g500` (all ok) or `clRed` (has defects), white text
- Grip dots: same as v5-mockup category grip
- Subtitle line: status counts (X ✓, X ✗, X ~, X דלג, X נותרו)
- Chevron: rotates on open/close

### Checklist Item Row

- Padding: 12px 16px, min-height 48px
- Status badge: 24×24px, borderRadius 5px, color-coded per status table
- Question text: 13px, weight 500, color `n700` (`n400` for skipped)
- "שנה" button: appears after status set, min-height 28px, border `cr200`
- Hover: background `cr100`
- Child items (conditional): paddingRight 32px + green indent line (2px, `g200`, opacity 0.3)

### Defect Detail Row (Expanded)

- Background: `#fef2f2` (defect) or `#fefaed` (partial)
- Contains: textarea (`dir="rtl"`, fontSize 16, autoComplete off, spellCheck false) + camera button
- Save button: full-width below textarea, background `clRed`/`clAmber`, white text, 36px height
- Save button closes the row
- Collapsed state: defect text shown as 11px preview below question text

### Bath Type Selector

- Appears at top of bathroom rooms
- Two pill buttons: אמבטיה / מקלחון
- Selected: `g500` background, white text
- Unselected: transparent, `cr300` border
- Changes which questions are visible in the room

### Conditional Items

- Items with `parentId` only visible when parent status = "ok"
- Visual: indented with green line on right side
- Example: "שיש מותקן?" only visible when "מטבח מותקן?" = תקין

### Progress Bar (Per Room)

- Height: 3px
- Background track: `cr200`
- Fill: `go500` (in progress) or `g500` (100% complete)
- Animation: width transition with spring curve
- Counter: "X/Y" text, 10px, right-aligned

### FAB — "הוסף ליקוי" Bottom Sheet

- Triggered by footer "הוסף ליקוי" button
- Height: 85vh fixed
- Handle bar: standard bottom sheet handle
- Contains single form with 3 fields:

**Field 1 — קטגוריה (בעל מקצוע) — Required**

- ComboField style (same as category in bedek bayit)
- Default list: אינסטלציה, חשמל, אלומיניום, ריצוף, טיח וצבע, איטום, נגרות, כללי
- Type to filter, "+ הוסף קטגוריה" for new entries
- Green checkmark when selected

**Field 2 — מיקום (חדר) — Optional**

- ComboField style (identical to category field)
- List populated from rooms in current report
- Type to filter, "+ הוסף מיקום" for new entries
- Green checkmark when selected

**Field 3 — תיאור הליקוי — Required**

- Textarea, `dir="rtl"`, fontSize 16
- `autoComplete="off"`, `spellCheck={false}`

**Camera button** — dashed border, `g200`/`g50`, "צלם תמונה"

**Submit** — "הוסף ליקוי", `g500`, 46px height, disabled until category + description filled

### Checklist Modes

| Mode          | Description                                                                       |
| ------------- | --------------------------------------------------------------------------------- |
| **Checklist** | Pre-loaded rooms + items from apartment template. Inspector checks each item.     |
| **Free-form** | Empty screen. Inspector adds defects manually via FAB. Rooms created dynamically. |

### Apartment Templates

| Template         | Default Configuration                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------- |
| דירת 3 חדרים     | מרון, סלון, מטבח, חדר שינה הורים, חדר שינה, ממ"ד, חדר רחצה, שירותי אורחים, מרפסת, חניה, מחסן |
| דירת 4 חדרים     | Same + חדר שינה נוסף                                                                         |
| דירת 5 חדרים     | Same + חדר שינה נוסף + חדר רחצה נוסף                                                         |
| דירת גן          | Size-based + גינה, מחסן גינה, ברז חיצוני                                                     |
| בית קרקע / קוטג' | Full house: חדר שינה ×3-4, חדר רחצה ×2, חדר כביסה, מרפסת, גינה, חניה, מחסן, גג               |
| אישית מותאם      | Empty — free-form mode                                                                       |

---

## 15. MAIN SCREEN — Bedek Bayit (inField v6)

### Header

- Green gradient: `linear-gradient(135deg, g700, g600)`
- Brand name: 18px bold white
- Sync indicator: pill with icon + text
- Address: 12px, 70% opacity
- No back button — removed in v6

### Report Card

- Background: `cr50`
- Border: `cr200`
- Shadow: `shadow.sm`
- Report title + "טיוטה" badge (g500)
- Details: client name, date
- Single search button (replaced 4 toolbar icons in v6)
- Counter row: total defects (18px bold g700) + camera icon with photo count + categories count

### Tabs

- Border: `cr200`
- Background: `cr100`
- Active: `cr50` background, g700 text, weight 600
- Badge: red circle for "חוסרים" — **always red, even when tab is inactive**

### Category Accordion

- Grip handle (drag dots) — category level only
- Text count "6 ממצאים" — no badge circle (removed in v6)
- Camera icon + photo count
- "+" button per category (green tint) — spaced 8px from chevron
- Chevron animation on open/close
- Swipe left to delete with first-time hint animation ("החלק ←" with nudge)
- Staggered entrance: each category enters with 60ms delay
- Defect items: smaller grip (6×10px, cr300 color), camera icon + number instead of thumbnail

### Footer (Fixed)

- Background: `cr50`
- Shadow: `shadow.up`
- Padding bottom: `max(24px, env(safe-area-inset-bottom))`
- 3 buttons only:
  - "הוסף ממצא" button: g500, 44px height, flex grow
  - Camera button: cr50, gold hover — opens camera flow
  - Search button: cr50, green hover — opens search overlay

### Camera Flow (from Footer)

```
לחיצה על מצלמה
→ מסך מצלמה מלא (overlay כהה)
  - Shutter button עגול (68px, white border)
  - X למעלה ימין
  - Badge ירוק מונה תמונות (למעלה שמאל)
→ צילום → מסך Review:
  - כותרת "X תמונות צולמו"
  - גריד 96×96 עם X למחיקה
  - "צלם עוד" (חוזר למצלמה)
  - "הוסף ממצא (X)" (פותח טופס עם תמונות)
```

### Search Overlay

- Bottom sheet 75vh
- Search input + cancel button
- Category filter chips row (scrollable)
- Recent searches list with clock icons
- Exit animation: slideDown + fadeOut

### Side Menu

- Slide from right (RTL)
- User context at top: avatar + name + organization + plan tier
- Menu items: דאשבורד, הדוחות שלי, מאגר ממצאים, הגדרות, עזרה
- Entry animation: slideInRight
- Exit animation: slideOutRight + backdrop fadeOut

### Loading States

- Skeleton screens for report card and category list
- Shimmer animation on skeleton elements
- No spinners anywhere

---

## 16. CHECKLIST SCREEN (פרוטוקול מסירה)

### Header

- Same green gradient as Main Screen (section 15)
- Brand name: 18px bold white
- Sync indicator: pill
- Address: 12px, 70% opacity
- Back button: present (navigates to apartment/project)

### Report Card

- Background: `cr50`
- Border: `cr200`
- Shadow: `shadow.sm`
- Title + "טיוטה" badge (`g500`) — same line, aligned
- Details: project, tenant, date
- Toolbar: Eye, Share, Gear, Download (4 buttons, same as v5-mockup)
- Counter: 18px bold `g700`, "X / Y נבדקו" + defect count + room count

### Room List

- Staggered entrance: 60ms delay per room
- Room cards: `cr50` background, `cr200` border (`g200` when open), `shadow.sm`
- Room header: see Checklist section 14 above
- One room open at a time (accordion — others close)

### Footer (Fixed)

- Background: `cr50`
- Shadow: `shadow.up`
- Safe area padding: `max(24px, env(safe-area-inset-bottom))`
- 3 buttons:
  - "הוסף ליקוי": `g500`, 44px height, flex grow → opens FAB sheet
  - Camera: `cr50`, gold hover (`go100`/`go500`/`go300`)
  - Search: `cr50`, green hover (`g50`/`g500`)

### Search Overlay

- Bottom sheet 75vh
- Search input + cancel button
- Recent searches with clock icons
- Exit animation: slideDown + fadeOut

### Side Menu

- Slide from right (RTL)
- User context: avatar + name + organization + plan tier
- Menu items: דאשבורד, הדוחות שלי, מאגר ממצאים, הגדרות, עזרה
- Entry: slideInRight, Exit: slideOutRight + fadeOut

### Loading States

- Skeleton screens for report card and room list
- Shimmer animation
- No spinners

---

## 17. TOAST & FEEDBACK

### When to Show

- SUCCESS: After save actions ("הליקוי נשמר", "הדוח הופק")
- ERROR: When action fails ("לא הצלחנו לשמור. נסה שוב")
- WARNING: Before destructive actions (dialog, not toast)

### Style

See Toast Notification component definition in Section 8.

---

## 18. CONFIRMATION DIALOGS

### When Required

- Delete actions (defect, report, project)
- Status changes on completed reports ("חזרה לטיוטה")
- Exit with unsaved changes
- Bulk operations

### Never Confirm

- Checklist status changes (immediate and reversible)
- Adding items
- Navigation between screens (unless unsaved data)

### Style

See Confirmation Dialog component definition in Section 8.

---

_Design System document for inField | Version 8.0 | March 2026_
_This is the single source of truth — read before every UI task._
_Companion documents: SCREEN_STANDARDS.md (functional), ARCHITECTURE_INFIELD.md (data models)_

---

## 19. HOME SCREEN — Dashboard (inField v6)

> **מסך הבית — נקודת הכניסה לאפליקציה.** מחליף את מסך ה-report ישיר מ-v5.
> **Mockup:** `inField-HomeScreen-v6-rtl.jsx`

### Header

- Background: `cr50` (light — NOT green gradient)
- Padding: `48px 16px 0` (includes safe area top)
- Top row: Bell button (left) — Logo center — Hamburger button (right)
- Logo: BootLogo (28px) + "inField" text (14px, 700, `g700`, Inter)
- Bell button: 36×36px, radius 10, `cr100` bg, `cr200` border, notification dot (`sR`, 6px)
- Hamburger button: same style, Feather menu icon (shortened third line)
- Animation: `fadeDown 0.2s ease`

### Greeting + CTA Row

- Single row with `direction: "rtl"`: greeting right, CTA left
- Greeting: "שלום, חיים" — 18px, 700, `n800`, Rubik
- Below greeting: sync indicator — green dot (5px, `sG`) + "מסונכרן" (10px, `n400`)
- CTA: "בדיקה חדשה" button — height 34px, radius 10, `g500`, white text 12px 600
- Plus icon (16px) inside CTA

### Separator

- `1px solid cr200`, margin `12px 16px 0`

### Stats Strip

- 2 cards side by side, gap 8px, margin `12px 16px 0`
- Card: `cr50` bg, `cr200` border, radius 12, padding `12px 4px 10px`, text-align center
- Number: 22px, 700, Inter — animated count-up from 0
- Label: 10px, 500, `n400`, Rubik
- Card 1: "טיוטות" — number color `go500`
- Card 2: "הושלמו" — number color `g500`

### "דוחות אחרונים" Section

- Container: `cr50` bg, radius 12, `cr200` border, margin `12px 16px 0`
- Section header: `direction: "rtl"` — "דוחות אחרונים" right + "עוד" link left (with chevron, `g500`)
- Shows: **5 דוחות** — sorted by last updated

### Report Row (shared with Reports List)

- `direction: "rtl"` on row
- Row 1: status dot (7px) + project name (13px, 600, `n800`)
- Row 2: apartment (11px, `n500`) · type (10px, `n400`) · time (10px, `n400` + clock icon)
- Left side: status badge (10px, 600) + defect count + chevron
- Hover: background `cr100`
- Animation: `riseIn 0.2s ease` with 60ms stagger

### "הפרויקטים שלי" Section

- Same container style as reports section
- Section header: `direction: "rtl"` — "הפרויקטים שלי" + "עוד" link
- Shows: **3 פרויקטים**

### Project Row

- `direction: "rtl"` on all rows
- Row 1: status dot (7px) + project name (13px, 600, `n800`) + chevron
- Row 2: MapPin icon + address (11px, `n400`)
- Row 3: progress bar — "דירות" label + count + bar (4px, `cr200` track) + fill

### Tool Grid (2×2)

- Section title: "כלים" (13px, 700, `n800`), margin-bottom 8px
- Grid: 2 columns, gap 8px, `direction: "rtl"`
- Cell: `cr50` bg, `cr200` border, radius 12, padding `12px`, `direction: "rtl"`
- Icon container: 36×36px, radius 10, tinted bg + label (12px, 500, `n700`)
- Items: מאגר ממצאים, חיפוש, תבניות, עזרה

### Bottom Tab Bar

- Active tab: "בית"
- No footer, no FAB — CTA is in header

---

## 20. REPORTS LIST SCREEN (הדוחות שלי)

> **רשימת כל הדוחות — מסך tab "דוחות".**
> **Mockup:** `inField-ReportsList-v5-rtl.jsx`

### Header

- Same as Home Screen header (logo center, bell left, hamburger right)
- Title row: `direction: "rtl"` — "הדוחות שלי" (20px, 700, `n800`) right + count left

### Search Bar

- See Search Bar component (§8)

### Filter Bar

- `direction: "rtl"`: 3 status chips right + sort/filter button left
- Chips: "הכל" | "פעילים" | "הושלמו"

### Sort/Filter Bottom Sheet

- `direction: "rtl"` on sheet content
- Header: X right (RTL first), title center, "איפוס" left
- Sections: "מיון לפי" (תאריך/פרויקט) + "סוג דוח" (הכל/מסירה/בדק בית)
- SheetOption: `direction: "rtl"` — label right, checkmark left

### Report Rows

- Same Report Row as Home Screen (§19)
- Flat list when sorted by date, grouped by project when sorted by project

### Project Group Header

- `direction: "rtl"`: green bar (4×14px) + project name (12px, 700, `g700`) + count

### States

| State   | What Shows                    |
| ------- | ----------------------------- |
| Loading | Skeleton (5 rows, shimmer)    |
| Error   | 😕 + retry button             |
| Empty   | 📋 + "בדיקה חדשה" CTA         |
| Data    | Report rows (flat or grouped) |

### FAB + Tab Bar

- FAB: "בדיקה חדשה", bottom 80px
- Active tab: "דוחות"

---

## 21. PROJECTS LIST SCREEN (הפרויקטים שלי)

> **רשימת כל הפרויקטים — מסך tab "פרויקטים".**
> **Mockup:** `inField-ProjectsList-v2.jsx`

### Header + Search + Filter

- Same pattern as Reports List
- Filter chips: "הכל" | "פעילים" | "הושלמו"
- Sort sheet: שם / פעילות אחרונה / התקדמות / ליקויים פתוחים

### Project Card (Rich)

- Container: `cr50` bg, `cr200` border, radius 14, `direction: "rtl"`
- Accent bar: 4px right side, `go500` (active) or `g500` (completed), radius `0 4px 4px 0`
- Row 1: name (15px, 700) + "הושלם ✓" badge (if completed) + chevron
- Row 2: MapPin + address (11px, `n400`)
- Row 3: "דירות" label + count + progress bar (6px) + percentage
- Row 4: building/apartment icon + nav hint + defects (if >0) + calendar + activity

### Navigation Hint Logic

- `buildings === 1` → "X דירות" → navigates to apartments
- `buildings > 1` → "X בניינים · Y דירות" → navigates to buildings

### States

| State   | What Shows            |
| ------- | --------------------- |
| Loading | Skeleton (3 cards)    |
| Error   | 😕 + retry            |
| Empty   | 📂 + "פרויקט חדש" CTA |
| Data    | Project cards         |

### FAB + Tab Bar

- FAB: "פרויקט חדש" (folder+ icon), width 148px expanded
- Active tab: "פרויקטים"

---

## 22. BUILDINGS + APARTMENTS SCREENS

> **מסכי ניווט פנימיים בפרויקט.** בניינים → דירות → דוח.
> **Mockup:** `inField-Buildings-Apartments-v2.jsx`

### SubHeader (shared)

- Back button (36×36, `cr100`, `cr200` border) — left (RTL last)
- BootLogo (24px) — right (RTL first)
- Title: project name (20px, 700, `n800`)
- Subtitle: address with MapPin icon
- No hamburger, no bell — sub-screen, not tab-level

### Progress Strip (shared)

- Container: `cr50` bg, radius 12, `cr200` border, padding `12px 14px`
- `direction: "rtl"`: label + count + progress bar (6px) + percentage
- Progress bar: `direction: "ltr"` (fill left→right)

### Buildings List

**Building Card:**

- Container: `cr50` bg, `cr200` border, radius 12, `direction: "rtl"`
- Accent bar: 4px right, `go500`/`g500`, radius `0 4px 4px 0`
- Row 1: icon orb (32×32, radius 8, tinted bg) + name (14px, 700) + floors/apts + defects + chevron
- Row 2: progress bar (4px) with count + percentage
- Animation: `riseIn 0.2s ease` with 60ms stagger

**FAB:** "בניין חדש" → opens Add Building Sheet

### Add Building Sheet

- Standard bottom sheet (handle, X, title "בניין חדש")
- Field 1: שם בניין (required, fontSize 16, dir="rtl")
- Field 2: מספר קומות (numeric, dir="ltr", centered, width 80px)
- CTA: "הוסף בניין" (`g500`, 46px)

### Apartments List

**Floor Headers:**

- `direction: "rtl"`: green bar (3×14px) + "קומה X" (12px, 700, `g700`) + count
- Apartments grouped by floor

**Apartment Row:**

- `direction: "rtl"` on row
- Status dot (7px) + "דירה X" (14px, 600) + rooms + floor
- Tenant name (UserIc + 10px, `n400`) or "ללא דייר" (italic, `n300`)
- Report count (FileIc + number)
- Status badge + defect count + chevron

**Apartment Statuses (delivery project):**

| Status        | Label  | Dot     | Badge                    |
| ------------- | ------ | ------- | ------------------------ |
| `pending`     | ממתין  | `n400`  | `cr200` bg, `n500` text  |
| `in_progress` | בבדיקה | `go500` | `go100` bg, `go700` text |
| `completed`   | נבדק   | `g500`  | `g50` bg, `g700` text    |
| `delivered`   | נמסר   | `g500`  | `g100` bg, `g700` text   |

**FAB:** "בדיקה חדשה" → opens Add Report Sheet

### Add Report Sheet

- Standard bottom sheet
- Report type: 2 pill buttons (`direction: "rtl"`): פרוטוקול מסירה | בדק בית
  - Selected: `g50` bg, `g500` border 1.5px, `g700` text, 600
  - Unselected: `cr100` bg, `cr200` border, `n500` text
  - Height: 44px each
- Apartment picker: dropdown placeholder "בחר דירה..." with chevron
- CTA: "התחל בדיקה" (`g500`, 46px)

### States (both screens)

| State   | What Shows                                       |
| ------- | ------------------------------------------------ |
| Loading | BldSkeleton (3 cards) / AptSkeleton (4 rows)     |
| Error   | 😕 + retry                                       |
| Empty   | 🏢/"אין בניינים" or 🏠/"אין דירות" + CTA         |
| Data    | Building cards / Apartment rows grouped by floor |

---

_Design System document for inField | Version 8.0 | March 2026_
_Changes from v7: §8 new components, §19-22 screen specs, RTL explicit direction on all flex rows_
_This is the single source of truth — read before every UI task._
_Companion documents: SCREEN_STANDARDS.md (functional), ARCHITECTURE_INFIELD.md (data models)_

# 🎨 DESIGN SYSTEM — DocField

> **מסמך זה מגדיר את השפה העיצובית המלאה של DocField.**
> כל מסך, קומפוננטה, ואלמנט חזותי חייבים לעקוב אחרי ההנחיות האלה.
> Claude Code מקבל את המסמך הזה כחלק מההוראות.

---

## 1. Brand Identity

### שם: DocField
### תיאור: מערכת דוחות מסירה, בדק בית ופיקוח בענף הבנייה
### אופי המותג: מקצועי, יוקרתי, אמין, מודרני, נקי
### השראה: שילוב בין הנקיון של Apple לבין חומריות של עולם הבנייה

---

## 2. Skills עיצוב — כלי העבודה שלנו

DocField משתמש ב-Skills מתקדמים שמדריכים את Claude Code בבניית UI/UX איכותי.
ה-Skills מותקנים ב-`~/.claude/skills/` ונטענים אוטומטית לפי הקשר.

### Skills מותקנים

| Skill | מתי להשתמש | מה הוא מספק |
|-------|-----------|-------------|
| **bencium-controlled-ux-designer** | בניית כל component UI חדש | עקרונות UX, היררכיה ויזואלית, accessibility |
| **ui-ux-pro-max** | בניית מסכים מלאים | ארכיטקטורת מסכים, navigation patterns, state management |
| **bencium-innovative-ux-designer** | features ייחודיים | פתרונות עיצוב יצירתיים, אנימציות, micro-interactions |
| **frontend-design** | כל קוד UI | קוד נקי, conventions, best practices |
| **design-audit** | לפני כל commit | ביקורת עיצוב — וידוא עקביות עם Design System |
| **web-design-guidelines** | apps/web | עקרונות web accessibility, responsive design |
| **vercel-react-native-skills** | apps/mobile | React Native best practices, performance |

### כלל זהב — מתי לקרוא Skills

**תמיד לפני:**
- יצירת component חדש → קרא `frontend-design` + `bencium-controlled-ux-designer`
- יצירת מסך מלא → קרא `ui-ux-pro-max` + `vercel-react-native-skills` (אם mobile)
- feature ייחודי → קרא `bencium-innovative-ux-designer`
- commit → הרץ `design-audit` (פקודת `/design-check`)

### דוגמה לשימוש

```
אני רוצה ליצור את מסך דוח המסירה.
קודם קרא:
1. docs/DESIGN_SYSTEM_DOCFIELD.md (Design System)
2. ~/.claude/skills/ui-ux-pro-max/SKILL.md (ארכיטקטורת מסכים)
3. ~/.claude/skills/vercel-react-native-skills/SKILL.md (React Native)

אחר כך תצור את המסך לפי העקרונות משלושת המקורות.
```

### חשוב: Skills משלימים, לא מחליפים

```
Design System = מה (צבעים, typography, spacing, component specs)
Skills        = איך (לבנות components איכותיים עם ה-"מה")

סדר עדיפויות:
1. Design System של DocField (המסמך הזה) ← מקור האמת
2. Skills (bencium, ui-ux-pro-max...) ← כללי בנייה
3. react-native-reusables ← base components

אם יש סתירה בין Skill ל-Design System — ה-Design System מנצח.
```

---

## 3. Color Palette

### Primary — Forest Green (ירוק יער)
הצבע המוביל. משדר אמינות, מקצועיות, יציבות.

| Token | Hex | שימוש |
|-------|-----|-------|
| `green-50` | `#F0F7F4` | רקע בהיר מאוד, hover states |
| `green-100` | `#D1E7DD` | רקע כרטיסים מודגשים, badges |
| `green-200` | `#A3D1B5` | borders בהירים |
| `green-300` | `#6DB88C` | אייקונים משניים |
| `green-400` | `#3D9B66` | hover על כפתורים |
| `green-500` | `#1B7A44` | כפתורים ראשיים, לינקים |
| `green-600` | `#14643A` | כפתורים active state |
| `green-700` | `#0F4F2E` | headers, כותרות חשובות |
| `green-800` | `#0A3B22` | טקסט על רקע בהיר |
| `green-900` | `#062818` | כותרות ראשיות, הכי כהה |

### Secondary — Warm Cream (קרם חם)
הצבע המשני. חומריות, חמימות, נגישות.

| Token | Hex | שימוש |
|-------|-----|-------|
| `cream-50` | `#FEFDFB` | רקע ראשי של האפליקציה (במקום לבן טהור) |
| `cream-100` | `#FBF8F3` | רקע משני, שטחי surface |
| `cream-200` | `#F5EFE6` | borders, dividers |
| `cream-300` | `#EBE1D3` | רקע input fields |
| `cream-400` | `#D9CBBA` | placeholder text |
| `cream-500` | `#BCA78E` | אייקונים לא פעילים |

### Accent — Burnished Gold (זהב חום)
נגיעות אקסנט. פעולות חשובות, highlights.

| Token | Hex | שימוש |
|-------|-----|-------|
| `gold-100` | `#FDF4E7` | רקע התראות, badges |
| `gold-300` | `#F0C66B` | אייקונים מודגשים |
| `gold-500` | `#C8952E` | אקסנט, CTA משני |
| `gold-700` | `#8B6514` | טקסט על רקע זהוב |

### Neutrals — Warm Gray (אפור חם)
טקסט, borders, רקעים.

| Token | Hex | שימוש |
|-------|-----|-------|
| `neutral-50` | `#FAFAF8` | רקע חלופי |
| `neutral-100` | `#F2F1EE` | surface cards |
| `neutral-200` | `#E5E3DF` | borders, dividers |
| `neutral-300` | `#D1CEC8` | borders מודגשים |
| `neutral-400` | `#A8A49D` | placeholder, hint text |
| `neutral-500` | `#7A766F` | secondary text |
| `neutral-600` | `#5C5852` | body text |
| `neutral-700` | `#3D3A36` | primary text |
| `neutral-800` | `#252420` | headings |
| `neutral-900` | `#141311` | darkest text |

### Semantic — Status Colors

| Token | Hex | שימוש |
|-------|-----|-------|
| **Pass / Fixed** | | |
| `success-50` | `#ECFDF5` | רקע |
| `success-500` | `#10B981` | אייקון, border |
| `success-700` | `#047857` | טקסט |
| **Fail / Critical** | | |
| `danger-50` | `#FEF2F2` | רקע |
| `danger-500` | `#EF4444` | אייקון, border |
| `danger-700` | `#B91C1C` | טקסט |
| **Warning / Medium** | | |
| `warning-50` | `#FFFBEB` | רקע |
| `warning-500` | `#F59E0B` | אייקון, border |
| `warning-700` | `#B45309` | טקסט |
| **Info / Low** | | |
| `info-50` | `#EFF6FF` | רקע |
| `info-500` | `#3B82F6` | אייקון, border |
| `info-700` | `#1D4ED8` | טקסט |

---

## 3. Typography

### Font Stack

```
Primary (Hebrew): 'Rubik', system-ui, sans-serif
Secondary (English/Numbers): 'Inter', system-ui, sans-serif
Monospace (codes): 'JetBrains Mono', monospace
```

### Scale

| Token | Size | Weight | Line Height | שימוש |
|-------|------|--------|-------------|-------|
| `display` | 32px | 700 | 1.2 | מסך ראשי כותרת (Large Title) |
| `h1` | 24px | 700 | 1.3 | כותרת עמוד |
| `h2` | 20px | 600 | 1.3 | כותרת חלק |
| `h3` | 17px | 600 | 1.4 | כותרת כרטיס, שם חדר |
| `body` | 15px | 400 | 1.5 | טקסט ראשי |
| `body-medium` | 15px | 500 | 1.5 | טקסט מודגש |
| `caption` | 13px | 400 | 1.4 | תוויות, timestamps, hints |
| `caption-medium` | 13px | 500 | 1.4 | תוויות מודגשות, tab labels |
| `small` | 11px | 500 | 1.3 | badges, counters |

### Rules
- Hebrew text: direction RTL, text-align: start
- Numbers always in Inter (even inside Hebrew text)
- No ALL CAPS in Hebrew (לא קיים בעברית)
- English labels: Sentence case (לא Title Case)

---

## 4. Spacing & Layout

### Spacing Scale (rem-based)

| Token | Value | שימוש |
|-------|-------|-------|
| `xs` | 4px | gap בין אייקון לטקסט |
| `sm` | 8px | padding פנימי קטן, gap בין badges |
| `md` | 12px | gap בין אלמנטים ברשימה |
| `lg` | 16px | padding של כרטיסים, gap בין sections |
| `xl` | 20px | padding של מסכים |
| `2xl` | 24px | gap בין sections גדולים |
| `3xl` | 32px | margin בין חלקי עמוד |
| `4xl` | 48px | spacing ראשי |

### Layout Rules
- Screen padding: 20px horizontal
- Card padding: 16px
- Max content width (Web): 1200px
- List item height: min 56px (touch target)
- Bottom safe area: always respected
- Keyboard avoiding: smooth, automatic

---

## 5. Border Radius

| Token | Value | שימוש |
|-------|-------|-------|
| `sm` | 6px | badges, small pills |
| `md` | 10px | input fields, small buttons |
| `lg` | 14px | cards, large buttons |
| `xl` | 20px | bottom sheets, modals |
| `full` | 9999px | avatars, round buttons, pills |

### Rule
> DocField uses generous border radius. Nothing should look sharp or angular.
> Minimum radius for any interactive element: 10px.

---

## 6. Shadows & Elevation

### Light, subtle shadows only (Apple-inspired)

| Token | Value | שימוש |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(20, 19, 17, 0.04)` | pressed states |
| `shadow-md` | `0 2px 8px rgba(20, 19, 17, 0.06)` | cards, floating elements |
| `shadow-lg` | `0 8px 24px rgba(20, 19, 17, 0.08)` | modals, bottom sheets |
| `shadow-xl` | `0 16px 48px rgba(20, 19, 17, 0.12)` | dropdown menus |

### Rules
- Shadows are warm-tinted (using neutral-900 as base, not pure black)
- No colored shadows
- No shadow on every element — use sparingly for hierarchy
- Cards inside lists: no shadow, use border instead
- Floating elements (bottom sheet, modal, dropdown): shadow-lg

---

## 7. Component Patterns

### Primary Button
```
background: green-500
text: white, 15px, weight 600
padding: 16px vertical, 24px horizontal
border-radius: lg (14px)
height: 52px
haptic: impact(light) on press
active state: scale(0.98) + green-600 background
disabled: opacity 0.5
```

### Secondary Button
```
background: cream-100
text: green-700, 15px, weight 500
border: 1px solid cream-300
border-radius: lg (14px)
height: 48px
active state: cream-200 background
```

### Ghost Button
```
background: transparent
text: green-500, 15px, weight 500
border: none
active state: green-50 background
```

### Input Field
```
background: cream-50
border: 1.5px solid cream-300
border-radius: md (10px)
padding: 14px 16px
font: body (15px)
placeholder: neutral-400
focus border: green-500
error border: danger-500
height: 50px
RTL: text-align start
```

### Card
```
background: white (#FFFFFF)
border: 1px solid cream-200
border-radius: lg (14px)
padding: 16px
shadow: none (inside lists) or shadow-md (standalone)
```

### Checklist Item — Pass (V)
```
icon background: success-50
icon: checkmark, success-500, stroke 2.5
text: neutral-700
subtitle: success-500 "תקין"
border: 1px solid cream-200
```

### Checklist Item — Fail (X)
```
icon background: danger-50
icon: X mark, danger-500, stroke 2.5
text: neutral-700
subtitle: danger-700 "ליקוי — [severity]"
border: 2px solid danger-500 (critical) / warning-500 (medium)
expanded: shows defect details on cream-50 background
```

### Checklist Item — N/A (-)
```
icon background: neutral-100
icon: dash, neutral-400
text: neutral-400 (muted)
subtitle: "לא רלוונטי"
```

### Checklist Item — Pending (?)
```
icon background: cream-100
icon: dashed border circle, neutral-300
text: neutral-400
awaiting user input
```

### Severity Selector
```
Three pills side by side:
- Critical: danger-50 bg, danger-500 border when selected, danger-700 text
- Medium: warning-50 bg, warning-500 border when selected, warning-700 text
- Low: info-50 bg, info-500 border when selected, info-700 text
Selected state: filled bg + colored border
Unselected: neutral-100 bg, neutral-300 border
```

### Category Pill
```
Selected: green-50 bg, green-500 border, green-700 text
Unselected: cream-100 bg, cream-300 border, neutral-600 text
border-radius: full
padding: 8px 16px
font: caption-medium
```

### Bottom Sheet
```
background: white
border-radius: xl (20px) top corners
shadow: shadow-lg
handle: 36px wide, 4px tall, neutral-300, border-radius full
backdrop: black at 40% opacity with blur (iOS)
animation: spring, 300ms
```

### Tab Bar
```
background: white with cream-200 top border
height: 84px (including safe area)
active icon: green-500
active label: green-700, caption-medium
inactive icon: neutral-400
inactive label: neutral-500, caption
haptic: selection() on tab change
```

### Room Tabs (horizontal scroll)
```
active: green-500 bg, white text, shadow-sm
inactive: cream-100 bg, neutral-600 text
border-radius: full
padding: 8px 18px
gap: 8px
horizontal scroll with snap
```

### Photo Thumbnail
```
border-radius: lg (14px)
width/height: square or 4:3
overlay badge (number): top-left, 18px circle, green-500 bg, white text
add photo button: dashed border, neutral-300, border-radius lg
```

### Signature Area
```
background: cream-50
border: 1.5px dashed neutral-300
border-radius: lg (14px)
height: 160px
placeholder text: "חתום כאן" centered, neutral-400
Skia canvas with pressure sensitivity
clear button: top-right, ghost style
```

---

## 8. Iconography

### Library: Lucide Icons
- Style: 1.5px stroke, rounded caps and joins
- Default size: 20px (in buttons/list items), 24px (in headers)
- Color: inherits from parent context
- Never filled — always stroke only

### Custom Icons (if needed)
- Match Lucide style: 1.5px stroke, 24px viewbox
- Rounded line caps and joins
- Single color, no fills

---

## 9. Animation & Motion

### Principles
- Every animation has a purpose (feedback, transition, draw attention)
- No gratuitous animations — this is a professional tool, not a game
- Duration: 150-300ms for micro-interactions, 300-500ms for screen transitions
- Easing: spring for natural feel (Reanimated spring config)

### Specific Animations
| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Button press | scale(0.98) + bg change | 100ms |
| Tab switch | fade + slide | 200ms |
| Bottom sheet open | spring from bottom | 300ms |
| Card appear | fade in + slide up 8px | 200ms |
| Checklist V/X | scale bounce (1.0 → 1.15 → 1.0) + haptic | 250ms |
| Photo added | thumbnail zoom in from center | 200ms |
| Success toast | slide down from top + fade | 300ms |
| Pull to refresh | native iOS/Android behavior | system |
| Swipe actions | follow finger + spring settle | physics |

---

## 10. RTL Layout Rules

### Mandatory (Israeli market)
```
- html/root: dir="rtl"
- All text: text-align start (= right in RTL)
- Flexbox: flex-row automatically flips
- Use logical properties: ms/me/ps/pe (not ml/mr/pl/pr)
- Directional icons (arrows, chevrons): rtl:rotate-180
- Non-directional icons (search, settings, check): NO rotation
- Phone numbers: dir="ltr" inside RTL context
- Emails: dir="ltr" inside RTL context
- Sidebar/nav: right side (natural in RTL)
```

---

## 11. PDF Report Design

### Style: מקצועי-מודרני
```
- Paper: A4
- Font: Rubik (Hebrew), Inter (numbers)
- Header: green-700 background strip, white logo + company name
- Colors: green accents on headers, cream backgrounds for tables
- Defects table: alternating cream-50 / white rows
- Severity badges: colored pills matching app design
- Photos: rounded corners (8px), with numbered badges
- Signature area: bordered box with date and name
- Footer: page numbers, generation date, DocField branding (subtle)
- Direction: RTL
```

---

## 12. Design System Libraries

### Base Components: react-native-reusables
Copy-paste components into apps/mobile/src/components/ui/
Customize colors and styles to match DocField palette.

### Native Feel: NativeWindUI (selected components)
Action Sheet, Date Picker, Activity Indicator — native look.

### Icons: lucide-react-native
Consistent stroke icons throughout the app.

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F7F4',
          100: '#D1E7DD',
          200: '#A3D1B5',
          300: '#6DB88C',
          400: '#3D9B66',
          500: '#1B7A44',
          600: '#14643A',
          700: '#0F4F2E',
          800: '#0A3B22',
          900: '#062818',
        },
        cream: {
          50: '#FEFDFB',
          100: '#FBF8F3',
          200: '#F5EFE6',
          300: '#EBE1D3',
          400: '#D9CBBA',
          500: '#BCA78E',
        },
        gold: {
          100: '#FDF4E7',
          300: '#F0C66B',
          500: '#C8952E',
          700: '#8B6514',
        },
        neutral: {
          50: '#FAFAF8',
          100: '#F2F1EE',
          200: '#E5E3DF',
          300: '#D1CEC8',
          400: '#A8A49D',
          500: '#7A766F',
          600: '#5C5852',
          700: '#3D3A36',
          800: '#252420',
          900: '#141311',
        },
      },
      fontFamily: {
        rubik: ['Rubik', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
      },
    },
  },
};
```

---

## 13. Dark Mode

> **MVP: Light Mode only.**
> ה-Design System בנוי עם tokens שקל להפוך ל-Dark Mode בהמשך.
> כשנוסיף Dark Mode, ה-cream רקע יהפוך לירוק כהה מאוד,
> והירוק הראשי יהפוך לירוק בהיר יותר.

---

## 14. Logo

> **לוגו ייעוצב בנפרד.**
> בינתיים, שימוש ב-text logo: "DocField" בפונט Rubik weight 700,
> בצבע green-700, עם אייקון document + location pin קטן.

---

## 15. Claude Code Skills — Design Intelligence

> **קריטי: ה-Skills האלה הם מה שהופך את DocField מ"אפליקציה גנרית"
> ל"אפליקציה שמרגישה כאילו מעצב מקצועי עיצב אותה".**

### Skills להתקנה (חובה לפני כתיבת קוד UI)

#### 1. `bencium-controlled-ux-designer`
```bash
/plugin marketplace add bencium/bencium-marketplace
/plugin install bencium-controlled-ux-designer@bencium-marketplace
```
**מה זה נותן:**
- Design Decision Protocol — שואל לפני שמחליט על צבעים, טיפוגרפיה, layout
- MOTION-SPEC.md — הגדרות אנימציה מדויקות (easing curves, durations, spring configs)
- Anti-patterns — מונע "AI slop" (עיצוב גנרי, שטוח, חסר אישיות)
- Accessibility — WCAG 2.1 AA מובנה בכל החלטה
- Interaction patterns — hover, focus, active, disabled states מוגדרים

**איך להשתמש:** Claude Code טוען את ה-Skill אוטומטית כשמבקשים ממנו לבנות UI.

#### 2. `ui-ux-pro-max`
```bash
npm install -g uipro-cli
cd docfield
uipro init --ai claude
```
**מה זה נותן:**
- 50+ סגנונות עיצוב עם CSS keywords ו-AI prompts
- 161 פלטות צבעים לפי סוג מוצר
- 57 זוגות פונטים עם Google Fonts imports
- 99 הנחיות UX ו-anti-patterns
- חיפוש ספציפי ל-React Native stack
- מייצר Design System שלם אוטומטית

**פקודות מפתח לשימוש ב-DocField:**
```bash
# חיפוש סגנון לאפליקציית בנייה
python3 search.py "construction field inspection premium" --design-system

# הנחיות React Native ספציפיות
python3 search.py "list performance navigation" --stack react-native

# פלטת צבעים לפי סוג מוצר
python3 search.py "construction B2B green earth" --domain color

# טיפוגרפיה מתאימה
python3 search.py "professional hebrew RTL" --domain typography
```

#### 3. `bencium-innovative-ux-designer` (אופציונלי — למסכים מיוחדים)
```bash
/plugin install bencium-innovative-ux-designer@bencium-marketplace
```
**מתי להשתמש:** Onboarding, Landing page, Empty states, Success screens.
**הגישה:** "Bold creativity meets production rigor" — עיצוב ייחודי שלא נראה כמו כל אפליקציה אחרת.

### איך ה-Skills משתלבים עם ה-Design System שלנו

```
סדר עדיפויות:
1. Design System של DocField (המסמך הזה) = מקור האמת לצבעים, פונטים, spacing
2. bencium-controlled-ux-designer = כללי interaction design, motion, accessibility
3. ui-ux-pro-max = חיפוש השראה, המלצות ספציפיות ל-React Native
4. react-native-reusables = base components (copy-paste + customize)

Claude Code חייב:
- לעקוב אחרי הפלטה של DocField (ירוק כהה + קרם) — לא לשנות צבעים
- להשתמש ב-motion specs של bencium ל-transitions ו-animations
- להריץ ui-ux-pro-max search כשמתלבט בהחלטת עיצוב
- ליישם כל component עם: hover state, active state, focus state, disabled state
- להוסיף micro-interactions: scale on press, fade on appear, spring on sheet open
- להשתמש ב-shadows עדינות (warm-tinted, לא שחור טהור)
- לא לייצר "flat" UI — כל אלמנט צריך עומק ותחושת מגע
```

### Anti-Patterns — מה Claude Code אסור לעשות

```
❌ כפתורים שטוחים לחלוטין בלי hover/active state
❌ רשימות ללא אנימציית כניסה (items צריכים staggered fade-in)
❌ מעברי מסך חדים (cut) — תמיד fade/slide transition
❌ Bottom sheet שנפתח בלי animation
❌ Cards ללא shadow כלל (לפחות shadow-sm)
❌ אייקונים ללא interactive feedback
❌ טקסט placeholder בצבע כהה מדי (חייב להיות neutral-400)
❌ כפתור ראשי ללא shadow עדין
❌ Spacing אחיד — חייב להיות visual hierarchy דרך spacing
❌ "SaaS blue" (#3B82F6) כצבע ראשי — אנחנו ירוק כהה
```

### Must-Have Interaction Patterns

```
✅ Pull-to-refresh עם custom animation (לא ברירת מחדל של מערכת)
✅ Swipe actions על כרטיסי ליקויים (swipe = פעולה מהירה)
✅ Long press = context menu עם blur background
✅ Haptic feedback על כל פעולה משמעותית
✅ Skeleton screens בטעינה (לא רק spinner)
✅ Empty states מעוצבים (אייקון + טקסט + CTA)
✅ Toast notifications שנכנסים מלמעלה עם spring animation
✅ Photo zoom עם pinch-to-zoom חלק
✅ Floating Action Button (FAB) עם shadow ו-scale animation
✅ Progress indicators עם animation (לא סתם bar סטטי)
✅ Staggered list animations (פריטים נכנסים אחד אחרי השני)
✅ Parallax header שמתכווץ בגלילה (Large Title → Small Title)
```

---

## אישורים

| פריט | סטטוס | תאריך |
|------|--------|------|
| Design System | ⬜ ממתין לאישור חיים | — |

---

*DocField Design System | מרץ 2026*

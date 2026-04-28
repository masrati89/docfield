# ניתוח מצב קיים: מאגר ממצאים

**תאריך:** 2026-04-28  
**שלב:** Phase 1 — ניתוח מצב קיים

---

## 📱 מבנה UI הקיים

### קובץ: `apps/mobile/app/(app)/library/index.tsx`

#### מה שקיים:
1. **Header** - "מאגר ממצאים" עם תפריט חזרה וcounter של ממצאים
2. **Search Bar** - input טקסט עם icon חיפוש (קיים כבר)
3. **Category Chips** - horizontal scroll עם chips לבחירה:
   - "הכל" chip כברירת מחדל
   - חיפוש קטגוריה בודדת בכל פעם (single-select בלבד)
4. **Results List** - FlatList עם ממצאים בודדים
5. **States ממומשים:**
   - Loading: skeleton screens עם 7 קלאים
   - Error: error message + "נסה שוב" button
   - Empty: custom empty state עם icon וtext
   - Results: FlatList עם animate FadeInUp

#### מה שחסר:
- ❌ סינון לפי תקן (standard)
- ❌ multi-select קטגוריות (רק single-select)
- ❌ grouping intelligent (flat list בלבד)
- ❌ dropdowns (רק chips)

---

## 🔌 API ו-Data Hooks

### Hook: `useDefectLibrary()`

**מיקום:** `apps/mobile/hooks/useDefectLibrary.ts`

#### מה הוא מחזיר:
```typescript
{
  items: DefectLibraryItem[]         // תוצאות מסוננות
  allItems: DefectLibraryItem[]      // כל הממצאים
  categories: string[]               // רשימת קטגוריות
  isLoading: boolean
  isRefreshing: boolean
  error: boolean
  searchQuery: string
  setSearchQuery: (q: string) => void
  categoryFilter: string | null
  setCategoryFilter: (c: string | null) => void
  deleteItem, addItem, updateItem    // mutations
  findSimilar: (title: string) => SimilarityMatch | null
  refetch: () => void
}
```

#### DefectLibraryItem structure:
```typescript
{
  id: string
  title: string                      // title או description fallback
  category: string                   // קטגוריה עברית
  location: string                   // כרגע תמיד ריק ('')
  standardRef: string | null         // standard_reference מהDB
  recommendation: string | null
  cost: number | null
  costUnit: string | null
  notes: string | null
  price: number | null               // price מהDB
  source: 'system' | 'user'
  userId: string | null
  usage_count?: number
}
```

#### Search Logic (קיים):
- **Text search:** Fuse.js fuzzy matching עם threshold 0.4
  - חפש ב-`title` ו-`category`
  - debounce: כרגע חלק מה-UI, לא בהook
- **Category filter:** exact equality match
  - `item.category === categoryFilter`
  - single-select בלבד

#### שימוש ב-Query:
```typescript
const { data, error } = await supabase
  .from('defect_library')
  .select('id, title, description, category, standard_reference, 
           recommendation, price, is_global, organization_id, usage_count')
  .order('category')
  .order('description');
```

#### CRUD operations (ממומשות):
- ✅ Add item (user items רק)
- ✅ Update item (user items רק)
- ✅ Delete item (user items רק)
- ✅ Find similar (לפי כמות מילים משותפות)

---

## 🗄️ Database Schema

### Table: `defect_library`

**סך הכל:** 338 ממצאים

#### עמודות זמינות:
| Column | Type | Nullable | הערה |
|--------|------|----------|------|
| id | UUID | NO | primary key |
| title | text | YES | תיאור קצר |
| description | text | YES | תיאור מלא |
| category | text | YES | קטגוריה (עברית) |
| standard_reference | text | YES | דרישה מלאה (ארוך מאוד) |
| **standard** | text | YES | **עמודה זו טרם בשימוש** |
| standard_description | text | YES | הסבר התקן |
| recommendation | text | YES | המלצה לתיקון |
| price | numeric | YES | עלות בהשערה |
| cost_unit | text | YES | יחידת עלות |
| usage_count | integer | YES | מספר פעמים שהשתמשו |
| location | text | YES | חדר/מקום |
| cost | numeric | YES | |
| source | text | YES | 'system' או 'user' |
| is_global | boolean | YES | true = system, false = user |
| user_id | UUID | YES | יוצר המפריט |
| organization_id | UUID | YES | ארגון |
| created_at | timestamp | YES | |
| updated_at | timestamp | YES | |
| last_used_at | timestamp | YES | |
| default_severity | text | YES | |

---

## 📊 Data Summary

### קטגוריות (20 סה"כ):
```
אבן ושיש
איטום
אינסטלציה (מים וביוב)
אלומיניום
גבס
גז
דלתות פנים ונגרות
חדר מדרגות
חשמל
טיח ושפכטל
כיבוי אש
כלים סניטריים
לובי ורכוש משותף
מיזוג אוויר
מסגרות ברזל ומעקות
מעלית
נגישות
צביעה
רטיבות ועובש
ריצוף וחיפוי קרמיקה
```

### סטנדרטים (286 ערכים שונים):
- חלק מהם עברית (כל הדרישה המלאה)
- חלק מהם ריקים (NULL)
- **לדוגמה:**
  - "חוק החשמל, ת"י 61 — כל שקע חייב הארקה תקינה"
  - "חדר מדרגות מוגן חייב לכלול פתח אוורור"
  - וכו' — 286 values שונים!

---

## 🔍 פערים שזוהו

### ❌ סינון לפי תקן
- עמודה `standard` יש בDBase אבל לא בשימוש בקוד
- 286 ערכים שונים של תקנים — יש מה לסנן
- צריך dropdown או autocomplete לתקנים

### ❌ Multi-select קטגוריות
- כרגע רק single-select (קטגוריה אחת בכל פעם)
- user עשוי לרצות "טיח + צביעה" יחד
- צריך שינוי הלוגיקה: OR logic בכמה קטגוריות

### ❌ Dropdowns במקום Chips
- chips עובדים ל-single-select
- אבל עם 20 קטגוריות + 286 סטנדרטים, הUI תהיה צפופה מאוד
- dropdowns תופסות מקום יותר מעט

### ❌ Grouping חכם
- כרגע רק flat list
- אפשר לgroup:
  - **לפי קטגוריה** - אם סינן לפי תקן אחד
  - **לפי חדר** - אם סינן לפי קטגוריה אחת
  - **לא צריך** - אם ממלא מספר סינונים

### ❌ טעינה של Standard List
- צריך DISTINCT של `standard` column
- אבל טקסטים ארוכים מאוד (286 ערכים!)
- צריך להחליט: autocomplete או dropdown עם חיפוש

---

## 🎯 הזדמנויות לשיפור

### ביצועים:
- ✅ Fuse.js search כבר יעיל (fuzzy matching)
- ⚠️ סינון מרובה עלול להיות chaining של `filter()` calls
  - צריך להיות בעמודה אחת (OR/AND logic proper)

### UX:
- 🎨 Dropdowns יהיו נקיים יותר מ-20 chips
- 🔍 Search בתוך dropdown עבור סטנדרטים (286 items!)
- 🏷️ Multi-select chips ל-קטגוריות (ודומה לSearchOverlay שכבר יש)
- 📋 Grouped results כשיש הרבה קטגוריות

### Reusability:
- SearchOverlay כבר בנוי דומה לדבר זה
- יכול להשתמש באותו דפוס: chips + debounce + fuse + grouping

---

## 📝 סיכום - מה צריך לעשות

| Component | Status | פעולה |
|-----------|--------|------|
| Search bar | ✅ קיים | שימור כי, אך validate debounce בhook |
| Category chips | ⚠️ רק single | שינוי ל-multi-select עם OR logic |
| Standard filter | ❌ חסר | יצירת dropdown/autocomplete חדש |
| Grouping | ❌ חסר | הוספת SectionList conditional |
| Hook logic | ⚠️ חלקי | הרחבה עבור standard + multi-category |

---

## ✅ Ready for Phase 2

**ממצאים עיקריים:**
1. UI בסיסי קיים - צריך התאמות
2. Hooks כבר מכינים לחיפוש וסינון - צריך הרחבה
3. Database יש כל הנתונים הדרושים
4. 338 ממצאים מתפלגים על 20 קטגוריות ו-286 סטנדרטים
5. SearchOverlay הקיים הוא דרך טובה להשלם את הדפוסים

**הערות בעדיפות:**
- 🔴 **HIGH:** סינון מרובה קטגוריות (כמו SearchOverlay)
- 🟠 **MEDIUM:** סינון לפי תקן (286 ערכים = בחירה קשה)
- 🟡 **LOW:** Grouping ותצוגה (UX refinement)

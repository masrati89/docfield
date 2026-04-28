# Database & Search Bug Analysis

## 🔴 ROOT CAUSE IDENTIFIED

**Category Mismatch: English Code vs Hebrew Database**

### The Problem
- **DEFECT_CATEGORIES** constant (code): English values
  - `plumbing`, `electrical`, `plaster`, `painting`, `tiling`, etc.
- **defect_library** table (database): Hebrew values
  - `אינסטלציה`, `חשמל`, `טיח ושפכטל`, `צביעה`, `ריצוף וחיפוי קרמיקה`, etc.

### Proof
**Code definition:**
```typescript
// packages/shared/src/constants/categories.ts
export const DEFECT_CATEGORIES = [
  { value: 'plumbing', label: 'אינסטלציה (מים וביוב)', ... },
  { value: 'electrical', label: 'חשמל', ... },
  { value: 'plaster', label: 'טיח ושפכטל', ... },
  { value: 'painting', label: 'צביעה', ... },
  { value: 'tiling', label: 'ריצוף וחיפוי קרמיקה', ... },
  // ... 21 more categories
];
```

**Database seed:**
```sql
INSERT INTO defect_library (..., category, title, description, ...)
VALUES (NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'סדקים בטיח חיצוני...', ...),
       (NULL, NULL, 'system', 'טיח ושפכטל', NULL, 'סדקים בטיח פנימי...', ...),
       (NULL, NULL, 'system', 'אינסטלציה', NULL, 'דליפה במצנע...', ...),
       ...
```

---

## 📊 Database Structure

### defect_library Schema (Migration 030 / 031)

**Key columns:**
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Primary key |
| `title` | TEXT | Short title (usually NULL in seed) |
| `description` | TEXT | Full description (used as title in code) |
| `category` | TEXT | **HEBREW** — must match seed values |
| `usage_count` | INTEGER | Incremented when used |
| `recommendation` | TEXT | Default fix suggestion |
| `price` | NUMERIC | Default cost estimate |
| `is_global` | BOOLEAN | true = global, false = org-specific |

### Categories in Database (338 total items)

**All stored as Hebrew:**
```
אינסטלציה
אלומיניום
אלקטרוניקה ובקרה
בדק ואיטום קירות חיצוניים
בריאות וסביבה
גבס
דלתות חיצוניות
דלתות פנים ונגרות
חדר מדרגות
חדר שירות ופחים
חיפוי קיר
חשמל
כלים סניטריים
לובי ורכוש משותף
מיזוג אוויר וتהויה
מעלית
מעקות ודרגות בטיחות
מסגרות ברזל
עצים ומסגרות מתכתיות
צביעה
קירוי ואיטום תקרה
ריצוף וחיפוי קרמיקה
רטיבות ועובש
ריהוט בנוי
שיניים וריהוט מטבח (IKEA וכו')
תאורה
אבן ושיש
... [more]
```

---

## 💥 Impact on SearchOverlay

### Current Flow (BROKEN)

```
1. SearchOverlay renders CategoryChipsRow
   ↓
2. CategoryChipsRow maps DEFECT_CATEGORIES
   → Shows chips with labels: "חשמל", "אינסטלציה", etc.
   → But uses VALUES: "electrical", "plumbing" (English!)
   ↓
3. User selects chip (e.g., "חשמל")
   → selectionOrder becomes: ["electrical"]
   ↓
4. useSearchFilter filters by category
   → Queries: items where item.category === "electrical"
   ↓
5. Database has category = "חשמל" (Hebrew)
   → NO MATCH!
   ↓
6. NO RESULTS returned
```

### Why Text Search Works

```
useDefectLibrary uses Fuse.js:
  - Searches keys: ['title', 'category']
  - Uses FUZZY matching (threshold: 0.4)
  
So even though categories don't match exactly,
Fuse.js fuzzy matching on description/title returns results
```

---

## 🔧 Required Fixes

### Fix 1: Update DEFECT_CATEGORIES Values
**File:** `packages/shared/src/constants/categories.ts`

Change from:
```typescript
{ value: 'plumbing', label: 'אינסטלציה (מים וביוב)' }
```

To:
```typescript
{ value: 'אינסטלציה', label: 'אינסטלציה (מים וביוב)' }
```

**All 22 categories need this:**
| English (current) | Hebrew (required) |
|---|---|
| `plumbing` | `אינסטלציה` |
| `sanitary` | `כלים סניטריים` |
| `aluminum` | `אלומיניום` |
| `interior_doors` | `דלתות פנים ונגרות` |
| `steel_frames` | `מסגרות ברזל ומעקות` |
| `electrical` | `חשמל` |
| `plaster` | `טיח ושפכטל` |
| `painting` | `צביעה` |
| `waterproofing` | `איטום` |
| `moisture` | `רטיבות ועובש` |
| `tiling` | `ריצוף וחיפוי קרמיקה` |
| `stonework` | `אבן ושיש` |
| `gypsum` | `גבס` |
| `elevator` | `מעלית` |
| `stairs` | `חדר מדרגות` |
| `lobby` | `לובי ורכוש משותף` |
| `fire` | `כיבוי אש` |
| `hvac` | `מיזוג אוויר` |
| `accessibility` | `נגישות` |
| `gas` | `גז` |
| [more] | [more] |

### Fix 2: Update useDefectLibrary Query
**File:** `apps/mobile/hooks/useDefectLibrary.ts`

Add `title` column to SELECT (currently missing):
```typescript
// BEFORE
.select('id, description, category, standard_reference, recommendation, price, is_global, organization_id, usage_count')

// AFTER
.select('id, title, description, category, standard_reference, recommendation, price, is_global, organization_id, usage_count')
```

Update mapping to use `title` if available:
```typescript
// BEFORE
title: (d.description as string) ?? '',

// AFTER
title: (d.title as string) || (d.description as string) ?? '',
```

### Fix 3: Verify SearchOverlay Logic
**File:** `apps/mobile/components/reports/SearchOverlay.tsx`

The logic is correct, but will work once categories match:
```typescript
// This will work correctly once categories are fixed
const filteredItems = items.filter((item) =>
  selectedSet.has(item.category)  // Now will match!
);
```

---

## ✅ Verification Checklist

After fixes:

```sql
-- 1. Verify chip values
SELECT DISTINCT category FROM defect_library ORDER BY category;
-- Should show Hebrew values: אינסטלציה, חשמל, טיח ושפכטל, etc.

-- 2. Count items by category
SELECT category, COUNT(*) FROM defect_library GROUP BY category ORDER BY category;

-- 3. Sample search
SELECT id, title, description, category FROM defect_library 
WHERE category = 'טיח ושפכטל' 
LIMIT 5;
```

**Expected results:** 338 items across ~22-25 Hebrew categories

---

## 🧪 Test Plan

1. **Category filtering:**
   - Open SearchOverlay
   - Select category "חשמל" (electrical)
   - Should show 10-15 electrical items
   
2. **Text search:**
   - Type "סדק" (crack)
   - Should show items with cracks (already works)
   
3. **Combined filtering:**
   - Select 2+ categories
   - Type search term
   - Should AND text with OR categories

4. **Template prefill:**
   - Select item from SearchOverlay
   - Navigate to add-defect
   - Form should be prefilled with title, category, recommendation, etc.

---

## 📝 Summary

| Issue | Severity | Root Cause | Fix |
|-------|----------|-----------|-----|
| Category filtering broken | 🔴 CRITICAL | English values in code vs Hebrew in DB | Update DEFECT_CATEGORIES values to Hebrew |
| Missing title in query | 🟠 HIGH | Query doesn't select title column | Add `title` to SELECT clause |
| Initial results empty | 🟠 HIGH | No default categories shown | Works once categories are fixed |

All fixes are **safe, non-breaking changes** that align code with database reality.

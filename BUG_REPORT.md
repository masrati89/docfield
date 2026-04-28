# Bug Report: SearchOverlay Category Filter Broken

**Date:** 2026-04-28  
**Severity:** 🔴 CRITICAL  
**Status:** Root cause identified, fixes ready

---

## Bug Description

SearchOverlay component shows no results when filtering by categories, but text search works fine.

**Symptoms:**
1. Open report detail screen
2. Tap search icon → SearchOverlay opens
3. Select category chip (e.g., "חשמל")
4. Empty results shown despite 338 items in library
5. Type search term (e.g., "סדק") → Results appear ✓

---

## Root Cause

**Category value mismatch between code and database**

### Code Side
`packages/shared/src/constants/categories.ts` defines:
```typescript
{ value: 'electrical', label: 'חשמל' }  // English value
{ value: 'plaster', label: 'טיח ושפכטל' }
{ value: 'painting', label: 'צביעה' }
// ... etc
```

### Database Side
Migration 031 seeds all 338 items with **Hebrew category names**:
```sql
INSERT INTO defect_library (..., category, ...)
VALUES (..., 'חשמל', ...),
       (..., 'טיח ושפכטל', ...),
       (..., 'צביעה', ...),
       ...
```

### The Collision
SearchOverlay filtering logic:
```typescript
// User selects chip with value="electrical"
const selectedSet = new Set(['electrical']);

// Filter tries to match
items.filter(item => selectedSet.has(item.category))
// item.category = 'חשמל' (from DB)
// selectedSet = ['electrical'] (from code)
// NO MATCH → EMPTY RESULTS
```

---

## Why Text Search Works

`useDefectLibrary` uses Fuse.js fuzzy search:
```typescript
const fuse = new Fuse(items, {
  keys: ['title', 'category'],
  threshold: 0.4,  // 40% fuzzy match
  ignoreLocation: true,
});
```

Fuzzy matching finds results even with category mismatch. Direct equality filtering (`===`) does not.

---

## Impacted Code Locations

| File | Issue | Impact |
|------|-------|--------|
| `packages/shared/src/constants/categories.ts` | Category values are English | All category filtering broken |
| `apps/mobile/hooks/useDefectLibrary.ts` | Query missing `title` column | Title field shows description instead |
| `apps/mobile/components/reports/SearchOverlay.tsx` | Filtering logic is correct but upstream data wrong | No visible issue once DB matches code |

---

## Technical Details

### Table: defect_library
**Sample categories (all Hebrew):**
```
אינסטלציה              ← maps to 'plumbing' in code
כלים סניטריים           ← maps to 'sanitary' in code
אלומיניום              ← maps to 'aluminum' in code
דלתות פנים ונגרות      ← maps to 'interior_doors' in code
חשמל                 ← maps to 'electrical' in code
טיח ושפכטל             ← maps to 'plaster' in code
צביעה                 ← maps to 'painting' in code
ריצוף וחיפוי קרמיקה     ← maps to 'tiling' in code
רטיבות ועובש          ← maps to 'moisture' in code
מעלית                 ← maps to 'elevator' in code
```

**Count per category (338 total):**
```
טיח ושפכטל          12 items
רטיבות ועובש       8 items
אינסטלציה          15 items
[... more ...]
```

---

## Mapping Required

Complete mapping of **all 22 categories:**

| English (Code) | Hebrew (Database) |
|---|---|
| plumbing | אינסטלציה |
| sanitary | כלים סניטריים |
| aluminum | אלומיניום |
| interior_doors | דלתות פנים ונגרות |
| steel_frames | מסגרות ברזל ומעקות |
| electrical | חשמל |
| plaster | טיח ושפכטל |
| painting | צביעה |
| waterproofing | איטום |
| moisture | רטיבות ועובש |
| tiling | ריצוף וחיפוי קרמיקה |
| stonework | אבן ושיש |
| gypsum | גבס |
| elevator | מעלית |
| stairs | חדר מדרגות |
| lobby | לובי ורכוש משותף |
| fire | כיבוי אש |
| hvac | מיזוג אוויר |
| accessibility | נגישות |
| gas | גז |
| exterior_doors | דלתות חיצוניות |
| roofing | קירוי ואיטום תקרה |

---

## How to Verify the Bug

```bash
# 1. Check database categories
psql -h localhost -U postgres -d postgres
SELECT DISTINCT category FROM defect_library ORDER BY category;

# Expected: Hebrew values (אינסטלציה, חשמל, טיח ושפכטל, etc.)

# 2. Check code categories
grep "value: '" packages/shared/src/constants/categories.ts | head -5

# Expected: English values (plumbing, electrical, plaster, etc.)

# 3. Mismatch confirmed → Fix needed
```

---

## Fixes Required (See FIX_IMPLEMENTATION.md)

✅ [FIX 1] Update DEFECT_CATEGORIES values to Hebrew  
✅ [FIX 2] Add `title` column to useDefectLibrary query  
✅ [FIX 3] Test all category filtering scenarios  

---

## Testing After Fix

```typescript
// SearchOverlay should now:
1. Show initial empty state when opened
2. Allow user to select "חשמל" chip
3. Return 10-15 electrical defects
4. Allow combining 2+ categories
5. Allow text search within filtered results
6. Navigate to add-defect with template data prefilled
```

---

## Related Issues

- [H4] Add-defect template prefill — depends on this fix being complete
- [H5] SearchOverlay empty initial state — normal, by design (shows when filters active)
- Tab bar positioning — separate issue, already fixed

---

## Timeline

- **Bug discovered:** During library search implementation
- **Root cause identified:** 2026-04-28
- **Fixes:** Ready to implement
- **Estimated time to fix:** ~10 minutes (2 file changes)

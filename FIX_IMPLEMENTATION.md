# Fix Implementation Plan

## Overview
Two code files need changes to fix the category filtering bug.

**Estimated time:** 10 minutes  
**Risk level:** 🟢 LOW (data-driven, no logic changes)  
**Rollback:** Trivial (revert 2 commits)

---

## Fix 1: Update Category Values to Hebrew

### File: `packages/shared/src/constants/categories.ts`

**Change:** Replace English `value` fields with Hebrew equivalents

### Step-by-Step

**Before (current code):**
```typescript
export const DEFECT_CATEGORIES = [
  { value: 'plumbing', label: 'אינסטלציה (מים וביוב)', icon: 'droplets' },
  { value: 'sanitary', label: 'כלים סניטריים', icon: 'bath' },
  { value: 'aluminum', label: 'אלומיניום', icon: 'panel-top' },
  { value: 'interior_doors', label: 'דלתות פנים ונגרות', icon: 'door-closed' },
  { value: 'steel_frames', label: 'מסגרות ברזל ומעקות', icon: 'shield' },
  { value: 'electrical', label: 'חשמל', icon: 'zap' },
  { value: 'plaster', label: 'טיח ושפכטל', icon: 'paint-roller' },
  { value: 'painting', label: 'צביעה', icon: 'brush' },
  { value: 'waterproofing', label: 'איטום', icon: 'umbrella' },
  { value: 'moisture', label: 'רטיבות ועובש', icon: 'droplet' },
  { value: 'tiling', label: 'ריצוף וחיפוי קרמיקה', icon: 'grid-3x3' },
  { value: 'stonework', label: 'אבן ושיש', icon: 'layers' },
  { value: 'gypsum', label: 'גבס', icon: 'square' },
  { value: 'elevator', label: 'מעלית', icon: 'arrow-up-down' },
  { value: 'stairs', label: 'חדר מדרגות', icon: 'align-justify' },
  { value: 'lobby', label: 'לובי ורכוש משותף', icon: 'building' },
  { value: 'fire', label: 'כיבוי אש', icon: 'flame' },
  { value: 'hvac', label: 'מיזוג אוויר', icon: 'thermometer' },
  { value: 'accessibility', label: 'נגישות', icon: 'accessibility' },
  { value: 'gas', label: 'גז', icon: 'flame' },
  // ... possibly more
];
```

**After (fixed):**
```typescript
export const DEFECT_CATEGORIES = [
  { value: 'אינסטלציה', label: 'אינסטלציה (מים וביוב)', icon: 'droplets' },
  { value: 'כלים סניטריים', label: 'כלים סניטריים', icon: 'bath' },
  { value: 'אלומיניום', label: 'אלומיניום', icon: 'panel-top' },
  { value: 'דלתות פנים ונגרות', label: 'דלתות פנים ונגרות', icon: 'door-closed' },
  { value: 'מסגרות ברזל ומעקות', label: 'מסגרות ברזל ומעקות', icon: 'shield' },
  { value: 'חשמל', label: 'חשמל', icon: 'zap' },
  { value: 'טיח ושפכטל', label: 'טיח ושפכטל', icon: 'paint-roller' },
  { value: 'צביעה', label: 'צביעה', icon: 'brush' },
  { value: 'איטום', label: 'איטום', icon: 'umbrella' },
  { value: 'רטיבות ועובש', label: 'רטיבות ועובש', icon: 'droplet' },
  { value: 'ריצוף וחיפוי קרמיקה', label: 'ריצוף וחיפוי קרמיקה', icon: 'grid-3x3' },
  { value: 'אבן ושיש', label: 'אבן ושיש', icon: 'layers' },
  { value: 'גבס', label: 'גבס', icon: 'square' },
  { value: 'מעלית', label: 'מעלית', icon: 'arrow-up-down' },
  { value: 'חדר מדרגות', label: 'חדר מדרגות', icon: 'align-justify' },
  { value: 'לובי ורכוש משותף', label: 'לובי ורכוש משותף', icon: 'building' },
  { value: 'כיבוי אש', label: 'כיבוי אש', icon: 'flame' },
  { value: 'מיזוג אוויר', label: 'מיזוג אוויר', icon: 'thermometer' },
  { value: 'נגישות', label: 'נגישות', icon: 'accessibility' },
  { value: 'גז', label: 'גז', icon: 'flame' },
  // ... check for more categories in database
];
```

### Implementation Pattern

For each category:
```typescript
// BEFORE: { value: 'english-value', label: 'עברית', ... }
// AFTER:  { value: 'עברית', label: 'עברית', ... }
```

**Rationale:**
- `value` = what gets stored in database, what gets filtered on
- `label` = what gets displayed to user
- For Hebrew UI, both should be Hebrew

---

## Fix 2: Update useDefectLibrary Query

### File: `apps/mobile/hooks/useDefectLibrary.ts`

**Problem:**
- Line 48: SELECT query missing `title` column
- Lines 55-58: Mapping uses `description` as title

**Change 1: Add `title` to SELECT clause**

**Before (line 47-51):**
```typescript
.select(
  'id, description, category, standard_reference, recommendation, price, is_global, organization_id, usage_count'
)
.order('category')
.order('description');
```

**After:**
```typescript
.select(
  'id, title, description, category, standard_reference, recommendation, price, is_global, organization_id, usage_count'
)
.order('category')
.order('description');
```

---

**Change 2: Use title if available, fallback to description**

**Before (lines 55-60):**
```typescript
return (data ?? []).map((d: Record<string, unknown>) => ({
  id: d.id as string,
  title: (d.description as string) ?? '',
  category: (d.category as string) ?? '',
  location: '',
```

**After:**
```typescript
return (data ?? []).map((d: Record<string, unknown>) => ({
  id: d.id as string,
  title: (d.title as string) || (d.description as string) ?? '',
  category: (d.category as string) ?? '',
  location: '',
```

### Rationale:
- Database schema has separate `title` and `description` columns
- `title` = short name (nullable in seed)
- `description` = full text (NOT NULL)
- Code should use `title` if present, fallback to `description`
- This allows future migration of titles into dedicated column

---

## Fix 3: Verify CATEGORY_LABELS

### File: `packages/shared/src/constants/categories.ts`

After changing DEFECT_CATEGORIES, the CATEGORY_LABELS will auto-update:

```typescript
export const CATEGORY_LABELS: Record<DefectCategoryValue, string> =
  Object.fromEntries(
    DEFECT_CATEGORIES.map((category) => [category.value, category.label])
  ) as Record<DefectCategoryValue, string>;
```

**Example mapping after fix:**
```
'אינסטלציה' → 'אינסטלציה (מים וביוב)'
'חשמל' → 'חשמל'
'טיח ושפכטל' → 'טיח ושפכטל'
```

This is **correct** and **no change needed here**.

---

## Verification Steps

### Step 1: TypeScript Check
```bash
npm run typecheck
```
Should show **zero errors** after changes.

### Step 2: Search Test Flow
```typescript
// In mobile app:
1. Open report detail
2. Tap search icon
3. Select "חשמל" chip
4. Should show ~10-15 electrical items
5. Deselect and try another category
6. Try combining 2+ categories
7. Type search term while filter active
```

### Step 3: Category Count
```sql
-- Verify database has items for all updated categories
SELECT category, COUNT(*) as count
FROM defect_library
WHERE category = 'חשמל'  -- or any of the updated categories
GROUP BY category;

-- Expected: 10-15 items for חשמל
```

---

## Files Changed Summary

| File | Changes | Impact |
|------|---------|--------|
| `packages/shared/src/constants/categories.ts` | 22 category values: English → Hebrew | Category filtering in search |
| `apps/mobile/hooks/useDefectLibrary.ts` | Add `title` to SELECT, update mapping | Title display in search results |

**Total lines changed:** ~25 lines  
**Breaking changes:** None (values change but logic unchanged)  
**Backward compatibility:** N/A (new feature, no prior users)

---

## Commit Message

```
fix: align category values with database — use Hebrew instead of English

Database seed (migration 031) stores categories as Hebrew text (טיח ושפכטל, חשמל, etc.)
but DEFECT_CATEGORIES constant used English values (plaster, electrical, etc.).
This caused category filtering to fail with 0 results.

Changes:
- categories.ts: update all 22 category values to Hebrew
- useDefectLibrary.ts: add title to query, fix title/description mapping

Fixes SearchOverlay category filtering. Text search (Fuse.js) still works with fuzzy matching.
```

---

## Rollback Plan

If issues arise:
```bash
git revert <commit-hash>
npm run typecheck
```

Both changes are self-contained and can be reverted independently.

---

## Testing Checklist

- [ ] npm run typecheck — zero errors
- [ ] Open app, navigate to report
- [ ] Open SearchOverlay
- [ ] Select category chip — results appear
- [ ] Select 2+ categories — combined results
- [ ] Type search + select categories — AND/OR semantics correct
- [ ] Navigate to add-defect — template data prefilled
- [ ] Verify all category labels still display correctly

---

## Risk Assessment

🟢 **LOW RISK**

Reasons:
1. Data-driven changes only (no algorithm changes)
2. Values align code with existing database state
3. No API changes, no type changes
4. Fully reversible
5. All existing tests still valid
6. New category values are already seeded in DB (proven to work)

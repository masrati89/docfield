# Test Plan: SearchOverlay Category Filtering

**Date:** 2026-04-28  
**Scope:** Category filtering, text search, template prefill  
**Duration:** ~15 minutes  
**Platform:** Mobile (iOS/Android) + Web

---

## Pre-Test Setup

### Verify Fixes Applied
```bash
# 1. Check categories.ts was updated
grep "value: 'אינסטלציה'" packages/shared/src/constants/categories.ts
# Expected: One match with Hebrew value

# 2. Check useDefectLibrary includes title
grep "id, title, description" apps/mobile/hooks/useDefectLibrary.ts
# Expected: title in SELECT clause

# 3. Typecheck passes
npm run typecheck
# Expected: Zero errors
```

### Database State
```sql
-- Verify defect_library has data
SELECT COUNT(*) as total_count FROM defect_library WHERE is_global = true;
-- Expected: ~338 items

SELECT DISTINCT category FROM defect_library ORDER BY category LIMIT 5;
-- Expected: Hebrew categories (אינסטלציה, חשמל, טיח ושפכטל, etc.)
```

---

## Test Scenarios

### Scenario 1: Initial SearchOverlay Open

**Steps:**
1. Navigate to a report detail screen
2. Tap the search icon (magnifying glass) in ReportActionsBar
3. SearchOverlay bottom sheet opens

**Expected Results:**
- ✓ Bottom sheet slides up with header "חיפוש ממצאים"
- ✓ Search input field visible and focused (cursor active)
- ✓ Category chips visible below search box (horizontal scroll)
- ✓ Chips show Hebrew labels: "חשמל", "אינסטלציה", "טיח ושפכטל", etc.
- ✓ InitialEmptyState shown: "בחר קטגוריות או חפש"
- ✓ No results displayed yet

**Failure Signs:**
- ❌ English chip labels (electrical, plumbing)
- ❌ InitialEmptyState not showing
- ❌ Results showing without filter active
- ❌ Bottom sheet doesn't open

---

### Scenario 2: Single Category Selection

**Steps:**
1. [From Scenario 1]
2. Tap category chip "חשמל" (electrical)
3. Watch for results

**Expected Results:**
- ✓ Chip becomes filled (green background)
- ✓ "נקה" (clear) button appears on right
- ✓ Results list appears below with **electrical defects only**
- ✓ Items show with title, category badge, price (if available)
- ✓ 10-15 electrical items displayed
- ✓ No empty state message

**Failure Signs:**
- ❌ No results appear (THE BUG)
- ❌ NoResultsEmptyState shown
- ❌ All items shown (filter ignored)
- ❌ Chip doesn't highlight

**Electrical Items Examples:**
Should include items about:
- Disconnected outlets
- Broken switches
- Exposed wiring
- Circuit breaker issues
- Missing covers
- Wiring damage

---

### Scenario 3: Multiple Category Selection

**Steps:**
1. [From Scenario 2, with חשמל selected]
2. Tap another category, e.g., "טיח ושפכטל" (plaster)
3. Watch for results

**Expected Results:**
- ✓ Both chips become filled (green background)
- ✓ Results update to show **both electrical AND plaster defects**
- ✓ Results are grouped by category (2+ chips → SectionList)
- ✓ Two section headers: "חשמל (12)" and "טיח ושפכטל (8)"
- ✓ Items sorted by usage_count (descending), then alphabetically
- ✓ Total ~20 items shown

**Failure Signs:**
- ❌ Only one category's results shown
- ❌ Results not grouped (should use SectionList)
- ❌ Sections not labeled with category
- ❌ Items not sorted by usage_count

---

### Scenario 4: Category Deselection

**Steps:**
1. [From Scenario 3, with חשמל and טיח ושפכטל selected]
2. Tap "נקה" (clear) button on right
3. Watch for results

**Expected Results:**
- ✓ Both chips become unselected (transparent background)
- ✓ "נקה" button disappears
- ✓ InitialEmptyState shown again: "בחר קטגוריות או חפש"
- ✓ No results displayed

**Failure Signs:**
- ❌ Chips still selected
- ❌ Results still showing
- ❌ Clear button still visible

---

### Scenario 5: Text Search (No Category Filter)

**Steps:**
1. [From Scenario 4, with no filters active]
2. Tap search input field
3. Type: "סדק" (crack)
4. Wait for 250ms debounce

**Expected Results:**
- ✓ Keyboard appears (mobile)
- ✓ Text "סדק" shows in input field
- ✓ **Results appear with items containing "סדק"**
- ✓ Defects about cracks, breaks, damage shown
- ✓ Results show across **all categories**
- ✓ Using FlatList (0-1 chips active)

**Failure Signs:**
- ❌ No results (text search broken)
- ❌ Only category-specific results
- ❌ Results appear before 250ms debounce (should wait)

**Expected Items:**
- "סדקים בטיח חיצוני"
- "סדקים בטיח פנימי"
- "סדק אלכסוני מעל משקוף"
- And other crack-related items

---

### Scenario 6: Combined Search + Category Filter

**Steps:**
1. [From Scenario 5, with "סדק" text search active]
2. Tap category chip "טיח ושפכטל" (plaster)
3. Watch for results

**Expected Results:**
- ✓ Results filtered to **only plaster items containing "סדק"**
- ✓ Much smaller result set (probably 3-5 items)
- ✓ Using SectionList (2+ chips, although 1 visible)
- ✓ Section header: "טיח ושפכטל (3)"
- ✓ All items are crack-related plaster defects

**Failure Signs:**
- ❌ All "סדק" items shown (category ignored)
- ❌ All plaster items shown (text ignored)
- ❌ Results empty (too strict filtering)

**Expected Items:**
- "סדקים בטיח חיצוני"
- "סדקים בטיח פנימי"
- "סדק אלכסוני מעל משקוף"

---

### Scenario 7: Clear Text Search

**Steps:**
1. [From Scenario 6]
2. Tap X button on right side of search input (clears text)

**Expected Results:**
- ✓ Text field becomes empty
- ✓ Results update to show **all items in selected category** (טיח ושפכטל)
- ✓ Now showing 12 plaster items (not just crack-related)
- ✓ All plaster items sorted by usage_count

**Failure Signs:**
- ❌ Text not cleared
- ❌ Results don't update
- ❌ Wrong category shown

---

### Scenario 8: Result Item Selection

**Steps:**
1. [From Scenario 7, with plaster category selected]
2. Tap on a result item (e.g., "סדקים בטיח חיצוני")
3. Wait for navigation

**Expected Results:**
- ✓ SearchOverlay closes automatically
- ✓ Navigation to add-defect screen
- ✓ URL includes route params: `templateId=<item-id>`
- ✓ Form fields are **prefilled** with template data:
  - Title: "סדקים בטיח חיצוני"
  - Category: "טיח ושפכטל"
  - Location: "" (if template has)
  - Recommendation: "ניקוי והרחבת הסדק..."
  - Standard: "ת"י 1415..."
  - Price: 150 (if available)

**Failure Signs:**
- ❌ Overlay doesn't close
- ❌ Navigation doesn't happen
- ❌ URL missing templateId
- ❌ Form fields empty (prefill failed)
- ❌ Wrong item data populated

---

### Scenario 9: Keyboard Interaction

**Steps:**
1. [From Scenario 1]
2. Tap search input field
3. Type on mobile keyboard
4. Tap outside (blur)

**Expected Results:**
- ✓ Keyboard appears on tap
- ✓ Text appears in real-time
- ✓ Debounce waits 250ms before updating results
- ✓ Keyboard dismisses on blur
- ✓ Results persist after blur

**Failure Signs:**
- ❌ Keyboard doesn't appear
- ❌ Results update immediately (no debounce)
- ❌ Results clear on blur
- ❌ Input lag/jank

---

### Scenario 10: Loading State (First Open)

**Steps:**
1. Close SearchOverlay
2. Tap search again (with network connected)
3. Watch for loading indicator

**Expected Results:**
- ✓ Loading spinner shown initially
- ✓ Spinner centered in content area
- ✓ After ~500ms, spinner disappears
- ✓ Categories and library items appear
- ✓ InitialEmptyState shown (no filter)

**Failure Signs:**
- ❌ No loading state
- ❌ Spinner stays visible
- ❌ Results jump in place (layout shift)

---

### Scenario 11: Empty Results State

**Steps:**
1. [From Scenario 2, with חשמל selected]
2. Tap search input field
3. Type: "xyzabc123" (non-existent text)
4. Wait for debounce

**Expected Results:**
- ✓ NoResultsEmptyState shown
- ✓ Message: "לא נמצאו ממצאים"
- ✓ Subtitle: "נסה לשנות את הסינון או את מילת החיפוש"
- ✓ Icon displayed (search icon)

**Failure Signs:**
- ❌ Empty space with no message
- ❌ Results shown anyway
- ❌ Error message instead

---

### Scenario 12: RTL Layout Check

**Steps:**
1. [From Scenario 1]
2. Observe layout of all elements

**Expected Results:**
- ✓ Search input icon on left (RTL: visual right)
- ✓ X button inside input on left side
- ✓ Category chips scroll right-to-left
- ✓ Items flex right-to-left
- ✓ Text is right-aligned
- ✓ Icons point correctly for RTL (chevron-left points forward)
- ✓ No text clipping in Hebrew
- ✓ Badge text centered in oval shape

**Failure Signs:**
- ❌ LTR layout (icons/text on wrong side)
- ❌ Text clipping
- ❌ Misaligned elements
- ❌ Icons pointing backward

---

## Regression Tests

### Existing Features to Verify

1. **Report Detail Screen**
   - Main tabs still work (Defects, Checklist, PDF Preview)
   - ReportActionsBar visible and clickable
   - All buttons (Add Defect, Search, etc.) work

2. **Add Defect Screen**
   - Without template: form empty, ready for input
   - With template: form prefilled from template
   - Photo capture still works
   - Save/cancel buttons functional

3. **Other Search UX**
   - ReportActionsBar "Add Defect" button → add-defect (no template)
   - Normal add-defect flow unchanged

---

## Edge Cases

### Edge Case 1: Rapid Category Toggle
**Steps:**
1. Tap category chip on/off/on/off quickly
2. Observe results

**Expected:** Results update correctly, no crashes or weird states

### Edge Case 2: Search While Scrolling
**Steps:**
1. Select category → long list appears
2. Start scrolling list
3. Type in search field
4. Continue scrolling

**Expected:** Results update, list position managed correctly

### Edge Case 3: Network Failure
**Steps:**
1. Disconnect network
2. Open SearchOverlay
3. Observe behavior

**Expected:** 
- Loading state appears
- After timeout, error message shown
- Retry button available (or manual dismiss)

### Edge Case 4: Very Long Category Names
**Applicable to:** Hebrew text in RTL

**Expected:**
- Category chips wrap or truncate gracefully
- Text doesn't overflow
- Whole chip still clickable

---

## Performance Benchmarks

After fixes applied, verify:

| Metric | Threshold | Expected |
|--------|-----------|----------|
| Overlay open → results shown | <1000ms | ~500ms |
| Category filter update | <300ms | ~100ms |
| Text search debounce | Exactly 250ms | 250ms ± 50ms |
| List scroll smoothness | 60fps | Smooth, no jank |
| Memory footprint | <50MB | ~30MB (338 items) |

---

## Sign-Off Checklist

- [ ] All 12 scenarios pass
- [ ] Regression tests pass
- [ ] Edge cases handled gracefully
- [ ] Performance acceptable
- [ ] RTL layout verified
- [ ] No console errors or warnings
- [ ] Category values match database
- [ ] Template prefill confirmed
- [ ] Ready for production

---

## Notes for Tester

1. **Test on actual device**, not just simulator (touch feel matters)
2. **Test on both iOS and Android** (if applicable)
3. **Test with slow network** to verify debounce/loading states
4. **Take screenshots** of each scenario for documentation
5. **Record video** of full flow for demo/training

---

## Failure Escalation

If any test fails:

1. Check DATABASE_ANALYSIS.md — verify assumptions
2. Review BUG_REPORT.md — understand root cause
3. Check FIX_IMPLEMENTATION.md — verify fixes applied correctly
4. Check typecheck output — any compilation errors?
5. Review SearchOverlay code — any logic issues?
6. Check useSearchFilter hook — filtering working?
7. Verify database — categories actually Hebrew?

Report findings in detailed bug report with:
- Steps to reproduce
- Expected vs actual
- Screenshots/video
- Console errors
- Category values in database at failure time

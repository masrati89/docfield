# 📱 SCREEN STANDARDS — inField

> **Load when:** Building ANY new screen, component, or mockup. These rules apply to EVERY screen in the app — no exceptions. Content-specific logic belongs in each screen's own spec. This document is purely functional infrastructure.

---

## 1. INPUT FIELDS — All Types

### iOS Zoom Prevention

```
RULE: Every <input>, <textarea>, and <TextInput> must have fontSize ≥ 16px.
WHY: iOS Safari/WebKit auto-zooms on inputs with font < 16px. Unrecoverable without pinch.
APPLIES TO: Web (PWA/Safari), Expo Web. Not needed in React Native but enforced anyway for consistency.
```

### Text Direction

```
RULE: Every text input must have dir="rtl" (web) or textAlign="right" (React Native).
WHY: Hebrew text starts from the right. Without this, cursor position and text flow break.
EXCEPTION: Phone number fields → dir="ltr" (numbers are always LTR).
```

### Autocomplete & Spellcheck

```
RULE: All inputs must have autoComplete="off" and spellCheck={false}.
WHY:
  - autoComplete: Device suggestions cover the input and interfere with ComboField dropdowns.
  - spellCheck: Hebrew words get red underlines (spell checker doesn't support Hebrew well).
REACT NATIVE: autoCorrect={false}, autoComplete="off", spellCheck={false}
```

### Keyboard Types

```
Phone fields:   keyboardType="phone-pad"
Email fields:   keyboardType="email-address"
Number fields:  keyboardType="numeric" or inputMode="numeric" (web)
ID (ת.ז.) fields: keyboardType="number-pad"
Text fields:    keyboardType="default"
```

### Focus Behavior

```
RULE: When an input receives focus, the screen must scroll so the input is visible above the keyboard.
IMPLEMENTATION:
  - React Native: Wrap in <KeyboardAvoidingView> with behavior="padding" (iOS) / "height" (Android)
  - Additional: scrollTo the focused input after keyboard animation (~300ms delay)
  - Bottom sheets: Ensure the sheet content scrolls, not the sheet itself
```

---

## 2. BOTTOM SHEETS

### Standard Properties

- Height: 85vh for forms, 92vh for full panels (per DESIGN_SYSTEM)
- Handle bar: 36×4px, `cr300` (#EBE1D3), centered, 8px top padding
- Top corners: 16px border radius
- Shadow: `shadow.up` — `"0 -4px 20px rgba(60,54,42,.12)"`
- Background: `cr50` (#FEFDFB) — never white
- Animation IN: slideUp 0.35s cubic-bezier(.22,1,.36,1)
- Animation OUT: slideDown 0.25s ease
- Backdrop: `rgba(0,0,0,.4)` with fadeIn/fadeOut

### Closing Behavior

```
RULE: Bottom sheets close by:
  1. Tapping the backdrop (dark overlay)
  2. Pressing the X button
  3. Swiping down on the handle bar (React Native only — use gesture handler)
  4. Pressing hardware back button (Android)
RULE: Always animate out before removing from DOM.
  - Set closing state → wait for animation → then unmount
  - Pattern: setClosing(true) → setTimeout(250ms) → setOpen(false) + setClosing(false)
```

### Scroll Inside Bottom Sheets

```
RULE: Bottom sheet content area must be independently scrollable.
  - Use flex:1 + overflow:auto on the content container
  - The sheet itself does NOT scroll — only its content area
  - Footer/CTA button stays fixed at bottom of the sheet
```

---

## 3. DROPDOWNS & OVERLAYS

### Only One Open at a Time

```
RULE: Maximum ONE dropdown open at any moment across the entire screen.
  - Opening dropdown A must close dropdown B
  - Click outside any dropdown → close all dropdowns
  - Focus on a different input → close all dropdowns
```

### Z-Index Scale

| Layer            | z-index     |
| ---------------- | ----------- |
| Content          | 1 (default) |
| Sticky header    | 10          |
| Dropdown menus   | 20          |
| Footer           | 100         |
| Backdrop overlay | 150         |
| Bottom sheet     | 200         |
| Toast/Alert      | 300         |

### Dropdown Position

```
RULE: Dropdowns must not clip against their parent container.
PROBLEM: Inside a bottom sheet with overflow:auto, absolute-positioned dropdowns get clipped.
SOLUTION:
  - Use Portal/Modal to render dropdown at root level
  - Or measure position and render dropdown with fixed positioning
  - React Native: Use react-native-modal or portal pattern
```

---

## 4. NAVIGATION & SCROLLING

### Scroll to Content

```
RULE: When content changes dynamically (accordion opens, form field appears, defect row expands),
  scroll the new content into view.
TIMING: Wait for animation to complete before scrolling (~300-350ms).
METHOD:
  - Web: element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  - React Native: scrollViewRef.scrollTo({ y: offsetY, animated: true })
```

### Pull to Refresh

```
RULE: List screens (projects, buildings, apartments, reports) must support pull-to-refresh.
IMPLEMENTATION: React Native <RefreshControl> on ScrollView/FlatList.
NOT NEEDED ON: Form screens, checklist during inspection, bottom sheets.
```

### Back Navigation

```
RULE: Every screen must handle the back action:
  - iOS: Swipe from left edge
  - Android: Hardware back button
  - App: Back arrow in header (where applicable)
BOTTOM SHEETS: Back button/gesture closes the sheet, does NOT navigate back.
FORMS WITH UNSAVED DATA: Show "לצאת בלי לשמור?" confirmation dialog.
```

---

## 5. SAFE AREAS & DEVICE EDGES

### Safe Area Insets

```
RULE: All fixed-position elements must respect safe area insets.

TOP: Status bar (notch/Dynamic Island on iPhone)
  → Headers: paddingTop includes safe area

BOTTOM: Home indicator (iPhone X+), navigation bar (Android gesture nav)
  → Footers: paddingBottom = max(24px, safeAreaInsets.bottom)
  → Bottom sheets: Bottom padding respects safe area
  → Floating buttons: Positioned above safe area

IMPLEMENTATION:
  - React Native: useSafeAreaInsets() from react-native-safe-area-context
  - Web: env(safe-area-inset-top), env(safe-area-inset-bottom)
  - Mockups: padding="12px 12px max(24px, env(safe-area-inset-bottom, 24px))"
```

### Notch/Dynamic Island

```
RULE: No interactive content in the top 44px on iPhone with notch.
The green gradient header naturally handles this — just ensure it has enough height.
```

---

## 6. ANIMATIONS & TRANSITIONS

### Standard Durations

| Animation                                 | Duration                |
| ----------------------------------------- | ----------------------- |
| Micro interactions (button press, toggle) | 100-150ms               |
| Transitions (fade, color change)          | 200ms                   |
| Accordion open/close                      | 300ms                   |
| Bottom sheet slide                        | 350ms (in), 250ms (out) |
| Page transitions                          | 300ms                   |
| Staggered list entrance                   | 60ms delay per item     |

### Easing Functions

```
DEFAULT: cubic-bezier(.22, 1, .36, 1) — spring feel
SHEET ENTER: cubic-bezier(.22, 1, .36, 1)
SHEET EXIT: ease
ACCORDION: ease
FADE: ease
NEVER USE: linear (feels robotic)
```

### Exit Before Unmount

```
RULE: Never remove an element from DOM/render tree without animating it out first.
PATTERN:
  1. User triggers close
  2. Set isClosing = true (triggers exit animation CSS)
  3. setTimeout(animationDuration)
  4. Set isOpen = false (removes from DOM)
  5. Set isClosing = false (reset)
```

### Haptic Feedback

```
RULE: Use haptic feedback on:
  - Status changes (checklist: תקין/לקוי)
  - Destructive actions (delete confirmation)
  - Success events (report generated, defect saved)

TYPE: Haptics.ImpactFeedbackStyle.Light for most, .Medium for destructive
IMPLEMENTATION: expo-haptics
NOT AVAILABLE: Web mockups (document for implementation only)
```

---

## 7. LOADING STATES

### Skeleton Screens (Not Spinners)

```
RULE: Use skeleton placeholders, never spinner wheels.
  - Match the shape and layout of the actual content
  - Shimmer animation: linear-gradient sliding left-to-right
  - Duration: show for minimum 300ms even if data loads faster (prevents flash)

PATTERN:
  - Card skeleton: rounded rectangle matching card dimensions
  - List skeleton: 4-5 rows of rounded rectangles
  - Text skeleton: 2-3 lines of varying width
```

### Loading Duration

```
RULE: If loading takes > 3 seconds, show a text hint ("טוען נתונים...")
RULE: If loading takes > 10 seconds, show retry option
RULE: If loading fails, show error state with retry button — never blank screen
```

---

## 8. ERROR STATES

### User-Facing Errors

```
RULE: All error messages in Hebrew.
RULE: Never show technical details (SQL errors, stack traces, error codes) to the user.
RULE: Every error has an action the user can take (retry, go back, contact support).

PATTERN:
  ┌──────────────────────────────┐
  │  😕 משהו השתבש               │
  │  לא הצלחנו לטעון את הנתונים. │
  │  [נסה שוב]                   │
  └──────────────────────────────┘
```

### Validation Errors

```
RULE: Show inline, below the relevant field — not in alert/toast.
RULE: Red text (sR #EF4444) with aria-describedby connection.
RULE: Validate on blur (when leaving field), not on every keystroke.
RULE: Validate again on submit.
RULE: Scroll to first error field on submit.
```

### Empty States

```
RULE: Every list screen must have a designed empty state.
  - Icon (subtle, n300 color)
  - Title in Hebrew ("אין ממצאים עדיין")
  - Description with guidance ("הוסף ממצא ראשון מהכפתור למטה")
  - Primary action button when applicable
```

---

## 9. DATA PERSISTENCE & OFFLINE

### Form State

```
RULE: Form data must survive:
  - Screen rotation
  - App backgrounding (up to 10 minutes)
  - Accidental back navigation (show confirmation dialog)

RULE: Form data does NOT survive:
  - App kill/force close (acceptable loss with warning)
  - Intentional discard (user confirms)
```

### Dirty Check

```
RULE: If user has unsaved changes and tries to navigate away:
  - Show confirmation: "יש שינויים שלא נשמרו. לצאת בלי לשמור?"
  - [ביטול]  [צא בלי לשמור]

APPLIES TO:
  - Defect forms
  - Report details
  - Settings pages
  - Protocol detail entry

DOES NOT APPLY TO:
  - Checklist item status changes (saved immediately)
  - Camera captures (saved to temp on capture)
```

### Auto-Save

```
RULE: Checklist status changes save immediately (no explicit save button needed for status).
RULE: Defect text saves when user presses "שמור" button.
RULE: Report details save on blur or explicit save.
```

---

## 10. RTL LAYOUT

### Global

```
RULE: Root element must have dir="rtl" and lang="he".
RULE: All layouts naturally flow RTL with flexbox.
RULE: Use logical properties (marginInlineStart, paddingInlineEnd) not physical (marginLeft, paddingRight).
REACT NATIVE: I18nManager.forceRTL(true) on app startup.
```

### Icons That Flip

```
MUST FLIP (direction-dependent):
  - Chevron/arrow (pointing to "back" or "forward")
  - Menu slide direction (slides from RIGHT in RTL)

MUST NOT FLIP (universal):
  - Camera, search, plus, X, checkmark, gear
  - Status icons (✓, ✗, ~)
```

### Numbers & Mixed Content

```
Phone numbers: Always LTR (dir="ltr" on the field)
Prices: ₪ symbol + number (LTR within RTL context)
Dates: Hebrew format (29.03.2026) — no special handling needed
Email: LTR (dir="ltr" on the field)
Mixed text: Use dir="auto" on user-generated content containers
```

---

## 11. ACCESSIBILITY

### Touch Targets

```
RULE: Minimum touch target size: 44×44px for primary actions, 36×36px for secondary.
RULE: Minimum spacing between adjacent touch targets: 8px.
```

### Focus

```
RULE: All interactive elements must have a visible focus indicator.
STYLE: outline: 2px solid g500 (#1B7A44); outline-offset: 2px
RULE: Tab order must follow visual/logical order.
```

### Screen Reader

```
RULE: All icons without text must have aria-label (web) or accessibilityLabel (React Native).
RULE: Status badges must announce their meaning ("תקין", "לא תקין") not just the symbol.
RULE: Buttons must announce their action, not just their icon.
```

### Color

```
RULE: Color must never be the sole indicator of state.
  - Status: color + symbol (✓, ✗, ~, —)
  - Errors: red color + text description
  - Success: green color + text or icon
```

---

## 12. PERFORMANCE

### Lists

```
RULE: Lists with > 20 items must use FlatList (React Native) or virtualization.
RULE: Never render all items in a long list — use pagination or infinite scroll.
EXCEPTION: Checklist items within a room (max ~12 items) — no virtualization needed.
```

### Images

```
RULE: All images lazy-loaded below the fold.
RULE: Thumbnails: 64×64px max, compressed.
RULE: Full photos: loaded on demand (tap to view), not pre-loaded.
```

### Re-renders

```
RULE: Use React.memo on pure display components.
RULE: Use useCallback for functions passed as props.
RULE: Status changes in checklist should only re-render the affected item, not the entire list.
```

---

## 13. TOAST / FEEDBACK MESSAGES

### When to Show

- SUCCESS: After save actions ("הליקוי נשמר", "הדוח הופק")
- ERROR: When an action fails ("לא הצלחנו לשמור. נסה שוב")
- WARNING: Before destructive actions (shown in dialog, not toast)
- INFO: Not commonly used — prefer inline messaging

### Toast Style

- Position: Bottom of screen, above footer (not behind it)
- Duration: 3 seconds (auto-dismiss)
- Background:
  - Success: `g500` (#1B7A44) with white text
  - Error: `clRed` (#b91c1c) with white text
- Animation: Slide up + fade in / slide down + fade out
- Icon: ✓ for success, ✗ for error (before text)

---

## 14. CONFIRMATION DIALOGS

### When Required

**ALWAYS CONFIRM:**

- Delete actions (defect, report, project)
- Status changes on completed reports ("חזרה לטיוטה")
- Exit with unsaved changes
- Bulk operations

**NEVER CONFIRM:**

- Checklist status changes (תקין/לקוי — immediate and reversible)
- Adding items
- Navigation between screens (unless unsaved data)

### Dialog Pattern

```
┌──────────────────────────────┐
│  [Title]                     │
│  [Description]               │
│                              │
│  [ביטול]          [Action]   │
└──────────────────────────────┘
```

- ביטול always on the right (RTL primary position)
- Destructive action in red (`clRed`)
- Non-destructive action in green (`g500`)
- Backdrop closes dialog (same as cancel)

---

## 15. CONNECTIVITY

### Sync Indicator

```
RULE: Every screen that depends on server data must show sync status.
LOCATION: Header pill — green "מסונכרן" / red "לא מסונכרן"
BEHAVIOR:
  - Auto-sync when connection returns
  - Queue changes made offline
  - Show "מסנכרן..." during active sync
```

### Offline Behavior

```
RULE: Checklist and defect entry must work fully offline.
  - All data saved locally first
  - Synced to server when connection available
  - Photos queued for upload

RULE: Settings changes require connection (show message if offline).
RULE: PDF generation requires connection (server-side rendering).
```

---

_Document version: 1.0 | Created: March 2026_
_Applies to every screen in inField. Screen-specific logic goes in each screen's own spec._
_Reference alongside: DESIGN_SYSTEM.md (visual) + ARCHITECTURE_INFIELD.md (technical)_

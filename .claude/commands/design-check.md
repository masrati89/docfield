---
name: design-check
description: Run design system verification on current UI code
---

Check the current file/component against DocField's design system:
1. Read docs/DESIGN_SYSTEM_DOCFIELD.md
2. Verify all colors match the DocField palette (green primary, cream backgrounds)
3. Verify border-radius is minimum 10px on interactive elements
4. Verify backgrounds use cream-50 (#FEFDFB) not pure white (#FFFFFF)
5. Verify borders use cream-200 (#F5EFE6) not gray
6. Verify buttons have press animation (scale 0.98) and haptic feedback
7. Verify lists have staggered entrance animation
8. Verify loading states use skeleton screens, not spinners
9. Report any violations as a numbered list with specific fixes

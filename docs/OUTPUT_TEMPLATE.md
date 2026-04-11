# 📋 תבנית TASK — inField PM Agent

> כל TASK שה-Agent מייצר חייב לעקוב אחרי המבנה הזה בדיוק.
> TASK = יחידת עבודה אחת שניתן לתת ישירות ל-Claude Code.

---

## מבנה TASK סטנדרטי

```markdown
# TASK\_[מספר]: [שם המשימה]

> **עדיפות:** CRITICAL / HIGH / MEDIUM / LOW  
> **Phase:** [5 / 5.1 / 6 / ...]  
> **זמן משוער:** [שעות]  
> **תלויות:** [TASK_XXX אם יש, או "אין"]

---

## מטרה

[משפט אחד — מה הולך לקרות בסוף המשימה הזו]

---

## קונטקסט למפתח (Claude Code)

### קרא לפני הכל

- [ ] docs/ARCHITECTURE_INFIELD.md — §[X] רלוונטי
- [ ] docs/FLOW_SPEC.md — §[X] רלוונטי
- [ ] docs/SCREEN_STANDARDS.md — §1, §2, §3
- [ ] mockups/[שם-mockup].jsx — pixel-perfect reference

### מיקום בפרויקט

- קובץ יעד: `apps/mobile/app/[path]`
- קומפוננטים: `apps/mobile/components/[path]`
- טייפים: `packages/shared/types/[file].ts`

---

## מה לבנות

### תיאור

[תיאור מפורט של מה שצריך לבנות]

### רכיבים נדרשים

1. [רכיב 1] — [תיאור]
2. [רכיב 2] — תיאור]
3. ...

### Data Layer

- Query: `[שם query]` מ-Supabase — טבלה `[שם]`, פילטר `organization_id`
- Loading: Skeleton (לא spinner)
- Error: Toast + EmptyState

---

## כללים שחייבים להיות מיושמים

### Iron Rules (מה שאסור לשנות לעולם)

- [ ] [Iron Rule רלוונטי מ-FLOW_SPEC §14]

### Design Rules

- [ ] רקע: `cr50` (#FEFDFB) — אף פעם לא לבן
- [ ] פונט: Rubik — `theme.typography.*`
- [ ] RTL: `writingDirection: 'rtl'` בכל View ראשי
- [ ] Inputs: `fontSize: 16`, `autoCorrect={false}`, `textAlign: 'right'`
- [ ] Bottom Sheet: לפי SCREEN_STANDARDS §2
- [ ] Safe Area: footer עם `paddingBottom: max(24, safeAreaBottom)`

### UX Rules

- [ ] Skeleton בכל loading state
- [ ] EmptyState בכל רשימה ריקה (emoji + כותרת + תיאור + CTA)
- [ ] Staggered entrance animation (60ms delay לכל פריט)
- [ ] Dirty check בכל טופס עם נתונים לא שמורים
- [ ] [כללים ספציפיים למסך מ-FLOW_SPEC]

---

## אל תעשה (Anti-Patterns)

❌ אל תשתמש ב-hardcoded hex — רק `theme.colors.*`
❌ אל תשתמש ב-magic numbers — רק `theme.spacing.*`
❌ אל תוסיף ספריות חדשות בלי אישור
❌ אל תשנה schema קיים — רק migrations
❌ אל תשנה ממצאים בדוח קיים (Iron Rule #1)
❌ אל תשתמש ב-spinner — רק Skeleton
❌ [anti-patterns ספציפיים למשימה]

---

## בדיקות נדרשות לפני סיום

### TypeScript

- [ ] `npm run typecheck` — 0 שגיאות

### Design System

- [ ] רק `theme.colors`, `theme.spacing`, `theme.typography`
- [ ] רצת `/design-check` על הקובץ
- [ ] תיקנת כל הממצאים

### פונקציונלי

- [ ] [edge case 1]
- [ ] [edge case 2]
- [ ] RTL נראה תקין בסימולטור

### Build

- [ ] `npx turbo build` — עובר
- [ ] אין `console.log` בקוד

---

## Definition of Done

✅ [קריטריון 1]  
✅ [קריטריון 2]  
✅ [קריטריון 3]  
✅ TypeScript clean  
✅ Design System compliant

---

_TASK מופק על ידי: inField PM Agent | תאריך: [תאריך]_
```

---

## הנחיות לAgent בעת כתיבת TASK

1. **TASK אחד = feature אחד** — לא לערבב
2. **כל TASK עצמאי** — Claude Code יכול לרוץ בלי להבין את כל הפרויקט
3. **הפנה למוקאפ תמיד** — pixel-perfect, לא לפרש עצמאית
4. **כלול edge cases** — מה קורה כשהרשימה ריקה, אין רשת, טעינה, שגיאה
5. **ציין Iron Rules רלוונטיים** — מניעת שגיאות קריטיות
6. **אל תכלול קוד** — רק הוראות. הקוד יכתב ע"י Claude Code

---

_OUTPUT_TEMPLATE.md | inField PM Agent v1.0_

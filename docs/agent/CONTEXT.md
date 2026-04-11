# 📍 CONTEXT.md — inField Project State

> **מטרה:** מצב נוכחי של הפרויקט. עדכן קובץ זה אחרי כל Phase שמסתיים.
> **עודכן:** אפריל 2026 | Phase 5

---

## Branch פעיל

`feature/infrastructure-fixes`

---

## מה קיים ועובד ✅

### תשתית (Monorepo)

- Turborepo + npm workspaces (4 packages)
- ESLint + Prettier + Husky + lint-staged — CI עובד
- TypeScript: `npm run typecheck` — 4/4 packages עוברים
- Build: `npx turbo build` — web build עובר (465 kB)
- Supabase: 11 migrations, RLS enforced, seed data

### Mobile App — `apps/mobile/`

```
_layout.tsx              ✅ Root layout (fonts, splash, auth routing)
index.tsx                ✅ Redirect → auth or app
(auth)/login.tsx         ✅ Full implementation
(auth)/register.tsx      ⚠️ Placeholder
(app)/_layout.tsx        ✅ Tab navigation (בית/דוחות/פרויקטים/הגדרות)
(app)/index.tsx          ⚠️ Basic only → מוקאפ: inField-HomeScreen-v6-rtl.jsx
(app)/reports.tsx        🔴 Placeholder → מוקאפ: inField-ReportsList-v5-rtl.jsx
(app)/projects.tsx       🔴 Placeholder → מוקאפ: inField-ProjectsList-v2.jsx
(app)/settings.tsx       🔴 Placeholder (v1.1)
```

### UI Components — מוכנים

```
components/ui/Button.tsx            ✅
components/ui/BottomSheetWrapper.tsx ✅
components/ui/EmptyState.tsx         ✅
components/ui/SkeletonBlock.tsx      ✅
components/ui/Toast.tsx              ✅
hooks/useToast.ts                    ✅
contexts/AuthContext.tsx             ✅ Supabase auth + expo-secure-store
constants/theme.ts                   ✅ Design tokens
lib/supabase.ts                      ✅ Client config
assets/fonts/Rubik (4 weights)       ✅
```

### Shared Packages — `packages/shared/`

```
types/     8 type files (inspection, defect, project, checklist, client, org, auth, signature)
constants/ 6 files (categories, rooms, roles, severities, statuses, reportTypes)
validation/ 6 Zod schemas
utils/     3 files (formatters, generators, validators)
i18n/      he.json + en.json
```

### DB Schema — `supabase/migrations/`

```
001 organizations → 002 users → 003 projects → 004 checklist_templates
→ 005 delivery_reports → 006 checklist_results → 007 defects
→ 008 defect_library → 009 signatures → 010 clients → 011 storage_buckets
```

---

## מה לא נבנה עדיין 🔴

### מסכים עמוקים (Deep Screens)

| מסך             | מוקאפ קיים?                            | סטטוס          |
| --------------- | -------------------------------------- | -------------- |
| Home Screen     | ✅ inField-HomeScreen-v6-rtl.jsx       | ⚠️ בסיסי       |
| Reports List    | ✅ inField-ReportsList-v5-rtl.jsx      | 🔴 placeholder |
| Projects List   | ✅ inField-ProjectsList-v2.jsx         | 🔴 placeholder |
| Buildings List  | ✅ inField-Buildings-Apartments-v2.jsx | 🔴 לא נבנה     |
| Apartments List | ✅ inField-Buildings-Apartments-v2.jsx | 🔴 לא נבנה     |
| Report Detail   | ✅ inField-MainScreen-v6.jsx           | 🔴 לא נבנה     |
| Checklist       | ✅ DocField-Checklist-FINAL.jsx        | 🔴 לא נבנה     |
| Add Defect      | ✅ inField-AddDefect-v6.jsx            | 🔴 לא נבנה     |
| PDF בדק בית     | ✅ inField-BedekBayit-PDF.jsx          | 🔴 לא נבנה     |
| PDF פרוטוקול    | ✅ inField-Protocol-PDF.jsx            | 🔴 לא נבנה     |
| Register        | ❌ אין מוקאפ                           | ⚠️ placeholder |
| Settings        | ❌ v1.1                                | ⏸️ נדחה        |

### Features לא ממומשים

- [ ] New Report Wizard (4 שלבים) — FLOW_SPEC §3
- [ ] Checklist Engine — accordion, V/X/~ flow, conditional items
- [ ] Report Detail + Defect Cards
- [ ] PDF generation (expo-print)
- [ ] WhatsApp שליחה (Green API)
- [ ] Photo capture + annotation flow
- [ ] Signature capture (Skia)
- [ ] Report Status transitions + Confirmation dialogs
- [ ] Round 2 (מסירה שנייה) flow
- [ ] Sync indicator
- [ ] Notifications (bell)

---

## Dependencies — מצב

```
מותקן ובשימוש פעיל:
  expo 55, react-native 0.76.9, supabase-js, react-query 5,
  expo-router 4, NativeWind 4, expo-haptics, expo-image,
  expo-secure-store, react-native-reanimated, @gorhom/bottom-sheet, fuse.js

מותקן אבל לא בשימוש עדיין:
  @shopify/flash-list, @react-native-community/netinfo,
  expo-blur, expo-camera, expo-print, expo-image-manipulator

לא מותקן (להתקין כשצריך):
  @shopify/react-native-skia, @jamsch/expo-speech-recognition
```

---

## Mockups Location

```
apps/mobile/mockups/
├── inField-HomeScreen-v6-rtl.jsx
├── inField-ReportsList-v5-rtl.jsx
├── inField-ProjectsList-v2.jsx
├── inField-Buildings-Apartments-v2.jsx
├── inField-MainScreen-v6.jsx
├── DocField-Checklist-FINAL.jsx
├── inField-AddDefect-v6.jsx
├── inField-BedekBayit-PDF.jsx
└── inField-Protocol-PDF.jsx
```

---

## עדיפות Phase 5 — לפי סדר

```
[P0] Home Screen — מלא מ-mockup
[P0] Reports List — מלא מ-mockup
[P0] Projects List — מלא מ-mockup
[P1] New Report Wizard — Bottom Sheet 4 שלבים
[P1] Buildings + Apartments screens
[P1] Report Detail screen
[P2] Checklist Engine
[P2] Add Defect flow + Camera
[P2] PDF generation
[P3] WhatsApp, Signature, Round 2
```

---

## פקודות שימושיות

```bash
npx expo start           # mobile dev
npx turbo build          # build all
npm run typecheck        # TS check — all 4 packages
supabase start           # local backend
supabase db reset        # reset + seed
```

---

_CONTEXT.md — inField | עדכן כל פעם שmilestone מסתיים_

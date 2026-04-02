# 🔄 inField — HANDOFF (New Conversation)

> **מטרה:** פתיחת שיחה חדשה עם Claude. קרא את זה קודם, ואז את המסמכים הרלוונטיים למשימה.
> **עודכן:** אפריל 2026

---

## מה זה inField

אפליקציית מובייל (React Native + Expo) להפקת דוחות בדיקה מקצועיים בענף הבנייה בישראל. שני מצבי עבודה:

- **בדק בית** — דוח ליקויים לפי קטגוריות מקצועיות (אינסטלציה, חשמל, טיח...)
- **פרוטוקול מסירה** — צ׳קליסט מסירת דירה לפי חדרים, עם ליקויים

המתחרה העיקרי: Reporto (~80% שוק, WebView hybrid). הבידול שלנו: native feel + אופליין מלא.

## סטטוס נוכחי — Phase 5

**Branch:** `feature/infrastructure-fixes`

### תשתית — מוכן ✅

- Monorepo: Turborepo + npm workspaces (4 packages)
- ESLint + Prettier + Husky + lint-staged — CI עובד
- TypeScript: `npm run typecheck` — 4/4 packages עוברים
- Build: `npx turbo build` — web build עובר (465 kB)
- Supabase: 11 migrations, RLS enforced, seed data

### Mobile App — `apps/mobile/`

```
app/
├── _layout.tsx                ✅ Root layout (fonts, splash, auth routing)
├── index.tsx                  ✅ Redirect → auth or app
├── (auth)/
│   ├── _layout.tsx            ✅ Auth layout
│   ├── login.tsx              ✅ Full implementation
│   └── register.tsx           ⚠️ Placeholder
└── (app)/
    ├── _layout.tsx            ✅ Tab navigation (בית/דוחות/פרויקטים/הגדרות)
    ├── index.tsx              ⚠️ Basic only → mockups/inField-HomeScreen-v6-rtl.jsx
    ├── reports.tsx            🔴 Placeholder → mockups/inField-ReportsList-v5-rtl.jsx
    ├── projects.tsx           🔴 Placeholder → mockups/inField-ProjectsList-v2.jsx
    └── settings.tsx           🔴 Placeholder (v1.1)

components/ui/
├── Button.tsx                 ✅
├── BottomSheetWrapper.tsx     ✅
├── EmptyState.tsx             ✅
├── SkeletonBlock.tsx          ✅
├── Toast.tsx                  ✅
└── index.ts                   ✅

hooks/
└── useToast.ts                ✅

contexts/AuthContext.tsx        ✅ Supabase auth + expo-secure-store
constants/theme.ts             ✅ Design tokens
lib/supabase.ts                ✅ Client config
assets/fonts/                  ✅ Rubik (Regular/Medium/SemiBold/Bold)
```

### Deeper Screens — לא נבנו 🔴

```
Buildings list  → mockups/inField-Buildings-Apartments-v2.jsx
Apartments list → mockups/inField-Buildings-Apartments-v2.jsx
Report detail   → mockups/inField-MainScreen-v6.jsx
Checklist       → mockups/DocField-Checklist-FINAL.jsx
Add defect      → mockups/inField-AddDefect-v6.jsx
PDF bedek bayit → mockups/inField-BedekBayit-PDF.jsx
PDF protocol    → mockups/inField-Protocol-PDF.jsx
```

### Web App — `apps/web/`

```
src/
├── App.tsx                    ✅ Router setup
├── main.tsx                   ✅ Entry point
├── contexts/AuthContext.tsx    ✅ Supabase auth
├── lib/supabase.ts            ✅ Client config
├── layouts/DashboardLayout.tsx ✅ Sidebar layout
├── components/
│   ├── PrivateRoute.tsx       ✅ Auth guard
│   └── ui/StatCard.tsx        ✅
└── pages/
    ├── LoginPage.tsx          ✅
    ├── DashboardPage.tsx      ✅
    ├── ProjectsPage.tsx       ✅ Basic
    ├── ReportsPage.tsx        ✅ Basic
    └── SettingsPage.tsx       ✅ Basic
```

### Shared Packages

```
packages/shared/ (@infield/shared)
├── types/         8 type files (inspection, defect, project, checklist, client, org, auth, signature)
├── constants/     6 files (categories, rooms, roles, severities, statuses, reportTypes)
├── validation/    6 Zod schemas (auth, defect, inspection, project, client, org)
├── utils/         3 files (formatters, generators, validators)
└── i18n/          he.json + en.json

packages/ui/ (@infield/ui)
└── theme/         5 token files (colors, typography, spacing, shadows, borderRadius)
```

### Database — `supabase/migrations/`

```
001 organizations → 002 users → 003 projects → 004 checklist_templates
→ 005 delivery_reports → 006 checklist_results → 007 defects
→ 008 defect_library → 009 signatures → 010 clients → 011 storage_buckets
```

RLS enforced, organization_id tenant isolation.

### Dependencies — מה מותקן / מה לא

**מותקן ובשימוש:** expo 55, react-native 0.76.9, supabase-js, react-query 5, expo-router 4, NativeWind 4, expo-haptics, expo-image, expo-secure-store, react-native-reanimated, @gorhom/bottom-sheet, fuse.js

**מותקן אבל לא בשימוש עדיין:** @shopify/flash-list, @react-native-community/netinfo, expo-blur, expo-camera, expo-print, expo-image-manipulator

**לא מותקן (להתקין כשצריך):** @shopify/react-native-skia, @jamsch/expo-speech-recognition

## מה הבא

1. **Home Screen** — בנייה מלאה מתוך mockup (`inField-HomeScreen-v6-rtl.jsx`)
2. **Reports List** — בנייה מתוך mockup (`inField-ReportsList-v5-rtl.jsx`)
3. **Projects List** — בנייה מתוך mockup (`inField-ProjectsList-v2.jsx`)
4. **Deeper screens** — Buildings, Apartments, Report Detail, Checklist, Add Defect
5. **PDF generation** — bedek bayit + protocol mesira

## כללי עבודה

- **שם המוצר:** inField — מילה אחת, camelCase עם F גדול
- **שפת UI:** עברית, RTL, פונט Rubik
- **שפת קוד:** אנגלית
- **Iron Rule:** דוח = מסמך משפטי. שום שינוי במערכת לא משנה דוח קיים. ממצאים כ-snapshot מלא
- **Pixel-perfect:** לבנות ישירות מקוד ה-mockup, לא לפרש באופן עצמאי
- **רקע:** cr50 (#FEFDFB) תמיד, אף פעם לבן. צללים חמים בלבד
- **Repo:** github.com/masrati89/infield

## טכנולוגיה

```
Mobile:    React Native 0.76.9 + Expo SDK 55 (Expo Router v4, NativeWind v4)
Web:       React 18 + Vite 6 + Tailwind CSS
Monorepo:  Turborepo + npm workspaces
Backend:   Supabase (PostgreSQL + Auth + Storage + Edge Functions)
Data MVP:  React Query 5 + Supabase direct
Offline:   WatermelonDB (deferred to post-MVP)
Icons:     @expo/vector-icons (Feather)
Language:  TypeScript 5.x strict
```

## פקודות

```bash
npx expo start           # mobile dev
npx turbo build          # build all
npm run typecheck        # TS check — all 4 packages
supabase start           # local backend
supabase db reset        # reset + seed
```

---

_הקובץ הזה הוא נקודת כניסה בלבד. כל הפרטים נמצאים במסמכים המפורטים._

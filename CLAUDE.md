# inField — Claude Instructions

## Product

Construction inspection SaaS — Israel market (Hebrew, RTL).
Two modes: בדק בית (defect inspection) | פרוטוקול מסירה (delivery checklist).
Competitor: Reporto (~80% market, WebView). Our edge: native feel + full offline.
Pricing: Free (3 reports) / ₪99 / ₪199 / ₪349.

## Iron Rules (Never Break)

- Reports are legal documents — no system change ever modifies an existing report
- Defects stored as full-text snapshots — never foreign keys
- Completed reports require double confirmation to re-edit
- Pixel-perfect from mockup — build directly from mockup JSX, never interpret independently
- Signatures: immutable — no UPDATE or DELETE policy ever

## Current Status

Phase 6 — polish, advanced features, production readiness. All core screens built and audited.

✅ Infrastructure: monorepo, auth, DB schema + RLS (15 migrations), design tokens, shared types/validation/i18n, seed data, Rubik fonts, NativeWind, Supabase client
✅ All screens built + audited: Login, Register, Home, Reports List, Report Detail, Checklist, Add Defect, Projects List, Buildings, Apartments, Settings
✅ Components: 70+ files across 9 categories (ui, home, reports, projects, checklist, defect, settings, camera, wizard)
✅ Hooks: 13 custom hooks (data fetching, PDF generation, report status, idle timeout, etc.)
✅ PDF generation: bedek bayit + protocol mesira HTML templates (970 lines)
✅ New Inspection Wizard: 6-step conditional flow (type → project → buildings → apt counts → apartment → protocol)
✅ Inline Project Creation: wizard + projects page — name, buildings, apartments in one flow
✅ Auto-detect delivery round: round_number + previous_round_id on report creation
✅ Checklist action buttons: preview, share, settings, download — with closable bottom sheets
✅ Visual + Logic audit completed: 181 visual items + 29 logic items fixed across all 9 screens

🔴 Not built yet:

- Digital signatures — @shopify/react-native-skia (not installed)
- Delivery Round 2 — inherited defects + review_status UI
- Full camera overlay — green badge counter, drag-to-delete review
- Offline sync — WatermelonDB (deferred post-MVP)
- WhatsApp send — Green API integration
- Notifications — bell icon + notification panel
- Pre-close summary — summary screen before PDF generation
- Admin settings — category/template/location management
- Legal text & branding — developer logo, inspector stamp
- Speech recognition — @jamsch/expo-speech-recognition (post-MVP)

## Stack

| Layer    | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Mobile   | React Native 0.76.9 + Expo SDK 55 (Expo Router v4, NativeWind v4) |
| Data     | React Query 5 + Supabase direct — WatermelonDB = post-MVP         |
| Drawing  | @shopify/react-native-skia (not yet installed)                    |
| Web      | React + Vite + Tailwind CSS                                       |
| Backend  | Supabase (PostgreSQL + Auth + Storage + Edge Functions)           |
| PDF      | expo-print (offline-capable)                                      |
| Monorepo | Turborepo + npm workspaces                                        |
| Language | TypeScript 5.x strict                                             |
| Icons    | @expo/vector-icons (Feather)                                      |

## Mobile App Structure (Expo Router)

```
apps/mobile/
├── app/
│   ├── _layout.tsx                    # Root layout (fonts, splash, providers)
│   ├── index.tsx                      # Redirect → auth or app
│   ├── (auth)/
│   │   ├── _layout.tsx                ✅ Auth layout
│   │   ├── login.tsx                  ✅ Full login (email/password + validation)
│   │   └── register.tsx               ✅ Full register (4 fields + org creation + rollback)
│   └── (app)/
│       ├── _layout.tsx                ✅ Tab bar (בית/דוחות/פרויקטים/הגדרות) + idle timeout
│       ├── index.tsx                  ✅ Home dashboard (stats, recent reports/projects, tools)
│       ├── reports/
│       │   ├── _layout.tsx            ✅ Stack layout
│       │   ├── index.tsx              ✅ Reports list (search, filter, sort, delete, FAB)
│       │   └── [id]/
│       │       ├── _layout.tsx        ✅ Report tabs layout
│       │       ├── index.tsx          ✅ Report detail (categories, defects, photos, PDF, status)
│       │       ├── checklist.tsx       ✅ Checklist (rooms, status tracking, inline defects)
│       │       └── add-defect.tsx      ✅ Add defect (7 fields, camera, library, validation)
│       ├── projects/
│       │   ├── _layout.tsx            ✅ Stack layout
│       │   ├── index.tsx              ✅ Projects list (cards, search, filter, sort, FAB)
│       │   └── [projectId]/
│       │       ├── _layout.tsx        ✅ Project layout
│       │       ├── buildings/
│       │       │   ├── _layout.tsx    ✅ Stack layout
│       │       │   └── index.tsx      ✅ Buildings list (cards, progress, apartment counts)
│       │       └── apartments/
│       │           ├── _layout.tsx    ✅ Stack layout
│       │           └── index.tsx      ✅ Apartments list (floor groups, status, wizard)
│       └── settings/
│           ├── _layout.tsx            ✅ Stack layout
│           └── index.tsx              ✅ Settings (profile, password, preferences, sign out)
├── components/                        # 70+ files, 9 categories — see Component Architecture below
├── hooks/                             # 13 custom hooks — see Hooks below
├── contexts/AuthContext.tsx            ✅ Supabase auth + expo-secure-store
├── constants/theme.ts                 ✅ Design tokens
├── lib/
│   ├── supabase.ts                    ✅ Client config
│   └── pdf/                           ✅ PDF generation (bedekBayit.ts, protocol.ts, shared.ts, types.ts)
└── assets/fonts/                      ✅ Rubik (Regular/Medium/SemiBold/Bold)
```

## Component Architecture

```
components/
├── ui/           Button, Toast, BottomSheetWrapper(.web), SkeletonBlock, EmptyState, SideMenu, NewInspectionSheet
├── home/         HomeHeader, StatsStrip, ReportsSection, ProjectsSection, ToolGrid
├── reports/      ReportListItem(+GroupHeader), ReportsFilterBar(+SearchBar+FilterChips+ActiveTags),
│                 ReportsSortSheet, ReportsLoadingState, ReportsFAB, ReportHeaderBar, ReportActionsBar,
│                 ReportDetailsSection, ReportInfoCard, ReportTabBar, CategoryAccordion, DefectRow, ReportSkeleton
├── projects/     ProjectCard, ProjectsFilterBar(+SearchBar+FilterChips), ProjectsSortSheet,
│                 ProjectsLoadingState, ProjectsFAB, SubHeader, ProgressStrip, BuildingCard, ApartmentRow, AddBuildingSheet
├── checklist/    CheckItem, RoomAccordion, BathTypeSelect, ChecklistHeader, ChecklistFooter, AddDefectSheet,
│                 ReportPreviewSheet, ReportSettingsSheet
├── defect/       FormField, CategoryPicker, CostSection, PhotoGrid, DefectLibraryCard, ComboField
├── settings/     ProfileSection, ChangePasswordSection, PreferencesSection, InfoSection, SignOutButton
├── camera/       CameraCapture
└── wizard/       NewInspectionWizard, WizardShell, StepReportType, StepProject, StepBuildings,
                  StepApartmentCounts, StepApartment, StepProtocol, useWizardState, NewInspectionWizard.types
```

All directories have barrel `index.ts` exports.

## Hooks

```
hooks/
├── useReports.ts           # Reports list — fetch, filter, refresh
├── useReport.ts            # Single report detail — fetch by ID
├── useProjects.ts          # Projects list — fetch, filter, refresh
├── useProjectApartments.ts # Apartments for a project
├── useChecklist.ts         # Checklist state management
├── useDefectLibrary.ts     # Defect library search + categories (261 lines)
├── useDeleteReport.ts      # Report deletion with confirmation
├── usePdfGeneration.ts     # PDF generation + sharing (204 lines)
├── useReportStatus.ts      # Report status transitions
├── useSideMenu.ts          # Side menu visibility
├── useIdleTimeout.ts       # 30min idle session timeout
├── useToast.ts             # Toast notification state
└── useWizardState.ts       # Wizard state machine
```

## Mockups (mockups/ — design reference for built screens)

All screens are built. Use mockups only for design verification and pixel-perfect audits.

```
inField-HomeScreen-v6-rtl.jsx         → app/(app)/index.tsx                          ✅ built
inField-ReportsList-v5-rtl.jsx        → app/(app)/reports/index.tsx                  ✅ built
inField-ProjectsList-v2.jsx           → app/(app)/projects/index.tsx                 ✅ built
inField-Buildings-Apartments-v2.jsx   → buildings/index.tsx + apartments/index.tsx    ✅ built
DocField-Checklist-FINAL.jsx          → reports/[id]/checklist.tsx                    ✅ built
inField-MainScreen-v6.jsx             → reports/[id]/index.tsx                        ✅ built
inField-AddDefect-v6.jsx              → reports/[id]/add-defect.tsx                   ✅ built
inField-BedekBayit-PDF.jsx            → lib/pdf/bedekBayit.ts                        ✅ built
inField-Protocol-PDF.jsx              → lib/pdf/protocol.ts                           ✅ built
```

## Packages

```
packages/shared/   (@infield/shared)
├── types/         inspection, defect, project, checklist, client, org, auth, signature
├── constants/     categories, rooms, roles, severities, statuses, reportTypes
├── validation/    Zod schemas: auth, defect, inspection, project, client, org
├── utils/         formatters, generators, validators
└── i18n/          he.json + en.json

packages/ui/       (@infield/ui)
└── design tokens: colors, typography, spacing, shadows, borderRadius
```

## Database (supabase/migrations/)

```
001 organizations → 002 users → 003 projects → 004 checklist_templates
→ 005 delivery_reports → 006 checklist_results → 007 defects
→ 008 defect_library → 009 signatures → 010 clients → 011 storage_buckets
→ 012 add_missing_fields (round 2, freetext, report_type_default)
→ 013 report_log (audit trail, append-only)
→ 014 notifications
→ 015 nullable_apartment_id (delivery_reports.apartment_id can be NULL)
```

All tables: RLS enforced, organization_id tenant isolation.
Signatures + report_log: no UPDATE/DELETE policies (immutable).

## Custom Claude Commands

```
.claude/commands/design-check.md    # run before every UI commit
.claude/commands/new-screen.md      # scaffold a new screen
.claude/commands/security-audit.md  # pre-deploy security check
```

## Docs — Load on demand, NOT upfront

| Task                       | Read                                         |
| -------------------------- | -------------------------------------------- |
| Any UI work                | docs/DESIGN_SYSTEM.md + relevant mockup      |
| DB / data models / types   | docs/ARCHITECTURE_INFIELD.md                 |
| Auth / RLS / security      | docs/SECURITY_STANDARDS.md                   |
| Screen behavior / inputs   | docs/SCREEN_STANDARDS.md                     |
| Code review / pre-deploy   | docs/STANDARDS_REFERENCE.md                  |
| Checklist feature          | docs/specs/checklist-implementation-notes.md |
| New session context        | docs/inField-HANDOFF.md                      |
| Flow / navigation / wizard | docs/FLOW_SPEC.md                            |
| All docs reference         | docs/CLAUDE_CODE_DOC_REFERENCE.md            |

## Skills — Use for UI work

```
~/.claude/skills/vercel-react-native-skills/  # React Native best practices
~/.claude/skills/frontend-design/             # UI code conventions
~/.claude/skills/design-audit/                # /design-check before every commit
```

Design System always wins over Skills on conflicts.

## Design — Non-Negotiable Rules

Full system: docs/DESIGN_SYSTEM.md — read before ANY UI work.

- Background: `#FEFDFB` (cr50) — never white
- Primary: `#1B7A44` (g500) — forest green
- Borders: `#F5EFE6` (cr200) — never gray
- Accent: `#C8952E` (go500) — gold
- Fonts: Rubik (Hebrew) / Inter (English + numbers)
- RTL everywhere — logical properties only (ms/me/ps/pe, not ml/mr)
- Border radius: min 10px on all interactive elements
- Press: Reanimated scale(0.98) + Haptics.impactAsync(Light)
- Loading: skeleton screens — never bare spinners
- Shadows: warm rgba(60,54,42,x) — never pure black or rgba(0,0,0,x)
- Empty states: icon + text + CTA — always designed

## Security — Non-Negotiable Rules

Full spec: docs/SECURITY_STANDARDS.md

- RLS on every table — no exceptions
- organization_id on every table
- Auth tokens in expo-secure-store — never AsyncStorage
- Zod validation on client AND server
- Never expose service role key in client

## Screen Building Rules — MANDATORY for all new screens

These rules were derived from a comprehensive audit of all 9 screens. Follow them exactly when building any new screen or component.

### Supabase Query Patterns

- **NEVER use `!inner` joins** when FK can be NULL — use regular left joins instead. `!inner` returns 406 when FK is NULL.
- **Always add `| null` to type casts** on joined tables: `as { ... } | null`
- **Always use optional chaining** on joined data: `apt?.buildings?.projects?.name ?? ''`
- **Defect counts**: query `defects(id, status)` nested under reports, count client-side with `.filter(d => d.status === 'open' || d.status === 'in_progress')`
- **Example of correct join pattern:**

  ```typescript
  // ✅ CORRECT — left join, handles NULL apartment_id
  .select(`id, apartments(number, buildings(name, projects(name, address)))`)
  const apt = data.apartments as { ... } | null;
  const name = apt?.buildings?.projects?.name ?? '';

  // ❌ WRONG — crashes with 406 when apartment_id is NULL
  .select(`id, apartments!inner(number, buildings!inner(name, projects!inner(name)))`)
  ```

### Required Screen States — Every screen MUST implement ALL of these

1. **Loading state**: Skeleton screens (SkeletonBlock) — never bare spinners
2. **Error state**: Icon + Hebrew error message + "נסה שוב" retry button
3. **Empty state**: Icon + descriptive text + CTA button
4. **Data state**: The actual content
5. **Refreshing state**: Pull-to-refresh indicator (isRefreshing from hook)

### Icon Size Rules (Feather icons from @expo/vector-icons)

| Context                               | Icon Size |
| ------------------------------------- | --------- |
| Inline next to 10-12px text           | 10-12px   |
| Inline next to 13-14px text           | 14px      |
| Action buttons (toolbar, row actions) | 20px      |
| Header icons                          | 20-24px   |
| Tab bar icons                         | 22px      |
| FAB icon                              | 24px      |
| Empty state illustration              | 48-64px   |

**Rule:** Icon size must visually match the text it sits beside. When in doubt, match the font size.

### Animation Patterns (react-native-reanimated)

| Pattern             | Implementation                                                                       |
| ------------------- | ------------------------------------------------------------------------------------ |
| Accordion open      | `FadeInDown.duration(250)` entering                                                  |
| Accordion close     | `FadeOutUp.duration(200)` exiting                                                    |
| List items stagger  | `FadeInUp.delay(60 * index).duration(200)` per item                                  |
| Filter bar entrance | Staggered FadeInDown: header(0), search(50ms), chips(100ms)                          |
| Chevron rotation    | `useAnimatedStyle` + `withTiming(isOpen ? 180 : 0)`                                  |
| Progress bar fill   | `withTiming(width, { duration: 600, easing: Easing.bezier(.25,.1,.25,1) })`          |
| Press feedback      | `withSpring(0.98)` scale + `Haptics.impactAsync(Light)`                              |
| Counter animation   | `useSharedValue` + `withTiming` + `useAnimatedReaction` + `runOnJS(setDisplayValue)` |

**Rule:** Every list must have staggered entrance animation. Every accordion must animate open/close. Every interactive element must have press feedback (scale + haptic).

### FAB (Floating Action Button) Pattern

```typescript
// Standard FAB — use this exact pattern on every screen with a FAB
<Pressable style={{
  position: 'absolute', bottom: 80, left: 16, // left in RTL = visual right
  width: 48, height: 48, borderRadius: 24,
  backgroundColor: COLORS.primary[500],
  alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 4px 16px rgba(27,122,68,.3)',
  zIndex: 25,
}} onPress={handlePress}>
  <Feather name="plus" size={24} color="white" />
</Pressable>
```

Always: haptic on press, `scale(0.92)` spring animation, shadow with green tint.

### Bottom Sheet Pattern

- Use `BottomSheetWrapper` (or `@gorhom/bottom-sheet` on native)
- `snapPoints` for height control
- Close via `ref.current?.close()`
- Handle bar: 36×4px, `cr300`
- Top corners: 16px radius

### Form Field Pattern

- Use `ComboField` for any field with suggestions/presets
- `allowCustom` prop for free text
- Active border: `g500` green
- Filled state: green checkmark next to label
- Required fields: label color `n700` (darker)
- Optional fields: label color `n500` (softer)

### Press Feedback — ALL interactive elements

```typescript
// Apply to every Pressable/TouchableOpacity
const animatedScale = useSharedValue(1);
const onPressIn = () => {
  animatedScale.value = withSpring(0.98);
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};
const onPressOut = () => {
  animatedScale.value = withSpring(1);
};
```

### Status Indicators

- Always data-driven — never hardcode visibility
- Notification dots: conditional on count > 0
- Sync status: show only when relevant (post-MVP)
- Badge counts: real data from queries

### RTL Layout

- `flexDirection: 'row-reverse'` for all horizontal layouts
- Logical properties: `marginStart/marginEnd`, `paddingStart/paddingEnd`
- `textAlign: 'right'` for all Hebrew text
- Chevrons: `chevron-left` points forward in RTL (← is the "next" direction)

## Code Rules

**Naming**
| Item | Convention | Example |
|------------|-------------------|------------------------|
| Components | PascalCase | `ChecklistItem.tsx` |
| Hooks | use + camelCase | `useChecklist.ts` |
| Constants | UPPER_SNAKE_CASE | `DEFECT_CATEGORIES.ts` |
| DB tables | snake_case plural | `delivery_reports` |

**Components**

- Max ~200 lines — split if larger
- 3+ useState → extract custom hook
- Every async op: try/catch + Hebrew error message
- No inline styles — NativeWind only
- No prop drilling beyond 2 levels

**State:** Local → useState | Shared → React Context | Server → React Query

**Imports order**

```typescript
// 1. React / framework
// 2. Third-party
// 3. Internal @/ paths
// 4. Components
// 5. Types (import type)
```

**i18n**: All Hebrew strings from packages/shared/src/i18n/ — never hardcoded.
**Validation**: Shared Zod schemas in packages/shared/src/validation/.

## Commands

```bash
npx expo start           # mobile dev
npx turbo build          # build all
npm run typecheck        # TS check — run after every file change
supabase start           # local backend
supabase db reset        # reset + seed
```

## Git

- Branches: main (prod) / develop (staging) / feature/_ / hotfix/_
- Commits: feat: / fix: / docs: / refactor: / security:
- No direct push to main

## Feedback Loop — CRITICAL

After every file change: `npm run typecheck` — fix all errors before continuing.
After completing a feature: `npx turbo build` — fix all errors before continuing.
Never skip. Never defer.

## Quality Protocol

After ANY code change (new feature, bug fix, refactor):

1. `npm run typecheck` — zero errors
2. `npx turbo build` — passes

Before merging / completing a feature:

3. `/design-check` — run design audit on affected screens
4. `npx expo start` — verify visually on device/simulator
5. Screenshot → send to Haim for review approval

## Communication

All explanations, reports, and summaries to the user must be written in Hebrew.
Code, variable names, comments, and file paths remain in English.

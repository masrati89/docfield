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

Phase 5 — building feature screens. Infrastructure complete.

✅ Done: monorepo, auth, login screen, tab navigation skeleton, DB schema + RLS, design tokens, shared types/validation/i18n, seed data, Rubik fonts, NativeWind, Supabase client
🔴 Not built: all tab screens (Home, Reports, Projects, Buildings, Apartments, Checklist, Report Detail, Add Defect, PDF)
⚠️ Partial: register screen (placeholder), components/ui/ (empty), hooks/ (empty)
❌ Missing deps: @jamsch/expo-speech-recognition

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
│   ├── _layout.tsx                # Root layout
│   ├── index.tsx                  # Redirect → auth or app
│   ├── (auth)/
│   │   ├── login.tsx              ✅ full implementation
│   │   └── register.tsx           ⚠️ placeholder
│   └── (app)/
│       ├── index.tsx              ⚠️ basic only → build from mockups/inField-HomeScreen-v6-rtl.jsx
│       ├── reports.tsx            🔴 placeholder → build from mockups/inField-ReportsList-v5-rtl.jsx
│       ├── projects.tsx           🔴 placeholder → build from mockups/inField-ProjectsList-v2.jsx
│       └── settings.tsx           🔴 placeholder (v1.1)
├── components/ui/                 🔴 empty — shared UI components go here
├── hooks/                         🔴 empty — custom hooks go here
├── contexts/AuthContext.tsx        ✅
├── constants/theme.ts             ✅
├── lib/supabase.ts                ✅
└── assets/fonts/                  ✅ Rubik (Regular/Medium/SemiBold/Bold)
```

## Deeper screens (not yet created, need new files)

```
Buildings list  → build from mockups/inField-Buildings-Apartments-v2.jsx
Apartments list → build from mockups/inField-Buildings-Apartments-v2.jsx
Report detail   → build from mockups/inField-MainScreen-v6.jsx
Checklist       → build from mockups/inField-Checklist-FINAL.jsx
Add defect      → build from mockups/inField-AddDefect-v6.jsx
PDF bedek bayit → build from mockups/inField-BedekBayit-PDF.jsx
PDF protocol    → build from mockups/inField-Protocol-PDF.jsx
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
```

All tables: RLS enforced, organization_id tenant isolation.

## Custom Claude Commands

```
.claude/commands/design-check.md    # run before every UI commit
.claude/commands/new-screen.md      # scaffold a new screen
.claude/commands/security-audit.md  # pre-deploy security check
```

## Docs — Load on demand, NOT upfront

| Task                     | Read                                         |
| ------------------------ | -------------------------------------------- |
| Any UI work              | docs/DESIGN_SYSTEM.md + relevant mockup      |
| DB / data models / types | docs/ARCHITECTURE_INFIELD.md                 |
| Auth / RLS / security    | docs/SECURITY_STANDARDS.md                   |
| Screen behavior / inputs | docs/SCREEN_STANDARDS.md                     |
| Code review / pre-deploy | docs/STANDARDS_REFERENCE.md                  |
| Checklist feature        | docs/specs/checklist-implementation-notes.md |
| New session context      | docs/inField-HANDOFF.md                      |

## Mockups (mockups/ — read only the one you need)

```
inField-HomeScreen-v6-rtl.jsx         → app/(app)/index.tsx
inField-ReportsList-v5-rtl.jsx        → app/(app)/reports.tsx
inField-ProjectsList-v2.jsx           → app/(app)/projects.tsx
inField-Buildings-Apartments-v2.jsx   → buildings + apartments screens
inField-Checklist-FINAL.jsx           → checklist screen (note: file is DocField-Checklist-FINAL.jsx)
inField-MainScreen-v6.jsx             → report detail screen
inField-AddDefect-v6.jsx              → add defect form
inField-BedekBayit-PDF.jsx            → PDF template bedek bayit
inField-Protocol-PDF.jsx              → PDF template protocol mesira
```

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
- Shadows: warm rgba(20,19,17,x) — never pure black
- Empty states: icon + text + CTA — always designed

## Security — Non-Negotiable Rules

Full spec: docs/SECURITY_STANDARDS.md

- RLS on every table — no exceptions
- organization_id on every table
- Auth tokens in expo-secure-store — never AsyncStorage
- Zod validation on client AND server
- Never expose service role key in client

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

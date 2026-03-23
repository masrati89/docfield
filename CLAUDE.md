# DocField — Project Instructions

## Product
מערכת דוחות מסירה, בדק בית ופיקוח בענף הבנייה.
שוק יעד: ישראל (עברית, RTL).
מודל עסקי: SaaS — ניסיון חינם (3 דוחות), בסיסי ₪99, מקצועי ₪199, צוות ₪349.

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Mobile App | React Native + Expo SDK 52+ (Expo Router, NativeWind v4) |
| Offline DB | WatermelonDB (SQLite) |
| Drawing/Annotation | @shopify/react-native-skia |
| Speech-to-Text | @jamsch/expo-speech-recognition |
| Styling (Mobile) | NativeWind (Tailwind for RN) |
| Web Dashboard | React + Vite + Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| PDF (On-device) | expo-print (HTML→PDF, works offline) |
| Monorepo | Turborepo + npm workspaces |
| Language | TypeScript 5.x strict everywhere |
| Icons | lucide-react-native |

## Monorepo Structure
```
docfield/
├── apps/mobile/         # React Native + Expo
├── apps/web/            # React + Vite dashboard
├── packages/shared/     # Types, validation (Zod), i18n, constants
└── supabase/            # Migrations, Edge Functions, seed
```

## Design System — READ BEFORE ANY UI WORK
**Mandatory reading before writing any UI code:**
1. `docs/DESIGN_SYSTEM_DOCFIELD.md` — Full design system
2. `.claude/DESIGN_CONTEXT.md` — Brand context and quick reference

### Key Design Rules (Non-Negotiable)
- **Background:** cream-50 `#FEFDFB` — NEVER pure white `#FFFFFF`
- **Primary color:** forest green `#1B7A44` (dark: `#0F4F2E`)
- **Borders:** cream-200 `#F5EFE6` — NEVER gray
- **Accent:** burnished gold `#C8952E`
- **Font:** Rubik (Hebrew), Inter (English/numbers)
- **Direction:** RTL everywhere. Use logical properties (ms/me/ps/pe, NOT ml/mr/pl/pr)
- **Border radius:** minimum 10px for ALL interactive elements
- **Every button:** Reanimated press animation `scale(0.98)` + `Haptics.impactAsync(Light)`
- **Every list:** staggered entrance animation (items fade-in one by one)
- **Loading states:** skeleton screens — NEVER bare spinners
- **Shadows:** warm-tinted using `rgba(20,19,17,x)` — NEVER pure black shadows
- **Empty states:** always designed with icon + text + CTA button

### Severity Colors
| Level | Color | Badge BG | Usage |
|-------|-------|----------|-------|
| Critical | `#EF4444` | `#FEF2F2` | קריטי — must fix before delivery |
| Medium | `#F59E0B` | `#FFFBEB` | בינוני — should fix |
| Low | `#3B82F6` | `#EFF6FF` | קל — cosmetic |
| Pass/Fixed | `#10B981` | `#ECFDF5` | תקין / תוקן |

### Design Skills
When building UI, use these skills in order:
1. Read bencium `MOTION-SPEC.md` for animation timing and easing
2. Run `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack react-native`
3. Follow react-native-reusables patterns for base components

## Architecture Docs
- Full architecture: `docs/ARCHITECTURE_DOCFIELD.md`
- Security blueprint: `docs/SECURITY_DOCFIELD.md`
- Product brief: `docs/PROJECT_BRIEF_DOCFIELD.md`

## Security Rules
- **RLS on EVERY table**, no exceptions. Every table has `organization_id`.
- Supabase Auth tokens stored in `expo-secure-store` — NEVER AsyncStorage.
- Session timeout: 30 minutes idle.
- Signatures are **immutable** — no UPDATE or DELETE policies.
- All user input validated with Zod on BOTH client and server.
- NEVER expose Supabase service role key in client code.

## Code Conventions

### Naming
| Item | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ChecklistItem.tsx` |
| Hooks | camelCase + use prefix | `useChecklist.ts` |
| Utils | camelCase | `formatPhone.ts` |
| Constants | UPPER_SNAKE_CASE | `DEFECT_CATEGORIES.ts` |
| Types | PascalCase | `Defect.types.ts` |
| DB tables | snake_case plural | `delivery_reports` |
| DB columns | snake_case | `created_at` |

### Import Order
```typescript
// 1. React & framework
import { useState } from 'react';
// 2. Third-party
import { z } from 'zod';
// 3. Internal (absolute @/ paths)
import { useAuth } from '@/hooks/useAuth';
// 4. Components
import { Button } from '@/components/ui/Button';
// 5. Types
import type { Defect } from '@docfield/shared';
```

### State Management
| Scope | Solution |
|-------|----------|
| Component-local | `useState` |
| Parent-child (1-2 levels) | Props |
| Shared across components | React Context |
| Complex state | `useReducer` + Context |
| Server data / cache | React Query (TanStack Query) |
| Never prop-drill beyond 2 levels |

### Component Rules
- Max ~200 lines per component file
- If more than 3 `useState` hooks → extract a custom hook
- Single responsibility — each component does ONE thing
- All async operations have try/catch with Hebrew error messages
- No inline styles on mobile — use NativeWind classes

### i18n
- ALL UI text comes from `packages/shared/src/i18n/` — NEVER hardcode Hebrew strings in components
- Translation keys: English, dot-notation (e.g., `defects.severity.critical`)
- Values: natural Hebrew

### Validation
- Shared Zod schemas in `packages/shared/src/validation/`
- Used on both client (UX feedback) and server (security enforcement)
- Israeli phone format: `/^0[2-9]\d{7,8}$/`

## Commands
```bash
# Development
npm run dev              # Start dev (from app directory)
npx expo start           # Start mobile app
npx turbo build          # Build all packages
npx turbo lint           # Lint all packages
npx tsc --noEmit         # TypeScript check (run before every commit)

# Database
supabase start           # Local Supabase
supabase db reset        # Reset with migrations + seed
supabase migration new   # Create new migration

# Testing
npx turbo test           # Run all tests
```

## Offline-First Architecture
- All data saves to WatermelonDB (SQLite) FIRST, always.
- Sync to Supabase in background when network available.
- Conflict resolution: last_write_wins (safe because each inspector works on their own reports).
- Photos: compress locally → upload in background → store URL.
- PDF generation works fully offline via expo-print.

## Git
- `main` = production, `develop` = staging
- Feature branches: `feature/checklist-engine`, `feature/camera-annotation`
- Commit after each meaningful unit of work
- Tag releases: `v1.0.0`, `v1.1.0`

## Referenced Documents
@docs/DESIGN_SYSTEM_DOCFIELD.md
@docs/ARCHITECTURE_DOCFIELD.md
@docs/SECURITY_DOCFIELD.md

## Compacting Instructions
When compacting context, ALWAYS preserve:
- List of all modified files in current session
- Current task status and next steps
- Any errors or issues encountered
- Design system color values and key rules

## Feedback Loops (IMPORTANT)
After EVERY file change: run `npx tsc --noEmit` to verify TypeScript compiles.
After completing a feature: run `npx turbo build` to verify everything builds.
If either fails — fix the errors before moving on. Do not skip this step.

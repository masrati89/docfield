# 🎯 DocField — פקודות Claude Code מעשיות

> **איך להשתמש במסמך הזה:**
> 1. כל פקודה = session חדש של Claude Code
> 2. מדביקים את הפקודה → Claude Code מציג plan → אתה מאשר → הוא מבצע
> 3. אחרי ביצוע — מריצים את הבדיקות שרשומות
> 4. אם הכל עובד → commit → סוגרים session → עוברים לפקודה הבאה
> 5. אם משהו נכשל → מתקנים באותו session → בודקים שוב

---

## פקודה 0: התקנת Skills עיצוב

**פתח Claude Code:**
```bash
cd ~/Projects/docfield
claude
```

**הדבק:**
```
Install the following design skills for this project:

1. /plugin marketplace add bencium/bencium-marketplace
2. /plugin install bencium-controlled-ux-designer@bencium-marketplace
3. /plugin install bencium-innovative-ux-designer@bencium-marketplace
4. Install ui-ux-pro-max: npm install -g uipro-cli && uipro init --ai claude

After installing, create .claude/DESIGN_CONTEXT.md with this content:

# DocField Design Context
## Brand
- Name: DocField
- Industry: Construction / Building Inspection
- Audience: Field inspectors, project managers, contractors (Israel)
- Personality: Professional, premium, trustworthy, modern

## Color Palette (OVERRIDE any skill defaults)
- Primary: Forest Green (#1B7A44 main, #0F4F2E dark)
- Secondary: Warm Cream (#FEFDFB bg, #FBF8F3 surface, #F5EFE6 border)
- Accent: Burnished Gold (#C8952E)
- Severity: Red #EF4444, Amber #F59E0B, Blue #3B82F6
- Success: Green #10B981
- Text: #252420 heading, #5C5852 body, #A8A49D caption

## Typography
- Hebrew: Rubik (Google Fonts)
- English/Numbers: Inter (Google Fonts)  
- Direction: RTL

## Rules
- Background: cream #FEFDFB, NEVER pure white
- Borders: cream #F5EFE6, NEVER gray
- Border radius: minimum 10px interactive elements
- Every button: scale(0.98) press animation + haptic
- Every list: staggered entrance animation
- Loading: skeleton screens, NEVER spinners
- Shadows: warm-tinted rgba(20,19,17,x), NEVER pure black

Verify all 3 skills are installed by listing .claude/skills/
```

**בדיקות:**
```
ls .claude/skills/
# צריך לראות: bencium-controlled-ux-designer, bencium-innovative-ux-designer, ui-ux-pro-max

cat .claude/DESIGN_CONTEXT.md
# צריך לראות את קובץ הפלטה
```

**אם הכל עובד:**
```
Commit: git add -A && git commit -m "chore: install design skills and create DESIGN_CONTEXT"
```

**סגור session** (Ctrl+C או `/exit`)

---

## פקודה 1: הקמת Monorepo

**פתח session חדש:**
```bash
cd ~/Projects/docfield
claude
```

**הדבק:**
```
Read docs/ARCHITECTURE_DOCFIELD.md section 3 (folder structure).

Create the monorepo structure for DocField with:
- Turborepo as monorepo tool
- npm workspaces: ["apps/*", "packages/*"]
- TypeScript 5.x with strict mode
- Base tsconfig.json at root

Create these workspaces (empty for now, we'll fill them in next steps):
- apps/mobile/ (just package.json placeholder)
- apps/web/ (just package.json placeholder)  
- packages/shared/ (with src/ directory structure for types, constants, validation, i18n, utils)
- supabase/ directory (functions/, migrations/, seed.sql placeholder)

Also create:
- turbo.json with build/lint/test pipelines
- Root package.json with workspaces config
- tsconfig.base.json (strict, ES2022, bundler moduleResolution)
- README.md (project name "DocField", Hebrew description, tech stack table)

Plan first — show me the file list and structure before creating anything.
```

**בדיקות (בקש מ-Claude Code להריץ):**
```
After creating everything, verify:
1. Run: npm install
2. Run: npx tsc --noEmit (from packages/shared if tsconfig exists)
3. Show me the full directory tree
```

**אם הכל עובד:**
```
Create branch feature/monorepo-setup, commit all files with message "feat: initialize monorepo with Turborepo and workspaces"
```

**סגור session**

---

## פקודה 2: Shared Package — Types, Constants, Validation, i18n

**פתח session חדש:**
```bash
cd ~/Projects/docfield
claude
```

**הדבק:**
```
Read docs/ARCHITECTURE_DOCFIELD.md section 5 (Database Schema) for the data model.

In packages/shared/, create the complete shared package:

1. Types (src/types/) — TypeScript interfaces for ALL entities:
   auth, organization, project, building, apartment, delivery_report,
   checklist_template, checklist_category, checklist_item, checklist_result,
   defect, defect_photo, annotation, signature, sub_contractor, client.
   Use the DB schema from the architecture doc as reference.

2. Constants (src/constants/) — rooms list (Hebrew), defect categories (Hebrew),
   severity config (label + color + icon), defect status config, report types.

3. Validation (src/validation/) — Zod schemas for:
   createDefect, createProject, createBuilding, createApartment,
   createDeliveryReport, checklistResult.
   Israeli phone regex: /^0[2-9]\d{7,8}$/

4. i18n (src/i18n/) — he.json and en.json covering:
   common actions, auth, projects, inspection, defects, checklist, status.
   Plus a simple t(key) translation function.

5. Barrel export in src/index.ts

Package config: name "@docfield/shared", dependency on zod.

Plan the types structure first — show me the interfaces before creating files.
```

**בדיקות:**
```
After creating:
1. Run: cd packages/shared && npx tsc --noEmit
2. Verify: import { Defect, ROOMS, createDefectSchema } from './src'
3. Verify Zod works: test createDefectSchema.parse({ description: 'test', severity: 'medium' })
4. Show me the full file list in packages/shared/src/
```

**אם הכל עובד:**
```
Commit with message "feat: create shared package with types, constants, validation, i18n"
```

**סגור session**

---

## פקודה 3: אפליקציית Mobile — Expo Setup

**פתח session חדש:**
```bash
cd ~/Projects/docfield
claude
```

**הדבק:**
```
Read docs/ARCHITECTURE_DOCFIELD.md section 3 (mobile app structure).
Read docs/DESIGN_SYSTEM_DOCFIELD.md sections 2-6 (colors, typography, spacing, radius, shadows).

Set up the Expo app in apps/mobile/:
- Expo SDK 52+, TypeScript, Expo Router (file-based routing)
- NativeWind v4 (Tailwind for React Native)

Install ALL these dependencies:
Navigation: expo-router, react-native-screens, react-native-safe-area-context
Styling: nativewind, tailwindcss
Animation: react-native-reanimated, react-native-gesture-handler
UI: @gorhom/bottom-sheet, expo-blur, expo-haptics, expo-image, expo-status-bar, @shopify/flash-list
Offline DB: @nozbe/watermelondb
Drawing: @shopify/react-native-skia
Speech: @jamsch/expo-speech-recognition
Storage: react-native-mmkv, @react-native-community/netinfo
Camera: expo-image-manipulator, expo-camera, expo-image-picker
PDF: expo-print, expo-sharing, expo-file-system
Security: expo-secure-store, expo-crypto
Backend: @supabase/supabase-js
Validation: zod, fuse.js
Icons: lucide-react-native, react-native-svg
Sanitization: isomorphic-dompurify

Configure:
- tailwind.config.js with DocField colors from DESIGN_SYSTEM (the full palette)
- app.config.ts: name "DocField", scheme "docfield", iOS/Android bundle IDs
- NativeWind babel preset

Create file-based routing:
- app/_layout.tsx (GestureHandler, SafeArea, StatusBar, NativeWind CSS)
- app/index.tsx (redirect)
- app/(auth)/ — login.tsx, register.tsx (placeholder screens)
- app/(main)/ — tab navigator with projects, inspection, settings

Create:
- src/lib/supabase.ts (client with expo-secure-store for auth, NOT AsyncStorage)
- src/lib/mmkv.ts (MMKV instance for non-sensitive storage)
- src/theme/colors.ts (full DocField palette as typed object)
- src/theme/typography.ts (text style presets from Design System)
- src/theme/spacing.ts (spacing tokens)

Add dependency on "@docfield/shared": "*" in package.json.

Plan the setup steps first — show me the order before executing.
```

**בדיקות:**
```
After setup:
1. Run: npx expo start (verify it launches)
2. Verify: import { ROOMS } from '@docfield/shared' works
3. Verify: NativeWind classes apply (check tailwind.config has DocField colors)
4. Verify: supabase.ts uses expo-secure-store (NOT AsyncStorage)
5. Show me theme/colors.ts to confirm palette matches Design System
6. Run: npx tsc --noEmit
```

**אם הכל עובד:**
```
Commit with message "feat: set up Expo app with NativeWind, routing, and DocField theme"
```

**סגור session**

---

## פקודה 4: Supabase Database

**פתח session חדש:**
```bash
cd ~/Projects/docfield
claude
```

**הדבק:**
```
Read docs/ARCHITECTURE_DOCFIELD.md section 5 (Database Schema — full section).
Read docs/SECURITY_DOCFIELD.md section 2 (RLS policies).

Create the complete Supabase database setup in supabase/:

Migration 001_core_tables.sql:
All 16 tables from the architecture doc, in correct FK order.
Every table has: id UUID PK, organization_id FK, created_at, updated_at.
All CHECK constraints for enums (status, severity, role, etc).

Migration 002_indexes.sql:
All indexes from the architecture doc.
Include pg_trgm extension for fuzzy search on defect_library.

Migration 003_rls_policies.sql:
- Create helper function auth.user_organization_id()
- Enable RLS on EVERY table
- SELECT/INSERT/UPDATE: organization_id must match user's org
- DELETE: admin only
- Signatures: SELECT + INSERT only (IMMUTABLE — no UPDATE, no DELETE)
- Checklist templates + defect library: include is_global = true in SELECT

Migration 004_updated_at_trigger.sql:
Auto-update updated_at on every UPDATE for all tables.

seed.sql:
One demo organization, one project with 2 buildings and 8 apartments,
one global checklist template with 8 categories and 40+ items (realistic Hebrew),
20 global defect library entries.

Plan the table creation order first — show me the dependency graph.
```

**בדיקות:**
```
After creating:
1. Run: supabase start (if Supabase CLI installed locally)
   OR: show me each migration file so I can verify the SQL
2. Verify: RLS is enabled on EVERY table (grep for ENABLE ROW LEVEL SECURITY)
3. Verify: signatures table has NO update/delete policy
4. Verify: all indexes reference correct columns
5. Count: should be 16 tables, 13+ indexes, 40+ RLS policies
```

**אם הכל עובד:**
```
Commit with message "feat: create database schema with RLS, indexes, and seed data"
```

**סגור session**

---

## פקודה 5: Web Dashboard — Vite Setup

**פתח session חדש:**
```bash
cd ~/Projects/docfield
claude
```

**הדבק:**
```
Read docs/DESIGN_SYSTEM_DOCFIELD.md sections 2-3 (colors, typography).

Set up the web dashboard in apps/web/:
- Vite 5+, React 18+, TypeScript, Tailwind CSS v3
- React Router DOM v6
- RTL from day 1

Setup:
- index.html: <html dir="rtl" lang="he">, import Rubik font from Google Fonts
- tailwind.config.js: same DocField colors as mobile app
- globals.css: Tailwind directives, font-family Rubik, cream-50 background
- Supabase client (same pattern as mobile, URL + anon key from env)
- Router: /login, /, /projects, /projects/:id, 404

Create placeholder pages with Hebrew text:
- Login: "התחברות ל-DocField" with email/password form
- Dashboard: "דשבורד" with "ברוך הבא" message
- Projects: "פרויקטים" with empty state

Add dependency on "@docfield/shared": "*"

Plan first — show me the file list.
```

**בדיקות:**
```
After setup:
1. Run: npm run dev (verify it launches)
2. Verify: RTL layout (text aligned right)
3. Verify: Rubik font loads
4. Verify: Background is cream (#FEFDFB), not white
5. Verify: import { ROOMS } from '@docfield/shared' works
6. Run: npx tsc --noEmit
```

**אם הכל עובד:**
```
Commit with message "feat: set up web dashboard with Vite, RTL, and DocField theme"
```

**סגור session**

---

## פקודה 6: אימות כולל

**פתח session חדש:**
```bash
cd ~/Projects/docfield
claude
```

**הדבק:**
```
Run a complete integration check for the DocField monorepo:

1. From root: npm install (all workspaces)
2. From root: npx turbo build (all packages compile)
3. Shared: verify types, constants, validation, i18n all export correctly
4. Mobile: npx expo start --no-dev (verify startup)
5. Web: npm run build (production build succeeds)
6. Supabase: show all migration files exist in correct order
7. Design: verify .claude/DESIGN_CONTEXT.md exists
8. Skills: verify .claude/skills/ has all 3 design skills
9. Git: show current branch and commit log

Report results as:
✅ = passed
❌ = failed (with explanation)

Fix any failures before reporting.
```

**אם הכל ✅:**
```
Merge feature branch to develop: git checkout -b develop && git merge feature/monorepo-setup
Commit with message "chore: complete Phase 4 — project setup verified"
```

**סגור session**

---

## אחרי Phase 4 — הפקודות הבאות (Phase 5)

כל פקודה מ-Phase 5 עוקבת אחרי אותו פורמט:

```
1. פתח session חדש
2. Create branch feature/[name]
3. הדבק את הפקודה (קצרה + הפנייה למסמך)
4. Claude Code מציג plan → אתה מאשר
5. הוא מבצע
6. בדיקות (tsc + build + specific checks)
7. Commit → סגור session
```

### פקודה 7: WatermelonDB Schema + Models
```
Read docs/ARCHITECTURE_DOCFIELD.md section 4 (Offline-First Architecture).
Read the types in packages/shared/src/types/.

Create WatermelonDB setup in apps/mobile/src/db/:
- schema.ts matching all Supabase tables
- Model classes for each entity
- sync.ts with pull/push logic for Supabase sync
- Conflict resolution: last_write_wins

Plan the model relationships first.

After creating: verify the schema compiles with npx tsc --noEmit.
```

### פקודה 8: Auth Flow
```
Read docs/SECURITY_DOCFIELD.md sections 1-2 (Auth, RLS).
Read docs/DESIGN_SYSTEM_DOCFIELD.md for login screen design.

Build complete auth flow for mobile:
- Login screen (email + password, Hebrew, RTL, DocField design)
- Register screen
- AuthContext (user, role, businessId, isLoading)
- Protected routes (redirect to login if not authenticated)
- Session stored in expo-secure-store
- Auto-refresh token

Use bencium-innovative-ux-designer skill for the login screen design.
Plan the auth flow first — show me the component tree.

After creating: run npx tsc --noEmit. Manually test login flow.
```

### פקודה 9: Checklist Engine (Core Feature)
```
Read docs/ARCHITECTURE_DOCFIELD.md section 7 (Checklist Engine).
Read docs/DESIGN_SYSTEM_DOCFIELD.md section 7 (Component Patterns — all checklist items).
Read .claude/DESIGN_CONTEXT.md for brand rules.

Build the Checklist Engine — the core of DocField:
- Room tabs (horizontal scroll, active in green)
- Checklist items: V (pass), X (fail), — (N/A), ? (pending)
- When X pressed → auto-create defect → open defect bottom sheet
- Defect form: description, severity selector, category pills, photo slots, voice note
- Progress bar per room
- Staggered list animations, press animations, haptic feedback

Use bencium MOTION-SPEC.md for all animations.
This is the most important screen — take extra care with the design.
Plan the component tree and data flow first.

After creating: run npx tsc --noEmit. Run npx turbo build.
```

### פקודות 10-16: (יבנו בהמשך)
- 10: Camera + Photo Annotation (Skia)
- 11: Signature Pad (Skia)
- 12: PDF Generation (expo-print)
- 13: Defect Library + Fuzzy Search
- 14: Speech-to-Text
- 15: Web Dashboard screens
- 16: QA + Security Audit

---

## כללי זהב

| כלל | למה |
|-----|-----|
| Session חדש לכל פקודה | Context נקי, אין "שכחה" |
| "Plan first" תמיד | מפחית שגיאות ב-45% |
| בדיקות אחרי כל שלב | תופס בעיות מיד |
| Commit אחרי כל שלב | נקודת חזרה בטוחה |
| Feature branch | main תמיד עובד |
| הוראה קצרה + הפנייה למסמך | יותר יעיל מ-prompt ארוך |
| `/compact` ב-sessions ארוכים | מונע אובדן context |

---

*DocField — Claude Code Practical Commands | מרץ 2026*

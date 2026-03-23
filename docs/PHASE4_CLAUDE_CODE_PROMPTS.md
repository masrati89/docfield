# 🚀 PHASE 4 — PROJECT SETUP: Claude Code Execution Prompts

> **מסמך זה מכיל פרומפטים מפורטים שנותנים ל-Claude Code לביצוע.**
> כל פרומפט הוא משימה אוטונומית שClaude Code מבצע ומדווח.
> חיים מאשר תוצאה לפני שממשיכים לפרומפט הבא.
>
> **סדר ביצוע: חובה לבצע לפי הסדר. כל שלב תלוי בקודם.**

---

## הוראות לשימוש

```
1. העתק את הפרומפט הרלוונטי
2. הדבק אותו ב-Claude Code
3. תן לו לבצע
4. בדוק שהתוצאה נכונה
5. רק אז עבור לפרומפט הבא
```

---

## PROMPT 0: Claude Code Skills & Design Intelligence Setup

```
# DocField — Claude Code Skills Installation

BEFORE any code is written, install the following design intelligence 
skills that will guide ALL UI/UX decisions throughout the project.

## Step 1: Install bencium UX Designer Skill
/plugin marketplace add bencium/bencium-marketplace
/plugin install bencium-controlled-ux-designer@bencium-marketplace

## Step 2: Install UI/UX Pro Max Skill
npm install -g uipro-cli
uipro init --ai claude

## Step 3: Install Innovative UX Designer (for special screens)
/plugin install bencium-innovative-ux-designer@bencium-marketplace

## Step 4: Verify Skills are loaded
Check that .claude/skills/ contains:
- bencium-controlled-ux-designer/SKILL.md
- bencium-controlled-ux-designer/MOTION-SPEC.md
- bencium-controlled-ux-designer/ACCESSIBILITY.md
- bencium-controlled-ux-designer/RESPONSIVE-DESIGN.md
- ui-ux-pro-max/SKILL.md
- ui-ux-pro-max/scripts/search.py
- ui-ux-pro-max/data/*.csv

## Step 5: Generate DocField Design System via ui-ux-pro-max
Run the following to get design recommendations for our project:

python3 .claude/skills/ui-ux-pro-max/scripts/search.py "construction field inspection B2B premium" --design-system --stack react-native

python3 .claude/skills/ui-ux-pro-max/scripts/search.py "dark green cream earth tones luxury" --domain color

python3 .claude/skills/ui-ux-pro-max/scripts/search.py "professional hebrew RTL mobile" --domain typography

Save the output — it will inform design decisions throughout the project.

## Step 6: Create Design Reference File
Create a file at docfield/.claude/DESIGN_CONTEXT.md with the following content:

---
# DocField Design Context

## Brand
- Name: DocField
- Industry: Construction / Building Inspection
- Audience: Field inspectors, project managers, contractors (Israel)
- Personality: Professional, premium, trustworthy, modern

## Color Palette (OVERRIDE any skill defaults with these)
- Primary: Forest Green (#1B7A44 main, #0F4F2E dark, #062818 darkest)
- Secondary: Warm Cream (#FEFDFB bg, #FBF8F3 surface, #F5EFE6 border)
- Accent: Burnished Gold (#C8952E)
- Severity: Red #EF4444 (critical), Amber #F59E0B (medium), Blue #3B82F6 (low)
- Success: Green #10B981
- Text: Warm grays (#252420 heading, #5C5852 body, #A8A49D caption)

## Typography
- Hebrew: Rubik (Google Fonts)
- English/Numbers: Inter (Google Fonts)
- Direction: RTL

## Design Principles (enforced by bencium skill)
1. No flat/generic UI — every element needs depth and interaction feedback
2. Warm shadows (tinted with neutral-900, never pure black)
3. Generous border radius (minimum 10px for interactive elements)
4. Micro-interactions on EVERY interactive element
5. Staggered list animations on ALL lists
6. Skeleton screens for loading (never bare spinners)
7. Spring-based animations (Reanimated)
8. Haptic feedback on significant actions
9. Background cream (#FEFDFB) instead of pure white
10. Cream-tinted borders (#F5EFE6) instead of gray

## UI Kit Base: react-native-reusables (copy-paste + customize to our palette)
## Motion Spec: Follow bencium MOTION-SPEC.md
## Stack-specific: Follow ui-ux-pro-max React Native guidelines
---

## After setup:
- Verify all 3 skills are accessible
- Verify search.py returns results
- Verify DESIGN_CONTEXT.md is created
- Claude Code should now automatically apply design intelligence to all UI work
```

---

## PROMPT 1: Monorepo Initialization

```
# DocField — Project Initialization

Create a new monorepo project called "docfield" with the following structure using Turborepo.

## Requirements:
- Package manager: npm (with workspaces)
- Monorepo tool: Turborepo
- TypeScript 5.x everywhere
- Strict TypeScript config

## Structure to create:

docfield/
├── apps/
│   ├── mobile/          # Will be Expo app (created in next prompt)
│   └── web/             # Will be Vite app (created in next prompt)
├── packages/
│   └── shared/          # Shared types, constants, validation, i18n
│       ├── src/
│       │   ├── types/           # TypeScript interfaces
│       │   ├── constants/       # Enums, categories, rooms
│       │   ├── validation/      # Zod schemas
│       │   ├── i18n/            # Translation files
│       │   └── utils/           # Shared utility functions
│       ├── package.json
│       └── tsconfig.json
├── supabase/
│   ├── functions/       # Edge Functions (empty for now)
│   ├── migrations/      # DB migrations (empty for now)
│   └── config.toml      # Supabase config
├── docs/                # Documentation
├── turbo.json
├── package.json         # Root package.json with workspaces
├── tsconfig.base.json   # Base TypeScript config
├── .gitignore
├── .env.example
└── README.md

## Root package.json workspaces:
["apps/*", "packages/*"]

## .gitignore must include:
node_modules, .env, .env.local, dist, build, .turbo, .expo, ios, android

## .env.example must include:
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=server_only_key

## tsconfig.base.json:
- strict: true
- noUncheckedIndexedAccess: true
- target: ES2022
- moduleResolution: bundler

## README.md:
Write a basic README with project name "DocField", description "מערכת דוחות מסירה, בדק בית ופיקוח בענף הבנייה", 
tech stack table, and getting started instructions.

## After creation:
- Run npm install
- Verify turbo.json has build/lint/test pipelines
- Verify TypeScript compiles without errors
```

---

## PROMPT 2: Shared Package — Types & Constants

```
# DocField — Shared Package: Types, Constants, Validation

In the packages/shared directory, create the core shared code that will be used by both mobile and web apps.

## 1. Types (src/types/)

### auth.types.ts
export type UserRole = 'admin' | 'project_manager' | 'inspector';

export interface User {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

### organization.types.ts
export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  settings: OrganizationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  defaultReportType: ReportType;
  defaultLanguage: 'he' | 'en';
  pdfBrandingEnabled: boolean;
}

### project.types.ts
export interface Project {
  id: string;
  organizationId: string;
  name: string;
  address?: string;
  city?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'active' | 'completed' | 'archived';

export interface Building {
  id: string;
  projectId: string;
  organizationId: string;
  name: string;
  floorsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Apartment {
  id: string;
  buildingId: string;
  organizationId: string;
  number: string;
  floor?: number;
  roomsCount?: number;
  apartmentType?: string;
  status: ApartmentStatus;
  createdAt: string;
  updatedAt: string;
}

export type ApartmentStatus = 'pending' | 'in_progress' | 'delivered' | 'completed';

### inspection.types.ts
export type ReportType = 'delivery' | 'bedek_bait' | 'supervision' | 'leak_detection' | 'tenant_damage' | 'public_spaces' | 'commercial';

export type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'sent';

export interface DeliveryReport {
  id: string;
  apartmentId: string;
  organizationId: string;
  inspectorId: string;
  checklistTemplateId?: string;
  reportType: ReportType;
  roundNumber: number;
  status: ReportStatus;
  tenantName?: string;
  tenantPhone?: string;
  tenantEmail?: string;
  notes?: string;
  pdfUrl?: string;
  reportDate: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

### defect.types.ts
export type Severity = 'critical' | 'medium' | 'low';
export type DefectStatus = 'open' | 'in_progress' | 'fixed' | 'not_fixed';
export type DefectSource = 'checklist' | 'manual' | 'library';

export interface Defect {
  id: string;
  deliveryReportId: string;
  organizationId: string;
  checklistResultId?: string;
  description: string;
  room?: string;
  category?: string;
  severity: Severity;
  status: DefectStatus;
  source: DefectSource;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DefectPhoto {
  id: string;
  defectId: string;
  organizationId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  annotations: Annotation[];
  sortOrder: number;
  createdAt: string;
}

export interface Annotation {
  type: 'arrow' | 'circle' | 'rectangle' | 'text' | 'freehand';
  x: number;
  y: number;
  width?: number;
  height?: number;
  endX?: number;
  endY?: number;
  color: string;
  strokeWidth: number;
  text?: string;
  points?: { x: number; y: number }[];
}

### checklist.types.ts
export interface ChecklistTemplate {
  id: string;
  organizationId?: string;
  name: string;
  reportType: ReportType;
  isGlobal: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistCategory {
  id: string;
  templateId: string;
  name: string;
  sortOrder: number;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  categoryId: string;
  description: string;
  defaultSeverity: Severity;
  requiresPhoto: boolean;
  sortOrder: number;
}

export type ChecklistResultValue = 'pass' | 'fail' | 'na';

export interface ChecklistResult {
  id: string;
  deliveryReportId: string;
  checklistItemId: string;
  organizationId: string;
  result: ChecklistResultValue;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

### signature.types.ts
export type SignerType = 'inspector' | 'tenant';

export interface Signature {
  id: string;
  deliveryReportId: string;
  organizationId: string;
  signerType: SignerType;
  signerName: string;
  imageUrl: string;
  signedAt: string;
  createdAt: string;
}

## 2. Constants (src/constants/)

### rooms.ts
export const ROOMS = [
  'מטבח',
  'סלון',
  'חדר שינה 1',
  'חדר שינה 2',
  'חדר שינה 3',
  'חדר רחצה ראשי',
  'חדר רחצה הורים',
  'שירותים',
  'מרפסת שירות',
  'מרפסת סלון',
  'מרפסת חדר שינה',
  'ממ"ד',
  'מסדרון',
  'כניסה',
  'חדר כביסה',
  'מחסן',
  'חניה',
  'חצר',
  'גג',
  'חיצוני',
  'כללי',
] as const;

export type RoomType = typeof ROOMS[number];

### categories.ts
export const DEFECT_CATEGORIES = [
  'טיח',
  'צבע',
  'ריצוף ואריחים',
  'חשמל',
  'אינסטלציה',
  'אלומיניום',
  'נגרות',
  'מסגרות',
  'איטום ורטיבות',
  'מיזוג אוויר',
  'גז',
  'בטיחות',
  'נגישות',
  'כללי',
] as const;

export type DefectCategory = typeof DEFECT_CATEGORIES[number];

### severity.ts
export const SEVERITY_CONFIG = {
  critical: { label: 'קריטי', color: '#DC2626', icon: 'alert-circle' },
  medium: { label: 'בינוני', color: '#F59E0B', icon: 'alert-triangle' },
  low: { label: 'קל', color: '#3B82F6', icon: 'info' },
} as const;

### defectStatus.ts
export const DEFECT_STATUS_CONFIG = {
  open: { label: 'פתוח', color: '#DC2626' },
  in_progress: { label: 'בטיפול', color: '#F59E0B' },
  fixed: { label: 'תוקן', color: '#10B981' },
  not_fixed: { label: 'לא תוקן', color: '#6B7280' },
} as const;

## 3. Validation (src/validation/)

### defect.schema.ts
Use Zod. Create schemas for:
- createDefectSchema (description required min 2, severity required, room optional, category optional)
- updateDefectSchema (partial of create + status)

### project.schema.ts
- createProjectSchema (name required min 2, address optional, city optional)
- createBuildingSchema (name required, floorsCount optional positive int)
- createApartmentSchema (number required, floor optional int, roomsCount optional, apartmentType optional)

### inspection.schema.ts
- createDeliveryReportSchema (apartmentId uuid, reportType, tenantName optional, tenantPhone optional regex Israeli phone)
- checklistResultSchema (result: pass/fail/na, note optional)

Israeli phone regex: /^0[2-9]\d{7,8}$/

## 4. i18n (src/i18n/)

### he.json
Create Hebrew translations covering:
- common: save, cancel, delete, edit, loading, error, success, confirm, back, search, noResults, close, send, share, retry
- auth: login, logout, email, password, forgotPassword, loginError, register
- projects: title, newProject, projectName, address, city, buildings, apartments
- inspection: title, newInspection, checklist, defects, photos, signatures, generatePdf, sendReport, round
- defects: title, newDefect, description, room, category, severity, status, addPhoto, addNote
- checklist: pass (תקין), fail (ליקוי), na (לא רלוונטי), completed, items
- status: draft, inProgress, completed, sent, open, fixed, notFixed

### en.json
English translations for the same keys.

### index.ts
Simple translation function:
- Load locale from parameter
- Return t(key) function that resolves dot-notation keys
- Fallback to key if not found

## 5. Package Configuration

### package.json
- name: "@docfield/shared"
- main: src/index.ts
- dependencies: zod
- devDependencies: typescript

### index.ts (barrel export)
Export everything from types, constants, validation, i18n, utils

## After creation:
- Verify TypeScript compiles: npx tsc --noEmit
- Verify all imports resolve correctly
```

---

## PROMPT 3: Mobile App — Expo Setup

```
# DocField — Mobile App Initialization

Create the Expo app in apps/mobile using create-expo-stack or npx create-expo-app.

## Requirements:
- Expo SDK 52+
- TypeScript
- Expo Router (file-based routing)
- NativeWind v4 (Tailwind CSS for React Native)

## Setup Steps:

1. Create Expo app:
   cd apps/mobile
   npx create-expo-app@latest . --template blank-typescript

2. Install core dependencies (ALL of these):

   # Navigation
   npx expo install expo-router react-native-screens react-native-safe-area-context

   # Styling
   npm install nativewind tailwindcss
   
   # UI & Animation
   npm install react-native-reanimated react-native-gesture-handler
   npm install @gorhom/bottom-sheet
   npx expo install expo-blur expo-haptics expo-image expo-status-bar
   
   # Lists
   npm install @shopify/flash-list
   
   # Offline DB
   npm install @nozbe/watermelondb
   
   # Drawing & Annotation
   npm install @shopify/react-native-skia
   
   # Speech to Text
   npm install @jamsch/expo-speech-recognition
   
   # Storage & Network
   npm install react-native-mmkv
   npm install @react-native-community/netinfo
   
   # Image Processing
   npx expo install expo-image-manipulator expo-camera expo-image-picker
   
   # PDF & Sharing
   npx expo install expo-print expo-sharing expo-file-system
   
   # Security
   npx expo install expo-secure-store expo-crypto
   
   # Supabase
   npm install @supabase/supabase-js
   
   # Validation & Search
   npm install zod fuse.js
   
   # Sanitization
   npm install isomorphic-dompurify

3. Configure NativeWind:
   - Create tailwind.config.js with content paths
   - Add NativeWind babel preset to babel.config.js
   - Create global.css with @tailwind directives

4. Configure app.json / app.config.ts:
   - name: "DocField"
   - slug: "docfield"
   - scheme: "docfield"
   - orientation: "portrait"
   - icon, splash, adaptiveIcon: placeholder (we'll design later)
   - plugins: [
       "expo-router",
       "expo-secure-store",
       "expo-camera",
       "expo-image-picker",
       "@jamsch/expo-speech-recognition"
     ]
   - ios.bundleIdentifier: "com.docfield.app"
   - android.package: "com.docfield.app"

5. Create basic file-based routing structure:
   app/
   ├── _layout.tsx          # Root layout with SafeAreaProvider, GestureHandler
   ├── index.tsx            # Redirect to login or main
   ├── (auth)/
   │   ├── _layout.tsx
   │   ├── login.tsx        # Login screen (placeholder)
   │   └── register.tsx     # Register screen (placeholder)
   └── (main)/
       ├── _layout.tsx      # Tab navigator
       ├── (projects)/
       │   ├── _layout.tsx
       │   └── index.tsx    # Projects list (placeholder)
       ├── (inspection)/
       │   ├── _layout.tsx
       │   └── index.tsx    # Active inspection (placeholder)
       └── (settings)/
           ├── _layout.tsx
           └── index.tsx    # Settings (placeholder)

6. Create src/ directory structure:
   src/
   ├── components/ui/       # Empty for now
   ├── components/forms/    # Empty for now  
   ├── components/camera/   # Empty for now
   ├── components/voice/    # Empty for now
   ├── components/layout/   # Empty for now
   ├── hooks/               # Empty for now
   ├── services/            # Empty for now
   ├── db/                  # Empty for now
   ├── lib/
   │   ├── supabase.ts      # Supabase client initialization
   │   └── mmkv.ts          # MMKV storage initialization
   └── utils/               # Empty for now

7. Create lib/supabase.ts:
   Initialize Supabase client with:
   - URL from EXPO_PUBLIC_SUPABASE_URL
   - Anon key from EXPO_PUBLIC_SUPABASE_ANON_KEY
   - Auth storage using expo-secure-store (NOT AsyncStorage)
   - Auto refresh token: true

8. Create lib/mmkv.ts:
   Initialize MMKV instance for non-sensitive storage (settings, cache, UI state)

9. Root _layout.tsx must include:
   - GestureHandlerRootView wrapping everything
   - SafeAreaProvider
   - StatusBar configuration
   - NativeWind CSS import

## Workspace Configuration:
- In apps/mobile/package.json, add dependency on "@docfield/shared": "*"
- Verify shared package imports work: import { ROOMS } from '@docfield/shared'

## Design System Setup:
10. Install react-native-reusables base components:
    Copy the following components from react-native-reusables into src/components/ui/:
    - Button (with variants: primary, secondary, ghost, danger)
    - Input (with label, error state, RTL support)
    - Card (with shadow, border, padding)
    - Badge (severity colors)
    - Sheet/BottomSheet wrapper
    - Separator
    - Text (with variants: display, h1, h2, h3, body, caption, small)
    
    After copying, customize ALL components to match DocField palette:
    - Replace any blue (#3B82F6) with green-500 (#1B7A44)
    - Replace gray backgrounds with cream (#FEFDFB, #FBF8F3)
    - Replace gray borders with cream borders (#F5EFE6, #EBE1D3)
    - Set border-radius minimum 10px for interactive elements
    - Add Reanimated press animations to all buttons (scale 0.98)
    - Add Haptics.impactAsync(Light) to all button onPress

11. Create src/theme/colors.ts:
    Export the full DocField color palette as a typed object
    (all colors from DESIGN_SYSTEM_DOCFIELD.md section 2)

12. Create src/theme/typography.ts:
    Export text style presets matching DESIGN_SYSTEM_DOCFIELD.md section 3

13. Create src/theme/spacing.ts:
    Export spacing tokens matching DESIGN_SYSTEM_DOCFIELD.md section 4

14. Install lucide-react-native for icons:
    npm install lucide-react-native react-native-svg

15. Tailwind config (tailwind.config.js):
    Use the EXACT configuration from DESIGN_SYSTEM_DOCFIELD.md section 12
    (includes all DocField colors, fonts, border-radius)

## CRITICAL Design Rules for Claude Code:
- ALWAYS read bencium MOTION-SPEC.md before implementing any animation
- ALWAYS run ui-ux-pro-max search with --stack react-native before building new screens
- NEVER create flat buttons without press animation
- NEVER use pure white (#FFFFFF) as page background — use cream-50 (#FEFDFB)
- NEVER use pure gray borders — use cream-200 (#F5EFE6)
- EVERY list must have staggered entrance animation
- EVERY loading state must use skeleton screens (not spinners)
- EVERY interactive element must have haptic feedback

## After creation:
- Run: npx expo start
- Verify app launches without errors
- Verify file-based routing works (navigate between tabs)
- Verify NativeWind styles apply
- Verify @docfield/shared imports work
```

---

## PROMPT 4: Supabase — Database Setup

```
# DocField — Supabase Database Setup

Set up the Supabase database with all tables, indexes, RLS policies, and seed data.

## Requirements:
- All SQL goes in supabase/migrations/ as sequential files
- Every table has RLS enabled
- Every tenant-scoped table has organization_id column
- Timestamps on every table (created_at, updated_at)
- UUIDs for all primary keys

## Migration 001: Core Tables

Create file: supabase/migrations/001_core_tables.sql

### Tables to create (in this order for FK dependencies):

1. organizations (id, name, logo_url, settings jsonb, created_at, updated_at)
2. users (id references auth.users, organization_id FK, email, full_name, role check, phone, is_active, created_at, updated_at)
3. clients (id, organization_id FK, name, phone, email, notes, created_at, updated_at)
4. projects (id, organization_id FK, name, address, city, status check, created_at, updated_at)
5. buildings (id, project_id FK cascade, organization_id FK, name, floors_count, created_at, updated_at)
6. apartments (id, building_id FK cascade, organization_id FK, number, floor, rooms_count numeric(3,1), apartment_type, status check, created_at, updated_at)
7. checklist_templates (id, organization_id FK nullable, name, report_type, is_global bool, is_active bool, created_at, updated_at)
8. checklist_categories (id, template_id FK cascade, name, sort_order int, created_at)
9. checklist_items (id, category_id FK cascade, description, default_severity check, requires_photo bool, sort_order int, created_at)
10. delivery_reports (id, apartment_id FK, organization_id FK, inspector_id FK users, checklist_template_id FK nullable, report_type, round_number int, status check, tenant_name, tenant_phone, tenant_email, notes, pdf_url, report_date timestamptz, completed_at, created_at, updated_at)
11. checklist_results (id, delivery_report_id FK cascade, checklist_item_id FK, organization_id FK, result check pass/fail/na, note, created_at, updated_at)
12. defects (id, delivery_report_id FK cascade, organization_id FK, checklist_result_id FK nullable, description, room, category, severity check, status check, source check, sort_order int, created_at, updated_at)
13. defect_photos (id, defect_id FK cascade, organization_id FK, image_url, thumbnail_url, annotations jsonb default '[]', sort_order int, created_at)
14. defect_library (id, organization_id FK nullable, description, category, default_severity, standard_reference, is_global bool, created_at)
15. signatures (id, delivery_report_id FK cascade, organization_id FK, signer_type check, signer_name, image_url, signed_at timestamptz, created_at)
16. sub_contractors (id, organization_id FK, name, trade, phone, email, created_at, updated_at)

### Constraints:
- role CHECK: 'admin', 'project_manager', 'inspector'
- project status CHECK: 'active', 'completed', 'archived'
- apartment status CHECK: 'pending', 'in_progress', 'delivered', 'completed'
- report status CHECK: 'draft', 'in_progress', 'completed', 'sent'
- severity CHECK: 'critical', 'medium', 'low'
- defect status CHECK: 'open', 'in_progress', 'fixed', 'not_fixed'
- defect source CHECK: 'checklist', 'manual', 'library'
- checklist result CHECK: 'pass', 'fail', 'na'
- signer type CHECK: 'inspector', 'tenant'

## Migration 002: Indexes

Create file: supabase/migrations/002_indexes.sql

All indexes from the Architecture document:
- idx_projects_org ON projects(organization_id)
- idx_buildings_project ON buildings(project_id)
- idx_apartments_building ON apartments(building_id)
- idx_apartments_status ON apartments(organization_id, status)
- idx_delivery_reports_apartment ON delivery_reports(apartment_id)
- idx_delivery_reports_org_status ON delivery_reports(organization_id, status)
- idx_delivery_reports_inspector ON delivery_reports(inspector_id)
- idx_defects_report ON defects(delivery_report_id)
- idx_defects_status ON defects(organization_id, status)
- idx_checklist_results_report ON checklist_results(delivery_report_id)
- idx_defect_photos_defect ON defect_photos(defect_id)
- idx_defect_library_org ON defect_library(organization_id)
- idx_defect_library_search ON defect_library USING gin(description gin_trgm_ops) — for fuzzy search (requires pg_trgm extension)

Also: CREATE EXTENSION IF NOT EXISTS pg_trgm;

## Migration 003: RLS Policies

Create file: supabase/migrations/003_rls_policies.sql

Enable RLS on EVERY table. Then create policies:

For tenant-scoped tables (projects, buildings, apartments, delivery_reports, defects, defect_photos, checklist_results, signatures, clients, sub_contractors):
- SELECT: organization_id matches user's organization
- INSERT: organization_id matches user's organization  
- UPDATE: organization_id matches user's organization
- DELETE: organization_id matches user's organization AND user role = 'admin'

For global+tenant tables (checklist_templates, defect_library):
- SELECT: is_global = true OR organization_id matches user's organization
- INSERT: organization_id matches user's organization (can't create global)
- UPDATE: organization_id matches user's organization
- DELETE: organization_id matches user's organization AND user role = 'admin'

For signatures (IMMUTABLE):
- SELECT: organization_id matches user's organization
- INSERT: organization_id matches user's organization
- NO UPDATE POLICY (immutable)
- NO DELETE POLICY (immutable)

For users table:
- SELECT: organization_id matches user's organization
- UPDATE: id = auth.uid() OR (same org AND role = 'admin')
- INSERT: only via Edge Function (admin creates users)

Helper function for all policies:
CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

Use this function in all policies instead of subquery for performance.

## Migration 004: Updated_at Trigger

Create a trigger function that auto-updates updated_at on every UPDATE.
Apply to all tables that have updated_at column.

## Seed Data: supabase/seed.sql

Create seed data for development:
1. One organization: "חברת בנייה לדוגמה" with sample logo_url
2. One admin user (will need to match auth.users — note in comment)
3. One project: "פרויקט הדוגמה — רמת גן" with address
4. Two buildings: "בניין A", "בניין B"
5. 4 apartments per building (8 total) — different floors and types
6. One checklist template: "מסירת דירה — תבנית סטנדרטית" (type: delivery, is_global: true)
7. Checklist categories: מטבח, סלון, חדר שינה ראשי, חדר רחצה ראשי, מרפסת, חשמל, טיח וצבע, כללי
8. 5-8 checklist items per category (realistic items like: "אריחים ללא סדקים", "ברזים תקינים", "שקעי חשמל פועלים")
9. 20 defect library items (global) with realistic descriptions and standard_reference where applicable

## After creation:
- Apply migrations locally: supabase db reset
- Verify all tables created
- Verify RLS is enabled on every table
- Verify seed data loaded
- Test RLS: query as anon should return 0 rows
```

---

## PROMPT 5: Web Dashboard — Vite Setup

```
# DocField — Web Dashboard Initialization

Create the web dashboard in apps/web using Vite + React + Tailwind.

## Requirements:
- Vite 5+
- React 18+
- TypeScript
- Tailwind CSS v3
- React Router DOM v6
- RTL support from day 1

## Setup:
1. cd apps/web
2. npm create vite@latest . -- --template react-ts

3. Install dependencies:
   npm install @supabase/supabase-js react-router-dom zod
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

4. Configure Tailwind for RTL:
   - Add content paths to tailwind.config.js
   - Add RTL-safe utilities

5. Create folder structure:
   src/
   ├── components/
   │   ├── ui/           # Button, Input, Card, Modal, Table
   │   └── layout/       # Header, Sidebar, PageWrapper
   ├── pages/
   │   ├── Login.tsx
   │   ├── Dashboard.tsx
   │   ├── Projects.tsx
   │   └── NotFound.tsx
   ├── hooks/
   │   └── useAuth.ts
   ├── services/
   │   └── supabase.ts
   ├── lib/
   │   └── supabase.ts   # Supabase client init
   ├── styles/
   │   └── globals.css    # Tailwind + RTL base styles
   └── App.tsx            # Router setup

6. index.html:
   - <html dir="rtl" lang="he">
   - Import Rubik font from Google Fonts (great Hebrew support)

7. globals.css:
   - @tailwind base/components/utilities
   - font-family: 'Rubik', sans-serif
   - Logical properties (margin-inline-start etc.)

8. Router setup:
   - /login → Login page
   - / → Dashboard (protected)
   - /projects → Projects list (protected)
   - /projects/:id → Project detail (protected)
   - * → 404

9. Create placeholder pages with Hebrew text:
   - Login: "התחברות ל-DocField" with email/password form
   - Dashboard: "דשבורד" with "ברוך הבא" message
   - Projects: "פרויקטים" with empty state

10. Supabase client (same pattern as mobile):
    - URL from import.meta.env.VITE_SUPABASE_URL
    - Key from import.meta.env.VITE_SUPABASE_ANON_KEY

11. Add dependency on @docfield/shared in package.json

## After creation:
- Run: npm run dev
- Verify RTL layout works
- Verify Hebrew text displays correctly
- Verify Rubik font loads
- Verify router works
- Verify @docfield/shared imports work
```

---

## PROMPT 6: Verify Everything Works Together

```
# DocField — Integration Verification

Verify that the entire monorepo works together.

## Checks to perform:

1. From root directory:
   - npm install (all workspaces)
   - npx turbo build (all packages build successfully)
   - npx turbo lint (if configured)

2. Shared package:
   - Import types in mobile app: import { Defect, Severity } from '@docfield/shared'
   - Import types in web app: import { ROOMS, DEFECT_CATEGORIES } from '@docfield/shared'
   - Import validation: import { createDefectSchema } from '@docfield/shared'
   - Verify Zod schemas work: createDefectSchema.parse({ description: 'test', severity: 'medium' })

3. Mobile app:
   - npx expo start (launches without errors)
   - Navigate between tabs
   - NativeWind styles render
   - Background is cream-50 (#FEFDFB), NOT pure white
   - Rubik font loads for Hebrew text
   - DocField color tokens accessible from theme/colors.ts
   - react-native-reusables Button has press animation (scale 0.98)
   - lucide-react-native icons render correctly

4. Web app:
   - npm run dev (launches without errors)
   - RTL layout correct
   - Router navigation works
   - Background is cream-50, not white
   - Rubik font loads from Google Fonts

5. Design Skills:
   - bencium-controlled-ux-designer SKILL.md is readable
   - ui-ux-pro-max search.py returns results for: "construction inspection"
   - .claude/DESIGN_CONTEXT.md exists with DocField palette

5. Supabase:
   - supabase start (local)
   - supabase db reset (migrations + seed)
   - Query tables: SELECT count(*) FROM checklist_templates
   - Verify RLS: connect as anon, query should return 0

## If any check fails:
- Fix the issue
- Document what was fixed and why
- Re-run all checks

## Output:
Provide a status report:
✅ / ❌ for each check
Any issues found and how they were resolved
```

---

## מה הלאה (Phase 5+)

אחרי שPhase 4 מאושר ועובד, הפרומפטים הבאים יהיו:
- **PROMPT 7**: WatermelonDB schema + models + sync
- **PROMPT 8**: Auth flow (login/register/protected routes) — **כולל onboarding screen עם bencium-innovative**
- **PROMPT 9**: Checklist Engine (the core feature) — **UI-heavy, חייב bencium motion spec**
- **PROMPT 10**: Camera + Photo Annotation (Skia) — **fullscreen experience, haptics, animations**
- **PROMPT 11**: Signature Pad (Skia) — **bottom sheet עם spring animation**
- **PROMPT 12**: PDF Generation (expo-print + HTML template) — **branded, green+cream palette**
- **PROMPT 13**: Defect Library + Fuzzy Search — **search UI עם skeleton loading**
- **PROMPT 14**: Speech-to-Text integration — **floating mic button, recording animation**
- **PROMPT 15**: Dashboard (Web) — **parallax header, data viz, staggered cards**
- **PROMPT 16**: Full QA + Security Audit + Design Audit (bencium design-audit skill)

> **כלל ברזל לכל prompt מ-Phase 5+:**
> כל פרומפט שכולל UI חייב לפתוח ב:
> "Read DESIGN_SYSTEM_DOCFIELD.md and .claude/DESIGN_CONTEXT.md before writing any code.
> Follow bencium MOTION-SPEC.md for all animations.
> Run ui-ux-pro-max search with --stack react-native for implementation guidance."

---

## אישורים

| פריט | סטטוס | תאריך |
|------|--------|------|
| Phase 4 Prompts | ⬜ ממתין לאישור חיים | — |

---

*DocField Phase 4 — Claude Code Execution Prompts | מרץ 2026*

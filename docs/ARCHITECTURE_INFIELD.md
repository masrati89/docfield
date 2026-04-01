# 🏗️ ARCHITECTURE DOCUMENT — inField

> **Phase 2 — Architecture Design**
> מסמך זה מגדיר את הארכיטקטורה המלאה של inField.
> ממתין לאישור חיים לפני שמתחילים לכתוב קוד.

---

## 1. סטאק טכנולוגי — אישור סופי

### הבחירה

| שכבה                        | טכנולוגיה                       | גרסה               | הצדקה                                                                                        |
| --------------------------- | ------------------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| **Mobile App**              | React Native + Expo             | SDK 52+            | Cross-platform iOS+Android, Offline-first, שיתוף קוד עם Web                                  |
| **Local DB (Offline)**      | WatermelonDB                    | 0.27+              | **נדחה לאחרי MVP.** SQLite-based, Offline-first, סנכרון מובנה. יוטמע כש-React Query לא מספיק |
| **Drawing/Annotation**      | @shopify/react-native-skia      | 1.x                | ציור עם עט (Apple Pencil / S Pen), סימון על תמונות, חתימה, 60fps GPU                         |
| **Speech-to-Text**          | @jamsch/expo-speech-recognition | —                  | הקלטה → טקסט בזמן אמת, עברית, on-device (iOS), Offline partial                               |
| **Styling (App)**           | NativeWind (Tailwind)           | 4.x                | Tailwind CSS ב-React Native, שיתוף סגנון עם Web                                              |
| **Web Dashboard**           | React + Vite + Tailwind         | React 18+, Vite 5+ | SPA מהיר, behind login                                                                       |
| **Backend**                 | Supabase                        | —                  | PostgreSQL + Auth + Storage + Edge Functions + Realtime                                      |
| **Auth**                    | Supabase Auth                   | —                  | Email/password, Google OAuth אופציונלי                                                       |
| **Storage**                 | Supabase Storage                | —                  | תמונות ליקויים, לוגואים, חתימות                                                              |
| **PDF (On-device)**         | expo-print                      | —                  | HTML→PDF ישירות על המכשיר, עובד Offline                                                      |
| **PDF (Server, v1.1)**      | Puppeteer (Edge Function)       | —                  | דוחות מורכבים מ-Block Editor                                                                 |
| **WhatsApp**                | Green API                       | —                  | שליחת PDF, Follow-up (v1.1)                                                                  |
| **AI Transcription (v1.1)** | Claude API                      | —                  | תמלול מתקדם + ניסוח מקצועי של הערות קוליות                                                   |
| **Hosting (Web)**           | Vercel                          | —                  | Auto-deploy, CDN, SSL                                                                        |
| **Hosting (App)**           | EAS Build + App Stores          | —                  | OTA updates via Expo                                                                         |
| **Monitoring**              | Sentry                          | —                  | Error tracking, performance                                                                  |
| **Icons**                   | @expo/vector-icons (Feather)    | —                  | lucide-react-native נפסל בגלל בעיות Metro bundler                                            |
| **Monorepo**                | Turborepo + npm workspaces      | —                  | apps/mobile, apps/web, packages/shared                                                       |
| **Data Layer (MVP)**        | React Query + Supabase direct   | —                  | שכבת נתונים ל-MVP. WatermelonDB נדחה לשלב מאוחר                                              |
| **Language**                | TypeScript                      | 5.x                | בכל מקום — App, Web, Edge Functions                                                          |

### ספריות תשתית — Build vs Buy Analysis

> **כלל: תשתית = ספרייה. לוגיקה עסקית = נבנה בעצמנו.**

#### ✅ ספריות חובה (Use Library — לבנות לבד = טירוף)

| ספרייה                            | מטרה                            | למה לא לבנות לבד                              | זמן חיסכון |
| --------------------------------- | ------------------------------- | --------------------------------------------- | ---------- |
| `WatermelonDB`                    | Offline DB + sync               | Sync עם conflict resolution = חודשים של עבודה | 2-3 חודשים |
| `@shopify/react-native-skia`      | ציור, סימון, חתימה              | מנוע GPU — אי אפשר לכתוב ב-JS                 | 3+ חודשים  |
| `react-native-reanimated`         | אנימציות 60fps                  | רץ על UI thread, דורש native code             | חודש+      |
| `react-native-gesture-handler`    | Swipe, pinch, long press        | Native touch handling                         | 2-3 שבועות |
| `expo-haptics`                    | רטט מגע (Taptic Engine)         | Native API שונה ל-iOS/Android                 | שבוע       |
| `expo-image`                      | תמונות + cache                  | Caching חכם עם preload                        | שבוע       |
| `expo-image-manipulator`          | דחיסה, resize, crop             | Native image processing                       | שבוע       |
| `expo-print`                      | HTML → PDF על המכשיר            | Native print engine, עובד Offline             | 2 שבועות   |
| `@shopify/flash-list`             | רשימות מהירות (50+ items)       | Virtualization algorithm                      | שבוע       |
| `@gorhom/bottom-sheet`            | Bottom Sheet (iOS pattern)      | Gesture + animation combo                     | שבוע       |
| `expo-blur`                       | אפקט Blur                       | Native blur filter                            | ימים       |
| `react-native-mmkv`               | אחסון מהיר (x30 מ-AsyncStorage) | C++ bridge, סנכרוני                           | ימים       |
| `@react-native-community/netinfo` | מצב רשת (Online/Offline)        | Native network listeners                      | ימים       |
| `@jamsch/expo-speech-recognition` | דיבור → טקסט                    | Native speech engines iOS/Android             | 2 שבועות   |
| `fuse.js`                         | Fuzzy search בעברית             | Search algorithm                              | ימים       |
| `react-native-safe-area-context`  | Safe Area (נוטש)                | iOS/Android safe areas                        | מובנה      |
| `expo-status-bar`                 | Status bar control              | Native status bar                             | מובנה      |

#### 🔨 נבנה בעצמנו (Build — זה הערך המוסף שלנו)

| רכיב                      | למה לבנות                                                                               | מה נשתמש מתחת                   |
| ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------- |
| **Checklist Engine UI**   | הלב של המוצר. V/X/- flow, מעבר חדרים, יצירת ליקוי אוטומטית — אין שום ספרייה שעושה את זה | FlatList + Reanimated + Haptics |
| **Defect Card**           | UX ייחודי לנו: תמונה, חומרה, סטטוס, סימונים                                             | NativeWind + expo-image         |
| **Defect Library Search** | חיפוש fuzzy בעברית עם אחרונים למעלה                                                     | fuse.js לאלגוריתם, UI שלנו      |
| **PDF HTML Template**     | תבנית דוח ממותג RTL, אין תבנית מוכנה לדוח מסירה ישראלי                                  | expo-print + HTML/CSS template  |
| **Signature Pad**         | כבר יש Skia — לבנות חתימה על Skia = 2 שעות, ביצועים מעולים                              | @shopify/react-native-skia      |
| **Photo Annotation**      | סימון חצים ועיגולים על תמונת ליקוי                                                      | @shopify/react-native-skia      |
| **Sync Logic**            | לוגיקת סנכרון ספציפית: מתי, מה, סדר עדיפויות                                            | WatermelonDB synchronize()      |
| **Dashboard Screens**     | מסכי ניהול ספציפיים לנו                                                                 | React + Tailwind                |

#### ⏸️ נדחה ל-v1.1

| ספרייה                    | מטרה               | למה לדחות                                             |
| ------------------------- | ------------------ | ----------------------------------------------------- |
| `gluestack-ui`            | UI Kit מלא         | NativeWind + custom components מספיק ל-MVP, פחות תלות |
| `@expo/ui` (SwiftUI)      | קומפוננטים SwiftUI | חדש מדי, Android חלקי                                 |
| `Lottie`                  | אנימציות יפות      | Nice-to-have, מוסיף גודל                              |
| `react-native-compressor` | דחיסה מתקדמת       | expo-image-manipulator מספיק                          |
| `Ignite` boilerplate      | תבנית פרויקט       | דעתני מדי, לא מתאים ל-monorepo שלנו                   |

### מה נדחה ולמה (אלטרנטיבות טכנולוגיות)

| אלטרנטיבה             | למה לא                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| Flutter (Dart)        | אין שיתוף קוד טבעי עם Web, Supabase SDK לא רשמי, Claude Code פחות חזק ב-Dart |
| Native (Swift+Kotlin) | כפולת עבודה, 3 שפות, לא ריאלי למפתח אחד עם Claude Code                       |
| Next.js (Web)         | אין צורך ב-SSR/SEO — הדשבורד הוא behind login                                |
| Firebase              | Supabase עדיף: PostgreSQL עם RLS, Edge Functions, self-host option           |

---

## 2. Design System Integration

### הקשר בין Architecture ל-Design

```
┌─────────────────────────────────────────────────────┐
│  docs/DESIGN_SYSTEM.md                              │
│  └── מקור האמת: צבעים, typography, spacing, shadows │
│       ↓                                              │
│  Skills (~/.claude/skills/)                          │
│  └── HOW to build components (UX, accessibility,    │
│       animations, best practices)                    │
│       ↓                                              │
│  packages/shared/                                    │
│  └── theme/ (Design System as Code — tokens, types) │
│       ↓                                              │
│  apps/mobile + apps/web                              │
│  └── UI components using theme + skills guidelines   │
└─────────────────────────────────────────────────────┘
```

### Skills עיצוב — כלי עבודה לבניית UI

inField משתמש ב-Skills מותקנים ב-`~/.claude/skills/` שמדריכים את Claude Code:

| Skill                            | תפקיד                                | פלטפורמה          |
| -------------------------------- | ------------------------------------ | ----------------- |
| `bencium-controlled-ux-designer` | עקרונות UX, היררכיה, accessibility   | כל UI             |
| `ui-ux-pro-max`                  | ארכיטקטורת מסכים, navigation, state  | כל UI             |
| `bencium-innovative-ux-designer` | פתרונות יצירתיים, micro-interactions | features ייחודיים |
| `frontend-design`                | קוד UI נקי, conventions              | כל UI             |
| `design-audit`                   | ביקורת עקביות עם Design System       | לפני commit       |
| `web-design-guidelines`          | web accessibility, responsive        | apps/web          |
| `vercel-react-native-skills`     | React Native best practices          | apps/mobile       |

### פרוטוקול בניית Component

```
1. קרא את ה-Design System (docs/DESIGN_SYSTEM.md)
2. קרא Skills רלוונטיים לפי סוג העבודה:
   - Component → frontend-design + bencium-controlled-ux-designer
   - מסך מלא → ui-ux-pro-max + vercel-react-native-skills (mobile)
   - Feature ייחודי → bencium-innovative-ux-designer
3. בנה את ה-Component לפי העקרונות משני המקורות
4. הרץ design-audit (/design-check) לפני commit
5. וודא TypeScript תקין: npx tsc --noEmit
```

### Component Development Workflow

כל component UI עובר את התהליך הזה:

**שלב 1 — קרא את המקורות:**

```bash
# Design System
docs/DESIGN_SYSTEM.md

# Skills רלוונטיים
~/.claude/skills/bencium-controlled-ux-designer/SKILL.md
~/.claude/skills/frontend-design/SKILL.md
```

**שלב 2 — בנה את ה-component:**

```typescript
// apps/mobile/src/components/DefectCard.tsx
import { theme } from '@infield/ui';

export function DefectCard({ defect }: Props) {
  // משתמש ב-theme.colors, theme.spacing, theme.typography
  // עוקב אחרי עקרונות מ-Skills
}
```

**שלב 3 — בדוק integration:**

```bash
# TypeScript
npx tsc --noEmit

# Build
npm run build

# Design audit
/design-check
```

### תלויות בין Packages

```
apps/mobile   ─┬─→  @infield/ui (theme)
               └─→  @infield/shared (types, utils)

apps/web      ─┬─→  @infield/ui (theme)
               └─→  @infield/shared (types, utils)

packages/ui     ─→  standalone (no deps)
packages/shared ─→  standalone (zod only)
```

**כלל:** apps תלויים ב-packages, packages לא תלויים באף אחד.

### כלל: Design System מנצח

אם יש סתירה בין Skill להנחיות ב-Design System — **ה-Design System מנצח תמיד**.
ה-Skills מלמדים _איך_ לבנות. ה-Design System מגדיר _מה_ לבנות.

---

## 3. ארכיטקטורת מערכת — High Level

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                 │
│                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐    │
│  │  Mobile App  │   │ Web Dashboard│   │ Tenant Link      │    │
│  │  (RN + Expo) │   │ (React+Vite) │   │ (Public page)    │    │
│  │  + WatermelonDB  │              │   │ (דייר/קבלן משנה) │    │
│  └──────┬───────┘   └──────┬───────┘   └────────┬─────────┘    │
│         │                  │                     │              │
└─────────┼──────────────────┼─────────────────────┼──────────────┘
          │                  │                     │
          ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE CLOUD                             │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐    │
│  │   Auth      │  │  PostgreSQL  │  │   Edge Functions    │    │
│  │  (JWT+RLS)  │  │  + RLS       │  │  - PDF Generation   │    │
│  │             │  │  + Triggers  │  │  - WhatsApp Send    │    │
│  └─────────────┘  │  + Indexes   │  │  - Sync Endpoint    │    │
│                   └──────────────┘  │  - Webhook Handler  │    │
│  ┌─────────────┐  ┌──────────────┐  └─────────────────────┘    │
│  │  Storage    │  │  Realtime    │                              │
│  │  (Photos,   │  │  (Live sync) │                              │
│  │   Logos,    │  │              │                              │
│  │   Sigs)     │  │              │                              │
│  └─────────────┘  └──────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
          │                                    │
          ▼                                    ▼
┌──────────────────┐              ┌──────────────────────┐
│   Green API      │              │   Stripe (v1.1)      │
│   (WhatsApp)     │              │   (Payments)         │
└──────────────────┘              └──────────────────────┘
```

---

## 3. מבנה תיקיות

### Monorepo Structure

```
infield/
├── apps/
│   ├── mobile/                  # React Native + Expo app
│   │   ├── src/
│   │   │   ├── components/      # UI components (mobile-specific)
│   │   │   │   ├── ui/          # Button, Input, Card, Modal
│   │   │   │   ├── forms/       # Checklist, DefectForm, SignaturePad
│   │   │   │   ├── camera/      # CameraCapture, PhotoAnnotation
│   │   │   │   ├── SkiaAnnotationCanvas.tsx  # Skia-based drawing on photos
│   │   │   │   └── StylusDrawingPad.tsx      # Free-form stylus/pen notes
│   │   │   ├── voice/       # VoiceRecorder, SpeechToText
│   │   │   │   ├── VoiceNoteButton.tsx       # Record → transcribe button
│   │   │   │   └── TranscriptionField.tsx    # Shows live transcription
│   │   │   │   └── layout/      # Header, TabBar, Screen
│   │   │   ├── screens/         # Screen components (route-based)
│   │   │   │   ├── auth/        # Login, Register
│   │   │   │   ├── projects/    # ProjectList, ProjectDetail
│   │   │   │   ├── inspection/  # InspectionFlow, ChecklistScreen
│   │   │   │   └── settings/    # Profile, Templates
│   │   │   ├── navigation/      # React Navigation setup
│   │   │   ├── db/              # WatermelonDB models & schema
│   │   │   │   ├── models/      # Model classes
│   │   │   │   ├── schema.ts    # DB schema definition
│   │   │   │   └── sync.ts      # Sync logic with Supabase
│   │   │   ├── hooks/           # Custom hooks
│   │   │   ├── services/        # API calls, external services
│   │   │   └── utils/           # Utilities
│   │   ├── app.json             # Expo config
│   │   └── package.json
│   │
│   └── web/                     # React + Vite dashboard
│       ├── src/
│       │   ├── components/      # UI components (web-specific)
│       │   ├── pages/           # Route pages
│       │   ├── hooks/           # Custom hooks
│       │   ├── services/        # API calls
│       │   └── utils/           # Utilities
│       ├── vite.config.ts
│       └── package.json
│
├── packages/
│   ├── shared/                  # Shared code between App + Web
│   │   ├── types/               # TypeScript types & interfaces
│   │   ├── constants/           # Enums, categories, rooms
│   │   ├── validation/          # Zod schemas (shared validation)
│   │   ├── i18n/                # Translation files (he.json, en.json)
│   │   └── utils/               # Shared utility functions
│   └── ui/                      # Design System as Code
│       ├── theme/               # Color tokens, typography, spacing, shadows
│       └── index.ts             # Exports: theme, types
│
├── supabase/
│   ├── functions/               # Edge Functions
│   │   ├── generate-pdf/        # PDF generation (Puppeteer)
│   │   ├── send-whatsapp/       # WhatsApp via Green API
│   │   └── sync/                # WatermelonDB sync endpoint
│   ├── migrations/              # Sequential DB migrations
│   ├── seed.sql                 # Dev seed data
│   └── config.toml              # Supabase local config
│
├── docs/                        # Documentation
│   ├── architecture.md          # This document
│   ├── api.md                   # API documentation
│   └── diagrams/                # Mermaid diagrams
│
├── .env.example                 # Environment variables template
├── turbo.json                   # Turborepo config (monorepo)
└── package.json                 # Root package.json
```

---

## 4. Offline-First Architecture

### Phasing

> **MVP (Phase 5):** React Query + Supabase direct. תומך ב-cache לקריאה, תור לתמונות, retry על שליחה.
> **Post-MVP (Phase 6):** WatermelonDB לקריאה+כתיבה מלאה offline. קריטי למפקחים באתרי בנייה עם קישוריות חלשה.

### העיקרון

> **הנתונים נשמרים תמיד מקומית קודם. סנכרון לענן קורה ברקע כשיש רשת.**

### MVP Data Flow (React Query)

```
┌─────────────────────────────────────────────────┐
│  Inspector in the field                         │
│                                                 │
│  User Action → React Query cache → UI           │
│       ↓                                         │
│  Network available? ──── No → Queue mutation    │
│       │                        + Toast "מסנכרן   │
│      Yes                        כשתהיה רשת"     │
│       ↓                                         │
│  Supabase direct (push + pull)                  │
│       ↓                                         │
│  UI updated from fresh data                     │
└─────────────────────────────────────────────────┘
```

### Post-MVP Data Flow (WatermelonDB)

```
┌─────────────────────────────────────────────────┐
│  Inspector in the field (no network)            │
│                                                 │
│  User Action → WatermelonDB (SQLite) → UI       │
│       ↓                                         │
│  [Data saved locally, instantly]                │
│       ↓                                         │
│  Network available? ──── No → Queue for later   │
│       │                                         │
│      Yes                                        │
│       ↓                                         │
│  Sync Engine → Supabase (push changes)          │
│       ↓                                         │
│  Pull remote changes ← Supabase                 │
│       ↓                                         │
│  Merge & resolve conflicts                      │
│       ↓                                         │
│  UI updated with merged data                    │
└─────────────────────────────────────────────────┘
```

### WatermelonDB Sync Strategy

```typescript
// Sync endpoint: supabase/functions/sync
// WatermelonDB provides synchronize() with:
// - pull: get changes from server since last_synced_at
// - push: send local changes to server

// Conflict resolution: LAST WRITE WINS
// In our case this is safe because:
// 1. Each inspector works on their own inspections
// 2. No two people edit the same defect simultaneously
// 3. Manager edits (from Web) only happen after field work

// Sync triggers:
// - App comes to foreground
// - Network connectivity restored
// - Manual pull-to-refresh
// - After completing an inspection
// - Background sync every 5 minutes (if network available)
```

### Photo Sync Strategy

```
Photos are the heaviest data:
1. Photo taken → saved to device storage immediately
2. Thumbnail generated locally for UI display
3. When network available → upload original to Supabase Storage
4. On upload success → save storage URL to WatermelonDB
5. Sync URL to Supabase PostgreSQL
6. Original on device auto-cleaned after confirmed upload (configurable)

Compression: JPEG quality 80%, max 2048px longest edge
Average photo: ~300-500KB after compression
Inspection with 30 photos: ~10-15MB upload
```

---

## 5. Database Schema (Supabase PostgreSQL)

### Multi-Tenant Architecture

```sql
-- Every tenant-scoped table has:
organization_id UUID NOT NULL REFERENCES organizations(id)

-- RLS on EVERY table, no exceptions
-- All queries automatically scoped by organization_id
```

### Core Tables — MVP

```sql
-- ==========================================
-- ORGANIZATIONS & USERS
-- ==========================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'project_manager', 'inspector')),
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PROJECT HIERARCHY
-- ==========================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    report_type_default TEXT NOT NULL DEFAULT 'delivery' CHECK (report_type_default IN ('delivery', 'bedek_bait')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,  -- "בניין A" or "1"
    floors_count INT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE apartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    number TEXT NOT NULL,        -- "4A", "12", etc.
    floor INT,
    rooms_count NUMERIC(3,1),   -- 3.5, 4, etc.
    apartment_type TEXT,         -- "דירת גן", "פנטהאוז", "רגילה"
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delivered')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CHECKLIST ENGINE
-- ==========================================

CREATE TABLE checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id), -- NULL = global template
    name TEXT NOT NULL,
    report_type TEXT NOT NULL,   -- 'delivery', 'bedek_bait', 'supervision', etc.
    is_global BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checklist_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES checklist_templates(id) ON DELETE CASCADE,
    name TEXT NOT NULL,          -- "מטבח", "מקלחון ראשי", "חשמל"
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES checklist_categories(id) ON DELETE CASCADE,
    description TEXT NOT NULL,   -- "אריחים ללא סדקים ופגמים"
    default_severity TEXT DEFAULT 'medium' CHECK (default_severity IN ('critical', 'medium', 'low')),
    requires_photo BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INSPECTIONS & DELIVERY REPORTS
-- ==========================================

CREATE TABLE delivery_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES apartments(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    inspector_id UUID NOT NULL REFERENCES users(id),
    checklist_template_id UUID REFERENCES checklist_templates(id),
    report_type TEXT NOT NULL DEFAULT 'delivery' CHECK (report_type IN ('delivery', 'bedek_bait')),
    round_number INT NOT NULL DEFAULT 1,
    previous_round_id UUID REFERENCES delivery_reports(id) ON DELETE SET NULL,  -- links round 2 → round 1
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'sent')),
    tenant_name TEXT,
    tenant_phone TEXT,
    tenant_email TEXT,
    notes TEXT,
    pdf_url TEXT,
    report_date TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE checklist_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_report_id UUID NOT NULL REFERENCES delivery_reports(id) ON DELETE CASCADE,
    checklist_item_id UUID NOT NULL REFERENCES checklist_items(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    result TEXT NOT NULL CHECK (result IN ('pass', 'fail', 'partial', 'skip', 'na')),
    -- pass=תקין, fail=לא תקין, partial=תקין חלקית, skip=דלג, na=לא רלוונטי
    note TEXT,                   -- defect description (for fail/partial)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- DEFECTS
-- ==========================================

CREATE TABLE defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_report_id UUID NOT NULL REFERENCES delivery_reports(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    checklist_result_id UUID REFERENCES checklist_results(id), -- NULL if manually added

    -- ══ SNAPSHOT — independent copy, NOT a reference (Iron Rule) ══
    category TEXT NOT NULL,          -- "טיח", "אינסטלציה", "חשמל" (trade category)
    title TEXT NOT NULL,             -- defect description (was: description)
    location TEXT,                   -- "מטבח", "סלון", "חדר שינה 1"
    standard TEXT,                   -- full text, e.g. "ת\"י 1555 סעיף 3.2"
    standard_description TEXT,       -- standard clause description
    recommendation TEXT,             -- repair recommendation
    cost NUMERIC(10,2),              -- repair cost
    cost_unit TEXT DEFAULT 'fixed' CHECK (cost_unit IN ('fixed', 'sqm', 'lm', 'unit', 'day')),
    notes TEXT,

    -- ══ Loose link to library — convenience only ══
    library_item_id UUID REFERENCES defect_library(id) ON SET NULL, -- if deleted → NULL, nothing breaks

    -- ══ Round 2 review (delivery only) ══
    source_defect_id UUID REFERENCES defects(id) ON DELETE SET NULL, -- for inherited defects from round 1
    defect_source TEXT DEFAULT 'manual' CHECK (defect_source IN ('checklist', 'manual', 'library', 'inherited')),
    review_status TEXT CHECK (review_status IN ('pending_review', 'fixed', 'not_fixed', 'partially_fixed')),
    review_note TEXT,

    -- ══ Meta ══
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'medium', 'low')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'fixed', 'not_fixed')),
    source TEXT DEFAULT 'checklist' CHECK (source IN ('checklist', 'manual', 'library')),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE defect_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    defect_id UUID NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    annotations JSONB DEFAULT '[]', -- [{type: "arrow", x: 100, y: 200, ...}]
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- DEFECT LIBRARY
-- ==========================================

CREATE TABLE defect_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id), -- NULL = system library (global)
    user_id UUID REFERENCES users(id),                 -- NULL = system, user_id = personal library
    source TEXT NOT NULL DEFAULT 'user' CHECK (source IN ('system', 'user')),

    -- ══ Content ══
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    location TEXT,
    standard TEXT,                -- "ת\"י 1555 סעיף 3.2"
    standard_description TEXT,
    recommendation TEXT,
    cost NUMERIC(10,2),
    cost_unit TEXT CHECK (cost_unit IN ('fixed', 'sqm', 'lm', 'unit', 'day')),
    notes TEXT,

    -- ══ Usage tracking ══
    usage_count INT DEFAULT 0,           -- how many times used in reports
    last_used_at TIMESTAMPTZ,            -- for sorting by recency

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SIGNATURES
-- ==========================================

CREATE TABLE signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_report_id UUID NOT NULL REFERENCES delivery_reports(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    signer_type TEXT NOT NULL CHECK (signer_type IN ('inspector', 'tenant')),
    signer_name TEXT NOT NULL,
    image_url TEXT NOT NULL,      -- Signature image stored in Supabase Storage
    signed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CLIENTS (דיירים/לקוחות)
-- ==========================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SUB-CONTRACTORS (v1.1)
-- ==========================================

CREATE TABLE sub_contractors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL,
    trade TEXT,                   -- "חשמלאי", "אינסטלטור", "טייח"
    phone TEXT,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PROJECT MEMBERS (Project-Level RLS)
-- ==========================================

CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'inspector' CHECK (role IN ('manager', 'inspector')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- ==========================================
-- REPORT ACTIVITY LOG (Iron Rule — audit trail)
-- ==========================================

CREATE TABLE report_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_report_id UUID NOT NULL REFERENCES delivery_reports(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN (
        'pdf_generated', 'status_changed', 'defect_updated',
        'defect_added', 'defect_deleted', 'photos_updated'
    )),
    details TEXT,                 -- e.g. "ממצא #2 — עלות"
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Indexes

```sql
-- Performance indexes for common queries
CREATE INDEX idx_projects_org ON projects(organization_id);
CREATE INDEX idx_buildings_project ON buildings(project_id);
CREATE INDEX idx_apartments_building ON apartments(building_id);
CREATE INDEX idx_apartments_status ON apartments(organization_id, status);
CREATE INDEX idx_delivery_reports_apartment ON delivery_reports(apartment_id);
CREATE INDEX idx_delivery_reports_org_status ON delivery_reports(organization_id, status);
CREATE INDEX idx_delivery_reports_inspector ON delivery_reports(inspector_id);
CREATE INDEX idx_defects_report ON defects(delivery_report_id);
CREATE INDEX idx_defects_status ON defects(organization_id, status);
CREATE INDEX idx_checklist_results_report ON checklist_results(delivery_report_id);
CREATE INDEX idx_defect_photos_defect ON defect_photos(defect_id);
CREATE INDEX idx_defect_library_org ON defect_library(organization_id);
CREATE INDEX idx_defect_library_search ON defect_library(title);       -- For fuzzy search
CREATE INDEX idx_defect_library_user ON defect_library(user_id);
CREATE INDEX idx_defect_library_category ON defect_library(category);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_report_log_report ON report_log(delivery_report_id);
CREATE INDEX idx_delivery_reports_previous ON delivery_reports(previous_round_id);
CREATE INDEX idx_delivery_reports_type ON delivery_reports(organization_id, report_type);
CREATE INDEX idx_defects_source ON defects(source_defect_id);
CREATE INDEX idx_defects_review ON defects(delivery_report_id, review_status);
```

### RLS Policies

```sql
-- TEMPLATE for every table:
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation" ON [table_name]
    FOR ALL USING (
        organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

-- Global items (checklist templates, defect library) also visible:
CREATE POLICY "global_read" ON checklist_templates
    FOR SELECT USING (
        is_global = true
        OR organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

-- Library: system items visible to all, user items only to owner:
CREATE POLICY "library_read" ON defect_library
    FOR SELECT USING (
        source = 'system'
        OR user_id = auth.uid()
        OR organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

-- Project-level isolation: inspector sees only assigned projects:
CREATE POLICY "project_member_select" ON projects
    FOR SELECT USING (
        id IN (
            SELECT project_id FROM project_members
            WHERE user_id = auth.uid()
        )
    );

-- Report immutability: only owner can edit, only draft/in_progress are modifiable:
CREATE POLICY "report_owner_update" ON delivery_reports
    FOR UPDATE USING (
        inspector_id = auth.uid()
    ) WITH CHECK (
        status IN ('draft', 'in_progress')
    );

-- Report log: append-only, no updates or deletes:
CREATE POLICY "report_log_insert" ON report_log
    FOR INSERT WITH CHECK (
        created_by = auth.uid()
    );
CREATE POLICY "report_log_select" ON report_log
    FOR SELECT USING (
        delivery_report_id IN (
            SELECT id FROM delivery_reports
            WHERE inspector_id = auth.uid()
        )
    );
```

---

## 6. API Design — Edge Functions

### Sync Endpoint (Critical Path)

```
POST /functions/v1/sync
- WatermelonDB sync protocol
- Handles pull (server → device) and push (device → server)
- Conflict resolution: last_write_wins with updated_at timestamp
- Batch operations for efficiency
```

### PDF Generation

```
POST /functions/v1/generate-pdf
- Input: delivery_report_id
- Process: Fetch data → Build HTML → Puppeteer → PDF
- Output: PDF URL in Supabase Storage
- Includes: logo, defects, pass items, photos, signatures, RTL
```

### WhatsApp Send

```
POST /functions/v1/send-whatsapp
- Input: phone, pdf_url, message_template
- Process: Call Green API
- Log: whatsapp_log table
```

---

## 7. Security Architecture

### Authentication Flow

```
Mobile App:
1. User enters email + password
2. Supabase Auth returns JWT + refresh token
3. JWT stored securely (Expo SecureStore)
4. JWT included in all API calls
5. WatermelonDB sync uses JWT for authorization
6. Token auto-refresh before expiry

Web Dashboard:
1. Same Supabase Auth
2. JWT stored in httpOnly cookie
3. Auto-refresh on expiry
```

### Role-Based Access

| Role                | App Access | Web Access | Permissions                                         |
| ------------------- | ---------- | ---------- | --------------------------------------------------- |
| **admin**           | Full       | Full       | All CRUD, manage users, settings, templates         |
| **project_manager** | Full       | Full       | View all projects, manage inspections, assign       |
| **inspector**       | Full       | Limited    | Create/edit own inspections, view assigned projects |

### Data Protection

| Concern                | Solution                                                  |
| ---------------------- | --------------------------------------------------------- |
| Multi-tenant isolation | RLS on every table, organization_id enforced              |
| Offline data security  | Expo SecureStore for tokens, SQLite on device storage     |
| Photo privacy          | Supabase Storage buckets per organization, signed URLs    |
| Signature integrity    | Immutable after creation (no UPDATE policy on signatures) |
| API security           | JWT validation, rate limiting on Edge Functions           |
| Input validation       | Zod schemas on client AND server (shared package)         |

---

## 8. Shared Code Strategy

### packages/shared — מה משותף

```typescript
// types/inspection.types.ts — shared between App and Web
export interface Defect {
    id: string;
    description: string;
    room: RoomType;
    category: DefectCategory;
    severity: Severity;
    status: DefectStatus;
    source: 'checklist' | 'manual' | 'library';
}

// constants/rooms.ts — shared enums
export const ROOMS = ['מטבח', 'סלון', 'חדר שינה 1', ...] as const;
export const CATEGORIES = ['טיח', 'חשמל', 'אינסטלציה', ...] as const;
export const SEVERITIES = ['critical', 'medium', 'low'] as const;

// validation/defect.schema.ts — shared Zod validation
export const createDefectSchema = z.object({
    description: z.string().min(2).max(500),
    room: z.enum(ROOMS),
    severity: z.enum(SEVERITIES),
    // ...
});

// i18n/he.json — shared translations
```

---

## 9. iOS Native Feel — חבילות וכללים

> **עיקרון: האפליקציה חייבת להרגיש כאילו Apple בנו אותה.**
> זה לא קורה מעצמו — צריך להטמיע את החבילות הנכונות מיום 1.

### חבילות חובה (מותקנות ב-Phase 4 — Setup)

| חבילה                            | מטרה                           | שימוש ב-inField                        |
| -------------------------------- | ------------------------------ | -------------------------------------- |
| `react-native-safe-area-context` | התאמה לנוטש ואזורי מערכת       | כל מסך עטוף ב-SafeArea                 |
| `expo-haptics`                   | רטט מגע (Taptic Engine)        | V/X בצ'קליסט, חתימה, שליחת דוח         |
| `react-native-gesture-handler`   | Swipe, long press, pinch       | Swipe ליקוי = תוקן/לא, pinch על תמונה  |
| `react-native-reanimated`        | אנימציות 60fps על UI thread    | מעברי מסך, פתיחת כרטיסים, סטטוסים      |
| `@shopify/flash-list`            | רשימות וירטואליות מהירות       | רשימת ליקויים, רשימת דירות             |
| `expo-image`                     | תמונות עם cache חכם            | תמונות ליקויים, לוגו                   |
| `@gorhom/bottom-sheet`           | Bottom Sheet (iOS pattern)     | כרטיס ליקוי חדש, בחירת קטגוריה         |
| `expo-blur`                      | אפקט Blur (iOS native)         | רקע מטושטש מאחורי Bottom Sheet / Modal |
| `expo-navigation-bar`            | התאמת Navigation Bar (Android) | צבע ושקיפות                            |
| `expo-status-bar`                | שליטה ב-Status Bar             | צבע, סגנון (light/dark)                |

### כללי iOS UX שנאכוף

```
1. Large Titles — כל מסך ראשי משתמש בכותרת גדולה שמתכווצת בגלילה
2. Pull to Refresh — כל רשימה תומכת במשיכה לרענון
3. Swipe Back — חזרה אחורה ב-swipe מצד שמאל (React Navigation default)
4. Haptic Feedback — רטט קל על כל פעולה משמעותית:
   - Selection haptic: בחירת V/X בצ'קליסט
   - Impact haptic (light): לחיצה על כפתור ראשי
   - Notification haptic (success): דוח נשלח בהצלחה
   - Notification haptic (warning): שגיאה
5. Keyboard Handling — מסך עולה חלק עם המקלדת, dismiss בטאפ על הרקע
6. Safe Area — תוכן לעולם לא חתוך מאחורי נוטש/כפתור בית
7. Blur Effects — Bottom Sheet ו-Modal עם רקע מטושטש
8. Native ScrollView — bounce effect, momentum scroll
9. Design System Colors — שימוש בלעדי ב-Design System tokens (g500, clRed, clAmber...) ולא ב-systemBlue/systemRed
10. Accessibility — VoiceOver support, Dynamic Type (גודל טקסט מערכתי)
```

### Android Parity

הכללים חלים גם על Android עם התאמות:

- Material Design 3 patterns במקום iOS patterns
- Haptics עובד דרך Vibrator API (expo-haptics מטפל אוטומטית)
- Navigation bar color מותאם (expo-navigation-bar)
- Edge-to-edge display ב-Android 15+

---

## 10. Performance Targets

| Metric                     | Target                 | Measurement                 |
| -------------------------- | ---------------------- | --------------------------- |
| App launch (cold start)    | < 2 seconds            | Sentry performance          |
| Checklist load time        | < 500ms                | Local DB query              |
| Photo capture → saved      | < 1 second             | Local save                  |
| Sync (30 defects + photos) | < 30 seconds           | On 4G connection            |
| PDF generation             | < 10 seconds           | Edge Function               |
| Web dashboard load         | < 1.5 seconds (FCP)    | Lighthouse                  |
| Offline → Online sync      | < 5 seconds (for data) | After connectivity restored |

---

## 11. Deployment Architecture

```
Development:
- Expo Dev Server (mobile) → localhost:8081
- Vite Dev Server (web) → localhost:5173
- Supabase Local (CLI) → localhost:54321

Staging:
- EAS Build → Internal testing (TestFlight / Internal Track)
- Vercel Preview → staging.infield.app
- Supabase Staging Project

Production:
- EAS Build → App Store + Play Store
- Vercel Production → app.infield.app
- Supabase Production Project
- Sentry monitoring active
```

---

## 12. סוג פרויקט (Project Type)

### עיקרון

סוג הפרויקט נקבע בהקמה ומגדיר **ברירת מחדל** לסוג הדוח. אפשר לשנות לכל דוח בנפרד.

### סוגים

| DB Value     | UI Label       | Description                       |
| ------------ | -------------- | --------------------------------- |
| `delivery`   | פרוטוקול מסירה | צ'קליסט מסירת דירה לפי חדרים      |
| `bedek_bait` | בדק בית        | דוח ליקויים לפי קטגוריות מקצועיות |

### מה סוג הפרויקט קובע

|                     | פרוטוקול מסירה                                | בדק בית                                        |
| ------------------- | --------------------------------------------- | ---------------------------------------------- |
| סוג דוח default     | `delivery`                                    | `bedek_bait`                                   |
| אפשר לשנות per-דוח? | ✅ כן                                         | ✅ כן                                          |
| סטטוסי דירה         | pending → in_progress → completed → delivered | pending → in_progress → completed (נגזר מהדוח) |
| מסירה ראשונה/שנייה  | ✅ רלוונטי                                    | ❌ לא רלוונטי                                  |
| צ'קליסט חדרים       | ✅ מופעל                                      | ❌ לא (free-form)                              |
| Progress tracking   | לפי דירות שנמסרו                              | לפי דוחות שהושלמו                              |

### UX Impact

**בפרויקט מסירה:**

- FAB "בדיקה חדשה" → פותח ישר פרוטוקול מסירה (בלי לבחור סוג)
- שדה "סבב מסירה" מופיע (ראשונה/שנייה)
- סטטוסי דירה: ממתין/בבדיקה/נבדק/נמסר

**בפרויקט בדק בית:**

- FAB "בדיקה חדשה" → פותח ישר דוח בדק בית
- אין שדה סבב — כל דוח עצמאי
- סטטוסי דירה: ממתין/בעבודה/הושלם (נגזר מסטטוס הדוח)

---

## 13. מסירה ראשונה ← שנייה (Delivery Rounds)

### עיקרון

מסירה שנייה היא **דוח נפרד** שמקושר לדוח המסירה הראשונה ויורש ממנו את רשימת הליקויים. ההפרדה לשני דוחות שומרת על ה-Iron Rule — הדוח הראשון לא משתנה.

### קישור בין סבבים

```
delivery_reports.previous_round_id → delivery_reports.id
round_number = 1 → previous_round_id = NULL
round_number = 2 → previous_round_id = round 1 id
round_number = 3+ → previous_round_id = round (n-1) id
```

### Flow — מסירה ראשונה (round 1)

```
מפקח נכנס לדירה
→ פותח פרוטוקול מסירה (round_number = 1, previous_round_id = NULL)
→ צ'קליסט מלא: כל החדרים, כל הפריטים
→ מוצא ליקויים → מתעד
→ מסיים → דוח הושלם
→ PDF נשלח לקבלן
→ סטטוס דירה: "נבדק" (completed)
```

### Flow — מסירה שנייה (round 2)

```
מפקח חוזר לדירה
→ לוחץ "מסירה שנייה"
→ המערכת:
   1. יוצרת דוח חדש (round_number = 2, previous_round_id = round1.id)
   2. מייבאת את כל הליקויים מ-round 1 כ-snapshot (defect_source = 'inherited')
   3. כל ליקוי מקבל review_status = 'pending_review'

→ מפקח עובר ליקוי-ליקוי:
   ✓ תוקן (fixed) — ליקוי נסגר
   ✗ לא תוקן (not_fixed) — ליקוי נשאר פתוח
   ~ תוקן חלקית (partially_fixed) — ליקוי נשאר פתוח עם הערה

→ מפקח יכול להוסיף ליקויים חדשים (defect_source = 'manual')
→ מסיים → דוח הושלם
→ PDF: מציג השוואה — מה נמצא בסבב 1, מה תוקן, מה לא
→ סטטוס דירה: "נמסר" (אם הכל תוקן) או "נבדק" (אם נשארו)
```

### סטטוסי review (round 2+)

| review_status     | UI Label     | סמל | צבע       |
| ----------------- | ------------ | --- | --------- |
| `pending_review`  | ממתין לבדיקה | ⏳  | `n400`    |
| `fixed`           | תוקן         | ✓   | `g500`    |
| `not_fixed`       | לא תוקן      | ✗   | `clRed`   |
| `partially_fixed` | תוקן חלקית   | ~   | `clAmber` |

### Business Rules

| כלל                               | פירוט                                                 |
| --------------------------------- | ----------------------------------------------------- |
| מסירה שנייה רק אחרי ראשונה הושלמה | round 1 status must be 'completed'                    |
| round 1 לא משתנה                  | Iron Rule — round 2 מייבא snapshot                    |
| ליקויים חדשים ב-round 2           | defect_source = 'manual', review_status = NULL        |
| round 3+                          | אותו pattern — previous_round_id מצביע ל-round הקודם  |
| מחיקת round 1                     | אסורה אם יש round 2 (ON DELETE SET NULL מונע cascade) |

### Apartment Status after Round 2

```
if all inherited defects review_status = 'fixed':
  apartment.status = 'delivered'

if some not_fixed or partially_fixed:
  apartment.status = 'completed' (צריך סבב נוסף)
```

---

## 14. סטטוסי דירה לפי סוג פרויקט

### פרוטוקול מסירה (delivery)

| DB Status     | UI Label | Dot     | Badge Color | Badge BG |
| ------------- | -------- | ------- | ----------- | -------- |
| `pending`     | ממתין    | `n400`  | `n500`      | `cr200`  |
| `in_progress` | בבדיקה   | `go500` | `go700`     | `go100`  |
| `completed`   | נבדק     | `g500`  | `g700`      | `g50`    |
| `delivered`   | נמסר     | `g500`  | `g700`      | `g100`   |

**מעברים:**

```
pending → in_progress   (נפתח דוח ראשון)
in_progress → completed (דוח הושלם)
completed → delivered   (כל הליקויים תוקנו ב-round 2)
delivered → completed   (נפתח סבב נוסף)
```

### בדק בית (bedek_bait)

אין lifecycle מסירה — סטטוס הדירה נגזר מסטטוס הדוח:

| מצב                   | UI Label | Dot     | Badge Color | Badge BG |
| --------------------- | -------- | ------- | ----------- | -------- |
| אין דוח               | ממתין    | `n400`  | `n500`      | `cr200`  |
| דוח draft/in_progress | בעבודה   | `go500` | `go700`     | `go100`  |
| דוח completed         | הושלם    | `g500`  | `g700`      | `g50`    |

---

## 15. סטטוסי דוח (Report Statuses)

| DB Status     | UI Label | משמעות                      | עריכה      | PDF          |
| ------------- | -------- | --------------------------- | ---------- | ------------ |
| `draft`       | טיוטה    | חינם, watermark, לפני תשלום | חופשית     | עם watermark |
| `in_progress` | בעבודה   | שולם, בתהליך בדיקה          | חופשית     | נקי          |
| `completed`   | הושלם    | מפקח סימן כמוכן             | אישור כפול | נקי          |
| `sent`        | נשלח     | נשלח ללקוח (v1.1)           | אישור כפול | נקי          |

### מעבר בין סטטוסים

```
draft → in_progress    (אחרי תשלום)
in_progress → completed (מפקח מסמן "הושלם")
completed → sent        (שליחה ללקוח, v1.1)
completed → in_progress (חזרה לעריכה — אישור כפול)
```

### קיבוץ לפילטרים

| Filter   | כולל סטטוסים                           |
| -------- | -------------------------------------- |
| "הכל"    | draft + in_progress + completed + sent |
| "פעילים" | draft + in_progress                    |
| "הושלמו" | completed + sent                       |

---

## 16. Navigation Architecture

### App Navigation Structure (React Navigation)

```
BottomTabNavigator
├── HomeStack (tab: "בית")
│   └── HomeScreen
│
├── ReportsStack (tab: "דוחות")
│   ├── ReportsListScreen
│   └── ReportDetailScreen
│
├── ProjectsStack (tab: "פרויקטים")
│   ├── ProjectsListScreen
│   ├── BuildingsListScreen (if buildings > 1)
│   ├── ApartmentsListScreen
│   └── ReportDetailScreen (shared)
│
└── SettingsStack (tab: "הגדרות")
    └── SettingsScreen (v1.1)
```

### Smart Navigation

```
ProjectsList → project card:
  if buildings === 1 → ApartmentsListScreen (skip buildings)
  if buildings > 1 → BuildingsListScreen → ApartmentsListScreen
ApartmentsListScreen → apartment → ReportDetailScreen
```

---

## 17. Screen Inventory

| Screen          | Tab      | Mockup                                | DS Section | Status      |
| --------------- | -------- | ------------------------------------- | ---------- | ----------- |
| Home Screen     | בית      | `inField-HomeScreen-v6-rtl.jsx`       | §19        | ✅ FINAL    |
| Reports List    | דוחות    | `inField-ReportsList-v5-rtl.jsx`      | §20        | ✅ FINAL    |
| Projects List   | פרויקטים | `inField-ProjectsList-v2.jsx`         | §21        | ✅ FINAL    |
| Buildings List  | —        | `inField-Buildings-Apartments-v2.jsx` | §22        | ✅ FINAL    |
| Apartments List | —        | `inField-Buildings-Apartments-v2.jsx` | §22        | ✅ FINAL    |
| Report Detail   | —        | `inField-MainScreen-v6.jsx`           | §15        | ✅ existing |
| Checklist       | —        | `DocField-Checklist-FINAL.jsx`        | §16        | ✅ existing |
| Settings        | הגדרות   | —                                     | —          | ⬜ v1.1     |

---

## ✅ Component Quality Checklist

לפני כל commit של component חדש:

**TypeScript**

- [ ] `npx tsc --noEmit` עובר ללא שגיאות
- [ ] כל ה-imports מ-`@infield/*` עובדים
- [ ] Props מוקלדים (TypeScript interfaces)

**Design System**

- [ ] משתמש רק ב-`theme.colors` (לא hardcoded hex)
- [ ] משתמש רק ב-`theme.spacing` (לא magic numbers)
- [ ] משתמש ב-`theme.typography.*.fontFamily`
- [ ] עוקב אחרי `theme.borderRadius`, `theme.shadows`

**Skills Compliance**

- [ ] Component עוקב אחרי `frontend-design` guidelines
- [ ] UX עוקב אחרי `bencium-controlled-ux-designer`
- [ ] אם mobile — עוקב אחרי `vercel-react-native-skills`

**Integration**

- [ ] `npm run build` עובר בהצלחה
- [ ] Component מיובא ועובד ב-parent
- [ ] אין `console.log`/errors בקוד production

**Design Audit**

- [ ] הרצת `/design-check` על הקובץ
- [ ] תיקון כל הממצאים

> אם כל הסעיפים ✅ — אפשר לעשות commit.

---

## אישורים

| פריט                  | סטטוס   | תאריך    |
| --------------------- | ------- | -------- |
| Architecture Document | ✅ v8.1 | מרץ 2026 |

---

_מסמך ארכיטקטורה — inField | Version 8.1 | מרץ 2026_
_Changes from v7: project type, delivery rounds, apartment statuses, report statuses, navigation, screen inventory_
_Companion documents: DESIGN_SYSTEM.md (visual), SCREEN_STANDARDS.md (functional), SECURITY_STANDARDS.md (security)_

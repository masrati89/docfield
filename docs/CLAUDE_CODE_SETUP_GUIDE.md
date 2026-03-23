# 🛠️ מדריך הגדרת Claude Code עבור DocField

> **מדריך צעד-אחר-צעד להגדרת Claude Code כך שיעבוד כמפתח של DocField.**
> עקוב אחרי הסדר. אל תדלג על שלבים.

---

## מה זה Claude Code ואיך זה עובד

Claude Code הוא כלי שרץ **בטרמינל שלך** (לא בדפדפן). הוא רואה את הקבצים בפרויקט, עורך אותם, מריץ פקודות, ומנהל Git. כל שינוי שהוא עושה דורש את האישור שלך.

```
אתה (חיים) ←→ Claude Code (בטרמינל) ←→ הקבצים בפרויקט
```

### קבצי מערכת שClaude Code קורא

| קובץ | מיקום | מה זה עושה |
|------|-------|------------|
| `~/.claude/CLAUDE.md` | Home directory | הוראות **גלובליות** — נטענות בכל פרויקט |
| `~/.claude/settings.json` | Home directory | הגדרות, הרשאות, מודל ברירת מחדל |
| `docfield/CLAUDE.md` | שורש הפרויקט | הוראות **לפרויקט DocField** — נטענות רק כאן |
| `docfield/.claude/settings.json` | בתוך הפרויקט | הגדרות ספציפיות לפרויקט |
| `docfield/.claude/skills/` | בתוך הפרויקט | Skills שClaude Code משתמש בהם |
| `docfield/.claude/commands/` | בתוך הפרויקט | פקודות מותאמות אישית |

**סדר הטעינה:** גלובלי → פרויקט → תיקיית עבודה נוכחית.
אם יש CLAUDE.md גם בשורש וגם בתת-תיקייה — שניהם נטענים.

---

## שלב 1: התקנת Claude Code

### דרישות מוקדמות
- מנוי Claude Pro ($20/חודש) או Claude Max ($100-200/חודש)
- Node.js 22+ (מומלץ) או שימוש ב-native installer
- Git מותקן
- macOS / Linux / Windows עם WSL

### התקנה (בחר אחת)

**אפשרות א — Native Installer (מומלץ):**
```bash
# macOS / Linux
curl -fsSL https://claude.ai/install.sh | sh

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

**אפשרות ב — דרך npm:**
```bash
npm install -g @anthropic-ai/claude-code
```

### אימות
```bash
claude --version
# צריך להציג מספר גרסה

claude auth login
# זה יפתח דפדפן להתחברות לחשבון Anthropic שלך
```

---

## שלב 2: הגדרות גלובליות (פעם אחת)

### 2.1 — יצירת CLAUDE.md גלובלי

```bash
mkdir -p ~/.claude
```

צור את הקובץ `~/.claude/CLAUDE.md` עם התוכן הבא:

```markdown
# Global Instructions — Haim Masarti

## Who I Am
- Name: Haim Masarti (חיים מסרטי)
- Role: Product Owner / Entrepreneur — NOT a professional developer
- I define WHAT to build and WHY. You define HOW to build it.
- Always explain technical decisions in simple terms before asking me to decide.

## Communication
- Speak to me in Hebrew. Code and comments in English.
- Use structured formatting: numbered steps, severity ratings.
- If something changes mid-task — STOP and tell me before continuing.

## Workflow
- NEVER write code without a plan I approved.
- Show me what you're about to do BEFORE doing it.
- After completing a task, summarize what was done and what comes next.

## Code Quality
- TypeScript strict mode, no `any` type.
- Every async operation has try/catch with user-friendly error messages.
- Max 200 lines per file. If bigger, split.
- Meaningful variable names, no abbreviations.
- Comments explain WHY, not WHAT.

## Git
- Conventional Commits: feat:, fix:, docs:, refactor:, security:
- Atomic commits — each commit does one thing.
- Never push directly to main.
```

### 2.2 — הגדרות גלובליות (settings.json)

צור את הקובץ `~/.claude/settings.json`:

```json
{
  "model": "claude-sonnet-4-6",
  "thinking": "always",
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(git *)",
      "Bash(cd *)",
      "Bash(ls *)",
      "Bash(cat *)",
      "Bash(mkdir *)",
      "Bash(cp *)",
      "Bash(mv *)",
      "Bash(rm *)",
      "Bash(echo *)",
      "Bash(node *)",
      "Bash(tsc *)",
      "Bash(expo *)",
      "Bash(supabase *)",
      "Bash(python3 *)"
    ],
    "deny": [
      "Bash(sudo *)",
      "Bash(curl *|sh)",
      "Bash(rm -rf /)"
    ]
  }
}
```

**הסבר:** 
- `model: sonnet-4-6` — ברירת מחדל Sonnet (מהיר, זול). למשימות מורכבות תחליף ל-Opus.
- `thinking: always` — Claude Code תמיד מראה את החשיבה שלו לפני שפועל.
- `permissions` — מאשר פקודות נפוצות מראש כדי שלא תצטרך לאשר כל פקודה.

---

## שלב 3: יצירת פרויקט DocField

### 3.1 — צור תיקיית פרויקט

```bash
mkdir docfield
cd docfield
git init
```

### 3.2 — צור CLAUDE.md ברמת הפרויקט

צור קובץ `docfield/CLAUDE.md`:

```markdown
# DocField — Project Instructions

## Product
מערכת דוחות מסירה, בדק בית ופיקוח בענף הבנייה.
Target market: Israel (Hebrew RTL).
Business: SaaS — free trial, plans at ₪99/₪199/₪349.

## Tech Stack
- Mobile: React Native + Expo SDK 52+ (Expo Router, NativeWind)
- Web Dashboard: React + Vite + Tailwind
- Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- Offline DB: WatermelonDB
- Drawing: @shopify/react-native-skia
- PDF: expo-print (on-device)
- Monorepo: Turborepo with npm workspaces
- Language: TypeScript 5.x strict everywhere

## Architecture
Monorepo structure:
- apps/mobile — Expo app
- apps/web — Vite dashboard
- packages/shared — Types, validation (Zod), i18n, constants
- supabase/ — Migrations, Edge Functions

## Design System
READ these files before writing ANY UI code:
1. docs/DESIGN_SYSTEM_DOCFIELD.md — Colors, typography, spacing, components
2. .claude/DESIGN_CONTEXT.md — Brand context and design rules

Key rules:
- Background: cream-50 (#FEFDFB), NEVER pure white
- Primary color: forest green (#1B7A44)
- Borders: cream-200 (#F5EFE6), NEVER gray
- Font: Rubik (Hebrew), Inter (English/numbers)
- Direction: RTL
- Border radius: minimum 10px for interactive elements
- Every button: press animation (scale 0.98) + haptic feedback
- Every list: staggered entrance animation
- Loading states: skeleton screens, NOT spinners
- Shadows: warm-tinted (neutral-900 base), NOT pure black

## Security
- RLS on EVERY table, no exceptions
- organization_id on every tenant-scoped table
- Secrets in env variables only, NEVER in code
- Supabase Auth with expo-secure-store (NOT AsyncStorage)

## Code Conventions
- Components: PascalCase (UserCard.tsx)
- Hooks: camelCase with use prefix (useAuth.ts)
- DB tables: snake_case plural (delivery_reports)
- Constants: UPPER_SNAKE_CASE
- No prop drilling beyond 2 levels — use Context
- Israeli phone regex: /^0[2-9]\d{7,8}$/
- All UI text from i18n files (packages/shared/src/i18n/)

## Validation
- Client AND server: Zod schemas (packages/shared/src/validation/)
- Never trust client-only validation

## File Limits
- Max 200 lines per file
- Max 50 lines per function
- If a component has more than 3 useState hooks, extract a custom hook

## Testing
- Run TypeScript: npx tsc --noEmit (before every commit)
- Run lint: npx turbo lint
- Run build: npx turbo build

## Important
- When building UI, ALWAYS consult the bencium MOTION-SPEC.md for animations
- When unsure about design decisions, run ui-ux-pro-max search:
  python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --stack react-native
- Follow react-native-reusables patterns for base components
- Commit after each meaningful unit of work
```

### 3.3 — צור הגדרות פרויקט

```bash
mkdir -p docfield/.claude
```

צור `docfield/.claude/settings.json`:

```json
{
  "model": "claude-sonnet-4-6",
  "thinking": "always",
  "permissions": {
    "allow": [
      "Read",
      "Edit",
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(git *)",
      "Bash(expo *)",
      "Bash(supabase *)",
      "Bash(turbo *)",
      "Bash(python3 *)"
    ]
  }
}
```

---

## שלב 4: התקנת Skills

### 4.1 — Design Skills

```bash
cd docfield

# bencium UX Designer (primary design skill)
/plugin marketplace add bencium/bencium-marketplace
/plugin install bencium-controlled-ux-designer@bencium-marketplace

# UI/UX Pro Max (design database with 50+ styles, colors, fonts)
npm install -g uipro-cli
uipro init --ai claude

# bencium Innovative (for creative screens like onboarding)
/plugin install bencium-innovative-ux-designer@bencium-marketplace
```

### 4.2 — אימות

```bash
# ודא שה-skills מותקנים
ls .claude/skills/

# צריך לראות:
# bencium-controlled-ux-designer/
# ui-ux-pro-max/
# bencium-innovative-ux-designer/
```

### 4.3 — פקודות Slash מותאמות (אופציונלי אבל מומלץ)

```bash
mkdir -p docfield/.claude/commands
```

צור `docfield/.claude/commands/design-check.md`:

```markdown
---
name: design-check
description: Run design system verification on current UI code
---

Check the current file against DocField's design system:
1. Read docs/DESIGN_SYSTEM_DOCFIELD.md
2. Verify all colors match the DocField palette
3. Verify border-radius is minimum 10px on interactive elements
4. Verify backgrounds use cream-50 not white
5. Verify buttons have press animation and haptic feedback
6. Verify lists have staggered entrance animation
7. Report any violations as a numbered list with fixes
```

צור `docfield/.claude/commands/new-screen.md`:

```markdown
---
name: new-screen
description: Create a new screen following DocField patterns
---

Before creating a new screen:
1. Read docs/DESIGN_SYSTEM_DOCFIELD.md
2. Read .claude/DESIGN_CONTEXT.md
3. Read bencium MOTION-SPEC.md for animation specs
4. Run: python3 .claude/skills/ui-ux-pro-max/scripts/search.py "$ARGUMENTS" --stack react-native
5. Plan the screen layout and get approval
6. Then implement with full DocField design system compliance
```

---

## שלב 5: העתק מסמכי פרויקט

```bash
mkdir -p docfield/docs
```

### העתק את המסמכים הבאים לתיקיית docs/:
- `DESIGN_SYSTEM_DOCFIELD.md` → `docfield/docs/DESIGN_SYSTEM_DOCFIELD.md`
- `ARCHITECTURE_DOCFIELD.md` → `docfield/docs/ARCHITECTURE_DOCFIELD.md`
- `SECURITY_DOCFIELD.md` → `docfield/docs/SECURITY_DOCFIELD.md`
- `PROJECT_BRIEF_DOCFIELD.md` → `docfield/docs/PROJECT_BRIEF_DOCFIELD.md`

Claude Code יקרא את המסמכים האלה כשתפנה אותו אליהם.

---

## שלב 6: הפעלת Claude Code

### הפעלה רגילה
```bash
cd docfield
claude
```

Claude Code יטען אוטומטית:
1. `~/.claude/CLAUDE.md` (הוראות גלובליות)
2. `docfield/CLAUDE.md` (הוראות פרויקט)
3. Skills מ-`.claude/skills/`

### פקודות בסיסיות

| פקודה | מה זה עושה |
|-------|------------|
| `claude` | מפעיל session אינטראקטיבי |
| `claude -c` | ממשיך session אחרון |
| `claude --model claude-opus-4-6` | מפעיל עם מודל Opus (חזק יותר) |
| `/design-check` | מריץ את הפקודה המותאמת שיצרנו |
| `/new-screen checklist` | יוצר מסך חדש בהתאם לתבנית |
| `Ctrl+C` | עוצר פעולה נוכחית |
| `/clear` | מנקה את ההקשר |
| `/status` | מראה מצב נוכחי |

### טיפים לעבודה יומיומית

**למשימות פשוטות (Sonnet):**
```bash
claude
> צור קומפוננטת Button לפי ה-Design System
```

**למשימות מורכבות (Opus):**
```bash
claude --model claude-opus-4-6
> בנה את ה-Checklist Engine המלא לפי PROMPT 9
```

**למשימה חד-פעמית (ללא session):**
```bash
claude -p "הוסף index על defects(organization_id, status) ב-Supabase"
```

---

## שלב 7: התחלת עבודה עם DocField

### סדר העבודה

```
1. פתח טרמינל
2. cd docfield
3. claude
4. העתק את PROMPT 0 מ-PHASE4_CLAUDE_CODE_PROMPTS.md
5. הדבק ותן לClaude Code לבצע
6. בדוק תוצאה
7. העתק את PROMPT 1
8. וכן הלאה...
```

### דוגמה לאינטראקציה

```
$ cd docfield
$ claude

╭──────────────────────────────────────╮
│ Claude Code v22.x                    │
│ Model: claude-sonnet-4-6             │
│ Project: docfield                    │
│ Skills: 3 loaded                     │
╰──────────────────────────────────────╯

> [מדביק את PROMPT 0 - Skills Setup]

Claude: I'll install the design intelligence skills...
[מתקין, מריץ, מגדיר]
Claude: ✅ Done. All 3 skills installed. DESIGN_CONTEXT.md created.

> [מדביק את PROMPT 1 - Monorepo Init]

Claude: I'll create the monorepo structure...
Planning:
1. Create root package.json with workspaces
2. Set up Turborepo
3. Create base TypeScript config
4. ...

Shall I proceed? (y/n)

> y

[Claude Code יוצר את כל הקבצים, מריץ npm install, מוודא שהכל עובד]
```

---

## שלב 8: מתי להשתמש ב-Opus vs Sonnet

| משימה | מודל | סיבה |
|-------|------|------|
| Setup, boilerplate, config | Sonnet | מהיר, פשוט |
| Types, constants, validation | Sonnet | לוגיקה פשוטה |
| DB migrations, RLS policies | **Opus** | אבטחה קריטית, צריך חשיבה |
| UI components בודדים | Sonnet | תבנית ברורה |
| Checklist Engine (core feature) | **Opus** | מורכב, multi-file |
| WatermelonDB sync logic | **Opus** | offline-first מורכב |
| Skia annotations | **Opus** | ספרייה מתקדמת |
| Bug fixes | Sonnet | ממוקד |
| Architecture decisions | **Opus** | צריך הבנה עמוקה |

**כלל אצבע:** Sonnet ל-80% מהמשימות, Opus ל-20% הקריטיים.

```bash
# החלפה מהירה ל-Opus
claude --model claude-opus-4-6
```

---

## מבנה קבצים סופי

```
~/.claude/
├── CLAUDE.md                    # הוראות גלובליות (מי אתה, איך לדבר)
└── settings.json                # הגדרות גלובליות (מודל, הרשאות)

docfield/
├── CLAUDE.md                    # הוראות פרויקט (stack, conventions, design)
├── .claude/
│   ├── settings.json            # הגדרות פרויקט
│   ├── DESIGN_CONTEXT.md        # (נוצר ב-PROMPT 0)
│   ├── skills/
│   │   ├── bencium-controlled-ux-designer/
│   │   │   ├── SKILL.md
│   │   │   ├── MOTION-SPEC.md
│   │   │   ├── ACCESSIBILITY.md
│   │   │   └── RESPONSIVE-DESIGN.md
│   │   ├── bencium-innovative-ux-designer/
│   │   │   └── SKILL.md
│   │   └── ui-ux-pro-max/
│   │       ├── SKILL.md
│   │       ├── scripts/search.py
│   │       └── data/*.csv
│   └── commands/
│       ├── design-check.md      # /design-check
│       └── new-screen.md        # /new-screen
├── docs/
│   ├── DESIGN_SYSTEM_DOCFIELD.md
│   ├── ARCHITECTURE_DOCFIELD.md
│   ├── SECURITY_DOCFIELD.md
│   └── PROJECT_BRIEF_DOCFIELD.md
├── apps/
│   ├── mobile/                  # (נוצר ב-PROMPT 3)
│   └── web/                     # (נוצר ב-PROMPT 5)
├── packages/
│   └── shared/                  # (נוצר ב-PROMPT 2)
├── supabase/                    # (נוצר ב-PROMPT 4)
├── turbo.json
├── package.json
├── tsconfig.base.json
├── .gitignore
├── .env.example
└── README.md
```

---

## טיפים חשובים

### 1. שמור על ההקשר
Claude Code יש חלון הקשר מוגבל. אם שיחה ארוכה, הוא עלול "לשכוח" דברים.
- התחל session חדש לכל PROMPT
- אם Claude Code מתנהג מוזר — `/clear` והתחל מחדש
- הפנה אותו לקבצים: "Read docs/DESIGN_SYSTEM_DOCFIELD.md"

### 2. Plan Mode
למשימות מורכבות, בקש מClaude Code לתכנן לפני שמבצע:
```
> Plan how you would build the Checklist Engine. Don't write code yet.
```

### 3. בדוק לפני שממשיך
אחרי כל PROMPT:
- ודא שאין שגיאות TypeScript: `npx tsc --noEmit`
- ודא שהפרויקט בונה: `npx turbo build`
- בדוק ויזואלית שהעיצוב נכון

### 4. Commit אחרי כל שלב מוצלח
```
> Commit with message "feat: complete PROMPT 1 - monorepo initialization"
```

### 5. אם Claude Code טועה
- לחץ `n` (no) כשהוא מבקש אישור
- הסבר מה לא בסדר
- אם מתעקש — סגור session והתחל חדש עם הוראה מדויקת יותר

---

## Checklist — מוכן להתחיל?

- [ ] Claude Code מותקן (`claude --version` עובד)
- [ ] מחובר לחשבון (`claude auth login` הצליח)
- [ ] `~/.claude/CLAUDE.md` נוצר עם ההוראות הגלובליות
- [ ] `~/.claude/settings.json` נוצר עם ההרשאות
- [ ] תיקיית `docfield/` נוצרה עם `git init`
- [ ] `docfield/CLAUDE.md` נוצר עם הוראות הפרויקט
- [ ] `docfield/.claude/settings.json` נוצר
- [ ] מסמכי DocField (Design System, Architecture, Security, Brief) בתוך `docs/`
- [ ] `PHASE4_CLAUDE_CODE_PROMPTS.md` פתוח ומוכן
- [ ] אתה בתיקיית `docfield/` בטרמינל

**מוכן?** הפעל `claude` והדבק את PROMPT 0.

---

*DocField — Claude Code Setup Guide | מרץ 2026*

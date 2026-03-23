# 🔒 SECURITY BLUEPRINT — DocField

> **Phase 3 — Security Blueprint**
> מסמך זה מגדיר את כל שיקולי האבטחה של DocField.
> ⚠️ אבטחה היא NON-NEGOTIABLE. אין קיצורי דרך.

---

## 1. מודל איומים (Threat Model)

### מי המשתמשים

| תפקיד | גישה | סיכון |
|--------|------|-------|
| **Admin** | הכל — ניהול משתמשים, הגדרות, תבניות | גניבת חשבון = גישה מלאה לכל הארגון |
| **Project Manager** | צפייה בכל הפרויקטים, ניהול מסירות | גישה לנתונים רגישים של דיירים |
| **Inspector** | יצירת/עריכת בדיקות שהוקצו לו | מכשיר בשטח שיכול ללכת לאיבוד |
| **Tenant (דייר)** | צפייה בדוח שלו בלבד (לינק) | לינק שיכול להישלח לאדם לא נכון |
| **Sub-contractor** | צפייה בליקויים רלוונטיים בלבד (לינק) | לינק שיכול להישלח לאדם לא נכון |

### וקטורי איום עיקריים

| איום | סבירות | השפעה | מענה |
|------|---------|--------|------|
| גישה בין-שוכרית (Tenant A רואה נתוני Tenant B) | 🔴 קריטי | 🔴 קריטי | RLS על כל טבלה, organization_id enforced |
| מכשיר אבוד/נגנב עם נתונים | 🟠 גבוה | 🟠 גבוה | Auth timeout, secure storage, remote wipe |
| לינק דוח נחשף לגורם לא מורשה | 🟠 גבוה | 🟡 בינוני | Signed URLs עם תפוגה, token-based access |
| SQL Injection | 🟡 בינוני | 🔴 קריטי | Supabase client (parameterized), Zod validation |
| XSS בדוח PDF | 🟡 בינוני | 🟡 בינוני | Sanitize all user input before HTML render |
| Brute force על התחברות | 🟡 בינוני | 🟠 גבוה | Rate limiting (Supabase built-in), lockout |
| חשיפת מפתחות API | 🟡 בינוני | 🔴 קריטי | Environment variables only, .env never committed |
| שינוי חתימה דיגיטלית לאחר חתימה | 🟡 בינוני | 🔴 קריטי | Immutable signatures, no UPDATE policy |

---

## 2. Authentication

### Supabase Auth Configuration

```
Provider:          Email/Password (ראשי)
                   Google OAuth (אופציונלי, v1.1)
Password Policy:   8+ characters, enforced by Supabase
Session Duration:  7 days (configurable)
Token Refresh:     Auto-refresh before expiry
MFA:               Architecture ready, not enabled in MVP
```

### Auth Flow — Mobile

```
1. User opens app
2. Check for stored JWT (Expo SecureStore — encrypted)
3. If valid → Load app, start sync
4. If expired → Try refresh token
5. If refresh fails → Show login screen
6. Login → Supabase Auth → JWT + Refresh Token
7. Store both in SecureStore (NOT AsyncStorage)
8. JWT included in all Supabase requests
9. Auto-refresh before expiry (background)
10. Idle timeout: 30 min without activity → re-authenticate
```

### Auth Flow — Web Dashboard

```
1. User navigates to app.docfield.app
2. Check for stored session (Supabase handles via httpOnly cookie)
3. If valid → Load dashboard
4. If not → Redirect to login
5. Login → Supabase Auth → session stored
6. Auto-refresh handled by Supabase client
```

### Token Storage

| Platform | Storage Method | Security |
|----------|---------------|----------|
| iOS | Expo SecureStore (Keychain) | Encrypted at rest, biometric optional |
| Android | Expo SecureStore (Keystore) | Encrypted at rest |
| Web | Supabase session (httpOnly cookie) | Not accessible from JS |

**NEVER use:**
- AsyncStorage for tokens (unencrypted)
- react-native-mmkv for tokens (fast but not designed for secrets)
- localStorage on web for tokens

---

## 3. Authorization (RBAC)

### Role Definitions

```typescript
// packages/shared/types/auth.types.ts
type UserRole = 'admin' | 'project_manager' | 'inspector';

interface Permissions {
  // Organizations
  'org:manage': boolean;          // Edit org settings, logo, templates
  'org:manage_users': boolean;    // Add/remove users, change roles
  
  // Projects
  'project:create': boolean;
  'project:view_all': boolean;    // See all projects in org
  'project:view_assigned': boolean; // See only assigned projects
  
  // Inspections
  'inspection:create': boolean;
  'inspection:edit_own': boolean;
  'inspection:edit_all': boolean;
  'inspection:delete': boolean;
  
  // Reports
  'report:generate': boolean;
  'report:send': boolean;
  'report:view_all': boolean;
  
  // Templates
  'template:manage': boolean;     // Create/edit checklist templates
  
  // Sub-contractors (v1.1)
  'subcontractor:manage': boolean;
  'subcontractor:assign': boolean;
}
```

### Role → Permission Matrix

| Permission | Admin | Project Manager | Inspector |
|-----------|-------|----------------|-----------|
| org:manage | ✅ | ❌ | ❌ |
| org:manage_users | ✅ | ❌ | ❌ |
| project:create | ✅ | ✅ | ❌ |
| project:view_all | ✅ | ✅ | ❌ |
| project:view_assigned | ✅ | ✅ | ✅ |
| inspection:create | ✅ | ✅ | ✅ |
| inspection:edit_own | ✅ | ✅ | ✅ |
| inspection:edit_all | ✅ | ✅ | ❌ |
| inspection:delete | ✅ | ❌ | ❌ |
| report:generate | ✅ | ✅ | ✅ |
| report:send | ✅ | ✅ | ✅ |
| report:view_all | ✅ | ✅ | ❌ |
| template:manage | ✅ | ❌ | ❌ |

### Enforcement

```
1. Client-side:  Role-based UI rendering (hide buttons/pages user can't use)
2. Server-side:  RLS policies enforce at database level (the real security)
3. Edge Functions: Verify role in JWT before processing

Rule: Client-side checks are for UX only. RLS is the real security gate.
```

---

## 4. Row-Level Security (RLS)

### The Golden Rule

> **כל טבלה — RLS enabled. אין חריגות. לעולם.**

### Standard Policies

```sql
-- ===========================================
-- BASE: Tenant isolation on every table
-- ===========================================

-- Pattern for every tenant-scoped table:
ALTER TABLE [table_name] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_isolation_select" ON [table_name]
    FOR SELECT USING (
        organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "tenant_isolation_insert" ON [table_name]
    FOR INSERT WITH CHECK (
        organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "tenant_isolation_update" ON [table_name]
    FOR UPDATE USING (
        organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "tenant_isolation_delete" ON [table_name]
    FOR DELETE USING (
        organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
        AND EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- ===========================================
-- SPECIAL: Global items readable by all
-- ===========================================

CREATE POLICY "global_templates_read" ON checklist_templates
    FOR SELECT USING (
        is_global = true
        OR organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "global_defects_read" ON defect_library
    FOR SELECT USING (
        is_global = true
        OR organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

-- ===========================================
-- SPECIAL: Signatures are immutable
-- ===========================================

-- No UPDATE policy on signatures — once signed, cannot change
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "signatures_insert" ON signatures
    FOR INSERT WITH CHECK (
        organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "signatures_select" ON signatures
    FOR SELECT USING (
        organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
    );

-- No UPDATE or DELETE policy = immutable signatures

-- ===========================================
-- SPECIAL: Inspector sees only assigned projects
-- ===========================================

CREATE POLICY "inspector_projects" ON delivery_reports
    FOR SELECT USING (
        organization_id = (
            SELECT organization_id FROM users
            WHERE id = auth.uid()
        )
        AND (
            -- Admin/PM see all
            EXISTS (
                SELECT 1 FROM users 
                WHERE id = auth.uid() 
                AND role IN ('admin', 'project_manager')
            )
            -- Inspector sees only own reports
            OR inspector_id = auth.uid()
        )
    );
```

### RLS Test Suite (Mandatory Before Every Deploy)

```
Test 1:  User A (Org 1) SELECT on Org 2 data     → 0 rows
Test 2:  User A INSERT with Org 2 organization_id → FAIL
Test 3:  User A UPDATE Org 2 record               → 0 rows affected
Test 4:  User A DELETE Org 2 record               → 0 rows affected
Test 5:  Anonymous user SELECT                     → 0 rows
Test 6:  Anonymous user INSERT                     → FAIL
Test 7:  Expired session any operation             → FAIL
Test 8:  Inspector SELECT other inspector's report → 0 rows
Test 9:  Inspector DELETE any record               → FAIL
Test 10: Signature UPDATE attempt                  → FAIL (no policy)
Test 11: NULL organization_id record SELECT        → 0 rows
Test 12: Global template SELECT by any user        → SUCCESS
```

---

## 5. Data Protection

### Input Validation (Defense in Depth)

```
Layer 1: Client-side  → Zod schemas (UX feedback, immediate)
Layer 2: Edge Function → Same Zod schemas (security enforcement)
Layer 3: Database      → CHECK constraints, NOT NULL, UNIQUE
Layer 4: HTML Output   → DOMPurify (sanitize before PDF generation)

Both layers share schemas from packages/shared/validation/
```

### Security Libraries — Build vs Buy

> **עיקרון: ב-Security, הכלים שבחרנו (Supabase + Expo) כבר עושים 90% מהעבודה.
> האחריות שלנו: להשתמש בהם נכון.**

#### מה Supabase כבר מספק (אין צורך בספריות נוספות):

| נושא | Supabase מטפל | מה עלינו לעשות |
|------|---------------|----------------|
| Authentication | JWT, refresh, bcrypt, session | לשמור ב-SecureStore, לא ב-AsyncStorage |
| RLS (tenant isolation) | PostgreSQL RLS engine | לכתוב policies נכונות (מפורט בסעיף 4) |
| Rate Limiting | מובנה על Edge Functions + Auth | להגדיר limits בDashboard |
| CORS | מוגדר ב-Dashboard | להגדיר allowed origins |
| SQL Injection prevention | Parameterized queries אוטומטי | להשתמש ב-Supabase client, לא בSQL ישיר |
| Storage access control | Storage policies (כמו RLS) | לכתוב policies לפי organization |
| HTTPS | אוטומטי | כלום — זה מובנה |
| Encryption at rest | DB + Storage מוצפנים | כלום — זה מובנה |
| Password hashing | bcrypt | לא נוגעים בסיסמאות |

#### מה Expo כבר מספק:

| נושא | Expo מטפל | שימוש שלנו |
|------|-----------|-----------|
| Encrypted storage | `expo-secure-store` (Keychain/Keystore) | JWT tokens, refresh tokens |
| Crypto tokens | `expo-crypto` | יצירת signed URLs לדוחות ציבוריים |

#### ספריות שמוסיפים (רק 2):

| ספרייה | מטרה | למה צריך | Build vs Buy |
|--------|------|---------|-------------|
| `zod` | ולידציית קלט | סכמות משותפות client+server, TypeScript-first | **Library** — תקן התעשייה, 0 overhead |
| `isomorphic-dompurify` | ניקוי HTML מ-XSS | הערות משתמש → HTML template → PDF. בלי ניקוי, `<script>` ירוץ ב-PDF | **Library** — חושב על 1000 מקרי קצה שאנחנו לא |

#### מה לא צריך (נדחה או מיותר):

| ספרייה | מטרה | למה לא |
|--------|------|--------|
| `react-native-ssl-pinning` | Certificate pinning | מסבך עדכוני certs, HTTPS מספיק ל-MVP |
| `helmet` / `cors` middleware | HTTP security headers | Supabase + Vercel מטפלים |
| `bcrypt` / `argon2` | Password hashing | Supabase Auth מטפל |
| `jsonwebtoken` | JWT management | Supabase Auth מטפל |
| `rate-limiter-flexible` | Rate limiting | Supabase מובנה |

### Sensitive Data Handling

| Data Type | Storage | Encryption | Access |
|-----------|---------|-----------|--------|
| JWT Tokens | SecureStore (device) | Device-level encryption | App only |
| User passwords | Supabase Auth (never stored by us) | bcrypt hashed | Never accessible |
| Tenant phone/email | PostgreSQL | RLS-protected | Same org only |
| Photos | Supabase Storage | At rest (Supabase) | Signed URLs, org-scoped |
| Signatures | Supabase Storage | At rest (Supabase) | Immutable, org-scoped |
| Offline data | WatermelonDB (SQLite on device) | Device storage encryption | App only |

### What We NEVER Store/Log

```
❌ Passwords (Supabase Auth handles)
❌ Full credit card numbers (Stripe handles, v1.1)
❌ Tokens in logs
❌ PII in error messages
❌ Photos in logs
❌ API keys in client code
```

---

## 6. API Security

### Edge Function Security

```typescript
// Standard pattern for every Edge Function:

serve(async (req: Request) => {
  // 1. CORS — whitelist known origins only
  const allowedOrigins = ['https://app.docfield.app', 'https://staging.docfield.app'];
  
  // 2. Rate limiting — per user
  // Supabase built-in rate limiting on Edge Functions
  
  // 3. Authentication — verify JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });
  
  const { data: { user }, error } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );
  if (error || !user) return new Response('Unauthorized', { status: 401 });
  
  // 4. Input validation — Zod
  const body = createSchema.parse(await req.json());
  
  // 5. Authorization — check role
  const userProfile = await getUserProfile(user.id);
  if (!hasPermission(userProfile.role, requiredPermission)) {
    return new Response('Forbidden', { status: 403 });
  }
  
  // 6. Business logic
  // ...
  
  // 7. Response — never expose internals
  return new Response(JSON.stringify({ data: result }), { status: 200 });
});
```

### Public Links (Tenant/Sub-contractor Access)

```
דוחות נשלחים לדיירים וקבלני משנה דרך לינקים.
הלינקים חייבים להיות מאובטחים:

1. Signed URL with token: /report/view?token=<random-uuid>&expires=<timestamp>
2. Token valid for 30 days (configurable)
3. Token grants READ-ONLY access to specific report only
4. No authentication required (the token IS the auth)
5. Rate limited: 100 requests/hour per token
6. Token can be revoked by admin
7. Accessed data: report PDF + defect status only
8. No access to: other reports, org data, user data
```

---

## 7. Offline Security

### Data on Device

```
WatermelonDB stores data in SQLite on the device.

Risks:
- Device lost/stolen → data exposed
- Jailbroken device → SQLite readable

Mitigations:
1. iOS: Data stored in app sandbox (protected by iOS encryption)
2. Android: App data in private storage (/data/data/com.docfield.app/)
3. Auth tokens in SecureStore (Keychain/Keystore) — NOT in SQLite
4. Session timeout: 30 min idle → require re-auth
5. Remote wipe capability (v1.1): admin can flag user, 
   next sync clears local data
6. Photos stored in app-private directory, not in camera roll
```

### Sync Security

```
All sync happens over HTTPS to Supabase.
JWT required for every sync request.
Sync endpoint validates:
1. Valid JWT
2. User belongs to organization
3. Data being pushed matches user's organization_id
4. No cross-tenant data in push payload
```

---

## 8. Secret Management

### Environment Variables

```bash
# .env.example (committed to git — no real values)

# Client-safe (VITE_ / EXPO_PUBLIC_ prefix)
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Server-only (Edge Functions — NEVER in client code)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GREEN_API_TOKEN=your_whatsapp_token
GREEN_API_INSTANCE=your_instance_id
SENTRY_DSN=your_sentry_dsn

# v1.1
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLAUDE_API_KEY=your_claude_key

# Rules:
# - EXPO_PUBLIC_ prefix = accessible in client code (safe: anon key, public URL)
# - No prefix = server-side only (Edge Functions)
# - NEVER commit .env files
# - .env MUST be in .gitignore
# - Service role key NEVER in client code
```

---

## 9. Compliance

### Israeli Privacy Protection Law (חוק הגנת הפרטיות)

| דרישה | מימוש |
|-------|-------|
| הסכמה | Consent checkbox בהרשמה (לא מסומן מראש) |
| מטרה מוגדרת | Privacy Policy מפרט מה אוספים ולמה |
| מינימום נתונים | אוספים רק מה שנדרש לתפקוד |
| זכות צפייה | משתמש יכול לראות את הנתונים שלו |
| זכות מחיקה | משתמש יכול לבקש מחיקת חשבון |
| אבטחה | RLS, encryption at rest, HTTPS |
| הודעה על דליפה | תהליך מוגדר (v1.1) |

### דרישות לפני השקה

- [ ] Privacy Policy — כתוב, מפורסם, נגיש מכל עמוד
- [ ] Terms of Service — כתוב, מפורסם
- [ ] Consent checkbox בהרשמה
- [ ] מנגנון מחיקת חשבון
- [ ] SSL על כל הדומיינים
- [ ] הצהרת נגישות

---

## 10. Pre-Deploy Security Checklist

### לפני כל deploy לפרודקשן:

- [ ] **RLS** — כל הטבלאות עם RLS enabled + tested
- [ ] **Tenant Isolation** — 12 הבדיקות (סעיף 4) עוברות
- [ ] **Secrets Scan** — אין מפתחות/טוקנים בקוד או בלוגים
- [ ] **Dependency Audit** — `npm audit` ללא critical/high
- [ ] **Auth Flow** — Login, logout, session refresh, role enforcement עובדים
- [ ] **Input Validation** — כל הקלטים מאומתים client + server
- [ ] **Error Handling** — אין מידע רגיש בהודעות שגיאה
- [ ] **CORS** — רק origins מורשים
- [ ] **HTTPS** — כל הבקשות מעל HTTPS
- [ ] **Signatures** — לא ניתנות לעריכה אחרי חתימה

---

## אישורים

| פריט | סטטוס | תאריך |
|------|--------|------|
| Security Blueprint | ⬜ ממתין לאישור חיים | — |

---

*מסמך אבטחה — DocField | Phase 3 | מרץ 2026*

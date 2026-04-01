# 🔒 SECURITY STANDARDS — inField

> **Load when:** Starting a project, building authentication, before any deploy.
> ⚠️ **Security is NON-NEGOTIABLE. No shortcuts. No "we'll fix it later."**

---

## 1. THREAT MODEL (מודל איומים)

### Users & Risk Profiles

| תפקיד               | גישה                                 | סיכון                              |
| ------------------- | ------------------------------------ | ---------------------------------- |
| **Admin**           | הכל — ניהול משתמשים, הגדרות, תבניות  | גניבת חשבון = גישה מלאה לכל הארגון |
| **Project Manager** | צפייה בכל הפרויקטים, ניהול מסירות    | גישה לנתונים רגישים של דיירים      |
| **Inspector**       | יצירת/עריכת בדיקות שהוקצו לו         | מכשיר בשטח שיכול ללכת לאיבוד       |
| **Tenant (דייר)**   | צפייה בדוח שלו בלבד (לינק)           | לינק שיכול להישלח לאדם לא נכון     |
| **Sub-contractor**  | צפייה בליקויים רלוונטיים בלבד (לינק) | לינק שיכול להישלח לאדם לא נכון     |

### Primary Threat Vectors

| איום                                           | סבירות    | השפעה     | מענה                                             |
| ---------------------------------------------- | --------- | --------- | ------------------------------------------------ |
| גישה בין-שוכרית (Tenant A רואה נתוני Tenant B) | 🔴 קריטי  | 🔴 קריטי  | RLS על כל טבלה, organization_id enforced         |
| מכשיר אבוד/נגנב עם נתונים                      | 🟠 גבוה   | 🟠 גבוה   | Auth timeout, secure storage, remote wipe        |
| לינק דוח נחשף לגורם לא מורשה                   | 🟠 גבוה   | 🟡 בינוני | Signed URLs עם תפוגה, token-based access         |
| SQL Injection                                  | 🟡 בינוני | 🔴 קריטי  | Supabase client (parameterized), Zod validation  |
| XSS בדוח PDF                                   | 🟡 בינוני | 🟡 בינוני | Sanitize all user input before HTML render       |
| Brute force על התחברות                         | 🟡 בינוני | 🟠 גבוה   | Rate limiting (Supabase built-in), lockout       |
| חשיפת מפתחות API                               | 🟡 בינוני | 🔴 קריטי  | Environment variables only, .env never committed |
| שינוי חתימה דיגיטלית לאחר חתימה                | 🟡 בינוני | 🔴 קריטי  | Immutable signatures, no UPDATE policy           |

---

## 2. AUTHENTICATION & AUTHORIZATION

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
1. User navigates to app.infield.app
2. Check for stored session (Supabase handles via httpOnly cookie)
3. If valid → Load dashboard
4. If not → Redirect to login
5. Login → Supabase Auth → session stored
6. Auto-refresh handled by Supabase client
```

### Token Storage

| Platform | Storage Method                     | Security                              |
| -------- | ---------------------------------- | ------------------------------------- |
| iOS      | Expo SecureStore (Keychain)        | Encrypted at rest, biometric optional |
| Android  | Expo SecureStore (Keystore)        | Encrypted at rest                     |
| Web      | Supabase session (httpOnly cookie) | Not accessible from JS                |

**NEVER use:**

- AsyncStorage for tokens (unencrypted)
- react-native-mmkv for tokens (fast but not designed for secrets)
- localStorage on web for tokens

### Auth Context Pattern

```typescript
// Every app must have a centralized AuthContext that exposes:
interface AuthContext {
  user: User | null;
  role: UserRole;
  businessId: string | null; // For multi-tenant apps
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

### Protected Routes

- Every authenticated route wrapped in `<ProtectedRoute>`
- Role-based access checked BOTH client-side (UX) and server-side (security)
- Unauthenticated users redirected to login — never shown partial data

---

## 3. AUTHORIZATION (RBAC)

### Role Definitions

```typescript
// packages/shared/types/auth.types.ts
type UserRole = 'admin' | 'project_manager' | 'inspector';

interface Permissions {
  // Organizations
  'org:manage': boolean; // Edit org settings, logo, templates
  'org:manage_users': boolean; // Add/remove users, change roles

  // Projects
  'project:create': boolean;
  'project:view_all': boolean; // See all projects in org
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
  'template:manage': boolean; // Create/edit checklist templates

  // Sub-contractors (v1.1)
  'subcontractor:manage': boolean;
  'subcontractor:assign': boolean;
}
```

### Role → Permission Matrix

| Permission            | Admin | Project Manager | Inspector |
| --------------------- | ----- | --------------- | --------- |
| org:manage            | ✅    | ❌              | ❌        |
| org:manage_users      | ✅    | ❌              | ❌        |
| project:create        | ✅    | ✅              | ❌        |
| project:view_all      | ✅    | ✅              | ❌        |
| project:view_assigned | ✅    | ✅              | ✅        |
| inspection:create     | ✅    | ✅              | ✅        |
| inspection:edit_own   | ✅    | ✅              | ✅        |
| inspection:edit_all   | ✅    | ✅              | ❌        |
| inspection:delete     | ✅    | ❌              | ❌        |
| report:generate       | ✅    | ✅              | ✅        |
| report:send           | ✅    | ✅              | ✅        |
| report:view_all       | ✅    | ✅              | ❌        |
| template:manage       | ✅    | ❌              | ❌        |

### Enforcement

```
1. Client-side:  Role-based UI rendering (hide buttons/pages user can't use)
2. Server-side:  RLS policies enforce at database level (the real security)
3. Edge Functions: Verify role in JWT before processing

Rule: Client-side checks are for UX only. RLS is the real security gate.
```

---

## 4. ROW-LEVEL SECURITY (RLS)

### The Golden Rule

> **כל טבלה — RLS enabled. אין חריגות. לעולם.**

### Standard RLS Policies

```sql
-- ===========================================
-- BASE: Tenant isolation on every table
-- ===========================================

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
```

### RLS Checklist (For Every Table)

- [ ] RLS is ENABLED
- [ ] SELECT policy — users see only their tenant data
- [ ] INSERT policy — validates organization_id matches user's tenant
- [ ] UPDATE policy — users can only update their own tenant data
- [ ] DELETE policy — restricted to appropriate roles
- [ ] No policy bypasses through Edge Functions without explicit reason
- [ ] Service role key NEVER used in client-side code

---

## 5. TENANT ISOLATION

### Architecture

```
┌──────────────────────────────────────┐
│  User Request                        │
├──────────────────────────────────────┤
│  1. Authenticate (Supabase Auth)     │
│  2. Extract organization_id from JWT │
│  3. RLS enforces tenant boundary     │
│  4. All queries scoped to tenant     │
└──────────────────────────────────────┘
```

### Isolation Rules

1. **Every query** is scoped by `organization_id` — enforced by RLS, not application code
2. **Storage buckets** — files organized by `organization_id/` prefix, access controlled
3. **Edge Functions** — always verify `organization_id` matches authenticated user
4. **No cross-tenant joins** — never join data across tenants
5. **Audit trail** — log any admin access to tenant data

### Project-Level Isolation (inField)

In addition to organization-level tenant isolation, inField enforces project-level access control:

| Rule                                  | Implementation                                                      |
| ------------------------------------- | ------------------------------------------------------------------- |
| Inspector sees only assigned projects | RLS on projects checks `project_members` table                      |
| Apartments scoped to project          | RLS cascades: project → building → apartment                        |
| Reports scoped to apartment           | RLS: `report.apartment_id` → building → project membership          |
| Cross-project data invisible          | Inspector A cannot see Inspector B's projects, even within same org |

```sql
-- Project-level RLS example
CREATE POLICY "project_member_select" ON projects
  FOR SELECT USING (
    id IN (
      SELECT project_id FROM project_members
      WHERE user_id = auth.uid()
    )
  );
```

### Report Immutability (inField)

| Rule                                              | RLS Implementation                             |
| ------------------------------------------------- | ---------------------------------------------- |
| Only report owner can edit                        | `inspector_id = auth.uid()`                    |
| Only draft reports modifiable                     | CHECK: `status = 'draft'` for content changes  |
| Status change from completed requires logging     | Activity log entry created automatically       |
| Report data is snapshot — no FK to mutable tables | Defects store full text copies, not references |
| Deleted library items don't affect reports        | `library_item_id` is a loose link, nullable    |

### Verification Tests (Mandatory)

```
Test 1:  User A cannot SELECT User B's data              → Must return 0 rows
Test 2:  User A cannot UPDATE User B's records            → Must fail
Test 3:  User A cannot INSERT into User B's tenant        → Must fail
Test 4:  Anonymous user cannot access any data             → Must return 0 rows
Test 5:  Deleted user's session cannot access data         → Must fail
Test 6:  NULL organization_id records are not accessible   → Must return 0 rows
Test 7:  Inspector A cannot see Inspector B's projects     → Must return 0 rows
Test 8:  Inspector cannot edit completed report            → Must fail
Test 9:  Signature cannot be updated after creation        → Must fail (no UPDATE policy)
Test 10: Tenant link token grants read-only on one report  → Must return only that report
Test 11: Expired token returns 401                         → Must fail
Test 12: Global template SELECT by any user                → SUCCESS
```

---

## 6. DATA PROTECTION

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

| נושא                     | Supabase מטפל                  | מה עלינו לעשות                         |
| ------------------------ | ------------------------------ | -------------------------------------- |
| Authentication           | JWT, refresh, bcrypt, session  | לשמור ב-SecureStore, לא ב-AsyncStorage |
| RLS (tenant isolation)   | PostgreSQL RLS engine          | לכתוב policies נכונות (מפורט בסעיף 4)  |
| Rate Limiting            | מובנה על Edge Functions + Auth | להגדיר limits בDashboard               |
| CORS                     | מוגדר ב-Dashboard              | להגדיר allowed origins                 |
| SQL Injection prevention | Parameterized queries אוטומטי  | להשתמש ב-Supabase client, לא בSQL ישיר |
| Storage access control   | Storage policies (כמו RLS)     | לכתוב policies לפי organization        |
| HTTPS                    | אוטומטי                        | כלום — זה מובנה                        |
| Encryption at rest       | DB + Storage מוצפנים           | כלום — זה מובנה                        |
| Password hashing         | bcrypt                         | לא נוגעים בסיסמאות                     |

#### מה Expo כבר מספק:

| נושא              | Expo מטפל                               | שימוש שלנו                        |
| ----------------- | --------------------------------------- | --------------------------------- |
| Encrypted storage | `expo-secure-store` (Keychain/Keystore) | JWT tokens, refresh tokens        |
| Crypto tokens     | `expo-crypto`                           | יצירת signed URLs לדוחות ציבוריים |

#### ספריות שמוסיפים (רק 2):

| ספרייה                 | מטרה             | למה צריך                                                            |
| ---------------------- | ---------------- | ------------------------------------------------------------------- |
| `zod`                  | ולידציית קלט     | סכמות משותפות client+server, TypeScript-first                       |
| `isomorphic-dompurify` | ניקוי HTML מ-XSS | הערות משתמש → HTML template → PDF. בלי ניקוי, `<script>` ירוץ ב-PDF |

#### מה לא צריך (נדחה או מיותר):

| ספרייה                       | מטרה                  | למה לא                               |
| ---------------------------- | --------------------- | ------------------------------------ |
| `react-native-ssl-pinning`   | Certificate pinning   | מסבך עדכוני certs, HTTPS מספיק ל-MVP |
| `helmet` / `cors` middleware | HTTP security headers | Supabase + Vercel מטפלים             |
| `bcrypt` / `argon2`          | Password hashing      | Supabase Auth מטפל                   |
| `jsonwebtoken`               | JWT management        | Supabase Auth מטפל                   |
| `rate-limiter-flexible`      | Rate limiting         | Supabase מובנה                       |

### Sensitive Data Handling

| Data Type          | Storage                            | Encryption                | Access                  |
| ------------------ | ---------------------------------- | ------------------------- | ----------------------- |
| JWT Tokens         | SecureStore (device)               | Device-level encryption   | App only                |
| User passwords     | Supabase Auth (never stored by us) | bcrypt hashed             | Never accessible        |
| Tenant phone/email | PostgreSQL                         | RLS-protected             | Same org only           |
| Photos             | Supabase Storage                   | At rest (Supabase)        | Signed URLs, org-scoped |
| Signatures         | Supabase Storage                   | At rest (Supabase)        | Immutable, org-scoped   |
| Offline data       | WatermelonDB (SQLite on device)    | Device storage encryption | App only                |

### What We NEVER Store/Log

```
❌ Passwords (Supabase Auth handles)
❌ Full credit card numbers (Stripe handles, v1.1)
❌ Tokens in logs
❌ PII in error messages
❌ Photos in logs
❌ API keys in client code
```

### Prevention Checklist

| Threat                 | Prevention                                                                     |
| ---------------------- | ------------------------------------------------------------------------------ |
| SQL Injection          | Parameterized queries only (Supabase client handles this)                      |
| XSS                    | No `dangerouslySetInnerHTML`, sanitize all rendered content, DOMPurify for PDF |
| CSRF                   | Supabase handles via JWT tokens                                                |
| CORS                   | Whitelist known origins only. No wildcard (`*`) in production                  |
| Secrets exposure       | `.env` only, never commit. `.env.example` with placeholder values              |
| Sensitive data in logs | Never log passwords, tokens, PII, or payment info                              |
| Insecure dependencies  | Run `npm audit` before every deploy                                            |

---

## 7. API SECURITY

### Edge Function Security Pattern

```typescript
// Standard pattern for every Edge Function:

serve(async (req: Request) => {
  // 1. CORS — whitelist known origins only
  const allowedOrigins = [
    'https://app.infield.app',
    'https://staging.infield.app',
  ];

  // 2. Rate limiting — per user (Supabase built-in)

  // 3. Authentication — verify JWT
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return new Response('Unauthorized', { status: 401 });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
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

| Requirement          | Standard                                             |
| -------------------- | ---------------------------------------------------- |
| Rate limiting        | All public endpoints rate-limited                    |
| Request validation   | Zod schema validation on every endpoint              |
| Error responses      | Generic messages to client, detailed logs internally |
| HTTPS                | All environments, no HTTP fallback                   |
| API keys             | Rotate regularly, never in client-side code          |
| Supabase anon key    | Client-side only, protected by RLS                   |
| Supabase service key | Server-side only (Edge Functions), NEVER in browser  |

---

## 8. OFFLINE SECURITY

### Data on Device

```
WatermelonDB stores data in SQLite on the device.

Risks:
- Device lost/stolen → data exposed
- Jailbroken device → SQLite readable

Mitigations:
1. iOS: Data stored in app sandbox (protected by iOS encryption)
2. Android: App data in private storage (/data/data/com.infield.app/)
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

## 9. SECRET MANAGEMENT

### Environment Variables

```bash
# .env.example (committed to git — no real values)

# Client-safe (EXPO_PUBLIC_ prefix)
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
# - VITE_ prefix = accessible in web client code
# - No prefix = server-side only (Edge Functions)
# - NEVER commit .env files
# - .env MUST be in .gitignore
# - Service role key NEVER in client code
```

### Key Rotation Schedule

| Secret               | Rotation Frequency                |
| -------------------- | --------------------------------- |
| Supabase service key | When compromised                  |
| Stripe API keys      | Every 90 days or when compromised |
| Webhook secrets      | Every 90 days                     |
| OAuth client secrets | Annually or when compromised      |

---

## 10. COMPLIANCE

### Israeli Privacy Protection Law (חוק הגנת הפרטיות)

| דרישה          | מימוש                                   |
| -------------- | --------------------------------------- |
| הסכמה          | Consent checkbox בהרשמה (לא מסומן מראש) |
| מטרה מוגדרת    | Privacy Policy מפרט מה אוספים ולמה      |
| מינימום נתונים | אוספים רק מה שנדרש לתפקוד               |
| זכות צפייה     | משתמש יכול לראות את הנתונים שלו         |
| זכות מחיקה     | משתמש יכול לבקש מחיקת חשבון             |
| אבטחה          | RLS, encryption at rest, HTTPS          |
| הודעה על דליפה | תהליך מוגדר (v1.1)                      |

### דרישות לפני השקה

- [ ] Privacy Policy — כתוב, מפורסם, נגיש מכל עמוד
- [ ] Terms of Service — כתוב, מפורסם
- [ ] Consent checkbox בהרשמה
- [ ] מנגנון מחיקת חשבון
- [ ] SSL על כל הדומיינים
- [ ] הצהרת נגישות

---

## 11. PRE-DEPLOY SECURITY AUDIT

### Mandatory Checklist

Run this **before every production deployment**:

- [ ] **OWASP Top 10** — Reviewed against all 10 categories
- [ ] **RLS Verification** — Every table has RLS enabled and tested
- [ ] **Tenant Isolation** — All 12 verification tests pass (see §5)
- [ ] **Secret Scan** — No keys, tokens, or passwords in code or logs
- [ ] **Dependency Audit** — `npm audit` shows 0 critical/high vulnerabilities
- [ ] **Auth Flow Test** — Login, logout, session refresh, role enforcement all work
- [ ] **Input Validation** — All user inputs validated on client AND server
- [ ] **Error Handling** — No sensitive info leaked in error responses
- [ ] **CORS Check** — Only whitelisted origins allowed
- [ ] **HTTPS Verified** — No mixed content, all requests over HTTPS
- [ ] **Signatures** — Cannot be updated or deleted after creation

---

_Security Standards — inField | Merged from SECURITY_STANDARDS v7 + SECURITY_DOCFIELD | March 2026_

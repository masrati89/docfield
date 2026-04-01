# 📋 STANDARDS REFERENCE — inField

> **Load when:** Code review, pre-deploy, quality checks, specific technical questions.
> Each section is numbered for direct reference (e.g., "see §3.2 RTL Testing Checklist").

---

## §1. CODE QUALITY

### §1.1 Code Review Checklist

**🔴 Critical (blocks merge)**

- [ ] No `console.log` in production code
- [ ] All async operations have try/catch
- [ ] No hardcoded secrets or API keys
- [ ] RLS policies exist for new/modified tables
- [ ] TypeScript — no `any` type
- [ ] Input validation on client AND server (Zod)

**🟠 High**

- [ ] Components under 200 lines
- [ ] No prop drilling beyond 2 levels
- [ ] Loading + error states for all async operations
- [ ] Error messages in Hebrew
- [ ] No TODO/FIXME without follow-up plan

**🟡 Medium**

- [ ] Meaningful names (no abbreviations)
- [ ] DRY — no duplicated logic
- [ ] Clean import order (framework → libs → internal → components → types)
- [ ] Prettier/ESLint passing

### §1.2 Error Handling Layers

```
Layer 1: Component — try/catch in handlers, inline error messages
Layer 2: Error Boundary — catches React crashes, shows fallback UI
Layer 3: Global Handler — logs to Sentry, shows generic error page
```

**Rules:**

- Error messages: Hebrew, user-friendly, with retry button
- Never show stack traces, SQL errors, or internals to user
- Every component handles 3 states: loading, error, empty
- Custom errors: `AppError`, `NotFoundError`, `UnauthorizedError`, `ConflictError`

### §1.3 Logging

| Level   | When                                                     |
| ------- | -------------------------------------------------------- |
| `error` | Something broke (DB down, unhandled exception)           |
| `warn`  | Concerning but working (rate limit near, deprecated API) |
| `info`  | Business events (user signup, payment, deploy)           |
| `debug` | Dev troubleshooting (inputs/outputs, timings)            |

**Never log:** passwords, tokens, PII, card numbers, photos.

---

## §2. PERFORMANCE

### §2.1 Targets

| Metric           | Target  |
| ---------------- | ------- |
| FCP              | < 1.5s  |
| LCP              | < 2.5s  |
| TTI              | < 3.0s  |
| CLS              | < 0.1   |
| Bundle (gzipped) | < 300KB |
| API response     | < 200ms |
| DB query         | < 100ms |
| Lighthouse       | > 90    |

### §2.2 Optimization Checklist

- [ ] Images: WebP, lazy loading, proper sizing
- [ ] Code splitting: `React.lazy` for routes
- [ ] No unnecessary re-renders (React DevTools Profiler)
- [ ] DB queries have indexes
- [ ] Lists use pagination (never unbounded SELECT)
- [ ] Heavy computation in Edge Functions, not client
- [ ] Static assets cached
- [ ] No memory leaks (useEffect cleanup)

### §2.3 Caching Rules

| Data Type                      | Stale Time | Strategy                      |
| ------------------------------ | ---------- | ----------------------------- |
| User profile                   | 10 min     | Cache, refresh on edit        |
| Settings                       | 10 min     | Cache, invalidate on change   |
| Lists (reports, defects)       | 1 min      | Short cache, frequent refresh |
| Catalogs (services, templates) | 30 min     | Longer cache                  |
| Static content                 | 1 hour     | Long cache                    |
| Real-time data                 | 0          | No cache, use Realtime        |

### §2.4 Scale Triggers

| Users  | Focus                                                      |
| ------ | ---------------------------------------------------------- |
| 1–100  | Get it working. Basic indexing, pagination, code splitting |
| 100–1K | Caching, image optimization, query optimization            |
| 1K–10K | CDN, connection pooling, monitoring                        |
| 10K+   | Read replicas, Redis, queue systems                        |

---

## §3. RTL & INTERNATIONALIZATION

### §3.1 Core Rules

- Root element: `<html dir="rtl" lang="he">`
- Use logical CSS properties: `ms/me/ps/pe`, NOT `ml/mr/pl/pr`
- Directional icons (arrows, chevrons): add `rtl:rotate-180`
- Non-directional icons (search, settings): don't flip
- Phone numbers, emails: force `dir="ltr"` on input
- Mixed Hebrew+English: use `dir="auto"` on container
- Font stack: Rubik (Hebrew), Inter (English/numbers)

### §3.2 i18n Rules

- All UI text in translation files (`packages/shared/src/i18n/`)
- Keys: English, dot-notation (`auth.loginError`)
- Values: natural Hebrew
- Placeholders: `"welcome": "שלום, {{name}}"`
- Numbers: `1,000.50 ₪`

### §3.3 RTL Testing Checklist

- [ ] `dir="rtl"` on html
- [ ] Navigation on the right
- [ ] Text aligned right
- [ ] Directional icons flipped
- [ ] Numbers display correctly in Hebrew text
- [ ] Phone/email inputs in LTR
- [ ] Forms: labels right, inputs correct
- [ ] No horizontal overflow
- [ ] Modals/dropdowns open correctly
- [ ] Tables: first column on right

---

## §4. ACCESSIBILITY (WCAG AA)

### §4.1 Checklist

- [ ] Tab through page — all interactive elements reachable
- [ ] Visible focus indicator (`outline: 2px solid #1B7A44; outline-offset: 2px`)
- [ ] All images have alt text (decorative = `alt=""`)
- [ ] All form inputs have labels (not just placeholder)
- [ ] Errors connected to inputs (`aria-describedby`)
- [ ] Color contrast 4.5:1 for text, 3:1 for UI/icons
- [ ] No info by color alone — add icons + text
- [ ] Heading hierarchy: h1 → h2 → h3 (no skipping)
- [ ] Modals trap focus, close with Escape
- [ ] Touch targets minimum 36px
- [ ] Lighthouse Accessibility > 90

### §4.2 ARIA Rules

- Native HTML first (`<button>` not `<div role="button">`)
- Loading: `aria-busy="true" aria-live="polite"`
- Toasts: `role="status" aria-live="polite"`
- Modals: `role="dialog" aria-modal="true" aria-labelledby="..."`

---

## §5. INTEGRATIONS

### §5.1 Architecture

```
Component (UI) → Service Layer (logic + retry) → External API
```

Never call APIs directly from components.

### §5.2 Standard Pattern

- Singleton service class per integration
- Input validation (Zod) before API call
- Retry with exponential backoff (2s, 4s, 8s)
- Retry on: network errors, 429, 5xx. Don't retry on: 400, 401, 404
- Log success and failure with context
- Return `{ data, error }` — never throw to component

### §5.3 Degradation Rules

| Service Down  | User Experience                                          |
| ------------- | -------------------------------------------------------- |
| Stripe        | "temporarily unavailable", allow booking without payment |
| SMS/WhatsApp  | Queue for later, notify admin                            |
| Email         | Queue for retry, no user-facing error                    |
| Storage       | Placeholder, disable upload with message                 |
| Auth provider | Maintenance page                                         |

### §5.4 Webhook Rules

1. Always verify signatures
2. Idempotency — handle duplicate deliveries
3. Return 200 fast, process async if heavy
4. Log event ID, type, timestamp, result
5. Return 5xx to trigger retry on failure

### §5.5 API Keys

| Key Type                                | Where                                    |
| --------------------------------------- | ---------------------------------------- |
| Publishable (Stripe, Supabase anon)     | Client (`VITE_` / `EXPO_PUBLIC_` prefix) |
| Secret (Stripe, service role, WhatsApp) | Edge Functions only — NEVER in browser   |

---

## §6. LEGAL & COMPLIANCE

### §6.1 Israeli Privacy Law (חוק הגנת הפרטיות)

| דרישה   | מימוש                                   |
| ------- | --------------------------------------- |
| הסכמה   | Consent checkbox בהרשמה (לא מסומן מראש) |
| מטרה    | Privacy Policy מפרט מה ולמה             |
| מינימום | אוספים רק מה שנדרש                      |
| צפייה   | משתמש רואה את הנתונים שלו               |
| מחיקה   | משתמש יכול לבקש מחיקה                   |
| אבטחה   | RLS, encryption at rest, HTTPS          |

### §6.2 Data Retention

| Data         | Retention          | After       |
| ------------ | ------------------ | ----------- |
| Active user  | While active       | —           |
| Deleted user | 30 days            | Hard delete |
| Payments     | 7 years (tax)      | Archive     |
| Access logs  | 90 days            | Auto-delete |
| Analytics    | 2 years anonymized | Aggregate   |

### §6.3 Payment Compliance (PCI via Stripe)

- Use Stripe Elements — never handle raw card data
- No card numbers in logs or DB
- Verify signatures on webhooks
- Show prices in ₪ including VAT
- Generate invoice for every payment

### §6.4 Launch Checklist

- [ ] Privacy Policy published
- [ ] Terms of Service published
- [ ] Consent checkbox on signup
- [ ] Account deletion mechanism
- [ ] Data export mechanism
- [ ] Contact info published
- [ ] SSL on all domains
- [ ] Accessibility statement

---

## §7. DEVOPS & DEPLOYMENT

### §7.1 Environments

| Env        | URL                 | DB                  |
| ---------- | ------------------- | ------------------- |
| Dev        | localhost           | Supabase local      |
| Staging    | staging.infield.app | Separate Supabase   |
| Production | infield.app         | Production Supabase |

**Rules:** Never test on production. Separate Supabase per env. Test migrations on staging first.

### §7.2 Deployment Flow

```
feature branch → PR to develop → auto-deploy staging → QA → PR to main → production
```

### §7.3 CI/CD — PR Checks

- Lint (ESLint), Format (Prettier), TypeScript (no errors), Tests (Vitest), Build, Bundle size, npm audit

### §7.4 Pre-Deploy Checklist

**Security**

- [ ] RLS tests passing
- [ ] Tenant isolation verified
- [ ] `npm audit` clean

**Quality**

- [ ] Lighthouse > 90
- [ ] Critical user flows tested
- [ ] Hebrew/RTL correct
- [ ] Mobile responsive

**Infrastructure**

- [ ] Env variables set
- [ ] Migrations applied
- [ ] Git tag created

### §7.5 Monitoring

| Tool               | Purpose                      |
| ------------------ | ---------------------------- |
| Sentry             | Runtime errors, stack traces |
| Supabase Dashboard | DB errors, auth issues       |
| Vercel Analytics   | Performance, Web Vitals      |

**Alert on:** error rate > 1%, response > 5s, health check fail, 5xx spike, auth down.

### §7.6 Backup

- Supabase automatic: daily, 7-30 days retention
- Manual export before major migrations
- Rollback: Vercel instant rollback + Supabase PITR
- Rule: rollback FIRST, debug SECOND

---

## §8. DOCUMENTATION

### §8.1 README Must Include

Project name, overview, tech stack, prerequisites, getting started, folder structure, env variables, scripts, DB overview, deployment, changelog link.

### §8.2 API Documentation Per Endpoint

Method, path, description, auth required, request body (fields/types/required), success response, error responses (status/code/description), rate limit.

### §8.3 Changelog Format (Keep a Changelog)

Categories: Added, Changed, Deprecated, Removed, Fixed, Security. Most recent first. Semantic versioning: MAJOR.MINOR.PATCH.

### §8.4 Code Comments

- Explain WHY, not WHAT
- JSDoc for public functions
- Warn about gotchas (`// WARNING: RLS bypassed here...`)
- No `// Set x to 5` obvious comments

---

## §9. COST MANAGEMENT

### §9.1 Infrastructure Reference

| Service  | Free                     | Pro                            |
| -------- | ------------------------ | ------------------------------ |
| Supabase | 500MB DB, 1GB storage    | $25/mo — 8GB DB, 100GB storage |
| Vercel   | 100 builds/day, 100GB BW | $20/mo — 1000 builds, 1TB      |
| Stripe   | No monthly fee           | 2.9% + ₪1.20 per transaction   |
| Sentry   | 5K errors/mo             | $26/mo for 50K                 |

### §9.2 Cost Per User

| Scale  | Monthly Infra | Per User   |
| ------ | ------------- | ---------- |
| 1-50   | $25-50        | $0.50-1.00 |
| 50-500 | $50-100       | $0.10-0.20 |
| 500-5K | $100-700      | $0.02-0.14 |

### §9.3 Optimization

- DB: indexes, pagination, archive old data, compress images
- Frontend: WebP, bundle splitting, lazy loading, cache headers
- API: cache responses, batch operations, debounce, conditional fetching

### §9.4 Alert Rule

> Set alerts at 70% of every tier limit. Review costs monthly.

---

_Standards Reference — inField | Consolidated from 10 source documents | March 2026_
_Reference by section number: §1 Code Quality, §2 Performance, §3 RTL, §4 Accessibility, §5 Integrations, §6 Legal, §7 DevOps, §8 Documentation, §9 Cost_

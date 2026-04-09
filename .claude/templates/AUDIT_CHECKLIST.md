# Project Audit Checklist

Complete checklist for project-architect Phase 1 gap analysis.

## Claude Code Infrastructure

- [ ] `.claude/CLAUDE.md` — project context
- [ ] `.claude/settings.json` — permissions
- [ ] `.claude/settings.local.json` in `.gitignore`
- [ ] `.claude/agents/code-reviewer.md`
- [ ] `.claude/agents/security-auditor.md`
- [ ] `.claude/agents/db-migrator.md` (if DB project)
- [ ] `.claude/agents/rtl-checker.md` (if Hebrew UI)
- [ ] `.claude/agents/test-writer.md`
- [ ] `.claude/commands/plan.md`
- [ ] `.claude/commands/ship.md`
- [ ] `.claude/commands/feature.md`
- [ ] `.claude/commands/debug.md`
- [ ] `.claude/commands/audit.md`
- [ ] `.claude/commands/review.md`
- [ ] `.claude/hooks/` configured

## Documentation

- [ ] `README.md` with setup instructions
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/ADR/` directory
- [ ] `docs/PROJECT_MAP.md`
- [ ] `docs/CONVENTIONS.md`
- [ ] `docs/GOTCHAS.md`
- [ ] `docs/DATABASE.md` (if DB)
- [ ] `docs/API.md` (if API)
- [ ] `docs/SECURITY.md`
- [ ] `CONTRIBUTING.md`
- [ ] `CHANGELOG.md`

## Config Files

- [ ] `.nvmrc` or `.node-version`
- [ ] `.gitignore` comprehensive
- [ ] `.gitattributes`
- [ ] `.editorconfig`
- [ ] `.env.example` complete
- [ ] `tsconfig.json` strict mode
- [ ] `package.json` scripts (dev, build, lint, test, typecheck)

## Quality Tooling

- [ ] ESLint configured
- [ ] Prettier configured
- [ ] Husky / lefthook pre-commit hooks
- [ ] lint-staged
- [ ] commitlint

## Testing

- [ ] Test framework setup (Vitest/Jest)
- [ ] E2E framework (Playwright)
- [ ] Test coverage reporting
- [ ] Example tests exist
- [ ] CI runs tests

## CI/CD

- [ ] `.github/workflows/` directory
- [ ] CI runs on PR
- [ ] Lint in CI
- [ ] Typecheck in CI
- [ ] Tests in CI
- [ ] Build in CI
- [ ] Branch protection on main
- [ ] `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] `.github/dependabot.yml`

## Security

- [ ] No secrets in git history
- [ ] `.env*` files in `.gitignore`
- [ ] Dependency audit clean
- [ ] RLS on all DB tables (if Supabase)
- [ ] Rate limiting on public endpoints
- [ ] Input validation
- [ ] Security headers configured
- [ ] HTTPS enforced

## Observability

- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog/Plausible)
- [ ] Structured logging
- [ ] Uptime monitoring

## Database (if applicable)

- [ ] Migration system in place
- [ ] Types auto-generated from schema
- [ ] Seed data for development
- [ ] Backup strategy documented
- [ ] Restore procedure tested

## Israeli SaaS Specifics (Haim's projects)

- [ ] Hebrew/RTL tested
- [ ] Hebrew-capable font loaded
- [ ] i18n structure in place
- [ ] Green API wrapper (if WhatsApp)
- [ ] Stripe webhook verification
- [ ] Morning/Meshulam integration secured
- [ ] Multi-tenant `business_id` filters verified

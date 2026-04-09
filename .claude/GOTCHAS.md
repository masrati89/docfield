# GOTCHAS — Non-obvious landmines

Things that burned us once. Read before touching related areas.

---

## Supabase: new `sb_secret_` / `sb_publishable_` key format

**Date discovered:** 2026-04-09

Supabase deprecated the legacy JWT-based keys (`anon_key`, `service_role_key`)
in favor of a new opaque key format:

- `sb_publishable_…` — replaces `anon_key` (safe for clients)
- `sb_secret_…` — replaces `service_role_key` (server-only, bypasses RLS)

**Landmines:**

1. `npx supabase status` output shows **both** formats side-by-side. Grab the
   new format — the legacy JWT still appears for backward-compat but will
   eventually be removed.
2. Any local tooling that hardcodes `SUPABASE_SERVICE_ROLE_KEY` as a variable
   name or validates a JWT prefix (`eyJ…`) will silently fail to auth.
3. `scripts/seed.mjs` enforces `SUPABASE_SECRET_KEY.startsWith('sb_secret_')`
   as a guard — do not "fix" this by loosening the check; it's the only
   protection against accidentally pointing the seed at prod with a legacy key.
4. Remote/prod `.env.remote` only needs the **publishable** key. If you ever
   put an `sb_secret_…` value into a file that gets shipped to a client
   (mobile bundle, web bundle), that's a critical incident — rotate immediately.

**How to apply:** Use `sb_secret_…` only in server scripts and local dev. Never
put it in `apps/mobile` or `apps/web` env files. Client bundles get
`sb_publishable_…` only.

---

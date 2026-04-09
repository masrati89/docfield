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

## Defect library: intentional `standard` = `standard_reference` duplication

**Date discovered:** 2026-04-10
**Introduced by:** migration `031_seed_global_defect_library.sql`

`defect_library` has **two columns holding the same reference to an Israeli
standard** (e.g. `ת"י 1415`):

- `standard_reference` — original from migration 008, **currently read/written
  by `apps/mobile/hooks/useDefectLibrary.ts`**
- `standard` — added by migration 030 for a planned "rich library" feature,
  not yet wired up

Migration 031 deliberately writes the **same value to both columns** for all
338 system defects. This is a known, documented duplication — not a bug.

**Why the duplication exists:** when 031 was authored we considered writing
only to `standard` (the newer column) and updating the hook. We rejected that
because (a) Iron Rule — don't refactor beyond the requested scope, (b) one
month before production deploy is the wrong time to refactor a reader path,
(c) the duplication costs ~27KB and zero risk. Full decision trail is in the
agent conversation from 2026-04-10 (C1 discussion).

**When you build the rich defect library feature (title/recommendation/cost
editing UI), you must clean this up:**

1. Update `apps/mobile/hooks/useDefectLibrary.ts` to read from `standard`
   first, fall back to `standard_reference` (COALESCE-style), and write only
   to `standard` on create/update.
2. Verify no other consumer still reads `standard_reference` (grep the repo).
3. Run the one-liner cleanup in a new migration:
   ```sql
   -- Migration 0XX_drop_standard_reference_duplication
   UPDATE defect_library SET standard_reference = NULL WHERE source = 'system';
   ```
4. Optionally, a later migration can `ALTER TABLE defect_library DROP COLUMN
standard_reference` once you're confident no user-created rows rely on it.

**Do NOT touch this without doing all four steps in order.** Dropping one side
without updating the hook will silently blank out every `standardRef` shown in
the "Add defect" screen for 338 pre-seeded items.

---

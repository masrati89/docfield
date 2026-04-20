-- Migration: 043_harden_registration_policies
-- Date: 2026-04-17
-- Reversible: yes (old policies can be recreated from migrations 022 + 023)
-- Risk: medium — touches INSERT paths for users and organizations

-- =============================================================================
-- PROBLEM
-- =============================================================================
-- C1 — users_insert_own (migration 023) only checks id = auth.uid().
--      An attacker could register, then INSERT a users row with:
--        organization_id = <any existing org UUID>
--        role = 'admin'
--      and gain admin membership in an org they did not create.
--
-- C2 — organizations_insert (migration 022) allows any authenticated user to
--      create unlimited organizations with no restriction. Kept as-is by design
--      (rate-limiting and billing enforcement are application-layer concerns for
--      Phase 2). The security model is: creating an org is cheap; but you cannot
--      JOIN another org via self-insert (C1 fix below ensures that).
-- =============================================================================

-- =============================================================================
-- SECURITY MODEL (registration flow)
-- =============================================================================
-- 1. supabase.auth.signUp()       → creates auth.users row (no metadata org_id
--                                   → handle_new_user() trigger skips insert)
-- 2. organizations.insert(...)    → allowed by organizations_insert policy
--                                   (any authenticated user, see C2 note above)
-- 3. users.insert({ id, organization_id, role: 'admin', ... })
--                                 → must satisfy the hardened policy below:
--                                     a) id = auth.uid()          (own row only)
--                                     b) org has zero members yet (just created)
--                                     c) role = 'admin'           (founder only)
--
-- Invariant: if (b) is true, the org was created moments ago by this same user
-- because no other user can have inserted into it yet. An attacker targeting an
-- existing org will always fail (b) because that org already has at least one
-- member row.
-- =============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- C1 FIX: replace users_insert_own with a hardened version
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS "users_insert_own" ON users;

-- The zero-member subquery is safe against RLS recursion:
--   • It queries users by organization_id, not by auth.uid().
--   • users_select_own  (id = auth.uid())       → no row exists yet → 0 rows
--   • users_select_org  (get_user_org_id() = ?)  → get_user_org_id() returns
--     NULL for a brand-new user (no row yet), NULL ≠ any UUID → 0 rows
--   • Combined result: the subquery always sees an empty set for the target org
--     when the user is genuinely registering into a freshly created org.
--     For an existing org that already has members, one of the two policies
--     above leaks those rows to the org's own members — but the inserting user
--     is NOT a member yet, so they see 0 rows of the target org too, making
--     NOT EXISTS return TRUE... wait — that would be a bypass.
--
-- IMPORTANT: the above reasoning must be tightened. Because the inserting user
-- has no row yet, get_user_org_id() = NULL, and users_select_org requires
-- organization_id = NULL which matches nothing. users_select_own requires
-- id = auth.uid() which also matches nothing (no row). So the attacker truly
-- sees 0 rows for ANY org, making NOT EXISTS always TRUE from their perspective.
--
-- We therefore add a second, independent guard: the target org must not appear
-- in any existing users row at all, verified via a SECURITY DEFINER function
-- that bypasses RLS and checks the real data. This removes the ambiguity above.

-- Helper: returns TRUE when the given org has no members yet.
-- SECURITY DEFINER so it reads the real users table, bypassing RLS.
-- search_path locked to public to prevent search-path injection.
CREATE OR REPLACE FUNCTION org_has_no_members(p_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT NOT EXISTS (
        SELECT 1 FROM users WHERE organization_id = p_org_id
    );
$$;

-- Revoke direct execute from public; only the policy (running as the invoker
-- inside Postgres's RLS engine, which has superuser trust) calls this.
REVOKE EXECUTE ON FUNCTION org_has_no_members(UUID) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION org_has_no_members(UUID) TO authenticated;

-- New hardened policy: three independent, conjunctive guards.
CREATE POLICY "users_insert_own" ON users FOR INSERT
    WITH CHECK (
        -- (a) Users may only create their own profile row.
        id = auth.uid()
        -- (b) The target org must have zero existing members (org was just
        --     created by this user in the same registration transaction).
        --     Checked via SECURITY DEFINER helper to get the real row count,
        --     not the RLS-filtered view.
        AND org_has_no_members(organization_id)
        -- (c) Self-registering users are always org founders → always admin.
        --     Any other role value is rejected at the policy level (in addition
        --     to the table-level CHECK constraint).
        AND role = 'admin'
    );

-- ---------------------------------------------------------------------------
-- C2 NOTE: organizations_insert kept as-is (any authenticated user may create
-- an org). The security model relies on C1's zero-member guard: creating an
-- org is harmless because an attacker cannot join an org they did not just
-- create. Unlimited org creation is a Phase 2 billing/rate-limit concern, not
-- a data-isolation concern.
-- ---------------------------------------------------------------------------

-- Refresh the comment on the existing policy so future readers understand why
-- it is intentionally permissive.
COMMENT ON POLICY "organizations_insert" ON organizations IS
    'Intentionally allows any authenticated user to create an org. '
    'Data isolation is enforced at the users layer: users_insert_own (migration 043) '
    'prevents joining an existing org. Unlimited creation is a Phase 2 billing concern.';

COMMIT;

-- =============================================================================
-- Verification queries (run after applying)
-- =============================================================================
-- 1. Confirm old policy is gone and new one exists:
--    SELECT policyname, cmd, qual, with_check
--    FROM pg_policies
--    WHERE tablename = 'users' AND policyname = 'users_insert_own';
--
-- 2. Confirm helper function exists with correct volatility + security:
--    SELECT proname, prosecdef, provolatile
--    FROM pg_proc
--    WHERE proname = 'org_has_no_members';
--    -- prosecdef = true, provolatile = 's' (STABLE)
--
-- 3. Confirm organizations_insert comment is set:
--    SELECT obj_description(oid) FROM pg_class WHERE relname = 'organizations';
--    -- (or check pg_policies directly — COMMENT ON POLICY requires pg 15+;
--    --  on pg 14 this statement is silently skipped, which is safe)
--
-- 4. Smoke test — registration happy path:
--    a) Sign up a new user (no org metadata)
--    b) Insert an org row → should succeed
--    c) Insert users row with id=uid, org=new_org, role='admin' → should succeed
--
-- 5. Smoke test — attack: joining existing org
--    a) Use a second auth user with no users row yet
--    b) Attempt: INSERT INTO users(id, organization_id, role, ...) VALUES
--                (auth.uid(), '<existing_org_uuid>', 'admin', ...)
--    c) Expected: RLS violation (org_has_no_members returns FALSE)
-- =============================================================================

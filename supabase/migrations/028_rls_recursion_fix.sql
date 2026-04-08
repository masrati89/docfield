-- Migration: 028_rls_recursion_fix
-- Description: Fix infinite recursion in users RLS policies.
--   The original users_select policy (from 002) does SELECT FROM users inside
--   its own USING clause, causing infinite recursion for all authenticated queries.
--   Fix: SECURITY DEFINER helper function + split select policy.
--   This migration is idempotent — safe to run on DBs where the fix was applied manually.
-- Dependencies: 002_create_users

-- ===========================================
-- 1. Helper function: get_user_org_id()
--    SECURITY DEFINER bypasses RLS, breaking the recursion cycle.
-- ===========================================
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT organization_id FROM users WHERE id = auth.uid();
$$;

-- ===========================================
-- 2. Fix users SELECT policies
--    Replace self-referential users_select with two safe policies:
--    - users_select_own: user can always read their own row
--    - users_select_org: user can read all org members via helper function
-- ===========================================
DROP POLICY IF EXISTS "users_select" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_select_org" ON users;

CREATE POLICY "users_select_own" ON users FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "users_select_org" ON users FOR SELECT
    USING (organization_id = get_user_org_id());

-- ===========================================
-- 3. Fix users INSERT policy (use helper function)
-- ===========================================
DROP POLICY IF EXISTS "users_insert" ON users;

CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

-- ===========================================
-- 4. Fix users UPDATE policy (use helper function)
-- ===========================================
DROP POLICY IF EXISTS "users_update" ON users;

CREATE POLICY "users_update" ON users FOR UPDATE USING (
    id = auth.uid()
    OR (
        organization_id = get_user_org_id()
        AND EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    )
);

-- ===========================================
-- 5. Fix users DELETE policy (use helper function)
-- ===========================================
DROP POLICY IF EXISTS "users_delete" ON users;

CREATE POLICY "users_delete" ON users FOR DELETE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

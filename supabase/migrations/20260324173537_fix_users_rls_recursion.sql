-- Migration: fix_users_rls_recursion
-- Description: Fix infinite recursion in users table RLS policies
-- Problem: users_select policy queries the users table itself, causing infinite recursion
-- Solution: Create a SECURITY DEFINER function that bypasses RLS to get organization_id

-- ===========================================
-- HELPER FUNCTION: get current user's organization_id
-- SECURITY DEFINER = runs with the privileges of the function creator (bypasses RLS)
-- ===========================================
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
    SELECT organization_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ===========================================
-- DROP old policies that cause recursion
-- ===========================================
DROP POLICY IF EXISTS "users_select" ON users;
DROP POLICY IF EXISTS "users_insert" ON users;
DROP POLICY IF EXISTS "users_update" ON users;
DROP POLICY IF EXISTS "users_delete" ON users;

-- ===========================================
-- RECREATE policies using the helper function
-- ===========================================

-- SELECT: users see all users in their organization
CREATE POLICY "users_select" ON users FOR SELECT USING (
    organization_id = get_user_organization_id()
);

-- INSERT: admin only
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (
    organization_id = get_user_organization_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

-- UPDATE: admin can update any user in org, users can update themselves
CREATE POLICY "users_update" ON users FOR UPDATE USING (
    organization_id = get_user_organization_id()
    AND (
        EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
        OR id = auth.uid()
    )
);

-- DELETE: admin only
CREATE POLICY "users_delete" ON users FOR DELETE USING (
    organization_id = get_user_organization_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

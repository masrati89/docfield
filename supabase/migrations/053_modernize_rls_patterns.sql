-- Migration: 053 - Modernize RLS patterns
-- Description: Update all organization and user policies to use get_user_org_id() helper.
--   This migration replaces inline subqueries with the cleaner, more efficient helper function
--   that was introduced in migration 028.
-- Dependencies: 028_rls_recursion_fix.sql (get_user_org_id function)

-- ============================================
-- Organizations: Update SELECT policy
-- ============================================
DROP POLICY IF EXISTS "organizations_select" ON organizations;

CREATE POLICY "organizations_select" ON organizations FOR SELECT
  USING (id = get_user_org_id());

-- ============================================
-- Organizations: Update UPDATE policy
-- ============================================
DROP POLICY IF EXISTS "organizations_update" ON organizations;

CREATE POLICY "organizations_update" ON organizations FOR UPDATE
  USING (
    id = get_user_org_id()
    AND EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Comments for clarity
COMMENT ON POLICY "organizations_select" ON organizations IS 'User can read their own organization.';
COMMENT ON POLICY "organizations_update" ON organizations IS 'Only org admins can update their organization.';

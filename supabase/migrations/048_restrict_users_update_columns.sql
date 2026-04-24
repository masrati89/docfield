-- Migration 048: Restrict users UPDATE policy to prevent privilege escalation
--
-- Previously, any authenticated user could UPDATE any column on their own row,
-- including `role` and `organization_id`. This migration adds a WITH CHECK clause
-- that ensures those sensitive columns cannot be self-modified.

DROP POLICY IF EXISTS "users_update" ON users;

CREATE POLICY "users_update" ON users FOR UPDATE
  USING (
    id = auth.uid()
    OR (
      organization_id = get_user_org_id()
      AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
      )
    )
  )
  WITH CHECK (
    -- Self-update: role and organization_id must remain unchanged
    (
      id = auth.uid()
      AND role = (SELECT u.role FROM users u WHERE u.id = auth.uid())
      AND organization_id = get_user_org_id()
    )
    OR
    -- Admin update: can modify other users in same org
    (
      organization_id = get_user_org_id()
      AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
      )
    )
  );

-- Migration: 055_fix_defect_library_rls_for_user_saves
-- Description: Allow regular users to save to their private library (not just admins)
--
-- Background: migrations 008-030 added the defect_library with rich fields (user_id, source, etc.)
--   but kept the RLS INSERT/UPDATE policies requiring role='admin'. This blocks regular users
--   from saving defects to their private library during add-defect form workflows.
--
-- Solution: Relax INSERT/UPDATE policies to allow users to create/modify their own private items.
--   - is_global = false (user items, not seeded global items)
--   - user_id = auth.uid() (own items only)
--   - organization_id matches user's org (same tenant)
--   - source = 'user' (user-created, not system-seeded)
--
-- SELECT policy remains: is_global=true OR org_id=user's org (public or own org items)
-- DELETE policy remains: is_global=false AND user owns it
--
-- Idempotency: Uses IF NOT EXISTS / DROP IF EXISTS for safe re-runs
-- Dependencies: 008_create_defect_library, 030_remote_catchup_and_defect_library_sync

-- ===========================================
-- Drop old restrictive policies
-- ===========================================

DROP POLICY IF EXISTS "defect_library_insert" ON defect_library;
DROP POLICY IF EXISTS "defect_library_update" ON defect_library;

-- ===========================================
-- New INSERT policy: allow users to create own private items
-- ===========================================

CREATE POLICY "defect_library_insert" ON defect_library
  FOR INSERT
  WITH CHECK (
    -- Private items only (not global)
    is_global = false
    -- Must be the item owner
    AND user_id = auth.uid()
    -- Must be in own organization
    AND organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    -- Source must be 'user' (not system-seeded)
    AND source = 'user'
  );

COMMENT ON POLICY "defect_library_insert" ON defect_library
  IS 'Allow users to save defects to their private library (is_global=false, user_id=auth.uid(), source=user)';

-- ===========================================
-- New UPDATE policy: allow users to update own private items
-- ===========================================

CREATE POLICY "defect_library_update" ON defect_library
  FOR UPDATE
  USING (
    -- Private items only
    is_global = false
    -- Must be the item owner
    AND user_id = auth.uid()
    -- Must be in own organization
    AND organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  )
  WITH CHECK (
    -- After update, must still be private + owned by same user + same org
    is_global = false
    AND user_id = auth.uid()
    AND organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    -- Source must remain 'user' (prevent changing to 'system')
    AND source = 'user'
  );

COMMENT ON POLICY "defect_library_update" ON defect_library
  IS 'Allow users to update their own private defects (cannot change is_global, user_id, source, or org)';

-- ===========================================
-- SELECT policy: unchanged (public + own org items)
-- ===========================================
-- Existing policy: is_global=true OR organization_id = user's org
-- No change needed.

-- ===========================================
-- DELETE policy: unchanged (own private items only)
-- ===========================================
-- Existing policy: is_global=false AND user owns it AND user is admin
-- We'll relax this to allow any user to delete their own private items (not just admins).

DROP POLICY IF EXISTS "defect_library_delete" ON defect_library;

CREATE POLICY "defect_library_delete" ON defect_library
  FOR DELETE
  USING (
    -- Private items only
    is_global = false
    -- Must be the item owner
    AND user_id = auth.uid()
    -- Must be in own organization
    AND organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

COMMENT ON POLICY "defect_library_delete" ON defect_library
  IS 'Allow users to delete their own private defects';

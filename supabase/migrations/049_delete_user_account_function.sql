-- Migration 049: Create delete_user_account() function for GDPR/App Store compliance
-- This function permanently deletes a user and all their associated data
-- Required by Apple App Store Review Guideline 5.1.1

CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_org_id uuid;
  v_admin_count int;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get user's organization
  SELECT organization_id INTO v_org_id FROM users WHERE id = v_user_id;

  -- Delete all user-created data (cascade order matters for foreign keys)
  DELETE FROM notifications WHERE user_id = v_user_id;
  DELETE FROM report_log WHERE actor_id = v_user_id;

  -- Delete signatures for user's reports
  DELETE FROM signatures
  WHERE report_id IN (
    SELECT id FROM delivery_reports WHERE created_by = v_user_id
  );

  -- Delete defect photos for user's reports
  DELETE FROM defect_photos
  WHERE defect_id IN (
    SELECT id FROM defects
    WHERE report_id IN (
      SELECT id FROM delivery_reports WHERE created_by = v_user_id
    )
  );

  -- Delete defects for user's reports
  DELETE FROM defects
  WHERE report_id IN (
    SELECT id FROM delivery_reports WHERE created_by = v_user_id
  );

  -- Delete checklist results for user's reports
  DELETE FROM checklist_results
  WHERE report_id IN (
    SELECT id FROM delivery_reports WHERE created_by = v_user_id
  );

  -- Delete reports
  DELETE FROM delivery_reports WHERE created_by = v_user_id;

  -- Delete clients created by user
  DELETE FROM clients WHERE created_by = v_user_id;

  -- Handle organization membership
  IF v_org_id IS NOT NULL THEN
    -- Count remaining admins in this org (excluding user being deleted)
    SELECT COUNT(*) INTO v_admin_count
    FROM users
    WHERE organization_id = v_org_id
      AND role = 'admin'
      AND id != v_user_id;

    IF v_admin_count = 0 THEN
      -- User is the only admin — delete entire organization
      -- (Other members can still access data but cannot manage organization)
      DELETE FROM checklist_templates WHERE organization_id = v_org_id;

      DELETE FROM apartments
      WHERE building_id IN (
        SELECT id FROM buildings
        WHERE project_id IN (
          SELECT id FROM projects WHERE organization_id = v_org_id
        )
      );

      DELETE FROM buildings
      WHERE project_id IN (
        SELECT id FROM projects WHERE organization_id = v_org_id
      );

      DELETE FROM projects WHERE organization_id = v_org_id;

      -- Delete other users in this org (they have no data to preserve)
      DELETE FROM users WHERE organization_id = v_org_id AND id != v_user_id;

      -- Delete the organization itself
      DELETE FROM organizations WHERE id = v_org_id;
    END IF;
  END IF;

  -- Finally, delete the user record
  DELETE FROM users WHERE id = v_user_id;

  -- Note: Auth record (auth.users) is NOT deleted here
  -- Auth deletion must be handled separately via Auth API
  -- (supabase.auth.admin.deleteUser() at application layer)
END;
$$;

-- Grant execute to authenticated users only
GRANT EXECUTE ON FUNCTION delete_user_account TO authenticated;

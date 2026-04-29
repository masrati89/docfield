-- C3 + C4: Add RLS status-based protection for completed reports
-- Iron Rule: Completed reports cannot be edited. This migration enforces status guards at the database level.

BEGIN;

-- C3.1: delivery_reports UPDATE — prevent edits to completed reports
DROP POLICY IF EXISTS delivery_reports_update ON delivery_reports;

CREATE POLICY delivery_reports_update ON delivery_reports
  FOR UPDATE
  USING (
    organization_id = get_user_org_id()
    AND status != 'completed'  -- C3: prevent update of completed reports
  )
  WITH CHECK (
    organization_id = get_user_org_id()
    AND status != 'completed'  -- C3: post-update state must also be non-completed
  );

-- C3.2: delivery_reports DELETE — prevent delete of completed reports (except by system/admin edge functions)
DROP POLICY IF EXISTS delivery_reports_delete ON delivery_reports;

CREATE POLICY delivery_reports_delete ON delivery_reports
  FOR DELETE
  USING (
    organization_id = get_user_org_id()
    AND status != 'completed'  -- C3: prevent delete of completed reports
  );

-- C3.3: defects UPDATE — prevent edits to defects in completed reports
DROP POLICY IF EXISTS defects_update ON defects;

CREATE POLICY defects_update ON defects
  FOR UPDATE
  USING (
    organization_id = get_user_org_id()
    AND NOT EXISTS (
      SELECT 1 FROM delivery_reports r
      WHERE r.id = defects.delivery_report_id
      AND r.status = 'completed'  -- C3: prevent update of defects in completed reports
    )
  )
  WITH CHECK (
    organization_id = get_user_org_id()
    AND NOT EXISTS (
      SELECT 1 FROM delivery_reports r
      WHERE r.id = defects.delivery_report_id
      AND r.status = 'completed'  -- C3: post-update state must also have non-completed parent report
    )
  );

-- C3.4: defects DELETE — prevent deletion of defects in completed reports
DROP POLICY IF EXISTS defects_delete ON defects;

CREATE POLICY defects_delete ON defects
  FOR DELETE
  USING (
    organization_id = get_user_org_id()
    AND NOT EXISTS (
      SELECT 1 FROM delivery_reports r
      WHERE r.id = defects.delivery_report_id
      AND r.status = 'completed'  -- C3: prevent delete of defects in completed reports
    )
  );

-- C4: defects INSERT — verify parent report exists and belongs to org + is not completed
DROP POLICY IF EXISTS defects_insert ON defects;

CREATE POLICY defects_insert ON defects
  FOR INSERT
  WITH CHECK (
    organization_id = get_user_org_id()
    AND EXISTS (
      SELECT 1 FROM delivery_reports r
      WHERE r.id = delivery_report_id
      AND r.organization_id = get_user_org_id()  -- C4: ensure report ownership
      AND r.status != 'completed'  -- C4: prevent insertion into completed reports
    )
  );

-- C3.5: checklist_results UPDATE — prevent edits to completed reports
DROP POLICY IF EXISTS checklist_results_update ON checklist_results;

CREATE POLICY checklist_results_update ON checklist_results
  FOR UPDATE
  USING (
    organization_id = get_user_org_id()
    AND NOT EXISTS (
      SELECT 1 FROM delivery_reports r
      WHERE r.id = checklist_results.delivery_report_id
      AND r.status = 'completed'  -- C3: prevent update of checklist in completed reports
    )
  )
  WITH CHECK (
    organization_id = get_user_org_id()
    AND NOT EXISTS (
      SELECT 1 FROM delivery_reports r
      WHERE r.id = checklist_results.delivery_report_id
      AND r.status = 'completed'  -- C3: post-update state must also have non-completed parent report
    )
  );

-- C3.6: checklist_results DELETE — prevent deletion in completed reports
DROP POLICY IF EXISTS checklist_results_delete ON checklist_results;

CREATE POLICY checklist_results_delete ON checklist_results
  FOR DELETE
  USING (
    organization_id = get_user_org_id()
    AND NOT EXISTS (
      SELECT 1 FROM delivery_reports r
      WHERE r.id = checklist_results.delivery_report_id
      AND r.status = 'completed'  -- C3: prevent delete of checklist in completed reports
    )
  );

COMMENT ON POLICY delivery_reports_update ON delivery_reports IS 'C3: Completed reports are immutable — only in-progress/draft reports can be edited.';
COMMENT ON POLICY delivery_reports_delete ON delivery_reports IS 'C3: Completed reports cannot be deleted — maintain audit trail.';
COMMENT ON POLICY defects_update ON defects IS 'C3: Prevent edits to defects in completed reports.';
COMMENT ON POLICY defects_delete ON defects IS 'C3: Prevent deletion of defects in completed reports.';
COMMENT ON POLICY defects_insert ON defects IS 'C4: Verify parent report ownership + not completed before inserting defect.';
COMMENT ON POLICY checklist_results_update ON checklist_results IS 'C3: Prevent edits to checklist in completed reports.';
COMMENT ON POLICY checklist_results_delete ON checklist_results IS 'C3: Prevent deletion of checklist in completed reports.';

COMMIT;

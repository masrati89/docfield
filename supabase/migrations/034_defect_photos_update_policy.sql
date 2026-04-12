-- Migration: 034_defect_photos_update_policy
-- Description: Add missing UPDATE policy on defect_photos.
--              Without this, any UPDATE (e.g. annotations changes) is silently
--              denied by RLS. Grants UPDATE to same-org users who are admin/PM
--              or own the parent report via defects → delivery_reports chain.

CREATE POLICY "defect_photos_update" ON defect_photos FOR UPDATE
  USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (
      EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
      )
      OR EXISTS (
        SELECT 1 FROM defects d
        JOIN delivery_reports dr ON dr.id = d.delivery_report_id
        WHERE d.id = defect_photos.defect_id AND dr.inspector_id = auth.uid()
      )
    )
  )
  WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
  );

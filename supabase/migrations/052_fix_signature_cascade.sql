-- H3: Fix signature immutability — prevent cascade deletion of signatures
-- Rationale: Signatures table has NO UPDATE / NO DELETE policies (immutable per migration 009).
-- But delivery_reports had ON DELETE CASCADE, which bypassed those policies.
-- This migration changes FK to ON DELETE RESTRICT, ensuring signatures survive report deletion.

-- Drop existing FK if it exists (may be ON DELETE CASCADE)
ALTER TABLE IF EXISTS signatures
DROP CONSTRAINT IF EXISTS signatures_delivery_report_id_fkey;

-- Recreate FK with ON DELETE RESTRICT (immutable signatures)
ALTER TABLE signatures
ADD CONSTRAINT signatures_delivery_report_id_fkey
  FOREIGN KEY (delivery_report_id) REFERENCES delivery_reports(id)
  ON DELETE RESTRICT;

COMMENT ON CONSTRAINT signatures_delivery_report_id_fkey ON signatures IS 'RESTRICT: Signatures are immutable documents. Cannot delete report if signatures exist. Soft-delete reports instead.';

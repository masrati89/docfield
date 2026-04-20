-- Migration 046: Change default report status from 'draft' to 'in_progress'
-- Reports are now created as 'in_progress' by default.
-- 'draft' is only used when the inspector explicitly chooses "הפק כטיוטה" in the wizard.

ALTER TABLE delivery_reports
  ALTER COLUMN status SET DEFAULT 'in_progress';

-- Migration 041: Add no_checklist flag to delivery_reports
-- When true, the report has no checklist — only manual defect entry.

ALTER TABLE delivery_reports ADD COLUMN IF NOT EXISTS no_checklist BOOLEAN NOT NULL DEFAULT false;

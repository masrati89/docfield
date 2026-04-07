-- Migration: 019_checklist_state_column
-- Description: Add JSONB column to store checklist state (statuses, defect texts, bath types)
-- Dependencies: delivery_reports

ALTER TABLE delivery_reports
  ADD COLUMN IF NOT EXISTS checklist_state JSONB NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN delivery_reports.checklist_state IS 'Stores checklist progress: { statuses: {itemId: status}, defectTexts: {itemId: text}, bathTypes: {roomId: type} }';

-- Migration: 024_add_checklist_state_column
-- Description: Add checklist_state JSONB column to delivery_reports.
-- The useChecklist hook persists room statuses, defect texts, and bath types here.
-- Dependencies: 005_delivery_reports

ALTER TABLE delivery_reports
    ADD COLUMN IF NOT EXISTS checklist_state jsonb DEFAULT '{}'::jsonb;

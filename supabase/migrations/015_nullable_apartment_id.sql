-- Migration: 015_nullable_apartment_id
-- Description: Allow delivery_reports without apartment association
-- FLOW_SPEC §3: "skip project" flow creates report with freetext only
-- The project_name_freetext and apartment_label_freetext fields (migration 012)
-- serve as display names when no FK exists.

ALTER TABLE delivery_reports ALTER COLUMN apartment_id DROP NOT NULL;

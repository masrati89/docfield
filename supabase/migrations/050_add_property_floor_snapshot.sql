-- Add property_floor snapshot column to delivery_reports
-- This ensures the floor number shown on PDFs matches what was selected at report creation time

ALTER TABLE delivery_reports
ADD COLUMN property_floor INTEGER NULL;

COMMENT ON COLUMN delivery_reports.property_floor IS 'Floor number snapshot at report creation — immutable, read-only from apartments.floor at INSERT time. Used only for report display and PDF generation, never updated after creation.';

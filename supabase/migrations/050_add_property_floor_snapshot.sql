-- Migration 050: property_floor column documentation
-- Description: Add semantic comment to the property_floor column in delivery_reports.
--   The column itself was created in migration 026 (PDF infrastructure block).
--   This migration only adds the COMMENT clarifying the snapshot semantics.
-- Dependencies: 026_pdf_infrastructure (column already exists)

COMMENT ON COLUMN delivery_reports.property_floor IS 'Floor number snapshot at report creation — immutable, read-only from apartments.floor at INSERT time. Used only for report display and PDF generation, never updated after creation.';

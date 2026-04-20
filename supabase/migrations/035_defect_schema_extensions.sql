-- Migration: 035_defect_schema_extensions
-- Description: Add standard_section, unit_price, quantity, unit_label columns to defects.
--   Extend severity CHECK from 3 to 4 levels (add 'high').
-- Dependencies: 007_create_defects, 020_add_defect_rich_fields

-- ===========================================
-- New columns for per-unit pricing & standard section
-- ===========================================
ALTER TABLE defects
    ADD COLUMN standard_section TEXT,
    ADD COLUMN unit_price       NUMERIC(10, 2),
    ADD COLUMN quantity         NUMERIC(10, 2),
    ADD COLUMN unit_label       TEXT;

COMMENT ON COLUMN defects.standard_section IS 'Freetext section/clause reference within the standard (e.g., 3.1, 4.2)';
COMMENT ON COLUMN defects.unit_price       IS 'Price per unit for non-fixed cost types';
COMMENT ON COLUMN defects.quantity         IS 'Quantity of units for non-fixed cost types';
COMMENT ON COLUMN defects.unit_label       IS 'Unit type label: sqm, lm, unit, day, etc.';

-- ===========================================
-- Severity: 3 → 4 levels (add 'high')
-- ===========================================
ALTER TABLE defects DROP CONSTRAINT defects_severity_check;
ALTER TABLE defects ADD CONSTRAINT defects_severity_check
    CHECK (severity IN ('critical', 'high', 'medium', 'low'));

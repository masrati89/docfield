-- Migration: 020_add_defect_rich_fields
-- Description: Add recommendation, notes, cost, cost_unit to defects table.
--   Also rename standard_reference → standard_ref to match query column names in usePdfGeneration.
-- Dependencies: 016_add_standard_ref_to_defects

ALTER TABLE defects
    RENAME COLUMN standard_reference TO standard_ref;

ALTER TABLE defects
    ADD COLUMN recommendation TEXT,
    ADD COLUMN notes           TEXT,
    ADD COLUMN cost            NUMERIC(10, 2),
    ADD COLUMN cost_unit       TEXT;

COMMENT ON COLUMN defects.standard_ref     IS 'Israeli standard reference (e.g., ת"י 1205.1)';
COMMENT ON COLUMN defects.recommendation   IS 'Inspector recommendation for repair';
COMMENT ON COLUMN defects.notes            IS 'Additional inspector notes';
COMMENT ON COLUMN defects.cost             IS 'Estimated repair cost';
COMMENT ON COLUMN defects.cost_unit        IS 'Cost unit type: fixed, per_unit, etc.';

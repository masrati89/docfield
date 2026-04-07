-- Migration: 016_add_standard_ref_to_defects
-- Description: Add standard_reference column to defects for Israeli standard references
-- Dependencies: 007_create_defects

ALTER TABLE defects ADD COLUMN standard_reference TEXT;

COMMENT ON COLUMN defects.standard_reference IS 'Israeli standard reference (e.g., ת"י 1205.1)';

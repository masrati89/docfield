-- Migration: 054_add_library_template_tracking_to_defects
-- Description: Add library_template_id FK to track defects created from templates
-- Dependencies: 007_create_defects, 008_create_defect_library

-- Add foreign key to defect_library for template tracking
ALTER TABLE defects
  ADD COLUMN IF NOT EXISTS library_template_id UUID
    REFERENCES defect_library(id) ON DELETE SET NULL;

COMMENT ON COLUMN defects.library_template_id
  IS 'Foreign key to defect_library template used to create this defect (NULL = manually created)';

-- Index for queries filtering by template
CREATE INDEX IF NOT EXISTS idx_defects_library_template
  ON defects(library_template_id);

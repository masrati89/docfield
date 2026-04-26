-- Migration: 049_add_recommendation_price_to_defect_library
-- Description: Add recommendation and price columns to defect_library table
-- Dependencies: 008_create_defect_library

-- Add recommendation column
ALTER TABLE defect_library
  ADD COLUMN IF NOT EXISTS recommendation TEXT;

COMMENT ON COLUMN defect_library.recommendation IS 'Recommended repair/fix action for this defect';

-- Add price column (in shekalim)
ALTER TABLE defect_library
  ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2);

COMMENT ON COLUMN defect_library.price IS 'Default estimated price in NIS (₪) for fixing this defect';

-- Create indexes for performance (if needed in future)
-- CREATE INDEX idx_defect_library_recommendation ON defect_library(recommendation) WHERE recommendation IS NOT NULL;
-- CREATE INDEX idx_defect_library_price ON defect_library(price) WHERE price IS NOT NULL;

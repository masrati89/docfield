-- Migration: 049_add_recommendation_price_to_defect_library
-- Description: (Deprecated — columns now created in migration 031)
-- The recommendation and price columns are now added in migration 031
-- before the defect library seed. This migration is kept for compatibility
-- but does nothing since the columns already exist via the IF NOT EXISTS clause.
-- Dependencies: 031_seed_global_defect_library

-- These columns are now created in migration 031
-- Keeping the statements here for reference, but they do nothing:
ALTER TABLE defect_library
  ADD COLUMN IF NOT EXISTS recommendation TEXT;

ALTER TABLE defect_library
  ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2);

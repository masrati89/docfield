-- Migration: 030_remote_catchup_and_defect_library_sync
-- Description: Idempotent catchup for migrations that never ran on Remote + sync manual defect_library additions.
--
-- Background: Schema diff revealed that migrations 017, 018, 020 were marked as applied on Remote
--   but their SQL never actually ran. This migration re-applies their effects safely (IF NOT EXISTS).
--   Additionally, 12 columns were added manually to defect_library on Remote for a rich library feature
--   (Haim confirmed). This migration adds those columns to Local too so schemas are fully synced.
--
-- Parts:
--   1. users.stamp_url            (from 017)
--   2. defect_photos.annotations_json (from 018)
--   3. defects: rename standard_reference → standard_ref + rich fields (from 020)
--   4. defect_library: 12 new columns (title, location, cost, etc.) + check constraints
--
-- Idempotency: safe to run on any DB — Local (has all), Remote (missing most), or fresh.
-- Dependencies: 002, 007, 008, 028

-- ===========================================
-- PART 1: users.stamp_url (catchup for 017)
-- ===========================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS stamp_url TEXT;

COMMENT ON COLUMN users.stamp_url IS 'URL to inspector stamp/logo PNG in storage';

-- ===========================================
-- PART 2: defect_photos.annotations_json (catchup for 018)
-- ===========================================
ALTER TABLE defect_photos ADD COLUMN IF NOT EXISTS annotations_json JSONB DEFAULT NULL;

COMMENT ON COLUMN defect_photos.annotations_json IS
  'Non-destructive annotation layer (arrows, circles, underlines, text) as JSON. Original photo unchanged.';

-- ===========================================
-- PART 3: defects rename + rich fields (catchup for 020)
-- ===========================================

-- 3A. Rename standard_reference → standard_ref (only if needed)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'defects' AND column_name = 'standard_ref'
    ) THEN
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_schema = 'public' AND table_name = 'defects' AND column_name = 'standard_reference'
        ) THEN
            ALTER TABLE defects RENAME COLUMN standard_reference TO standard_ref;
        ELSE
            ALTER TABLE defects ADD COLUMN standard_ref TEXT;
        END IF;
    END IF;
END $$;

-- 3B. Add rich defect fields
ALTER TABLE defects ADD COLUMN IF NOT EXISTS recommendation TEXT;
ALTER TABLE defects ADD COLUMN IF NOT EXISTS notes           TEXT;
ALTER TABLE defects ADD COLUMN IF NOT EXISTS cost            NUMERIC(10, 2);
ALTER TABLE defects ADD COLUMN IF NOT EXISTS cost_unit       TEXT;

COMMENT ON COLUMN defects.standard_ref     IS 'Israeli standard reference (e.g., ת"י 1205.1)';
COMMENT ON COLUMN defects.recommendation   IS 'Inspector recommendation for repair';
COMMENT ON COLUMN defects.notes            IS 'Additional inspector notes';
COMMENT ON COLUMN defects.cost             IS 'Estimated repair cost';
COMMENT ON COLUMN defects.cost_unit        IS 'Cost unit type: fixed, per_unit, etc.';

-- ===========================================
-- PART 4: defect_library — 12 columns added manually on Remote
-- Rich library feature (confirmed with Haim)
-- ===========================================

-- 4A. Add 12 new columns
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS user_id              UUID REFERENCES users(id);
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS source               TEXT DEFAULT 'system';
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS title                TEXT;
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS location             TEXT;
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS standard             TEXT;
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS standard_description TEXT;
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS recommendation       TEXT;
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS cost                 NUMERIC(10, 2);
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS cost_unit            TEXT DEFAULT 'fixed';
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS usage_count          INTEGER DEFAULT 0;
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS last_used_at         TIMESTAMPTZ;
ALTER TABLE defect_library ADD COLUMN IF NOT EXISTS updated_at           TIMESTAMPTZ DEFAULT NOW();

-- 4B. Add CHECK constraints (guarded — constraints don't support IF NOT EXISTS)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'defect_library_cost_unit_check'
    ) THEN
        ALTER TABLE defect_library
            ADD CONSTRAINT defect_library_cost_unit_check
            CHECK (cost_unit IS NULL OR cost_unit = ANY (ARRAY['fixed', 'sqm', 'lm', 'unit', 'day']));
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'defect_library_source_check'
    ) THEN
        ALTER TABLE defect_library
            ADD CONSTRAINT defect_library_source_check
            CHECK (source IS NULL OR source = ANY (ARRAY['system', 'user']));
    END IF;
END $$;

-- 4C. Add updated_at trigger (guarded)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'set_defect_library_updated_at'
    ) THEN
        CREATE TRIGGER set_defect_library_updated_at
            BEFORE UPDATE ON defect_library
            FOR EACH ROW EXECUTE FUNCTION update_updated_at();
    END IF;
END $$;

COMMENT ON COLUMN defect_library.user_id              IS 'Owner user (NULL = org-wide or global)';
COMMENT ON COLUMN defect_library.source               IS 'system (seeded) or user (user-created)';
COMMENT ON COLUMN defect_library.title                IS 'Short title for the library item';
COMMENT ON COLUMN defect_library.location             IS 'Default location/room suggestion';
COMMENT ON COLUMN defect_library.standard             IS 'Standard name (e.g., ת"י 1205)';
COMMENT ON COLUMN defect_library.standard_description IS 'Human description of the standard';
COMMENT ON COLUMN defect_library.recommendation       IS 'Default recommendation text';
COMMENT ON COLUMN defect_library.cost                 IS 'Default estimated repair cost';
COMMENT ON COLUMN defect_library.cost_unit            IS 'Cost unit: fixed | sqm | lm | unit | day';
COMMENT ON COLUMN defect_library.usage_count          IS 'Number of times this library item was used';
COMMENT ON COLUMN defect_library.last_used_at         IS 'Last time this library item was used';

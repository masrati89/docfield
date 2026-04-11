-- Migration: 032_iron_rule_experience_company_snapshots
-- Description: Closes Iron Rule gap — adds 2 missing snapshot columns to delivery_reports.
--   PDF generator previously read `experience` and `company_name` from users.inspector_settings
--   live (session user), which leaked cross-user data into legal reports.
-- Dependencies: 029_iron_rule_and_org_skeleton

-- ===========================================
-- PART 1: Add missing snapshot columns
-- ===========================================

ALTER TABLE delivery_reports
    ADD COLUMN IF NOT EXISTS inspector_experience_snapshot   TEXT,
    ADD COLUMN IF NOT EXISTS inspector_company_name_snapshot TEXT;

COMMENT ON COLUMN delivery_reports.inspector_experience_snapshot IS
    'Iron Rule: inspector years-of-experience frozen at report creation';
COMMENT ON COLUMN delivery_reports.inspector_company_name_snapshot IS
    'Iron Rule: inspector company name frozen at report creation';

-- ===========================================
-- PART 2: No backfill
-- ===========================================
-- Per decision 2026-04-11: existing test reports will be deleted and
-- recreated via the wizard, which writes snapshots at INSERT time.
-- No UPDATE statement needed.

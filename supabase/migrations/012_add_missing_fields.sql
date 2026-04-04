-- Migration: 012_add_missing_fields
-- Description: Add missing columns to projects, delivery_reports, defects, users
-- Source: Infrastructure audit vs FLOW_SPEC.md + ARCHITECTURE_INFIELD.md
-- Dependencies: 002_create_users, 003_create_projects, 005_create_delivery_reports, 007_create_defects

-- ===========================================
-- 1. projects: report type default + checklist template
-- FLOW_SPEC §2: project type determines default report type
-- ===========================================
ALTER TABLE projects
    ADD COLUMN report_type_default TEXT NOT NULL DEFAULT 'delivery'
        CHECK (report_type_default IN ('delivery', 'bedek_bait')),
    ADD COLUMN default_checklist_template_id UUID REFERENCES checklist_templates(id) ON DELETE SET NULL;

COMMENT ON COLUMN projects.report_type_default IS 'Default report type for new reports in this project';
COMMENT ON COLUMN projects.default_checklist_template_id IS 'Default checklist template for delivery reports in this project';

-- ===========================================
-- 2. delivery_reports: round linking + freetext fields
-- FLOW_SPEC §4: previous_round_id links round 2 → round 1
-- FLOW_SPEC §3: freetext fields for wizard steps 2-3 (manual entry)
-- ===========================================
ALTER TABLE delivery_reports
    ADD COLUMN previous_round_id UUID REFERENCES delivery_reports(id) ON DELETE SET NULL,
    ADD COLUMN project_name_freetext TEXT,
    ADD COLUMN apartment_label_freetext TEXT;

CREATE INDEX idx_delivery_reports_previous_round ON delivery_reports(previous_round_id);

COMMENT ON COLUMN delivery_reports.previous_round_id IS 'Links round 2 report to round 1 report';
COMMENT ON COLUMN delivery_reports.project_name_freetext IS 'Free-text project name when not linked to a DB project';
COMMENT ON COLUMN delivery_reports.apartment_label_freetext IS 'Free-text apartment label when not linked to a DB apartment';

-- ===========================================
-- 3. defects: round 2 review fields
-- FLOW_SPEC §4: inherited defects from round 1 with review status
-- ===========================================
ALTER TABLE defects
    ADD COLUMN source_defect_id UUID REFERENCES defects(id) ON DELETE SET NULL,
    ADD COLUMN review_status TEXT
        CHECK (review_status IN ('pending_review', 'fixed', 'not_fixed', 'partially_fixed')),
    ADD COLUMN review_note TEXT;

-- Update source constraint to include 'inherited'
ALTER TABLE defects DROP CONSTRAINT defects_source_check;
ALTER TABLE defects ADD CONSTRAINT defects_source_check
    CHECK (source IN ('checklist', 'manual', 'library', 'inherited'));

CREATE INDEX idx_defects_source_defect ON defects(source_defect_id);

COMMENT ON COLUMN defects.source_defect_id IS 'Reference to original defect from previous round';
COMMENT ON COLUMN defects.review_status IS 'Review status for inherited defects in round 2';
COMMENT ON COLUMN defects.review_note IS 'Inspector note on review status change';

-- ===========================================
-- 4. users: signature URL
-- Needed for inspector signature in reports and settings screen
-- ===========================================
ALTER TABLE users ADD COLUMN signature_url TEXT;

COMMENT ON COLUMN users.signature_url IS 'URL to stored inspector signature image';

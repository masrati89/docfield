-- Migration: 026_pdf_infrastructure
-- Description: Add columns for PDF generation infrastructure:
--   - delivery_reports: report_number, client details, property details, report_content, contractor
--   - users: inspector_settings JSONB
--   - defect_photos: caption
--   - Auto-generate report_number on INSERT (YYYY-NNN per org per year)
-- Dependencies: 005_create_delivery_reports, 002_create_users, 007_create_defects

-- ===========================================
-- delivery_reports: client details (per-report)
-- ===========================================
ALTER TABLE delivery_reports
    ADD COLUMN report_number      TEXT,
    ADD COLUMN client_name        TEXT,
    ADD COLUMN client_phone       TEXT,
    ADD COLUMN client_email       TEXT,
    ADD COLUMN client_id_number   TEXT;

-- ===========================================
-- delivery_reports: property details
-- ===========================================
ALTER TABLE delivery_reports
    ADD COLUMN property_type        TEXT,
    ADD COLUMN property_area        NUMERIC(8, 2),
    ADD COLUMN property_floor       INT,
    ADD COLUMN property_description TEXT;

-- ===========================================
-- delivery_reports: report content & contractor
-- ===========================================
ALTER TABLE delivery_reports
    ADD COLUMN report_content     JSONB NOT NULL DEFAULT '{}',
    ADD COLUMN pdf_draft_url      TEXT,
    ADD COLUMN weather_conditions TEXT,
    ADD COLUMN contractor_name    TEXT,
    ADD COLUMN contractor_phone   TEXT;

COMMENT ON COLUMN delivery_reports.report_number      IS 'Formatted report number: YYYY-NNN (per org per year)';
COMMENT ON COLUMN delivery_reports.report_content      IS 'JSONB: declaration, scope, limitations, tools, general_notes, property_description';
COMMENT ON COLUMN delivery_reports.pdf_draft_url       IS 'Local URI of draft PDF (before finalization)';

-- ===========================================
-- users: inspector_settings JSONB
-- ===========================================
ALTER TABLE users
    ADD COLUMN inspector_settings JSONB NOT NULL DEFAULT '{}';

COMMENT ON COLUMN users.inspector_settings IS 'JSONB: license_number, education, experience, company_name, company_logo_url, default_declaration, default_tools, default_limitations';

-- ===========================================
-- defect_photos: caption
-- ===========================================
ALTER TABLE defect_photos
    ADD COLUMN caption TEXT;

COMMENT ON COLUMN defect_photos.caption IS 'Photo caption/description for PDF reports';

-- ===========================================
-- Function: generate_report_number(org_id)
-- Returns YYYY-NNN format, sequential per org per year
-- ===========================================
CREATE OR REPLACE FUNCTION generate_report_number(p_org_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_year TEXT;
    v_count INT;
BEGIN
    v_year := to_char(NOW(), 'YYYY');

    SELECT COUNT(*) + 1 INTO v_count
    FROM delivery_reports
    WHERE organization_id = p_org_id
      AND report_number IS NOT NULL
      AND report_number LIKE v_year || '-%';

    RETURN v_year || '-' || lpad(v_count::TEXT, 3, '0');
END;
$$;

-- ===========================================
-- Trigger: auto-assign report_number on INSERT
-- ===========================================
CREATE OR REPLACE FUNCTION set_report_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.report_number IS NULL THEN
        NEW.report_number := generate_report_number(NEW.organization_id);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_set_report_number
    BEFORE INSERT ON delivery_reports
    FOR EACH ROW EXECUTE FUNCTION set_report_number();

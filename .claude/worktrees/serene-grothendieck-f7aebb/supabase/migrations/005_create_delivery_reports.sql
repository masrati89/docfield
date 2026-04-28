-- Migration: 005_create_delivery_reports
-- Description: Delivery reports (the core inspection entity)
-- Dependencies: apartments, users, checklist_templates

-- ===========================================
-- TABLE: delivery_reports
-- ===========================================
CREATE TABLE delivery_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id UUID NOT NULL REFERENCES apartments(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    inspector_id UUID NOT NULL REFERENCES users(id),
    checklist_template_id UUID REFERENCES checklist_templates(id),
    report_type TEXT NOT NULL DEFAULT 'delivery'
        CHECK (report_type IN ('delivery', 'bedek_bait', 'supervision', 'leak_detection', 'public_areas')),
    round_number INT NOT NULL DEFAULT 1 CHECK (round_number > 0),
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'in_progress', 'completed', 'sent')),
    tenant_name TEXT,
    tenant_phone TEXT CHECK (tenant_phone IS NULL OR tenant_phone ~ '^0[2-9]\d{7,8}$'),
    tenant_email TEXT,
    notes TEXT,
    pdf_url TEXT,
    report_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_delivery_reports_apartment ON delivery_reports(apartment_id);
CREATE INDEX idx_delivery_reports_org_status ON delivery_reports(organization_id, status);
CREATE INDEX idx_delivery_reports_inspector ON delivery_reports(inspector_id);

CREATE TRIGGER set_delivery_reports_updated_at
    BEFORE UPDATE ON delivery_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE delivery_reports ENABLE ROW LEVEL SECURITY;

-- SELECT: admin/PM see all org reports, inspector sees own only
CREATE POLICY "delivery_reports_select" ON delivery_reports FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
        )
        OR inspector_id = auth.uid()
    )
);

-- INSERT: any role in same org
CREATE POLICY "delivery_reports_insert" ON delivery_reports FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- UPDATE: admin/PM update any, inspector updates own
CREATE POLICY "delivery_reports_update" ON delivery_reports FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
        )
        OR inspector_id = auth.uid()
    )
);

-- DELETE: admin only
CREATE POLICY "delivery_reports_delete" ON delivery_reports FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Migration: 007_create_defects
-- Description: Defects and defect photos
-- Dependencies: delivery_reports, checklist_results

-- ===========================================
-- TABLE: defects
-- ===========================================
CREATE TABLE defects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_report_id UUID NOT NULL REFERENCES delivery_reports(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    checklist_result_id UUID REFERENCES checklist_results(id),
    description TEXT NOT NULL CHECK (char_length(description) >= 2),
    room TEXT,
    category TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'medium', 'low')),
    status TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'fixed', 'not_fixed')),
    source TEXT NOT NULL DEFAULT 'checklist'
        CHECK (source IN ('checklist', 'manual', 'library')),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_defects_report ON defects(delivery_report_id);
CREATE INDEX idx_defects_org_status ON defects(organization_id, status);

CREATE TRIGGER set_defects_updated_at
    BEFORE UPDATE ON defects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE defects ENABLE ROW LEVEL SECURITY;

-- SELECT: admin/PM see all, inspector sees own reports only
CREATE POLICY "defects_select" ON defects FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
        )
        OR delivery_report_id IN (
            SELECT id FROM delivery_reports WHERE inspector_id = auth.uid()
        )
    )
);

CREATE POLICY "defects_insert" ON defects FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "defects_update" ON defects FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
        )
        OR delivery_report_id IN (
            SELECT id FROM delivery_reports WHERE inspector_id = auth.uid()
        )
    )
);

CREATE POLICY "defects_delete" ON defects FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

-- ===========================================
-- TABLE: defect_photos
-- ===========================================
CREATE TABLE defect_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    defect_id UUID NOT NULL REFERENCES defects(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    annotations JSONB NOT NULL DEFAULT '[]',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_defect_photos_defect ON defect_photos(defect_id);

ALTER TABLE defect_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "defect_photos_select" ON defect_photos FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "defect_photos_insert" ON defect_photos FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "defect_photos_delete" ON defect_photos FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

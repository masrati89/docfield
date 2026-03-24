-- Migration: 006_create_checklist_results
-- Description: Checklist results (pass/fail/na for each item in a report)
-- Dependencies: delivery_reports, checklist_items

-- ===========================================
-- TABLE: checklist_results
-- ===========================================
CREATE TABLE checklist_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_report_id UUID NOT NULL REFERENCES delivery_reports(id) ON DELETE CASCADE,
    checklist_item_id UUID NOT NULL REFERENCES checklist_items(id),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    result TEXT NOT NULL CHECK (result IN ('pass', 'fail', 'na')),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate results for same item in same report
CREATE UNIQUE INDEX idx_checklist_results_unique
    ON checklist_results(delivery_report_id, checklist_item_id);
CREATE INDEX idx_checklist_results_report ON checklist_results(delivery_report_id);

CREATE TRIGGER set_checklist_results_updated_at
    BEFORE UPDATE ON checklist_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE checklist_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checklist_results_select" ON checklist_results FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "checklist_results_insert" ON checklist_results FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "checklist_results_update" ON checklist_results FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "checklist_results_delete" ON checklist_results FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

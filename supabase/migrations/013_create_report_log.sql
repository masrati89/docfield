-- Migration: 013_create_report_log
-- Description: Activity log for delivery reports (append-only)
-- FLOW_SPEC §9: Activity Log starts from first PDF generation
-- Dependencies: delivery_reports, users

-- ===========================================
-- TABLE: report_log
-- Append-only — no UPDATE or DELETE policies (Iron Rule)
-- ===========================================
CREATE TABLE report_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_report_id UUID NOT NULL REFERENCES delivery_reports(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    user_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL CHECK (action IN (
        'pdf_generated',
        'status_completed',
        'status_draft',
        'status_in_progress',
        'defect_added',
        'defect_updated',
        'defect_deleted',
        'photos_updated',
        'whatsapp_sent'
    )),
    details JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- No updated_at — log entries are immutable

CREATE INDEX idx_report_log_report ON report_log(delivery_report_id);
CREATE INDEX idx_report_log_org ON report_log(organization_id);

-- RLS
ALTER TABLE report_log ENABLE ROW LEVEL SECURITY;

-- SELECT: same org, admin/PM see all, inspector sees own reports
CREATE POLICY "report_log_select" ON report_log FOR SELECT USING (
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

-- INSERT: any authenticated user in same org
CREATE POLICY "report_log_insert" ON report_log FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- ⚠️ NO UPDATE POLICY — log entries are immutable
-- ⚠️ NO DELETE POLICY — log entries cannot be removed
-- This is intentional: activity log is append-only (Iron Rule)

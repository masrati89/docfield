-- Migration: 008_create_defect_library
-- Description: Defect library (reusable defect descriptions)
-- Dependencies: organizations

-- ===========================================
-- TABLE: defect_library
-- organizationId NULL = global (available to all)
-- ===========================================
CREATE TABLE defect_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    description TEXT NOT NULL CHECK (char_length(description) >= 2),
    category TEXT,
    default_severity TEXT NOT NULL DEFAULT 'medium'
        CHECK (default_severity IN ('critical', 'medium', 'low')),
    standard_reference TEXT,
    is_global BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_defect_library_org ON defect_library(organization_id);
CREATE INDEX idx_defect_library_search ON defect_library USING gin (to_tsvector('simple', description));

ALTER TABLE defect_library ENABLE ROW LEVEL SECURITY;

-- SELECT: own org + global items
CREATE POLICY "defect_library_select" ON defect_library FOR SELECT USING (
    is_global = true
    OR organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

CREATE POLICY "defect_library_insert" ON defect_library FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "defect_library_update" ON defect_library FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

CREATE POLICY "defect_library_delete" ON defect_library FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

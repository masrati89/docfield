-- Migration: 001_create_organizations
-- Description: Organizations table + shared update_updated_at trigger function
-- Dependencies: none

-- ===========================================
-- SHARED UTILITY: updated_at trigger function
-- Used by all tables with updated_at column
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- TABLE: organizations
-- Root table for multi-tenant architecture
-- ===========================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 1),
    logo_url TEXT,
    settings JSONB NOT NULL DEFAULT '{
        "defaultReportType": "delivery",
        "defaultLanguage": "he",
        "pdfBrandingEnabled": true
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- SELECT: users see only their own organization
CREATE POLICY "organizations_select" ON organizations FOR SELECT USING (
    id = (SELECT organization_id FROM users WHERE id = auth.uid())
);

-- UPDATE: admin only
CREATE POLICY "organizations_update" ON organizations FOR UPDATE USING (
    id = (SELECT organization_id FROM users WHERE id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

-- No INSERT policy: organizations are created during onboarding (service role)
-- No DELETE policy: organizations are never deleted

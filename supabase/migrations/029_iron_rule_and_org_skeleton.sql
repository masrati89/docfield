-- Migration: 029_iron_rule_and_org_skeleton
-- Description: Iron Rule snapshot fields on delivery_reports + organization skeleton tables.
--   Part 1: 16 snapshot columns on delivery_reports (8 inspector + 8 organization)
--   Part 2: organizations.mode field (solo/team)
--   Part 3: organization_members table
--   Part 4: organization_invitations table
--   Part 5: teams table
--   Part 6: Indexes
--   Part 7: RLS policies for new tables
--   Part 8: Backfill existing reports with current live data
-- Dependencies: 005_create_delivery_reports, 001_create_organizations, 002_create_users, 028_rls_recursion_fix

-- ===========================================
-- PART 1: Snapshot columns on delivery_reports
-- Iron Rule: reports are legal documents — snapshot freezes data at creation time
-- ===========================================

-- Inspector snapshot fields (8)
ALTER TABLE delivery_reports
    ADD COLUMN inspector_full_name_snapshot            TEXT,
    ADD COLUMN inspector_license_number_snapshot        TEXT,
    ADD COLUMN inspector_professional_title_snapshot    TEXT,
    ADD COLUMN inspector_education_snapshot             TEXT,
    ADD COLUMN inspector_signature_url_snapshot         TEXT,
    ADD COLUMN inspector_stamp_url_snapshot             TEXT,
    ADD COLUMN inspector_phone_snapshot                 TEXT,
    ADD COLUMN inspector_email_snapshot                 TEXT;

-- Organization snapshot fields (8)
ALTER TABLE delivery_reports
    ADD COLUMN organization_name_snapshot               TEXT,
    ADD COLUMN organization_logo_url_snapshot           TEXT,
    ADD COLUMN organization_legal_name_snapshot         TEXT,
    ADD COLUMN organization_tax_id_snapshot             TEXT,
    ADD COLUMN organization_address_snapshot            TEXT,
    ADD COLUMN organization_phone_snapshot              TEXT,
    ADD COLUMN organization_email_snapshot              TEXT,
    ADD COLUMN organization_legal_disclaimer_snapshot   TEXT;

COMMENT ON COLUMN delivery_reports.inspector_full_name_snapshot IS 'Iron Rule: inspector name frozen at report creation';
COMMENT ON COLUMN delivery_reports.organization_name_snapshot IS 'Iron Rule: org name frozen at report creation';

-- ===========================================
-- PART 2: organizations.mode field
-- ===========================================

ALTER TABLE organizations
    ADD COLUMN mode TEXT NOT NULL DEFAULT 'solo'
        CHECK (mode IN ('solo', 'team'));

COMMENT ON COLUMN organizations.mode IS 'solo = single inspector, team = multi-user org';

-- ===========================================
-- PART 3: organization_members
-- Tracks membership with role granularity beyond users.role
-- ===========================================

CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'inspector'
        CHECK (role IN ('owner', 'admin', 'project_manager', 'inspector')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

CREATE TRIGGER set_organization_members_updated_at
    BEFORE UPDATE ON organization_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PART 4: organization_invitations
-- Pending invitations to join an org
-- ===========================================

CREATE TABLE organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invited_by UUID NOT NULL REFERENCES users(id),
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'inspector'
        CHECK (role IN ('admin', 'project_manager', 'inspector')),
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_organization_invitations_updated_at
    BEFORE UPDATE ON organization_invitations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PART 5: teams
-- Optional sub-grouping within an org
-- ===========================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(name) >= 1),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PART 6: Indexes
-- ===========================================

CREATE INDEX idx_organization_members_org ON organization_members(organization_id);
CREATE INDEX idx_organization_members_user ON organization_members(user_id);
CREATE INDEX idx_organization_invitations_org ON organization_invitations(organization_id);
CREATE INDEX idx_organization_invitations_email ON organization_invitations(email);
CREATE INDEX idx_teams_org ON teams(organization_id);

-- ===========================================
-- PART 7: RLS policies for new tables
-- All use get_user_org_id() from migration 028
-- ===========================================

-- organization_members: same-org read, admin manage
CREATE POLICY "org_members_select" ON organization_members FOR SELECT
    USING (organization_id = get_user_org_id());

CREATE POLICY "org_members_insert" ON organization_members FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'project_manager')
    )
);

CREATE POLICY "org_members_update" ON organization_members FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

CREATE POLICY "org_members_delete" ON organization_members FOR DELETE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

-- organization_invitations: same-org read, admin/PM create, admin manage
CREATE POLICY "org_invitations_select" ON organization_invitations FOR SELECT
    USING (organization_id = get_user_org_id());

CREATE POLICY "org_invitations_insert" ON organization_invitations FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'project_manager')
    )
);

CREATE POLICY "org_invitations_update" ON organization_invitations FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

CREATE POLICY "org_invitations_delete" ON organization_invitations FOR DELETE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

-- teams: same-org read, admin manage
CREATE POLICY "teams_select" ON teams FOR SELECT
    USING (organization_id = get_user_org_id());

CREATE POLICY "teams_insert" ON teams FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

CREATE POLICY "teams_update" ON teams FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

CREATE POLICY "teams_delete" ON teams FOR DELETE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

-- ===========================================
-- PART 8: Backfill existing reports with snapshot data
-- Only runs on existing data — new reports will get snapshots at INSERT time from app code
-- ===========================================

-- 8A: Backfill organization_members from existing users
INSERT INTO organization_members (organization_id, user_id, role)
SELECT u.organization_id, u.id, u.role
FROM users u
WHERE u.organization_id IS NOT NULL
ON CONFLICT (organization_id, user_id) DO NOTHING;

-- 8B: Backfill snapshot fields on existing reports
-- Uses a DO block to handle optional columns (stamp_url, signature_url) that may not exist on Remote
DO $$
BEGIN
    -- Try full backfill first (all columns exist)
    BEGIN
        UPDATE delivery_reports dr
        SET
            inspector_full_name_snapshot           = u.full_name,
            inspector_license_number_snapshot      = u.inspector_settings->>'license_number',
            inspector_professional_title_snapshot  = NULL,
            inspector_education_snapshot           = u.inspector_settings->>'education',
            inspector_signature_url_snapshot       = u.signature_url,
            inspector_stamp_url_snapshot           = u.stamp_url,
            inspector_phone_snapshot               = u.phone,
            inspector_email_snapshot               = u.email,
            organization_name_snapshot             = o.name,
            organization_logo_url_snapshot         = o.logo_url,
            organization_legal_name_snapshot       = o.settings->>'legal_name',
            organization_tax_id_snapshot           = o.settings->>'tax_id',
            organization_address_snapshot          = o.settings->>'address',
            organization_phone_snapshot            = o.settings->>'phone',
            organization_email_snapshot            = o.settings->>'email',
            organization_legal_disclaimer_snapshot = o.settings->>'legal_disclaimer'
        FROM users u, organizations o
        WHERE u.id = dr.inspector_id
          AND o.id = dr.organization_id;
    EXCEPTION WHEN undefined_column THEN
        -- Fallback: backfill without optional columns that may not exist on Remote
        UPDATE delivery_reports dr
        SET
            inspector_full_name_snapshot           = u.full_name,
            inspector_license_number_snapshot      = u.inspector_settings->>'license_number',
            inspector_professional_title_snapshot  = NULL,
            inspector_education_snapshot           = u.inspector_settings->>'education',
            inspector_phone_snapshot               = u.phone,
            inspector_email_snapshot               = u.email,
            organization_name_snapshot             = o.name,
            organization_logo_url_snapshot         = o.logo_url,
            organization_legal_name_snapshot       = o.settings->>'legal_name',
            organization_tax_id_snapshot           = o.settings->>'tax_id',
            organization_address_snapshot          = o.settings->>'address',
            organization_phone_snapshot            = o.settings->>'phone',
            organization_email_snapshot            = o.settings->>'email',
            organization_legal_disclaimer_snapshot = o.settings->>'legal_disclaimer'
        FROM users u, organizations o
        WHERE u.id = dr.inspector_id
          AND o.id = dr.organization_id;
    END;
END $$;

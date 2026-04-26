-- Migration: 010_create_clients
-- Description: Clients (tenants/customers)
-- Dependencies: organizations

-- ===========================================
-- TABLE: clients
-- ===========================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id),
    name TEXT NOT NULL CHECK (char_length(name) >= 1),
    phone TEXT CHECK (phone IS NULL OR phone ~ '^0[2-9]\d{7,8}$'),
    email TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clients_org ON clients(organization_id);

CREATE TRIGGER set_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_select" ON clients FOR SELECT USING (
    organization_id = get_user_org_id()
);

CREATE POLICY "clients_insert" ON clients FOR INSERT WITH CHECK (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
    )
);

CREATE POLICY "clients_update" ON clients FOR UPDATE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid() AND role IN ('admin', 'project_manager')
    )
);

CREATE POLICY "clients_delete" ON clients FOR DELETE USING (
    organization_id = get_user_org_id()
    AND EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
);

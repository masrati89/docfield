-- Migration: 002_create_users
-- Description: Users table (extends auth.users) + auth trigger
-- Dependencies: organizations

-- ===========================================
-- TABLE: users
-- Extends Supabase auth.users with app-specific fields
-- ===========================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id),
    email TEXT NOT NULL,
    full_name TEXT NOT NULL CHECK (char_length(full_name) >= 1),
    role TEXT NOT NULL DEFAULT 'inspector'
        CHECK (role IN ('admin', 'project_manager', 'inspector')),
    phone TEXT CHECK (phone IS NULL OR phone ~ '^0[2-9]\d{7,8}$'),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_org ON users(organization_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- SELECT: users see all users in their organization
CREATE POLICY "users_select" ON users FOR SELECT USING (
    organization_id = (SELECT organization_id FROM users u WHERE u.id = auth.uid())
);

-- INSERT: admin only
CREATE POLICY "users_insert" ON users FOR INSERT WITH CHECK (
    organization_id = (SELECT organization_id FROM users u WHERE u.id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

-- UPDATE: admin can update any user in org, users can update themselves
CREATE POLICY "users_update" ON users FOR UPDATE USING (
    organization_id = (SELECT organization_id FROM users u WHERE u.id = auth.uid())
    AND (
        EXISTS (
            SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
        )
        OR id = auth.uid()
    )
);

-- DELETE: admin only (soft delete via is_active preferred)
CREATE POLICY "users_delete" ON users FOR DELETE USING (
    organization_id = (SELECT organization_id FROM users u WHERE u.id = auth.uid())
    AND EXISTS (
        SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin'
    )
);

-- ===========================================
-- AUTH TRIGGER: auto-create user profile on signup
-- Note: organization_id must be provided in user metadata during signup
-- ===========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, organization_id, email, full_name, role)
    VALUES (
        NEW.id,
        (NEW.raw_user_meta_data->>'organization_id')::uuid,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'inspector')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

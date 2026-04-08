-- Migration: 021_fix_auth_trigger_nullable_org
-- Description: Fix handle_new_user() to skip profile insert when organization_id is missing.
-- The register flow creates the org AFTER signup, then manually inserts the user profile.
-- The trigger must not crash when organization_id is absent from metadata.
-- Dependencies: 002_create_users

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _org_id UUID;
BEGIN
    _org_id := (NEW.raw_user_meta_data->>'organization_id')::uuid;

    -- Skip auto-insert if no organization_id in metadata.
    -- The register flow will create the user profile manually after creating the org.
    IF _org_id IS NULL THEN
        RETURN NEW;
    END IF;

    INSERT INTO public.users (id, organization_id, email, full_name, role)
    VALUES (
        NEW.id,
        _org_id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'inspector')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

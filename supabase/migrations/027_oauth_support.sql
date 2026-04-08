-- Migration: 025_oauth_support
-- Description: Add OAuth support to users table
--   - avatar_url column for Google profile pictures
--   - provider column to track auth method (email / google / apple)
--   - Make organization_id nullable for OAuth users who haven't completed profile setup
--   - Relax full_name CHECK constraint to allow empty string for partial OAuth profiles
--   - Update handle_new_user() trigger to extract avatar_url and provider from metadata

-- 1. Add avatar_url column (nullable)
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Add provider column with CHECK constraint
ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'email';

ALTER TABLE public.users
    ADD CONSTRAINT users_provider_check CHECK (provider IN ('email', 'google', 'apple'));

-- 3. Make organization_id nullable — OAuth users won't have an org until profile completion
ALTER TABLE public.users
    ALTER COLUMN organization_id DROP NOT NULL;

-- 4. Relax full_name constraint to allow empty string for partial OAuth profiles
ALTER TABLE public.users
    DROP CONSTRAINT IF EXISTS users_full_name_check;

ALTER TABLE public.users
    ADD CONSTRAINT users_full_name_check CHECK (char_length(full_name) >= 0);

-- 5. Update auth trigger to extract avatar_url and provider from user metadata
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _org_id UUID;
    _provider TEXT;
BEGIN
    _org_id := (NEW.raw_user_meta_data->>'organization_id')::uuid;
    _provider := COALESCE(NEW.raw_user_meta_data->>'provider', 'email');

    -- Skip auto-insert if no organization_id in metadata.
    IF _org_id IS NULL THEN
        RETURN NEW;
    END IF;

    INSERT INTO public.users (id, organization_id, email, full_name, role, avatar_url, provider)
    VALUES (
        NEW.id,
        _org_id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'inspector'),
        NEW.raw_user_meta_data->>'avatar_url',
        _provider
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

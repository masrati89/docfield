-- Migration: 023_users_self_insert_policy
-- Description: Allow authenticated users to create their own profile during registration.
-- The register flow: signup → create org → create user profile.
-- The existing users_insert policy requires the user to already exist as admin (chicken-and-egg).
-- This policy allows users to insert ONLY their own row (id = auth.uid()).
-- Dependencies: 002_create_users

-- Allow user to create their own profile row during registration
CREATE POLICY "users_insert_own" ON users FOR INSERT
    WITH CHECK (id = auth.uid());

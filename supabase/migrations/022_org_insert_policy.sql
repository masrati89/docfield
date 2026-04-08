-- Migration: 022_org_insert_policy
-- Description: Allow authenticated users to create organizations during registration.
-- The register flow: signup → create org → create user profile.
-- Without this policy, org creation fails with RLS violation.
-- Dependencies: 001_create_organizations, 002_create_users

-- Allow any authenticated user to create an org (needed during registration)
CREATE POLICY "organizations_insert" ON organizations FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

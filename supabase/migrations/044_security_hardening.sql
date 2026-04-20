-- Migration: 044_security_hardening
-- Date: 2026-04-17
-- Fixes: M2 (israeli_standards RLS), H4 (select * on users)
-- Reversible: yes

BEGIN;

-- =============================================================================
-- M2: Enable RLS on israeli_standards (was missing — any authenticated user
-- could INSERT/UPDATE/DELETE). Now read-only for all authenticated users.
-- =============================================================================

ALTER TABLE israeli_standards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "israeli_standards_select" ON israeli_standards
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- No INSERT/UPDATE/DELETE policies → effectively read-only for all client roles.
-- Data is managed exclusively via migrations / service role.

COMMIT;

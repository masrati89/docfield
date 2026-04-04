-- ===========================================
-- RLS Verification Queries — inField
-- ===========================================
-- Purpose: Verify tenant isolation works correctly.
-- Each query simulates a user from one org trying to access another org's data.
-- Expected result: 0 rows for every query (if RLS is working).
--
-- How to run:
-- 1. Start local Supabase: supabase start
-- 2. Seed data: supabase db reset
-- 3. Run each query while authenticated as a specific user
--
-- Note: These queries use set_config to simulate different auth contexts.
-- In production, RLS is enforced by Supabase Auth JWT automatically.

-- ===========================================
-- SETUP: Create two test organizations and users
-- Run this once before the verification queries
-- ===========================================

-- Create Org A
INSERT INTO organizations (id, name) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Test Org A');

-- Create Org B
INSERT INTO organizations (id, name) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Test Org B');

-- Create test users in auth.users (requires service role)
-- User A belongs to Org A
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'user_a@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"full_name": "User A", "organization_id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"}'::jsonb
);

-- User B belongs to Org B
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'user_b@test.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"full_name": "User B", "organization_id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"}'::jsonb
);

-- Ensure user profiles exist
INSERT INTO users (id, organization_id, email, full_name, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'user_a@test.com', 'User A', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'user_b@test.com', 'User B', 'admin');

-- Create test data for Org B (User A should NOT see any of this)
INSERT INTO projects (id, organization_id, name, address) VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Org B Project', 'Tel Aviv');

INSERT INTO buildings (id, project_id, organization_id, name) VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Building B1');

INSERT INTO apartments (id, building_id, organization_id, number) VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '101');

INSERT INTO delivery_reports (id, apartment_id, organization_id, inspector_id, report_type) VALUES
    ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'delivery');

INSERT INTO defects (id, delivery_report_id, organization_id, description, severity) VALUES
    ('99999999-9999-9999-9999-999999999999', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Test defect org B', 'medium');

INSERT INTO signatures (id, delivery_report_id, organization_id, signer_type, signer_name, image_url) VALUES
    ('88888888-8888-8888-8888-888888888888', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'inspector', 'User B', 'https://example.com/sig.png');


-- ===========================================
-- TEST 1: User A cannot see Org B's organization
-- Expected: 0 rows
-- ===========================================
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claims TO '{"sub": "11111111-1111-1111-1111-111111111111"}';

SELECT * FROM organizations
WHERE id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Should return 0 rows

-- ===========================================
-- TEST 2: User A cannot see Org B's users
-- Expected: 0 rows
-- ===========================================
SELECT * FROM users
WHERE organization_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Should return 0 rows

-- ===========================================
-- TEST 3: User A cannot see Org B's projects
-- Expected: 0 rows
-- ===========================================
SELECT * FROM projects
WHERE organization_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Should return 0 rows

-- ===========================================
-- TEST 4: User A cannot see Org B's delivery_reports
-- Expected: 0 rows
-- ===========================================
SELECT * FROM delivery_reports
WHERE organization_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Should return 0 rows

-- ===========================================
-- TEST 5: User A cannot see Org B's defects
-- Expected: 0 rows
-- ===========================================
SELECT * FROM defects
WHERE organization_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Should return 0 rows

-- ===========================================
-- TEST 6: User A cannot see Org B's signatures
-- Expected: 0 rows
-- ===========================================
SELECT * FROM signatures
WHERE organization_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Should return 0 rows

-- ===========================================
-- TEST 7: User A cannot see Org B's buildings
-- Expected: 0 rows
-- ===========================================
SELECT * FROM buildings
WHERE organization_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Should return 0 rows

-- ===========================================
-- TEST 8: User A cannot see Org B's apartments
-- Expected: 0 rows
-- ===========================================
SELECT * FROM apartments
WHERE organization_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
-- Should return 0 rows

-- ===========================================
-- TEST 9: User A cannot INSERT into Org B's projects
-- Expected: RLS violation error
-- ===========================================
INSERT INTO projects (organization_id, name)
VALUES ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Hacked project');
-- Should fail with RLS policy violation

-- ===========================================
-- TEST 10: User A cannot UPDATE Org B's delivery_reports
-- Expected: 0 rows affected
-- ===========================================
UPDATE delivery_reports SET status = 'completed'
WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
-- Should affect 0 rows (not visible to User A)

-- ===========================================
-- TEST 11: Signature immutability — no UPDATE possible
-- Expected: error (no UPDATE policy exists)
-- ===========================================
SET LOCAL role TO 'authenticated';
SET LOCAL request.jwt.claims TO '{"sub": "22222222-2222-2222-2222-222222222222"}';

UPDATE signatures SET signer_name = 'Tampered Name'
WHERE id = '88888888-8888-8888-8888-888888888888';
-- Should fail — no UPDATE policy on signatures

-- ===========================================
-- TEST 12: Signature immutability — no DELETE possible
-- Expected: error (no DELETE policy exists)
-- ===========================================
DELETE FROM signatures
WHERE id = '88888888-8888-8888-8888-888888888888';
-- Should fail — no DELETE policy on signatures

-- ===========================================
-- TEST 13: Anonymous user cannot access any data
-- Expected: 0 rows for all queries
-- ===========================================
SET LOCAL role TO 'anon';
SET LOCAL request.jwt.claims TO '{}';

SELECT count(*) AS org_count FROM organizations;         -- Should be 0
SELECT count(*) AS user_count FROM users;                -- Should be 0
SELECT count(*) AS project_count FROM projects;          -- Should be 0
SELECT count(*) AS report_count FROM delivery_reports;   -- Should be 0
SELECT count(*) AS defect_count FROM defects;            -- Should be 0
SELECT count(*) AS signature_count FROM signatures;      -- Should be 0

-- ===========================================
-- CLEANUP
-- ===========================================
-- Run in reverse order to respect foreign keys:
-- DELETE FROM signatures WHERE id = '88888888-8888-8888-8888-888888888888';
-- DELETE FROM defects WHERE id = '99999999-9999-9999-9999-999999999999';
-- DELETE FROM delivery_reports WHERE id = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
-- DELETE FROM apartments WHERE id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
-- DELETE FROM buildings WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
-- DELETE FROM projects WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
-- DELETE FROM users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
-- DELETE FROM auth.users WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
-- DELETE FROM organizations WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

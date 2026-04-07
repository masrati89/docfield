-- Migration: 025_add_user_first_name_profession
-- Description: Add first_name and profession columns to users table
-- These fields are collected during registration and shown on home/settings screens.

ALTER TABLE users
    ADD COLUMN first_name TEXT,
    ADD COLUMN profession TEXT
        CHECK (profession IS NULL OR profession IN (
            'engineer', 'constructor', 'inspector', 'project_manager',
            'architect', 'building_technician', 'site_manager'
        ));

COMMENT ON COLUMN users.first_name IS 'First name for greeting display (שם פרטי)';
COMMENT ON COLUMN users.profession IS 'Professional role selected during registration';

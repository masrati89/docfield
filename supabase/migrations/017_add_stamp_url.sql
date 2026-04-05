-- Add stamp_url column to users table for inspector stamp image
ALTER TABLE users ADD COLUMN IF NOT EXISTS stamp_url TEXT;

COMMENT ON COLUMN users.signature_url IS 'URL to inspector signature PNG in storage';
COMMENT ON COLUMN users.stamp_url IS 'URL to inspector stamp/logo PNG in storage';

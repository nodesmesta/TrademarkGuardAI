-- ============================================
-- Create auth_pins table for PIN authentication
-- ============================================

-- Drop table if exists (for development)
DROP TABLE IF EXISTS auth_pins CASCADE;

-- Create auth_pins table
CREATE TABLE auth_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  pin TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  
  -- Ensure email and PIN combination is unique
  CONSTRAINT unique_email_pin UNIQUE (email, pin, created_at)
);

-- Create indexes for better query performance
CREATE INDEX idx_auth_pins_email ON auth_pins(email);
CREATE INDEX idx_auth_pins_expires_at ON auth_pins(expires_at);
CREATE INDEX idx_auth_pins_used ON auth_pins(used);
CREATE INDEX idx_auth_pins_email_used_expires ON auth_pins(email, used, expires_at);

-- Add comments for documentation
COMMENT ON TABLE auth_pins IS 'Stores one-time PIN codes for email authentication';
COMMENT ON COLUMN auth_pins.id IS 'Unique identifier for the PIN record';
COMMENT ON COLUMN auth_pins.email IS 'User email address (normalized to lowercase)';
COMMENT ON COLUMN auth_pins.pin IS '6-digit PIN code (stored as text for leading zeros)';
COMMENT ON COLUMN auth_pins.created_at IS 'When the PIN was generated';
COMMENT ON COLUMN auth_pins.expires_at IS 'When the PIN expires (typically 10 minutes after creation)';
COMMENT ON COLUMN auth_pins.used IS 'Whether the PIN has been successfully used';
COMMENT ON COLUMN auth_pins.used_at IS 'Timestamp when the PIN was used';
COMMENT ON COLUMN auth_pins.attempts IS 'Number of failed verification attempts';
COMMENT ON COLUMN auth_pins.max_attempts IS 'Maximum allowed failed attempts before lockout';

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on auth_pins table
ALTER TABLE auth_pins ENABLE ROW LEVEL SECURITY;

-- Deny all direct access to auth_pins table
-- PIN operations should only be done via API routes using service role
CREATE POLICY "Deny all access to auth_pins" ON auth_pins
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- ============================================
-- Cleanup function for expired PINs
-- Run this periodically via cron or manual execution
-- ============================================

CREATE OR REPLACE FUNCTION cleanup_expired_pins()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM auth_pins
  WHERE expires_at < NOW()
  OR used = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Cleaned up % expired/used PINs', deleted_count;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired PINs (requires pg_cron extension)
-- Uncomment if pg_cron is available
-- SELECT cron.schedule(
--   'cleanup-expired-pins',
--   '*/15 * * * *',  -- Every 15 minutes
--   'SELECT cleanup_expired_pins()'
-- );

-- ============================================
-- Test data (for development only)
-- ============================================

-- Insert a test PIN (will be cleaned up automatically)
-- Uncomment to test manually
/*
INSERT INTO auth_pins (email, pin, expires_at, used, attempts, max_attempts)
VALUES (
  'test@example.com',
  '123456',
  NOW() + INTERVAL '10 minutes',
  false,
  0,
  3
);
*/

-- ============================================
-- Verification queries (for debugging)
-- ============================================

-- View all active (unused, not expired) PINs
-- SELECT * FROM auth_pins 
-- WHERE used = false AND expires_at > NOW()
-- ORDER BY created_at DESC;

-- Count active PINs by email
-- SELECT email, COUNT(*) as active_pins 
-- FROM auth_pins 
-- WHERE used = false AND expires_at > NOW()
-- GROUP BY email;

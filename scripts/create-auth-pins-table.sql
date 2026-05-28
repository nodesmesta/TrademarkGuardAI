-- Create auth_pins table for storing PIN verification codes
CREATE TABLE IF NOT EXISTS auth_pins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  pin TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Index for fast lookups by email
CREATE INDEX IF NOT EXISTS idx_auth_pins_email ON auth_pins(email);

-- Index for filtering unused PINs
CREATE INDEX IF NOT EXISTS idx_auth_pins_used ON auth_pins(used);

-- Index for expiration checks
CREATE INDEX IF NOT EXISTS idx_auth_pins_expires_at ON auth_pins(expires_at);

-- Drop old/expired PINs automatically (run this as a cron job or use Supabase Edge Functions)
-- DELETE FROM auth_pins WHERE expires_at < NOW();

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE ON auth_pins TO authenticated;
-- GRANT SELECT, INSERT, UPDATE ON auth_pins TO service_role;

-- Simple auth_pins table for PIN storage
CREATE TABLE IF NOT EXISTS auth_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  pin TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '10 minutes',
  used BOOLEAN NOT NULL DEFAULT FALSE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auth_pins_email ON auth_pins(email);
CREATE INDEX IF NOT EXISTS idx_auth_pins_expires_at ON auth_pins(expires_at);

-- Simple cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_pins()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM auth_pins
  WHERE expires_at < NOW()
  OR used = true;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
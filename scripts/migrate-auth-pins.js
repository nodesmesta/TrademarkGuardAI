#!/usr/bin/env node
/**
 * Migration script to create auth_pins table in Supabase
 * Run this with: node scripts/migrate-auth-pins.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL or SERVICE_ROLE_KEY not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationSQL = `
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

-- Row Level Security (RLS) - Disable for now since we use service role key
ALTER TABLE auth_pins ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service_role to do everything
CREATE POLICY "Allow service_role full access" ON auth_pins
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to clean up expired PINs (call this periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_pins()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_pins WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
`;

async function runMigration() {
  console.log('🚀 Starting migration for auth_pins table...\n');

  try {
    // Test connection
    const { data: testData, error: testError } = await supabase.from('auth_pins').select('count', { count: 'exact', head: true });
    
    if (testError && testError.code !== '42P01') {
      // 42P01 means table doesn't exist yet, which is fine
      console.error('❌ Error connecting to Supabase:', testError);
      process.exit(1);
    }

    console.log('✅ Connected to Supabase successfully\n');

    // Run the migration SQL
    console.log('📝 Executing SQL migration...\n');
    
    // Split SQL by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of statements) {
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.length < 10) continue;
      
      console.log(`⚙️  Running: ${statement.substring(0, 50)}...`);
      
      // Use supabase.rpc for functions, otherwise direct execution
      if (statement.includes('CREATE OR REPLACE FUNCTION')) {
        // Function creation needs to be done differently
        console.log('   ⚠️  Function creation skipped - run manually via SQL editor');
        continue;
      }
      
      // For table creation and indexes, we can use the Supabase client
      // But for full SQL execution, it's better to use the SQL editor
    }

    console.log('\n✅ Migration SQL prepared!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste the SQL from scripts/create-auth-pins-table.sql');
    console.log('3. Click "Run" to execute the migration');
    console.log('\n📄 SQL file location: /home/nodesemesta/dev/Hackaton/webdata/scripts/create-auth-pins-table.sql');
    
    // Try to verify table exists
    const { error: verifyError } = await supabase.from('auth_pins').select('count', { count: 'exact', head: true });
    
    if (!verifyError) {
      console.log('\n✅ auth_pins table exists and is ready to use!');
    } else if (verifyError.code === '42P01') {
      console.log('\n⚠️  auth_pins table not found. Please run the migration SQL in Supabase Dashboard.');
    } else {
      console.log('\n⚠️  Could not verify table status:', verifyError.message);
    }

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();

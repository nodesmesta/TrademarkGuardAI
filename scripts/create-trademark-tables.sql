-- Migration: trademark monitoring tables
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                        -- trademark/brand name
  description TEXT,
  keywords TEXT[] DEFAULT '{}',             -- additional search keywords
  platforms TEXT[] DEFAULT '{}',            -- platforms to monitor (empty = all)
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS monitoring_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  snapshot_id TEXT,                          -- Brightdata snapshot ID
  status TEXT DEFAULT 'pending',             -- pending | running | completed | failed
  platform TEXT,
  search_query TEXT,
  results JSONB DEFAULT '[]',
  violations JSONB DEFAULT '[]',
  violation_count INT DEFAULT 0,
  triggered_by TEXT DEFAULT 'cron',          -- cron | initial | manual
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_monitoring_product_id ON monitoring_results(product_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_user_id ON monitoring_results(user_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_status ON monitoring_results(status);
CREATE INDEX IF NOT EXISTS idx_monitoring_started_at ON monitoring_results(started_at DESC);

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_own_products" ON products
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "users_own_monitoring_results" ON monitoring_results
  FOR ALL USING (user_id = auth.uid());

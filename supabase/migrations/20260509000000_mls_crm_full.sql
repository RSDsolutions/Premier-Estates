-- 20260509000000_mls_crm_full.sql

-- Agencies
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  description TEXT,
  license_number TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- Agents (linked to Supabase auth users)
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  photo_url TEXT,
  bio TEXT,
  license_number TEXT,
  specialties JSONB DEFAULT '[]'::jsonb,
  listings_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Modify properties
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS mls_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS operation_type TEXT DEFAULT 'sale',
ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'house',
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS price_per_sqm NUMERIC,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC,
ADD COLUMN IF NOT EXISTS longitude NUMERIC,
ADD COLUMN IF NOT EXISTS area_total NUMERIC,
ADD COLUMN IF NOT EXISTS area_built NUMERIC,
ADD COLUMN IF NOT EXISTS bedrooms INTEGER,
ADD COLUMN IF NOT EXISTS bathrooms INTEGER,
ADD COLUMN IF NOT EXISTS parking INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS floors INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS year_built INTEGER,
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS crm_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Property Media
CREATE TABLE IF NOT EXISTS property_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  display_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE property_media ENABLE ROW LEVEL SECURITY;

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'web',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Visits alterations
ALTER TABLE visits
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS crm_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS scheduled_date DATE,
ADD COLUMN IF NOT EXISTS scheduled_time TEXT;

-- MLS Sync Log
CREATE TABLE IF NOT EXISTS mls_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT DEFAULT 'internal',
  external_mls_id TEXT,
  sync_status TEXT,
  payload JSONB,
  synced_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE mls_sync_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read active agencies" ON agencies FOR SELECT USING (active = true);
CREATE POLICY "Admin full access agencies" ON agencies USING (true);
CREATE POLICY "Public read active agents" ON agents FOR SELECT USING (active = true);
CREATE POLICY "Admin full access agents" ON agents USING (true);

CREATE POLICY "Public read media" ON property_media FOR SELECT USING (true);
CREATE POLICY "Agents can manage own property media" ON property_media USING (true);

CREATE POLICY "Agents can read assigned leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins full access sync log" ON mls_sync_log USING (true);

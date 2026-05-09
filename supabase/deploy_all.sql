-- Enable PostGIS for geospatial queries (property locations)
CREATE EXTENSION IF NOT EXISTS postgis;
-- Enable trigram matching for fast full-text property search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'agent', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('Casa','Departamento','Oficina','Local')),
  operation TEXT CHECK (operation IN ('Venta','Arriendo')),
  price NUMERIC NOT NULL,
  zone TEXT,
  beds INTEGER,
  baths INTEGER,
  area NUMERIC,
  year INTEGER,
  featured BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','sold','rented','inactive')),
  amenities TEXT[],
  photos TEXT[],
  videos TEXT[],
  location GEOGRAPHY(Point, 4326),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX properties_location_idx ON properties USING GIST(location);
CREATE INDEX properties_zone_idx ON properties(zone);
CREATE INDEX properties_type_op_idx ON properties(type, operation);
CREATE INDEX properties_title_trgm_idx ON properties USING GIN(title gin_trgm_ops);

-- Keep updated_at current
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, property_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Enable Realtime on both tables
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  docuseal_submission_id TEXT,
  doc_type TEXT DEFAULT 'purchase_contract',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','sent','signed','expired')),
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
-- ── PROFILES ──────────────────────────────────────────────────────────────────
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ── PROPERTIES ────────────────────────────────────────────────────────────────
CREATE POLICY "properties_select_active" ON properties FOR SELECT
  USING (status = 'active' OR agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent','admin')));

CREATE POLICY "properties_insert_agent" ON properties FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('agent','admin')));

CREATE POLICY "properties_update_agent" ON properties FOR UPDATE
  USING (agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "properties_delete_agent" ON properties FOR DELETE
  USING (agent_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── FAVORITES ─────────────────────────────────────────────────────────────────
CREATE POLICY "favorites_own" ON favorites USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ── VISITS ────────────────────────────────────────────────────────────────────
CREATE POLICY "visits_select" ON visits FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = agent_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "visits_insert" ON visits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "visits_update_agent" ON visits FOR UPDATE
  USING (auth.uid() = agent_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ── MESSAGES ──────────────────────────────────────────────────────────────────
CREATE POLICY "messages_select" ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages_insert" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "messages_update_own" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ── PAYMENTS ──────────────────────────────────────────────────────────────────
CREATE POLICY "payments_own" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_admin" ON payments FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ── DOCUMENTS ─────────────────────────────────────────────────────────────────
CREATE POLICY "documents_own" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "documents_insert_own" ON documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "documents_update_own" ON documents FOR UPDATE USING (auth.uid() = user_id);
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

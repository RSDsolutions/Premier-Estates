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

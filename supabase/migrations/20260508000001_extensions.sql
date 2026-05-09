-- Enable PostGIS for geospatial queries (property locations)
CREATE EXTENSION IF NOT EXISTS postgis;
-- Enable trigram matching for fast full-text property search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

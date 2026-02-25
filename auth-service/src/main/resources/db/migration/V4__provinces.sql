CREATE TABLE IF NOT EXISTS provinces (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_si TEXT NULL,
  name_ta TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Sri Lankan provinces with fixed UUIDs
INSERT INTO provinces (id, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Western Province'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Central Province'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Southern Province'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Northern Province'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Eastern Province'),
  ('550e8400-e29b-41d4-a716-446655440006', 'North Western Province'),
  ('550e8400-e29b-41d4-a716-446655440007', 'North Central Province'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Uva Province'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Sabaragamuwa Province')
ON CONFLICT (id) DO NOTHING;

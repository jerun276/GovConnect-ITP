CREATE TABLE IF NOT EXISTS authority_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  official_role_level TEXT NOT NULL,
  official_email TEXT NOT NULL,
  province_id UUID NULL,
  district_id UUID NULL,
  ds_division_id UUID NULL,
  gn_division_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_by_user_id UUID NULL,
  approved_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

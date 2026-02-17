CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  head_office_name TEXT NULL
);

CREATE TABLE IF NOT EXISTS department_offices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  district_id UUID NOT NULL,
  office_name TEXT NOT NULL,
  address TEXT NULL,
  is_head_office BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_department_offices_department_id ON department_offices(department_id);
CREATE INDEX IF NOT EXISTS idx_department_offices_district_id ON department_offices(district_id);

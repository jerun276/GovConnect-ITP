CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_code TEXT UNIQUE NOT NULL,
  submitted_by_user_id UUID NOT NULL,
  category_code TEXT NOT NULL,
  description_text TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_official_level TEXT NULL,
  target_official_user_id UUID NULL,
  direct_to_target_requested BOOLEAN NOT NULL DEFAULT false,
  selected_department_id UUID NULL,
  incident_province_id UUID NOT NULL,
  incident_district_id UUID NOT NULL,
  incident_ds_division_id UUID NOT NULL,
  incident_gn_division_id UUID NULL,
  status TEXT NOT NULL,
  priority TEXT NULL,
  risk_label TEXT NULL,
  is_rejected BOOLEAN NOT NULL DEFAULT false,
  rejected_reason TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS complaint_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  from_status TEXT NULL,
  to_status TEXT NOT NULL,
  changed_by_user_id UUID NULL,
  note TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS complaint_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  assigned_to_user_id UUID NOT NULL,
  assigned_by_user_id UUID NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assignment_reason TEXT NULL
);

CREATE TABLE IF NOT EXISTS complaint_internal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS complaint_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  created_by_user_id UUID NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_complaints_submitted_by ON complaints(submitted_by_user_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_location_district ON complaints(incident_district_id);

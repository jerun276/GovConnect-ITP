-- Drop head_office_name column from departments table
-- This column is no longer needed as head office info is stored in department_offices table

ALTER TABLE departments DROP COLUMN IF EXISTS head_office_name;

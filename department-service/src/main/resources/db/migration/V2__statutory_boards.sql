CREATE TABLE IF NOT EXISTS statutory_boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_statutory_boards_department_id ON statutory_boards(department_id);
CREATE INDEX IF NOT EXISTS idx_statutory_boards_name ON statutory_boards(name);

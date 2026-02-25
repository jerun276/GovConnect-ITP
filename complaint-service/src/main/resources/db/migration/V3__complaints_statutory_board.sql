ALTER TABLE complaints
  ADD COLUMN IF NOT EXISTS selected_statutory_board_id UUID NULL;

CREATE INDEX IF NOT EXISTS idx_complaints_selected_statutory_board_id ON complaints(selected_statutory_board_id);

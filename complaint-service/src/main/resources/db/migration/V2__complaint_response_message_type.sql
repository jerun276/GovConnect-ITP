ALTER TABLE complaint_responses
ADD COLUMN IF NOT EXISTS message_type TEXT NOT NULL DEFAULT 'AUTHORITY_RESPONSE';

CREATE INDEX IF NOT EXISTS idx_complaint_responses_complaint_id_created_at
ON complaint_responses(complaint_id, created_at);

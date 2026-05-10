CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  boyfriend_id TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  audio_url TEXT,
  caption TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_user_boyfriend_created
ON messages(user_id, boyfriend_id, created_at);

CREATE TABLE IF NOT EXISTS user_affection (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  boyfriend_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 60,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, boyfriend_id)
);

CREATE INDEX IF NOT EXISTS idx_user_affection_user_boyfriend
ON user_affection(user_id, boyfriend_id);

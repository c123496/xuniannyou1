CREATE TABLE IF NOT EXISTS user_memories (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  boyfriend_id TEXT NOT NULL,
  memory_key TEXT NOT NULL,
  memory_value TEXT NOT NULL,
  memory_type TEXT NOT NULL DEFAULT 'profile',
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.80,
  source_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, boyfriend_id, memory_key)
);

CREATE INDEX IF NOT EXISTS idx_user_memories_user_boyfriend
ON user_memories(user_id, boyfriend_id);

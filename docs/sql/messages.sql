create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  boyfriend_id text not null,
  role text not null check (role in ('user', 'assistant')),
  type text not null default 'text' check (type in ('text', 'image')),
  content text not null,
  image_url text,
  audio_url text,
  caption text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists messages_user_boyfriend_created_idx
  on messages (user_id, boyfriend_id, created_at);

alter table messages
  add column if not exists audio_url text;

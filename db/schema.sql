begin;

create table if not exists chat_transcripts (
  id bigint generated always as identity primary key,
  session_id uuid not null,
  created_at timestamptz not null default now(),
  messages jsonb not null,
  message_count integer not null check (message_count >= 0),
  finish_reason text,
  tokens_used integer not null default 0 check (tokens_used >= 0)
);

create index if not exists chat_transcripts_session_idx
  on chat_transcripts (session_id, created_at desc);

create table if not exists rate_limits (
  key text not null,
  day date not null,
  count integer not null default 0 check (count >= 0),
  primary key (key, day)
);

commit;

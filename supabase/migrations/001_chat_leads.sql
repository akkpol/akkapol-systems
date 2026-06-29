-- Run this in your Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.chat_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  messages jsonb DEFAULT '[]'::jsonb,
  message_count integer DEFAULT 0,
  finish_reason text,
  tokens_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Allow anonymous read/write (for anon key)
ALTER TABLE public.chat_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert" ON public.chat_leads
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon select" ON public.chat_leads
  FOR SELECT TO anon USING (true);

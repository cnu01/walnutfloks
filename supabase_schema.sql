-- 1. Create the table
CREATE TABLE public.call_duration_overrides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  chart_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.call_duration_overrides ENABLE ROW LEVEL SECURITY;


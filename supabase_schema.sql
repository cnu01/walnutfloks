-- 1. Create the table
CREATE TABLE public.call_duration_overrides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  chart_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.call_duration_overrides ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for anonymous access (since we are identifying by email without auth)
-- Allow anyone to read
CREATE POLICY "Enable read access for anon" 
ON public.call_duration_overrides 
FOR SELECT 
TO anon 
USING (true);

-- Allow anyone to insert
CREATE POLICY "Enable insert access for anon" 
ON public.call_duration_overrides 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anyone to update
CREATE POLICY "Enable update access for anon" 
ON public.call_duration_overrides 
FOR UPDATE 
TO anon 
USING (true) 
WITH CHECK (true);

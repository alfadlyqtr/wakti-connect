
-- Create table for meetings
CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  has_audio BOOLEAN DEFAULT true,
  audio_expires_at TIMESTAMP WITH TIME ZONE,
  audio_uploaded_at TIMESTAMP WITH TIME ZONE,
  date TEXT NOT NULL,
  location TEXT,
  summary TEXT NOT NULL DEFAULT '',
  language TEXT DEFAULT 'en',
  title TEXT,
  audio_storage_path TEXT
);

-- Add Row Level Security to meetings
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own meetings
CREATE POLICY "Users can view their own meetings" 
  ON public.meetings FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own meetings
CREATE POLICY "Users can create their own meetings" 
  ON public.meetings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own meetings
CREATE POLICY "Users can update their own meetings" 
  ON public.meetings FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own meetings
CREATE POLICY "Users can delete their own meetings" 
  ON public.meetings FOR DELETE 
  USING (auth.uid() = user_id);

-- Create table for meeting parts (for multi-part recordings)
CREATE TABLE IF NOT EXISTS public.meeting_parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  part_number INTEGER NOT NULL,
  audio_url TEXT NOT NULL,
  transcript TEXT NOT NULL DEFAULT '',
  duration INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security to meeting_parts
ALTER TABLE public.meeting_parts ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own meeting parts
CREATE POLICY "Users can view their own meeting parts" 
  ON public.meeting_parts FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_parts.meeting_id 
    AND meetings.user_id = auth.uid()
  ));

-- Policy to allow users to insert their own meeting parts
CREATE POLICY "Users can create their own meeting parts" 
  ON public.meeting_parts FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_parts.meeting_id 
    AND meetings.user_id = auth.uid()
  ));

-- Policy to allow users to update their own meeting parts
CREATE POLICY "Users can update their own meeting parts" 
  ON public.meeting_parts FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_parts.meeting_id 
    AND meetings.user_id = auth.uid()
  ));

-- Policy to allow users to delete their own meeting parts
CREATE POLICY "Users can delete their own meeting parts" 
  ON public.meeting_parts FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.meetings 
    WHERE meetings.id = meeting_parts.meeting_id 
    AND meetings.user_id = auth.uid()
  ));

-- Create RLS policy for accessing meeting recordings in storage
BEGIN;
  -- Make sure the bucket exists
  INSERT INTO storage.buckets (id, name)
  VALUES ('meeting-recordings', 'meeting-recordings')
  ON CONFLICT DO NOTHING;
  
  -- Set RLS policies for the bucket
  CREATE POLICY "Users can upload their own meeting recordings"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'meeting-recordings' AND (storage.foldername(name))[1] = auth.uid()::text);
  
  CREATE POLICY "Users can read their own meeting recordings"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'meeting-recordings' AND (storage.foldername(name))[1] = auth.uid()::text);
  
  CREATE POLICY "Users can update their own meeting recordings"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'meeting-recordings' AND (storage.foldername(name))[1] = auth.uid()::text);
  
  CREATE POLICY "Users can delete their own meeting recordings"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'meeting-recordings' AND (storage.foldername(name))[1] = auth.uid()::text);
COMMIT;


-- Add new columns to the messages table for different message types
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS message_type TEXT NOT NULL DEFAULT 'text',
ADD COLUMN IF NOT EXISTS audio_url TEXT,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create a storage bucket for message attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('message_attachments', 'message_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Add policy to allow authenticated users to upload to the bucket
CREATE POLICY "Allow authenticated users to upload files" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'message_attachments');

-- Add policy to allow anyone to view the files
CREATE POLICY "Allow public access to files" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'message_attachments');

-- Make sure the expire_old_messages function exists
CREATE OR REPLACE FUNCTION public.expire_old_messages()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.messages
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

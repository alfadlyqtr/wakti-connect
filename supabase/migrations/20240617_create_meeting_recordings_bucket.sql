
-- Create a storage bucket for meeting recordings if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('meeting-recordings', 'meeting-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Add policy to allow authenticated users to upload to the bucket
CREATE POLICY "Allow authenticated users to upload meeting recordings" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'meeting-recordings');

-- Add policy to allow authenticated users to download their recordings
CREATE POLICY "Allow authenticated users to download meeting recordings" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'meeting-recordings');


-- Add expiration fields for meeting recordings
ALTER TABLE meetings 
ADD COLUMN has_audio BOOLEAN DEFAULT FALSE,
ADD COLUMN audio_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN audio_uploaded_at TIMESTAMP WITH TIME ZONE;

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

-- Create a function to delete expired audio recordings
CREATE OR REPLACE FUNCTION delete_expired_meeting_recordings()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  expired_recording RECORD;
BEGIN
  -- Find expired recordings
  FOR expired_recording IN
    SELECT id 
    FROM meetings 
    WHERE 
      has_audio = TRUE AND 
      audio_expires_at < NOW()
  LOOP
    -- Delete the file from storage
    PERFORM storage.delete('meeting-recordings', expired_recording.id || '.webm');
    
    -- Update the meeting record
    UPDATE meetings
    SET 
      has_audio = FALSE,
      audio_expires_at = NULL,
      audio_uploaded_at = NULL
    WHERE id = expired_recording.id;
  END LOOP;
END;
$$;

-- Create a cron job to run the cleanup function daily (requires pg_cron extension)
SELECT cron.schedule(
  'cleanup-expired-meeting-recordings',
  '0 0 * * *', -- Run at midnight daily
  $$SELECT delete_expired_meeting_recordings()$$
);

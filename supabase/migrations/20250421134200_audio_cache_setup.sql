
-- Create the audio_cache table
CREATE TABLE IF NOT EXISTS audio_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_hash TEXT NOT NULL UNIQUE,
  text TEXT NOT NULL,
  voice TEXT NOT NULL,
  tts_provider TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  hit_count INTEGER DEFAULT 1 NOT NULL
);

-- Create a bucket for storing audio files if it doesn't exist
-- You'll need to execute this part manually in the Supabase dashboard
-- or via their API if not already done

-- Create function to get cache by hash
CREATE OR REPLACE FUNCTION get_audio_cache_by_hash(hash_param TEXT)
RETURNS TABLE (
  id UUID,
  text_hash TEXT,
  text TEXT,
  voice TEXT,
  tts_provider TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE,
  hit_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT ac.id, ac.text_hash, ac.text, ac.voice, ac.tts_provider, ac.audio_url, 
         ac.created_at, ac.last_accessed, ac.hit_count
  FROM audio_cache ac
  WHERE ac.text_hash = hash_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update hit count
CREATE OR REPLACE FUNCTION update_audio_cache_hit_count(id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE audio_cache
  SET 
    hit_count = hit_count + 1,
    last_accessed = now()
  WHERE id = id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to insert cache entry
CREATE OR REPLACE FUNCTION insert_audio_cache(
  text_hash_param TEXT,
  text_param TEXT,
  voice_param TEXT,
  tts_provider_param TEXT,
  audio_url_param TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO audio_cache (
    text_hash,
    text,
    voice,
    tts_provider,
    audio_url,
    created_at,
    last_accessed,
    hit_count
  ) VALUES (
    text_hash_param,
    text_param,
    voice_param,
    tts_provider_param,
    audio_url_param,
    now(),
    now(),
    1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create a policy to allow authenticated users to access the cache
CREATE POLICY "Allow authenticated users to read audio_cache"
  ON audio_cache
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Add RLS to the table
ALTER TABLE audio_cache ENABLE ROW LEVEL SECURITY;

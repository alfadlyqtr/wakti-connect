
-- Check if messages table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'messages'
  ) THEN
    -- Check if message_type column exists
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'messages' 
      AND column_name = 'message_type'
    ) THEN
      -- Add message_type column
      ALTER TABLE public.messages ADD COLUMN message_type TEXT NOT NULL DEFAULT 'text';
    END IF;
    
    -- Check if audio_url column exists
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'messages' 
      AND column_name = 'audio_url'
    ) THEN
      -- Add audio_url column
      ALTER TABLE public.messages ADD COLUMN audio_url TEXT;
    END IF;
    
    -- Check if image_url column exists
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'messages' 
      AND column_name = 'image_url'
    ) THEN
      -- Add image_url column
      ALTER TABLE public.messages ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'messages' 
      AND column_name = 'updated_at'
    ) THEN
      -- Add updated_at column
      ALTER TABLE public.messages ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();
    END IF;
  END IF;
END $$;


-- Warning: This is a SQL migration script to be run manually in Supabase SQL Editor
-- This adds the due_time and completed_at columns to the tasks table if they don't exist

-- Check if due_time column exists, add it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'due_time'
  ) THEN
    ALTER TABLE tasks ADD COLUMN due_time TEXT DEFAULT NULL;
  END IF;
END $$;

-- Check if completed_at column exists, add it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE tasks ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
  END IF;
END $$;

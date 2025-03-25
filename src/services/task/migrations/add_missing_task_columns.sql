
-- Check if due_time column exists in tasks table, add it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'due_time'
  ) THEN
    ALTER TABLE tasks ADD COLUMN due_time TEXT DEFAULT NULL;
  END IF;
END $$;

-- Check if completed_at column exists in tasks table, add it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE tasks ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
  END IF;
END $$;

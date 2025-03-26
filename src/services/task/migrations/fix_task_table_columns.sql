
-- Add is_recurring column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'is_recurring'
  ) THEN
    ALTER TABLE tasks ADD COLUMN is_recurring BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Ensure due_time exists and is correctly typed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'due_time'
  ) THEN
    ALTER TABLE tasks ADD COLUMN due_time TEXT DEFAULT NULL;
  END IF;
END $$;

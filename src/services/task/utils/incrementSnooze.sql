
-- Create or replace function to increment the snooze count for a task
CREATE OR REPLACE FUNCTION increment_snooze_count(task_id_param UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Get the current snooze count
  SELECT COALESCE(snooze_count, 0) INTO current_count
  FROM tasks
  WHERE id = task_id_param;
  
  -- Return incremented count
  RETURN current_count + 1;
END;
$$;

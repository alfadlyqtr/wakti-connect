
CREATE OR REPLACE FUNCTION public.complete_job_card(job_card_id uuid, end_timestamp timestamp with time zone)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_rows integer;
BEGIN
  -- Use FOR UPDATE to lock the row during the transaction
  -- Only proceed if the job card exists and has no end_time
  PERFORM 1 FROM job_cards 
  WHERE id = job_card_id AND end_time IS NULL
  FOR UPDATE;
  
  -- Update the job card
  UPDATE job_cards
  SET 
    end_time = end_timestamp,
    updated_at = now()
  WHERE 
    id = job_card_id
    AND end_time IS NULL;
    
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  -- Return true if a row was updated, false otherwise
  RETURN affected_rows > 0;
END;
$$;

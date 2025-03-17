
-- Create a function to purge messages older than 24 hours
CREATE OR REPLACE FUNCTION public.expire_old_messages()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.messages
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Create a scheduled job to run the function daily
-- Note: This requires pg_cron extension to be enabled in Supabase
-- SELECT cron.schedule('0 0 * * *', $$SELECT expire_old_messages()$$);

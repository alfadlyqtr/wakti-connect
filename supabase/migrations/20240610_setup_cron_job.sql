
-- Create the cron job to run the expire_old_messages function every hour
-- Use the pg_cron extension (needs to be enabled in the project)
SELECT cron.schedule(
  'cleanup-expired-messages',
  '0 * * * *', -- Run every hour
  $$SELECT expire_old_messages()$$
);

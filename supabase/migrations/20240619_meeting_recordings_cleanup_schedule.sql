
-- Create a scheduled task to invoke the cleanup-meeting-recordings edge function
SELECT cron.schedule(
  'cleanup-meeting-recordings-daily',
  '0 0 * * *',  -- Run at midnight every day
  $$
  SELECT
    net.http_post(
      url:='https://sqdjqehcxpzsudhzjwbu.supabase.co/functions/v1/cleanup-meeting-recordings',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxZGpxZWhjeHB6c3VkaHpqd2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNjYxNzMsImV4cCI6MjA1NzY0MjE3M30.1YAc8f2wgeMWN-UgoH8tL14aiYme6aTewmWPgfC7j_M"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

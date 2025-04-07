
-- Add customization column to event_invitations if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'event_invitations' 
    AND column_name = 'customization' 
    AND table_schema = 'public'
  ) THEN
    -- Add the customization column as JSONB
    EXECUTE 'ALTER TABLE public.event_invitations ADD COLUMN IF NOT EXISTS customization JSONB';
    
    -- Add record to _metadata to track this table
    INSERT INTO public._metadata (table_name)
    VALUES ('event_invitations')
    ON CONFLICT (table_name) DO NOTHING;
    
    -- Log the change
    RAISE NOTICE 'Added customization column to event_invitations table';
  END IF;
END;
$$;

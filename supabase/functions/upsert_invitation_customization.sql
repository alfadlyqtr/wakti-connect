
-- This function safely upserts into the invitation_customizations table
-- It creates the table if it doesn't exist
CREATE OR REPLACE FUNCTION public.upsert_invitation_customization(
  invitation_id_param UUID,
  customization_param JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if the table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'invitation_customizations'
  ) INTO table_exists;
  
  -- Create the table if it doesn't exist
  IF NOT table_exists THEN
    CREATE TABLE public.invitation_customizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invitation_id UUID NOT NULL UNIQUE,
      customization JSONB NOT NULL DEFAULT '{}'::JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    
    -- Add a trigger for updated_at
    CREATE TRIGGER set_invitation_customization_updated_at
    BEFORE UPDATE ON public.invitation_customizations
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_set_timestamp();
  END IF;
  
  -- Insert or update the record
  INSERT INTO public.invitation_customizations (
    invitation_id, 
    customization
  )
  VALUES (
    invitation_id_param,
    customization_param
  )
  ON CONFLICT (invitation_id)
  DO UPDATE SET
    customization = customization_param,
    updated_at = NOW();
    
  RETURN TRUE;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error in upsert_invitation_customization: %', SQLERRM;
    RETURN FALSE;
END;
$$;

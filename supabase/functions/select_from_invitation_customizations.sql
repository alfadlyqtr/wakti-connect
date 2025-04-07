
-- This function safely selects from the invitation_customizations table
-- It returns null if the table doesn't exist
CREATE OR REPLACE FUNCTION public.select_from_invitation_customizations(invitation_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_json JSON;
BEGIN
  -- Check if the table exists
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'invitation_customizations'
  ) THEN
    -- If table exists, select data
    SELECT customization INTO result_json
    FROM public.invitation_customizations
    WHERE invitation_id = invitation_id_param;
    
    RETURN result_json;
  ELSE
    -- If table doesn't exist, return null
    RETURN NULL;
  END IF;
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Error in select_from_invitation_customizations: %', SQLERRM;
    RETURN NULL;
END;
$$;

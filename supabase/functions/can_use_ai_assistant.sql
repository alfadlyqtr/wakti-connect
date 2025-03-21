
CREATE OR REPLACE FUNCTION public.can_use_ai_assistant()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  user_account_type TEXT;
  is_staff BOOLEAN;
BEGIN
  -- Check if user is a staff member (staff cannot use AI)
  SELECT EXISTS (
    SELECT 1 FROM business_staff WHERE staff_id = auth.uid()
  ) INTO is_staff;
  
  IF is_staff THEN
    RETURN false;
  END IF;
  
  -- Get the user's account type
  SELECT account_type::TEXT INTO user_account_type 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Only business and individual accounts can use AI assistant
  RETURN user_account_type IN ('business', 'individual');
END;
$function$;

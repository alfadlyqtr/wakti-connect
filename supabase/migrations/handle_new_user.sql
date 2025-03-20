
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    account_type,
    business_name,
    display_name,
    created_at,
    updated_at
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    COALESCE((new.raw_user_meta_data->>'account_type')::public.account_type, 'free'::public.account_type),
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'display_name',
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    account_type = EXCLUDED.account_type,
    business_name = EXCLUDED.business_name,
    display_name = EXCLUDED.display_name,
    updated_at = now();
  RETURN new;
END;
$function$

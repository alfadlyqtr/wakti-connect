
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
    business_name
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    COALESCE((new.raw_user_meta_data->>'account_type')::public.account_type, 'free'::public.account_type),
    new.raw_user_meta_data->>'business_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$function$

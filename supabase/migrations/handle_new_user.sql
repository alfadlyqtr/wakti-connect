
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
    new.raw_user_meta_data->>'full_name', 
    (new.raw_user_meta_data->>'account_type')::public.account_type,
    new.raw_user_meta_data->>'business_name'
  );
  RETURN new;
END;
$function$

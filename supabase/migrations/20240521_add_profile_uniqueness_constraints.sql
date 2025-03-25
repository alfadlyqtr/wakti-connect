
-- Add uniqueness constraints to prevent duplicates in profiles
-- This will ensure no duplicates for:
-- 1. Display names for individual accounts
-- 2. Business names for business accounts
-- 3. Business emails for business accounts

-- First, create unique indexes with conditional clauses
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_display_name_individuals
ON profiles ((display_name)) 
WHERE account_type IN ('free', 'individual');

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_business_name
ON profiles ((business_name))
WHERE account_type = 'business' AND business_name IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_business_email
ON profiles ((business_email))
WHERE account_type = 'business' AND business_email IS NOT NULL;

-- Add a function to check profile uniqueness during registration
CREATE OR REPLACE FUNCTION check_profile_uniqueness()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_profile_count INTEGER;
BEGIN
  -- For individual accounts, check display name uniqueness
  IF NEW.account_type IN ('free', 'individual') AND NEW.display_name IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_profile_count
    FROM profiles
    WHERE display_name = NEW.display_name
      AND account_type IN ('free', 'individual')
      AND id != NEW.id;
      
    IF existing_profile_count > 0 THEN
      RAISE EXCEPTION 'A profile with this display name already exists';
    END IF;
  END IF;
  
  -- For business accounts, check business name uniqueness
  IF NEW.account_type = 'business' AND NEW.business_name IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_profile_count
    FROM profiles
    WHERE business_name = NEW.business_name
      AND account_type = 'business'
      AND id != NEW.id;
      
    IF existing_profile_count > 0 THEN
      RAISE EXCEPTION 'A business with this name already exists';
    END IF;
  END IF;
  
  -- For business accounts, check business email uniqueness
  IF NEW.account_type = 'business' AND NEW.business_email IS NOT NULL THEN
    SELECT COUNT(*) INTO existing_profile_count
    FROM profiles
    WHERE business_email = NEW.business_email
      AND account_type = 'business'
      AND id != NEW.id;
      
    IF existing_profile_count > 0 THEN
      RAISE EXCEPTION 'A business with this email already exists';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS enforce_profile_uniqueness ON profiles;
CREATE TRIGGER enforce_profile_uniqueness
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION check_profile_uniqueness();

-- Update the handle_new_user function to handle potential duplicate errors
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Try to insert with validation that will enforce uniqueness
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
      COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
      now(),
      now()
    );
  EXCEPTION 
    WHEN unique_violation THEN
      -- Handle duplicate violation more gracefully
      -- Append a random number to make the name unique
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
        CASE 
          WHEN new.raw_user_meta_data->>'business_name' IS NOT NULL 
          THEN concat(new.raw_user_meta_data->>'business_name', '-', floor(random() * 1000)::text)
          ELSE NULL
        END,
        concat(
          COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
          '-',
          floor(random() * 1000)::text
        ),
        now(),
        now()
      );
  END;
  
  RETURN new;
END;
$function$;

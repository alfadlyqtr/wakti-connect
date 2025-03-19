
-- Create enums if they don't exist yet
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type') THEN
        CREATE TYPE public.account_type AS ENUM ('free', 'individual', 'business');
    END IF;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END$$;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    account_type account_type NOT NULL DEFAULT 'free'::account_type,
    is_searchable BOOLEAN DEFAULT true,
    auto_approve_contacts BOOLEAN NOT NULL DEFAULT false,
    full_name TEXT,
    avatar_url TEXT,
    display_name TEXT,
    business_name TEXT,
    occupation TEXT,
    theme_preference TEXT DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger function for new users if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
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
    COALESCE((new.raw_user_meta_data->>'account_type')::public.account_type, 'free'::public.account_type),
    new.raw_user_meta_data->>'business_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    account_type = COALESCE(EXCLUDED.account_type, profiles.account_type),
    business_name = COALESCE(EXCLUDED.business_name, profiles.business_name),
    updated_at = NOW();
  RETURN new;
END;
$$;

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_new_user();
    END IF;
EXCEPTION
    WHEN undefined_table THEN NULL;
END$$;

-- Enable RLS on profiles table
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    CREATE POLICY "Users can view their own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id);
    
    DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;
    CREATE POLICY "Public profiles are viewable" 
    ON public.profiles 
    FOR SELECT 
    USING (is_searchable = true);
EXCEPTION
    WHEN undefined_table THEN NULL;
END$$;

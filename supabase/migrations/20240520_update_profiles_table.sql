
-- Add new business-related columns to the profiles table if they don't exist
DO $$
BEGIN
    -- Add business_email column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'business_email'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN business_email TEXT;
    END IF;

    -- Add business_phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'business_phone'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN business_phone TEXT;
    END IF;

    -- Add business_website column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'business_website'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN business_website TEXT;
    END IF;
END$$;

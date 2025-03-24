
-- Add currency_preference column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS currency_preference TEXT DEFAULT 'USD';

-- Comment on the column
COMMENT ON COLUMN public.profiles.currency_preference IS 'The preferred currency for displaying monetary values';

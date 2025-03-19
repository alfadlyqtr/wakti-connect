
-- Create access control manager table
CREATE TABLE IF NOT EXISTS public.access_control_manager (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  business_id UUID,
  permissions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.access_control_manager ENABLE ROW LEVEL SECURITY;

-- Create policies for access control manager
CREATE POLICY "Users can view their own access control entries" 
ON public.access_control_manager 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create Security Definer function to get user role safely without recursive RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  -- First check if user has an entry in access_control_manager
  SELECT role INTO user_role FROM access_control_manager WHERE user_id = auth.uid() LIMIT 1;
  
  -- If not found, fallback to profile table
  IF user_role IS NULL THEN
    SELECT account_type::text INTO user_role FROM profiles WHERE id = auth.uid();
  END IF;
  
  -- If still null, default to 'free'
  RETURN COALESCE(user_role, 'free');
END;
$$;

-- Create function to check if user is business owner
CREATE OR REPLACE FUNCTION public.is_business_owner(business_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN business_id = auth.uid();
END;
$$;

-- Create function to check if user is staff member
CREATE OR REPLACE FUNCTION public.is_staff_member(business_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM business_staff 
    WHERE staff_id = auth.uid() 
    AND business_id = $1
  );
END;
$$;

-- Create function to check if staff record belongs to user
CREATE OR REPLACE FUNCTION public.is_own_staff_record(record_id uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM business_staff 
    WHERE id = record_id 
    AND staff_id = auth.uid()
  );
END;
$$;

-- Function to check if user is business owner or staff
CREATE OR REPLACE FUNCTION public.is_business_owner_or_staff(business_uuid uuid)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM access_control_manager 
    WHERE (user_id = auth.uid() AND business_id = business_uuid) 
    OR auth.uid() = business_uuid
  );
END;
$$;

-- Create function to populate access control table with existing data
CREATE OR REPLACE FUNCTION public.populate_access_control()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add business owners
  INSERT INTO access_control_manager (user_id, role, business_id, permissions)
  SELECT 
    id, 
    account_type::text, 
    id, 
    jsonb_build_object(
      'can_manage_staff', true,
      'can_manage_services', true,
      'can_view_analytics', true,
      'can_manage_bookings', true
    )
  FROM profiles
  WHERE account_type = 'business'
  AND NOT EXISTS (
    SELECT 1 FROM access_control_manager WHERE user_id = profiles.id AND business_id = profiles.id
  );
  
  -- Add staff members
  INSERT INTO access_control_manager (user_id, role, business_id, permissions)
  SELECT 
    staff_id, 
    role, 
    business_id, 
    permissions
  FROM business_staff
  WHERE status = 'active'
  AND NOT EXISTS (
    SELECT 1 FROM access_control_manager WHERE user_id = business_staff.staff_id AND business_id = business_staff.business_id
  );
END;
$$;

-- Execute the populate function immediately
SELECT public.populate_access_control();

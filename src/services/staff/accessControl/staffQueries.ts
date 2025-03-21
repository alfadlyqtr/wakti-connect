
import { supabase } from "@/integrations/supabase/client";

/**
 * Get staff relation for the current user
 */
export const getStaffRelation = async () => {
  // Check if user is a staff member
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get staff relation
  const { data: staffData, error: staffError } = await supabase
    .from('business_staff')
    .select('business_id, permissions')
    .eq('staff_id', user.id)
    .maybeSingle();
    
  if (staffError || !staffData) return null;
  
  return staffData;
};

/**
 * Checks if a user is a business owner
 */
export const isBusinessOwner = async (userId: string) => {
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .eq('account_type', 'business')
    .maybeSingle();
    
  return !!profileData;
};

/**
 * Checks if a user is a staff member of the same business
 */
export const isStaffOfSameBusiness = async (targetUserId: string, businessId: string) => {
  const { data: targetStaffData } = await supabase
    .from('business_staff')
    .select('id')
    .eq('staff_id', targetUserId)
    .eq('business_id', businessId)
    .maybeSingle();
    
  return !!targetStaffData;
};

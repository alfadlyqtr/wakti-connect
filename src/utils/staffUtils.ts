
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user is a staff member
 * @returns Promise<boolean>
 */
export const isUserStaff = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', user.id)
      .maybeSingle();
      
    return !!data;
  } catch (error) {
    console.error("Error checking staff status:", error);
    return false;
  }
};

/**
 * Get the staff relation ID for the current user
 * @returns Promise with staff relation ID or null
 */
export const getStaffRelationId = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', user.id)
      .maybeSingle();
      
    return data?.id || null;
  } catch (error) {
    console.error("Error getting staff relation ID:", error);
    return null;
  }
};

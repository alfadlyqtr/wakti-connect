
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a business already has a co-admin
 * @param businessId The business ID to check
 * @returns Promise<boolean> true if a co-admin can be added (none exists yet)
 */
export const checkCoAdminLimit = async (businessId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('business_staff')
      .select('id')
      .eq('business_id', businessId)
      .eq('role', 'co-admin')
      .eq('status', 'active');
      
    if (error) throw error;
    
    return data.length === 0;
  } catch (error) {
    console.error("Error checking co-admin limit:", error);
    return false;
  }
};


import { supabase } from "@/integrations/supabase/client";

/**
 * Gets the business ID for the current user if they are a staff member
 */
export const getStaffBusinessId = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    const { data } = await supabase
      .from('business_staff')
      .select('business_id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    return data?.business_id || null;
  } catch (error) {
    console.error("Error getting staff business ID:", error);
    return null;
  }
};

/**
 * Gets staff profile information
 */
export const getStaffProfile = async (staffId: string) => {
  try {
    const { data } = await supabase
      .from('business_staff')
      .select('id, name, profile_image_url, business_id, position, role')
      .eq('staff_id', staffId)
      .eq('status', 'active')
      .maybeSingle();
      
    return data;
  } catch (error) {
    console.error("Error getting staff profile:", error);
    return null;
  }
};

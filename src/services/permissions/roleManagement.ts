
import { supabase } from "@/integrations/supabase/client";

// Get role information from business_staff
export const getUserRoleInfo = async (): Promise<{ 
  role: string; 
  businessId?: string;
} | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('role, business_id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.error("Error fetching user role info:", error);
      return null;
    }
    
    return {
      role: data[0].role,
      businessId: data[0].business_id
    };
  } catch (error) {
    console.error("Error in getUserRoleInfo:", error);
    return null;
  }
};

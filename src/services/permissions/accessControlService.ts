
import { supabase } from "@/integrations/supabase/client";

export interface UserRoleInfo {
  role: 'free' | 'individual' | 'business' | 'staff' | 'admin' | 'co-admin';
  businessId?: string;
  permissions?: string[];
}

/**
 * Fetches the current user's role and related permissions
 * from the access control manager function
 */
export const getUserRoleInfo = async (): Promise<UserRoleInfo | null> => {
  try {
    // First try to get the role from the RPC function
    const { data: roleData, error: roleError } = await supabase.rpc('get_user_role');
    
    if (roleError) {
      console.error("Error getting user role:", roleError);
      return null;
    }

    // Get the user session to retrieve the ID
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const userId = session.user.id;
    
    // Default role info
    const roleInfo: UserRoleInfo = {
      role: roleData || 'free',
    };
    
    // For business roles, get the business ID
    if (roleInfo.role === 'business') {
      roleInfo.businessId = userId; // For business owners, their user ID is the business ID
    } 
    // For staff roles, get the business ID they work for
    else if (['staff', 'admin', 'co-admin'].includes(roleInfo.role)) {
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('business_id, permissions')
        .eq('staff_id', userId)
        .eq('status', 'active')
        .single();
      
      if (staffData) {
        roleInfo.businessId = staffData.business_id;
        roleInfo.permissions = staffData.permissions;
      }
    }
    
    return roleInfo;
  } catch (error) {
    console.error("Error in access control service:", error);
    return null;
  }
};

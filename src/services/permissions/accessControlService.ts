
import { supabase } from "@/integrations/supabase/client";
import { PermissionLevel, StaffPermissions } from "./types";
import { extractPermissionLevel, meetsPermissionLevel } from "./permissionUtils";

// Get current user role information
export const getUserRoleInfo = async (): Promise<{ 
  role: string; 
  businessId?: string;
} | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // First, check if user is a business owner
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    } else if (profile?.account_type === 'business') {
      return {
        role: 'business',
        businessId: user.id
      };
    }
    
    // If not a business owner, check if they're staff
    const { data, error } = await supabase
      .from('business_staff')
      .select('role, business_id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error || !data || data.length === 0) {
      console.log("User is not staff, returning profile account type");
      return {
        role: profile?.account_type || 'free',
      };
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

// Get business permissions for the current user
export const getBusinessPermissions = async (businessId: string): Promise<StaffPermissions | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Check if user is the business owner
    if (user.id === businessId) {
      // Business owner has all permissions
      return {
        service_permission: 'admin',
        booking_permission: 'admin',
        staff_permission: 'admin',
        analytics_permission: 'admin'
      };
    }
    
    // Check if user is staff member with permissions
    const { data, error } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('staff_id', user.id)
      .eq('business_id', businessId)
      .eq('status', 'active')
      .single();
    
    if (error) {
      console.error("Error fetching staff permissions:", error);
      return null;
    }
    
    // Extract typed permissions from the jsonb data
    // Fix: properly type and handle JSONB data
    const permissions = data.permissions as Record<string, string> | null;
    
    const staffPermissions: StaffPermissions = {
      service_permission: extractPermissionLevel(permissions?.service_permission),
      booking_permission: extractPermissionLevel(permissions?.booking_permission),
      staff_permission: extractPermissionLevel(permissions?.staff_permission),
      analytics_permission: extractPermissionLevel(permissions?.analytics_permission)
    };
    
    return staffPermissions;
  } catch (error) {
    console.error("Error in getBusinessPermissions:", error);
    return null;
  }
};

// Export the utility functions for use elsewhere
export { extractPermissionLevel, meetsPermissionLevel };
export type { PermissionLevel, StaffPermissions };


import { supabase } from "@/integrations/supabase/client";
import { PermissionLevel, StaffPermissions } from "./types";
import { extractPermissionLevel, meetsPermissionLevel } from "./permissionUtils";

// Get current user role information with better error handling
export const getUserRoleInfo = async (): Promise<{ 
  role: string; 
  businessId?: string;
} | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    console.log("Getting role info for user:", user.id);
    
    // First check if user is a business owner
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      
      // If the profile doesn't exist, attempt to create one with free account type
      if (profileError.code === 'PGRST116') {
        console.log("Profile not found, creating default profile");
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { id: user.id, account_type: 'free' }
          ])
          .select()
          .single();
          
        if (createError) {
          console.error("Error creating default profile:", createError);
          return { role: 'free' }; // Still return free even if creation fails
        } else {
          console.log("Created default profile:", newProfile);
          return { role: 'free' };
        }
      }
      
      // For other errors, still return a default role
      return { role: 'free' };
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
    return { role: 'free' }; // Return a default role on error
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
    
    // Convert the permissions object to a safer type for access
    const permissionsObj = data.permissions as Record<string, unknown>;
    
    const staffPermissions: StaffPermissions = {
      service_permission: extractPermissionLevel(permissionsObj?.service_permission),
      booking_permission: extractPermissionLevel(permissionsObj?.booking_permission),
      staff_permission: extractPermissionLevel(permissionsObj?.staff_permission),
      analytics_permission: extractPermissionLevel(permissionsObj?.analytics_permission)
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

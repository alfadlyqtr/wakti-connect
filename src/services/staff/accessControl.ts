
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user can access a specific function
 * 
 * @param functionName The function to check access for
 * @returns Promise<boolean>
 */
export const canAccess = async (functionName: string): Promise<boolean> => {
  try {
    // Check if user is a staff member
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Get staff relation
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('staff_id', user.id)
      .maybeSingle();
      
    if (staffError || !staffData) return false;
    
    const permissions = staffData.permissions || {};
    
    // Map function names to permission keys
    const permissionMap: Record<string, string> = {
      'editTask': 'can_edit_task',
      'deleteTask': 'can_delete_task',
      'createTask': 'can_create_task',
      'createJob': 'can_create_job_cards',
      'trackHours': 'can_track_hours',
      'messageStaff': 'can_message_staff',
      'messageCustomers': 'can_message_customers',
      'viewAnalytics': 'can_view_own_analytics'
    };
    
    // Check if user has the permission
    const permissionKey = permissionMap[functionName];
    if (!permissionKey) return false;
    
    return !!permissions[permissionKey];
  } catch (error) {
    console.error("Error checking staff access:", error);
    return false;
  }
};

/**
 * Check if a staff member can message another user
 * 
 * @param targetUserId The ID of the user to message
 * @returns Promise<boolean>
 */
export const canStaffMessageUser = async (targetUserId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Get staff relation
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('business_id, permissions')
      .eq('staff_id', user.id)
      .maybeSingle();
      
    if (staffError || !staffData) return false;
    
    // Check if target user is the business owner
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', targetUserId)
      .eq('account_type', 'business')
      .maybeSingle();
      
    if (profileData) {
      // Staff can always message the business owner
      return true;
    }
    
    // Check if target user is another staff member of the same business
    const { data: targetStaffData } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', targetUserId)
      .eq('business_id', staffData.business_id)
      .maybeSingle();
      
    if (targetStaffData) {
      // Check if staff has permission to message other staff
      const permissions = staffData.permissions || {};
      return !!permissions.can_message_staff;
    }
    
    // Not a business owner or staff member - deny
    return false;
  } catch (error) {
    console.error("Error checking staff messaging permissions:", error);
    return false;
  }
};

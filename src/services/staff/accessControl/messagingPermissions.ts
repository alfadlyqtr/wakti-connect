
import { supabase } from "@/integrations/supabase/client";
import { getStaffRelation } from "./staffQueries";

/**
 * Check if the current staff user can message another user
 * @param userId The user ID to check if can be messaged
 * @returns Promise<boolean>
 */
export const canStaffMessageUser = async (userId: string): Promise<boolean> => {
  try {
    const staffData = await getStaffRelation();
    
    if (!staffData) return false;
    
    // Check if staff user has permission to message other staff
    const permissions = staffData.permissions || {};
    
    // Ensure permissions is an object before trying to access properties
    const permissionsObj = typeof permissions === 'object' && permissions !== null 
      ? permissions as Record<string, boolean>
      : {};
    
    const canMessageStaff = !!permissionsObj.can_message_staff;
    
    // Check if user is a staff member of the same business
    const { data: targetStaffData } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', userId)
      .eq('business_id', staffData.business_id)
      .maybeSingle();
      
    // If target is a staff member and staff has permission to message staff
    if (targetStaffData && canMessageStaff) {
      return true;
    }
    
    // Check if staff user has permission to message customers
    const canMessageCustomers = !!permissionsObj.can_message_customers;
    
    // Check if user is a customer of the business
    if (canMessageCustomers) {
      const { data: isCustomer } = await supabase
        .from('business_subscribers')
        .select('id')
        .eq('subscriber_id', userId)
        .eq('business_id', staffData.business_id)
        .maybeSingle();
        
      if (isCustomer) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking staff messaging permissions:", error);
    return false;
  }
};

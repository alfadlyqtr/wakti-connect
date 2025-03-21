
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user is a staff member
 * @returns Promise<boolean>
 */
export const isUserStaff = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found");
      return false;
    }
    
    console.log("Checking staff status for user:", user.id);
    
    // First check if there's a cached value for quicker response
    const cachedIsStaff = localStorage.getItem('isStaff');
    if (cachedIsStaff === 'true') {
      console.log("Using cached staff status: true");
      return true;
    }
    
    // Check if user has an entry in the business_staff table
    const { data, error } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking business_staff table:", error);
    }
    
    const isStaff = !!data;
    console.log("Staff check result:", isStaff);
    
    // Cache the result for future quick access
    if (isStaff) {
      localStorage.setItem('isStaff', 'true');
    } else {
      localStorage.removeItem('isStaff');
    }
    
    return isStaff;
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
    // First check if there's a cached value for quicker response
    const cachedStaffRelationId = localStorage.getItem('staffRelationId');
    if (cachedStaffRelationId) {
      return cachedStaffRelationId;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Error getting staff relation ID:", error);
      return null;
    }
    
    const staffRelationId = data?.id || null;
    
    // Cache the result for future quick access
    if (staffRelationId) {
      localStorage.setItem('staffRelationId', staffRelationId);
    }
    
    return staffRelationId;
  } catch (error) {
    console.error("Error getting staff relation ID:", error);
    return null;
  }
};

/**
 * Get the business ID for which the current user is a staff member
 * @returns Promise with business ID or null
 */
export const getStaffBusinessId = async (): Promise<string | null> => {
  try {
    // First check if there's a cached value for quicker response
    const cachedBusinessId = localStorage.getItem('staffBusinessId');
    if (cachedBusinessId) {
      return cachedBusinessId;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('business_id')
      .eq('staff_id', user.id)
      .maybeSingle();
      
    if (error) {
      console.error("Error getting staff business ID:", error);
      return null;
    }
    
    const businessId = data?.business_id || null;
    
    // Cache the result for future quick access
    if (businessId) {
      localStorage.setItem('staffBusinessId', businessId);
    }
    
    return businessId;
  } catch (error) {
    console.error("Error getting staff business ID:", error);
    return null;
  }
};

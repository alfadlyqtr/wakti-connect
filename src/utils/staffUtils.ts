
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
      .select('id, permissions, business_id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error("Error checking business_staff table:", error);
      throw error;
    }
    
    const isStaff = !!data;
    console.log("Staff check result:", isStaff);
    
    // Cache the result for future quick access
    if (isStaff) {
      localStorage.setItem('isStaff', 'true');
      
      // Also cache staff permissions
      if (data.permissions) {
        localStorage.setItem('staffPermissions', JSON.stringify(data.permissions));
      }
      
      // Cache staff relation ID for future quick access
      localStorage.setItem('staffRelationId', data.id);
      
      // Cache business ID too
      if (data.business_id) {
        localStorage.setItem('staffBusinessId', data.business_id);
      }
    } else {
      localStorage.removeItem('isStaff');
      localStorage.removeItem('staffPermissions');
      localStorage.removeItem('staffRelationId');
      localStorage.removeItem('staffBusinessId');
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
      .select('id, business_id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error("Error getting staff relation ID:", error);
      return null;
    }
    
    const staffRelationId = data?.id || null;
    
    // Cache the result for future quick access
    if (staffRelationId) {
      localStorage.setItem('staffRelationId', staffRelationId);
      
      // Also cache business ID
      if (data.business_id) {
        localStorage.setItem('staffBusinessId', data.business_id);
      }
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
      console.log("Using cached business ID:", cachedBusinessId);
      return cachedBusinessId;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    console.log("Fetching business ID for staff user:", user.id);
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('business_id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error("Error getting staff business ID:", error);
      return null;
    }
    
    const businessId = data?.business_id || null;
    console.log("Found business ID for staff:", businessId);
    
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

/**
 * Check if staff has a specific permission
 * @param permission The permission key to check
 * @returns boolean indicating if staff has the permission
 */
export const hasStaffPermission = (permission: string): boolean => {
  try {
    const permissionsStr = localStorage.getItem('staffPermissions');
    if (!permissionsStr) return false;
    
    const permissions = JSON.parse(permissionsStr);
    return permissions[permission] === true;
  } catch (error) {
    console.error("Error checking staff permission:", error);
    return false;
  }
};

/**
 * Get all staff permissions
 * @returns Object with all staff permissions
 */
export const getStaffPermissions = (): Record<string, boolean> => {
  try {
    const permissionsStr = localStorage.getItem('staffPermissions');
    if (!permissionsStr) return {};
    
    return JSON.parse(permissionsStr);
  } catch (error) {
    console.error("Error getting staff permissions:", error);
    return {};
  }
};

/**
 * Clear staff-related cached data
 */
export const clearStaffCache = (): void => {
  localStorage.removeItem('isStaff');
  localStorage.removeItem('staffPermissions');
  localStorage.removeItem('staffRelationId');
  localStorage.removeItem('staffBusinessId');
};

/**
 * Get the current staff work session if active
 * @param staffRelationId The staff relation ID
 * @returns Promise with active work session or null
 */
export const getActiveWorkSession = async (staffRelationId: string): Promise<any | null> => {
  try {
    if (!staffRelationId) return null;
    
    console.log("Fetching active work session for staff relation:", staffRelationId);
    
    const { data, error } = await supabase
      .from('staff_work_logs')
      .select('*')
      .eq('staff_relation_id', staffRelationId)
      .is('end_time', null)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching active work session:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error getting active work session:", error);
    return null;
  }
};

/**
 * Get jobs from the staff's business for job card creation
 * @returns Promise with jobs array or empty array
 */
export const getBusinessJobs = async (): Promise<any[]> => {
  try {
    // Get the business ID for the current staff user
    const businessId = await getStaffBusinessId();
    
    if (!businessId) {
      console.error("No business ID found for staff");
      throw new Error("No business ID found for current staff user");
    }
    
    console.log("Fetching jobs for business ID:", businessId);
    
    // Fetch jobs for this business
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('business_id', businessId)
      .order('name');
      
    if (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
    
    console.log("Found jobs:", data?.length || 0);
    if (data && data.length > 0) {
      console.log("Sample job:", data[0]);
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching business jobs:", error.message);
    throw new Error(`Failed to fetch business jobs: ${error.message}`);
  }
};

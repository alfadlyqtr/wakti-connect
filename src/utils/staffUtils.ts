
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

/**
 * Gets the staff relation ID for the current user
 */
export const getStaffRelationId = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    // Check if cached in localStorage
    const cachedRelationId = localStorage.getItem('staffRelationId');
    if (cachedRelationId) {
      return cachedRelationId;
    }
    
    const { data } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (data?.id) {
      // Cache for future use
      localStorage.setItem('staffRelationId', data.id);
      return data.id;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting staff relation ID:", error);
    return null;
  }
};

/**
 * Checks if the current user is a staff member
 */
export const isUserStaff = async (): Promise<boolean> => {
  try {
    // Check cached value first
    const cachedIsStaff = localStorage.getItem('isStaff');
    if (cachedIsStaff === 'true') {
      return true;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;
    
    const { data, error } = await supabase
      .from('business_staff')
      .select('id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (error) {
      console.error("Error checking staff status:", error);
      return false;
    }
    
    const isStaff = !!data;
    
    // Cache result
    localStorage.setItem('isStaff', isStaff ? 'true' : 'false');
    
    return isStaff;
  } catch (error) {
    console.error("Error checking if user is staff:", error);
    return false;
  }
};

/**
 * Gets the active work session for a staff member
 */
export const getActiveWorkSession = async (staffRelationId: string) => {
  try {
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
    console.error("Error in getActiveWorkSession:", error);
    return null;
  }
};

/**
 * Clears staff-related cache items
 */
export const clearStaffCache = async () => {
  localStorage.removeItem('staffRelationId');
  localStorage.removeItem('staffPermissions');
  localStorage.removeItem('isStaff');
  
  return true;
};

/**
 * Checks if a staff member has a specific permission
 */
export const hasStaffPermission = async (permission: string): Promise<boolean> => {
  try {
    // Get cached permissions
    const cachedPermissions = localStorage.getItem('staffPermissions');
    if (cachedPermissions) {
      const permissions = JSON.parse(cachedPermissions);
      return !!permissions[permission];
    }
    
    // Check if user is staff
    const isStaff = await isUserStaff();
    if (!isStaff) return false;
    
    // Get staff relation ID
    const staffRelationId = await getStaffRelationId();
    if (!staffRelationId) return false;
    
    // Get staff record with permissions
    const { data } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('id', staffRelationId)
      .maybeSingle();
      
    if (!data?.permissions) return false;
    
    // Cache permissions
    localStorage.setItem('staffPermissions', JSON.stringify(data.permissions));
    
    return !!data.permissions[permission];
  } catch (error) {
    console.error("Error checking staff permission:", error);
    return false;
  }
};

/**
 * Gets all permissions for a staff member
 */
export const getStaffPermissions = async () => {
  try {
    // Get cached permissions
    const cachedPermissions = localStorage.getItem('staffPermissions');
    if (cachedPermissions) {
      return JSON.parse(cachedPermissions);
    }
    
    // Check if user is staff
    const isStaff = await isUserStaff();
    if (!isStaff) return {};
    
    // Get staff relation ID
    const staffRelationId = await getStaffRelationId();
    if (!staffRelationId) return {};
    
    // Get staff record with permissions
    const { data } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('id', staffRelationId)
      .maybeSingle();
      
    if (!data?.permissions) return {};
    
    // Cache permissions
    localStorage.setItem('staffPermissions', JSON.stringify(data.permissions));
    
    return data.permissions;
  } catch (error) {
    console.error("Error getting staff permissions:", error);
    return {};
  }
};

/**
 * Gets the jobs for the current business
 */
export const getBusinessJobs = async () => {
  try {
    // First determine if user is business owner or staff
    const isStaff = await isUserStaff();
    
    let businessId: string | null = null;
    
    if (isStaff) {
      // Get staff's business ID
      businessId = await getStaffBusinessId();
    } else {
      // For business owners, their ID is the business ID
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        businessId = session.user.id;
      }
    }
    
    if (!businessId) {
      return [];
    }
    
    // Fetch jobs for this business
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('business_id', businessId);
      
    if (error) {
      console.error("Error fetching business jobs:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error in getBusinessJobs:", error);
    return [];
  }
};

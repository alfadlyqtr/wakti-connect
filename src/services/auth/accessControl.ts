
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types/user";

/**
 * Centralized function to check if a user has permission to access a specific feature
 * @param featureKey The feature key to check permission for
 * @returns Promise<boolean> Whether the user has permission
 */
export const hasPermission = async (featureKey: string): Promise<boolean> => {
  try {
    // First check if user is a super admin - they have all permissions
    const isSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
    if (isSuperAdmin) return true;
    
    // Get current user role from localStorage for quick access
    const userRole = localStorage.getItem('userRole') as UserRole;
    
    // Based on role, determine permission access
    switch (userRole) {
      case 'business':
        // Business owners have access to most features
        return getBusinessPermissions(featureKey);
      
      case 'staff':
        // Staff permissions are more restricted and stored in the database
        return getStaffPermissions(featureKey);
        
      case 'individual':
        // Individual accounts have access to personal features
        return getIndividualPermissions(featureKey);
        
      case 'free':
        // Free accounts have very limited access
        return getFreePermissions(featureKey);
        
      default:
        // Default deny for unknown roles
        return false;
    }
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};

/**
 * Check permissions for business accounts
 */
const getBusinessPermissions = (featureKey: string): boolean => {
  // Business restricted features
  const restrictedFeatures = [
    'super_admin_dashboard',
    'user_management',
    'system_configuration'
  ];
  
  return !restrictedFeatures.includes(featureKey);
};

/**
 * Check permissions for staff accounts using database permissions
 */
const getStaffPermissions = async (featureKey: string): Promise<boolean> => {
  try {
    // Staff-specific permissions mapping
    const staffFeatureMap: Record<string, boolean> = {
      'tasks_view': true,
      'job_cards_view': true,
      'jobs_management': true,
      'messages_view': true,
      'hours_tracking': true,
      'earnings_tracking': true,
    };
    
    // If the feature is in our static map, return that value directly
    if (featureKey in staffFeatureMap) {
      return staffFeatureMap[featureKey];
    }
    
    // For job cards feature specifically
    if (featureKey === 'job_cards_view') {
      return true;
    }
    
    // Get staff relation ID
    const staffRelationId = localStorage.getItem('staffRelationId');
    if (!staffRelationId) return false;
    
    // Get staff permissions from the database
    const { data: staffData, error } = await supabase
      .from('business_staff')
      .select('permissions')
      .eq('id', staffRelationId)
      .single();
      
    if (error || !staffData) return false;
    
    // Map feature keys to permission keys
    const permissionKey = mapFeatureToPermissionKey(featureKey);
    if (!permissionKey) return false;
    
    // Check if the permission exists and is true
    return !!staffData.permissions?.[permissionKey];
  } catch (error) {
    console.error("Error getting staff permissions:", error);
    return false;
  }
};

/**
 * Check permissions for individual accounts
 */
const getIndividualPermissions = (featureKey: string): boolean => {
  // Individual accounts cannot access business features
  const restrictedFeatures = [
    'staff_management',
    'business_analytics',
    'business_page',
    'services_management',
    'super_admin_dashboard',
    'user_management',
    'system_configuration'
  ];
  
  return !restrictedFeatures.includes(featureKey);
};

/**
 * Check permissions for free accounts
 */
const getFreePermissions = (featureKey: string): boolean => {
  // Free accounts can only access basic features
  const allowedFeatures = [
    'dashboard',
    'tasks_view',
    'profile_settings',
    'messages_basic'
  ];
  
  return allowedFeatures.includes(featureKey);
};

/**
 * Map feature keys to permission keys in the staff permissions object
 */
const mapFeatureToPermissionKey = (featureKey: string): string | null => {
  const permissionMap: Record<string, string> = {
    'tasks_management': 'can_manage_tasks',
    'tasks_view': 'can_view_tasks',
    'bookings_management': 'can_manage_bookings',
    'bookings_view': 'can_view_customer_bookings',
    'staff_messaging': 'can_message_staff',
    'customer_messaging': 'can_message_customers',
    'analytics_view': 'can_view_analytics',
    'profile_edit': 'can_edit_profile',
    'hours_tracking': 'can_track_hours',
    'earnings_tracking': 'can_log_earnings',
    'job_cards_create': 'can_create_job_cards'
  };
  
  return permissionMap[featureKey] || null;
};

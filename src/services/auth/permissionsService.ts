
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FeaturePermission {
  name: string;
  description: string;
  requiredRole: string;
  errorMessage: string;
}

const FEATURE_PERMISSIONS: Record<string, FeaturePermission> = {
  tasks_management: {
    name: "Tasks Management",
    description: "Create and manage tasks",
    requiredRole: "individual",
    errorMessage: "Tasks management requires an Individual or Business account"
  },
  staff_management: {
    name: "Staff Management",
    description: "Manage staff members",
    requiredRole: "business",
    errorMessage: "Staff management is only available for Business accounts"
  },
  booking_system: {
    name: "Booking System",
    description: "Manage service bookings",
    requiredRole: "business",
    errorMessage: "Booking system is only available for Business accounts"
  }
};

export async function checkFeatureAccess(featureKey: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('can_use_feature', { feature_name: featureKey });
      
    if (error) {
      console.error("Error checking feature access:", error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error("Error in checkFeatureAccess:", error);
    return false;
  }
}

export async function validateUserRole(requiredRole: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('validate_user_role', { required_role: requiredRole });
      
    if (error) {
      console.error("Error validating user role:", error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error("Error in validateUserRole:", error);
    return false;
  }
}

export function handlePermissionError(featureKey: string) {
  const feature = FEATURE_PERMISSIONS[featureKey];
  toast({
    title: "Access Restricted",
    description: feature?.errorMessage || "You don't have permission to access this feature",
    variant: "destructive"
  });
}

export async function getUserPermissions(): Promise<Record<string, boolean>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};

    const { data, error } = await supabase
      .from('access_control_manager')
      .select('permissions')
      .eq('user_id', user.id)
      .single();
      
    if (error) {
      console.error("Error fetching permissions:", error);
      return {};
    }
    
    return data?.permissions || {};
  } catch (error) {
    console.error("Error in getUserPermissions:", error);
    return {};
  }
}

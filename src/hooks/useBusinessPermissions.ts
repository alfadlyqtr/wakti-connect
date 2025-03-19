
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  PermissionLevel, 
  StaffPermissions,
  getBusinessPermissions
} from "@/services/permissions/accessControlService";

export function useBusinessPermissions(businessId?: string) {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<StaffPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // If no businessId is provided, check if user is a business owner
  const effectiveBusinessId = businessId || user?.id;

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isAuthenticated || !effectiveBusinessId) {
        setPermissions(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // If user is the business owner, they have all permissions
        if (user?.id === effectiveBusinessId) {
          setPermissions({
            service_permission: 'admin',
            booking_permission: 'admin',
            staff_permission: 'admin',
            analytics_permission: 'admin'
          });
          return;
        }
        
        // Otherwise, fetch permissions from the database
        const perms = await getBusinessPermissions(effectiveBusinessId);
        setPermissions(perms);
      } catch (err) {
        console.error("Error fetching business permissions:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [isAuthenticated, effectiveBusinessId, user?.id]);

  // Helper function to check if user has a specific permission level
  const hasPermission = (
    type: keyof StaffPermissions, 
    requiredLevel: PermissionLevel
  ): boolean => {
    if (!permissions) return false;
    
    // User is the business owner
    if (user?.id === effectiveBusinessId) return true;
    
    const userLevel = permissions[type];
    
    // Check permission levels based on hierarchy
    if (userLevel === 'admin') return true;
    
    // Specific level checks with proper type handling
    if (requiredLevel === 'read') {
      return ['read', 'write', 'admin'].includes(userLevel as string);
    } else if (requiredLevel === 'write') {
      return ['write', 'admin'].includes(userLevel as string);
    } else if (requiredLevel === 'admin') {
      // For admin level, we need an exact match - userLevel must be 'admin'
      // Using strict equality here, but with type assertion
      return userLevel === ('admin' as PermissionLevel);
    }
    
    return userLevel !== 'none';
  };

  return {
    permissions,
    isLoading,
    error,
    hasPermission,
    isBusinessOwner: user?.id === effectiveBusinessId
  };
}

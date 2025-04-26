
import { useAuth } from "../context/AuthContext";
import { UserRole } from "@/types/roles";

/**
 * Hook that provides role-based checks for the current user
 * This hook uses the effectiveRole from AuthContext and provides helper methods for role checks
 */
export const useUserRole = () => {
  const { effectiveRole } = useAuth();
  
  return {
    userRole: effectiveRole as UserRole,
    isIndividual: effectiveRole === 'individual',
    isBusiness: effectiveRole === 'business',
    isStaff: effectiveRole === 'staff',
    isSuperAdmin: effectiveRole === 'superadmin',
  };
};

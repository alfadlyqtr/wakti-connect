
import { useAuth } from "../context/AuthContext";
import { UserRole } from "@/types/user";

export const useUserRole = () => {
  const { effectiveRole } = useAuth();
  
  return {
    userRole: effectiveRole,
    isIndividual: effectiveRole === 'individual',
    isBusiness: effectiveRole === 'business',
    isStaff: effectiveRole === 'staff',
    isSuperAdmin: effectiveRole === 'superadmin',
    // Handle legacy 'free' comparison with type safety
    isFree: effectiveRole === null || effectiveRole === (('free' as unknown) as UserRole),
  };
};

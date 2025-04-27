
import { useAuth } from "../context/AuthContext";
import { UserRole } from "@/types/roles";

export const useUserRole = () => {
  const { effectiveRole } = useAuth();
  
  return {
    userRole: effectiveRole,
    isIndividual: effectiveRole === 'individual',
    isBusiness: effectiveRole === 'business',
    isStaff: effectiveRole === 'staff',
    isSuperAdmin: effectiveRole === 'super-admin',
    // Handle legacy 'free' comparison with type safety
    isFree: effectiveRole === null || effectiveRole === (('free' as unknown) as UserRole),
  };
};

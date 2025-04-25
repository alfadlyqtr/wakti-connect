
import { useAuth } from "../context/AuthContext";

export const useUserRole = () => {
  const { effectiveRole } = useAuth();
  
  return {
    userRole: effectiveRole,
    isIndividual: effectiveRole === 'individual',
    isBusiness: effectiveRole === 'business',
    isStaff: effectiveRole === 'staff',
    isSuperAdmin: effectiveRole === 'super-admin',
    isFree: effectiveRole === 'free',
  };
};

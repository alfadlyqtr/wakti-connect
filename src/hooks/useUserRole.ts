
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/roles';

/**
 * @deprecated Use useAuth() hook instead
 */
export const useUserRole = () => {
  const { effectiveRole: userRole, isLoading } = useAuth();
  
  console.warn(
    'useUserRole is deprecated and will be removed in a future version. ' +
    'Please use the useAuth() hook instead.'
  );
  
  return { userRole, isLoading };
};

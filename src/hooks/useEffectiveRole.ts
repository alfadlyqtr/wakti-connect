
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/roles';

/**
 * @deprecated Use useAuth() hook instead
 */
export const useEffectiveRole = () => {
  const { effectiveRole, isLoading } = useAuth();
  
  console.warn(
    'useEffectiveRole is deprecated and will be removed in a future version. ' +
    'Please use the useAuth() hook instead.'
  );
  
  return { effectiveRole, isLoading };
};


import { useState, useEffect } from 'react';
import { hasPermission } from '@/services/auth/accessControl';

/**
 * Hook to check if the current user has a specific permission
 * @param featureKey The feature key to check permission for
 * @returns Object with isAllowed, isLoading, and error state
 */
export const usePermission = (featureKey: string) => {
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const checkPermission = async () => {
      try {
        setIsLoading(true);
        const permitted = await hasPermission(featureKey);
        setIsAllowed(permitted);
        setError(null);
      } catch (err) {
        console.error("Error checking permission:", err);
        setError(err instanceof Error ? err : new Error('Unknown error checking permission'));
        setIsAllowed(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPermission();
  }, [featureKey]);
  
  return { isAllowed, isLoading, error };
};

export default usePermission;

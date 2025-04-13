
import { useState, useEffect } from 'react';
import { checkFeatureAccess, handlePermissionError } from '@/services/auth/permissionsService';

export function useFeatureAccess(featureKey: string) {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        const allowed = await checkFeatureAccess(featureKey);
        setHasAccess(allowed);
      } catch (error) {
        console.error(`Error checking access for feature ${featureKey}:`, error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccess();
  }, [featureKey]);
  
  const handleRestrictedAction = (action: () => void) => {
    if (hasAccess) {
      action();
    } else {
      handlePermissionError(featureKey);
    }
  };
  
  return { hasAccess, isLoading, handleRestrictedAction };
}


import { useState, useEffect } from 'react';
import { hasPermission } from '@/services/auth/accessControl';
import { toast } from '@/hooks/use-toast';

export function useFeatureAccess(featureKey: string) {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsLoading(true);
        const allowed = await hasPermission(featureKey);
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
      toast({
        title: "Access Restricted",
        description: `You don't have permission to use this feature: ${featureKey}`,
        variant: "destructive"
      });
    }
  };
  
  return { hasAccess, isLoading, handleRestrictedAction };
}

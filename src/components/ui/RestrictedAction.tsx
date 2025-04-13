
import React from 'react';
import { toast } from '@/hooks/use-toast';
import { usePermission } from '@/hooks/usePermission';

interface RestrictedActionProps {
  featureKey: string;
  children: React.ReactNode;
  fallbackMessage?: string;
  showFallback?: boolean;
}

/**
 * Component that renders an action button only if the user has permission
 * Otherwise shows a fallback or triggers a toast notification
 */
const RestrictedAction: React.FC<RestrictedActionProps> = ({
  featureKey,
  children,
  fallbackMessage = "You don't have permission to perform this action",
  showFallback = false
}) => {
  const { isAllowed, isLoading } = usePermission(featureKey);
  
  if (isLoading) {
    return <div className="opacity-50 cursor-not-allowed">{children}</div>;
  }
  
  if (!isAllowed) {
    const handleRestrictedClick = () => {
      toast({
        title: "Access Restricted",
        description: fallbackMessage,
        variant: "destructive"
      });
    };
    
    if (showFallback) {
      return (
        <div 
          className="opacity-50 cursor-not-allowed" 
          onClick={handleRestrictedClick}
        >
          {children}
        </div>
      );
    }
    
    // Don't render anything if not allowed and no fallback is requested
    return null;
  }
  
  return <>{children}</>;
};

export default RestrictedAction;


import React from 'react';
import { usePermissions } from '../../application/hooks/usePermissions';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface PermissionGuardProps {
  feature: string;
  children: React.ReactNode;
  redirectTo?: string;
  showToast?: boolean;
}

/**
 * Component to guard content based on feature permissions
 */
const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  feature, 
  children, 
  redirectTo = '/dashboard',
  showToast = false
}) => {
  const { hasPermission, isLoading } = usePermissions(feature);
  const { toast } = useToast();
  
  if (isLoading) {
    return <div>Checking permissions...</div>;
  }
  
  if (!hasPermission) {
    if (showToast) {
      toast({
        title: "Access Denied",
        description: `You don't have permission to access this feature.`,
        variant: "destructive"
      });
    }
    
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export default PermissionGuard;

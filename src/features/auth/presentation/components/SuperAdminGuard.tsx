
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../application/context/AuthContext';

interface SuperAdminGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Component to protect routes that only super admins should access
 */
const SuperAdminGuard: React.FC<SuperAdminGuardProps> = ({ 
  children, 
  redirectTo = '/dashboard'
}) => {
  const { isSuperAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isSuperAdmin) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export default SuperAdminGuard;

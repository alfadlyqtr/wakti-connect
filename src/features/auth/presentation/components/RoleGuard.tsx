
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../application/context/AuthContext';
import { UserRole } from '@/types/roles';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * Component to protect routes based on user roles
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard'
}) => {
  const { userRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  const hasAccess = allowedRoles.includes(userRole);
  
  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export default RoleGuard;

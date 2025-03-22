
import React from 'react';

interface StaffRoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  disallowStaff?: boolean;
  messageTitle?: string;
  messageDescription?: string;
  fallback?: React.ReactNode;
}

/**
 * Simplified version that just renders children
 * Staff-related functionality has been removed
 */
export const StaffRoleGuard: React.FC<StaffRoleGuardProps> = ({ 
  children, 
  fallback 
}) => {
  return <>{children}</>;
};

export default StaffRoleGuard;

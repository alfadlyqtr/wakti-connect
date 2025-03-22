
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
 * Staff role guard - functionality removed
 * Now just renders children as staff functionality has been removed
 */
export const StaffRoleGuard: React.FC<StaffRoleGuardProps> = ({ 
  children
}) => {
  return <>{children}</>;
};

export default StaffRoleGuard;

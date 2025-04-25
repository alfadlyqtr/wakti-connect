import React from "react";
import { UserRole } from "@/types/roles";
import { useAuth } from "../context/AuthContext";

interface RoleAccessProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that conditionally renders children based on user role
 * Only renders children if the user's role is included in allowedRoles
 */
export const RoleAccess: React.FC<RoleAccessProps> = ({ 
  allowedRoles, 
  children, 
  fallback 
}) => {
  const { hasAccess, isLoading } = useAuth();
  
  // Don't render anything while loading to prevent flashing content
  if (isLoading) {
    return null;
  }
  
  // If user has access, render children
  if (hasAccess(allowedRoles)) {
    return <>{children}</>;
  }
  
  // Otherwise render fallback or null
  return fallback ? <>{fallback}</> : null;
};

export default RoleAccess;

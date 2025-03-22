
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

interface StaffRoleGuardProps {
  children: React.ReactNode;
  disallowStaff?: boolean;
  messageTitle?: string;
  messageDescription?: string;
  redirectTo?: string;
}

/**
 * Guards routes from staff access if disallowStaff is true
 */
const StaffRoleGuard: React.FC<StaffRoleGuardProps> = ({
  children,
  disallowStaff = true,
  messageTitle = "Access Restricted",
  messageDescription = "This feature is not available for staff accounts",
  redirectTo = "/dashboard"
}) => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole');
  const isStaff = userRole === 'staff' || localStorage.getItem('isStaff') === 'true';
  
  // If user is staff and this route is restricted from staff, redirect
  if (isStaff && disallowStaff) {
    // Show toast message explaining why they can't access this route
    toast({
      title: messageTitle,
      description: messageDescription,
      variant: "destructive",
    });
    
    // Redirect to the dashboard or specified redirect path
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // If user is not staff or route is not restricted, render children
  return <>{children}</>;
};

export default StaffRoleGuard;

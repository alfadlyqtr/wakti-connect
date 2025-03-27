
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/user";

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
  redirectTo = "/dashboard/jobs" // Changed to redirect to jobs page
}) => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole') as UserRole;
  
  // Only restrict access if user is a staff member (and not also a business owner)
  if (userRole === 'staff' && disallowStaff) {
    // Show toast message explaining why they can't access this route
    toast({
      title: messageTitle,
      description: messageDescription,
      variant: "destructive",
    });
    
    // Redirect to the jobs page for staff (instead of bookings)
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // If user is not staff or route is not restricted, render children
  return <>{children}</>;
};

export default StaffRoleGuard;


import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/user";
import { ensureStaffContacts } from "@/services/contacts/contactSync";

interface StaffRoleGuardProps {
  children: React.ReactNode;
  disallowStaff?: boolean;
  messageTitle?: string;
  messageDescription?: string;
  redirectTo?: string;
}

/**
 * Guards routes from staff access if disallowStaff is true
 * Also ensures staff-business contacts are synced
 */
const StaffRoleGuard: React.FC<StaffRoleGuardProps> = ({
  children,
  disallowStaff = true,
  messageTitle = "Access Restricted",
  messageDescription = "This feature is not available for staff accounts",
  redirectTo = "/dashboard/job-cards" // Redirect to job-cards page
}) => {
  const location = useLocation();
  const userRole = localStorage.getItem('userRole') as UserRole;
  
  // Sync staff contacts when a staff member accesses allowed routes
  useEffect(() => {
    const syncContacts = async () => {
      if (userRole === 'staff' && !disallowStaff) {
        try {
          await ensureStaffContacts();
        } catch (error) {
          console.error("Error syncing staff contacts:", error);
        }
      }
    };
    
    syncContacts();
  }, [userRole, disallowStaff]);
  
  // Only restrict access if user is a staff member (and not also a business owner)
  if (userRole === 'staff' && disallowStaff) {
    // Show toast message explaining why they can't access this route
    toast({
      title: messageTitle,
      description: messageDescription,
      variant: "destructive",
    });
    
    // Redirect to the job-cards page for staff
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // If user is not staff or route is not restricted, render children
  return <>{children}</>;
};

export default StaffRoleGuard;

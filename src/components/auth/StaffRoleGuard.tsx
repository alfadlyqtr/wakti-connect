
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@/types/user";
import { ensureStaffContacts, forceSyncStaffContacts } from "@/services/contacts/contactSync";
import { clearStaffCache } from "@/utils/staffUtils";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  
  // Sync staff contacts and permissions when a staff member accesses allowed routes
  useEffect(() => {
    const syncStaffData = async () => {
      if (userRole === 'staff') {
        try {
          // First clear cached permissions to ensure we get fresh data
          await clearStaffCache();
          
          // Then ensure contacts are synced (staff-business relationship)
          const result = await forceSyncStaffContacts();
          console.log("Staff contacts sync result:", result);
          
          // Invalidate any staff-related queries to refresh UI
          queryClient.invalidateQueries({ queryKey: ['staffStats'] });
          queryClient.invalidateQueries({ queryKey: ['staffPermissions'] });
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          
          // Store user role in localStorage for quicker access
          localStorage.setItem('userRole', 'staff');
        } catch (error) {
          console.error("Error syncing staff data:", error);
        }
      }
    };
    
    syncStaffData();
    
    // Set up interval to sync every 5 minutes
    const intervalId = setInterval(syncStaffData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [userRole, queryClient]);
  
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

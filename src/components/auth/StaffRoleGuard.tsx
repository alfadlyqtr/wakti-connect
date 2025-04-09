
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
  
  // Enhanced sync staff contacts and permissions when a staff member accesses allowed routes
  useEffect(() => {
    const syncStaffData = async () => {
      if (userRole === 'staff') {
        try {
          // First clear cached permissions to ensure we get fresh data
          await clearStaffCache();
          
          // Then ensure contacts are synced (staff-business relationship)
          const result = await forceSyncStaffContacts();
          console.log("Staff contacts sync result:", result);
          
          // Set user role in localStorage for quicker access
          localStorage.setItem('userRole', 'staff');
          
          // Invalidate any staff-related queries to refresh UI with real-time data
          queryClient.invalidateQueries({ queryKey: ['staffStats'] });
          queryClient.invalidateQueries({ queryKey: ['staffPermissions'] });
          queryClient.invalidateQueries({ queryKey: ['contacts'] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
          
          // Set up recurring check for updated permissions
          const checkPermissionsInterval = setInterval(() => {
            clearStaffCache();
            queryClient.invalidateQueries({ queryKey: ['staffPermissions'] });
          }, 60000); // Check every minute
          
          return () => clearInterval(checkPermissionsInterval);
        } catch (error) {
          console.error("Error syncing staff data:", error);
        }
      }
    };
    
    syncStaffData();
    
    // Set up interval to sync every 5 minutes
    const intervalId = setInterval(() => {
      syncStaffData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [userRole, queryClient]);
  
  // Only restrict access if user is a staff member
  if (userRole === 'staff' && disallowStaff) {
    // Check if trying to access contacts page - redirect to messages with business owner instead
    if (location.pathname === "/dashboard/contacts") {
      const redirectToBusinessMessages = async () => {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: staffData } = await supabase
            .from('business_staff')
            .select('business_id')
            .eq('staff_id', (await supabase.auth.getUser()).data.user?.id)
            .eq('status', 'active')
            .single();
            
          if (staffData?.business_id) {
            return <Navigate to={`/dashboard/messages/${staffData.business_id}`} state={{ from: location }} replace />;
          }
        } catch (error) {
          console.error("Error redirecting staff:", error);
        }
        
        return <Navigate to="/dashboard/messages" state={{ from: location }} replace />;
      };
      
      return redirectToBusinessMessages();
    }
    
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


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { isUserStaff } from "@/utils/staffUtils";
import { UserRole } from "@/types/user";

export const useDashboardUserProfile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('free');
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(localStorage.getItem('isSuperAdmin') === 'true');
  
  // Fetch profile data using React Query
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['dashboardProfile'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error("No user session found");
        return null;
      }
      
      // Store user ID for other hooks to use
      setUserId(session.user.id);
      
      // Check if user is a super admin
      // Direct hard-coded ID check to prevent RLS recursion errors
      const KNOWN_SUPER_ADMIN_ID = "28e863b3-0a91-4220-8330-fbee7ecd3f96";
      
      // Direct check for hard-coded admin ID
      if (session.user.id === KNOWN_SUPER_ADMIN_ID) {
        console.log("Hard-coded super admin detected");
        setIsSuperAdmin(true);
        localStorage.setItem('isSuperAdmin', 'true');
        setUserRole('super-admin');
        
        // Return placeholder profile data
        return {
          account_type: 'super-admin'
        };
      }
      
      // Try using RPC or function to check for super admin
      try {
        const { data: isSuperAdminResult, error: rpcError } = await supabase.rpc('is_super_admin');
        
        if (!rpcError && isSuperAdminResult === true) {
          console.log("User confirmed as super admin via RPC");
          setIsSuperAdmin(true);
          localStorage.setItem('isSuperAdmin', 'true');
          setUserRole('super-admin');
          
          // Return placeholder profile data
          return {
            account_type: 'super-admin'
          };
        }
      } catch (error) {
        console.error("Error checking super admin status:", error);
        // Fall back to stored value if RPC fails
        const isStoredSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
        setIsSuperAdmin(isStoredSuperAdmin);
        
        if (isStoredSuperAdmin) {
          setUserRole('super-admin');
          return {
            account_type: 'super-admin'
          };
        }
      }
      
      // Check if user is a staff member
      const staffStatus = await isUserStaff();
      setIsStaff(staffStatus);
      
      // Fetch profile data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile data:", error);
        return null;
      }
      
      // Determine user role and store in localStorage for quick access
      const accountType = profileData?.account_type || 'free';
      
      // Set the user role with proper prioritization
      // If user is both business owner and staff, business takes priority
      const effectiveRole = accountType === 'business' ? 'business' : 
                          (staffStatus ? 'staff' : accountType);
      
      setUserRole(effectiveRole as UserRole);
      localStorage.setItem('userRole', effectiveRole);
      
      return profileData;
    },
    refetchOnWindowFocus: false,
  });
  
  // Ensure localStorage is updated when role or staff status changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('userRole', userRole);
    }
    localStorage.setItem('isStaff', isStaff ? 'true' : 'false');
  }, [userRole, isStaff]);
  
  return {
    profileData,
    profileLoading,
    userId,
    isStaff,
    userRole,
    isSuperAdmin
  };
};

export default useDashboardUserProfile;

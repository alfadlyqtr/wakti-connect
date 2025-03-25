
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { isUserStaff } from "@/utils/staffUtils";
import { UserRole } from "@/types/user";

export const useDashboardUserProfile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('free');
  
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
      
      // Check if user is a staff member
      const staffStatus = await isUserStaff();
      setIsStaff(staffStatus);
      
      // Fetch profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (error) {
        console.error("Error fetching profile data:", error);
        return null;
      }
      
      // Determine user role and store in localStorage for quick access
      const accountType = data?.account_type || 'free';
      
      // Set the user role with proper prioritization
      // If user is both business owner and staff, business takes priority
      const effectiveRole = accountType === 'business' ? 'business' : 
                          (staffStatus ? 'staff' : accountType);
      
      setUserRole(effectiveRole as UserRole);
      localStorage.setItem('userRole', effectiveRole);
      
      return data;
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
    userRole
  };
};

export default useDashboardUserProfile;


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { isUserStaff } from "@/utils/staffUtils";
import { UserRole, getEffectiveRole } from "@/types/user";

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
      // The error was here - isUserStaff() doesn't take parameters but we were passing one
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
      
      // Determine user role with proper prioritization based on our enhanced function
      const effectiveRole = getEffectiveRole(data?.account_type || 'free', staffStatus);
      setUserRole(effectiveRole);
      
      // Store in localStorage for quick access
      localStorage.setItem('userRole', effectiveRole);
      localStorage.setItem('isStaff', staffStatus ? 'true' : 'false');
      
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

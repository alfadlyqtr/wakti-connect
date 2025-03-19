
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  account_type: "free" | "individual" | "business";
  display_name: string | null;
  business_name: string | null;
  full_name: string | null;
  theme_preference: string | null;
}

export const useDashboardProfile = () => {
  const navigate = useNavigate();

  const { 
    data: profileData, 
    isLoading: profileLoading, 
    error: profileError 
  } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session found, redirecting to auth page");
          navigate("/auth");
          return null;
        }
        
        const { data: userRoleData } = await supabase.rpc('get_user_role');
        
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, business_name, full_name, theme_preference')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          if (error.code === 'PGRST116') {
            console.log("Profile not found, user may need to sign up");
            navigate("/auth");
          }
          return null;
        }
        
        return {
          ...data,
          account_type: userRoleData || 'free'
        } as ProfileData;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 300000,
  });

  // Set theme based on user preference
  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);

  // Store role in localStorage as backup
  useEffect(() => {
    if (profileData?.account_type) {
      localStorage.setItem('userRole', profileData.account_type);
    }
  }, [profileData?.account_type]);

  // Setup auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state changed in dashboard layout:", event);
      
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('userRole');
        navigate("/auth");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  return {
    profileData,
    profileLoading,
    profileError
  };
};

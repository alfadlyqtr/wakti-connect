
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { slugifyBusinessName } from "@/utils/authUtils";

export interface DashboardUserProfile {
  account_type: "free" | "individual" | "business";
  display_name: string | null;
  business_name: string | null;
  full_name: string | null;
  theme_preference: string | null;
}

export function useDashboardUserProfile() {
  const navigate = useNavigate();
  const [errorLogged, setErrorLogged] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Setup auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state changed in dashboard layout:", event);
      
      if (event === 'SIGNED_OUT') {
        // Clear stored user role on sign out
        localStorage.removeItem('userRole');
        navigate("/auth");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Fetch user profile data for the dashboard
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          console.log("No active session found, redirecting to auth page");
          navigate("/auth");
          return null;
        }
        
        // Store userId for StaffDashboardHeader
        setUserId(session.user.id);
        
        // Get user profile data first to determine primary account type
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('account_type, display_name, business_name, full_name, theme_preference')
          .eq('id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          // Handle profile error later in code
        } else {
          console.log("Profile fetched successfully:", profileData);
        }
        
        // Check if user is staff
        const { data: staffData } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', session.user.id)
          .maybeSingle();
          
        if (staffData) {
          console.log("User identified as staff member");
          setIsStaff(true);
          localStorage.setItem('isStaff', 'true');
          
          // IMPORTANT FIX: Only set userRole to 'staff' if user is NOT a business account
          if (!profileData || profileData.account_type !== 'business') {
            localStorage.setItem('userRole', 'staff');
          }
        } else {
          console.log("User is not a staff member");
          setIsStaff(false);
          localStorage.setItem('isStaff', 'false');
        }
        
        // Handle profile error from earlier
        if (profileError) {
          if (profileError.code === 'PGRST116' && !errorLogged) {
            console.log("Profile not found, user may need to sign up");
            setErrorLogged(true);
            
            // Try to create a profile for this user if it doesn't exist
            try {
              const { data: newProfileData, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  full_name: session.user.email?.split('@')[0] || 'User',
                  display_name: session.user.email?.split('@')[0] || 'User',
                  account_type: 'free'
                })
                .select()
                .single();
                
              if (createError) {
                console.error("Error creating profile:", createError);
              } else {
                console.log("Created new profile:", newProfileData);
                return newProfileData as DashboardUserProfile;
              }
            } catch (createError) {
              console.error("Failed to create profile:", createError);
            }
          }
          return null;
        }
        
        // IMPORTANT FIX: Set userRole based on account_type, prioritizing business account
        if (profileData?.account_type) {
          localStorage.setItem('userRole', profileData.account_type);
        }
        
        if (profileData?.account_type === 'business' && !profileData.business_name) {
          // If business account but no business name is set, inform the user
          toast({
            title: "Complete your business profile",
            description: "Please set your business name in your profile settings",
            action: (
              <button 
                className="bg-primary text-white px-3 py-1 rounded-md text-xs"
                onClick={() => navigate("/dashboard/settings")}
              >
                Update Profile
              </button>
            )
          });
        }
        
        return profileData as DashboardUserProfile;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  // Set theme based on user preference
  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);

  // IMPORTANT FIX: Prioritize business account type over staff status
  const userRole = profileData?.account_type === 'business' 
    ? 'business' as const 
    : (isStaff ? 'staff' as const : (profileData?.account_type || "free") as "free" | "individual" | "business");

  return {
    profileData,
    profileLoading,
    userId,
    isStaff,
    userRole,
    businessSlug: profileData?.business_name ? slugifyBusinessName(profileData.business_name) : undefined
  };
}

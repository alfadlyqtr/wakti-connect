
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { slugifyBusinessName } from "@/utils/authUtils";
import { AccountType, UserRole, getEffectiveRole } from "@/types/user";
import { getDashboardUserProfile } from "@/services/users/userProfileService";

// Correct ID for the super admin - used for direct comparison to avoid RLS issues
const SUPER_ADMIN_ID = "28e863b3-0a91-4220-8330-fbee7ecd3f96";

export interface DashboardUserProfile {
  account_type: AccountType;
  display_name: string | null;
  business_name: string | null;
  full_name: string | null;
  theme_preference: string | null;
}

export function useDashboardUserProfile() {
  const navigate = useNavigate();
  const [errorLogged, setErrorLogged] = useState(false);

  // Setup auth listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state changed in dashboard layout:", event);
      
      if (event === 'SIGNED_OUT') {
        // Clear stored user role on sign out
        localStorage.removeItem('userRole');
        localStorage.removeItem('isStaff');
        localStorage.removeItem('isSuperAdmin');
        navigate("/auth");
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  // Fetch user profile data for the dashboard
  const { data: profileResult, isLoading: profileLoading } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: getDashboardUserProfile,
    retry: 1, // Reduce retries to avoid unnecessary flickering
    retryDelay: 500,
  });

  // Set theme based on user preference
  useEffect(() => {
    if (profileResult?.profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileResult.profileData.theme_preference);
    }
  }, [profileResult?.profileData?.theme_preference]);

  return {
    profileData: profileResult?.profileData,
    profileLoading,
    userId: profileResult?.userId,
    isStaff: profileResult?.isStaff || false,
    userRole: profileResult?.userRole,
    isSuperAdmin: profileResult?.isSuperAdmin || false,
    businessSlug: profileResult?.profileData?.business_name 
      ? slugifyBusinessName(profileResult.profileData.business_name) 
      : undefined,
    isLoading: profileLoading
  };
}

export default useDashboardUserProfile;

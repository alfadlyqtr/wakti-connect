
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { slugifyBusinessName } from "@/utils/authUtils";

export function useDashboardUserProfile() {
  const navigate = useNavigate();
  
  const { 
    user,
    userId,
    isStaff,
    userRole, 
    isSuperAdmin,
    isAuthenticated,
    isLoading,
  } = useAuth();
  
  // Get profile data from the authenticated user
  const profileData = user ? {
    account_type: user.account_type || 'individual',
    display_name: user.displayName || null,
    business_name: user.business_name || null,
    full_name: user.full_name || null,
    theme_preference: user.theme_preference || null
  } : null;

  // Setup auth listener for sign out
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/auth");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return {
    profileData,
    profileLoading: isLoading,
    userId,
    isStaff,
    userRole,
    isSuperAdmin,
    businessSlug: profileData?.business_name 
      ? slugifyBusinessName(profileData.business_name) 
      : undefined,
    isLoading
  };
}

export default useDashboardUserProfile;

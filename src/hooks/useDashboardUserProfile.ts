
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { slugifyBusinessName } from "@/utils/authUtils";

export function useDashboardUserProfile() {
  const navigate = useNavigate();
  
  const { 
    user,
    userId,
    userRole, 
    isStaff,
    isSuperAdmin,
    isAuthenticated,
    isLoading,
    business_name,
    theme_preference
  } = useAuth();
  
  // Get profile data from the authenticated user
  const profileData = user ? {
    account_type: userRole,
    display_name: user.displayName || null,
    business_name: business_name || null,
    full_name: user.full_name || null,
    theme_preference: theme_preference || 'light'
  } : null;

  return {
    profileData,
    profileLoading: isLoading,
    userId,
    isStaff,
    userRole,
    isSuperAdmin,
    businessSlug: business_name 
      ? slugifyBusinessName(business_name) 
      : undefined,
    isLoading
  };
}

export default useDashboardUserProfile;

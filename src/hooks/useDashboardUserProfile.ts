
import { useQuery } from "@tanstack/react-query";
import { getDashboardUserProfile } from "@/services/users/userProfileService";
import type { UserRole } from "@/types/roles";

export function useDashboardUserProfile() {
  const { data: profileResult, isLoading: profileLoading } = useQuery({
    queryKey: ['dashboardUserProfile'],
    queryFn: getDashboardUserProfile,
    retry: 1,
    retryDelay: 500,
  });

  return {
    profileData: profileResult?.profileData,
    profileLoading,
    userId: profileResult?.userId,
    isStaff: profileResult?.isStaff || false,
    userRole: profileResult?.userRole as UserRole,
    isSuperAdmin: profileResult?.isSuperAdmin || false,
  };
}

export default useDashboardUserProfile;

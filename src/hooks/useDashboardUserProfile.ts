
import { useState, useEffect } from "react";
import { getDashboardUserProfile } from "@/services/users/userProfileService";

export const useDashboardUserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getDashboardUserProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Error loading dashboard profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { profileData, isLoading };
};

export default useDashboardUserProfile;

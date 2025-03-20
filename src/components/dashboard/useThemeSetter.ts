
import { useEffect } from "react";
import { ProfileData } from "@/hooks/useProfileData";

export const useThemeSetter = (profileData: ProfileData | null | undefined) => {
  useEffect(() => {
    if (profileData?.theme_preference) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(profileData.theme_preference);
    }
  }, [profileData?.theme_preference]);
};

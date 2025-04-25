
import { useState, useEffect } from "react";
import { getUserProfile } from "@/services/users/userProfileService";
import { UserProfile } from "@/types/user";

export const useUserProfile = (userId: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile(userId);
        setProfile(data);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  return { profile, isLoading };
};

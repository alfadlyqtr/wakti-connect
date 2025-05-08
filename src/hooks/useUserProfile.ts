
import { useState, useEffect } from "react";
import { getUserProfile } from "@/services/users/userProfileService";

// Define interface locally since we're getting type errors
interface UserProfile {
  id: string;
  full_name: string | null;
  display_name: string | null;
  business_name: string | null;
  occupation: string | null;
  account_type: "free" | "individual" | "business";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  is_searchable: boolean | null;
  theme_preference: string | null;
}

export const useUserProfile = (userId: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await getUserProfile(userId);
        setProfile(data as UserProfile);
      } catch (error) {
        console.error('Error loading user profile:', error);
        setError(error instanceof Error ? error : new Error('Unknown error loading profile'));
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  return { profile, isLoading, error };
};

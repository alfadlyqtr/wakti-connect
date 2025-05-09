
import { useState, useEffect } from 'react';
import { getPublicProfileBySlug, PublicBusinessProfile } from '@/services/profile/getPublicProfile';

export const usePublicBusinessProfile = (slug: string | undefined) => {
  const [profile, setProfile] = useState<PublicBusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!slug) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const profileData = await getPublicProfileBySlug(slug);
        setProfile(profileData);
        if (!profileData) {
          throw new Error('Profile not found');
        }
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  return { profile, isLoading, error };
};

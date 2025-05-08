
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  business_name?: string;
  full_name?: string;
  display_name?: string;
  avatar_url?: string | null;
}

export interface UserWithProfile extends User {
  profile?: UserProfile;
}

export const useUser = () => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (user) {
          // Fetch user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('business_name, full_name, display_name, avatar_url')
            .eq('id', user.id)
            .single();
          
          // Combine user and profile data
          const userWithProfile: UserWithProfile = {
            ...user,
            profile: profileData || undefined
          };
          
          setUser(userWithProfile);
        } else {
          setUser(null);
        }
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      
      if (currentUser) {
        // Fetch user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('business_name, full_name, display_name, avatar_url')
          .eq('id', currentUser.id)
          .single();
        
        // Combine user and profile data
        const userWithProfile: UserWithProfile = {
          ...currentUser,
          profile: profileData || undefined
        };
        
        setUser(userWithProfile);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};

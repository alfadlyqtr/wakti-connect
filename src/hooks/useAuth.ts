
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error getting auth session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return { user, isLoading };
};

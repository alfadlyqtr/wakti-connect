
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
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
        
        setUser(user);
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};

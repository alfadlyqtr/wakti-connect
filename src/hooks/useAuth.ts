
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthContextType } from '@/hooks/auth/types';

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // If we have a session, create a User object with the additional fields
      if (session?.user) {
        const userData: User = {
          ...session.user,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
          displayName: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || '',
          plan: session.user.user_metadata?.account_type || 'individual'
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userData: User = {
            ...session.user,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
            displayName: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name || '',
            plan: session.user.user_metadata?.account_type || 'individual'
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
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

  // Add login, logout, and register methods
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      return { error: null, data };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name?: string, 
    accountType: string = 'individual', 
    businessName?: string
  ) => {
    try {
      setIsLoading(true);
      
      // Calculate trial end date (3 days from now)
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 3);
      
      // Prepare metadata
      const metadata: Record<string, any> = {
        full_name: name || '',
        account_type: accountType,
        trial_ends_at: trialEndDate.toISOString()
      };
      
      if (businessName && accountType === 'business') {
        metadata.business_name = businessName;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin + '/auth/login'
        }
      });

      if (error) throw error;
      
      return { error: null, data };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register
  };
};

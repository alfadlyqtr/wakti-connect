
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const setupAuthListener = async () => {
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setIsAuthenticated(!!session?.user);
        }
      );
      
      return data.subscription;
    };
    
    const subscriptionPromise = setupAuthListener();
    
    return () => {
      // Cleanup the subscription when component unmounts
      subscriptionPromise.then(subscription => {
        if (subscription) subscription.unsubscribe();
      });
    };
  }, []);
  
  return isAuthenticated;
};

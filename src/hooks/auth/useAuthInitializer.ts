
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AppUser } from "@/features/auth/types";

export function useAuthInitializer() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useAuthInitializer hook initializing");
    
    let isMounted = true;
    
    // Set up the auth listener first to capture any auth events
    const setupAuthListener = () => {
      console.log("Setting up auth state listener...");
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (!isMounted) return;
          
          console.log("Auth state changed:", event, {
            hasSession: !!session,
            userId: session?.user?.id || 'none'
          });
          
          if (session) {
            // Cast the user to AppUser type
            setUser(session.user as unknown as AppUser);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
          
          setIsLoading(false);
        }
      );
      
      return subscription;
    };
    
    // Then check for an existing session
    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Session check error:", error);
          setAuthError(error.message);
          setIsLoading(false);
          setAuthInitialized(true);
          return;
        }
        
        if (data?.session) {
          console.log("Found existing session for user:", data.session.user.id);
          // Cast the user to AppUser type
          setUser(data.session.user as unknown as AppUser);
        } else {
          console.log("No session found");
        }
        
        // Always set loading to false to not block rendering
        setIsLoading(false);
        setAuthInitialized(true);
      } catch (error: any) {
        if (!isMounted) return;
        
        console.error("Unexpected error checking session:", error);
        setAuthError(error.message || "Failed to initialize authentication");
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };
    
    // Start both processes
    const subscription = setupAuthListener();
    checkSession();
    
    // Cleanup on unmount
    return () => {
      console.log("Cleaning up auth listener");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    authInitialized,
    authError,
  };
}

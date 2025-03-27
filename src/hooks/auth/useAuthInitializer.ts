
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { useProfileOperations } from "./useProfileOperations";
import { toast } from "@/components/ui/use-toast";

export function useAuthInitializer() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { createUserFromProfile, createBasicUser, createProfile } = useProfileOperations();

  useEffect(() => {
    console.log("Setting up auth state listener...");
    let mounted = true;
    let authTimeout: NodeJS.Timeout;
    
    // Create a non-blocking timeout that will ensure we don't hang indefinitely
    authTimeout = setTimeout(() => {
      if (mounted && !authInitialized) {
        console.warn("Auth initialization timed out after 15 seconds");
        setAuthError("Authentication service timed out. Please reload the page.");
        setIsLoading(false);
        setAuthInitialized(true);
      }
    }, 15000);

    // Function to handle profile data
    const processUserProfile = async (userId: string, userEmail: string) => {
      try {
        // First try to get existing profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          // Return basic user on profile error
          return createBasicUser(userId, userEmail);
        }
        
        if (profileData) {
          console.log("Found existing profile");
          return createUserFromProfile(userId, userEmail, profileData);
        }
        
        // Create new profile if it doesn't exist
        console.log("No profile found, creating new one");
        const newProfile = await createProfile(userId, userEmail);
        return newProfile ? 
          createUserFromProfile(userId, userEmail, newProfile) : 
          createBasicUser(userId, userEmail);
      } catch (error) {
        console.error("Error in profile handling:", error);
        // Return basic user on any error
        return createBasicUser(userId, userEmail);
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log("Auth state changed:", event, session?.user?.id);
        
        try {
          if (session?.user) {
            // Process user data outside the main auth callback to avoid deadlocks
            setTimeout(async () => {
              if (!mounted) return;
              try {
                const userData = await processUserProfile(
                  session.user.id, 
                  session.user.email || ""
                );
                
                if (mounted) {
                  setUser(userData);
                  setIsLoading(false);
                  setAuthInitialized(true);
                  clearTimeout(authTimeout);
                }
              } catch (error) {
                console.error("Error processing user profile:", error);
                if (mounted) {
                  setUser(createBasicUser(session.user.id, session.user.email || ""));
                  setIsLoading(false);
                  setAuthInitialized(true);
                  clearTimeout(authTimeout);
                }
              }
            }, 0);
          } else {
            // No user authenticated
            if (mounted) {
              setUser(null);
              setIsLoading(false);
              setAuthInitialized(true);
              clearTimeout(authTimeout);
            }
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          if (mounted) {
            setIsLoading(false);
            setAuthInitialized(true);
            clearTimeout(authTimeout);
          }
        }
      }
    );

    // Check for existing session once on mount
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          if (mounted) {
            setAuthError("Unable to verify your authentication status.");
            setIsLoading(false);
            setAuthInitialized(true);
            clearTimeout(authTimeout);
          }
          return;
        }
        
        if (!session) {
          console.log("No session found");
          if (mounted) {
            setUser(null);
            setIsLoading(false);
            setAuthInitialized(true);
            clearTimeout(authTimeout);
          }
          return;
        }
        
        // Process authentication outside the main auth callback
        setTimeout(async () => {
          if (!mounted) return;
          try {
            const userData = await processUserProfile(
              session.user.id, 
              session.user.email || ""
            );
            
            if (mounted) {
              setUser(userData);
              setIsLoading(false);
              setAuthInitialized(true);
              clearTimeout(authTimeout);
            }
          } catch (error) {
            console.error("Error processing initial session:", error);
            if (mounted) {
              // Set basic user data even in case of error
              setUser(createBasicUser(session.user.id, session.user.email || ""));
              setIsLoading(false);
              setAuthInitialized(true);
              clearTimeout(authTimeout);
            }
          }
        }, 0);
      } catch (error) {
        console.error("Error checking initial session:", error);
        if (mounted) {
          setAuthError(error instanceof Error ? error.message : "Error checking authentication");
          setIsLoading(false);
          setAuthInitialized(true);
          clearTimeout(authTimeout);
        }
      }
    };
    
    // Run initial session check
    checkInitialSession();

    // Clean up on unmount
    return () => {
      mounted = false;
      clearTimeout(authTimeout);
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
    setAuthError
  };
}

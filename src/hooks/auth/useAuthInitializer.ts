
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
    let authCheckComplete = false;
    let authTimeout: NodeJS.Timeout;
    
    // Function to handle profile data - isolated for clarity
    const handleUserProfile = async (userId: string, userEmail: string) => {
      try {
        // First try to get existing profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching profile:", error);
          return null;
        }
        
        if (data) {
          console.log("Found existing profile");
          return data;
        }
        
        // Create new profile if it doesn't exist
        console.log("No profile found, creating new one");
        return await createProfile(userId, userEmail || "");
      } catch (error) {
        console.error("Error in profile handling:", error);
        return null;
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Prevent multiple processing for the same event
        if (authCheckComplete && event === 'INITIAL_SESSION') {
          console.log("Ignoring duplicate INITIAL_SESSION event");
          return;
        }
        
        try {
          if (session?.user) {
            // User is authenticated
            const profileData = await handleUserProfile(
              session.user.id, 
              session.user.email || ""
            );
            
            // Set user data based on profile availability
            if (profileData) {
              setUser(createUserFromProfile(session.user.id, session.user.email || "", profileData));
            } else {
              setUser(createBasicUser(session.user.id, session.user.email || ""));
            }
          } else {
            // No user authenticated
            setUser(null);
          }
        } catch (error) {
          console.error("Error processing auth state change:", error);
          // Set basic user data even in case of error to prevent blocking the app
          if (session?.user) {
            setUser(createBasicUser(session.user.id, session.user.email || ""));
          }
        } finally {
          // Mark auth check as complete and clean up
          authCheckComplete = true;
          clearTimeout(authTimeout);
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    );

    // Check for existing session once on mount
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
          setAuthError("Unable to verify your authentication status.");
          return;
        }
        
        // If auth listener has already processed this session, don't duplicate work
        if (authCheckComplete) {
          console.log("Auth already initialized by listener");
          return;
        }
        
        // Process the session same way as in the listener
        if (session?.user) {
          const profileData = await handleUserProfile(
            session.user.id, 
            session.user.email || ""
          );
          
          if (profileData) {
            setUser(createUserFromProfile(session.user.id, session.user.email || "", profileData));
          } else {
            setUser(createBasicUser(session.user.id, session.user.email || ""));
          }
        }
      } catch (error) {
        console.error("Error checking initial session:", error);
        setAuthError(error instanceof Error ? error.message : "Error checking authentication");
      } finally {
        // Only finalize if the auth listener hasn't already done so
        if (!authCheckComplete) {
          authCheckComplete = true;
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };
    
    // Set timeout to prevent hanging indefinitely
    authTimeout = setTimeout(() => {
      if (!authCheckComplete) {
        console.warn("Auth check timed out after 15 seconds");
        setAuthError("Authentication service timed out. Please reload the page.");
        setIsLoading(false);
        setAuthInitialized(true);
      }
    }, 15000);
    
    // Run initial session check
    checkInitialSession();

    // Clean up on unmount
    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
      clearTimeout(authTimeout);
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

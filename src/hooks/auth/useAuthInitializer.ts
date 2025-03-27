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

  const { handleProfileOperation, createUserFromProfile, createBasicUser } = useProfileOperations();

  useEffect(() => {
    console.log("Setting up auth state listener...");
    let authCheckComplete = false;
    let authTimeout: NodeJS.Timeout;
    
    // First check if we can connect to Supabase
    const checkSupabaseConnection = async () => {
      try {
        const { error } = await supabase.from('_metadata').select('*').limit(1).maybeSingle();
        if (error && !error.message.includes("does not exist")) {
          console.error("Supabase connection test failed:", error);
          throw new Error("Failed to connect to database service. Please check application configuration.");
        }
      } catch (error) {
        console.warn("Metadata table may not exist yet, continuing initialization");
        // Don't block auth - this might be first run
      }
    };
    
    // Run connection check but don't await it to avoid blocking auth flow
    checkSupabaseConnection().catch(console.error);
    
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Prevent multiple state updates for the same event
        if (authCheckComplete && event === 'INITIAL_SESSION') {
          console.log("Ignoring duplicate INITIAL_SESSION event");
          return;
        }
        
        if (session?.user) {
          try {
            console.log("User authenticated, fetching profile data");
            
            // Try to get or create profile with retries
            let profileResult = null;
            try {
              profileResult = await handleProfileOperation(session.user.id, session.user.email || "");
            } catch (error) {
              console.error("Failed to handle profile operation:", error);
            }
            
            // Always create a user object, even with minimal data if profile fetch fails
            if (profileResult) {
              setUser(createUserFromProfile(session.user.id, session.user.email || "", profileResult));
            } else {
              // If we still don't have a profile, create a basic user object
              console.warn("Failed to get or create profile, using basic user data");
              setUser(createBasicUser(session.user.id, session.user.email || ""));
            }
          } catch (error: any) {
            console.error("Error processing session:", error);
            // Even in case of error, set basic user data to prevent blocking the app
            setUser(createBasicUser(session.user.id, session.user.email || ""));
            
            // Provide user feedback only for critical errors
            if (error.message && error.message.includes("database schema")) {
              toast({
                title: "Application Error",
                description: "There was a problem initializing the application. Please contact support.",
                variant: "destructive"
              });
            }
          }
        } else {
          console.log("No authenticated user");
          setUser(null);
        }
        
        authCheckComplete = true;
        clearTimeout(authTimeout);
        setIsLoading(false);
        setAuthInitialized(true);
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setAuthError("Unable to verify your authentication status.");
          return;
        }
        
        // If auth listener has already processed this session, don't duplicate the work
        if (authCheckComplete) {
          console.log("Auth check already completed by listener, skipping duplicate work");
          return;
        }
        
        if (session?.user) {
          console.log("Existing session found for user:", session.user.id);
          
          try {
            // Try to get or create profile with retries
            let profileResult = null;
            try {
              profileResult = await handleProfileOperation(session.user.id, session.user.email || "");
            } catch (error) {
              console.error("Failed to handle profile operation:", error);
            }
            
            // Always create a user object, even with minimal data if profile fetch fails
            if (profileResult) {
              setUser(createUserFromProfile(session.user.id, session.user.email || "", profileResult));
            } else {
              // If we still don't have a profile, create a basic user object
              console.warn("Failed to get or create profile, using basic user data");
              setUser(createBasicUser(session.user.id, session.user.email || ""));
            }
          } catch (error: any) {
            console.error("Error processing existing session:", error);
            // Even in case of error, set basic user data to prevent blocking the app
            setUser(createBasicUser(session.user.id, session.user.email || ""));
          }
        } else {
          console.log("No existing session found");
        }
      } catch (error: any) {
        console.error("Error checking session:", error);
        setAuthError(error.message || "Error checking authentication");
      } finally {
        // Only finalize initialization if the auth listener hasn't already done so
        if (!authCheckComplete) {
          authCheckComplete = true;
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };
    
    // Set a timeout to prevent hanging indefinitely
    authTimeout = setTimeout(() => {
      if (!authCheckComplete) {
        console.warn("Auth check timed out");
        setIsLoading(false);
        setAuthInitialized(true);
        setAuthError("Authentication service timed out. Please reload the page.");
      }
    }, 10000); // 10 second timeout
    
    // Call the checkSession function
    checkSession();

    // Clean up subscriptions and timers on unmount
    return () => {
      console.log("Cleaning up auth listener subscription");
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

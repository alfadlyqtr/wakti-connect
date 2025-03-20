
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
    
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session?.user) {
          try {
            console.log("User authenticated, fetching profile data");
            
            // Try to get or create profile with retries
            const profileResult = await handleProfileOperation(session.user.id, session.user.email || "");
            
            if (profileResult) {
              setUser(createUserFromProfile(session.user.id, session.user.email || "", profileResult));
            } else {
              // If we still don't have a profile, create a basic user object
              console.warn("Failed to get or create profile, using basic user data");
              setUser(createBasicUser(session.user.id, session.user.email || ""));
            }
          } catch (error: any) {
            console.error("Error processing session:", error);
            
            // Provide user feedback for database errors
            if (error.message && (error.message.includes("database") || 
                error.message.includes("does not exist"))) {
              toast({
                title: "Database Connection Issue",
                description: "We're having trouble connecting to our services. Please try again later.",
                variant: "destructive"
              });
            }
            
            // Even in case of error, set basic user data to prevent blocking the app
            setUser(createBasicUser(session.user.id, session.user.email || ""));
          }
        } else {
          console.log("No authenticated user");
          setUser(null);
        }
        
        authCheckComplete = true;
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
        
        if (session?.user) {
          console.log("Existing session found for user:", session.user.id);
          
          try {
            // Try to get or create profile with retries
            const profileResult = await handleProfileOperation(session.user.id, session.user.email || "");
            
            if (profileResult) {
              setUser(createUserFromProfile(session.user.id, session.user.email || "", profileResult));
            } else {
              // If we still don't have a profile, create a basic user object
              console.warn("Failed to get or create profile, using basic user data");
              setUser(createBasicUser(session.user.id, session.user.email || ""));
            }
          } catch (error: any) {
            console.error("Error processing existing session:", error);
            
            // Display toast for specific database errors
            if (error.message && error.message.includes("does not exist")) {
              toast({
                title: "Database Error",
                description: "Unable to access user profile. Please try again later or contact support.",
                variant: "destructive"
              });
            }
            
            // Even in case of error, set basic user data
            setUser(createBasicUser(session.user.id, session.user.email || ""));
          }
        } else {
          console.log("No existing session found");
        }
      } catch (error: any) {
        console.error("Error checking session:", error);
        setAuthError(error.message || "Error checking authentication");
        
        // Show toast for connection errors
        if (error.message && error.message.includes("fetch")) {
          toast({
            title: "Connection Error",
            description: "Unable to connect to authentication service. Please check your internet connection.",
            variant: "destructive"
          });
        }
      } finally {
        // Ensure we always set loading to false even if errors occur
        if (!authCheckComplete) {
          setIsLoading(false);
          setAuthInitialized(true);
        }
      }
    };
    
    // Set a timeout to prevent hanging indefinitely
    const authTimeout = setTimeout(() => {
      if (!authCheckComplete) {
        console.warn("Auth check timed out");
        setIsLoading(false);
        setAuthInitialized(true);
        setAuthError("Authentication service timed out. Please reload the page.");
        
        toast({
          title: "Authentication Timeout",
          description: "We couldn't verify your login status. Please reload the page or try logging in again.",
          variant: "destructive"
        });
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

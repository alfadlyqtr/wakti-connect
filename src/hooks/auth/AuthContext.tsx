
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, AuthContextType } from "./types";
import { useAuthOperations } from "./useAuthOperations";
import { toast } from "@/components/ui/use-toast";

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { throw new Error("Not implemented"); },
  logout: async () => { throw new Error("Not implemented"); },
  register: async (email: string, password: string, name: string, accountType?: string, businessName?: string) => { 
    throw new Error("Not implemented"); 
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the auth state hook to initialize and manage auth state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Use the auth operations hook for login, logout, register functions
  const { login, logout, register } = useAuthOperations(setUser, setIsLoading);

  // Set up auth listener and initialize auth state
  useEffect(() => {
    console.log("Setting up auth state listener...");
    let authCheckComplete = false;

    // Retry handler for profile operations
    const handleProfileOperation = async (userId: string, userEmail: string) => {
      let retries = 5; // Increased number of retries
      let delay = 1000; // Starting delay in ms, will increase with each retry
      
      while (retries > 0) {
        try {
          // Try to get profile
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle(); // Using maybeSingle instead of single to avoid errors
            
          if (error) {
            if (error.code === "PGRST116" || error.message.includes("does not exist")) {
              console.log("Profile not found or table doesn't exist, creating new profile");
              
              // Get user metadata directly
              const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
              
              if (userError) {
                console.error("Error getting user data:", userError);
                throw userError;
              }
              
              const metadata = authUser?.user_metadata || {};
              
              // Profile doesn't exist - create one with retries
              try {
                const { data: newProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert({ 
                    id: userId,
                    full_name: metadata?.full_name || userEmail?.split('@')[0] || "",
                    account_type: metadata?.account_type || "free",
                    business_name: metadata?.business_name || null,
                    display_name: metadata?.display_name || metadata?.full_name || "",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .select()
                  .maybeSingle();
                  
                if (createError) {
                  // If table doesn't exist, this will fail
                  console.error("Error creating profile:", createError);
                  throw createError;
                }
                
                console.log("Profile created successfully:", newProfile);
                return newProfile;
              } catch (createError: any) {
                console.error(`Create profile attempt ${6-retries} failed:`, createError);
                
                // If we're getting a "relation does not exist" error, we're in trouble
                if (createError.message && createError.message.includes("does not exist")) {
                  setAuthError("Database initialization error. Please contact support.");
                  throw new Error("Database schema error: profiles table not found");
                }
                
                retries--;
                if (retries === 0) throw createError;
                // Wait before retrying with exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 1.5; // Increase delay for next retry
              }
            } else {
              console.error("Error fetching profile:", error);
              
              // If we're getting a "relation does not exist" error, we're in trouble
              if (error.message && error.message.includes("does not exist")) {
                setAuthError("Database initialization error. Please contact support.");
                throw new Error("Database schema error: profiles table not found");
              }
              
              throw error;
            }
          } else {
            console.log("Profile fetched successfully:", profile);
            return profile;
          }
        } catch (error: any) {
          console.error(`Profile operation attempt ${6-retries} failed:`, error);
          
          // Handle specific database errors
          if (error.message && error.message.includes("database") || 
              error.message && error.message.includes("does not exist")) {
            setAuthError("Database connection error. Please try again later.");
          }
          
          retries--;
          if (retries === 0) throw error;
          // Wait before retrying with exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5; // Increase delay for next retry
        }
      }
      
      // This should not be reached due to throw in the loop
      return null;
    };
    
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session?.user) {
          try {
            console.log("User authenticated, fetching profile data");
            
            // Try to get or create profile with retries
            const profile = await handleProfileOperation(session.user.id, session.user.email || "");
            
            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: profile?.full_name || session.user.email?.split('@')[0] || "",
                displayName: profile?.display_name || profile?.full_name || "",
                plan: profile?.account_type || "free"
              });
            } else {
              // If we still don't have a profile, create a basic user object
              console.warn("Failed to get or create profile, using basic user data");
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: session.user.email?.split('@')[0] || "",
                plan: "free"
              });
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
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.email?.split('@')[0] || "",
              plan: "free"
            });
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
            const profile = await handleProfileOperation(session.user.id, session.user.email || "");
            
            if (profile) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: profile?.full_name || session.user.email?.split('@')[0] || "",
                displayName: profile?.display_name || profile?.full_name || "",
                plan: profile?.account_type || "free"
              });
            } else {
              // If we still don't have a profile, create a basic user object
              console.warn("Failed to get or create profile, using basic user data");
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: session.user.email?.split('@')[0] || "",
                plan: "free"
              });
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
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: session.user.email?.split('@')[0] || "",
              plan: "free"
            });
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
    
    checkSession();

    // Clean up subscriptions and timers on unmount
    return () => {
      console.log("Cleaning up auth listener subscription");
      subscription.unsubscribe();
      clearTimeout(authTimeout);
    };
  }, []);

  // Provide the auth context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  // Show a loading state until auth is initialized
  if (!authInitialized && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-transparent border-wakti-blue rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing application...</p>
          {authError && (
            <p className="mt-2 text-red-500 text-sm">{authError}</p>
          )}
        </div>
      </div>
    );
  }

  // If we have an auth error but initialization is complete, show a recovery UI
  if (authError && authInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-700 mb-4">{authError}</p>
          <p className="text-gray-600 mb-6">We're having trouble connecting to our authentication services. This might be a temporary issue.</p>
          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Reload Page
            </button>
            <button 
              onClick={() => window.location.href = '/auth/login'} 
              className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

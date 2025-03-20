
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
  register: async () => { throw new Error("Not implemented"); },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the auth state hook to initialize and manage auth state
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  // Use the auth operations hook for login, logout, register functions
  const { login, logout, register } = useAuthOperations(setUser, setIsLoading);

  // Set up auth listener and initialize auth state
  useEffect(() => {
    console.log("Setting up auth state listener...");

    // Retry handler for profile operations
    const handleProfileOperation = async (userId: string, userEmail: string) => {
      let retries = 3;
      while (retries > 0) {
        try {
          // Try to get profile
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
            
          if (error) {
            if (error.code === "PGRST116") {
              console.log("Profile not found, creating new profile");
              
              // Profile doesn't exist - create one with retries
              try {
                const { data: newProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert({ 
                    id: userId,
                    full_name: userEmail?.split('@')[0] || "",
                    account_type: "free",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .select()
                  .single();
                  
                if (createError) {
                  console.error("Error creating profile:", createError);
                  throw createError;
                }
                
                console.log("Profile created successfully:", newProfile);
                return newProfile;
              } catch (createError) {
                console.error(`Create profile attempt ${4-retries} failed:`, createError);
                retries--;
                if (retries === 0) throw createError;
                // Wait before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            } else {
              console.error("Error fetching profile:", error);
              throw error;
            }
          } else {
            console.log("Profile fetched successfully:", profile);
            return profile;
          }
        } catch (error) {
          console.error(`Profile operation attempt ${4-retries} failed:`, error);
          retries--;
          if (retries === 0) throw error;
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
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
          } catch (error) {
            console.error("Error processing session:", error);
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
        
        setIsLoading(false);
        setAuthInitialized(true);
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session } } = await supabase.auth.getSession();
        
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
          } catch (error) {
            console.error("Error processing existing session:", error);
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
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
        setAuthInitialized(true);
      }
    };
    
    checkSession();

    // Clean up subscription on unmount
    return () => {
      console.log("Cleaning up auth listener subscription");
      subscription.unsubscribe();
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

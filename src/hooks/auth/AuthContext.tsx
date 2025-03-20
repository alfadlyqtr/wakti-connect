
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
  
  // Use the auth operations hook for login, logout, register functions
  const { login, logout, register } = useAuthOperations(setUser, setIsLoading);

  // Set up auth listener and initialize auth state
  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session?.user) {
          try {
            console.log("User authenticated, fetching profile data");
            // Get profile data for user
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (error) {
              if (error.code === "PGRST116") {
                console.log("Profile not found, creating new profile");
                // Profile doesn't exist yet - attempt to create it
                const { data: newProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert({ 
                    id: session.user.id,
                    full_name: session.user.email?.split('@')[0] || "",
                    account_type: "free",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  })
                  .select()
                  .single();
                  
                if (createError) {
                  console.error("Error creating profile:", createError);
                  toast({
                    title: "Error creating profile",
                    description: "Your profile could not be created. Please try logging in again.",
                    variant: "destructive"
                  });
                } else {
                  console.log("Profile created successfully:", newProfile);
                  setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    name: newProfile?.full_name || session.user.email?.split('@')[0] || "",
                    displayName: newProfile?.display_name || newProfile?.full_name || "",
                    plan: newProfile?.account_type || "free"
                  });
                }
              } else {
                console.error("Error fetching profile:", error);
                toast({
                  title: "Error fetching profile",
                  description: "Your profile data could not be loaded.",
                  variant: "destructive"
                });
              }
            } else if (profile) {
              console.log("Profile fetched successfully:", profile);
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                name: profile?.full_name || session.user.email?.split('@')[0] || "",
                displayName: profile?.display_name || profile?.full_name || "",
                plan: profile?.account_type || "free"
              });
            }
          } catch (error) {
            console.error("Error processing session:", error);
          }
        } else {
          console.log("No authenticated user");
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Existing session found for user:", session.user.id);
          // Get profile data for user
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          if (error) {
            if (error.code === "PGRST116") {
              console.log("Profile not found for existing session, creating new profile");
              // Profile doesn't exist yet - attempt to create it
              const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert({ 
                  id: session.user.id,
                  full_name: session.user.email?.split('@')[0] || "",
                  account_type: "free",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select()
                .single();
                
              if (createError) {
                console.error("Error creating profile:", createError);
                toast({
                  title: "Error creating profile",
                  description: "Your profile could not be created. Please try logging in again.",
                  variant: "destructive"
                });
              } else {
                console.log("Profile created successfully:", newProfile);
                setUser({
                  id: session.user.id,
                  email: session.user.email || "",
                  name: newProfile?.full_name || session.user.email?.split('@')[0] || "",
                  displayName: newProfile?.display_name || newProfile?.full_name || "",
                  plan: newProfile?.account_type || "free"
                });
              }
            } else {
              console.error("Error fetching profile:", error);
              toast({
                title: "Error fetching profile",
                description: "Your profile data could not be loaded.",
                variant: "destructive"
              });
            }
          } else if (profile) {
            console.log("Profile fetched successfully for existing session:", profile);
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: profile?.full_name || session.user.email?.split('@')[0] || "",
              displayName: profile?.display_name || profile?.full_name || "",
              plan: profile?.account_type || "free"
            });
          }
        } else {
          console.log("No existing session found");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
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

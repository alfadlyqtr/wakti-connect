
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, AuthContextType } from "./types";
import { useAuthOperations } from "./useAuthOperations";

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
    // Set up Supabase auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (session?.user) {
          try {
            // Get profile data for user
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (error && error.code !== "PGRST116") {
              console.error("Error fetching profile:", error);
              throw error;
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: profile?.full_name || session.user.email?.split('@')[0] || "",
              displayName: profile?.display_name || profile?.full_name || "",
              plan: profile?.account_type || "free"
            });
          } catch (error) {
            console.error("Error processing session:", error);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get profile data for user
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          if (error && error.code !== "PGRST116") {
            console.error("Error fetching profile:", error);
            throw error;
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: profile?.full_name || session.user.email?.split('@')[0] || "",
            displayName: profile?.display_name || profile?.full_name || "",
            plan: profile?.account_type || "free"
          });
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


import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name?: string;
  email?: string;
  displayName?: string;
  plan?: "free" | "individual" | "business";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from Supabase
  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("AuthProvider: Initializing auth state");
        setIsLoading(true);
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setIsLoading(false);
          return;
        }
        
        if (!session?.user) {
          console.log("AuthProvider: No active session found");
          setIsLoading(false);
          return;
        }
        
        console.log("AuthProvider: Active session found for user:", session.user.id);
        
        // Get user profile data
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            // Don't return here, we can still set basic user info
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.full_name || session.user.email?.split('@')[0],
            displayName: profile?.display_name || profile?.full_name,
            plan: profile?.account_type || "free"
          });
          
          console.log("AuthProvider: User profile loaded successfully");
        } catch (profileError) {
          console.error("Error in profile fetch:", profileError);
          // Set basic user info if profile fetch fails
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.email?.split('@')[0],
            plan: "free"
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("AuthProvider: Auth state changed:", event);
        
        if (event === 'SIGNED_IN' && session) {
          console.log("AuthProvider: User signed in:", session.user.id);
          setIsLoading(true);
          
          try {
            // Get user profile data
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();
              
            if (profileError && profileError.code !== "PGRST116") {
              console.error("Error fetching profile:", profileError);
            }
            
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: profile?.full_name || session.user.email?.split('@')[0],
              displayName: profile?.display_name || profile?.full_name,
              plan: profile?.account_type || "free"
            });
          } catch (error) {
            console.error("Error updating user after sign in:", error);
            // Set basic user info if profile fetch fails
            setUser({
              id: session.user.id,
              email: session.user.email,
              name: session.user.email?.split('@')[0],
              plan: "free"
            });
          } finally {
            setIsLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("AuthProvider: User signed out");
          setUser(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log("AuthProvider: Token refreshed");
          // No need to update state, just log
        }
      }
    );

    return () => {
      console.log("AuthProvider: Cleaning up auth listener");
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("AuthProvider: Attempting login for email:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("AuthProvider: Login successful");
      // User is set by the auth listener
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("AuthProvider: Attempting logout");
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("AuthProvider: Logout successful");
      // User is set to null by the auth listener
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log("AuthProvider: Attempting registration for email:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful",
        description: "Please check your email for verification",
      });
      
      console.log("AuthProvider: Registration successful");
      // User is set by the auth listener if email verification is disabled
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

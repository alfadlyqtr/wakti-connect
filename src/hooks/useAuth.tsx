
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
        setIsLoading(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        if (session?.user) {
          console.log("Found active session for user:", session.user.id);
          
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          if (profileError) {
            // If profile not found and error is "not found", attempt to create one
            if (profileError.code === "PGRST116") {
              console.log("Profile not found for user, attempting to create default profile");
              try {
                const { data: newProfile, error: createError } = await supabase
                  .from("profiles")
                  .insert([{ 
                    id: session.user.id,
                    full_name: session.user.email?.split('@')[0],
                    account_type: "free"
                  }])
                  .select('*')
                  .single();
                
                if (createError) {
                  console.error("Error creating profile:", createError);
                } else {
                  console.log("Created new profile for user:", newProfile);
                  
                  setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: newProfile?.full_name || session.user.email?.split('@')[0],
                    displayName: newProfile?.display_name || newProfile?.full_name,
                    plan: newProfile?.account_type || "free"
                  });
                  return;
                }
              } catch (e) {
                console.error("Error in profile creation process:", e);
              }
            } else {
              console.error("Error fetching profile:", profileError);
            }
          }
          
          console.log("User profile data:", profile);
          
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.full_name || session.user.email?.split('@')[0],
            displayName: profile?.display_name || profile?.full_name,
            plan: profile?.account_type || "free"
          });
        } else {
          console.log("No active session found");
          setUser(null);
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
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === 'SIGNED_IN' && session) {
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
            
          if (profileError && profileError.code === "PGRST116") {
            console.log("Profile not found for new sign-in, creating default profile");
            try {
              const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert([{ 
                  id: session.user.id,
                  full_name: session.user.email?.split('@')[0],
                  account_type: "free"
                }])
                .select('*')
                .single();
              
              if (createError) {
                console.error("Error creating profile after sign in:", createError);
              } else {
                console.log("Created new profile after sign in:", newProfile);
                
                setUser({
                  id: session.user.id,
                  email: session.user.email,
                  name: newProfile?.full_name || session.user.email?.split('@')[0],
                  displayName: newProfile?.display_name || newProfile?.full_name,
                  plan: newProfile?.account_type || "free"
                });
                return;
              }
            } catch (e) {
              console.error("Error in profile creation process:", e);
            }
          } else if (profileError) {
            console.error("Error fetching profile after sign in:", profileError);
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: profile?.full_name || session.user.email?.split('@')[0],
            displayName: profile?.display_name || profile?.full_name,
            plan: profile?.account_type || "free"
          });
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing state");
          setUser(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      console.log("Login successful");
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
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
      console.log("Attempting logout");
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log("Logout successful");
      
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
      console.log("Attempting registration for:", email);
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
      
      console.log("Registration successful");
      
      toast({
        title: "Registration successful",
        description: "Please check your email for verification",
      });
      
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

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole, getEffectiveRole } from "@/types/roles";
import { toast } from "@/components/ui/use-toast";
import { AuthContextType, User as ExtendedUser } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [effectiveRole, setEffectiveRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  // Initialize auth state
  useEffect(() => {
    console.log("Initializing auth state...");
    let mounted = true;
    let authListenerSubscription: { subscription: { unsubscribe: () => void } } | null = null;
    
    // Add a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("Auth state loading timed out after 5 seconds");
        setIsLoading(false);
      }
    }, 5000);
    
    const setupAuth = async () => {
      try {
        // First set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("Auth state changed:", event, newSession?.user?.id);
            
            if (!mounted) return;
            
            // Update session and user synchronously first
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            // Then fetch profile data asynchronously
            if (newSession?.user) {
              setTimeout(async () => {
                if (!mounted) return;
                
                try {
                  const { data: profile } = await supabase
                    .from('profiles')
                    .select('account_type')
                    .eq('id', newSession.user.id)
                    .maybeSingle();
                    
                  if (mounted) {
                    const role = profile?.account_type as UserRole || 'individual';
                    setEffectiveRole(role);
                    setIsLoading(false);
                  }
                } catch (error) {
                  console.error("Error fetching profile after auth state change:", error);
                  if (mounted) setIsLoading(false);
                }
              }, 0);
            } else {
              setEffectiveRole(null);
              setIsLoading(false);
            }
          }
        );
        
        authListenerSubscription = { subscription };
        
        // Then check for existing session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Update session and user synchronously first
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
        }
        
        // Then fetch profile data asynchronously
        if (currentSession?.user && mounted) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('account_type')
              .eq('id', currentSession.user.id)
              .maybeSingle();
              
            if (mounted) {
              const role = profile?.account_type as UserRole || 'individual';
              setEffectiveRole(role);
            }
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
          }
        }
        
        // Finally, mark loading as complete
        if (mounted) {
          setIsLoading(false);
        }
        
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setAuthError(error as Error);
          setIsLoading(false);
        }
      }
    };
    
    setupAuth();
    
    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      
      if (authListenerSubscription?.subscription) {
        console.log("Cleaning up auth listener subscription");
        authListenerSubscription.subscription.unsubscribe();
      }
    };
  }, []);

  // Authentication operations
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null, data };
    } catch (error: any) {
      console.error('Login error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear the user and session state immediately
      setUser(null);
      setSession(null);
      setEffectiveRole(null);
      
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name?: string, 
    accountType: string = 'individual', 
    businessName?: string
  ) => {
    try {
      setIsLoading(true);
      
      const metadata: Record<string, any> = {
        full_name: name || '',
        account_type: accountType
      };
      
      if (businessName && accountType === 'business') {
        metadata.business_name = businessName;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin + '/auth/login'
        }
      });

      if (error) throw error;
      return { error: null, data };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Role management
  const refreshUserRole = async () => {
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', user.id)
        .maybeSingle();
        
      const role = profile?.account_type as UserRole || 'individual';
      setEffectiveRole(role);
    }
  };

  const hasRole = useCallback((role: UserRole): boolean => {
    return effectiveRole === role;
  }, [effectiveRole]);

  const hasAccess = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!effectiveRole) return false;
    return requiredRoles.includes(effectiveRole);
  }, [effectiveRole]);

  const value = {
    user,
    session,
    effectiveRole,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    hasAccess,
    login,
    logout,
    register,
    refreshUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

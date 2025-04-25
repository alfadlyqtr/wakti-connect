import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole, getEffectiveRole } from "@/types/roles";
import { toast } from "@/components/ui/use-toast";
import { AuthContextType, User as ExtendedUser, AppUser } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [effectiveRole, setEffectiveRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Initializing auth state...");
    let mounted = true;
    let authListenerSubscription: { subscription: { unsubscribe: () => void } } | null = null;
    
    const loadingTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("Auth state loading timed out after 5 seconds");
        setIsLoading(false);
      }
    }, 5000);
    
    const setupAuth = async () => {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, newSession) => {
            console.log("Auth state changed:", event, newSession?.user?.id);
            
            if (!mounted) return;
            
            setSession(newSession);
            
            if (newSession?.user) {
              const supabaseUser = newSession.user;
              const role = supabaseUser.user_metadata?.account_type as UserRole || 'individual';
              
              const appUser: AppUser = {
                ...supabaseUser,
                name: supabaseUser.user_metadata?.full_name || '',
                displayName: supabaseUser.user_metadata?.display_name || supabaseUser.user_metadata?.full_name,
                role: role,
                effectiveRole: role,
                account_type: supabaseUser.user_metadata?.account_type,
                full_name: supabaseUser.user_metadata?.full_name,
                avatar_url: supabaseUser.user_metadata?.avatar_url,
                business_name: supabaseUser.user_metadata?.business_name,
                theme_preference: supabaseUser.user_metadata?.theme_preference,
                plan: role
              };
              
              setUser(appUser);
              
              setTimeout(async () => {
                if (!mounted) return;
                
                try {
                  const { data: profile } = await supabase
                    .from('profiles')
                    .select('account_type, business_name, theme_preference')
                    .eq('id', newSession.user.id)
                    .maybeSingle();
                    
                  if (mounted) {
                    const role = profile?.account_type as UserRole || 'individual';
                    setEffectiveRole(role);
                    
                    if (profile) {
                      setUser(prev => prev ? {
                        ...prev,
                        business_name: profile.business_name || prev.business_name,
                        theme_preference: profile.theme_preference || prev.theme_preference
                      } : null);
                    }
                    
                    setIsLoading(false);
                  }
                } catch (error) {
                  console.error("Error fetching profile after auth state change:", error);
                  if (mounted) setIsLoading(false);
                }
              }, 0);
            } else {
              setUser(null);
              setEffectiveRole(null);
              setIsLoading(false);
            }
          }
        );
        
        authListenerSubscription = { subscription };
        
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (mounted) {
          setSession(currentSession);
          
          if (currentSession?.user) {
            const supabaseUser = currentSession.user;
            const role = supabaseUser.user_metadata?.account_type as UserRole || 'individual';
            
            const appUser: AppUser = {
              ...supabaseUser,
              name: supabaseUser.user_metadata?.full_name || '',
              displayName: supabaseUser.user_metadata?.display_name || supabaseUser.user_metadata?.full_name,
              role: role,
              effectiveRole: role,
              account_type: supabaseUser.user_metadata?.account_type,
              full_name: supabaseUser.user_metadata?.full_name,
              avatar_url: supabaseUser.user_metadata?.avatar_url,
              business_name: supabaseUser.user_metadata?.business_name,
              theme_preference: supabaseUser.user_metadata?.theme_preference,
              plan: role
            };
            
            setUser(appUser);
          }
        }
        
        if (currentSession?.user && mounted) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('account_type, business_name, theme_preference')
              .eq('id', currentSession.user.id)
              .maybeSingle();
              
            if (mounted) {
              const role = profile?.account_type as UserRole || 'individual';
              setEffectiveRole(role);
              
              if (profile) {
                setUser(prev => prev ? {
                  ...prev,
                  business_name: profile.business_name || prev.business_name,
                  theme_preference: profile.theme_preference || prev.theme_preference
                } : null);
              }
            }
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
          }
        }
        
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

  const isStaff = effectiveRole === 'staff';
  
  const isSuperAdmin = effectiveRole === 'super-admin';
  
  const userRole = effectiveRole || 'individual';
  
  const userId = user?.id || null;
  
  const business_name = user?.business_name;
  const theme_preference = user?.theme_preference;

  const value: AuthContextType = {
    user,
    session,
    effectiveRole,
    isAuthenticated: !!user,
    isLoading,
    userId,
    userRole,
    isStaff,
    isSuperAdmin,
    business_name,
    theme_preference,
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

export type { AuthContextType };

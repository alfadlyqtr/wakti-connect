
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole } from "@/types/roles";

export interface User extends Omit<SupabaseUser, 'app_metadata' | 'user_metadata'> {
  name?: string;
  displayName?: string;
  role?: UserRole;
  effectiveRole?: UserRole;
  account_type?: string;
  full_name?: string;
  avatar_url?: string;
  plan?: UserRole;
  business_name?: string;
  theme_preference?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  effectiveRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userRole: UserRole;
  isStaff: boolean;
  isSuperAdmin: boolean;
  business_name?: string;
  theme_preference?: string;
  hasRole: (role: UserRole) => boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<{ error?: any; data?: any }>;
  logout: () => Promise<void>;
  register: (
    email: string, 
    password: string, 
    name?: string, 
    accountType?: string, 
    businessName?: string
  ) => Promise<{ error?: any; data?: any }>;
  refreshUserRole: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
	const [userRole, setUserRole] = useState<UserRole>('individual');
  const [effectiveRole, setEffectiveRole] = useState<UserRole>('individual');
  const [isStaff, setIsStaff] = useState<boolean>(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [business_name, setBusinessName] = useState<string | null>(null);
  const [theme_preference, setThemePreference] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };
    
    fetchSession();
    
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      setSession(session);
      
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('userRole');
        localStorage.removeItem('isStaff');
        localStorage.removeItem('isSuperAdmin');
        
        setUser(null);
        setUserId(null);
        setUserRole('individual');
        setIsStaff(false);
        setIsSuperAdmin(false);
        setIsAuthenticated(false);
        setIsLoading(false);
        setBusinessName(null);
        setThemePreference(null);
        navigate("/auth");
      }
    });
  }, [navigate]);

  useEffect(() => {
    const getUserData = async () => {
      setIsLoading(true);
      
      if (!session?.user) {
        setUser(null);
        setUserId(null);
        setUserRole('individual');
        setIsStaff(false);
        setIsSuperAdmin(false);
        setIsAuthenticated(false);
        setIsLoading(false);
        setBusinessName(null);
        setThemePreference(null);
        return;
      }
      
      try {
        setUserId(session.user.id);
        setIsAuthenticated(true);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }

        // Create a custom User object without directly accessing user_metadata
        const customUser: User = {
          ...session.user,
          id: session.user.id,
          email: session.user.email,
          displayName: profile?.display_name || profile?.full_name || null,
          full_name: profile?.full_name || null,
          account_type: profile?.account_type || 'individual',
          avatar_url: profile?.avatar_url || null,
          theme_preference: profile?.theme_preference || 'light',
          created_at: profile?.created_at || null,
        };
        
        setUser(customUser);
        setBusinessName(profile?.business_name || null);
        setThemePreference(profile?.theme_preference || 'light');
        
        const { data: staffData, error: staffError } = await supabase
          .from('business_staff')
          .select('id')
          .eq('staff_id', session.user.id)
          .not('status', 'eq', 'inactive')
          .maybeSingle();
        
        if (staffError) {
          console.error("Error fetching staff status:", staffError);
        }
        
        const staffStatus = !!staffData;
        setIsStaff(staffStatus);
        
        const { data: superAdminData, error: superAdminError } = await supabase
          .from('super_admins')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (superAdminError) {
          console.error("Error fetching super admin status:", superAdminError);
        }
        
        const superAdminStatus = !!superAdminData;
        setIsSuperAdmin(superAdminStatus);

        let calculatedRole: UserRole = 'individual';
        if (superAdminStatus) {
            calculatedRole = 'superadmin';
        } else if (profile?.account_type === 'business') {
            calculatedRole = 'business';
        } else if (staffStatus) {
            calculatedRole = 'staff';
        }
        
        setUserRole(calculatedRole);
        setEffectiveRole(calculatedRole);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (session?.user) {
      getUserData();
    } else {
      setIsLoading(false);
    }
  }, [session]);
  
  const login = async (email: string, password: string): Promise<{ error?: any; data?: any }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      return { data };
    } catch (error) {
      console.error("Login error:", error);
      return { error };
    }
  };
  
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };
  
  const register = async (
    email: string, 
    password: string, 
    name?: string, 
    accountType?: string, 
    businessName?: string
  ): Promise<{ error?: any; data?: any }> => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name,
            account_type: accountType || 'individual',
            business_name: businessName
          }
        }
      });
      
      if (error) return { error };
      return { data };
    } catch (error) {
      console.error("Registration error:", error);
      return { error };
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!userRole) return false;
    return userRole === role;
  };
  
  const hasAccess = (roles: UserRole[]): boolean => {
    if (!userRole) return false;
    return roles.includes(userRole);
  };
  
  const refreshUserRole = async (): Promise<void> => {
    if (!session?.user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
        
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('id')
        .eq('staff_id', session.user.id)
        .not('status', 'eq', 'inactive')
        .maybeSingle();
        
      const { data: superAdminData } = await supabase
        .from('super_admins')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();
        
      const staffStatus = !!staffData;
      const superAdminStatus = !!superAdminData;
      
      let calculatedRole: UserRole = 'individual';
      if (superAdminStatus) {
          calculatedRole = 'superadmin';
      } else if (profile?.account_type === 'business') {
          calculatedRole = 'business';
      } else if (staffStatus) {
          calculatedRole = 'staff';
      }
      
      setUserRole(calculatedRole);
      setEffectiveRole(calculatedRole);
      setIsStaff(staffStatus);
      setIsSuperAdmin(superAdminStatus);
    } catch (error) {
      console.error("Error refreshing user role:", error);
    }
  };
  
  const value: AuthContextType = {
    user,
    userId,
    session,
    userRole,
    effectiveRole,
    isStaff,
    isSuperAdmin,
    isAuthenticated,
    isLoading,
    business_name,
    theme_preference,
    login,
    logout,
    hasRole,
    hasAccess,
    register,
    refreshUserRole,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };

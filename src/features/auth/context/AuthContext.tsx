import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AccountType, UserRole } from "@/types/roles";

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  full_name: string | null;
  account_type: AccountType | null;
  avatar_url: string | null;
  theme_preference: string | null;
  created_at: string | null;
}

export interface AuthContextType {
  user: User | null;
  userId: string | null;
  session: Session | null;
  userRole: UserRole | null;
  effectiveRole: UserRole;
  isStaff: boolean;
  isSuperAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  business_name: string | null;
  theme_preference: string | null;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
	const [userRole, setUserRole] = useState<UserRole | null>(null);
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
        // Clear stored user role on sign out
        localStorage.removeItem('userRole');
        localStorage.removeItem('isStaff');
        localStorage.removeItem('isSuperAdmin');
        
        setUser(null);
        setUserId(null);
        setUserRole(null);
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
        setUserRole(null);
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
        
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }
        
        // Set user data
        setUser({
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata.full_name || session.user.user_metadata.name || null,
          full_name: session.user.user_metadata.full_name || null,
          account_type: profile?.account_type || 'individual',
          avatar_url: profile?.avatar_url || null,
          theme_preference: profile?.theme_preference || 'light',
          created_at: profile?.created_at || null,
        });
        
        setBusinessName(profile?.business_name || null);
        setThemePreference(profile?.theme_preference || 'light');
        
        // Check if user is staff
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
        
        // Check if user is super admin
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

        // Determine effective role
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
  
  const signIn = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Check your email for the magic link to sign in.');
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    if (!userRole) return false;
    return userRole === role;
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
    signIn,
    signOut,
    hasRole,
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

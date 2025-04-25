
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types/roles";

export interface User extends SupabaseUser {
  role?: UserRole;
  account_type?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  effectiveRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name?: string,
    accountType?: string,
    businessName?: string
  ) => Promise<{ error: any; data?: any }>;
  refreshUserRole: () => Promise<void>;
}

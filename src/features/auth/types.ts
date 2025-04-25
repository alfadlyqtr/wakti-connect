
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole } from '@/types/user';

// Extended User type that includes additional fields
export interface User extends SupabaseUser {
  name?: string;
  displayName?: string;
  plan?: UserRole;
}

// Complete AuthContextType with all required methods
export interface AuthContextType {
  user: User | null;
  session: any | null;
  effectiveRole: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<{
    error: Error | null;
    data?: any;
  }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    name?: string,
    accountType?: string,
    businessName?: string
  ) => Promise<{
    error: Error | null;
    data?: any;
  }>;
  refreshUserRole: () => Promise<void>;
}

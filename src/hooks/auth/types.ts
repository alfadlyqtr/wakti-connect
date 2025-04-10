
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { UserRole } from '@/types/user';

export interface User extends SupabaseUser {
  // Add additional user fields here if needed
  name?: string;
  displayName?: string;
  plan?: UserRole;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string, accountType?: string, businessName?: string) => Promise<{ error: Error | null; data?: any }>;
}

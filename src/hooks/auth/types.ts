
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  // Add additional user fields here if needed
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  register: (email: string, password: string, metadata?: any) => Promise<{ error: Error | null; data?: any }>;
}

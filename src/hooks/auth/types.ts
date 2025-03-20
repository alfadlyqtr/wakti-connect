
import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  id: string;
  name?: string;
  email?: string;
  displayName?: string;
  plan?: "free" | "individual" | "business";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

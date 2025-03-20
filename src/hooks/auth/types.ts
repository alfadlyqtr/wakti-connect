
export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  plan: 'free' | 'individual' | 'business'; // This maps to account_type in profiles
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

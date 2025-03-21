
export interface User {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  plan: 'free' | 'individual' | 'business' | 'staff'; // Updated to include 'staff'
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>; // Changed return type to match actual implementation
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, accountType?: string, businessName?: string) => Promise<void>;
}

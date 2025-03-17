
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name?: string;
  email?: string;
  displayName?: string;
  plan?: "free" | "individual" | "business";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating auth loading
    const loadUser = () => {
      // For demonstration, assume user is logged in
      setUser({
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        plan: "business"
      });
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulated login
    setUser({
      id: "user-1",
      name: "John Doe",
      email,
      plan: "business"
    });
  };

  const logout = async () => {
    setUser(null);
  };

  const register = async (email: string, password: string, name: string) => {
    // Simulated registration
    setUser({
      id: "user-1",
      name,
      email,
      plan: "free"
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

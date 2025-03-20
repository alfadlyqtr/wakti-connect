
import React, { createContext, useContext } from "react";
import { User, AuthContextType } from "./types";
import { useAuthOperations } from "./useAuthOperations";
import { useAuthInitializer } from "./useAuthInitializer";
import AuthLoadingState from "@/components/auth/AuthLoadingState";
import AuthErrorState from "@/components/auth/AuthErrorState";

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { throw new Error("Not implemented"); },
  logout: async () => { throw new Error("Not implemented"); },
  register: async (email: string, password: string, name: string, accountType?: string, businessName?: string) => { 
    throw new Error("Not implemented"); 
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the auth initializer hook to handle session and user state
  const {
    user,
    setUser,
    isLoading,
    authInitialized,
    authError,
  } = useAuthInitializer();
  
  // Use the auth operations hook for login, logout, register functions
  const { login, logout, register } = useAuthOperations(setUser, setIsLoading => {
    // Just wrap the setter to maintain the API
    isLoading ? setIsLoading(true) : setIsLoading(false);
  });

  // Provide the auth context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  // Show a loading state until auth is initialized
  if (!authInitialized && isLoading) {
    return <AuthLoadingState authError={authError} />;
  }

  // If we have an auth error but initialization is complete, show a recovery UI
  if (authError && authInitialized) {
    return <AuthErrorState authError={authError} />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

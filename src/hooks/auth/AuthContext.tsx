
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
  login: async () => { throw new Error("Auth context not initialized"); },
  logout: async () => { throw new Error("Auth context not initialized"); },
  register: async () => { throw new Error("Auth context not initialized"); },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the auth initializer hook to handle session and user state
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    authInitialized,
    authError,
  } = useAuthInitializer();
  
  // Use the auth operations hook for login, logout, register functions
  const { login, logout, register } = useAuthOperations(setUser, setIsLoading);

  // Provide the auth context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  // Show a loading state until auth is fully initialized
  if (!authInitialized) {
    return <AuthLoadingState authError={authError} />;
  }

  // If we have an auth error but initialization is complete, show a recovery UI
  if (authError) {
    return <AuthErrorState authError={authError} />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


import React, { createContext, useContext, useState } from "react";
import { User, AuthContextType } from "./types";
import { useAuthOperations } from "./useAuthOperations";
import { useAuthInitializer } from "./useAuthInitializer";

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => { return { error: new Error("Auth context not initialized") }; },
  logout: async () => { throw new Error("Auth context not initialized"); },
  register: async () => { return { error: new Error("Auth context not initialized") }; },
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
  
  console.log("AuthProvider rendering:", { 
    user: user?.id || "no user", 
    isLoading, 
    authInitialized, 
    hasError: !!authError 
  });
  
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

  // Render children immediately, don't block with loading/error states
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
    console.error("useAuth must be used within an AuthProvider");
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

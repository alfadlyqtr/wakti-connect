
import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth.types";
import { loginUser, logoutUser, registerUser } from "@/services/auth/authService";
import { useUserData } from "./useUserData";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user, 
    setUser,
    isLoading, 
    setIsLoading, 
    loadUserData, 
    refreshUserData 
  } = useUserData();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await loginUser(email, password);
      // Auth state listener will handle updating the user state
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      // Auth state listener will handle clearing the user state
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      await registerUser(email, password, name);
      // Auth state listener will handle updating the user state
    } finally {
      setIsLoading(false);
    }
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

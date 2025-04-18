
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";

// Type for the login result
interface LoginResult {
  error: Error | null;
  data?: any;
}

// Type for the register result
interface RegisterResult {
  error: Error | null;
  data?: any;
}

export const useAuthOperations = (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  // Login function
  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      setIsLoading(true);
      
      // Call Supabase auth to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      // We don't need to set the user here as the auth state change listener will handle it
      
      return { error: null, data };
    } catch (error: any) {
      console.error("Login error:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // We don't need to set the user to null here as the auth state change listener will handle it
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    email: string, 
    password: string, 
    name?: string, 
    accountType: string = 'free', 
    businessName?: string
  ): Promise<RegisterResult> => {
    try {
      setIsLoading(true);
      
      // Prepare metadata
      const metadata: Record<string, any> = {
        full_name: name || '',
        account_type: accountType
      };
      
      // Add business name if it's a business account
      if (businessName && accountType === 'business') {
        metadata.business_name = businessName;
      }

      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin + '/auth/login'
        }
      });

      if (error) {
        throw error;
      }
      
      return { error: null, data };
    } catch (error: any) {
      console.error("Registration error:", error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    logout,
    register,
  };
};

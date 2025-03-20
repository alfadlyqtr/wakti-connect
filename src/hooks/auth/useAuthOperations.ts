
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { User } from "./types";

export function useAuthOperations(
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      setIsLoading(true);
      
      // First check if Supabase is accessible
      try {
        await supabase.from('_metadata').select('*').limit(1);
      } catch (connectionError) {
        console.error("Supabase connection test failed:", connectionError);
        throw new Error("Unable to connect to authentication service. Please check your internet connection and try again.");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // Provide more specific error messages for common issues
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Please check your email to confirm your account before logging in.");
        }
        
        if (error.message.includes("Invalid login")) {
          throw new Error("Invalid email or password. Please try again.");
        }
        
        if (error.message.includes("database") || error.message.includes("profiles")) {
          throw new Error("Authentication service is experiencing issues. Please try again in a few moments.");
        }
        
        throw error;
      }
      
      console.log("Login successful:", data);
      // User is set by the auth listener
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Improved error message handling
      let errorMessage = "An error occurred during login";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password";
      } else if (error.message.includes("database") || error.message.includes("profiles")) {
        errorMessage = "Authentication service is experiencing issues. Please try again in a few moments.";
      } else if (error.message.includes("connect to authentication service")) {
        errorMessage = error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Attempting logout");
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        throw error;
      }
      
      console.log("Logout successful");
      setUser(null);
      // User is set to null by the auth listener
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, accountType: string = 'free', businessName?: string) => {
    try {
      console.log("Attempting registration for:", email);
      setIsLoading(true);
      
      // Prepare metadata with account type included
      const metadata: any = {
        full_name: name,
        account_type: accountType
      };
      
      // Add business name if provided and account type is business
      if (businessName && accountType === 'business') {
        metadata.business_name = businessName;
      }
      
      // Set display name to full name by default
      metadata.display_name = name;
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        console.error("Registration error:", error);
        
        // More specific error messages
        if (error.message.includes("database") || error.message.includes("profiles")) {
          throw new Error("Server connection issue. Please try again in a few moments.");
        }
        
        throw error;
      }
      
      console.log("Registration successful:", data);
      
      toast({
        title: "Registration successful",
        description: "Please check your email for verification",
      });
      
      // User is set by the auth listener if email verification is disabled
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Improved error handling
      let errorMessage = "An error occurred during registration";
      
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered. Please log in instead.";
      } else if (error.message.includes("database") || error.message.includes("profiles")) {
        errorMessage = "Server connection issue. Please try again in a few moments.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, logout, register };
}

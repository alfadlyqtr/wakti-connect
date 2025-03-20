
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { User } from "../types";

type SetLoadingFunction = React.Dispatch<React.SetStateAction<boolean>>;
type SetUserFunction = React.Dispatch<React.SetStateAction<User | null>>;

export async function loginOperation(
  email: string, 
  password: string, 
  setIsLoading: SetLoadingFunction,
  setUser: SetUserFunction
) {
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
}

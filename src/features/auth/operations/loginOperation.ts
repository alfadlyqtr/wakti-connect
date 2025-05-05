
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
    
    // Proceed with authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      
      // Provide more specific error messages
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Please check your email to confirm your account before logging in.");
      }
      
      if (error.message.includes("Invalid login")) {
        throw new Error("Invalid email or password. Please try again.");
      }
      
      throw error;
    }
    
    console.log("Login successful:", data.user?.id);
    return data; // Properly return the data for components that need it
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Improved error message handling
    let errorMessage = "An error occurred during login";
    
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password";
    } else if (error.message.includes("schema")) {
      errorMessage = "Application initialization issue. Please contact support.";
    } else if (error.message.includes("database") || error.message.includes("profiles")) {
      errorMessage = "Authentication service is experiencing issues. Please try again in a few moments.";
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    toast({
      title: "Login failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    setIsLoading(false); // Ensure loading state is reset on error
    throw error;
  }
}

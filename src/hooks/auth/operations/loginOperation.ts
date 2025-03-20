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
    
    // Check if profiles table exists before proceeding
    try {
      const { data: tableExists, error: checkError } = await supabase.rpc('check_profiles_table');
      
      if (checkError) {
        console.warn("Could not verify profiles table:", checkError);
        // Continue anyway, as this might just be an RPC error
      } else if (!tableExists) {
        console.error("Profiles table does not exist");
        throw new Error(
          "Application database is not properly initialized. Please contact support."
        );
      }
    } catch (schemaError: any) {
      console.error("Schema verification failed:", schemaError);
      // If the RPC function itself failed, continue with login
      if (!schemaError.message.includes("does not exist")) {
        throw schemaError;
      }
    }
    
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
    
    console.log("Login successful:", data);
    // User is set by the auth listener
    
    return data;
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
    // We need to keep loading state active until the auth listener finishes processing
    // So don't set isLoading false here, it will be handled by the auth listener
  }
}

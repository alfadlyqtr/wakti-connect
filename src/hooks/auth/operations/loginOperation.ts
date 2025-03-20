
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
    
    // First verify Supabase connection and schema
    try {
      // Try to access a simple public table first
      const { data: metadataCheck, error: metadataError } = await supabase
        .from('_metadata')
        .select('*')
        .limit(1);
        
      if (metadataError) {
        console.warn("Metadata table check failed, might be first run:", metadataError);
        // Continue as this table might not exist yet
      }
      
      // Now check if the profiles table exists
      const { error: profilesError } = await supabase
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
        
      if (profilesError) {
        // Log the specific error
        console.error("Profiles table check failed:", profilesError);
        
        if (profilesError.message && 
            (profilesError.message.includes("does not exist") || 
             profilesError.message.includes("relation") || 
             profilesError.message.includes("undefined"))) {
          // Critical database schema issue
          throw new Error(
            "Database schema not properly initialized. Please contact the administrator or ensure migrations have been run."
          );
        }
      }
    } catch (schemaError: any) {
      console.error("Schema verification failed:", schemaError);
      throw schemaError;
    }
    
    // Proceed with authentication if schema checks passed
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
    setIsLoading(false);
  }
}

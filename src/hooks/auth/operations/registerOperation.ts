
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { User } from "../types";

type SetLoadingFunction = React.Dispatch<React.SetStateAction<boolean>>;
type SetUserFunction = React.Dispatch<React.SetStateAction<User | null>>;

export async function registerOperation(
  email: string, 
  password: string, 
  name: string, 
  accountType: string, 
  businessName: string | undefined,
  setIsLoading: SetLoadingFunction,
  setUser: SetUserFunction
) {
  try {
    console.log("Attempting registration for:", email);
    
    // Prepare metadata with all necessary fields
    const metadata: any = {
      full_name: name,
      account_type: accountType,
      display_name: name  // Set display name to full name by default
    };
    
    // Add business name if provided and account type is business
    if (businessName && accountType === 'business') {
      metadata.business_name = businessName;
    }
    
    // Sign up the user with complete metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin + '/auth/login'
      },
    });
    
    if (error) {
      console.error("Registration error:", error);
      throw error;
    }
    
    console.log("Registration successful:", data);
    
    toast({
      title: "Registration successful",
      description: "Please check your email for verification instructions",
    });
    
    // Return the user data
    return data;
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
    
    setIsLoading(false); // Ensure loading state is reset on error
    throw error;
  }
}

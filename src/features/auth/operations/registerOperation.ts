
import { supabase } from "@/integrations/supabase/client";
import { User } from "../types";

type SetLoadingFunction = React.Dispatch<React.SetStateAction<boolean>>;
type SetUserFunction = React.Dispatch<React.SetStateAction<User | null>>;

export async function registerOperation(
  email: string,
  password: string, 
  name: string,
  accountType: "free" | "individual" | "business" | "staff" | "super-admin" = 'free',
  businessName: string | undefined,
  setIsLoading: SetLoadingFunction,
  setUser: SetUserFunction
) {
  try {
    console.log("Attempting to register user:", email);
    
    // Register user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          account_type: accountType,
          business_name: businessName,
        },
      },
    });
    
    if (error) {
      console.error("Registration error:", error);
      throw error;
    }
    
    if (!data?.user?.id) {
      throw new Error("Failed to create user account");
    }
    
    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        full_name: name,
        email,
        account_type: accountType,
        business_name: businessName || null,
      });
    
    if (profileError) {
      console.error("Profile creation error:", profileError);
      
      // Don't throw here, as the auth account has been created
      // This might need cleanup in a production app
      console.warn("User account created but profile data couldn't be saved");
    }
    
    console.log("Registration successful, user ID:", data.user.id);
    return data;
  } finally {
    setIsLoading(false);
  }
}

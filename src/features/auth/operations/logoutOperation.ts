
import { supabase } from "@/integrations/supabase/client";
import { User } from "../types";

type SetLoadingFunction = React.Dispatch<React.SetStateAction<boolean>>;
type SetUserFunction = React.Dispatch<React.SetStateAction<User | null>>;

export async function logoutOperation(
  setIsLoading: SetLoadingFunction,
  setUser: SetUserFunction
) {
  try {
    console.log("Attempting to log out user");
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      throw error;
    }
    
    // Clear user data on successful logout
    setUser(null);
    localStorage.removeItem('userRole');
    
    // Navigate happens in the UI component
    return { success: true };
  } finally {
    setIsLoading(false);
  }
}


import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { User } from "../types";

type SetLoadingFunction = React.Dispatch<React.SetStateAction<boolean>>;
type SetUserFunction = React.Dispatch<React.SetStateAction<User | null>>;

export async function logoutOperation(
  setIsLoading: SetLoadingFunction,
  setUser: SetUserFunction
) {
  try {
    console.log("Logging out user");
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      
      toast({
        title: "Logout failed",
        description: error.message || "Failed to log out. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    }
    
    // Clear auth data after successful logout
    setUser(null);
    localStorage.removeItem('isSuperAdmin');
    
    console.log("Logout successful");
    
    // Skip toast on logout to avoid cluttering the UI
    // unless you specifically want to show a confirmation
    
    // Redirect will be handled by the auth state listener in AuthProvider
  } catch (error: any) {
    console.error("Logout processing error:", error);
    setIsLoading(false); // Ensure loading state is reset on error
    throw error;
  }
}

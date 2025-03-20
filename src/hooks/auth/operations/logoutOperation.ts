
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
}

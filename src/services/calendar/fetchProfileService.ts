
import { supabase } from "@/integrations/supabase/client";

// Fetch user profile data to get account type
export const fetchUserProfile = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile data:", profileError);
      throw profileError;
    }
    
    if (!profileData) {
      console.warn("No profile data found, defaulting to free account");
      return {
        userId: session.user.id,
        accountType: "free"
      };
    }
    
    console.log("Fetched user profile:", profileData);
    
    return {
      userId: session.user.id,
      accountType: profileData.account_type || "free"
    };
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    throw error;
  }
};

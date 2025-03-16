
import { supabase } from "@/integrations/supabase/client";

// Fetch user profile data to get account type
export const fetchUserProfile = async () => {
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
  
  return {
    userId: session.user.id,
    accountType: profileData?.account_type || "free"
  };
};

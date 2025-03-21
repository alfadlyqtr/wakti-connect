
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to update user profile
 */
export const updateUserProfile = async (userId: string) => {
  console.log("Updating user profile account_type to staff");
  
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        account_type: 'staff',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (profileError) {
      console.error("Error updating user profile account_type:", profileError);
      throw profileError;
    }
    
    console.log("Updated user profile account_type to staff");
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};

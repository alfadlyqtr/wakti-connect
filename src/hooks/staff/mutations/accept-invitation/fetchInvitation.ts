
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../../types";

/**
 * Helper function to fetch invitation by token
 */
export const fetchInvitationByToken = async (token: string): Promise<StaffInvitation> => {
  console.log("Fetching invitation with token:", token);
  
  try {
    const { data: invitation, error: fetchError } = await supabase
      .from('staff_invitations')
      .select('*')
      .eq('token', token)
      .single();
      
    if (fetchError) {
      console.error("Error fetching invitation:", fetchError);
      throw new Error('Invalid invitation');
    }
    
    console.log("Found invitation:", invitation);
    return invitation as StaffInvitation;
  } catch (error) {
    console.error("Error in fetchInvitationByToken:", error);
    throw error;
  }
};

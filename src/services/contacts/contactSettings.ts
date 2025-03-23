
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch the auto-approve contact setting for current user
 */
export const fetchAutoApproveSetting = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('auto_approve_contacts')
      .eq('id', session.user.id)
      .single();
      
    if (error) {
      console.error("Error fetching auto-approve setting:", error);
      return false;
    }
    
    return data?.auto_approve_contacts || false;
  } catch (error) {
    console.error("Error in fetchAutoApproveSetting:", error);
    return false;
  }
};

/**
 * Update the auto-approve contact setting for current user
 */
export const updateAutoApproveContacts = async (value: boolean): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return false;
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ auto_approve_contacts: value })
      .eq('id', session.user.id);
      
    if (error) {
      console.error("Error updating auto-approve setting:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in updateAutoApproveContacts:", error);
    return false;
  }
};

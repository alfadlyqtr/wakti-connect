
import { supabase } from "@/integrations/supabase/client";
import { UserContact } from "@/types/invitation.types";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Updates auto-approve contacts setting
 */
export const updateAutoApproveContacts = async (autoApprove: boolean): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    const { error } = await fromTable('profiles')
      .update({ 
        auto_approve_contacts: autoApprove,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.user.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating auto approve setting:", error);
    return false;
  }
};

/**
 * Fetches the user's current auto-approve setting
 */
export const fetchAutoApproveSetting = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('auto_approve_contacts')
      .eq('id', session.user.id)
      .single();
      
    if (error) throw error;
    
    return !!data.auto_approve_contacts;
  } catch (error) {
    console.error("Error fetching auto-approve setting:", error);
    return false;
  }
};

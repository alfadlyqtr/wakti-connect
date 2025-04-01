
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch the auto-approve setting for contact requests
 */
export const fetchAutoApproveSetting = async (): Promise<boolean> => {
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
    console.error("Error fetching auto approve setting:", error);
    return false;
  }
  
  return data?.auto_approve_contacts || false;
};

/**
 * Update the auto-approve setting for contact requests
 */
export const updateAutoApproveContacts = async (value: boolean): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return false;
  }
  
  const { error } = await supabase
    .from('profiles')
    .update({ auto_approve_contacts: value })
    .eq('id', session.user.id);
  
  if (error) {
    console.error("Error updating auto approve setting:", error);
    return false;
  }
  
  return true;
};

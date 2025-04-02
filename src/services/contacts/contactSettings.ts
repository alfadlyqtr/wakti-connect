
import { supabase } from '@/integrations/supabase/client';

// Fetch auto-approve setting
export const fetchAutoApproveSetting = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to access settings');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('auto_approve_contacts')
      .eq('id', session.session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching auto approve setting:', error);
      throw new Error(error.message);
    }
    
    return data?.auto_approve_contacts || false;
  } catch (error) {
    console.error('Error in fetchAutoApproveSetting:', error);
    throw error;
  }
};

// Update auto-approve setting
export const updateAutoApproveContacts = async (autoApprove: boolean): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to update settings');
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({
        auto_approve_contacts: autoApprove
      })
      .eq('id', session.session.user.id);
    
    if (error) {
      console.error('Error updating auto approve setting:', error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateAutoApproveContacts:', error);
    throw error;
  }
};

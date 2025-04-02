
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch the auto approve contacts setting from user profile
 */
export const fetchAutoApproveSetting = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("Not authenticated");
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('auto_approve_contacts')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching auto approve setting:', error);
      return false; // Default to false on error
    }
    
    return data.auto_approve_contacts || false;
  } catch (error) {
    console.error('Error in fetchAutoApproveSetting:', error);
    return false; // Default to false on error
  }
};

/**
 * Update the auto approve contacts setting in user profile
 */
export const updateAutoApproveContacts = async (value: boolean): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("Not authenticated");
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ auto_approve_contacts: value })
      .eq('id', session.user.id);
    
    if (error) {
      console.error('Error updating auto approve setting:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateAutoApproveContacts:', error);
    return false;
  }
};

/**
 * Fetch the auto add staff to contacts setting from user profile
 */
export const fetchAutoAddStaffSetting = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("Not authenticated");
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('auto_add_staff_to_contacts')
      .eq('id', session.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching auto add staff setting:', error);
      return true; // Default to true on error
    }
    
    // If the field is null, default to true
    return data.auto_add_staff_to_contacts !== false;
  } catch (error) {
    console.error('Error in fetchAutoAddStaffSetting:', error);
    return true; // Default to true on error
  }
};

/**
 * Update the auto add staff to contacts setting in user profile
 */
export const updateAutoAddStaffSetting = async (value: boolean): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("Not authenticated");
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({ auto_add_staff_to_contacts: value })
      .eq('id', session.user.id);
    
    if (error) {
      console.error('Error updating auto add staff setting:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateAutoAddStaffSetting:', error);
    return false;
  }
};

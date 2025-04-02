
import { supabase } from '@/integrations/supabase/client';

/**
 * Synchronizes staff-business contacts when a user is part of a business
 * to ensure all staff members and the business are connected as contacts
 */
export const syncStaffBusinessContacts = async (): Promise<{success: boolean; message: string}> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return { success: false, message: "Authentication required" };
  }

  try {
    // Call the stored function to sync contacts
    const { error } = await supabase
      .rpc('update_existing_staff_contacts');
    
    if (error) {
      console.error("Error syncing staff-business contacts:", error);
      return { success: false, message: error.message };
    }
    
    return { success: true, message: "Staff contacts synchronized successfully" };
  } catch (error) {
    console.error("Exception syncing staff-business contacts:", error);
    return { success: false, message: error.message || "Unknown error occurred" };
  }
};

/**
 * Check if current user is a staff member and ensure contact connections
 */
export const ensureStaffContacts = async (): Promise<{success: boolean; message: string}> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return { success: false, message: "Authentication required" };
  }

  try {
    // Check if the current user is a staff member
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('id, business_id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (staffError) {
      return { success: false, message: staffError.message };
    }
    
    if (!staffData) {
      return { success: false, message: "Not a staff member" }; 
    }
    
    // Ensure staff is connected to business
    const result = await syncStaffBusinessContacts();
    return result;
  } catch (error) {
    console.error("Error ensuring staff contacts:", error);
    return { success: false, message: error.message || "Unknown error occurred" };
  }
};

/**
 * Get the auto add staff to contacts setting from user profile
 */
export const getAutoAddStaffSetting = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return true; // Default to true if not logged in
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
    
    // If setting is explicitly false, return false, otherwise default to true
    return data?.auto_add_staff_to_contacts !== false;
  } catch (error) {
    console.error('Error in getAutoAddStaffSetting:', error);
    return true; // Default to true on error
  }
};

/**
 * Update auto add staff to contacts setting
 */
export const updateAutoAddStaffSetting = async (autoAddStaff: boolean): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('You must be logged in to update settings');
    }
    
    const { error } = await supabase
      .from('profiles')
      .update({
        auto_add_staff_to_contacts: autoAddStaff
      })
      .eq('id', session.user.id);
      
    if (error) {
      console.error('Error updating auto add staff setting:', error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateAutoAddStaffSetting:', error);
    throw error;
  }
};

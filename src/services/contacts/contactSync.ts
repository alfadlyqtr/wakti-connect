
import { supabase } from "@/integrations/supabase/client";

/**
 * Sync contacts between staff and business
 */
export const syncStaffBusinessContacts = async (): Promise<{success: boolean; message?: string}> => {
  try {
    // This calls the Supabase DB function to sync contacts
    const { error } = await supabase.rpc('update_existing_staff_contacts');
    
    if (error) {
      console.error("Error syncing staff contacts:", error);
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error in syncStaffBusinessContacts:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Force sync staff contacts with retry mechanism
 */
export const forceSyncStaffContacts = async (): Promise<{success: boolean; message?: string}> => {
  try {
    // Try to sync contacts up to 3 times
    let attempts = 0;
    let success = false;
    let lastError;
    
    while (attempts < 3 && !success) {
      attempts++;
      try {
        const result = await syncStaffBusinessContacts();
        if (result.success) {
          success = true;
          return result;
        } else {
          lastError = result.message;
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (err: any) {
        lastError = err.message;
      }
    }
    
    return { 
      success: false, 
      message: `Failed after ${attempts} attempts. Last error: ${lastError}` 
    };
  } catch (error: any) {
    console.error("Error in forceSyncStaffContacts:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Ensure all staff are connected as contacts
 */
export const ensureStaffContacts = async (businessId: string): Promise<{success: boolean; message?: string}> => {
  try {
    // Get all active staff for this business
    const { data: staffMembers, error } = await supabase
      .from('business_staff')
      .select('staff_id')
      .eq('business_id', businessId)
      .eq('status', 'active');
    
    if (error) {
      console.error("Error getting staff members:", error);
      return { success: false, message: error.message };
    }
    
    // Make sure all staff are connected to each other
    if (staffMembers && staffMembers.length > 0) {
      for (const staff1 of staffMembers) {
        for (const staff2 of staffMembers) {
          if (staff1.staff_id !== staff2.staff_id) {
            // Create or update contact relationship
            await supabase
              .from('user_contacts')
              .upsert({
                user_id: staff1.staff_id,
                contact_id: staff2.staff_id,
                status: 'accepted'
              }, { 
                onConflict: 'user_id,contact_id' 
              });
          }
        }
      }
    }
    return { success: true };
  } catch (error: any) {
    console.error("Error in ensureStaffContacts:", error);
    return { success: false, message: error.message };
  }
};

/**
 * Get the setting for auto-adding staff to contacts
 */
export const getAutoAddStaffSetting = async (): Promise<boolean> => {
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
    console.error('Error in getAutoAddStaffSetting:', error);
    return true; // Default to true on error
  }
};

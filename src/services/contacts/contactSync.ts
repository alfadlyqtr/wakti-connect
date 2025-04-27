
import { supabase } from "@/integrations/supabase/client";

/**
 * Sync contacts between staff and business
 */
export const syncStaffBusinessContacts = async (): Promise<void> => {
  try {
    // This calls the Supabase DB function to sync contacts
    const { error } = await supabase.rpc('update_existing_staff_contacts');
    
    if (error) {
      console.error("Error syncing staff contacts:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in syncStaffBusinessContacts:", error);
    throw error;
  }
};

/**
 * Ensure all staff are connected as contacts
 */
export const ensureStaffContacts = async (businessId: string): Promise<void> => {
  try {
    // Get all active staff for this business
    const { data: staffMembers, error } = await supabase
      .from('business_staff')
      .select('staff_id')
      .eq('business_id', businessId)
      .eq('status', 'active');
    
    if (error) {
      console.error("Error getting staff members:", error);
      throw error;
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
  } catch (error) {
    console.error("Error in ensureStaffContacts:", error);
    throw error;
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

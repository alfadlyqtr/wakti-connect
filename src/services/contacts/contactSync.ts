
import { supabase } from "@/integrations/supabase/client";

/**
 * Synchronizes staff-business contacts when a user is part of a business
 * to ensure all staff members and the business are connected as contacts
 */
export const syncStaffBusinessContacts = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return false;
  }

  try {
    // Call the stored function to sync contacts
    const { error } = await supabase
      .rpc('update_existing_staff_contacts');
    
    if (error) {
      console.error("Error syncing staff-business contacts:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception syncing staff-business contacts:", error);
    return false;
  }
};

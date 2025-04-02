
import { supabase } from "@/lib/supabase";

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

/**
 * Check if current user is a staff member and ensure contact connections
 */
export const ensureStaffContacts = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return false;
  }

  try {
    // Check if the current user is a staff member
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('id, business_id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (staffError || !staffData) {
      return false; // Not a staff member or error
    }
    
    // Ensure staff is connected to business
    await syncStaffBusinessContacts();
    return true;
  } catch (error) {
    console.error("Error ensuring staff contacts:", error);
    return false;
  }
};

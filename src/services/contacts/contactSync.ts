
import { supabase } from '@/integrations/supabase/client';
import { fetchAutoAddStaffSetting } from './contactSettings';

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
    console.log("Starting staff-business contacts sync for user:", session.user.id);
    
    // Call the updated stored function to sync contacts
    const { error } = await supabase
      .rpc('update_existing_staff_contacts');
    
    if (error) {
      console.error("Error syncing staff-business contacts:", error);
      return { success: false, message: error.message };
    }
    
    // Additionally, manually ensure business-staff contacts are synced
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('id, staff_id, business_id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (staffData) {
      // Ensure contact from staff to business
      await supabase
        .from('user_contacts')
        .upsert({
          user_id: session.user.id,
          contact_id: staffData.business_id,
          status: 'accepted',
          staff_relation_id: staffData.id,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,contact_id' });
      
      // Ensure contact from business to staff  
      await supabase
        .from('user_contacts')
        .upsert({
          user_id: staffData.business_id,
          contact_id: session.user.id,
          status: 'accepted',
          staff_relation_id: staffData.id,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,contact_id' });
    }
    
    console.log("Staff contacts synchronized successfully");
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
    console.log("Checking if user is staff member:", session.user.id);
    
    // Check if the current user is a staff member with explicit table reference
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('id, business_id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
    
    if (staffError) {
      console.error("Error checking staff status:", staffError);
      return { success: false, message: staffError.message };
    }
    
    if (!staffData) {
      console.log("User is not a staff member");
      return { success: false, message: "Not a staff member" }; 
    }
    
    console.log("User is a staff member of business:", staffData.business_id);
    
    // Ensure staff is connected to business
    const result = await syncStaffBusinessContacts();
    
    // Also manually create the contact relationships
    try {
      // Staff to business
      await supabase.from('user_contacts').upsert({
        user_id: session.user.id,
        contact_id: staffData.business_id,
        status: 'accepted',
        staff_relation_id: staffData.id
      }, { onConflict: 'user_id,contact_id' });
      
      // Business to staff
      await supabase.from('user_contacts').upsert({
        user_id: staffData.business_id,
        contact_id: session.user.id,
        status: 'accepted',
        staff_relation_id: staffData.id
      }, { onConflict: 'user_id,contact_id' });
      
      console.log("Direct contact relationships ensured successfully");
    } catch (contactError) {
      console.error("Error ensuring direct contacts:", contactError);
    }
    
    return result;
  } catch (error) {
    console.error("Error ensuring staff contacts:", error);
    return { success: false, message: error.message || "Unknown error occurred" };
  }
};

/**
 * Get the auto add staff to contacts setting from user profile
 * This function uses fetchAutoAddStaffSetting from contactSettings.ts
 */
export const getAutoAddStaffSetting = async (): Promise<boolean> => {
  try {
    return await fetchAutoAddStaffSetting();
  } catch (error) {
    console.error('Error in getAutoAddStaffSetting:', error);
    return true; // Default to true on error
  }
};

/**
 * Force synchronize staff contacts
 * This function is specifically for forcing an immediate sync of contacts
 * between staff members and their business
 */
export const forceSyncStaffContacts = async (): Promise<{success: boolean; message: string}> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { success: false, message: "Authentication required" };
    }
    
    // Check if user is staff or business owner
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('business_id, id')
      .eq('staff_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    const businessId = staffData?.business_id || session.user.id;
    
    // Call the edge function to force a sync
    const { data, error } = await supabase.functions.invoke('sync-staff-records', {
      headers: {
        Authorization: `Bearer ${session.access_token}` // Fixed: using access_token instead of accessToken
      }
    });
    
    if (error) {
      console.error("Error in sync-staff-records function:", error);
      return { success: false, message: error.message || "Sync function failed" };
    }
    
    console.log("Staff records sync complete:", data);
    
    // Explicitly update contacts between staff and business
    if (staffData) {
      try {
        // Staff to business
        await supabase.from('user_contacts').upsert({
          user_id: session.user.id,
          contact_id: staffData.business_id,
          status: 'accepted',
          staff_relation_id: staffData.id,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,contact_id' });
        
        // Business to staff
        await supabase.from('user_contacts').upsert({
          user_id: staffData.business_id,
          contact_id: session.user.id,
          status: 'accepted',
          staff_relation_id: staffData.id,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,contact_id' });
      } catch (e) {
        console.error("Error updating staff-business contacts:", e);
      }
    }
    
    return { 
      success: true, 
      message: data.message || "Staff contacts synchronized successfully" 
    };
  } catch (error) {
    console.error("Exception in forceSyncStaffContacts:", error);
    return { success: false, message: error.message || "Unknown error occurred" };
  }
};

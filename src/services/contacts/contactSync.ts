
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const ensureStaffContacts = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      console.log("No user session found");
      return { success: false, message: "Not logged in" };
    }
    
    const user = sessionData.session.user;
    
    // Check if user is staff
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('business_id, id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (!staffData) {
      console.log("Not a staff member");
      return { success: false, message: "Not a staff member" };
    }
    
    // Ensure contact with business owner
    await supabase
      .from('user_contacts')
      .upsert([
        {
          user_id: user.id,
          contact_id: staffData.business_id,
          status: 'accepted',
          staff_relation_id: staffData.id
        }
      ], { onConflict: 'user_id,contact_id' });
    
    // Get other staff for the same business
    const { data: otherStaff, error: otherStaffError } = await supabase
      .from('business_staff')
      .select('id, staff_id')
      .eq('business_id', staffData.business_id)
      .eq('status', 'active')
      .neq('staff_id', user.id);
      
    if (otherStaffError) {
      console.error("Error fetching other staff:", otherStaffError);
      return { success: false, message: "Error fetching other staff" };
    }
    
    // Create contacts with other staff
    for (const staff of otherStaff || []) {
      await supabase
        .from('user_contacts')
        .upsert([
          {
            user_id: user.id,
            contact_id: staff.staff_id,
            status: 'accepted',
            staff_relation_id: staff.id
          }
        ], { onConflict: 'user_id,contact_id' });
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in ensureStaffContacts:", error);
    return { success: false, message: String(error) };
  }
};

export const forceSyncStaffContacts = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      return { success: false, message: "Not logged in" };
    }
    
    const user = sessionData.session.user;
    
    // Check if this is a staff account
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('business_id, id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (!staffData) {
      return { success: false, message: "Not a staff member" };
    }
    
    // Easier approach: use the server-side function to sync all contacts
    const result = await supabase.rpc('update_existing_staff_contacts');
    
    if (result.error) {
      console.error("Error updating staff contacts:", result.error);
      return { success: false, message: result.error.message };
    }
    
    return { success: true, message: "Staff contacts synchronized successfully" };
  } catch (error) {
    console.error("Error in forceSyncStaffContacts:", error);
    return { success: false, message: String(error) };
  }
};

// Adding missing exports that other files are importing
export const syncStaffBusinessContacts = forceSyncStaffContacts;
export const getAutoAddStaffSetting = async () => {
  // This is a placeholder implementation
  return true;
};

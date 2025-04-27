
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const ensureStaffContacts = async () => {
  try {
    console.log("[ContactSync] Starting ensureStaffContacts");
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      console.log("[ContactSync] No user session found");
      return { success: false, message: "Not logged in" };
    }
    
    const user = sessionData.session.user;
    console.log("[ContactSync] User ID:", user.id);
    
    // Check if user is staff
    const { data: staffData } = await supabase
      .from('business_staff')
      .select('business_id, id')
      .eq('staff_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
      
    if (!staffData) {
      console.log("[ContactSync] Not a staff member");
      return { success: false, message: "Not a staff member" };
    }
    
    console.log("[ContactSync] Staff data found:", staffData);
    
    // Ensure contact with business owner
    const { data: contactInsert, error: contactError } = await supabase
      .from('user_contacts')
      .upsert([
        {
          user_id: user.id,
          contact_id: staffData.business_id,
          status: 'accepted',
          staff_relation_id: staffData.id
        }
      ], { onConflict: 'user_id,contact_id' });
      
    if (contactError) {
      console.error("[ContactSync] Error creating contact with business owner:", contactError);
    } else {
      console.log("[ContactSync] Contact with business owner created/updated");
    }
    
    // Get other staff for the same business
    const { data: otherStaff, error: otherStaffError } = await supabase
      .from('business_staff')
      .select('id, staff_id')
      .eq('business_id', staffData.business_id)
      .eq('status', 'active')
      .neq('staff_id', user.id);
      
    if (otherStaffError) {
      console.error("[ContactSync] Error fetching other staff:", otherStaffError);
      return { success: false, message: "Error fetching other staff" };
    }
    
    console.log(`[ContactSync] Found ${otherStaff?.length || 0} other staff members`);
    
    // Create contacts with other staff
    for (const staff of otherStaff || []) {
      console.log(`[ContactSync] Creating contact with staff ID: ${staff.staff_id}`);
      const { error } = await supabase
        .from('user_contacts')
        .upsert([
          {
            user_id: user.id,
            contact_id: staff.staff_id,
            status: 'accepted',
            staff_relation_id: staff.id
          }
        ], { onConflict: 'user_id,contact_id' });
        
      if (error) {
        console.error(`[ContactSync] Error creating contact with staff ${staff.staff_id}:`, error);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("[ContactSync] Error in ensureStaffContacts:", error);
    return { success: false, message: String(error) };
  }
};

export const forceSyncStaffContacts = async () => {
  try {
    console.log("[ContactSync] Starting forceSyncStaffContacts");
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      console.log("[ContactSync] No authenticated user");
      return { success: false, message: "Not logged in" };
    }
    
    const user = sessionData.session.user;
    console.log("[ContactSync] User ID:", user.id);
    
    // Check if this is a business account
    const { data: profileData } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .maybeSingle();
      
    const isBusiness = profileData?.account_type === 'business';
    console.log("[ContactSync] Is business account:", isBusiness);
    
    if (isBusiness) {
      // Business owner syncing staff contacts
      console.log("[ContactSync] Business owner syncing staff contacts");
      
      // Get all active staff members
      const { data: staffMembers, error: staffError } = await supabase
        .from('business_staff')
        .select('id, staff_id')
        .eq('business_id', user.id)
        .eq('status', 'active');
        
      if (staffError) {
        console.error("[ContactSync] Error fetching staff members:", staffError);
        return { success: false, message: staffError.message };
      }
      
      console.log(`[ContactSync] Found ${staffMembers?.length || 0} staff members`);
      
      // Create bidirectional contacts with all staff
      for (const staff of staffMembers || []) {
        console.log(`[ContactSync] Processing staff ID: ${staff.staff_id}`);
        
        // Business -> Staff
        const { error: bizToStaffError } = await supabase
          .from('user_contacts')
          .upsert({
            user_id: user.id,
            contact_id: staff.staff_id,
            status: 'accepted',
            staff_relation_id: staff.id,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,contact_id' });
          
        if (bizToStaffError) {
          console.error(`[ContactSync] Error creating business->staff contact: ${staff.staff_id}`, bizToStaffError);
        }
          
        // Staff -> Business
        const { error: staffToBizError } = await supabase
          .from('user_contacts')
          .upsert({
            user_id: staff.staff_id,
            contact_id: user.id,
            status: 'accepted',
            staff_relation_id: staff.id,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id,contact_id' });
          
        if (staffToBizError) {
          console.error(`[ContactSync] Error creating staff->business contact: ${staff.staff_id}`, staffToBizError);
        }
      }
      
      // Create staff-to-staff contacts
      console.log("[ContactSync] Creating staff-to-staff contacts");
      for (let i = 0; i < staffMembers.length; i++) {
        for (let j = i + 1; j < staffMembers.length; j++) {
          console.log(`[ContactSync] Creating contact between staff ${staffMembers[i].staff_id} and ${staffMembers[j].staff_id}`);
          
          // Staff A -> Staff B
          const { error: staffAToB } = await supabase
            .from('user_contacts')
            .upsert({
              user_id: staffMembers[i].staff_id,
              contact_id: staffMembers[j].staff_id,
              status: 'accepted',
              staff_relation_id: staffMembers[i].id,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,contact_id' });
            
          if (staffAToB) {
            console.error(`[ContactSync] Error creating staff-to-staff contact A->B`, staffAToB);
          }
            
          // Staff B -> Staff A
          const { error: staffBToA } = await supabase
            .from('user_contacts')
            .upsert({
              user_id: staffMembers[j].staff_id,
              contact_id: staffMembers[i].staff_id,
              status: 'accepted',
              staff_relation_id: staffMembers[j].id,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,contact_id' });
            
          if (staffBToA) {
            console.error(`[ContactSync] Error creating staff-to-staff contact B->A`, staffBToA);
          }
        }
      }
      
      return { success: true, message: "All staff contacts synchronized successfully" };
    } else {
      // Staff member syncing with business
      console.log("[ContactSync] Staff member syncing contacts");
      
      // Check if this is a staff account
      const { data: staffData } = await supabase
        .from('business_staff')
        .select('business_id, id')
        .eq('staff_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
        
      if (!staffData) {
        console.log("[ContactSync] Not a staff member");
        return { success: false, message: "Not a staff member" };
      }
      
      console.log("[ContactSync] Staff data found:", staffData);
      
      // Easier approach: use the server-side function to sync all contacts
      console.log("[ContactSync] Calling update_existing_staff_contacts RPC function");
      const { data: result, error } = await supabase.rpc('update_existing_staff_contacts');
      
      if (error) {
        console.error("[ContactSync] Error updating staff contacts:", error);
        return { success: false, message: error.message };
      }
      
      console.log("[ContactSync] RPC function result:", result);
      return { success: true, message: "Staff contacts synchronized successfully" };
    }
  } catch (error) {
    console.error("[ContactSync] Error in forceSyncStaffContacts:", error);
    return { success: false, message: String(error) };
  }
};

// Adding missing exports that other files are importing
export const syncStaffBusinessContacts = forceSyncStaffContacts;
export const getAutoAddStaffSetting = async () => {
  // This is a placeholder implementation
  console.log("[ContactSync] getAutoAddStaffSetting called");
  return true;
};

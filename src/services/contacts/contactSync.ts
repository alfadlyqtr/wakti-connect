
import { supabase } from "@/integrations/supabase/client";

/**
 * Syncs staff-business contacts to ensure mutual contacts
 * between business owners and their staff members
 */
export const syncStaffBusinessContacts = async (): Promise<{ success: boolean, message: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return { success: false, message: "Not authenticated" };
    }
    
    // Check if user is either a business owner or staff
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, account_type')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return { success: false, message: "Could not fetch profile" };
    }
    
    if (profile.account_type === 'business') {
      // For business owners, sync contacts with all staff members
      const { data: staffRelations, error: staffError } = await supabase
        .from('business_staff')
        .select('id, staff_id')
        .eq('business_id', session.user.id);
      
      if (staffError) {
        console.error("Error fetching staff:", staffError);
        return { success: false, message: "Could not fetch staff" };
      }
      
      if (!staffRelations || staffRelations.length === 0) {
        return { success: true, message: "No staff members to sync" };
      }
      
      // Create contacts for each staff member
      for (const relation of staffRelations) {
        await createMutualContactsIfNeeded(session.user.id, relation.staff_id, relation.id);
      }
      
      return { success: true, message: `Synced contacts with ${staffRelations.length} staff members` };
    } else {
      // For staff members, sync contacts with business owners
      const { data: businessRelations, error: businessError } = await supabase
        .from('business_staff')
        .select('id, business_id')
        .eq('staff_id', session.user.id);
      
      if (businessError) {
        console.error("Error fetching business relations:", businessError);
        return { success: false, message: "Could not fetch business relations" };
      }
      
      if (!businessRelations || businessRelations.length === 0) {
        return { success: true, message: "No business relations to sync" };
      }
      
      // Create contacts for each business owner
      for (const relation of businessRelations) {
        await createMutualContactsIfNeeded(session.user.id, relation.business_id, relation.id);
      }
      
      return { success: true, message: `Synced contacts with ${businessRelations.length} businesses` };
    }
  } catch (error) {
    console.error("Error syncing contacts:", error);
    return { success: false, message: "Unknown error syncing contacts" };
  }
};

/**
 * Helper function to create mutual contacts between two users
 */
const createMutualContactsIfNeeded = async (
  userId1: string, 
  userId2: string,
  staffRelationId: string
): Promise<void> => {
  // Check for existing contacts
  const { data: existingContact1, error: error1 } = await supabase
    .from('user_contacts')
    .select('id')
    .eq('user_id', userId1)
    .eq('contact_id', userId2)
    .maybeSingle();
  
  // Create first direction contact if needed
  if (!existingContact1 && !error1) {
    await supabase
      .from('user_contacts')
      .insert({
        user_id: userId1,
        contact_id: userId2,
        status: 'accepted',
        staff_relation_id: staffRelationId
      });
  }
  
  // Check reverse direction
  const { data: existingContact2, error: error2 } = await supabase
    .from('user_contacts')
    .select('id')
    .eq('user_id', userId2)
    .eq('contact_id', userId1)
    .maybeSingle();
  
  // Create second direction contact if needed
  if (!existingContact2 && !error2) {
    await supabase
      .from('user_contacts')
      .insert({
        user_id: userId2,
        contact_id: userId1,
        status: 'accepted',
        staff_relation_id: staffRelationId
      });
  }
};

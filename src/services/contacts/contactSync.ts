
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures that staff and business contacts are correctly set up
 * This can be called to fix any missing relationships
 */
export const syncStaffBusinessContacts = async (): Promise<boolean> => {
  try {
    // First check if the user is a staff member
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log("No active session, can't sync contacts");
      return false;
    }
    
    const userId = session.user.id;
    console.log("Attempting to sync contacts for user:", userId);
    
    // Check for a staff relation
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('id, business_id, staff_id')
      .or(`staff_id.eq.${userId},business_id.eq.${userId}`)
      .eq('status', 'active');
      
    if (staffError) {
      console.error("Error fetching staff relations:", staffError);
      return false;
    }
      
    if (!staffData || staffData.length === 0) {
      console.log("User is not a staff member or business owner with staff");
      return false; // Not a staff member or business with staff
    }
    
    console.log("Found staff relations:", staffData);
    
    // Create missing contacts
    const promises = staffData.map(async (relation) => {
      try {
        if (relation.staff_id === userId) {
          console.log("User is staff, ensuring contact with business:", relation.business_id);
          // This user is staff, ensure they have contact with their business
          const { data, error } = await supabase
            .from('user_contacts')
            .upsert({
              user_id: relation.staff_id,
              contact_id: relation.business_id,
              status: 'accepted',
              staff_relation_id: relation.id
            }, {
              onConflict: 'user_id,contact_id'
            });
            
          if (error) console.error("Error creating staff->business contact:", error);
          else console.log("Created/updated staff->business contact");
          
        } else if (relation.business_id === userId) {
          console.log("User is business, ensuring contact with staff:", relation.staff_id);
          // This user is a business, ensure they have contact with their staff
          const { data, error } = await supabase
            .from('user_contacts')
            .upsert({
              user_id: relation.business_id,
              contact_id: relation.staff_id,
              status: 'accepted',
              staff_relation_id: relation.id
            }, {
              onConflict: 'user_id,contact_id'
            });
            
          if (error) console.error("Error creating business->staff contact:", error);
          else console.log("Created/updated business->staff contact");
        }
      } catch (innerError) {
        console.error("Error in contact creation for relation:", relation, innerError);
      }
    });
    
    await Promise.all(promises);
    console.log("Contact sync completed");
    return true;
  } catch (error) {
    console.error("Error syncing staff-business contacts:", error);
    return false;
  }
};

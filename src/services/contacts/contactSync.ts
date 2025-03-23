
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
    
    // Create missing contacts - process sequentially to avoid RLS conflicts
    for (const relation of staffData) {
      try {
        // First check if the contact already exists to avoid RLS violation
        if (relation.staff_id === userId) {
          console.log("User is staff, ensuring contact with business:", relation.business_id);
          
          // Check if contact already exists
          const { data: existingContact } = await supabase
            .from('user_contacts')
            .select('id')
            .eq('user_id', relation.staff_id)
            .eq('contact_id', relation.business_id)
            .maybeSingle();
            
          if (!existingContact) {
            // Create staff->business contact
            const { error } = await supabase
              .from('user_contacts')
              .insert({
                user_id: relation.staff_id,
                contact_id: relation.business_id,
                status: 'accepted',
                staff_relation_id: relation.id
              });
              
            if (error) console.error("Error creating staff->business contact:", error);
            else console.log("Created staff->business contact");
          } else {
            console.log("Staff->Business contact already exists");
          }
          
        } else if (relation.business_id === userId) {
          console.log("User is business, ensuring contact with staff:", relation.staff_id);
          
          // Check if contact already exists
          const { data: existingContact } = await supabase
            .from('user_contacts')
            .select('id')
            .eq('user_id', relation.business_id)
            .eq('contact_id', relation.staff_id)
            .maybeSingle();
            
          if (!existingContact) {
            // Create business->staff contact
            const { error } = await supabase
              .from('user_contacts')
              .insert({
                user_id: relation.business_id,
                contact_id: relation.staff_id,
                status: 'accepted',
                staff_relation_id: relation.id
              });
              
            if (error) console.error("Error creating business->staff contact:", error);
            else console.log("Created business->staff contact");
          } else {
            console.log("Business->Staff contact already exists");
          }
        }
      } catch (innerError) {
        console.error("Error in contact creation for relation:", relation, innerError);
      }
    }
    
    console.log("Contact sync completed");
    return true;
  } catch (error) {
    console.error("Error syncing staff-business contacts:", error);
    return false;
  }
};

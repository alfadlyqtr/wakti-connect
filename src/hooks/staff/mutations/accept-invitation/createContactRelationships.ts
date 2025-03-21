
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to create contact relationships
 */
export const createContactRelationships = async (
  businessId: string,
  userId: string,
  staffRelationId: string
) => {
  try {
    console.log("Creating contact relationships between business and staff member");
    
    // First, check if the relationship already exists
    const { data: existingContactData } = await supabase
      .from('user_contacts')
      .select('id')
      .or(`and(user_id.eq.${businessId},contact_id.eq.${userId}),and(user_id.eq.${userId},contact_id.eq.${businessId})`)
      .maybeSingle();
      
    if (existingContactData) {
      console.log("Contact relationship already exists:", existingContactData);
      return;
    }
    
    // Create from business to staff with 'accepted' status
    const { error: error1 } = await supabase
      .from('user_contacts')
      .insert({
        user_id: businessId,
        contact_id: userId,
        status: 'accepted',
        staff_relation_id: staffRelationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (error1) {
      console.error("Error creating business->staff contact:", error1);
      throw error1;
    }
      
    // Create from staff to business with 'accepted' status  
    const { error: error2 } = await supabase
      .from('user_contacts')
      .insert({
        user_id: userId,
        contact_id: businessId,
        status: 'accepted',
        staff_relation_id: staffRelationId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (error2) {
      console.error("Error creating staff->business contact:", error2);
      throw error2;
    }
      
    console.log("Created bidirectional contact relationship between staff and business");
  } catch (contactError) {
    console.error("Error in createContactRelationships:", contactError);
    // Log but continue with the process even if contact creation fails
  }
};

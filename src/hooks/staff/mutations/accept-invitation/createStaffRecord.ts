
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../../types";

/**
 * Helper function to create staff record
 */
export const createStaffRecord = async (
  invitation: StaffInvitation,
  userId: string
) => {
  console.log("Creating staff record for user:", userId);
  
  try {
    // Check if staff record already exists
    const { data: existingStaff } = await supabase
      .from('business_staff')
      .select('id')
      .eq('business_id', invitation.business_id)
      .eq('staff_id', userId)
      .maybeSingle();
      
    if (existingStaff) {
      console.log("Staff record already exists:", existingStaff);
      return existingStaff;
    }
    
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .insert({
        business_id: invitation.business_id,
        staff_id: userId,
        role: invitation.role || 'staff',
        position: invitation.position || 'staff',
        name: invitation.name,
        email: invitation.email,
        status: 'active'
      })
      .select()
      .single();
      
    if (staffError) {
      console.error("Error creating staff record:", staffError);
      throw staffError;
    }
    
    console.log("Created staff record:", staffData);
    return staffData;
  } catch (error) {
    console.error("Error in createStaffRecord:", error);
    throw error;
  }
};

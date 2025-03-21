
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "@/hooks/staff/types";
import { toast } from "@/components/ui/use-toast";

/**
 * Create a user account with the invitation data
 */
export const createUserAccount = async (
  invitation: StaffInvitation,
  password: string
) => {
  console.log("Creating staff account for:", invitation);
  
  // Create user account with staff account_type
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: invitation.email,
    password: password,
    options: {
      data: {
        full_name: invitation.name,
        account_type: 'staff',
        display_name: invitation.name
      }
    }
  });
  
  if (authError) {
    console.error("Auth error:", authError);
    throw authError;
  }
  
  if (!authData.user) {
    throw new Error("Failed to create user account");
  }
  
  console.log("User account created:", authData.user.id);
  return authData.user;
};

/**
 * Create staff record directly as a fallback
 */
export const createStaffRecord = async (invitation: StaffInvitation, userId: string) => {
  try {
    console.log("Creating staff record directly for:", userId);
    
    // Create staff record
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
      console.error("Error creating staff record directly:", staffError);
      throw staffError;
    }
    
    console.log("Created staff record directly:", staffData);
    
    // Send notification to business owner
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: invitation.business_id,
        type: 'staff_joined',
        title: 'New Staff Member Joined',
        content: `${invitation.name} has completed their account setup and joined your team`,
        related_entity_id: userId,
        related_entity_type: 'staff_account'
      });
      
    if (notificationError) {
      console.error("Error sending notification:", notificationError);
    } else {
      console.log("Notification sent to business owner");
    }
    
    await createContactRelationships(invitation.business_id, userId, staffData.id);
    await updateUserProfile(userId);
    
    return staffData;
  } catch (error) {
    console.error("Error in createStaffRecord fallback:", error);
    throw error;
  }
};

/**
 * Create bidirectional contact relationships
 */
export const createContactRelationships = async (
  businessId: string,
  userId: string,
  staffRelationId: string
) => {
  const { error: contactError1 } = await supabase
    .from('user_contacts')
    .insert({
      user_id: businessId,
      contact_id: userId,
      status: 'accepted',
      staff_relation_id: staffRelationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
  const { error: contactError2 } = await supabase
    .from('user_contacts')
    .insert({
      user_id: userId,
      contact_id: businessId,
      status: 'accepted',
      staff_relation_id: staffRelationId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
  if (contactError1 || contactError2) {
    console.error("Error creating contact relationships:", contactError1 || contactError2);
  } else {
    console.log("Created bidirectional contact relationships");
  }
};

/**
 * Update user profile account_type to staff
 */
export const updateUserProfile = async (userId: string) => {
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      account_type: 'staff',
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);
    
  if (profileError) {
    console.error("Error updating user profile:", profileError);
  } else {
    console.log("Updated user profile account_type to staff");
  }
};

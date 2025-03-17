
import { supabase } from "@/integrations/supabase/client";
import { InvitationRecipient } from "@/types/invitation.types";
import { generateRandomString } from "@/utils/stringUtils";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Create a new invitation for an appointment
 */
export const createInvitation = async (
  appointmentId: string,
  recipients: InvitationRecipient[],
  customizationId?: string
): Promise<{ success: boolean; errors?: string[] }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }

    const errors: string[] = [];
    
    // Filter recipients to contacts vs. external emails
    const contactRecipients = recipients.filter(r => r.type === 'contact');
    const emailRecipients = recipients.filter(r => r.type === 'email');
    
    // Create invitations for contacts
    if (contactRecipients.length > 0) {
      const contactInvitations = contactRecipients.map(contact => ({
        appointment_id: appointmentId,
        invited_user_id: contact.id,
        status: 'pending'
      }));
      
      const { error } = await supabase
        .from('appointment_invitations')
        .insert(contactInvitations);
      
      if (error) {
        errors.push(`Error creating contact invitations: ${error.message}`);
      }
    }
    
    // Create invitations for emails
    if (emailRecipients.length > 0) {
      // Check if the user can send email invitations (has paid account)
      const { data: userPrefs } = await fromTable('user_invitation_preferences')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      // Create email invitations
      const emailInvitationsPromises = emailRecipients.map(async (recipient) => {
        // Create an invitation record
        const { data: invitation, error: invError } = await supabase
          .from('appointment_invitations')
          .insert({
            appointment_id: appointmentId,
            email: recipient.email,
            status: 'pending',
            shared_as_link: true
          })
          .select()
          .single();
        
        if (invError) {
          errors.push(`Error creating email invitation: ${invError.message}`);
          return;
        }
        
        // Create a link for the invitation
        const accessToken = generateRandomString(24);
        
        const { error: linkError } = await fromTable('invitation_links')
          .insert({
            invitation_id: invitation.id,
            recipient_email: recipient.email || '',
            external_access_token: accessToken,
            status: 'pending'
          });
        
        if (linkError) {
          errors.push(`Error creating invitation link: ${linkError.message}`);
          return;
        }
        
        // Associate customization with invitation if provided
        if (customizationId) {
          await fromTable('invitation_customizations')
            .update({ invitation_id: invitation.id })
            .eq('id', customizationId);
        }
      });
      
      await Promise.all(emailInvitationsPromises);
    }
    
    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error: any) {
    console.error("Error creating invitation:", error);
    return {
      success: false,
      errors: [error.message || "Unknown error creating invitation"]
    };
  }
};

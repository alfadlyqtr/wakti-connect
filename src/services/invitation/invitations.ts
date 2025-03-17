
import { supabase } from "@/integrations/supabase/client";
import { InvitationRecipient } from "@/types/invitation.types";
import { generateRandomString } from "@/utils/stringUtils";
import { fromTable } from "@/integrations/supabase/helper";
import { toast } from "@/components/ui/use-toast";

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
    
    // Create invitations for contacts with retry logic
    if (contactRecipients.length > 0) {
      await createContactInvitations(contactRecipients, appointmentId, errors);
    }
    
    // Create invitations for emails with retry logic
    if (emailRecipients.length > 0) {
      await createEmailInvitations(emailRecipients, appointmentId, customizationId, session.user.id, errors);
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

// Helper function to create contact invitations with retry
async function createContactInvitations(
  contactRecipients: InvitationRecipient[],
  appointmentId: string,
  errors: string[]
): Promise<void> {
  const contactInvitations = contactRecipients.map(contact => ({
    appointment_id: appointmentId,
    invited_user_id: contact.id,
    status: 'pending',
    shared_as_link: false
  }));
  
  let retries = 0;
  const maxRetries = 3;
  
  while (retries < maxRetries) {
    try {
      const { error } = await supabase
        .from('appointment_invitations')
        .insert(contactInvitations);
      
      if (error) {
        console.error(`Attempt ${retries + 1} - Error creating contact invitations:`, error);
        retries++;
        
        if (retries >= maxRetries) {
          errors.push(`Failed to create contact invitations after ${maxRetries} attempts: ${error.message}`);
        }
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
      } else {
        // Success, exit the loop
        break;
      }
    } catch (e: any) {
      console.error(`Unexpected error in createContactInvitations:`, e);
      errors.push(e.message || "Unknown error creating contact invitations");
      break;
    }
  }
}

// Helper function to create email invitations with retry
async function createEmailInvitations(
  emailRecipients: InvitationRecipient[],
  appointmentId: string,
  customizationId: string | undefined,
  userId: string,
  errors: string[]
): Promise<void> {
  try {
    // Check if the user can send email invitations (has paid account)
    const { data: userAccountType } = await supabase.rpc('get_user_account_type', { user_uid: userId });
    
    const isPaidAccount = userAccountType !== 'free';
    
    if (!isPaidAccount) {
      errors.push("Email invitations are only available for paid accounts");
      toast({
        title: "Premium Feature",
        description: "Email invitations are only available for paid accounts",
        variant: "destructive"
      });
      return;
    }
    
    // Process each email recipient
    for (const recipient of emailRecipients) {
      let retries = 0;
      const maxRetries = 3;
      
      while (retries < maxRetries) {
        try {
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
            console.error(`Attempt ${retries + 1} - Error creating email invitation:`, invError);
            retries++;
            
            if (retries >= maxRetries) {
              errors.push(`Failed to create email invitation after ${maxRetries} attempts: ${invError.message}`);
            }
            
            // Wait before retry with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
            continue;
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
            continue;
          }
          
          // Associate customization with invitation if provided
          if (customizationId) {
            await fromTable('invitation_customizations')
              .update({ invitation_id: invitation.id })
              .eq('id', customizationId);
          }
          
          // Success, exit the retry loop
          break;
        } catch (e: any) {
          console.error(`Unexpected error in createEmailInvitations:`, e);
          errors.push(e.message || "Unknown error creating email invitation");
          break;
        }
      }
    }
  } catch (error: any) {
    console.error("Error in createEmailInvitations:", error);
    errors.push(error.message || "Unknown error processing email invitations");
  }
}

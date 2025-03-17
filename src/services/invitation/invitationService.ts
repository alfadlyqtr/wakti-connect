
import { supabase } from "@/integrations/supabase/client";
import { InvitationTemplate, InvitationStyle, InvitationCustomization, InvitationRecipient } from "@/types/invitation.types";
import { Appointment } from "@/types/appointment.types";
import { generateRandomString } from "@/utils/stringUtils";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Fetch available invitation templates
 */
export const fetchInvitationTemplates = async (): Promise<InvitationTemplate[]> => {
  try {
    const { data, error } = await fromTable('invitation_templates')
      .select('*');

    if (error) {
      throw error;
    }

    return data.map(template => ({
      id: template.id,
      name: template.name,
      previewImage: template.preview_image,
      defaultStyles: template.default_styles,
      createdAt: template.created_at
    }));
  } catch (error) {
    console.error("Error fetching invitation templates:", error);
    return [];
  }
};

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

/**
 * Create a customization for an invitation
 */
export const createInvitationCustomization = async (
  templateId: string,
  customizationData: Partial<InvitationCustomization>
): Promise<InvitationCustomization | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    // Get the template default styles
    const { data: template } = await fromTable('invitation_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (!template) {
      throw new Error("Template not found");
    }
    
    // Create a customization with template defaults + custom overrides
    const newCustomization = {
      creator_id: session.user.id,
      background_type: customizationData.backgroundType || template.default_styles.background.type,
      background_value: customizationData.backgroundValue || template.default_styles.background.value,
      font_family: customizationData.fontFamily || template.default_styles.fontFamily,
      font_size: customizationData.fontSize || template.default_styles.fontSize,
      text_align: customizationData.textAlign || template.default_styles.textAlign,
      button_styles: customizationData.buttonStyles || template.default_styles.buttons,
      layout_size: customizationData.layoutSize || 'medium',
      header_image: customizationData.headerImage || null,
      map_location: customizationData.mapLocation || null,
      custom_effects: customizationData.customEffects || null
    };
    
    const { data, error } = await fromTable('invitation_customizations')
      .insert(newCustomization)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      invitationId: data.invitation_id,
      creatorId: data.creator_id,
      backgroundType: data.background_type,
      backgroundValue: data.background_value,
      fontFamily: data.font_family,
      fontSize: data.font_size,
      textAlign: data.text_align,
      buttonStyles: data.button_styles,
      layoutSize: data.layout_size,
      headerImage: data.header_image,
      mapLocation: data.map_location,
      customEffects: data.custom_effects,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error creating invitation customization:", error);
    return null;
  }
};

/**
 * Get customization for an invitation
 */
export const getInvitationCustomization = async (invitationId: string): Promise<InvitationCustomization | null> => {
  try {
    const { data, error } = await fromTable('invitation_customizations')
      .select('*')
      .eq('invitation_id', invitationId)
      .maybeSingle();
    
    if (error || !data) {
      return null;
    }
    
    return {
      id: data.id,
      invitationId: data.invitation_id,
      creatorId: data.creator_id,
      backgroundType: data.background_type,
      backgroundValue: data.background_value,
      fontFamily: data.font_family,
      fontSize: data.font_size,
      textAlign: data.text_align,
      buttonStyles: data.button_styles,
      layoutSize: data.layout_size,
      headerImage: data.header_image,
      mapLocation: data.map_location,
      customEffects: data.custom_effects,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error getting invitation customization:", error);
    return null;
  }
};

/**
 * Respond to an invitation
 */
export const respondToInvitation = async (
  invitationId: string,
  accept: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No authenticated user");
    }
    
    const { error } = await supabase
      .from('appointment_invitations')
      .update({
        status: accept ? 'accepted' : 'declined'
      })
      .eq('id', invitationId)
      .eq('invited_user_id', session.user.id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error responding to invitation:", error);
    return {
      success: false,
      error: error.message || "Unknown error responding to invitation"
    };
  }
};

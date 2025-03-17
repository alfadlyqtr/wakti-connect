
import { supabase } from "@/integrations/supabase/client";
import { InvitationTemplate, InvitationCustomization, InvitationLink, InvitationRecipient } from "@/types/invitation.types";
import { toast } from "@/components/ui/use-toast";
import { generateRandomString } from "@/utils/stringUtils";

/**
 * Fetch available invitation templates
 */
export async function fetchInvitationTemplates(): Promise<InvitationTemplate[]> {
  try {
    const { data, error } = await supabase
      .from('invitation_templates')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
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
}

/**
 * Create invitation for an appointment
 */
export async function createInvitation(
  appointmentId: string, 
  recipients: InvitationRecipient[],
  customizationId?: string
) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // Check user's account type
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .maybeSingle();
    
    if (profileError) {
      console.error("Error checking user account type:", profileError);
      throw new Error("Unable to verify account permissions");
    }
    
    // Only allow paid accounts to create invitations
    if (!profileData || profileData.account_type === 'free') {
      toast({
        title: "Premium Feature",
        description: "Creating invitations is only available for paid accounts. Please upgrade your plan.",
        variant: "destructive",
      });
      throw new Error("This feature is only available for paid accounts");
    }
    
    // Process each recipient
    const invitationResults = [];
    
    for (const recipient of recipients) {
      let invitationData: any = {
        appointment_id: appointmentId,
        status: 'pending'
      };
      
      if (recipient.type === 'contact' && recipient.id) {
        // For contacts (other WAKTI users)
        invitationData.invited_user_id = recipient.id;
        
        // Check if user wants to receive invitations
        const { data: prefData } = await supabase
          .from('user_invitation_preferences')
          .select('can_receive_invitations')
          .eq('user_id', recipient.id)
          .maybeSingle();
        
        // Skip if they have explicitly opted out
        if (prefData && prefData.can_receive_invitations === false) {
          continue;
        }
        
      } else if (recipient.type === 'email' && recipient.email) {
        // For external recipients
        invitationData.email = recipient.email;
        invitationData.shared_as_link = true;
      } else {
        continue; // Skip invalid recipients
      }
      
      // Create the invitation
      const { data: invitation, error: invitationError } = await supabase
        .from('appointment_invitations')
        .insert(invitationData)
        .select()
        .single();
      
      if (invitationError) {
        console.error("Error creating invitation:", invitationError);
        continue;
      }
      
      // Apply customization if provided
      if (customizationId && invitation) {
        await supabase
          .from('invitation_customizations')
          .update({ invitation_id: invitation.id })
          .eq('id', customizationId);
      }
      
      // Create external link if needed
      if (invitation && recipient.type === 'email' && recipient.email) {
        const token = generateRandomString(32);
        
        await supabase
          .from('invitation_links')
          .insert({
            invitation_id: invitation.id,
            external_access_token: token,
            recipient_email: recipient.email,
            status: 'pending'
          });
      }
      
      if (invitation) {
        invitationResults.push(invitation);
      }
    }
    
    return invitationResults;
  } catch (error) {
    console.error("Error creating invitations:", error);
    throw error;
  }
}

/**
 * Create a custom invitation style
 */
export async function createInvitationCustomization(
  templateId: string,
  customizations: Partial<InvitationCustomization>
): Promise<InvitationCustomization> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("No active session");
    }
    
    // First get the template default styles
    const { data: template, error: templateError } = await supabase
      .from('invitation_templates')
      .select('default_styles')
      .eq('id', templateId)
      .single();
    
    if (templateError) {
      throw templateError;
    }
    
    // Prepare customization data using template defaults with overrides
    const defaultStyles = template.default_styles;
    
    const customizationData = {
      creator_id: session.user.id,
      background_type: customizations.backgroundType || defaultStyles.background.type,
      background_value: customizations.backgroundValue || defaultStyles.background.value,
      font_family: customizations.fontFamily || defaultStyles.fontFamily,
      font_size: customizations.fontSize || defaultStyles.fontSize,
      text_align: customizations.textAlign || defaultStyles.textAlign,
      button_styles: customizations.buttonStyles || defaultStyles.buttons,
      layout_size: customizations.layoutSize || 'medium',
      header_image: customizations.headerImage,
      map_location: customizations.mapLocation,
      custom_effects: customizations.customEffects || { shadow: defaultStyles.shadow }
    };
    
    // Insert the customization
    const { data, error } = await supabase
      .from('invitation_customizations')
      .insert(customizationData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      invitationId: data.invitation_id,
      creatorId: data.creator_id,
      backgroundType: data.background_type,
      backgroundValue: data.background_value,
      fontFamily: data.font_family,
      fontSize: data.font_size as 'small' | 'medium' | 'large',
      textAlign: data.text_align as 'left' | 'center' | 'right',
      buttonStyles: data.button_styles,
      layoutSize: data.layout_size as 'small' | 'medium' | 'large',
      headerImage: data.header_image,
      mapLocation: data.map_location,
      customEffects: data.custom_effects,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error creating invitation customization:", error);
    throw error;
  }
}

/**
 * Get customization for an invitation
 */
export async function getInvitationCustomization(invitationId: string): Promise<InvitationCustomization | null> {
  try {
    const { data, error } = await supabase
      .from('invitation_customizations')
      .select('*')
      .eq('invitation_id', invitationId)
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      invitationId: data.invitation_id,
      creatorId: data.creator_id,
      backgroundType: data.background_type,
      backgroundValue: data.background_value,
      fontFamily: data.font_family,
      fontSize: data.font_size as 'small' | 'medium' | 'large',
      textAlign: data.text_align as 'left' | 'center' | 'right',
      buttonStyles: data.button_styles,
      layoutSize: data.layout_size as 'small' | 'medium' | 'large',
      headerImage: data.header_image,
      mapLocation: data.map_location,
      customEffects: data.custom_effects,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error fetching invitation customization:", error);
    return null;
  }
}

/**
 * Respond to an invitation
 */
export async function respondToInvitation(
  invitationId: string, 
  response: 'accepted' | 'declined'
): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const { error } = await supabase
      .from('appointment_invitations')
      .update({ status: response })
      .eq('id', invitationId)
      .eq('invited_user_id', session.user.id);
    
    if (error) throw error;
    
    toast({
      title: `Invitation ${response}`,
      description: `You have ${response} the appointment invitation.`
    });
    
    return true;
  } catch (error) {
    console.error("Error responding to invitation:", error);
    toast({
      title: "Failed to respond to invitation",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
}

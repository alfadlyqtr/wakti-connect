
import { supabase } from "@/integrations/supabase/client";
import { InvitationCustomization } from "@/types/invitation.types";
import { fromTable } from "@/integrations/supabase/helper";

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
      header_image: customizationData.customEffects?.shadow || null,
      map_location: null,
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
      backgroundType: data.background_type,
      backgroundValue: data.background_value,
      fontFamily: data.font_family,
      fontSize: data.font_size,
      textAlign: data.text_align,
      buttonStyles: data.button_styles,
      layoutSize: data.layout_size,
      customEffects: data.custom_effects,
      creatorId: data.creator_id,
      invitationId: data.invitation_id,
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
      backgroundType: data.background_type,
      backgroundValue: data.background_value,
      fontFamily: data.font_family,
      fontSize: data.font_size,
      textAlign: data.text_align,
      buttonStyles: data.button_styles,
      layoutSize: data.layout_size,
      customEffects: data.custom_effects,
      creatorId: data.creator_id,
      invitationId: data.invitation_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  } catch (error) {
    console.error("Error getting invitation customization:", error);
    return null;
  }
};

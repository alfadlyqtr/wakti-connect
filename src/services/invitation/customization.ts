
import { supabase } from "@/integrations/supabase/client";
import { InvitationCustomization } from "@/types/invitation.types";

/**
 * Save customization settings for an invitation/event
 */
export const saveInvitationCustomization = async (
  invitationId: string,
  customization: Partial<InvitationCustomization>
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.user) {
      throw new Error("Not authenticated");
    }
    
    // First check if customization already exists for this invitation
    const { data: existing } = await supabase
      .from('invitation_customizations')
      .select('id')
      .eq('invitation_id', invitationId)
      .single();
    
    // Prepare the data for upsert
    const customizationData = {
      invitation_id: invitationId,
      creator_id: session.user.id,
      background_type: customization.backgroundType,
      background_value: customization.backgroundValue,
      font_family: customization.fontFamily,
      font_size: customization.fontSize,
      text_align: customization.textAlign,
      button_styles: customization.buttonStyles,
      layout_size: customization.layoutSize,
      custom_effects: customization.customEffects,
      header_image: customization.headerImage,
      map_location: customization.mapLocation,
      updated_at: new Date().toISOString()
    };
    
    let result;
    
    if (existing) {
      // Update existing customization
      result = await supabase
        .from('invitation_customizations')
        .update(customizationData)
        .eq('id', existing.id);
    } else {
      // Insert new customization
      result = await supabase
        .from('invitation_customizations')
        .insert({
          ...customizationData,
          created_at: new Date().toISOString()
        });
    }
    
    if (result.error) {
      console.error("Error saving invitation customization:", result.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception saving invitation customization:", error);
    return false;
  }
};

/**
 * Get customization settings for an invitation/event
 */
export const getInvitationCustomization = async (
  invitationId: string
): Promise<InvitationCustomization | null> => {
  try {
    const { data, error } = await supabase
      .from('invitation_customizations')
      .select('*')
      .eq('invitation_id', invitationId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return null;
      }
      
      console.error("Error fetching invitation customization:", error);
      throw error;
    }
    
    if (!data) return null;
    
    // Transform database fields to camelCase for the frontend
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
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      headerImage: data.header_image,
      mapLocation: data.map_location,
      invitationId: data.invitation_id
    };
  } catch (error) {
    console.error("Exception fetching invitation customization:", error);
    return null;
  }
};

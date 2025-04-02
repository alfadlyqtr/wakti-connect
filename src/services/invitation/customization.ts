
import { supabase } from '@/integrations/supabase/client';
import { InvitationCustomization } from '@/types/invitation.types';

export const getInvitationCustomization = async (invitationId: string): Promise<InvitationCustomization | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to get invitation customization');
    }
    
    // First check if a customization exists for this invitation
    const { data, error } = await supabase
      .from('invitation_customizations')
      .select('*')
      .eq('invitation_id', invitationId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No customization found, return null
        return null;
      }
      console.error('Error getting invitation customization:', error);
      throw new Error(`Failed to get invitation customization: ${error.message}`);
    }
    
    // Transform database format to application format
    return {
      id: data.id,
      font: {
        family: data.font_family || 'system-ui, sans-serif',
        size: data.font_size || 'medium',
        color: data.font_color || '#333333',
      },
      buttonStyle: data.button_style || 'rounded',
      buttonColor: data.button_color || '#3B82F6',
      layoutSize: data.layout_size || 'medium',
      effects: data.custom_effects || {},
      creatorId: data.creator_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      invitationId: data.invitation_id
    };
  } catch (error) {
    console.error('Error in getInvitationCustomization:', error);
    throw error;
  }
};

export const saveInvitationCustomization = async (invitationId: string, customization: InvitationCustomization): Promise<InvitationCustomization> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      throw new Error('You must be logged in to save invitation customization');
    }
    
    // Check if customization already exists
    const { data: existingData } = await supabase
      .from('invitation_customizations')
      .select('id')
      .eq('invitation_id', invitationId)
      .single();
    
    const dbCustomization = {
      invitation_id: invitationId,
      creator_id: session.session.user.id,
      font_family: customization.font?.family || 'system-ui, sans-serif',
      font_size: customization.font?.size || 'medium',
      font_color: customization.font?.color || '#333333',
      button_style: customization.buttonStyle || 'rounded',
      button_color: customization.buttonColor || '#3B82F6',
      layout_size: customization.layoutSize || 'medium',
      custom_effects: customization.effects || {}
    };
    
    if (existingData) {
      // Update existing customization
      const { data, error } = await supabase
        .from('invitation_customizations')
        .update(dbCustomization)
        .eq('id', existingData.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating invitation customization:', error);
        throw new Error(`Failed to update invitation customization: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Failed to update invitation customization');
      }
      
      return {
        id: data.id,
        font: {
          family: data.font_family || 'system-ui, sans-serif',
          size: data.font_size || 'medium',
          color: data.font_color || '#333333',
        },
        buttonStyle: data.button_style || 'rounded',
        buttonColor: data.button_color || '#3B82F6',
        layoutSize: data.layout_size || 'medium',
        effects: data.custom_effects || {},
        creatorId: data.creator_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        invitationId: data.invitation_id
      };
    } else {
      // Create new customization
      const { data, error } = await supabase
        .from('invitation_customizations')
        .insert(dbCustomization)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating invitation customization:', error);
        throw new Error(`Failed to create invitation customization: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('Failed to create invitation customization');
      }
      
      return {
        id: data.id,
        font: {
          family: data.font_family || 'system-ui, sans-serif',
          size: data.font_size || 'medium',
          color: data.font_color || '#333333',
        },
        buttonStyle: data.button_style || 'rounded',
        buttonColor: data.button_color || '#3B82F6',
        layoutSize: data.layout_size || 'medium',
        effects: data.custom_effects || {},
        creatorId: data.creator_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        invitationId: data.invitation_id
      };
    }
  } catch (error) {
    console.error('Error in saveInvitationCustomization:', error);
    throw error;
  }
};

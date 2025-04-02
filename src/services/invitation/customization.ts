import { supabase } from '@/lib/supabase';
import { InvitationCustomization } from '@/types/invitation.types';
import { EventCustomization, BackgroundType } from '@/types/event.types';

// Helper function to safely convert the EventCustomization to a JSON object
const convertEventCustomization = (customization: EventCustomization): any => {
  return {
    background: {
      type: customization.background.type,
      value: customization.background.value,
      angle: customization.background.angle,
      direction: customization.background.direction
    },
    font: {
      family: customization.font.family,
      size: customization.font.size, 
      color: customization.font.color,
      weight: customization.font.weight,
      alignment: customization.font.alignment
    },
    buttons: {
      accept: { ...customization.buttons.accept },
      decline: { ...customization.buttons.decline }
    },
    // Include other properties as needed
    headerImage: customization.headerImage,
    headerStyle: customization.headerStyle,
    animation: customization.animation,
    cardEffect: customization.cardEffect,
    branding: customization.branding,
    enableChatbot: customization.enableChatbot,
    showAcceptDeclineButtons: customization.showAcceptDeclineButtons
  };
};

/**
 * Get invitation customization by invitation ID
 */
export const getInvitationCustomization = async (invitationId: string): Promise<InvitationCustomization | null> => {
  try {
    const { data, error } = await supabase
      .from('invitation_customizations')
      .select('*')
      .eq('invitation_id', invitationId)
      .single();
    
    if (error) {
      console.error('Error fetching invitation customization:', error);
      return null;
    }
    
    return data as InvitationCustomization;
  } catch (error) {
    console.error('Error in getInvitationCustomization:', error);
    return null;
  }
};

/**
 * Save invitation customization
 */
export const saveInvitationCustomization = async (invitationId: string, customization: InvitationCustomization): Promise<InvitationCustomization | null> => {
  try {
    // Convert EventCustomization to a safe JSON format
    const safeCustomization = convertEventCustomization(customization as EventCustomization);
    
    const { data, error } = await supabase
      .from('invitation_customizations')
      .upsert(
        { invitation_id: invitationId, customization: safeCustomization },
        { onConflict: 'invitation_id' }
      )
      .select('*')
      .single();
    
    if (error) {
      console.error('Error saving invitation customization:', error);
      return null;
    }
    
    return data as InvitationCustomization;
  } catch (error) {
    console.error('Error in saveInvitationCustomization:', error);
    return null;
  }
};

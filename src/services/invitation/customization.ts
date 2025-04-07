
import { supabase } from '@/integrations/supabase/client';
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

// Helper function to convert InvitationCustomization to EventCustomization
const convertToEventCustomization = (invitationCustomization: InvitationCustomization): EventCustomization => {
  // Create a default EventCustomization structure
  const eventCustomization: EventCustomization = {
    background: {
      type: invitationCustomization.backgroundType === 'solid' ? 'solid' as BackgroundType : 
             (invitationCustomization.backgroundType as BackgroundType) || 'solid' as BackgroundType,
      value: invitationCustomization.backgroundValue || '#ffffff'
    },
    font: {
      family: invitationCustomization.fontFamily || 'system-ui, sans-serif',
      size: invitationCustomization.fontSize || 'medium',
      color: invitationCustomization.textColor || '#000000',
      weight: 'normal',
      alignment: invitationCustomization.textAlign || 'left'
    },
    buttons: {
      accept: {
        background: invitationCustomization.buttonStyles?.color || '#3B82F6',
        color: '#ffffff',
        shape: invitationCustomization.buttonStyles?.style || 'rounded'
      },
      decline: {
        background: '#f43f5e',
        color: '#ffffff',
        shape: invitationCustomization.buttonStyles?.style || 'rounded'
      }
    }
  };

  return eventCustomization;
};

/**
 * Get invitation customization by invitation ID
 * Using direct query to event_invitations table
 */
export const getInvitationCustomization = async (invitationId: string): Promise<InvitationCustomization | null> => {
  try {
    // Query the event_invitations table directly
    const { data, error } = await supabase
      .from('event_invitations')
      .select('*')
      .eq('id', invitationId)
      .single();
    
    if (error || !data) {
      console.error('Error fetching invitation:', error || 'No data found');
      return null;
    }
    
    // Get the corresponding event to retrieve customization
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('customization')
      .eq('id', data.event_id)
      .single();
      
    if (eventError || !eventData || !eventData.customization) {
      console.error('Error fetching event customization:', eventError || 'No customization found');
      return null;
    }
    
    // Return customization from the event
    // First try to use it directly as InvitationCustomization
    // If that doesn't work, use default values
    return {
      backgroundType: 'solid',
      backgroundValue: '#ffffff',
      fontFamily: 'system-ui, sans-serif',
      fontSize: 'medium',
      textColor: '#000000',
      textAlign: 'left',
      buttonStyles: { 
        style: 'rounded', 
        color: '#3B82F6' 
      },
      ...eventData.customization
    } as InvitationCustomization;
  } catch (error) {
    console.error('Error in getInvitationCustomization:', error);
    return null;
  }
};

/**
 * Save invitation customization by updating the event
 */
export const saveInvitationCustomization = async (invitationId: string, customization: InvitationCustomization): Promise<InvitationCustomization | null> => {
  try {
    // Get the event_id from the invitation first
    const { data: invitation, error: invitationError } = await supabase
      .from('event_invitations')
      .select('event_id')
      .eq('id', invitationId)
      .single();
    
    if (invitationError || !invitation || !invitation.event_id) {
      console.error('Error finding invitation:', invitationError || 'No invitation found');
      return null;
    }

    // Update the event with the new customization
    const { error: updateError } = await supabase
      .from('events')
      .update({ 
        customization: customization,
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.event_id);
    
    if (updateError) {
      console.error('Error updating event customization:', updateError);
      return null;
    }
    
    return customization;
  } catch (error) {
    console.error('Error in saveInvitationCustomization:', error);
    return null;
  }
};

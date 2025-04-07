
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
 * Note: This function assumes invitation_customizations table exists
 * If the table doesn't exist, you'll need to create it first
 */
export const getInvitationCustomization = async (invitationId: string): Promise<InvitationCustomization | null> => {
  try {
    // Check if the table exists first (to avoid errors if it doesn't)
    const { data: tableExists } = await supabase.rpc('check_table_exists', {
      table_name: 'invitation_customizations'
    });

    if (!tableExists) {
      console.warn("invitation_customizations table doesn't exist yet");
      return null;
    }

    // Use the raw query method to avoid TypeScript errors with undefined tables
    const { data, error } = await supabase
      .rpc('select_from_invitation_customizations', {
        invitation_id_param: invitationId
      });
    
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
    // Check if the table exists first
    const { data: tableExists } = await supabase.rpc('check_table_exists', {
      table_name: 'invitation_customizations'
    });

    if (!tableExists) {
      console.warn("invitation_customizations table doesn't exist yet");
      return null;
    }

    // Convert InvitationCustomization to EventCustomization for proper processing
    const eventCustomization = convertToEventCustomization(customization);
    
    // Then convert EventCustomization to a safe JSON format
    const safeCustomization = convertEventCustomization(eventCustomization);
    
    // Use RPC to insert data safely
    const { data, error } = await supabase
      .rpc('upsert_invitation_customization', {
        invitation_id_param: invitationId,
        customization_param: safeCustomization
      });
    
    if (error) {
      console.error('Error saving invitation customization:', error);
      return null;
    }
    
    return customization;
  } catch (error) {
    console.error('Error in saveInvitationCustomization:', error);
    return null;
  }
};

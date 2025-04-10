
import { supabase } from '@/lib/supabase';
import { InvitationCustomization } from '@/types/invitation.types';
import { EventCustomization, BackgroundType, TextAlign, ButtonShape } from '@/types/event.types';

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

// Helper function to ensure text alignment is a valid TextAlign value
const ensureValidTextAlign = (alignment: string): TextAlign => {
  const validAlignments: TextAlign[] = ['left', 'center', 'right', 'justify'];
  return validAlignments.includes(alignment as TextAlign) 
    ? (alignment as TextAlign) 
    : 'left';
};

// Helper function to ensure button shape is a valid ButtonShape value
const ensureValidButtonShape = (shape: string): ButtonShape => {
  const validShapes: ButtonShape[] = ['rounded', 'pill', 'square'];
  return validShapes.includes(shape as ButtonShape)
    ? (shape as ButtonShape)
    : 'rounded';
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
      alignment: ensureValidTextAlign(invitationCustomization.textAlign || 'left')
    },
    buttons: {
      accept: {
        background: invitationCustomization.buttonStyles?.color || '#3B82F6',
        color: '#ffffff',
        shape: ensureValidButtonShape(invitationCustomization.buttonStyles?.style || 'rounded')
      },
      decline: {
        background: '#f43f5e',
        color: '#ffffff',
        shape: ensureValidButtonShape(invitationCustomization.buttonStyles?.style || 'rounded')
      }
    }
  };

  return eventCustomization;
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
    // Convert InvitationCustomization to EventCustomization for proper processing
    const eventCustomization = convertToEventCustomization(customization);
    
    // Then convert EventCustomization to a safe JSON format
    const safeCustomization = convertEventCustomization(eventCustomization);
    
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

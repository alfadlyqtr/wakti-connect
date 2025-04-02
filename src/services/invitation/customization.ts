
import { supabase } from '@/lib/supabase';
import { InvitationCustomization } from '@/types/invitation.types';
import { parseEventCustomization, stringifyEventCustomization } from '@/services/event/eventHelpers';

/**
 * Gets customization data for an invitation
 */
export const getInvitationCustomization = async (invitationId: string): Promise<InvitationCustomization | null> => {
  try {
    const { data: invitation, error } = await supabase
      .from('event_invitations')
      .select('event_id')
      .eq('id', invitationId)
      .single();
      
    if (error) {
      console.error('Error fetching invitation:', error);
      return null;
    }
    
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('customization')
      .eq('id', invitation.event_id)
      .single();
      
    if (eventError) {
      console.error('Error fetching event customization:', eventError);
      return null;
    }
    
    // Parse the customization string if needed
    const eventCustomization = parseEventCustomization(event.customization);
    
    // Convert to invitation customization format
    const invitationCustomization: InvitationCustomization = {
      backgroundType: eventCustomization.background.type,
      backgroundValue: eventCustomization.background.value,
      fontFamily: eventCustomization.font.family,
      fontSize: eventCustomization.font.size,
      textColor: eventCustomization.font.color,
      textAlign: eventCustomization.font.alignment || 'left',
      buttonStyles: {
        style: eventCustomization.buttons.accept.shape,
        color: eventCustomization.buttons.accept.background
      },
      layoutSize: 'medium',
      customEffects: {}
    };
    
    return invitationCustomization;
  } catch (error) {
    console.error('Error in getInvitationCustomization:', error);
    return null;
  }
};

/**
 * Saves customization data for an invitation
 */
export const saveInvitationCustomization = async (
  invitationId: string, 
  customization: InvitationCustomization
): Promise<InvitationCustomization | null> => {
  try {
    const { data: invitation, error } = await supabase
      .from('event_invitations')
      .select('event_id')
      .eq('id', invitationId)
      .single();
      
    if (error) {
      console.error('Error fetching invitation:', error);
      return null;
    }
    
    // Convert invitation customization to event customization format
    const eventCustomization = {
      background: {
        type: customization.backgroundType,
        value: customization.backgroundValue
      },
      font: {
        family: customization.fontFamily,
        size: customization.fontSize,
        color: customization.textColor,
        alignment: customization.textAlign
      },
      buttons: {
        accept: {
          background: customization.buttonStyles.color,
          color: '#ffffff',
          shape: customization.buttonStyles.style
        },
        decline: {
          background: '#f44336',
          color: '#ffffff',
          shape: customization.buttonStyles.style
        }
      }
    };
    
    // Stringify the customization object
    const customizationString = stringifyEventCustomization(eventCustomization);
    
    // Update the event's customization
    const { error: updateError } = await supabase
      .from('events')
      .update({ customization: customizationString })
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

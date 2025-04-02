
import { supabase } from '@/integrations/supabase/client';
import { InvitationCustomization } from '@/types/invitation.types';

export async function getInvitationCustomization(invitationId: string): Promise<InvitationCustomization | null> {
  try {
    // Try to get customization from the events table first
    const { data: eventInvitation, error: invitationError } = await supabase
      .from('event_invitations')
      .select('event_id')
      .eq('id', invitationId)
      .single();

    if (invitationError) {
      console.error('Error fetching invitation:', invitationError);
      return null;
    }

    if (!eventInvitation?.event_id) {
      return null;
    }

    // Get the event with customization data
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('customization')
      .eq('id', eventInvitation.event_id)
      .single();

    if (eventError) {
      console.error('Error fetching event:', eventError);
      return null;
    }

    if (!event || !event.customization) {
      return null;
    }

    // Convert the event customization to invitation customization format
    const eventCustomization = event.customization;
    
    // Map the customization fields
    const invitationCustomization: InvitationCustomization = {
      backgroundType: eventCustomization.background?.type || 'solid',
      backgroundValue: eventCustomization.background?.value || '#ffffff',
      fontFamily: eventCustomization.font?.family || 'system-ui, sans-serif',
      fontSize: eventCustomization.font?.size || 'medium',
      textAlign: eventCustomization.font?.alignment || 'left',
      buttonStyles: {
        style: eventCustomization.buttons?.accept?.shape || 'rounded',
        color: eventCustomization.buttons?.accept?.background || '#4CAF50'
      },
      layoutSize: 'medium',
      headerImage: eventCustomization.headerImage,
      customEffects: eventCustomization.cardEffect 
        ? { shadow: eventCustomization.cardEffect.type === 'shadow' ? 'normal' : 'none' }
        : {}
    };

    return invitationCustomization;
  } catch (error) {
    console.error('Error in getInvitationCustomization:', error);
    return null;
  }
}

export async function saveInvitationCustomization(
  invitationId: string,
  customization: InvitationCustomization
): Promise<InvitationCustomization | null> {
  try {
    // Get the event ID from the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('event_invitations')
      .select('event_id')
      .eq('id', invitationId)
      .single();

    if (invitationError) {
      console.error('Error fetching invitation:', invitationError);
      return null;
    }

    if (!invitation?.event_id) {
      console.error('Invitation has no associated event');
      return null;
    }

    // Convert invitation customization to event customization format
    const eventCustomization = {
      background: {
        type: customization.backgroundType || 'solid',
        value: customization.backgroundValue || '#ffffff',
      },
      font: {
        family: customization.fontFamily || 'system-ui, sans-serif',
        size: customization.fontSize || 'medium',
        color: '#333333',
        alignment: customization.textAlign || 'left',
      },
      buttons: {
        accept: {
          background: customization.buttonStyles?.color || '#4CAF50',
          color: '#ffffff',
          shape: customization.buttonStyles?.style || 'rounded',
        },
        decline: {
          background: '#f44336',
          color: '#ffffff',
          shape: customization.buttonStyles?.style || 'rounded',
        }
      },
      headerImage: customization.headerImage,
      cardEffect: customization.customEffects?.shadow === 'normal' 
        ? { type: 'shadow', borderRadius: 'medium' } 
        : undefined,
      headerStyle: 'simple',
      animation: 'fade',
    };

    // Update the event with new customization
    const { data, error } = await supabase
      .from('events')
      .update({ customization: eventCustomization })
      .eq('id', invitation.event_id)
      .select();

    if (error) {
      console.error('Error updating event customization:', error);
      return null;
    }

    // Return the saved customization
    return customization;
  } catch (error) {
    console.error('Error in saveInvitationCustomization:', error);
    return null;
  }
}

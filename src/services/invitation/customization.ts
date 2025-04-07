
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
 * Using direct query with error handling
 */
export const getInvitationCustomization = async (invitationId: string): Promise<InvitationCustomization | null> => {
  try {
    // First check if table exists in metadata
    const { data: tableData } = await supabase
      .from('_metadata')
      .select('*')
      .eq('table_name', 'invitation_customizations')
      .maybeSingle();

    // If table doesn't exist in metadata, fetch from event_invitations instead
    if (!tableData) {
      console.warn("invitation_customizations table doesn't exist yet");
      
      // Fetch from event_invitations as fallback
      const { data, error } = await supabase
        .from('event_invitations')
        .select('id, customization')
        .eq('id', invitationId)
        .maybeSingle();
      
      if (error || !data || !data.customization) {
        console.error('Error fetching customization:', error || 'No data found');
        return null;
      }
      
      return data.customization as InvitationCustomization;
    }
    
    // If table exists, try direct query
    const { data, error } = await supabase
      .from('invitation_customizations')
      .select('customization')
      .eq('invitation_id', invitationId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching invitation customization:', error);
      return null;
    }
    
    return data?.customization as InvitationCustomization;
  } catch (error) {
    console.error('Error in getInvitationCustomization:', error);
    return null;
  }
};

/**
 * Save invitation customization using direct query with fallback
 */
export const saveInvitationCustomization = async (invitationId: string, customization: InvitationCustomization): Promise<InvitationCustomization | null> => {
  try {
    // Convert InvitationCustomization to EventCustomization for proper processing
    const eventCustomization = convertToEventCustomization(customization);
    
    // Then convert EventCustomization to a safe JSON format
    const safeCustomization = convertEventCustomization(eventCustomization);
    
    // First check if table exists
    const { data: tableExists } = await supabase
      .from('_metadata')
      .select('id')
      .eq('table_name', 'invitation_customizations')
      .maybeSingle();
    
    // If table doesn't exist, store in event_invitations instead
    if (!tableExists) {
      console.log('Table invitation_customizations does not exist, using fallback storage');
      
      const { error: updateError } = await supabase
        .from('event_invitations')
        .update({ 
          customization: safeCustomization
        })
        .eq('id', invitationId);
        
      if (updateError) {
        console.error('Error saving customization to event_invitations:', updateError);
        return null;
      }
    } else {
      // Table exists, we can insert/update directly
      const { error: upsertError } = await supabase
        .from('invitation_customizations')
        .upsert({
          invitation_id: invitationId,
          customization: safeCustomization,
          updated_at: new Date().toISOString()
        }, { onConflict: 'invitation_id' });
      
      if (upsertError) {
        console.error('Error upserting invitation customization:', upsertError);
        return null;
      }
    }
    
    return customization;
  } catch (error) {
    console.error('Error in saveInvitationCustomization:', error);
    return null;
  }
};

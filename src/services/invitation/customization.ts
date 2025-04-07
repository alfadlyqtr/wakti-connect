
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
    // Check if the table exists first using metadata query
    const { data: tableData } = await supabase
      .from('_metadata')
      .select('*')
      .eq('table_name', 'invitation_customizations')
      .maybeSingle();

    // If table doesn't exist in metadata, return null
    if (!tableData) {
      console.warn("invitation_customizations table doesn't exist yet");
      return null;
    }

    // Custom query with proper error handling
    const { data, error } = await supabase.rpc('select_from_invitation_customizations', {
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
 * Save invitation customization using direct query with fallback
 */
export const saveInvitationCustomization = async (invitationId: string, customization: InvitationCustomization): Promise<InvitationCustomization | null> => {
  try {
    // Convert InvitationCustomization to EventCustomization for proper processing
    const eventCustomization = convertToEventCustomization(customization);
    
    // Then convert EventCustomization to a safe JSON format
    const safeCustomization = convertEventCustomization(eventCustomization);
    
    // Try to use RPC function if available
    const { data, error: rpcError } = await supabase.rpc('upsert_invitation_customization', {
      invitation_id_param: invitationId,
      customization_param: safeCustomization
    });

    // If RPC failed, fallback to manual check and insert/update
    if (rpcError) {
      console.warn('RPC function failed, using fallback method:', rpcError.message);
      
      // Check if table exists
      const { data: tableExists } = await supabase
        .from('_metadata')
        .select('id')
        .eq('table_name', 'invitation_customizations')
        .maybeSingle();
      
      // If table doesn't exist, we need to create it first
      if (!tableExists) {
        console.log('Creating invitation_customizations table');
        // We'll store customization in the event_invitations table instead
        // as a temporary solution
        
        const { error: updateError } = await supabase
          .from('event_invitations')
          .update({ 
            metadata: { customization: safeCustomization } 
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
    }
    
    return customization;
  } catch (error) {
    console.error('Error in saveInvitationCustomization:', error);
    return null;
  }
};
